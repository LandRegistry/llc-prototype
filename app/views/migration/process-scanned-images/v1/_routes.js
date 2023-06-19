const express = require('express')
const router = new express.Router()

// Set variables
router.get('*', function(req, res, next){
  res.locals['serviceName'] = 'Training'
  res.locals['serviceUrl'] = '/'+req.originalUrl.split('/')[1]+'/'+req.originalUrl.split('/')[2]+'/'
  res.locals['htmlClasses'] = 'maintain'
  res.locals['signedIn'] = true

  next()
})





// Add your routes above the module.exports line
module.exports = router
