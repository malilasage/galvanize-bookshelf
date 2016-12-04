'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');
const boom = require('boom');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// YOUR CODE HERE
router.get('/books', function(req, res, next) {
  knex('books')
    .orderBy('title')
    .then((result) => {
      const books = camelizeKeys(result);
      res.send(books);
    });
});

router.get('/books/:id', function(req, res, next) {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((result) => {
      if(!result) {
        return next();
      }
      const book = camelizeKeys(result);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((result) => {
      const book = camelizeKeys(result[0]);
      res.send(book);
    });
});


router.patch('/books/:id', (req, res, next) => {
  var{title, author, genre, description, cover_url} = decamelizeKeys(req.body);
  knex('books')
  .where('id', req.params.id)
  .update({
    title,
    author,
    genre,
    description,
    cover_url
    }, '*')
  .then((result) => {
    res.send(camelizeKeys(result[0]));
  })
  .catch((err) => {
    next(err);
  });
});


router.delete('/books/:id', (req, res, next) => {
  var book;
  knex('books')
  .where('id', req.params.id)
  .then((result) => {
    book = result;
  });
  knex('books')
  .del()
  .where('id', req.params.id)
  .then(() => {
    res.send(camelizeKeys(book));
  })
  .catch((err) => {
    next(err);
  })
});


module.exports = router;
