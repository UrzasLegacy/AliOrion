function initScripts()
	{
	//Orion.MoveGump('container',0,0,backpack)
	Orion.Exec('JournalScan', true);
	Orion.Exec('OniScav', true);
	Orion.Exec('Preservation', true);
	}

function TrashMaps()
	{
	var trash = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
		{
		return Orion.Contains(item.Properties(),'trash');
		})[0];
	if(!trash)
		return Orion.CharPrint(self,1159,'No trash nearby!');
	var trashSerial = trash.Serial();
	var map = Orion.FindType('0x14EB',any,Player.BankSerial())[0];
	while(map)
		{
		Orion.MoveItem(map,0,trashSerial);
		Orion.Wait(1000);
		map = Orion.FindType('0x14EB',any,Player.BankSerial())[0];
		}
	}

function MoveJunkFromBank()
	{
	var junk = Orion.FindTypeEx(any,any,Player.BankSerial()).filter(function(item)
		{
		return !Orion.Contains(item.Properties(), 'Fragment|Essence|Contents|Blessed|Treasure Map|Goblin Blood|Boura Pelt|Reflective Wolf|Raptor|Slith|Brilliant Amber|Chisels')
		})[0];
	while(junk)
		{
		Orion.MoveItem(junk.Serial());
		Orion.Wait(1000);
		junk = Orion.FindTypeEx(any,any,Player.BankSerial()).filter(function(item)
			{
			return !Orion.Contains(item.Properties(), 'Fragment|Essence|Contents|Blessed|Treasure Map|Goblin Blood|Boura Pelt|Reflective Wolf|Raptor|Slith|Brilliant Amber|Chisels')
			})[0];
		}
	}

