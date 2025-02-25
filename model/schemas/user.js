const mongoose = require('mongoose')
const { Schema } = mongoose
const { Subscription } = require('../../helpers/constants')
const bcrypt = require('bcryptjs')
const SALT_FACTOR = 6

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // validate(value) {
    //   const re = /\S+@\S+\.\S+/gi
    //   return re.test(String(value).toLowerCase())
    // }
  },
  subscription: {
    type: String,
    enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
    default: Subscription.STARTER
  },
  token: {
    type: String,
    default: null,
  },

//   versionKey: false,
//   timestamps: true,
//   toObject: {
//     virtuals: true,
//     transform: function (doc, ret) {
//       delete ret._id
//       delete ret.fullName
//       return ret
//     }
//   },
//   toJSON: {
//     virtuals: true,
//     transform: function (doc, ret) {
//       delete ret._id
//       delete ret.fullName
//       return ret
//     }
//   }
})

// userSchema.virtual('fullName').get(function () {
//   return `This is contact ${this.name} - phone number ${this.phone}`
// })

// userSchema.path('name').validate((value) => {
//   const re = /[A-Z]\w+ [A-Z]\w+/
//   return re.test(String(value))
// })

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password)
}

const User = mongoose.model('user', userSchema)

module.exports = User
