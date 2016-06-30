var BVGE = function ()
{
	this.version = '1.0';
	
	this.config = {};
	this.classes = {};
	this.eventListeners = {};


	// setConfig(config) -> BVGE
	// Sets current config in BVGE instance.
	this.setConfig = function (config)
	{
		this.config = config;
		
		// Setting document title depending on config.name
		document.title = this.config.name;
		return this;
	};
	
	// getConfig() -> Object
	// Returns current config in BVGE instance.
	this.getConfig = function ()
	{
		return this.config;
	};


	// addClass(c) -> BVGE
	// Adds new class to BVGE().classList object.
	// c: an object:
	//    {name, instance}
	this.addClass = function (cls)
	{
		if (typeof cls != 'object')
			return this;
		
		for (className in cls)
			this.classes[className] = cls[className];

		return this;
	};


	// getClass(name) -> Object
	// Returns class instance by name.
	// name: name of class instance.
	this.getClass = function (name)
	{
		return this.classes[name].instance;
	};


	// getClasses() -> Array
	// Returns current instances of classes.
	this.getClasses = function ()
	{
		var cls = {};
		for (c in this.classes)
			cls[c] = this.classes[c].instance;
			
		return cls;
	};


	// sel(s, all) -> Node, Array
	// Returns element or an array of elements based on query.
	// s: selector.
	// all: select all occurencies.
	this.sel = function (s, all)
	{
		return all
			? bvge.querySelectorAll(s)
			: bvge.querySelector(s);
	};

	// getControls() -> Node
	// Returns controls element.
	this.getControls = function ()
	{
		return this.sel('#controls');
	};

	// getMap() -> Node
	// Returns map element.
	this.getMap = function ()
	{
		return this.sel('#map');
	};

	// getPlayer() -> Node
	// Returns player element.
	this.getPlayer = function ()
	{
		return this.sel('#map #player');
	};

	// getControls() -> Node
	// Returns entitiy elements.
	this.getEntities = function ()
	{
		return this.sel('#map #entities div', true);
	};
	
	// getBlocksCont() -> Node
	// Returns blocks container.
	this.getBlocksCont = function ()
	{
		return this.sel('#map #blocks');
	};
	// getBlocks() -> Node
	// Returns block elements.
	this.getBlocks = function ()
	{
		return this.sel('#map #blocks div', true);
	};

	return BVGE.getInstance();
};

// Object of maps
BVGE.maps = {};

// addMap(name, nap)
// Adds custom map to BVGE.maps object.
// name: name of map.
// map: Array, map.
BVGE.addMap = function (name, map)
{
	BVGE.maps[name] = map;
	return BVGE;
};

// loadMap(name)
// Loads a map to 'Map' class by name.
// name: name of map.
BVGE.loadMap = function (name)
{
	BVGE().getClass('Map').map = BVGE.maps[name];
	return BVGE();
};


// Array of Objects that will be used for Events#on
BVGE.onevents = [];

// onload(fn)
// Adds event that will be eecuted after BVGE load.
// fn: load function.
BVGE.onload = function (fn)
{
	BVGE.onevents.push({
		name: 'bvgeload',
		fn: fn
	});
};

// loadEvents()
// Executes all event listeners loaded 
// before BVGE initialization.
BVGE.loadEvents = function ()
{
	var onevents = BVGE.onevents,
		instance = BVGE();

	if (onevents.length == 0) return instance;

	for (var i = onevents.length - 1; i >= 0; i--)
	{
		var listener = onevents[i];

		BVGE().getClass('Events').on(listener.name, listener.fn);
	}
};

// BVGE.getInstance() -> Object
// Returns current BVGE instance.
BVGE.getInstance = function ()
{
	return BVGE.instance;
};

// BVGE.init() -> BVGE
// Creates instance of BVGE.
BVGE.init = function ()
{
	BVGE.instance = new BVGE();
	return BVGE.getInstance();
};
