var player = {
    name: "player_name",
    level: 2, 
    totExp: 23,
    exp: 8, 
    needExp: 15,
    maxHp: 100, 
    hp: 80, 
    maxMp: 100, 
    mp: 40, 
    atk: 10, 
    def: 10, 
    int: 5, 
    res: 5, 
    mov: 1.5, 
    sight: 3,
}

function updateStatusBar() {

    document.getElementById("status-bar-name").innerHTML = player.name; 

    // lv
    document.getElementById("status-bar-level").innerHTML = "Lv." + player.level.toString();
    document.getElementById("status-bar-exp").innerHTML = player.exp.toString() + "/" + player.needExp.toString();

    var expPercent = player.exp / player.needExp * 100; 
    document.getElementById("status-bar-exp-progress-bar").style.width = expPercent.toString() + "%"; 

    // hp
    document.getElementById("status-bar-hp").innerHTML = player.hp.toString() + "/" + player.maxHp.toString();
  
    var hpPercent = player.hp / player.maxHp * 100; 
    document.getElementById("status-bar-hp-progress-bar").style.width = hpPercent.toString() + "%"; 
  
    // mp
    document.getElementById("status-bar-mp").innerHTML = player.mp.toString() + "/" + player.maxMp.toString();
    
    var mpPercent = player.mp / player.maxMp * 100; 
    document.getElementById("status-bar-mp-progress-bar").style.width = mpPercent.toString() + "%"; 

    // other
    document.getElementById("status-bar-atk").innerHTML = player.atk.toString();
    document.getElementById("status-bar-def").innerHTML = player.def.toString();
    document.getElementById("status-bar-int").innerHTML = player.int.toString();
    document.getElementById("status-bar-res").innerHTML = player.res.toString();
    document.getElementById("status-bar-mov").innerHTML = player.mov.toString();
}