function OniScav()
	{
	Orion.Exec('OniScavGump', true);
	Orion.ResumeScript('OniScavGump');
	var memoryMS = 600000;
	var allNames = Orion.CreateClientMacro('AllNames')
	var corpseQueue = [];
	var corpseHash = {};
	if(Orion.GetDistance(170,650) > 50)
		WalkThroughCurrentFarm();
	var startX = Player.X();
	var startY = Player.Y();
	while(true)
		{
		if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
			{
			DropOff();
			WalkThroughCurrentFarm();
			}
		allNames.Play();
		for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
			var msgSerial = msg.Serial();	
			if(msg.Text() == 'an oni corpse' && msg.Flags() == 0x08 && msg.Color() == '0x03B2' && !corpseHash[msgSerial])
				{
				Orion.Print(msg.Text());
				var corpseObj = Orion.FindObject(msgSerial);
				var corpseX = corpseObj.X();
				var corpseY = corpseObj.Y();
				var arr = [msgSerial, corpseX, corpseY];
				corpseQueue.push(arr);
				corpseHash[msgSerial] = Orion.Now();
				}
			}
		Orion.Print('Corpses in queue: ' + corpseQueue.length);
		while(corpseQueue.length)
			{
			if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
				{
				DropOff();
				WalkThroughCurrentFarm();
				break;
				}
			var corpseArr = corpseQueue.shift();
			var corpseSerial = corpseArr[0];
			var corpseX = corpseArr[1];
			var corpseY = corpseArr[2];
			var corpse = Orion.FindObject(corpseSerial);
			if(!corpse || !corpse.Exists())
				continue;
			var endTime = Orion.Now() + 5000
			while(Orion.GetDistance(corpseX,corpseY) > 2 && Orion.Now() < endTime)
				{
				Orion.CharPrint(self,1159,'Walking to corpse');
				Orion.WalkTo(corpseX,corpseY);
				Orion.Wait(200);
				}
			var endTime = Orion.Now() + 5000
			while(!Orion.GumpExists('container',corpseSerial) && Orion.Now() < endTime)
				{
				if(!corpse || !corpse.Exists() || corpse.Distance() > 20)
					break;
				Orion.CharPrint(self,1159,'Opening corpse container');
				Orion.Print(corpse.Properties() + ':' + corpse.Distance())
				Orion.UseObject(corpseSerial);
				Orion.Wait(1000);
				}
			var items = Orion.FindTypeEx(any,any,corpseSerial).filter(function(item)
				{
				if(Orion.Contains('0x0EED|0x14EB', item.Graphic()))
					return true;
				var itemProps = item.Properties();
				if(Orion.Contains(itemProps, 'Artifact'))
					return true;
				if(!Orion.Contains(itemProps, 'Magic'))
					return false;
				var weight = +((itemProps.match(/Weight: (\d+)/) || [])[1] || 0)
				if(weight >= 50)
					return false;
				return UnravelEval(itemProps) >= 550;
				});
			Orion.Print('Items on corpse: ' + items.length);
			while(items.length)
				{
				if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
					break;
				Orion.CharPrint(self,1159,'Moving item');
				Orion.MoveItem(items[0].Serial());
				Orion.Wait(1000);
				items = Orion.FindTypeEx(any,any,corpseSerial).filter(function(item)
					{
					if(Orion.Contains('0x0EED|0x14EB', item.Graphic()))
						return true;
					var itemProps = item.Properties();
					if(Orion.Contains(itemProps, 'Artifact'))
						return true;
					if(!Orion.Contains(itemProps, 'Magic'))
						return false;
					var weight = +((itemProps.match(/Weight: (\d+)/) || [])[1] || 0)
					if(weight >= 50)
						return false;
					var itemProps = item.Properties();
					return UnravelEval(itemProps) >= 550;
					});
				Orion.Print('Items on corpse: ' + items.length);
				}
			Shared.AddVar('OniLooted',Shared.GetVar('OniLooted') + 1)
			}
		Orion.ClearJournal();
		if(Orion.GetDistance(startX,startY) > 2)
			{
			Orion.CharPrint(self,1159,'Walking back to starting location');
			Orion.WalkTo(startX,startY);
			}
		Orion.Wait(1000);
		Shared.AddVar('LastHashLength',Object.keys(corpseHash).length)
		var cullTime = Orion.Now() - memoryMS;
		for(var hash in corpseHash)
			{
			if(corpseHash[hash] < cullTime)
				delete corpseHash[hash]
			}
		}
	}

	function testCall()
    {
    TextWindow.Open();
    TextWindow.Clear();
    Orion.WaitForAddObject('myTarget');
    var a = Orion.FindObject('myTarget');
    var startTime = Orion.Now();
    Orion.Print(UnravelEval(a.Properties()))
    Orion.Print('Processing time = ' + (Orion.Now()-startTime) + 'ms');
    }

