//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliGumpHUD.js
function RecordPlayerPosition()
	{

	if(!TextWindow.IsOpened())
		TextWindow.Open();
	TextWindow.Print('[' + Player.X() + ', ' + Player.Y() + '],')

	}
//Primeval Spawn v5
//mobs
//gore fiend:0x0131
//a vampire bat:0x013D
//dark wisp:0x00A5
//flesh golem:0x0130
//an undead gargoyle:0x02D2
//wight:0x00FC
//dream wraith:0x02E4
//skeletal drake:0x0068
var primevalGraphics = '!0x0131|!0x013D|!0x00A5|!0x0130|!0x02D2|!0x00FC|!0x02E4|!0x0068';
Orion.Exec('JournalScan',true);
Orion.Exec('BuffMonitor',true);
var profiles = 
    {
    Primeval: 
        {
        farmType: 'Mobile', //false, 'Static' , 'Mobile' , 'Leash'
        walkThrough: 'Primeval',
        useGatherMobs: true, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
        mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        mobileFarmConfinementZone: [6500,921,7300,1070], //[x1,y1,x2,y2] x1, y1 is northwest corner; x2, y2 is southeast corner. Set to false to ignore this setting.
        leashFarmRadius: 6, //Radius around the leader to search for mobs
        leashLeader: 0x003DB071, //Serial number of leader
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
		useOnslaught: true,
        useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useEnemyOfOne: false, //true , false.
        useCounterAttack: true, //true , false.
        useConsecrateWeapon: false, //true , false.
        useDivineFury: false, //true , false.
        useAutoLoot: false, //true, false.
        useConfidence: false, //true , false.
            useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
        useBandieSelf: false, //true , false.
            useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
        useBandieOthers: false, //true , false.
            useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }

var profile = profiles.Primeval;
var gumpAssets = 
    [ //functionName,displayName,assetType,value
        [ ['toggle','AutoAttack','AutoAttack'], ['toggle','AutoBuffs','AutoBuffs'], ['toggle','AutoEvade','AutoEvade'], ['toggle','AutoGatherMobs','AutoGatherMobs'] ],
        [ ['toggle','Monitor','Monitor'], ['toggle','Listener','Listener'], ['toggle','DragonHeadMonitor','DragonMonitor'], ['toggle','DemonSkullMonitor','DemonMonitor'] ],
        [ ['toggle','DecoHighlighter','DecoHighlighter'], ['toggle','RunAndHide','RunAndHide'], ['toggle','AlwaysAttackAdjacent','AlwaysAttackAdjacent'] ],
        [ ['toggle','DecoPickup','DecoPickup'], ['toggle','AutoTracker','AutoTracker'], ['toggle','ClearUdp','ClearUdp'] ],
        [ ['xSpacer', 150], ['textInput','ActiveCandle']]
    ];

function forceInitButtons(_)
    {
    Shared.AddArray('gumpValues',defaultButtons);
    Shared.AddVar('ActiveCandle',11);
    }

function initVars()
    {
    for(var r = 0;r<defaultButtons.length;r++)
        {
        var row = defaultButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var assetType = column[0];
            switch(assetType)
                {
                case 'toggle':
                    break;
                case 'text':
                    var sharedName = column[1];
                    Shared.AddVar(sharedName,Shared.GetVar(sharedName,false))
                    break;
                default:
                    break;
                }
            }
        }
    }

function initScripts()
	{
	Orion.IgnoreReset();
	Orion.OAOptionSet('AutoReconnect', '1');
	Orion.Exec(profile.journalScanType, true);
	Orion.Exec('DecoHighlighter', true);
	Orion.Exec('Listener', true);
	Orion.Exec('AutoAttack', true);
	if(profile.useAutoInsure)
		Orion.Exec('AutoInsure', true);
	if(profile.farmType == 'Static')
		Orion.Exec('StaticAutoFarm', true);
	else if(profile.farmType == 'Mobile')
		Orion.Exec('MobileAutoFarm', true);
	else if(profile.farmType == 'Leash')
		Orion.Exec('LeashAutoFarm', true);
	if(profile.useConfidence || profile.useConsecrateWeapon || profile.useCounterAttack || profile.useDivineFury || profile.useEnemyOfOne)
		Orion.Exec('AutoBuffs', true);
	if(profile.useBandieSelf || profile.useBandieOthers)
		Orion.Exec('BandieBot', true);
	}

function terminateScripts()
	{
	Orion.Terminate('all', 'BandieBot|JournalScan|DecoHighlighter|Listener');
	}

function EquipmentDamage()
	{
	WalkThroughRepair();
	}

function StaticAutoFarm()
    {
	var staticFarmRadius = profile.staticFarmRadius;
	var staticFarmStartingPoint = profile.staticFarmStartingPoint;
	var mobGraphic = profile.mobGraphic;
	var useAutoLoot = profile.useAutoLoot;
	var useDiscordPush = profile.useDiscordPush;
	var playerStartX = Player.X();
    var playerStartY = Player.Y();
	var stayStill = profile.stayStill;
	Orion.ClearFakeMapObjects();
	if(!stayStill)
		{
		Orion.GetTilesInRect('land', playerStartX-staticFarmRadius, playerStartY-staticFarmRadius, playerStartX+staticFarmRadius, playerStartY+staticFarmRadius)
			.filter(function(tile)
				{
				var x = tile.X();
				var y = tile.Y();
				return (playerStartX == (x - staticFarmRadius))
					|| (playerStartX == (x + staticFarmRadius))
					|| (playerStartY == (y - staticFarmRadius))
					|| (playerStartY == (y + staticFarmRadius));
				})
			.forEach(function(tile, ind){Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());});
		}
	if(staticFarmStartingPoint[0])
		{
		var startDist = Orion.GetDistance(staticFarmStartingPoint[0],staticFarmStartingPoint[1]) 
		while(startDist > 0 && startDist < 20)
			{
			Orion.WalkTo(staticFarmStartingPoint[0],staticFarmStartingPoint[1],0,0)
			Orion.Wait(500);
			}
		}
    while(!Player.Dead())
        {
		Orion.CharPrint(self, 1159, 'Searching for Mob');
        Orion.SetSearchArea(playerStartX-staticFarmRadius, playerStartY-staticFarmRadius, playerStartX+staticFarmRadius, playerStartY+staticFarmRadius);
        var mob = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|near|live|mobile', 24, 'gray|criminal')[0];
        Orion.ResetSearchArea();
		if(mob)
			{
			//Orion.Wait(Orion.Random(3,16) * 100);
			Orion.CharPrint(self, 1159, 'Mob Found');
			if(!stayStill && mob.Distance() > 1)
				Orion.WalkTo(mob.X() + Orion.Random(-1,2), mob.Y() + Orion.Random(-1,2), mob.Z(), 0);
			if(useAutoLoot)
				{
				Orion.ControlAgent('autoloot','BotLoot','toggle');
				if(Orion.WaitJournal("Autoloot 'BotLoot' stopped", Orion.Now() - 200, Orion.Now() + 200))
					Orion.ControlAgent('autoloot','BotLoot','toggle');
				}
			while(!Player.Dead() && mob.Exists())
				{
				if(!stayStill && mob.Distance() > 1)
					Orion.WalkTo(mob.X() + Orion.Random(-1,2), mob.Y() + Orion.Random(-1,2), mob.Z(), 0);
				Orion.Wait(500);
				}
			if(useAutoLoot)
				Orion.Wait(4000 + Orion.Random(3,16) * 100); //Looting Wait
			else
				Orion.Wait(100);
			}
		else //if no mobs in area
			{
			if(Player.TithingPoints() < 10000)
				Orion.Exec('RecallTithingPoints',true);
			if(!stayStill && Orion.GetDistance(playerStartX, playerStartY) > 2)
				{
				Orion.CharPrint(self, 1159, 'Returning to Start Position');
				Orion.WalkTo(playerStartX + Orion.Random(-2,3),playerStartY + Orion.Random(-2,3), 0, 0);
				}
			Orion.Wait(500);
			}
        }
	if(useDiscordPush)
		DiscordPush(Orion.ShardName() + ': ' + Player.Name() + ' died!')
	Orion.Relogin();
    }


