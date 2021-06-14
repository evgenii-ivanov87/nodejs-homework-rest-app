const Mailgen = require('mailgen');
const { token } = require('morgan');
require('dotenv').config()

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
    #createVefifyEmail(tocken, email) {
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
                            link: `${this.link}/api/contacts/verify/${tocken}`
                        }
                    },
                   
                ]
            }
        };
        return mailGenerator.generatePlaintext(email)
    }
}
    

module.exports = EmailServices

