var Config = {
	name: 'BVGE example',

	// BVGE classes and its configs.
	classes: {
		Logger: {
			prefix: '[BVGE] '
		},
		Controls: {},
		Player: {
			x: 0.2,
			y: -0.2,
			playerTick: 100,
			speed: 0.2
		},
		Map: {
			texturesPath: 'img/textures/',
			textures: {
				a: ['#123', 'a.png'],
				g: ['green'],
				c: ['#789', 'c.png'],
				d: ['#462d15', 'd.png'],
				r: ['red'],
				y: ['#77777c', 'y.png'],
			},
			renderDistance: 5
		},
		Events: {}
	},

	// initClasses() -> Object
	// Inits all classes with properties set.
	initClasses: function ()
	{
		for (className in this.classes)
		{
			var c = window[className],
				classConfig = this.classes[className]

			if (typeof c != 'function') continue;

			this.classes[className].instance 
				= new c(classConfig);
		}
		
		this.copyClasses();
		
		return this;
	},
	
	// copyClasses()
	// Copies all classes from config to BVGE instance.
	copyClasses: function ()
	{
		BVGE().classes = this.classes;
	}
};
