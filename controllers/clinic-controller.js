const clinicModel = require("../models/clinic");
const adModel = require("../models/ads");
const userModel = require('../models/user');

const id = require("mongoose");
const { default: mongoose } = require("mongoose");
exports.getClinics = (request, response) => {
  clinicModel
    .find({'doctorId' : request.params.id})
    .then((res) => {
      response.status(201).json(res);
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json(err);
    });
};

exports.getSingleClinic = (request, response) => {
  clinicModel
    .findOne({ _id: request.params.id })
    .then((res) => {
      response.status(201).json(res);
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json(err);
    });
};

exports.addClinic = (request, response) => {
  const url = request.protocol + "://" + request.get("host");
  //    let imagePath = url + "/images/" + request.file.filename;

  // console.log(request.files);
  let imagesArray = [];

  for (let i = 0; i < request.files.length; i++) {
    const path = url + "/images/" + request.files[i].filename;
    imagesArray.push(path);
  }
  const clinic = new clinicModel({
    name: request.body.name,
    address: request.body.address,
    phone: request.body.phone,
    price: request.body.price,
    images: imagesArray,
    services: request.body.services,
    doctorId: request.body.doctorId,
  });

  clinic.save().then((res) => {
    response.status(201).json(res);
  });
};

exports.editClinic = (request, response) => {
    console.log(request.body);
  let images = request.body.images;
  let imagesArray = [];
  if(images){
    for (let i = 0; i < images.length; i++) {
      imagesArray.push(images[i]);
    }
  }

  if (request.files) {
    const url = request.protocol + "://" + request.get("host");
    for (let i = 0; i < request.files.length; i++) {
      const path = url + "/images/" + request.files[i].filename;
      imagesArray.push(path);
    }
  }

  const clinic = new clinicModel({
    _id: request.params.id,
    name: request.body.name,
    address: request.body.address,
    phone: request.body.phone,
    price: request.body.price,
    images: imagesArray,
    services: request.body.services,
    doctorId: request.body.doctorId,
  });

  clinicModel
    .updateOne({ _id: request.params.id }, clinic)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteClinic = (request, response) => {
  adModel.deleteOne({'clinic._id' : request.params.id})
  .then(res => {
    console.log(res);
  })
  clinicModel
    .deleteOne({ _id: request.params.id })
    .then((res) => {
      response.status(201)
      .json({message : 'Deleting success!'})
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addTime = (request, response) => {
  const today = new Date();
  const from = today.toDateString() + " " + request.body.from;
  const to = today.toDateString() + " " + request.body.to;
  const time = {
    day: request.body.day,
    from: from,
    to: to,
    id: mongoose.Types.ObjectId(),
  };

  clinicModel.findOne({ _id: request.params.id }).then((res) => {
    let exist = res.times.some((time) => time.day === request.body.day);

    if (exist) {
      response.status(400).json({
        message: "This time already exist!",
      });
      return;
    } else {
      clinicModel
        .updateOne(
          { _id: request.params.id },
          {
            $push: {
              times: time,
            },
          },
          {
            upsert: true,
          }
        )
        .then((res) => {
          console.log(res);
          response.status(201).json({
            message: "Time added successfully!",
          });
        })
        .catch((err) => {
          console.log(err);
          response.status(400).json({
            message: err,
          });
        });
    }
  });
};

exports.editTime = (request, response) => {
  const today = new Date();
  const from = today.toDateString() + " " + request.body.from;
  const to = today.toDateString() + " " + request.body.to;
  clinicModel
    .updateOne(
      { "times._id": request.params.id },
      {
        $set: {
          "times.$.day": request.body.day,
          "times.$.from": from,
          "times.$.to": to,
        },
      }
    )
    .then((res) => {
      response.status(201).json({
        message: "Time updated successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json({
        message: err,
      });
    });
};

exports.deleteTime = (request, response) => {
  const time = request.body;
  console.log(request.body);
  clinicModel
    .updateOne(
      { _id: request.params.id },
      {
        $pull: {
          times: time,
        },
      }
    )
    .then((res) => {
      console.log(res);
      response.status(201).json({
        message: "Time deleted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json({
        message: err,
      });
    });
};


exports.bookAppointment = (request , response , next) => {
  // console.log(request.body);
  let pickedDate = request.body.appointmentDay.pickedDate;
  let patient = request.body.patient.id
  let storedDates = [];
  userModel.findOne({_id : patient})
  .then(res =>{

    for(let i = 0; i < res.appointments.length; i++ ){
        storedDates.push(res.appointments[i].appointment[0].pickedDate);
    }

   let exists = storedDates.some(date => date == pickedDate);
    if(!exists){
      clinicModel.findOneAndUpdate({_id : request.params.id}, {
        $push : {
          appointments : [
            {
              patient : request.body.patient,
              appointment : [
                {
                  day : request.body.appointmentDay.day[0],
                  pickedDate : request.body.appointmentDay.pickedDate
                }
              ]
            }
          ]
        },
        
      },
      {
        upsert : true
      }
      )
      
      .then(res => {
        
        userModel.findOneAndUpdate({_id : patient} , {
          $push : {
            appointments : [
              {
                appointment : {
                 appointDetails : request.body.appointmentDay,
                  doctor : {
                    name : request.body.doctor.name,
                    speciality : request.body.doctor.speciality,
                    image : request.body.doctor.image

                  }
                  
                }
                    

                  
                
              }
            ]
          }
        })
        .then(res => {
          console.log(res);
        })
        

        response.status(201)
        .json({
          message : 'Your appointment has been booked!. Check your email for booking details.'
        })
      })
      .catch(err => {
        console.log(err);
        response.status(400)
        .json({
          message : err
        })
      })
    }
    else {
      console.log('appointment exist');
      response.status(400)
      .json({message : 'You already booked in this day!'})
    }

  })
  
  





  

}



exports.cancelAppointment = (request , response) => {

  userModel.findOneAndUpdate({_id : request.params.id} , {
    $pull : {
      appointments : request.body
    }
  })
  .then(res => {
    response.status(201).json({message : 'Appointment has been cancled!'})
  })
  .catch(err => {
    console.log(err);
  })
  
}