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
    //Attempt to add button to middle reddit, even tho new reddit is a pile of poop.
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

    //Old reddit data-type="comment"
    if($('div[data-type="comment"] > .entry').length) {
        $('div[data-type="comment"] > .entry').each(function() { //no need for timeout on this one, because its better.
            let User = $(this).find('.author').text();
            if(User.indexOf("Banano_Tipbot") === -1) {
                $(this).append('<div class="tipButton reddit-the-best-one tip-best-reddit-old" data-target="key_' + targetId(8) + count +'"><span><strong>Tip ' + User + '</strong></span></div>');
            }
            count = count + 1;
        });
    }

    if($('#siteTable').length) {
        $('#siteTable').each(function() { 
            let User = $(this).find('.author').text();
            $(this).append('<div id="post_reply_target" class="tipButton reddit-the-best-one tip-best-reddit-old" data-target="key_post_author_main_reply_old_target"><span><strong>Tip ' + User + '</strong></span></div>');
        });
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
                textboxTarget.find('textarea').text("!ban " + request.greeting + "s"); //extra letter for removal
                textboxTarget.find('textarea').val("!ban " + request.greeting + "s");
                document.execCommand('delete'); //hack hack hack hack depreciated HACK
                setTimeout(() => {
                    let targetButton = textboxTarget.parent().parent().find('button[type="submit"]');
                    targetButton.click();
                    targetKey.remove();
                }, 100);
            }, 100);
        } else if(tipAmountTarget == 'key_post_author_main_reply_old_target') {
            let commentTarget = targetKey.parent().next();
            let targettextareaOld = commentTarget.find("form").first()
            targettextareaOld.find("textarea").val("!ban " + request.greeting);
            targettextareaOld.find("button[type=submit]").click();
            targetKey.remove();
        } else if(targetKey.attr("data-tag") == "old-reddit") {
            let dataFullname = targetKey.parent().parent().attr("data-fullname");
            var form = '<form action="#" class="usertext cloneable warn-on-unload" onsubmit="return post_form(this, \'comment\')" id="commentreply_' + dataFullname +'" style=""><input type="hidden" name="thing_id" value="'+ dataFullname +'"><div class="usertext-edit md-container" style="width: 500px;"><div class="md"><textarea rows="1" cols="1" name="text" class="" id="textarea_tip_target_reddit_'+ dataFullname +'" data-event-action="comment" data-type="link" style="width: 500px; height: 100px;"></textarea></div><div class="bottom-area"><span class="help-toggle toggle" style=""><a class="option active " href="#" tabindex="100" onclick="return toggle(this, helpon, helpoff)">formatting help</a><a class="option " href="#">hide help</a></span><a href="/help/contentpolicy" class="reddiquette" target="_blank" tabindex="100">content policy</a><span class="error CANT_REPLY field-parent" style="display:none"></span><span class="error TOO_LONG field-text" style="display:none"></span><span class="error RATELIMIT field-ratelimit" style="display:none"></span><span class="error NO_TEXT field-text" style="display:none"></span><span class="error SUBREDDIT_LINKING_DISALLOWED field-text" style="display:none"></span><span class="error SUBREDDIT_OUTBOUND_LINKING_DISALLOWED field-text" style="display:none"></span><span class="error USERNAME_LINKING_DISALLOWED field-text" style="display:none"></span><span class="error USERNAME_OUTBOUND_LINKING_DISALLOWED field-text" style="display:none"></span><span class="error TOO_OLD field-parent" style="display:none"></span><span class="error THREAD_LOCKED field-parent" style="display:none"></span><span class="error DELETED_COMMENT field-parent" style="display:none"></span><span class="error USER_BLOCKED field-parent" style="display:none"></span><span class="error USER_MUTED field-parent" style="display:none"></span><span class="error USER_BLOCKED_MESSAGE field-parent" style="display:none"></span><span class="error INVALID_USER field-parent" style="display:none"></span><span class="error MUTED_FROM_SUBREDDIT field-parent" style="display:none"></span><span class="error QUARANTINE_REQUIRES_VERIFICATION field-user" style="display:none"></span><span class="error TOO_MANY_COMMENTS field-text" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_REQUIRED field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_NOT_ALLOWED field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_BLACKLISTED_STRING field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_NOT_ALLOWED field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_REQUIRED field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_REQUIREMENT field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_REGEX_TIMEOUT field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_BODY_REGEX_REQUIREMENT field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_MAX_LENGTH field-body" style="display:none"></span><span class="error SUBMIT_VALIDATION_MIN_LENGTH field-body" style="display:none"></span><span class="error SOMETHING_IS_BROKEN field-parent" style="display:none"></span><span class="error placeholder field-body" style="display:none"></span><span class="error placeholder field-text" style="display:none"></span><div class="usertext-buttons"><button type="submit" id="submit_tip_target_' + dataFullname + '" onclick="" class="save">save</button><button type="button" onclick="return cancel_usertext(this);" class="cancel" style="">cancel</button><span class="status"></span></div></div><div class="markhelp" style="display:none"><p></p><p>reddit uses a slightly-customized version of <a href="http://daringfireball.net/projects/markdown/syntax">Markdown</a> for formatting. See below for some basics, or check <a href="/wiki/commenting">the commenting wiki page</a> for more detailed help and solutions to common issues.</p> <p></p><table class="md"><tbody><tr style="background-color: #ffff99; text-align: center"><td><em>you type:</em></td><td><em>you see:</em></td></tr><tr><td>*italics*</td><td><em>italics</em></td></tr><tr><td>**bold**</td><td><b>bold</b></td></tr><tr><td>[reddit!](https://reddit.com)</td><td><a href="https://reddit.com">reddit!</a></td></tr><tr><td>* item 1<br>* item 2<br>* item 3</td><td><ul><li>item 1</li><li>item 2</li><li>item 3</li></ul></td></tr><tr><td>&gt; quoted text</td><td><blockquote>quoted text</blockquote></td></tr><tr><td>Lines starting with four spaces<br>are treated like code:<br><br><span class="spaces">&nbsp;&nbsp;&nbsp;&nbsp;</span>if 1 * 2 &lt; 3:<br><span class="spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>print "hello, world!"<br></td><td>Lines starting with four spaces<br>are treated like code:<br><pre>if 1 * 2 &lt; 3:<br>&nbsp;&nbsp;&nbsp;&nbsp;print "hello, world!"</pre></td></tr><tr><td>~~strikethrough~~</td><td><strike>strikethrough</strike></td></tr><tr><td>super^script</td><td>super<sup>script</sup></td></tr></tbody></table></div></div></form>'
            let childTarget = targetKey.parent().next();
            childTarget.append(form);
            setTimeout(() => {
                let oldreddittextareaTarget = $("#textarea_tip_target_reddit_" + dataFullname);
                oldreddittextareaTarget.val("!ban " + request.greeting);
                $("#submit_tip_target_" + dataFullname).click();
                targetKey.remove();
            }, 100);
        } else {
            console.log(targetKey);
            let clickMe = targetKey.parent().parent().parent().find('i.icon-comment');
            console.log(clickMe);
            targetKey.text(" !ban " + request.greeting);
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

    ///////data-click-id="media" / data-click-id="body"
    //refresh page on reddit 2 cos it uses some wierd ajax thing
    [...document.querySelectorAll('img')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
        item.addEventListener('click', function() {
            if (window.location.href.indexOf("comments") < 1) {
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
    });
    [...document.querySelectorAll('[data-click-id="body"]')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
        item.addEventListener('click', function() {
            if (window.location.href.indexOf("comments") < 1) {
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
    });
    [...document.querySelectorAll('[data-click-id="media"]')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
        item.addEventListener('click', function() {
            if (window.location.href.indexOf("comments") < 1) {
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
    });
    [...document.querySelectorAll('[data-testid="post-container"]')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
        item.addEventListener('click', function() {
            if (window.location.href.indexOf("comments") < 1) {
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
    });
    ///

      //OLD REDDIT
      [...document.querySelectorAll('.reddit-the-best-one')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
        item.addEventListener('click', function() {
            let highlightText;
            chrome.runtime.sendMessage({content: windowSize, type: "OpenPopup"});
            tipAmountTarget = $(this).attr("data-target");
            highlightText = $(this).parent();
            highlightText.append('<p id="' + tipAmountTarget + '" class="_hidden_tip_chrome_addition_tip" data-tag="old-reddit"></p>') //have to keep the space
        });
    });


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
                    highlightText = $(this);
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
