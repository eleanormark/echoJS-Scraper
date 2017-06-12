var express = require('express')
var viewController = require('../controllers/view_controller.js')

const router = express.Router()

module.exports = router
  .get('/', viewController.home)