function UnravelEval(itemProperties)
	{
    var propertiesList = 
        [
            ['Physical Resist', 6],
            ['Fire Resist', 6],
            ['Cold Resist', 6],
            ['Poison Resist', 6],
            ['Energy Resist', 6],
            ['Damage Eater', 15],
            ['Kinetic Eater', 6],
            ['Fire Eater', 6],
            ['Cold Eater', 6],
            ['Poison Eater', 6],
            ['Energy Eater', 6],
            ['Enhance Potions', 4],
            ['Damage Increase', 2],
            ['Swing Speed Increase', 3.6],
            ['Defense Chance Increase', 7.33],
            ['Hit Chance Increase', 8.66],
            ['Strength Bonus', 13.75],
            ['Dexterity Bonus', 13.75],
            ['Intelligence Bonus', 13.75],
            ['Hit Point Increase', 22],
            ['Stamina Increase', 13.75],
            ['Mana Increase', 13.75],
            ['Hit Point Regeneration', 50],
            ['Stamina Regeneration', 33.33],
            ['Mana Regeneration', 50],
            ['Casting Focus', 40], //25
            ['Faster Cast Recovery', 40],
            ['Faster Casting', 140],
            ['Lower Mana Cost', 13.75],
            ['Lower Reagent Cost', 5],
            ['Spell Damage Increase', 8.33],
            ['Luck', 1],
            ['Reflect Physical Damage', 6.66],
            ['Night Sight', 100],
            ['Spell Channeling', 100],
            ['Lower Requirements', 1],
            ['Durability', 1],
            ['Reactive Paralyze', 140],
            ['Battle Lust', 100],
            ['Blood Drinker', 100],
            ['Splintering Weapon', 7.5],
            ['Mage Weapon', 10],
            ['Use Best Weapon Skill', 150],
            ['Hit Poison Area', 2],
            ['Hit Physical Area', 2],
            ['Hit Fire Area', 2],
            ['Hit Energy Area', 2],
            ['Hit Cold Area', 2],
            ['Hit Stamina Leech', 2],
            ['Hit Mana Leech', 2.2],
            ['Hit Life Leech', 2.2],
            ['Hit Magic Arrow', 2.4],
            ['Hit Lower Defense', 2.6],
            ['Hit Lower Attack', 2.2],
            ['Hit Lightning', 2.8],
            ['Hit Harm', 2.2],
            ['Hit Fireball', 2.8],
            ['Hit Dispel', 2],
            ['Hit Mana Drain', 2.5],
            ['Hit Fatigue', 2.5],
            ['Velocity', 2.8],
            ['[\\w ]+Slayer', 110],
            ['Balanced', 100],
            ['[\\w ]+\\+', 9],
        ]
    var weight = 0;
    var outMsg = '';
    var numMods = 0;
    var duraModifier = 1;
    var durability = +((itemProperties.match(/Durability (\d+)/) || [])[1] || 0)
    if(durability && durability < 50)
        duraModifier = 1 - ((50 - durability) * .02)
    outMsg += itemProperties + '\n\n';
    var itemPropLines = itemProperties.split(/\r?\n/);
    for(var i=0;i<itemPropLines.length;i++)
        {
        var prop = itemPropLines[i];
        if(Orion.Contains(prop, 'Durability'))
            {
            if(!Orion.Contains(prop, '+'))
                continue;
            }
        for(var ii=0;ii<propertiesList.length;ii++)
            {
            var propPair = propertiesList[ii];
            var regex = "^" + propPair[0] + "\\s?(-?\\+?\\d+)?";
            var outcome = prop.match(regex);
            if(outcome)
                {
                if(outcome[1] == undefined)
                    outcome[1] = 1;
                numMods++;
                var weightMultiplier = propPair[1];
                if(Orion.Contains(propPair[0], 'Resist') && !Orion.Contains(itemProperties, 'Ring|Bracelet'))
                    {
                    if(+outcome[1] < 6)
                        {
                        numMods--;
                        continue;
                        }
                    outcome[1] = Math.max(+outcome[1] - 5, 0);
                    }
                else if(Orion.Contains('Balanced|Damage Increase|Spell Channeling|Faster Casting|Mage Weapon|[\\w ]+Slayer|[\\w ]+\\+', propPair[0]))
                    {
                    if(propPair[0] == 'Damage Increase')
                        { 
                        if(Orion.Contains(itemProperties, 'Ring|Bracelet'))
                            weightMultiplier = 4;
                        }
                    else if(propPair[0] == 'Spell Channeling')
                        {
                        if(!Orion.Contains(itemProperties, 'Faster Casting -1'))
                            weightMultiplier = 240;
                        }
                    else if(propPair[0] == '[\\w ]+\\+' && Orion.Contains(prop, 'Durability'))
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Faster Casting' && outcome[1] == '-1')
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Mage Weapon')
                        {
                        outcome[1] = +outcome[1] + 30;
                        }
                    else if(propPair[0] == '[\\w ]+Slayer')
                        {
                        Orion.Print(propPair[0])
                        if(Orion.Contains(prop, 'Undead|Reptile|Repond|Fey|Elemental|Demon|Arachnid'))
                            weightMultiplier = 140;
                        }
                    else if(propPair[0] == 'Balanced')
                        {
                        if(Orion.Contains(itemProperties, 'Skill Required: Archery'))
                            weightMultiplier = 150;
                        }
                    }
                var add = +outcome[1] * weightMultiplier
                weight += add;
                outMsg += propPair[0] + ': ' + outcome[1] + '*' + weightMultiplier + ' = ' + add + '\n';
                }
            }
        }
    outMsg += '\nNumber of Mods: ' + numMods;
    if(numMods > 5)
        {
        weight = ((weight/numMods)*5 + 30) * duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\n((Total Weight \\ ' + numMods + ') * 5) * ' + duraModifier + ' = ' + weightRounded;
        }
    else
        {
        weight = (weight + 30)*duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\nTotal Weight * ' + duraModifier + ': ' + weightRounded;
        }
    //TextWindow.Print(outMsg);
    return weightRounded;
    }


