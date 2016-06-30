var Player = function (props)
{
	var props = {
		x: props.getProp('x', 0),
		y: props.getProp('y', 0),
		playerTick: props.getProp('playerTick', 100),
		speed: parseFloat(props.getProp('speed', 0.1).toFixed(2))
	};
	this.coords = {
		x: props.x,
		y: props.y
	};
	this.keys = {
		87: false, // W
		65: false, // A
		83: false, // S
		68: false  // D
	};

	// collides()
	// Returns true if player collides with a block.
	this.collides = function (x, y)
	{
		var blocks = BVGE().getClass('Map').getBlocks('block'),
			block,
			px = x.movePointBy(2)/2,
			py = y.movePointBy(2)/2,
			pw = BVGE().getPlayer().offsetWidth,
			ph = BVGE().getPlayer().offsetHeight,
			bx, by;

		for (var i = blocks.length - 1; i >= 0; i--)
		{
			block = blocks[i];
			// 14 (half a player) / 50 = 0.28 => half a player is 0.28 in game
			bx = (block.x - 0.28).movePointBy(2)/2 + pw/2;
			by = (block.y - 1 + 0.28).movePointBy(2)/2 + ph/2;

			if (px < bx + 50 &&
					px + pw > bx &&
					py < by + 50 &&
					py + ph > by)
			    return true;
		}

		return false;
	};


	BVGE.onload(function()
	{
		var move = function (e)
		{
			var keyCode = e.keyCode || e.which;

			// If pressed a key (keydown), keys[keyCode] will be true
			// else false
			this.keys[keyCode] = 
				e.type == 'keydown';

			BVGE().getClass('Events').event('playermove');
		}.bind(this);


		// Every tick check for key press
		setInterval(function()
		{
			var x = this.coords.x, y = this.coords.y;

			var pY = (this.coords.y.movePointBy(2) 
					+ props.speed.movePointBy(2)) / 100,
				mY = (this.coords.y.movePointBy(2) 
					- props.speed.movePointBy(2)) / 100,
				pX = (this.coords.x.movePointBy(2) 
					+ props.speed.movePointBy(2)) / 100,
				mX = (this.coords.x.movePointBy(2) 
					- props.speed.movePointBy(2)) / 100;

			if (!windowFocus)
				this.keys[87] = this.keys[83] = this.keys[65] = this.keys[68] = false;

			// W
			if (this.keys[87] 
					&& !this.keys[83]
					&& !this.collides(this.coords.x, pY))
				this.coords.y = pY;
			// S
			if (this.keys[83] 
					&& !this.keys[87]
					&& !this.collides(this.coords.x, mY))
				this.coords.y = mY;

			// A
			if (this.keys[65] 
					&& !this.keys[68]
					&& !this.collides(mX, this.coords.y))
				this.coords.x = mX;
			// D
			if (this.keys[68] 
					&& !this.keys[65]
					&& !this.collides(pX, this.coords.y))
				this.coords.x = pX;

			BVGE().sel('#coords').innerHTML =
				'x: '
				+ this.coords.x
				+ ', y: '
				+ this.coords.y


			if (x != this.coords.x || y != this.coords.y)
			{
				var map = BVGE().getClass('Map'),
					blocks = map.getBlocks(),
					opacities = map.getOpacities(),
					d = map.renderDistance,
					squareDist = d + d - 1,
					i,
					coords = BVGE().getClass('Player').coords,
					blocksXY = {},
					b,
					blocksXYSet = [];

				playerX = parseInt(coords.x.toFixed(0));
				playerY = parseInt(coords.y.toFixed(0));

				for (i = blocks.length - 1; i >= 0; i--)
				{
					b = blocks[i];
					blocksXY[b.x + '^' + b.y] = b;
				}

				for (i=0; i < opacities.length; i++)
				{
					var x = i%squareDist - d + 1 + playerX,
						y = (squareDist - (i-i%squareDist)/squareDist - 1) - d + 1 + playerY;
					
					if (blocksXY.contains(x + '^' + y))
					{
						b = blocksXY[x + '^' + y];
						blocksXYSet.push(x + '^' + y);
						b.opacity = opacities[i] ? opacities[i] : 0.07;
					}
				}

				for (bl in blocksXY)
				{
					b = blocksXY[bl];
					if (!blocksXYSet.contains(b.x + '^' + b.y))
						b.opacity = 0.1;
					if (b instanceof Block)
						b.render(this.coords.x, this.coords.y);
				}
			}
			/*var blocks = BVGE().getClass('Map').getBlocks();
			for (i = blocks.length - 1; i >= 0; i--)
			{
				blocks[i].render(this.coords.x, this.coords.y);
			}*/
		}.bind(this), props.playerTick);


		BVGE().getClass('Events').on(['keydown', 'keyup'], move);
	}.bind(this));
};