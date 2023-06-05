const userService = require("../service/user.service")

class authController {

    async reg(req, res, next) {
        try {
            const { email, phone, password, secret } = req.body
            const userData = await userService.reg(email, phone, password, secret)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password, secret} = req.body
            const userData = await userService.login(email, password, secret)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json(token)
        } catch (err) {
            next(err)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.HOSTING_URL)
        } catch (err) {
            next(err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {secret} = req.body
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken, secret)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch (err) {
            next(err)
        }
    }

}

module.exports = new authController()