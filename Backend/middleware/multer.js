const multer = require('multer');

const storage = multer.memoryStorage(); // Store in memory as buffer
const upload = multer({ storage: storage });

module.exports = upload;
