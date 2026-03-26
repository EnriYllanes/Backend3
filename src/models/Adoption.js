import mongoose from 'mongoose';

const adoptionCollection = 'Adoptions';

const adoptionSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }
});

export const adoptionModel = mongoose.model(adoptionCollection, adoptionSchema);