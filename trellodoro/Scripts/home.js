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
});