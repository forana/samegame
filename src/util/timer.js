Timer = function(targetFPS) {
	this.msDiff = 1000/targetFPS;
	this.target = Date.now() + this.msDiff;

	this.intervalExceeded = function() {
		var ret = false;
		var now = Date.now();
		if (this.target <= now) {
			this.target = now + this.msDiff;
			ret = true;
		}
		return ret;
	}
};
