const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

mongoose.connect('mongodb+srv://photouser:Alenkrish1234@cluster0.lgfk0wk.mongodb.net/photoGalleryDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection error:', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const Photo = require('./models/Photo');

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const newPhoto = new Photo({
      filename: req.file.filename,
      path: req.file.path
    });
    await newPhoto.save();
    res.json({ message: 'Photo uploaded successfully', photo: newPhoto });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save photo info', error: err.message });
  }
});

app.get('/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadedAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load photos', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
