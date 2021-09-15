/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function($){
    var stickmenu = function()
    {
        var toggle                  = $('#sidebar-toggle');
        var sidebar                 = $('#sidebar');
        var sidebarWrapper          = $('#sidebar-wrapper');
        var sidebarWrapperHeight    = $('#sidebar-wrapper').height();
        var sidebarWrapperPos       = sidebarWrapper.offset();
        var nav                     = $('.container.menu');
        var navHeight               = nav.height();
        var dummyElement            = $('<div class="container"></div>');
        var footer                  = $('#footer');
        var footerPos               = footer.offset();
        var bread                   = $('#breadcrumb-info');
        var breadPosition           = bread.offset();
        var positionNav             = nav.offset();
        var content                 = $('#content');
        var contentPosition         = $('#content').offset();
        var open                    = false;
        var putCentre               = true;
        var stick                   = false;
        var width                   = 240;
        var sidebarLeft             = -240;
        var windowHeight            = $(window).height();
        var updateScrollbar = function()
        {
            sidebarWrapper.mCustomScrollbar('update');
        }
        var detectViewPort = function ()
        {
            var viewport        = 0;
            var windowHeight    = $(window).height();
            var windowTop       = $(window).scrollTop();
            var footerTop       = footer.offset();
            if(windowTop + navHeight > contentPosition.top)
            {
                
                viewport = windowHeight - navHeight - (footerTop.top > windowTop + windowHeight ? 0 : (windowTop + windowHeight- footerTop.top));
                
            }
            else
            {
                var contentTop  = contentPosition.top - windowTop ;
                var overWindow = windowHeight > contentTop + content.height() ? 0 : contentTop + content.height() - windowHeight;
                viewport = content.height() - overWindow;
            }
            return viewport; 
        }
        var putToCenter = function (viewport)
        {
            if(viewport > sidebarWrapperHeight + 170)
            {
                if(stick == false)
                {
                    //sidebarWrapper.css('maxHeight','300px');
                    //sidebarWrapper.addClass('center');
                    //sidebarWrapper.css('height',300);
                    //sidebar.stop().animate({'padding-top':'170px'},100,updateScrollbar);
                    updateScrollbar();
                }
                else
                {
                    //sidebarWrapper.css('maxHeight','100%');
                    sidebarWrapper.removeClass('center');
                    sidebarWrapper.css('height','100%');
                    sidebar.stop().animate({'padding-top':'0'},100,updateScrollbar); 
                }
                
            }
            else
            {
                //sidebarWrapper.css('maxHeight','100%');
                sidebarWrapper.removeClass('center');
                sidebarWrapper.css('height','100%');
                sidebar.stop().animate({'padding-top':'0'},100,updateScrollbar);
                
            }
            toggle.css('top',(viewport / 2)-(toggle.height() / 2))
            
        }
        var windowResize = function()
        {
            if(content.height() > 270 && content.height() < 320)content.height(350);
            viewport = detectViewPort();
            sidebar.css('height',viewport);
            putToCenter(viewport);
        }
        var scrollEvent = function()
        {
            var window_position = $(window).scrollTop();
            var window_left = $(window).scrollLeft();
            viewport = detectViewPort();
            footerPos       = footer.offset();
            windowHeight    = $(window).height();
            
            // MENU STICKNESS
            sidebar.height(viewport);
            if(window_position + navHeight > sidebarWrapperPos.top)
            {
                sidebar.css('top',window_position - (breadPosition.top + bread.height() - navHeight));
            }
            else
            {
                sidebar.css('top',0);   
            }
            putToCenter(viewport);
            
            // STICK NAV TO TOP PAGE
            if(window_position > positionNav.top && !stick)
            { 
                nav.css({
                    'position':'fixed',
                    'top':0,
                    'zIndex':9999,
                    'width':960
                });
                dummyElement.css('height', nav.height());
                $('#breadcrumb').before(dummyElement);
                stick = true;
            }
            else if(window_position < positionNav.top && stick)
            {
                nav.css({
                    'position':'static',
                    'zIndex':0
                });
                dummyElement.remove();
                 stick = false;    
            }
            if(stick && window_left > 0 && $(window).width() < 980)
            {
                nav.css('left',0 - window_left + 10);
            }else if(stick && window_left == 0 && $(window).width() < 980)
            {
                nav.css('left',0 + 10);
            }
        }
        var menutToggle = function(e)
        {
            if(!open)
            {
                // OPEN SIDEBAR
                sidebar.stop().animate({'left':0},200);
                toggle.find('i').addClass('icon-arrowleft-1');
                toggle.find('i').removeClass('icon-arrowright-1');
                open = true;
            }
            else
            {
                // CLOSE SIDEBAR
                sidebar.stop().animate({'left':0 - width},200);
                toggle.find('i').addClass('icon-arrowright-1');
                toggle.find('i').removeClass('icon-arrowleft-1');
                open = false;
            }
            updateScrollbar();
        }
        

        toggle.click(menutToggle);
        content.resize(windowResize);
        $(window).resize(windowResize);
        $(window).scroll(scrollEvent);
        windowResize();
    };
    $(document).ready(function(){
            
        $("#sidebar-wrapper").mCustomScrollbar({
                scrollButtons:{
                        enable:false
                }
        });
        $('#regist-program').combobox();
        stickmenu();
        $('#sidebar .sidebar-menu > li').each(function(i,obj){
            var child = $(obj).find('ul');
            if(child.length > 0)
            {
                child.hide();
                $(obj).click(function(e){
                    child.slideToggle('fast',function(){$("#sidebar-wrapper").mCustomScrollbar('update');});
                    var arrow = $(this).find('i');
                    if(arrow.hasClass('icon-arrowright-2'))
                    {
                        arrow.removeClass('icon-arrowright-2');
                        arrow.addClass('icon-arrowdown-1');
                    }
                    else
                    {
                        arrow.removeClass('icon-arrowdown-1');
                        arrow.addClass('icon-arrowright-2');
                    }
                    
                })
            }
        })
    });
    
})(jQuery);
function panjangincontent()
{
    $('body').scrollTop();
    $('#content').height(2000);
    $(window).scroll();
}

