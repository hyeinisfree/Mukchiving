var express = require('express');

var { userService, followService } = require('../services');

// follow_receiver, follow_sender, created_at, accept
const createFollow = (req, res) => {
  var receiver = req.params.id;
  var sender = req.decoded.user_id;

  const userPrivacy = userService.userPrivacy(receiver, function(err, results){
    if(err) return;
    if(results[0]) {
      var accept = results[0].privacy;
      var data = [receiver, sender, accept];
      const createFollow = followService.createFollow(data, function(err, results){
        if(err) return;
        if(results) return res.json({success: true, message: "포스트 DB가 정상적으로 생성되었습니다."});
        return res.status(400).json({success: false, message: "포스트 DB 생성에 실패하였습니다."});
      })
    } else {
      return res.json({success: false, message: "포스트 DB 생성에 실패하였습니다."});
    }
  })
}

module.exports = {
  createFollow
}