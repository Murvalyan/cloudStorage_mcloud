const nm = require('nodemailer')

class mailService {

    constructor() {
        this.transporter = nm.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.HOSTING_URL,
            html:
            `
                <div class="">
                    <h1>Для активации аккаунта перейдите по ссылке ниже</h1>
                    <a href=${link}>${link}</a>
                </div>
            `
        })
    }
}

module.exports = new mailService();