function MobileAutoFarm()
    {
    var cycle = 0;
    var playerStartX = Player.X();
    var playerStartY = Player.Y();
    var mobileFarmConfinementZone = profile.mobileFarmConfinementZone;

    while(!Player.Dead()) 
        {
        if(Orion.Now() >= cycle + 5000)
            {
            Orion.IgnoreReset();
            Orion.Print('ignores reset')
            cycle = Orion.Now();
            }
        Orion.UseIgnoreList('MobileAutoFarmIgnore');
        if(mobileFarmConfinementZone)
            {
            Orion.SetSearchArea(mobileFarmConfinementZone[0],mobileFarmConfinementZone[1],mobileFarmConfinementZone[2],mobileFarmConfinementZone[3]);
            var mob = Orion.FindTypeEx(any, any, ground, 'near|mobile|ignorefriends', 24, 'gray|orange|red|criminal')[0];
            Orion.ResetSearchArea();
            }
        else
            var mob = Orion.FindTypeEx(any, any, ground, 'near|mobile|ignorefriends', 24, 'gray|orange|red|criminal')[0];
        if(mob) 
            {
            if(mob.Distance() > 1 && !Orion.WalkTo(mob.X(), mob.Y(), mob.Z(),0,100,1,1,50000))
                {
                Orion.Print('5sec ignore: ' + mob.Name())
                Orion.Ignore(mob.Serial())
                }
            }
        else
            Orion.WalkTo(playerStartX, playerStartY, 0, 0);
        Orion.Wait(200);
        }
    }	


function DropDraggedHere()
    {
    var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
        .filter(function(tile)
            {
            Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
            var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
            var itemCheck = Orion.FindType(any,any,ground,'item').length < 8;
            return mobCheck && itemCheck;
            });
    Orion.ResetSearchArea();
    var validTile = null;
    for(var i=0;i<validTiles.length;i++)
        {
        if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
            {
            validTile = validTiles[i];
            break;
            }
        }
    if(validTile)
        {
        var validTileX = validTile.X();
        var validTileY = validTile.Y();
        var validTileZ = validTile.Z();
        Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
        Orion.DropDraggedItem(ground, validTileX, validTileY, validTileZ);
        }
    else 
        Orion.CharPrint(self, 1159, 'No valid tiles nearby!');    
    }

function AddToDropQueue()
    {
    while(true)
        {
        var check = Orion.WaitForAddObject('myTarget');
        if(check != 1)
            break;
        Orion.Exec('DropFromQueue',true);
        var serial = Orion.GetSerial('myTarget');
        var tempArr = Shared.GetArray('dropQueue', []);
        //Orion.Print(tempArr);
        var ind = tempArr.indexOf(serial);
        if(ind == -1)
            {
            tempArr.push(serial);
            Orion.TestItemColor(serial, '1159');
            }
        else
            {
            tempArr.splice(ind,1);
            Orion.TestItemColor(serial, '0');
            }
        Shared.AddArray('dropQueue',tempArr);
        Orion.Wait(1);
        }
    }

function DropFromQueue()
    {
    var endStamp = Orion.Now() + 5000;
    while(true)
        {
        var tempArr = Shared.GetArray('dropQueue');
        if(tempArr[0])
            {
            var itemSerial = tempArr.shift();
            Shared.AddArray('dropQueue',tempArr);
            while(Orion.FindType(any).indexOf(itemSerial) > -1)
                {
                var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
                    .filter(function(tile)
                        {
                        Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
                        var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
                        var itemCheck = Orion.FindType(any,any,ground,'item').length < 8;
                        return mobCheck && itemCheck;
                        });
                Orion.ResetSearchArea();
                var validTile = null;
                for(var i=0;i<validTiles.length;i++)
                    {
                    if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
                        {
                        validTile = validTiles[i];
                        break;
                        }
                    }
                if(validTile)
                    {
                    var validTileX = validTile.X();
                    var validTileY = validTile.Y();
                    var validTileZ = validTile.Z();
                    //Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
                    Orion.Drop(itemSerial, 0, validTileX, validTileY, validTileZ);
                    }
                Orion.Wait(250);  
                }
            endStamp = Orion.Now() + 5000;
            }
        if(Orion.Now() > endStamp)
            break;
        Orion.Wait(1);
        }
    }
function DropDraggedToContainer()
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer');
    if(Orion.HaveTarget())
        {
        return Orion.CharPrint(self,1159,"Can't set new drop container while target cursor is up!");
        }
	else if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
        Orion.CharPrint(self,1159,'Target new drop container or press Escape to keep using old container')
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}
function EquipDemonColdAxe()
	{
	EquipWep('Demon', 'Cold', 'Double Axe');
	}
function EquipDemonPhysicalAxe()
	{
	EquipWep('Demon', 'Physical', 'Double Axe');
	}
function EquipDragonColdStaff()
	{
	EquipWep('Dragon', 'Physical', 'Double Axe');
	}
function EquipRepondAxe()
	{
	EquipWep('Repond', false, 'Double Axe');
	}
function EquipArachnidFireAxe()
	{
	EquipWep('Arachnid', 'Fire', 'Double Axe');
	}
function EquipElementalFireAxe()
	{
	EquipWep('Elemental', 'Fire', 'Double Axe');
	}
function EquipUndeadFireAxe()
	{
	EquipWep('Undead', 'Fire', 'Double Axe');
	}
function EquipElementalColdAxe()
	{
	EquipWep('Elemental', 'Cold', 'Double Axe');
	}
function EquipDragonColdStaff()
	{
	EquipWep('Dragon', 'Cold', 'Bladed Staff', 'Reptile');
	}
function EquipReptileColdAxe()
	{
	EquipWep('Reptile', 'Cold', 'Double Axe');
	}

