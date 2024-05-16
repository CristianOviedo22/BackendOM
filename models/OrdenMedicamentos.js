//const mongoose = require('../db/ConectionDB');
const mongoose = require('mongoose');

const ordenMedicamentoEsquema = mongoose.Schema({
    nombreIps:{
        type: String,
        required: true
    },
    numOrden:{
        type: Number,
        required: true
    },
    direccionIps:{
        type: String,
        required: true
    },
    numTelefonoIps:{
        type: Number,
        required: true
    },
    lugarIps:{
        type: String,
        required: true
    },
    fechhoraPrescrip:{
        type: String, 
        required: true
    },
    nomPaciente:{
        type: String,
        required: true
    },
    idPaciente:{
        type: Number,
        required: true
    },
    fechaNacimiento:{
        type: String,
        required: true
    },
    edad:{
        type: Number,
        required: true
    },
    sexo:{
        type: String,
        required: true
    },
    direccionPaciente:{
        type: String,
        required: true
    },
    telefonoPacientes:{
        type: Number,
        required: true
    },
    emailPaciente:{
        type: String,
    },
    tipoUsuario:{
        type: String,
        required: true,
        enum: ['contributivo', 'subsidiado', 'particular']
    },
    vigenciaPrescripcion:{
        type: String,
        required: true
    },
    codMedicamento:{
        type: Number,
        required: true
    },
    nombreMedicamento:{
        type: String,
        required: true
    },
    invima:{
        type: String,
        required: true
    },
    concentracionFarmaceutica:{
        type: String,
        required: true
    },
    viaAdministracion:{
        type: String,
        required: true
    },
    cantidad:{
        type: String,
        required: true
    },
    dosis:{
        type: Number,
        required: true
    },
    frecuenciaAdmin:{
        type: String,
        required: true
    },
    periodoTratamiento:{
        type: String,
        required: true
    },
    observaciones:{
        type: String,
        required: true
    },
    vigenciaPrescripcion:{
        type: String,
        required: true
    },
    nomMedico:{
        type: String,
        required: true
    },
    registroProfesional:{
        type: Number,
        required: true
    },
    especialidadMedico:{
        type: String,
        required: true
    }   
}, {
    collection: 'OrdenMedicamento',
    versionKey: false
});

module.exports = mongoose.model('OrdenMedicamentos', ordenMedicamentoEsquema);

