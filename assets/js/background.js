//Message Listeners
let windowSize;

browser.runtime.onMessage.addListener(request => {

    if (request.type == "OpenPopup") {
        windowSize = request.content; 
        browser.windows.getAll({}, function(window_list) {
            var extWindow = '';
            window_list.forEach(function(browserWindow) {
                //Check windows by type
                if (browserWindow.type == 'popup') {
                    extWindow = browserWindow.id;
                    //Update opened window
                    browser.windows.update(extWindow, {focused: true});
                    return;
                }
            });
            if (extWindow == '') {
                //Open window
                browser.windows.create(
                    {
                        url: "tip.html",
                        type: "popup",
                        focused: true,
                        width: 400,
                        height: 630,
                        left: windowSize - 500,
                    },
                    function(browserWindow) {
                        extWindow = browserWindow.id;
                    }
                );
            }
        });

    }
});
