const countryModel = require('../models/country');
const governorateModel = require('../models/governorates');
const cityeModel = require('../models/cities');

// exports.getCountries = (request , response , next) => {
//     const pageSize = +request.query.pageSize;
//     const currentPage = +request.query.page;
//     const countryQuery = countryModel.find();
//     let countries;
//     if(pageSize && currentPage) {
//         countryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
//     }

//     countryQuery
//     .then(res => {
//         countries = res;
//         return countryModel.count();
//     })
//     .then((count) => {
//         response.status(201)
//         .json({
//             countries : countries,
//             maxNum : count
//         });
//     })

// }


// exports.getAll = (request , response , next) => {

//     countryModel.find()
//     .then((country) => {
//         response.status(201)
//         .json(country);
//     })
//     .catch(err => {
//         console.log(err);
//         response.status(400)
//         .json(err);
//     })
// }
// exports.addCountry = (request , response , next) => {
//     const country = new countryModel({
//         name : request.body.name
//     });

//     country.save()
//     .then((country) => {
//         response.status(201)
//         .json(country);
//     })
//     .catch(err => {
//         console.log(err);
//         response.status(400)
//         .json(err);
//     })
// }

// exports.editCountry = (request , response , next) => {

//     const country = new countryModel({
//         _id : request.params.id,
//         name : request.body.name
//     })

//     countryModel.updateOne({_id : request.params.id} , country)
//     .then(res => {
//         response.status(201)
//         .json({
//             message : 'Country updated succussfully'
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         response.status(201)
//         .json({
//             message :err
//         });
//     })
// }

// exports.deleteCountry = (request , response , next) => {

//     countryModel.deleteOne({_id : request.params.id})
//     .then(res => {
//         response.status(201)
//         .json({
//             message : 'Country deleted succussfully'
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         response.status(201)
//         .json({
//             message :err
//         });
//     })
// }


exports.getAll = (request , response) => {
        governorateModel.find()
        .then(res => {
            response.status(201)
            .json(res)
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getGovernorate = (request , response) =>{
    let governorate
    governorateModel.find()
    .then(res => {
          governorate =  res[0].data.filter(gov => gov.id == request.params.id);

          response.status(201)
          .json(governorate)
    })
    .catch(err => {
        console.log(err);
        response.status(400)
        .json(err)
    })
}

exports.getCities = (request , response) => {

    cityeModel.find()
    .then(res => {
        let cities = res[0].data.filter(city => city.governorate_id == request.params.id)
        response.status(201)
        .json(cities)

    })
    .catch(err => {
        console.log(err);
    })

}