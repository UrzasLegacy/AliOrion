//--# AliHelpers

function Jiggle(type)
    {
    switch(type)
        {
        case 'Move':
            var playerX = Player.X();
            var playerY = Player.Y();
            var tiles = Orion.GetTilesInRect('land',playerX - 2,playerY - 2,playerX + 2,playerY + 2);
            var tile = tiles[Orion.Random(0,tiles.length)];
            Orion.WalkTo(tile.X(),tile.Y(),0,0);
            Orion.Wait(200);
            break;
        case 'Turn':
            Orion.Turn(Orion.Random(0,8))
            Orion.Wait(200);
            break;
        case 'Wait':
            Orion.Wait(100 * Orion.Random(1,30))
            break;
        case 'CastMage':
            var spells =
                [
                'Create Food',
                'Heal',
                ]
            var spell = spells[Orion.Random(0,spells.length)];
            Orion.Cast(spell);
            if(Orion.WaitForTarget(1300))
                Orion.TargetObject(self);
            Orion.Wait(200);
            break;
        default:
            break;
        }
    }

function ListLoot(findlist,ignorelist)  //v1
    {
    var list = Orion.FindTypeEx('0x2006', '-1', ground, '2').filter(function(part)
    		{
    		return (part.Properties().match(/Evil/i))
    		});
    if(list.length) 
        var corpse = list[0];
    else
        Orion.Print('no corpse found');
    if(corpse == null) 
        {
        Orion.ResetIgnoreList();
        Orion.IgnoreReset();        
        }
    else 
        {
        Orion.UseObject(corpse.Serial());
        Orion.Wait(1100);
        var instancedcorpse = Orion.FindObject(Orion.GetSerial(lastcontainer))
        var lootbag = Orion.FindObject(Orion.GetSerial(backpack));       
        if(ignorelist)
            Orion.UseIgnoreList(ignorelist);
        var lootlist = Orion.FindList(findlist, instancedcorpse.Serial())
        if(lootlist.length)
            {
            for(var i = 0;i<lootlist.length;i++) 
                {            
                if(Orion.GetDistance(corpse.Serial()) > 2)
                    break;
                var b = Orion.FindObject(lootlist[i]);
                Orion.Print(b.Name());
                Orion.MoveItem(lootlist[i], 0, lootbag.Serial());
                Orion.Wait(1100);
                }
            }    
        Orion.Ignore(corpse.Serial())       
        }
    }

var subContainersArr = [];
function GetAllSubContainers(containerSerial,ignoreEmpties)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var itemProps = item.Properties();
        var containerCheck = Orion.Contains(itemProps,'Contents: ');
        var emptyCheck = Orion.Contains(itemProps,'Contents: 0/');
        if(ignoreEmpties)
            return containerCheck && !emptyCheck;
        return containerCheck;
        });
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllSubContainers(subContainer.Serial(),ignoreEmpties);
        }
    Orion.CloseGump('container',containerSerial);
    return subContainersArr;
    }

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function VerifyWalkTo(x,y,z,distance,delay)
    {
    var endTime = Orion.Now() + (delay || 20000);
    while(Orion.GetDistance(x,y) > (distance || 0))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.WalkTo(x,y,z,(distance || 0));
        Orion.Wait(100);
        }
    return true;
    }

function VerifyOpenVendor(vendorSerial,vendorPack,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',vendorPack))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(vendorSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function CheckGumpCliloc(gumpID, clilocID)//check if clilocID is in gump. Return 1 if it is, 0 if not, and null if gump isn't found. 
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID)
        if(gump !== null)
            return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
    }

function PinkGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000023C5');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(ms);
            }
        }   
    }

function VendorGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('last');
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000002AB'))
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(ms);
            }
        }   
    }

function JewelryBoxGumpButton(button)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('any','0x000F3EE7');
        if(gump)
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(200);
            }
        }
    }

function ShallowCopy(arr)
    {
    var json = JSON.stringify(arr);
    return JSON.parse(json);
    }


