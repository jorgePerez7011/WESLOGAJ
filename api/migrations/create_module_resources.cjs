const db = require('../db.js');

async function createModuleResourcesTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS module_resources (
        id SERIAL PRIMARY KEY,
        module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
        resource_type VARCHAR(50) NOT NULL, -- 'document', 'video-url', 'video-file', 'link'
        title VARCHAR(255),
        description TEXT,
        url TEXT,
        file_path TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('module_resources table created successfully');
  } catch (error) {
    console.error('Error creating module_resources table:', error);
    throw error;
  }
}

createModuleResourcesTable().catch(console.error);
