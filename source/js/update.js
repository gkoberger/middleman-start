$(function() {
    if(!$('#update').length) return false;

    $('form').show();
    var info = location.hash.split('&');
    var email = info[1];
    var id = info[0].replace('#', '');
    $('#form_m_email').val(email);
    $('#form_m_id').val(id);

    $('form').submit(function(e) {
        e.preventDefault();
        $(this).find('button').attr('disabled', true);
        Parse.Cloud.run('update', $('form').serializeObject(),
        {
            'success': function(a){
                alert('Thanks for finishing your part of the application!');    
                $(this).find('button').attr('disabled', false);
            },
            'error': function(a){
                alert("We couldn't save your data, please try again.");
                $(this).find('button').attr('disabled', false);
            }
        });

    });
});
