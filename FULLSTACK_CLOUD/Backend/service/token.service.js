const jwt = require('jsonwebtoken')
const b = require('bcrypt')
const pl = require('../db/pool')
class tokenService {
    async generateTokens(payload, secret) {
        const accessToken = jwt.sign(payload, secret, { expiresIn: '24h' })
        const refreshToken = jwt.sign(payload, secret, {expiresIn: '7d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async validateAccessToken (token, secret) {
        try {
            const userData = jwt.verify(token, secret)
            return userData
        } catch (err) {
            return null
        }
    }

    async validateRefreshToken (token, secret) {
        try {
            const userData = jwt.verify(token, secret)
            return userData
        } catch (err) {
            return null
        }
    }

    async saveToken (userId, refreshToken) {
        const tokenData = await pl.query(`SELECT * FROM token WHERE human_id = $1`, [userId])
        if (tokenData.rows[0]) {
            await pl.query(`UPDATE token SET refreshToken = $1 WHERE human_id = $2 RETURNING *`, [refreshToken, userId])
            return tokenData 
        }
        const token = await pl.query(`INSERT INTO token (refreshToken, human_id) VALUES ($1, $2) RETURNING *`, [refreshToken, userId])
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await pl.query(`DELETE FROM token WHERE refreshToken = $1 RETURNING *`, [refreshToken])
        return tokenData
    }

    async findToken (refreshToken) {
        const tokenData = await pl.query(`SELECT * FROM token WHERE refreshToken = $1`, [refreshToken])
        return tokenData
    }
}

module.exports = new tokenService();