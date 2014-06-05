$(document).ready(function () {
	$('#button-reveal').bind('click', function () {
		$('#clock-modal').foundation('reveal', 'open');
	});

	// Do a little background reset when the modal opening starts to avoid
	// flicker.
	$(document).on('open', '[data-reveal]', function () {
		var timerBox = $('#clock-modal');

		SetDisplayText('Ready');

		timerBox.css('background-image', '');
		timerBox.css('background-color', '#FFFFFF');
	});

	// Hack modal box and time display fill the screen and be centered.
	$(document).on('opened', '[data-reveal]', function () {
		$("#status-box").hide();
		
		ToggleButton('resume', false);
		ToggleButton('pause', false);
		ToggleButton('reset', true);
		ToggleButton('start', true);

		ResetTimer();
	});

	$('#clock-modal').bind('reveal:closed', function () {
		window.clearTimeout(timerId);
	});

	$('#button-start').bind('click', function () {
		StartTimer();
	});

	$('#button-pause').bind('click', function () {
		PauseTimer();
	});

	$('#button-resume').bind('click', function () {
		ResumeTimer();
	});

	$('#button-reset').bind('click', function () {
		ResetTimer();
	});
	
	$('#button-pomodoro').bind('click', function () {
		addSticker($("#cardSelect").val());
	});
	
	// Wire up Trello functionality
	var onAuthorize = function () {
		updateLoggedIn();
		$("#output").empty();

		Trello.members.get("me", function (member) {
			$('#trelloLegend').text("Trello (Logged in as " + member.fullName + ")");

			var $cards = $("<div>")
				 .text("Loading Cards...")
				 .appendTo("#output");

			var firstCard = true;

			Trello.get("members/me/cards", function (cards) {
				$cards.empty();
				$('#cardSelect').empty();
				
				// Build select list with card details.
				$.each(cards, function (ix, card) {
					if (firstCard)
					{
						$("#currentCard").text(card.name);
						firstCard = false;
					}
					
					$('#cardSelect').append('<option value="' + card.id + '">' + card.name + '</option>');
				});
			});
		});
	};

	var updateLoggedIn = function () {
		var isLoggedIn = Trello.authorized();
		$("#loggedout").toggle(!isLoggedIn);
		$("#connectLink").toggle(!isLoggedIn);
		$("#loggedin").toggle(isLoggedIn);
		$("#disconnectLink").toggle(isLoggedIn);
	};

	var logout = function () {
		Trello.deauthorize();
		updateLoggedIn();
		$('#trelloLegend').text("Trello");
	};

	Trello.authorize({
		interactive: false,
		success: onAuthorize
	});

	$("#connectTrello").click(function () {
		Trello.authorize({
			type: "popup",
			name: "Trellodoro",
			success: onAuthorize,
			scope: { write: true, read: true }
		});
	});
	
	$("#connectTrelloButton").click(function () {
		Trello.authorize({
			type: "popup",
			name: "Trellodoro",
			success: onAuthorize,
			scope: { write: true, read: true }
		});
	});

	$("#disconnectTrello").click(logout);

	$("#cardSelect").change(function() {
		var cardName = $("#cardSelect option:selected").text();

		$("#currentCard").text(cardName);
	});
	
	function addSticker(cardId)
	{
		// Offset stickers by 20 pixels to properly see amount.							
		Trello.get("cards/" + cardId + "/stickers",
			function (stickers) {
				var stickerCount = stickers.length;
				var stickerOffSet = 20 * stickerCount;

				Trello.post("cards/" + cardId + "/stickers",
								{ image: "clock", top: 0, left: stickerOffSet, zIndex: 1 },
								function(result) {
									 $("#status-box").show(300).delay(800).fadeOut(400);
								});
		});
	}
});