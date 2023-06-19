const express = require('express')
const router = new express.Router()

// Set variables
router.get('*', function(req, res, next){
  res.locals['serviceName'] = 'Maintain LLC'
  res.locals['serviceUrl'] = '/'+req.originalUrl.split('/')[1]+'/'+req.originalUrl.split('/')[2]+'/'

  next()
})





// Add your routes above the module.exports line
module.exports = router