function OniScavGump()
    {
    var startTime = Orion.Now();
    Shared.AddVar('OniLooted', 0);
    Shared.AddVar('fragCount',0)
	Shared.AddVar('essenceCount',0)
	Shared.AddVar('goldCount',0)
	Shared.AddVar('LastHashLength',0)
    while(true)
        {
        if(!Orion.ScriptRunning('OniScav'))
        	Orion.PauseScript('OniScavGump');
    	var gump = Orion.CreateCustomGump(11001);
        var sec = Orion.Now() - startTime;
        var date = new Date(sec);
        var time = date.toISOString().substring(11, 19);
        var divisor = 1/(sec/3600000);
        var oniLooted = Shared.GetVar('OniLooted');
        var fragmentsLooted = Shared.GetVar('fragCount');
        var essencesLooted = Shared.GetVar('essenceCount');
        var goldLooted = Shared.GetVar('goldCount');
        var lastHashLength = Shared.GetVar('LastHashLength');
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 160, 190);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(95, 10, "0", time);
        gump.AddText(10, 25, "0",'Onis Looted: ');
        gump.AddText(95, 25, "0",  oniLooted);
        gump.AddText(10, 40, "0",'Looted/hr: ');
        gump.AddText(95, 40, "0",(oniLooted * divisor).toFixed(1));
        gump.AddText(10, 55, "0",'Fragments: ');
        gump.AddText(95, 55, "0",  fragmentsLooted);
        gump.AddText(10, 70, "0",'Frags/hr: ');
        gump.AddText(95, 70, "0",(fragmentsLooted * divisor).toFixed(1));
        gump.AddText(10, 85, "0",'Essences: ');
        gump.AddText(95, 85, "0",  essencesLooted);
        gump.AddText(10, 100, "0",'Essence/hr: ');
        gump.AddText(95, 100, "0",(essencesLooted * divisor).toFixed(1));
        gump.AddText(10, 115, "0",'Gold: ');
        gump.AddText(95, 115, "0",  goldLooted);
        gump.AddText(10, 130, "0",'Gold/hr: ');
        gump.AddText(95, 130, "0",(goldLooted * divisor).toFixed(1));
        gump.AddText(10, 160, "0",'Hash #: ');
        gump.AddText(95, 160, "0",lastHashLength);
        gump.Update();
        Orion.Wait(500);
        }
    }