function AliReadFile(fileNameString)
    { //will create new file if one doesn't exist
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/' + fileNameString;
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Open(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create file: ' + fileNameString);
    var fileRead = tmpFile.ReadAll();
    if(!fileRead)
        fileRead = "";
    var fileParse = JSON.parse(fileRead) || "";
    tmpFile.Close();
    return fileParse
    }

function AliOverwriteFile(inputString,fileNameString)
    { //will create new file if one doesn't exist
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/' + fileNameString;
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Open(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create file: ' + fileNameString);
    Orion.Print("Recording " + inputString + " To File: " + tmpFilePath);
    tmpFile.Write(inputString);
    tmpFile.Close();
    }

function AliAppendFile(inputString,fileNameString)
    { //'test1','AppendTest.txt'
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/' + fileNameString;
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Append(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or append file: ' + fileNameString);
    Orion.Print("Appending " + inputString + ' To File: ' + tmpFilePath);
    tmpFile.Write(JSON.stringify(inputString) + '\n');
    tmpFile.Close();
    }

function AliReadAndOverwriteFile(inputString,fileNameString)
    { //"[1,2,3]","ReadAndOverwriteTest.txt"
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/' + fileNameString;
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Open(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create file: ' + fileNameString);
    var fileRead = tmpFile.ReadAll();
    if(!fileRead)
        fileRead = "[]";
    Orion.Print("Appending " + inputString + ' To File: ' + tmpFilePath);
    var fileArr = JSON.parse(fileRead) || [];
    var inputArr = JSON.parse(inputString) || [];
    var outputArr = [];
    for(var i=0;i<inputArr.length;i++)
        {
        var inputEle = +inputArr[i];
        var fileEle = +fileArr[i];
        var sum = inputEle + fileEle
        Orion.Print(inputEle + '+' + fileEle + '=' + sum)
        outputArr[i] = sum;
        }
    var outputStr = JSON.stringify(outputArr)
    tmpFile.Remove();
    tmpFile.Open(tmpFilePath)
    tmpFile.Write(outputStr);
    tmpFile.Close();
    }


function CloseAllGumps()
    {
    var endTime = Orion.Now() + 3000;
    var gump = Orion.GetGump(any);
    while(gump && Orion.Now() < endTime)
        {
        Orion.Print(gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        gump = Orion.GetGump(any);
        }
    }


function EquipWep(slayer, element, weapon, cameo)
	{ //EquipWep('Reptile', 'Cold', 'Double Axe')
	if(!slayer)
		slayer = ' ';
	else
		slayer += ' Slayer';
	if(!element)
		element = ' ';
	else
		element += ' Damage';
	if(!weapon)
		weapon = ' ';
	var wep = Orion.FindTypeEx(any).filter(function(part)
		{
		return Orion.Contains(part.Properties(), element) 
			&& Orion.Contains(part.Properties(), slayer) 
			&& Orion.Contains(part.Properties(), weapon);
		});
	if(slayer != ' ' && cameo == undefined)
		{
		var cam = Orion.FindTypeEx('0x2F5B|0x9E28').filter(function(part)
			{
			return Orion.Contains(part.Properties(), slayer);
			});
		}
	else if(cameo != undefined)
		{
		var cam = Orion.FindTypeEx('0x2F5B|0x9E28').filter(function(part)
			{
			return Orion.Contains(part.Properties(), cameo);
			});
		}
	if(wep[0])
		Orion.Equip(wep[0].Serial());
	if(cam && cam[0])
		Orion.Equip(cam[0].Serial());
	}

function injuredCheck(range, threshold, healDead)
	{
	var flags = healDead ? 'ignoreself|mobile' : 'ignoreself|live';
	var injurelist = Orion.FindTypeEx(any, any, ground, flags, range, 'green')
		.filter(function(part)
			{
			return part.Hits('%') < threshold;
			}).sort(function(a,b)
				{
				return a.Hits() - b.Hits();
				});
	return injurelist[0];
    }

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }

function cPrint(txt)
    {
    Orion.CharPrint(self,1159,txt) 
    }

function isTargetHour(targetHour)
	{
	var now = new Date();
	var UTCHour = now.getUTCHours();
	return UTCHour == targetHour;
	}

function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}

var lastObjectUsedTime = 0;
function WaitForObjectTimeout()
	{
	var nowTime = Orion.Now();
	var deltaTime = nowTime - lastObjectUsedTime;
	if(deltaTime < 1300)
		Orion.Wait(1300 - deltaTime);
	}

function DiscordPush(message)
	{
	var bot = Orion.RegRead('discordConfig') || SetDiscordRegistryEntry();
	Orion.HttpPost(bot, "content=" + message);
	}

function SetDiscordRegistryEntry()
    {
    var discordConfig = "https://discordapp.com/api/webhooks/" + profile.discordHook + '/' + profile.discordKey;
    var registryName = 'discordConfig';
    Orion.RegWrite(registryName, discordConfig);
    return discordConfig;
    }
    
function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID, destinationContainerSerial)
    {
    if(!colorID)
        var colorID = any;
    if(!destinationContainerSerial)
        var destinationContainerSerial = Orion.GetSerial(backpack);
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', destinationContainerSerial))
        {
        Orion.UseObject(destinationContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, destinationContainerSerial, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        Orion.Wait(100);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0], 0, destinationContainerSerial);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed, destinationContainerSerial);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
    }

function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global scope variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X(); //noting player start position to check later to see if recall was successful
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName; //this is using Regex to find the last line of the item properties i.e., the runebook name
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return false;
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	var runebookSerial = runeBook[0].Serial();
    Orion.Wait(1300);
	Orion.UseObject(runebookSerial);
	var gump = WaitForSpecificGump(2000, 'generic', runebookSerial, '0x00000059');
	if(gump)
		{
		var runeInd = gump.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(rotateToggle && backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            var runeIndexNum = +runeIndex + 1 
	            if(runeIndexNum <= numRunes)
					runeIndex = String(runeIndexNum); 
	            else
					runeIndex = '1';
	            return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            })[0];
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeName);
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	        {
	        Orion.Wait(2000);
            if(rotateToggle)
                {
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                }
	        return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle);
	}

function AtlasByName(bookName,runeName,backupBook,backupRune) 
	{
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x9C16').filter(function(part)
                {
                return part.Properties().match(/.+$/) == bookName
                });
    if(!runeItem[0])
        {
        Orion.Print("Atlas named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 650)
    	var recallType = 4000; //recall index
	else
		var recallType = 5000; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: '" + runeName + "' in Atlas: '" + bookName + "'");
	Orion.UseObject(runeItem[0].Serial());
	 if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(runeName) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
            	AtlasPushButton(4);
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(runeName) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(runeName);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 25)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        break;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    		return Orion.Print('debug');
		    	AtlasPushButton(5);
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(buttonCode));
            Orion.Wait(100);
            }
        }
    Orion.Wait(500);
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(recallType));
            Orion.Wait(100);
            }
        }
	var check = Orion.WaitJournal('Something is blocking the location.', Orion.Now()-1000, Orion.Now()+4000, 'sys');
	if(check)
		{
        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
            {
            return part.Properties().match(/.+$/) == backupBook
            });
		Orion.Wait(2000);
        if(backup)
            return AtlasByName(backupBook,backupRune);
        else
            Orion.Print("No backup atlas named '" + backupBook + "' found!");
		}
	if(x == Player.X() && y == Player.Y()) 
        AtlasByName(bookName,runeName,backupBook,backupRune);
	}

