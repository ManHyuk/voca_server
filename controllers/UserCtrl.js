'use strict';

const userModel = require('../models/UserModel');
const config = require('../config/config');
const resMsg = require('../errors.json');

/*******************
 *  Register
 ********************/
exports.register = async(req, res, next) => {

  if (!req.body.id || !req.body.pw1 ||!req.body.pw2|| !req.body.nickname ) {
    return res.status(400).end();
  }

  let pw;
  if (req.body.pw1 !== req.body.pw2) {
    return res.status(400).end()
  } else {
    pw = req.body.pw1
  }

  let result = '';
  try {
    const user_data = {
      id: req.body.id,
      pw: config.do_cipher(pw),
      nickname: req.body.nickname,
      // img: req.file

    };

    result = await userModel.register(user_data);

  } catch (error) {
    // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
    //   if (isNaN(error)) {
    //     // console.log(error);
    //     return res.status(500).json(resMsg[9500]);
    //   } else {
    //     console.log(error);
    //     return res.status(400).json(resMsg[8400]);
    //   }
      console.log(error);
      return next(error)
  }

  // success
  return res.status(201).json(result[0]);


};

exports.check = async(req, res, next) => {
  let result = '';
  try {
    const userData = req.body.id;
    result = await userModel.check(userData);
  } catch (error) {
    // console.log(error); // 1401
    if (isNaN(error)) {
      // console.log(error);
      return res.status(500).json(resMsg[9500]);
    } else {
      // console.log(error);
      return res.status(409).json(resMsg[1401]);
    }
  }

  // FIXME 리턴값 수정하기
  return res.status(200).json(result);


};

/*******************
 *  Login
 ********************/
exports.login = async(req, res, next) => {

  if (!req.body.id || !req.body.pw) {
    return res.status(400).end();
  }

  let result = '';

  try {
    const user_data = {
      user_id: req.body.id,
      user_password: config.do_cipher(req.body.pw)
    };

    result = await userModel.login(user_data);
  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};


exports.profile = async(req, res, next) => {
  let result ='';
  try {
    const userData = req.user_idx;

    result = await userModel.profile(userData)

  } catch (error) {
    console.log(error);
    return next(error)
  }
  return res.json(result);
};


