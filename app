//Cargar variables de entorno (.env) al inicio
require('dotenv').config();

//Importar frameworks y librerías de seguridad
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');           //Para permitir peticiones entre dominios
const helmet = require('helmet');       //Headers de seguridad

//Importar el módulo de rutas
const authRoutes = require('./rutas/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES DE CONFIGURACIÓN Y SEGURIDAD
app.use(helmet());                      //Headers de seguridad
app.use(cors());                        //Habilitar CORS
app.use(express.json());                //Procesar JSON en req.body
app.use(cookieParser());                //Leer cookies en req.cookies

//Cargar Swagger para la documentación visual interactiva
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//Configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticación JWT',
      version: '1.0.0',
      description: 'Documentación de la API de prueba para el ramo',
    },
  },
  apis: ['./rutas/*.js'], // Lee las rutas
};

const specs = swaggerJsdoc(swaggerOptions);

//Ruta donde se servirá la documentación visual
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//RUTAS DE LA APLICACIÓN
app.use('/api', authRoutes);        //Express Router bajo el prefijo /api

// MANEJO DE ERRORES CENTRALIZADO
//Middleware especial de 4 parámetros para capturar errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose correctamente en http://localhost:${PORT}`);
});

