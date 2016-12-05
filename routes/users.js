'use strict';

const express = require('express');
// require bcrypt

// eslint-disable-next-line new-cap

const router = express.Router();
const {camelizeKeys, decamelizeKeys} = require('humps');
var bcrypt = require('bcrypt');
var db = require('../knexfile.js')['development'];
var knex = require('knex')(db);
// var utils = require('../lib/utils'); then .catch(handleKnexError)

// YOUR CODE HERE

// router.get('/', (req, res, next) => {
//   res.send('Users');
// })

router.post('/users', (req, res, next) => {
  var hash = bcrypt.hashSync(req.body.password, 12);

  knex('users')
  .insert({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    hashed_password: hash
  }, '*')
  .then((result) => {
    const user = camelizeKeys(result[0]);
    delete user.hashedPassword;
    res.send(user);
  });
});

module.exports = router;
