import { userModel } from '../models/user.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
    // Aquí iría la lógica de negocio: hashear password si no viene hasheada
    if (userData.password && !userData.password.startsWith('$2b$')) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await userModel.create(userData);
};

export const getAllUsers = async () => {
    return await userModel.find();
};