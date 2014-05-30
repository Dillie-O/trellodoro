// left padding s with c to a total of n chars
function padding_left(s, c, n) {
	if (!s || !c || s.length >= n) {
		return s;
	}
	var max = (n - s.length) / c.length;
	for (var i = 0; i < max; i++) {
		s = c + s;
	}
	return s;
}

// right padding s with c to a total of n chars
function padding_right(s, c, n) {
	if (!s || !c || s.length >= n) {
		return s;
	}
	var max = (n - s.length) / c.length;
	for (var i = 0; i < max; i++) {
		s += c;
	}
	return s;
}

// Shows/Hides a button.
function ToggleButton(target, isVisible) {
	var button = $('#button-' + target);

	if (isVisible) {
		button.show();
	}
	else {
		button.hide();
	}
}