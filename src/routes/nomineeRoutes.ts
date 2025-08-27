import express from 'express';
import {
    getNominees,
    createNominee,
    deleteNominee,
    deletePhoto,
} from '../controllers/nomineeController';
import { upload } from '../config/cloudinary';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getNominees)
    .post(upload.single('image'), createNominee);

router.route('/:id')
    .delete(protect, deleteNominee);

router.route('/:id/photos/:photo_id')
    .delete(protect, deletePhoto);

export default router;
