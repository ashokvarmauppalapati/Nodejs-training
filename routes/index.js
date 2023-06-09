const express = require('express');
const router = express.Router();

const token_service = require("../services/token.serivce");
const tokenService = new token_service.Token();

const user_controller = require("../controllers/user-controller");
const userController = new user_controller.UserController();

router.get(
    "/getToken",
    userController.getToken
)

router.get(
    "/validateToken",
    tokenService.verifyToken,
    userController.validateToken
)

router.get(
    "/getUsers",
    tokenService.verifyToken,
    userController.getUsers
)
module.exports = router
