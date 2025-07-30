const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: 'https://xtremefront.onrender.com' // Cambia si tu dominio frontend es diferente
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'Xtreme')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Xtreme', 'principal.html'));
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'brayanryv2003@gmail.com',
    pass: 'suyg rjdy fndx pluc'
  }
});

app.post('/submit', (req, res) => {
  const { nombre, apellido, email, phone, pais, estado, compania, descripcion } = req.body;

  if (!nombre || !apellido || !email || !descripcion) {
    return res.status(400).send('Faltan datos obligatorios en el formulario.');
  }

  const phoneText = phone ? `Teléfono: ${phone}` : 'Teléfono no proporcionado';
  const paisText = pais ? `País: ${pais}` : 'País no especificado';
  const estadoText = estado ? `Estado: ${estado}` : 'Estado no especificado';
  const companiaText = compania ? `Compañía: ${compania}` : 'Compañía no especificada';

  const mailOptions = {
    from: email,
    to: 'brayanryv2003@gmail.com',
    subject: 'Nuevo mensaje desde el formulario de contacto',
    text: `Nombre: ${nombre} ${apellido}
Correo: ${email}
${phoneText}
${paisText}
${estadoText}
${companiaText}
Descripción de la solicitud: ${descripcion}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Hubo un error al enviar el mensaje.');
    } else {
      console.log('Correo enviado: ' + info.response);
      res.send('Mensaje enviado con éxito');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
