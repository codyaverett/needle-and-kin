import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Create or open database
const dbPath = join(__dirname, '../../.data/needle-and-kin.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database with schema
export function initializeDatabase() {
  const schemaPath = join(__dirname, 'schema.sql')
  const schema = readFileSync(schemaPath, 'utf8')
  
  // Split and execute SQL statements
  const statements = schema
    .split(';')
    .filter(stmt => stmt.trim())
    .map(stmt => `${stmt.trim()  };`)
  
  for (const statement of statements) {
    try {
      db.exec(statement)
    } catch (error) {
      console.error('Error executing statement:', statement)
      console.error(error)
    }
  }
  
  console.log('Database initialized successfully')
}

// Initialize on first import
initializeDatabase()

// Prepared statements for better performance
const statements = {
  // User queries
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  createUser: db.prepare(`
    INSERT INTO users (id, email, username, password, first_name, last_name, role, avatar, bio, must_change_password, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateUser: db.prepare(`
    UPDATE users 
    SET first_name = ?, last_name = ?, username = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  updatePassword: db.prepare(`
    UPDATE users 
    SET password = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  updateLastLogin: db.prepare(`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
  `),
  listUsers: db.prepare(`
    SELECT id, email, username, first_name, last_name, role, avatar, bio, 
           joined_at, is_active, email_verified, last_login
    FROM users
    ORDER BY joined_at DESC
  `),
  
  // Post queries
  getPost: db.prepare('SELECT * FROM posts WHERE id = ?'),
  getPostBySlug: db.prepare('SELECT * FROM posts WHERE slug = ?'),
  listPosts: db.prepare(`
    SELECT p.*, u.first_name, u.last_name, u.username, u.avatar
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.published = 1
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `),
  listPostsByCategory: db.prepare(`
    SELECT p.*, u.first_name, u.last_name, u.username, u.avatar
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.published = 1 AND p.category = ?
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `),
  createPost: db.prepare(`
    INSERT INTO posts (slug, title, excerpt, content, image, category, difficulty, 
                       published_at, read_time, author_id, featured, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updatePost: db.prepare(`
    UPDATE posts 
    SET title = ?, excerpt = ?, content = ?, image = ?, category = ?, 
        difficulty = ?, read_time = ?, featured = ?, published = ?, 
        published_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  deletePost: db.prepare('DELETE FROM posts WHERE id = ?'),
  incrementViews: db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?'),
  
  // Tag queries
  getTag: db.prepare('SELECT * FROM tags WHERE id = ?'),
  getTagByName: db.prepare('SELECT * FROM tags WHERE name = ?'),
  createTag: db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)'),
  getPostTags: db.prepare(`
    SELECT t.* FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `),
  addPostTag: db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)'),
  removePostTags: db.prepare('DELETE FROM post_tags WHERE post_id = ?'),
  
  // Comment queries
  getComments: db.prepare(`
    SELECT c.*, u.first_name, u.last_name, u.username, u.avatar
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ? AND c.approved = 1
    ORDER BY c.created_at ASC
  `),
  createComment: db.prepare(`
    INSERT INTO comments (post_id, user_id, parent_id, content, approved)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  // Session queries
  createSession: db.prepare(`
    INSERT INTO sessions (id, user_id, token, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  getSession: db.prepare('SELECT * FROM sessions WHERE id = ?'),
  deleteSession: db.prepare('DELETE FROM sessions WHERE id = ?'),
  deleteUserSessions: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
  cleanupSessions: db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP'),
  
  // Favorites queries
  addFavorite: db.prepare('INSERT OR IGNORE INTO user_favorites (user_id, post_id) VALUES (?, ?)'),
  removeFavorite: db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND post_id = ?'),
  getUserFavorites: db.prepare('SELECT post_id FROM user_favorites WHERE user_id = ?'),
  isFavorite: db.prepare('SELECT 1 FROM user_favorites WHERE user_id = ? AND post_id = ?'),
  
  // Site content queries
  getSiteContent: db.prepare('SELECT * FROM site_content WHERE section = ?'),
  updateSiteContent: db.prepare(`
    INSERT OR REPLACE INTO site_content (id, section, content, updated_by)
    VALUES (?, ?, ?, ?)
  `),
  
  // Stats queries
  countUsers: db.prepare('SELECT COUNT(*) as count FROM users'),
  countPosts: db.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 1'),
  sumViews: db.prepare('SELECT SUM(views) as total FROM posts'),
  countComments: db.prepare('SELECT COUNT(*) as count FROM comments'),
}

// Export database and statements
export { db, statements }