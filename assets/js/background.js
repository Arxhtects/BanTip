//Message Listeners
chrome.runtime.onMessage.addListener(request => {

    if (request == "OpenPopup") {
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
                        url: "index.html",
                        type: "popup",
                        focused: true,
                        width: 400,
                        height: 600,
                    },
                    function(chromeWindow) {
                        extWindow = chromeWindow.id;
                    }
                );
            }
        });

    }
});
