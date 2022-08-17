const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




exports.getUser = (request,response, next) => {

    userModel.findOne({_id : request.params.id})
    .then(user => {
        response.status(201)
        .json(user)
    })
    .catch(err => {
        console.log(err);
        response.status(201)
        .json(err)
    })
}

exports.createUser = (request , response , next) => {
    bcrypt.hash(request.body.password , 10)
    .then((hashedPassword) => {
        const user = new userModel({
            firstName : request.body.firstName,
            lastName : request.body.lastName,
            email : request.body.email,
            password : hashedPassword,
            role : 'user',
            accountStatus : 'Active'
        });

        user.save()
        .then((user) => {
            console.log(user);

            const token = jwt.sign({
                username : user.firstName + user.lastName,
                email : user.email,
                userId : user._id
            },
            'secret_key' ,
            {expiresIn : '1h'});

            response.status(201)
            .json({
                message : 'Account created successfully',
                token : token,
                user : {
                    id : user._id,
                    name : user.firstName + " " + user.lastName,
                    email : user.email,
                    role : user.role,
                    accountStatus : user.accountStatus
                }
            });
        })
        .catch((err) => {
            console.log(err);
            response.status(400)
            .json({
                message : err,
            })
        })
    })
}



exports.logInUser = (request , response , next) => {
    let fetchedUser;

    userModel.findOne({email : request.body.email})
    .then((user) => {
        if(!user) {
            response.status(400)
            .json({
                message : 'Authentication Failed!'
            });

        }

        fetchedUser = user;

        return bcrypt.compare(request.body.password , user.password)
        .then(result =>{
            if(!result) {
                response.status(400)
                .json({
                    message : 'Authentication Failed!'
                })
            }


            const token = jwt.sign({
                username : fetchedUser.firstName + fetchedUser.lastName,
                email : fetchedUser.email,
                userId : fetchedUser._id
            },
            'secret_key', 
            {expiresIn : '1h'});


            response.status(201)
            .json({
                message : 'Authentication success!',
                token : token,
                user : {
                    id : fetchedUser._id,
                    name : fetchedUser.firstName + " " + fetchedUser.lastName,
                    email : fetchedUser.email,
                    speciality : fetchedUser.speciality,
                    role : fetchedUser.role,
                    active : fetchedUser.active,
                    accountType : fetchedUser.accountType,
                    image : fetchedUser.image
                }
            })

        })
    })
    .catch(err => {
        console.log(err);
    })
}


exports.changeImage = (request , response) => {
    console.log(request.file);
    const url = request.protocol + "://" + request.get("host");
    let imagePath = url + "/images/" + request.file.filename;

    // const user = new userModel({
    //     _id : request.params.id,
    //     image : imagePath
    // })
    userModel.findOneAndUpdate({_id : request.params.id} , {
        $set : {
            image : imagePath
        }
    })
       
        .then(res => {
          response.status(201)
          .json({message : 'Image changed successfully!'})
        })
        .catch(err => {
            console.log(err);
            response.status(400)
            .json({message : 'Error while changing image!'})
        })
}   


exports.getAppointments = (request , response) => {
const pageSize = +request.query.pageSize;
const currentPage = +request.query.page;
const appointmentsQuery =  userModel.findOne({_id : request.params.id})
   let appointments;

if(pageSize && currentPage) {
    appointmentsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
}
appointmentsQuery
.then(res => {
    appointments = res.appointments;
})
.then(() => {
    response.status(201)
    .json({
        appointments : appointments,
        maxNum : appointments.length
    })
})
}


