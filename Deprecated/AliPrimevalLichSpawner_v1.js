//Primeval Spawn

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
        journalScanType: '', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }

var profile = profiles.Primeval;

var gumpButtons = [
	[['AutoAttack'], ['AutoBuffs'], 'AutoEvade', ['AutoGatherMobs']],
	['Monitor', 'Listener'],
	['DecoHighlighter', 'RunAndHide'],
	]

function AliPrimevalGumpCall(_) 
	{
	
    var gump = Orion.CreateCustomGump(10420); 
	var buttonGraphic = [0x16D4,0x16D5]; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
    var state // Shared variable to set the initial state to off (Untoggled Radio Dot), defaults to '0x00D0'
	var gumpOption
    gump.Clear();
    gump.SetCallback('AliPrimevalGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', 500, 500); //0xDAC 0x254e 0x2560 9bf5
	var i = 0;
	var c = 0;
	var r = 0;
	var rowAdj = 40;
	var columnAdj = 120;
	var rowStart = 40;
	var columnStart = 20;
	var buttonTextHorAdj = 32;
	var buttonTextVerAdj = 3;
	var textColor = 1159;
	gump.AddButton(0, 400, 460, 0x2EE0,0x2EE0,0x2EE1, '0x0000');
	gump.AddText(185,15, textColor, "Ali's Primeval Spawner")
    var i = 1
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var gumpOption = row[c];
            state = Shared.GetVar(gumpOption, false);
            gump.AddButton(i, columnStart + (columnAdj * c), rowStart + (rowAdj * (r)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
            gump.AddText(columnStart + buttonTextHorAdj + (columnAdj * (c)), rowStart + buttonTextVerAdj + (rowAdj * r), textColor, gumpOption)
			i+=1;
            }
        }
	// //Row 1
	// gumpOption = 'AutoAttack';
	// i = 1, c = 1, r = 1;
	// state = Shared.GetVar(gumpOption, false);
	// gump.AddButton(i, columnStart + (columnAdj * (c - 1)), rowStart + (rowAdj * (r - 1)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
	// gump.AddText(columnStart + buttonTextAdj + (columnAdj * (c - 1)), rowStart + 3 + (rowAdj * (r - 1)), textColor, gumpOption)

	// gumpOption = 'AutoBuffs';
	// i = 2, c = 2, r = 1;
	// state = Shared.GetVar(gumpOption, false);
	// gump.AddButton(i, columnStart + (columnAdj * (c - 1)), rowStart + (rowAdj * (r - 1)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
	// gump.AddText(columnStart + buttonTextAdj + (columnAdj * (c - 1)), rowStart + 3 + (rowAdj * (r - 1)), textColor, gumpOption)

	// gumpOption = 'AutoGather';
	// i = 3, c = 3, r = 1;
	// state = Shared.GetVar(gumpOption, false);
	// gump.AddButton(i, columnStart + (columnAdj * (c - 1)), rowStart + (rowAdj * (r - 1)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
	// gump.AddText(columnStart + buttonTextAdj + (columnAdj * (c - 1)), rowStart + 3 + (rowAdj * (r - 1)), textColor, gumpOption)

	// gumpOption = 'AutoGather';
	// i = 4, c = 4, r = 1;
	// state = Shared.GetVar(gumpOption, false);
	// gump.AddButton(i, columnStart + (columnAdj * (c - 1)), rowStart + (rowAdj * (r - 1)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
	// gump.AddText(columnStart + buttonTextAdj + (columnAdj * (c - 1)), rowStart + 3 + (rowAdj * (r - 1)), textColor, gumpOption)
	
	// //Column 2
	// gumpOption = 'AutoBuffs';
	// i =5, c = 1, r = 2;
	// state = Shared.GetVar(gumpOption, false);
	// gump.AddButton(i, columnStart + (columnAdj * (c - 1)), rowStart + (rowAdj * (r - 1)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
	// gump.AddText(columnStart + buttonTextAdj + (columnAdj * (c - 1)), rowStart + 3 + (rowAdj * (r - 1)), textColor, gumpOption)

    gump.Update();
	}

function AliPrimevalGumpCallback(_) 
	{
    var code = CustomGumpResponse.ReturnCode();
    var i = 1
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var gumpOption = row[c];
            if(code == i)
                {
                ToggleFunction(gumpOption);
                }
            i++;
            }
        }
	}

function ToggleFunction(option)
	{
	var state = !Shared.GetVar(option, false);
	state ? Orion.Exec(option,true) : Orion.Terminate(option);
	Orion.Print(option + ': ' + state);
	Shared.AddVar(option, state); // Swaps the value of the state variable, if off, turn on
	AliPrimevalGumpCall();
	}

function ToggleShared(option)
	{
	var state = !Shared.GetVar(option, false);
	Orion.Print(option + ': ' + state);
	Shared.AddVar(option, state); // Swaps the value of the state variable, if off, turn on
	AliPrimevalGumpCall();
	}