function AtlasPushButton(button)
    {
    if (Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(100);
            }
        }
    }

function AtlasFindButton(string)
    {
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(string) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
            	AtlasPushButton(4);
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(string) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(string);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 25)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        return buttonCode;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    		return Orion.Print('debug');
		    	AtlasPushButton(5);
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    }

function WalkThrough(ali)
	{
	// WalkThrough([ [waypointArray], [waypointArray], [waypointArray] ])
	// waypointArray = [x, y]
	// waypointArray = [x, y, step]
	// waypointArray = [x, y, step, testString]
	// testString format = 'xCoordToTest:yCoordToTest:stepDirection'
	
	// Walks to x,y and then if step isn't false, takes a step in whatever direction (e.g 'n','e','s','w'). This step can be useful
	// for certain area transitions, but usually isn't necessary and can be left as false.
	// If a testString is supplied, after attempting to walk to the coordinates given, a check is performed to see if the player
	// coordinates match. If they don't, your character will step in the direction provided and then attempt to walk to the original
	// coordinates again. The test step direction should be AWAY from the area transition, so that the character can re-attempt it.
	// Oni Array: WalkThrough([[987, 196, false, '67:337:w'],[66, 352],[103, 556],[176, 664]])
	for(var i=0;i<ali.length;i++)
		{
		var coords = ali[i];
		Orion.WalkTo(coords[0], coords[1], 0, 0, 255, 1, 1);
		if(coords[2])
			{
			Orion.Wait(250);
			Orion.Step(coords[2], true);
			}
		Orion.Wait(250);
		Orion.Resend();
		Orion.Wait(250);
		if(coords[3])
			{
			var testCoords = Orion.Split(coords[3], ':');
			Orion.Wait(500);
			if(Player.X() != Number(testCoords[0]) || Player.Y() != Number(testCoords[1]))
				{
				Orion.Print('retry');
				if(testCoords[2])
					Orion.Step(testCoords[2], true);
				i--;
				}
			}
		}
	}

function BorderEdge(x, y, p2, range) 
	{
  	return (x == (p2.X() - range))
    	|| (x == (p2.X() + range))
    	|| (y == (p2.Y() - range))
    	|| (y == (p2.Y() + range));
	}

function WalkToRadiusBorder(targetSerial, distance) 
    {
    var target = Orion.FindObject(targetSerial)
    if(target) 
        {
        var x = target.X();
        var y = target.Y();
        var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
            .filter(function(tile) 
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                return (x == (tileX - distance))
                || (x == (tileX + distance))
                || (y == (tileY - distance))
                || (y == (tileY + distance));
                }).sort(function (a,b) 
                    {
                    return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y())
                    });
        tiles.forEach(function(tile,ind)
            {
            Orion.AddFakeMapObject(ind + 40000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            })
        for(var i=0;i<tiles.length;i++)
            {             
            var closest = tiles[i]; 
            Orion.AddFakeMapObject(55555, '0x051A', 32, closest.X(), closest.Y(), closest.Z());
            if(Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0))
                break;
            }
        }
    }

function DrawSquare(minX,minY,maxX,maxY)
	{
	Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
		.forEach(function (tile,ind) 
			{
			Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
			});
	}

function DrawBorder(minX,minY,maxX,maxY)
	{
	Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
		.forEach(function (tile,ind) 
			{
			Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
			});
	}

function SetAvoidRadius(mobSerial,range)
    {
    var mobObj = Orion.FindObject(mobSerial);
    var x = mobObj.X();
    var y = mobObj.Y();
    var tiles = Orion.GetTilesInRect(x - range, y - range, x + range, y + range);
    for(var i = 0;i<tiles.length;i++)
        {
        var tile = tiles[i];
        var tileX = tile.X();
        var tileY = tile.Y();
        var tileZ = tile.Z();
        Orion.SetBadLocation(tileX,tileY)
        Orion.AddFakeMapObject(i + 30000, '0x051A', 1159, tileX, tileY, tileZ);
        }
    }

function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn)
    {
    if(z === undefined) z = 0;
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;
    if(pathMarkers === undefined) pathMarkers = false;
    if(typeof startCallBackFn == 'function')
        startCallBackFn();
    var playerX = Player.X();
    var playerY = Player.Y();
    var zeroMovement = playerX == x && playerY == y;
    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    if(pathMarkers)
        Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0 && !zeroMovement)
        return false;
    if(!zeroMovement)
        {
        var shortStop = pathTiles[pathTiles.length - 1];
        var shortX = shortStop.X();
        var shortY = shortStop.Y();
        if(pathMarkers)
            {
            pathTiles.forEach(function(tile,i)
                {
                Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
                })
            Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
            }
        if(pathTiles.length >= chunkSize)
            var chunk = pathTiles[chunkSize - 1];
        else
            var chunk = shortStop;
        var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
        if(pathMarkers)
            {
            Orion.AddFakeMapObject(10000, '0x051A', 32, x,y,z);
            Orion.AddFakeMapObject(10001, '0x051A', 32, chunkX,chunkY,chunkZ);
            }
        Orion.WalkTo(chunkX,chunkY,chunkZ,0,distanceZ,run,openDoor,maxWalkingTime);
        Orion.Wait(1);
        }
    if(typeof endCallBackFn == 'function')
        endCallBackFn()
    if(!zeroMovement && Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn);
    return true;
    }

