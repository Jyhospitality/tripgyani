/**
 * Created by murug on 7/21/2016.
 */
$.ocean = {
    options: {
        auto_play_pause: true
    },
    init: function () {
        var $_body = $('body');
        var $_fill_border = $(".fill-tile-border");
        var $_room_pax_widget = $(".room-pax-widget:not(.fotter)");
        var $_room_pax_widget_fotter = $(".room-pax-widget.fotter");
        $.each($_fill_border, function (i, element) {
            var $_border_html = '<div class="frame-border tile-left left"></div>' +
                '<div class="frame-border tile-right right"></div>' +
                '<div class="frame-border tile-top top"></div>' +
                '<div class="frame-border tile-bottom bottom"></div>';
            $(element).prepend($_border_html);
        });

        $( ".socialCircle-center" ).socialCircle({
            rotate: 79,
            radius: 170,
            circleSize: 4,
            speed:300
        });

        $_body.on("keyup","input.date-picker",function(e){
            var $_this = $(this);
            if($(this).val() == '') {
                $_this.parents('.form-group').find(".day").text('');
            }
        });
        $_body.on("click","form .book-now", function(e) {
            var $_form = $(this).parents("form");
            var _fields = $_form.find("input[data-error-message],select[data-error-message]");
            var _is_html5 = false;
            $.each(_fields, function (i, field) {
                if(typeof field.willValidate !== 'undefined') {
                    _is_html5 = true;
                    return true;
                } else {
                    if($(field).data('error-message') != undefined && $(field).val() == '') {
                        alert($(field).data('error-message'));
                        e.preventDefault();
                        return false;
                    }
                }
            });
            if(!_is_html5)
                $_form.submit();
        });
        function updateLocalTime() {
            var $_widget = $('.widget-area');
            if($_widget.length > 0){
                var UTC_hours = new Date().getUTCHours();
                var UTC_min = new Date().getUTCMinutes();
                var IST_hours = UTC_hours + 5;
                var IST_minutes = UTC_min + 30;
                if(IST_minutes >= 60){
                    IST_hours += 1;
                    IST_minutes = IST_minutes - 60;
                }
                var ampm = IST_hours >= 12 ? 'PM' : 'AM';
                IST_hours = IST_hours % 12;
                IST_hours = IST_hours ? IST_hours : 12; // the hour '0' should be '12'
                IST_minutes = IST_minutes < 10 ? '0'+IST_minutes : IST_minutes;
                var IST_final_time = IST_hours + ':' + IST_minutes + ' ' + ampm;
                $_widget.find(".current-time").html(IST_final_time);
            }
        }

        updateLocalTime();
        setInterval(updateLocalTime, 60000);

        if(!$_body.is('.description-page')) {
            var $_body = $('body');
            var $_header = $_body.find("header");
            $(window).bind('scroll', function () {
                if ($(window).width() > 766) {
                    var _window_cal_height = Math.max(0, $(window).height() - 703),
                        _video_cal_height = Math.max(0, $('video').height() - 703);
                    //_total_cal = (_window_cal_height > 0 ? _window_cal_height : 100) + (_video_cal_height > 0 ? _video_cal_height : 100);
                    var _total_cal = _window_cal_height + _video_cal_height + 20;
                    if (_total_cal > 0) {
                        if ($(window).scrollTop() > _total_cal) {
                            if ($('body,header').is(".vr-menu") && !$('body').is(".transition")) {
                                $_body.addClass("transition");
                                $_body.removeClass("transition-bottom");
                                $_body.find("#nav").css("margin-top", "0");
                                $_body.addClass("transition-top");
                                $_body.delay(1000).queue(function (next) {
                                    var $_this = $(this);
                                    if ($(window).scrollTop() > _total_cal) {
                                        if ($.ocean.options.auto_play_pause) {
                                            if ($(vid).length > 0) {
                                                vid.pause();
                                                pauseButton.classList.remove("pause");
                                                pauseButton.classList.add("play");
                                            }
                                        }
                                        $.ocean.addHrMenu($_this);
                                    } else {
                                        if ($.ocean.options.auto_play_pause) {
                                            if ($(vid).length > 0) {
                                                vid.play();
                                                pauseButton.classList.remove("play");
                                                pauseButton.classList.add("pause");
                                            }
                                        }
                                        $.ocean.addVrMenu($_this);
                                    }
                                    next();
                                });
                            }
                        } else if ($(window).scrollTop() <= _total_cal) {
                            if ($('body,header').is(".hr-menu") && !$('body').is(".transition")) {
                                $_body.addClass("transition");
                                $_body.removeClass("transition-bottom");
                                $_body.addClass("transition-top");
                                $_body.delay(1000).queue(function (next) {
                                    var $_this = $(this);
                                    if ($(window).scrollTop() <= _total_cal) {
                                        $_header.find(".border").addClass("frame-border");
                                        if ($.ocean.options.auto_play_pause) {
                                            if ($(vid).length > 0) {
                                                vid.play();
                                                pauseButton.classList.remove("play");
                                                pauseButton.classList.add("pause");
                                            }
                                        }
                                        $.ocean.addVrMenu($_this);
                                    } else {
                                        if ($.ocean.options.auto_play_pause) {
                                            if ($(vid).length > 0) {
                                                vid.pause();
                                                pauseButton.classList.remove("pause");
                                                pauseButton.classList.add("play");
                                            }
                                        }
                                        $.ocean.addHrMenu($_this);
                                    }
                                    next();
                                });
                            }
                        }
                    } else {
                        $_body.find("#nav").css("margin-top", "0");
                    }
                }
                else {
                    $_body.find("#nav").css("margin-top", "0");
                }
            });

            $(document).delay(1000).queue(function (next) {
                $_body.addClass("transition-bottom");
            });
        }

        $('#sign_in_btn').on("click",function(){
            if($(this).is(".disabled"))
                return;
            $(this).addClass("disabled");
            if($.ocean.validate([$('#login_input_password'),$('#login_input_username')])){
                $.ocean.login();
            } else
                $(this).removeClass("disabled");
        });

        $_body.find('.language-select').change(function () {
            var _language = $(this).val();
            if(_language != '') {
                $.cookie('language', _language, {path: '/'});
                location.reload();
            }
        });

        var $_widget_details = $_body.find(".widget-area .widget-icon");
        $_widget_details.find("[data-toggle='tooltip']").tooltip();

        var $_footer_details = $_body.find(".footer_area .social_icons");
        $_footer_details.find("[data-toggle='tooltip']").tooltip();

        if($.cookie('language')){
            var _language = $.cookie('language');
            if(_language != '') {
                $_body.find('.language-select').val(_language);
                $_body.attr("data-language",_language);
            }
    }
        $_body.find(".location-link").click(function () {
            var $_this = $(this);
            if ($_this.parents(".widget-area").is(".show-location-map"))
                $_this.parents(".widget-area").removeClass("show-location-map");
            else
                $_this.parents(".widget-area").addClass("show-location-map");
        });

        $_body.find(".contact-us").click(function () {
            var $_this = $(this);
            if ($_this.parents(".widget-area").is(".show-location-map"))
                $_this.parents(".widget-area").removeClass("show-location-map");
        });

        $('.r-villas').on('click', function () {
            $('#home_one').animate({
                scrollTop: $(".os-villas-title-wrap").offset().top - 50
            }, 1000);
        });

        $('.r-rooms').on('click', function () {
            $('#home_one').animate({
                scrollTop: $("#ocean-rooms").offset().top - 50
            }, 1000);
        });

        var $_page_down_arrow = $('.page-down-arrow').on('click', function () {
            $(pauseButton).click();
            $('#home_one').animate({
                scrollTop: $(".welcome-area").offset().top - 50
            }, 1000, function(){
                $_page_down_arrow.fadeOut();
            });
        });

        //SCROLL FUNCTION
        // hide #back-top first
        var $_back_top = $("#back-top").hide();

        // fade in #back-top
        $(window).scroll(function () {
            var $_this = $(this);
            var _top = $_this.scrollTop();
            if($(window).width() > 768) {
                if (_top == 0)
                    $_page_down_arrow.show().css("opacity", 1);
                else if (_top > 0 && _top < 300)
                    $_page_down_arrow.show().css("opacity", (300 - _top) / 300);
                else
                    $_page_down_arrow.fadeOut();
            }
            if (_top > 100)
                $_back_top.fadeIn();
            else
                $_back_top.fadeOut();
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

            $('.show-date-picker').click(function () {
                $(this).find('.date-picker:text').click();
                return false;
            });

            $_body.click(function (e) {
                var $_booking_section = $_body.find(".booking-section");
                if($_booking_section.find('.picker-container:visible').length > 0 && $_booking_section.is('.selected')){
                    $_booking_section.removeClass("selected");
                }
                if ($(window).width() < 766) {
                    if ($(e.target).parents(".hotel_booking_area.mobile-device").length == 0) {
                        $(".hotel_booking_area.mobile-device").slideUp();
                    }
                }
            });

            var $_widget_icon = $_body.find('.widget-icon');
            $_widget_icon.find('.socialCircle-item').css('display','none');
            setTimeout(function () {
                $(".page-down-arrow .down-arrow").fadeIn(4000);
                $(".alert-success").fadeOut(2000);
            }, 1000);

            $_body.find(".date-picker:text").click(function () {
                var $_this = $(this);
                $_this.parents('.booking-section').click();
            });
            $_body.find(".room-pax").click(function () {
                var $_this = $(this);
                var $_booking_section = $(this).closest('.booking-section');
                if ($_this.parents(".hotel_booking_area").is(".show-room-pax")) {
                    $_this.parents(".hotel_booking_area").removeClass("show-room-pax");
                    $_booking_section.removeClass("selected");
                }else {
                    $_this.parents(".hotel_booking_area").addClass("show-room-pax");
                    $_booking_section.addClass("selected");
                }
            });
            $_body.find(".fullwidth_home_banner .book-now").click(function () {
                $_body.find(".hotel_booking_area.mobile-device").slideToggle();
                return false;
            });


            $_room_pax_widget.on("change", ".select-room", function (e) {
                var _room_length = $_room_pax_widget.find("li").length, _select_room_val = Number($(e.target).val());
                $_room_pax_widget.parent().find("#NoOfRoom").val(_select_room_val);
                _select_room_val > _room_length ? ($.ocean.renderTemplate(_select_room_val, _room_length, $_room_pax_widget), $_room_pax_widget.parent().find("#Room1").show()) : $.ocean.clearTemplate(_select_room_val, _room_length);
            });

            $_room_pax_widget.on("change", ".alterAdult", function (e) {
                var _length = 4, i, _id = this.id.split("_")[1], _value = Number(this.value), $_element = $_room_pax_widget.find("select#Childs_" + _id), _element_val = $_element.val(), _children_length = $_element.children().length - 1;
                i = _value + _children_length;
                if (_value > 1 && i > _length) {
                    var l = i - _length;
                    for (var c = 0; c < l; c++) {
                        $_element.find('option[value="' + String(_children_length) + '"]').remove();
                        var h = $(this).parents("li.rooms").find("#ageChild" + _children_length);
                        $(h).remove(), _children_length--;
                    }
                    _element_val > _children_length && $_element.val(String($_element.find("option").length - 1));
                } else {
                    var p = _length - i;
                    for (var d = 0; d < p; d++) $_element.append('<option value="' + String(_children_length + 1) + '">' + (_children_length + 1) + "</option>"), _children_length++;
                }
            });

            $_room_pax_widget.on("change", ".alterChild", function (e) {
                var _value = Number(this.value), _id = this.id.split("_")[1], $_element = $_room_pax_widget.parent().find("#Age_" + _id).find(".row").find("select"), _length = $_element.length, u = _length + 1;
                if (_value < _length) {
                    var a = _length - _value;
                    for (var f = 0; f < a; f++) {
                        var l = $(this).parents("li.rooms").find("#ageChild" + _length);
                        $(l).parent().find("small.ugly").remove(), $(l).remove(), _length--;
                    }
                } else {
                    var a = _value - _length, c = {
                        ref: _id,
                        childAge: []
                    };
                    for (var f = 0; f < a; f++) c.childAge.push({
                        roomId: u
                    }), u++;
                    var $_html = '';
                    $.each(c.childAge, function (i, _room) {
                        if(_id == 1) {
                            $_html += '<div class="vertical col-lg-4 col-md-4 col-sm-4 col-xs-12" id="ageChild' + _room.roomId + '">' +
                                '<dt><label for="Childrens">Child ' + _room.roomId + '</label></dt>' +
                                '<dd>' +
                                '<select class="ageChild' + _room.roomId + ' childAge required span span24" title="Child age" etitle="Child age" size="1" name="ca1" tabindex="8"><option value="0">Age</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option></select>' +
                                '</dd>' +
                                '</div>';
                        } else {
                            $_html += '<div class="vertical col-lg-4 col-md-4 col-sm-4 col-xs-12" id="ageChild' + _room.roomId + '">' +
                                '<dd>' +
                                '<select class="ageChild' + _room.roomId + ' childAge required span span24" title="Child age" etitle="Child age" size="1" name="ca1" tabindex="8"><option value="0">Age</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option></select>' +
                                '</dd>' +
                                '</div>';
                        }
                    });
                    $_room_pax_widget.parent().find("#Age_" + _id).find(".row").append($_html), $_room_pax_widget.parent().find("#Age_" + _id).show();
                }
            });


            $_room_pax_widget_fotter.on("change", ".select-room", function (e) {
                var _room_length = $_room_pax_widget_fotter.find("li").length, _select_room_val = Number($(e.target).val());
                $_room_pax_widget_fotter.parent().find("#NoOfRoom").val(_select_room_val);
                _select_room_val > _room_length ? ($.ocean.renderTemplate(_select_room_val, _room_length, $_room_pax_widget_fotter), $_room_pax_widget_fotter.parent().find("#Room1").show()) : $.ocean.clearTemplate(_select_room_val, _room_length);
            });

            $_room_pax_widget_fotter.on("change", ".alterAdult", function (e) {
                var _length = 4, i, _id = this.id.split("_")[1], _value = Number(this.value), $_element = $_room_pax_widget_fotter.find("select#Childs_" + _id), _element_val = $_element.val(), _children_length = $_element.children().length - 1;
                i = _value + _children_length;
                if (_value > 1 && i > _length) {
                    var l = i - _length;
                    for (var c = 0; c < l; c++) {
                        $_element.find('option[value="' + String(_children_length) + '"]').remove();
                        var h = $(this).parents("li.rooms").find("#ageChild" + _children_length);
                        $(h).remove(), _children_length--;
                    }
                    _element_val > _children_length && $_element.val(String($_element.find("option").length - 1));
                } else {
                    var p = _length - i;
                    for (var d = 0; d < p; d++) $_element.append('<option value="' + String(_children_length + 1) + '">' + (_children_length + 1) + "</option>"), _children_length++;
                }
            });

            $_room_pax_widget_fotter.on("change", ".alterChild", function (e) {
                var _value = Number(this.value), _id = this.id.split("_")[1], $_element = $_room_pax_widget_fotter.parent().find("#Age_" + _id).find(".row").find("select"), _length = $_element.length, u = _length + 1;
                if (_value < _length) {
                    var a = _length - _value;
                    for (var f = 0; f < a; f++) {
                        var l = $(this).parents("li.rooms").find("#ageChild" + _length);
                        $(l).parent().find("small.ugly").remove(), $(l).remove(), _length--;
                    }
                } else {
                    var a = _value - _length, c = {
                        ref: _id,
                        childAge: []
                    };
                    for (var f = 0; f < a; f++) c.childAge.push({
                        roomId: u
                    }), u++;
                    var $_html = '';
                    $.each(c.childAge, function (i, _room) {
                        if(_id == 1) {
                            $_html += '<div class="vertical col-lg-4 col-md-4 col-sm-4 col-xs-12" id="ageChild' + _room.roomId + '">' +
                                '<dt><label for="Childrens">Child ' + _room.roomId + ' </label></dt>' +
                                '<dd>' +
                                '<select class="ageChild' + _room.roomId + ' childAge required span span24" title="Child age" etitle="Child age" size="1" name="ca1" tabindex="8"><option value="0">Age</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option></select>' +
                                '</dd>' +
                                '</div>';
                        } else {
                            $_html += '<div class="vertical col-lg-4 col-md-4 col-sm-4 col-xs-12" id="ageChild' + _room.roomId + '">' +
                                '<dd>' +
                                '<select class="ageChild' + _room.roomId + ' childAge required span span24" title="Child age" etitle="Child age" size="1" name="ca1" tabindex="8"><option value="0">Age</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option></select>' +
                                '</dd>' +
                                '</div>';
                        }
                    });
                    $_room_pax_widget_fotter.parent().find("#Age_" + _id).find(".row").append($_html), $_room_pax_widget_fotter.parent().find("#Age_" + _id).show();
                }
            });

            $(window).resize(function(){
                var location = $_body.find(".widget-icon .call-link .call");
                if($(window).width() < 768){
                    var vid = document.getElementById("bgvid");
                    if(vid) {
                        var pauseButton = document.querySelector(".video-controls .play-pause-ctr");
                        vid.pause();
                        pauseButton.classList.remove("pause");
                    }
                    //slider view in mobile device
                    $(".fullwidth_home_banner").parent(".fullwidthbanner-container").css("overflow","visible");
                    location.attr('href','tel:+91-413-2650000');
                } else
                    $(".fullwidth_home_banner").parent(".fullwidthbanner-container").css("overflow","hidden");
                    if ($(window).width() > 768) {
                        location.attr('href', 'contact');
                    }
            });

            if( $_body.is('.index-page')) {
                var vid = document.getElementById("bgvid");
                var pauseButton = document.querySelector(".video-controls .play-pause-ctr");
                var soundButton = document.querySelector(".video-controls .sound");

                vid.addEventListener('ended', function () {
                    vid.pause();
                });

                vid.muted = true;
                soundButton.addEventListener("click", function () {
                    //vid.classList.toggle("stopfade");
                    if (vid.muted) {
                        vid.muted = false;
                        soundButton.classList.remove("off");
                        soundButton.classList.add("on");
                    } else {
                        vid.muted = true;
                        soundButton.classList.remove("on");
                        soundButton.classList.add("off");
                    }
                });

                pauseButton.addEventListener("click", function (event, is_auto_pause) {
                    if (vid.paused) {
                        vid.play();
                        $.ocean.options.auto_play_pause = true;
                        pauseButton.classList.remove("play");
                        pauseButton.classList.add("pause");
                    } else {
                        vid.pause();
                        $.ocean.options.auto_play_pause = false;
                        pauseButton.classList.remove("pause");
                        pauseButton.classList.add("play");
                    }
                });
            }

        $(document).on("click",function(e) {
            var $trigger = $(".widget-area .location-map");
            var $location_link = $(".location-link");
            if($trigger !== e.target && !$location_link.has(e.target).length && !$trigger.has(e.target).length){
                $(".widget-area").removeClass("show-location-map");
            }
        });

        var $_announcement = $(".announcement-block");
        $_announcement.find(".close").click(function(e){
            $_announcement.slideUp();
        });

    },
    validMsg: function(field) {
        // whether checking html5 support is there in browser
        if(typeof field.willValidate !== 'undefined') {
            field.setCustomValidity(field.value == '' ? $(field).data('error-message') : '');
        } else {
            alert(msg);
            return false;
        }
    },
    login: function() {
        var $_login_button = $("#sign_in_btn").hide();
        var $_sign_in_btn = $('#sign_in_btn');
        if($.ocean._validate()) {
            $.ajax({
                url: PROJ_URL+"login",
                type: "post",
                data: {
                    username: $("#login_input_username").val(),
                    password: $("#login_input_password").val(),
                },
                dataType: "json",
                success: function(data){
                    if(data && data.error == undefined )
                    {
                        if(data.is_superadmin) {
                            top.location.href = PROJ_URL;
                        }
                    }
                    else if(data && data.error)
                    {
                        if(data.error != undefined)
                            $.ocean.loginError(data);
                    }
                    $_sign_in_btn.removeClass("disabled");
                    $_login_button.show();
                },
                error: function() {
                    $_sign_in_btn.removeClass("disabled");
                    $_login_button.show();
                }
            });
        } else {
            $_sign_in_btn.removeClass("disabled");
            $_login_button.show();
            $.ocean.clearLoginErrors();
        }
    },
    validate:function(inputElements){
        var _error = true;
        var regExpression ={
            "username":/(^[a-zA-Z0-9\\._]{6,}$)|(^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/,
            "password":/^.{6,}$/,
            "email":/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        };
        $.each(inputElements,function(index,value){
            var rootEle = inputElements[index];
            var _data_type = rootEle.attr('data-type');
            if(_data_type) {
                //element should have data type
                if (!regExpression[_data_type]) {
                    return false;
                }
                if (!regExpression[_data_type].test(rootEle.val())) {
                    _error = false;
                    rootEle.focus().parent().removeClass('correct error').addClass('error').find('.error-message').html(rootEle.attr('data-text')).show();
                } else {
                    rootEle.parent().removeClass('correct error').addClass('correct').find('.error-message').html('').hide();
                }
            }
        });
        return _error;
    },
    _validate: function() {
        var o = $.ocean.options;
        $.ocean.clearErrors();

        var $_username = $("#login_input_username");
        var $_password = $("#login_input_password");
        if($_username.val() == "" || $_username.val().length <= 4 || !/^[a-zA-Z0-9@._-]+$/.test($_username.val()))
            $.ocean.showError($_username, "Please enter a valid email or username.");

        if($_password.val() == "")
            $.ocean.showError($_password, "Password cannot be empty.");
        else if($_password.val().length <= 5)
            $.ocean.showError($_password, "Password cannot be this short.");

        if(o._error)
            return false;

        return true;
    },
    clearLoginErrors : function(){
        $('#login_page').find('.error').removeClass('correct error').children('.error-message').text('');
    },
    loginError: function(data) {
        var login_error = data.error.login;
        if(typeof login_error == "string")
            $.ocean.showError($("#login_input_username"), login_error);
        else if($.isPlainObject(login_error) && login_error.username != undefined)
            $.ocean.showError($("#login_input_username"), login_error.username);
        else if($.isPlainObject(login_error) && login_error.password != undefined)
            $.ocean.showError($("#login_input_password"), login_error.password);
        $.ocean.clearLoginErrors();
        $("#login_input_username").focus().parent().removeClass('correct error').addClass('error').find('.error-message').html("Invalid username or password").show();
        $("#login_input_password").val("");

    },
    showError: function($_input, message) {
        var o = $.ocean.options;
        o._error = true;
        $_input.addClass("error").siblings(".input-error").show().html(message);
    },
    clearErrors: function() {
        var o = $.ocean.options;
        o._error = false;

        $("#login_form").find(".input").removeClass("error");
    },
    addHrMenu: function($_this) {
        $_this.removeClass("transition-top");
        $_this.find("header").addClass('hr-menu').removeClass("vr-menu");
        $_this.addClass('hr-menu').removeClass("vr-menu");
        $_this.addClass("transition-bottom");
        $_this.removeClass("transition");
    },
    addVrMenu: function($_this) {
        $_this.removeClass("transition-top");
        if ($(window).width() > 766 && $(window).width() < 1135)
            $_this.find("#nav").css("margin-top", "87px");
        else
            $_this.find("#nav").css("margin-top", "102px");

        $_this.find("header").removeClass('hr-menu').addClass("vr-menu");
        $_this.removeClass('hr-menu').addClass("vr-menu");
        $_this.addClass("transition-bottom");
        $_this.removeClass("transition");
    },
    renderTemplate: function (_select_room_val, _room_length, $_room_pax_widget) {
        var _add_list_value = _select_room_val - _room_length, s = {
            roomWid: []
        };
        for (var o = 0; o < _add_list_value; o++) s.roomWid.push({
            roomId: _room_length + 1
        }), _room_length++;
        var $_html = '';
        $.each(s.roomWid, function (i, _room) {
            $_html += '<li class="room_' + _room.roomId + ' rooms" ><section class="row selection-panel">' +
                '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-12">' +
                '<dl class="vertical roomNo">' +
                '<dd></dd>' +
                '</dl>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">' +
                '<dl class="vertical">' +
                '<dd style="text-align:right;">' +
                '<span id="Room_' + _room.roomId + '">Room ' + _room.roomId + ':</span>' +
                '</dd>' +
                '</dl>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">' +
                '<dl class="vertical">' +
                '<dd>' +
                '<select size="1" id="adult_' + _room.roomId + '" title="Number of adults" class="span span20 renderAdult alterAdult" tabindex="6"><option value="1">1</option><option value="2" selected="true">2</option><option value="3">3</option><option value="4">4</option>' +
                '</select>' +
                '</dd>' +
                '</dl>' +
                '</div>' +
                '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">' +
                '<dl class="vertical">' +
                '</dt>' +
                '<dd>' +
                '<select size="1" id="Childs_' + _room.roomId + '" title="Number of children" class="span span20 alterChild" tabindex="7"><option value="0" selected="true">0</option><option value="1">1</option>' +
                '<option value="2">2</option><option value="3">3</option></select>' +
                '</dd>' +
                '</dl>' +
                '</div>' +
                '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">' +
                '<div id="Age_'+ _room.roomId +'" class="row" style="">' +
                '<div class="row">' +
                '</div>' +
                '</div>' +
                '</section></li>';
        });
        $_room_pax_widget.find("ul").append($_html);
    },
    clearTemplate: function (_select_room_val, _room_length) {
        var $_room_pax_widget = $(".room-pax-widget");
        for (var r = _room_length - 1; r >= _select_room_val; r--) {
            $_room_pax_widget.find("li")[r].remove();
        }
    }
};
$(document).ready(function () {
    $.ocean.init();
    $(window).resize();
});