function initScripts()
	{
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
	Orion.Terminate('all', 'BandieBot|JournalScan|DecoHighlighter|CandleReceiver');
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

function AutoAttack()
    {
	Shared.AddVar('AutoAttack',true);
    var useSingleTargetSpecial = profile.useSingleTargetSpecial;
    var singleTargetSpecial = profile.singleTargetSpecial;
    var useMomentumStrike = profile.useMomentumStrike;
    var useWhirlwind = profile.useWhirlwind;
    var whirlwindSpecial = profile.whirlwindSpecial;
    while(!Player.Dead())
        {
        var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 2, 'gray|red|criminal|orange');
        var enemyCount = enemies.length;
        if(enemyCount)
            Orion.Attack(enemies[0]);
        switch(enemyCount)
            {
            case 0:
                break;
            case 1:
                if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
                break;
            case 2:
                if(useMomentumStrike)
                    {
                    if(!Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    }
                else if(useWhirlwind)
                    {
                    if(!Orion.AbilityStatus(whirlwindSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    }
                break;
            default: //more than 2 enemies
                if(useWhirlwind)
                    {
                    if(!Orion.AbilityStatus(whirlwindSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    }
                else if(useMomentumStrike)
                    {
                    if(!Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    }
                break;
            }
        Orion.Wait(500);
        }
    }

function AutoEvade()
	{
	Shared.AddVar('AutoEvade',true);
	var lowestHPPercent = 40;
	var highestHPPercent = 80;
	while(!Player.Dead())
		{
		var count = Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red').length;
		if(!Orion.BuffExists('Evasion') && Player.Hits('%') < Math.min((lowestHPPercent + (2 * count)), highestHPPercent))
			{
			CastEvasion();
			}
		Orion.Wait(100);
		}
	}

function AutoBuffs()
    {
	Shared.AddVar('AutoBuffs',true);
    var useConfidence = profile.useConfidence;
    var useConfidenceThresholdPercent = profile.useConfidenceThresholdPercent;
    var useEnemyOfOne = profile.useEnemyOfOne;
    var useCounterAttack = profile.useCounterAttack;
    var useConsecrateWeapon = profile.useConsecrateWeapon;
    var useDivineFury = profile.useDivineFury;
    var nextSpellTime = 0;
    while(!Player.Dead())
        {
        if(Orion.Now() > nextSpellTime && Player.Mana() > 20)
            {
            if(useConfidence && Player.Hits('%') < useConfidenceThresholdPercent && !Orion.BuffExists('Confidence'))
                {
                Orion.Cast('Confidence');
                nextSpellTime = Orion.Now() + 1200;
                }
            else if(useEnemyOfOne && !Orion.BuffExists('Enemy of One'))
                {
                Orion.Cast('Enemy of One');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useCounterAttack && !Orion.BuffExists('Counter Attack'))
                {
                Orion.Cast('Counter Attack');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useConsecrateWeapon && !Orion.BuffExists('Consecrate Weapon'))
                {
                Orion.Cast('Consecrate Weapon');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useDivineFury && !Orion.BuffExists('Divine Fury'))
                {
                Orion.Cast('Divine Fury');
                nextSpellTime = Orion.Now() + 2000;
                }
            }
        Orion.Wait(100);
        }
    }
 
function AutoGatherMobs()
    {
	Shared.AddVar('AutoGatherMobs',true);
    while(!Player.Dead())
        {
        GatherMobs();
        Orion.Wait(500);
        }
    }	

function GatherMobs()
    {
    Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red')
        .forEach(function(mob)
            {
            Orion.TargetSystemSerial(mob);
            Orion.Attack(mob);
            Orion.Wait(10);
            });
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends|ignoreself|nothuman', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
    }


function AttackNearest()
    {
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
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
		RecallByGump('Fel Dungeons','Aaron', 'Fel Dungeons','Aaron');
		while(Orion.GetDistance(957,561) > 0)
			{
			Orion.WalkTo(957,561,0,0);
			Orion.Wait(500);
			}
		while(Orion.GetDistance(957,561) == 0)
			{
			Orion.Wait(1000);
			}
		Orion.Wait(2000);
		WalkThrough([[513, 584, false, '6994:1370:s'],[6936, 1092]]);
		}
	Orion.Wait(100);
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

function JournalScan()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var journalScanType = profile.journalScanType;
	var msg = ''
	if(Orion.Contains(journalScanType, 'GM'))
		msg += 'GM'
	if(Orion.Contains(journalScanType, 'Equipment Damage'))
		msg += '|equipment is severely';
	if(Orion.Contains(journalScanType, 'Control Messages'))
		msg += '|inithome|initfarm|initscripts|haltscripts|closefollow'
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
					if(useAlarmSound)
						Orion.PlayWav('Alarm09.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(6000);
					break;
				case 'severely':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": Equipment is damaged")
					//if(useAlarmSound)
						//Orion.PlayWav('Alarm.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					RunAndHide();
					break;
				case 'inithome':
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(2000);
					Orion.Exec('RecallByGump', true, ['Main','Home']);
					break;
				case 'initfarm':
					Orion.Terminate('all', 'JournalScan');
					Orion.Exec('WalkThroughCurrentFarm', true);
					break;
				case 'initscripts':
					Orion.Terminate('all', 'JournalScan');
					initScripts();
					break;
				case 'haltscripts':
					Orion.Terminate('all', 'JournalScan');
					break;
				case 'closefollow':
					Orion.Terminate('all', 'JournalScan');
					Orion.Exec('CloseFollow', true);
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
	+ profile.discordHook //hook
	+ "/"
	+ profile.discordKey; //key
	Orion.HttpPost(bot, "content=" + message);
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


function RepairGear()
	{
	var itemArr = 
		[
		'0x2D2D',	'Assassin Spike(left)',							'blacksmith',
		'0x2D21',	'Assassin Spike(right)',						'blacksmith',
		'0x0F4A',	'Axe(left)',											'blacksmith',
		'0x0F49',	'Axe(right)',										'blacksmith',
		'0x0F4E',	'Bardiche(left)',									'blacksmith',
		'0x0F4D',	'Bardiche(right)',									'blacksmith',
		'0x0F48',	'Battle Axe(left)',									'blacksmith',
		'0x0F47',	'Battle Axe(right)',								'blacksmith',
		'0x0DF0',	'Black Staff(left)',								'carpenter',
		'0x0DF1',	'Black Staff(right)',								'carpenter',
		'0x26BD',	'Bladed Staff(left)',								'blacksmith',
		'0x26C7',	'Bladed Staff(right)',							'blacksmith',
		'0x27A8',	'Bokuto(mono)',									'carpenter',
		'0x26BB',	'Bone Harvester(left)',							'blacksmith',
		'0x26C5',	'Bone Harvester(right)',						'blacksmith',
		'0x13B1',	'Bow(left)',											'fletcher',
		'0x13B2',	'Bow(right)',										'fletcher',
		'0x0F5F',	'Broadsword(left)',								'blacksmith',
		'0x0F5E',	'Broadsword(right)',							'blacksmith',
		'0x1B72',	'Bronze Shield(mono)',						'blacksmith',
		'0x1B73',	'Buckler (mono)',								'blacksmith',
		'0x13F7',	'Butcher Knife(left)',							'tinker',
		'0x13F6',	'Butcher Knife(right)',							'tinker',
		'0x1BC3',	'Chaos Shield(mono)',							'blacksmith',
		'0x0EC2',	'Cleaver(left)',									'tinker',
		'0x0EC3',	'Cleaver(right)',									'tinker',
		'0x13B3',	'Club(left)',											'carpenter',
		'0x13B4',	'Club(right)',										'carpenter',
		'0x26C2',	'Composite Bow(left)',							'fletcher',
		'0x26CC',	'Composite Bow(right)',						'fletcher',
		'0x26C1',	'Crescent Blade(left)',							'blacksmith',
		'0x26CB',	'Crescent Blade(right)',						'blacksmith',
		'0x13F4',	'Crook(left)',										'carpenter',
		'0x13F5',	'Crook(right)',										'carpenter',
		'0x0F50',	'Crossbow(left)',									'fletcher',
		'0x0F4F',	'Crossbow(right)',								'fletcher',
		'0x1440',	'Cutlass(left)',										'blacksmith',
		'0x1441',	'Cutlass(right)',									'blacksmith',
		'0x0F52',	'Dagger(left)',										'blacksmith',
		'0x0F51',	'Dagger(right)',									'blacksmith',
		'0x27A9',	'Daisho(mono)',									'blacksmith',
		'0x2D30',	'Diamond Mace(left)',							'blacksmith',
		'0x2D24',	'Diamond Mace(right)',						'blacksmith',
		'0x0F4C',	'Double Axe(left)',								'blacksmith',
		'0x0F4B',	'Double Axe(right)',								'blacksmith',
		'0x26BF',	'Double Bladed Staff(left)',					'blacksmith',
		'0x26C9',	'Double Bladed Staff(right)',					'blacksmith',
		'0x2D2A',	'Elven Composite Longbow(left)',			'fletcher',
		'0x2D1E',	'Elven Composite Longbow(right)',		'fletcher',
		'0x2D35',	'Elven Machete(left)',							'blacksmith',
		'0x2D29',	'Elven Machete(right)',						'blacksmith',
		'0x2D2C',	'Elven Spellblade(left)',						'blacksmith',
		'0x2D20',	'Elven Spellblade(right)',						'blacksmith',
		'0x0F46',	"Executioner's Axe(left)",						'blacksmith',
		'0x0F45',	"Executioner's Axe(right)",					'blacksmith',
		'0x13F9',	'Gnarled Staff(left)',							'carpenter',
		'0x13F8',	'Gnarled Staff(right)',							'carpenter',
		'0x143E',	'Halberd(left)',									'blacksmith',
		'0x143F',	'Halberd(right)',									'blacksmith',
		'0x143C',	'Hammer Pick(left)',							'blacksmith',
		'0x143D',	'Hammer Pick(right)',							'blacksmith',
		'0x0F44',	'Hatchet(left)',									'tinker',
		'0x0F43',	'Hatchet(right)',									'tinker',
		'0x1B77',	'Heater Shield(left)',							'blacksmith',
		'0x1B76',	'Heater Shield(right)',							'blacksmith',
		'0x13FC',	'Heavy Crossbow(left)',						'fletcher',
		'0x13FD',	'Heavy Crossbow(right)',						'fletcher',
		'0x27AD',	'Kama(mono)',									'blacksmith',
		'0x13FE',	'Katana(left)',										'blacksmith',
		'0x13FF',	'Katana(right)',									'blacksmith',
		'0x1400',	'Kryss(left)',										'blacksmith',
		'0x1401',	'Kryss(right)',										'blacksmith',
		'0x27A7',	'Lajatang(mono)',								'blacksmith',
		'0x26C0',	'Lance(left)',										'blacksmith',
		'0x26CA',	'Lance(right)',										'blacksmith',
		'0x13FA',	'Large Battle Axe(left)',						'blacksmith',
		'0x13FB',	'Large Battle Axe(right)',						'blacksmith',
		'0x2D2E',	'Leafblade(left)',									'blacksmith',
		'0x2D22',	'Leafblade(right)',								'blacksmith',
		'0x0F60',	'Longsword(left)',								'blacksmith',
		'0x0F61',	'Longsword(right)',								'blacksmith',
		'0x0F5D',	'Mace(left)',										'blacksmith',
		'0x0F5C',	'Mace(right)',										'blacksmith',
		'0x2D2B',	'Magical Shortbow(left)',						'fletcher',
		'0x2D1F',	'Magical Shortbow(right)',					'fletcher',
		'0x143A',	'Maul(left)',										'blacksmith',
		'0x143B',	'Maul(right)',										'blacksmith',
		'0x1B75',	'Metal Kite Shield(left)',						'blacksmith',
		'0x1B74',	'Metal Kite Shield(right)',						'blacksmith',
		'0x1B7B',	'Metal Shield(mono)',							'blacksmith',
		'0x27A2',	'No-dachi(mono)',								'blacksmith',
		'0x27AE',	'Nunchaku(mono)',								'tinker',
		'0x1BC5',	'Order Shield(left)',								'blacksmith',
		'0x1BC4',	'Order Shield(right)',							'blacksmith',
		'0x2D34',	'Ornate Axe(left)',								'blacksmith',
		'0x2D28',	'Ornate Axe(right)',								'blacksmith',
		'0x0E85',	'Pickaxe(left)',									'tinker',
		'0x0E86',	'Pickaxe(right)',									'tinker',
		'0x26BE',	'Pike(left)',											'blacksmith',
		'0x26C8',	'Pike(right)',										'blacksmith',
		'0x0E88',	'Pitchfork(left)',									'tinker',
		'0x0E87',	'Pitchfork(right)',									'tinker',
		'0x0E8A',	'Quarter Staff(left)',							'carpenter',
		'0x0E89',	'Quarter Staff(right)',							'carpenter',
		'0x2D33',	'Radiant Scimitar(left)',						'blacksmith',
		'0x2D27',	'Radiant Scimitar(right)',						'blacksmith',
		'0x26C3',	'Repeating Crossbow(left)',					'fletcher',
		'0x26CD',	'Repeating Crossbow(right)',				'fletcher',
		'0x2D32',	'Rune Blade(left)',								'blacksmith',
		'0x2D26',	'Rune Blade(right)',								'blacksmith',
		'0x27AF',	'Sai(mono)',										'blacksmith',
		'0x26BC',	'Scepter(left)',									'blacksmith',
		'0x26C6',	'Scepter(right)',									'blacksmith',
		'0x13B5',	'Scimitar(left)',									'blacksmith',
		'0x13B6',	'Scimitar(right)',									'blacksmith',
		'0x26BA',	'Scythe(left)',										'blacksmith',
		'0x26C4',	'Scythe(right)',									'blacksmith',
		'0x1402',	'Short Spear(left)',								'blacksmith',
		'0x1403',	'Short Spear(right)',							'blacksmith',
		'0x0EC5',	'Skinning Knife(left)',							'tinker',
		'0x0EC4',	'Skinning Knife(right)',							'tinker',
		'0x0FB4',	'Sledge Hammer(left)',						'tinker',
		'0x0FB5',	'Sledge Hammer(right)',						'tinker',
		'0x13E3',	"Smith's Hammer(left)",						'tinker',
		'0x13E4',	"Smith's Hammer(right)",					'tinker',
		'0x0F63',	'Spear(left)',										'blacksmith',
		'0x0F62',	'Spear(right)',									'blacksmith',
		'0x1B79',	'Tear Kite Shield(left)',						'blacksmith',
		'0x1B78',	'Tear Kite Shield(right)',						'blacksmith',
		'0x27AB',	'Tekagi(mono)',									'blacksmith',
		'0x27A3',	'Tessen(mono)',									'blacksmith',
		'0x27A6',	'Tetsubo(mono)',								'carpenter',
		'0x1442',	'Two Handed Axe(left)',						'blacksmith',
		'0x1443',	'Two Handed Axe(right)',						'blacksmith',
		'0x13BA',	'Viking Sword(left)',							'blacksmith',
		'0x13B9',	'Viking Sword(right)',							'blacksmith',
		'0x27A4',	'Wakizashi(mono)',								'blacksmith',
		'0x13AF',	'War Axe(left)',									'blacksmith',
		'0x13B0',	'War Axe(right)',									'blacksmith',
		'0x2D2F',	'War Cleaver(left)',								'blacksmith',
		'0x2D23',	'War Cleaver(right)',							'blacksmith',
		'0x1404',	'War Fork(left)',									'blacksmith',
		'0x1405',	'War Fork(right)',								'blacksmith',
		'0x1438',	'War Hammer(left)',							'blacksmith',
		'0x1439',	'War Hammer(right)',							'blacksmith',
		'0x1406',	'War Mace(left)',								'blacksmith',
		'0x1407',	'War Mace(right)',								'blacksmith',
		'0x2D31',	'Wild Staff(left)',									'carpenter',
		'0x2D25',	'Wild Staff(right)',								'carpenter',
		'0x1B7A',	'Wooden Shield(mono)',						'carpenter',
		'0x27A5',	'Yumi(mono)',									'fletcher',
		'0x153F',	'Bandana(mono)',								'tailor',
		'0x140D',	'Bascinet(left)',									'blacksmith',
		'0x140C',	'Bascinet(right)',									'blacksmith',
		'0x1545',	'Bear Mask(mono)',								'tailor',
		'0x1454',	'Bone Armor(left)',								'tailor',
		'0x144F',	'Bone Armor(right)',							'tailor',
		'0x144E',	'Bone Arms(left)',								'tailor',
		'0x1453',	'Bone Arms(right)',								'tailor',
		'0x1450',	'Bone Gloves(left)',								'tailor',
		'0x1455',	'Bone Gloves(right)',							'tailor',
		'0x1451',	'Bone Helmet(left)',								'tailor',
		'0x1456',	'Bone Helmet(right)',							'tailor',
		'0x1457',	'Bone Leggings(left)',							'tailor',
		'0x1452',	'Bone Leggings(right)',						'tailor',
		'0x1F06',	'Bracelet(mono)',								'tinker',
		'0x1086',	'Bracelet(mono)',								'tinker',
		'0x13BB',	'Chainmail Coif(left)',							'blacksmith',
		'0x13C0',	'Chainmail Coif(right)',						'blacksmith',
		'0x2774',	'Chainmail Hatsuburi(mono)',				'blacksmith',
		'0x13C3',	'Chainmail Leggings(left)',				'blacksmith',
		'0x13BE',	'Chainmail Leggings(right)',				'blacksmith',
		'0x13C4',	'Chainmail Tunic(left)',						'blacksmith',
		'0x13BF',	'Chainmail Tunic(right)',						'blacksmith',
		'0x1409',	'Close Helm(left)',								'blacksmith',
		'0x1408',	'Close Helmet(right)',							'blacksmith',
		'0x2778',	'Decorative Platemail Kabuto(mono)',	'blacksmith',
		'0x1547',	'Deer Mask(mono)',							'tailor',
		'0x171A',	'Feathered Hat(mono)',						'tailor',
		'0x1C07',	'Female Leather Armor(left)',				'tailor',
		'0x1C06',	'Female Leather Armor(right)',				'tailor',
		'0x1C05',	'Female Plate(left)',							'blacksmith',
		'0x1C04',	'Female Plate(right)',							'blacksmith',
		'0x1713',	'Floppy Hat(mono)',							'tailor',
		'0x2777',	'Heavy Platemail Jingasa(mono)',			'blacksmith',
		'0x140B',	'Helmet(left)',										'blacksmith',
		'0x140A',	'Helmet(right)',									'blacksmith',
		'0x2B75',	'Hide Gloves(mono)',							'tailor',
		'0x2B76',	'Hide Gorget(mono)',							'tailor',
		'0x2B78',	'Hide Pants(mono)',							'tailor',
		'0x2B77',	'Hide Pauldrons(mono)',						'tailor',
		'0x2B74',	'Hide Tunic(mono)',							'tailor',
		'0x171C',	'Jester Hat(mono)',								'tailor',
		'0x2798',	'Kasa(mono)',										'tailor',
		'0x2FC8',	'Leaf Arms(mono)',								'tailor',
		'0x2FC6',	'Leaf Gloves(mono)',							'tailor',
		'0x2FC7',	'Leaf Gorget(mono)',							'tailor',
		'0x2FC9',	'Leaf Leggings(mono)',						'tailor',
		'0x2FCA',	'Leaf Tonlet(mono)',							'tailor',
		'0x2FC5',	'Leaf Tunic(mono)',								'tailor',
		'0x1C0B',	'Leather Bustier(left)',							'tailor',
		'0x1C0A',	'Leather Bustier(right)',						'tailor',
		'0x1DB9',	'Leather Cap(left)',								'tailor',
		'0x1DBA',	'Leather Cap(right)',							'tailor',
		'0x277B',	'Leather Do(mono)',							'tailor',
		'0x13C6',	'Leather Gloves(left)',							'tailor',
		'0x13CE',	'Leather Gloves(right)',						'tailor',
		'0x13C7',	'Leather Gorget(mono)',						'tailor',
		'0x278A',	'Leather Haidate(mono)','					tailor',
		'0x277E',	'Leather Hiro Sode(mono)',					'tailor',
		'0x2776',	'Leather Jingasa(mono)',						'tailor',
		'0x13D2',	'Leather Leggings(left)',						'tailor',
		'0x13CB',	'Leather Leggings(right)',						'tailor',
		'0x277A',	'Leather Mempo(mono)',						'tailor',
		'0x278E',	'Leather Ninja Hood(mono)',				'tailor',
		'0x2793',	'Leather Ninja Jacket(mono)',				'tailor',
		'0x2792',	'Leather Ninja Mitts(mono)',					'tailor',
		'0x2791',	'Leather Ninja Pants(mono)'	,				'tailor',
		'0x1C01',	'Leather Shorts(left)',							'tailor',
		'0x1C00',	'Leather Shorts(right)',						'tailor',
		'0x1C09',	'Leather Skirt(left)',								'tailor',
		'0x1C08',	'Leather Skirt(right)',							'tailor',
		'0x13C5',	'Leather Sleeves(left)',						'tailor',
		'0x13CD',	'Leather Sleeves(right)',						'tailor',
		'0x2786',	'Leather Suneate(mono)',					'tailor',
		'0x13D3',	'Leather Tunic(left)',							'tailor',
		'0x13CC',	'Leather Tunic(right)',							'tailor',
		'0x2781',	'Light Platemail Jingasa(mono)',			'blacksmith',
		'0x140F',	'Norse Helm(left)',								'blacksmith',
		'0x140E',	'Norse Helm(right)',							'blacksmith',
		'0x1F0B',	'Orc Helm(left)',									'tailor',
		'0x1F0C',	'Orc Helm(right)',								'tailor',
		'0x141B',	'Orc Mask(mono)',								'tailor',
		'0x1412',	'Plate Helm(left)',								'blacksmith',
		'0x1419',	'Plate Helm(right)',								'blacksmith',
		'0x1410',	'Platemail Arms(left)',							'blacksmith',
		'0x1417',	'Platemail Arms(right)',						'blacksmith',
		'0x2785',	'Platemail Battle Kabuto(mono)',			'blacksmith',
		'0x277D',	'Platemail Do(mono)',							'blacksmith',
		'0x1414',	'Platemail Gloves(left)',						'blacksmith',
		'0x1418',	'Platemail Gloves(right)',						'blacksmith',
		'0x1413',	'Platemail Gorget(mono)',					'blacksmith',
		'0x278D',	'Platemail Haidate(mono)',					'blacksmith',
		'0x2775',	'Platemail Hatsuburi(mono)',				'blacksmith',
		'0x2780',	'Platemail Hiro Sode(mono)',				'blacksmith',
		'0x141A',	'Platemail Legs(left)',							'blacksmith',
		'0x1411',	'Platemail Legs(right)',						'blacksmith',
		'0x2779',	'Platemail Mempo(mono)',					'blacksmith',
		'0x2788',	'Platemail Suneate(mono)',					'blacksmith',
		'0x1416',	'Platemail Tunic(left)',							'blacksmith',
		'0x1415',	'Platemail Tunic(right)',						'blacksmith',
		'0x2B71',	'Raven Helm(mono)',							'carpenter',
		'0x1F09',	'Ring(mono)',										'tinker',
		'0x108A',	'Ring(mono)',										'tinker',
		'0x13EB',	'Ringmail Gloves(left)',						'blacksmith',
		'0x13F2',	'Ringmail Gloves(right)',						'blacksmith',
		'0x13F1',	'Ringmail Leggings(left)',						'blacksmith',
		'0x13F0',	'Ringmail Leggings(right)',					'blacksmith',
		'0x13EF',	'Ringmail Sleeves(left)',						'blacksmith',
		'0x13EE',	'Ringmail Sleeves(right)',						'blacksmith',
		'0x13ED',	'Ringmail Tunic(left)',							'blacksmith',
		'0x13EC',	'Ringmail Tunic(right)',						'blacksmith',
		'0x1543',	'Skullcap(mono)',								'tailor',
		'0x2784',	'Small Platemail Jingasa(mono)',			'blacksmith',
		'0x2789',	'Standard Platemail Kabuto(mono)',		'blacksmith',
		'0x1717',	'Straw Hat(mono)',								'tailor',
		'0x1C03',	'Studded Armor(mono)',						'tailor',
		'0x1C0D',	'Studded Bustier(left)',						'tailor',
		'0x1C0C',	'Studded Bustier(right)',						'tailor',
		'0x277C',	'Studded Do(mono)',							'tailor',
		'0x13D5',	'Studded Gloves(left)',							'tailor',
		'0x13DD',	'Studded Gloves(right)',						'tailor',
		'0x13D6',	'Studded Gorget(mono)',						'tailor',
		'0x278B',	'Studded Haidate(mono)',					'tailor',
		'0x277F',	'Studded Hiro Sode(mono)',					'tailor',
		'0x13E1',	'Studded Leggings(left)',						'tailor',
		'0x13DA',	'Studded Leggings(right)',					'tailor',
		'0x279D',	'Studded Mempo(mono)',					'tailor',
		'0x13D4',	'Studded Sleeves(left)',						'tailor',
		'0x13DC',	'Studded Sleeves(right)',						'tailor',
		'0x2787',	'Studded Suneate(mono)',					'tailor',
		'0x13E2',	'Studded Tunic(left)',							'tailor',
		'0x13DB',	'Studded Tunic(right)',						'tailor',
		'0x1716',	'Tall Straw Hat(mono)',						'tailor',
		'0x1549',	'Tribal Mask A(mono)',						'tailor',
		'0x154B',	'Tribal Mask B(mono)',						'tailor',
		'0x171B',	'Tricorne Hat(mono)',							'tailor',
		'0x2B72',	'Vulture Helm(mono)',							'carpenter',
		'0x1714',	'Wide-brim Hat(mono)',						'tailor',
		'0x2B73',	'Winged Helm(mono)',						'carpenter',
		'0x1718',	"Wizard's Hat(mono)",						'tailor',
		'0x2B6C',	'Woodland Arms(mono)',						'carpenter',
		'0x2B67',	'Woodland Chest(mono)',					'carpenter',
		'0x2B6A',	'Woodland Gauntlets(mono)',				'carpenter',
		'0x2B69',	'Woodland Gorget(mono)',					'carpenter',
		'0x2B6B',	'Woodland Leggings(mono)',				'carpenter',
		'0x153B',	'Apron',												'tailor',
		'0x2643',	'Dragon Gloves',	'blacksmith',
		'0x1541', 'Sash', 'tailor',
		'0x2647', 'Dragon Leggings', 'blacksmith',
		'0x2FB8','Elven Glasses','tinker',
		]
	minDura = 40; //Durability below which to repair
	layers = 
		[
		0,
		"RightHand",
		"LeftHand",
		'Shoes',
		"Pants",
		'Shirt',
		'Helmet',
		'Gloves',
		'Ring',
		'Talisman',
		'Necklace',
		'Hair',
		'Waist',
		'InnerTorso',
		'Bracelet',
		'Face',
		'Beard',
		'MidTorso',
		'Earrings',
		'Arms',
		'Cloak',
		'Backpack',
		'Robe',
		'Eggs',
		'Legs'
		]
	Orion.Print("Repair threshold set at: " + minDura)
	for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var theobj = Orion.ObjAtLayer(i);
			var objProperties = theobj.Properties();
			var objInd = itemArr.indexOf(theobj.Graphic());
			//var adjObjInd = objInd + 2
			if(!Orion.Contains(objProperties, 'Durability') || objInd < 0)
			  	Orion.Wait(10);
      		else
      			{
				var dura = theobj.Properties().match(/Durability (\d+) \/ (\d+)/)
				if(dura.shift() && Number(dura[0]) < minDura && Number(dura[0]) < Number(dura[1]))
			        {
			        //Orion.CharPrint(self, 40, layers[theobj.Layer()] + ": " +dura[0] + " / " +dura[1]);		        
			        Orion.Print(theobj.Name() + ' | ' + dura[0] + '/' + dura[1] + ' | ' + layers[theobj.Layer()]);
				    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
			        if(bench)
			        	{
			        	var b;
			        	var repairType = itemArr[objInd + 2];
					    switch(repairType)
					    	{
					    	case 'tinker':
					    		b = 2001;
					    		break;
					    	case 'blacksmith':
					    		b = 2002;
					    		break;
					    	case 'carpenter':
					    		b = 2003;
					    		break;
					    	case 'tailor':
					    		b = 2006;
					    		break;
					    	default:
					    		return Orion.Print('Type error in repair');
					    	}
				        if(!Orion.GumpExists('generic', any, '0x00002415'))
				        	Orion.UseObject(bench);
				        if(Orion.WaitForGump(1000))
				            {
				            var gump = Orion.GetGump(any, '0x00002415');
				            if(gump !== null)
				               	gump.Select(Orion.CreateGumpHook(b));
				            }
				        Orion.WaitForTarget(2000);
				        Orion.TargetObject(theobj.Serial());
				        Orion.Wait(200)
				        }			   
			        }
      			}
    		}
  		}
	}


function StayLoggedIn()
	{
	while(!Player.Dead())
		{
		Orion.UseObject('backpack');
		Orion.Wait(60000);
		}
	}
//if you wait until a deco item unlocks and note the number of red candles, you can let it revert one red candle and build it back up one red candle to get another deco drop each time
//10 minutes for a red candle to revert

//bot locations
//7029,1045
//7000,958

function RetrieveDeco()
	{
	DiscordPush(Player.Name() + " retrieving deco item");
	var backpackSerial = Orion.GetSerial(backpack);
	var waypoints = [

	]
	for(var i=0;i<waypoints.length;i++)
		{
		var waypoint = waypoints[i];
		while(Orion.GetDistance(waypoint[0],waypoint[1]) > 2)
			{
			Orion.WalkTo(waypoint[0],waypoint[1]);
			Orion.Wait(1300);
			}
		var attempt = 0;
		var deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C',any,ground,'item',24).filter(function(item)
			{
			return Orion.Contains(item.Properties(),'Weight');
			})[0];
		while(deco && attempt < 4)
			{
			var itemSerial = deco.Serial();
			var itemX = deco.X();
			var itemY = deco.Y();
			var endTime = Orion.Now() + 20000
			while(Orion.GetDistance(itemX,itemY) > 2 && Orion.Now() < endTime)
				{
				Orion.WalkTo(itemX,itemY);
				Orion.Wait(1300);
				}
			Orion.MoveItem(itemSerial);
			Orion.Wait(1300);
			if(Orion.GetContainer(itemSerial) == backpackSerial)
				{
				var itemObj = Orion.FindObject(itemSerial);
				while(!Orion.Contains(itemObj.Properties(),'Insured'))
					{
					Orion.WaitContextMenuID(self, 418);
					Orion.RequestContextMenu(self);
					if(Orion.WaitForTarget(3000))
						Orion.TargetObject(itemSerial);
					if(Orion.WaitForTarget(3000))
						Orion.CancelTarget();
					}
				DiscordPush(Player.Name() + " picked up deco: " + deco.Properties());
				return RunAndHide();
				}
			deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C',any,ground,'item',24).filter(function(item)
				{
				return Orion.Contains(item.Properties(),'Weight');
				})[0];
			attempt++;
			}
		}
	if(deco)
		DiscordPush(Player.Name() + " couldn't pick up deco item: " + deco.Properties());
	else
		DiscordPush(Player.Name() + " couldn't find deco item");
	return RunAndHide();
	}

function RunAndHide()
	{
	var hideX = 6993;
	var hideY = 1087;
	DiscordPush(Player.Name() + " running back to hiding spot");
	while(Orion.GetDistance(hideX,hideY) > 0)
		{
		Orion.WalkTo(hideX,hideY,0,0);
		Orion.Wait(500);
		}
	return HideTilHidden();
	}

function DecoHighlighter()
	{
	while(true)
		{
		var deco = Orion.FindTypeEx('!0x0EED|!0x14EF|!0x1E22|!0x318C',any,ground,'item',20).filter(function(item)
			{
			return Orion.Contains(item.Properties(),'Weight');
			});
		deco.forEach(function(item)
			{
			Orion.CharPrint(self,1159,item.Name())
			Orion.CharPrint(item.Serial(),1159,item.Name() + '\nV')
            if(item.Distance() < 3)
                Orion.MoveItem(item.Serial());
			})
        Orion.Wait(1000)
        }
	}

function CastEvasion()
	{
	Orion.Cast('Evasion')
	var check = Orion.WaitJournal('before you can use this ability again.|You feel that you might be able to deflect any attack!', Orion.Now(), Orion.Now() + 2000, 'sys');
	if(check && check.Text() == 'You feel that you might be able to deflect any attack!')
		Orion.AddDisplayTimer('Evasion', 20000 + Orion.BuffTimeRemaining('Evasion'), 'UnderChar', 'bar', 'Evasion CD', 0, 40);
	}
	
function ProgressSpawn()
	{
	DiscordPush(Player.Name() + ' progressing spawn');
	var waypoints = [
		[6971,1060],
		[6971,1025],
		[6975,994],
		[7000,1000],
		[7030,995],
		[7024,1028],
		[7021,1057],
		[7024,1028],
		[7030,995],
		[7000,1000],
		[6975,994],
		];
	var mobGraphic = profile.mobGraphic;
	Orion.Exec('AutoAttack',true);
	Orion.Exec('AutoBuffs',true);
	Orion.Exec('AutoGatherMobs',true);
	Orion.Exec('AutoEvade',true);
	while(!Player.Dead())
        {
		var waypoint = waypoints.shift();
		waypoints.push(waypoint);
		while(Orion.GetDistance(waypoint[0],waypoint[1]) > 1)
			{
			var x = Orion.Random(-3,4) + waypoint[0];
			var y = Orion.Random(-3,4) + waypoint[1];
			Orion.WalkTo(x,y);
			Orion.Wait(300);
			}
		Orion.CharPrint(self, 1159, 'Searching for Mob');
        var mobsClose = Orion.FindType(mobGraphic, any, ground, 'ignoreself|ignorefriends|live', 10, 'gray|criminal').length;
		while(mobsClose > 3)
			{
			Orion.Wait(100);
			mobsClose = Orion.FindType(mobGraphic, any, ground, 'ignoreself|ignorefriends|live', 10, 'gray|criminal').length;
			Orion.Print('Nearby mobs: ' + mobsClose);
			}
		Orion.Wait(100);
        }
	}

function Listener()
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
			if(Orion.Contains(recv,'Progress'))
				{
				Orion.Exec('ProgressSpawn',true);
				}
			else if(Orion.Contains(recv,'Retrieve'))
				{
				Orion.Terminate('all','PrimevalListener|JournalScan');
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
            }
		Orion.Wait(500);
		}
	}

