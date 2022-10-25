const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up-form', { title: 'Sign up for an account' });
};

exports.sign_up_post = (req, res, next) => {
  // Form validation here

  // Save to database here

  res.redirect('/');
};

exports.log_in_get = (req, res, next) => {
  res.render('log-in-form', { title: 'Log in to your account' });
};

exports.log_in_post = (req, res, next) => {
  // Form validation here

  res.redirect('/');
};

exports.membership_get = (req, res, next) => {
  res.render('membership-form', { title: 'Become a member' });
};

exports.membership_post = (req, res, next) => {
  // Form validation here

  // Save to database here

  res.redirect('/');
};
