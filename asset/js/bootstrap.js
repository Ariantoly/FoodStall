(function($, d, w){
    /* ------------------- FUNCTIONS -------------------------- */
    var dmdMethods = {
        'checkExist':function(variable, type){
            if(variable == undefined || variable == '')
            {
                return false
            }
            else
            {
                if(type != undefined)if(typeof variable != type)return false;
                return true;
            }
        },
        'ac_search' : function(source,look){
            var contain = [];
            if(source == undefined)source = [];
            for(var i = 0; i < source.length; i++)
            {
                if(source[i].toLowerCase().indexOf(look.toLowerCase()) != -1)contain.push(source[i]);
            }
            return contain;
        },
        'ac_append' : function(holder, data){
            var ul = $('<ul></ul>');
            for(var i = 0; i < data.length; i++)
            {
                ul.append('<li><a href="#">'+data[i]+'</a></li>')
            }
            holder.children().remove();
            holder.append(ul);
            return holder;
        },
        'lightboxes' : {
            
        },
        'lightbox' : function(settings){
            var removeIt = function(container){
                $('body').css('overflow','auto');
                $('#black-overlay').fadeOut('fast',function(){$('#black-overlay').remove()}) ;
                if(container != undefined)container.fadeOut('fast',function(){container.remove()});
            }
            var contain             = $('<div class="contain-wrap"></div>');
            var blackLayer          = $('<div id="black-overlay"></div>');
            var container           = $('<div class="modal-container"></div>');
            var buttonClose         = $('<a class="btn close"></a>');
            
            if(settings.content == '') var content = settings.object.clone();
            else var content = settings.content.clone();
            content.css('margin','0 auto');


            removeIt();
            blackLayer.css({
                'width':$(d).width(),
                'height':$(d).height()
            });

            if(settings.modal != false)$('body').css('overflow','hidden');


            container.prependTo('body');
            if(settings.modal)blackLayer.prependTo('body').hide().fadeIn('medium');
            contain.prependTo(container);
            buttonClose.prependTo(container);

            content.appendTo(contain).show();
            container.css({
                'left'  :$(w).innerWidth() / 2 - contain.outerWidth() / 2,
                'top'   :$('body').scrollTop() - container.outerHeight()
            });
            container.animate({'top':$('body').scrollTop() + 100},200);

            buttonClose.click(function(e){
                e.preventDefault();
                removeIt(container);
            });
            blackLayer.click(function(){
                removeIt(container);
            });
     
            return container;
        }
    }
    /* ------------------- DEFAULT BEHAVIOUR ------------------ */


    /* ------------------- CUSTOM PLUGIN ---------------------- */
    $.fn.dmdModal = function(options){
        
        var settings = new Object();
        var object   = this;
        var defaults = {
            'content'   :'',
            'modal'     :true,
            'object'    :object
        }
        
        settings = $.extend( settings, defaults);
        if(typeof options == 'object') settings = $.extend( settings, options);
        else if(typeof options == 'string') settings.mode = options;
        if(settings.mode == 'close')
        {
            if(dmdMethods.lightboxes[this])
            {
                var obj = dmdMethods.lightboxes[this];
                $('body').css('overflow','auto');
                $('#black-overlay').fadeOut('fast',function(){$('#black-overlay').remove()}) ;
                obj.fadeOut('fast',function(){obj.remove()});
            }
            
            return;
        }
        var lightbox = dmdMethods.lightbox(settings);
        dmdMethods.lightboxes[this] = lightbox;
        
        return lightbox;
        
    };
    $.dmdGallery = function(options){
        if(options.images == undefined)return;
        var elem;
        var caption = false;
        if(typeof options.images[0] == 'object'){elem = options.images[0].src;caption = options.images[0].caption}
        else elem = options.images[0];
        $('<img src="'+elem+'"/>').dmdGallery($.extend(options,{ajax:true,caption:caption}));
    }
    $.fn.dmdGallery = function(options){
        var settings = new Object();
        var object   = this;
        var counter  = 0;
        var defaults = {
            'content'   :'',
            'modal'     :false,
            'object'    :object.eq(0),
            'type'      :'gallery',
            'caption'   : false
        };
        var imageSizeAdjust = function(lightbox, object, caption){
            var top             = 100;
            var contentWidth    = lightbox.find('.contain-wrap img').outerWidth();
            var contentHeight   = lightbox.find('.contain-wrap img').outerHeight();
            var windowWidth     = $(w).innerWidth();
            var windowHeight    = w.innerHeight;
            var ratio;
            if((contentWidth + 200) > windowWidth && (contentHeight + 150) > windowHeight){

                var maxHeight   = windowHeight - 200;
                var maxWidth    = windowWidth - 200;
                var heightDiff  = contentHeight - maxHeight;
                var widthDiff   = contentWidth - maxWidth;
                ratio       = contentHeight / contentWidth;
                contentWidth    = maxWidth;
                contentHeight   = ratio * contentWidth;
                if(contentHeight > maxHeight)
                {
                    ratio       = contentWidth / contentHeight;
                    contentHeight   = maxHeight;
                    contentWidth    = ratio * contentHeight;
                }
                top = $('body').scrollTop() + (windowHeight / 2) - (contentHeight / 2);
                lightbox.find('.contain-wrap img').animate({'width':contentWidth,'height':contentHeight},200);
                lightbox.find('.contain-wrap').prepend($('<div class="resize-info">Image scale down from its <a href="'+lightbox.find('.contain-wrap img').attr('src')+'">orginal size</a></div>'));
            }
            else if((contentWidth + 200) > windowWidth ){
                ratio = contentHeight / contentWidth;
                contentWidth    = windowWidth - 150;
                contentHeight   = ratio * contentWidth
                lightbox.find('.contain-wrap img').animate({'width':contentWidth},200);
                lightbox.find('.contain-wrap').prepend($('<div class="resize-info">Image scale down from its <a href="'+lightbox.find('.contain-wrap img').attr('src')+'">orginal size</a></div>'));
            }
            else if((contentHeight + 150) > windowHeight){
                ratio = contentWidth / contentHeight;
                contentHeight = windowHeight - 200;
                contentWidth  = ratio * contentHeight;
                top = $('body').scrollTop() + (windowHeight / 2) - (contentHeight / 2);
                lightbox.find('.contain-wrap img').animate({'height':contentHeight},200);
                lightbox.find('.contain-wrap').prepend($('<div class="resize-info">Image scale down from its <a href="'+lightbox.find('.contain-wrap img').attr('src')+'">orginal size</a></div>'));
            }
            
            lightbox.animate(
            {
                'left':0 + (windowWidth / 2) - (contentWidth / 2),
                'top':top
            },200);
            if(caption != false)assignCaption(lightbox,caption);
        }
        var assignCaption = function(lightbox,caption){
            var captionElement = $('<div class="gallery-caption">'+caption+'</div>');
            var currentCaption = '';
            if($(caption).length == 0){
                // A STATIC STRING CAPTION INPUTTED
                currentCaption = caption;
            }
            else{
                // A JQUERY ELEMENT INPUTTED
                currentCaption = $(caption).eq(counter).length > 0 ? $(caption).eq(counter).html() : $(caption).html();
            }
            lightbox.find('.contain-wrap').append(captionElement);
            captionElement.html(currentCaption);
            lightbox.hover(function(){
                captionElement.show();
            },function(){
                captionElement.hide();
            })
        }
        var appendGallery = function(lightbox, object, caption){
            if(settings.ajax == true )
            {
                lightbox.find('.contain-wrap').html($("<span class='preloader'></span>"));
                var img = new Image();
                var src;
                if(typeof settings.images[counter] == 'object')
                {
                    src = settings.images[counter].src;
                    if(settings.images[counter].caption != undefined)caption = settings.images[counter].caption;
                }
                else
                {
                    src = settings.images[counter];
                }
                img.src = src;
                img.onload = function(){
                    object = $('<img src="'+src+'"/>');
                    lightbox.find('.contain-wrap').html(object);
                    imageSizeAdjust(lightbox, object, caption);
                }
            }
            else
            {
                lightbox.find('.contain-wrap').html(object.clone());
                imageSizeAdjust(lightbox, object, caption);
            }
        }
        settings = $.extend( settings, defaults);
        if(typeof options == 'object') settings = $.extend( settings, options);
        else if(typeof options == 'string') settings.mode = options;

        var lightbox    = dmdMethods.lightbox(settings);
        var next        = $('<a class="btn next">NEXT</a>');
        var prev        = $('<a class="btn prev">PREVIOUS</a>');
        var caption     = settings.caption;
        var totalData   = settings.images == undefined ? object.length : settings.images.length;
        
        next.click(function(e){
            e.preventDefault();
            counter++;
            if(counter >= totalData)counter = 0;
            appendGallery(lightbox,object.eq(counter),caption);
            
        });
        prev.click(function(e){
            e.preventDefault();
            counter--;
            if(counter < 0)counter = totalData - 1;
            appendGallery(lightbox,object.eq(counter),caption);
            
        });
        if(caption != false)assignCaption(lightbox,caption);
        
        lightbox.prepend(next);
        lightbox.prepend(prev);
        return lightbox;
    }
    $.fn.dmdTooltip = function(options){
        if(options == undefined || typeof options != 'object')return;
        
        var open = function(tooltip, obj, i){
            var position        = $(obj).offset();
            var width           = $(obj).innerWidth();
            var height          = $(obj).innerHeight();
            $('body').append(tooltip);
            
            var toolTipWidth    = tooltip.innerWidth();
            var toolTipHeight   = tooltip.innerHeight();
            tooltip.css({
                    'left':(position.left + (width / 2)) - (toolTipWidth / 2),
                    'top':position.top - (toolTipHeight + 5)
                });
            tooltip.fadeIn('fast');
            return tooltip;
        };
        var close = function(tooltip,i){
            
            tooltip.fadeOut('fast',function(){tooltip.remove()});
        }
        var toggle = function(tooltip, obj, i){
            if($('body #tooltip-'+i).length > 0) close(tooltip,i);
            else open(tooltip, obj, i);
        }
        this.each(function(i,obj){ 
            var addText = '';
            if($(obj).attr('id') != undefined && $(obj).attr('id') != '')addText = $(obj).attr('id');
            else addText = $(obj).attr('class').replace(new RegExp('\\s','g'),'-')

            var tooltip = $('<span class="dmd-tooltip" id="tooltip-'+addText+'-'+i+'"></span>');
            tooltip.text(options.text);
            switch(options.trigger)
            {
                case 'click':
                    $(obj).click(function(){toggle(tooltip, obj, i)})
                    break;
                case 'focus':
                    $(obj).focus(function() {open(tooltip, obj, i)});
                    $(obj).blur(function() {close(tooltip,i)});
                    break;
                default:
                    $(obj).hover(
                        function(){open(tooltip, obj, i)},
                        function(){close(tooltip,i)}
                    );
                    break;
            }
            
        })
    }
    
    $.fn.completeIt = function(options){
        if(!dmdMethods.checkExist(this.attr('id')))return;
        if(!dmdMethods.checkExist(options))options = new Object();
        
        var defaults = {
            'goneOnEmpty':true,
            'source':[]
        }
        var settings = $.extend( defaults, options);

        var name        = this.attr('id');
        var source      = settings.source;
        var data        = [];
        var dropdown    = $('<div class="dmd-form-dropdown"></div>');
        var container   = $('<div id="'+name+'-container" class="imitate-container"></div>');
        
        this.before(container);
        this.appendTo(container);
        dropdown.appendTo(container);
        
        this.keyup(function(e){
            if(e.keyCode == 40)$(this).parent().find('.dmd-form-dropdown li').eq(0).find('a').focus();
            else
            {
                if(settings.goneOnEmpty == true)dropdown.html('');
                if($(this).val() != '')
                {
                    data = dmdMethods.ac_search(source,$(this).val());
                    dmdMethods.ac_append( dropdown, data);
                }
                else if(settings.goneOnEmpty != true){
                    dmdMethods.ac_append( dropdown, source);
                }
            }
        });
        dropdown.on('keyup','a',function(e){
            if(e.keyCode == 40)
            {
                if($(this).parent().next('li').length > 0) $(this).parent().next('li').find('a').focus();
                else container.find('input').focus();
            }
            else if(e.keyCode == 38)
            {
                if($(this).parent().prev('li').length > 0) $(this).parent().prev('li').find('a').focus();
                else container.find('input').focus();
            }
        });
        dropdown.on('focus','a',function(e){$(this).parent().addClass('focus')});
        
        dropdown.on('mouseover','a',function(){
            $(this).parents('.dmd-form-dropdown').find('li').removeClass('focus');
        });
        dropdown.on('blur','a',function(e){$(this).parent().removeClass('focus')});
        return container;
    }
    
    $.fn.combobox = function(){
        var name = this.attr('id');
        
        if(this.is('select'))
        {
            // FUTURE FEAUTURE : MULTIPLE SELECT
            var button      = this;
            var container   = $('<div id="'+name+'-container"></div>');
            var combo       = $('<input id="'+name+'-fake" />');
            var contreng    = $('<i class="icon-checklist"></i>');
            var magnifier    = $('<div class="magnifier-wrap"><i class="icon-magnifier"></i><div>');
            var child       = this.find('option');
            var data = [];
            this.before(container);
            this.before(combo);
            this.appendTo(container);
            combo.prependTo(container);
            

            
            for(var i = 0;i < child.length;i++)data.push($(child[i]).text());
            this.css({
                'display':'none'
            });
            combo.completeIt({source:data,'goneOnEmpty':false});
            magnifier.insertAfter(combo);
            container.width(this.outerWidth());
            container.find('.dmd-form-dropdown').width(this.outerWidth());
            container.on('click',"#"+name+"-fake",function(){
                var dropdown = container.find('.dmd-form-dropdown');
                if(dropdown.children().length > 0)
                {
                    dropdown.find('ul').stop().slideUp('fast',function(){dropdown.html('')});
                    
                }
                else
                {
                    dmdMethods.ac_append( dropdown, data);
                     child.each($.proxy(function(i,obj){
                        if($(obj).text() == $(this).val()){
                            container.find('li').eq(i).find('a').append(contreng);

                        }
                    },this));
                }
            });
           
            container.on('click','a',function(e){
                e.preventDefault();
                
                child.removeAttr('selected');
                child.each($.proxy(function(i,obj){
                    if($(obj).text() == $(this).text()){
                        $(obj).attr('selected','selected');
                    }
                    combo.val($(this).text());
                },this));
                container.find('.dmd-form-dropdown').html('');
            })
        }
    }
    $.fn.dmdSlideShow = function(options){
        var defaults = {
            'speed' : 300,
            'elements':{},
            'navigator':'NUMBER'
        };
        if(options != undefined)options = $.extend(defaults,options);
        var container = this;
        var slideshows = this.find('.slideshow');
        var railContainer = $('<div id="'+this.attr('id')+'-rail-container" class="rail-container"></div>');
        var rail = $('<div id="'+this.attr('id')+'-rail" class="rail"></div>');
        var singleWidth = slideshows.eq(0).width();
        var navigator = $('<div id="'+this.attr('id')+'-navigator"></div>');
        var slideSpeed = options.speed;
        rail.css({
            'position':'relative',
            'width' : singleWidth * slideshows.length
        });
        railContainer.css('width',this.width());
        rail.appendTo(railContainer);
        this.prepend(railContainer);
        
        for(var j = 0; j < slideshows.length; j++)
        {
            navigator.append('<a class="commander" slideshow="'+j+'">'+(options.navigator == 'NUMBER' ? j : options.navigator)+'</a>');
        }
        navigator.css({
            'position':'absolute',
            'bottom' : '-30px'
        });
        this.append(navigator);
        
        slideshows.each(function(i,obj){
            $(this).css({
                'width':singleWidth
            });
            $(this).addClass('slideshow-'+i);
            $(this).attr('slideshow',i);
            $(this).appendTo(rail);
            if(i == 0)$(this).addClass('active');
        });
        this.on('click','.commander',function(e){
            e.preventDefault();

            var destination = parseInt($(this).attr('slideshow')) ;
            var current  = parseInt(container.find('.active').attr('slideshow')) ;
            if(current == destination)return;
            
            var destinationSlideshow = container.find('#slideshow-'+destination);
            
            destinationSlideshow.children().each(function(i, obj){
                if(options[$(this).attr('id')] != undefined)
                {
                    $(this).css({'position':'relative','left': (current < destination ? destinationSlideshow.width() : 0 - $(this).width() ) });
                }
                
            });

            if(current < destination)
            {
                // ke kiri
                rail.animate({'left':0 - (singleWidth * (destination - 1))},destination - 1 == current ? 0 : slideSpeed,"linear",function(){
                    
                    rail.animate({'left':rail.position().left - singleWidth},slideSpeed,"linear");
                    destinationSlideshow.children().each(function(i, obj){
                        
                        if(options[$(this).attr('id')] != undefined)
                        {
                            $(this).animate({'position':'relative','left':0},options[$(this).attr('id')]);
                        }else{
                            $(this).animate({'left':0},slideSpeed);
                        }
                    });
                });
                
            }
            else if(current > destination)
            {
                // ke kanan
                
                rail.animate({'left':0 - (singleWidth * (destination + 1))},destination + 1 == current ? 0 :slideSpeed,"linear",function(){
                    rail.animate({'left':rail.position().left + singleWidth},slideSpeed,"linear");
                    destinationSlideshow.children().each(function(i, obj){
                        if(options[$(this).attr('id')] != undefined)
                        {
                            $(this).animate({'position':'relative','left':0},options[$(this).attr('id')]);
                        }else{
                            $(this).animate({'left':0},slideSpeed);
                        }
                    });
                });
            }
            container.find('.active').removeClass('active');
            container.find('#slideshow-'+destination).addClass('active');
        })
        
        return this;
    }
    $(document).ready(function(){
        $('#footer-social a, #portfolio-navigation a, .footer-contact-icon span').hover(
            function(){ $(this).animate({ 'opacity' : 1 }); },
            function(){ $(this).animate({ 'opacity' : 0 }); }
        );
    })
    
    /* --------------------------------------------------------- */
//    $('#popup-trigger').click(function(){
//        $('#sample-lightbox').dmdModal({modal:false});
//        $('#sample-gallery img').dmdGallery();
//    $.dmdGallery({
//            images:['sample-images/minum.jpg','sample-images/EQUIPE_LAZIO_ROME.jpeg','sample-images/balance-scale.jpeg']
//            images:[
//                {src:'sample-images/minum.jpg',caption:'MINUM AHHH'},
//                {src:'sample-images/EQUIPE_LAZIO_ROME.jpeg',caption:'ITS LAZIOOO'},
//                {src:'sample-images/balance-scale.jpeg',caption:'TIMBANGAN PASAR'}
//            ]
//        });
//    });
//    var modal;
//    $('#modal-trigger').click(function(){
//        modal = $('#sample-lightbox').dmdModal();
//        modal.on('click','#close-modal',function(){
//            $('#sample-lightbox').dmdModal('close');
//        });
//    });
//    
//    $('.btn').dmdTooltip({'text':'my tooltip','trigger':'hover'});
//    $('#select-test').combobox();
//    $('#completeit').completeIt({source:['budi','joko','paul','jonathan','rebecca','usrop','oncom']});
})(jQuery, document, window);