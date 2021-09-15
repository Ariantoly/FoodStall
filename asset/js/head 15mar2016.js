"use strict"
var BM = {
    // --------------------------------------------
    // Global states
    //HASH_NULL: 0,
    //HASH_AFTER_EXECUTE: 1,
    //HASH_AFTER_CHANGE: 2,
    //HASH_PERSIST: 3,
    defaultRel: 'content',
    rel: 'content',
    defaultClickState: [],
    viewer: null,
    currentSubView: null,
    lastHash: '',
    prevHash: '',
    ndLastHash: '',
    lastParam: '',
    listMenu: [],
    resetDefaultClick: function() {},
    beforeHashChange: null,
    //detachHashChange: 0,
    scriptStack: [],
    // loginUri: 'http://localhost:7777/Bm3_reskin/login.html',
    // imageUri: 'http://localhost:7777/Bm3_reskin/portallecturer/images/',
    serviceUri: 'http://localhost:8080/tfs/BM5/services/ci/index.php/',
    // uploadUri: 'http://localhost:7777/Bm3_reskin/useruploads/',
    // --------------------------------------------
    // general utility functions that should be able to be used globally
    clearBeforeHashChange: function() {
        this.beforeHashChange = null;
        //this.detachHashChange = this.HASH_NULL;
    },
    redirect: function() {},
    formatLongDate: function(date) {
        if (typeof date != 'string' || /^\d{4}-\d\d-\d\d$/.test(date) == false) {
            return 'Invalid format (yyyy-mm-dd)';
        }
        var month = BM.months;
        var d = date.split(/-/);
        if (d[1][0] == '0') {
            d[1] = parseInt(d[1][1]);
        } else {
            d[1] = parseInt(d[1]);
        }
        if (d[2][0] == '0') {
            d[2] = d[2][1];
        }
        return d[2] + ' ' + month[d[1]] + ' ' + d[0];
    },
    formatShortDate: function(date) {
        if (typeof date != 'string' || /^\d{4}-\d\d-\d\d$/.test(date) == false) {
            return 'Invalid format (yyyy-mm-dd)';
        }
        var month = BM.shortMonths;
        var d = date.split(/-/);
        if (d[1][0] == '0') {
            d[1] = parseInt(d[1][1]);
        } else {
            d[1] = parseInt(d[1]);
        }
        if (d[2][0] == '0') {
            d[2] = d[2][1];
        }
        return d[2] + ' ' + month[d[1]] + ' ' + d[0];
    },
    formatDate: function(date) {
        var d = date.split(/-/);
        return d[2] + '/' + d[1] + '/' + d[0];
    },
    formatPeriod: function(period) {
        var p = period.split(/-/);
        p[0] = p[0] + '/' + (parseInt(p[0]) + 1).toString();
        if (p[1] == '1') {
            p[1] = 'Odd';
        } else {
            p[1] = 'Even';
        }
        if (p[2] == '0') {
            return p[0] + ' - ' + p[1];
        }
        return p[0] + ' - ' + p[1] + ' - ' + p[2];
    },
    formatNumber: function(number) {
        if (number == null) return number;
        var num = number.toString();
        if (/^-?[0-9.]*(,[0-9]*)?$/.test(num)) {
            num = num.replace(/\./g, '').split(',');
            var s2 = '',
                dot = '';
            while (num[0].length > 0) {
                if (num[0] == '-') {
                    s2 = '-' + s2;
                    break;
                }
                s2 = num[0].substr((num[0].length - 3 >= 0 ? num[0].length - 3 : 0), 3) + dot + s2;
                dot = '.';
                num[0] = num[0].substr(0, num[0].length - 3);
            }
            if (num.length > 1) s2 += ',' + num[1];
            num = s2;
        }
        return num;
    },
    formatShortTime: function(time) {
        var t = time.split(':');
        return t[0] + ':' + t[1];
    },
    formatLongTime: function(time) {
        var t = time.split(':');
        return t[0] + ':' + t[1] + ':' + t[2].substr(0, 2);
    },
    formatDateTime: function(input, formatDateCallback, formatTimeCallback) {
        formatDateCallback = formatDateCallback || 'Date';
        formatTimeCallback = formatTimeCallback || 'ShortTime';
        var t = input.split(' ');
        var call = 'format' + formatDateCallback;
        var date = BM[call](t[0]);
        var time = t[1];
        if (formatTimeCallback != '') {
            var callTime = 'format' + formatTimeCallback;
            time = BM[callTime](time);
        }
        return date + ' ' + time;
    },
    ajax: function(options) {
        var ajaxOpt = options;
        //var success = options.success;
        /*ajaxOpt.success = function(data) {
        	// session expired or no session found
        	success(data);
        };*/
        ajaxOpt.error = function(jqXHR, textStatus, errorThrown) {
            if (typeof error == 'function') {
                options.error(jqXHR, textStatus, errorThrown);
                return;
            }
            try {
                var o = $.parseJSON(jqXHR.responseText);
                if (o.status == 'error' && o.errno == '1') {
                    location.href = BM.loginUri;
                    return;
                }
				if (jqXHR.status == "601") {
				    if (!$.fancybox.isOpen) {
				        var html = '<div class="popup-content-dialog" style="text-align: center;">'+o.error+'</div>';
						$.fancybox({
							content: html,
							openEffect	: 'elastic',
							closeEffect	: 'elastic',
				            helpers: {
				                overlay: {
				                    closeClick: false
				                }
				            },
							afterClose: function() {
								parent.history.back();
							}
						});
				    }
				}
            } catch (e) {
                console.log('Error occured when parsing JSON. Get response text: ' + jqXHR.responseText);
            }
        };
        if (ajaxOpt.type && ajaxOpt.type.toLowerCase() == 'post') {
            if (ajaxOpt.contentType == null) ajaxOpt.contentType = 'application/json;charset=utf-8';
        }
        /*ajaxOpt.beforeSend = function(){
        	NProgress.start();
        };

        ajaxOpt.complete = function(){
        	setTimeout(function() { NProgress.done(); $('.fade').removeClass('out'); }, 1000);
        };*/
        return $.ajax(ajaxOpt);
    },
    readFile: function(el, afterRead) {
        if (!window.FileReader) {
            afterRead(false, null);
            return false;
        }
        var read = new window.FileReader();
        read.onload = (function(after, f) {
            return function(e) {
                alert(typeof e.target.result);
                var output = {
                    data: window.btoa(e.target.result),
                    name: f.name,
                    size: f.size,
                    type: f.type
                }
                after(true, output);
            }
        })(afterRead, el[0].files[0]);
        if (read.readAsBinaryString) read.readAsBinaryString(el[0].files[0]);
        else read.readAsArrayBuffer(el[0].files[0]);
        return true;
    },
    /*
    paging: function(opt) {
    	var selector = opt.selector,
    		totalPage = opt.page,
    		baseHref = opt.baseHref,
    		selectedStyle = opt.selectedStyle || null,
    		currentPage = opt.currentPage || null;
    	
    	// get current page automatically if needed
    	if(currentPage == null) {
    		if(location.hash.indexOf(baseHref) == 0) {
    			var chunk = location.hash.substr(baseHref.length);
    			var test = /^[0-9]+.*/
    /*.exec(chunk);
    				if(test.length == 1) {
    					currentPage = test[0];
    				} else {
    					currentPage = 1;
    				}
    			}
    		}
    		
    		var className = selector.replace(/[^a-z0-9]/gi, '') + 'Clone'; 
    		$('.' + className).remove();
    		for(var i=1; i <= totalPage; ++i) {
    			var clone = $(selector).clone().removeAttr('id').css('display', '').addClass(className).text(i);
    			// console.log(clone);
    			if(clone.prop('tagName').toLowerCase() == 'a') {
    				clone.attr('href', baseHref + i);
    			} else {
    				alert('masuk');
    			}
    			
    			if(i == currentPage && selectedStyle != null) {
    				clone.css(selectedStyle);
    			}
    			
    			$(selector).before(clone);
    			clone.click(function(){ 
    				//$(this).addClass('current');
    				window.location.href = $(this).attr('href');
    				// console.log();
    				// console.log($(this).attr('hash'));
    			});
    		}
    	},
    	*/
    // Customize by : Ivan Effendy
    paging: function(opt) {
        var selector = opt.selector,
            totalPage = opt.page,
            baseHref = opt.baseHref,
            currentPage = opt.currentPage || null;
        // get current page automatically if needed
        if (currentPage == null) {
            if (location.hash.indexOf(baseHref) == 0) {
                var chunk = location.hash.substr(baseHref.length);
                var test = /^[0-9]+.*/.exec(chunk);
                if (test.length == 1) {
                    currentPage = test[0];
                } else {
                    currentPage = 1;
                }
            }
        }
        for (var i = 1; i <= totalPage; ++i) {
            var clone = $(selector).clone().removeAttr('id').css('display', '').addClass('item').text(i);
            if (clone.prop('tagName').toLowerCase() == 'a') {
                clone.attr('href', baseHref + i);
            }
            $(selector).before(clone);
            clone.click(function() {
                window.location.href = $(this).attr('href');
            });
        }
    },
    combo_checkbox_changed: function(selector) {
        var status = selector.is(':checked');
        var parent = selector.closest('li');
        var sub = parent.find('ul input[type="checkbox"]');
        // For the parents
        if (sub.length > 0) {
            if (status) {
                sub.fancyfields('checked');
            } else {
                sub.fancyfields('unchecked');
            }
        }
        // select all
        if (parent.is('.all')) {
            var combo_checkbox_wrap = selector.closest('.combo-checkbox-list')
            var combo_checkbox = combo_checkbox_wrap.find('ul > li input[type="checkbox"]');
            var combo_checkbox_parent = combo_checkbox_wrap.find('input[type="checkbox"]');
            if (status) {
                combo_checkbox.fancyfields('checked');
                combo_checkbox_parent.fancyfields('checked');
            } else {
                combo_checkbox.fancyfields('unchecked');
                combo_checkbox_parent.fancyfields('unchecked');
            }
        }
    },
    message: function(obj, callback) {
        var buttonlist = obj.button;
        $(".button-list", obj.targetid).html('');
        buttonlist.forEach(function(element, index, array) {
            $(".button-list", obj.targetid).append('<input type="button" id="btn' + element + '" class="button button-primary btnpopup" value="' + element + '" style="margin-right:10px;"/>');
        });
        $(obj.targetid).css('width', obj.width || '400px').css('font-size', '13px!important');
        $(".title", obj.targetid).text(obj.title.toUpperCase());
        if (obj.message) $(".message", obj.targetid).html(obj.message).css('margin-bottom', '20px');
        $(".btnpopup", obj.targetid).off('click').click(function(e) {
            e.preventDefault();
            $.fancybox.close();
            if (typeof(callback) == 'function') callback($(this).attr('value'));
        });
        $.fancybox({
            content: $(obj.targetid)
        });
    },
    deleteConfirmation: function(message, yes, no) {
    	if(message==null)message='Delete this item?'
        var html = '<div id="dialog-content-delete" class="popup-content-dialog"><form><p>'+message+'</p><div class="action"><input type="button" class="button button-primary btnYes" value="Yes"> <input type="button" class="button button-primary btnNo" value="No"></div></form></div>';
        $.fancybox({
            content: html,
            afterShow: function() {
                $('.btnYes').click(yes);
                $('.btnNo').click(no);
            }
        });
    },
    successMessage: function(message,status, ok) {
        if(message==null)message='Data has been saved.'
        if(status==null)status='success.'

        var html = '<div id="dialog-content-status" class="popup-content-dialog"><form><p class="has-loader"><span class="loader '+status+'"><span class="indicator"></span><span style="display:inline;" class="progress-text">'+message+'</span></span></p><div class="action"><input type="button" class="button button-primary btnOk" value="Ok"></div></form></div>';
        
        $.fancybox({
            content: html,
            afterShow: function() {
                $('.btnOk').click(function(){
                    $.fancybox.close();
                });
            },
            beforeClose:function(){
                ok();
            }
        });
    }
};
// --------------------------------------------
// jquery extension
(function($) {
    $.fn.slideCarousel = function(o) {
        // slide for some element
        var recLeft = true;
        var recRight = true;
        var e = this;
        var car = 0;
        var recCount = $('li', $(e)).length;
        var l = $('<div class="slideleft"></div>');
        var r = $('<div class="slideright"></div>');
        $(e).jcarousel({
            scroll: 3,
            initCallback: function(car) {
                if (car.first == 1) {
                    recLeft = false;
                } else {
                    recLeft = true;
                }
                if (car.last == recCount) {
                    recRight = false;
                } else {
                    recRight = true;
                }
                l.click(function() {
                    car.prev();
                    recLeft = true;
                    if (car.first == 1) {
                        $(this).css('display', 'none');
                        recLeft = false;
                    } else {
                        $(this).css('display', 'block');
                        recLeft = true;
                    }
                    if (car.last == recCount) {
                        $(r).css('display', 'none');
                        recRight = false;
                    } else {
                        $(r).css('display', 'block');
                        recRight = true;
                    }
                    return false;
                });
                r.click(function() {
                    car.next();
                    if (car.first == 1) {
                        $(l).css('display', 'none');
                        recLeft = false;
                    } else {
                        $(l).css('display', 'block');
                        recLeft = true;
                    }
                    if (car.last == recCount) {
                        $(r).css('display', 'none');
                        recRight = false;
                    } else {
                        $(r).css('display', 'block');
                        recRight = true;
                    }
                    return false;
                });
                $(e).after(l);
                $(e).after(r);
            },
            // This tells jCarousel NOT to autobuild prev/next buttons
            buttonNextHTML: null,
            buttonPrevHTML: null
        });
        $(e).bind('mouseover', sliding);
        $(l).bind('mouseover', sliding);
        $(r).bind('mouseover', sliding);

        function sliding() {
            if (recLeft) {
                $(l).css('display', 'block');
            }
            if (recRight) {
                $(r).css('display', 'block');
            }
        }
        $(e).bind('mouseout', function(e) {
            $(l).css('display', 'none');
            $(r).css('display', 'none');
        });
    };
    $.fn.wizardBox = function(o) {
        // binding next and back button
        $('.nextstepbutton').click(function() {
            var el = $('.wizardbox.current');
            el.next().addClass('current');
            el.removeClass('current');
            setCurrentWizardStep();
        });
        $('.backstepbutton').click(function() {
            var el = $('.wizardbox.current');
            el.prev().addClass('current');
            el.removeClass('current');
            setCurrentWizardStep();
        });

        function setCurrentWizardStep() {
            var i = $('.wizardbox.current').index();
            $('.wizardstep li').removeClass('current');
            $('.wizardstep li').eq(i).addClass('current');
        }
        BM.beforeHashChange = this.confirmChange;
        // get header for each step
        var h = [];
        $.each($('.wizardbox h3'), function(a, b) {
            h.push($(b).text());
        });
        // add wizard step
        var l = $('.wizardbox').length;
        var ul = $('<ul></ul>');
        for (var j = 0; j < l; j++) {
            var li = $('<li></li>').text(h[j]).attr('data-step', j).bind('click', function() {
                var idx = $(this).attr('data-step');
                $('.wizardbox').removeClass('current');
                $('.wizardbox').eq(idx).addClass('current');
                $('.wizardstep li').removeClass('current');
                $('.wizardstep li').eq(idx).addClass('current');
            });
            ul.append(li);
        }
        ul.append('<li></li>');
        $('.wizardstep').append(ul);
        setCurrentWizardStep();
    };
    $.fn.toolTips = function(o) {
        var xp = $(o).offset().left,
            yp = $(o).offset().right
        var x = $('<div style=""></div>');
    };
    // as seen on https://github.com/macek/jquery-to-json
    $.fn.serializeJSON = function() {
        var json = {};
        jQuery.map($(this).serializeArray(), function(n, i) {
            if (typeof json[n.name] == 'undefined') {
                json[n.name] = n.value;
            } else {
                if (typeof json[n.name] == 'object') {
                    json[n.name].push(n.value);
                } else {
                    var temp = json[n.name];
                    json[n.name] = [temp, n.value];
                }
            }
        });
        return json;
    };
    $.fn.assignForm = function(data, formating) {
        for (var s in data) {
            if (formating && formating[s]) {
                data[s] = formating[s].type == 'date' ? BM.formatDate(data[s]) : data[s];
            }
            $('[name=' + s + ']', this).val(data[s]);
        }
        return;
    };
    // https://github.com/macek/jquery-to-json
    $.fn.toJSON = function(options) {
        options = $.extend({}, options);
        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };
        this.build = function(base, key, value) {
            base[key] = value;
            return base;
        };
        this.push_counter = function(key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };
        $.each($(this).serializeArray(), function() {
            // skip invalid keys
            if (!patterns.validate.test(this.name)) {
                return;
            }
            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;
            while ((k = keys.pop()) !== undefined) {
                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }
                // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }
                // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }
            json = $.extend(true, json, merge);
        });
        return json;
    };
})(jQuery);
(function($) {
    /*$.fn.BMdropdown = function(options){
        var minWidth = options.minWidth || "-1px";
        var callback = options.callback || {};
        var data = options.data || {};
        var el = $(this.eq(0));
        el.parent().find('span').empty();

        if(minWidth.indexOf("px") == -1)
        	minWidth += "px";
        
        if(el.find('select').length == 0){
            el.append("<select id='"+options.id+"'></select>");
        }
        
        if(!el.hasClass('custom-combobox')){
            el.addClass('custom-combobox');
        }
        
        if(data.length > 0){
            
            for(var i = 0; i < data.length; i++){
                
                var field = data[i].field;
                var value = data[i].value;
                
                var opt = $("<option>" + field + "</option>");
                opt.attr('value', value);
                el.find('select').append(opt);            
                
            }            
        }
		
		el.find('select').val(options.value);
		console.log(el);
		el.binus_combobox();

        if(minWidth != "-1px")
        	el.find(".custom-combobox").css('min-width', minWidth);
                
        if(typeof(callback) == 'function')
            callback();
    };*/
    $.fn.BMdropdown = function(options) {
        var minWidth = options.minWidth || "-1px";
        var callback = options.callback || {};
        var data = options.data || {};
        var el = $(this.eq(0));
        if (minWidth.indexOf("px") == -1) minWidth += "px";
        if (el.find('select').length == 0) {
            el.append("<select class='custom-select'></select>");
        }
        if (!el.hasClass('custom-select')) {
            el.addClass('custom-select');
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var field = data[i].field;
                var value = data[i].value;
                var opt = $("<option>" + field + "</option>");
                opt.attr('value', value);
                el.find('select').append(opt);
            }
        }
        el.find('select').val(options.value);
        el.fancyfields();
        if (minWidth != "-1px") el.find(".ffSelectWrapper").css('min-width', minWidth);
        if (typeof(callback) == 'function') callback();
    };
    // ================================================
    // Created by 	: Samuel
    // Date 		: 15 Oct 2014
    // Description	: Load Table with DataTable plugin
    // ================================================
    $.fn.BMdatatable = function(options) {
        var cols = options.columns || null;
        var ajax = options.ajax || null;
        var tableObj;
        // Initialize for first time
        if (BM.tableObj == null) {
            BM.tableObj = [];
            var columnProp = [];
            for (var i = 0; i < cols.length; i++) {
                columnProp.push({
                    name: cols[i].id,
                    data: cols[i].id,
                    className: cols[i].class,
                    type: cols[i].type,
                    orderable: cols[i].isSortable
                });
            }
            tableObj = $(this).DataTable({
                scrollY: options.vScroll + 'px',
                scrollX: options.hScroll,
                scrollCollapse: true,
                autoWidth: false,
                paging: false,
                info: false,
                columns: columnProp
            });
            $('.dataTables_wrapper .dataTables_filter').prepend('<span class="button-search"></span>');
            BM.tableObj[0] = tableObj;
        } else {
            if ($.fn.dataTable.isDataTable($(this))) {
                for (var i = 0; i < BM.tableObj.length; i++) {
                    if ($(BM.tableObj[i].table().node()).attr("id") == $(this).attr("id")) {
                        tableObj = BM.tableObj[i];
                        break;
                    }
                }
            } else {
                var columnProp = [];
                for (var i = 0; i < cols.length; i++) {
                    columnProp.push({
                        name: cols[i].id,
                        data: cols[i].id,
                        className: cols[i].class,
                        type: cols[i].type,
                        orderable: cols[i].isSortable
                    });
                }
                tableObj = $(this).DataTable({
                    scrollY: options.vScroll + 'px',
                    scrollX: options.hScroll,
                    scrollCollapse: true,
                    autoWidth: false,
                    paging: false,
                    info: false,
                    columns: columnProp
                });
                $('.dataTables_wrapper .dataTables_filter').prepend('<span class="button-search"></span>');
                BM.tableObj[BM.tableObj.length] = tableObj;
            }
        }
        // Loading function
        var loading = function() {
            $('input[type="search"]').val('').keyup();
            tableObj.clear();
            var object = {};
            object[cols[0].id] = '<img alt="" src="' + BM.imageUri + 'loading.gif" />';
            for (var i = 1; i < cols.length; i++) object[cols[i].id] = '';
            tableObj.row.add(object);
            tableObj.row().nodes().to$().find('td:first').css({
                'text-align': 'center',
                'margin-top': '20px',
                'list-style': 'none'
            }).attr('colspan', cols.length);
            // tableObj.settings()[0].oScroll.sY = options.vScroll + 'px';
            var length = tableObj.cells().nodes().to$().length;
            for (var j = 1; j < cols.length; j++) $(tableObj.cells().nodes().to$()[j]).hide();
            tableObj.draw();
        };
        loading();
        if (ajax != null) {
            BM.ajax({
                url: ajax.url,
                type: 'POST',
                data: ajax.data,
                success: function(data) {
                    var resultData = ajax.success(data);
                    if (resultData.length > 0) {
                        tableObj.clear();
                        // Add array of data to DataTable object
                        tableObj.rows.add(resultData);
                        if (options.hScroll == false) tableObj.columns.adjust();
                        tableObj.draw();
                        if (typeof options.onCompleted == 'function') options.onCompleted();
                    } else {
                        tableObj.clear();
                        tableObj.draw();
                    }
                }
            });
        } else {
            console.warn("Warning: An instance of ajax was not found!");
            tableObj.clear();
            tableObj.draw();
        }
    };
    $.fn.BMtimepicker = function() {
        var el = $(this.eq(0));
        for (var i = 0; i < el.length; i++) {
            $(el[i]).timepicker({
                controlType: BM.timePickerControl
            });
        }
        //load datepicker - Kevin Gian     
    };
    $.fn.BMdatepicker = function() {
        var el = $(this.eq(0));
        if (el.hasClass('datepicker')) {
            var today = new Date();
            var queryDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
            var dateParts = queryDate.match(/(\d+)/g);
            var realDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var currDate = dateParts[0] + " " + BM.shortMonths[parseInt(dateParts[1])] + " " + dateParts[2];
            el.datepicker({
                dateFormat: "dd M yy"
            }).datepicker("setDate", currDate);
        }
        if (arguments.length === 1) el.datepicker(arguments[0]);
        else if (arguments.length === 2) el.datepicker(arguments[0], arguments[1]);
        else if (arguments.length === 3) el.datepicker(arguments[0], arguments[1], arguments[2]);
    };
})(jQuery);
(function($) {
    var BMautocomplete = {};
    var BMautocompleteCustom = {};
    BMautocomplete.tagTemplate = $("<div class='iTag hide'></div>").append($("<p style='float: left; margin-right: 10px;''></p>")).append($("<img src='../asset/images/sprites-icon/icon-close.png'>"));
    BMautocompleteCustom.tagTemplate = $("<div class='iTag hide'></div>").append($("<p style='float: left; margin-right: 10px;''></p>")).append($("<img src='../asset/images/sprites-icon/icon-close.png'>"));
    //AutoComplete class
    function AutoComplete(selector, options) {
        var widget = this;
        widget.textSelector = selector;
        widget.textSelector.wrap("<div class='bm-autocomplete-wrap' id='bm-autocomplete-" + selector.attr("id") + "'></div>");
        var textBoxWidth = selector.width();
        widget.wrapperSelector = selector.parent();
        widget.wrapperSelector.append($("<div class='autocomplete-list hide' style='width:" + textBoxWidth + "px;'><ul></ul></div>"));
        widget.autoCompleteList = this.wrapperSelector.find('.autocomplete-list');
        widget.hashValue = {};
        var currentHoveredKey = -1;
        var dataset = options.dataset;
        widget.query = function(input, callback) {
            if (input.length >= options.numCharacterTreshold) {
                BM.ajax({
                    url: options.url,
                    type: "POST",
                    data: JSON.stringify({
                        'input': input,
                        'limitResult': options.limitResult
                    }),
                    contentType: 'application/json;charset=utf-8',
                    success: function(data) {
                        callback(data);
                    }
                });
            } else {
                widget.autoCompleteList.addClass('hide');
            }
        };
        widget.searchFromDataset = function(input, callback) {
            if (input.length >= options.numCharacterTreshold) {
                input = input.toLowerCase();
                var result = [];
                var dataset = options.dataset;
                for (var key in dataset) {
                    if (result.length >= options.limitResult) {
                        break;
                    }
                    if (dataset[key].toLowerCase().indexOf(input) != -1 && !(key in widget.hashValue)) {
                        result.push({
                            Key: key,
                            Value: dataset[key]
                        });
                    }
                }
                callback(result);
            } else {
                widget.autoCompleteList.addClass('hide');
            }
        };
        var listBody = widget.autoCompleteList.find('ul');
        var hashValue = widget.hashValue;
        listBody.delegate("li", "click", function() {
            widget.textSelector.val($(this).html());
            widget.textSelector.focus();
            widget.autoCompleteList.addClass('hide');
        });
        listBody.delegate("li", "hover", function() {
            listBody.find('li').removeClass('hover');
            currentHoveredKey = $(this).attr('data-key');
            $(this).addClass('hover');
        });
        widget.textSelector.keyup(function(e) {
            var listItem = listBody.find('li');
            if (e.keyCode == 38) { //up
                if (listItem.first().hasClass('hover') || !listItem.hasClass('hover')) {
                    listItem.first().removeClass('hover');
                    listItem.last().addClass('hover');
                    currentHoveredKey = listItem.last().attr('data-key');
                } else {
                    var prevElement = listBody.find('.hover').removeClass('hover').prev();
                    prevElement.addClass('hover');
                    currentHoveredKey = prevElement.attr('data-key');
                }
            } else if (e.keyCode == 40) { //down
                if (listItem.last().hasClass('hover') || !listItem.hasClass('hover')) {
                    listItem.last().removeClass('hover');
                    listItem.first().addClass('hover');
                    currentHoveredKey = listItem.first().attr('data-key');
                } else {
                    var nextElement = listBody.find('.hover').removeClass('hover').next();
                    nextElement.addClass('hover');
                    currentHoveredKey = nextElement.attr('data-key');
                }
            } else if (e.keyCode == 13) {
                if (listBody.find("li.hover").length > 0 && currentHoveredKey != -1) {
                    widget.textSelector.val(listBody.find("li[data-key=" + currentHoveredKey + "]").html());
                    widget.textSelector.focus();
                    widget.autoCompleteList.addClass('hide');
                    //add by Calvin S , setelah tekan enter pada keyboard
                    if (options.select !== undefined) {
                        if (typeof(options.select) == 'function') {
                            options.select(listBody.find("li[data-key=" + currentHoveredKey + "]"));
                        }
                    }
                } else if (listBody.find("li").length > 0) {
                    currentHoveredKey = listItem.first().attr('data-key');
                    widget.textSelector.val(listBody.find("li[data-key=" + currentHoveredKey + "]").html());
                    widget.textSelector.focus();
                    widget.autoCompleteList.addClass('hide');
                }
            }
            // added by brian alexandro, Nov 27 2014
            else if (e.keyCode == 8) {
                listBody.find('.hover').removeClass('hover');
            }
            // end of code //
            else {
                var callback = function(data) {
                    listBody.html("");
                    if (data.length == 0) {
                        widget.autoCompleteList.addClass('hide');
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        var list = $("<li data-key='" + data[i].Key + "'>" + data[i].Value + "</li>");
                        listBody.append(list);
                    }
                    widget.autoCompleteList.removeClass('hide');
                };
                widget.repositionAutoCompleteList();
                if (options.url != null) {
                    widget.query($(this).val(), callback);
                } else if (options.dataset != null) {
                    widget.searchFromDataset($(this).val(), callback);
                }
                //add by Calvin S , fitur select setelah memilih autocomplete
                $('.autocomplete-list ul li').off().on('click', function() {
                    if (options.select !== undefined) {
                        if (typeof(options.select) == 'function') options.select($(this));
                    }
                });
            }
            var len = $(this).val().length;
            if (len == 0) widget.autoCompleteList.addClass('hide');
        });
    } //End of AutoComplete class
    AutoComplete.prototype.getValue = function() {
        return this.textSelector.val();
    };
    AutoComplete.prototype.repositionAutoCompleteList = function() {
        var lmargin = this.textSelector.position().left;
        var tmargin = this.textSelector.position().top;
        var textBoxMargin = this.textSelector.css("margin");
        textBoxMargin = textBoxMargin.substr(0, textBoxMargin.indexOf("px"));
        textBoxMargin = parseInt(textBoxMargin);
        this.autoCompleteList.css('left', (lmargin + textBoxMargin) + "px");
        this.autoCompleteList.css('top', (tmargin + 40) + "px");
    };
    //AutoCompleteTags class
    function AutoCompleteTags(selector, options) {
        var widget = this;
        widget.textSelector = selector;
        widget.textSelector.wrap("<div class='bm-autocomplete-wrap' id='bm-autocomplete-" + selector.attr("id") + "'></div>");
        widget.textSelector.addClass('noborder').attr('style', 'width: 28px !important;');
        widget.wrapperSelector = selector.parent();
        widget.wrapperSelector.append($("<div class='autocomplete-list hide'><ul></ul></div>"));
        widget.autoCompleteList = this.wrapperSelector.find('.autocomplete-list');
        widget.hashValue = {};
        var currentHoveredKey = -1;
        widget.textSelector.keyup(function(e) {
            var listItem = listBody.find('li');
            if (e.keyCode == 38) { //up
                if (listItem.first().hasClass('hover') || !listItem.hasClass('hover')) {
                    listItem.first().removeClass('hover');
                    listItem.last().addClass('hover');
                    currentHoveredKey = listItem.last().attr('data-key');
                } else {
                    var prevElement = listBody.find('.hover').removeClass('hover').prev();
                    prevElement.addClass('hover');
                    currentHoveredKey = prevElement.attr('data-key');
                }
            } else if (e.keyCode == 40) { //down
                if (listItem.last().hasClass('hover') || !listItem.hasClass('hover')) {
                    listItem.last().removeClass('hover');
                    listItem.first().addClass('hover');
                    currentHoveredKey = listItem.first().attr('data-key');
                } else {
                    var nextElement = listBody.find('.hover').removeClass('hover').next();
                    nextElement.addClass('hover');
                    currentHoveredKey = nextElement.attr('data-key');
                }
            } else if (e.keyCode == 13) {
                if (listBody.find("li.hover").length > 0 && currentHoveredKey != -1) {
                    widget.addTag(listBody.find("li[data-key=" + currentHoveredKey + "]"));
                }
            } else {
                widget.repositionAutoCompleteList();
                var callback = function(data) {
                    listBody.html("");
                    if (data.length == 0) {
                        widget.autoCompleteList.addClass('hide');
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].Key in widget.hashValue) continue;
                        var list = $("<li data-key='" + data[i].Key + "'>" + data[i].Value + "</li>");
                        listBody.append(list);
                    }
                    widget.autoCompleteList.removeClass('hide');
                };
                if (options.url != null) {
                    widget.query($(this).val(), callback);
                } else if (options.dataset != null) {
                    widget.searchFromDataset($(this).val(), callback);
                }
            }
            var len = $(this).val().length;
            if (len == 0) widget.autoCompleteList.addClass('hide');
        });
        widget.textSelector.keydown(function(e) {
            if (e.keyCode == 8) {
                if (widget.wrapperSelector.find('.tag-element').length != 0 && $(this).val().length == 0) {
                    var key = widget.wrapperSelector.find('.tag-element').last().find('p').attr('data-key');
                    widget.wrapperSelector.find('.tag-element').last().remove();
                    widget.repositionAutoCompleteList();
                    delete widget.hashValue[key];
                }
            } else {
                var len = $(this).val().length;
                if (len == 0) {
                    $(this).attr("style", "width: 28px !important;");
                } else {
                    $(this).attr("style", "width: " + ((len * 8) + 28) + "px !important;");
                }
            }
        });
        widget.query = function(input, callback) {
            if (input.length >= options.numCharacterTreshold) {
                BM.ajax({
                    url: options.url,
                    type: "POST",
                    data: JSON.stringify({
                        'input': input,
                        'limitResult': options.limitResult
                    }),
                    contentType: 'application/json;charset=utf-8',
                    success: function(data) {
                        callback(data);
                    }
                });
            } else {
                widget.autoCompleteList.addClass('hide');
            }
        };
        widget.searchFromDataset = function(input, callback) {
            if (input.length >= options.numCharacterTreshold) {
                input = input.toLowerCase();
                var result = [];
                var dataset = options.dataset;
                for (var key in dataset) {
                    if (result.length >= options.limitResult) {
                        break;
                    }
                    if (dataset[key].toLowerCase().indexOf(input) != -1 && !(key in widget.hashValue)) {
                        result.push({
                            Key: key,
                            Value: dataset[key]
                        });
                    }
                }
                callback(result);
            } else {
                widget.autoCompleteList.addClass('hide');
            }
        };
        var hashValue = widget.hashValue;
        var listBody = widget.autoCompleteList.find('ul');
        listBody.delegate("li", "click", function() {
            widget.addTag($(this));
        });
        listBody.delegate("li", "hover", function() {
            listBody.find('li').removeClass('hover');
            currentHoveredKey = $(this).attr('data-key');
            $(this).addClass('hover');
        });
        widget.wrapperSelector.delegate(".tag-element img", "click", function(e) {
            var key = $(this).parent().find('p').attr('data-key');
            $(this).parent().remove();
            widget.repositionAutoCompleteList();
            delete widget.hashValue[key];
            // console.log(widget.hashValue);
        });
    }
    //End of AutoCompleteTags class
    AutoCompleteTags.prototype.addTag = function(obj) {
        var key = obj.attr('data-key');
        var tag = BMautocomplete.tagTemplate.clone().removeAttr('class').addClass('tag-element');
        var tagCustom = BMautocomplete.tagTemplate.clone().removeAttr('class').addClass('tag-element');
        
        tag.find('p').html(obj.html()).attr('data-key', key);
        if (this.wrapperSelector.find('.tag-element').length != 0) {
            tag.insertAfter(this.wrapperSelector.find('.tag-element').last());
        } else {
            tag.prependTo(this.wrapperSelector);
        }

        tagCustom.find('p').html(obj.html()).attr('data-key', key);
        if (this.wrapperSelector.find('.tag-element').length != 0) {
            tagCustom.insertAfter(this.wrapperSelector.find('.tag-element').last());
        } else {
            tagCustom.prependTo(this.wrapperSelector);
        }
        this.textSelector.val("").trigger('keyup').focus();
        this.repositionAutoCompleteList();
        this.hashValue[key] = obj.html();
        console.log(this.hashValue);
    };
    AutoCompleteTags.prototype.repositionAutoCompleteList = function() {
        var lmargin = this.textSelector.position().left;
        var tmargin = this.textSelector.position().top;
        var textBoxMargin = this.textSelector.css("margin");
        textBoxMargin = textBoxMargin.substr(0, textBoxMargin.indexOf("px"));
        textBoxMargin = parseInt(textBoxMargin);
        this.autoCompleteList.css('left', (lmargin + textBoxMargin) + "px");
        this.autoCompleteList.css('top', (tmargin + 40) + "px");
    };
    AutoCompleteTags.prototype.getValues = function() {
        var values = [];
        this.wrapperSelector.find('.tag-element').each(function() {
            values.push($(this).find('p').attr('data-key'));
        });
        return values;
    };
    AutoCompleteTags.prototype.reset = function() {
        var tags = this.wrapperSelector.find('.tag-element');
        if (tags.length > 0) {
            for (var i = 0; i < tags.length; i++) {
                var key = this.wrapperSelector.find('.tag-element').last().find('p').attr('data-key');
                this.wrapperSelector.find('.tag-element').last().remove();
                this.repositionAutoCompleteList();
                delete this.hashValue[key];
            }
        }
    };
    $.fn.BMautocomplete = function(options) {
        var el = $($(this.eq(0))[0]);
        options = $.extend({}, $.fn.BMautocomplete.defaults, options);
        var id = el.attr("id");
        id = id || "";
        if (id.length == 0) {
            console.error("BMautocomplete: element should be given an id.");
            return;
        } else if (el.attr('type') != 'text') {
            console.error("BMautocomplete: only <input type='text'> is allowed.");
            return;
        }
        if (options.tag) return new AutoCompleteTags(el, options);
        else return new AutoComplete(el, options);
    };
    $.fn.BMautocomplete.defaults = {
        numCharacterTreshold: 3,
        limitResult: 5,
        tag: false,
        url: null,
        dataset: []
    };

    $.fn.BMautocompleteCustom = function(options) {
        var el = $($(this.eq(0))[0]);
        options = $.extend({}, $.fn.BMautocompleteCustom.defaults, options);
        var id = el.attr("id");
        id = id || "";
        if (id.length == 0) {
            console.error("BMautocomplete: element should be given an id.");
            return;
        } else if (el.attr('type') != 'text') {
            console.error("BMautocomplete: only <input type='text'> is allowed.");
            return;
        }
        if (options.tag) return new AutoCompleteTags(el, options);
        else return new AutoComplete(el, options);
    };
    $.fn.BMautocompleteCustom.defaults = {
        numCharacterTreshold: 1,
        limitResult: 10,
        tag: false,
        url: null,
        dataset: []
    };
})(jQuery);
// Main Nav Height
function main_nav_height() {
    var offset = $(window).scrollTop();
    var sub_menu_height = $('#body-components').outerHeight();
    var top_nav_height = $('#top-nav').outerHeight();
    var top_nav_final_height = sub_menu_height + (top_nav_height * 2) + 3 - offset;
    if (top_nav_final_height > sub_menu_height) {
        var top_nav_final_height = sub_menu_height;
    }
    $('#main-nav-expand .sub-menu').height(top_nav_final_height);
}
// Body Nav
function body_nav_init() {
    var body_nav_width = 40;
    var body_nav_inside = $('#body-nav .inside').outerWidth();
    $('#body-nav ul li').each(function() {
        var body_nav_li_width = $(this).outerWidth();
        body_nav_width = body_nav_width + body_nav_li_width;
    });
    $('#body-nav .inside ul').width(body_nav_width);
    if (body_nav_inside > body_nav_width) {
        $('#body-nav .nav').hide();
    } else {
        // Rearrange the order based on .active -> .active always at the leftest
        $('#body-nav ul li.active').nextAll('li').prependTo('#body-nav ul');
        $('#body-nav ul li.active').prependTo('#body-nav ul');
    }
}