import { Router } from 'express';
import { adoptionModel } from '../models/Adoption.js';
import { userModel } from '../models/user.js';
import { petModel } from '../models/pet.js';

const router = Router();

router.get('/', async (req, res) => {
    const adoptions = await adoptionModel.find().populate('owner pet');
    res.send({ status: "success", payload: adoptions });
});

router.post('/:uid/:pid', async (req, res) => {
    const { uid, pid } = req.params;
    try {
        const user = await userModel.findById(uid);
        const pet = await petModel.findById(pid);

        if (!user || !pet) return res.status(404).send({ status: "error", error: "User or Pet not found" });
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });

        // Lógica de adopción
        user.pets.push({ pet: pet._id });
        pet.adopted = true;
        pet.owner = user._id;

        await user.save();
        await pet.save();
        const result = await adoptionModel.create({ owner: user._id, pet: pet._id });

        res.send({ status: "success", message: "Adopción exitosa", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;