const specModel = require('../models/speciality');


exports.getSpecialities = (request , response , next) => {
    const pageSize = +request.query.pageSize;
    const currentPage = +request.query.page;
    const specQuery = specModel.find();
    let specialities;
    if(pageSize && currentPage) {
        specQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
    }
    specQuery
    .then(res => {
        specialities = res;
        return specModel.count();
    })
    .then((count) => {
        response.status(201)
        .json({
            specialites : specialities,
            maxNum : count
        });
    })
   
}


exports.getAll = (request , response , next) =>{
    specModel.find()
    .then(specialites => {
        response.status(201)
        .json(
            specialites,

        );
    })
    .catch(err => {
        response.status(400)
        .json(
            err
        );
    })
}


exports.getSingleSpeciality =  (request , response , next) => {
    specModel.findById({_id : request.params.id})
    .then(res => {
        response.status(201)
        .json(res);
    })
    .catch(err => {
        console.log(err);
    })
}

exports.createSpec = (request , response , next) => {
    const url = request.protocol + "://" + request.get("host");
   let imagePath = url + "/images/" + request.file.filename;


    const speciality = new specModel({
        name : request.body.name,
        image : imagePath
    });

    speciality.save()
    .then(spec => {
        console.log(spec);
        response.status(201)
        .json(spec)
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json(err)
    });
}


exports.editSpeciality = (request , response , next) => {
    let imagePath = request.body.image;
    if(request.file){
          const url = request.protocol + "://" + request.get("host");
          imagePath = url + "/images/" + request.file.filename;
      }

      const speciality = new specModel({
        _id : request.params.id,
        name : request.body.name,
        image : imagePath
      });
      console.log(speciality);
      specModel.updateOne({_id : request.params.id} , speciality)
      .then(spec => {
        console.log(spec);
        response.status(201)
        .json(spec)
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json(err)
    });
}


exports.deleteSpeciality = (request , response , next) => {
    specModel.deleteOne({_id : request.params.id})
    .then(spec => {
        response.status(201)
        .json(spec)
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json(err)
    });
}

