const Router = require('express').Router
const route = new Router()
const authController = require('../controllers/auth.controller');

route.post('/reg', authController.reg)
route.post('/login',  authController.login)
route.post('/logout',  authController.logout)
route.get('/activate/:link',  authController.activate)
route.get('/refresh',  authController.refresh)

module.exports = route;
