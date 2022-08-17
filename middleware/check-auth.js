const jwt = require('jsonwebtoken');




/* a function that get executed on the coming request
    from the frontend
*/  
module.exports = (request , response , next) => {
    try{
        const token = request.headers.authorization.split(" ")[1];
       const decodedToken =  jwt.verify(token,"secret_key")
       request.userData = {
        email : decodedToken.email ,
        userId : decodedToken.userId
       }; 
       next();
    }

    catch(error) {
        response.status(401).json({
            message : "Auth failed!"
        });
    }

    
};