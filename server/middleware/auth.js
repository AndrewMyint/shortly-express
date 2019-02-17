const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  // check there is session on the req
  // console.log('req.cookies**********', req.cookies);
  //if (Object.keys(req.cookies).length === 0) {


  models.Sessions.create()
    .then((result) => {
      console.log(req.cookies)
      if (Object.keys(req.cookies).length === 0) {
        req.session = {
          hash: '',
          user: { username: '' },
          userId: ''
        };
        res.cookies['shortlyid'] = {
          value: ''
        };
      } else {
        req.session = {
          hash: '',
          user: { username: '' },
          userId: ''
        };
        res.cookies['shortlyid'] = {
          value: ''
        };
      }
      models.Sessions.get({ id: result.insertId })
        .then((sessionData) => {
          res.cookies.shortlyid.value = sessionData.hash;
          req.session.hash = res.cookies.shortlyid.value;
          return sessionData.userId;
          //next();
        })
        .then(() => {
          if (req.cookies.shortlyid) {
            models.Sessions.get({ hash: req.cookies.shortlyid })
              .then((sessionData) => {
                if (sessionData !== undefined && sessionData.hasOwnProperty('user')) {
                  req.session.user.username = sessionData.user.username;
                  req.session.userId = sessionData.userId;
                }
                next();
              })
          } else {
            next();
          }
        })
    })
  // models.Sessions.getAll()
  //   .then((result) => {
  //       res.cookies.shortlyid.value = result[result.length - 1].hash
  //       req.session.hash = res.cookies.shortlyid.value
  //       next()
  //     })
  // console.log('*******getAll', result[result.length - 1].hash);
  // req.session.hash = result[result.length - 1].hash;
  // res.cookies.shortlyid.value = result[result.length - 1].hash
  // console.log('res.cookies.shortlyid.value', res.cookies.shortlyid)
  //   return result[result.length - 1].hash
  // })
  // .then((result) => {
  //   return req.session.hash = result

  // })
  // .then(() => {
  //   next();
  // })
  // console.log("*******", res);


  // next();
  // how do we know if the session already exist
  // ----------------------------------------
  // what is the session, where do we add it
  // ----------------------------------------
  // console.log('response***********', res);
  // if there is a session, assign session object to request
  //if there is no session, make a session
  //then, set a new cookie on the response
  //create a new hash {} for each new session
  //then, check the session object to see, if it's assigned to user
  //if it does, it assign the username and user id to the session object
  //else clear, and reassign new cookie
  // next();

};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/