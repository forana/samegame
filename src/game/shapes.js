TILES = {
	SHAPES: {
		setup: function(context, index) {
		},
		renderer: function(context, index, x, y, width, height) {
			context.drawImage(this.items[index], x, y, width, height);
		},
		items: [
			ImageCache.get("resources/images/shapes/triangle-128.png"),
			ImageCache.get("resources/images/shapes/square-128.png"),
			ImageCache.get("resources/images/shapes/circle-128.png"),
			ImageCache.get("resources/images/shapes/diamond-128.png"),
			ImageCache.get("resources/images/shapes/hexagon-128.png")
		]
	},
	COLORS: {
		setup: function(context, index) {
			context.fillStyle = this.items[index];
		},
		renderer: function(context, index, x, y, width, height) {
			context.fillRect(x, y, width, height);
		},
		items: [
			"#00CC33",
			"#CC3333",
			"#3366CC",
			"#9933CC",
			"#CCCC33"
		]
	}
};

Shape = function(imageHigh) {
	this.index = Math.floor(Math.random() * imageHigh);
	this.hDistance = 0;
	this.vDistance = 0;

	this.render = function(context, x, y, scale, list) {
		list.renderer(context, this.index, x, y, scale, scale);
	}
};
