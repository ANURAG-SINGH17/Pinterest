const jwt = require('jsonwebtoken');

module.exports.genterateToken = (user) => {
    return jwt.sign({email:user.email , id:user.__id} , process.env.JWT_KEY,{expiresIn:'24h'});
}