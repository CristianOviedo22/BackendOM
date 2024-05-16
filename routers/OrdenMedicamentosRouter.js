const express = require('express');
const OrdenMedicamentos = require('../models/OrdenMedicamentos');
const OrdenMedicamentosRouter = express.Router();

    /* Método para consultar órdenes de medicamentos
    Endpoint de búsqueda o consulta*/
OrdenMedicamentosRouter.get('/consultar', async (req, res) => {
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
        const ordenes = await OrdenMedicamentos.find(filtroBusqueda);

        // Devolver los resultados de la búsqueda
        res.json({ ordenes });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

    /* Método para cancelar Orden de Medicamentos
    Endpoint para cancelar una orden de medicamentos por idPaciente y numOrden*/

OrdenMedicamentosRouter.delete('/:idPaciente/:numOrden', async (req, res) => {
    try {
        const { idPaciente, numOrden } = req.params;

        // Verificar si el usuario es un paciente
        if (req.user && req.user.rol === 'paciente') {
            return res.status(403).json({ error: 'Los pacientes no tienen permiso para cancelar órdenes de medicamentos' });
        }

        // Buscar la orden de medicamentos por idPaciente y numOrden
        const ordenMedicamento = await OrdenesMedicamentos.findOne({ idPaciente, numOrden });

        if (!ordenMedicamento) {
            return res.status(404).json({ error: 'No se encontró ninguna orden de medicamentos para el paciente' });
        }

        // Verificar si la orden ya ha sido cancelada
        if (ordenMedicamento.cancelada) {
            return res.status(400).json({ error: 'La orden de medicamentos ya ha sido cancelada anteriormente' });
        }

        // Verificar si la orden ha sido entregada parcial o completamente
        if (ordenMedicamento.entregadaParcial || ordenMedicamento.entregadaCompleta) {
            return res.status(403).json({ error: 'No se pueden cancelar órdenes de medicamentos que han sido entregadas parcial o completamente' });
        }
        // Marcar la orden como cancelada
        ordenMedicamento.cancelada = true;
        // Guardar los cambios en la base de datos
        await ordenMedicamento.save();

        res.status(200).json({ mensaje: 'La orden de medicamentos ha sido cancelada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});


// Listar todas las órdenes de medicamentos
OrdenMedicamentosRouter.get("/", (req, res) => {
    OrdenMedicamentos.find()
        .then(data => res.json({ OrdenMedicamentos: data }))
        .catch(error => res.json({ mensaje: error }));
});

// Guardar nueva orden de medicamentos
OrdenMedicamentosRouter.post("/", (req, res) => {
    const ordenMedicamento = new OrdenMedicamentos(req.body);
    ordenMedicamento.save()
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Actualizar orden de medicamentos
OrdenMedicamentosRouter.patch("/:id", (req, res) => {
    OrdenMedicamentos.updateOne({ _id: req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

// Eliminar orden de medicamentos
OrdenMedicamentosRouter.delete("/:id", (req, res) => {
    OrdenMedicamentos.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ mensaje: error }));
});

//asociar entrega de medicamentos 
// Ruta para asociar la entrega de medicamentos a una orden médica
OrdenMedicamentosRouter.post("/:idOrden/entrega", async (req, res) => {
    const idOrden = req.params.idOrden;
    const entregaMedicamentos = req.body; // Datos de la entrega de medicamentos enviados en el cuerpo de la solicitud
    try {
        // Encuentra la orden de medicamentos por su ID
        const ordenMedicamentos = await OrdenMedicamentos.findById(idOrden);
        if (!ordenMedicamentos) {
            return res.status(404).json({ error: 'Orden de medicamentos no encontrada' });
        }
        // Asocia la entrega de medicamentos a la orden médica
        ordenMedicamentos.entregaMedicamentos = entregaMedicamentos;
        await ordenMedicamentos.save();
        res.status(201).json(ordenMedicamentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asociar entrega de medicamentos' });
    }
});

module.exports = OrdenMedicamentosRouter;
