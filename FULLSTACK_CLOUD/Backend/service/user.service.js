const pl = require("../db/pool")
const b = require('bcrypt')
const uuid = require('uuid')
const mailService = require("./mail.service")
const tokenService = require("./token.service")
const UserDto = require("../dtos/user-dto")
const ApiError = require('../exceptions/api.error')

class userService {

    async reg (email, phone, password, secret) {
        const candidate = await pl.query(`SELECT * FROM human WHERE email = $1`, [email])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует!`)
        }
        const hashPassword = await b.hash(password + secret, 12)
        const activationLink = uuid.v4()

        const user = await pl.query(`INSERT INTO human (email, phone, password, activationLink) VALUES ($1, $2, $3, $4) RETURNING *`, [email, phone, hashPassword, activationLink])
        // await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)

        const userDto = new UserDto(user.rows[0])
        const tokens = await tokenService.generateTokens({...userDto}, secret)
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async login (email, password, secret) {
        const userData = await pl.query(`SELECT * FROM human WHERE email = $1`, [email])
        if(!userData.rows[0]) {
            throw ApiError.BadRequest('Пользователь с таким email не найден!')
        }
        const isPassTrue = await b.compare(password+secret, userData.rows[0].password)
        if (!isPassTrue) {
            throw ApiError.BadRequest('Неверный пароль!')
        }
        const userDto = new UserDto(userData.rows[0])
        const tokens = await tokenService.generateTokens({...userDto}, secret)
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async activate (activationLink) {
        const userData = await pl.query(`SELECT * FROM human WHERE activationLink = $1`, [activationLink])
        if (!userData.rows[0]) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        await pl.query(`UPDATE human SET isActivated = true WHERE id = $1`, [userData.rows[0].id])
    }

    async refresh (refreshToken, secret) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const validateData = tokenService.validateRefreshToken(refreshToken, secret)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!validateData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await pl.query(`SELECT * FROM human WHERE id = $1`, [tokenFromDb.rows[0].human_id])
        const userDto = new UserDto(userData.rows[0])
        const tokens = await tokenService.generateTokens({...userDto}, secret)
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

}

module.exports = new userService();