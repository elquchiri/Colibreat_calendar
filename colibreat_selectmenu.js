(function ($) {


	$.fn.colibreat_selectmenu = function (options) {
		var settings = $.extend({
			selectmenu_size: "md",
			onSelectmenu: null
		}, options);

		var selectmenu_title_size = settings.selectmenu_size == "sm" ? "title-sm" : "title-md";
		var selectmenu_li_size    = settings.selectmenu_size == "sm" ? "li-sm" : "li-md";

		return this.each(function () {

			// generate a datepicker id from 1 to 1001
			var selectmenu_id        = Math.floor(Math.random() * Math.floor(1001));
			// selected option value
			var selectedOption       = $(this).children("option:selected");
			var current_li_id        = null;
			// option innerHTML
			var current_option_text  = selectedOption.html();
			// option value
			var current_option_value = selectedOption.attr("value");
			// current object
			var $this                = $(this);

			var selectmenu = "<div class=\"colibreat-selectmenu\" id=\"" + selectmenu_id + "\">" +
				"<div class=\"title " + selectmenu_title_size + "\"><span></span> <i class=\"fas fa-caret-down float-right\"></i></div>" +
				"<div class=\"menu\">" +
				"<ul>" +
					
				"</ul>" +
				"</div>" +
				"</div>";

			$(this).css({display: "none"});
			$(this).after(selectmenu);

			var selectmenu_title      = $('#' + selectmenu_id + ' .title');
			var selectmenu_title_span = $('#' + selectmenu_id + ' .title span');
			var selectmenu_menu       = $('#' + selectmenu_id + ' .menu');
			var selectmenu_ul         = $('#' + selectmenu_id + ' .menu ul');

			var selectmenu_ul_li_container = "";
			$(this).find("option").each(function () {
				var generated_id = Math.floor(Math.random() * Math.floor(1001));
				var optionText   = $(this).html();
				var optionValue  = $(this).attr("value");
				current_li_id    = current_option_text == optionText && current_li_id == null ? generated_id : current_li_id;
				selectmenu_ul_li_container += "<li class=\"" + selectmenu_li_size + "\" id=\"" + generated_id + "\" value=\"" + optionValue + "\">" + optionText + "</li>";
			}).promise().done(function() {
				selectmenu_ul.html(selectmenu_ul_li_container);
				// append options into select
				selectmenu_title_span.html(current_option_text);
			});


			// selectmenu event to show menu list
			selectmenu_title.click(function () {
				$('#' + selectmenu_id + ' .menu ul li').removeClass("active");
				selectmenu_menu.find("li#" + current_li_id).addClass("active");
				selectmenu_menu.toggle();
			});

			// selectmenu li event to show sel list
			$('#' + selectmenu_id + ' .menu ul li').click(function (e) {
				current_li_id        = $(this).attr("id");
				current_option_text  = $(this).html();
				current_option_value = $(this).attr("value");

				selectmenu_title_span.html(current_option_text);
				selectmenu_menu.hide();

				// change original select current value
				$this.val(current_option_value);
				// Trigger selectmenuChange event
				$this.trigger("selectmenu", [current_option_value, current_option_text]);
			}).hover(function () {
				$('#' + selectmenu_id + ' .menu ul li').removeClass("active");
			});                                                                                                      

		});

	}

})(jQuery);