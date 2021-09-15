// This file is specifically 
// Enable strict mode in ECMAScript 5
"use strict";
(function($) {
	var interval = null;
    $(document).ready(function() {
		loadServerTime();

        setInterval(function(){
            clearInterval(interval);
            loadServerTime();
        },(10*60*1000));
	
	
        loadRoleSelect();

        
            var data = {'menu': []};
                
 
                
                
                function formatingMenu(menuData) {
                    var tempArray = [];
                    for (var i = 0; i < menuData.length; i++) {
                        menuData[i].ParentModuleID = menuData[i].ParentModuleID || 'Master';
                        if (!tempArray[menuData[i].ParentModuleID]) tempArray[menuData[i].ParentModuleID] = [];
                        tempArray[menuData[i].ParentModuleID].push({
                            ID: menuData[i].ModuleID,
                            desc: menuData[i].ModuleDescription,
                            isMenu: menuData[i].IsMenu,
                            location: menuData[i].ModuleLocationID,
                            mobile: menuData[i].MobileAccess,
                            name: menuData[i].ModuleName,
                            icon: menuData[i].ModuleIcon,
                            sub: [],
                            url: menuData[i].ModuleUrl // edit by edric
                        });
                    }
                    BM.listMenu = [];

                    function subMenu(moduleName) {
                        var returnArray = [];
                        if (tempArray[moduleName]) {
                            returnArray = tempArray[moduleName];
                            for (var j = 0; j < returnArray.length; j++) {
                                if (tempArray[returnArray[j].ID]) {
                                    returnArray[j].sub = subMenu(returnArray[j].ID);
                                }
                            }
                        }
                        return returnArray;
                    }
                    BM.listMenu = subMenu("Master");
                }

                function displayMenu() {
                    var menuData = BM.listMenu;

                    function addSubMenu(arr, dom) {
                        var newSubMenuContainer = $("<ul class='sub-sub-menu'></ul>");
                        newSubMenuContainer.append($("<li class='separator'></li>"));
                        for (var i = 0; i < arr.length; i++) {
                            var subMenuContainer = $('<li class="no-icon"></li>');
                            var subMenu = $('<a><span class="label">' + arr[i].name + '</span></a>');
                            subMenu.attr('href', BM.baseUri + arr[i].url).attr('title', arr[i].desc);
                            //Validasi untuk ke web Library
                            if (arr[i].url.indexOf("http://") > -1 || arr[i].url.indexOf("https://") > -1) {
                                subMenu.attr('href', arr[i].url).attr('title', arr[i].desc);
                            }
                            subMenuContainer.append(subMenu);
                            if (arr[i].sub.length > 0) {
                                addSubMenu(arr[i].sub, subMenuContainer);
                            }
                            newSubMenuContainer.append(subMenuContainer);
                        }
                        dom.append(newSubMenuContainer);
                    }
                    for (var i = 0; i < menuData.length; i++) {
                        var newMenuContainer = $('<li></li>');
                        var newMenu = $('<a><i class="' + menuData[i].icon + '"></i><span class="label">' + menuData[i].name + '</span></a>');
                        newMenu.attr('href', BM.baseUri + menuData[i].url).attr('title', menuData[i].desc);
                        //Validasi untuk ke web Library
                        if (menuData[i].url.indexOf("http://") > -1 || menuData[i].url.indexOf("https://") > -1) {
                            newMenu.attr('href', menuData[i].url).attr('title', menuData[i].desc);
                        }
                        newMenuContainer.append(newMenu);
                        if (menuData[i].sub.length > 0) {
                            addSubMenu(menuData[i].sub, newMenuContainer);
                        }
                        $("#applicationlist-" + menuData[i].location).before(newMenuContainer);
                    }
                    $('.expand-item-menu li:has("ul")').addClass('has-menu');
                }
                formatingMenu(data.menu);
                displayMenu();

                window.binus_navigation();
                
                // reset state for clicking
                $(document).click(function() {
                    /*$('#roleselector').hide();*/
                    /*roleOpen = false;*/
                    if ($('#mainname').hasClass('selected')) {
                        $('#mainname').removeClass('selected');
                        $('#mainnameext').hide();
                    }
                });

                var flag = false;
                $(".top-navigation-lecturer").click(function(){
					
                    if(!flag){
                        flag=true;
                        // $.ajax({
                        //     type: 'POST',
                        //     url: BM.serviceUri + 'lecturer/currentcourse/getAcadCareer',
                        //     success: function(data)
                        //     {
                        //         $(".iCourseLoading").remove();
                        //         for(var a = 0; a< data.length; a++)
                        //         {
                        //             var acad = $('#courseTemplate').clone().removeAttr('id').removeClass('looptemplate').removeAttr('style');
                                    
                        //             $('span', acad.children('a')).text(data[a][1]);

                        //             var curr1, prev1 = '';
                        //             for(var b = 0; b<=data[a][2].length; b++)
                        //             {
                        //                 ;
                        //                 if(b==data[a][2].length && data[a][3] != '')
                        //                 {
                        //                     /*var prev = $('#courseTemplate').clone().removeAttr('id').removeClass('looptemplate').addClass('previous');
                                            
                        //                     $('span', prev.children('a')).text("Select Periods");
                        //                     // Populate STRM
                        //                     $('ul', acad).append(prev);*/

                        //                     for(var c = 0; c<data[a][3].length; c++)
                        //                     {
                        //                         var strm = $('#courseTemplate').clone().removeAttr('id').removeClass('looptemplate').addClass('previous').removeAttr('style');
                                                
                                               
                        //                      $('span', strm.children('a')).text(data[a][3][c][1]);
                                               
                        //                        acad.children('ul').append(strm);


                        //                         var curr, prev2 = '';
                        //                         //Populate Previous
                        //                         for(var d = 2;d<data[a][3][c].length;d++)
                        //                         {   
                        //                             curr = data[a][3][c][d]['CRSE_ID'];
                        //                             if (curr != prev2) {
                        //                                 prev2 = curr;
                        //                                 var history = $('#course').clone().removeAttr('id').removeClass('looptemplate').removeClass('has-sub').removeAttr('style');
                        //                                 $('span', history.children('a')).text(data[a][3][c][d]['KDMTK']+' - '+data[a][3][c][d]['COURSE_TITLE_LONG']);
                        //                                 $('a', history).attr('href','#/currentcourse.'+data[a][3][c][d]['KDMTK']+'/'+data[a][3][c][d]['CRSE_ID']+'/'+data[a][3][c][d]['STRM']+'/'+data[a][3][c][d]['ACAD_CAREER']+'/'+data[a][3][c][d]['SSR_COMPONENT']+'/'+data[a][3][c][d]['CLASS_NBR']);
                        //                                 $('ul', strm).append(history);
                        //                             }
                        //                         }
                                               
                        //                     }
                        //                 }
                        //                 else if(data[a][2] != '' && b < data[a][2].length)
                        //                 {
                        //                     curr1 = data[a][2][b]['CRSE_ID'];
                        //                     if (curr1 != prev1) {
                        //                         prev1 = curr1;
                        //                         //Populate active course
                        //                         var courses = $('#course').clone().removeAttr('id').removeClass('looptemplate').removeClass('has-sub');
                        //                         $('span', courses.children('a')).text(data[a][2][b]['KDMTK']+' - '+data[a][2][b]['COURSE_TITLE_LONG']);
                                                
                        //                         $('a', courses).attr('href','#/currentcourse.'+data[a][2][b]['KDMTK']+'/'+data[a][2][b]['CRSE_ID']+'/'+data[a][2][b]['STRM']+'/'+data[a][0]+'/'+data[a][2][b]['SSR_COMPONENT']+'/'+data[a][2][b]['CLASS_NBR']);
                        //                         $('ul', acad).append(courses);
                        //                     }
                        //                 }
                        //             }
                        //             console.log(acad);
                        //             $('.courselist').before(acad);
                        //         }
                        //     }
                            
                        // }); 
                    }
                });


				$("#mailMenu").click(function(e){
					e.preventDefault();
					BM.ajax({
						type: 'POST',
						url: BM.serviceUri + 'mailO/getUrl',
						success: function(data) {
							window.open(data.target, '_blank');
						}
					});
				});
				
				$("#messageMenu").click(function(e){
					e.preventDefault();
					window.location = BM.baseUri + 'newGeneral/#/message/inbox';
				});

                //OneDrive
                
				$("#onedriveMenu").click(function(e){
                e.preventDefault();
                BM.ajax({
                                type: 'POST',
                                url: BM.serviceUri + 'onedriveO/getUrl',
                                success: function(data) {
                                window.open(data.target, '_blank');
                                }
					});
				});


                //===========================
                // Generate Course Menu List
                //===========================
                var newFlag=false;
                $('.top-navigation-student').click(function() {
                    
                    if (!newFlag) {
                        
                        newFlag = true;
                        BM.ajax({
                            url: BM.serviceUri + 'student/init/getCourses',
                            success: function(data) {
                                // console.log(data.Courses);
                                //class.K0424/2013-3-0
                                $(".iCourseLoading").remove();
                                var curr, prev = '';
                                for (var i = 0; i < data.Courses.length; i++) {
                                    curr = data.Courses[i].COURSEID;
                                    if (curr != prev) {
                                        prev = curr;
                                        $("#current-courses").append('<li class="no-icon"><a href="#/class.' + data.Courses[i].COURSEID + '/' + data.Courses[i].CRSE_ID + '/' + data.Courses[i].STRM + '/' + data.Courses[i].SSR_COMPONENT+ '/' + data.Courses[i].CLASS_NBR + '"><span class="label navLabel">' + data.Courses[i].COURSEID +' - '+ data.Courses[i].COURSENAME + '</span></a></li>');
                                    }
                                }
                            }
                        });
                        BM.ajax({
                            url: BM.serviceUri + 'student/init/getPeriod',
                            success: function(data) {
                                // console.log(data.Period);
                                $(".iCoursePeriodLoading").remove();
                                if (data.Period.length > 0) {
                                    for (var i = 0; i < data.Period.length; i++) {
                                        $(".courseNav").append('<li class="periodsLoop has-sub has-menu"><a href="#" title=""><span class="label">' + data.Period[i].DESCR.replace(/\,/g, ' -') + '</span> </a><ul class="sub-sub-menu" id="subMenu' + i + '"></ul></li>');
                                        getCoursesBySTRMAndAcad(i, data.Period[i].STRM);
                                    }
                                } else {
                                    $(".courseNav").closest('li').remove();
                                }
                            }
                        });
                        var getCoursesBySTRMAndAcad = function(i, strm) {
                            var a = strm;
                            BM.ajax({
                                url: BM.serviceUri + 'student/init/getCoursesBySTRMAndAcad/' + strm,
                                success: function(dataPeriod) {
                                    var curr, prev = '';
                                    for (var j = 0; j < dataPeriod.Courses.length; j++) {
                                        curr = dataPeriod.Courses[j].COURSEID;
                                        
                                        if (curr != prev) {
                                            prev = curr;
                                            console.log(curr);
                                            $("ul.sub-sub-menu#subMenu" + i).append('<li class="navLoop"><a href="#/class.' + dataPeriod.Courses[j].COURSEID + '/' + dataPeriod.Courses[j].CRSE_ID + '/' + a + '/' + dataPeriod.Courses[j].SSR_COMPONENT+ '/' + dataPeriod.Courses[j].CLASS_NBR + '"><span class="label navLabel">' + dataPeriod.Courses[j].COURSEID +' - '+ dataPeriod.Courses[j].COURSENAME + '</span></a></li>');
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
				

                // role selector
                var roleOpen = false;
                $('#roletrigger').click(function() {
                    if (roleOpen) {
                        $('#rolewrapper').animate({
                            'width': '100%'
                        }, 500, function() {
                            roleOpen = false;
                            $('#roletrigger').html('&raquo;');
                        });
                    } else {
                        $('#rolewrapper').animate({
                            'width': 30
                        }, 500, function() {
                            roleOpen = true;
                            $('#roletrigger').html('&laquo;');
                        });
                    }
                });
                // load the json and bind event to the navigation
                //$.ajax({ url: 'http://graph.facebook.com/etersoul'}).done(function(data){
                // $.getJSON('json/navigation-staff.json', function(data){
                // var $app = $('#applicationlist');
                // $app.empty().append('');
                // var $ul = $('<ul style="margin:0px0px0px4px"></ul>');
                // function recurseNav(subData, dom, lvl) {
                // lvl = lvl || 1;
                // for(var i=0;i<subData.length;i++){
                // var $li = $('<li></li>');
                // var h3; // to prevent ambiguity of scope
                // if(typeof subData[i].url != 'undefined') {
                // h3=$('<a  style="color:white"></a>').attr('href', subData[i].url).attr('data-ref','primaryspace').text(''+subData[i].name);
                // if(subData[i].url.indexOf('http://') == 0) {
                // h3.attr('target', '_blank');
                // }
                // } else {
                // h3=$('<h3 class = "h3Menu"></h3>').text(subData[i].name+' ').append('<i class="icon-arrowright-2"></i>');;
                // }
                // $li.append(h3);
                // if(typeof subData[i].sub != 'undefined') {
                // var $ul2 = $('<ul class="subapp" style = "overflow: hidden; display: none; "></ul>').addClass('nav-lvl' + lvl);
                // recurseNav(subData[i].sub, $ul2, lvl+1);
                // $li.append($ul2);
                // }
                // dom.append($li);
                // }
                // }
                // recurseNav(data, $ul, 1);
                // $app.append($ul);
                // // toggle hide and show for application list
                // $('#applicationlist h3').click(function(){
                // var subapp = $(this).next();
                // if(subapp.css('display')!='block') {
                // //$('#applicationlist .subapp').slideUp();
                // $('>li>ul', $(this).parent().parent()).slideUp();
                // $(this).children().removeClass('icon-arrowright-2');
                // $(this).children().addClass('icon-arrowdown-1');
                // subapp.css("list-style","square");
                // subapp.slideDown();
                // } else {
                // $(this).children().removeClass('icon-arrowdown-1');
                // $(this).children().addClass('icon-arrowright-2');
                // subapp.slideUp();
                // }
                // });
                // });
                // bind event to name on nav bar
                $('#mainname').click(function(e) {
                    e.stopPropagation();
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        $('#mainnameext').hide();
                        //bm.globalClickState.add($('#main;
                    } else {
                        //bm.resetGlobalState();
                        $('#mainnameext').show();
                        $(this).addClass('selected');
                    }
                });
                // check if onhashchange is supported
                /*if(!window.onhashchange) {
					function pollHashChange() {
						$(window).trigger('onhashchange');
						setTimeout(pollHashChange, 1000);
					}
					pollHashChange();
				}*/
                // NEW FEATURE:
                // Get the request script, then get the required JS / module and put it on a stack.
                /*for(;;) {
					$.getScript('view'+hj,function(){
						BM.scriptStack.push(subView);
					});					
					
					if(subView.require) {
						hj = '/' + subView.require + '.js';
					} else {
						break;
					}
				}*/
                // load secondary view
                $(window).bind('hashchange', function(e) {
                    e.preventDefault();
                    var path = window.location.hash.substr(2);
                    if (path.search(/#/) != -1) {
                        path = path.substr(0, path.search(/#/));
                    }
                    path = path.replace(new RegExp("/","g"), "-");
                    //path = path.replace(new RegExp(".","g"), "-");
                    path = path.replace(new RegExp(";","g"), "-");
                    path = path.replace(new RegExp("%3C","g"), "-");
                    path = path.replace(new RegExp("%3E","g"), "-");
                    path = path.replace(new RegExp("<","g"), "-");
                    path = path.replace(new RegExp(">","g"), "-");
                    //console.log(path);
                    // cek blocking
                            var link = "";
                            if (link != "")
                                location.href = link;

                            $('.expand-item.current .expand-action').trigger('click');
                            $('.expand-item-menu.current .expand-action-menu').trigger('click');
                            $("body").removeAttr("class").removeAttr("style");
                            if (typeof BM.beforeHashChange != 'function') {
                                //BM.beforeHashChange();
                                //if(BM.detachHashChange==HASH_AFTER_EVENT) {
                                //BM.clearBeforeHashChange();
                                //}
                            }
                            if (window.location.hash.substr(1, 1) == '/') {
                                var h = window.location.hash.substr(2)
                                var q = '';
                                var h2 = '';
                                // get second hash
                                if (h.search(/#/) != -1) {
                                    h2 = h.substr(h.search(/#/) + 1);
                                    h = h.substr(0, h.search(/#/));
                                }
                                if (h == 'index') {
                                    h = 'index/dashboard';
                                }
                                if (h.search(/\./) != -1) {
                                    q = h.substr(h.search(/\./) + 1);
                                    h = h.substr(0, h.search(/\./));
                                }
                                var checkAvailability = function(arr, urlString) {
                                    var splitStr = urlString.split('/');
                                    var check = false;
                                    $(arr).each(function(i) {
                                        var spaceSplit = this.name.split(" ");
                                        var joinStr = "";
                                        for (var i in spaceSplit) {
                                            joinStr += spaceSplit[i];
                                        }
                                        if (joinStr.toLowerCase() == splitStr[0].toLowerCase()) {
                                            check = this;
                                        }
                                    })
                                    if (check == false) {
                                        console.log("You don't have access");
                                        //location.href = BM.baseUri;
                                        return;
                                    } else if (splitStr.length > 1) {
                                        checkAvailability(check.sub, urlString.substr(urlString.search('/') + 1));
                                    }
                                }
                                checkAvailability(BM.listMenu, h);
                                if (BM.lastHash == h) {
                                    // check if second hash changed
                                    if (BM.ndLastHash == h2) {
                                        // just the query is changed
                                        if (BM.lastParam != q) {
                                            var qs = q.split(/\//g);
                                            BM.currentSubView.onParamLoaded(qs, q);
                                            BM.lastParam = q;
                                            return;
                                        }
                                    } else {
                                        var gpaboxAj;
                                        if (h2 != '') {
                                            var fancySplit = h2.split('.');
                                            $.getScript('view/' + h + '/' + fancySplit[0] + '.js', function() {
                                                $.get('view/' + h + '/' + fancySplit[0] + '.html', function(data) {
                                                    $.fancybox({
                                                        content: data,
                                                        wrapCSS: 'popup',
                                                        afterShow: function() {
                                                            // $('body').css('overflow','hidden');
                                                            var $popup = $('.popup');
                                                            var $wndow = $(window);
                                                            
                                                            if ($popup.find('.fancybox-inner').height() < ($wndow.height() - 40)) {
                                                                var $content_height = $popup.find('.fancybox-inner').height();
                                                                var $container = ($wndow.height() - 40);
                                                                var $margin = (($container - $content_height) / 2);
                                                                
                                                                $popup.css('margin-top', $margin + 'px');
                                                            }
                                                            
                                                            $('.popup').css('visibility', 'visible');
                                                            $('.popup').binus_bootstrap();
                                                        },
                                                        afterClose: function() {
                                                            // $('body').css('overflow','scroll');
                                                            var url = (q == "") ? h : h + '.' + q;
                                                            location.hash = '#/' + url;
                                                            popupSubView.parent = BM.currentSubView;
                                                            if (typeof popupSubView.onClosed !== 'undefined' && $.isFunction(popupSubView.onClosed)) {
                                                                popupSubView.onClosed();
                                                            }
                                                        }
                                                    });
                                                    if (typeof popupSubView == "object") {
                                                        var fancyParam = null;
                                                        if (fancySplit.length > 1) fancyParam = fancySplit[1];
                                                        popupSubView.parent = BM.currentSubView;
                                                        popupSubView.onLoaded(fancyParam);
                                                    }
                                                }, 'html');
                                            });
                                        }
                                        BM.ndLastHash = h2;
                                    }
                                    return;
                                }
                                // if we go to the ancestor path, invalidate last path data and stack
                                if (BM.lastHash.indexOf(h) == 0) {
                                    BM.lastHash = '';
                                    BM.prevHash = '';
                                    BM.scriptStack = [];
                                }
                                var i = 0;
                                getScript(h, q);
                                BM.lastHash = h;
                                BM.ndLastHash = '';
                                BM.lastParam = q;
                                $('a').off('click', anchorBind).on('click', anchorBind);
                                $('#loading-info').show();
                            }
                        
                });

                function getScript(h, q) {
                    var split = BM.prevHash.split('/');
                    for (var i = 0; i < split.length; i++) {
                        var splitImplode = [];
                        for (var j = 0; j <= i; j++) {
                            splitImplode.push(split[j]);
                        }
                        splitImplode = splitImplode.join('/');
                        if (splitImplode == h) {
                            getHTML(q);
                            return;
                        }
                    }
                    $.getScript('view/' + h + '.js', function() {
                        if (typeof subView == "object") {
                            var stack = {
                                script: subView,
                                req: h
                            }
                            h = (typeof subView.require != 'undefined' ? subView.require : '');
                            BM.scriptStack.push(stack);
                        }
                    }).done(function() {
                        if (h == '') {
                            getHTML(q);
                            return;
                        }
                        getScript(h, q);
                    }).error(function(){
                        console.log('view/' + h + '.js not found!');
                    });
                }

                function getHTML(q) {
                    var stack = BM.scriptStack.pop();
                    var subView = stack.script;
                    var req = stack.req;
                    BM.currentSubView = subView;
                    if (typeof subView.rel != 'undefined' && $('#' + subView.rel).length > 0) BM.rel = subView.rel;
                    else BM.rel = BM.defaultRel;
                    $('#' + BM.rel).load('view/' + req + '.html', function() {
                        onLoadedCommonFunction();
                        // console.log(subView);
                        subView.onLoaded(q);
                        if (BM.scriptStack.length == 0) {
                            if (typeof subView.onDefaultChild == 'function') {
                                subView.onDefaultChild(q);
                            }
                            BM.prevHash = BM.lastHash;
                            return;
                        }
                        getHTML(q);
                    });
                }

                function anchorBind(e) {
                    BM.rel = $(this).attr('data-rel');
                    if (typeof BM.rel == 'undefined' || BM.rel == '') BM.rel = BM.defaultRel;
                }
                $('a').on('click', anchorBind);
                // bind dynamic nav bar
                $(window).scroll(function(e) {
                    if (window.scrollY > 100) {
                        $('#headnav').addClass('fixed');
                    } else {
                        $('#headnav').removeClass('fixed');
                    }
                });
                if (window.location.hash.substr(1) == '') {
                    window.location.hash = '#/index';
                }
                $(window).trigger('hashchange');
                if (typeof BM.viewer != 'undefined') {
                    //BM.viewer.onLoad();
                }
                // bug reporting form
                $('#bugForm').submit(function(e) {
                    e.preventDefault();
                    BM.ajax({
                        type: 'POST',
                        url: BM.serviceUri + 'student/general/feedback/report',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify($('#bugForm').serializeJSON()),
                        success: function(data) {
                            if (data.status == 'success') {
                                alert('Your submission successfully saved. Thank you for your feedback. We will review your feedback.');
                                $('input,textarea', e.target).val('');
                            } else {
                                alert('There are some validation errors');
                            }
                        }
                    });
                });
                // chat link
                $('#chatlink').click(function() {
                    $('#chat-container').animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    }, 'fast');
                    return false;
                });
                $('#notiflink').click(function() {
                    $('#notification-container').animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    }, 'fast');
                    return false;
                });
                // logout link
                $('#logout').click(function(e) {
                    // e.preventDefault();
                    // $.ajax({
                    // type: 'POST',
                    // url: BM.serviceUri + 'usersession/logout',
                    // success: function(data){
                    // if(data.status!='success') {
                    // return;
                    // }
                    // location.href = BM.loginUri;
                    // }
                    // });					
                    location.href = BM.logoutUri;
                });
        

        countNotification();
showNotification();
        //$('.expand-notification').click(function(){
            //if($('.expand-notification').hasClass( "current" ) == false)
           //{
               // $('#notifications div:not(#notificationTemplate)').remove();
            //}

        // $('#notifications div').not('#notificationTemplate').remove();
        // BM.ajax({
            // url: BM.serviceUri + 'student/profile/getNotification',
            // dataType: 'json',
            // type: 'POST',
            // success: function(data) {
                // if(data.length == 0)
                // {
                    // $('#notificationTemplate .description').text('No Notification');
                    // $('#notificationTemplate').show();
                // }
                // else
                // { 
                    // $('#notificationTemplate').hide();
                    // for(var i=0;i<data.length;i++)
                    // {
                        // var template = $('#notificationTemplate').clone().removeAttr('id').css('display', '');
                        // if(i == 0)
                        // {
                            // $('.notification').css('border-top','1px solid #c9c9c9');
                        // }
                        // $('.description',template).text(data[i].Title);
                        // $('.date',template).text(data[i].CreateDate);
                        // $('.description',template).attr('data-id',data[i].NotificationID);
                        // $('#notifications').append(template);
                    // }
                // }

                // $('#notifications').css('cursor','pointer');
                // $('#notifications .notification').click(function(){
                    // var type = window.location.hash.substr(1);
                    // if(type.indexOf("allNotification") == -1)
                    // {
                        // BM.NotificationID = $(this).find('.description').attr('data-id');
                        // location.href = '#/notification/allNotification';
                    // }
                    // else
                    // {
                        // var id = $(this).find('.description').attr('data-id');
                        // location.href = '#/notification/allNotification#detail.'+id;
                    // }
                // })

                // $('#readAll').click(function(e){
                    // e.preventDefault();
                        // BM.ajax({
                        // url: BM.serviceUri + 'notification/readAll',
                        // dataType: 'json',
                        // type: 'POST',
                        // success: function(data) {
                            // countNotification();
                        // }
                     // })
                // })
            // }
        // });

            /* OLD HERE */

            /*
            $('.dataNotification').remove();
            var table = $(".list-notification");
            var tmpLoading = $('#iTemplateNotification').clone().removeAttr('id').css('display', '').addClass('dataNotification').attr("id", "loadingNotification");
            $(".info", tmpLoading).css('text-align', 'center').empty().append('<img id="loadingNotification" src="' + BM.baseUri + 'staff/images/loading.gif" />');
            table.append(tmpLoading);
            BM.ajax({
                url: BM.serviceUri + 'student/profile/getNotifications/0',
                dataType: 'json',
                type: 'GET',
                success: function(result) {
                    console.log(result);
                    var notifLen = result.x["length"];
                    if (notifLen == 0) {
                        var tmp = $('#iTemplateNotification').clone().removeAttr('id').css('display', '').addClass('dataNotification');
                        $('.description', tmp).append('You have no new notification.');
                        $('.date', tmp).remove();
                        table.append(tmp);
                    } else {
                        if (result.Notifications[0].Unread == 0) {
                            var tmp = $('#iTemplateNotification').clone().removeAttr('id').css('display', '').addClass('dataNotification');
                            $('.description', tmp).append('You have no new notification.');
                            $('.date', tmp).remove();
                            table.append(tmp);
                        } else {
                            for (var i = 0; i < notifLen; i++) {
                                var tmp = $('#iTemplateNotification').clone().removeAttr('id').css('display', '').addClass('dataNotification');
                                $('.description', tmp).append(result.Notifications[i].Message);
                                $('.date', tmp).append(result.Notifications[i].NotificationTime);
                                table.append(tmp);
                                //$('#notifications').append('<li class=\"notification\">' + '<a href="#">' + '<span class=\"info\">' + '<span class=\"title\">' + result.Notifications[i].Message + '</span>' + '<span class=\"date\">' + result.Notifications[i].NotificationTime + '</span>' + '</span>' + '</a>' + '</li>');
                            }
                        }
                    }
                    $("#loadingNotification").remove();
                }
            });
            */
           // countNotification();
        //});
		
		
		
    });

    function showNotification() {
    $('#notificationList').empty();
            var data = [];
            if(data.length == 0)
            {
                var tmp = $('#iTemplateNotification').clone().removeAttr('id');
                $('.thumbnail', tmp).remove();
                $('.date', tmp).remove();
                $('.description', tmp).append('No New Notification');
                $('#notificationList').append(tmp);
            }
            else
            { 
                for(var i=0;i<data.length;i++)
                {
                    var tmp = $('#iTemplateNotification').clone().removeAttr('id');
                    $('.thumbnail', tmp).css('border','0').css('border-radius','unset');
                    $('.icon', tmp).addClass(data[i].Icon);

                    $(tmp).data('NotificationID', data[i].NotificationID);
                    $(tmp).data('IsLinkUsingURL', data[i].IsLinkUsingURL);
                    $(tmp).data('LinkID', data[i].LinkID);
                    $(tmp).data('Path', data[i].Path);

                    $('.description', tmp).append('New ' + data[i].CategoryName + ' from ' + data[i].From);
                    $('.date', tmp).append(data[i].NotificationTime);
                    $('#notificationList').append(tmp);
                }

                $('#notificationList .notification').css('cursor','pointer').hover(function() {
                    $('.description', this).css('color','#0098D7');
                }, function() {
                    $('.description', this).css('color','#5e5e5e');
                });

                $('#notificationList .notification').click(function() {
                    var NotifRow = $(this);

                    BM.ajax({
                        url: BM.serviceUri + 'notification/readNotification',
                        dataType: 'json',
                        type: 'POST',
                        data: JSON.stringify({
                            NotificationID: $(this).data('NotificationID')
                        }),
                        success: function(data) {
                            if ($(NotifRow).closest('tr').data('IsLinkUsingURL')) {
                                location.href = BM.baseUri + $(NotifRow).data('Path') + $(NotifRow).data('LinkID');
                            } else {
                                BM.Notification = {
                                    'LinkID': $(NotifRow).data('LinkID')
                                };

                                location.href = BM.baseUri + $(NotifRow).data('Path');
                            }
                        }
                    });
                });
            }

            $(".view-all a").attr("href", BM.baseUri + 'newGeneral/#/notification');

            $('#readAll').click(function(e){
                e.preventDefault();
                BM.ajax({
                    url: BM.serviceUri + 'notification/readNotification',
                    dataType: 'json',
                    type: 'POST',
                    data: JSON.stringify({
                        NotificationID: 'ALL'
                    }),
                    success: function(data) {
                        showNotification();
                        countNotification();
                    }
                })
            })
        
}

function countNotification() {
            if (true) {
                $("#notif-count").empty();
                $("#notif-count").append('0');
            }
}

    function onLoadedCommonFunction() {
        body_nav_init();
        var sh = $('.supercontent').prop('scrollHeight');
        var ch = $('.supercontent').prop('clientHeight');
        $('#loading-info').fadeOut();
        if (ch < sh) {
            $('.supercontent .more').remove();
            $('.supercontent').append($('<div class="more"></div>').click(function() {
                $(this).parent().animate({
                    maxHeight: sh + 'px',
                    height: sh + 'px'
                }, 200, function() {});
                $(this).animate({
                    opacity: 0
                }, 200, function() {
                    $(this).hide();
                });
            }));
        }
    }
    // added by Brian Alexandro, 8 December 2014
    // function displayMenuEvent(){
    // 	var sv = this;
    // 	var existedmenu = $("li.title:has('a')").next();
    // 	existedmenu.nextUntil('span#applicationlist-2').remove();
    // 	var menuData = BM.listMenu;
    // 	for(var i=0;i<menuData.length;i++)
    // 	{
    // 		var newMenuContainer = $('<li></li>');
    // 		var newMenu = $('<a><i class="'+menuData[i].icon+'"></i><span class="label">'+menuData[i].name+'</span></a>');
    // 		newMenu.attr('href',BM.baseUri+menuData[i].url).attr('title',menuData[i].desc);
    // 		//Validasi untuk ke web Library
    // 		if(menuData[i].url.indexOf("http://") > -1 || menuData[i].url.indexOf("https://") > -1){
    //        		newMenu.attr('href', menuData[i].url).attr('title', menuData[i].desc);
    //        	}
    // 		newMenuContainer.append(newMenu);
    // 		if(menuData[i].sub.length > 0)
    // 		{
    // 			sv.addSubMenu(menuData[i].sub,newMenuContainer);
    // 		}
    // 		$("#applicationlist-"+menuData[i].location).before(newMenuContainer);
    // 	}
    // 	$('#main-nav-expand li:has("ul")').addClass('has-sub');
    //   	}

    function loadRoleSelect() 
    {
        $('#login-role-select').find('option').remove().end();var data = [];
        for(var i=0;i < data.length;i++)
        {
            var option = $("<option>"+data[i].SpecificRoleName+"</option>").attr("role-id",data[i].RoleID).attr("value",data[i].SpecificRoleID);
            
            $('#login-role-select').append(option);
        }
        
        var rID = 1;
        $("#login-role-select").val(rID);
        $("#login-role-select").parent().find('.combobox-label').text($("#login-role-select option:selected").text());
                
    }

	function loadServerTime() 	
    {
        var servertime = '2017-09-14 00:00:00.000';
		var serverOffset = moment(servertime).diff(new Date());
		
		interval = setInterval(function(){
			$('.serverTime').text(moment().add('milliseconds', serverOffset).format('MMMM Do YYYY, h:mm:ss a'));
		}, 1000);
    }

})(jQuery);




 