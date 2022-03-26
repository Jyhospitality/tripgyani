
(function ($) {
	/* "YYYY-MM[-DD]" => Date */
	function strToDate(str) {
		try {
			/*var array = str.split('-');
			var year = parseInt(array[0]);
			var month = parseInt(array[1]);
			var day = array.length > 2? parseInt(array[2]): 1 ;
			if (year > 0 && month >= 0) {
				return new Date(year, month - 1, day);
			} else {
				return null;
			}*/

			var array = str.split(' ');
			var year = parseInt(array[0]);
			var month = parseInt(array[1]);
			var day = array.length > 2? parseInt(array[2]): 1 ;
			if (year > 0 && month >= 0) {
				return new Date(year, month - 1, day);
			} else {
				return null;
			}

		} catch (err) {}; // just throw any illegal format
	};

	/* Date => "YYYY-MM-DD" */
	function dateToStr(d) {
		/* fix month zero base */
		var year = d.getFullYear();
		var month = d.getMonth();
		return year + " " + (month + 1) + " " + d.getDate();
	};

	/* Date => "MM YYYY" */
	function monthToStr(d) {
		var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
			"JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
		/* fix month zero base */
		var year = d.getFullYear();
		var month = d.getMonth();
		return monthNames[month] + " " + year;
	};

	function dayToStr(d) {
		var day_names = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
		return  day_names[d.getDay()];
	}
	function customDateToStr(d) {
		var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		var year = d.getFullYear();
		var month = d.getMonth();
		return  d.getDate()+ " " +monthNames[month] + " " + year;
		//return year + "-" + (month + 1) + "-" + d.getDate();
	}

	$.fn.calendar = function (options) {
		var _this = this;
		var opts = $.extend({}, $.fn.calendar.defaults, options);
		var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var tHead = week.map(function (day) {
			return "<th>" + day + "</th>";
		}).join("");

		_this.init = function () {
			var tpl = '<table class="cal">' +
			'<caption>' +
			'	<span class="prev"><a href="javascript:void(0);">&larr;</a></span>' +
			'	<span class="next"><a href="javascript:void(0);">&rarr;</a></span>' +
			'	<span class="month"><span>' +
			"</caption>" +
			"<thead><tr>" +
			tHead +
			"</tr></thead>" +
			"<tbody>" +
			"</tbody>" + "</table>";
			var html = $(tpl);
			_this.append(html);
		};

		function daysInMonth(d) {
			var newDate = new Date(d);
			newDate.setMonth(newDate.getMonth() + 1);
			newDate.setDate(0);
			return newDate.getDate();
		}

		_this.update = function (date) {
			var mDate = new Date(date);
			mDate.setDate(1); /* start of the month */
			var day = mDate.getDay(); /* value 0~6: 0 -- Sunday, 6 -- Saturday */
			mDate.setDate(mDate.getDate() - day); /* now mDate is the start day of the table */
			var checkInDate = _this.data('checkInDate');

			function dateToTag(d) {
				var tag = $('<td><a href="javascript:void(0);"></a></td>');
				var a = tag.find('a');
				var cDate = new Date();
				cDate.setDate(cDate.getDate()-1);
				a.text(d.getDate());
				a.data('date', dateToStr(d));
				a.data('datestr', customDateToStr(d));
				a.data('daystr', dayToStr(d));
				if (date.getMonth() != d.getMonth()) { // the bounday month
					tag.addClass('off');
				} else if (_this.data('date') == a.data('date')) { // the select day
					tag.addClass('active');
					_this.data('date', dateToStr(d));
				}
				if( d <= cDate) {
					tag.addClass('off');
				}
				if(checkInDate != '' && checkInDate != undefined) {
					if( d <= checkInDate) {
						tag.addClass('off');
					}
				}
				return tag;
			};

			var tBody = _this.find('tbody');
			tBody.empty(); /* clear previous first */
			var cols = Math.ceil((day + daysInMonth(date))/7);
			for (var i = 0; i < cols; i++) {
				var tr = $('<tr></tr>');
				for (var j = 0; j < 7; j++, mDate.setDate(mDate.getDate() + 1)) {
					tr.append(dateToTag(mDate));
				}
				tBody.append(tr);
			}

			/* set month head */
			var monthStr = dateToStr(date).replace(/-\d+$/, '');
			_this.find('.month').text(monthToStr(date)).data("date",monthStr);
		};

		_this.getCurrentDate = function () {
			return _this.data('date');
		};

		_this.getCustomCurrentDate = function () {
			return _this.data('datestr');
		};
		_this.getCustomDay = function () {
			return _this.data('daystr');
		};
		_this.init();
		/* in date picker mode, and input date is empty,
		 * should not update 'data-date' field (no selected).
		 */
		var initDate = opts.date? opts.date: new Date();
		if (opts.date || !opts.picker) {
			_this.data('date', dateToStr(initDate));
		}
		_this.update(initDate);

		/* event binding */
		_this.delegate('tbody td', 'click', function (e, data) {
			var $this = $(this);
			_this.find('.active').removeClass('active');
			$this.addClass('active');
			_this.data('date', $this.find('a').data('date'));
			_this.data('datestr', $this.find('a').data('datestr'));
			_this.data('daystr', $this.find('a').data('daystr'));
			/* if the 'off' tag become selected, switch to that month */
			if ($this.hasClass('off')) {
				_this.update(strToDate(_this.data('date')));
			}
			var $_checkout = $("#checkOut");
			var $_checkin = $("#checkIn");
			if(_this.siblings().is("#checkOut") && _this.data('checkInDate') != undefined && !$this.is(".active-click")
			&& data == "checkOutDateChange") {
				var lastDay = new Date(_this.data('checkInDate').getFullYear(), _this.data('checkInDate').getMonth() + 1, 0);
				_this.update(_this.data('checkInDate'));
				if(lastDay.getTime() == _this.data('checkInDate').getTime())
					updateTable(1);
				/*var $next_elm = $("#checkOut").siblings(".picker-container").find("tbody td:not(.off)").first();
				$next_elm.addClass("active-click");
				$next_elm.trigger("click", "checkOutEmpty");*/
				return false;
			}
			if(_this.siblings().is("#footerCheckOut") && _this.data('checkInDate') != undefined && !$this.is(".active-click")
				&& data == "checkOutDateChange") {
				var lastDay = new Date(_this.data('checkInDate').getFullYear(), _this.data('checkInDate').getMonth() + 1, 0);
				_this.update(_this.data('checkInDate'));
				if(lastDay.getTime() == _this.data('checkInDate').getTime())
					updateTable(1);
				/*var $next_elm = $("#footerCheckOut").siblings(".picker-container").find("tbody td:not(.off)").first();
				$next_elm.addClass("active-click");
				$next_elm.trigger("click","checkOutEmpty");*/
				return false;
			}
			if(_this.siblings().is("#checkIn")) {
				$_checkout.siblings(".picker-container").data("checkInDate", strToDate(_this.data('date')));
				$_checkout.siblings(".picker-container").find("tbody td").trigger("click", "checkOutDateChange");
			}
			if(_this.siblings().is("#footerCheckIn")) {
				$("#footerCheckOut").siblings(".picker-container").data("checkInDate", strToDate(_this.data('date')));
				$("#footerCheckOut").siblings(".picker-container").find("tbody td").trigger("click", "checkOutDateChange");
			}

			if (opts.picker) {  /* in picker mode, when date selected, panel hide */
				_this.hide();
				if(opts.callbacks){
					if(opts.callbacks.hidden && $.isFunction(opts.callbacks.hidden)){
						opts.callbacks.hidden(_this);
					}
				}
			}
			setTimeout(function () {
				if(_this.siblings().is("#checkIn")) {
					if($_checkout.val() != ''){
						var checkout_timestamp = new Date($_checkout.val()).getTime();
						var checkin_timestamp = new Date($_checkin.val()).getTime();
						if(checkin_timestamp > checkout_timestamp){
							$_checkout.val('');
						}
					}
				}
			}, 100);
		});

		function updateTable(monthOffset) {
			var date = strToDate(_this.find('.month').data("date"));
			date.setMonth(date.getMonth() + monthOffset);
			_this.update(date);
		};

		_this.find('.next').click(function () {
			updateTable(1);

		});

		_this.find('.prev').click(function () {
			updateTable(-1);
		});

		return this;
	};

	$.fn.calendar.defaults = {
		date: new Date(),
		picker: false,
	};

	$.fn.datePicker = function (callback) {
		var _this = this;
		var _callbacks = $.extend({}, $.fn.datePicker.callBacks, callback);
		var picker = $('<div></div>')
			.addClass('picker-container')
			.hide()
			.calendar({'date': strToDate(_this.val()), 'picker': true, 'callbacks': _callbacks});

		_this.after(picker);

		/* event binding */
		// click outside area, make calendar disappear
		$('body').click(function () {
			var $_visible_calenders = picker.filter(":visible").hide();
			if(_callbacks.hidden && $.isFunction(_callbacks.hidden)){
				_callbacks.hidden($_visible_calenders);
			}
		});

		// click input should make calendar appear
		_this.click(function () {
			$(".picker-container").hide();
			picker.show();
			if(_callbacks.shown && $.isFunction(_callbacks.shown)){
				_callbacks.shown(picker);
			}
			return false; // stop sending event to docment
		});

		// click on calender, update input
		picker.click(function () {
			_this.val(picker.getCustomCurrentDate());
			_this.parents(".show-date-picker").find(".day").text(picker.getCustomDay())
			return false;
		});

		return this;
	};

	$.fn.datePicker.callBacks = {
		shown : function(){

		},
		hidden: function(){

		}
	};

	$(window).load(function () {
		$('.jquery-calendar').each(function () {
			$(this).calendar();
		});
		$('.date-picker:text').each(function () {
			var options = {
				shown: function(picker){
					picker.parents('.booking-section').addClass('selected');
				},
				hidden: function(picker){
					picker.parents('.booking-section').removeClass('selected');
				}
			};
			$(this).datePicker(options);
		});
		//$("#checkIn").siblings(".picker-container").find("tbody td:not(.off)").first().click();
		//$("#footerCheckIn").siblings(".picker-container").find("tbody td:not(.off)").first().click();
	});
}($));
