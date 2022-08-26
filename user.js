let users = [];

function joinUser (player){
    users.push({id: player.id, playerName: player.playerName, room: player.roomId, score: 0})
}


function getRoomUsers(room){
    let roomUsers = [];
    users.map(user => {
        if(room === user.room){
            roomUsers.push(user);
        }
    })
    return roomUsers;
}

function checkUser(data){
    let memberCount = 0;
    users.map(user => {
        if(user.room === data.roomId){
            memberCount++;
        }
    })
    return memberCount;
}

function addRole(player, num){
    users.map((user) => {
        if(user.id === player.id){
            if (num === 1){
                user.role = 'x'
            }else{
                user.role = 'o'
            }
        }
    })
}

function userAppend(data){
    users.map((user, i) => {
        if(user.room === data.roomId && user.id === data.id){
            users.splice(i, 1);
        }
    })
    return users;
}

function disconnectUser(id){
    users.map((user, i) => {
        if(user.id === id){
            users.splice(i, 1)
        }
    })
}


function playerData(player){
    let currentUser;
    users.map(user => {
        if(player.id === user.id){
            currentUser = user;
        }
   })
    return currentUser;
}

function scoreInc(player){
    let player1, player2;
    users.map(user => {
        if(player.room === user.room){
            if(player.id === user.id){
                user.score += 1
                player1 = user
            }
            else{
                player2 = user
            }
        }
        
    })
    return { player1: player1, player2: player2 }
}


module.exports = { joinUser, playerData, userAppend, checkUser, addRole, disconnectUser, getRoomUsers, scoreInc }