import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
});

const nomineeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    photos: [photoSchema],
}, {
    timestamps: true,
});

const Nominee = mongoose.model('Nominee', nomineeSchema);

export default Nominee;
