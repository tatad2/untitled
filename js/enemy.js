var enemyInfo = [
    {
        name: "test enemy", 
        maxHp: 30, maxMp: 10,
        hp: 30, mp: 10, atk: 5, def: 5, int: 0, res: 0, 
        x: 0, y: 0, // position
        sight: 3, 
        attackRange: 1,
        skill: [],
        exp: 1, 
        resUrl: "res/slime.png",
        cleared: false,
    }
]

var curEnemy = []; 

function clearEnemy() {
    curEnemy = []; 
}

function insertEnemy(enemyId, x, y) {
    var newEnemy = enemyInfo[enemyId]; 
    newEnemy.x = x; newEnemy.y = y;  
    curEnemy.push(newEnemy); 
}

function eraseEnemy(id) {
    curEnemy[id].cleared = true;
}   

function generateEnemy(enemyId, x, y) {
    if(map.creatureOn[getId(x, y)]) {
        console.log("error: can't move, there has been a creature on target block; enemy.js function generateEnemy()"); return;
    }
    insertEnemy(enemyId, x, y); 
    updateSingleEnemyOnMap(curEnemy[curEnemy.length - 1]);
}