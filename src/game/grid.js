var MOTION_DIST = 3;

GridPanel = function(size, shapeCount) {
	this.width = 0;
	this.height = 0;

	this.score = 0;
	this.highScore = localStorage.getItem("highScore") || 0;

	this.gridSize = size;

	this.selectedCoords = [];
	this.horizontallyMovingShapes = [];
	this.verticallyMovingShapes = [];

	this.animating = false;

	this.matrix = [];
	for (var i = 0; i<this.gridSize; i++) {
		this.matrix[i] = [];
		for (var j = 0; j<this.gridSize; j++) {
			this.matrix[i].push(new Shape(shapeCount));
		}
	}

	this.update = function() {
		var self = this;
		if (this.verticallyMovingShapes.length > 0) {
			_.each(this.verticallyMovingShapes, function(shape) {
				shape.vDistance -= 1;
				if (shape.vDistance <= 0) {
					self.verticallyMovingShapes = _.without(self.verticallyMovingShapes, shape);
				}
			});
		} else if (this.horizontallyMovingShapes.length > 0) {
			_.each(this.horizontallyMovingShapes, function(shape) {
				shape.hDistance -= 1;
				if (shape.hDistance <= 0) {
					self.horizontallyMovingShapes = _.without(self.horizontallyMovingShapes, shape);
				}
			});
		} else {
			this.animating = false;
		}
	};

	this.setSize = function(width, height) {
		this.width = width;
		this.height = height;

		// mathings
		this.sqsize = Math.min(this.width, this.height);
		this.hOffset = (this.width - this.sqsize) / 2;
		this.vOffset = (this.height - this.sqsize) / 2;

		this.gWidth = this.sqsize / this.gridSize;
	};

	this.render = function(context) {
		// background
		context.fillStyle = "#222222";
		context.fillRect(0, 0, this.width, this.height);

		// grid background
		context.fillStyle = "#111111";
		context.fillRect(this.hOffset, this.vOffset, this.sqsize, this.sqsize);

		// shapes
		var list = localStorage.getItem("useShapes") != "false" ? TILES.SHAPES : TILES.COLORS;
		for (var index=0; index<5; index++) {
			list.setup(context, index);
			for (var i=0; i<this.gridSize; i++) {
				for (var j=0; j<this.gridSize; j++) {
					var tile = this.matrix[i][j];
					if (tile && tile.index == index) {
						var xAdj = tile.hDistance / MOTION_DIST * this.gWidth;
						var yAdj = tile.vDistance / MOTION_DIST * this.gWidth;
						tile.render(context, this.hOffset + i*this.gWidth - xAdj, this.vOffset + j*this.gWidth - yAdj, this.gWidth, list);
					}
				}
			}
		}

		// grid lines
		context.strokeStyle = "#333333";
		context.lineWidth = Math.max(this.gWidth / 24, 1);
		for (var i=0; i <= this.gridSize; i++) {
			context.drawLine(this.hOffset + i * this.gWidth, this.vOffset,
				this.hOffset + i * this.gWidth, this.vOffset + this.sqsize);
			context.drawLine(this.hOffset, this.vOffset + i * this.gWidth,
				this.hOffset + this.sqsize, this.vOffset + i * this.gWidth);
		}

		// highlighting
		context.strokeStyle = "#FFFFFF";
		context.lineWidth *= 3;
		context.lineJoin = "round";
		var self = this;
		_.each(this.selectedCoords, function(coord) {
			if (!self.coordIsSelected(coord[0] - 1, coord[1])) {
				context.drawLine(self.hOffset + coord[0]*self.gWidth, self.vOffset + coord[1]*self.gWidth,
					self.hOffset + coord[0]*self.gWidth, self.vOffset + coord[1]*self.gWidth + self.gWidth);
			}
			if (!self.coordIsSelected(coord[0] + 1, coord[1])) {
				context.drawLine(self.hOffset + coord[0]*self.gWidth + self.gWidth, self.vOffset + coord[1]*self.gWidth,
					self.hOffset + coord[0]*self.gWidth + self.gWidth, self.vOffset + coord[1]*self.gWidth + self.gWidth);
			}
			if (!self.coordIsSelected(coord[0], coord[1] - 1)) {
				context.drawLine(self.hOffset + coord[0]*self.gWidth, self.vOffset + coord[1]*self.gWidth,
					self.hOffset + coord[0]*self.gWidth + self.gWidth, self.vOffset + coord[1]*self.gWidth);
			}
			if (!self.coordIsSelected(coord[0], coord[1] + 1)) {
				context.drawLine(self.hOffset + coord[0]*self.gWidth, self.vOffset + coord[1]*self.gWidth + self.gWidth,
					self.hOffset + coord[0]*self.gWidth + self.gWidth, self.vOffset + coord[1]*self.gWidth + self.gWidth);
			}
		});
	};

	this.addPoints = function(n) {
		this.score += n*(n-1);
		if (this.score > this.highScore) {
			localStorage.setItem("highScore", this.highScore = this.score);
		}
	};

	this.coordIsSelected = function(x, y) {
		var found = false;
		for (var index in this.selectedCoords) {
			if (this.selectedCoords[index][0] == x && this.selectedCoords[index][1] == y) {
				found = true;
				break;
			}
		}
		return found;
	};

	this.selectCoord = function(x, y, index) {
		var tile = x >= 0 && x < this.gridSize &&
			y >= 0 && y < this.gridSize &&
			this.matrix[x][y];
		if (tile && (!this.coordIsSelected(x,y)) &&
			((typeof index == "undefined") || tile.index == index)) {
			this.selectedCoords.push([x, y]);
			this.selectCoord(x-1, y, tile.index);
			this.selectCoord(x+1, y, tile.index);
			this.selectCoord(x, y-1, tile.index);
			this.selectCoord(x, y+1, tile.index);
		}
	};

	this.wipeSelected = function() {
		this.addPoints(this.selectedCoords.length);
		var self = this;
		_.each(this.selectedCoords, function (coord) {
			self.matrix[coord[0]][coord[1]] = null;
		});
		this.selectedCoords = [];

		this.fallBlocks();
	};

	this.fallBlocks = function() {
		for (var i=0; i<this.gridSize; i++) {
			for (var j=this.gridSize-1; j>0; j--) {
				for (var l=0; l<j && this.matrix[i][j] == null; l++) {
					for (var k=j; k>0; k--) {
						this.matrix[i][k] = this.matrix[i][k-1];
						this.matrix[i][k-1] = null;

						if (this.matrix[i][k] != null) {
							this.matrix[i][k].vDistance += MOTION_DIST;
							this.verticallyMovingShapes.push(this.matrix[i][k]);
							this.animating = true;
						}
					}
				}
			}
		}

		for (var i = this.gridSize - 1; i>0; i--) {
			for (var j = 0; j<i && this.matrix[i][this.gridSize - 1] == null; j++) {
				for (var k = i; k>0; k--) {
					var temp = this.matrix[k];
					this.matrix[k] = this.matrix[k-1];
					this.matrix[k-1] = temp;

					for (var l = this.gridSize - 1; l>=0; l--) {
						if (this.matrix[k][l] != null) {
							this.matrix[k][l].hDistance += MOTION_DIST;
							this.horizontallyMovingShapes.push(this.matrix[k][l]);
							this.animating = true;
						}
					}
				}
			}
		}

		this.verticallyMovingShapes = _.uniq(this.verticallyMovingShapes);
		this.horizontallyMovingShapes = _.uniq(this.horizontallyMovingShapes);
	};

	this.handleClick = function(x, y) {
		if (!this.animating) {
			var ax = Math.floor((x - this.hOffset) / this.gWidth);
			var ay = Math.floor((y - this.vOffset) / this.gWidth);

			if (0 <= ax && ax < this.gridSize && 0 <= ay && ay < this.gridSize) {
				if (this.coordIsSelected(ax,ay)) {
					this.wipeSelected();
				} else {
					this.selectedCoords = [];
					this.selectCoord(ax, ay);
				}
			} else {
				this.selectedCoords = [];
			}

			if (this.selectedCoords.length == 1) {
				this.selectedCoords = [];
			}
		}
	};
};
