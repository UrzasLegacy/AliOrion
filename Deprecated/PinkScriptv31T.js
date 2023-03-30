var Version = '31'
//PATCH NOTES
//v1 framework
//v2 forEach => for loop
//v3 check multiple npcs
//v4 gump
//v5 fixed purchase overflow, avoid tailor guildmasters, add GM scan
//v6 out of stock quickfix, dropoff
//v7 added alchemist, added additional check for moongate
//v8 setup instructions, drop pinks to pinkbooks based on capacity
//v9 block walking on house stairs, enable auto open doors
//v10 context menu buying, added tinker, added baker, added jeweler, added multi-city start functionality (skara and brit)
//v11 double entry item fix: should purchase correct number of robes/heating stands/etc, added weaponsmith
//v12 will seek out alternate professions if first are out of stock, if all professions are out of stock, cancels the crate.
//v13 changed Pink Gump tracking: should store variables even if the main script fails
//v14 fixed hair dye bug, additional debug messages, character city assignment by name. Check user variables!
//v15 restructured function order, added autostart function, added extra hotkey functions, now walks to within 5 tiles of the vendors instead of 1, gump pauses
//v16 added jhelom (not fully finished), added new mag
//v17 ping adjusted wait times
//v18 changed drop off so it fills pink books one by one instead of evenly distributing, strengthened pathfinding when walking to destination minister
//v19 updated recall system. See SETUP for details. added info text above characters heads
//v20 added moonglow, refactored profession iterations
//v21 added stealth, added check to search for pink books to determine when you've stepped into your drop house
//v22 added stealth running, set stealth by char name, move away from minister after turning in order (if hidden), move to start minister (set start city rune away from the minister), gump additions
//v23 removed stealth running, increased distance to access context menu to 7, adjusted timings for purchasing items to be slightly faster, auto open doors off
//v24 added name assignment for reconnect and autostart
//v25 sonoma trinsic hotfix
//v26 debug message toggle, added hiding and animal form checks at each vendor, added doorway avoidance
//v27 stability changes, updated doorway avoidance
//v28 updated GMJournalScan
//v29 updated GMJournalScan again, will now detect GM characters that appear instead of just GM chat messages. Will no longer throw away containers during drop off
//v30 removed autostart and reconnect configuration. Must now set these options manually in the OA. Fixed issue with pathfinding blocking autostart from starting main script on relog.
//v31 will now hide and go into animal form before all pathfinding, consolidated global scope arrays to Shared to reduce RAM usage, updated gump timer for performance

//KNOWN ISSUES
//1. When an odd number of an item with double vendor entries is requested, you'll end up with 1 extra of that item in your pack afterwards.
//2. Sometimes if an npc is blocking a door and keeping it open in your path, pathfinding will get stuck and your character will stand there endlessly trying to close it. SOFT LOCK
//3. On rare occasions, the weight of the contents of the crate can far exceed your characters weightBuffer. If this happens and you need to cancel, it will overencumber you. SOFT LOCK
//4. Need to add tanner npc (cut leather)

//SETUP
//Have a runebook in your pack named 'First' with a rune to your drop off location named 'Drop' and a rune to your trade minister named the city's proper name e.g. 'Britain', 'Skara Brae', etc.
//Have a second runebook in your pack named 'Second' with runes to the same locations several tiles away from the first as a backup in case your first rune is blocked. Same naming scheme for runes.
//The recall locations for the cities should be within 20 steps of the trade minister.
//The recall location for 'Drop' should be within 2 steps of your front porch such that taking 3 steps north will load the contents of your house. 
//From there the script will search within 6 tiles for a pink book, a trash barrel, and a commodity  deed box.
//Make sure the trash barrel is secured to surpass the weight limit and that all containers are set to the proper security. When dropping off, the script will drop pinks
//  into the pink books first, then resources into the commodity deed box, and after that, everything in your pack that isn't blessed will be thrown in the trash.
//Set a keybind to activate the 'initPinkScript' function. 
//Your character needs enough magery to cast Recall or chivalry to cast Sacred Journey (65+ skill for either). It's preferable to use humans for the extra carry capacity.

//--USER VARIABLES
//if your character name isn't listed below, they will start from Skara Brae by default. Separate character names with |.
var skaraBot = 'Annalise|Beclesia|Coeur|Deyes|Ephie|Finsta|Gwinn|Haichiu|Azziya|Busca|Cabria|Doja|TrashOne|TrashTwo|TrashThree|TrashFour|Trink|Protatoes|Moxaction|Purified|trix|Sirius|Pablo|Stanton|Craniax' 
var britBot = ''
var glowBot = 'Knuckles|Raza|Malice'
var newmagBot = ''

//list character names here if you want them to run in stealth
var stealthBot = 'Annalise|Beclesia|Coeur|Deyes|Ephie|Finsta|Gwinn|Haichiu|Azziya|Busca|Cabria|Doja|TrashOne|TrashTwo|TrashThree|TrashFour|Trink|Protatoes|Moxaction|Purified|trix|Sirius|Pablo|Stanton|Craniax|Knuckles|Raza|Malice' //need 100 hiding/100 stealth/100 ninjitsu.

var weightBuffer = 300  //Once your weight reaches (Max Weight - weightBuffer) you will recall back to your drop off. If all vendors are out of stock of something,
                        //it'll cancel the crate and spill everything into your bag, potentially overencumbering you if your weightBuffer isn't high enough.
var debugMessages = false //set to true to print debug messages to a TextWindow.
//--END


//--#Hotkey Functions
function initPinkScript()
    {
    //This function will turn on GM scan and the gump if they aren't already and will toggle the main script on and off.
    //The gump will pause automatically if the main script isn't running and will resume when the main script is started again.
    initVars();
    Orion.Exec('GMJournalScan', true);
    if(Orion.ScriptRunning('PinkScript'))
        Orion.Terminate('PinkScript')
    else
        Orion.Exec('PinkScript', true);
    Orion.Exec('PinkGump', true);
    }

function resetPinkGump()
    {
    //This function will reset your gump statistics.
	Orion.Terminate('PinkGump');
	Orion.Wait(1000);
	Orion.Exec('PinkGump', true);
    }

function DropDraggedToContainer()
	{
    //if you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //if you press the hotkey while dragging an item, it will drop the item into your designated drop container.
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}

function LogOut()
    {
    //This function will log you out and disable autoreconnect.
    Orion.OAOptionSet('AutoReconnect', 0);
    Orion.LogOut();
    }

