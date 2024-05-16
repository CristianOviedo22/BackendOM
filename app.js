const express = require("express");
const cors = require("cors");
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
//const mongoose = require('../db/ConectionDB');

const OrdenesEspecialistasRouter = require ("./routers/OrdenesEspecialistasRouter");
const OrdenExamenesRouter = require ("./routers/OrdenExamenesRouter");
const OrdenIncapacidadesRouter = require ("./routers/OrdenIncapacidadesRouter");
const OrdenMedicamentosRouter = require ("./routers/OrdenMedicamentosRouter");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ordenes
app.use("/OrdenesEspecialistas", OrdenesEspecialistasRouter);
app.use("/OrdenExamenes", OrdenExamenesRouter);
app.use("/OrdenIncapacidades", OrdenIncapacidadesRouter);
app.use("/OrdenMedicamentos", OrdenMedicamentosRouter);


//Conexion BDD Desarrollo

let Conexion = "mongodb+srv://UTS:uts2024@uts.ccyqodk.mongodb.net/Dev2024E192?retryWrites=true&w=majority&appName=UTS";

mongoose.connect(Conexion)
    .then(event=> console.log("Conectado a MongoDB"))
    .catch(error => console.log(error));

const PORT = process.env.PORT || 5000;
app.listen(PORT);

