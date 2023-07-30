//variables

let tipAmount;
let tipAmountTarget;
let count = 0;

let windowSize = window.innerWidth;
console.log(windowSize);

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

function targetId(iter) {
    var s = '';
    var randomchar = function() {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    }
    while (s.length < iter) s += randomchar();
    return s;
  }

//
$(document).ready(function() {
    //add button to old reddit, The only one you should use cos its written well.

    ///////    
    //Attempt to add button to middle reddit, even tho new reddit is a pile of ass.
    let postTarget = $('div[data-testid="post-container"]'); //there should only be one post container
    //target post container
    if(postTarget.length) {
        postTarget.find('div[data-test-id="post-content"]').append('<div class="loading reddit-worst-one tip-worst-reddit pointfiverem"></div>');
        setTimeout(() => {
            postTarget.find(".loading").remove();
            let User = postTarget.find('a[data-testid="post_author_link"]').text();
            User = User.substring(2); //remove the u/ from author 
            if(User.indexOf("Banano_Tipbot") === -1) {
                postTarget.find('div[data-test-id="post-content"]').append('<div class="tipButton reddit-worst-one tip-worst-reddit" data-target="key_post_author_main_tip_target"><span><strong>Tip ' + User + '</strong></span></div>');
            }
        }, 2000);
    }

    if($('div[data-testid="comment"]').length) {
        $('div[data-testid="comment"]').each(function() {
            $(this).append('<div class="loading reddit-worst-one tip-worst-reddit"></div>');
        });
        setTimeout(() => {
            $('div[data-testid="comment"]').each(function() {
                $(this).find(".loading").remove();
                let User = $(this).parent().find('a[data-testid="comment_author_link"]').text();
                if(User.indexOf("Banano_Tipbot") === -1) {
                    $(this).append('<div class="tipButton reddit-worst-one tip-worst-reddit" data-target="key_' + targetId(8) + count +'"><span><strong>Tip ' + User + '</strong></span></div>');
                }
                count = count + 1;
            });
        }, 2000);
    }

    ///////   
    //add button to the new reddit? This is in prep as currently the new version isnt ready but is on the non-logged in version??
    if($('div[slot="commentMeta"]').length) {
        $('div[slot="commentMeta"]').each(function() {
            $(this).next().append('<div class="loading reddit-3"></div>');
        });
        setTimeout(() => {
            $('div[slot="commentMeta"]').each(function() {
                $(this).next().find(".loading").remove();
                let User = $(this).find('faceplate-tracker[noun="comment_author"] > a').text();
                if(User.indexOf("Banano_Tipbot") === -1) {
                    $(this).next().append('<div class="tipButton reddit-3 tip-reddit-3"><span><strong>Tip ' + User + '</strong></span></div>');
                }
            });
        }, 2000);
    }

    //keep a single runtimelisterner and single request with mutlipletargetkeys to avoid multimessage requests and sends
    chrome.runtime.onMessage.addListener((request) => { // 🤮🤮🤮
        let targetKey = $("#" + tipAmountTarget); //get set tiptarget
        if(tipAmountTarget == 'key_post_author_main_tip_target') {
            let markdownSwap = targetKey.parent().parent().parent().find('button[aria-label="Switch to markdown"]');
            markdownSwap.click();//click has to be here
            setTimeout(() => {
                let textboxTarget = targetKey.parent().parent().parent().find('div[data-test-id="comment-submission-form-markdown"]');
                //Both text and value need to be present.
                textboxTarget.find('textarea').text("testban:" + request.greeting + "s"); //extra letter for removal
                textboxTarget.find('textarea').val("testban:" + request.greeting + "s");
                document.execCommand('delete'); //hack hack hack hack depreciated HACK
                setTimeout(() => {
                    let targetButton = textboxTarget.parent().parent().find('button[type="submit"]');
                    targetButton.click();
                    targetKey.remove();
                }, 100);
            }, 100);
        } else {
            let clickMe = targetKey.parent().parent().parent().find('div:last-child > div:eq(2) > button:first-child');
            targetKey.text("testban:" + request.greeting);
            selectText("" + tipAmountTarget + "");
            setTimeout(() => {
                clickMe.click();
                    setTimeout(() => {
                        let textboxTarget = targetKey.parent().parent().next().next().find('div[data-test-id="comment-submission-form-richtext"]');
                        console.log(textboxTarget);
                        textboxTarget.next().attr("id", "tip_target_bar_focus");
                        let submitbuttonTarget = $("#tip_target_bar_focus > div:first-child()").find('button[type="submit"]');
                        submitbuttonTarget.click();
                        $("#tip_target_bar_focus").attr("id", "");
                        targetKey.remove();
                    }, 100);
            }, 100);
        }
    });

    /////////

    //wait for it to be brought in before applying listener, probably a better way of doing this but im lazy and this works.
    setTimeout(() => {
        [...document.querySelectorAll('.tip-worst-reddit')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
            item.addEventListener('click', function() {
                let highlightText;
                chrome.runtime.sendMessage({content: windowSize, type: "OpenPopup"});
                tipAmountTarget = $(this).attr("data-target");
                if(tipAmountTarget == 'key_post_author_main_tip_target') {
                    highlightText = $(this).parent();
                } else {
                    highlightText = $(this).parent().find('div:first-child');
                }
                if($("#" + tipAmountTarget).length == 0) {
                    highlightText.append('<p id="' + tipAmountTarget + '" class="_hidden_tip_chrome_addition_tip"></p>') //have to keep the space
                }
            });
        });

        [...document.querySelectorAll('.tip-reddit-3')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
            item.addEventListener('click', function() {
                let clickMe = $(this).parent().parent().find('shreddit-comment-action-row > faceplate-tracker[slot="reply"] > button');
                clickMe.click();
            });
        });

    }, 2100);


    //////////////////////////////////////// For TESTing IGNORE
    // $('body').append('<div id="button_tip_test"></div>');

    // let button = document.getElementById('button_tip_test');
    // button.addEventListener('click', function() {
    //     chrome.runtime.sendMessage({content: windowSize, type: "OpenPopup"});
    // });
    ////////////////////////////////////////
});
