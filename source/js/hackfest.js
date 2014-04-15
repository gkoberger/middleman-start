$(function() {
    if(!$('#hackfest').length) return false;

    var $window = $(window),
        $header = $('header'),
        $hf_header = $('.hackfest-header');
    
    $header.addClass('not_fixed');

    var prizes = {};
    var $p = $('#prizes');
    var $w = $(window);

    $(window).resize(function() {
        if(categorizr.isMobile) return;
        var h = $window.height();
        $hf_header.height(h - 40);

        prizes = {
          top : $p.offset().top,
          height : $p.outerHeight(),
          height_half : $p.outerHeight() / 2,
          $el : $p,
          window_height : $w.height(),
        };
        prizes.start = prizes.top - prizes.window_height;
        prizes.end = prizes.top + prizes.height;

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


      /*
    if(categorizr.isDesktop) {
      $(window).scroll(function() {
        var st = $w.scrollTop();
        if(st > prizes.start && st < prizes.end) {
          var pct = (st - prizes.start) / (prizes.end - prizes.start);
          prizes.$el.css('background-position', '0 ' + ((prizes.height * -1 * pct) + (prizes.height_half)) + 'px')
        }

        $('.hackfest-header').css('background-position', 'center ' + ((st / $('.hackfest-header').height()) * 100) + '%');
        //background-position: center -50px;
      }).trigger('scroll');
    }
      */

    $('#as_individual, #as_team').change(function(e) {
      e.preventDefault();

      if($('#as_individual').is(':checked')) {
        $('#teammates').hide();
      } else {
        $('#teammates').slideDown();
      }
    });
});
