const express = require('express')
const router = express.Router()
const messageCtrl = require('../controllers/message')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', multer, messageCtrl.create);

// router.get('/:id', messageCtrl.getOne);

router.put('/:id', multer, messageCtrl.update);

router.delete('/:id', messageCtrl.delete);

router.get('/:id', messageCtrl.getAll);


module.exports = router