function Fill(profString, skillString, skillValue, toolGraphic, containerSerial, benchSerial, textInd)
    {
    while(true)
        {
        WaitForObjectTimeout();
        Orion.UseObject(benchSerial);
        lastObjectUsedTime = Orion.Now();
        var benchGump = WaitForSpecificGump(2000, 'generic', benchSerial, '0x00002415');
        if(benchGump)
            {
            var have = Orion.FindTypeEx('0x14F0').filter(function(deed)
                {
                return Orion.Contains(deed.Properties(), profString);
                }).length;
            var needed = Math.min(500 - +benchGump.TextList()[textInd] - have, 25);
            if(needed < 1)
                return Orion.CharPrint(self, 1159, skillString + ' charges filled');
            if(Orion.SkillValue(skillString, 'base') < skillValue*10) 
                return Orion.CharPrint(self, 1159, skillString + " skill isn't high enough");
            var tool = Orion.FindType(toolGraphic)[0];
            if(!tool)
                return Orion.CharPrint(self, 1159, profString + ' tool not found');
            Restock('Blank Scroll', '0x0EF3', containerSerial, needed);
            Orion.CharPrint(self, 1159, 500 - +benchGump.TextList()[textInd] + ' deeds needed');
            Orion.CharPrint(self, 1159, 'Making batch of ' + needed + ' ' + profString + ' deeds');
            for(var i=0;i<needed;i++)
                {
                if(!Orion.GumpExists('generic', tool, '0x000001CC'))
                    {
                    WaitForObjectTimeout();
                    Orion.UseObject(tool);
                    lastObjectUsedTime = Orion.Now();
                    }
                var toolGump = WaitForSpecificGump(2000, 'generic', tool, '0x000001CC');
                if(toolGump)
                    {
                    toolGump.Select(Orion.CreateGumpHook(8000));
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetType('0x0EF3');
                    }
                Orion.Wait(200);
                //WaitForSpecificGump(2000, 'generic', tool, '0x000001CC'); //faster but causes problems if window isn't in focus or fps is low
                }
            Orion.Wait(500);
            var deeds = Orion.FindTypeEx('0x14F0').filter(function(deed)
                {
                return Orion.Contains(deed.Properties(), profString);
                });
            if(deeds[0])
                {
                Orion.CloseGump('generic', tool, '0x000001CC');
                Orion.CharPrint(self, 1159, 'Adding charges to bench');
                WaitForObjectTimeout();
                Orion.UseObject(benchSerial);
                lastObjectUsedTime = Orion.Now();
                benchGump = WaitForSpecificGump(2000, 'generic', benchSerial, '0x00002415');
                if(benchGump)
                    {
                    benchGump.Select(Orion.CreateGumpHook(100));
                    for(var i=0;i<deeds.length;i++)
                        {
                        if(Orion.WaitForTarget(2000))
                            Orion.TargetObject(deeds[i].Serial());
                        }
                    if(Orion.WaitForTarget(2000))
                        Orion.CancelTarget();
                    Orion.Wait(200);
                    }
                }          
            }
        Orion.CloseGump('generic', benchSerial, '0x00002415');
        Orion.Wait(200);
        }
    }

function Combine(items,amount)
    {
    var amalgamator = Orion.FindType('0x9966','0x0480')[0];
    if(!amalgamator)
        return false;
    var backpackSerial = Orion.GetSerial(backpack);
    for(var i=0;i<amount;i++)
        {
        while(Orion.GetContainer(items[i]) != backpackSerial)
            {
            Orion.MoveItem(items[i]);
            Orion.Wait(1300);
            }
        while(ParseAmalgamator(amalgamator).fulfilled == i)
            {
            Orion.UseObject(amalgamator);
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(items[i]);
            Orion.Wait(1300);
            }
        }
    return true;
    }

function ParseRefinement(itemSerial)
    {
    var itemObj = Orion.FindObject(itemSerial);
    var itemProps = itemObj.Properties();
    var itemInfo = itemProps.match(/(\w+) Of (\w+)[\w\/\:\n\r<>\s]+Armor Type: ([\w ]+)\nBonus Type: (\w+)/) || [];
    if(!itemInfo[0])
        return false;
    var type = itemInfo[1];
    var level = itemInfo[2];
    var armor = itemInfo[3];
    var bonus = itemInfo[4];
    return {'type': type,'level': level,'armor': armor,'bonus': bonus};
    }

function ParseAmalgamator(itemSerial)
    {
    var itemObj = Orion.FindObject(itemSerial);
    if(itemObj.Color() == '0x0480') //empty amalgamator
        return {'fulfilled': 0, 'requested': 0};
    var itemProps = itemObj.Properties();
    var itemInfo = itemProps.match(/(\w+) Of (\w+)[\w\/\:\n\r<>\s]+Armor Type: ([\w ]+)\nBonus Type: (\w+)\nCurrent Status : (\d+)\/(\d)/) || [];
    if(!itemInfo[0])
        return false;
    var type = itemInfo[1];
    var level = itemInfo[2];
    var armor = itemInfo[3];
    var bonus = itemInfo[4];
    var fulfilled = itemInfo[5];
    var requested = itemInfo[6];
    return {'type': type,'level': level,'armor': armor,'bonus': bonus, 'fulfilled': fulfilled, 'requested': requested,'empty': false};
    }

