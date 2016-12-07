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
    if(err) {
      return res.send([err, res.cookie]);
    }
    else if(decoded === null) {
      res.send('why');
    }
    return res.send(true);
  });
});

router.post('/token', (req, res, next) => {
  var {reqEmail, reqPassword} = req.body;
  if (!reqEmail || !reqEmail.trim()) {
    return next(boom.create(400, 'Bad email or password'));
  }

  if (!reqPassword || reqPassword.length < 8) {
    return next(boom.create(400, 'Bad email or password'));
  }

  let user;

  knex('users')
    .where('email', reqEmail)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(reqPassword, user.hashed_password);
    })
    .then(() => {
      delete user.hashed_password;
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      res.cookie('token', token, {
        httpOnly: true,
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
