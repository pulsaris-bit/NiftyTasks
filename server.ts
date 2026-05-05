import express from 'express';
import { createServer as createViteServer } from 'vite';
import sqlite3 from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = sqlite3('niftytasks.db');

// Initialize Database structure
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    user_email TEXT,
    FOREIGN KEY(user_email) REFERENCES users(email)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    completed BOOLEAN,
    priority TEXT,
    category TEXT,
    createdAt TEXT,
    dueDate TEXT,
    reminderDate TEXT,
    user_email TEXT,
    FOREIGN KEY(user_email) REFERENCES users(email)
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    user_email TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'orange',
    notificationsEnabled BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_email) REFERENCES users(email)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Basic mock auth, in real app use password hashing
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      // Auto-create user for demo purposes if it doesn't exist
      db.prepare('INSERT INTO users (email, name, password) VALUES (?, ?, ?)').run(email, email.split('@')[0], password);
      user = { email, name: email.split('@')[0] };
      
      // Default projects
      const defaultProjects = ['Persoonlijk', 'Werk', 'Gezondheid'];
      for (const p of defaultProjects) {
        db.prepare('INSERT OR IGNORE INTO projects (name, user_email) VALUES (?, ?)').run(p, email);
      }

      // Default setting
      db.prepare('INSERT OR IGNORE INTO user_settings (user_email) VALUES (?)').run(email);
    }
    
    res.json({ email: user.email, name: user.name });
  });

  // Tasks
  app.get('/api/tasks', (req, res) => {
    const email = req.query.email as string;
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_email = ?').all(email);
    res.json(tasks.map((t: any) => ({
      ...t,
      completed: !!t.completed,
      createdAt: new Date(t.createdAt),
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      reminderDate: t.reminderDate ? new Date(t.reminderDate) : undefined
    })));
  });

  app.post('/api/tasks', (req, res) => {
    const { task, email } = req.body;
    db.prepare(`
      INSERT INTO tasks (id, title, description, completed, priority, category, createdAt, dueDate, reminderDate, user_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      task.id, 
      task.title, 
      task.description || '', 
      task.completed ? 1 : 0, 
      task.priority, 
      task.category, 
      new Date(task.createdAt).toISOString(),
      task.dueDate ? new Date(task.dueDate).toISOString() : null,
      task.reminderDate ? new Date(task.reminderDate).toISOString() : null,
      email
    );
    res.sendStatus(201);
  });

  app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, completed = ?, priority = ?, category = ?, dueDate = ?, reminderDate = ?
      WHERE id = ?
    `).run(
      task.title,
      task.description || '',
      task.completed ? 1 : 0,
      task.priority,
      task.category,
      task.dueDate ? new Date(task.dueDate).toISOString() : null,
      task.reminderDate ? new Date(task.reminderDate).toISOString() : null,
      id
    );
    res.sendStatus(200);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.sendStatus(200);
  });

  // Projects
  app.get('/api/projects', (req, res) => {
    const email = req.query.email as string;
    const projects = db.prepare('SELECT name FROM projects WHERE user_email = ?').all(email);
    res.json(projects.map((p: any) => p.name));
  });

  app.post('/api/projects', (req, res) => {
    const { name, email } = req.body;
    db.prepare('INSERT OR IGNORE INTO projects (name, user_email) VALUES (?, ?)').run(name, email);
    res.sendStatus(201);
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    const email = req.query.email as string;
    const settings = db.prepare('SELECT * FROM user_settings WHERE user_email = ?').get(email) as any;
    res.json({
      theme: settings?.theme || 'orange',
      notificationsEnabled: !!settings?.notificationsEnabled
    });
  });

  app.put('/api/settings', (req, res) => {
    const { email, theme, notificationsEnabled } = req.body;
    db.prepare('UPDATE user_settings SET theme = ?, notificationsEnabled = ? WHERE user_email = ?')
      .run(theme, notificationsEnabled ? 1 : 0, email);
    res.sendStatus(200);
  });

  // --- Serve Frontend ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
