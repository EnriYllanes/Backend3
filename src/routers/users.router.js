import { Router } from 'express';
import { userModel } from '../models/user.js';
import bcrypt from 'bcrypt';

const router = Router();

// GET: Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// POST: Crear un usuario (Lógica de creación del módulo)
router.post('/', async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    // Validación de campos obligatorios
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({ status: "error", error: "Faltan datos obligatorios" });
    }

    try {
        // Lógica de Negocio: Hashear password antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: role || 'user'
        };

        const result = await userModel.create(newUser);
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ status: "error", message: "El email ya está registrado" });
        }
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;