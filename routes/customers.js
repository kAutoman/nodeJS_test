const express = require('express');
const router = express.Router();
const common = require('../common/functions');

/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description 4.) Create an API where the customer can sign up an account
 * */
router.post('/signup', function(req, res) {
  common.signUp(req,res);
});

/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description 3.) Create an API where the customer can sign in an account
 * */
router.post('/signin', function(req, res) {
  common.signIn(req,res);
});


/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description 7.) Create an API where it returns hello world using authorization header with JWT Token and this API can only be access by the customer
 * */
router.get('/helloworld', function(req, res) {
  console.log(req.user);
  if (!req.headers['is_admin']){
    return res.json('hello world');
  }
  else {
    return res.status(400).json('only customer can access');
  }
});

module.exports = router;