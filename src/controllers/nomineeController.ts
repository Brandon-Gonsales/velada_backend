import { Request, Response } from 'express';
import Nominee from '../models/Nominee';
import { cloudinary } from '../config/cloudinary';

// @desc    Get all nominees
// @route   GET /api/nominees
// @access  Public
// FIX: Use express.Request and express.Response for correct typing.
export const getNominees = async (req: Request, res: Response) => {
    try {
        const nominees = await Nominee.find({}).sort({ createdAt: -1 });
        res.json(nominees);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a nominee or add a photo
// @route   POST /api/nominees
// @access  Public
// FIX: Use express.Request and express.Response for correct typing.
export const createNominee = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    try {
        let nominee = await Nominee.findOne({ name: new RegExp(`^${name}$`, 'i') });

        const newPhoto = {
            url: req.file.path,
            public_id: req.file.filename,
        };

        if (nominee) {
            // If nominee exists, add new photo
            nominee.photos.push(newPhoto);
            await nominee.save();
            res.status(200).json({ message: 'Photo added successfully', nominee });
        } else {
            // If nominee doesn't exist, create new one
            const newNominee = new Nominee({
                name,
                photos: [newPhoto],
            });
            await newNominee.save();
            res.status(201).json(newNominee);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a nominee
// @route   DELETE /api/nominees/:id
// @access  Private/Admin
// FIX: Use express.Request and express.Response for correct typing.
export const deleteNominee = async (req: Request, res: Response) => {
    try {
        const nominee = await Nominee.findById(req.params.id);
        if (nominee) {
            // Delete images from Cloudinary
            const publicIds = nominee.photos.map(p => p.public_id);
            if (publicIds.length > 0) {
                 await cloudinary.api.delete_resources(publicIds);
            }
            await nominee.deleteOne();
            res.json({ message: 'Nominee removed' });
        } else {
            res.status(404).json({ message: 'Nominee not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a photo from a nominee
// @route   DELETE /api/nominees/:id/photos/:photo_id
// @access  Private/Admin
// FIX: Use express.Request and express.Response for correct typing.
export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const nominee = await Nominee.findById(req.params.id);
        if (nominee) {
            const photo = nominee.photos.find(p => p._id.toString() === req.params.photo_id);
            if(photo) {
                // Delete from Cloudinary
                await cloudinary.uploader.destroy(photo.public_id);
                // Remove from DB using Mongoose's .pull() method
                nominee.photos.pull({ _id: req.params.photo_id });
                await nominee.save();
                res.json(nominee);
            } else {
                 res.status(404).json({ message: 'Photo not found' });
            }
        } else {
            res.status(404).json({ message: 'Nominee not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};