const router = require('express').Router();
const configController = require('../controllers/config.controller');

router.get('/', configController.getAll);
router.get('/:key', configController.getByKey);
router.post('/', configController.createOrUpdate);
router.delete('/:key', configController.delete);

module.exports = router;
