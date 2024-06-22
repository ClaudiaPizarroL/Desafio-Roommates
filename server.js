const express = require('express');
const fs = require('fs');
const roommateController = require('./controllers/roommateController');
const gastoController = require('./controllers/gastoController');

const app = express();
const PORT = process.env.PORT || 3000;
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  // Devolver el documento HTML disponible en el apoyo
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo HTML:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.send(data);
  });
});

// Ruta para agregar un nuevo roommate
app.post('/roommates', async (req, res) => {
  try {
    const newRoommate = await getRandomUser(); // Obtener un nuevo roommate aleatorio
    const roommates = JSON.parse(fs.readFileSync('data/roommates.json', 'utf8')); // Leer roommates actuales
    roommates.push(newRoommate); // Agregar el nuevo roommate
    fs.writeFileSync('data/roommates.json', JSON.stringify(roommates, null, 2)); // Escribir los roommates actualizados en el archivo
    res.status(201).send('Roommate agregado correctamente'); // Enviar respuesta de éxito
  } catch (error) {
    console.error('Error al agregar un nuevo roommate:', error);
    res.status(500).send('Error interno del servidor al agregar roommate');
  }
});

// Ruta para obtener todos los roommates
app.get('/roommates', async (req, res) => {
  try {
    const roommates = await getRandomUser ();
    roommates.roommates.forEach(roommate => {
      roommate.debe = Math.round(roommate.debe);
      roommate.recibe = Math.round(roommate.recibe);
      roommate.total = Math.round(roommate.total);
  });
    res.status(200).json({ roommates }); // Enviar los roommates como respuesta
  } catch (error) {
    console.error('Error al obtener todos los roommates:', error);
    res.status(500).send('Error interno del servidor al obtener roommates');
  }
});

// Ruta para obtener todos los gastos
app.get('/gastos', (req, res) => {
  try {
    const gastos = JSON.parse(fs.readFileSync('data/gastos.json', 'utf8')); // Leer gastos del archivo
    res.status(200).json({ gastos }); // Enviar los gastos como respuesta
  } catch (error) {
    console.error('Error al obtener todos los gastos:', error);
    res.status(500).send('Error interno del servidor al obtener gastos');
  }
});

// Ruta para agregar un nuevo gasto
app.post('/gasto', (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body; // Obtener datos del nuevo gasto desde el cuerpo de la solicitud
    const gastos = JSON.parse(fs.readFileSync('data/gastos.json', 'utf8')); // Leer gastos actuales del archivo
    gastos.push({ id: uuidv4(), roommate, descripcion, monto }); // Agregar el nuevo gasto
    fs.writeFileSync('data/gastos.json', JSON.stringify(gastos, null, 2)); // Escribir los gastos actualizados en el archivo
    res.status(201).send('Gasto agregado correctamente'); // Enviar respuesta de éxito
  } catch (error) {
    console.error('Error al agregar un nuevo gasto:', error);
    res.status(500).send('Error interno del servidor al agregar gasto');
  }
});

// Ruta para actualizar un gasto
app.put('/gasto', (req, res) => {
  try {
    const { id, roommate, descripcion, monto } = req.body; // Obtener datos del gasto actualizado desde el cuerpo de la solicitud
    let gastos = JSON.parse(fs.readFileSync('data/gastos.json', 'utf8')); // Leer gastos del archivo
    gastos = gastos.map((gasto) => {
      if (gasto.id === id) {
        return { id, roommate, descripcion, monto }; // Actualizar el gasto correspondiente al ID proporcionado
      }
      return gasto;
    });
    fs.writeFileSync('data/gastos.json', JSON.stringify(gastos, null, 2)); // Escribir los gastos actualizados en el archivo
    res.status(200).send('Gasto actualizado correctamente'); // Enviar respuesta de éxito
  } catch (error) {
    console.error('Error al actualizar un gasto:', error);
    res.status(500).send('Error interno del servidor al actualizar gasto');
  }
});

// Ruta para eliminar un gasto
app.delete('/gasto', (req, res) => {
  try {
    const { id } = req.query; // Obtener el ID del gasto a eliminar desde los parámetros de la consulta
    let gastos = JSON.parse(fs.readFileSync('data/gastos.json', 'utf8')); // Leer gastos del archivo
    gastos = gastos.filter((gasto) => gasto.id !== id); // Filtrar los gastos para eliminar el que coincide con el ID proporcionado
    fs.writeFileSync('data/gastos.json', JSON.stringify(gastos, null, 2)); // Escribir los gastos actualizados en el archivo
    res.status(200).send('Gasto eliminado correctamente'); // Enviar respuesta de éxito
  } catch (error) {
    console.error('Error al eliminar un gasto:', error);
    res.status(500).send('Error interno del servidor al eliminar gasto');
  }
});



