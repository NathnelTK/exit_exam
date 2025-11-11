const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + (file.originalname || 'upload'));
  }
});
const upload = multer({ storage });

const router = express.Router();

// In-memory index (replace with DB table in production)
const indexFile = path.join(uploadsDir, 'index.json');
const readIndex = () => {
  try { return JSON.parse(fs.readFileSync(indexFile, 'utf-8')); } catch { return []; }
};
const writeIndex = (items) => fs.writeFileSync(indexFile, JSON.stringify(items, null, 2));

router.get('/', authenticate, (req, res) => {
  const all = readIndex().filter(i => i.userId === req.userId);
  res.json(all.map(i => ({ _id: i.id, ...i })));
});

router.post('/', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const all = readIndex();
    const item = {
      id: Date.now(),
      userId: req.userId,
      path: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };
    all.push(item);
    writeIndex(all);
    res.status(201).json({ _id: item.id, ...item });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

