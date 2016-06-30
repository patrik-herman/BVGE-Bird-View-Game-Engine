var Block = function(props)
{
	// Current block divs in game.
	var blocks = BVGE().getBlocks();
	
	this.id = blocks.length;
	this.x = props.getProp('x');
	this.y = props.getProp('y');
	this.bgColor = props.getProp('bgColor', '#222');
	this.texture = props.getProp('texture');
	this.type = props.getProp('type');
	this.opacity = props.getProp('opacity', 0.07);
	
	// getId() -> Number
	// Returns current block id.
	this.getId = function ()
	{
		return this.id;
	};

	// getX() -> Number
	// Returns current X position.
	this.getX = function ()
	{
		return this.x;
	};
	
	// setX(x) -> Block
	// Sets current X position.
	// x: x position.
	this.setX = function (x)
	{
		if (typeof x != 'number')
			return this;
			
		this.x = x;
		return this;
	};
	
	// getY() -> Number
	// Returns current Y position.
	this.getY = function ()
	{
		return this.y;
	};
	
	// setY(x) -> Block
	// Sets current Y position.
	// y: y position.
	this.setY = function (x)
	{
		if (typeof y != 'number')
			return this;
			
		this.y = y;
		return this;
	};
	
	// getBgColor() -> String
	// Returns current bgColor.
	this.getBgColor = function ()
	{
		return this.bgColor;
	};
	
	// setBgColor(bgColor) -> Block
	// Sets current bgColor.
	// bgColor: background color.
	this.setBgColor = function (bgColor)
	{
		if (typeof bgColor != 'string')
			return this;
			
		this.bgColor = bgColor;
		return this;
	};
	
	// getTexture() -> String
	// Returns current texture.
	this.getTexture = function ()
	{
		return this.texture;
	};
	
	// setTexture(texture) -> Block
	// Sets current texture.
	// texture: block texture.
	this.setTexture = function (texture)
	{
		if (typeof texture != 'string')
			return this;
			
		this.texture = texture;
		return this;
	};
	
	// getType() -> String
	// Returns current block type.
	this.getType = function ()
	{
		return this.type;
	};
	
	// setType(type) -> Block
	// Sets current block type.
	// type: block type.
	this.setType = function (type)
	{
		if (typeof type != 'string')
			return this;
			
		this.type = type;
		return this;
	};
	
	// render(x, y) -> Block
	// Renders current block.
	// x: x coordinate.
	// y: y coordinate;
	this.render = function (x, y)
	{
		var coords = BVGE().getClass('Player').coords;
		if (typeof x != 'number') x = coords.x;
		if (typeof y != 'number') y = coords.y;

		var setB = function (b)
		{
			b.id = this.id;
			b.className = this.type;
			b.style.opacity = this.opacity;
			if (this.bgColor.length > 0)	
				b.style.backgroundColor = this.bgColor;
			
			// .movePointBy(2)/2 multiplies a number by 50 without any problem
			// 14 (half a player) / 50 = 0.28 => half a player is 0.28 in game
			b.style.margin = (-(this.y - y + 0.28).movePointBy(2)/2) 
				+ 'px 0 0 ' 
				+ ((this.x - x - 0.28).movePointBy(2)/2) + 'px';
			
			if (this.texture.length > 0)	
				b.style.backgroundImage = 'url('
					+ BVGE().getClass('Map').getTexturesPath()
					+ this.texture
					+ ')';
			return b;
		}.bind(this);

		var blockElement = BVGE().sel('#bvge #map #blocks div', true)[this.id];
		if (blockElement)
		{
			setB(blockElement);
			return this;
		}

		var block = document.createElement('div');
		block = setB(block);

		BVGE().getBlocksCont().appendChild(block);

		return this;
	};

	return this;
};
