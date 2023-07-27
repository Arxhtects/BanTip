//functions
//https://mdn.dev/archives/media/samples/domref/dispatchEvent.html
function selectText(id){
	var sel, range;
	var el = document.getElementById(id); //get element id
	if (window.getSelection && document.createRange) { //Browser compatibility
	  sel = window.getSelection();
	  if(sel.toString() == ''){ //no text selection
		 window.setTimeout(function(){
			range = document.createRange(); //range object
			range.selectNodeContents(el); //sets Range
			sel.removeAllRanges(); //remove all ranges from selection
			sel.addRange(range);//add Range to a Selection.
		},1);
	  }
	}else if (document.selection) { //older ie
		sel = document.selection.createRange();
		if(sel.text == ''){ //no text selection
			range = document.body.createTextRange();//Creates TextRange object
			range.moveToElementText(el);//sets Range
			range.select(); //make selection.
		}
	}
}

//
$(document).ready(function() {
    //add button to old reddit, The only one you should use cos its written well.

    //Attempt to add button to middle reddit, even tho new reddit is a pile of ass.
    if($('div[data-testid="comment"]').length) {
        $('div[data-testid="comment"]').each(function() {
            $(this).append('<div class="loading reddit-worst-one tip-worst-reddit"></div>');
        });
        setTimeout(() => {
            $('div[data-testid="comment"]').each(function() {
                $(this).find(".loading").remove();
                let User = $(this).parent().find('a[data-testid="comment_author_link"]').html();
                if(User.indexOf("Banano_Tipbot") === -1) {
                    $(this).append('<div class="tipButton reddit-worst-one tip-worst-reddit"><span><strong>Tip ' + User + '</strong></span></div>');
                }
            });
        }, 2000);
    }

    //add button to the new reddit? This is in prep as currently the new version isnt ready but is on the non-logged in version??
    if($('div[slot="commentMeta"]').length) {
        $('div[slot="commentMeta"]').each(function() {
            $(this).next().append('<div class="loading reddit-3"></div>');
        });
        setTimeout(() => {
            $('div[slot="commentMeta"]').each(function() {
                $(this).next().find(".loading").remove();
                let User = $(this).find('faceplate-tracker[noun="comment_author"] > a').html();
                if(User.indexOf("Banano_Tipbot") === -1) {
                    $(this).next().append('<div class="tipButton reddit-3 tip-reddit-3"><span><strong>Tip ' + User + '</strong></span></div>');
                }
            });
        }, 2000);
    }

    //////////
    $('body').append('<div id="button_tip_test"></div>');

    let button = document.getElementById('button_tip_test');
    button.addEventListener('click', function() {
        chrome.runtime.sendMessage("OpenPopup");
    });

    chrome.runtime.onMessage.addListener((request) => {
        console.log("Message from the background script:");
        console.log(request.greeting);
        $("#button_tip_test").css("background", "green");
    });

    /////////

    //wait for it to be brought in before applying listener, probably a better way of doing this but im lazy and this works.
    setTimeout(() => {
        [...document.querySelectorAll('.tip-worst-reddit')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
            item.addEventListener('click', function() {
                let clickMe = $(this).parent().next().find('div:eq(2) > button:first-child');
                let highlightText = $(this).parent().find('div:first-child > p');
                highlightText.append('<p id="tip_select_text_for_reply" class="_hidden_tip_chrome_addition_tip"> test</p>') //have to keep the space
                selectText("tip_select_text_for_reply");
                setTimeout(() => {
                    clickMe.click();
                    $("#tip_select_text_for_reply").remove();// done with id remove now
                    setTimeout(() => {
                        // 🤮🤮🤮
                        let textboxTarget = $(this).parent().next().next().find('div[data-test-id="comment-submission-form-richtext"]');
                        textboxTarget.next().attr("id", "tip_target_bar_focus");
                        let submitbuttonTarget = $("#tip_target_bar_focus > div:first-child()").find('button[type="submit"]');
                        submitbuttonTarget.click();
                        $("#tip_target_bar_focus").attr("id", "");
                        }, 100);
                }, 100);
            });
        });

        [...document.querySelectorAll('.tip-reddit-3')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
            item.addEventListener('click', function() {
                let clickMe = $(this).parent().parent().find('shreddit-comment-action-row > faceplate-tracker[slot="reply"] > button');
                clickMe.click();
            });
        });

    }, 2100);
});
