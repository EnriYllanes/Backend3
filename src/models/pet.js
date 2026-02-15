import mongoose from 'mongoose';

const petCollection = 'Pets';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    adopted: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null }
});

export const petModel = mongoose.model(petCollection, petSchema);