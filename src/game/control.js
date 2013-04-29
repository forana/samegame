var Button = function(text) {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.text = text;

	this.setSize = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};

	this.render = function(context) {
		context.fillStyle = "#333333";
		context.fillRect(this.x, this.y, this.width, this.height);

		context.font = Math.floor(this.height / 2) + Constants.FONT;
		context.fillStyle = "#EEEEEE";
		context.fillCenteredText(this.text, this.x + this.width/2, this.y + this.height*2/3);
	};
};

ControlPanel = function() {
	var SHAPES = [];

	this.width = 0;
	this.height = 0;
	this.horizontal = true;

	this.newGameButton = new Button("New Game");
	this.toggleButton = new Button("Shapes?");

	this.buttonsDirty = true;

	this.update = function() {
	};

	this.setSize = function(width, height, horizontal) {
		this.width = width;
		this.height = height;
		this.horizontal = horizontal;

		this.buttonsDirty = true;
	};

	this.render = function(context, width, height, grid) {
		context.fillStyle = "#111111";

		var h24 = this.width / 24;
		var v24 = this.height / 24;

		if (this.horizontal) {
			context.fillRect(width - this.width, 0, this.width, this.height);

			if (this.buttonsDirty) {
				this.newGameButton.setSize(width - this.width + h24, 13*v24, 22*h24, 3*v24);
				this.toggleButton.setSize(width - this.width + h24, 19*v24, 22*h24, 3*v24);
				this.buttonsDirty = false;
			}
		} else {
			context.fillRect(0, height - this.height, this.width, this.height);

			if (this.buttonsDirty) {
				this.newGameButton.setSize(h24, height - 8*v24, 10*h24, 6*v24);
				this.toggleButton.setSize(13*h24, height - 8*v24, 10*h24, 6*v24);
				this.buttonsDirty = false;
			}
		}

		this.newGameButton.render(context);
		this.toggleButton.render(context);

		context.fillStyle = "#EEEEEE";
		context.font = (this.horizontal ? v24 : 3*v24) + Constants.FONT;
		context.fillCenteredText("Score",
			this.horizontal ? width - 12*h24 : 12*h24,
			this.horizontal ? 2*v24 : height - 20*v24);
		context.fillCenteredText(this.horizontal ? "High" :  "High: " + grid.highScore,
			this.horizontal ? width - 12*h24 : 12*h24,
			this.horizontal ? 6*v24 : height - 12*v24);
		context.font = (this.horizontal ? 2*v24 : 6*v24) + Constants.FONT;
		context.fillCenteredText(grid.score,
			this.horizontal ? width - 12*h24 : 12*h24,
			this.horizontal ? 4*v24 : height - 15*v24);
		if (this.horizontal) {
			context.fillCenteredText(grid.highScore,
				width - 12*h24,
				8*v24);
		}
	};

	this.handleClick = function(x, y) {
		if (this.newGameButton.x <= x && x <= this.newGameButton.x + this.newGameButton.width &&
			this.newGameButton.y <= y && y <= this.newGameButton.y + this.newGameButton.height) {
			Game.showNewGameOptions();
		}

		if (this.toggleButton.x <= x && x <= this.toggleButton.x + this.toggleButton.width &&
			this.toggleButton.y <= y && y <= this.toggleButton.y + this.toggleButton.height) {
			localStorage.setItem("useShapes", localStorage.getItem("useShapes") == "true" ? "false" : "true");
		}
	};
};
