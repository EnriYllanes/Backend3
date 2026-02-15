import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateMockUsers = async (num) => {
    const users = [];
    const hashedPassword = await bcrypt.hash('coder123', 10);

    for (let i = 0; i < num; i++) {
        users.push({
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: []
        });
    }
    return users;
};

export const generateMockPets = (num) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.dog(),
            type: faker.helpers.arrayElement(['dog', 'cat', 'bird']),
            adopted: false
        });
    }
    return pets;
};