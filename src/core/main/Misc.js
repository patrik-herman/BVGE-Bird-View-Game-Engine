// compressed Mozilla's Function.prototype.bind polyfill.
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// I don't own any of the code that is minified in line below.
Function.prototype.bind=(function(){}).bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}function c(){}var a=[].slice,f=a.call(arguments,1),e=this,d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};

// getProp(name, def) -> property || def
// name: name of property.
// def: default value.
Object.prototype.getProp = function (name, def)
{
	return this.hasOwnProperty(name)
		? this[name]
		: def;
};

// contains(element)
// Returns true if array contains element specified.
// element: an element.
Object.prototype.contains = function (element)
{
	return (this instanceof Array 
		? this 
		: Object.keys(this)
	).indexOf(element) > -1;
};

// multiplyBy(number)
// Returns multiplied number. 
// Because JS and math are not friends.
// number: a value to move point in the number by.
Number.prototype.movePointBy = function (number)
{
	if (number < 0 || number > 20)
		return this;
	
	return parseInt(this.toFixed(number).replace('.', ''));
};

// Window focus state.
var windowFocus = true;
window.onblur = function() { windowFocus = false; }
window.onfocus = function() { windowFocus = true; }
document.onblur = window.onblur;
document.focus = window.focus;
