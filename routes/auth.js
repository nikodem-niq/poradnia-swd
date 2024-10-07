import express from 'express';
import { login } from '../controller/authenticate/login.js';
import sessionStorage from 'sessionstorage';

const router = express.Router();

router.get('/logout', (req, res) => {
  if(req.cookies["userData"]) {
    res.clearCookie("userData");
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

router.post('/login', function (req, res, next) {

  const pin = req.body.pin;
  let loginResult = login(pin);
      if (loginResult[0]) {
          res.cookie("userData", loginResult[1]);
          sessionStorage.setItem('user', loginResult[1]);
         res.redirect('/')
      } else {
          res.render('index.pug', {
              error: true
          });
      }
  });

export default router;