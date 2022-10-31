const Message = require('../models/message');
const User = require('../models/user');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  // Pull message from database
  Message.find({})
    .populate('author')
    .sort({ posted: -1 })
    .exec((err, messages) => {
      if (err) {
        return next(err);
      }
      res.render('index', { title: 'Members Only', messages });
    });
};

// Delete post
exports.message_delete = (req, res, next) => {
  // Delete message from database
  console.log(req.body);
  Message.findByIdAndRemove(req.body.messageid).exec((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.new_message_get = (req, res, next) => {
  res.render('new-message-form', { title: 'Post a Message' });
};

exports.new_message_post = [
  // Validate and sanitize input fields with express-validator
  body('content', 'Message required').trim().isLength({ min: 1 }).escape(),

  // Save to database
  (req, res, next) => {
    // Extract the express-validator errors
    const errors = validationResult(req).array();

    // Create new message with sanitized data
    const message = new Message({
      content: req.body.content,
      author: res.locals.user,
      posted: new Date(),
    });

    if (errors.length > 0) {
      // Render the form again with sanitized data and error messages
      res.render('new-message-form', {
        title: 'Post a Message',
        message,
        errors,
      });
      return;
    }
    // Data from form is valid (no express-validator errors)

    message.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
];
