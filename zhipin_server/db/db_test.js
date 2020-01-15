/*mongoose 操作 mongo数据库*/
//一.链接数据库
//1.引入mongoose
let mongoose = require('mongoose');
const md5 = require('blueimp-md5');
//2.链接数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test');
//1.3 获取链接对象
const conn = mongoose.connection;
//1.4 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据连接成功');
})
/*2.得到特定集合的model (文档和集合)*/
//文档的数据类型为对象 集合的数据类型为数组
//2.1 定义Schema(描述文档结构)
 const userSchema = mongoose.Schema({
     //指定文档的结构:属性名/属性值的类型,是否必须，默认值
     username:{type:String,require:true},//用户名
     password:{type:String,require:true},//密码
     type:{type:String,require:true},//用户类型 dashen/loaban
     header:{type:String} //头像 不是必须的
 })
 
 //2.2 定义Model(与集合对应，可以操作集合) 构造函数
 const UserModel = mongoose.model('user',userSchema) //集合的名称为users
 /*3. 通过Model或其实例对集合进行CRUD 操作*/
// 3.1 通过MOdel 实例的save()添加数据
function testSave(){
    //在UserModel里填入数据
  const userModel = new UserModel({username:'Mike',password:md5('234'),type:'laoban'});
  //调用save()进行保存
  userModel.save(function(err,userDoc){
    console.log('save()',err,userDoc);

  })
}
// testSave();


//3.2 通过Model 的find()/findOne()查找多个或一个数据
function testFind(){
    UserModel.find(function(error,users){
        console.log('find()',error,users);
    })
    UserModel.findOne({_id:'5e16f97f171183081f256aaa'},function(error,user){
         console.log('findOne()',error,user)
    })
}
//testFind();


//3.3 通过 Model 的findByIdAndUpdate()更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'5e16f97f171183081f256aaa'},{username:'qiang'},function(error,oldUser){
        console.log('update',error,oldUser);
        
    })
}
//testUpdate();
//3.4 通过Model 的remove()删除匹配的数据
function testDelete(){
UserModel.remove({_id:'5e16f97f171183081f256aaa'},function(error,doc){
    console.log(error,doc);
})
}
testDelete();