const parseCookies = (req, res, next) => {
  var cookie = {};
  if (req.headers.cookie) {
    var cookie = req.headers.cookie.split(';').reduce((acc, cur) => {
      var array = cur.trim().split('=');
      acc[array[0]] = array[1];
      return acc;
    },{});
  }
  console.log('*********', cookie);
  req.cookies = Object.assign({}, cookie);
  //console.log(req.cookies);

  next();
};

module.exports = parseCookies;