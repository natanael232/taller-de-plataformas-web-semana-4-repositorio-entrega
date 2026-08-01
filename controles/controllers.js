//Requerir la librería jsonwebtoken para generar y firmar el token
const jwt = require('jsonwebtoken');

//usuarios ficticios
const usuarios = [
  { id: 1, usuario: 'admin', password: '1234password' },
  { id: 2, usuario: 'estudiante', password: '4321password' }
];
//CONTROLADOR DE LOGIN

exports.login = (req, res) => {
  //Recibir usuario y contraseña desde el cuerpo de la petición (req.body)
  const { usuario, password } = req.body;

  //Buscar si el usuario existe y coincide la contraseña
  const user = usuarios.find(u => u.usuario === usuario && u.password === password);

  //Si las credenciales fallan, responder HTTP 401
  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas. No autorizado." });
  }

  //Generar el Token con jwt.sign y usar la clave secreta del .env
  const token = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET || 'secreto_fallback',
    { expiresIn: '1h' }
  );

  //Enviar el token dentro de una cookie HTTP-Only para mayor seguridad
  res.cookie('token', token, { httpOnly: true, secure: false });

  //Confirmar la respuesta exitosa en JSON para Postman
  return res.json({ 
    message: "Inicio de sesión exitoso.", 
    user: { id: user.id, usuario: user.usuario } 
  });
};

// 2. CONTROLADOR DE PERFIL (GET /perfil)

exports.getPerfil = (req, res) => {
  //Responder con la información del usuario validada por el middleware
  res.json({ 
    message: "Acceso concedido a la ruta privada", 
    user: req.user 
  });
};

// 3. CONTROLADOR DE LOGOUT (POST /logout)

exports.logout = (req, res) => {
  // [DEL PDF]: Destruir o limpiar la cookie que contenía el token
  res.clearCookie('token');

  //Responder con confirmación de cierre de sesión
  res.json({ message: "Sesión cerrada correctamente y token eliminado." });
};
