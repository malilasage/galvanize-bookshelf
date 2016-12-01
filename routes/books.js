'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');

// YOUR CODE HERE
router.get('/books', function(_req, res, next) {
  knex('books').orderBy('id').then((books) => {
    res.send(books);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
