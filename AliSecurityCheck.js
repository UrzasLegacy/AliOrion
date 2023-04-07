var keys = {

}

function HtmlTextPosition()
	{
    var textX = 30;
    var textY = 30;
	var gump = Orion.CreateCustomGump(11420);
 	gump.Clear();
    gump.AddResizepic(0, 0, 'a3c', 300, 300);
    gump.AddButton(2, 400, 460, 0x2EE0,0x2EE0,0x2EE1, '0x0000');
    gump.AddHtmlGump(1, textX, textY, 300, 300, 'a3c', 1, 0)
    gump.Select('htmlgump', 1);
    gump.AddHtmlText(33, 33, 260, 180, '32', 'How do I get this HTML text to move?');
    gump.Select('gump');
    gump.Update();
	}

function SecurityCheck(_)
    {
    var authorizedList = ''//'0x068BE0CB'
    if(Orion.Contains(authorizedList,Player.Serial()))
        return;
    //Orion.HttpPost()
 	var gump = Orion.CreateCustomGump(11420);
    gump.SetCallback('SecurityCallback')
 	gump.Clear()
 	gump.SetNoClose(true);
 	gump.AddResizepic(0, 0, 'a3c', 300, 420);
    var outStr = '<center>Unauthorized Character Detected!\n\nTerminate this script immediately and delete the file from your computer.\n\nYou will not be able to use this script without permission from its author. If you believe this to be an error, terminate this script and contact the author.\n\nThis script will become increasingly detrimental over time. After 2 minutes and plenty of warnings, this script will cause real harm to the characters/house on your account...\nTurn back now.\n\n(SEIZURE WARNING)</center>';
    gump.AddHtmlGump(1, 22, 23, 260, 350, 'a3c', 0, 0)//, '0xFF000', outStr);
    gump.Select('htmlgump', 1);
    gump.AddHtmlText(2, 444, 260, 180, '32', outStr);
    gump.Select('gump');
    gump.AddButton(2, 123, 370, 0x817,0x819,0x818, '0x0000');
    gump.Update();
    
    //Commencing shenanigans
    Orion.Print(1159, 'You find yourself counting the seconds down out loud against your will...');
return
    var i = 120;
    var sequence = [
        '' + i--,
        '    ' + i--,
        '        ' + i--,
        '    ' + i--,
        '' + i--,
        '    ' + i--,
        '         '  + i--,
        '    '  + i--,
        '' + i--,
        '    '  + i--,
        '        '  + i--,
    ]
    for(var i=0;i<sequence.length;i++)
        {
        Orion.Say(sequence[i])
        Orion.ClientOptionSet('SpeechColor', Orion.Random(0,1001));
        Orion.Wait(1000);
        }
    Orion.CharPrint(self,1159,'boom')
    
    }

function SecurityCallback(_)
    {
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print(code)
    if(code == 2)
        {
        var gump = Orion.CreateCustomGump(11420);
        gump.Close();
        }
    }

function DiscoFloor() 
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