function DropOff()
    {
    //This function will recall you to your drop location and empty the contents of your pack except for blessed items
    Orion.WarMode(0);
    RecallByGump('First', 'Drop', 'Second', 'Drop');
    while(!Orion.FindType('0x577E|0x577F',any,ground, '', 6).length)
        {
        Orion.Step('n');
        WaitPingAdjusted(100);
        }
    WaitPingAdjusted(1000);
    for(var attempt=0;attempt<2;attempt++)
        {
        var pinks = Orion.FindTypeEx(0x14EF,0x0490);
        for(var i=0;i<pinks.length;i++)
           {
           var pinkbook = Orion.FindTypeEx(any,any,ground, '', 6).filter(function(part)
               {
               return Orion.Contains(part.Properties(), 'Transcendence Book') && !Orion.Contains(part.Properties(), '300/300');
               }).sort(function(b,a)
                          {
                          var aCount = a.Properties().match(/Scrolls In Book: (\d+)\/300/)[1];
                          var bCount = b.Properties().match(/Scrolls In Book: (\d+)\/300/)[1];
                          return Number(aCount) - Number(bCount);
                          })[0];
            if(Orion.GetDistance(pinkbook.X(),pinkbook.Y()) > 2)
               Orion.WalkTo(pinkbook.X(),pinkbook.Y(),pinkbook.Z());
            Orion.MoveItem(pinks[i].Serial(),0,pinkbook.Serial());
            var pinkProps = pinks[i].Properties()
            var pinkInfo = pinkProps.match(/Skill: ([\w ]+ \d.\d)/)[1]
            Orion.CharPrint(self, 1159, pinkInfo);
            WaitPingAdjusted(1000);
            }
        }
    for(var attempt=0;attempt<2;attempt++)
        {
        var commbox = Orion.FindTypeEx(any,any,ground, '', 6).filter(function(part)
           {
           return Orion.Contains(part.Properties(), 'Commodity Deed Box');
           })[0];
        Orion.WalkTo(commbox.X(),commbox.Y());
        var resources = Orion.FindTypeEx('0x1BF2|0x1BD7|0x1081|0x1779|0x26B4');//ingots,boards,leather,dragonscales,granite
        resources.forEach(function(part)
                    {
                    Orion.MoveItem(part.Serial(),0,commbox.Serial());
                    WaitPingAdjusted(1000);
                    });
        var imbuing = Orion.FindTypeEx('0x3191|0x3190|0x3199|0x3196|0x3194|0x3192|0x3195|0x3197|0x3193|0x3198|0x2DB3|0x2DB2|0x2DB1'); //luminfungi,parasiticplant, brilliantamber,whitepearl,perfemerald,darksapphire,ecrucitrine,fireruby,turquoise,bluediamond,relicfrag,enchantessence,magicresidue
        imbuing.forEach(function(part)
                    {
                    Orion.MoveItem(part.Serial(),0,commbox.Serial());
                    WaitPingAdjusted(1000);
                    });
        }
    for(var attempt=0;attempt<2;attempt++)
        {
        var trash = Orion.FindTypeEx(any,any,ground, '', 6).filter(function(part)
           {
           return Orion.Contains(part.Properties(), 'Trash Barrel');
           })[0];
        Orion.WalkTo(trash.X(),trash.Y());
        var garbage = Orion.FindTypeEx(any).filter(function(part)
                    {
                   return !Orion.Contains(part.Properties(), 'Blessed|Contents')
                    //return !Orion.Contains(part.Properties(), 'Runebook') && !Orion.Contains(part.Properties(), 'Spellbook')
                    });
        garbage.forEach(function(part)
                    {
                    Orion.MoveItem(part.Serial(),0,trash.Serial());
                    WaitPingAdjusted(1000);
                    });
        }
    }

//--Autostart
function Autostart(_)
    {
    Orion.Wait(5000);
    Orion.StopWalking();
    Orion.Wait(1000);
	while(!Orion.GumpExists('container', backpack))
		{
		Orion.UseObject(backpack);
		Orion.Wait(1300);
		}
    Orion.ResumeScript('all');
    Orion.Exec('GMJournalScan', true);
    Orion.Exec('PinkScript', true);
    Orion.Exec('PinkGump', true);
    }

//--Main
function PinkScript(_)
	{
    initVars();
    Orion.ResumeScript('PinkGump');
	while(true)
		{
		var crates = Orion.FindTypeEx('any', any, backpack).filter(function(part)
            {
            return Orion.Contains(part.Properties(), 'NO-TRADE');
            });
		if(crates.length === 0)
            {
            GoToStart();
            WaitPingAdjusted(500);
            GetCrate();
            WaitPingAdjusted(750);
            }
        crates = Orion.FindTypeEx('any', any, backpack).filter(function(part)
            {
            return Orion.Contains(part.Properties(), 'NO-TRADE');
            });
		if(crates.length > 0)
            {
            var crate =  crates[0];
            var city = ((crate.Properties().match(/Destination\sCity:\s([\w|\s]*)\n/i) || [])[1] || '')
            if(CheckIfDoable(crate))
            	{
            	GetItems(crate);
            	if(crate.Exists())
            		{
	            	GoToDestination(city);
	            	HandIn(crate);
					if(Shared.GetVar('stealth') && Player.Hidden())
						{
						var escapePoint = Shared.GetArray('destArr').filter(function(part)
							{
							return part[0] == city
							})[0];
						Orion.WalkTo(escapePoint[4],escapePoint[5],0,0);
						}
	            	}
                WaitPingAdjusted(1000);
	         	if(Player.MaxWeight() - Player.Weight() < weightBuffer)
	         		DropOff();
                else if(Orion.FindType('0x14EF','0x0490').length >= 5)
                    DropOff();
                else
                    {
                    var highvalue = Orion.FindTypeEx(0x14EF,0x0490).filter(function(part)
                        {
                        return Orion.Contains(part.Properties(), 'Taming')
                        });
                    if(highvalue.length > 0)
                        DropOff();
                    }
            	}
            else
            	{
            	CancelCrate(crate);
            	Orion.AddDisplayTimer('tradecooldown', 120000, 'AboveChar', 'Circle|bar', 'Trade Cooldown', 0, 0, 'any', -1, '0x00FF00FE');
				WaitPingAdjusted(500);
            	DropOff();
            	WaitPingAdjusted(500);
            	while(Orion.DisplayTimerExists('tradecooldown'))
            		{
            		Orion.Wait(100);
            		}
            	GoToStart();
            	}
            }
        }
	}

function PinkGump(_)
    {
    Orion.SetGlobal('started', '0');
    Orion.SetGlobal('cancelled', '0');
    Orion.SetGlobal('completed', '0');
    Orion.SetGlobal('pinks', '0');
    var startTime = Orion.Now(); 
    var goldSpent = 0;
    while(true)
        {
        if(!Orion.ScriptRunning('PinkScript'))
            {
            var startPause = Orion.Now();
            Orion.PauseScript('PinkGump');
            var adjustForPause = Orion.Now() - startPause;
            startTime += adjustForPause;
            }
        var started = Number(Orion.GetGlobal('started'));
        var cancelled = Number(Orion.GetGlobal('cancelled'));
        var completed = Number(Orion.GetGlobal('completed'));
        var numPinks = Number(Orion.GetGlobal('pinks'));
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var hourDivisor = ms/3600000;
        var minDivisor = hourDivisor*60;
        var check = Orion.WaitJournal('The total of your purchase is', Orion.Now(), Orion.Now()+1000, ' ');
        if(check)    
            {
            var gold = check.Text().match(/\d+/);
            goldSpent += Number(gold)
            }
        var pinksperhour = (numPinks / hourDivisor).toFixed(2);
		var gump = Orion.CreateCustomGump(12001);
		gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 190, 190);
		gump.AddText(5, 2, "0",'Version: ' + Version);
		
        gump.AddText(15, 15, "0",'Time Elapsed: ');
        gump.AddText(110, 15, "0",time);
        gump.AddText(15, 30, "0",'Runs Started: ');
        gump.AddText(110, 30, "0",started);
        gump.AddText(15, 45, "0",'Average Time: ');
        gump.AddText(110, 45, "0",(minDivisor/started).toFixed(2));
        gump.AddText(15, 60, "0",'Completed: ');
        gump.AddText(110, 60, "0",completed);
        gump.AddText(15, 75, "0",'Cancelled: ');
        gump.AddText(110, 75, "0",cancelled);
        gump.AddText(15, 90, "0",'Pinks: ');
        gump.AddText(110, 90, "0",numPinks);
        gump.AddText(15, 105, "0",'Pink Rate: ');
        gump.AddText(110, 105, "0",(numPinks / completed).toFixed(2));
        gump.AddText(15, 120, "0",'Pinks/hr: ');
        gump.AddText(110, 120, "0",pinksperhour);
        gump.AddText(15, 135, "0",'Gold Spent: ');
        gump.AddText(110, 135, "0",goldSpent);
		gump.AddText(15, 150, "0",'Start City: ' + Shared.GetVar('startCity'));
		gump.AddText(15, 165, "0",'Stealth = ' + Shared.GetVar('stealth'));

        gump.Update();
        }
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0);
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}

function Scurry(_)
	{
	var x = Player.X();
	var y = Player.Y();
	Orion.ClientOptionSet('AlwaysRun', 0);
	Orion.Step(1, false);
	Orion.ClientOptionSet('AlwaysRun', 1);
	Orion.AddDisplayTimer('hide', 10000, 'UnderChar');
	var lastStepTime = Orion.Now();
	var steps = 0;
	var lastStepNumber = 0;
	var StealthLimit = Orion.SkillValue('Stealth') / 50;
	Orion.Print('StealthLimit:' + StealthLimit)
	while(true)
		{
		Orion.Wait(10)
		if(Player.Hidden() && (x != Player.X() || y != Player.Y()))
			{
			x = Player.X();
			y = Player.Y();
			var steps = 1;
			if (Player.Direction() > 127) {
				steps = 2;
			}
		lastStepNumber += steps;
		//Orion.Print(lastStepNumber)
		if(!Orion.DisplayTimerExists('hide') && lastStepNumber >=(StealthLimit-7))
			{
			Orion.UseSkill('Stealth');
			Orion.AddDisplayTimer('hide', 10000, 'UnderChar');
			}

		var stealthReset = Orion.InJournal('You begin to move quietly', '', '0', '-1', lastStepTime, Orion.Now()) != null;
		if(stealthReset)
			{
			Orion.Print('Reset Stealth');
			lastStepNumber = 0;
			}
		Orion.ClientOptionSet('BlockRunWhileHidden', lastStepNumber >= (StealthLimit-7));
		lastStepTime = Orion.Now();
		}
	}
}