function Commodifier(stackSize,useCommodityDeeds,useSpecificArray)
    {
    if(useCommodityDeeds == undefined)
        useCommodityDeeds = true;
    Orion.CharPrint(self,1159,"Select container\nPress Escape to select Bank");
    var fromCheck = Orion.WaitForAddObject('myTarget');
    if(fromCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var container = Player.BankSerial();
        }
    else if(fromCheck == 1)
        {
        var container = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', container))
            {
            Orion.UseObject(container);
            Orion.Wait(1300);
            }
        }
    if(useSpecificArray)
        {
        for(var i=0;i<useSpecificArray.length;i++)
            {
            var item = useSpecificArray[i];
            var itemGraphic = item[0];
            var itemColor = item[1];
            CombineCommodity(itemGraphic,itemColor,container,stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    else
        {
        var itemHash = {};
        var items = Orion.FindTypeEx(any,any,container);
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            var graphicColorPair = item.Graphic() + ':' + item.Color();
            itemHash[graphicColorPair] = true;
            }    
        for(graphicColor in itemHash)
            {
            var graphicColorSplit = Orion.Split(graphicColor, ':');
            var itemGraphic = graphicColorSplit[0];
            var itemColor = graphicColorSplit[1];
            CombineCommodity(itemGraphic, itemColor, container, stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    }

function CombineCommodity(graphicSerial, colorCode, containerSerial, stackCount)
	{
    var itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
        {
        var itemCount = item.Count();
        return itemCount > 1 && itemCount > stackCount;
        });
    while(itemOverstacked[0])
        {
        Orion.MoveItem(itemOverstacked[0].Serial(), stackCount, containerSerial, 0, 0);
        Orion.Wait(1300);
        itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            var itemCount = item.Count();
            return itemCount > 1 && itemCount > stackCount;
            });
        }
	var itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
		{
        var itemCount = item.Count();
		return itemCount > 1 && itemCount < stackCount;
		});
	while(itemUnderstacked[1])
		{
		var neededCount = stackCount - itemUnderstacked[0].Count();
		Orion.MoveItem(itemUnderstacked[1].Serial(), neededCount, itemUnderstacked[0].Serial())
		Orion.Wait(1300);
		itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
			{
            var itemCount = item.Count();
            return itemCount > 1 && itemCount < stackCount;
			});
		}
	}

function Commodify(graphicSerial, colorCode, containerSerial, stackCount)
    {
    var itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
		{
		return item.Count() == stackCount;
		})[0];
    while(itemStacked)
        {
        var commodityDeed = Orion.FindTypeEx('0x14F0','0x0047',containerSerial)[0];
        if(!commodityDeed)
            return false;
        while(Orion.Contains(commodityDeed.Properties(), 'Unfilled'))
            {
            Orion.UseObject(commodityDeed.Serial());
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(itemStacked.Serial());
            Orion.Wait(1300);
            }
        itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            return item.Count() == stackCount;
            })[0];
        }
    }

function AliAtlas(targetX,targetY,targetMap)
    { //[x,y,facet]
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var gateArr = 
        [//location name, facet, facet# x, y
            ['Moonglow', 'Trammel', 1, 4467, 1283],
            ['Britain', 'Trammel', 2, 1421, 1696],
            ['Jhelom', 'Trammel', 3, 1499, 3771],
            ['Yew', 'Trammel', 4, 771, 752],
            ['Minoc', 'Trammel', 5, 2701, 692],
            ['Trinsic', 'Trammel', 6, 1828, 2948],
            ['Skara Brae', 'Trammel', 7, 643, 2067],
            ['New Magincia', 'Trammel', 8, 3566, 2140],
            ['New Haven', 'Trammel', 27, 3450, 2677],
            ['Moonglow', 'Felucca', 9, 4467, 1283],
            ['Britain', 'Felucca', 10, 1421, 1696],
            ['Jhelom', 'Felucca', 11, 1499, 3771],
            ['Yew', 'Felucca', 12, 771, 752],
            ['Minoc', 'Felucca', 13, 2701, 692],
            ['Trinsic', 'Felucca', 14, 1828, 2948],
            ['Skara Brae', 'Felucca', 15, 643, 2067],
            ['New Magincia', 'Felucca', 16, 3566, 2140],
            ['Buccaneers Den', 'Felucca', 26, 2711, 2234],
            ['Compassion', 'Ilshenar', 17, 1215, 467],
            ['Honesty', 'Ilshenar', 18, 772, 1366],
            ['Honor', 'Ilshenar', 19, 744, 724],
            ['Humility', 'Ilshenar', 20, 281, 1016],
            ['Justice', 'Ilshenar', 21, 987, 1011],
            ['Sacrifice', 'Ilshenar', 22, 1174, 1286],
            ['Spirituality', 'Ilshenar', 23, 1532, 1340],
            ['Valor', 'Ilshenar', 24, 528, 216],
            ['Chaos', 'Ilshenar', 25, 1721, 218],
            ['Luna', 'Malas', 28, 1015, 527],
            ['Umbra', 'Malas', 29, 1997, 1386],
            ['Isamu-Jima', 'TerMur', 30, 1169, 998],
            ['Makoto-Jima', 'TerMur', 31, 802, 1204],
            ['Homare-Jima', 'TerMur', 32, 270, 628],
            ['Royal City', 'TerMur', 33, 850, 3525],
            ['Valley of Eodon', 'TerMur', 34, 719, 1863],
        ]
    var map = maps[Orion.ObjAtLayer('backpack').Map()]
    Orion.Print(map)
    if(Orion.GetDistance(targetX,targetY) == 0)
        {
        Orion.CharPrint(self,1159,'Already at destination: ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(0);
        return;
        }
    if(Orion.GetDistance(targetX,targetY) < 250 && Orion.GetPathArray(targetX, targetY, 256, 0).length && map == targetMap)
        {
        Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(1);
        AliWalkTo(targetX,targetY);
        Orion.WarMode(0);
        return;
        }
    var nearestGate = gateArr.filter(function(gate){return gate[1] == map})
    	//.filter(function(gate)
    	//{
    	//return Orion.GetPathArray(gate[3], gate[4], 256, 0).length
        //return Orion.GetDistance(gate[3],gate[4]) < 1000;
        //})
        .sort(function(a,b)
        	{
	        //return Orion.GetPathArray(a[3], a[4], 256, 0).length - Orion.GetPathArray(b[3], b[4], 256, 0).length
	        return Orion.GetDistance(a[3],a[4]) - Orion.GetDistance(b[3],b[4]);
	        })[0];
    var destinationGate = gateArr.filter(function(gate){return gate[1] == targetMap})
        .sort(function(a,b)
        {
        return DistBetweenPoints(targetX,targetY,a[3],a[4]) - DistBetweenPoints(targetX,targetY,b[3],b[4])
        })[0];
    Orion.Print(nearestGate[1] + ' - ' + nearestGate[0] + ' ' + nearestGate[3] + ', ' + nearestGate[4] + ':' + Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length)
    Orion.Print(destinationGate[1] + ' - ' + destinationGate[0] + ' ' + destinationGate[3] + ', ' + destinationGate[4])
    Orion.WarMode(1);
    
    Orion.CharPrint(self,1159,'Walking to nearest gate');
    AliWalkTo(nearestGate[3], nearestGate[4])
    //var tempX = Player.X();
    //var tempY = Player.Y();
    while(Orion.GetDistance(destinationGate[3],destinationGate[4]) > 10)
        {
        Orion.Print('Waiting for gate gump')
        var gump = Orion.GetGump('any','0x00000258');
        if(gump !== null)
            {
            var gumpHook = Orion.CreateGumpHook(1);
            gumpHook.AddCheck(destinationGate[2], true);
            gump.Select(gumpHook);
            Orion.Wait(100);
            }
        else
            {
            var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 23);
            Orion.CharPrint(self,1159,'Searching for gate');
            if(gate[0])
                {
                Orion.CharPrint(self,1159,'Walking to gate');
                AliWalkTo(gate[0].X(), gate[0].Y());
                Orion.Wait(500);
                Orion.Resend();
                Orion.Wait(500);
                Orion.UseObject(gate[0].Serial());
                }
            else 
                {
                Orion.CharPrint(self,1159,'Walking to nearest gate');
                if(!AliWalkTo(nearestGate[3], nearestGate[4]))
                    if(!AliWalkTo(1174, 1283))
                        AliWalkTo(1016, 524);
                }
            }
        Orion.Wait(1000);
        }
    Orion.WarMode(1);
    Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
    AliWalkTo(targetX,targetY);
    Orion.WarMode(0);
    }

