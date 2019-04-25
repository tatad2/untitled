var mapN, mapM; // map size 
var curX, curY; // played position 

function getId(x, y) {
    return (x - 1) * mapM + y; 
}

function getBlockEle(x, y) { 
    return document.getElementById( "block" + getId(x, y).toString() ); 
}

function toPixel(x) {
    return x.toString() + "px";
}

function createMap(n, m) {
    mapN = n; mapM = m; curX = curY = 1; 
    var ele = document.getElementById("map");
    
    for (var i = 1; i <= n; i ++) {
        var row = document.createElement("tr"); 
        ele.appendChild(row); 

        for (var j = 1; j <= m; j ++) {
            var col = document.createElement("td");
            col.id = "block" + getId(i, j);
            col.classList.add("block");
            row.appendChild(col);
        }
    }
}

function clearMap() {
    var ele = document.getElementById("map");
    while( ele.firstChild ) {
        ele.removeChild( ele.firstChild );
    }
}

function setMapPos() {
    var leftPx = ( document.body.clientWidth / 2 - 17 ) - ( curY - 1 ) * 34; 
    var topPx = ( document.body.clientHeight / 2 - 17 ) - ( curX - 1 ) * 34; 

    var mapEle = document.getElementById("map"); 
    mapEle.style.top = toPixel(topPx); 
    mapEle.style.left = toPixel(leftPx); 
}

function moveTo(x, y) {
    getBlockEle(curX, curY).classList.remove("player-on"); 
    
    curX = x; curY = y; 
    getBlockEle(x, y).classList.add("player-on"); 

    setMapPos(); 
}

var skillInfo = [
    { id: 0, page: 0, name: "test skill", pos: [20, 20], resUrl: "res/fireball.png", pre: [], learned: true, describe: "test describe" },
    { id: 1, page: 0, name: "test skill2", pos: [30, 50], resUrl: "res/fireball.png", pre: [], learned: false, describe: "test2 describe" }
];

function clearSkillPage() {
    var anc = document.getElementById("skill-body"); 
    while(anc.firstChild) anc.removeChild(anc.firstChild); 
}

function displaySkillPage(pageId) {
    clearSkillPage(); 
    var anc = document.getElementById("skill-body"); 
    var skillCount = 0; 
    
    for(var i of skillInfo) {
        if(i.page !== pageId) continue;

        var flag = true;
        for(var j of i.pre) {
            if(!skillInfo[j].learned) flag = false; 
        }
        if(!flag && !i.learned) continue;

        var newEle = document.createElement("div"); 
        newEle.id = "skill" + i.id.toString(); 

        newEle.classList.add("skill-block"); 
        if(!i.learned) newEle.classList.add("unlearned");
        
        var top = -64 * skillCount + i.pos[0];
        var left = i.pos[1]; 

        newEle.style.top = toPixel(top); 
        newEle.style.left = toPixel(left);
        newEle.style.backgroundImage = "url(" + i.resUrl + ")";
        newEle.style.backgroundSize = "cover"; 

        newEle.setAttribute("data-toggle", "popover");
        newEle.setAttribute("data-placement", "right"); 
        newEle.setAttribute("title", i.name); 
        newEle.setAttribute("data-content", i.describe); 

        anc.appendChild(newEle); 
    }
}

function displaySkillFullInfo(skillId) {
    document.getElementById("popup-background2").style.display = "";
    document.getElementById("skill-full-info-panel").style.display = "";

    var temp = document.getElementById("skill-full-info-panel-title").innerHTML;
    document.getElementById("skill-full-info-panel-title").innerHTML = skillInfo[skillId].name + temp;
}

$(document).ready( function() {

    $("#skill-open").click( function() {
        document.getElementById("popup-background").style.display = ""; 
        document.getElementById("skill-panel").style.display = ""; 
        $("#skill-body").css("height", (document.body.clientHeight * 0.7).toString() );
        displaySkillPage(0);
    } )

    $("#skill-close").click( function() {
        document.getElementById("popup-background").style.display = "none"; 
        document.getElementById("skill-panel").style.display = "none"; 
    } )
    
    $("#skill-full-info-panel").on("click", "#skill-full-info-close", function() {
        document.getElementById("popup-background2").style.display = "none"; 
        document.getElementById("skill-full-info-panel").style.display = "none"; 
    } )

    $(".skill-pages").click( function() {
        displaySkillPage( Number(this.id.slice(4)) ); // page1
    } )

    $("#skill-body").on("mouseenter", ".skill-block", function() {
        $(this).popover("show");
    } )

    $("#skill-body").on("mouseleave", ".skill-block", function() {
        $(this).popover("hide");
    } )

    $("#skill-body").on("click", ".skill-block", function() {
        $(this).popover("hide");
        displaySkillFullInfo( Number(this.id.slice(5)) ); // skill1
    } )

} )