function YayGetTilesInRectIsFixed() 
	{
    var targetId = Player.Serial();
   	var distance = 1;
   	var flip;
   	
    var length = 5;
    var lowerRange = 2;
    var upperRange = 10;
    while(true)
    	{
    	Orion.Wait(100)
    	if(distance <= 0) flip = false
    	else if(distance >= Orion.Random(lowerRange,upperRange)) flip = true
    	if(flip) distance--;
    	else distance++;
    	var x = Player.X();
    	var y = Player.Y();
        var i = 0;
        Orion.ClearFakeMapObjects();
        for(var j=0;j<length;j++)
        	{
        	var dist = distance + j;
        	var rand = Orion.Random(1,3333);
            switch(Orion.Random(0,8))
                 {
                 case 0:
                 case 1:
                 case 2:
                     Orion.GetTilesInRect('land', x - dist, y - dist, x + dist, y + dist)
                         .filter(function (tile) 
                             {
                             return (x == (tile.X() - dist))
                             || (x == (tile.X() + dist))
                             || (y == (tile.Y() - dist))
                             || (y == (tile.Y() + dist));
                             }).forEach(function(tile)
                                 {
                                 Orion.AddFakeMapObject(i++, '0x051A', rand, tile.X(), tile.Y(), tile.Z());
                                 });
                     break;
                 case 3:
                 case 4:
                 case 5:
                     Orion.GetTilesInRect('land', x - dist, y - dist, x + dist, y + dist)
                         .filter(function (tile) 
                             {
                             return (x == (tile.X() - dist))
                             || (x == (tile.X() + dist))
                             || (y == (tile.Y() - dist))
                             || (y == (tile.Y() + dist));
                             }).forEach(function(tile)
                                 {
                                 Orion.AddFakeMapObject(i++, '0x051A', Orion.Random(1,3333), tile.X(), tile.Y(), tile.Z());
                                 });
                     break;
                 case 6:
                     Orion.GetTilesInRect('land', x - dist, y - dist, x + dist, y + dist)
                         .forEach(function(tile)
                             {
                             Orion.AddFakeMapObject(i++, '0x051A', rand, tile.X(), tile.Y(), tile.Z());
                             });
                     break;
                 case 7:
						Orion.GetTilesInRect('land', x - dist, y - dist, x + dist, y + dist)
						 	.forEach(function(tile)
						     {
						     Orion.AddFakeMapObject(i++, '0x051A', Orion.Random(1,3333), tile.X(), tile.Y(), tile.Z());
						     });
			         break;
                 default:
                     break;
                 }
        	}
		}
	}