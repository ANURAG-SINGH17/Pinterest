const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        maxlength:[500 , 'description less then 500 character']
    },
    image:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true
    },
    savedBy:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId ,
                ref:'User',
            },
            name:{
                type:String,
                required:true
            }
        }
    ],
    comments:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId ,
                ref:'User',
                required:true
            },
            name:{
                type:String ,
                required:true
            },
            comment:{
                type:String ,
                required:true
            }

        }
    ],
    createdAt:{
        type:Date ,
        default:Date.now
    },
},
    {timestamps:true}
);

const pinModel = mongoose.model('Pin' , pinSchema);
module.exports = pinModel