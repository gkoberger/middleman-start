$(function() {
    /* Holy crap this is the worst code every... */

    var user = Parse.User.current();

    var labels = {
        'full_name': 'Name', 
        'email': 'E-Mail', 
        'college': 'University',
        'year': 'Year',
        'selected_file': 'Resume', 
        'team1': 'Teammate 1 Name', 
        'team1college': 'Teammate 1 University', 
        'team1email': 'Teammate1 Email', 
        'team1resume': 'Teammate1 Resume',
        'team2': 'Teammate 2 Name',
        'team2college': 'Teammate 2 University', 
        'team2email': 'Teammate 2 Email', 
        'team2resume': 'Teammate 2 Resume', 
        'team3': 'Teammate 3 Name',
        'team3college': 'Teammate 3 University', 
        'team3email': 'Teammate 3 Email', 
        'team3resume': 'Teammate 3 Resume', 
        'why': 'Why?',
        'contact_name': 'Point of Contact', 
        'name': 'Name',
        'company_name': 'Company Name',
        'company_url': 'Company URL',
        'logo': 'Logo',
        'university': 'University',
        'resume': 'Resume',
    };

    filepicker.setKey("ALeGlDRhzSqbHEU94DIelz");

    $('#register form').submit(function(e) {
        e.preventDefault();

        var username = $('#register-form').find('[name=username]').val();
        var password = $('#register-form').find('[name=password]').val();
        Parse.User.signUp(username, password, { 
            ACL: new Parse.ACL() 
        }, 
        {
            success: function(user) {
                go('hackfest');
            },
            error: function(user, error) {
                alert('There was an issue');
            }
        });
    });

    function resumeBuilder(field, v) {
        var $resume_block = $('<div>', {'class': 'resume-block'});
        var $resume = $('<a>', {'href': v.get(field), 'class': 'resume', 'target': '_blank'});
        var $resume_upload = $('<a>', {'href': '#', 'class': 'resume-upload', 'title': 'Upload a new resume!'});

        $resume.toggleClass('show', !!v.get(field));

        $resume_block.append($resume);
        $resume_block.append($resume_upload);

        $resume_upload.click(function() {
            var $this = $(this);
            filepicker.pick(function(FPFile){
                v.set(field, FPFile.url);
                v.save(null, {
                    success: function() {
                        alert("Saved!");
                        var $r = $this.closest('.resume-block').find('.resume');
                        $r.addClass('show').attr('href', v.get(field));
                    },
                    error: function() {
                        alert("Couldn't save for some reason, try again or contact Greg.");
                    }
                });
            });
        });

        return $resume_block;
    }

    function editor(data, to_edit) {
        var $a = $('<a>', {
            'href': '#',
            'text': 'edit',
        });
        $a.click(function(e) {
            e.preventDefault();

            var $table = $('#update .stuff');
            $table.empty();
            var $form = $('<form>');
            $table.append($form);
            $.each(to_edit, function(k, v) {
                if(v == '-') {
                    $form.append('<hr>');
                } else {
                    var $div = $('<div>');
                    $div.append($('<label>', {'text': labels[v]}));
                    if(v == "why") {
                        $div.append($('<textarea>', {'cols': 40, 'rows': 10, 'value': data.get(v), 'name': v}));
                    } else {
                        $div.append($('<input>', {'value': data.get(v), 'name': v}));
                    }
                    $form.append($div);
                }
            });
            $form.append($('<button>', {'type': 'submit', 'text': 'Save'}));
            $form.submit(function(e) {
                var new_data = $form.serializeObject();
                data.save(new_data, {
                    'success': function() {
                        alert('Saved data!\n\n(Refresh to see updated data)');
                        $('#update .close').trigger('click');
                    }
                });
                return false;
            });
            $('#update').lightbox_me();
        });
        return $a;
    };

    $('#login form').submit(function(e) {
        e.preventDefault();

        var username = $('#login-form').find('[name=username]').val();
        var password = $('#login-form').find('[name=password]').val();
        Parse.User.logIn(username, password,
        {
            success: function(user) {
                go('hackfest');
            },
            error: function(user, error) {
                alert('There was an issue');
            }
        });
    });

    /*
    $('.filter-status a').click(function(e) {
        var $table = $(this).closest('.div').find('table');
        var option = $(this).data('option');
        var all = (option == 'all');

        $table.find('.row').each(function() {
            var show = all || option == $(this).find('.select').val();
            $(this).toggle(show);
        });
    });
    */

    var classes = 's-0 s-1 s-2 s-3 s-4 s-5 s-6 s-7';
    var is_classes = 'is-0 is-1 is-2 is-3 is-4 is-5 is-6 is-7';
    $('.filter-status a').click(function(e) {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');

        var $table = $(this).closest('.div').find('table');

        $table.find('.row').each(function() {
            $(this).removeClass(is_classes);
            var status = $(this).find('select').val();
            status = status ? status : 0;
            $(this).addClass('is-' + status);
        });

        $table.removeClass('s-all ' + classes);
        $table.addClass('s-' + $(this).data('option'));
    });

    $('.filter-type a').click(function(e) {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');

        var $table = $(this).closest('.div').find('table');
        $table.removeClass('type-all type-indv type-team type-ft type-i').addClass('type-' + $(this).data('option'));
    });

    $('.filter-year a').click(function(e) {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');

        var $table = $(this).closest('.div').find('table');
        $table.removeClass('year-all year-2014 year-2013').addClass('year-' + $(this).data('option'));
    });

    $('.go').click(function(e) {
        e.preventDefault();
        go($(this).attr('href').replace(/#/, ''));
    });

    var $select = $('<select>', {'class': 'select'});
    $select.append($('<option>', {'text': 'New', 'value': 0}));
    $select.append($('<option>', {'text': 'Yes', 'value': 1}));
    $select.append($('<option>', {'text': 'Maybe', 'value': 2}));
    $select.append($('<option>', {'text': 'No', 'value': 3}));
    $select.append($('<option>', {'text': '√ Emailed', 'value': 4}));
    $select.append($('<option>', {'text': 'Delete', 'value': 7}));

    var hackfests = {};

    var $hf = $('#hackfest');
    $hf.bind('go', function() {
       var HackFest = Parse.Object.extend("HackfestObject");
       var query = new Parse.Query(HackFest);
       //query.equalTo("playerName", "Dan Stemkoski");
       query.limit(1000);
       query.descending("createdAt");
       query.find({
           success: function(results) {
               var to_edit = ['full_name', 'email', 'college', 'year', 'selected_file', '-', 'team1', 'team1college', 'team1email', 'team1resume', '-', 'team2', 'team2college', 'team2email', 'team2resume', '-', 'team3', 'team3college', 'team3email', 'team3resume', '-', 'why'];
               $('table tr.row', $hf).remove();
               $.each(results, function(k, v) {
                   hackfests[v.id] = v;

                   var type = v.get('team1email') ? 'team' : 'indv';
                   var $tr = $('<tr>', {'data-id': v.id, 'class': 'row type-' + type});

                   var $els = {};
                   var $email = $('<a>', {'href': 'mailto:' + v.get('email'), 'text': v.get('full_name')})
                   $els['name'] = $('<td>')
                   $els['name'].append($email);
                   $tr.append($els['name']);

                   $els['college'] = $('<td>', {'text': v.get('college') + ' ' + v.get('year')})
                   $tr.append($els['college']);

                   $els['intern'] = $('<td>', {'text': v.get('intern')});
                   $tr.append($els['intern']);

                   $els['resume'] = $('<td>');
                   $tr.append($els['resume']);
                   $els['resume'].append(resumeBuilder('selected_file', v));

                   var why = v.get('why'); $els['dazzle'] = $('<td>', {'class': 'dazzle'});

                   $els['dazzle'].append($('<div>', {'class': 'short', 'html': shorten(why)}));
                   $els['dazzle'].append($('<div>', {'class': 'long', 'html': longen(why)}));
                   $tr.append($els['dazzle']);

                   $tr.append($('<td>', {'text': prettyDate(v.createdAt)}));

                   var $sc = $select.clone();
                   $tr.append($('<td>').append($sc));
                   var status = v.get('status') ? v.get('status') : 0;
                   $tr.addClass('is-' + status);

                   $tr.addClass('year-' + v.createdAt.getUTCFullYear());

                   $sc.val(status);

                   $els['edit'] = $('<td>');
                   $tr.append($els['edit']);
                   $els['edit'].append(editor(v, to_edit));

                   addTeam(1, v, $els);
                   addTeam(2, v, $els);
                   addTeam(3, v, $els);

                   $('table', $hf).append($tr);
               });

           },
           error: function(error) {
               alert("Error: " + error.code + " " + error.message);
           }
       });
    });

    var $gp = $('#greylock');
    $gp.bind('go', function() {
       var Resume = Parse.Object.extend("ResumeObject");
       var query = new Parse.Query(Resume);
       query.limit(1000);
       //query.equalTo("playerName", "Dan Stemkoski");
       query.descending("createdAt");
       query.find({
           success: function(results) {
               var to_edit = ['full_name', 'college', 'year', 'email', 'why'];
               $('table tr.row', $gp).remove();
               $.each(results, function(k, v) {
                   hackfests[v.id] = v;
                   var $tr = $('<tr>', {'data-id': v.id, 'class': 'row'});

                   $tr.append($('<td>', {'text': v.get('full_name')}));
                   $tr.append($('<td>', {'text': v.get('college') + ' ' + v.get('year')}));
                   $tr.append($('<td>', {'text': v.get('email')}));

                   var $looking = $('<td>');
                   $tr.append($looking);

                   var looking = v.get('looking');
                   if(looking) {
                     $.each(looking, function(k, v) {
                         var name = v == 'ft' ? 'Full-Time' : 'Internship';
                         $looking.append($('<div>', {'text': name}));
                         $tr.addClass('type-' + v);
                     });
                   }

                   var why = v.get('why'); 
                   var $dazzle = $('<td>', {'class': 'dazzle'});

                   $dazzle.append($('<div>', {'class': 'short', 'html': shorten(why)}));
                   $dazzle.append($('<div>', {'class': 'long', 'html': longen(why)}));
                   $tr.append($dazzle);

                   $tr.append($('<td>', {'text': prettyDate(v.createdAt), 'title': v.createdAt}));

                   $tr.append($('<td>').append(resumeBuilder('selected_file', v)));

                   var $sc = $select.clone();
                   $tr.append($('<td>').append($sc));
                   var status = v.get('status') ? v.get('status') : 0;
                   $tr.addClass('is-' + status);

                   $tr.addClass('year-' + v.createdAt.getUTCFullYear());

                   $sc.val(status);

                   $edit = $('<td>');
                   $tr.append($edit);
                   $edit.append(editor(v, to_edit));

                   $('table', $gp).append($tr);
               });

           },
           error: function(error) {
               alert("Error: " + error.code + " " + error.message);
           }
       });
    });

    var $tfs = $('#tf_students');
    $tfs.bind('go', function() {
       var Resume = Parse.Object.extend("StudentObject");
       var query = new Parse.Query(Resume);
       query.limit(1000);

       var to_edit = ['name', 'university', 'year', 'email', 'resume'];

       query.descending("createdAt");
       query.find({
           success: function(results) {
               $('table tr.row', $tfs).remove();
               $.each(results, function(k, v) {
                   hackfests[v.id] = v;
                   var $tr = $('<tr>', {'data-id': v.id, 'class': 'row'});

                   $tr.append($('<td>', {'text': v.get('name')}));
                   $tr.append($('<td>', {'text': v.get('university') + ' ' + v.get('year')}));
                   $tr.append($('<td>', {'text': v.get('email')}));

                   $tr.append($('<td>', {'text': prettyDate(v.createdAt), 'title': v.createdAt}));
                   $tr.append($('<td>').append(resumeBuilder('resume', v)));

                   var $sc = $select.clone();
                   $tr.append($('<td>').append($sc));
                   var status = v.get('status') ? v.get('status') : 0;
                   $tr.addClass('is-' + status);
                   $tr.addClass('year-' + v.createdAt.getUTCFullYear());
                   $sc.val(status);

                   $edit = $('<td>');
                   $tr.append($edit);
                   $edit.append(editor(v, to_edit));

                   $('table', $tfs).append($tr);
               });

           },
           error: function(error) {
               alert("Error: " + error.code + " " + error.message);
           }
       });
    });

    var $tfc = $('#tf_companies');
    $tfc.bind('go', function() {
       var Resume = Parse.Object.extend("CompanyObject");
       var query = new Parse.Query(Resume);
       query.limit(1000);
       var to_edit = ['company_name', 'contact_name', 'company_url', 'email', 'logo'];

       query.descending("createdAt");
       query.find({
           success: function(results) {
               $('table tr.row', $tfc).remove();
               $.each(results, function(k, v) {
                   hackfests[v.id] = v;
                   var $tr = $('<tr>', {'data-id': v.id, 'class': 'row'});

                   $tr.append($('<td>', {'text': v.get('company_name')}));
                   $tr.append($('<td>', {'text': v.get('contact_name')}));
                   $tr.append($('<td>', {'text': v.get('email')}));

                   $tr.append($('<td>', {'text': prettyDate(v.createdAt)}));

                   $logo = $('<a>', {'text': v.get('company_url'), 'href': v.get('company_url'), 'target': '_blank'});
                   $tr.append($('<td>').append($logo));

                   $logo = $('<a>', {'text': 'View logo', 'href': v.get('logo'), 'target': '_blank'});
                   $tr.append($('<td>').append($logo));

                   var $sc = $select.clone();
                   $tr.append($('<td>').append($sc));
                   var status = v.get('status') ? v.get('status') : 0;
                   $tr.addClass('is-' + status);
                   $tr.addClass('year-' + v.createdAt.getUTCFullYear());
                   $sc.val(status);

                   $edit = $('<td>');
                   $tr.append($edit);
                   $edit.append(editor(v, to_edit));

                   $('table', $tfc).append($tr);
               });

           },
           error: function(error) {
               alert("Error: " + error.code + " " + error.message);
           }
       });
    });

    function addTeam(id, v, $els) {
        if(v.get('team' + id)) {
            $els['name'].append($('<a>', {'href': 'mailto:' + v.get('team' + id + 'email'), 'class': 'teammate', 'text': v.get('team' + id)}));

            var college = v.get('team' + id + 'college');
            college = college ? college : '-';
            $els['college'].append($('<div>', {'class': 'teammate', 'text': college}));

            
            $els['resume'].append(resumeBuilder('team' + id + 'resume', v));

            $els['intern'].append($('<div>', {'class': 'teammate', 'text': v.get('team' + id + 'intern')}));
        }
    }

    $(document).on('change', '.select', function() {
        var $tr = $(this).closest('tr').trigger('click');
        var obj = hackfests[$tr.data('id')]

        var $this = $(this);
        $this.attr('disabled', true);

        obj.set('status', $(this).val());

        obj.save(null, {
            success: function() {
                //alert('saved!');
                $this.attr('disabled', false);
            },
            error: function() {
                alert('Error!');
                $this.attr('disabled', false);
            }
        });
    });

    $(document).on('click', 'tr.row', function() {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    go(user ? 'hackfest' : 'login');

    $('.logout').click(function(e) {
        Parse.User.logOut();
        go('login');
    });
});

function go(url) {
    $('#container > div').hide();
    var $div = $('#' + url);
    $div.show();
    $div.trigger('go');
}

function both(text) {
    text = text.replace(/</, '&lt;');
    text = text.replace(/[\r\n]/, '<br><br>');
    return text;
}

function shorten(text) {
    text = both(text);
    return text.substring(0, 50) + "&hellip;";
}

function longen(text) {
    text = both(text);

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = text.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    text = replacedText;

    /*
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    text = text.replace(exp,"<a href='$1' target='_new'>$1</a>"); 
    */

    return text;
}
