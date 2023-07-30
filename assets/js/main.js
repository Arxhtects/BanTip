const bananoJs = window.bananocoinBananojs;
bananoJs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

async function History(addr) {
    let history = await bananoJs.getAccountHistory(addr, 10);
    history = history["history"];
    return history;
}
  
async function banSearch(addr) {
    if (bananoJs.getBananoAccountValidationInfo(addr)["valid"]) {
        let balance = await bananoJs.getAccountBalanceRaw(addr) / 100000000000000000000000000000;
        balance = balance.toFixed(2) + "<span>ban</span>"; 
        let history = await History(addr);
        let createP = '';

        //ToDo Limit Length of history. 
        for (let i = 0; i < history.length; i++) {
            let sent = "send" == history[i]["type"];
            let date = new Date(history[i]["local_timestamp"] * 1000).toLocaleString();

            sent ? (sent = "-") : (sent = "+");
            createP += "<data-transaction><div data-tag='info'><strong>" + " " + history[i]["account"] + "</strong><span>on " +  date  + "</span></div><div data-tag='cost'>" +  sent + " " + (Math.round(history[i]["amount_decimal"] * 100) / 100).toFixed(2) + " ban </div></data-transaction>";
        }
        
        $("#transactions").empty();
        $(".loading").removeClass("loading");

        $("#monkey-image").prepend("<img src='https://monkey.banano.cc/api/v1/monkey/" + addr + "'>");
        $("#address").text(addr);
        $("#balance").html(balance);
        $("#transactions").append(createP);
        
    } else {
        $(".error-window").text("Unable to find transactions");
        $(".error-window").addClass('active');
        setTimeout(() => {
            $(".error-window").removeClass('active');
        }, 5000);
    }
}

$(document).ready(function() {
    
    chrome.storage.local.get(/* String or Array */["bannaddress"], function(items){
        if(typeof items.bannaddress  === 'undefined') {
            console.log("no address saved");
            window.location.href = 'connect.html';
        } else {
            //console.log(items.bannaddress);
            banSearch(items.bannaddress)
        }
    });

});