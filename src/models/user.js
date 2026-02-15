import mongoose from 'mongoose';

const userCollection = 'Users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    pets: {
        type: [
            {
                pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }
            }
        ],
        default: []
    }
});

export const userModel = mongoose.model(userCollection, userSchema);