function Orchard()
	{
	var startPos = [Player.X(),Player.Y()]
	var groupPos = 
		[
			[startPos[0]-15,startPos[1]-15],
			[startPos[0]+15,startPos[1]-15],
			[startPos[0]+15,startPos[1]+15],
			[startPos[0]-15,startPos[1]+15]
		]
	var alltrees = Orion.FindTypeEx('0x0D01', 'any', ground, '', 24);
	if(Orion.ObjAtLayer('Mount'))
		Orion.UseObject(self);
	Orion.CharPrint(self, 1159, 'Target your pet')
	Orion.WaitForAddObject('myPet');
	var pet = Orion.FindObject('myPet');
	Orion.Say('all follow me');
	var knownArr = [];
	Orion.Wait(1100);
	for(var i=0;i<groupPos.length;i++)
		{
		Orion.UseObject(pet.Serial());
		Orion.Wait(1100);
		if(Orion.WalkTo(groupPos[i][0],groupPos[i][1],0,0))
			Orion.Wait(10);
		else
			Orion.WalkTo(groupPos[i][0]+1,groupPos[i][1],0,0);
		Orion.UseObject(self);
		Orion.Wait(1100);
		Orion.Say('all follow me');
		Orion.SetSearchArea(Player.X()-10,Player.Y()-10,Player.X()+10,Player.Y()+10);
		var trees = Orion.FindTypeEx('0x0D01', 'any', ground, '', 24);
		Orion.ResetSearchArea();	
		trees.forEach(function(part)
					{
					Orion.WalkTo(part.X(),part.Y());
					Orion.UseObject(part.Serial());
					Orion.Wait(500);
					var apple = Orion.FindTypeEx('0x09D0', 'any', backpack)[0];
					Orion.Wait(500);
					var check = apple.Properties().match(/Enchanted Apple Of ([a-zA-Z]*)/);
					knownArr.push(check[1]);
					knownArr.push(part.Serial());
					knownArr.push(part.X());
					knownArr.push(part.Y());
					while(Orion.FindTypeEx('0x09D0').length)
						{
						Orion.Wait(1100);
						Orion.DragItem(apple.Serial());
						Orion.DropDraggedItem(pet.Serial());
						}
					Orion.Wait(200);
					Orion.Say('all follow me');
					});
		}	
	Orion.UseObject(pet.Serial());
	Orion.Wait(1100);
	alltrees.sort(function(a,b)
				{
				return a.Distance() - b.Distance();
				});
	while(alltrees.length)
		{
		var tree = alltrees.shift();
		Orion.WalkTo(tree.X(),tree.Y());
		Orion.UseObject(tree.Serial());
		Orion.Wait(1100);
		var apple = Orion.FindTypeEx('0x09D0', 'any', backpack);
		while(apple.length)
			{
			var check = apple[0].Properties().match(/Enchanted Apple Of ([a-zA-Z]*)/);
			var match;
			switch(check[1])
				{
				case 'Compassion':
					match = 'Despise';
					break;
				case 'Despise':
					match = 'Compassion';
					break;
				case 'Honor':
					match = 'Shame';
					break;
				case 'Shame':
					match = 'Honor';
					break;
				case 'Honesty':
					match = 'Deceit';
					break;
				case 'Deceit':
					match = 'Honesty';
					break;
				case 'Humility':
					match = 'Pride';
					break;
				case 'Pride':
					match = 'Humility';
					break;
				case 'Justice':
					match = 'Wrong';
					break;
				case 'Wrong':
					match = 'Justice';
					break;
				case 'Sacrifice':
					match = 'Covetous';
					break;
				case 'Covetous':
					match = 'Sacrifice';
					break;
				case 'Spirituality':
					match = 'Hythloth';
					break;
				case 'Hythloth':
					match = 'Spirituality';
					break;	
				case 'Valor':
					match = 'Destard';
					break;	
				case 'Destard':
					match = 'Valor';
					break;		
				}
			var targetInd = knownArr.indexOf(match);
			if(Orion.GetDistance(knownArr[targetInd + 2],knownArr[targetInd + 3]) > 15)
				OrchardAway(knownArr[targetInd + 2],knownArr[targetInd + 3], 13);
			Orion.UseObject(apple[0].Serial());
			Orion.WaitForTarget(1000);
			Orion.TargetObject(knownArr[targetInd + 1]);
			Orion.Wait(1100);
			apple = Orion.FindTypeEx('0x09D0', 'any', backpack);
			}
		}
	}

function testtestaway()
	{
	TestStayAway(Player.X(),Player.Y(), 5)
	}

function TestStayAway(x,y, distance)
	{
	Orion.ClearFakeMapObjects();
 	var tiles =
   	Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
     	.filter(function (tile) 
     		{
       		return BorderEdge(x, y, tile, distance) && Orion.GetPathArray(tile.X(),tile.Y(),256,0).length > 0;
     		})
     	.sort(function (t1, t2) 
     		{
       		return Orion.GetDistance(t1.X(), t1.Y()) - Orion.GetDistance(t2.X(), t2.Y());
     		});
     tiles.forEach(function(tile) 
      			{
      			var i = String(tile.X()) + String(tile.Y());
           		Orion.AddFakeMapObject(i, '0x051A', 2, tile.X(), tile.Y(), tile.Z());
				});
 	var closest = tiles.shift();
 	Orion.WalkTo(closest.X(), closest.Y(), closest.Z(), 0, 255, 1, 1, 30000);
	}

function BorderEdge(x, y, p2, range) 
	{
  	return (x == (p2.X() - range))
    	|| (x == (p2.X() + range))
    	|| (y == (p2.Y() - range))
    	|| (y == (p2.Y() + range));
	}

function OrchardAway(x,y, distance) 
	{
 	var nonotiles = ['0x3EEF','0x3FCA','0x3FCB','0x3FCC','0x3FCD','0x3FCE','0x3FCF']
 	var tiles =
   	Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
     	.filter(function (tile) 
     		{
       		return BorderEdge(x, y, tile, distance) && nonotiles.indexOf(tile.Graphic()) == -1;
     		})
     	.sort(function (t1, t2) 
     		{
       		return Orion.GetDistance(t1.X(), t1.Y()) - Orion.GetDistance(t2.X(), t2.Y())
     		});
 	var closest = tiles.shift()
 	Orion.Print(closest.Graphic());
 	Orion.WalkTo(closest.X(), closest.Y(), closest.Z(), 1, 255, 1, 1, 30000);
	}

function BorderEdge(x, y, p2, range) 
	{
  	return (x == (p2.X() - range))
    	|| (x == (p2.X() + range))
    	|| (y == (p2.Y() - range))
    	|| (y == (p2.Y() + range));
	}