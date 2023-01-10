const express = require('express')
const router = express.Router()
const conversationCtrl = require('../controllers/conversation')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', auth, multer, conversationCtrl.create);

router.get('/:id', conversationCtrl.getOne);

router.put('/:id', auth, multer, conversationCtrl.update);

router.delete('/:id', auth, conversationCtrl.delete);

router.get('/:id', auth, conversationCtrl.getAll);


module.exports = router