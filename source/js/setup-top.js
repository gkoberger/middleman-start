//= require "vendor/jquery-1.8.0.min"
//= require "vendor/modernizr-2.6.1.min"
//= require "vendor/categorizr"

$(window).bind('deviceChange', function(device) {
    $('html').removeClass('deviceTablet deviceMobile deviceDesktop');
    if(categorizr.isDesktop) {
        $('html').addClass('deviceDesktop');
    } else if(categorizr.isMobile) {
        $('html').addClass('deviceMobile');
    } else if(categorizr.isTablet) {
        $('html').addClass('deviceTablet');
    }
}).trigger('deviceChange');
