(function() {
    if(!$('#apply').length) return false;

    //if(!$.is_mobile()) location.href = '/';

    $('#reminder').submit(function(e) {
        e.preventDefault();
        var email = $('#reminder-email').val();

        if(!email.match(/(.*)@(.*)\.(.*)/)) {
            alert('Bat signals are *so* last year. Make sure you use a valid email so we can find you!');
            return;
        }

        Parse.Cloud.run('remind', {'email': email}, {success: function(){}, error: function(){}});
        
        $('.apply-body').html("<strong>Thanks for applying!</strong><p>We've sent you an email reminder. Hope to hear from you soon!</p>");
        $('html, body').scrollTop(0); // Otherwise header gets stuck :/
    });
})();
