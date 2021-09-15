 $(window).on('load', function() {
    //site management
    
    //if (data.length > 0) {
        window.document.title = 'Training';
        $('#DefaultCssMainSite').prop("href", '../asset/css/style.css');
        $('#CssMainSite').prop("href", '../asset/themes/bm5/css/style.css');
        $("#CssModuleSite").prop("href",'../asset/modules/binusmaya/css/style.css');
        $('.main-title').text('BINUS UNIVERSITY');
        $('#imgLogo').attr('src', '../asset/images/logo.png');
        $('.banner-image').removeClass('.banner-image').addClass('.banner-image');
        $('.business-unit').text('Training');
        setTimeout(function() {
            $('#overlay').remove();
        }, 1000);
    //}
});
var loadForm = function(obj) {
    var form = $("#dynamic-form-filter").clone().removeAttr("id").css("display", "");
    var formData = obj.formData;
    var template;
    var content = $("#" + obj.type + "-content", form).clone().css("display", "").removeAttr("id");
    var dataFilter = $(".row.content", content).empty();
    var divButton = $(".row.button-list", content);
    var listDependFilter = [];
    for (var i = 0; i < formData.length; i++) {
        var eachData = formData[i];
        var newInput = $("#" + obj.type + "-content #i" + eachData.type[0].toUpperCase() + eachData.type.substr(1).toLowerCase(), form).clone().removeAttr("id");
        if (eachData.input.attr('type') == 'text' && obj.type != 'vertical') {
            //$(eachData.input).attr('style', 'width:95%');
        }
        $(".iLabel", newInput).html(eachData.name);
        $(".iInput", newInput).html(eachData.input);
        if (eachData.allOption === true) {
            $(".iInput select", newInput).append($("<option value='All'>All</option>"));
        }
        $(dataFilter).append(newInput);
    }
    if (obj.buttonList != undefined) {
        var buttonList = obj.buttonList;
        for (var i = 0; i < buttonList.length; i++) {
            $(divButton).append(buttonList[i]);
        }
    }
    $(form).append(content);
    if (typeof(obj.onSubmit) == "function") $(form).submit(obj.onSubmit);
    $("#" + obj.target).html(form);
    loadDataForm(obj.itemData.data, obj.prefix, form, obj.value, obj.text, obj.nullValue, obj.addAttr, obj.idInput, obj.popup, obj.ignoreData);
}
var loadDataForm = function(itemData, prefix, parent, itemValue, itemText, nullValue, addAttr, idInput, popup, ignoreData) {
        nullValue = nullValue ? nullValue : [];
        ignoreData = ignoreData ? ignoreData : [];
        var index = 0;
        var tempOption;
        var eachData;
        var selector;
        for (var j in itemData) {
            selector = !idInput || !idInput[index] ? j : idInput[index];
            if (ignoreData.indexOf(prefix[index] + selector) == -1) {
                if ($("#" + prefix[index] + selector).length === 0) {
                    console.log("There is no element with id " + prefix[index] + selector);
                } else {
                    if (prefix[index] == "ddl") {
                        for (var i = 0; i < itemData[j].length; i++) {
                            eachData = itemData[j][i];
                            if (!eachData[itemValue[index]]) {
                                console.log("Data of " + j + " doesn't have " + itemValue[index]);
                            } else if (!eachData[itemText[index]]) {
                                console.log("Data of " + j + " doesn't have " + itemText[index]);
                            } else {
                                tempOption = $("<option value='" + eachData[itemValue[index]].toString().trim() + "'>" + eachData[itemText[index]] + "</option>");
                                if (addAttr !== undefined && addAttr[index] !== undefined && addAttr[index] !== "") {
                                    for (var x in addAttr[index]) {
                                        $(tempOption).attr(x, eachData[addAttr[index][x]]);
                                    }
                                }
                                $("#" + prefix[index] + selector, parent).append(tempOption);
                            }
                        }
                        if ($("#" + prefix[index] + selector + " option").length === 0) {
                            var v = nullValue[index] === undefined ? "" : nullValue[index];
                            $("#" + prefix[index] + selector).append("<option value='" + v + "'>No data available</option>");
                        }
                        if (!popup) {
                            if ($("#" + prefix[index] + selector).closest("span").hasClass('custom-combobox')) {
                                $("#" + prefix[index] + selector).closest("span.custom-combobox").binus_combobox();
                            } else {
                                $("#" + prefix[index] + selector).closest("span.custom-chosen").binus_advanced_combobox();
                            }
                        }
                    } else if (prefix[index] == "txt") {
                        var dataset = [];
                        for (var i = 0; i < itemData[j].length; i++) {
                            eachData = itemData[j][i];
                            if (itemValue && itemValue[index]) dataset.push(eachData[itemValue[index]].toString().trim() + " - " + eachData[itemText[index]]);
                            else dataset.push(eachData[Object.keys(eachData)[0]]);
                        }
                        $("#" + prefix[index] + selector).BMautocomplete({
                            dataset: dataset
                        });
                    } else if (prefix[index]) {
                        console.log("Element No." + index + " need prefix");
                    } else {
                        console.log("Allowed prefix: ddl,txt");
                    }
                }
            }
            index++;
        }
    }
    /*
     * Created by   : Edwin Setiawan
     * Date         : 11-05-2015
     * Description  : Special filter untuk CI baru
     */
