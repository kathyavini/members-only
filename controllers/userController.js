const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up-form', { title: 'Sign up for an account' });
};

exports.sign_up_post = [
  // Validate and sanitize input fields with express-validator
  body('firstname', 'First name required').trim().isLength({ min: 1 }).escape(),
  body('lastname', 'Last name required').trim().isLength({ min: 1 }).escape(),
  body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
  body('password_confirm', 'Password confirmation must match password')
    .trim()
    .exists()
    .escape()
    .custom((value, { req }) => value === req.body.password),

  // Save to database
  (req, res, next) => {
    // Extract the express-validator errors
    const errors = validationResult(req).array();

    // Create new user with sanitized data
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      member: false,
      admin: false,
    });

    if (errors.length > 0) {
      // Render the form again with sanitized data and error messages
      res.render('sign-up-form', {
        title: 'Sign up for an account',
        user,
        errors,
      });
      return;
    }
    // Data from form is valid (no express-validator errors)

    // Check if username already exists
    User.findOne({ username: req.body.username }).exec((err, found_user) => {
      if (err) {
        return next(err);
      }

      if (found_user) {
        errors.push({
          msg: 'That username is already taken; please choose another one',
        });

        res.render('sign-up-form', {
          title: 'Sign up for an account',
          user,
          errors,
        });
        return;
      } else {
        // Encrypt password before saving to database
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            return next(err);
          }

          user.password = hashedPassword;

          user.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect('/');
          });
        });
      }
    });
  },
];

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

exports.membership_post = [
  // Form validation here
  body('memberKey')
    .trim()
    .optional({ checkFalsy: true })
    .exists()
    .escape()
    .custom((value) => value === process.env.MEMBERSHIP_KEY)
    .withMessage('Membership Key Incorrect'),

  body('adminKey')
    .trim()
    .optional({ checkFalsy: true })
    .escape()
    .exists()
    .custom((value) => value === process.env.ADMIN_KEY)
    .withMessage('Admin Key Incorrect'),

  (req, res, next) => {
    // Extract the express-validator errors
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      // Render the form again with sanitized data and error messages
      res.render('membership-form', {
        title: 'Become a Member',
        errors,
        keys: {
          member: req.body.memberKey,
          admin: req.body.adminKey,
        },
      });
      return;
    }

    // Save to database here (requires sessions to ID users

    res.render('welcome', {
      title: req.body.memberKey || req.body.adminKey ? 'Welcome' : 'Key Needed',
      member: req.body.memberKey ? true : false,
      admin: req.body.adminKey ? true : false,
    });
  },
];
