statement = "normal"; 

function toPixel(x) {
    return x.toString() + "px";
}

function toPrecent(x) { 
    return ( x * 100 ).toString() + "%";
}

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

        if(!i.learned) continue;

        var levelEle = document.createElement("div");
        levelEle.id = "skill-level" + i.id.toString(); 

        levelEle.classList.add("progress"); 

        levelEle.style.top = "120%"; 
        levelEle.style.position = "absolute"; 
        levelEle.style.width = "100%"; 
        levelEle.style.height = "20%";

        var levelUpProgress = toPrecent(i.progress); 
        levelEle.innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + levelUpProgress + ';"></div>'

        newEle.appendChild(levelEle); 
    }
}

function displaySkillFullInfo(skillId) {
    var curSkill = skillInfo[skillId];

    document.getElementById("popup-background2").style.display = "";
    document.getElementById("skill-full-info-panel").style.display = "";

    document.getElementById("skill-full-info-icon").style.backgroundImage = "url(" + skillInfo[skillId].resUrl + ")";
    
    var name = curSkill.name; 
    if(!curSkill.learned) name = name + " (not learned)"
    else name = name + " (Lv " + curSkill.level.toString() + ")";
    document.getElementById("skill-full-info-name").innerHTML = name; 

    var flag = skillInfo[skillId].learned;
    var learnEle = document.getElementById("skill-full-info-learn");
    
    if(flag) learnEle.setAttribute("disabled", "disabled");
    else learnEle.removeAttribute("disabled"); 
    learnEle.innerHTML = flag ? "learned" : "learn"; 

    document.getElementById("skill-full-info-description").innerHTML = skillInfo[skillId].describe;

    document.getElementById("skill-full-info-progress-bar").innerHTML = toPrecent(skillInfo[skillId].progress);
    document.getElementById("skill-full-info-progress-bar").style.width = toPrecent(skillInfo[skillId].progress);
}

function clearInventory() {
    var anc = document.getElementById("inventory-body"); 
    while(anc.firstChild) anc.removeChild(anc.firstChild); 
}

function displayInventory() {
    clearInventory();
    var anc = document.getElementById("inventory-body"); 
    
    for(var i of itemInfo) {
        if(i.cnt === 0) continue;
        
        // main element

        var newEle = document.createElement("div");

        newEle.id = "inventory" + i.id.toString();
        newEle.classList.add("inventory-block"); 

        newEle.style.backgroundImage = "url(" + i.resUrl + ")";

        // newEle.setAttribute("data-toggle", "popover");
        // newEle.setAttribute("data-placement", "right"); 
        // newEle.setAttribute("title", i.name); 
        // newEle.setAttribute("data-content", i.describe);

        anc.appendChild(newEle);

        // cnt element

        var cntEle = document.createElement("div"); 
        
        cntEle.id = "inventory-cnt" + i.id.toString(); 
        cntEle.classList.add("inventory-block-cnt"); 
        cntEle.innerHTML = i.cnt.toString(); 

        newEle.appendChild(cntEle); 

        cntEle.style.top = toPixel( newEle.offsetHeight - cntEle.offsetHeight - 2 );    
   
        // dropdown element

        var dropEle = document.createElement("div"); 

        dropEle.id = "inventory-drop" + i.id.toString(); 
        dropEle.classList.add("dropdown"); 

        dropEle.innerHTML =
        '\
        <div href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"> </div>\
        <ul class="dropdown-menu inventory-dropdown" aria-labelledby="inventory-drop'  + i.id.toString() + '">\ '
            + (i.canUse ? '<li><a onclick="useItem(' + i.id.toString() +  ')">Use</a></li>\ ' : '') +
            '<li><a onclick="displayItemInfo(' + i.id.toString() +  ')">Info</a></li>\
        </ul>\
        ';

        newEle.appendChild(dropEle);

    }
}

function displayItemInfo(itemId)
{
    var curItem = itemInfo[itemId];

    document.getElementById("popup-background2").style.display = "";
    document.getElementById("item-info-panel").style.display = "";

    document.getElementById("item-info-icon").style.backgroundImage = "url(" + curItem.resUrl + ")";

    document.getElementById("item-info-name").innerHTML = curItem.name; 

    document.getElementById("item-info-amount").innerHTML = "amount: " + curItem.cnt.toString(); 

    var useEle = document.getElementById("item-info-use");

    if(!curItem.canUse) useEle.setAttribute("disabled", "disabled");
    else useEle.removeAttribute("disabled"); 
    useEle.innerHTML = "use"; 

    document.getElementById("item-info-description").innerHTML = curItem.describe;
}

function openDropdown(id) { 
    document.getElementById(id).classList.add("open"); 
}

function closeDropdown(id) {
    document.getElementById(id).classList.remove("open"); 
}

function onKeyDown(keyId) {
    if(keyId == 87) mapMoveStep(-1, 0);
    if(keyId == 65) mapMoveStep(0, -1);
    if(keyId == 83) mapMoveStep(1, 0);
    if(keyId == 68) mapMoveStep(0, 1);  
}

$(document).ready( function() {

    // skill

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
    
    $("#skill-full-info-close").click( function() {
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

    // inventory

    $("#inventory-open").click( function() {
        document.getElementById("popup-background").style.display = ""; 
        document.getElementById("inventory-panel").style.display = ""; 
        $("#inventory-body").css("height", (document.body.clientHeight * 0.7).toString() );
        displayInventory();
    } )

    $("#inventory-close").click( function() {
        document.getElementById("popup-background").style.display = "none"; 
        document.getElementById("inventory-panel").style.display = "none"; 
    } )

    $("#inventory-body").on("mouseenter", ".inventory-block", function() {
        var id = "inventory-drop" + this.id.slice(9); 
        openDropdown(id); 
    } )

    $("#inventory-body").on("mouseleave", ".inventory-block", function() {
        var id = "inventory-drop" + this.id.slice(9); 
        closeDropdown(id); 
    } )

    $("#item-info-close").click( function() { 
        document.getElementById("popup-background2").style.display = "none"; 
        document.getElementById("item-info-panel").style.display = "none"; 
    } )

    // map

    $(".block").hover( function() {
        if(statement === "selectPosition") {
            selectPosMouseon(this.id.slice(5)); return;
        }
        $(this).css("background", "#90EE90"); 
    }, function() {
        if(statement === "selectPosition") {
            selectPosMouseleave(this.id.slice(5)); return;
        }
        $(this).css("background", ""); 
    } )

    $(".block").click( function() {
        if(statement === "selectPosition") {
            selectPosClick(this.id.slice(5)); return;
        }
    } )

    $(document).keydown( function(event) {
        onKeyDown(event.which); 
    } )
} )