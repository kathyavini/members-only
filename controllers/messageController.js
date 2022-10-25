const Message = require('../models/message');
const User = require('../models/user');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Display all messages on home page
exports.home = (req, res, next) => {
  console.log('INDEX HERE!');

  res.render('index', { title: 'Members Only' });
};

exports.new_message_get = (req, res, next) => {
  res.render('new-message-form', { title: 'Post a Message' });
};

exports.new_message_post = (req, res, next) => {
  // Form validation here

  // Save to database here

  console.log('ABOUT TO REDIRECT!');

  res.redirect('/');
};
