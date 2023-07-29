const bananoJs = window.bananocoinBananojs;
bananoJs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");
//banSearch();

async function History(addr) {
    let history = await bananoJs.getAccountHistory(addr, 10);
    history = history["history"];
    return history;
}
  
async function banSearch(addr) {
    let banAddress = $("#input").val();
    if(banAddress.indexOf("ban_") == -1) {
        banAddress = addr;
    }
    if (bananoJs.getBananoAccountValidationInfo(banAddress)["valid"]) {
        let balance = await bananoJs.getAccountBalanceRaw(banAddress) / 100000000000000000000000000000;
        balance = balance.toFixed(2) + " BAN"; 
        let history = await History(banAddress);
        
        $("#transactions").empty();

        for (let i = 0; i < history.length; i++) {
            let createP = document.createElement("p");
            let sent = "send" == history[i]["type"];
            let from;
            let date = new Date(history[i]["local_timestamp"] * 1000).toLocaleString();
            sent ? (from = "to") : (from = "from");
            sent ? (sent = "sent") : (sent = "received");
            createP.innerHTML = sent + " " + (Math.round(history[i]["amount_decimal"] * 100) / 100).toFixed(2) + " ban <br /><strong>" + from + ": " + history[i]["account"] + "</strong><br>at " +  date;
            $("#transactions").append(createP);
        }
        
        $("#monkey-image").empty();
        $("#monkey-image").prepend("<img src='https://monkey.banano.cc/api/v1/monkey/" + banAddress + "'>");
        
        $("#address").empty();
        $("#address").text(banAddress);
        
        $("#balance").empty();
        $("#balance").text(balance);
        
    } else {
        console.log("error/");
        //TODO Handle Erros
    }
}

$(document).ready(function() {

    $("#searchBan").on("click", function() {
  
    });
    
    $("#where_do_i_find_my_address").on("click", function() {
        var newURL = "https://www.reddit.com/message/compose/?to=banano_tipbot&subject=command&message=address";
        chrome.tabs.create({ url: newURL });
        return false;
    });
      
    $("#whats_tip_bot").on("click", function() {
        var newURL = "https://github.com/BananoCoin/banano_reddit_tipbot#banano-reddit-tipbot";
        chrome.tabs.create({ url: newURL });
        return false;
    });
    $("#connect").on("click", function() {
        let banAddress = $("#input").val();
        console.log(banAddress);
        if (bananoJs.getBananoAccountValidationInfo(banAddress)["valid"]) {
            chrome.storage.local.set({ "bannaddress": banAddress }, function(){ 
                console.log('saved');
            });
        } else {
            console.log('error');
        }
    });
    
    chrome.storage.local.get(/* String or Array */["bannaddress"], function(items){
        if(typeof items.bannaddress  === 'undefined') {
            console.log("no address saved");
        } else {
            console.log(items.bannaddress);
        }
    });

});