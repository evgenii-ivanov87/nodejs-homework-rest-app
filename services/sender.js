const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const configMail = require('../config/config')
require('dotenv').config()

class CreateSenderSendgrid {
    async send(msg){
     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            
       return await sgMail
          .send({...msg, from: configMail.email.sendgrid})

    }
}

class CreateSenderNodemailer {
    async send(msg){
        const config = {
            host: 'smtp.meta.ua',
            port: 465,
            secure: true,
            auth: {
              user: 'goitnodejs@meta.ua',
              pass: process.env.PASSWORD,
            },
          }
          
          const transporter = nodemailer.createTransport(config)
          const emailOptions = {
            from: configMail.email.nodemailer,
            ...msg,
          }
          
          return await transporter
            .sendMail(emailOptions)
    }
}

module.exports = {
    CreateSenderSendgrid,
    CreateSenderNodemailer
}