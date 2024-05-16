const express = require('express');
const OrdenesEspecialistasRouter = express.Router();
const OrdenesEspecialistas = require('../models/OrdenesEspecialistas');

    /* Metodo para consultar
    Endpoint de busqueda o consultar
    Se agrega que el usuario paciente solo pueda consultar las ordenes 
    asociadas a su numero de documento y/o identificacion*/

OrdenesEspecialistasRouter.get('/consultar', async (req, res) => {
    try {
        // Obtener el rol del usuario desde la solicitud
        const rolUsuario = req.user && req.user.rol;

        // Inicializar el filtro de búsqueda
        let filtroBusqueda = {};

        // Verificar si el usuario es un paciente
        if (rolUsuario === 'paciente') {
            // Obtener el ID del paciente desde la solicitud
            const pacienteID = req.user && req.user.id;

            // Aplicar el filtro para mostrar solo las órdenes asociadas al paciente
            filtroBusqueda.idPaciente = pacienteID;
        }
        // Verificar si el usuario es un médico (o cualquier otro rol)
        if (rolUsuario !== 'paciente') {
            // Si el usuario no es un paciente, mostrar todas las órdenes
            filtroBusqueda = {};
        }
        // Realizar la búsqueda en la base de datos basada en el filtro
        const ordenes = await OrdenesEspecialistas.find(filtroBusqueda);

        // Devolver los resultados de la búsqueda
        res.json({ ordenes });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});
    /* Método para cancelar Orden de Especialista
    Endpoint para cancelar una orden de medicamentos por idPaciente y numOrden
    Se agrega la condicion que el usuario paciente no pueda cancelar la orden de especialistas*/
OrdenesEspecialistasRouter.delete('/:idPaciente/:numOrden', async (req, res) => {
    try {
        const { idPaciente, numOrden } = req.params;

        // Verificar si el usuario es un paciente
        if (req.user && req.user.rol === 'paciente') {
            return res.status(403).json({ error: 'Los pacientes no tienen permiso para cancelar órdenes de especialista' });
        }
        // Buscar la orden de especialista por idPaciente y numOrden
        const ordenEspecialista = await OrdenesEspecialistas.findOne({ idPaciente, numOrden });

        if (!ordenEspecialista) {
            return res.status(404).json({ error: 'No se encontró ninguna orden de especialista para el paciente' });
        }
        // Verificar si la orden ya ha sido cancelada
        if (ordenEspecialista.cancelada) {
            return res.status(400).json({ error: 'La orden de especialista ya ha sido cancelada anteriormente' });
        }
        // Marcar la orden como cancelada
        ordenEspecialista.cancelada = true;

        // Guardar los cambios en la base de datos
        await ordenEspecialista.save();

        res.status(200).json({ mensaje: 'La orden de especialista ha sido cancelada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

// Listar todas las órdenes de especialistas
OrdenesEspecialistasRouter.get("/", (req, res) => {
    OrdenesEspecialistas.find()
        .then(data => res.json({ OrdenesEspecialistas: data }))
        .catch(error => res.json({ mensaje: error }));
});

// Guardar nueva orden de especialista
OrdenesEspecialistasRouter.post("/", (req, res) => {
    const ordenEspecialista = new OrdenesEspecialistas(req.body);
    ordenEspecialista.save()  // revisar aqui
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Actualizar orden de especialista
OrdenesEspecialistasRouter.patch("/:id", (req, res) => {
    OrdenesEspecialistas.updateOne({ _id: req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Eliminar orden de especialista
OrdenesEspecialistasRouter.delete("/:id", (req, res) => {
    OrdenesEspecialistas.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});
// metodo para asociar resultados de cx a orden de especialistas
OrdenesEspecialistasRouter.post("/:idOrden/resultados-cirugia", async (req, res) => {
    const idOrden = req.params.idOrden;
    const resultadosCirugia = req.body; // Datos de los resultados de cirugía enviados en el cuerpo de la solicitud
    try {
        // Encuentra la orden de especialista por su ID
        const ordenEspecialista = await OrdenEspecialista.findById(idOrden);
        if (!ordenEspecialista) {
            return res.status(404).json({ error: 'Orden de especialista no encontrada' });
        }
        // Asocia los resultados de cirugía a la orden de especialista
        ordenEspecialista.resultadosCirugia = resultadosCirugia;
        await ordenEspecialista.save();
        res.status(201).json(ordenEspecialista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asociar resultados de cirugía a la orden de especialista' });
    }
});

module.exports = OrdenesEspecialistasRouter;
