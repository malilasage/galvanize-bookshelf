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
  res.status(200).send(false);
});

router.post('/token', (req, res, next) => {
  var reqEmail = req.body.email;
  var reqPassword = req.body.password;
  knex('users')
  .where('email', reqEmail)
  .then((result) => {
    var user = result[0];
    // if(!user) {
    //   res.send('Bad email or password.');
    // }
    // if(bcrypt.compareSync(reqPassword, user.hashed_password) !== true) {
    //   res.send('Bad email or password!');
    // }
    // delete user.hashed_password;
    // res.setHeader('Content-Type', 'text/plain');
    // res.send(user);
    res.cookie({token: true});
    res.send(user);
  });
});

module.exports = router;
