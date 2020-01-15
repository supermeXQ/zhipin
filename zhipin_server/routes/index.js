var express = require("express");
var router = express.Router();
const {UserModel} = require('../db/models');
const md5 = require('blueimp-md5');
const filter = {password:0,__v:0};
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});
//注册一个路由用户注册
//回调函数 获取请求参数 处理请求 返回响应
router.post("/register", function(req, res, next) {
  console.log("正在进行注册");
  //1.获取请求参数
     const {username,password,type} = req.body;
  //2.处理请求
     //判断用户是否已经存在,如果存在则返回错误的提示，如果不存在，则保存并提示用户注册成功
       // 根据username查询
        UserModel.findOne({username},function(err,user){
          if(user&& err == null){
            res.send({code:-1,msg:'此用户已存在'})
          }else{
          new UserModel({username,password:md5(password),type}).save(function(err,user){
              //修改为session
             res.cookie('userid',user._id,{maxAge:1000*60*60*24*3});//持久化cookie
              const data = {username,type,_id:user._id} //响应数据不要带着password
              res.send({code:0,data})
            })
            
          }
        })
});
 //登录的路由
  router.post("/login",function(req,res){
    const {username,password} = req.body;
    //根据username password查询数据库users如果没有返回提示错误的信息，如果有,返回登录成功信息 user
    UserModel.findOne({username,password:md5(password)},filter,function(err,user){
      if(user){ //登陆成功
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*3})
        res.send({code:0,data:user})
      }else{   //登录失败
       res.send({code:-1,msg:"用户或密码不正确"});
      }
    })
  })
module.exports = router;
