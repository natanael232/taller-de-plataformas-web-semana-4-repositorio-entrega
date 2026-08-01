const express = require('express');
const router = express.Router();

const authController = require('../controles/controllers');
const VerificarToken = require('../middlewares/middlewares');

router.post('/login', authController.login);
router.get('/perfil',authController.getPerfil);
router.post('/logout',authController.logout);


module.exports = router;