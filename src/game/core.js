Game = {
	canvas: null,
	context: null,

	gridPanel: null,
	controlPanel: null,

	FPS: 30,

	timer: null,

	start: function() {
		this.canvas = document.createElement(navigator.isCocoonJS ? "screencanvas" : "canvas");

		this.gridPanel = new GridPanel(this.getLastSize(), this.getLastCount());
		this.controlPanel = new ControlPanel();

		this.resizeCanvas();
		var self = this;
		window.addEventListener("resize", function() {
			self.resizeCanvas();
		});

		this.context = this.canvas.getContext("2d");
		ExtDraw.apply(this.context);
		document.body.appendChild(this.canvas);

		this.canvas.addEventListener("mouseup", function(e) {
			var x = e.pageX;
			var y = e.pageY;
			self.delegateClick(x, y);
		});
		this.canvas.addEventListener("touchend", function(e) {
			self.delegateClick(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		});

		this.updateInterval = window.setInterval(function() {
			self.update();
		}, 1000/Game.FPS);

		this.render();
	},

	getLastSize: function() {
		return localStorage.getItem("lastSize") || 10;
	},

	getLastCount: function() {
		return localStorage.getItem("lastCount") || 4;
	},

	resizeCanvas: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		if (this.canvas.width > this.canvas.height) {
			var controlWidth = Math.max(Math.floor(this.canvas.height / 3), Math.floor(this.canvas.width) / 6);
			this.gridPanel.setSize(this.canvas.width - controlWidth, this.canvas.height);
			this.controlPanel.setSize(controlWidth, this.canvas.height, true);
		} else {
			var controlHeight = Math.floor(this.canvas.width / 3);
			this.gridPanel.setSize(this.canvas.width, this.canvas.height - controlHeight);
			this.controlPanel.setSize(this.canvas.width, controlHeight, false);
		}
	},

	delegateClick: function(x, y) {
		if (x < this.gridPanel.width && y < this.gridPanel.height) {
			this.gridPanel.handleClick(x, y);
		} else {
			this.controlPanel.handleClick(x, y);
		}
	},

	showNewGameOptions: function() {
		this.gridPanel = new GridPanel(this.getLastSize(), this.getLastCount());
		this.resizeCanvas();
	},

	update: function() {
		this.gridPanel.update();
		this.controlPanel.update();
	},

	render: function() {
		window.requestAnimationFrame(function () {
			Game.render();
		});

		this.gridPanel.render(this.context);
		this.controlPanel.render(this.context, this.canvas.width, this.canvas.height, this.gridPanel);
	},
};

document.addEventListener("DOMContentLoaded", function() {
	Game.start();
});