//functions
//https://mdn.dev/archives/media/samples/domref/dispatchEvent.html
function simulateKey() {

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
                    $(this).append('<div class="tipButton reddit-worst-one tip-worst-reddit"><span>Tip ' + User + '</span></div>');
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

    //wait for it to be brought in before applying listener, probably a better way of doing this but im lazy and this works.
    setTimeout(() => {
        //<span data-text="true">!ban 0.1</span>
        [...document.querySelectorAll('.tip-worst-reddit')].forEach(function(item) { //Do not ask me why this has 3 dots. i dont know, it wont work without them, i dont ask questions.
            item.addEventListener('click', function() { // > button:first-child
                let clickMe = $(this).parent().next().find('div:eq(2) > button:first-child');
                clickMe.click();
                setTimeout(() => {
                    //console.log($(this).parent().next().next().html());
                    // 🤮🤮🤮
                    let textboxTarget = $(this).parent().next().next().find('div[data-test-id="comment-submission-form-richtext"] > div > div > div > div > div > div > div > div > div > span');

                }, 500);
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