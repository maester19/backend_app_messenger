const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.put("/:id", userCtrl.update);

router.put("/changePW/:id", userCtrl.changePassword)

router.get("/", userCtrl.getAll)

router.get("/:id", userCtrl.getOne)

router.delete("/:id", userCtrl.delete)

module.exports = router;