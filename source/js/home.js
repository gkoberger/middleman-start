$(function() {
    if(!$('#home').length) return false;

    $('#panel5').click(function() {
        $('#reveal').toggleClass('on', !$('#reveal').hasClass('on'));
    });

    /* Tablet? Blech */
    if(categorizr.isTablet) {
        $('.reveal-man').addClass('animate');
        $(window).scroll(function() {
            var show_chest = !($(window).scrollTop() > $('#panel5').offset().top - $(window).height() + 400);
            $('#reveal').toggleClass('on', show_chest);
        });
        return; // Don't do anything fancy
    }

    /* Manage top logos */
    var $logos_rotate = $('#logos .logo');
    $logos_rotate.hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
    var logos = $logos_rotate.filter('.rotate').randomize();
    (function() {
        var i = 0;
        setInterval(function() {
            if(is_inactive) return;
            var $el = logos[i];
            if(!$el.is('.hover')) {
                var $current = $el.find(':not(.off)');
                var $next = $current.next(); //children();
                if(!$next.length) $next = $el.children().eq(0);
                $current.addClass('off');
                $next.removeClass('off');
            }
            i++;
            if(i >= logos.length) i=0;
        }, 1300);
    })();

    /* Manage the arrow */
    setTimeout(function() {
        $('#arrow').addClass('on');
    }, 6000);
    $('#arrow').click(function(e) {
        e.preventDefault(); 
        $('html, body').animate({'scrollTop': 1000}, $('#spacer').offset()['top'] - height_header);
    });


    /* Set up all elements */
    var $window = $(window);
    var $header = $('header');
    var $slider = $('#slider');
    var $superheros_inside = $('#superheros-inside');
    var $superhero_main = $('#superhero-main');
    var $spacer = $('#spacer');
    var $p2_bg = $('#panel2 .bg');
    var $p2_city = $('#panel2 .city');
    var $bg = $('#bg');
    var $join = $('#join');
    var $panels = $('.panel');
    var $sketch = $('.sketch');
    var $join_container = $('#join-container');
    var $panel_parent = $('#panel_parent');

    var prefix = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice .call(styles) .join('') .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
        return '-' + pre + '-';
    })();

    var transform_prefix = prefix + 'transform';

    /* Show title after a second */
    var imgs = [$('#logo-sub'), $('#superhero-main'), $('.l1'), $('.l2'), $('.l3')];
    var preload_head = preload_images(imgs);

    preload_head.done(function() {
        setTimeout(function() {
            $('#title, #about-bg').addClass('on');
            $('.reveal-man').addClass('animate');
        }, 1000);
    });

    /* Get variables (to refresh) */
    var h, w, height_header, h_min, h_without_header, spacer_offset, scroll_type, panels,
    diff, sh_inside_top, sh_inside_height, join_container_top, stop_scrolling_at, total_w, actual_w, join_overlay_offset, is_tiny;

    var remove = [], // TODO: Change this name, clean up logic a bit
        ranges = {};

    function on_resize() {
        h = $window.height();
        w = $window.width();
        is_tight = h < 748;
        is_tiny = h < 690;
        is_really_tiny = h < 650;

        if($.is_mobile()) {
            is_tight = is_tiny = is_really_tiny = false;
        }

        w_min = w < 1360 ? 1360 : w;
        diff = w > 1360 ? 0 : (1360 - w);

        join_overlay_offset = is_really_tiny ? 0 : 80; //is_tiny ? -100 : 100;

        $header.toggleClass('thin_header', is_tight);
        $header.toggleClass('not_fixed', is_tiny);

        height_header = is_tiny ? 0 : $header.outerHeight();
        if(is_tight && !is_tiny) {
            height_header -= 40;
        }
        h_without_header = h - height_header;

        $join_container.height($join.height());

        $bg.height(h - height_header - join_overlay_offset);

        $slider.css({'height': h_without_header, 'width': w});
        $superheros_inside.css({'height': h_without_header - join_overlay_offset, 'width': w});

        var sketch_height = h_without_header - join_overlay_offset;
        if(sketch_height % 2 == 1) sketch_height--; // Odd numbers causes half-pixel weirdness
        $sketch.css({'height': sketch_height, 'width': w_min}); 

        h_min = h < 950 ? 950 : h;
        $superhero_main.css({
            'height': h_min, 
            'width': w
        });

        spacer_offset = $spacer.offset()['top'];
        scroll_type = false;

        remove = [];
        total_w = 0;
        actual_w = 0;
        ranges = {};
        $('.panel').each(function() {
            var $p = $(this); 
            var extra = $p.data('extra');
            extra = extra ? parseInt($p.data('extra')) : 0;
            $p.css({'width': w_min, 'height': h});// + extra);

            ranges[$(this).attr('id')] = {
                start: total_w, 
                end: total_w + w_min + extra,
                $el: $(this),
            };

            if(extra) {
                remove.push({'start': total_w, 'extra': extra});
            }

            total_w += w_min + extra;
            actual_w += w_min;
        });

        $panel_parent.width(actual_w);
        $spacer.height(total_w - w + h - join_overlay_offset - height_header - diff);

        join_container_top = $join_container.offset()['top'];
        sh_inside_top = $superheros_inside.offset()['top'];
        sh_inside_height = $superheros_inside.height();

        $superheros_inside.addClass('loaded');

        current_join = false;
        $window.trigger('scroll');

    }

    var current_join = false;

    function removeChunk(input) {
        var sub = input - remove[0].start;
        if(sub < 0) sub = 0;
        if(sub > remove[0].extra) sub = remove[0].extra;

        return input - sub;
    }

    /* Move all this to somewhere better */
    function p2_scroll(location) {
        var stop_at = remove[0].start + remove[0].extra;
        if(location > stop_at) location = stop_at;
        if(location < 0) location = 0;

        var top = (location <= 438) ? location : 438;
        var left = (location > 420) ? location - 420 : 0;

        $p2_bg.css(transform_prefix, 'translate(' + left*-1.2 + 'px, ' + top * -1+'px)');
        var city_top = 540 - (top/1.5);
        var city_left = left * 0.7; //left * 0.7;
        $p2_city.css(transform_prefix, 'translate(' + city_left + 'px, ' + city_top + 'px)');
    }

    var $reveal_man = $('.reveal-man');
    var $reveal = $('#reveal');
    var $note = $('#reveal-wrap .note');
    var reveal_on = false;
    function p5_scroll(location) {
        var offset = Math.floor((remove[1].start - location) * -0.6);
        $reveal_man.css(transform_prefix, 'translateX(' + (350 + offset) + 'px)');
        $reveal.css('background-position', ((offset * 0.8) - 400) + 'px 0px');
        var reveal_on_new = offset < -250;
        if(reveal_on_new != reveal_on) {
            $reveal.toggleClass('on', reveal_on_new);
            $note.toggleClass('on', !reveal_on_new);
            reveal_on = reveal_on_new;
        }
    }

    var is_arrow = true;
    $window.scroll(function() {
        // Very confusing because it's as optimized as possible.. sorry :/

        var st = $window.scrollTop();
        var location = st - spacer_offset + height_header;

        // Remove the arrow if we scroll down
        if(is_arrow && st > 150) {
            $('#arrow').remove();
            if_arrow = false;
        }

        $header.toggleClass('scrolled', st > 0);
        
        // Actually scrolls left
        var location_scroll = location;
        if(location < 0) location_scroll = 0;
        if(location >= total_w - w - diff) location_scroll = total_w - w - diff;

        $panel_parent.css(transform_prefix, 'translateX(' + (removeChunk(location_scroll)*-1) + 'px)');

        // The fun different things at random lengths
        fire_panel(location, 'panel2', p2_scroll);
        fire_panel(location, 'panel3');
        fire_panel(location, 'panel5', p5_scroll);
        fire_panel(location, 'panel6');

        // Handle the position of elements
        if(st < h_min - height_header) {
            if(current_join != 1) {
                $join.css({'position': 'absolute', 'top': h_without_header + h_min - join_overlay_offset, 'margin-top': 0});
                $superheros_inside.css({'position': 'absolute', 'top': 0});
                current_join = 1;
            }
        } else if(location <= total_w - w - diff) {
            if(current_join != 2) {
                $join.css({'position': 'fixed', 'top': h - join_overlay_offset});
                $superheros_inside.css({'position': 'fixed', 'top': height_header, 'margin-top': 0});
                current_join = 2;
            }
        } else {
            if(current_join != 3) {
                $superheros_inside.css({'position': 'absolute', 'top': 'auto', 'bottom': 0});
                $join.css({'position': 'relative', 'top': 'auto'});
                // Add superheros-inside stuff
                current_join = 3;
            }
        }
    });

    function fire_panel(location, id, on_scroll) {
        var start = ranges[id].start;
        var end = ranges[id].end;
        var is_on = location + w_min - diff > start && location < end
        if(is_on && on_scroll) {
            on_scroll.apply(this, [location]);
        }

        if(is_on != ranges[id].is_on) { // Only fire if changed
            ranges[id].$el.toggleClass('no-animate', !is_on);
            ranges[id].is_on = is_on;
        }

        if(id != 'panel5') {
            var is_on_note = location + w_min - diff - ((w / 3) * 2) > start;
            if(is_on_note != ranges[id].is_on_note) {
                $('.note', ranges[id].$el).toggleClass('on', is_on_note);
                ranges[id].is_on_note = is_on_note;
            }
        }
    }


    $(window).resize(on_resize).trigger('resize');
});