function isPointInRectangle(x1, y1, x2, y2, x3, y3) {
        // Check if Point3 is within the bounds of the rectangle created by Point1 and Point2
        //x1,y1 is the northwest corner of the rectangle
        //x2,y2 is the southeast corner
        return x3 >= x1 && x3 <= x2 && y3 >= y1 && y3 <= y2;
      }

function DropHere(itemSerial) //v3
    {
    var playerBackpack = Orion.GetSerial(backpack);
    var range = 1;
    var endTimeMain = Orion.Now() + 6000;
    var hash = {};
    while(Orion.GetContainer(itemSerial) == playerBackpack && Orion.Now() < endTimeMain)
        {
        //Orion.ResetSearchArea(); //uncomment this IF it won't mess with your other search areas
        var firstPassTiles = Orion.GetTilesInRect('land',Player.X()-range,Player.Y()-range,Player.X()+range,Player.Y()+range)
            .filter(function(tile)
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                var tileZ = tile.Z();
                if(tileZ != Player.Z())
                    return false;
                var tileHash = "" + tileX + tileY + tileZ;
                if(hash[tileHash])
                    return false;
                var mobCheck = Orion.FindType(any,any,ground,'live','xyz: ' + tileX + ',' + tileY).length == 0;
                var itemCheck = Orion.FindType(any,any,ground,'item','xyz: ' + tileX + ',' + tileY).length <= 5;
                return mobCheck && itemCheck;
                });
        if(!firstPassTiles.length)
            Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
        var validTiles = [];
        for(var i=0;i<firstPassTiles.length;i++)
            {
            var tile = firstPassTiles[i];
            //if(Orion.GetPathArray(tile.X(),tile.Y(),Player.Z(),0,1,1,0)[0])
            if(Orion.CanWalk('1', tile.X(), tile.Y(), tile.Z()))
                {
                validTiles.push(tile);
                if(validTiles.length >= 4)
                    break;
                }
            }
        var endTimeSub = Orion.Now() + 2000;
        while(validTiles.length && Orion.GetContainer(itemSerial) == playerBackpack && Orion.Now() < endTimeSub)
            {
            var validTile = validTiles.shift();
            var validTileX = validTile.X();
            var validTileY = validTile.Y();
            var validTileZ = validTile.Z();
            Orion.AddFakeMapObject(0, '0x051A', 1152, validTileX, validTileY, validTileZ);
            Orion.Drop(itemSerial, 0, validTileX, validTileY, validTileZ);
            Orion.Wait(500);
            }
        if(validTile && Orion.GetContainer(itemSerial) == playerBackpack)
            hash['' + validTileX + validTileY + validTileZ] = true;
        }
    if(!validTiles.length)
        Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
    }