function EquipWep(slayer, element, weapon, cameo)
	{
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

function DressLuck()
	{
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var setName = Player.Name().slice(5, Player.Name().length) + ' Luck'
	else
		var setName = Player.Name() + ' Luck'
	Orion.Dress(setName);
	}

function EquipLRC()
	{
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var setName = Player.Name().slice(5, Player.Name().length) + ' LRC'
	else
		var setName = Player.Name() + ' LRC'
	Orion.Dress(setName);
	}

function EquipSamp()
	{
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var setName = Player.Name().slice(5, Player.Name().length) + ' Samp'
	else
		var setName = Player.Name() + ' Samp'
	Orion.Dress(setName);
	}

function LogOut()
    {
    Orion.OAOptionSet('AutoReconnect', 0);
    Orion.LogOut();
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
		})[0];
	if(!body)
		return false;
	var bodyX = body.X();
	var bodyY = body.Y();
	var endTime = Orion.Now() + 10000;
	while(Orion.GetDistance(bodyX,bodyY > 1) || !Orion.ObjAtLayer(1))
		{
		if(Orion.Now() > endTime)
			return false;
    	Orion.WalkTo(bodyX, bodyY);
        Orion.UseObject(body.Serial());
		Orion.Wait(1300);
		}
	return true;
    }

function SacredJourneyWithSuit()
	{
	Orion.Dress('Luna Lance');
	Orion.Cast('Sacred Journey');
	}

function WalkThroughRepair()
    {
    var x = 6993;
    var y = 1370;    //6993 1370
    var distance = Orion.GetDistance(x,y);
    while(distance > 0)
        {
        if(distance > 998)
            {
            Orion.CharPrint(self,1159,'Skipping WalkTo: ' + x +',' + y);
            break;
            }
        Orion.WalkTo(x,y,0,0);
        Orion.Wait(1);
        distance = Orion.GetDistance(x,y);
        }
	Orion.PauseScript('DecoHighlighter');
    Orion.Wait(1000);
	Orion.Terminate('DecoHighlighter');
	var tempX = Player.X();
	var tempY = Player.Y();
	while(tempX == Player.X() && tempY == Player.Y())
		{
		Orion.Dress('Luna Lance');
		Orion.Cast('Sacred Journey');
		if(Orion.WaitForTarget(5000))
			{
			var runebook = Orion.FindTypeEx('0x22C5').filter(function(item)
				{
				Orion.Print('test')
				var name = item.Properties().match(/.+$/);
				Orion.Print('name:' + name)
				return name == 'Samp';
				})[0];
			Orion.TargetObject(runebook.Serial());
			}
		Orion.Wait(6000);
		}
	Orion.Dress('Armor');
    Orion.WarMode(0);
    do
        {
        Orion.Step('n');
        Orion.Wait(2000);
        var bench = Orion.FindTypeEx('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 10)[0];
        } while(!bench)
    if(!Orion.WalkTo(bench.X(),bench.Y()))
        Orion.WalkTo(bench.X(),bench.Y());
    Orion.Wait(1500);
    RepairGear();
    Orion.Wait(1500);
	Orion.Dress('Luna Lance');
    Orion.Exec('WalkThroughCurrentFarm');
    }

function WalkThroughCurrentFarm()
	{
	Orion.Terminate('all', 'WalkThroughCurrentFarm|JournalScan');
	if(profile.walkThrough == 'Oni')
		{	
		RecallByGump('Main','Dojo', 'Main', 'Dojo2');
		WalkThrough([[987, 196, false, '67:337:w'],[66, 352, false, '63:524:w'],[103, 556, false, '76:691:w'],[176, 664, false,'176:664:w']]);
		}
	else if(profile.walkThrough == 'Primeval')
		{	
		RecallByGump('Aaron','Aaron');
		AliWalkTo(957,561)
		while(Orion.GetDistance(957,561) == 0)
			{
			Orion.Wait(1000);
			}
		Orion.Wait(2000);
		Orion.Dress('Armor');
		WalkThrough([[513, 584, false, '6994:1370:s'],[6936, 1092]]);
		}
	Orion.Wait(100);
	Orion.Exec('WalkSpawn', true);
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

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ profile.discordHook //hook
	+ "/"
	+ profile.discordKey; //key
	Orion.HttpPost(bot, "content=" + message);
	}

//if you wait until a deco item unlocks and note the number of red candles, you can let it revert one red candle and build it back up one red candle to get another deco drop each time
//10 minutes for a red candle to revert

//bot locations
//7029,1045
//7000,958

function DecoGrabberBot()
    {
    var startX = 7000;
    var startY = 957;
    var startZ = 25;
    while(!Player.Dead())
        {
        while(Orion.GetDistance(startX,startY) > 2)
            {
            Orion.WalkTo(startX,startY,startZ,0);
            Orion.Wait(300);
            }
        if(!Player.Hidden())
            {
            Orion.UseSkill('Hiding')
            }
		var deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C|!0x171F',any,ground,'item',24).filter(function(item)
            {
            return Orion.Contains(item.Properties(),'Weight');
            })[0];
        if(deco)
            {
            DiscordPush(Player.Name() + ': Deco Found: ' + deco.Properties());
            var attempt = 0;
            while(deco && attempt < 4)
                {
                while(deco && deco.Distance() > 2)
                    {
                    Orion.WalkTo(deco.X(),deco.Y(),deco.Z());
                    Orion.Wait(300);
                    }
                Orion.MoveItem(deco.Serial());
                attempt++;
                Orion.Wait(1300);
                deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C|!0x171F',any,ground,'item',24).filter(function(item)
                    {
                    return Orion.Contains(item.Properties(),'Weight');
                    })[0];
                }
            if(deco && deco.Container() != Orion.GetSerial(backpack))
                DiscordPush(Player.Name() + ': DECO NOT PICKED UP');
            }
        }
    }

function RetrieveDeco()
	{
	Orion.ResetSearchArea();
	DiscordPush(Player.Name() + " retrieving deco item");
	Orion.Exec('AlwaysAttackAdjacent',true);
	var backpackSerial = Orion.GetSerial(backpack);
	var waypoints = [
		// [6999,951],
		// [6999, 969],
		// [7032,995],
		// [7021,1053],
		// [7036,1076],
		// [7095,1058],
		// [7036,960],
		// [6942,1045],
		// [6935,1057],
		// [6977,1025],
		// [6961,969],
		[6999, 957],
		[6999, 944],
		[6977, 961],
		[7024, 961],
		[6999, 987],
		[7033, 991],
		[7054, 986],
		[7021, 1045],
		[7031, 1078],
		[7058, 1074],
		[7085, 1066],
		[7069, 1025],
		[7000, 1012],
		[6938, 1035],
		[6941, 1063],
		[6977, 1032],
		[6974, 1056],
	]
	for(var i=0;i<waypoints.length;i++)
		{
		var waypoint = waypoints[i];
        AliWalkTo(waypoint[0],waypoint[1]);
		var attempt = 0;
		var deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C|!0x171F',any,ground,'item',24).filter(function(item)
			{
			return Orion.Contains(item.Properties(),'Weight');
			})[0];
		while(deco && attempt < 3)
			{
			var itemSerial = deco.Serial();
			var itemX = deco.X();
			var itemY = deco.Y();
			var endTime = Orion.Now() + 5000
			while(Orion.GetDistance(itemX,itemY) > 2 && Orion.Now() < endTime)
				{
				if(!Orion.WalkTo(itemX,itemY,0,2))
					break;
				Orion.Wait(1300);
				}
			if(Orion.GetDistance(itemX,itemY) <= 2)
				{
				Orion.MoveItem(itemSerial);
				Orion.Wait(1300);
				if(Orion.GetContainer(itemSerial) == backpackSerial)
					{
					var itemProps = deco.Properties();
					while(!Orion.Contains(deco.Properties(),'Insured'))
						{
						Orion.WaitContextMenuID(self, 418);
						Orion.RequestContextMenu(self);
						if(Orion.WaitForTarget(3000))
							Orion.TargetObject(itemSerial);
						if(Orion.WaitForTarget(3000))
							Orion.CancelTarget();
						Orion.Wait(500);
						}
					DiscordPush(Player.Name() + " picked up deco: " + itemProps);
					return RunAndHide();
					}
				}
			deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C|!0x171F',any,ground,'item',24).filter(function(item)
				{
				return Orion.Contains(item.Properties(),'Weight');
				})[0];
			attempt++;
			}
		}
	if(deco)
		DiscordPush(Player.Name() + " couldn't pick up deco item: " + deco.Properties() + ': Running back to hiding spot');
	else
		DiscordPush(Player.Name() + " couldn't find deco item! Running back to hiding spot");
	return RunAndHide();
	}

