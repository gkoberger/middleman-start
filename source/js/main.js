var is_inactive;

$(function() {
    /* Apply link */
    $('#apply-link').click(function(e) {
        if(categorizr.isDesktop) {
            e.preventDefault();
            var join_container_top = $('#join-container').offset()['top'];
            $(window).scrollTop(join_container_top - 200);
        }
    });

    /* Visibility */
    var state, visibilityChange; 
    if (typeof document.hidden !== "undefined") {
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    if(visibilityChange) {
        $(document).bind(visibilityChange, function() {
            is_inactive = document[state] == "hidden";
        });
    }

    /* Form stuff */
    $('#join-container .apply').click(function() {
        var $parent = $(this).parent().parent();
        var slide = !$parent.find('form').hasClass('open');

        $('form.apply-form').removeClass('open').hide();
        $('.apply-opener').show();

        $parent.find('form').addClass('open')[slide ? 'slideDown' : 'show']();

        $('.apply.on').removeClass('on');
        $(this).addClass('on');
        $parent.find('.apply-opener.apply-hide').hide();

        $parent.find('.has-team').toggleClass('open', $(this).hasClass('b-l'));
        return false;
    });

    var handle_submit = function(form) {
        var $form = $(form);


        /* Scroll up so they can see the boom */
        $('html, body').animate({'scrollTop': $('#signup').offset()['top'] - $('header').outerHeight()})

        if(!$form.find('.dropbox-chooser').hasClass('dropbox-chooser-used')) {
            alert('You need to attach a resume.');
            return false;
        }

        $form.find("button").attr('disabled', true).text("Submitting...");

        var SubmitObject = Parse.Object.extend($form.data('type'));
        var submitObject = new SubmitObject();

        var data = $form.serializeObject();
        data['email_sent'] = false;

        if(data['power'] && typeof data['power'] != 'object') {
            data['power'] = [data['power']];    
        }

        if(data['looking'] && typeof data['looking'] != 'object') {
            data['looking'] = [data['looking']];    
        }

        submitObject.save(data, {
          success: function(object) {
              var $side = $form.closest('.side');
              $side.find('.hide-on-done').hide();
              $side.find('.apply-done').addClass('on');
          }
        });
        return false;
    }

    $("#form-hackfest form").validate({
        rules: {
            team1: {
                required: function() {
                    return $('.has-team').is('.open');
                },
            },
            team1email: {
                required: function() {
                    return !!$('#form_h_team1').val() || $('.has-team').is('.open');
                },
            },
            team2email: {
                required: function() {
                    return !!$('#form_h_team2').val();
                },
            },
            team3email: {
                required: function() {
                    return !!$('#form_h_team3').val();
                },
            },
        },
        submitHandler: handle_submit,
    });

    $("#form-company form").validate({
        rules: {
            power: {
                required: true,
            },
            looking: {
                required: true,
            }
        },
        submitHandler: handle_submit,
    });
});

