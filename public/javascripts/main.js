$('#backTop').click(function(){
    $('nav').removeClass('fixHeader');
    $('html').animate({scrollTop: 5}, 500);
});

var fixed = false;
$(window).scroll(function() {
    if(window.scrollY > 220) {
        $('nav').addClass('fixHeader');
        $('#backTop').removeClass('hide');
        if(fixed === false) {
            window.scrollTo(0,50);
            fixed = true;
        }
    }
    if(window.scrollY == 0) {
        $('nav').removeClass('fixHeader');
        $('#backTop').addClass('hide');
        fixed === false;
    }
});