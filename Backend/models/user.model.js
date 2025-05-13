const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:[5,'Fullname must be at least 5 character long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minlength:[5,'Email must be at least 5 character long']
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[8,'Password must be at least 8 character long']
    },
    profilePicture:{
        type:String,
        default:'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'
    },
    profilePicturePublicId: {  
        type: String,
        default: ''
    },
    bio:{
        type:String,
        default:'No bio yet',
        maxlength:[200,'Bio must be at most 200 character']
    },
    website:{
        type:String,
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    savedPins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pin'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },

},
    {timestamps:true}
);

const userModel = mongoose.model('User' , userSchema);

module.exports = userModel;