const bananoJs = window.bananocoinBananojs;
bananoJs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");
//banSearch();

$(document).ready(function() {
    
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
                window.location.href = 'wallet.html';
            });
        } else {
            $(".error-window").text("Invalid Banano Address");
            $(".error-window").addClass('active');
            setTimeout(() => {
                $(".error-window").removeClass('active');
            }, 5000);
            console.log('error');
        }
    });

});