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
		//remove human flag and use these instead of any for graphic? '0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2'
		var players = Orion.FindTypeEx(any,any,ground,'human|live|ignoreself',24,'blue|green|red|orange|gray')
			.filter(function(npcCheck)
				{
				if(!npcCheck.ProfileReceived())
					Orion.GetProfile(npcCheck.Serial());
				//if(!npcCheck.ProfileReceived())
				//	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
				return npcCheck.ProfileReceived() // || npcCheck.Dead();
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