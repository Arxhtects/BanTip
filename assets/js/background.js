//Message Listeners
let windowSize;

chrome.runtime.onMessage.addListener(request => {

    if (request.type == "OpenPopup") {
        windowSize = request.content; 
        chrome.windows.getAll({}, function(window_list) {
            var extWindow = '';
            window_list.forEach(function(chromeWindow) {
                //Check windows by type
                if (chromeWindow.type == 'popup') {
                    extWindow = chromeWindow.id;
                    //Update opened window
                    chrome.windows.update(extWindow, {focused: true});
                    return;
                }
            });
            if (extWindow == '') {
                //Open window
                chrome.windows.create(
                    {
                        url: "tip.html",
                        type: "popup",
                        focused: true,
                        width: 400,
                        height: 630,
                        left: windowSize - 500,
                    },
                    function(chromeWindow) {
                        extWindow = chromeWindow.id;
                    }
                );
            }
        });

    } else {
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.debugger.attach({ tabId: tabs[0].id }, "1.2", function() {
                console.log(request);
                chrome.debugger.sendCommand({ tabId: tabs[0].id }, "Input.dispatchMouseEvent", { type: "mousePressed", x: request.x, y: request.y, button: "left", clickCount: 1 }, () => {});
            });
            setTimeout(() => {
                chrome.debugger.detach({ tabId: tabs[0].id });
            }, 500);
        });
    }
});