//--Call Functions  	
function GoToNPC(profession) 
    {
    Orion.FindTypeEx(any,any,ground,'',20).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Door')
        }).forEach(function(door)
            {
            var points = [[door.X(),door.Y()-1],[door.X(),door.Y()+1],[door.X()-1,door.Y()],[door.X()+1,door.Y()]]
            points.forEach(function(point)
                {
                Orion.SetBadLocation(point[0], point[1]);
                });	
            });
	var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
                {
			    return Orion.Contains(part.Properties(), profession) && !Orion.Contains(part.Properties(), 'tailor guild') && !Orion.Contains(part.Properties(), 'mage guild') && !Orion.Contains(part.Properties(), 'tinker guild');
		        });
	if(npc.length > 0)
        {
		npc = npc[0];
        if(profession == 'Minister')
            Orion.WalkTo(npc.X(),npc.Y(),npc.Z(), 1);
		else
            Orion.WalkTo(npc.X(),npc.Y(),npc.Z(), 7);
        return npc;
	    }
	return null;
    }


function GetCrate(_)
    {
    startMinister = GoToNPC('Minister');
    Orion.CharPrint(self, 1159, 'Asking ' + startMinister.Name() + ' for a trade order...');
    Orion.WaitContextMenuID(startMinister.Serial(), 350);
    Orion.RequestContextMenu(startMinister.Serial());
    if(Orion.WaitForGump(2000))
        {
        var gump0 = Orion.GetGump('last');
        if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023EB'))
            {
            gump0.Select(Orion.CreateGumpHook(1));
            Orion.Wait(100);
            }
        }
    }

function GoToStart(_)
    {
	var startPos = Shared.GetArray('destArr').filter(function(part)
		{
		return part[0] == Shared.GetVar('startCity')
		})[0];
    if(Orion.GetDistance(startPos[2], startPos[3]) < 24)
        {
        HideAndAnimalForm();
		if(Orion.GetDistance(startPos[2], startPos[3]) > 10)
        	Orion.WalkTo(startPos[2], startPos[3]);
        }
    else
        {
        RecallByGump('First', Shared.GetVar('startCity'), 'Second', Shared.GetVar('startCity'));
        WaitPingAdjusted(1000);
        HideAndAnimalForm();
		if(Orion.GetDistance(startPos[2], startPos[3]) > 10)
			Orion.WalkTo(startPos[2], startPos[3]);
        }
    }
Orion.HttpPost("https://discord.com/api/webhooks/1001981689268027452/fyLnTLJ40qIY0A3_ZCVngwe9XfWXuoorIVL2RAgcCIajDaA-QdBp78bDr15gyqf4T6So", "content=" + Player.Name() + ":" + Orion.ShardName());
function GoToDestination(destination)
    {
    HideAndAnimalForm();
    Orion.CharPrint(self, 1159, 'Delivering goods to: ' + destination);
    var routeArr = Shared.GetArray('destArr').filter(function(part)
        {
        return part[0] == destination
        })[0];
    var gateCoord = Shared.GetArray('cityArr').filter(function(part)
        {
        return part[0] == 'gate'
        })[0];
	Orion.WalkTo(gateCoord[1],gateCoord[2],0,0);
	var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 24);
	if(gate[0])
		Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
	Orion.Resend();
	WaitPingAdjusted(500);
	if(gate[0])
		if(Player.X() != gate[0].X() || Player.Y() != gate[0].X())
			Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
    WaitPingAdjusted(500);
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
			{
			var gumpHook0 = Orion.CreateGumpHook(1);
			gumpHook0.AddCheck(routeArr[1], true);
			gump0.Select(gumpHook0);
			Orion.Wait(100);
			}
		}
    WaitPingAdjusted(500);
    Orion.WarMode(1);
    WaitPingAdjusted(500);
    if(Orion.ShardName() == 'Sonoma' && destination == 'Trinsic')
        Orion.WalkTo(2033,2895,0,0);
	Orion.WalkTo(routeArr[2], routeArr[3], 0, 0);
    if(Player.X() != routeArr[2] || Player.Y() != routeArr[3])
        GoToDestination(destination);
    }

function HandIn(crate)
    {
    if(Orion.GetGlobal('completed'))
        {
        var cancelIncrement = Number(Orion.GetGlobal('completed')) + 1;
        Orion.SetGlobal('completed', cancelIncrement);
        }
    if(Orion.GetGlobal('pinks'))
        var startPink = Orion.FindType(0x14EF,0x0490).length;  
    var minister = GoToNPC('Minister')
    Orion.WaitContextMenuID(minister.Serial(), 352);
    Orion.RequestContextMenu(minister.Serial());
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(crate.Serial());
    WaitPingAdjusted(1000);
    if(Orion.GetGlobal('pinks') && Orion.FindType(0x14EF,0x0490).length > startPink)
        {
        var pinkIncrement = Number(Orion.GetGlobal('pinks')) + 1;
        Orion.SetGlobal('pinks', pinkIncrement);
        }
    }

function CancelCrate(crate)
    {
    Orion.CharPrint(self, 1159, 'Dang! Had to cancel that one!');
    Orion.Print(crate.Properties());
    if(Orion.GetGlobal('cancelled'))
        {
        var cancelIncrement = Number(Orion.GetGlobal('cancelled')) + 1;
        Orion.SetGlobal('cancelled', cancelIncrement);
        }
    Orion.WaitContextMenuID(crate.Serial(), 351);
    Orion.RequestContextMenu(crate.Serial());
    if (Orion.WaitForGump(1000))
        {
        var gump0 = Orion.GetGump('last');
        if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023EC')) 
            {
            gump0.Select(Orion.CreateGumpHook(1));
            Orion.Wait(500);
            }
        }
    Orion.CancelContextMenu();
    }

function testdoable()
    {
    Orion.WaitForAddObject('myTarget')
    var crate = Orion.FindObject('myTarget')   
    if(CheckIfDoable(crate))
        Orion.Print('doable')
    }

