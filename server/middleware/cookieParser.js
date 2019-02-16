const parseCookies = (req, res, next) => {
  if (req.headers.cookie) {
    var cookies = req.headers.cookie.split('; ').reduce(function (cookies, cur) {
      var array = cur.split('='); // [shortly, 'asdfwefasdfwe];
      cookies[array[0]] = array[1]; // {shortly : 'asdfasdfasd'}
      return cookies;
    }, {});
    //console.log('cookies@@@@@@@@@@@@@@@@@@@@@@@', cookies);
    req.cookies = Object.assign({}, cookies);
  }
  next();
};

module.exports = parseCookies;