function RunAndHide()
	{
	Orion.Exec('Listener',true);
	var hideX = 6993;
	var hideY = 1087;
	AliWalkTo(hideX,hideY);
	return HideTilHidden();
	}

function DecoHighlighter()
	{
	while(true)
		{
		var deco = Orion.FindTypeEx('!0x0EED|!0x5743|!0x171F|!0x14EF|!0x1E22|!0x318C',any,ground,'item',20).filter(function(item)
			{
			return Orion.Contains(item.Properties(),'Weight');
			});
		deco.forEach(function(item)
			{
            Orion.SetTrack(true,item.X(),item.Y())
			Orion.CharPrint(self,1159,item.Name())
			//Orion.CharPrint(item.Serial(),1159,item.Name() + '\nV')
            if(item.Distance() < 3)
                {
                Orion.MoveItem(item.Serial());
                Orion.SetTrack(false);
                }
			})
        Orion.Wait(1000)
        }
	}
	
function DecoPickup()
	{
    var startX = Player.X();
    var startY = Player.Y();
	while(true)
		{
        while(Orion.GetDistance(startX,startY) > 0)
            {
            Orion.WalkTo(startX,startY,0,0);
            Orion.Wait(100);
            }
		var deco = Orion.FindTypeEx('!0x0EED|!0x5743|!0x171F|!0x14EF|!0x1E22|!0x318C',any,ground,'item',10).filter(function(item)
			{
			return Orion.Contains(item.Properties(),'Weight');
			})[0];
		while(deco)
			{
			Orion.CharPrint(self,1159,deco.Name())
			Orion.CharPrint(deco.Serial(),1159,deco.Name() + '\nV')
            if(deco.Distance() > 2)
            	{
            	Orion.WalkTo(deco.X(),deco.Y());
            	Orion.Wait(50);
            	}
            else
            	{
                Orion.MoveItem(deco.Serial());
       			Orion.Wait(1000);
       			if(Orion.GetContainer(deco.Serial()) == Orion.GetSerial(backpack))
					{
					var itemProps = deco.Properties();
					while(!Orion.Contains(deco.Properties(),'Insured'))
						{
						Orion.WaitContextMenuID(self, 418);
						Orion.RequestContextMenu(self);
						if(Orion.WaitForTarget(3000))
							Orion.TargetObject(deco.Serial());
						if(Orion.WaitForTarget(3000))
							Orion.CancelTarget();
						Orion.Wait(750);
						}
					DiscordPush(Player.Name() + " picked up deco: " + itemProps);
					}
                }
        	Orion.Wait(50);
            deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C|!0x171F',any,ground,'item',10).filter(function(item)
				{
				return Orion.Contains(item.Properties(),'Weight');
				})[0];
			}
        Orion.Wait(50);
        }
	}


function ProgressSpawn()
	{
	var mobCloseThreshold = 3;
	var mobFarThreshold = 8;
	var searchCloseRadius = 10;
	var searchFarRadius = 16
	DiscordPush(Player.Name() + ' progressing spawn');
	var waypoints = [
		[6973, 1051],
        [6947, 1036],
        [6974, 1019],
        [6972, 997],
        [6959, 987],
        [6965, 971],
        [6974, 990],
        [7000, 986],
        [7001, 1001],
        [7031, 993],
        [7035, 968],
        [7047, 996],
        [7023, 1019],
        [7022, 1041],
        [7022, 1022],
        [7040, 992],
        [7038, 969],
        [7022, 994],
        [7006, 999],
        [6999, 987],
        [6999, 963],
        [6982, 993],
        [6967, 977],
        [6961, 988],
        [6971, 1002],
        [6953, 1027],
        [6980, 1030],
		];
	var mobGraphic = profile.mobGraphic;
	Orion.Exec('DecoHighlighter',true);
	Orion.Exec('AutoAttack',true);
	Orion.Exec('AutoGatherMobs',true);
	Orion.Exec('AutoEvade',true);
	Orion.Exec('Listener',true);
	while(!Player.Dead())
        {
		var waypoint = waypoints.shift();
		waypoints.push(waypoint);
		var x = Orion.Random(-1,1) + waypoint[0];
		var y = Orion.Random(-1,1) + waypoint[1];
		while(Orion.GetDistance(x ,y) > 1)
			{
			Orion.WalkTo(x,y);
			Orion.Wait(300);
			}
		Orion.CharPrint(self, 1159, 'Searching for Mob');
        var mobsFar = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live', searchFarRadius, 'gray|criminal').filter(function(mob)
			{
			return mob.Z() < 20;
			}).length
		Orion.CharPrint(self,1159,'Far mobs: ' + mobsFar);
		if(mobsFar > mobFarThreshold)
			{
			var mobsClose = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live', searchCloseRadius, 'gray|criminal').filter(function(mob)
			{
			return mob.Z() < 20;
				}).sort(function(a,b)
					{
					return a.Distance() - b.Distance();
					});
			while(mobsClose.length > 3)
				{
				Orion.CharPrint(self, 1159,'Nearby mobs: ' + mobsClose.length);
				var mob = mobsClose[0];
				if(mob.Distance() > 1)
					Orion.WalkTo(mob.X(),mob.Y());
				Orion.Wait(200);
				mobsClose = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live', searchCloseRadius, 'gray|criminal').filter(function(mob)
					{
					return mob.Z() < 20;
					}).sort(function(a,b)
						{
						return a.Distance() - b.Distance();
						});
				}
			}
		Orion.Wait(100);
        }
	}

