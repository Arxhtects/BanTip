$(document).ready(function() {
    //Attempt to add button to new reddit, even tho new reddit is a pile of ass
    setTimeout(() => {
        $('div[data-testid="comment"]').each(function() {
            let User = $(this).parent().find('a[data-testid="comment_author_link"]').html();
            $(this).append('<div class="tipButton"><span>Tip ' + User + '</span></div>');
        })
    }, 2000);
});
