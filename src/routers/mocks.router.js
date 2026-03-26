import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mocking.utils.js';
import { userModel } from '../models/user.js';
import { petModel } from '../models/pet.js';

const router = Router();

// Endpoint para ver qué pets hay (Mocking simple)
router.get('/mockingpets', (req, res) => {
    const pets = generateMockPets(10);
    res.send({ status: "success", payload: pets });
});

// Endpoint para ver qué users hay (Mocking simple)
router.get('/mockingusers', async (req, res) => {
    const users = await generateMockUsers(50);
    res.send({ status: "success", payload: users });
});

// EL CORE DE LA CORRECCIÓN: generateData
router.post('/generateData', async (req, res) => {
    try {
        // 1. Extrae parámetros y asegura que sean números
        const usersCount = parseInt(req.body.users);
        const petsCount = parseInt(req.body.pets);

        // 2. MANEJO DE ERRORES: Si no se pasan los parámetros o son inválidos
        if (isNaN(usersCount) || isNaN(petsCount)) {
            return res.status(400).send({ 
                status: "error", 
                message: "Faltan parámetros: 'users' y 'pets' deben ser números válidos en el body." 
            });
        }

        // 3. Generación de datos
        const users = await generateMockUsers(usersCount);
        const pets = generateMockPets(petsCount);

        // 4. Inserción en la base de datos
        // Usamos Promise.all para que sea más rápido
        const [usersInserted, petsInserted] = await Promise.all([
            userModel.insertMany(users),
            petModel.insertMany(pets)
        ]);

        // 5. Respuesta exitosa detallada
        res.send({
            status: "success",
            message: "Datos generados e insertados con éxito",
            payload: {
                usersInserted: usersInserted.length,
                petsInserted: petsInserted.length
            }
        });

    } catch (error) {
        // Captura cualquier fallo (DB, Faker, etc.)
        res.status(500).send({ 
            status: "error", 
            message: "Error al generar o insertar datos: " + error.message 
        });
    }
});

export default router;