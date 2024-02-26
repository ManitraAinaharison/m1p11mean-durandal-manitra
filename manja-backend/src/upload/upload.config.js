const fs = require('fs');
const multer  = require('multer')

const createDirIfNotExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

const storage = (uploadDir) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            createDirIfNotExists(uploadDir);
            cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
            const randomString = Math.random().toString(36).substring(2, 15);
            cb(null, Date.now() + randomString);
        }
    })
};

module.exports.upload = (uploadDir) => {
    return multer({
        storage: storage(uploadDir),
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
}