function Monitor()
    {
	var targetRed = 12;
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
			var data = redCandles + ':' + whiteCandles + ':Candles';
			for(var i=60001;i<60010;i++)
				Orion.UdpSend(i,data);
            if(redMonitor != redCandles && !firstPass)
                {
				Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                DiscordPush('Red Candles: ' + redCandles);
				if(redCandles == targetRed - 1)
					for(var i=60001;i<60010;i++)
						Orion.UdpSend(i,'Progress');
				if(redCandles == targetRed)
					for(var i=60001;i<60010;i++)
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

function HideTilHidden()
	{
	while(!Player.Dead() && !Orion.BuffExists('hiding'))
		{
		var startTile = '' + Player.X() + Player.Y();
		Orion.UseSkill('Hiding');
		Orion.Wait(1000);
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 1, 'gray|red|criminal|orange');
		if(!Orion.BuffExists('hiding') && enemies.length)
			{
			Orion.Attack(enemies[0]);
			if(!Orion.AbilityStatus(profile.singleTargetSpecial) && Player.Mana() >= 15)
				Orion.UseAbility(profile.singleTargetSpecial);
			}
		}
	while(Orion.BuffExists('hiding'))
		{
		Orion.Wait(500)
		}
	Orion.Wait(1000);
	if((''+ Player.X() + Player.Y()) == startTile)
		{
		DiscordPush(Player.Name() + ' Revealed!')
		return HideTilHidden();
		}
	}

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ '887268637315047444'//hook
	+ "/"
	+ 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
	Orion.HttpPost(bot, "content=" + message);
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