const Mailgen = require('mailgen');


class EmailServices {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = 'http://localhost:3000'
                break;
            case 'production':
                this.link = 'link from production '
                break;
            default:
                this.link = 'http://localhost:3000'
                break;
        }
    }
    #createVefifyEmail(token, email) {
        const mailGenerator = new Mailgen({
            theme: 'salted',
            product: {
                name: 'Contacts',
                link: this.link
            }
        })
    
        const email = {
            body: {
                action: [
                    {
                        instructions: 'To get started with Contacts, please click here:',
                        button: {
                            color: '#22BC66',
                            text: 'Confirm your account',
                            link: `${this.link}/api/contacts/verify/${token}`
                        }
                    },
                   
                ]
            }
        };
        return mailGenerator.generatePlaintext(email)
    }
    async sendeVirifyPasswordEmail(token, email, name){
         const emailBody = this.#createVefifyEmail(token, email)
         const result = await this.sender.send({
             to: email, subject: 'Verify your account', html: emailBody
         })
         console.log(result)
    }
}
    

module.exports = EmailServices

