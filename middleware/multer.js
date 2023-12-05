const multer = require('multer')
const upload= multer({storage:multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, file.fieldname + '-' + uniqueSuffix+'.'+file.mimetype.split('/')[1])
      }

})

})

module.exports= upload;