function PlayerDetector()
	{
	var memoryMS = 60000; //how long to ignore a player after detecting them.
	var scanFrequencyMS = 100; //how often to scan for players.

	//Orion.GetIgnoreList('PlayerDetectorIgnoreList');
	//Orion.ClearIgnoreList('PlayerDetectorIgnoreList');
	var playersDetected = {};
	var gumpWidth = 200;
	var gumpHeight = 30;
	var gumpHeightOffset = 15;
	var line;
	while(true)
		{
		var startTime = Orion.Now();
		//Orion.UseIgnoreList('PlayerDetectorIgnoreList');
		var players = Orion.FindTypeEx(any,any,ground,'human|live|ignoreself',24,'blue|green|red|orange|gray')
			.filter(function(npcCheck)
				{
				if(!npcCheck.ProfileReceived())
					Orion.GetProfile(npcCheck.Serial());
				//if(!npcCheck.ProfileReceived())
				//	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
				return npcCheck.ProfileReceived();
				});
		//Orion.ResetIgnoreList();
		var playerSerialList = players.map(function(obj){return obj.Serial()});
		var nowTime = Orion.Now();
		var deltaPlayers = [];
		for(var i=0;i<players.length;i++)
			{
			var playerSerial = players[i].Serial();
			var playerName = players[i].Name();
			var playerX = players[i].X();
			var playerY = players[i].Y();
			if(!playersDetected[playerSerial])
				{
				playersDetected[playerSerial] = [playerName, nowTime + memoryMS, playerX, playerY];
				deltaPlayers.push(playerName + ':' + playerSerial + ':' + playerX + ':' + playerY);
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
			DiscordPush('Players Detected: ' + deltaPlayers);
		var deltaTime = Orion.Now() - startTime;
		Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
		}
	}

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/"
	+ 'hook' //hook
	+ "/"
	+ 'key'; //key
	Orion.HttpPost(bot, "content=" + message);
	}