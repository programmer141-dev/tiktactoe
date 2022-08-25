const box4 = document.getElementsByClassName('outer-box4')[0]
const box3 = document.getElementsByClassName('outer-box')[0]

let boxes;

const player1 = 'x'
const player2 = 'o'
let player = player1;

let gameMode = '3x3';
let player1Name, player2Name, pname;


function setGameMode (mode) {
    gameMode = mode
}

let posibilities;



function play() {
    player1Name = document.getElementsByClassName('inp')[0].value
    player2Name = document.getElementsByClassName('inp')[1].value
    if(player1Name != null && player1Name != '' && gameMode != null){
        document.getElementsByClassName('enterForm')[0].style.display = 'none'
        boxes = gameMode === '4x4' ? box4.querySelectorAll('.box') : box3.querySelectorAll('.box');
        if (gameMode === '4x4'){
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
        }else{
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
        playing();
    }
}





function playing () {
    boxes.forEach((item) => {
        console.log(item)
        item.addEventListener('click', () => {
            let toeItem = item.getElementsByClassName('toe')[0];
            if (player === player1) {
                toeItem.textContent = player2;
                player = player2;
                pname = player2Name;
            } else {
                toeItem.textContent = player1;
                player = player1;
                pname = player1Name;
            }
            if(checkToes()){
                let winner = `${pname} won the match`
                document.getElementsByClassName('winner')[0].textContent = winner
                document.getElementsByClassName('mat')[0].style.display = 'block'
            }
        }, { once: true })
    })
}

function checkToes () {
    const toes = gameMode === '3x3' ? box3.querySelectorAll('.toe') : box4.querySelectorAll('.toe');
    console.log(posibilities)
    return posibilities.some((posibility) => {
        return posibility.every((item) => {
            return toes[item].textContent === player
        })
    })
}