function GetDirectionTo(targetX, targetY)
      {
      var dx = targetX - Player.X();
      var dy = Player.Y() - targetY;
      // Using atan2 to get the angle between the x-axis and the line
      // between the origin and the point (dx, dy).
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      // Making the angle positive and adjusting it to fit our direction definitions.
      angle = (angle + 360) % 360;
      // Dividing the circle into 8 sectors and determining the direction.
      if (angle >= 22.5 && angle < 67.5)
          return 1; // NorthEast
      else if (angle >= 67.5 && angle < 112.5)
          return 0; // North
      else if (angle >= 112.5 && angle < 157.5)
          return 7; // NorthWest
      else if (angle >= 157.5 && angle < 202.5)
          return 6; // West
      else if (angle >= 202.5 && angle < 247.5)
          return 5; // SouthWest
      else if (angle >= 247.5 && angle < 292.5)
          return 4; // South
      else if (angle >= 292.5 && angle < 337.5)
          return 3; // SouthEast
      else
          return 2; // East
      }

function GetDirectionFrom(targetX, targetY)
      {
      var dx = Player.X() - targetX;
      var dy = targetY - Player.Y();
      // Using atan2 to get the angle between the x-axis and the line
      // between the origin and the point (dx, dy).
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      // Making the angle positive and adjusting it to fit our direction definitions.
      angle = (angle + 360) % 360;
      // Dividing the circle into 8 sectors and determining the direction.
      if (angle >= 22.5 && angle < 67.5)
          return 1; // NorthEast
      else if (angle >= 67.5 && angle < 112.5)
          return 0; // North
      else if (angle >= 112.5 && angle < 157.5)
          return 7; // NorthWest
      else if (angle >= 157.5 && angle < 202.5)
          return 6; // West
      else if (angle >= 202.5 && angle < 247.5)
          return 5; // SouthWest
      else if (angle >= 247.5 && angle < 292.5)
          return 4; // South
      else if (angle >= 292.5 && angle < 337.5)
          return 3; // SouthEast
      else
          return 2; // East
      }

function TeleportToTileInFrontOfPlayer()
    {
    var range = 10;
    var dx = 0;
    var dy = 0;
    var direction = Player.Direction() % 8;
    switch(direction)
        {
        case 0: // North
            dy = -range;
            break;
        case 1: // NorthEast
            dx = range;
            dy = -range;
            break;
        case 2: // East
            dx = range;
            break;
        case 3: // SouthEast
            dx = range;
            dy = range;
            break;
        case 4: // South
            dy = range;
            break;
        case 5: // SouthWest
            dx = -range;
            dy = range;
            break;
        case 6: // West
            dx = -range;
            break;
        case 7: // NorthWest
            dx = -range;
            dy = -range;
            break;
        default:
            Orion.Print("Invalid direction");
            return;
        }
    if(!Orion.HaveTarget())
        {
        Orion.Cast('Teleport');
        if(Orion.WaitForTarget(3000))
            Orion.TargetTileRelative('land', dx, dy, Player.Z());
        }
    else
        Orion.TargetTileRelative('land', dx, dy, Player.Z());
    }

function PaintVisionCone()
    {
    var playerX = Player.X();
    var playerY = Player.Y();
    var dx = 0;
    var dy = 0;
    var direction = Player.Direction() % 8;

    switch(direction)
        {
        case 0: // North
            dy = relativeY * -1;
            break;
        case 1: // NorthEast
            dx = relativeX;
            dy = relativeY * -1;
            break;
        case 2: // East
            dx = relativeX * -1;
            break;
        case 3: // SouthEast
            dx = relativeX * -1;
            dy = relativeY;
            break;
        case 4: // South
            dy = relativeY;
            break;
        case 5: // SouthWest
            dx =  relativeX * -1;
            dy = relativeY;
            break;
        case 6: // West
            dx = relativeX * -1;
            break;
        case 7: // NorthWest
            dx = relativeX * -1;
            dy = relativeY * -1;
            break;
        default:
            Orion.Print("Invalid direction");
            return;
        }
    if(!Orion.HaveTarget())
        {
        Orion.Cast('Teleport');
        if(Orion.WaitForTarget(3000))
            Orion.TargetTileRelative('land', dx, dy, Player.Z());
        }
    else
        Orion.TargetTileRelative('land', dx, dy, Player.Z());
    }

function HighlightInLos()
    {
    Orion.GetTilesInRect('land',Player.X() - 10,Player.Y() - 10,Player.X() + 10,Player.Y() + 10).forEach(function(tile,ind)
        {
        if(Orion.InLOS(tile.X(),tile.Y()))
            Orion.AddFakeMapObject(ind, '0x051A', 1152, tile.X(), tile.Y(), tile.Z());
        })
    }

function TeleportDirectional()
    {
    var range = 10;
    var dx = 0;
    var dy = 0;
    var direction = (Player.Direction()) % 8;

    switch(direction)
        {
        case 0: // North
            dy = -range;
            break;
        case 1: // NorthEast
            dx = range;
            dy = -range;
            break;
        case 2: // East
            dx = range;
            break;
        case 3: // SouthEast
            dx = range;
            dy = range;
            break;
        case 4: // South
            dy = range;
            break;
        case 5: // SouthWest
            dx = -range;
            dy = range;
            break;
        case 6: // West
            dx = -range;
            break;
        case 7: // NorthWest
            dx = -range;
            dy = -range;
            break;
        default:
            Orion.Print("Invalid direction");
            return;
        }

    var foundAlternative = false;

    // If the target tile is untargetable, try expanding the search area.
    if(!Orion.InLOS(dx, dy))
        {
        var maxRetries = 2;
        for(var retry=0;retry<maxRetries;retry++)
            {
            // Expand the search area by the retry count.
            var tiles = Orion.GetTilesInRect('land',dx-retry, dy-retry, dx+retry, dy+retry);

            // Iterate over all tiles to find a targetable one.
            for (var i=0;i<tiles.length;i++)
                {
                var tileDx = tiles[i].X - Player.X();
                var tileDy = tiles[i].Y - Player.Y();
                if(Orion.InLOS(tileDx, tileDy))
                    {
                        dx = tileDx;
                        dy = tileDy;
                    foundAlternative = true;
                    break;
                    }
                }

            // If a targetable tile was found, stop retrying.
            if (foundAlternative)
                break;
            }
        // If no targetable alternative was found, log an error and exit.
        if(!foundAlternative)
            return Orion.Print("Cannot target this tile or any adjacent tiles");
        }

    if(!Orion.HaveTarget())
        {
        Orion.Cast('Teleport');
        if(Orion.WaitForTarget(3000))
            Orion.TargetTileRelative('land', dx, dy, Player.Z());
        }
    else
        Orion.TargetTileRelative('land', dx, dy, Player.Z());
    }

