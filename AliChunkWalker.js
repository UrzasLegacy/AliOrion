function TestWalk()
    {
    Orion.Print(SmartWalkTo(3754,2222))
    }


function testpath()
    {
    var pathTiles = Orion.GetPathArray(3775, 2217, 0, 0);
    Orion.Print(pathTiles.length)
    Orion.ClearFakeMapObjects();
    pathTiles.forEach(function(tile,i)
        {
        Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        })  
    }

function SmartWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,callbackFn)
    {
    if(z === undefined) z = 0;
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;
    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0)
        return false;
    pathTiles.forEach(function(tile,i)
        {
        Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        })
    Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
    if(pathTiles.length >= chunkSize)
        var chunk = pathTiles[chunkSize - 1];
    else
        var chunk = pathTiles[pathTiles.length - 1];
    var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
    Orion.AddFakeMapObject(10000, '0x051A', 32, chunkX,chunkY,chunkZ);
    Orion.WalkTo(chunkX,chunkY,chunkZ,distanceXY,distanceZ,run,openDoor,maxWalkingTime);
    Orion.Wait(1);
    if(callbackFn !== undefined)
        callbackFn();
    if(Orion.GetDistance(x,y) > distanceXY)
        return SmartWalkTo(x,y,z,distanceXY);
    return true;
    }

function CreateFindList()
	{
	var list = Orion.GetFindList('ExampleList');
	var array = [
		new FindListItem('0x0000', '0x0000', 'Test Item', 0, [new FindItemProperty('Splintering Weapon', 20, 30)])
	]
	list.SetItems(array)
	Orion.UpdateFindList(list)
	}



function FindListParse()
	{
	var list = Orion.GetFindList('BotLoot');
	var itemsList = list.Items()
	TextWindow.Open()
	TextWindow.Clear()
	itemsList.forEach(function(item)
		{
		var itemProps = item.Properties()
		var outStr = '';
		itemProps.forEach(function(prop)
			{
			outStr += prop.Name() + ': ' +  prop.MinValue() + '-' + prop.MaxValue() + ', '
			});
		TextWindow.Print(item.Graphic() + ': ' + outStr)
		});
	}
	
