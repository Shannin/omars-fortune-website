(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        event.preventDefault();

        var $anchor = $(this);
        $(document.body).animate({
            'scrollTop':   $($anchor.attr('href')).offset().top
        }, 1250);
    });

    function adjustPage() {
        if ($(window).scrollTop() > 150){
            $('#mainNav').addClass('visible');
        } else {
            $('#mainNav').removeClass('visible');
        }
    }

    $(window).scroll(function(){
        adjustPage();        
    });

    $(document).ready(function () {
        adjustPage();

        var isEighteen = localStorage.getItem('isEighteen');
        if (!isEighteen) {
            $('#age-verify-modal').addClass('visible');
        }
    });

    $('.newsletter-form').submit(function (event) {
        event.preventDefault();
        var form = $(this);
        var emailInput = $('input[name="email"]', form);
        var submitBtn = $('button[type="submit"]', form);

        var errorBox = $('.error-box', this);
        errorBox.html('');

        var postData = {};
        $(this).serializeArray().forEach(function (obj) {
            postData[obj.name] = obj.value;
        });

        if (postData.email === "") {
            emailInput.attr('placeholder', 'Please enter an email address');
            emailInput.closest('.form-group').addClass('error');

            errorBox.html('Please enter an email address');
            return;
        }

        submitBtn.prop('disabled', true);
    
        $.post('/api/newsletter', postData, function(data) {
            submitBtn.prop('disabled', false);

            if (!data.success) {
                emailInput.closest('.form-group').addClass('error');
                errorBox.html(data.message);
                return;
            }

            $('.newsletter-form__form', form).toggle();
            $('.newsletter-form__success-message', form).toggle();
        });
    });



    $('#contact-form').submit(function (event) {
        event.preventDefault();
        var form = $(this);

        var errorBox = $('.error-box', this);
        errorBox.removeClass('success');
        errorBox.html('');

        $('.form-group', form).each(function(idx) {
            $(this).removeClass('error');
        });

        var nameInput = $('input[name="name"]', form);
        var emailInput = $('input[name="email"]', form);
        var companyInput = $('input[name="company"]', form);
        var commentInput = $('textarea[name="comment"]', form);
        var submitBtn = $('button[type="submit"]', form);

        var postData = {};
        $(this).serializeArray().forEach(function (obj) {
            postData[obj.name] = obj.value;
        });

        var success = true;
        if (postData.comment === "") {
            commentInput.closest('.form-group').addClass('error');
            errorBox.html('What would you like to say?');
            success = false;
        }

        if (postData.email === "") {
            emailInput.closest('.form-group').addClass('error');
            errorBox.html('Please enter an email address.');
            success = false;
        }

        if (success) {
            submitBtn.prop('disabled', true);
            
            $.post('/api/contact', postData, function(data) {
                submitBtn.prop('disabled', false);

                if (!data.success) {
                    errorBox.html(data.message);
                    return;
                }

                errorBox.addClass('success');
                errorBox.html('Thanks!  We look forward to hearing what you have to say.')

                nameInput.val('');
                emailInput.val('');
                companyInput.val('');
                commentInput.val('');
            });
        }
        
    });

})(jQuery);
