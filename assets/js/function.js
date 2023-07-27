let setting; 

function onError(error) {
    console.error(`Error: ${error}`);
}
  
function sendMessageToTabs(tabs) {
    for (const tab of tabs) {
        chrome.tabs
          .sendMessage(tab.id, { greeting: "" + setting })
          .catch(onError);
    }
}

$(document).ready(function() {
    $("#sendMessage").on("click", function() {
        setting = $("#value").val();
        chrome.tabs.query({ currentWindow: false, active: true, }).then(sendMessageToTabs).catch(onError);
    });
});