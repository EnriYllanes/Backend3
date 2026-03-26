import { Router } from 'express';
import { petModel } from '../models/pet.js';

const router = Router();

// GET: Obtener todas las mascotas
router.get('/', async (req, res) => {
    try {
        const pets = await petModel.find();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// POST: Crear una mascota manualmente
router.post('/', async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).send({ status: "error", error: "Nombre y tipo son requeridos" });
    }

    try {
        const result = await petModel.create({ name, type });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;