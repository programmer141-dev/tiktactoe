const socket = io();

const box4 = document.getElementsByClassName('outer-box4')[0]
const box3 = document.getElementsByClassName('outer-box')[0]


let boxes;



let gameMode = '3x3';
let playername, roomId;


function setGameMode(mode) {
    gameMode = mode
}

let posibilities;



function play() {
        playername = document.getElementById('player-name').value;
        roomId = document.getElementById('room-id').value;
        boxes = gameMode === '4x4' ? box4.querySelectorAll('.box') : box3.querySelectorAll('.box');
        if (gameMode === '4x4') {
            document.getElementsByClassName('outer-box')[0].style.display = 'none'
            posibilities = [
                [0, 1, 2],
                [4, 5, 6],
                [8, 9, 10],
                [0, 4, 8],
                [1, 5, 9],
                [2, 6, 10],
                [2, 5, 8],
                [0, 5, 10],
                [1, 2, 3],
                [5, 6, 7],
                [9, 10, 11],
                [3, 7, 11],
                [1, 6, 11],
                [3, 6, 9],
                [12, 13, 14],
                [4, 8, 12],
                [5, 9, 13],
                [6, 10, 14],
                [6, 9, 12],
                [4, 9, 14],
                [13, 14, 15],
                [7, 11, 15],
                [7, 10, 13],
                [5, 10, 15]
            ]
        } else {
            document.getElementsByClassName('outer-box4')[0].style.display = 'none'
            posibilities = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [2, 4, 6],
                [0, 4, 8]
            ]
        }
        socket.emit('joinGame', {id: socket.id, playerName: playername, roomId: roomId})
        socket.on('msg', (msg) => {
            if(msg.errCode){
                document.getElementsByClassName('winner')[0].textContent = msg.msg
            }else{
                document.getElementsByClassName('enterForm')[0].style.display = 'none';
                document.getElementsByClassName('data')[0].style.display = 'flex';
                document.getElementsByClassName('winner')[0].textContent = msg.msg
                console.log('none')
            }
        })
        playing();
}



let gamer;
function playing() {
    boxes.forEach((item, i) => {
        item.addEventListener('click', () => {
            socket.emit('player', {id:socket.id, position: i});
        }, { once: true })
    })
}


setTimeout(() => {
    socket.on('joinGame', (users) => {
        console.log(users[0])
        document.getElementById('player1').textContent = users[0].playerName
        document.getElementById('player2').textContent = users[1].playerName
    })
    socket.on('player', (player) => {
        ////
        if(gameMode === '3x3'){
            box3.getElementsByClassName('toe')[player.position].textContent = player.role;
        }else{
            box4.getElementsByClassName('toe')[player.position].textContent = player.role;
        }
        gamer = player.role;
        console.log(player)
        if (checkToes()) {
            let winner = `${player.playerName} won the match`
                document.getElementsByClassName('winner')[0].textContent = winner
            }
    })
}, 0010)


function checkToes() {
    const toes = gameMode === '3x3' ? box3.querySelectorAll('.toe') : box4.querySelectorAll('.toe');
    return posibilities.some((posibility) => {
        return posibility.every((item) => {
            return toes[item].textContent === gamer
        })
    })
}