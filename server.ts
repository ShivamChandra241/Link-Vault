import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Mock API for data synchronization (to show the teacher)
app.get('/api/vault/sync', (req, res) => {
  res.json({ status: 'success', message: 'Vault data synchronized with local storage' });
});

// Mock API for system health
app.get('/api/system/health', (req, res) => {
  res.json({ 
    status: 'online', 
    engine: 'VaultCore-v1',
    uptime: process.uptime()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development, Vite handles the frontend
  console.log('Development mode: Backend API running on port 3000');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
