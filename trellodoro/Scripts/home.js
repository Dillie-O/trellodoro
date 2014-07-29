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
		$("#card-status-box").hide();
		
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
		addSticker($("#currentCard").attr("data-cardid"));
	});

	$('#button-cancel-card').bind('click', function() {
		$('#card-modal').foundation('reveal', 'close');
	});

	$('#button-create-card').bind('click', function() {
		var listId = $("#newCardListSelect option:selected").val();
		var cardName = $("#newCardName").val();
		var myId = $('#trelloLegend').attr('data-memberid');

		Trello.post("cards/",
			{ idList: listId, name: cardName, idMembers: myId },
			function (result) {
				$("#newCardName").val('');
				$("#card-status-box").show(300).delay(800).fadeOut(400);
			});
	});
	
	$('#button-create-launch-card').bind('click', function () {
		var listId = $("#newCardListSelect option:selected").val();
		var cardName = $("#newCardName").val();
		var myId = $('#trelloLegend').attr('data-memberid');

		Trello.post("cards/",
			{ idList: listId, name: cardName, idMembers: myId },
			function (result) {
				$("#currentCard").text($("#newCardName").val());
				$("#currentCard").attr("data-cardid", result.id);
				$("#newCardName").val('');				
				$('#clock-modal').foundation('reveal', 'open');
			});
	});
	
	// Wire up Trello functionality
	var onAuthorize = function () {
		updateLoggedIn();

		Trello.members.get("me", function (member) {
			$('#trelloLegend').text("Trello (Logged in as " + member.fullName + ")");
			$('#trelloLegend').attr("data-memberid", member.id);
			buildBoardList();
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

	$("#button-refresh-cards").click(buildBoardList);

	$("#cardSelect").change(function() {
		var cardName = $("#cardSelect option:selected").text();
		var cardId = $("#cardSelect option:selected").val();

		$("#currentCard").attr("data-cardid", cardId);
		$("#currentCard").text(cardName);
	});
	
	$("#boardSelect").change(function () {
		var boardId = $("#boardSelect option:selected").val();
		
		$('#cardSelect').empty();
		
		// Append "Select a card" for functionality.
		$('#cardSelect').append('<option value="-99">Select a card...</option>');
		
		Trello.get("boards/" + boardId + "/cards",
			function (cards) {
				
				// Build select list with card details.
				$.each(cards, function (ix, card) {
					$('#cardSelect').append('<option value="' + card.id + '">' + card.name + '</option>');
				});
			});		

		$('#cardSelect').show();
	});
	
	$("#newCardBoardSelect").change(function () {
		var boardId = $("#newCardBoardSelect option:selected").val();

		$('#newCardListSelect').empty();

		// Append "Select a list" for functionality.
		$('#newCardListSelect').append('<option value="-99">Select a list...</option>');

		Trello.get("boards/" + boardId + "/lists",
			function (cards) {

				// Build select list with card details.
				$.each(cards, function (ix, list) {
					$('#newCardListSelect').append('<option value="' + list.id + '">' + list.name + '</option>');
				});
			});

		$('#newCardListSelect').show();
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
	
	function buildBoardList() {
		var firstBoard = true;

		Trello.get("members/me/boards", function (boards) {
			$('#cardSelect').empty();
			$('#boardSelect').empty();
			$('#newCardBoardSelect').empty();
			$('#newCardListSelect').empty();

			// Build select list with board details.
			$.each(boards, function (ix, board) {
				// Build multi-dimensional array of cards based on board name and then
				// sort alphabetically.
				if (firstBoard) {
					$('#boardSelect').append('<option value="-99">Select a board...</option>');
					$('#newCardBoardSelect').append('<option value="-99">Select a board...</option>');
					$('#cardSelect').append('<option value="-99">Select a card...</option>');
					firstBoard = false;
				}
				
				$('#boardSelect').append('<option value="' + board.id + '">' + board.name + '</option>');
				$('#newCardBoardSelect').append('<option value="' + board.id + '">' + board.name + '</option>');
			});
		});
	}
});