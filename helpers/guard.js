const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null
    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1]
    }
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNATHORIZED).json({
        status: 'error',
        code: HttpCode.UNATHORIZED,
        message: 'Not authorized'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
