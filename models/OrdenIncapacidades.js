//const mongoose = require('../db/ConectionDB');
const mongoose = require('mongoose');
const ordenIncapacidadSEsquema = mongoose.Schema({
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
    FecInicioIncapacidad:{
        type: String,
        required: true
    },
    FecFinalIncapacidad:{
        type: String,
        required: true
    },
    diagnosMedico:{
        type: String,
        required: true
    },
    gradoIncapacidad:{
        type: String,
        required: true
        //(parcial o total)
    },
    instruccionesEspeciales:{
        type: String,
        required: true
    },
    recomendacionesMedicas:{
        type: String,
        required: true
    },
    medicamentosPrescritos:{
        type: String,
        required: true
    },
    infoAdicional:{
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
    collection: 'OrdenIncapacidades',
    versionKey: false
});

module.exports = mongoose.model('OrdenIncapacidades', ordenIncapacidadSEsquema);
