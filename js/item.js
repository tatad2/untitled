let itemInfo = [
    {
        id: 0,
        name: "test item", 
        type: [], 
        cnt: 2, 
        resUrl: "res/fireball.png",
        describe: "test describe", 
        canUse: true,
    }, 

    {
        id: 1,
        name: "potion", 
        type: [], 
        cnt: 12, 
        resUrl: "res/potion.png",
        describe: "回复 50 hp", 
        canUse: true,
        batchUse: true,
        targetType: "self",
        effect: function(target) {
            target.hp = Math.min(target.hp + 50, target.maxHp); return target; 
        },
        size: 0, area: [],  // range 
    }, 
]

function makeEffectOnCreature(effect, target) {
    for(var i of target) {
        if(i === "player") {
            player = effect(player); updateStatusBar();
        }
        else { // enemy0
            enemyId = Number(i.slice(5));   
            curEnemy[enemyId] = effect(curEnemy[enemyId]); 
        }
    }
}

function useItem(itemId) {
// return -1 as a cancelled of using
    var cur = itemInfo[itemId]; 
    if(cur.cnt == 0) {
        console.log("error: can't use, not enough item; item.js function useItem()"); return;
    } 

    itemInfo[itemId].cnt --; 

    if(cur.targetType === "self" || cur.targetType === "creature") {
        var target;

        if(cur.targetType === "self") { target = ["player"]; }
        if(cur.targetType === "creature") { target = getCreatureTarget(cur.size, cur.area); }
            
        if(target === -1) return -1; 
 
        makeEffectOnCreature(cur.effect, target); 
    
        displayInventory();
    }

    // on map 
}

async function batchUseItem(itemId) {
    var num = await getInputNumber("How many?", "OK"); 
    for(var i = 1; i <= num; i ++) useItem(itemId); 
}

async function dropItem(itemId) {
    var num = await getInputNumber("How many", "Drop");
    itemInfo[itemId].cnt = Math.max(0, itemInfo[itemId].cnt - num); 
    displayInventory();  
}