var Map = function (props)
{
	// Current map to work with
	// [floor, blocks]
	this.map = [];
	
	// Current blocks in game.
	this.blocks = {
		floor: [],
		block: []
	};
	
	// Path of textures (images) for blocks
	this.texturesPath = props.getProp('texturesPath', 'img/textures/');
	
	// Textures for blocks themselves
	this.textures = props.getProp('textures', {
		a: ['#123', 'a.png'],
		g: ['green']
	});

	// Render distance for player sight
	this.renderDistance = props.getProp('renderDistance', 5);
	
	// getTexturesPath() -> String
	// Returns current textures path.
	this.getTexturesPath = function ()
	{
		return this.texturesPath;
	};
	
	// getTextures() -> Object
	// Returns current textures.
	this.getTextures = function ()
	{
		return this.textures;
	};

	// getRenderDistance() -> Number
	// Returns current render distance.
	this.getRenderDistance = function ()
	{
		return this.renderDistance;
	};

	// getBlocks(type) -> Array
	// Returns current instances of blocks.
	// type: type of block.
	this.getBlocks = function (type)
	{
		if (type) return this.blocks[type];
		var bs = this.blocks,
			floors = bs.floor,
			blocks = bs.block;

		// Join floors and blocks together
		return floors.concat(blocks);
	};
	
	// createBlock(x, y, texture) -> Map
	// Creates a custom block.
	// x: x coordinate.
	// y: y coordinate.
	// bgColor: background colod.
	// texture: path of the texture.
	// type: type of block.
	this.createBlock = function (x, y, bgColor, texture, type)
	{
		if (!this.blocks.hasOwnProperty(type))
			return this;

		this.blocks[type].push(
			new Block({
				x:x,
				y:y,
				bgColor: bgColor,
				texture:texture,
				type:type,
				opacity: 0.07
			}).render(BVGE().getClass('Player').coords.x, BVGE().getClass('Player').coords.y)
		);

		return this;
	};

	// getBlockById(id) -> Block
	// Returns a block by id.
	// id: Number, id of block.
	this.getBlockById = function (id)
	{
		var blocks = this.getBlocks(),
			block;
		for (var i = blocks.length - 1; i >= 0; i--)
		{
			var b = blocks[i];
			if (b.id == id)
				block = b;
		}

		return block;
	};
	
	// renderLayer() -> Map
	// Renders current layer.
	// layer: layer name.
	// blockType: type of block.
	// xOffset: x coordinate offset.
	// yOffset: y coordinate offset.
	this.renderLayer = function (layer, blockType, xOffset, yOffset)
	{	
		for (y = 0; y < layer.length; y++)
		{
			var row = layer[y];
			if (row.length == 0) continue;
			
			for (x = 0; x < row.length; x++)
			{
				var char = row[x];
				
				// If this.textures doesn't contain current char (block), skip it
				if (!this.textures.hasOwnProperty(char))
					continue;
				
				var bgColor = this.textures.getProp(char, '')[0],
					texture = this.textures.getProp(char, '')[1];
				
				if (typeof bgColor === 'undefined') bgColor = '';
				if (typeof texture === 'undefined') texture = '';

				this.createBlock(
					(x + xOffset),
					-(y + yOffset), // flip block by y axis
					bgColor,
					texture,
					blockType
				);
			}
		} 

		return this;
	};
	
	// render() -> Map
	// Renders current map.
	// xOffset: x coordinate offset.
	// yOffset: y coordinate offset.
	this.render = function (xOffset, yOffset)
	{
		if (typeof xOffset != 'number' || typeof yOffset != 'number')
			return this;
			
		var floor = this.map[0],
			blocks = this.map[1], x = y = 0;
			
		if (floor.length > 0)
			this.renderLayer(floor, 'floor', xOffset, yOffset);
		if (blocks.length > 0)
			this.renderLayer(blocks, 'block', xOffset, yOffset);
		
		return this;
	};


	// getLineDistance(x1, y1, x2, y2, x0, y0) -> Number
	// Returns distance of point 0 from line between points 1 and 2.
	// x1: x coordinate of point 1.
	// y1: y coordinate of point 1.
	// x2: x coordinate of point 2.
	// y2: y coordinate of point 2.
	// x0: x coordinate of point 0.
	// y0: y coordinate of point 0.
	this.getLineDistance = function (x1, y1, x2, y2, x0, y0)
	{
		if (typeof x1 != 'number'
				|| typeof y1 != 'number'
				|| typeof x2 != 'number'
				|| typeof y2 != 'number'
				|| typeof x0 != 'number'
				|| typeof y2 != 'number')
			return;

		// This is the beauty of math, Watson!
		return (
			Math.abs( (y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1 ) /
			Math.sqrt( Math.pow(y2-y1, 2) + Math.pow(x2-x1, 2) )
		);
	};

	// getOpacities() -> Array
	// A complex function which makes rays to all border block in circle distance 
	//   to detect all obstacles of player sight and then returns array of
	//   opacities based on render distance.
	// Note: Because it is really complex function I decided to make an array of
	//       opacities and then process all blocks based on this array.
	this.getOpacities = function ()
	{
		var opacities = [], // initial opacities array
			d = this.renderDistance,
			c = d-1, // center point, X and Y are same
			pX = parseInt(BVGE().getClass('Player').coords.x.toFixed(0)),
			pY = parseInt(BVGE().getClass('Player').coords.y.toFixed(0)),
			minX, minY,
			maxX, maxY,
			x, y,
			squareSize = d + d - 1,
			blockDist, // distance between center and border block
			i, j,
			blocks = this.getBlocks('block'),
			blocksXY = [],
			rayTolerance = 1;

		for (var i = blocks.length - 1; i >= 0; i--)
			blocksXY.push([blocks[i].x, blocks[i].y]);

		// Fill opacities
		for (var i = squareSize*squareSize - 1; i >= 0; i--)
		{
			opacities.push(0);
		}


		var inRay = function (x1, y1, x2, y2, x0, y0) {
			return this.getLineDistance(x1,y1,x2,y2,x0,y0) <= rayTolerance; }.bind(this),

		existBlockAtXY = function (x, y) {
			var contains = false, itr;
			for (itr=0; itr < blocksXY.length; itr++)
				if (JSON.stringify(blocksXY[itr]) 
						== JSON.stringify([x-d+1 + pX, y-d+1 + pY]))
					contains = true;
			return contains; },

		checkForBlock = function (i, j, x, y)
		{
			var inR = inRay(c, c, i, j, x, y);
			if (inR)
			{
				var dist = squareDistace(x, y);
				opacities[((squareSize-y-1)*squareSize)+(squareSize-x-1)] = parseFloat((1/(dist*dist)).toFixed(1));
				if (existBlockAtXY(x, y))
				{
					return true;
				}
			}
			return false;
		},

		squareDistace = function (i, j)
		{
			var dX = Math.abs(j - d + 1), // delta x
				dY = Math.abs(i - d + 1); // delta y
			return Math.sqrt( // square distance
					Math.pow(dX, 2) + Math.pow(dY, 2) );
		};

		opacities[(c*squareSize)+c] = 1;


		// Go through square distance and make rays pointing from center to border blocks
		for (i = squareSize - 1; i >= 0; i--)
			for (j = squareSize - 1; j >= 0; j--)
			{
				blockDist = squareDistace(i, j);

				if (blockDist < d && blockDist > d-1.5)
				{
					// j is X, i is Y - coords of border block (we join center point with border blocks to make rays)
					if (i < c) // bottom three
					{
						if (j < c)
						{
							outer:
							for (x = c-1; x >= j; x--)
								for (y = c-1; y >= i; y--)
									if (checkForBlock(j, i, x, y)) break outer;
						}
						else if (j == c)
						{
							outer:
							for (y = c-1; y >= i; y--)
								if (checkForBlock(j, i, j, y)) break outer;
						}
						else
						{
							outer:
							for (x = c+1; x < j; x++)
								for (y = c-1; y >= i; y--)
									if (checkForBlock(j, i, x, y)) break outer;
						}
					}
					else if (i == c) // middle two
					{
						if (j < c)
						{
							outer:
							for (x = c-1; x >= j; x--)
								if (checkForBlock(j, i, x, i)) break outer;
						}
						else
						{
							outer:
							for (x = c+1; x < j; x++)
								if (checkForBlock(j, i, x, i)) break outer;
						}
					}
					else // upper three
					{
						if (j < c)
						{
							outer:
							for (x = c-1; x >= j; x--)
								for (y = c+1; y < i; y++)
									if (checkForBlock(j, i, x, y)) break outer;
						}
						else if (j == c)
						{
							outer:
							for (y = c+1; y < i; y++)
								if (checkForBlock(j, i, j, y)) break outer;
						}
						else
						{
							outer:
							for (x = c+1; x < j; x++)
								for (y = c+1; y < i; y++)
									if (checkForBlock(j, i, x, y)) break outer;
						}
					}
				}
				
			}


		var printStr = '';
		for (i=opacities.length - 1; i >= 0; i--)
		{
			printStr += '\t'+opacities[i] + (i%squareSize==0 ? '\n' : '');
		}
		return opacities;
	};

	return this;
};
