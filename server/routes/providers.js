import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getProviders,
  getProviderById,
  createProviderProfile,
  updateProviderProfile,
  uploadPortfolioImages
} from '../controllers/providerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireProvider } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/', getProviders);
router.get('/:id', getProviderById);

// Protected routes (any registered user can create a profile)
router.post('/profile', protect, createProviderProfile);

// Provider only routes (user must have a provider profile)
router.put('/profile', protect, requireProvider, updateProviderProfile);
router.post('/portfolio', protect, requireProvider, upload.array('portfolioImages', 10), uploadPortfolioImages);

export default router;
