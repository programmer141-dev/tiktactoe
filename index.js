const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const socketIo = require('socket.io')
const { joinUser, playerData, userAppend, checkUser, addRole, disconnectUser, getRoomUsers } = require('./user')


app.use(express.static(path.join(__dirname, 'public')))

const io = socketIo(server)

const PORT = 8000 || process.env.PORT
server.listen(PORT, () => {
    io.on('connection', (socket) => {
        socket.on('joinGame', (data) => {
            joinUser(data);
            let userCount = checkUser(data);
            if (userCount <= 2) {
                socket.join(data.roomId)
                addRole(data, userCount)
                let roomUsers = getRoomUsers(data.roomId)
                io.to(data.roomId).emit('joinGame', roomUsers);
                socket.emit('msg', { msg: 'Entered into game', errCode: false })
            } else {
                let users = userAppend(data);
                console.log(users)
                socket.emit('msg', { msg: 'room is already filled', errCode: true })
            }
        })
        socket.on('player', player => {
            let user = playerData(player)
            let position = player.position
            io.to(user.room).emit('player', {...user, position})
        })
        socket.on('disconnect', () => {
            disconnectUser(socket.id)
        })
    })
    console.log('server stated')
})