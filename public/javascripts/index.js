$(document).ready(function() {

    $('#backTop').click(function(){
        $('#mainNav').removeClass('fixHeader');
        $('html').animate({scrollTop: 5}, 500);
    });

});