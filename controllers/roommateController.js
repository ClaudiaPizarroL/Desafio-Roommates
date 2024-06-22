const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Función para obtener datos de un nuevo roommate desde randomuser.me
async function getRandomUser() {
  try {
    const response = await axios.get('https://randomuser.me/api');
    const user = response.data.results[0];
    const nombre = user.name.first + ' ' + randomUser.name.last;
        return nombre;
  } catch (error) {
    console.error('Error al obtener un usuario aleatorio:', error);
    throw new Error('Error al obtener un usuario aleatorio');
  }
}

// Controlador para agregar un nuevo roommate
async function addRoommate(req, res) {
  try {
    const newRoommate = await getRandomUser();
    // Leer los roommates existentes o inicializar un array vacío si el archivo no existe
    let roommates;
    try {
      roommates = JSON.parse(fs.readFileSync('data/roommates.json', 'utf8'));
    } catch (error) {
      roommates = [];
    }
    // Agregar el nuevo roommate
    roommates.push(newRoommate);
    // Escribir los roommates actualizados en el archivo
    fs.writeFileSync('data/roommates.json', JSON.stringify(roommates, null, 2));
    res.status(201).send('Roommate agregado correctamente');
  } catch (error) {
    console.error('Error al agregar un nuevo roommate:', error);
    res.status(500).send('Error interno del servidor al agregar roommate');
  }
}

module.exports = { getRandomUser, addRoommate };
