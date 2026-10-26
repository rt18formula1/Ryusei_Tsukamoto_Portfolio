import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getEnvVar(key: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env && ctx.env[key]) {
      return String(ctx.env[key]).trim();
    }
  } catch {}
  return (process.env[key] || "").trim();
}

export function normalizeR2PublicUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return "";
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`;
  }
  if (!url.includes(".r2.dev") && !url.includes(".")) {
    url = `${url}.r2.dev`;
  }
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
  r2Bucket?: any;
};

export function getR2Config(): R2Config {
  const accountId = getEnvVar("R2_ACCOUNT_ID");
  const accessKeyId = getEnvVar("R2_ACCESS_KEY_ID");
  const secretAccessKey = getEnvVar("R2_SECRET_ACCESS_KEY");
  const bucketName = getEnvVar("R2_BUCKET_NAME");
  const publicUrl = normalizeR2PublicUrl(getEnvVar("R2_PUBLIC_URL"));

  let r2Bucket: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    const env = ctx?.env as Record<string, any> | undefined;
    if (env) {
      if (bucketName && env[bucketName] && typeof env[bucketName].put === "function") {
        r2Bucket = env[bucketName];
      } else if (env.R2_BUCKET && typeof env.R2_BUCKET.put === "function") {
        r2Bucket = env.R2_BUCKET;
      } else if (env.BUCKET && typeof env.BUCKET.put === "function") {
        r2Bucket = env.BUCKET;
      }
    }
  } catch {}

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
    r2Bucket,
  };
}

function getR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function assertR2Config(config: R2Config) {
  if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
    throw new Error("R2 environment variables (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME) are not fully configured.");
  }
  if (!config.publicUrl) {
    throw new Error(
      "R2_PUBLIC_URL is not set. Set it to your R2 bucket's public URL " +
      "(e.g. https://pub-xxxx.r2.dev). " +
      "Find the correct URL in Cloudflare Dashboard > R2 > your bucket > Settings > Public access."
    );
  }
}

export async function getPresignedUrl(key: string, contentType: string) {
  const config = getR2Config();
  assertR2Config(config);

  const client = getR2Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
  });

  // 署名付きURLを生成（有効期限を15分に延長）
  const url = await getSignedUrl(client, command, { expiresIn: 900 });
  const publicUrl = `${config.publicUrl}/${key}`;

  return { uploadUrl: url, publicUrl };
}

export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
  const config = getR2Config();

  // If Cloudflare Worker has native R2 binding, use it directly
  if (config.r2Bucket) {
    await config.r2Bucket.put(key, body, {
      httpMetadata: { contentType },
    });
    if (config.publicUrl) {
      return `${config.publicUrl}/${key}`;
    }
  }

  // Fallback to S3 API
  assertR2Config(config);
  const client = getR2Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
    Body: body,
  });
  await client.send(command);
  return `${config.publicUrl}/${key}`;
}

export function buildR2ObjectKey(folder: string, originalFileName: string) {
  const ext = originalFileName.includes(".") ? originalFileName.split(".").pop() : "bin";
  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "uploads";
  return `${normalizedFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt || "bin"}`;
}

