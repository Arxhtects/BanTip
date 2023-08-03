let tiptotal; 

function onError(error) {
    console.error(`Error: ${error}`);
    $("body").append('<section class="active error-window">' + error + '</section>');
    setTimeout(() => {
        $(".error-window").removeClass('active');
    }, 5000);
    console.log('error');
}
  
function sendMessageToTabs(tabs) {
    for (const tab of tabs) {
        chrome.tabs
          .sendMessage(tab.id, { greeting: "" + tiptotal })
          .catch(onError);
    }
}

$(document).ready(function() {
 
    $(".ban-tip-ammount").on("click", function() {
        $("#value").val($(this).find("span").text());
        $("#value").text($(this).find("span").text());
    });

    $("#sendMessage").on("click", function() {
        tiptotal = $("#value").val();
        let totalAmount = $("#value").attr("data-total");
        console.log(tiptotal);
        console.log(totalAmount);
        if(+tiptotal > +totalAmount) {
            $("body").append('<section class="active error-window">You dont have enough ban</section>');
            setTimeout(() => {
                $(".error-window").removeClass('active');
            }, 5000);
        } else if(tiptotal < 1) {
            $("body").append('<section class="active error-window">Need to tip more than 1 ban</section>');
            setTimeout(() => {
                $(".error-window").removeClass('active');
            }, 5000);
        } else {
            chrome.tabs.query({ currentWindow: false, active: true, }).then(sendMessageToTabs).catch(onError);
            setTimeout(() => {
                self.close();
            }, 100);
        }
    });
});