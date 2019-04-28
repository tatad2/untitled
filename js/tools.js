function sleep(ms){
    return new Promise( (resolve) => { 
        setTimeout(resolve,ms)
    } );
}

var inputNumber = 1 << 30; 

function checkInput() {
    var input = document.getElementById("number-input-input").value; 

    for(var i = 0; i < input.length; i ++)
        if(input[i] < "0" || input[i] > "9") return;

    inputNumber = Number(input); 
    console.log(inputNumber);
}

async function getInputNumber(title, button)
{
    document.getElementById("number-input-title").innerHTML = title; 
    document.getElementById("number-input-button").innerHTML = button; 

    statement = "getInputNumber"; 

    $("#popup-background3").css("display", ""); 
    $("#number-input-panel").css("display", ""); 

    while(inputNumber === (1 << 30))
        await sleep(1000);

    $("#popup-background3").css("display", "none"); 
    $("#number-input-panel").css("display", "none"); 

    statement = "normal"; 
    
    return inputNumber; 
}