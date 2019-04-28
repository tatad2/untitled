var map = {
    n: 3, m: 3, // size of map
    x: 3, y: 3, // position of player
    foucsx :3, foucsy :3, // pos that foucs on 
    blocked: [],
    creatureOn: [],
}

var selectPositionSize = 0; 
var selectPositionArea = []; 

function getId(x, y) {
    return (x - 1) * map.m + y; 
}

function getX(blockId) {
    return Math.floor((blockId - 1) / map.m + 1); 
}

function getY(blockId) {
    if(blockId % map.n == 0) 
        return map.n; 
    return blockId % map.n; 
}

function getBlockEle(x, y) { 
    return document.getElementById( "block" + getId(x, y).toString() ); 
}

function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2); 
}

function createMap(n, m) {
    map.n = n; map.m = m; map.x = map.y = 1; 
    var ele = document.getElementById("map");
    
    for (var i = 1; i <= n; i ++) {
        var row = document.createElement("tr"); 
        ele.appendChild(row); 

        for (var j = 1; j <= m; j ++) {
            var col = document.createElement("td");
            col.id = "block" + getId(i, j);
            
            col.classList.add("block");
            col.classList.add("fog"); 
            
            row.appendChild(col);
        
            map.blocked[getId(i, j)] = false; 
            map.creatureOn[getId(i, j)] = false; 
        }
    }
}

function clearMap() {
    var ele = document.getElementById("map");
    while( ele.firstChild ) {
        ele.removeChild( ele.firstChild );
    }
}

function setMapPos(x, y) {
    if(x < 1 || x > map.n) return; 
    if(y < 1 || y > map.m) return; 

    map.foucsx = x; map.focusy = y; 
    var leftPx = ( document.body.clientWidth / 2 - 17 ) - ( y - 1 ) * 34; 
    var topPx = ( document.body.clientHeight / 2 - 17 ) - ( x - 1 ) * 34; 

    var mapEle = document.getElementById("map"); 
    mapEle.style.top = toPixel(topPx); 
    mapEle.style.left = toPixel(leftPx); 
}

function clearFog(sight) {
    for(var i = map.x - sight; i <= map.x + sight; i ++)
        for(var j = map.y - sight; j <= map.y + sight; j ++ ) {
            if( i < 1 || i > map.n ) continue;
            if( j < 1 || j > map.m ) continue;

            if( getDistance(map.x, map.y, i, j) > sight ) continue; 
            getBlockEle(i, j).classList.remove("fog"); 
        }

    updateEnemyOnMap();
}

function updateSingleEnemyOnMap(enemy) {
// insert an enemy to the map
    var ele = document.getElementById("block" + getId(enemy.x, enemy.y).toString()); 
    if(!ele.classList.contains("fog")) ele.style.backgroundImage = "url(" + enemy.resUrl + ")"; 
    map.creatureOn[getId(enemy.x, enemy.y)] = true; 
}

function updateEnemyOnMap() {
    for(var i of curEnemy) updateSingleEnemyOnMap(i); 
}

function removeEnemyOnMap(enemy) {
    document.getElementById("block" + getId(enemy.x, enemy.y).toString()).style.backgroundImage = ""; 
    map.creatureOn[getId(enemy.x, enemy.y)] = false; 
}

function checkPosMovedTo(x, y) {
// to check if a position can be moved to; 
    if(x < 1 || x > map.n) return false;
    if(y < 1 || y > map.m) return false;
    if(map.blocked[getId(x, y)]) return false; 
    return true; 
}

function moveTo(x, y) {
    if(map.creatureOn[getId(x, y)]) {
        console.log("error: can't move, there has been a creature on target block; map.js function moveTo()"); return;
    }

    getBlockEle(map.x, map.y).classList.remove("player-on"); 
    map.creatureOn[getId(map.x, map.y)] = false;

    map.x = x; map.y = y;
    getBlockEle(x, y).classList.add("player-on"); 
    map.creatureOn[getId(x, y)] = true;

    clearFog(player.sight); 
    setMapPos(map.x, map.y); 
}

function mapMoveStep(moveX, moveY) {
    if( !checkPosMovedTo(map.x + moveX, map.y + moveY) ) return;
    moveTo(map.x + moveX, map.y + moveY); 
}

function selectPosMouseon(blockId) {
    var x = getX(blockId); 
    var y = getY(blockId); 

    var id = 0, p = 0; 
    for(var i = x - (selectPositionSize - 1) / 2; i <= x + (selectPositionSize - 1) / 2; i ++)
        for(var j = y - (selectPositionSize - 1) / 2; j <= y + (selectPositionSize - 1) / 2; j ++ ) {
            ++ id; 
            if( i < 1 || i > map.n ) continue;
            if( j < 1 || j > map.m ) continue;

            if(id != selectPositionArea[p]) continue; 
            p ++; getBlockEle(i, j).style.backgroundColor = "#90EE90";  
        }
}

function selectPosMouseleave(blockId) {
    var x = getX(blockId); 
    var y = getY(blockId); 

    var id = 0, p = 0; 
    for(var i = x - (selectPositionSize - 1) / 2; i <= x + (selectPositionSize - 1) / 2; i ++)
        for(var j = y - (selectPositionSize - 1) / 2; j <= y + (selectPositionSize - 1) / 2; j ++ ) {
            ++ id; 
            if( i < 1 || i > map.n ) continue;
            if( j < 1 || j > map.m ) continue;

            if(id != selectPositionArea[p]) continue; 
            p ++; getBlockEle(i, j).style.backgroundColor = "";  
        }
}

function selectPosClick(blockId) {
    selectPosMouseleave(blockId); 
    if(!selectPositionCheck(blockId)) return; 

    selectPositionRes = blockId; 
}

async function selectPosition(size, area, check) {
// enter a screen that let player select an area
// return the mid point or -1
//   
// size = 3, area = [2, 4, 5, 6] : 
// oxo
// xxx
// ooo
    
    statement = "selectPosition"; 

    $("#popup-background3").css("display", ""); 
    $("#map").css("z-index", "250"); 

    selectPositionCheck = check; 
    selectPositionSize = size; 
    selectPositionArea = area; 
    selectPositionRes = 0; 

    while(selectPositionRes === 0)
        await sleep(1000);

    $("#popup-background3").css("display", "none"); 
    $("#map").css("z-index", "0"); 

    statement = "normal"; 
    setMapPos(map.x, map.y); 

    return selectPositionRes; 
}

async function getCreatureTarget(size, area) {
    var midpoint = await selectPosition(size, area, () => { return true; }); 

    var range = [], target = []; 

    var x = getX(midpoint), y = getY(midpoint); 
    for(var i = x - (selectPositionSize - 1) / 2; i <= x + (selectPositionSize - 1) / 2; i ++)
        for(var j = y - (selectPositionSize - 1) / 2; j <= y + (selectPositionSize - 1) / 2; j ++ ) {
            ++ id; 
            if( i < 1 || i > map.n ) continue;
            if( j < 1 || j > map.m ) continue;

            if(id != selectPositionArea[p]) continue; p ++; 
            range.push( getId(x, y) );
    }

    for(var i of range) {
        if(i === getId(map.x, map.y)) {
            target.push("player"); continue;
        }

        for(var j = 0; j < curEnemy.length; j ++) {
            if(j.cleared) continue;
            if(i === getId(j.x, j.y)) {
                target.push("enemy" + j.toString()); break;
            }
        }
    }

    return target;
}