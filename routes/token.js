'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bodyParser = require('body-parser');
const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

// YOUR CODE HERE
router.get('/token', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if(err || decoded === null) {
      return res.send(false);
    }
    else {
      return res.send(true);
    }
  });
});

router.post('/token', (req, res, next) => {
  var {email, password} = req.body;
  if (!email || !email.trim()) {
    return next(boom.create(400, 'Bad email or password'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Bad email or password'));
  }

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(row[0]);

      return bcrypt.compare(password, user.hashed_password);
    })
    .then(() => {
      delete user.hashed_password;
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.cookie('token', token, {
        path: '/',
        httpOnly: true
      });
      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
  });

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send(true);
});

module.exports = router;
