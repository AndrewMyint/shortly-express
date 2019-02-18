const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // check there is session on the req
  // console.log('req.cookies**********', req.cookies);
  //if (Object.keys(req.cookies).length === 0) {
  // if there is no req.cookies
  if (req.cookies && Object.keys(req.cookies).length === 0) {
    req.session = {
      hash: '',
      user: { username: '' },
      userId: ''
    };
    res.cookies = {
      shortlyid: {
        value: ''
      }
    };
    models.Sessions.create()
      .then((result) => {
        models.Sessions.get({ id: result.insertId })
          .then((sessionData) => {
            req.session.hash = sessionData.hash;
            res.cookies.shortlyid.value = req.session.hash;
             res.cookie('shortlyid', req.session.hash);
            next();
          });
      }).catch((err) => {
        console.log('Error From Session', err);
      })
  }
  // if there is cookies along with browser (including the mallicious cookies)
  else {
    req.session = {
      hash: '',
      user: { username: '' },
      userId: ''
    };
    res.cookies = {
      shortlyid: {
        value: ''
      }
    };
    // console.log('req****************',req.res);
    models.Sessions.get({ hash: req.cookies.shortlyid })
      .then((sessionData) => {
        if (sessionData && sessionData.hasOwnProperty('user')) {
          req.session.hash = sessionData.hash;
          req.session.user.username = sessionData.user.username;
          req.session.userId = sessionData.userId;
          res.cookie('shortlyid', req.session.hash);

        } else if (sessionData === undefined) {
          models.Sessions.create()
            .then((result) => {
              models.Sessions.get({ id: result.insertId })
                .then((sessionData) => {
                  res.cookies.shortlyid.value = sessionData.hash;
                  req.session.hash = res.cookies.shortlyid.value;
                  res.cookie('shortlyid', req.session.hash);
                });
            });
        } else {
          res.cookies.shortlyid.value = '';
        }
        next();
      }).catch((err) => {
        console.log('Error From Session', err);
      });
  }
  // });
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/