var cardList = Array();

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

		Trello.members.get("me", function (member) {
			$('#trelloLegend').text("Trello (Logged in as " + member.fullName + ")");
			buildCardList();
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

	$("#btn-refresh-cards").click(buildCardList);

	$("#cardSelect").change(function() {
		var cardName = $("#cardSelect option:selected").text();

		$("#currentCard").text(cardName);
	});
	
	$("#boardSelect").change(function () {
		var boardName = $("#boardSelect option:selected").text();
		cardList[boardName].sort();
		
		$('#cardSelect').empty();
		
		// Append "Select a card" for functionality.
		$('#cardSelect').append('<option value="-99">Select a card...</option>');

		for (var i = 0; i < cardList[boardName].length; i++) {
			$('#cardSelect').append('<option value="' + cardList[boardName][i].id + '">' + cardList[boardName][i].name + '</option>');
		}

		$('#cardSelect').show();
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
	
	function buildCardList() {
		var firstCard = true;

		Trello.get("members/me/cards", function (cards) {
			$('#cardSelect').empty();
			$('#boardSelect').empty();

			cardList = Array();

			// Build select list with card details.
			$.each(cards, function (ix, card) {
				// Build multi-dimensional array of cards based on board name and then
				// sort alphabetically.
				Trello.get("boards/" + card.idBoard, function (board) {
					// Append "Select a Board/Card" items for functionality.
					if (firstCard) {
						$('#boardSelect').append('<option value="-99">Select a board...</option>');
						$('#cardSelect').append('<option value="-99">Select a card...</option>');
						firstCard = false;
					}

					if (Object.keys(cardList).indexOf(board.name) == -1) {
						cardList[board.name] = Array();
						$('#boardSelect').append('<option value="' + board.name + '">' + board.name + '</option>');
					}

					cardList[board.name].push(card);
				});
			});
		});
	}
});