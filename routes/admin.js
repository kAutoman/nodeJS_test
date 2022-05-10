const express = require('express');
const router = express.Router();
const db = require('../common/database');
const common = require('../common/functions');

/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description 1.) Create an API where the administration can sign up an account
 * */
router.post('/signup', function(req, res) {
  common.signUp(req,res);
});

/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description  2.) Create an API where the administrator can sign in an account
 * */
router.post('/signin', function(req, res) {
  common.signIn(req,res);
});

/**
 * @author Hu Zhi Xing
 * @since 2022/05/10
 * @description 6.) Create an API where it returns hello world using authorization header with JWT Token and this API can only be access by admin
 * */
router.get('/helloworld', function(req, res) {
  if (req.headers['is_admin']){
    return res.json('hello world');
  }
  else {
    return res.status(400).json('only admin can access');
  }
});


module.exports = router;
