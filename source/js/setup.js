Parse.initialize(
    "wGmcmQXZz4weKUCNZzB1U6nPsGZHWyxbjHGuDLA8", 
    "9ufY5An9MmK50oq1Bb4DVTKfnP8RefS33oOCN7nj");

$.fn.randomize = function(){
    var arr = [];
    this.each(function() {
        arr.push($(this));
    });

    var n = arr.length;
    var tempArr = [];
    for ( var i = 0; i < n-1; i++ ) {
        // The following line removes one random element from arr
        // and pushes it onto tempArr
        tempArr.push(arr.splice(Math.floor(Math.random()*arr.length),1)[0]);
    }
    // Push the remaining item onto tempArr
    tempArr.push(arr[0]);
    return tempArr;
}

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.is_mobile = function(){
    var $window = $(window);
    return categorizr.isMobile;
    //return $window.width() < 480 || $window.height() < 480;
}

jQuery.validator.addMethod("validyear", function(value, element) {
    try {
        var v = parseInt(value);
    } catch(err) {
        return this.optional(element) || false;
    }
    var valid = v > 2001 && v < 2020;
    return this.optional(element) || valid;
}, "Invalid year");

jQuery.whenArray = function ( array ) {
    return jQuery.when.apply( this, array );
};

function preload_images(imgs_in) {
    var promises = [];
    var dfd = $.Deferred();
    $.each(imgs_in, function(k, v) {
        var imgs = v.css('background-image').match(/\((.*?)\)/g);
        $.each(imgs, function(k, v) {
            p = $.Deferred();
            img = $("<img />");
            img.load(p.resolve);
            img.error(p.resolve);
            promises.push(p);

            img.get(0).src = v.replace(/[()"]/g, "");
        });
    });
    $.whenArray(promises).done(dfd.resolve);
    return dfd.promise();
};
