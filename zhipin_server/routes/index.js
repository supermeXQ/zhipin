var express = require('express')
var router = express.Router()
const { UserModel, ChatModel } = require('../db/models')
const md5 = require('blueimp-md5')
const filter = { password: 0, __v: 0 }
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})
//注册一个路由用户注册
//回调函数 获取请求参数 处理请求 返回响应
router.post('/register', function(req, res, next) {
    console.log('正在进行注册')
    //1.获取请求参数
    const { username, password, type } = req.body
    //2.处理请求
    //判断用户是否已经存在,如果存在则返回错误的提示，如果不存在，则保存并提示用户注册成功
    // 根据username查询
    UserModel.findOne({ username }, function(err, user) {
        if (user && err == null) {
            res.send({ code: -1, msg: '此用户已存在' })
        } else {
            new UserModel({ username, password: md5(password), type }).save(
                function(err, user) {
                    //修改为session
                    res.cookie('userid', user._id, {
                        maxAge: 1000 * 60 * 60 * 24 * 3
                    }) //持久化cookie
                    const data = { username, type, _id: user._id } //响应数据不要带着password
                    res.send({ code: 0, data })
                }
            )
        }
    })
})
//登录的路由
router.post('/login', function(req, res) {
    const { username, password } = req.body
    //根据username password查询数据库users如果没有返回提示错误的信息，如果有,返回登录成功信息 user
    UserModel.findOne({ username, password: md5(password) }, filter, function(
        err,
        user
    ) {
        if (user) {
            //登陆成功
            res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 3 })
            res.send({ code: 0, data: user })
        } else {
            //登录失败
            res.send({ code: -1, msg: '用户或密码不正确' })
        }
    })
})
//user更新路由
router.post('/update', function(req, res) {
    console.log('成功连接update')
    //从请求的cookie得到userId
    const userId = req.cookies.userid
    const user = req.body
    if (!userId) {
        return res.send({ code: -1, msg: '请先登录' })
    }
    //如果userId存在则根据userId更新对应的user文档
    UserModel.findByIdAndUpdate({ _id: userId }, user, function(err, oldUser) {
        if (!oldUser) {
            //通知浏览器删除userid cookies
            res.clearCookie('userid', userId)
            res.send({ code: -1, msg: '请先登录' })
        } else {
            const { _id, username, type } = oldUser
            const data = Object.assign(user, { _id, username, type })
            res.send({ code: 0, data })
        }
    })
})
//根据(cookie里的userid)获取用户信息的路由
router.get('/user', function(req, res) {
    //从请求的cookie得到userId
    const userId = req.cookies.userid
    if (!userId) {
        return res.send({ code: -1, msg: '请先登录' })
    }
    UserModel.findOne({ _id: userId }, filter, function(error, user) {
        if (!error) {
            res.send({ code: 0, data: user })
        }
    })
})
//获取指定(用户类型)的用户列表
router.post('/userlist', (req, res) => {
    const { type } = req.body
    console.log(type)
    UserModel.find({ type }, filter, function(error, user) {
        if (error) {
            res.send({ code: -1, msg: '获取列表失败' })
        } else {
            res.send({ code: 0, data: user })
        }
    })
})
/*
获取当前用户所有相关聊天信息列表
*/
router.get('/msglist', function(req, res) {
    // 获取 cookie 中的 userid
    const userid = req.cookies.userid
    // 查询得到所有 user 文档数组
    UserModel.find(function(err, userDocs) {
        // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
        const users = {} // 对象容器
        userDocs.forEach(doc => {
            users[doc._id] = { username: doc.username, header: doc.header }
        })
        /*
  查询 userid 相关的所有聊天信息
  参数 1: 查询条件
  参数 2: 过滤条件
  参数 3: 回调函数
  '$or':[{},{}]为或者的查询条件
  */
        ChatModel.find(
            { $or: [{ from: userid }, { to: userid }] },
            filter,
            function(err, chatMsgs) {
                // 返回包含所有用户和当前用户相关的所有聊天消息的数据
                res.send({ code: 0, data: { users, chatMsgs } })
            }
        )
    })
})
/*
  修改指定消息为已读
  */
router.post('/readmsg', function(req, res) {
    // 得到请求中的 from 和 to
    const from = req.body.from
    const to = req.cookies.userid
    /*
更新数据库中的 chat 数据
参数 1: 查询条件
参数 2: 更新为指定的数据对象
参数 3: 是否 1 次更新多条, 默认只更新一条
参数 4: 更新完成的回调函数
{multi:true} 一次更新多条数据
*/
    ChatModel.update(
        { from, to, read: false },
        { read: true },
        { multi: true },
        function(err, doc) {
            console.log('/readmsg', doc)
            res.send({ code: 0, data: doc.nModified }) // 更新的数量
        }
    )
})
module.exports = router