function PlayerDetector()
	{
	var memoryMS = 60000; //how long to ignore a player after detecting them.
	var scanFrequencyMS = 100; //how often to scan for players.
    var flag = true;
	//Orion.GetIgnoreList('PlayerDetectorIgnoreList');
	//Orion.ClearIgnoreList('PlayerDetectorIgnoreList');
	var playersDetected = {};
	var gumpWidth = 200;
	var gumpHeight = 30;
	var gumpHeightOffset = 15;
	var line;
	while(true)
		{
        if(Orion.InJournal('initfarm'))
            {
            flag = true;
            Orion.ClearJournal('initfarm');
            }
		var startTime = Orion.Now();
		var players = Orion.FindTypeEx('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'ignoreself',24,'blue|orange|gray')
			.filter(function(npcCheck)
				{
				if(!npcCheck.ProfileReceived())
					Orion.GetProfile(npcCheck.Serial());
				//if(!npcCheck.ProfileReceived())
				//	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
				return npcCheck.ProfileReceived() || npcCheck.Dead();
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
			{
            if(flag)
                {
			    //Orion.SayAlliance('inithome');
                flag = false;
                }
			DiscordPush('Players Detected on ' + Orion.ShardName() + ': ' + deltaPlayers);
			}
		var deltaTime = Orion.Now() - startTime;
		Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
		}
	}

function Preservation()
    {
    while(!Player.Dead())
        {
        if(!Orion.BuffExists('Protection'))
        	Orion.Cast('Protection');
        else if(Player.Poisoned())
            {
            Orion.Cast('Cure');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
            }
        else if(Player.Hits('%') < 70)
        	{
        	Orion.Cast('Greater Heal');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
        	}
        Orion.Wait(500);
        }
    }

function gumptest()
	{
	Orion.Print(CheckGumpCliloc('0x00000320', '@@#1112537'))
	}
	
function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}
	
function FindOwnCorpse()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var body = Orion.FindTypeEx(any, any, ground, 'ignoreself', 24).filter(function(part)
                {
                return Orion.Contains(part.Properties(), _pName)
                });
    if(Orion.WalkTo(body[0].X(), body[0].Y()))
        Orion.UseObject(body[0].Serial());
    }
    
function RelicTurnin()
	{
	while(true)
		{
		while(Orion.Count('0x2DB3') < 50)
			{
			if(Player.X() != 2889 && Player.Y() != 680)
				RecallByGump('Main','Bank','Main','Bank2');
			while(!Orion.GumpExists('container', Player.BankSerial()))
				{
				Orion.Say('bank');
				Orion.Wait(1300);
				}
			var chisels = Orion.FindType('0x12B3')[0];
			while(chisels)
				{
				Orion.MoveItem(chisels,0,Player.BankSerial());
				Orion.Wait(1300);
				chisels = Orion.FindType('0x12B3')[0];
				}
			var frags = Orion.FindType('0x2DB3',any,Player.BankSerial())[0];
			Orion.MoveItem(frags,500 - Orion.Count('0x2DB3'),backpack);
			Orion.Wait(1300);
			if(Player.Weight() > Player.MaxWeight())
				{
				var items = Orion.FindTypeEx(any).filter(function(item)
					{
					return !Orion.Contains(item.Properties(),'blessed|contents:')
					});
				while(items[0])
					{
					Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
					Orion.Wait(1300);
					items = Orion.FindTypeEx(any).filter(function(item)
						{
						return !Orion.Contains(item.Properties(),'blessed|contents:')
						});
					}
				}
			}
		if(Player.X() != 798 && Player.Y() != 3434)
			RecallByGump('Main','Soulforge','Main','Soulforge2');
		while(Orion.Count('0x2DB3') >= 50)
			{
			var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
				{
				return Orion.Contains(check.Properties(), 'Ansikart the Artificer');
				})[0];
			if(!npc)
				return Orion.CharPrint('Quest NPC not nearby! Halting...');
			Orion.UseObject(npc.Serial());
			var time = Orion.Now();
			if(Orion.WaitForGump(2000))
				{
				Orion.Wait(250);
				if(CheckGumpCliloc('0x00000320', '@@#1112537'))
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
						}
					//Orion.Wait(1300 - (Orion.Now() - time));
					Orion.WaitContextMenuID('0x034EBD6D', 801);
					Orion.RequestContextMenu('0x034EBD6D');
					time = Orion.Now();
					if(Orion.WaitForTarget(2000))
						{
						Orion.TargetType('0x2DB3');
						Orion.Wait(200);
						if(Orion.WaitForTarget(2000))
							Orion.CancelTarget();
						}
					Orion.Wait(1300 - (Orion.Now() - time));
					Orion.UseObject(npc.Serial());
					if (Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x0000032A');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(4));
							Orion.Wait(100);
							}
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000323');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(1));
							Orion.Wait(100);
							}
						}
					}
				else
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(2));
						Orion.Wait(100);
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000326');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(3));
							Orion.Wait(100);
							}
						}
					Orion.Wait(1300);
					}
				}
			}
		if(Orion.FindType('0x0E75'))
			{
			if(Player.X() != 2889 && Player.Y() != 680)
				RecallByGump('Main','Bank','Main','Bank2');
			var chiselBackpacks = Orion.FindTypeEx('0x0E75').filter(function(chiselBackpack)
				{
				return !Orion.Contains(chiselBackpack.Properties(), 'Contents: 1/');
				});
			for(var i=0;i<chiselBackpacks.length;i++)
				{
				var pack = chiselBackpacks[i];
				var packSerial = pack.Serial();
				while(!Orion.GumpExists('container',packSerial))
					{
					Orion.UseObject(packSerial);
					Orion.Wait(1300);
					}
				var chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
				while(chiselInBackpack)
					{
					Orion.MoveItem(chiselInBackpack);
					Orion.Wait(1300);
					chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
					}
				}
			var trash = Orion.FindTypeEx(any,any,ground,'item').filter(function(trashCheck)
				{
				return Orion.Contains(trashCheck.Properties(), 'trash')
				})[0];
			if(!trash)
				return Orion.CharPrint(self,1159,'Trash barrel missing! Halting...');
			var leftOverPacks = Orion.FindType('0x0E75')[0];
			while(leftOverPacks)
				{
				Orion.MoveItem(leftOverPacks,0,trash.Serial());
				Orion.Wait(1300);
				leftOverPacks = Orion.FindType('0x0E75')[0];
				}
			}
		}
	}

