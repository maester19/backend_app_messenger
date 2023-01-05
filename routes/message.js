const express = require('express')
const router = express.Router()
const messageCtrl = require('../controllers/message')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', auth, multer, messageCtrl.create);

// router.get('/:id', messageCtrl.getOne);

router.put('/:id', auth, multer, messageCtrl.update);

router.delete('/:id', auth, messageCtrl.delete);

router.get('/:id', auth, messageCtrl.getAll);


module.exports = router