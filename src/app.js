import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mocksRouter from './routers/mocks.router.js';
import { userModel } from './models/user.js';
import { petModel } from './models/pet.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());

mongoose.connect(MONGO_URL)
    .then(() => console.log("Conectado a MongoDB exitosamente"))
    .catch(err => console.error("Error al conectar:", err));

app.use('/api/mocks', mocksRouter);

// Endpoints de comprobación
app.get('/api/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.get('/api/pets', async (req, res) => {
    try {
        const pets = await petModel.find();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));