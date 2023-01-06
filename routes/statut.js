const express = require('express')
const router = express.Router()
const statutCtrl = require('../controllers/statut')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', auth, multer, statutCtrl.create);

router.get('/:id', statutCtrl.getOne);

router.put('/:id', auth, multer, statutCtrl.update);

router.delete('/:id', auth, statutCtrl.delete);

router.get('/:id', auth, statutCtrl.getAll);


module.exports = router