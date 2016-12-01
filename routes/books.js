'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// YOUR CODE HERE
router.get('/books', function(req, res, next) {
  knex('books')
    .orderBy('title')
    .then((result) => {
      const book = camelizeKeys(result);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', function(req, res, next) {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if(!book) {
        return next();
      }
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