function AmberTurnin()
	{
	while(Orion.FindType('0x3199')[0])
		{
		var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
			{
			return Orion.Contains(check.Properties(), 'Ansikart the Artificer');
			})[0];
		if(!npc)
			return Orion.CharPrint('Quest NPC not nearby! Halting...');
		Orion.UseObject(npc.Serial());
		if(Orion.WaitForGump(2000))
			{
			Orion.Wait(250);
			if(CheckGumpCliloc('0x00000320', '@@#1113772'))
				{
				var gump = Orion.GetGump('any', '0x00000320');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(1));
					Orion.Wait(100);
					}
				Orion.WaitContextMenuID(self, 801);
				Orion.RequestContextMenu(self);
				var time = Orion.Now();
				if(Orion.WaitForTarget(2000))
					{
					Orion.TargetType('0x3199');
					Orion.Wait(200);
					if(Orion.WaitForTarget(2000))
						Orion.CancelTarget();
					}
				Orion.Wait(1300 - (Orion.Now() - time));
				Orion.UseObject(npc.Serial());
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x0000032A');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(4));
						Orion.Wait(100);
						}
					}
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x00000323');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
						}
					}
				Orion.Wait(500);
				var rewardBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
					{
					return Orion.Contains(bag.Properties(), 'Contents: 1/125');
					})[0];
				while(rewardBag)
					{
					var rewardBagSerial = rewardBag.Serial();
					while(!Orion.GumpExists('container', rewardBagSerial))
						{
						Orion.UseObject(rewardBagSerial);
						Orion.Wait(1300);
						}
					var reward = Orion.FindType(any,any,rewardBagSerial)[0];
					while(reward)
						{
						Orion.MoveItem(reward);
						Orion.Wait(1300);
						reward = Orion.FindType(any,any,rewardBagSerial)[0];						
						}
					rewardBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
						{
						return Orion.Contains(bag.Properties(), 'Contents: 1/125');
						})[0];
					}
				var emptyBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
					{
					return Orion.Contains(bag.Properties(), 'Contents: 0/125');
					})[0];
				while(emptyBag)
					{
					var emptyBagSerial = emptyBag.Serial();
					var dropBag = Orion.FindTypeEx('0x0E76',any,ground,'item',2).filter(function(bag)
						{
						return !Orion.Contains(bag.Properties(), 'Contents: 125/125');
						})[0];
					if(!dropBag)
						{
						Orion.Drop(emptyBagSerial, 0, Player.X(), Player.Y() + 1, -1);
						Orion.Wait(1300);
						}
					else
						{
						Orion.MoveItem(emptyBagSerial,0,dropBag.Serial());
						Orion.Wait(1300);
						}
					emptyBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
						{
						return Orion.Contains(bag.Properties(), 'Contents: 0/125');
						})[0];
					}
				}
			else
				{
				var gump = Orion.GetGump('any', '0x00000320');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(2));
					Orion.Wait(100);
					}
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x00000326');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(3));
						Orion.Wait(100);
						}
					}
				Orion.Wait(1300);
				}
			}
		}
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

