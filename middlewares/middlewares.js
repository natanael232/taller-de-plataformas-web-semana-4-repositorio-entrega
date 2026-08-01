//Requerir la librería para validar tokens JWT
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
//Extraer la cookie enviada desde Postman/Navegador
  const token = req.cookies.token;

  //Si no hay cookie, rechazar la petición de inmediato
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    //Verificar el token usando la clave secreta declarada en el entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_fallback');

    //Guardar la información desencriptada del usuario en req.user
    req.user = decoded;

    //Invocar next() para permitir el paso a la siguiente función/controlador
    next();
  } catch (error) {
    //Capturar el error si el token expiró o es inválido
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

//Exportar el middleware para usarlo en el archivo de rutas
module.exports = verificarToken;