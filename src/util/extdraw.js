ExtDraw = {
	apply: function(context) {
		_.extend(context, this);
	},

	drawCenteredImage: function(image, x, y, width, height) {
		this.drawImage(image, x - width/2, y - height/2, width, height);
	},

	drawRotatedImage: function(image, x, y, width, height, angle) {
		if (image) {
			this.translate(x, y);
			this.rotate(angle);
			this.translate(-width/2, -height/2);
			this.drawImage(image, 0, 0, width, height);
			this.translate(width/2, height/2);
			this.rotate(-angle);
			this.translate(-x, -y);
		}
	},

	fillRotatedRect: function(x, y, width, height, angle) {
		this.translate(x, y);
		this.rotate(angle);
		this.translate(-width/2, -height/2);
		this.fillRect(0, 0, width, height);
		this.translate(width/2, height/2);
		this.rotate(-angle);
		this.translate(-x, -y);
	},

	fillCenteredText: function(text, x, y) {
		var width = this.measureText(text).width;
		this.fillText(text, x - width/2, y);
	},

	drawLine: function(x1, y1, x2, y2) {
		this.beginPath();
		this.moveTo(x1, y1);
		this.lineTo(x2, y2);
		this.closePath();
		this.stroke();
	}
};