var newSpecialFilter = function(arrobj) {
    if (!$.isArray(arrobj)) {
        arrobj = [arrobj];
    }
    $.each(arrobj, function(k, obj) {
        var from = obj.from,
            dataTo = obj.dataTo,
            to = obj.to,
            attr = obj.attr,
            toValue = obj.toValue,
            toText = obj.toText,
            triggerFromStart = obj.triggerFromStart || true,
            objType = obj.objType ==null? 'binus_combobox': obj.objType,
            tempVal;

        $(from).map(function(i, e) {
            $(e).change(function() {
                tempVal = $(from).map(function(i, e) {
                    return $(e).val();
                });
                var tempArray = [],
                    tempData = [];
                var val = $(this).val();

                if (obj.allOption === true) {
                    tempData.push(['All', 'All']);
                }
                
                $.each(dataTo, function(s, v) {
                    var flag = false,
                        temp;
                    if (!$.isArray(attr)) {
                        if (v[attr] == val) {
                            tempArray.push(v);
                        }
                    } else {
                        for (index = 0; index < attr.length; index++) {
                            if (v[attr[index]] == tempVal[index]) {
                                flag = true;
                                temp = v;
                            } else {
                                flag = false;
                                return;
                            }
                        }
                        if (flag) {
                            tempArray.push(temp);
                        }
                    }
                });
                $(to).empty();
                /*if (val == 'All') {
                    tempData.push(['All', 'All']);
                }*/
                $.each(tempArray, function(s, v) {
                    if ($.isArray(v)) {
                        $.each(v, function(key, value) {
                            tempData.push([value[toValue], value[toText]]);
                        })
                    } else {
                        tempData.push([v[toValue], v[toText]]);
                    }
                });
                if (tempData.length === 0) {
                    tempData.push(['', 'No Data Available']);
                }
                $.each(tempData, function(s, v) {
                    $(to).append('<option value="' + v[0] + '">' + v[1] + '</option>');
                });
                $(to).data('has-init', 'no');
                if(objType == 'binus_combobox'){
                    $(to).parent().binus_combobox();
                }
                else{
                    $(to).parent().binus_advanced_combobox();
                }
                $(to).trigger('change');
            });
        });
        if (triggerFromStart) {
            $(from).trigger("change");
        }
    });
    /*var from = obj.from,
        dataTo = obj.dataTo,
        to = obj.to,
        attr = obj.attr,
        toValue = obj.toValue,
        toText = obj.toText,
        triggerFromStart = obj.triggerFromStart || true;
    $(from).change(function() {
        var tempArray = [],
            tempData = [];
        var val = $(this).val();
        $.each(dataTo, function(k, v) {
            if (v[attr] == val) {
                tempArray.push(v);
            }
        });
        $(to).empty();
        if (val == 'All') {
            tempData.push(['All', '']);
        }
        $.each(tempArray, function(k, v) {
            tempData.push([v[toValue], v[toText]]);
        });
        if(tempData.length === 0){
            tempData.push(['No Data Available', '']);
        }
        $.each(tempData, function(k, v) {
            $(to).append('<option value="' + v[0] + '">' + v[1] + '</option>');
        });
        $(to).data('has-init', 'no');
        $(to).parent().binus_combobox();
        $(to).trigger('change');
    });
    if (triggerFromStart) {
        $(from).trigger("change");
    }*/
}
    
  
var newSpecialFilterForAllComboBox = function(arrobj) {
    if (!$.isArray(arrobj)) {
        arrobj = [arrobj];
    }
    $.each(arrobj, function(k, obj) {
        var from = obj.from,
            dataTo = obj.dataTo,
            to = obj.to,
            attr = obj.attr,
            toValue = obj.toValue,
            toText = obj.toText,
            triggerFromStart = obj.triggerFromStart || true,
            objType = obj.objType ==null? 'binus_combobox': obj.objType,
            withDistinct = obj.withDistinct == null? false : obj.withDistinct,
            tempVal;
        $(from).map(function(i, e) {
            $(e).change(function() {
                tempVal = $(from).map(function(i, e) {
                    return $(e).val();
                });
                var tempArray = [],
                    tempData = [];
                var val = $(this).val();

                if (obj.allOption === true) {
                    tempData.push(['All', 'All']);
                }
                
                $.each(dataTo, function(s, v) {
                    var flag = false,
                        temp;

                    if (!$.isArray(attr)) {
                        if (v[attr] == val || val==='All') {
                            tempArray.push(v);
                        }
                    } else {
                        for (index = 0; index < attr.length; index++) {

                            if (v[attr[index]] == tempVal[index] || tempVal[index]==='All') {
                                flag = true;
                                temp = v;
                            } else {
                                flag = false;
                                return;
                            }
                        }
                        if (flag) {
                            tempArray.push(temp);
                        }
                    }
                });
                $(to).empty();
                /*if (val == 'All') {
                    tempData.push(['All', 'All']);
                }*/

                
                $.each(tempArray, function(s, v) {
                    if ($.isArray(v)) {
                        $.each(v, function(key, value) {
                            tempData.push([value[toValue], value[toText]]);
                        })
                    } else {
                        tempData.push([v[toValue], v[toText]]);
                    }
                });
                if (obj.allOption === true && tempData.length===1) {
                   $(to).append('<option value="-1">No Data Available</option>');
                }
                else{
                    if (tempData.length === 0 ) {
                        tempData.push(['', 'No Data Available']);
                    }
                    
                    if(withDistinct === true){
                        var tempDistinct = []
                        $.each(tempData, function(s, v) {
                            if($.inArray(v[0], tempDistinct) >= 0){
                                return;
                            }
                            else{
                                $(to).append('<option value="' + v[0] + '">' + v[1] + '</option>');
                                tempDistinct.push(v[0]);
                            }
                        });
                    }
                    else{
                        $.each(tempData, function(s, v) {
                            $(to).append('<option value="' + v[0] + '">' + v[1] + '</option>');
                        });
                    }
                }

                $(to).data('has-init', 'no');
                if(objType == 'binus_combobox'){
                    $(to).parent().binus_combobox();
                }
                else{
                    $(to).parent().binus_advanced_combobox();
                }
                $(to).trigger('change');
            });
        });

        if (triggerFromStart) {
            $(from).trigger("change");
        }
    });
    /*var from = obj.from,
        dataTo = obj.dataTo,
        to = obj.to,
        attr = obj.attr,
        toValue = obj.toValue,
        toText = obj.toText,
        triggerFromStart = obj.triggerFromStart || true;
    $(from).change(function() {
        var tempArray = [],
            tempData = [];
        var val = $(this).val();
        $.each(dataTo, function(k, v) {
            if (v[attr] == val) {
                tempArray.push(v);
            }
        });
        $(to).empty();
        if (val == 'All') {
            tempData.push(['All', '']);
        }
        $.each(tempArray, function(k, v) {
            tempData.push([v[toValue], v[toText]]);
        });
        if(tempData.length === 0){
            tempData.push(['No Data Available', '']);
        }
        $.each(tempData, function(k, v) {
            $(to).append('<option value="' + v[0] + '">' + v[1] + '</option>');
        });
        $(to).data('has-init', 'no');
        $(to).parent().binus_combobox();
        $(to).trigger('change');
    });
    if (triggerFromStart) {
        $(from).trigger("change");
    }*/
}
var specialFilter = function(obj) {
    var data = obj.data,
        form = obj.form;
    var tempArray, item, itemData, tempChain, row, searchItem, globalArray = {};
    for (var i in obj) {
        if (i != "data" && i != "form" && i != "triggerFromStart") {
            tempArray = [];
            item = obj[i];
            itemData = data[item.name];
            tempChain = item.chain;
            for (var j in itemData) {
                x = itemData[j];
                searchItem = {};
                searchItem.value = x[item.dbValue];
                searchItem.text = x[item.dbText];
                for (var k in tempChain) {
                    searchItem[tempChain[k].src] = x[tempChain[k].name];
                }
                tempArray.push(searchItem);
            }
            for (var a in tempChain) {
                var tempFunc = $("#" + tempChain[a].src, form).data("settings")["onSelectChange"];
                $("#" + tempChain[a].src, form).attr("data-id", function(index, id) {
                    return id === undefined ? i : id += ";" + i;
                }).fancyfields("bind", "onSelectChange", function(input, text, val) {
                    if (typeof tempFunc == "function" && tempFunc.toString() != $("#" + tempChain[a].src, form).data("settings")["onSelectChange"].toString()) {
                        tempFunc();
                    }
                    var chainSrcList = $(input).attr("data-id").split(";");
                    var chList = [];
                    for (var i in chainSrcList) {
                        if (chList.indexOf(chainSrcList[i]) == -1) {
                            chList.push(chainSrcList[i]);
                        }
                    }
                    var filterData, srcChanged, validateFlag, tempDdl = [];
                    for (var i in chList) {
                        tempDdl = [];
                        srcChanged = chList[i];
                        filterData = BM["filterData" + $(form).attr("id")][srcChanged].data;
                        $(filterData).each(function(e) {
                            validateFlag = -1
                            for (var f in this) {
                                if (f != "text" && f != "value") {
                                    if (this[f].toString().trim() == $("#" + f).val() && validateFlag !== 0) validateFlag = 1;
                                    else validateFlag = 0;
                                }
                            }
                            if (validateFlag === 1 && tempDdl.indexOf({
                                    field: this.text,
                                    value: this.value
                                }) == -1) {
                                tempDdl.push({
                                    field: this.text,
                                    value: this.value
                                })
                            }
                        })
                        if (text == 'All') {
                            tempDdl.push({
                                field: "All",
                                value: ""
                            })
                        } else if (tempDdl.length === 0) {
                            tempDdl.push({
                                field: "No Data Available",
                                value: ""
                            })
                        }
                        var attributes = $("#" + srcChanged).prop("attributes");
                        var settings = $("#" + srcChanged).data("settings");
                        var span = $("#" + srcChanged).closest('span.custom-select');
                        $(span).empty().BMdropdown({
                            data: tempDdl,
                            callback: ""
                        });
                        $.each(attributes, function() {
                            $("select", span).attr(this.name, this.value);
                        });
                        if (typeof settings["onSelectChange"] == "function") {
                            $("select", span).fancyfields("bind", "onSelectChange", settings["onSelectChange"]).fancyfields("trigger", "onSelectChange");
                        }
                    }
                });
            }
            globalArray[i] = {
                chain: tempChain,
                data: tempArray
            };
        }
    }
    BM["filterData" + $(form).attr("id")] = globalArray;
    for (var t in obj.triggerFromStart) {
        var settings = $("#" + obj.triggerFromStart[t]).data("settings");
        if (settings && settings["onSelectChange"]) {
            $("#" + obj.triggerFromStart[t]).fancyfields("trigger", "onSelectChange");
        }
    }
}
var loadPagingOption = function(obj) {
    var pagination = $(obj.selector).closest('.pagination');
    if ($('.tempClone', pagination).length < 1) {
        $(pagination).hide();
        return;
    } else {
        $(pagination).show();
    }
    var current = location.hash.split(".")[1] === undefined ? 1 : location.hash.split(".")[1].split("/")[0];
    var baseUrl = $('.tempClone', pagination).attr("href").split(".")[0];
    var currentAnchor = $('a[href="' + baseUrl + '.' + current + '"]');
    var totalPage = $('.tempClone[id!='+$(obj.selector).attr('id')+']', pagination).length;
    $(currentAnchor).addClass('currentPage');
    $(".pages", pagination).html("Page " + current + " of " + totalPage);
    $(".prev-next-nav .prev-nav", pagination).off("click").click(function(e) {
        e.preventDefault();
        $(currentAnchor).prev().get(0).click();
    })
    $(".prev-next-nav .next-nav", pagination).off("click").click(function(e) {
        e.preventDefault();
        $(currentAnchor).next().get(0).click();
    })
    $(".prev-next-nav .disable").removeClass('disable').attr("href", '#');
    if (parseInt(current) === 1) {
        $(".prev-next-nav .prev-nav", pagination).off("click").addClass('disable').removeAttr("href");
    }
    if (parseInt(current) === parseInt(totalPage)) {
        $(".prev-next-nav .next-nav", pagination).off("click").addClass('disable').removeAttr("href");
    }
    if (parseInt(totalPage) > 20) {
        overPages({
            total: totalPage,
            current: current,
            parent: pagination
        })
    }
}
var overPages = function(obj) {
    var leftLoad = $("<a class='load' href='#'>...</a>");
    var rightLoad = $("<a class='load' href='#'>...</a>");
    leftLoad.click(function(e) {
        e.preventDefault();
        obj.current = parseInt(obj.current) - 10;
        manageLoadButton(obj);
    });
    rightLoad.click(function(e) {
        e.preventDefault();
        obj.current = parseInt(obj.current) + 10;
        manageLoadButton(obj);
    });
    $(".the-navi .load", obj.parent).remove();
    $(".the-navi", obj.parent).prepend(leftLoad).append(rightLoad);
    manageLoadButton(obj);

    function manageLoadButton(obj) {
        if (parseInt(obj.current) <= 10) {
            $(".tempClone:nth-child(-n+11)", obj.parent).show();
            $(".tempClone:nth-child(n+12)", obj.parent).hide();
            rightLoad.show();
            leftLoad.hide();
        } else if (parseInt(obj.current) > 10 && parseInt(obj.current) < Math.floor(parseInt(obj.total) / 10) * 10) {
            var min = Math.floor(parseInt(obj.current) / 10) * 10 + 1;
            var max = parseInt(min) + 10 - 1;
            $(".tempClone:nth-child(n+" + max + ")", obj.parent).hide();
            $(".tempClone:nth-child(-n+" + min + ")", obj.parent).hide();
            $(".tempClone:nth-child(n+" + min + "):nth-child(-n+" + max + ")", obj.parent).show();
            rightLoad.show();
            leftLoad.show();
        } else {
            var min = Math.floor(parseInt(obj.total) / 10) * 10;
            var diff = parseInt(obj.total) - min;
            var flag = parseInt(obj.total) - diff + 1;
            $(".tempClone:nth-child(-n+" + flag + ")", obj.parent).hide();
            $(".tempClone:nth-child(n+" + flag + ")", obj.parent).show();
            rightLoad.hide();
            leftLoad.show();
        }
    }
}
var printReport = function(obj) {
    var strTemp = '<form method="post" action="' + obj.url + '" target="ReportWindow">';
    var dataForm = obj.data;
    var tempDataForm = "";
    for (var i in dataForm) {
        if (i == 'lecturerSchedule') {
            for (var j = 0; j < dataForm[i].length; j++) {
                if (dataForm[i][j] == '\"') tempDataForm += '\'';
                else tempDataForm += dataForm[i][j];
            }
            strTemp += '<input type="hidden" name="' + i + '" value="' + tempDataForm + '" />';
        } else strTemp += '<input type="hidden" name="' + i + '" value="' + dataForm[i] + '" />';
    }
    strTemp += '</form>';
    window.open('', 'ReportWindow');
    $(strTemp).hide().appendTo("body").submit().remove();
}
var currentValue = function(obj) {
    var object = obj.element;
    var value = obj.value;
    var settings = $(object).data("settings");
    object.closest("span.custom-select").html(object);
    object.val(value);
    object.fancyfields();
    object.fancyfields("bind", "onSelectChange", settings['onSelectChange']);
    if (typeof($(object).data("settings")['onSelectChange']) != 'undefined') {
        object.fancyfields("trigger", "onSelectChange");
    }
}