function WalkSpawn()
	{
	Shared.AddVar('discordLink',"https://discordapp.com/api/webhooks/" + profile.discordHook + "/" + profile.discordKey)
	DiscordPush(Player.Name() + ' progressing spawn');
	var waypoints = [
		[6972, 1052],
		[6943, 1051],
		[6951, 1022],
		[6976, 1019],
		[6974, 999],
		[6955, 987],
		[6963, 969],
		[6970, 990],
		[6999, 984],
		[6999, 964],
		[6987, 973],
		[7013, 974],
		[7005, 987],
		[7004, 1002],
		[7027, 992],
		[7039, 969],
		[7053, 993],
		[7039, 1005],
		[7020, 1021],
		[7022, 1043],
		[7048, 1051],
		[7057, 1032],
		[7039, 1012],
		[7036, 994],
		[7032, 982],
		[7005, 1004],
		[6987, 1004],
		[6972, 992],
		[6965, 977],
		[6958, 988],
		[6949, 1020],
		[6946, 1045],
		[6978, 1048],
		];
	Orion.Exec('DecoHighlighter',true);
	Orion.Exec('AutoAttack',true);
	Orion.Exec('AttackSpawn',true);
	Orion.Exec('AutoGatherMobs',true);
	Orion.Exec('AutoEvade',true);
	Orion.Exec('Listener',true);
	while(!Player.Dead())
        {
		var waypoint = waypoints.shift();
		waypoints.push(waypoint);
		var x = Orion.Random(-1,1) + waypoint[0];
		var y = Orion.Random(-1,1) + waypoint[1];
		AliWalkTo(x,y);
		Orion.Wait(10);
        }
	}

function AttackSpawn()
	{
	var mobCloseThreshold = 6;
	var mobCloseStayThreshold = 2;
	var searchCloseRadius = 10;
	var mobGraphic = profile.mobGraphic;
	while(!Player.Dead())
		{
		Orion.Wait(200);
		var mobsClose = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', searchCloseRadius, 'gray|criminal|red').filter(function(mob)
			{
			return mob.Z() < 19;
			});
		Orion.Print('Mobs: ' + mobsClose.length);
		if(mobsClose.length <= mobCloseThreshold)
			continue;
		mobsClose.sort(function(a,b)
			{
			var radius = 4;
			var aX = a.X();
			var aY = a.Y();
			var bX = b.X();
			var bY = b.Y();
			Orion.SetSearchArea(aX - radius,aY - radius,aX + radius,aY + radius);
			var aMobs = Orion.FindType(mobGraphic,any,ground,'ignorefriends|live|inlos',24,'gray|criminal|red').length;
			Orion.SetSearchArea(bX - radius,bY - radius,bX + radius,bY + radius);
			var bMobs = Orion.FindType(mobGraphic,any,ground,'ignorefriends|live|inlos',24,'gray|criminal|red').length;
			Orion.ResetSearchArea();
			return bMobs - aMobs;
			return a.Distance() - b.Distance();
			});
		Orion.PauseScript('WalkSpawn');
		Orion.Wait(200);
		Orion.StopWalking();
		while(mobsClose.length > mobCloseStayThreshold)
			{
			var mob = mobsClose[0];
			Orion.CharPrint(mob.Serial(), 1159,'Densest');
			if(mob.Distance() > 2 && Orion.FindType(mobGraphic,any,ground,'ignoreself|live|inlos',2,'gray|criminal|red').length < 4)
				if(!Orion.WalkTo(mob.X(),mob.Y()))
					Orion.Ignore(mob.Serial());
			Orion.Wait(200);
			mobsClose = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', searchCloseRadius, 'gray|criminal|red').filter(function(mob)
				{
				return mob.Z() < 19;
				}).sort(function(a,b)
					{
					var radius = 4;
					var aX = a.X();
					var aY = a.Y();
					var bX = b.X();
					var bY = b.Y();
					Orion.SetSearchArea(aX - radius,aY - radius,aX + radius,aY + radius);
					var aMobs = Orion.FindType(mobGraphic,any,ground,'ignorefriends|live|inlos',24,'gray|criminal|red').length;
					Orion.SetSearchArea(bX - radius,bY - radius,bX + radius,bY + radius);
					var bMobs = Orion.FindType(mobGraphic,any,ground,'ignorefriends|live|inlos',24,'gray|criminal|red').length;
					Orion.ResetSearchArea();
					return bMobs - aMobs;
					return a.Distance() - b.Distance();
					});
			}
		Orion.ResumeScript('WalkSpawn');
		Orion.Wait(200);
		}
	}

function FindMostDenseMob(a,b)
	{
	var radius = 4;
	var aX = a.X();
	var aY = a.Y();
	var bX = b.X();
	var bY = b.Y();
	Orion.SetSearchArea(aX - radius,aY - radius,aX + radius,aY + radius);
	var aMobs = Orion.FindType(mobGraphic,any,ground,'ignoreself|ignorefriends|live|inlos',24,'gray|criminal').length;
	Orion.SetSearchArea(bX - radius,bY - radius,bX + radius,bY + radius);
	var bMobs = Orion.FindType(mobGraphic,any,ground,'ignoreself|ignorefriends|live|inlos',24,'gray|criminal').length;
	Orion.ResetSearchArea();
	return bMobs - aMobs;
	}

function Listener()
	{
	Orion.RemoveAllUdpServers();
	var port = 50000;
	var create = 1;
	var endTime = Orion.Now() + 5000;
	while(create != 0 && Orion.Now() < endTime) 
		{
		create = Orion.CreateUdpServer('Candle', ++port);
		Orion.Wait(10);
		}
	Orion.Print('Port: ' + (port || 'Server Creation Failed'));
    while(!Player.Dead())
        {
        var recv = Orion.UdpRecv('Candle');
        if(recv)
            {
			if(Orion.Contains(recv,'Progress'))
				{
				Orion.Exec('WalkSpawn',true);
				}
			else if(Orion.Contains(recv,'Retrieve'))
				{
				Orion.PauseScript('all','Listener|DecoHighlighter|AutoEvade|BuffMonitor|JournalScan');
				Orion.Wait(200);
				Orion.Terminate('all','Listener|DecoHighlighter|AutoEvade|BuffMonitor|JournalScan');
				Orion.Exec('RetrieveDeco',true);
				}
			else if(Orion.Contains(recv,'Candles'))
				{
				var split = Orion.Split(recv,':');
				var redCandles = split[0];
				var whiteCandles = split[1];
				Shared.AddVar('candleStr', recv);
				var gump = Orion.CreateCustomGump(15001);
				gump.Clear();
				gump.AddResizepic(0, 0, 0xDAC, 100, 80);
				gump.AddTilePic(17,10,0x1853,0x0026);
				gump.AddTilePic(17,35,0x1854,0);
				gump.AddText(55,15,0,redCandles);
				gump.AddText(55,45,0,whiteCandles);
				gump.Update();
				}
			else if(Orion.Contains(recv,'Dragon'))
				{
				var split = Orion.Split(recv,':');
				var revertTime = split[1];
				Shared.AddVar('revertTime', revertTime);
				var gump = Orion.CreateCustomGump(15001);
				gump.Clear();
				gump.AddResizepic(0, 0, 0xDAC, 170, 50);
				gump.AddTilePic(17,10,0x1853,0x0026);
				gump.AddText(55,15,0,revertTime);
				gump.Update();
				}
            }
		Orion.Wait(500);
		}
	DiscordPush(Player.Name() + ' died!');
	Orion.LogOut()
	}

