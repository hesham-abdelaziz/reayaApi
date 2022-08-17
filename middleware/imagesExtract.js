const multer = require('multer');
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };

const storage = multer.diskStorage({
    destination :(requrest , file , callback) =>{
        callback(null , "backend/images");
    },
    filename :(request , file , callback) => {
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null , Date.now() + "." + extension);
    }
})

module.exports = multer({storage : storage}).array("image" , 10);