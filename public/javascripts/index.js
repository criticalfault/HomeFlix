$(document).ready(function() {

    $('#backTop').click(function(){
        $('#mainNav').removeClass('fixHeader');
        $('html').animate({scrollTop: 5}, 500);
    });

    var fixed = false;
    $(window).scroll(function() {
        if(window.scrollY > 220) {
            $('#mainNav').addClass('fixHeader');
            $('#mainBody').addClass('fixBody');
            $('#backTop').removeClass('hide');
            if(fixed === false) {
                window.scrollTo(0,50);
                fixed = true;
            }
        }
        if(window.scrollY == 0) {
            $('#mainNav').removeClass('fixHeader');
            $('#mainBody').removeClass('fixBody');
            $('#backTop').addClass('hide');
            fixed === false;
        }
    });

});