function Monitor()
    {
    var targetRed = Shared.GetVar('ActiveCandle',11);
    Orion.Print('M: ' + Number(targetRed))
	var create = Orion.CreateUdpServer('Candle', 50000);
	if(create == 0)
		Orion.Print('Server Creation Success');
	else
		return Orion.Print('Server Creation Fail');
    Orion.RemoveDisplayTimer('revertTimer');
    var candleGraphics = '0x1853|0x1854|0x1855|0x1856|0x1857|0x1858|0x1859|0x185A'
    var altar = Orion.FindTypeEx('0x1F18',any,ground,'',24)[0];
    while(!altar)
        {
        Orion.Wait(1000);
        altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
        }
    var searchArea = [altar.X() - 2,altar.Y() - 2, altar.X() + 2, altar.Y() + 2];
    var redMonitor = 0;
    var firstPass = true;
	//TextWindow.Open();
    while(true)
        {
		//var recv = Orion.UdpRecv('Candle');
		// while(recv)
		// 	{
		// 	TextWindow.Print(recv);
		// 	Orion.Wait(10);
		// 	recv = Orion.UdpRecv('Candle');
		// 	}
        if(Orion.FindType('0x03FA|0x03F7|0x03F9|0x03F8','0x0452',ground,'',24).length == 4)
            {
            Orion.SetSearchArea(searchArea[0],searchArea[1],searchArea[2],searchArea[3]);
            var redCandles = Orion.FindType(candleGraphics,'0x0026',ground,'item',24).length;
            var whiteCandles = Orion.FindType(candleGraphics,'!0x0026',ground,'item',24).length; 
            Orion.ResetSearchArea();
			var data = redCandles + ':' + whiteCandles + ':Candles';
			for(var i=50001;i<50010;i++)
				Orion.UdpSend(i,data);
            if(redMonitor != redCandles && !firstPass)
                {
				Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                DiscordPush('Red Candles: ' + redCandles);
				if(redCandles == +targetRed - 1)
					for(var i=50001;i<50010;i++)
						Orion.UdpSend(i,'Progress');
				if(redCandles == +targetRed)
					for(var i=50001;i<50010;i++)
						Orion.UdpSend(i,'Retrieve');
				//Orion.SayGuild('Red Candles: ' + redCandles)
                }
            firstPass = false;
            redMonitor = redCandles;
		    var gump = Orion.CreateCustomGump(15001);
		    gump.Clear();
		    gump.AddResizepic(0, 0, 0xDAC, 100, 80);
		    gump.AddTilePic(17,10,0x1853,0x0026);
			gump.AddTilePic(17,35,0x1854,0);
			gump.AddText(55,15,0,redCandles);
			gump.AddText(55,45,0,whiteCandles);
		    gump.Update();
            }
        Orion.Wait(1000);
        }
    }

function DragonHeadMonitor()
    {
	var create = Orion.CreateUdpServer('Candle', 50000);
	if(create == 0)
		Orion.Print('Server Creation Success');
	else
		return Orion.Print('Server Creation Fail');
    Orion.RemoveDisplayTimer('revertTimer');
    Orion.IgnoreReset();
    var firstPass = true;
	//TextWindow.Open();
    while(true)
        {
		Orion.ResetSearchArea();
        if(Orion.FindType('0x0E5F|0x2234',any,ground,'',24)[3])
            {
			Orion.Wait(2000)
            Orion.SetSearchArea(7003,936,7003,936);
            var dragonHead = Orion.FindType('0x2234',any,ground, '', 24)[0];
            Orion.SetSearchArea(6985,954,6985,954);
            var rune = Orion.FindType('0x0E5F',any,ground, '', 24)[0];
            Orion.ResetSearchArea();
			var data = 0;
            if(Orion.DisplayTimerExists('revertTimer'))
            if(!dragonHead || !rune)
                {	
				Orion.SetSearchArea(7003,936,7003,936);
				var dragonHead = Orion.FindType('0x2234',any,ground, '', 24)[0];
				Orion.SetSearchArea(6985,954,6985,954);
				var rune = Orion.FindType('0x0E5F',any,ground, '', 24)[0];
				Orion.ResetSearchArea();
				if(!dragonHead || !rune)
					{	
					DiscordPush('Shenanigans afoot. First FindType found something, but not the second');
					Orion.Wait(1000);
					Orion.PauseScript('DragonHeadMonitor');
					}
                }
            if(dragonHead && rune && !firstPass)
                {
				for(var i=50001;i<50010;i++)
					Orion.UdpSend(i,'Retrieve');
				Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                }
            while(dragonHead && rune)
                {
				data = Orion.DisplayTimerGetTime('revertTimer');
				for(var i=50001;i<50010;i++)
					Orion.UdpSend(i,'Dragon:' + data);
                Orion.SetSearchArea(7003,936,7003,936);
                var dragonHead = Orion.FindType('0x2234',any,'ground', '', 24)[0];
                Orion.SetSearchArea(6985,954,6985,954);
                var rune = Orion.FindType('0x0E5F',any,'ground', '', 24)[0];
                Orion.ResetSearchArea();
                Orion.Wait(1000);
				var susCheck = Orion.FindTypeEx(primevalGraphics,any,ground,'live',24).filter(function(mob)
					{
					return !Orion.Contains(mob.Properties(),'I AM A SAMPIRE|Disco Stu|Im With Leech|Thessaly|Pickle Chips|Ralph Waldo')
					});
				if(susCheck[0])
					{
					var outMsg = 'dragonHead detector found players: \n';
					susCheck.forEach(function(mob) 
						{
						outMsg += '\t' + outMsg + mob.Name() + '\n';
						Orion.Ignore(mob.Serial());
						});
					DiscordPush(outMsg);
					}
                }
			Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
			DiscordPush('Dragon Head Start!');
			Orion.Wait(1000);
			for(var i=50001;i<50010;i++)
				Orion.UdpSend(i,'Progress');
			Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
            }
        Orion.Wait(1000);
		
		data = Orion.DisplayTimerGetTime('revertTimer');
		for(var i=50001;i<50010;i++)
			Orion.UdpSend(i,'Dragon:' + data);
		firstPass = false;
		var susCheck = Orion.FindTypeEx(primevalGraphics,any,ground,'live',24).filter(function(mob)
			{
			return !Orion.Contains(mob.Properties(),'I AM A SAMPIRE|Disco Stu|Im With Leech|Thessaly|Pickle Chips|Ralph Waldo')
			});
		if(susCheck[0])
			{
			var outMsg = 'dragonHead detector found players: \n';
			susCheck.forEach(function(mob) 
				{
				'\t' + outMsg + mob.Name() + '\n';
				Orion.Ignore(mob.Serial());
				});
			DiscordPush(outMsg);
			}
        }
    }

