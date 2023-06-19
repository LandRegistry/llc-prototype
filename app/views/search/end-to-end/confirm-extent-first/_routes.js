const express = require('express')
const router = new express.Router()

// Set variables
router.all('*', function(req, res, next){
  res.locals['serviceName'] = 'Search for local land charges'
  res.locals['serviceUrl'] = '/'+req.originalUrl.split('/')[1]+'/'+req.originalUrl.split('/')[2]+'/'
  res.locals['signedIn'] = true

  next()
})

router.post('/search', function (req, res) {
  const search = req.session.data['search']

  if (search.length == 0) {
    res.render('search/end-to-end/v2/search', {
      error: 'Enter a postcode or street name'
    })
  } else if (search == 'KY15 5EH') {
    res.redirect('no-dice')
  } else {
    res.redirect('results')
  }
})





// Add your routes above the module.exports line
module.exports = router
