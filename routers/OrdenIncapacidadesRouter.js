const express = require('express');
const OrdenIncapacidades = require('../models/OrdenIncapacidades');
const OrdenIncapacidadesRouter = express.Router();

    /* Método para consultar órdenes de incapacidades
    Endpoint de búsqueda o consulta*/
OrdenIncapacidadesRouter.get('/consultar', async (req, res) => {
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
        const ordenes = await OrdenIncapacidades.find(filtroBusqueda);

        // Devolver los resultados de la búsqueda
        res.json({ ordenes });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

    /* Método para cancelar Orden de Incapacidades
    Endpoint para cancelar una orden de incapacidades por idPaciente y numOrden*/
OrdenIncapacidadesRouter.delete('/:idPaciente/:numOrden', async (req, res) => {
    try {
        const { idPaciente, numOrden } = req.params;

        // Verificar si el usuario es un paciente
        if (req.user && req.user.rol === 'paciente') {
            return res.status(403).json({ error: 'Los pacientes no tienen permiso para cancelar órdenes de incapacidad' });
        }
        // Buscar la orden de incapacidades por idPaciente y numOrden
        const ordenIncapacidad = await OrdenIncapacidades.findOne({ idPaciente, numOrden });

        if (!ordenIncapacidad) {
            return res.status(404).json({ error: 'No se encontró ninguna orden de incapacidad para el paciente' });
        }
        // Verificar si la orden ya ha sido cancelada
        if (ordenIncapacidad.cancelada) {
            return res.status(400).json({ error: 'La orden de incapacidad ya ha sido cancelada anteriormente' });
        }
        // Marcar la orden como cancelada
        ordenIncapacidad.cancelada = true;

        // Guardar los cambios en la base de datos
        await ordenIncapacidad.save();

        res.status(200).json({ mensaje: 'La orden de incapacidad ha sido cancelada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

// Listar todas las órdenes de incapacidades
OrdenIncapacidadesRouter.get("/", (req, res) => {
    OrdenIncapacidades.find()
        .then(data => res.json({ OrdenIncapacidades: data }))
        .catch(error => res.json({ mensaje: error }));
});

// Guardar nueva orden de incapacidad
OrdenIncapacidadesRouter.post("/", (req, res) => {
    const ordenIncapacidad = new OrdenIncapacidades(req.body);
    ordenIncapacidad.save()
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Actualizar orden de incapacidad
OrdenIncapacidadesRouter.patch("/:id", (req, res) => {
    OrdenIncapacidades.updateOne({ _id: req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Eliminar orden de incapacidad
OrdenIncapacidadesRouter.delete("/:id", (req, res) => {
    OrdenIncapacidades.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

module.exports = OrdenIncapacidadesRouter;
