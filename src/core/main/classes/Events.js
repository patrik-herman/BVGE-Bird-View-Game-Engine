var Events = function ()
{
	this.customEvents = {
		bvgeload: [],
		playermove: []
	};


	// add(name fn)
	// Adds new event.
	// name: name of event array of event names.
	// fn: event function.
	// el (optional): an element.
	this.on = function (name, fn, el)
	{
		if ((typeof name != 'string' 
					&& !(name instanceof Array)
			) || typeof fn != 'function')
			return this;


		var addE = function (n, f, el)
		{
			el = el || document;

			if (this.customEvents.contains(n))
				this.customEvents[n].push(f);
			else
			{
				if (el.addEventListener)
					el.addEventListener(n, f, false);
				else if (el.attachEvent)
					el.attachEvent('on' + n, f);
				else el['on' + n];
			}
		}.bind(this);

		if (name instanceof Array)
		{
			if (name.length == 0) return this;

			for (var i = name.length - 1; i >= 0; i--)
				addE(name[i], fn, el);
		}
		else
			addE(name, fn, el);

		return this;
	};


	// event(name)
	// Executes functions of custom event.
	// name: name of event.
	// props (optional): arguments for listening 
	//       function to be executed.
	this.event = function (name, props)
	{
		if (!this.customEvents.contains(name))
			return this;

		var fns = this.customEvents[name];
		if (fns.length == 0) return this;

		for (var i = fns.length - 1; i >= 0; i--)
		{
			fns[i](props);
		}
	};
};