const express = require('express')
const router = express.Router()
const repertoireCtrl = require('../controllers/repertoire')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', auth, multer, repertoireCtrl.create);

router.get('/:id', repertoireCtrl.getOne);

router.put('/:id', auth, multer, repertoireCtrl.update);

router.delete('/:id', auth, repertoireCtrl.delete);

router.get('/:id', auth, repertoireCtrl.getAll);


module.exports = router