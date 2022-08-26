const socket = io();

const box4 = document.getElementsByClassName('outer-box4')[0]
const box3 = document.getElementsByClassName('outer-box')[0]


let boxes;
let gameMode = '3x3';
let playername, roomId;
let posibilities;
let gameEvent = 'click';
let player1Name, player2Name;
let player1Score = 0;
let player2Score = 0;
let winner;

function setGameMode(mode) {
    gameMode = mode
}


function play() {
        playername = document.getElementById('player-name').value;
        roomId = document.getElementById('room-id').value;
        boxes = gameMode === '4x4' ? box4.querySelectorAll('.box') : box3.querySelectorAll('.box');
        
        if(playername != "" && roomId != ""){
            if (gameMode === '4x4') {
                document.getElementsByClassName('outer-box')[0].style.display = 'none'
                document.getElementsByClassName('outer-box4')[0].style.display = 'grid'
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
            socket.emit('joinGame', { id: socket.id, playerName: playername, roomId: roomId })
            socket.on('msg', (msg) => {
                if(msg.errCode){
                    document.getElementsByClassName('winner')[0].textContent = msg.msg
                }else{
                    document.getElementsByClassName('enterForm')[0].style.display = 'none';
                    document.getElementsByClassName('data')[0].style.display = 'flex';
                    document.getElementsByClassName('winner')[0].textContent = msg.msg
                }
            })
            playing();
        }else{
            document.getElementsByClassName('winner')[0].textContent = "fields cant be empty"
        }
    }
    
    setInterval(() => {
        if(gameEvent === 'none'){
            document.getElementsByClassName('mat')[0].style.display = 'block'
        }else{
            document.getElementsByClassName('mat')[0].style.display = 'none'
        }
    }, 0100)
    
    socket.on('joinGame', (users) => {
        console.log(users)
        if(users.length <= 1){gameEvent = 'none'}else{gameEvent = 'block'}
        setInterval(() => {
            checkGameOver()
            player1Name = users[1].playerName;
            player2Name = users[0].playerName
            document.getElementById('player1').textContent = `${player1Name} ${player1Score}`
            document.getElementById('player2').textContent = `${player2Name} ${player2Score}`
        }, 500)
    })
    socket.on('player', (player) => {
        if (gameMode === '3x3') {
            box3.getElementsByClassName('toe')[player.position].textContent = player.role;
        } else {
            box4.getElementsByClassName('toe')[player.position].textContent = player.role;
        }
        gamer = player.role;
        if (checkToes()) {
            socket.emit('score', player);
            socket.on('score', results => {
                console.log(results)
                player1Score = results.player1.score
                player2Score = results.player2.score
            })
            let msg = `${player.playerName} got a point`
            document.getElementsByClassName('winner')[0].textContent = msg
        }
    })
socket.on('eventChange', state => gameEvent = state)

function checkGameOver(){
    let count=0;
    boxes.forEach((item) => {
        if (item.getElementsByClassName('toe')[0].textContent === ''){
            count++
        }
    })
    if(count === 0){
        gameEvent = 'block'
        let msg;
        if(player1Score > player2Score){
            winner = player1Name;
            msg = `${winner} won the game`
        }else if(player1Score === player2Score){
            msg = 'Game tied'
        }else{
            winner = player2Name
            msg = `${winner} won the game`
        }
        document.getElementsByClassName('winner')[0].textContent = msg
    }
}


let gamer;
function playing() {
    boxes.forEach((item, i) => {
            item.addEventListener('click', () => {
                if (item.getElementsByClassName('toe')[0].textContent === null ||
                    item.getElementsByClassName('toe')[0].textContent === ''
                ) {
                    socket.emit('player', { id: socket.id, position: i });
                    socket.emit('eventChange', state = 'click')
                    gameEvent = 'none';
                }
            }, { once: true })
    })
}



function checkToes() {
    const toes = gameMode === '3x3' ? box3.querySelectorAll('.toe') : box4.querySelectorAll('.toe');
    return posibilities.some((posibility, i) => {
        if(posibility.every((item) => {
            return toes[item].textContent === gamer
        })){
            posibilities.splice(i, 1)
            return true
        }else false
    })
}