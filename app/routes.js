//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

// Clear session data without confirmation
router.get('/prototype-admin/clear-data', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})

// Grab the feature urls for the aside heroku links
router.use('/', (req, res, next) => {
  res.locals.feature = req.url
  if (req.get('host').includes('localhost')) {
    res.locals.host = true
  }
  next()
})

// Import routes from feature prototypes
router.use(/\/(.)*\/(.)*\/v([0-9]+)/, (req, res, next) => {
  return require(`./views/${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}/v${req.params[2]}/_routes`)(req, res, next);
})

// Redirect the org switcher so  it works at different levels
router.get('*/org-switch', function (req, res) {
  res.redirect(`/${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}/${req.originalUrl.split('/')[3]}/local-authorities`)
})
