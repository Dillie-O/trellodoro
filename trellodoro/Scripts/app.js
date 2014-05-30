var timeRemaining;
var timerId;
var currentBackground;
var rotateMinutes;
var alertTimes;

function DoTick() {
	var timerBox = $('#clock-modal');
	var vduration = moment.duration(timeRemaining.asMilliseconds() - 1000, 'milliseconds');
	timeRemaining = vduration;

	var hourPrefix = timeRemaining.hours() > 0 ? timeRemaining.hours() + ':' : '';
	var timeLeft = hourPrefix +
                  padding_left(timeRemaining.minutes() + '', '0', 2) + ':' +
                  padding_left(timeRemaining.seconds() + '', '0', 2);

	SetDisplayText(timeLeft);

	// Rotate image if we're at the proper interval. Ignore for first tick.
	if (timeRemaining.minutes() % rotateMinutes == 0 && timeRemaining.seconds() == 0) {
		RotateBackground();
	}

	// Check to see if an alert sound needs to be made. Check is made when there
	// is less than an hour left.
	if (timeRemaining.hours() == 0 && timeRemaining.seconds() == 0) {
		var alertCheck = $.grep(alertTimes, function (e) { return e.time == timeRemaining.minutes(); });

		if (alertCheck.length > 0) {
			var soundId = alertCheck[0].soundId;
			$('#sound-alert-' + soundId)[0].play();
		}
	}

	if (timeRemaining.hours() == 0 && timeRemaining.minutes() == 0 && timeRemaining.seconds() == 0) {
		window.clearTimeout(timerId);

		var soundId = $('#select-expired-id').val();
		$('#sound-alert-' + soundId)[0].play();

		SetDisplayText('Time!');

		timerBox.css('background-image', '');
		timerBox.css('background-color', 'red');
	}
}

function RotateBackground() {
	var timerBox = $('#clock-modal');
	var collectionId = $('#group_folder_name').val();
	var images = backgrounds[collectionId];
	var randomBackground = 'url(assets/logo.png)';

	if (images.length == 1) {
		randomBackground = 'url(' + images[0] + ')';
	}
	else if (images.length > 1) {
		randomBackground = 'url(' + images[Math.floor(Math.random() * images.length)] + ')';

		// Make sure new random background isn't the same as the current
		while (randomBackground == currentBackground) {
			randomBackground = 'url(' + images[Math.floor(Math.random() * images.length)] + ')';
		}
	}

	currentBackground = randomBackground;
	timerBox.css('background-color', '');
	timerBox.css('background-image', randomBackground);
}

function SetDisplayText(message) {
	var timerDisplay = $('#clock-display');
	var mobileTimerDisplay = $('#clock-display-mobile');

	timerDisplay.text(message);
	mobileTimerDisplay.text(message);
}

function StartTimer() {
	var timerBox = $('#clock-modal');

	ToggleButton('start', false);
	ToggleButton('resume', false);
	ToggleButton('pause', true);
	ToggleButton('reset', true);

	SetDisplayText('Go!');

	window.clearTimeout(timerId);
	timeRemaining = moment.duration({
		seconds: $('#input-seconds').val() != '' ? $('#input-seconds').val() : 0,
		minutes: $('#input-minutes').val() != '' ? $('#input-minutes').val() : 30,
		hours: $('#input-hours').val() != '' ? $('#input-hours').val() : 0
	});

	// Start the clock!
	timerId = setInterval(function () { DoTick(); }, 1000);
}

function PauseTimer() {
	window.clearTimeout(timerId);

	ToggleButton('start', false);
	ToggleButton('pause', false);
	ToggleButton('resume', true);
	ToggleButton('reset', true);
}

function ResumeTimer() {
	timerId = setInterval(function () { DoTick(); }, 1000);

	ToggleButton('start', false);
	ToggleButton('resume', false);
	ToggleButton('pause', true);
	ToggleButton('reset', true);
}

function ResetTimer() {
	var timerBox = $('#clock-modal');

	ToggleButton('resume', false);
	ToggleButton('pause', false);
	ToggleButton('start', true);
	ToggleButton('reset', true);

	RotateBackground();
	SetDisplayText('Ready');

	// Retrieve alert values and configure hash
	alertTimes = [];

	$.each($('#alert-times > tbody > tr'), function (index, value) {
		var time = $(value).find('input').val() + '';
		var sound = $(value).find('select').val();

		if (time != '') {
			alertTimes.push({ time: time, soundId: sound });
		}
	});

	window.clearTimeout(timerId);
	rotateMinutes = $('#input-rotate-minutes').val() != '' ? $('#input-rotate-minutes').val() : $('#input-rotate-minutes').attr('placeholder'),
   timeRemaining = moment.duration({
   	seconds: $('#input-seconds').val() != '' ? $('#input-seconds').val() : $('#input-seconds').attr('placeholder'),
   	minutes: $('#input-minutes').val() != '' ? $('#input-minutes').val() : $('#input-minutes').attr('placeholder'),
   	hours: $('#input-hours').val() != '' ? $('#input-hours').val() : $('#input-hours').attr('placeholder')
   });
}