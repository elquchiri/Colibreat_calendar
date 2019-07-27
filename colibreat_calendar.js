(function ($) {

	$.fn.colibreat_calendar = function (options) {
		var settings = $.extend({
			date: new Date(),
			dateFormat: "dd/mm/yyyy",
			enabledDates: null,
			todayButton: true,
			/* selectedDates data format
				[
					[
						date object,
						quantity,
						[
							[time_start, time_end],
							...
						]
					],
					...
				]
			*/
			selectedDates: []
		}, options);

		// generate a datepicker id from 1 to 1001
		var datepicker_id = Math.floor(Math.random() * Math.floor(1001));
		// Identify time interval elements
		var time_interval_id = 0;
		var time_interval_array = [];

		var month_full_name     = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juiller", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
		var week_days_full_name = ["lu", "ma", "me", "je", "ve", "sa", "di"];


		var methods = {
			init_week_standard: function (day_number) {
				switch (day_number) {
					case 0:
						return 7;
						break;
					default:
						return day_number;
				}
			},
			formatOutputDate: function () {
				var date  = settings.date;
				var day   = date.getDate();
				var month = date.getMonth() + 1;
				var year  = date.getFullYear();

				switch (settings.dateFormat) {
					case "dd/mm/yyyy":
						return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
						break;
					case "yyyy/mm/dd":
						return year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day);
						break;
					default:
						return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
						break;
				}
			},
			updateNavigationView: function () {
				var select_month = "";
				for(var i=0; i<month_full_name.length; i++)
					select_month += "<option value=\""+ i +"\">"+ month_full_name[i] +"</option>";

				var select_year = "";
				for(var i=settings.date.getFullYear() - 5; i<=settings.date.getFullYear() + 5; i++)
					select_year += "<option value=\""+ i +"\">"+ i +"</option>";

				$('#' + datepicker_id + ' .navigation .select_month_container').find(".colibreat-selectmenu").remove();
				$('#' + datepicker_id + ' .navigation .select_year_container').find(".colibreat-selectmenu").remove();
				$('#' + datepicker_id + ' .navigation .select_month').html(select_month).val(settings.date.getMonth());
				$('#' + datepicker_id + ' .navigation .select_year').html(select_year).val(settings.date.getFullYear());

				// Activate colibreat_selectmenu plugin
				$('.select_month, .select_year').colibreat_selectmenu();

			},
			updateDatepicker: function () {
				var date = settings.date;

				var y         = date.getFullYear();
				var m         = date.getMonth();
				var first_day = this.init_week_standard(new Date(y, m, 1).getDay());
				var lastDay   = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

				var table = "";

				var v = first_day;

				table += "<table><tr><th>lu</th><th>ma</th><th>me</th><th>je</th><th>ve</th><th>sa</th><th>di</th></tr><tr>";
				for (var j = 1; j < parseInt(first_day); j++)
					table += "<td class=\"hidden\"></td>";
				// EnabledDates
					for (var i = 1; i <= lastDay; i++) {
						if (settings.enabledDates == null || settings.enabledDates.includes(i + "/" + (settings.date.getMonth() + 1) + "/" + settings.date.getFullYear())) {
							var td_is_selected = methods.date_exists(new Date(settings.date.getFullYear(), settings.date.getMonth(), i)) != -1 ? "active" : "";
							table += "<td class=\""+ td_is_selected +"\">" + i + "</td>";
						}
						else
							table += "<td class=\"disabled\">" + i + "</td>";
						if (v == 7) {
							table += "</tr><tr>";
							v = 1;
						} else {
							v++;
						}
					}

				table += "</tr></table>";

				$('#' + datepicker_id + ' .datepicker').html(table);
			},
			date_exists: function(checked_date) {
				for(var i=0; i<settings.selectedDates.length; i++) {
					var dayEquals = settings.selectedDates[i][0].getDate() == checked_date.getDate();
					var monthEquals = settings.selectedDates[i][0].getMonth() == checked_date.getMonth();
					var yearEquals = settings.selectedDates[i][0].getFullYear() == checked_date.getFullYear();

					if(dayEquals && monthEquals && yearEquals)
						return i;
				}
				return -1;
			},
			openTimeSelectorModal: function() {
				var selected_date_index = methods.date_exists(new Date(settings.date));
				
				// Reset time_interval_id to restart
				time_interval_id = 0;
				time_interval_array = [];
				// Clear time interval container && cancel-date container
				$('.time_interval_container').empty();
				$('.cancel-date').hide();

				if(selected_date_index == -1) {
					$('.select_quantity').prop('selectedIndex', 0);
					// triger first time interval via click event
					$('.addTimeIntervanButton').trigger("click", [0, 0, 'disabled']);
					// disabled
					$('.addTimeIntervanButton').attr("disabled", true);
					$('.time_interval_container').css({opacity: "0.7"});
				}else{
					var quantity = settings.selectedDates[selected_date_index][1];
					// focus selected quantity
					$('.select_quantity').val(quantity);
					for(var i=0; i<settings.selectedDates[selected_date_index][2].length; i++) {
						var start_time = settings.selectedDates[selected_date_index][2][i][0];
						var end_time = settings.selectedDates[selected_date_index][2][i][1];
						$('.addTimeIntervanButton').trigger("click", [start_time, end_time, '']);
					}
					// Show date cancelation button
					$('.cancel-date').show();
					// Enable time selection
					$('.select_month, .select_year').prop("disabled", false);
				}
				// Open modal
				$('#selectorModal').modal();	
			}
		};


		return this.each(function () {

			var $this       = $(this);
			var elementType = $(this).prop('nodeName');

			var datepicker = "<div class=\"colibreat-datepicker\" id=\"" + datepicker_id + "\">" +
				"<div class=\"navigation\">" +
					"<div class=\"row\">" +
						"<div class=\"col-4 text-left\">" +
							"<button class=\"btn btn-outline-secondary changeDate\" id=\"left\"><i class=\"fas fa-angle-left\"></i></button>" +
						"</div>" +
						"<div class=\"col-4\">" +
							"<div class=\"row\">" +
								"<div class=\"col-7 pr-0 select_month_container\">" +
									"<p class=\"text-muted text-center mb-2\" style=\"font-size: 13px; font-weight: \">Changer le mois</p>" +
									"<select class=\"form-control select_month\"></select>" +
								"</div>" +
								"<div class=\"col-5 select_year_container\">" +
								"<p class=\"text-muted text-center mb-2\" style=\"font-size: 13px; font-weight: \">l'année</p>" +
									"<select class=\"form-control select_year\"></select>" +
								"</div>" +
							"</div>" +
						"</div>" +
						"<div class=\"col-4 text-right\">" +
							"<button class=\"btn btn-outline-secondary changeDate\" id=\"right\"><i class=\"fas fa-angle-right\"></i></button>" +
						"</div>" +
					"</div>" +
				"</div>" +
				"<div class=\"datepicker\">" +

				"</div>" +
				"</div>";
			$this.html(datepicker);

			// Append SelectModal to body one time only
			var quantity_options = "";
			for(var option=1; option<=20; option++)
				quantity_options += "<option value=\""+ option +"\">"+ option +"</option>";


			var selectorModal = "<div class=\"modal fade\" id=\"selectorModal\">" +
									  "<div class=\"modal-dialog modal-sm\">" +
									    "<div class=\"modal-content\">" +

									      "<!-- Modal Header -->" +
									      "<div class=\"modal-header\">" +
									        "<h5 class=\"modal-title\">Disponibilités</h5>" +
									        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>" +
									      "</div>" +

									      "<!-- Modal body -->" +
									        "<ul class=\"list-group list-group-flush\">" +
											  "<li class=\"list-group-item\">" +
											  	"<label class=\"text-muted\">Combien servez-vous ce jour ?</label>" +
											  	"<select class=\"form-control select_quantity\">" +
											  		"<option value=\"0\">Choisissez une quantitée</option>" +
											  		quantity_options +
											  	"</select>" +
											  "</li>" +
											  "<div class=\"time_interval_container\">" +
											  	
											  "</div>" +
											  "<li class=\"list-group-item\"><button class=\"btn btn-outline-secondary btn-sm btn-block addTimeIntervanButton\"><i class=\"fas fa-plus\"></i> Ajouter une plage</button></li>" +
											  "<li class=\"list-group-item cancel-date\" style=\"display: none;\">" +
											  	"<p class=\"text-muted\" style=\"font-size: 14px; color: rgb(174, 174, 174) !important;\">Utilisez ce button pour annuler la séléction de cette date et supprimer ainsi toutes ses plages horaires associés.</p>" +
											  	"<button class=\"btn btn-outline-danger btn-sm btn-block cancel-date-button\"><i class=\"fas fa-minus-square\"></i> Annuler cette date</button>" +
											  "</li>" +
											"</ul>" +

									      "<!-- Modal footer -->" +
									      "<div class=\"modal-footer text-left\">" +
									        "<button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Fermer</button>" +
									      	"<button class=\"btn btn-primary float-left saveTimeInterval\">Enregistrer</button>" +
									      "</div>" +

									    "</div>" +
									  "</div>" +
									"</div>";
			$('body').append(selectorModal);

			// Save TimeInterval && add interval to selectedDates settings
			$('.saveTimeInterval').click(function() {
				var date_to_add = [new Date(settings.date)];
				var validation = true;

				var quantity = $('.select_quantity').val();
				date_to_add.push(quantity);
				if(quantity <= 0)
					validation = false;

				var time_intervals = [];
				for(var i=0; i<time_interval_id; i++) {
					var time_interval = [];
					var start_time = $('#time_interval_' + time_interval_array[i] + ' .start_time').val();
					var end_time = $('#time_interval_' + time_interval_array[i] + ' .end_time').val();

					if(start_time <= 0 || end_time <= 0)
						validation = false;
					time_interval.push(start_time);
					time_interval.push(end_time);
					time_intervals.push(time_interval);
				}
				date_to_add.push(time_intervals);

				// timeInterval Validation tests
				if(validation) {
					if((ind = methods.date_exists(new Date(settings.date))) != -1 )
						settings.selectedDates.splice(ind, 1);
					// Push date_to_add to selectedDates
					settings.selectedDates.push(date_to_add);
					$('#selectorModal').modal("hide");
					methods.updateDatepicker();
				}else{
					alert("Not validate");
				}
			});

			// Add Time Interval
			$('.addTimeIntervanButton').click(function(e, start_time, end_time, disabled_option) {
				var from_time = "";
				for(var i=8; i<24; i++)
					from_time += "<option value=\""+ i +"\">"+ i +" h</option>";
			
				var time_interval = "<li class=\"list-group-item\" id=\"time_interval_"+ time_interval_id+ "\" style=\"position: relative\">" +
										"<div class=\"deleteTimeIntervalButton rounded-circle text-danger\" id=\""+ time_interval_id +"\">&times;</div>" +
										"<div class=\"row\">" +
											"<div class=\"col-6\">" +
												"<label class=\"text-muted\">De:</label>" +
												"<select class=\"form-control start_time\" "+ disabled_option +">" +
												  	"<option value=\"0\">Heure</option>" +
												  	from_time +
												"</select>" +
											"</div>" +
											"<div class=\"col-6\">" +
												"<label class=\"text-muted\">A:</label>" +
												"<select class=\"form-control end_time\" "+ disabled_option +">" +
												  	"<option value=\"0\">Heure</option>" +
												  	from_time +
												"</select>" +
											"</div>" +
										"</div>" +
									"</li>";
				$('.time_interval_container').append(time_interval);
				//
				if(start_time > 0 && end_time > 0) {
					$('#time_interval_' + time_interval_id + ' .start_time').val(start_time);
					$('#time_interval_' + time_interval_id + ' .end_time').val(end_time);
				}

				time_interval_array.push(time_interval_id);
				// Increment time_interval_id
				time_interval_id++;
			});

			// Delete time interval
			$('body').on("click", ".deleteTimeIntervalButton", function(e) {
				var id = $(this).attr("id");
				$(this).remove();
				$('#time_interval_' + id).slideUp(300, function() {
					$(this).remove();
				});

				time_interval_array.splice(id, 1);
				time_interval_id--;
			});

			// Delete date from selectedDates
			$('.cancel-date-button').click(function() {
				if(confirm("Confirmez-vous cette annulation ?")) {
					var date_index = methods.date_exists(new Date(settings.date));
					if(date_index != -1)
						settings.selectedDates.splice(date_index, 1);
					// Update datepicker
					methods.updateDatepicker();
					// Hide modal
					$('#selectorModal').modal("hide");
				}
			});

			// clear quantity's select opacity
			$('.select_quantity').change(function() {
				$('.addTimeIntervanButton').attr("disabled", false);
				$('.time_interval_container').css({opacity: "1"});
				$('.start_time, .end_time').prop("disabled", false);
			});

			// update navigation
			methods.updateNavigationView();
			// update Datepicker
			methods.updateDatepicker();
			


			$('#' + datepicker_id + ' .changeDate').click(function () {
				var action = $(this).attr("id");
				switch (action) {
					case "left":
						if (settings.date.getMonth() == 0) {

							settings.date = new Date(settings.date.getFullYear() - 1, 0, 1);
							settings.date.setMonth(11);
						} else
							settings.date = new Date(settings.date.getFullYear(), settings.date.getMonth() - 1, 1);
						break;
					case "right":
						if (settings.date.getMonth() == 11)
							settings.date = new Date(settings.date.getFullYear() + 1, 0, 1);
						else
							settings.date = new Date(settings.date.getFullYear(), settings.date.getMonth() + 1, 1);
						break;
				}
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

			$('body').on("click", "#" + datepicker_id + " table td:not(.hidden):not(.disabled)", function () {
				var datepicker_date = parseInt($(this).html());
				settings.date.setDate(datepicker_date);

				methods.openTimeSelectorModal();
			});

			$('body').on("selectmenu", '#' + datepicker_id + ' .navigation .select_month', function(e, value, text) {
				var month = value;
				settings.date.setMonth(month);
				// update datepicker
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

			$('body').on("selectmenu", '#' + datepicker_id + ' .navigation .select_year', function(e, value, text) {
				var year = value;
				settings.date.setFullYear(year);
				// update datepicker
				methods.updateDatepicker();
				// update naviation
				methods.updateNavigationView();
			});

		});
	}

})(jQuery);