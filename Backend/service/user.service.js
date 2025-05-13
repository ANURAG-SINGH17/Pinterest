const userModel =  require('../models/user.model');

module.exports.createUser = async ({username , email, password }) => {
    
    try{
        const user = await userModel.create({
            username ,
            password ,
            email ,
        })
        const userObject = user.toObject();
        delete userObject.password;

        return userObject;
    }catch(err){
        console.log(err);
    }
}