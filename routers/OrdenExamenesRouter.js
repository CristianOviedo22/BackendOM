const express = require('express');
const OrdenExamenesRouter = express.Router();
const OrdenExamenes = require('../models/OrdenExamenes');

    /*Metodo para consultar
    Endpoint de busqueda o consultar
    Se agrega que el usuario paciente solo pueda consultar las ordenes 
    asociadas a su numero de documento y/o identificacion*/
OrdenExamenesRouter.get('/consultar', async (req, res) => {
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
        const ordenes = await OrdenExamenes.find(filtroBusqueda);

        // Devolver los resultados de la búsqueda
        res.json({ ordenes });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

    /* Método para cancelar Orden de Exámenes
    Endpoint para cancelar una orden de exámenes por idPaciente y numOrden*/
OrdenExamenesRouter.delete('/:idPaciente/:numOrden', async (req, res) => {
    try {
        const { idPaciente, numOrden } = req.params;

        // Verificar si el usuario es un paciente
        if (req.user && req.user.rol === 'paciente') {
            return res.status(403).json({ error: 'Los pacientes no tienen permiso para cancelar orden de exámenes' });
        }

        // Buscar la orden de exámenes por idPaciente y numOrden
        const ordenExamen = await OrdenExamenes.findOne({ idPaciente, numOrden });

        if (!ordenExamen) {
            return res.status(404).json({ error: 'No se encontró ninguna orden de exámenes para el paciente' });
        }

        // Verificar si la orden ya ha sido cancelada
        if (ordenExamen.cancelada) {
            return res.status(400).json({ error: 'La orden de exámenes ya ha sido cancelada anteriormente' });
        }

        // Marcar la orden como cancelada
        ordenExamen.cancelada = true;

        // Guardar los cambios en la base de datos
        await ordenExamen.save();

        res.status(200).json({ mensaje: 'La orden de exámenes ha sido cancelada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente' });
    }
});

//Listar Ordenes de Examenes

OrdenExamenesRouter.get("/", (req, res) =>{
OrdenExamenes.find()
    .then(datos => res.json({ OrdenExamenes: datos}))
    .catch(error => res.json({mensaje: error}));
});

// Guardar Orden de Examen Nueva
OrdenExamenesRouter.post("/", (req, res)=>{
    const ordenexamenes = new OrdenExamenes(req.body);
    ordenexamenes.save()
        .then(datos => res.json(datos))
        .catch(error => res.json({mensaje: error}));
});


//Actualizar Orden de Examen Nueva 
OrdenExamenesRouter.patch("/", (req, res)=> {
    const ordenexamenes = new OrdenExamenes(req.body);
    OrdenExamenes.updateOne({_id: ordenexamenes._id}, ordenexamenes)
        .then(datos => res.json(datos))
        .catch(error => res.json({mensaje: error}));
});



// Eliminar Orden de Examen Nueva
OrdenExamenesRouter.delete("/:id", (req, res)=> {
    OrdenExamenes.deleteOne({_id: req.params.id})
        .then(datos => res.json(datos))
        .catch(error => res.json({mensaje: error}));
});

//Asociar resultados de exemenes 29-4
OrdenExamenesRouter.post("/:id/documentos", async (req, res) => {
    const idOrden = req.params.id;
    const documento = req.body; // Datos del documento adjunto enviado en el cuerpo de la solicitud
    try {
        // Encuentra la orden de exámenes por su ID
        const ordenExamen = await OrdenExamen.findById(idOrden);
        if (!ordenExamen) {
            return res.status(404).json({ error: 'Orden de exámen no encontrada' });
        }
        // Agrega el documento adjunto a la orden de exámenes
        ordenExamen.documentosAdjuntos.push(documento);
        await ordenExamen.save();
        res.status(201).json(ordenExamen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir documento adjunto' });
    }
});

module.exports = OrdenExamenesRouter;

