-- Add discipline_id column to dev_projects table
ALTER TABLE dev_projects 
ADD COLUMN discipline_id TEXT NOT NULL DEFAULT 'developer';

-- Add index for faster filtering
CREATE INDEX idx_dev_projects_discipline_id ON dev_projects(discipline_id);

-- Add check constraint to ensure valid discipline values
ALTER TABLE dev_projects 
ADD CONSTRAINT check_discipline_id 
CHECK (discipline_id IN ('developer', 'illustrator', 'musician', 'blogger', 'investor'));
