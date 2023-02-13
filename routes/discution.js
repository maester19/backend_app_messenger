const express = require('express')
const router = express.Router()
const discutionCtrl = require('../controllers/discution')

const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.post('/', multer, discutionCtrl.create);

// router.get('/:id', discutionCtrl.getOne);

router.get('/getByUser/:id', discutionCtrl.getByUser);

router.put('/:id', multer, discutionCtrl.update);

router.delete('/:id', discutionCtrl.delete);

router.get('/:id', discutionCtrl.getAll);


module.exports = router