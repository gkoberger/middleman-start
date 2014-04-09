$(function() {
    if(!$('#hackfest').length) return false;

    var $window = $(window),
        $header = $('header'),
        $hf_header = $('.hackfest-header');
    
    $header.addClass('not_fixed');

    $(window).resize(function() {
        var h = $window.height();
        $hf_header.height(h - $header.outerHeight() - 40);
    }).trigger('resize');


    $('.arrow').click(function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop: $(window).height() - 130}, 1000);
    });

    var count = 0;
    $('#hackfest-main').imagesLoaded(function() {
      count++;
      fadeInHeader();
    });
    setTimeout(function() {
      count++;
      fadeInHeader();
    }, 500);

    fadeInHeader = function() {
      if(count < 2) return;
      $('#hackfest-main .hackfest-header').addClass('on');
    };
});
