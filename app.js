const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/user-routes');
const doctorRoutes = require('./routes/doctor-routes');
const specialityRoutes = require('./routes/speciality-routes');
const countryRoutes = require('./routes/country-routes');
const clinicRoutes = require('./routes/clinic-routes');
const adRoutes = require('./routes/ads-routes');

mongoose.connect("mongodb+srv://heshamAbdalaziz:Ry5N4DI90Umfuw0q@cluster0.zwxln.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
    console.log('Connected successfully');
})
.catch(() => {
    console.log('Failed to connect!');
})
/*

mongooDB pass : Ry5N4DI90Umfuw0q

*/
app.use(bodyParser.json());

app.use("/images", express.static(path.join("backend/images")));


app.use(( request, response  , next) => {

    response.setHeader('Access-Control-Allow-Origin' , '*');
    response.setHeader("Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type, Accept , Authorization");
    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET , POST , PATCH , PUT ,DELETE , OPTIONS"
      );


      next();
    
})


app.use("/api/user" , userRoutes);
app.use("/api/doctor" , doctorRoutes);
app.use("/api/speciality" , specialityRoutes);
app.use("/api/country" , countryRoutes);
app.use("/api/clinic" , clinicRoutes);
app.use("/api/ads" , adRoutes);

module.exports = app;
