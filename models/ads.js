const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const adSchema = mongoose.Schema({

      clinic: [
        {
          _id : {type : String , unique : true},
          name: { type: String},
          address: { type: String, },
          phone: { type: String,},
          price: { type: String, },
          images: { type: Array },
          services: { type: Array },
          times: [
            {
              day: { type: String },
              from: { type: String },
              to: { type: String },
            },
          ],
          doctor: [
            {
                id : {type : String},
                name : {type : String},
                speciality : {type : String},
                degree : {type : String},
                image : {type : String},
                gender : {type : String}
            }
          ]
          
          ,
        },
      ],
      discount: { type: String },
    },

);

mongoose.plugin(validator);

module.exports = mongoose.model("Ads", adSchema);
