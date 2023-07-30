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
    $("#sendMessage").on("click", function() {
        tiptotal = $("#value").val();
        chrome.tabs.query({ currentWindow: false, active: true, }).then(sendMessageToTabs).catch(onError);
        setTimeout(() => {
            self.close();
        }, 100);
    });
});