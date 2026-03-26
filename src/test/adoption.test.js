import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

describe('Tests Funcionales - Router de Adopciones', () => {
    
    // Test 1: Obtener lista
    it('GET /api/adoptions debe retornar status 200 y un array en payload', async () => {
        const { status, body } = await requester.get('/api/adoptions');
        expect(status).to.equal(200);
        expect(body.payload).to.be.an('array');
    });

    // Test 2: Error si el usuario o mascota no existen (ID con formato válido pero inexistente)
    it('POST /api/adoptions/:uid/:pid debe retornar 404 si el usuario o mascota no existen', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const fakePetId = new mongoose.Types.ObjectId();
        
        const { status, body } = await requester.post(`/api/adoptions/${fakeUserId}/${fakePetId}`);
        
        expect(status).to.equal(404);
        expect(body).to.have.property('error');
    });

    // Test 3: Flujo completo de adopción (Requiere data real en la DB)
    it('POST /api/adoptions/:uid/:pid debe realizar una adopción exitosa', async () => {
        // 1. Necesitamos un usuario y una mascota real. 
        // Usamos los endpoints de creación para asegurar que existan datos.
        const userMock = { first_name: "Test", last_name: "User", email: `test${Date.now()}@test.com`, password: "123" };
        const petMock = { name: "Firulais", type: "dog" };

        const { body: userRes } = await requester.post('/api/users').send(userMock);
        const { body: petRes } = await requester.post('/api/pets').send(petMock);

        const uid = userRes.payload._id;
        const pid = petRes.payload._id;

        // 2. Ejecutar la adopción
        const { status, body } = await requester.post(`/api/adoptions/${uid}/${pid}`);

        expect(status).to.equal(200);
        expect(body.message).to.be.equal("Adopción exitosa");
        expect(body.payload).to.have.property('_id');
        expect(body.payload.owner).to.equal(uid);
        expect(body.payload.pet).to.equal(pid);
    });

    // Test 4: Error si la mascota ya está adoptada
    it('POST /api/adoptions/:uid/:pid debe fallar si la mascota ya fue adoptada', async () => {
        // Usamos los mismos IDs del test anterior (que ya están marcados como adoptados)
        // O se crean nuevos rápidamente:
        const { body: userRes } = await requester.post('/api/users').send({ first_name: "A", last_name: "B", email: `a${Date.now()}@a.com`, password: "1" });
        const { body: petRes } = await requester.post('/api/pets').send({ name: "Adoptado", type: "cat" });
        
        const uid = userRes.payload._id;
        const pid = petRes.payload._id;

        // Primera adopción (Éxito)
        await requester.post(`/api/adoptions/${uid}/${pid}`);

        // Segunda adopción (Falla)
        const { status, body } = await requester.post(`/api/adoptions/${uid}/${pid}`);

        expect(status).to.equal(400);
        expect(body.error).to.be.equal("Pet is already adopted");
    });
});