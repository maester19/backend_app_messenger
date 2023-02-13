const express = require('express')
const router = express.Router()
const postCtrl = require('../controllers/post')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', multer, postCtrl.create);

router.get('/:id', postCtrl.getOne);

router.get('/getByUser/:id', postCtrl.getByUser);

router.put('/:id', multer, postCtrl.update);

router.delete('/:id', postCtrl.delete);

router.get('/', postCtrl.getAll);


module.exports = router