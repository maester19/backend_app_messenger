const express = require('express')
const router = express.Router()
const repertoireCtrl = require('../controllers/repertoire')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', multer, repertoireCtrl.create);

router.get('/:id', repertoireCtrl.getOne);

router.put('/:id', multer, repertoireCtrl.update);

router.delete('/:id', auth, repertoireCtrl.delete);

router.get('/getByUser/:id', repertoireCtrl.getByUser)

router.get('/', repertoireCtrl.getAll);


module.exports = router