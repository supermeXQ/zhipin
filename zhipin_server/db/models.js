/*
包含n个操作数据库集合数据的Model模块
*/

//1 链接数据库
 //引入mongoose
 let mongoose = require('mongoose');
  
 //链接指定的数据库（url 只有数据库是变化的）
 mongoose.connect('mongodb://localhost:27017/zhipin_server');
  //获取链接对象
 const conn = mongoose.connection;
 // 绑定连接完成时的监听
 conn.on('db',function(){
     console.log('db connect success!');
 })

 /*
  2.定义出对应特定集合的Model并向外暴露

 */
  //定义user的Schema(描述文档结构)
   const userSchema = mongoose.Schema({
       username:{type:String,required:true},
       password:{type:String,required:true},
       type:{type:String,required:true},
       header:{type:String},// 头像名称
       post:{type:String}, //职位
       info:{type:String}, //个人或职业简介
       company:{type:String}, //公司名称
       salary:{type:String} //工资
   })
 
   //定义Model(与集合对应,可以操作集合)
     //Model构造函数
   const UserModel = mongoose.model('user',userSchema);//集合为:user + s
    //向外暴露Model
      exports.UserModel = UserModel
    //定义user的Schema(描述文档结构)
    const chatSchema = mongoose.Schema({
      from: {type: String, required: true}, // 发送用户的 id
      to: {type: String, required: true}, // 接收用户的 id
      chat_id: {type: String, required: true}, // from 和 to 组成的字符串  分组列表显示 from to与to from同一个chart_id
      content: {type: String, required: true}, // 内容
      read: {type:Boolean, default: false}, // 标识是否已读
      create_time: {type: Number} // 创建时间
      })
      // 定义能操作 chats 集合数据的 Model
        const ChatModel = mongoose.model('chat', chatSchema)
      // 向外暴露 Model
      exports.ChatModel = ChatModel
      //exports.xxx = value 可以多次暴露
      //module.exports = xxx 只能一起暴露一次
