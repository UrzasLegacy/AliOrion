function TestSpread()
	{
	let a = [5,4,3,2,1];
	let b = ['e','d','c','b','a'];
	let c = [...a,...b]; //concatenate a and b to a shallow copy
	c[0] = false;
	Orion.Print(c);
	Orion.Print(a);
	}
	
function TestRest()
	{
	var a = (...args) => args.forEach(a => Orion.Print(a));
	a(1,2,3,4);
	}

function TestIncludes()
	{
	var a = [1,2];
	Orion.Print(a.includes(1));
	}

function TestTemplateLiteral()
	{
	var name = 'Bob';
	var time = 'today';
	var string = `Hello ${name}, how are you ${time}`;
	Orion.Print(string);
	}

function TestArrayDestructuring()
	{
	const arr = [1,2,3];
	const [a,b,c] = arr;
	Orion.Print(a)
	Orion.Print(b)
	Orion.Print(c)
	}

function TestDefaultParameter()
	{
	var a = (b,c=0) => Orion.Print(b + ':' + c);
	a(1,2);
	a(1);
	}

function TestNullishCoalesce()
	{
	var a = null ?? 'string';
	var b = undefined ?? 'string2';
	var c = false ?? 'string3';
	Orion.Print(a);
	Orion.Print(b);
	Orion.Print(c);
	}

function TestGeneratorFunction()
	{
	const genFunc = function* () {
		Orion.Print('First');
		yield;
		Orion.Print('Second');
		}
	var a = genFunc();
	a.next();
	a.next();
	}
