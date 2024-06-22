const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Función para obtener todos los gastos
const getAllGastos = (req, res) => {
  try {
    const gastos = JSON.parse(fs.readFileSync('data/gastos.json', 'utf8')); // Leer gastos del archivo
    res.status(200).json({ gastos }); // Enviar los gastos como respuesta
  } catch (error) {
    console.error('Error al obtener todos los gastos:', error);
    res.status(500).send('Error interno del servidor al obtener gastos');
  }
};

// Función para agregar un nuevo gasto
const addGasto = (req, res) => {
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
};

// Función para actualizar un gasto
const updateGasto = (req, res) => {
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
};

// Función para eliminar un gasto
const deleteGasto = (req, res) => {
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
};

module.exports = { getAllGastos, addGasto, updateGasto, deleteGasto };
