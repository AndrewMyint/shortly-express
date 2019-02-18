const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const parseCookies = require('./middleware/cookieParser');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(parseCookies);
app.use(Auth.createSession);

app.get('/',
  (req, res) => {
    res.render('index');
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/signup', (req, res, next) => {
  // console.log('**************',Object.keys(req));
  models.Users.create(req.body)
    .then(user => {
      // console.log(res.hearders);
      models.Sessions.update({hash: req.session.hash}, {userId: user.insertId});
      res.redirect('/');
      console.log('***********', req.session, req.cookies.hash);
      console.log('resssssss', res.cookies);
      // res.status(200).send(user);
      return user;
    })
    .catch(err => {
      if (err.code === 'ER_DUP_ENTRY')
      res.redirect('/signup');
    });
});

app.get('/logout', (req, res, next) => {
  // models.Sessions.getAll()
  // .then((result) => {
  //   console.log('**************result', result);
  //   // console.log('*****************', req.cookies)
  // })
  // .catch((err) => {
  //   console.log('err%$$$$$$$$$',err);
  // })
  // // session has no hash (problem)
  // console.log('***********req', req.cookies.hash);

  // console.log('**************session', req.session);
  // // res.clearCookie('shortlyid');

  models.Sessions.delete({hash : req.session.hash})
  .then(() => {
    // res.clearCookie('shortlyid');
    console.log('************res', res.cookies);
   res.redirect('/');
  })
  .catch((err) => {
    console.log('err from logout', err);
  })
})

app.post('/login', (req, res, next) => {
  var username = {username : req.body.username}
  models.Users.get(username)
  .then((user) => {
   // console.log('************',models.Users.compare(req.body.password, user.password, user.salt));
    if (user) {
      if (models.Users.compare(req.body.password, user.password, user.salt)) {
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    } else if (!user){
      res.redirect('/login');
    }
  })
  .catch((err) => {
    console.log('this is error', err);
  });
});


//  delete(options) {
//   let parsedOptions = parseData(options);
//   let queryString = `DELETE FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')}`;
//   return executeQuery(queryString, parsedOptions.values);
// }
/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