function DropOff()
	{
	RecallByGump('Main','Soulforge','Main','Soulforge2');
	Orion.Wait(2000);
	var currentWeight = Player.Weight();
	while(Player.Weight() == currentWeight)
		{
		Orion.UseSkill('Imbuing');
		if(Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E93'))
				{
				gump0.Select(Orion.CreateGumpHook(6));
				Orion.Wait(100);
				}
			}
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(backpack);
		if(Orion.WaitForGump(2000))
			{
			var gump1 = Orion.GetGump('last');
			if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000F3E95'))
				{
				gump1.Select(Orion.CreateGumpHook(1));
				Orion.Wait(100);
				}
			}
		Orion.Wait(2000);
		}
	RecallByGump('Main','Bank','Main','Bank2');
	while(!Orion.GumpExists('container',Player.BankSerial()))
		{
		Orion.Say('bank')
		Orion.Wait(500);
		}
	var frags = Orion.FindTypeEx('0x2DB3')[0];
	if(frags)
		{
		Shared.AddVar('fragCount',Shared.GetVar('fragCount') + frags.Count())
		}
	var essences = Orion.FindTypeEx('0x2DB2')[0];
	if(essences)
		{
		Shared.AddVar('essenceCount',Shared.GetVar('essenceCount') + essences.Count())
		}
	var gold = Orion.FindTypeEx('0x0EED')[0];
	if(gold)
		{
		Shared.AddVar('goldCount',Shared.GetVar('goldCount') + gold.Count())
		}
	var items = Orion.FindTypeEx(any).filter(function(item)
		{
		return !Orion.Contains(item.Properties(),'blessed|contents:')
		});
	while(items[0])
		{
		Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
		Orion.Wait(1300);
		items = Orion.FindTypeEx(any).filter(function(item)
			{
			return !Orion.Contains(item.Properties(),'blessed|contents:')
			});
		}
	}

function WalkThroughCurrentFarm()
	{
	Orion.Terminate('all', 'OniScav|OniScavGump|Preservation|JournalScan');
	//if(profile.walkThrough == 'Oni')
		{	
		RecallByGump('Main','Dojo', 'Main', 'Dojo2');
		WalkThrough([[987, 196, false, '67:337:w'],[66, 352, false, '63:524:w'],[103, 556, false, '76:691:w'],[176, 664, '176:664:w']]);
		}
	Orion.Wait(1000);
	Orion.Cast('Invisibility');
	if(Orion.WaitForTarget(6000))
		Orion.TargetObject(self);
	Orion.Wait(500);
	Orion.Exec('initScripts', true);
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


function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X();
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName;
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
	
function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}
	
