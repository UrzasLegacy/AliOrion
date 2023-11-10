function MobRecorder()
	{
    var logFile = 'AsukaRaresFestScavengerParticipants.txt' //stored in the same folder as this script file
    var scanRadius = 7;
	var scanFrequencyMS = 100; //ms
	var gumpWidth = 200;
	var gumpHeight = 65;
	var gumpHeightOffset = 15;
    var startTime = Orion.Now();
	var line;
	var mobsDetected = {};
	while(true)
		{
		var startInterval = Orion.Now();
		var mobs = Orion.FindTypeEx(any,any,ground,'mobile|ignoreself',scanRadius,'blue|green|red|orange');
		var mobSerialList = mobs.map(function(obj){return obj.Serial()});
		var nowTime = "Nov " + Orion.Date('dd') + ', ' + Orion.Time("hh:mm:ss");
        var elapsedTime = new Date(Orion.Now() - startTime).toISOString().substring(11, 19)
		var gump = Orion.CreateCustomGump(11005);
		gump.Clear();
		gump.AddResizepic(0, 0, 0xBB8, gumpWidth, Math.max(gumpHeight + (mobSerialList.length * gumpHeightOffset), gumpHeight + 45));
		gump.AddText(15, 5, "0", 'Mobiles nearby:');
		gump.AddText(110, 5, '0', mobs.length);
		gump.AddText(15, 20, "0", 'Elapsed Time:');
		gump.AddText(110, 20, "0", elapsedTime);
		line = 0;	
		var deltaMobs = [];
		for(var i=0;i<mobs.length;i++)
			{
            var mob = mobs[i];
			var mobSerial = mob.Serial();
            var mobName = mob.Name();
			if(!mobsDetected[mobSerial])
				{
				mobsDetected[mobSerial] = [mobName, nowTime];
				deltaMobs.push(mobName + ' (' + mobSerial + ') ' + nowTime);
                Orion.PrintFast(mobSerial, 1159, 0, 'Recording ' + mobName);
               CustomFeedback(mobName,elapsedTime);
				}
            gump.AddText(20, 35 + (gumpHeightOffset * ++line), 1159, mobName);
            }
        gump.Update()
		if(deltaMobs[0])
            {
            if(!TextWindow.IsOpened())
                TextWindow.Open()
            var outStr = deltaMobs.join('\n')
			TextWindow.Print(outStr);
            AliAppendFile(outStr,logFile)
            }
		var deltaTime = Orion.Now() - startInterval;
		Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
		}
	}

function CustomFeedback(name,time)
	{
	var phrases = [
		"Gold stars for %name%! You've unraveled the mystery!",
		"Score one for %name%! Leading the scavenger pack, I see!",
		"Hey %name%, is that your detective badge shining, or are you just happy to see me?",
		"You've hunted, you've scavenged, you've triumphed! Hats off to %name%!",
		"Bravo %name%! You'd find a needle in a haystack with skills like that!",
		"Call off the search parties, %name% has prevailed!",
		"Scavengers, beware! %name% is setting the bar high!",
		"Look at %name% go, sweeping through clues like a boss!",
		"Hot on the trail and cool under pressure - that's our %name%!",
		"Huzzah! %name% cracks the code and saves the day!",
		"All hail %name%, the Sherlock of Scavengers!",
		"Who needs a map when you've got %name%'s hunting skills?",
		"History books will remember the legend of %name% the Scavenger!",
		"Clue by clue, step by step, %name% is climbing the scavenger ladder to victory!",
		"Unlocking levels of awesome, one clue at a time – that's %name% for you!",
		"If scavenging were an art, %name% would be Picasso!",
		"Alert the presses: %name% has officially solved the clue!",
	]
	var phrase = phrases[Orion.Random(0,phrases.length)]
	phrase = phrase.replace("%name%",name)
    Orion.Wait(2000)
    Orion.Say(phrase +'\nReport back to the auction house!')
	}

function AliAppendFile(inputString,fileNameString)
    { 
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/' + fileNameString;
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Append(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or append file: ' + fileNameString);
    Orion.Print("Appending " + inputString + ' To File: ' + tmpFilePath);
    tmpFile.Write(inputString + '\n');
    tmpFile.Close();
    }