function DirectionalTeleport(direction,range)
    {
   // var range = 8;
    var dx = 0;
    var dy = 0;
    //var direction = (Player.Direction() + 2) % 8;
    var direction = (Player.Direction() + direction) % 8;
    switch(direction)
        {
        case 0: // North
            dy = -range;
            break;
        case 1: // NorthEast
            dx = range;
            dy = -range;
            break;
        case 2: // East
            dx = range;
            break;
        case 3: // SouthEast
            dx = range;
            dy = range;
            break;
        case 4: // South
            dy = range;
            break;
        case 5: // SouthWest
            dx = -range;
            dy = range;
            break;
        case 6: // West
            dx = -range;
            break;
        case 7: // NorthWest
            dx = -range;
            dy = -range;
            break;
        default:
            Orion.Print("Invalid direction");
            return;
        }
    var coordX = Player.X() + dx;
	var coordY = Player.Y() + dy;
    if(!Orion.InLOS(coordX,coordY))
        {
        var tiles = Orion.GetTilesInRect('land',dx-1,dy-1,dx+1,dy+1).filter(function(tile)
            {
            return Orion.InLOS(tile.X(),tile.Y());
            });
        coordX = tiles[0].X();
        coordY = tiles[0].Y();
        }
        
    if(!Orion.HaveTarget())
        {
        Orion.Cast('Teleport');
        if(Orion.WaitForTarget(3000))
            Orion.TargetTile('land', coordX, coordY, Player.Z());
        }
    else
        Orion.TargetTile('land', coordX, coordY, Player.Z());
    }

function AppendMagic(input)
    {
        // if(Player.Serial() == leadSampSerial)
        //         {
        //         var totals = {};
        //         for(var i=0;i<instanceSerials.length;i++)
        //             {
        //             var corpseInstance = instanceSerials[i];
        //             var items = Orion.FindTypeEx(any,any,corpseInstance);
        //             for(var j=0;j<items.length;j++)
        //                 {
        //                 var item = items[j];
        //                 var itemProps = item.Properties();
        //                 var lastLine = itemProps.match(/.+$/) || '';
        //                 if(lastLine.length == 0 || !Orion.Contains(lastLine,'Artifact|Magic Item'))
        //                     continue;
        //                 if(totals[lastLine])
        //                     totals[lastLine]++;
        //                 else
        //                     totals[lastLine] = 1;
        //                 }
        //             }
        //         totals['Run Type'] = 'All In Luck';
        //         totals['Team Size'] = 6;
        //         totals['Luck Leader'] = Player.Luck();
        //         totals['TTK'] = Shared.GetVar('bossDeathStamp',0) - Shared.GetVar('bossStartStamp',0);
        //         TextWindow.Open();
        //         TextWindow.Clear();
        //         var outMsg = 'a'
        //         TextWindow.Print(JSON.stringify(totals))
        //         AppendMagic(totals)
        //         }
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliUWTracker.txt';
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Append(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to append file: ' + fileNameString);
    var inputString = JSON.stringify(input);
    Orion.Print("Appending " + inputString + ' To File: ' + tmpFilePath);
    tmpFile.Write(Orion.Time() + ': ' + inputString + '\n');
    tmpFile.Close();
    }

function RetrieveMagic()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliUWTracker.txt';
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Open(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to open file: ' + fileNameString);
    var outputString = tmpFile.ReadAll();
    tmpFile.Close();
    var replace = outputString.replace(/\\/g,'');
    var replaceAgain = replace.replace(/\d\d:\d\d:\d\d\.\d\d\d: /g,'');
    var lines = Orion.Split(replaceAgain,'\n').filter(function(line)
        {
        var obj = JSON.parse(line)
        var legArt = obj["Legendary Artifact"] || 0
        var majArt = obj["Major Artifact"] || 0
        var greatArt = obj["Greater Artifact"] || 0
        var lessArt = obj["Lesser Artifact"] || 0
        var majMag = obj["Major Magic Item"] || 0
        var greatMag = obj["Greater Magic Item"] || 0
        var lessMag = obj["Lesser Magic Item"] || 0
        var total = legArt + majArt + greatArt + lessArt + majMag + greatMag + lessMag
        return Orion.Contains(line,"Luck Leader Full Run") && total > 73 && total < 78
        });
    var linesLength = lines.length;
    var red = lines.reduce(function(sumObj,line)
        {
        var json = JSON.parse(line);
        for(prop in json)
            {
            if(typeof sumObj !== 'object')
                sumObj = {};
            if(sumObj[prop] == undefined)
                sumObj[prop] = json[prop];
            else
                {
                sumObj[prop] += json[prop]
                }
            }
        return sumObj
        },{})
    TextWindow.Open()
    TextWindow.Print('Runs: ' + linesLength)
    for(prop in red)
        {
        var average = (red[prop] / linesLength).toFixed(2)
        TextWindow.Print(prop + ': ' + average)
        }
    }