function JournalScan()
	{
	var useDiscordPush = true
	var msg = 'GM|inithome|initfarm'
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0);
		var checkarr = Orion.Split(check.Text(), ' ')
		for(var i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{		
				case 'GM':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": GM")
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(6000);
					break;
				case 'inithome':
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(2000);
					Orion.Exec('RecallByGump', true, ['Main','Home']);
					break;
				case 'initfarm':
					Orion.Terminate('all', 'OniScav|OniScavGump|JournalScan');
					Orion.Exec('WalkThroughCurrentFarm', true);
					break;
				default:
					break;
				}
			}
		}
	}

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ '1022287622137200660' //hook
	+ "/"
	+ 'w0Nsz8IXTJK2ZcJM0hntdlPMeeLKOLSMweHtBhWb7-0vUI8-lvZdkVUUv10r08_vUJMl'; //key
	Orion.HttpPost(bot, "content=" + message);
	}

function test2()
	{
	var allNames = Orion.CreateClientMacro('AllNames')
	var corpseHash = {};
	while(true)
		{
		allNames.Play();
		var corpse = false;
		for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
			var msgSerial = msg.Serial();	
			if(msg.Flags() == 0x08 && msg.Color() == '0x03B2' && !corpseHash[msgSerial])
				{
				Orion.Print(msg.Text());
				corpse = Orion.FindObject(msgSerial);
				}
			}
		Orion.ClearJournal();
		Orion.Wait(1000);
		if(corpse)
			{
			
			corpseHash[msgSerial] = Orion.Now();
			}
		var cullTime = Orion.Now() - 3000;
        var i = 0
		for(var hash in corpseHash)
			{
            Orion.Print(i++)
			if(corpseHash[hash] < cullTime)
				delete corpseHash[hash]
			}
		}
	}


function LootCorpses()
    {
    var lootToBackpack = true;
    var lootBagType = '';
	var corpseGraphic = '0x2006';
    var useLootCorpses = true;
    var hashtable = {};
	if(useLootCorpses)
        {
		var corpses = Orion.FindTypeEx(corpseGraphic, any, ground, "", 20).filter(function(corpse)
            {
            var corpseSerial = corpse.Serial();
            if(hashtable[corpseSerial])
                return false;
            Orion.Click(corpseSerial)
            var publicCheck = Orion.WaitJournal('A Oni Corpse', Orion.Now() - 500, Orion.Now() + 500, 'item', corpseSerial, '0x03B2');
            return Orion.Contains(corpse.Properties(), 'A Oni Corpse') && publicCheck;
            });
		if(!corpses.length)
	        return;
	    var corpseId = corpses[corpses.length - 1];
		if(!corpseId.IsCorpse())
            {
			Orion.Ignore(corpseId.Serial());
			return;
		    }
		WaitForObjectTimeout();
		Orion.OpenContainer(corpseId.Serial());
		lastObjectUsedTime = Orion.Now();
		Orion.Wait(1300);
		Orion.Print("Start Evaluate Item")
		var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
		var lootbag = lootToBackpack ? Orion.GetSerial(backpack) : Orion.FindType(lootBagType, 'any', 'backpack')[0];
		itemsInCorpse.forEach(function(item)
            {
			var itemInstance = Orion.FindObject(item);
			if(itemInstance && itemInstance.Container() !== Player.Container() &&  itemInstance.Container() !== lootbag)
                {
				Orion.Print("Evaluate Item");
				if(ShouldKeepItem(item))
                    {
					WaitForObjectTimeout()
					var movedItem = Orion.FindObject(item);
					if(lootbag)
                        {
						Orion.MoveItem(item, 1000, lootbag);
					    }
					else
                        {
						Orion.MoveItem(item, 1000, 'backpack');
					    }
					var waitForLootbagIndex = 0;
					while(movedItem.Container() !== lootbag && waitForLootbagIndex < 15)
                        {
						waitForLootbagIndex++;
						Orion.Wait(100);
					    }
                    lastObjectUsedTime = Orion.Now();
					//if(useInsureItem)
                        //{
						//InsureItem(item);
					    //}
				    }
				Orion.Ignore(item);
			    }				
		    });
		Orion.Print("Finish Evaluate Items");
		Orion.Ignore(corpseId.Serial());
        }
    }