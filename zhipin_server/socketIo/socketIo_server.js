const { ChatModel } = require('../db/models')
module.exports = function(server) {
    const io = require('socket.io')(server)
    //监视客户端与服务器端的链接
    io.on('connection', function(socket) {
        console.log('有一个客户端连上了服务器')
        socket.on('sendMsg', function({ from, to, content }) {
            console.log('服务端接收到客户端发送的消息', { from, to, content })
            const chat_id = [from, to].sort().join('_') // from_to or to_from 为同一组数据
            const create_time = Date.now()
            const chatModel = new ChatModel()
            new ChatModel({ from, to, content, chat_id, create_time }).save(
                function(error, chatMsg) {
                    //向所有在线连接的客户端发送消息
                    io.emit('receiveMsg', chatMsg)
                }
            )
        })
    })
}
