const adModel = require("../models/ads");
const userModel = require("../models/user");
const clinicModel = require("../models/clinic");

exports.getAds = (request, response) => {
  adModel
    .find()
    .then((ads) => {
      response.status(201).json(ads);
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json(res);
    });
};

exports.filterAds = (request, response) => {

  let degree = request.params.degree;
  let gender = request.params.gender;
  let speciality = request.params.speciality;
  let price = request.params.price;
  let exists;
  adModel
    .find()
    .then((res) => {

      if(degree !='null' 
      && gender == 'null' 
      && speciality == 'null' && 
      price == 'null'){
         exists = res.filter(
          (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
        );
      }
      
      else if(degree !='null' 
      && gender == 'null' 
      && speciality != 'null' && 
      price == 'null'){
        exists = res.filter(
          (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
           && ad.clinic[0].doctor[0].speciality == request.params.speciality 
           ); 
          }

          else if (degree !='null' 
          && gender != 'null' 
          && speciality != 'null' && 
          price == 'null'){
            exists = res.filter(
              (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
               && ad.clinic[0].doctor[0].gender == request.params.gender 
               && ad.clinic[0].doctor[0].speciality == request.params.speciality 
               ); 
          }

          else if (degree !='null' 
          && gender != 'null' 
          && speciality != 'null' && 
          price != 'null'){
            if(price == 'less_50'){
              exists = res.filter(
                (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
                 && ad.clinic[0].doctor[0].gender == request.params.gender 
                 && ad.clinic[0].doctor[0].speciality == request.params.speciality 
                 && ad.clinic[0].price < 50
                 ); 

            }
            else if(price == 'between_100_50'){
              exists = res.filter(
                (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
                 && ad.clinic[0].doctor[0].gender == request.params.gender 
                 && ad.clinic[0].doctor[0].speciality == request.params.speciality 
                 && ad.clinic[0].price > 50
                 && ad.clinic[0].price <= 100
                 ); 
            }
            else if(price == 'between_100_200'){
              exists = res.filter(
                (ad) => ad.clinic[0].doctor[0].degree == request.params.degree
                 && ad.clinic[0].doctor[0].gender == request.params.gender 
                 && ad.clinic[0].doctor[0].speciality == request.params.speciality 
                 && ad.clinic[0].price >= 100
                 && ad.clinic[0].price <= 200
                 ); 
            }
          }
          
          else if(degree =='null' 
          && gender == 'null' 
          && speciality != 'null' && 
          price == 'null'){
            exists = res.filter(
              (ad) =>
                ad.clinic[0].doctor[0].speciality == request.params.speciality 
               ); 
              }
          else if(degree =='null' 
          && gender != 'null' 
          && speciality == 'null' && 
          price == 'null'){
            exists = res.filter(
              (ad) =>
                ad.clinic[0].doctor[0].gender == request.params.gender 
               ); 
              }
          else if(degree =='null' 
          && gender != 'null' 
          && speciality != 'null' && 
          price == 'null'){
            exists = res.filter(
              (ad) =>
                ad.clinic[0].doctor[0].gender == request.params.gender 
               && ad.clinic[0].doctor[0].speciality == request.params.speciality 
               ); 
              }

          response.json(exists);
 

    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addNew = (request, response) => {
  userModel.findOne({ _id: request.body.doctor.id }).then((doctor) => {
    const ad = new adModel({
      clinic: [
        {
          _id: request.body.clinic._id,
          name: request.body.clinic.name,
          address: request.body.clinic.address,
          phone: request.body.clinic.phone,
          price: request.body.clinic.price,
          images: request.body.clinic.images,
          services: request.body.clinic.services,
          doctor: {
            id: doctor._id,
            name: request.body.doctor.name,
            speciality: doctor.speciality,
            degree: doctor.degree,
            image: request.body.doctor.image,
            gender: doctor.gender,
          },
        },
      ],

      discount: request.body.discount,
    });

    ad.save()
      .then((res) => {
        clinicModel
          .findOneAndUpdate(
            { _id: request.body.clinic._id },
            {
              $push: {
                ad: res,
              },
            }
          )
          .then((res) => {
            console.log(res);
          });
        response.status(201).json({
          message: "Ad published successfully!",
          ad: res,
        });
      })
      .catch((err) => {
        console.log(err);
        response.status(400).json({
          message: err,
        });
      });
  });
};

exports.deleteAd = (request, response) => {
  adModel.findOne({ "clinic._id": request.params.id }).then((res) => {
    clinicModel.findOneAndUpdate(
      { _id: request.params.id },
      {
        $pull: {
          ad: res,
        },
      }
    );
  });
  adModel
    .deleteOne({ "clinic._id": request.params.id })
    .then((res) => {
      response.status(201).json({
        message: "Ad deleted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json({
        message: err,
      });
    });
};