function DemonSkullMonitor()
    {
	var create = Orion.CreateUdpServer('Candle', 50000);
	if(create == 0)
		Orion.Print('Server Creation Success');
	else
		return Orion.Print('Server Creation Fail');
    Orion.RemoveDisplayTimer('revertTimer');
    Orion.IgnoreReset();
    var firstPass = true;
	//TextWindow.Open();
    while(true)
        {
		Orion.ResetSearchArea();
        if(Orion.FindType('0x2251',any,ground,'',24)[4])
            {
			Orion.Wait(2000)
            Orion.SetSearchArea(6995,953,6995,953);
            var skull1 = Orion.FindType('0x2251',any,ground, '', 24)[0];
            Orion.SetSearchArea(7005,953,7005,953);
            var skull2 = Orion.FindType('0x2251',any,ground, '', 24)[0];
            Orion.ResetSearchArea();
			var data = 0;
            if(Orion.DisplayTimerExists('revertTimer'))
            if(!skull1 || !skull2)
                {	
				Orion.SetSearchArea(6995,953,6995,953);
				var skull1 = Orion.FindType('0x2251',any,ground, '', 24)[0];
				Orion.SetSearchArea(7005,953,7005,953);
				var skull2 = Orion.FindType('0x2251',any,ground, '', 24)[0];
				Orion.ResetSearchArea();
				if(!skull1 || !skull2)
					{	
					DiscordPush('Shenanigans afoot. First FindType found something, but not the second');
					Orion.Wait(1000);
					Orion.PauseScript('DemonSkullMonitor');
					}
                }
            if(skull1 && skull2 && !firstPass)
                {
				for(var i=50001;i<50010;i++)
					Orion.UdpSend(i,'Retrieve');
				Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                }
            while(skull1 && skull2)
                {
				data = Orion.DisplayTimerGetTime('revertTimer');
				for(var i=50001;i<50010;i++)
					Orion.UdpSend(i,'Dragon:' + data);
				Orion.SetSearchArea(6995,953,6995,953);
				var skull1 = Orion.FindType('0x2251',any,ground, '', 24)[0];
				Orion.SetSearchArea(7005,953,7005,953);
				var skull2 = Orion.FindType('0x2251',any,ground, '', 24)[0];
				Orion.ResetSearchArea();
                Orion.Wait(1000);
				var susCheck = Orion.FindTypeEx(primevalGraphics,any,ground,'live',24).filter(function(mob)
					{
					return !Orion.Contains(mob.Properties(),'I AM A SAMPIRE|Disco Stu|Im With Leech|Thessaly|Pickle Chips|Ralph Waldo')
					});
				if(susCheck[0])
					{
					var outMsg = 'demonSkull detector found players: \n';
					susCheck.forEach(function(mob) 
						{
						outMsg += '\t' + outMsg + mob.Name() + '\n';
						Orion.Ignore(mob.Serial());
						});
					DiscordPush(outMsg);
					}
                }
			Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
			DiscordPush('Demon Skull Start!');
			Orion.Wait(1000);
			for(var i=50001;i<50010;i++)
				Orion.UdpSend(i,'Progress');
			Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
            }
        Orion.Wait(1000);
		
		data = Orion.DisplayTimerGetTime('revertTimer');
		for(var i=50001;i<50010;i++)
			Orion.UdpSend(i,'Dragon:' + data);
		firstPass = false;
		var susCheck = Orion.FindTypeEx(primevalGraphics,any,ground,'live',24).filter(function(mob)
			{
			return !Orion.Contains(mob.Properties(),'I AM A SAMPIRE|Disco Stu|Im With Leech|Thessaly|Pickle Chips|Ralph Waldo')
			});
		if(susCheck[0])
			{
			var outMsg = 'demonSkull detector found players: \n';
			susCheck.forEach(function(mob) 
				{
				'\t' + outMsg + mob.Name() + '\n';
				Orion.Ignore(mob.Serial());
				});
			DiscordPush(outMsg);
			}
        }
    }

function CandleMonitor()
    {
	var create = Orion.CreateUdpServer('Candle', 60000);
	if(create == 0)
		Orion.Print('Server Creation Success');
	else
		return Orion.Print('Server Creation Fail');
    Orion.RemoveDisplayTimer('revertTimer');
    var candleGraphics = '0x1853|0x1854|0x1855|0x1856|0x1857|0x1858|0x1859|0x185A'
    var altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
    while(!altar)
        {
        Orion.Wait(1000);
        altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
        }
    var searchArea = [altar.X() - 2,altar.Y() - 2, altar.X() + 2, altar.Y() + 2];
    var redMonitor = 0;
    var firstPass = true;
	TextWindow.Open();
    while(true)
        {
		//var recv = Orion.UdpRecv('Candle');
		// while(recv)
		// 	{
		// 	TextWindow.Print(recv);
		// 	Orion.Wait(10);
		// 	recv = Orion.UdpRecv('Candle');
		// 	}
        if(Orion.FindType('0x03FA|0x03F7|0x03F9|0x03F8','0x0452',ground,'',24).length == 4)
            {
            Orion.SetSearchArea(searchArea[0],searchArea[1],searchArea[2],searchArea[3]);
            var redCandles = Orion.FindType(candleGraphics,'0x0026',ground,'item',24).length;
            var whiteCandles = Orion.FindType(candleGraphics,'!0x0026',ground,'item',24).length; 
            Orion.ResetSearchArea();
			var data = redCandles + ':' + whiteCandles;
			for(var i=60001;i<60010;i++)
				Orion.UdpSend(i,data);
            if(redMonitor != redCandles && !firstPass)
                {
				Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                DiscordPush('Red Candles: ' + redCandles);
				//Orion.SayGuild('Red Candles: ' + redCandles)
                }
            firstPass = false;
            redMonitor = redCandles;
		    var gump = Orion.CreateCustomGump(15001);
		    gump.Clear();
		    gump.AddResizepic(0, 0, 0xDAC, 100, 80);
		    gump.AddTilePic(17,10,0x1853,0x0026);
			gump.AddTilePic(17,35,0x1854,0);
			gump.AddText(55,15,0,redCandles);
			gump.AddText(55,45,0,whiteCandles);
		    gump.Update();
            }
        Orion.Wait(1000);
        }
    }

function CandleReceiver()
	{
	Orion.RemoveAllUdpServers();
	var port = 60000;
	var create = 1;
	var endTime = Orion.Now() + 5000;
	while(create != 0 && Orion.Now() < endTime) 
		{
		create = Orion.CreateUdpServer('Candle', ++port);
		Orion.Wait(10);
		}
	Orion.Print('Port: ' + (port || 'Server Creation Failed'));
    while(true)
        {
        var recv = Orion.UdpRecv('Candle');
        if(recv)
            {
			if(Orion.Contains(recv,'Candles'))
				{
				var split = Orion.Split(recv,':');
				var redCandles = split[0];
				var whiteCandles = split[1];
				Shared.AddVar('candleStr', recv);
				var gump = Orion.CreateCustomGump(15001);
				gump.Clear();
				gump.AddResizepic(0, 0, 0xDAC, 100, 80);
				gump.AddTilePic(17,10,0x1853,0x0026);
				gump.AddTilePic(17,35,0x1854,0);
				gump.AddText(55,15,0,redCandles);
				gump.AddText(55,45,0,whiteCandles);
				gump.Update();
				}
            }
		Orion.Wait(500);
		}
	}

//--#Lever Puzzle
var solution = [false,false,false,false,false,false];
var startX = 7000;
var startY = 965;
var leverGraphics = [0x108E,0x1008C]

