const mongoose = require('mongoose');


const citySchema = mongoose.Schema({
    id : {type : mongoose.Schema.Types.ObjectId},
    data : {type : Array}
})




module.exports = mongoose.model('Cities' , citySchema);