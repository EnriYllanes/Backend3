import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mocking.utils.js';
import { userModel } from '../models/user.js';
import { petModel } from '../models/pet.js';

const router = Router();

// 1. GET /api/mocks/mockingpets
router.get('/mockingpets', async (req, res) => {
    try {
        const pets = generateMockPets(10); // Genera 10 mascotas fijas
        res.send({ status: "success", payload: pets });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// 2. GET /api/mocks/mockingusers
router.get('/mockingusers', async (req, res) => {
    try {
        const users = await generateMockUsers(50); // Genera 50 usuarios
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// 3. POST /api/mocks/generateData
router.post('/generateData', async (req, res) => {
    const { users = 0, pets = 0 } = req.body || {};
    try {
        const mockUsers = await generateMockUsers(users);
        const mockPets = generateMockPets(pets);

        await userModel.insertMany(mockUsers);
        await petModel.insertMany(mockPets);

        res.send({ 
            status: "success", 
            message: `Insertados ${users} usuarios y ${pets} mascotas.` 
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;