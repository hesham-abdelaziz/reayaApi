const doctorModel = require('../models/doctor');
const userModel = require('../models/user');
const adModel = require("../models/ads");

const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodeMailer.createTransport({
    service : 'Gmail',
    auth : {
        user : 'heshoabb@gmail.com',
        pass : 'eswlbgfvoausajzj'
    }
});

exports.getDoctors = (request , response , next) => {
    const pageSize = +request.query.pageSize;
    const currentPage = +request.query.page;
    const doctorQuery = userModel.find({accountType : 'Doctor'});

    let doctors;

    if(pageSize && currentPage){
        doctorQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
    }

    doctorQuery
    .then(res => {
        doctors = res;
        return doctorModel.count();
    })
    .then((count) => {
        response.status(201)
        .json({
            doctors : doctors,
            maxNum : count
        });
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json({
            message : err,

        });
    })
}

exports.createDoctor = (request , response , next) => {
    const url = request.protocol + "://" + request.get("host");
    let imagePath = url + "/images/" + request.file.filename;
    console.log(imagePath);
    bcrypt.hash(request.body.password , 10)
    .then(hashedPassword => {


        const doctorUser = new userModel({
            firstName : request.body.firstName,
            lastName : request.body.lastName,
            email : request.body.email,
            phone : request.body.phone,
            password : hashedPassword,
            gender : request.body.gender,
            speciality : request.body.speciality,
            degree : request.body.degree,
            governorate : request.body.governorate,
            city : request.body.city,
            regNumber : request.body.regNumber,
            taxID : request.body.taxID,
            image : imagePath,
            active : true,
            accountType : 'Doctor'
        })
        doctorUser.save()
        .then((res) => {

            const options = {
                from : 'heshoabb@gmail.com',
                to : res.email,
                subject :'Your account has been created!',
                html : `
                <h2>Hello doctor ${res.firstName + " " + res.lastName}</h2>
                <h4>Your email is : ${res.email}</h4>
                <h4>Your password is : 1234</h4>
                `
            };
    
            transporter.sendMail(options , (err, info) => {
                if(err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log(info.response);
                }
            })
    
            response.status(201)
            .json({
                message : 'Doctor added successfully'
            });
        })
        .catch(err => {
            response.status(201)
            .json({
                message : err
            });

    })
    })
    .catch(err => {
        console.log(err);
    })
}



exports.disableDoctor = (request , response , next) => {


    const doctorUser = new userModel({
        _id : request.params.id,
        active : false
    })

    userModel.updateOne({_id  : request.params.id} , doctorUser)
    .then(() => {
            console.log(res);
        response.status(201)
        .json({
            message : 'Account disabled successfully!'
        });
    })
    .catch(err => {
        response.status(201)
        .json({
            message : err
        });
    })
}

exports.enableDoctor = (request , response , next) => {


    const doctorUser = new userModel({
        _id : request.params.id,
        active : true
    })

    
    userModel.updateOne({_id  : request.params.id} , doctorUser)
    .then(() => {
        response.status(201)
        .json({
            message : 'Account enabled successfully!'
        });
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json({
            message : err
        });
    })
}


exports.getSingleDoctor = (request , response , next) => {
    userModel.findOne({_id : request.params.id})
    .then(doctor => {
        response.status(201)
        .json(doctor);
    })
    .catch(err => {
        response.status(400)
        .json({
            message : err
        });
    })
}

exports.editDoctor = (request , response , next) => {
    let imagePath = request.body.image;
    console.log(request.file);
    if(request.file){
          const url = request.protocol + "://" + request.get("host");
          imagePath = url + "/images/" + request.file.filename;
      } 

      const doctorUser = new userModel({
        _id : request.params.id,
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        email : request.body.email,
        phone : request.body.phone,
        about : request.body.about,
        address : request.body.address,
        gender : request.body.gender,
        speciality : request.body.speciality,
        governorate : request.body.governorate,
        city : request.body.city,
        degree : request.body.degree,
        state : request.body.state,
        image : imagePath,
        active : request.body.status,
        experiences : request.body.experiences
      })


      userModel.updateOne({_id : request.params.id} , doctorUser)
      .then(res => {
        console.log(res);
        response.status(201)
        .json({message : 'Updated successfully!'});
      })

      .catch(err => {
        console.log(err);
        response.status(400)
        .json(err);
      })
}


exports.deleteDoctor = (request , response , next) => {

    userModel.deleteOne({_id : request.params.id})
    .then((res) => {
        console.log(res);
        adModel.deleteOne({'doctor.id' : request.params.id})
        .then(res => {
            console.log(res);
        })
        response.status(201)
        .json({
            message : 'Doctor deleted successfully!'
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

exports.changePassword = (request , response , next) => {

    userModel.findOne({_id : request.params.id})
    .then(doctor => {

        bcrypt.compare(request.body.oldPassword , doctor.password)
        .then((result) => {
         
         
            if(!result){
                response.status(400)
                .json({
                    message : 'Incorrect old password!'
                })
         }

    
         else {
             
         bcrypt.hash(request.body.newPassword , 10)
         .then(hashedPassword => {
          const doctor = new userModel({
              _id : request.params.id,
              password : hashedPassword
          });

          userModel.updateOne({_id : request.params.id} , doctor)
          .then(() =>{
              response.status(201)
              .json({
                  message : 'Password Changed Successfully!'
              });
          })
          .catch(err => {
              console.log(err);
              response.status(400)
              .json({
                  message : err
              })
          })
         })
         .catch(err => {
          console.log(err);
          response.status(400)
          .json({
              message :err
          })
         })
         }



        })
        .catch(err => {
            console.log(err);
        })
    })
}