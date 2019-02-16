const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  // check there is session on the req
  // console.log('req.cookies**********', req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    req.session = {
      hash: ''
    };
    res.cookies['shortlyid'] = {
      value: ''
    };
  } 
  // how do we know if the session already exist
  if (req.session) {
    // console.log("req.cookies.shortlyid*********", req.cookies.shortlyid);
    console.log('res.cookies.shortlyid.value********,', res.cookies.shortlyid.value);
    console.log('req.session', req.session);
    req.session.hash = res.cookies.shortlyid.value;
  }
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
  next();

};
// createSession(requestWithoutCookie, response, function () {
//   var cookie = response.cookies.shortlyid.value;
//   var secondResponse = httpMocks.createResponse();
//   var requestWithCookies = httpMocks.createRequest();
//   requestWithCookies.cookies.shortlyid = cookie;

//   createSession(requestWithCookies, secondResponse, function () {
//     var session = requestWithCookies.session;
//     expect(session).to.be.an('object');
//     expect(session.hash).to.exist;
//     expect(session.hash).to.be.cookie;
//     done(); 

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/