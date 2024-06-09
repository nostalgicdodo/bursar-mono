
function throttle (fn, duration = 1) {
	duration = duration * 1000;
	let timeoutId = null;
	return function throttle (...args) {
		if (timeoutId) {
			return;
		}
		timeoutId = setTimeout(function () {
			timeoutId = null;
		}, duration);
		return fn(...args);
	};
}

module.exports = {
	throttle,
};
