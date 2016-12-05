'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// YOUR CODE HERE
router.get('/token', (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      return res.send(false);
    }
    res.send(true);
  });
});

router.post('/token', (req, res, next) => {
  var {reqEmail, reqPassword} = req.body;
  var token;
  knex('users')
  .where('email', reqEmail)
  .then((result) => {
    var user = result[0];
    if(!user) {
      res.send('Bad email or password.');
    }
   if(bcrypt.compareSync(reqPassword, user.hashed_password)) {
      res.send('Bad email or password!');
    }
    else {
      delete user.hashed_password;
      var expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
      token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '3h'})
    res.cookie('token', token, {
      httpOnly: true,
      expires: expiry,
      // secure: router.get('env') === 'production'
    });
  }
    res.send(user);
    })
  });

module.exports = router;
