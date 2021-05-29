const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcrypt')
const {Sex}=require('../../helpers/constants')
const SALT_WORK_FACTOR = 10

const userSchema = new Schema(
  {
    name:{
        type:String,
        minLength: 3,
        default: "Guest"
    },
    sex:{
        type:String,
        enum:{
            values:[Sex.MALE, Sex.FEMALE, Sex.NONE]
        },
        message:'It i\'snt allowed',
        default: Sex.NONE
    },
    email:{
        type:String,
        required: [true, 'Email required'],
        unique: true,
        validate(value){
            const re = /\S+@\S+.\S+/
            return re.test(String(value).toLowerCase())
        }
    },
    password:{
        type:String,
        required: [true, 'Password required'],
    },
    token:{
        type:String,
        default: null,
    }
}, 
  { versionKey: false, timestamps: true }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){return next()}
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt, null)
    next()
})

userSchema.methods.validPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = model('contact', userSchema)

module.exports = User
