$('document').ready(function(){
    $('#footer-social a, #portfolio-navigation a, .footer-contact-icon span').hover(
        function(){ $(this).animate({ 'opacity' : 1 }); console.log('aaa')},
        function(){ $(this).animate({ 'opacity' : 0 }); }
    );
})