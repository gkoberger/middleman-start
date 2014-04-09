//= require "vendor/parse-1.2.2.min.js"
//= require "vendor/jquery.validate.js"
//= require "vendor/jquery.lightbox_me.js"
//= require "vendor/imagesloaded.pkgd.min.js"

//= require "setup.js"
//= require "main.js"
//= require "home.js"
//= require "hackfest.js"
//= require "apply.js"
//= require "update.js"

$(function() {
    /* Apply modal */
    var modal_w = 500;
    if(!$('html').hasClass('deviceMobile')) {
        $('.apply_form').width(modal_w);
        $('.apply_form .form').width(modal_w);
        $('.apply_form .close, #overlay').click(closeModal);
    } else {
        $('.upload-resume, .upload-logo').hide();
    }
    $(document).keyup(function(e) { 
        if (e.keyCode == 27) { 
            closeModal();
        }
    });

    $('#apply_company').click(function(e) {
        e.preventDefault();
        $('.company').trigger('click');
    });

    function closeModal(e) {
        if(e) e.preventDefault();
        $(window).unbind('.modal');
        $('#overlay').removeClass('on');

        var $form = $('.apply_form.on');
        var $button = $($form.data('button'));

        $form.offset($button.offset());
        $form.width($button.outerWidth());

        $('.form', $form).slideUp();
        $form.removeClass('rotate');
        setTimeout(function() {
            $form.hide();
            $form.removeClass('on');
            $button.removeClass('open');
        }, 670);
    }

    $('.student, .company').click(function(e) {
        e.preventDefault();
        var $form = $($(this).data('form'));
        $form.show();
        $('.form', $form).hide();
        if($('html').hasClass('deviceMobile')) {
            $(this).after($form);
            $('.form', $form).slideDown();
            $('html, body').animate({'scrollTop': $(this).offset().top - 30});
        } else {
            $form.offset($(this).offset());
            $form.width($(this).outerWidth());
            $(this).addClass('open');

            function positionModal() {
                $('#overlay').addClass('on');
                $form.css({
                    left: ($(window).width() - modal_w) / 2,
                    width: modal_w,
                    top: $(window).scrollTop() + 200,
                });
                $form.addClass('on rotate');
                $('.form', $form).slideDown();
            }

            setTimeout(positionModal, 50);
            $(window).on('resize.modal', positionModal);
        }
    });

    var handle_submit = function(form) {
        var $form = $(form);

        if($('html').hasClass('deviceMobile')) {
            $('html, body').animate({'scrollTop': $form.offset().top - 60});
        }

        $('button', $form).attr('disabled', true).text('Applying...');

        var SubmitObject = Parse.Object.extend($form.data('type'));
        var submitObject = new SubmitObject();

        var data = $form.serializeObject();
        submitObject.save(data, {
            success: function() {
                if($form.data('type') == 'StudentObject') {
                    $form.replaceWith($("<div>", {
                        'html': '<strong>Thanks for signing up!</strong><p>We can\'t wait to see you there!</p>',
                        'class': 'thanks'
                    }));
                } else {
                    $form.replaceWith($("<div>", {
                        'html': '<strong>Application submitted!</strong><p>Thanks for applying! We\'ll let you know soon if your application has been accepted.</p>',
                        'class': 'thanks'
                    }));
                }
            }
        });
        return false;
    };

    $("#form_student form").validate({
        ignore: '',
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            university: "required",
            year: {
                required: true,
                max: 2020,
                min: 2013,
            },
            resume: {
                required: function() {
                    return !$('html').hasClass('deviceMobile');
                }
            }
        },
        submitHandler: handle_submit,
    });

    $("#form_company form").validate({
        ignore: '',
        rules: {
            company_name: { required: true },
            email: {
                required: true,
                email: true
            },
            logo: {
                required: function() {
                    return !$('html').hasClass('deviceMobile');
                }
            }
        },
        submitHandler: handle_submit,
    });

    if(!categorizr.isDesktop) {
        $('#map').addClass('static');
    } else {
        var map;
        function initialize() {

            var center = new google.maps.LatLng(37.775259,-122.393165);
            var mapOptions = {
                zoom: 14,
                center: center,

                mapTypeControl: false,
                streetViewControl: false,

                scrollwheel: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(37.785759,-122.393165),
                map: map,
                title: 'Terra Gallery'
            });

            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(center);
            });
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        var $window = $(window);
        $(window).resize(function() {
            var width = $window.width();
            if(width >= 480) {
                $('.speaker, .speaker .top').height('auto');

                var max_h = 0;
                $('.speaker .top').each(function() {
                    var h = $(this).height();
                    if(h > max_h) max_h = h;
                });
                $('.speaker .top').height(max_h);

                var max_h = 0;
                $('.speaker').each(function() {
                    var h = $(this).height();
                    if(h > max_h) max_h = h;
                });
                $('.speaker').height(max_h);
            } else {
                $('.speaker, .speaker .top').height('auto');
            }
        }).trigger('resize');
        setTimeout(function() {
            $window.trigger('resize');
        }, 1000);
    }
});
