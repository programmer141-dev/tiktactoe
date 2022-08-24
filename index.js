const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const socketIo = require('socket.io')
const { joinUser, playerData, userAppend, checkUser, addRole, disconnectUser, getRoomUsers, scoreInc } = require('./user')


app.use(express.static(path.join(__dirname, 'public')))

const io = socketIo(server)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    io.on('connection', (socket) => {
        let roomName;
        socket.on('joinGame', (data) => {
            joinUser(data);
            let userCount = checkUser(data);
            if (userCount <= 2) {
                socket.join(data.roomId)
                roomName = data.roomId
                addRole(data, userCount)
                let roomUsers = getRoomUsers(data.roomId)
                io.to(data.roomId).emit('joinGame', roomUsers);
                socket.emit('msg', { msg: 'Entered into game', errCode: false })
            } else {
                let users = userAppend(data);
                socket.emit('msg', { msg: 'room is already filled', errCode: true })
            }
        })
        socket.on('player', player => {
            let user = playerData(player)
            let position = player.position
            io.to(user.room).emit('player', {...user, position})
        })
        socket.on('eventChange', state => {
            socket.to(roomName).emit('eventChange', state)
        })
        socket.on('score', player => {
            if(player.id === socket.id){
                const score = scoreInc(player)
                io.to(roomName).emit('score', score)
            }
        })

        socket.on('disconnect', () => {
            disconnectUser(socket.id)
        })
    })
    console.log('server stated')
})