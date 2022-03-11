const router = require('express').Router();

router.use(require('./user'));
router.use(require('./movie'));

module.exports = router;
