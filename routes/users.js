'use strict';

const express = require('express');
// require bcrypt

// eslint-disable-next-line new-cap

const router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../knexfile.js')['development'];
var knex = require('knex')(db);
// var utils = require('../lib/utils'); then .catch(handleKnexError)

// YOUR CODE HERE

// router.get('/', (req, res, next) => {
//   res.send('Users');
// })

router.post('/', (req, res, next) => {
  var hash = bcrypt.hashSync(req.body.password, 8);
  var 

  knex('users')
  .where({username: req.body.username})
  .then(function(results) {
    if(!results) {
      knex('users')
      .insert({
        first_name: req.body.username,
        last_name: req
        hashed_password: hash,
      }, '*')
      .then(function(result) {
        res.send('User Created');
      })
      .catch(function(err) {
        next(err);
      });
    }else {
      res.status(400).send('User already exists');
    }
  })
})

module.exports = router;
