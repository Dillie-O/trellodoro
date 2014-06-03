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
	
	// Wire up Trello functionality
	var onAuthorize = function () {
		updateLoggedIn();
		$("#output").empty();

		Trello.members.get("me", function (member) {
			$("#fullName").text(member.fullName);

			var $cards = $("<div>")
				 .text("Loading Cards...")
				 .appendTo("#output");

			// Output a list of all of the cards that the member 
			// is assigned to
			Trello.get("members/me/cards", function (cards) {
				$cards.empty();
				$("<div>").text("Click a card to add a sticker to it").appendTo($cards);

				$.each(cards, function (ix, card) {
					$("<a>")
						.addClass("card")
						.text(card.name)
						.appendTo($cards)
						.click(function() {
							Trello.post("cards/" + card.id + "/stickers", { idSticker: 1 });
						});
				});
			});
		});
	};

	var updateLoggedIn = function () {
		var isLoggedIn = Trello.authorized();
		$("#loggedout").toggle(!isLoggedIn);
		$("#loggedin").toggle(isLoggedIn);
	};

	var logout = function () {
		Trello.deauthorize();
		updateLoggedIn();
	};

	Trello.authorize({
		interactive: false,
		success: onAuthorize
	});

	$("#connectLink")
	.click(function () {
		Trello.authorize({
			type: "popup",
			success: onAuthorize,
			scope: { write: true, read: true }
		})
	});

	$("#disconnect").click(logout);
});