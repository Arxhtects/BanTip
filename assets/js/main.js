const bananoJs = window.bananocoinBananojs;
bananoJs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

// async

async function History(addr) {
    let history = await bananoJs.getAccountHistory(addr, 10);
    history = history["history"];
    return history;
}
  
async function banSearch(addr) {
    if (bananoJs.getBananoAccountValidationInfo(addr)["valid"]) {
        let balance = await bananoJs.getAccountBalanceRaw(addr) / 100000000000000000000000000000;
        let balancePreSan = balance.toFixed(2);
        balance = balancePreSan + "<span>ban</span>"; 
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
        $("#address-for-qr").text(addr);
        $("#balance").html(balance);
        $("#transactions").append(createP);

        $("#value").attr("data-total", balancePreSan);
        
    } else {
        $(".error-window").text("Unable to find transactions");
        $(".error-window").addClass('active');
        setTimeout(() => {
            $(".error-window").removeClass('active');
        }, 5000);
    }
}

//functions

function copyToClipboard(element) {
    navigator.clipboard.writeText(element);
}

$(document).ready(function() {

    $(".copy").on("click", function() {
        let toCopy = $(this).parent().find("span:first-child").text();
        copyToClipboard(toCopy);
        $("body").append('<section class="active error-window success">Copied</section>');
        setTimeout(() => {
            $(".error-window").removeClass('active');
        }, 5000);
    });

    $("#recive-ban").on("click", function() {
        $("body").addClass("active");
    });
    
    $("#close-button").on("click", function() {
        $("body").removeClass("active");
    });

    browser.storage.local.get(/* String or Array */["bannaddress"], function(items){
        if(typeof items.bannaddress  === 'undefined') {
            console.log("no address saved");
            window.location.href = 'connect.html';
        } else {
            //console.log(items.bannaddress);
            banSearch(items.bannaddress);
            new QRCode(document.getElementById("qr-code-wrapper"), items.bannaddress);
        }
    });

});