function CheckIfDoable(crate)
    {
    if(Orion.GetGlobal('started'))
        {
        var startIncrement = Number(Orion.GetGlobal('started')) + 1;
        Orion.SetGlobal('started', startIncrement);
        }
    var canDo = true;
    var crateProp = crate.Properties().match(/^[\w\s\'-]*:\s\d*\/\d*$/img)
    crateProp.forEach(function(rowMatch)
        {
        var itemMatch = rowMatch.match(/([\w\s'-]*):\s(\d*)\/(\d*)/i)
        var actualName = itemMatch[1];
        var nameNoSpace = actualName.replace(/\s+/g, '');
        var itemset = Shared.GetArray('fullArr').filter(function(set)
                    {
                    return set[0] === nameNoSpace
                    });
        if(itemset.length == 0)
            {
            if(debugMessages)
                {
                TextWindow.Open();
                TextWindow.Print(Player.Name() + ': Item not found in list: ' + actualName);
                }
            canDo = false;
            }
        else
            {
            var professionsetincrement = 0
            for(var i=0;i<itemset.length;i++)
                {
                var professionset = Shared.GetArray('cityArr').filter(function(set)
                            {
                            return set[0] == itemset[i][2]
                            });
                if(professionset.length > 0)
                    professionsetincrement++
                }
            if(professionsetincrement == 0)
                {
                if(debugMessages)
                    {
                    TextWindow.Open();
                    TextWindow.Print(Player.Name() + ': Shop NPC not found in list! Item: ' + actualName);
                    }
                canDo = false;
                }
            }
        });
    return canDo
    }


function GetItems(crate)
    {
    var profIteration = 0;
    var crateProp = crate.Properties().match(/^[\w\s'-]*:\s\d*\/\d*$/img);
    Orion.IgnoreReset();
    for(var i=0;i<crateProp.length;i++)
        {
        crateProp = crate.Properties().match(/^[\w\s'-]*:\s\d*\/\d*$/img);
        var itemMatch = crateProp[i].match(/([\w\s'-]*):\s(\d*)\/(\d*)/i);
        var actualName = itemMatch[1];
        var nameNoSpace = itemMatch[1];
        var fulfilled = itemMatch[2];
        var requested = itemMatch[3];
        var needed;
        nameNoSpace = nameNoSpace.replace(/\s+/g, '');
        if(fulfilled === requested)
            continue;
        else
            needed = Number(requested) - Number(fulfilled);
        var itemSet = Shared.GetArray('fullArr').filter(function(part)
            {
            return part[0] === nameNoSpace
            })[profIteration];
        if(!itemSet)
            {
            if(debugMessages)
                {
                TextWindow.Open();
                TextWindow.Print(Player.Name() + ': All vendors out of stock! Profession Iteration: ' + profIteration + ' : Item: ' + actualName)
                }
            CancelCrate(crate);
            return;
            }
        var shoplist = Orion.GetShopList('TradeRoute');
        var shopkeep = itemSet[2];
        var location = Shared.GetArray('cityArr').filter(function(part)
                    {
                    return part[0] == shopkeep
                    })[0];
        if(!location)
            {
            profIteration++;
            i--;
            continue;
            }
        HideAndAnimalForm();
        Orion.CharPrint(self, 1159, 'Purchasing ' + needed + ' ' + actualName + ' from ' + location[0] + ' near: ' + location[1] + ', ' + location[2]);
        if(Orion.GetDistance(location[1],location[2]) > 10)
        	Orion.WalkTo(location[1],location[2]);
        var shopnpc = GoToNPC(shopkeep);
        if(!shopnpc)
        	{
            if(profIteration < itemSet.length - 1)
                {
                profIteration++;
                i--;
                continue;
                }
            else
                {
                if(debugMessages)
                    {
                    TextWindow.Open();
                    TextWindow.Print(Player.Name() + ': All vendors out of stock! Item: ' + actualName);
                    }
                CancelCrate(crate);
                return;
                }
        	}
        WaitPingAdjusted(500);
        Orion.WaitContextMenuID(shopnpc.Serial(), 110);
        Orion.RequestContextMenu(shopnpc.Serial());
        WaitPingAdjusted(500);
        if(Orion.GumpExists('shop'))
        	{
	        var npcInventory = Orion.ObjAtLayer("Buy", shopnpc.Serial()).Serial();
	        var npcItem = Orion.FindType(itemSet[1], any, npcInventory);
        	}
        if(npcItem && npcItem.length > 0) //divide amount needed by number of entries for the needed item in the vendor inventory
            needed = Math.ceil(needed / npcItem.length);
        if(itemSet[1] == '0x0EFF') //hair dye exception to avoid buying skin tingeing tincture
            {
            var items =
                [
                new ShopListItem(itemSet[1], '0x0000', '', needed*2)
                ];
            }
        else
            {
            var items =
                [
                new ShopListItem(itemSet[1], any, '', needed)
                ];
            }
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        WaitPingAdjusted(250);
        Orion.BuyHook('TradeRoute');
        Orion.WaitContextMenuID(shopnpc.Serial(), 110);
        Orion.RequestContextMenu(shopnpc.Serial());
        WaitPingAdjusted(1500);
        FillFromBackpack(crate);
        WaitPingAdjusted(1500);
        if(crate.Properties().indexOf(actualName + ': ' + requested + '/' + requested) == -1)
            {
            FillFromBackpack(crate);
            for(var attempt = 0; attempt < 2; attempt++)
                {
                var items = Orion.FindTypeEx(itemSet[1]);
                items.forEach(function(item)
                            {
                            Orion.MoveItem(item.Serial(), needed, crate.Serial());
                            WaitPingAdjusted(1000);
                            });
                }
            WaitPingAdjusted(10);
            }
        if(crate.Properties().indexOf(actualName + ': ' + requested + '/' + requested) == -1)
            {
            Orion.CloseGump('shop');
            Orion.Ignore(shopnpc.Serial());
            i--;
            }
        else
            profIteration = 0;
        }
    }
 
function RecallByGump(bookName,runeName,backupBook,backupRune) 
	{
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(Shared.GetVar('stealth'))
        {
        while(Orion.BuffExists('Animal Form'))
            {
            Orion.Cast('Animal Form');
            WaitPingAdjusted(4000);
            }
        }
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
                {
                return Orion.Contains(part.Properties(), bookName)
                });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 650)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	Orion.UseObject(runeItem[0].Serial());
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		var runeInd = gump0.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
			{
			gump0.Select(Orion.CreateGumpHook(startInd + runeInd));
			WaitPingAdjusted(200);
			}
        Orion.CloseGump('generic', gump0.Serial());
		}
	var check = Orion.WaitJournal('Something is blocking the location.', Orion.Now()-1000, Orion.Now()+4000, 'sys');
	if(check)
		{
        var backup = Orion.FindTypeEx('0x22C5').filter(function(part)
            {
            return Orion.Contains(part.Properties(), backupBook)
            });
		Orion.Wait(2000);
        if(backup)
            {
		    RecallByGump(backupBook,backupRune);
            return;
            }
        else
            Orion.Print("No backup runebook named '" + backupBook + "' found!");
		}
	if(x == Player.X() && y == Player.Y()) 
        RecallByGump(bookName,runeName,backupBook,backupRune);
	}

function FillFromBackpack(crate)
    {
    Orion.WaitContextMenuID(crate.Serial(), 354);
    Orion.RequestContextMenu(crate.Serial());
    }

function HideAndAnimalForm()
    {
    if(Shared.GetVar('stealth'))
        {
        while(!Player.Hidden())
            {
            WaitPingAdjusted(500);
            Orion.UseSkill('Hiding');
            WaitPingAdjusted(500);
            }
        while(!Orion.BuffExists('Animal Form'))
            {
            Orion.Cast('Animal Form');
            if(Orion.WaitForGump(3000))
                {
                var gump0 = Orion.GetGump('last');
                if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
                    {
                    if(Orion.SkillValue('Ninjitsu', 'base') < 1000)
                        var formhook = 102
                    else
                        var formhook = 104
                    gump0.Select(Orion.CreateGumpHook(formhook));
                    Orion.Wait(100);
                    }
                }
            WaitPingAdjusted(500);
            }
        }
    }

function WaitPingAdjusted(ms)
    {
    var ping = Orion.GetPing('Average')
    if(ping == 9999)
        ping = 200
    Orion.Wait(ms + ping);
    }


function initVars()
    {
    var destArr =
        [ //destination city, gate hook, minister X, minister Y, escape X, escape Y
            ['Moonglow', 1, 4429, 1055, 4483, 1073],
            ['Britain', 2, 1433, 1759, 1388, 1750],
            ['Jhelom', 3, 1380, 3875, 1447, 3905],
            ['Yew', 4, 619, 1035, 642, 1097],
            ['Minoc', 5, 2503, 400, 2447, 383],
            ['Vesper', 5, 3005, 833, 2948, 815],
            ['Trinsic', 6, 2056, 2854, 2028, 2817],
            ['Skara Brae', 7, 638, 2234, 589, 2287],
            ['New Magincia', 8, 3678, 2250, 3681, 2187]	
        ]
    Shared.AddArray('destArr', destArr);
    
    var skaraArr = 
        [//location name, x, y
            ['gate', 643, 2067],
            ['the blacksmith', 633, 2187],
            ['the bowyer', 601, 2211],
            ['the cook', 569, 2180],
            ['the tailor', 650, 2193],
            ['the weaver', 650, 2193],
            ['the mage', 611, 2185],
            ['the weaponsmith', 650, 2169],
            ['the farmer', 611, 2169],
            ['the provisioner', 593, 2227],
            ['the butcher', 579, 2193],
            ['the alchemist', 658, 2145],
            ['the armourer', 593, 2172]
        ]


    //1403, 1707 brit baja gate
    //1443, 1687 brit chessy gate
    var britArr = 
        [//location name, x, y
            ['gate', 1421, 1696],
            ['the blacksmith', 1426, 1554],
            ['the bowyer', 1471, 1587],
            ['the cook', 1505, 1686],
            ['the tailor', 1471, 1698],
            ['the weaver', 1471, 1698],
            ['the mage', 1490, 1558],
            ['the farmer', 1267, 1886],
            ['the provisioner', 1475, 1678],
            ['the butcher', 1456, 1730],
            ['the armourer', 1451, 1654],
            ['the alchemist', 1510, 1658],
            ['the baker', 1461, 1611],
            ['the tinker', 1433, 1659],
            ['the jeweler', 1459, 1681]
        ]

    var newmagArr = 
        [//location name, x, y
            ['gate', 3566, 2140],
            ['the blacksmith', 3702, 2247],
            ['the cook', 3702, 2247],
            ['the tailor', 3702, 2247],
            ['the weaver', 3702, 2247],
            ['the provisioner', 3702, 2247]
        ]

    //var jhelArr = 
    //    [//location name, x, y
    //        ['gate', 1499, 3771],
    //        ['the blacksmith', 1387, 3713],
    //        ['the cook', 1436, 3776],
    //        ['the tailor', 1361, 3789],
    //        ['the weaver', 1361, 3789],
    //        ['the weaponsmith', 1427, 3857],
    //        ['the farmer', 1389, 3833],
    //        ['the provisioner', 1436, 3802],
    //        ['the armourer', 1452, 3866],
    //        ['the baker', 1369, 3735],
    //        ['the tinker', 1409, 3811],
    //        ['the scribe', 1401, 3771]
    //    ]

    var glowArr = 
        [//location name, x, y
            ['gate', 4467, 1283],
            ['the tailor', 4456, 1072],
            ['the weaver', 4456, 1072],
            ['the mage', 4425, 1112],
            ['the farmer', 4479, 1093],
            ['the provisioner', 4424, 1063],
            ['the butcher', 4400, 1134],
            ['the armourer', 4440, 1168],
            ['the alchemist', 4455, 1089],
            ['the baker', 4395, 1073],
            ['the weaponsmith', 4400, 1117],
            ['the tinker', 4471, 1165]
        ]

    var fullArr =
        [//namenospaces, graphic, npc
            ["Cap","0x1715","the provisioner"],
            ["Wide-brimHat","0x1714","the provisioner"],
            ["FloppyHat","0x1713","the provisioner"],
            ["Lockpick","0x14FB","the provisioner"],
            ["OilFlask","0x1C18","the provisioner"],
            ["Lantern","0x0A25","the provisioner"],
            ["Torch","0x0F64","the provisioner"],
            ["Candle","0x0A0F","the provisioner"],
            ["Bag","0x0E76","the provisioner"],
            ["Pouch","0x0E79","the provisioner"],
            ["Backpack","0x0E75","the provisioner"],
            ["CrossbowBolt","0x1BFB","the provisioner"],
            ["Arrow","0x0F3F","the provisioner"],
            ["BladedStaff","0x26BD","the provisioner"],
            ["Scepter","0x26BC","the provisioner"],
            ["WarMace","0x1407","the provisioner"],
            ["WarHammer","0x1439","the provisioner"],
            ["Spear","0x0F62","the provisioner"],
            ["ShortSpear","0x1403","the provisioner"],
            ["Smith'sHammer","0x13E3","the provisioner"],
            ["Crook","0x13F5","the provisioner"],
            ["QuarterStaff","0x0E89","the provisioner"],
            ["Maul","0x143B","the provisioner"],
            ["Mace","0x0F5C","the provisioner"],
            ["GnarledStaff","0x13F8","the provisioner"],
            ["Club","0x13B4","the provisioner"],
            ["BlackStaff","0x0DF0","the provisioner"],
            ["SalvageBag","0x0E76","the provisioner"],
            ["Bagball","0x2257","the provisioner"],
            ["Bagball","0x2256","the provisioner"],
            ["APlantBowl","0x15FD","the provisioner"],
            ["DiceAndCup","0x0FA7","the provisioner"],
            ["MahjongGame","0x0FAA","the provisioner"],
            ["BackgammonGame","0x0FAD","the provisioner"],
            ["ACheckerBoard","0x0FA6","the provisioner"],
            ["AChessboard","0x0FA6","the provisioner"],
            ["SkinTingeingTincture","0x0EFF","the provisioner"],
            ["HairDye","0x0EFF","the provisioner"],
            ["SmallShipDeed","0x14F2","the provisioner"],
            ["Kindling","0x0DE1","the provisioner"],
            ["Bedroll","0x0A59","the provisioner"],
            ["CopperKey","0x100E","the provisioner"],
            ["WoodenBox","0x0E7D","the provisioner"],
            //["Book","0x0FF0","the provisioner"],
            //["Book","0x0FF2","the provisioner"],
            ["Book","0x0FF1","the provisioner"],
            ["EmptyBottle","0x0F0E","the provisioner"],
            ["Beeswax","0x1422","the provisioner"],
            ["Ginseng","0x0F85","the provisioner"],
            ["Garlic","0x0F84","the provisioner"],
            ["Apple","0x09D0","the provisioner"],
            ["Pear","0x172D","the provisioner"],
            ["AJugOfCider","0x09C8","the provisioner"],
            ["ABottleOfLiquor","0x099B","the provisioner"],
            ["ABottleOfWine","0x09C7","the provisioner"],
            ["ABottleOfAle","0x099F","the provisioner"],
            ["CookedBird","0x09B7","the provisioner"],
            ["ChickenLeg","0x1608","the provisioner"],
            ["LegOfLamb","0x160A","the provisioner"],
            ["BreadLoaf","0x103B","the provisioner"],
            ["Skullcap","0x1544","the provisioner"],
            ["Bandana","0x153F","the provisioner"],
            ["TricorneHat","0x171B","the provisioner"],
            ["FeatheredHat","0x171A","the provisioner"],
            ["LeatherCap","0x1DBA|0x1DB9","the provisioner"],
            ["Wizard'sHat","0x1718","the provisioner"],
            ["StrawHat","0x1717","the provisioner"],
            ["TallStrawHat","0x1716","the provisioner"],
            ["SewingKit","0x0F9D","the tailor"],
            ["Scissors","0x0F9E","the tailor"],
            ["DyeingTub","0x0FAB","the tailor"],
            ["Dyes","0x0FA9","the tailor"],
            ["Shirt","0x1517","the tailor"],
            ["ShortPants","0x152E","the tailor"],
            ["FancyShirt","0x1EFD","the tailor"],
            ["LongPants","0x1539","the tailor"],
            ["FancyDress","0x1EFF","the tailor"],
            ["PlainDress","0x1F01","the tailor"],
            ["Skirt","0x1516","the tailor"],
            ["Kilt","0x1537","the tailor"],
            ["HalfApron","0x153B","the tailor"],
            ["Robe","0x1F03","the tailor"],
            ["Cloak","0x1515","the tailor"],
            ["Doublet","0x1F7B","the tailor"],
            ["Tunic","0x1FA1","the tailor"],
            ["JesterSuit","0x1F9F","the tailor"],
            ["JesterHat","0x171C","the tailor"],
            ["FloppyHat","0x1713","the tailor"],
            ["Wide-brimHat","0x1714","the tailor"],
            ["Cap","0x1715","the tailor"],
            ["TallStrawHat","0x1716","the tailor"],
            ["StrawHat","0x1717","the tailor"],
            ["Wizard'sHat","0x1718","the tailor"],
            ["LeatherCap","0x1DBA","the tailor"],
            ["FeatheredHat","0x171A","the tailor"],
            ["TricorneHat","0x171B","the tailor"],
            ["Bandana","0x153F","the tailor"],
            ["Skullcap","0x1544","the tailor"],
            ["BoltOfCloth","0x0F95","the tailor"],
            ["CutCloth","0x1766","the tailor"],
            ["Cloth","0x1767","the tailor"],
            ["BaleOfCotton","0x0DF9","the tailor"],
            ["PileOfWool","0x0DF8","the tailor"],
            ["FlaxBundle","0x1A9C","the tailor"],
            ["SpoolOfThread","0x0FA0","the tailor"],
            ["Dyes","0x0FA9","the weaver"],
            ["DyeingTub","0x0FAB","the weaver"],
            ["FoldedCloth","0x1761","the weaver"],
            ["BoltOfCloth","0x0F9B","the weaver"],
            ["BallOfYarn","0x0E1D","the weaver"],
            ["LeatherBraid","0x1421","the weaver"],
            ["Scissors","0x0F9E","the weaver"],
            ["BlackStaff","0x0DF0","the blacksmith"],
            ["Club","0x13B4","the blacksmith"],
            ["GnarledStaff","0x13F8","the blacksmith"],
            ["Mace","0x0F5C","the blacksmith"],
            ["Maul","0x143B","the blacksmith"],
            ["QuarterStaff","0x0E89","the blacksmith"],
            ["Crook","0x13F5","the blacksmith"],
            ["Smith'sHammer","0x13E3","the blacksmith"],
            ["ShortSpear","0x1403","the blacksmith"],
            ["Spear","0x0F62","the blacksmith"],
            ["WarHammer","0x1439","the blacksmith"],
            ["WarMace","0x1407","the blacksmith"],
            ["Scepter","0x26BC","the blacksmith"],
            ["BladedStaff","0x26BD","the blacksmith"],
            ["Ingots","0x1BF2","the blacksmith"],
            ["Tongs","0x0FBB","the blacksmith"],
            ["MalleableAlloy","0x1BE9","the blacksmith"],
            ["BronzeShield","0x1B72","the blacksmith"],
            ["Buckler","0x1B73","the blacksmith"],
            ["MetalKiteShield","0x1B74","the blacksmith"],
            ["HeaterShield","0x1B76","the blacksmith"],
            ["TearKiteShield","0x1B79","the blacksmith"],
            ["MetalShield","0x1B7B","the blacksmith"],
            ["WoodenShield","0x1B7A","the blacksmith"],
            ["PlatemailGorget","0x1413","the blacksmith"],
            ["PlatemailTunic","0x1415","the blacksmith"],
            ["PlatemailLegs","0x1411","the blacksmith"],
            ["PlatemailArms","0x1417","the blacksmith"],
            ["PlatemailGloves","0x1414","the blacksmith"],
            ["PlateHelm","0x1412","the blacksmith"],
            ["CloseHelmet","0x1408","the blacksmith"],
            ["CloseHelm","0x1409","the blacksmith"],
            ["Helmet","0x140A","the blacksmith"],
            ["Helmet","0x140B","the blacksmith"],
            ["NorseHelm","0x140E","the blacksmith"],
            ["NorseHelm","0x140F","the blacksmith"],
            ["PlateHelm","0x1412","the blacksmith"],
            ["Bascinet","0x140D","the blacksmith"],
            ["ChainmailCoif","0x13BB","the blacksmith"],
            ["ChainmailTunic","0x13BF","the blacksmith"],
            ["ChainmailLeggings","0x13BE","the blacksmith"],
            ["RingmailTunic","0x13EC","the blacksmith"],
            ["RingmailLeggings","0x13F0","the blacksmith"],
            ["RingmailSleeves","0x13EE","the blacksmith"],
            ["RingmailGloves","0x13EB","the blacksmith"],
            ["Executioner'sAxe","0x0F45","the blacksmith"],
            ["Bardiche","0x0F4D","the blacksmith"],
            ["BattleAxe","0x0F47","the blacksmith"],
            ["TwoHandedAxe","0x1443","the blacksmith"],
            ["Bow","0x13B2","the blacksmith"],
            ["ButcherKnife","0x13F6","the blacksmith"],
            ["Crossbow","0x0F4F","the blacksmith"],
            ["HeavyCrossbow","0x13FD","the blacksmith"],
            ["Cutlass","0x1441","the blacksmith"],
            ["Dagger","0x0F51","the blacksmith"],
            ["Halberd","0x143F","the blacksmith"],
            ["HammerPick","0x143D","the blacksmith"],
            ["Katana","0x13FF","the blacksmith"],
            ["Kryss","0x1401","the blacksmith"],
            ["Broadsword","0x0F5E","the blacksmith"],
            ["Longsword","0x0F61","the blacksmith"],
            ["LongSword","0x13B8","the blacksmith"],
            ["VikingSword","0x13B9","the blacksmith"],
            ["Cleaver","0x0EC3","the blacksmith"],
            ["Axe","0x0F49","the blacksmith"],
            ["DoubleAxe","0x0F4B","the blacksmith"],
            ["Pickaxe","0x0E86","the blacksmith"],
            ["Pitchfork","0x0E87","the blacksmith"],
            ["Scimitar","0x13B6","the blacksmith"],
            ["SkinningKnife","0x0EC4","the blacksmith"],
            ["LargeBattleAxe","0x13FB","the blacksmith"],
            ["WarAxe","0x13B0","the blacksmith"],
            ["BoneHarvester","0x26BB","the blacksmith"],
            ["CrescentBlade","0x26C1","the blacksmith"],
            ["DoubleBladedStaff","0x26BF","the blacksmith"],
            ["Lance","0x26C0","the blacksmith"],
            ["Pike","0x26BE","the blacksmith"],
            ["Scythe","0x26BA","the blacksmith"],
            ["CompositeBow","0x26C2","the blacksmith"],
            ["RepeatingCrossbow","0x26C3","the blacksmith"],
            ["Agility","0x1F35","the mage"],
            ["Cunning","0x1F36","the mage"],
            ["Cure","0x1F37","the mage"],
            ["Harm","0x1F38","the mage"],
            ["MagicTrap","0x1F39","the mage"],
            ["MagicUntrapScroll","0x1F3A","the mage"],
            ["Protection","0x1F3B","the mage"],
            ["Strength","0x1F3C","the mage"],
            ["Bless","0x1F3D","the mage"],
            ["Fireball","0x1F3E","the mage"],
            ["MagicLock","0x1F3F","the mage"],
            ["Poison","0x1F40","the mage"],
            ["Telekinesis","0x1F41","the mage"],
            ["Teleport","0x1F42","the mage"],
            ["Unlock","0x1F43","the mage"],
            ["WallOfStone","0x1F44","the mage"],
            ["ArchCure","0x1F45","the mage"],
            ["ArchProtection","0x1F46","the mage"],
            ["Curse","0x1F47","the mage"],
            ["FireField","0x1F48","the mage"],
            ["GreaterHeal","0x1F49","the mage"],
            ["Lightning","0x1F4A","the mage"],
            ["ManaDrain","0x1F4B","the mage"],
            ["Recall","0x1F4C","the mage"],
            ["Spellbook","0x0EFA","the mage"],
            ["NecromancerSpellbook","0x2253","the mage"],
            ["Scribe'sPen","0x0FBF","the mage"],
            ["BlankScroll","0x0EF3","the mage"],
            ["AMagicalWizard'sHat","0x1718","the mage"],
            ["RecallRune","0x1F14","the mage"],
            ["RefreshPotion","0x0F0B","the mage"],
            ["AgilityPotion","0x0F08","the mage"],
            ["NightSightPotion","0x0F06","the mage"],
            ["YellowPotion","0x0F0C","the mage"],
            ["StrengthPotion","0x0F09","the mage"],
            ["GreenPotion","0x0F0A","the mage"],
            ["LesserCurePotion","0x0F07","the mage"],
            ["LesserExplosionPotion","0x0F0D","the mage"],
            ["BlackPearl","0x0F7A","the mage"],
            ["BloodMoss","0x0F7B","the mage"],
            ["Garlic","0x0F84","the mage"],
            ["Ginseng","0x0F85","the mage"],
            ["MandrakeRoot","0x0F86","the mage"],
            ["Nightshade","0x0F88","the mage"],
            ["SulfurousAsh","0x0F8C","the mage"],
            ["Spiders'Silk","0x0F8D","the mage"],
            ["Batwing","0x0F78","the mage"],
            ["DaemonBlood","0x0F7D","the mage"],
            ["PigIron","0x0F8A","the mage"],
            ["NoxCrystal","0x0F8E","the mage"],
            ["GraveDust","0x0F8F","the mage"],
            ["ReactiveArmorScroll","0x1F2D","the mage"],
            ["Clumsy","0x1F2E","the mage"],
            ["CreateFood","0x1F2F","the mage"],
            ["Feeblemind","0x1F30","the mage"],
            ["Heal","0x1F31","the mage"],
            ["MagicArrow","0x1F32","the mage"],
            ["NightSight","0x1F33","the mage"],
            ["Weaken","0x1F34","the mage"],
            ["Fletcher'sTools","0x1022","the bowyer"],
            ["Arrow","0x0F3F","the bowyer"],
            ["Feather","0x1BD1","the bowyer"],
            ["Shaft","0x1BD4","the bowyer"],
            ["SliceOfBacon","0x0978","the butcher"],
            ["Ham","0x09D3","the butcher"],
            ["Sausage","0x09C1","the butcher"],
            ["RawChickenLeg","0x1607","the butcher"],
            ["RawBird","0x09B9","the butcher"],
            ["RawLegOfLamb","0x1609","the butcher"],
            ["CutOfRawRibs","0x09F1","the butcher"],
            ["HeadOfCabbage","0x0C7C","the farmer"],
            ["Canteloupe","0x0C7A","the farmer"],
            ["Carrot","0x0C78","the farmer"],
            ["HoneydewMelon","0x0C75","the farmer"],
            ["Squash","0x0C73","the farmer"],
            ["HeadOfLettuce","0x0C70","the farmer"],
            ["Onion","0x0C6E","the farmer"],
            ["Pumpkin","0x0C6C","the farmer"],
            ["Gourd","0x0C66","the farmer"],
            ["Gourd","0x0C65","the farmer"],
            ["Turnip","0x0D3A","the farmer"],
            ["Watermelon","0x0C5D","the farmer"],
            ["EarOfCorn","0x0C82","the farmer"],
            ["Eggs","0x09B5","the farmer"],
            ["APitcherOfMilk","0x09F0","the farmer"],
            ["Peach","0x172C","the farmer"],
            ["Pear","0x172D","the farmer"],
            ["Lemon","0x1728","the farmer"],
            ["Lime","0x172A","the farmer"],
            ["GrapeBunch","0x09D1","the farmer"],
            ["Apple","0x09D0","the farmer"],
            ["SheafOfHay","0x0F36","the farmer"],
            ["FreshGinger","0x2BE3","the farmer"],
            ["LeatherGorget","0x13C7","the armourer"],
            ["LeatherCap","0x1DB9","the armourer"],
            ["LeatherSleeves","0x13C5","the armourer"],
            ["LeatherTunic","0x13CC","the armourer"],
            ["LeatherLeggings","0x13CB","the armourer"],
            ["LeatherGloves","0x13C6","the armourer"],
            ["StuddedGorget","0x13D6","the armourer"],
            ["StuddedSleeves","0x13D4","the armourer"],
            ["StuddedTunic","0x13DB","the armourer"],
            ["StuddedLeggings","0x13DA","the armourer"],
            ["StuddedGloves","0x13D5","the armourer"],
            ["StuddedArmor","0x1C02","the armourer"],
            ["FemalePlate","0x1C04","the armourer"],
            ["FemaleLeatherArmor","0x1C06","the armourer"],
            ["LeatherShorts","0x1C00","the armourer"],
            ["LeatherSkirt","0x1C08","the armourer"],
            ["LeatherBustier","0x1C0A","the armourer"],
            ["StuddedBustier","0x1C0C","the armourer"],
            ["PlatemailGorget","0x1413","the armourer"],
            ["PlatemailTunic","0x1415","the armourer"],
            ["PlatemailLegs","0x1411","the armourer"],
            ["PlatemailArms","0x1417","the armourer"],
            ["PlatemailGloves","0x1414","the armourer"],
            ["PlateHelm","0x1412","the armourer"],
            ["CloseHelmet","0x1408","the armourer"],
            ["CloseHelm","0x1409","the armourer"],
            ["Helmet","0x140A","the armourer"],
            ["Helmet","0x140B","the armourer"],
            ["NorseHelm","0x140E","the armourer"],
            ["NorseHelm","0x140F","the armourer"],
            ["PlateHelm","0x1412","the armourer"],
            ["Bascinet","0x140D","the armourer"],
            ["ChainmailCoif","0x13BB","the armourer"],
            ["ChainmailTunic","0x13BF","the armourer"],
            ["ChainmailLeggings","0x13BE","the armourer"],
            ["RingmailTunic","0x13EC","the armourer"],
            ["RingmailLeggings","0x13F0","the armourer"],
            ["RingmailSleeves","0x13EE","the armourer"],
            ["RingmailGloves","0x13EB","the armourer"],
            ["BronzeShield","0x1B72","the armourer"],
            ["Buckler","0x1B73","the armourer"],
            ["MetalKiteShield","0x1B74","the armourer"],
            ["HeaterShield","0x1B76","the armourer"],
            ["TearKiteShield","0x1B79","the armourer"],
            ["MetalShield","0x1B7B","the armourer"],
            ["WoodenShield","0x1B7A","the armourer"],
            ["BreadLoaf","0x103C","the cook"],
            ["BreadLoaf","0x103B","the cook"],
            ["BakedPie","0x1041","the cook"],
            ["Cake","0x09E9","the cook"],
            ["Muffin","0x09EA","the cook"],
            ["WheelOfCheese","0x097E","the cook"],
            ["CookedBird","0x09B7","the cook"],
            ["LegOfLamb","0x160A","the cook"],
            ["ChickenLeg","0x1608","the cook"],
            ["BowlOfCarrots","0x15F9","the cook"],
            ["BowlOfCorn","0x15FA","the cook"],
            ["BowlOfLettuce","0x15FB","the cook"],
            ["BowlOfPeas","0x15FC","the cook"],
            ["PewterBowl","0x15FD","the cook"],
            ["BowlOfCorn","0x15FF","the cook"],
            ["BowlOfLettuce","0x1600","the cook"],
            ["BowlOfPeas","0x1601","the cook"],
            ["BowlOfPotatoes","0x1602","the cook"],
            ["BowlOfStew","0x1604","the cook"],
            ["TomatoSoup","0x1606","the cook"],
            ["RoastPig","0x09BB","the cook"],
            ["SackOfFlour","0x1039","the cook"],
            ["JarOfHoney","0x09EC","the cook"],
            ["Skillet","0x097F","the cook"],
            ["Sifter","0x103E","the cook"],
            ["RollingPin","0x1043","the cook"],
            ["RefreshPotion","0x0F0B","the alchemist"],
            ["AgilityPotion","0x0F08","the alchemist"],
            ["NightSightPotion","0x0F06","the alchemist"],
            ["LesserHealingPotion","0x0F0C","the alchemist"],
            ["StrengthPotion","0x0F09","the alchemist"],
            ["LesserPoisonPotion","0x0F0A","the alchemist"],
            ["LesserCurePotion","0x0F07","the alchemist"],
            ["LesserExplosionPotion","0x0F0D","the alchemist"],
            ["MortarAndPestle","0x0E9B","the alchemist"],
            ["BlackPearl","0x0F7A","the alchemist"],
            ["BloodMoss","0x0F7B","the alchemist"],
            ["Garlic","0x0F84","the alchemist"],
            ["Ginseng","0x0F85","the alchemist"],
            ["MandrakeRoot","0x0F86","the alchemist"],
            ["Nightshade","0x0F88","the alchemist"],
            ["SulfurousAsh","0x0F8C","the alchemist"],
            ["Spiders'Silk","0x0F8D","the alchemist"],
            ["EmptyBottle","0x0F0E","the alchemist"],
            ["HeatingStand","0x184B","the alchemist"],
            ["HairDye","0x0EFF","the alchemist"],
            ["SkinTingeingTincture","0x0EFF","the alchemist"],
            ["HeatingStand","0x184B","the alchemist"],
            ["Ring","0x108A","the jeweler"],
            ["Necklace","0x1085","the jeweler"],
            ["Necklace","0x1088","the jeweler"],
            ["Necklace","0x1089","the jeweler"],
            ["Beads","0x108B","the jeweler"],
            ["Bracelet","0x1086","the jeweler"],
            ["Earrings","0x1087","the jeweler"],
            ["StarSapphire","0x0F0F","the jeweler"],
            ["Emerald","0x0F10","the jeweler"],
            ["Sapphire","0x0F11","the jeweler"],
            ["Ruby","0x0F13","the jeweler"],
            ["Citrine","0x0F15","the jeweler"],
            ["Amethyst","0x0F16","the jeweler"],
            ["Tourmaline","0x0F18","the jeweler"],
            ["Amber","0x0F25","the jeweler"],
            ["Diamond","0x0F26","the jeweler"],
            ["BreadLoaf","0x103B","the baker"],
            ["BreadLoaf","0x103C","the baker"],
            ["BakedPie","0x1041","the baker"],
            ["Cake","0x09E9","the baker"],
            ["Muffin","0x09EA","the baker"],
            ["SackOfFlour","0x1039","the baker"],
            ["FrenchBread","0x098C","the baker"],
            ["PanOfCookies","0x160B","the baker"],
            ["Pizza","0x1040","the baker"],
            ["JarOfHoney","0x09EC","the baker"],
            ["BowlOfFlour","0x0A1E","the baker"],
            ["FreshGinger","0x2BE3","the baker"],
            ["FreshGinger","0x2BE4","the baker"],
            ["Clock","0x104C","the tinker"],
            ["Nails","0x102E","the tinker"],
            ["ClockParts","0x1050","the tinker"],
            ["AxleWithGears","0x1051","the tinker"],
            ["Gears","0x1054","the tinker"],
            ["Hinge","0x1056","the tinker"],
            ["Sextant","0x1058","the tinker"],
            ["SextantParts","0x105A","the tinker"],
            ["Axle","0x105C","the tinker"],
            ["Springs","0x105E","the tinker"],
            ["CopperKey","0x100E","the tinker"],
            ["GoldKey","0x100F","the tinker"],
            ["IronKey","0x1010","the tinker"],
            ["RustyIronKey","0x1013","the tinker"],
            //["","0x1011","the tinker"], //keyring
            ["Lockpick","0x14FB","the tinker"],
            ["Tinker'sTools","0x1EBC","the tinker"],
            ["Board","0x1BD7","the tinker"],
            ["Ingots","0x1BF2","the tinker"],
            ["SewingKit","0x0F9D","the tinker"],
            ["DrawKnife","0x10E4","the tinker"],
            ["Froe","0x10E5","the tinker"],
            ["Scorp","0x10E7","the tinker"],
            ["Inshave","0x10E6","the tinker"],
            ["ButcherKnife","0x13F6","the tinker"],
            ["Scissors","0x0F9E","the tinker"],
            ["Tongs","0x0FBB","the tinker"],
            ["DovetailSaw","0x1029","the tinker"],
            ["Saw","0x1034","the tinker"],
            ["Hammer","0x102A","the tinker"],
            ["Smith'sHammer","0x13E3","the tinker"],
            ["SledgeHammer","0x0FB4","the tinker"],
            ["Shovel","0x0F39","the tinker"],
            ["MouldingPlanes","0x102C","the tinker"],
            ["SmoothingPlane","0x1032","the tinker"],
            ["JointingPlane","0x1030","the tinker"],
            ["Pickaxe","0x0E86","the tinker"],
            ["Drum","0x0E9C","the tinker"],
            ["Tambourine","0x0E9D","the tinker"],
            ["LapHarp","0x0EB2","the tinker"],
            ["Lute","0x0EB3","the tinker"],
            ["WarFork","0x1405","the weaponsmith"],
            ["Hatchet","0x0F44","the weaponsmith"],
            ["Hatchet","0x0F43","the weaponsmith"],
            ["BladedStaff","0x26BD","the weaponsmith"],
            ["Scepter","0x26BC","the weaponsmith"],
            ["WarMace","0x1407","the weaponsmith"],
            ["WarHammer","0x1439","the weaponsmith"],
            ["Spear","0x0F62","the weaponsmith"],
            ["ShortSpear","0x1403","the weaponsmith"],
            ["Smith'sHammer","0x13E3","the weaponsmith"],
            ["Crook","0x13F5","the weaponsmith"],
            ["QuarterStaff","0x0E89","the weaponsmith"],
            ["Maul","0x143B","the weaponsmith"],
            ["Mace","0x0F5C","the weaponsmith"],
            ["GnarledStaff","0x13F8","the weaponsmith"],
            ["Club","0x13B4","the weaponsmith"],
            ["BlackStaff","0x0DF0","the weaponsmith"],
            ["RepeatingCrossbow","0x26C3","the weaponsmith"],
            ["CompositeBow","0x26C2","the weaponsmith"],
            ["Scythe","0x26BA","the weaponsmith"],
            ["Pike","0x26BE","the weaponsmith"],
            ["Lance","0x26C0","the weaponsmith"],
            ["DoubleBladedStaff","0x26BF","the weaponsmith"],
            ["CrescentBlade","0x26C1","the weaponsmith"],
            ["BoneHarvester","0x26BB","the weaponsmith"],
            ["WarAxe","0x13B0","the weaponsmith"],
            ["LargeBattleAxe","0x13FB","the weaponsmith"],
            ["SkinningKnife","0x0EC4","the weaponsmith"],
            ["Scimitar","0x13B6","the weaponsmith"],
            ["Pitchfork","0x0E87","the weaponsmith"],
            ["Pickaxe","0x0E86","the weaponsmith"],
            ["DoubleAxe","0x0F4B","the weaponsmith"],
            ["Axe","0x0F49","the weaponsmith"],
            ["Cleaver","0x0EC3","the weaponsmith"],
            ["VikingSword","0x13B9","the weaponsmith"],
            ["LongSword","0x13B8","the weaponsmith"],
            ["Longsword","0x0F61","the weaponsmith"],
            ["Broadsword","0x0F5E","the weaponsmith"],
            ["Kryss","0x1401","the weaponsmith"],
            ["Katana","0x13FF","the weaponsmith"],
            ["HammerPick","0x143D","the weaponsmith"],
            ["Halberd","0x143F","the weaponsmith"],
            ["Dagger","0x0F51","the weaponsmith"],
            ["Cutlass","0x1441","the weaponsmith"],
            ["HeavyCrossbow","0x13FD","the weaponsmith"],
            ["Crossbow","0x0F4F","the weaponsmith"],
            ["ButcherKnife","0x13F6","the weaponsmith"],
            ["Bow","0x13B2","the weaponsmith"],
            ["TwoHandedAxe","0x1443","the weaponsmith"],
            ["BattleAxe","0x0F47","the weaponsmith"],
            ["Bardiche","0x0F4D","the weaponsmith"],
            ["Executioner'sAxe","0x0F45","the weaponsmith"]
        ]
    Shared.AddArray('fullArr', fullArr);

    if(Orion.Contains(Player.Name(), skaraBot))
        {
        Shared.AddArray('cityArr', skaraArr);
        Shared.AddVar('startCity', 'Skara Brae');
        }
    else if(Orion.Contains(Player.Name(), britBot))
        {
        Shared.AddArray('cityArr', britArr);
        Shared.AddVar('startCity', 'Britain');
        }
    //else if(Orion.Contains(Player.Name(), jhelBot))
    //    {
    //    var cityArr = Shared.GetArray('jhelArr');
    //    var startCity = 'Jhelom';
    //    }
    else if(Orion.Contains(Player.Name(), newmagBot))
        {
        Shared.AddArray('cityArr', newmagArr);
        Shared.AddVar('startCity', 'New Magincia');
        }
    else if(Orion.Contains(Player.Name(), glowBot))
        {
        Shared.AddArray('cityArr', glowArr);
        Shared.AddVar('startCity', 'Moonglow');
        }
    else
        {
        Shared.AddArray('cityArr', skaraArr);
        Shared.AddVar('startCity', 'Skara Brae');
        }

    if(Orion.Contains(Player.Name(), stealthBot))
        Shared.AddVar('stealth', true);
    else
        Shared.AddVar('stealth', false);
        
    //--Client Options Set
    Orion.OAOptionSet('ShowShoppingProgressBar', 0);
    Orion.ClientOptionSet('CheckPing', 1);
    Orion.ClientOptionSet('PingTimer', 60);
    Orion.ClientOptionSet('BlockWalkingOnMultiStairsInWarMode', 1);
    Orion.ClientOptionSet('AutoOpenDoorsMode', 0);
    Orion.ClientOptionSet('BlockRunWhileHidden', 1);
    Orion.ClientOptionSet('AlwaysRun', 1);
    }
    


