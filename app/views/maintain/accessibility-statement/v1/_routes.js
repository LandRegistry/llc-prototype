const express = require('express')
const router = new express.Router()

// Set variables
router.get('*', function(req, res, next) {
  res.locals['serviceName'] = 'Maintain Local Land Charges'
  res.locals['serviceUrl'] = '/' + req.originalUrl.split('/')[1] + '/' + req.originalUrl.split('/')[2] + '/'
  res.locals['htmlClasses'] = 'maintain'
  res.locals['signedIn'] = true

  // Decision not to have the org switcher for now and put the name in the header instead of
  // the service name, but keeping this here in case we want it in the future.
  // res.locals['orgSwitcher'] = true


  next()
})

router.post('/set-amendment-threshold/select-la', function(req, res) {
  res.redirect('thresholds')
})

router.post('/set-amendment-threshold/thresholds', function(req, res) {
  res.redirect('confirmation')
})

router.get('/dashboard', function(req, res, next) {
  req.session.destroy()
  next()
})





// Add your routes above the module.exports line
module.exports = router
