import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importación de Routers
import mocksRouter from './routers/mocks.router.js';
import usersRouter from './routers/users.router.js';
import petsRouter from './routers/pets.router.js';
import adoptionRouter from './routers/adoption.router.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del Proyecto Final',
            description: 'API para gestión de usuarios, mascotas y adopciones'
        }
    },
    apis: [`./src/docs/**/*.yaml`] // Aquí vivirán tus archivos de documentación
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Middlewares
app.use(express.json());

// Conexión a Base de Datos
mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Conectado a MongoDB exitosamente"))
    .catch(err => console.error("❌ Error al conectar:", err));

// Definición de Rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Router de Adopciones 
app.use('/api/adoptions', adoptionRouter);