var levers = [//[color,order,x,y]
	[0x014F,0,6981,977, 'Red'],
	[0x047E,1,6984,977, 'White'],
	[0x0497,2,6987,977, 'Black'],
	[0x005F,3,6990,977, 'Blue'],
	[0x000F,4,7009,977, 'Purple'],
	[0x0042,5,7012,977, 'Green'],
	[0x0489,6,7015,977, 'Orange'],
	[0x048E,7,7018,977, 'Pink']
	]
	
function PrimevalLevers()
	{
	var remaining = CheckRemainingEntries(solution);
	while(remaining > 0)
		{
		Orion.Wait(10);
		var leverAarr = levers.shift();
		var leverBarr = levers.shift();
		if(remaining != 2 && ((leverAarr[1] < 4 && leverBarr[1] > 3) || (leverBarr[1] < 4 && leverAarr[1] > 3)))
			{
			Orion.Print(leverAarr)
			Orion.Print(leverBarr)
			levers.push(leverAarr);
			levers.push(leverBarr);
			continue;
			}
		Orion.CharPrint(self,1159,'Testing: ' + leverAarr[4] + ' and ' + leverBarr[4]);
		PrintSolution();
		var result = TestLeverPair(leverAarr,leverBarr);
		if(result == 'A')
			levers.unshift(leverBarr);
		else if(result == 'B')
			levers.unshift(leverAarr);
		remaining = CheckRemainingEntries(solution);
		}
	PrintSolution();
	PullSolutionLevers();
	}

function PullSolutionLevers()
	{
	//var solution = ['White','Pink','Green','Orange','Purple','Red']
	var solutionObj = {
		'Red': [0x014F,0,6981,977],
		'White': [0x047E,1,6984,977],
		'Black': [0x0497,2,6987,977],
		'Blue': [0x005F,3,6990,977],
		'Purple': [0x000F,4,7009,977],
		'Green': [0x0042,5,7012,977],
		'Orange': [0x0489,6,7015,977],
		'Pink': [0x048E,7,7018,977]
		}
	for(var i=0;i<solution.length;i++)
		{
		var instructions = solutionObj[solution[i]];
		while(Orion.GetDistance(instructions[2],instructions[3]) > 2)
			{
			Orion.WalkTo(instructions[2],instructions[3],0,2);
			Orion.Wait(500);
			}
		var lever = Orion.FindType('0x108E|0x108C',instructions[0],ground,'',20)[0];
		Orion.UseObject(lever);
		Orion.Wait(1300);
		}
	}

function PullLever(leverSerial)
	{
	var leverObj = Orion.FindObject(leverSerial);
	if(!leverObj)
		{
		while(Orion.GetDistance(startX,startY) > 0)
			{
			Orion.WalkTo(startX,startY,0,0);
			Orion.Wait(500);
			}
		return PullLever(leverSerial);
		}
	var beforeGraphic = leverObj.Graphic();
	while(leverObj.Graphic() == beforeGraphic)
		{
		while(leverObj.Distance() > 2)
			{
			Orion.WalkTo(leverObj.X(),leverObj.Y(),0,2)
			Orion.Wait(500);
			}
		var posCheck = Player.X() + '' + Player.Y();
		Orion.UseObject(leverSerial)
		Orion.Wait(1300);
		if(Player.X() + '' + Player.Y() != posCheck)
			return false;
		}
	return true;
	}

function CheckRemainingEntries(arr)
	{ //return number of false entries in array
	var falseCount = 0;
	for(var i = 0;i<arr.length;i++)
		{
		if(arr[i] === false)
			falseCount++;
		}
	return falseCount;
	}

function TestLeverPair(leverAarr,leverBarr)
	{
	var leverA = Orion.FindType('0x108E|0x108C',leverAarr[0],ground,'',20)[0];
	var leverB = Orion.FindType('0x108E|0x108C',leverBarr[0],ground,'',20)[0];
	if(!leverA || !leverB)
		{
		while(Orion.GetDistance(startX,startY) > 0)
			{
			Orion.WalkTo(startX,startY,0,0);
			Orion.Wait(500);
			}
		var leverA = Orion.FindType('0x108E|0x108C',leverAarr[0],ground,'',20)[0];
		var leverB = Orion.FindType('0x108E|0x108C',leverBarr[0],ground,'',20)[0];
		if(!leverA || !leverB)
			{
			Orion.Print('test')
			return [];
			}
		}
	var checks = 0;
	while(checks < 2)
		{
		for(var i = 0;i<solution.length;i++)
			{
			
			var currentTestPosition = solution[i];
			if(currentTestPosition !== false)
				continue;
			var startTime = Orion.Now();
			for(var s = 0;s<6;s++)
				{
				if(s === i)
					{
					if(!PullLever(leverA))
						{
						while(Orion.GetDistance(startX,startY) > 0)
							{
							Orion.WalkTo(startX,startY,0,0);
							Orion.Wait(500);
							}
						return 'A';
						}
					}
				else
					{
					if(!PullLever(leverB))
						{
						while(Orion.GetDistance(startX,startY) > 0)
							{
							Orion.WalkTo(startX,startY,0,0);
							Orion.Wait(500);
							}
						return 'B';
						}  
					}
				}
			if(Orion.InJournal('An eerie voice says: "Pulling the levers out of order will get you nothing, fool!"','sys',any,any,startTime))
				{
				solution[i] = leverBarr[4];
				checks++;
				remaining = CheckRemainingEntries(solution);
				if(remaining == 1)
					{
					for(var i=0;i<solution.length;i++)
						{
						if(!solution[i])
							{
							Orion.Print(leverAarr[4])
							solution[i] = leverAarr[4];
							return;
							}
						}
					}
				PrintSolution();
				}
			else if(Orion.InJournal('A condescending voice says: "Perhaps you are smarter than a boura. Barely."','sys',any,any,startTime))
				{
				solution[i] = leverAarr[4];
				checks++;
				remaining = CheckRemainingEntries(solution);
				if(remaining == 1)
					{
					for(var i=0;i<solution.length;i++)
						{
						if(!solution[i])
							{
							Orion.Print(leverBarr[4])
							solution[i] = leverBarr[4];
							return;
							}
						}
					}
				PrintSolution();
				}
			if(checks >= 2)
				break;
			}
		}
	}

function PrintSolution()
	{
	var outStr = '';
	for(var i = 0;i<solution.length;i++)
		{
		if(!solution[i])
			outStr += 'Unknown';
		else
			outStr += solution[i];
		if(i == 2 || i == 5)
			outStr += '\n';
		else
			outStr += ':';
		}
	Orion.CharPrint(self,1159,outStr);
	}

function PrimevalPlayerDetector(){
	while(true){
		var mobCheck = Orion.FindTypeEx(primevalGraphics,any,'ground','mobile|ignoreself|ignorefriends',24,'red|gray|blue|criminal|orange');
		if(mobCheck[0]){
			var mobCheckFiltered = mobCheck.filter(function(mob){
				return !Orion.Contains(mob.Properties(),'the Prisoner');
			})
			if(mobCheckFiltered[0]){
				DiscordPush(Player.Name() + ': Stranger detected: ' + mobCheckFiltered[0].Properties())
				Orion.Ignore(mobCheckFiltered[0].Serial())
			}
		}
	Orion.Wait(1000);
	}
}
