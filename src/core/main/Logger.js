// Logger.js
// Simple console logging functions.
var Logger = function (properties)
{
	this.prefix = properties.prefix;

	// log(s) -> Logger
	// console.log function.
	this.log = function (s)
	{
		console.log(this.prefix + s);
		return this;
	};

	// warn(s) -> Logger
	// console.warn function.
	this.warn = function (s)
	{
		console.warn(this.prefix + s);
		return this;
	};

	// info(s) -> Logger
	// console.info function.
	this.info = function (s)
	{
		console.info(this.prefix + s);
		return this;
	};

	// error(s, simple) -> Logger
	// console.error function.
	// s: string to print.
	// simple: if true, will be executed console.error,
	//         else will be created Error instance.
	this.error = function (s, simple)
	{
		if (typeof simple != 'boolean')
			return this;


		if (simple)
			console.warn(this.prefix + s);
		else throw new Error(s);

		return this;
	};
}
