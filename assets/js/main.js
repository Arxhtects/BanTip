const bananoJs = window.bananocoinBananojs;
bananoJs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");
//banSearch();
//chrome.tabs.create({ url: newURL });

async function History(addr) {
    let history = await bananoJs.getAccountHistory(addr, 10);
    history = history["history"];
    return history;
  }
  
  async function banSearch(addr) {
      let banAddress = $("#input").val();
      $("#dropdown").hide();
      if(banAddress.indexOf("ban_") == -1) {
        banAddress = addr;
      }
      if (bananoJs.getBananoAccountValidationInfo(banAddress)["valid"]) {
        let balance = await bananoJs.getAccountBalanceRaw(banAddress) /
          100000000000000000000000000000;
         balance = balance.toFixed(2) + " BAN"; 
         let history = await History(banAddress);
        //Populate and stuff, it kept not working in Jquery so i bodged in js
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
        console.log("error/ Not a valid address blah blah");
      }
  }

  $("#searchBan").on("click", function() {
  
  });

  window.addEventListener('DOMContentLoaded', function() {
    // your button here
    var link = document.getElementById('btnOpenNewTab');
    // onClick's logic below:
    link.addEventListener('click', function() {
        var newURL = "http://stackoverflow.com/";
        chrome.tabs.create({ url: newURL });
    });
});