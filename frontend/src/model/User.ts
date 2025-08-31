import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    _id:string;
    content:string;
    createdAt:Date;
}


const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;  
    verifyCodeExpiry:Date;  
    isVerified:boolean
    isAcceptingMessage:boolean;
    messages:Message[]
}

const UserSchema:Schema<User> = new Schema(
    {
        username:{type:String,required:[true,"Username is required"],unique:true,
            trim:true
        },
        email:{type:String,required:[true,"Email is required"],unique:true,match:[/.+\@.+\..+/,"Please use valid email address"]},
        password:{type:String,required:[true,"Password is required"]},
        verifyCode:{type:String,required:[true,"Verification code is required"]},
        isVerified:{type:Boolean,default:false},
        verifyCodeExpiry:{type:Date,required:[true,"Verification code expiry is required"]},
        isAcceptingMessage:{type:Boolean,required:true},
        messages:[ MessageSchema]
    }
)

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema)
// in the above line left of || is used to check if the model is already created or not and right of || is used to create the model if it is not created


export default UserModel;