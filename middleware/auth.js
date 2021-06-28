require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    let jwt_secret = process.env.ACCESS_TOKEN_SECRET;

    req.decoded = jwt.verify(token, jwt_secret);
    return next();
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      console.log(req.decoded);
      return res.status(419).json({success: false, message : "token 만료"});
    }
    return res.status(401).json({success: false, message : "token이 유효하지 않습니다."});
  }
}