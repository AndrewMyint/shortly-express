const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

 
  // request without cookies
  if (Object.keys(req.cookies).length === 0) {
    req.session = {
      hash: '',
      user: {
        username: ''
      },
      userId: ''
    };
    res.cookies['shortlyid'] = {
      value: ''
    };
    // createSession(requestWithCookies, secondResponse, function () {
    //   var session = requestWithCookies.session;
    //   expect(session).to.be.an('object');
    //   expect(session.hash).to.exist;
    //  // console.log('session.hash == > cookie***********', session.hash);
    //   expect(session.hash).to.be.cookie;
    //   done(); 
    // });
    models.Sessions.create()
      .then((result) => {
        models.Sessions.get({
            id: result.insertId
          })
          .then((result) => {
            req.session.hash = result.hash;
            res.cookies.shortlyid.value = req.session.hash;
            next();
          });
      });

  // request with cookie (maybe also wrong cookie)
  } else {
    req.session = {
      hash: '',
      user: {
        username: ''
      },
      userId: ''
    };
    res.cookies['shortlyid'] = {
      value: ''
    };

    models.Sessions.get({
        hash: req.cookies.shortlyid
      })
      .then((result) => {
        if (result && result.user) {
          req.session.user.username = result.user.username;
          req.session.userId = result.user.id;    
        } else {
          // if req.cookies is not in database
          res.cookies.shortlyid.value = '';
        }
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/