const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // check there is session on the req
  // console.log('req.cookies**********', req.cookies);
  //if (Object.keys(req.cookies).length === 0) {
  // if there is no req.cookies
  if (req.cookies.hasOwnProperty('shortlyid') && req.cookies.shortlyid) {
    models.Sessions.get({ hash: req.cookies.shortlyid })
      .then((sessionData) => {
        if (sessionData === undefined) {
          req.session = {};
          models.Sessions.create()
            .then((result) => {
              models.Sessions.get({ id: result.insertId })
                .then((sessionData) => {
                  req.session.hash = sessionData.hash;
                  // res.cookies.shortlyid.value = req.session.hash
                  res.cookies = {
                    shortlyid: {
                      value: req.session.hash
                    }
                  };
                  res.cookie('shortlyid', req.session.hash);
                  next();
                });
            });
        } else {
          req.session = {
            hash: '',
          };
          req.session.hash = sessionData.hash;
          if (sessionData.user) {
            req.session.user = {};
            req.session.user.username = sessionData.user.username;
            req.session.userId = sessionData.userId;
          }
          next();
        }
      }).catch((err) => {
        console.log('Error From Session', err);
      });
  }
  // if there is cookies along with browser (including the mallicious cookies)
  else {
    req.session = {};
    models.Sessions.create()
      .then((result) => {
        models.Sessions.get({ id: result.insertId })
          .then((sessionData) => {
            req.session.hash = sessionData.hash;
            res.cookies = {
              shortlyid: {
                value: req.session.hash
              }
            };
            // res.cookies.shortlyid.value =
            res.cookie('shortlyid', req.session.hash);
            next();
          });
      }).catch((err) => {
        console.log('Error From Session', err);
      })
  }
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.checkUser = (req, res, next) => {
  if (req.session.hasOwnProperty('userId')) {
    next();
  } else {
    res.redirect('/login');
    res.status(401).send();
  }
}