function initScripts()
    {
    Orion.Exec('PlayerDetector',true);
    Orion.Exec('BotBlocker',true);
    }

function terminateScripts()
    {
    Orion.Terminate('all');
    }

function ManualIgnore()
    {
	Orion.WaitForAddObject('myTarget');
	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList',Orion.GetSerial('myTarget'));
    }

function ClearIgnoreList()
    {
    Orion.ClearIgnoreList('PlayerDetectorIgnoreList');
    }

function PrintSharedArray()
    {
    var arr = Shared.GetArray('BlockPoints',[]);
    TextWindow.Open();
    arr.forEach(function(points)
        {
        TextWindow.Print(points);
        });
    }

function PlayerDetectorStationary()
	{
	var memoryMS = 60000; //how long to ignore a player after detecting them.
	var scanFrequencyMS = 100; //how often to scan for players.

    Shared.AddArray('BlockPoints', []);
	Orion.GetIgnoreList('PlayerDetectorIgnoreList');
	var playersDetected = {};
	var gumpWidth = 200;
	var gumpHeight = 30;
	var gumpHeightOffset = 15;
	var line;
	while(true)
		{
		var startTime = Orion.Now();
		Orion.UseIgnoreList('PlayerDetectorIgnoreList');
		var players = Orion.FindTypeEx('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'live|ignoreself',24,'blue|green|red|orange|gray')
			.filter(function(npcCheck)
				{
				if(!npcCheck.ProfileReceived())
					Orion.GetProfile(npcCheck.Serial());
				//if(!npcCheck.ProfileReceived())
				//	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
				return npcCheck.ProfileReceived();
				});
		Orion.ResetIgnoreList();
        if(players[0])
            Orion.PauseScript('BotBlocker');
        else
            Orion.ResumeScript('BotBlocker');
		var playerSerialList = players.map(function(obj){return obj.Serial()});
		var nowTime = Orion.Now();
		var deltaPlayers = [];
		for(var i=0;i<players.length;i++)
			{
			var player = players[i];
			var playerSerial = player.Serial();
			var playerName = player.Name();
			var playerX = player.X();
			var playerY = player.Y();
			if(!playersDetected[playerSerial] && CheckStandStill(playerSerial,playerX,playerY))
				{
				playersDetected[playerSerial] = [playerName, nowTime + memoryMS, playerX, playerY];
				deltaPlayers.push(playerX + ':' + playerY);
				}
			//Orion.PrintFast(playerSerial, 5, 0, 'Player');
			}
		for(var property in playersDetected)
			if(nowTime > playersDetected[property][1])
				delete playersDetected[property];
		var gump = Orion.CreateCustomGump(11005);
		gump.Clear();
		gump.AddResizepic(0, 0, 0xBB8, gumpWidth, gumpHeight + (Object.keys(playersDetected).length * gumpHeightOffset));
		gump.AddText(55, 5, "0", 'Players:');
		gump.AddText(125, 5, '0', players.length);
		line = 0;	
		for(var property in playersDetected)
			{
			if(playerSerialList.indexOf(property) > -1)
				var textColor = '1159';
			else
				var textColor = '0';
			gump.AddText(5, 5 + (gumpHeightOffset * ++line), textColor, playersDetected[property][0] + '  ' + playersDetected[property][2] + ':' + playersDetected[property][3]);
			}
		gump.Update();		
		
		if(deltaPlayers[0])
			{
            var checkArr = Shared.GetArray('BlockPoints',[]);
			deltaPlayers.forEach(function(player)
				{
				if(checkArr.indexOf(player) == -1)
                    checkArr.push(player);
				});
            Shared.AddArray('BlockPoints', checkArr);
			}

		var deltaTime = Orion.Now() - startTime;
		//Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
		}
	}

function CheckStandingStill(mobSerial,mobX,mobY)
    {
    Orion.Wait(750);
	var mob = Orion.FindObject(mobSerial);
    if(mob && mob.X() == mobX && mob.Y() == mobY)
        return true;
    return false;
    }
for (let i = 0; i < array.length; i++) {
	const element = array[i];
	
}
function BotBlocker()
    {
    var blockItems = '0x0F36'; //
    while(!Player.Dead())
        {
        var blockArr = Shared.GetArray('BlockPoints',[]);
        for(var i=0;i<blockArr.length;i++)
            {
            var coordString = blockArr[i];
            var splitString = Orion.Split(coordString, ':');
            var xCoord = splitString[0];
            var yCoord = splitString[1];
            var blockCheck = Orion.FindType(blockItems,any,ground,'item','xyz: ' + xCoord + ',' + yCoord)[0];
            if(blockCheck)
                continue;
            while(!blockCheck && Orion.GetDistance(xCoord,yCoord) <= 20)
                {
                Orion.WalkTo(xCoord, yCoord);
                Orion.Wait(1300);
                Orion.DropType(blockItems, any, backpack, 0, xCoord, yCoord, Player.Z());
                Orion.Wait(500);
                Orion.SetSearchArea(xCoord,yCoord,xCoord,yCoord);
                blockCheck = Orion.FindType(blockItems,any,ground,'item',24)[0];
                Orion.ResetSearchArea();
                }
            }
        Orion.Wait(5000);
        }
    }
