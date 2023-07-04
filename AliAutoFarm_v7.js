//#include OA/AliLooterPlugin.js
//v7
function BlockSweeper()
	{
	var blockItemGraphics = '0x0A27|0x2257|0x2256|0x1047';
    while(true)
        {
        Orion.Wait(500);
        var container = Orion.FindTypeEx(any).filter(function(item)
        	{
        	var itemProps = item.Properties();
        	return Orion.Contains(itemProps,'Contents: ') && !Orion.Contains(itemProps,'Contents: 125')
        	})[0];
        Orion.SetSearchArea(162,643,189,683)
        var item = Orion.FindTypeEx(blockItemGraphics,any,ground,'item|near',20)[0];
        Orion.ResetSearchArea();
        if(!item)
        	{
        	item = Orion.FindTypeEx(blockItemGraphics,any,ground,'item|near',4)[0];
        	if(!item && container)
        		{
	        	var itemInPack = Orion.FindType(blockItemGraphics).filter(function(item)
	        		{
	        		return item != container.Serial()
	        		})[0];
	        	if(itemInPack)
	        		{
		           	Orion.MoveItem(itemInPack,0,container.Serial());
		            Orion.Wait(500);
	        		}
        		}
        	}
        if(item)
            {
        	Orion.PauseScript('all','BandieBot|AutoAttack|JournalScan|BlockSweeper')
           	if(item.Distance() > 2)
           		Orion.WalkTo(item.X(),item.Y());
           	if(container)
            	Orion.MoveItem(item.Serial(),0,container.Serial());
            else
            	Orion.MoveItem(item.Serial());
            Orion.Wait(1000);
            }
         else
        		Orion.ResumeScript('all');
        }
	}

function BlockScooper()
    {
    var blockItemGraphics = '0x0A27|0x2257|0x2256';
    while(true)
        {
        var container = Orion.FindTypeEx(any).filter(function(item)
        	{
        	var itemProps = item.Properties();
        	return Orion.Contains(itemProps,'Contents: ') && !Orion.Contains(itemProps,'Contents: 125')
        	})[0];
        var item = Orion.FindType(blockItemGraphics,any,ground,'item|near',2)[0];
        var itemInPack = Orion.FindType(blockItemGraphics)[0];
        if(item)
            {
           	if(container)
            	Orion.MoveItem(item,0,container.Serial());
            else
            	Orion.MoveItem(item);
            Orion.Wait(1000);
            }
        else if(itemInPack && container)
        	{
           	Orion.MoveItem(itemInPack,0,container.Serial());
            Orion.Wait(1000);
        	}
        Orion.Wait(500)
        }
    }
function StayHidden()
    {
    var startX = Player.X();
    var startY = Player.Y();
    while(!Player.Dead() && Player.X() == startX && Player.Y() == startY)
        {
        if(!Orion.BuffExists('hiding'))
            {
            AttackNearest();
            Orion.Wait(1000);
            Orion.UseSkill('Hiding');
            }
        Orion.Wait(250);
        }
    }
function AutoConfidence()
	{
	while(!Player.Dead())
		{
		if(Player.Hits('%') < 70)
			Orion.Cast('Confidence');
		Orion.Wait(2000);
		}
	}

function ScheduledStart()
	{
	Orion.Exec('StayHidden',true);
	Orion.SetTimer('timer')
	while(true)
		{
		if(isTargetHour(2))
			{
			Orion.Exec('WalkThroughCurrentFarm',true);
			break;
			}
		if(Orion.Timer('timer') > 60000)
			{
			Orion.UseObject(backpack)
			Orion.SetTimer('timer')
			}
		Orion.Wait(2000);
		}
	}

var profiles = 
	{
	Oni:
		{
		farmType: 'Static', //false, 'Static' , 'Mobile' , 'Leash'
		walkThrough: 'Oni', //'Oni'
        stayStill: false,
		useGatherMobs: false, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
		mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic
		staticFarmRadius: 24, //Radius within which to search for mobs
		staticFarmStartingPoint: [178,663],
		mobileFarmConfinementZone: [0,0,0,0], //[x1,y1,x2,y2] x1, y1 is northwest corner; x2, y2 is southeast corner. Set to false to ignore this setting.
		leashFarmRadius: 6, //Radius around the leader to search for mobs
		leashLeader: 0x003DB071, //Serial number of leader
		useSingleTargetSpecial: false, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
			singleTargetSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
		useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
			whirlwindSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
		useMomentumStrike: false, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
		useEnemyOfOne: false, //true , false.
		useCounterAttack: false, //true , false.
		useConsecrateWeapon: false, //true , false.
		useDivineFury: false, //true , false.
		useAutoLoot: true,
		autolootAgentHotkey: 48, //JavaScript Event Keycode. Use https://keycode.info/
		useConfidence: false, //true , false.
			useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
		useBandieSelf: true, //true , false.
			useBandieSelfThresholdPercent: 70, //Percentage of self HP to attempt to use bandage on self
		useBandieOthers: true, //true , false.
			useBandieOtherThresholdPercent: 90, //Percentage of other's HP to attempt to use bandage on others
		useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
			discordHook: '1022287622137200660', //Put Discord WebHook here
			discordKey: 'w0Nsz8IXTJK2ZcJM0hntdlPMeeLKOLSMweHtBhWb7-0vUI8-lvZdkVUUv10r08_vUJMl', //Put Discord Bot Key here
		journalScanType: 'JournalScan',
		useAlarmSound: false, //true , false. Default sound can be changed by putting a different .wav in the Ultima Online Classic folder. Used in JournalScan
		useAutoInsure: true, //true , false. Automatically insure items based on the following options:
			useStringSearch: false, //can search name, properties, or both(inclusive; not one or the other). Will override list search.
				checkNameString: 'Demonic', //not case sensitive. Separate strings can be added with the vertical line |. Set to false to ignore name.
				checkPropString: 'Faster Cast Recovery 3|hit point increase', //not case sensitive. Will insure items with any of the properties listed. Set to false to ignore props.
			UseListSearch: true, //set to true to use lists instead of string searches. String search must be set to false.
				insureFindList: 'BotLoot', //create a find list with this name and set find criteria.
				insureIgnoreList: 'InsureIgnore', //create an ignore list with this name and set ignore criteria. Create a property called 'Insured'.
			searchFrequency: 500, //in milliseconds; minimum of 250. How often to check for new items in pack.
		//useLootCorpses: true,
		},
	BloodEle:
		{
		farmType: 'Static', //false, 'Static' , 'Mobile' , 'Leash'
		walkThrough: 'Oni', //'Oni'
		stayStill: true,
		useGatherMobs: false, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
		leashLeader: 0x01DD7DAE, //Serial number of leader
		mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic
		staticFarmRadius: 24, //Radius within which to search for mobs
		useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
			singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
		useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
			whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
		useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
		useEnemyOfOne: false, //true , false.
		useCounterAttack: true, //true , false.
		useConsecrateWeapon: false, //true , false.
		useDivineFury: false, //true , false.
		useAutoLoot: true,
		autolootAgentHotkey: 48, //JavaScript Event Keycode. Use https://keycode.info/
		useConfidence: true, //true , false.
			useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
		useBandieSelf: false, //true , false.
			useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
		useBandieOthers: true, //true , false.
			useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
		useDiscordPush: false,  //true , false. Set to true to use Discord notifications for JournalScan
			discordHook: '1022287622137200660', //Put Discord WebHook here
			discordKey: 'w0Nsz8IXTJK2ZcJM0hntdlPMeeLKOLSMweHtBhWb7-0vUI8-lvZdkVUUv10r08_vUJMl', //Put Discord Bot Key here
		journalScanType: 'JournalScan',
		useAlarmSound: false, //true , false. Default sound can be changed by putting a different .wav in the Ultima Online Classic folder. Used in JournalScan
		useAutoInsure: true, //true , false. Automatically insure items based on the following options:
			useStringSearch: false, //can search name, properties, or both(inclusive; not one or the other). Will override list search.
				checkNameString: 'Demonic', //not case sensitive. Separate strings can be added with the vertical line |. Set to false to ignore name.
				checkPropString: 'Faster Cast Recovery 3|hit point increase', //not case sensitive. Will insure items with any of the properties listed. Set to false to ignore props.
			UseListSearch: true, //set to true to use lists instead of string searches. String search must be set to false.
				insureFindList: 'InsureFind', //create a find list with this name and set find criteria.
				insureIgnoreList: 'InsureIgnore', //create an ignore list with this name and set ignore criteria. Create a property called 'Insured'.
			searchFrequency: 500, //in milliseconds; minimum of 250. How often to check for new items in pack.
		//useLootCorpses: true,
		},
	mobile: 
		{
		farmType: 'Mobile', //'Static' , 'Mobile' , 'Leash'
		walkThrough: 'Oni', //'Oni'
		useGatherMobs: true,
		mobGraphic: any, //any or '0x00F1' or '0x00F1|0x00F2'
		mobileFarmConfinementZone: [0,0,9999,1400], //[x1,y1,x2,y2] x1, y1 is northwest corner; x2, y2 is southeast corner. Set to false to ignore this setting.
		useSingleTargetSpecial: true,
			singleTargetSpecial: 'Primary', //'Primary' or 'Secondary'
		useWhirlwind: true,
			whirlwindSpecial: 'Secondary', //'Primary' or 'Secondary'
		useMomentumStrike: true,
		useEnemyOfOne: false,
		useCounterAttack: true,
		useConsecrateWeapon: false,
		useDivineFury: false,
		autolootAgentHotkey: 48, //JavaScript Event Keycode. Use https://keycode.info/
		useConfidence: true,
			useConfidenceThresholdPercent: 50,
		useBandieSelf: false,
			useBandieSelfThresholdPercent: 80,
		useBandieOthers: false,
			useBandieOtherThresholdPercent: 60,
		useDiscordPush: true, 
			discordHook: '887268637315047444',
			discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z',
		journalScanType: 'JournalScan',
		useAlarmSound: true, //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
		useAutoInsure: true,
			useStringSearch: false, //can search name, properties, or both(inclusive; not one or the other). Will override list search.
				checkNameString: 'Demonic', //not case sensitive. Separate strings can be added with the vertical line |. Set to false to ignore name.
				checkPropString: 'Faster Cast Recovery 3|hit point increase', //not case sensitive. Will insure items with any of the properties listed. Set to false to ignore props.
			UseListSearch: true, //set to true to use lists instead of string searches. String search must be set to false.
				insureFindList: 'InsureFind', //create a find list with this name and set find criteria.
				insureIgnoreList: 'InsureIgnore', //create an ignore list with this name and set ignore criteria. Create a property called 'Insured'.
			searchFrequency: 500, //in milliseconds; minimum of 250. How often to check for new items.
		//useLootCorpses: true,
		},
	leash: 
		{
		farmType: 'Leash', //'Static' , 'Mobile' , 'Leash'
		useGatherMobs: true,
		mobGraphic: any, //any or '0x00F1' or '0x00F1|0x00F2'
		leashFarmRadius: 3,
		leashLeader: 0x01DD7DAE,
		useSingleTargetSpecial: true,
			singleTargetSpecial: 'Primary', //'Primary' or 'Secondary'
		useWhirlwind: true,
			whirlwindSpecial: 'Secondary', //'Primary' or 'Secondary'
		useMomentumStrike: true,
		useEnemyOfOne: false,
		useCounterAttack: true,
		useConsecrateWeapon: true,
		useDivineFury: true,
		autolootAgentHotkey: 48, //JavaScript Event Keycode. Use https://keycode.info/
		useConfidence: true,
			useConfidenceThresholdPercent: 80,
		useBandieSelf: false,
			useBandieSelfThresholdPercent: 80,
		useBandieOthers: true,
			useBandieOtherThresholdPercent: 60,
		useDiscordPush: true, 
			discordHook: '887268637315047444',
			discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z',
		journalScanType: 'JournalScanNoEquipmentDamage',
		useAlarmSound: true, //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
		useAutoInsure: true,
			useStringSearch: false, //can search name, properties, or both(inclusive; not one or the other). Will override list search.
				checkNameString: 'Fey Wrath', //not case sensitive. Separate strings can be added with the vertical line |. Set to false to ignore name.
				checkPropString: false, //not case sensitive. Will insure items with any of the properties listed. Set to false to ignore props.
			UseListSearch: true, //set to true to use lists instead of string searches. String search must be set to false.
				insureFindList: 'InsureFind', //create a find list with this name and set find criteria.
				insureIgnoreList: 'InsureIgnore', //create an ignore list with this name and set ignore criteria. Create a property called 'Insured'.
			searchFrequency: 500, //in milliseconds; minimum of 250. How often to check for new items.
		//useLootCorpses: true,
		}
	}

var profile = profiles.Oni;
function initScripts()
	{
	//Orion.OAOptionSet('AutoReconnect', '1');
	Orion.Exec(profile.journalScanType, true);
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
	Orion.Terminate('all', 'BandieBot|JournalScan|JournalScanGMonly|JournalScanNoEquipmentDamage');
	}

function Autostart()
	{
    var journalScanType = profile.journalScanType;
	Orion.Wait(1000);
    Orion.Terminate('all', 'Autostart');
    while(!Orion.GumpExists('container',backpack))
			{
			Orion.UseObject(backpack);
			Orion.Wait(1300);
			}
	Orion.Wait(1000);
	Orion.Exec(journalScanType,true);
	}

function Autostart2()
	{
	//Orion.OAOptionSet('AutoReconnect', '1');
    var midFarm = false;
    var journalScanType = profile.journalScanType;
    var staticFarmStartingPoint = profile.staticFarmStartingPoint;
	Orion.Wait(1000);
    Orion.Terminate('all', 'Autostart');
	Orion.Wait(1000);
	Orion.Exec(journalScanType,true);
    if(staticFarmStartingPoint[0] && Orion.GetDistance(staticFarmStartingPoint[0],staticFarmStartingPoint[1]) < 50)
        {
        while(Orion.GetDistance(staticFarmStartingPoint[0],staticFarmStartingPoint[1]) > 0)
            {
            Orion.WalkTo(staticFarmStartingPoint[0],staticFarmStartingPoint[1],0,0);
            Orion.Wait(1300);
            }
        midFarm = true;
        }
    if(Player.Dead())
        {
        Orion.WarMode(0);
        Orion.Wait(1300);
		var endTime = Orion.Now() + 300000;
        while(Player.Dead())
            {
			if(Orion.Now() > endTime)
				{
				Orion.OAOptionSet('AutoReconnect', '0');
				Orion.LogOut();
				}
            while(!Player.WarMode())
                {
                Orion.WarMode(1);
                Orion.Wait(500);
                }
            while(Orion.FindType(any,any,ground,'mobile|ignoreself',0)[0])
                {
                Orion.Step(Orion.Random(0,9));
                Orion.Wait(500);
                }
            var gump = Orion.GetGump('any','0x000008AF');
            if(gump !== null)
                gump.Select(Orion.CreateGumpHook(2));
            Orion.Wait(2000);
            }
        if(!FindOwnCorpse())
            {
			var endTime = Orion.Now() + 300000;
            while(!Orion.ObjAtLayer(1))
                {
                DressLuck();
                Orion.Wait(1300);
				if(Orion.Now() > endTime)
					break;
                }
            }
        }
	if(!Orion.ObjAtLayer('mount') || Player.Dead())
		Orion.Relogin();
    if(midFarm)
        initScripts();
	}

function inithealer()
	{
	Orion.Exec('JournalScanGMonly', true);
	Orion.Exec('MageHealBot', true);
	Orion.Exec('AutoInsure', true);
	}

function initwither()
	{
	Orion.Exec('JournalScanNoEquipmentDamage', true);
	Orion.Exec('WitherBot', true);
	Orion.Exec('AutoInsure', true);
	}

function AutoRearm()
    {
    var leftString = 'LeftHand';
    var rightString = 'RightHand';
    var leftHand = Orion.ObjAtLayer(leftString);
    var rightHand = Orion.ObjAtLayer(rightString);
    var wep = null;
    var wepString = null;
    if(Orion.Contains(leftHand.Properties(), 'Weapon Speed'))
        {
        wep = leftHand;
        wepString = leftString;
        }
    else if(Orion.Contains(rightHand.Properties(), 'Weapon Speed'))
        {
        wep = rightHand;
        wepString = rightString;
        }
    if(!wep)
        return Orion.CharPrint(self,1159,'Equip a weapon and restart script!');
    Orion.CharPrint(self,1159,'Rearm weapon set to: ' + wep.Name());
    while(!Player.Dead())
        {
        while(Orion.BuffExists('Disarm') && !Player.Dead())
            {
            Orion.Wait(500)
            }
        while(!Orion.ObjAtLayer(wepString) && !Player.Dead())
            {
            Orion.Equip(wep.Serial());
            Orion.Wait(1300);
            }
        Orion.Wait(500);
        }
    }

function WitherBot()
	{
	while(!Player.Dead())
		{
		if(Player.Poisoned())
			{
			Orion.Cast('Cure');
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(self);
			Orion.Wait(200);
			}
		else if(Player.Hits('%') < 99)
			{
			Orion.Cast('Greater Heal');
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(self);
			Orion.Wait(200);
			}
		else if(Player.Mana() > 50)
			{
			Orion.Cast('Wither');
			Orion.Wait(200);
			}
		Orion.Wait(200);
		}
	}

function TurnIns()
	{
	while(true)
		{
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
				{
				gump0.Select(Orion.CreateGumpHook(100));
				Orion.Wait(100);
				}
			}
		else
		Orion.Wait(100);
		}
	}
function BorderEdge(x, y, p2, range) 
	{
  	return (x == (p2.X() - range))
    	|| (x == (p2.X() + range))
    	|| (y == (p2.Y() - range))
    	|| (y == (p2.Y() + range));
	}
function StaticAutoFarm()
    {
	var staticFarmRadius = profile.staticFarmRadius;
	var staticFarmStartingPoint = profile.staticFarmStartingPoint;
	var mobGraphic = profile.mobGraphic;
	var autolootAgentHotkey = profile.autolootAgentHotkey;
	var useAutoLoot = profile.useAutoLoot;
	var useDiscordPush = profile.useDiscordPush;
	var playerStartX = Player.X();
    var playerStartY = Player.Y();
	var stayStill = profile.stayStill;
	Orion.ClearFakeMapObjects();
	if(staticFarmStartingPoint[0])
		{
		playerStartX = staticFarmStartingPoint[0];
		playerStartY = staticFarmStartingPoint[1];
		// var startDist = Orion.GetDistance(playerStartX,playerStartY) 
		// while(startDist > 0 && startDist < 20)
		// 	{
		// 	Orion.WalkTo(playerStartX,playerStartY,0,0)
		// 	Orion.Wait(500);
		// 	}
		}
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
			if(isTargetHour(11))
				{
				Orion.PauseScript('all','StaticAutoFarm');
				Orion.CharPrint(self,1159,'Stopping 1 hour before server down!');
				Orion.Wait(500);
				RecallByGump('Main','Home');
				Orion.Wait(1000);
				Orion.CloseUO();
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
	Orion.LogOut();
    }

function LeashAutoFarm()
    { //will follow the leader and kill things, but not great for looting. Useful for Treasures events.
	var mobGraphic = profile.mobGraphic;
	var autolootAgentHotkey = profile.autolootAgentHotkey;
	var leader = Orion.FindObject(profile.leashLeader);
	var leashRadius = 4;
	var returnRadius = 4;
	var rushRadius = 8;
    while(!Player.Dead())
        {
		var leaderX = leader.X();
		var leaderY = leader.Y();
		Orion.SetSearchArea(leaderX-leashRadius, leaderY-leashRadius, leaderX+leashRadius, leaderY+leashRadius);
		var mob = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|near|live', 24, 'gray|criminal')[0];
		Orion.ResetSearchArea();
		var distance = leader.Distance();
		if(distance > leashRadius)
			{
			if(distance > rushRadius)
				{
				Orion.WalkTo(leaderX, leaderY, leader.Z(), 0, 0);
				Orion.Wait(50);
				}
			else
				{
				Orion.Wait(Orion.Random(1,2)*100);
				while(!Orion.WalkTo(leaderX + Orion.Random(-returnRadius,returnRadius), leaderY + Orion.Random(-returnRadius,returnRadius), leader.Z(), 0))
					{
					Orion.Wait(50);
					}
				Orion.Wait(10);
				}
			}
		else if(mob)
			{
			Orion.Print('Mob Found');
			while(!Player.Dead() && mob.Exists())
				{
				if(leader.Distance() > leashRadius)
					break;
				if(mob.Distance() > 1)
					Orion.WalkTo(mob.X(), mob.Y(), mob.Z(), 1);
				Orion.Wait(200);
				}
			Orion.Wait(100);
			}
		else
			{
			if(Orion.Random(-50,2) > 0)
				Orion.WalkTo(leaderX + Orion.Random(-returnRadius,returnRadius), leaderY + Orion.Random(-returnRadius,returnRadius), leader.Z(), 0);
			Orion.Wait(100);
			}
		}
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

function CloseFollow()
	{
	var leader = Orion.FindObject(profile.leashLeader);
	while(!Player.Dead())
        {
		if(leader.Distance() > 0)
			Orion.WalkTo(leader.X(), leader.Y(), leader.Z(), 0, 0);
		Orion.Wait(100);
		}
	}

function AutoAttack()
	{
	var useGatherMobs = profile.useGatherMobs;
	var useSingleTargetSpecial = profile.useSingleTargetSpecial;
	var singleTargetSpecial = profile.singleTargetSpecial;
	var useMomentumStrike = profile.useMomentumStrike;
	var useWhirlwind = profile.useWhirlwind;
	var whirlwindSpecial = profile.whirlwindSpecial;
	while(!Player.Dead())
		{
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 1, 'gray|red|criminal|orange');
		var enemyCount = enemies.length;
		if(useGatherMobs)
			GatherMobs();
		else if(enemyCount)
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

function AutoBuffs()
	{
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
	while(!Player.Dead())
		{
		GatherMobs();
		Orion.Wait(500);
		}
	}	

function GatherMobs()
	{
	Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|nothuman', 24, 'gray|criminal|red')
		.forEach(function(mob)
			{
			Orion.TargetSystemSerial(mob);
			Orion.Attack(mob);
			Orion.Wait(10);
			});
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red')[0]; 
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}

function AttackNearest()
	{
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red')[0]; 
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}

function BandieBot()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var useBandieOthers = profile.useBandieOthers;
	var useBandieOtherThresholdPercent = profile.useBandieOtherThresholdPercent;
	var useBandieSelf = profile.useBandieSelf;
	var useBandieSelfThresholdPercent = profile.useBandieSelfThresholdPercent;
	while(!Player.Dead())
		{
		while(!Player.Dead())
			{
			while(!Orion.GumpExists('container',backpack))
				{
				Orion.UseObject(backpack);
				Orion.Wait(1300);
				}
			Orion.Wait(200);
			if(Orion.HaveTarget())
				continue;
			var bandies = Orion.FindType('0x0E21')[0];
			if(Orion.Count('0x0E21') < 50)
				{
				Orion.Wait(200);
				if(Orion.Count('0x0E21') < 50) //with just one check, was getting false positives for some reason
					{
					//if(useDiscordPush)
						//DiscordPush(Player.Name() + ': Low on Bandies');
					//if(useAlarmSound)
						//Orion.PlayWav('Alarm.wav');
					Orion.Exec('RecallBandieBuy',true);
					break;
					}
				}
			var target = injuredCheck(2, useBandieOtherThresholdPercent, true);
			if(useBandieOthers && target && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(target.Serial());
				if(Orion.WaitForTarget(2000))
					Orion.CancelTarget();
				}
			else if(useBandieSelf && Player.Hits('%') < useBandieSelfThresholdPercent && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(self);
				if(Orion.WaitForTarget(2000))
					Orion.CancelTarget();
				}
			}
		}
	}

function MysticBot()
	{
	while(!Player.Dead())
		{
		if(!Orion.HaveTarget() && !Player.Frozen())
			Orion.Cast('Cleansing Winds')
		var target = injuredCheck(10, 40);
		if(Player.Hits('%') < 90)
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(self);
			}
		else if(target)
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(target.Serial());
			}
		else
			{
			var items = Orion.FindTypeEx(any, '0x0AC3', ground, 'item', 24).filter(function(item)
				{
				return Orion.Contains(item.Properties(), 'of Fey Wrath')
				})
			if(items[0])
				{
				if(Orion.WalkTo(items[0].X(), items[0].Y(), 0, 0))
					Orion.MoveItem(items[0].Serial())
				}	
			}
		Orion.Wait(200);
		}
	}

function MageHealBot()
	{
	while(!Player.Dead())
		{
		if(!Orion.HaveTarget() && !Player.Frozen())
			Orion.Cast('Greater Heal')
		Orion.WaitForTarget(2000);
		var target = injuredCheck(10, 40);
		if(Player.Hits('%') < 90)
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(self);
			}
		else if(target && !target.Poisoned())
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(target.Serial());	
			}
		else if(target && target.Poisoned())
			{
			Orion.Cast('Cure');
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(target.Serial());	
			}
		Orion.Wait(300);
		}
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

function BagOfSendingGold() 
	{
    var goldLimit = 58000;
    while(!Player.Dead()) 
        {
        Orion.Wait(2000);
        if(Player.Weight() >= Player.MaxWeight() - 25 || Player.Gold() > goldLimit) 
            {
            var bags = Orion.FindTypeEx(0x0E76, any, backpack).filter(function (bag)
				{
				return (Orion.Contains(bag.Name(), "Sending") && (((bag.Properties().match(/Charges:\s(\d)/i) || [])[1] || 0) > 0))
				});
            if(bags[0]) 
                {
				Orion.Print('Sending gold');
                Orion.UseObject(bags[0].Serial());
                Orion.WaitForTarget(2000);
                Orion.TargetType('0x0EED', any, backpack);
                }
            else 
                {
                TextWindow.Open();
				TextWindow.Print('Out of BoS Charges!');
                }
            Orion.Wait(1000);
            }
        else if(Player.Weight() >= Player.MaxWeight() - 10 && Player.Gold() < goldLimit) 
            {   
            Orion.Print("Backpack overloaded");
            }
        Orion.Wait(1000);
        }
	}

function MoveArchlichItems()
	{
	if(Player.WarMode())
		{
		Orion.CharPrint(self, 27, 'Target Source Container');
		Orion.WaitForAddObject('sourceBag')
		Orion.OpenContainer('sourceBag');
		Orion.Wait(800);
		}
	else
		Orion.AddObject('sourceBag', backpack);
	Orion.CharPrint(self, 27, 'Target Destination Bag');
	Orion.WaitForAddObject('destBag');
	var items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item){return Orion.Contains(item.Properties(), 'Archlich')});
	Orion.CharPrint(self, 27, items.length);
	while(items[0])
		{
		Orion.MoveItem(items[0].Serial(), 0, 'destBag')
		Orion.Wait(1100);
		items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item){return Orion.Contains(item.Properties(), 'Archlich')});
		Orion.CharPrint(self, 27, items.length);
		}
	}

function MoveImportantFeyItems()
	{
	if(Player.WarMode())
		{
		Orion.CharPrint(self, 27, 'Target Source Container');
		Orion.WaitForAddObject('sourceBag')
		Orion.OpenContainer('sourceBag');
		Orion.Wait(800);
		}
	else
		Orion.AddObject('sourceBag', backpack);
	var items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item){return Orion.Contains(item.Properties(), 'Plate|Bone|Studded Armor|halberd')});
	Orion.CharPrint(self, 27, items.length);
	Orion.CharPrint(self, 27, 'Target Destination Bag');
	Orion.WaitForAddObject('destBag');
	while(items[0])
		{
		Orion.MoveItem(items[0].Serial(), 0, 'destBag')
		Orion.Wait(1100);
		items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item){return Orion.Contains(item.Properties(), 'Plate|Bone|Studded Armor|halberd')});
		Orion.CharPrint(self, 27, items.length);
		}
	}

function MoveZeroPropItems()
	{
	if(Player.WarMode())
		{
		Orion.CharPrint(self, 1159, 'Target Source Container');
		Orion.WaitForAddObject('sourceBag')
		Orion.OpenContainer('sourceBag');
		Orion.Wait(800);
		}
	else
		Orion.AddObject('sourceBag', backpack);
	var items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item)
		{
		return item.Properties().match(/Archlich\n(<b>Insured<\/b>\n)*Weight: \d+ Stones*\nShard Bound\n(Physical Resist \d+%\n)*Fire Resist \d+%\nCold Resist \d+%\nPoison Resist \d+%\nEnergy Resist \d+%\n(Mage Armor\n)*Strength Requirement \d+\nDurability/)
		});
	Orion.CharPrint(self, 1159, items.length);
	if(!items.length)
		return;
	Orion.CharPrint(self, 1159, 'Target Destination Bag');
	Orion.WaitForAddObject('destBag');
	while(items[0])
		{
		Orion.MoveItem(items[0].Serial(), 0, 'destBag')
		Orion.Wait(1100);
		items = Orion.FindTypeEx(any, any, 'sourceBag').filter(function(item)
			{
			return item.Properties().match(/Archlich\n(<b>Insured<\/b>\n)*Weight: \d+ Stones*\nShard Bound\n(Physical Resist \d+%\n)*Fire Resist \d+%\nCold Resist \d+%\nPoison Resist \d+%\nEnergy Resist \d+%\n(Mage Armor\n)*Strength Requirement \d+\nDurability/)
			});
		Orion.CharPrint(self, 1159, items.length);
		}
	}

function AutoInsure() 
	{
	var stringSearch = profile.useStringSearch;
	var checkName = profile.checkNameString;
	var checkProp = profile.checkPropString;
	var listSearch = profile.UseListSearch;
	var insureFind = profile.insureFindList;
	var insureIgnore = profile.insureIgnoreList;
	var searchFrequency = profile.searchFrequency;
	while(stringSearch && !Player.Dead())
		{
		var item = Orion.FindTypeEx(any).filter(function (part) 
					{
					if(!Orion.Contains(part.Properties(), 'insured'))
						{
						if(checkName && !checkProp)
							return Orion.Contains(part.Name(), checkName);
						else if(checkProp && !checkName)
							return Orion.Contains(part.Properties(), checkProp)      
						else if(checkProp && checkName)
							return Orion.Contains(part.Name(), checkName) && Orion.Contains(part.Properties(), checkProp)
						}
					return false;
	                })[0];
	    if(item && !Orion.HaveTarget())
	    	{
			Orion.WaitContextMenuID(self, 418);
    		Orion.RequestContextMenu(self);
			if(Orion.WaitForTarget(2000))
				Orion.TargetObject(item.Serial());
			if(Orion.WaitForTarget(2000))
				Orion.CancelTarget();
			}
		Orion.Wait(searchFrequency);
		}
	while(listSearch && !Player.Dead())
		{
		var item = Orion.FindList(insureFind).filter(function(it)
			{
			var obj = Orion.FindObject(it)
			return obj && !Orion.Contains(obj.Properties(),'insured')
			});
		if(item && item.length && !Orion.HaveTarget())
	    	{
			Orion.WaitContextMenuID(self, 418);
			Orion.RequestContextMenu(self);
			if(Orion.WaitForTarget(2000))
				Orion.TargetObject(item[0]);
			if(Orion.WaitForTarget(2000))
				Orion.CancelTarget();
			}
		Orion.Wait(searchFrequency);
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
	
function DropFromQueue(_)
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
	while(Orion.GetDistance(bodyX,bodyY) > 1 || !Orion.ObjAtLayer(1))
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
		
		Orion.Exec('BlockSweeper',true);
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
	Orion.Wait(200);
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

function JournalScan()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var farmType = profile.farmType;
	var msg = 'GM|equipment is severely|inithome|initfarm|initscripts|haltscripts|closefollow'
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
					//if(useDiscordPush)
						//DiscordPush(Player.Name() + ": Equipment is damaged")
					if(useAlarmSound)
						Orion.PlayWav('Alarm.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(2000);
					Orion.Exec('RecallRepair', true);
					Orion.Wait(5000);
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
function JournalScanNoEquipmentDamage()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var farmType = profile.farmType;
	var msg = 'GM|inithome|initfarm|initscripts|haltscripts|closefollow'
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
					Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
					Orion.ActivateClient();
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(6000);
					break;
				case 'inithome':
					Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
					Orion.Wait(2000);
					Orion.Exec('RecallByGump', true, ['Main','Home']);
					break;
				case 'initfarm':
					Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
					Orion.Exec('WalkThroughCurrentFarm', true);
					break;
				case 'initscripts':
					Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
					initScripts();
					break;
				case 'haltscripts':
					Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
					break;
				case 'closefollow':
					if(farmType == 'Leash')
						{
						Orion.Terminate('all', 'JournalScanNoEquipmentDamage');
						Orion.Exec('CloseFollow', true);
						}
					break;
				default:
					break;
				}
			}
		}
	}
	
function JournalScanGMonly()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var msg = 'GM'
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
					Orion.Terminate('all', 'JournalScanGMonly');
					Orion.ActivateClient();
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(6000);
					break;
				default:
					break;
				}
			}
		}
	}

function RecallBandieBuy()
    {
	Orion.PauseScript('all','JournalScan|RecallBandieBuy');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|RecallBandieBuy');
	Orion.StopWalking();
    RecallByGump('Main','Luna');
	BandieBuy();
	Orion.Wait(1500);
	Orion.Exec('WalkThroughCurrentFarm');
    }

function BandieBuy()
	{
	do {
		var vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
			{
			return Orion.Contains(vendor.Properties(), 'the weaver') && !Orion.Contains(vendor.Properties(), 'guild');
			})[0];
		Orion.Wait(1000);
		} while(!vendors)
    var shopnpcSerial = vendors.Serial();
    while(!Orion.FindType('0x0F9B')[0] || !Orion.FindType('0x0F9E')[0])
        {
		Orion.WalkTo(vendors.X(),vendors.Y());
        var shoplist = Orion.GetShopList('Cloth');
        var amount = Math.max((Player.MaxWeight() - Player.Weight() - 275)/5, 4)
        if(!Orion.FindType('0x0F9E')[0])
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount), new ShopListItem('0x0F9E', '0x0000', '', 1)];
        else
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount)];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Cloth');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(1300);
        }
    var scissors = Orion.FindType('0x0F9E')[0];
    do
		{
		var bolts = Orion.FindType('0x0F9B')[0];
		Orion.UseObject(scissors)
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(bolts);
		Orion.Wait(2000)
        var cloth = Orion.FindType('0x1766')[0];
        } while(!cloth)
    do
        {
		Orion.UseObject(scissors);
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(cloth);
        Orion.Wait(2000);
        var bandies = Orion.FindType('0x0E21', any, ground)[0] || Orion.FindType('0x0E21')[0];
        } while(!bandies)
    while(Orion.FindType('0x0E21', any, ground)[0])
        {
        Orion.MoveItem(bandies);
        Orion.Wait(1300);
        }
     if(Player.Weight() > Player.MaxWeight())
		{
		DiscordPush(Orion.ShardName() + ': ' + Player.Name() + ': Overweight after buying bandies. Halting...')
		//RecallByGump('Main','Home');
		Orion.LogOut();
		Orion.PauseScript('all');
		Orion.Wait(1000);
		Orion.Terminate('all');
		}
	}

function RecallTithingPoints()
	{
	Orion.PauseScript('all','JournalScan|RecallTithingPoints');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|RecallTithingPoints');
	RecallByGump('Main','Luna');
	if(Player.TithingPoints() < 100000)
        {
        var ankh = Orion.FindTypeEx('0x0005',any,ground,'item',20)[0];
		do
			{
			Orion.WalkTo(ankh.X(),ankh.Y())
			Orion.Wait(500);
			} while(!Orion.FindType('0x0005',any,ground,'item',2)[0])
        Orion.RequestContextMenu(ankh.Serial());
        Orion.WaitContextMenuID(ankh.Serial(), 412);
        if(Orion.WaitForGump(2000))
            {
            var gump0 = Orion.GetGump('last');
            if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000293'))
                {
                gump0.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        if(Orion.WaitForGump(2000))
            {
            var gump1 = Orion.GetGump('last');
            if((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00000293'))
                {
                var gumpHook0 = Orion.CreateGumpHook(2);
                gumpHook0.AddEntry(1, "");
                gump1.Select(gumpHook0);
                Orion.Wait(100);
                }
            }
        }
	Orion.Wait(1500);
	Orion.Exec('WalkThroughCurrentFarm');
	}

function Tithe()
    {
    CloseAllGumps();
    var endTime = Orion.Now() + 10000;
    while(Player.TithingPoints() < 100000)
        {
        if(Orion.Now() > endTime)
            {
            return DiscordPush(Player.Name() + "couldn't tithe to 100,000")
            }
        var subEndTime = Orion.Now() + 5000;
        var ankh = Orion.FindTypeEx('0x0005|0x0002|0x0003|0x0004',any,ground,'item',20)[0];
        do
            {
            if(Orion.Now() > subEndTime)
                return DiscordPush(Player.Name() + "couldn't find ankh!")
            Orion.WalkTo(ankh.X(),ankh.Y())
            Orion.Wait(500);
            } while(!Orion.FindType('0x0005|0x0002|0x0003|0x0004',any,ground,'item',2)[0])
        Orion.WaitContextMenuID(ankh.Serial(), 412);
        Orion.RequestContextMenu(ankh.Serial());
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(300);
                }
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(2));
                Orion.Wait(300);
                }
            }
        Orion.Wait(1000);
        }
    }



function Chumbawumba()
    {
    if(Player.WarMode())    
    	RecallByGump('Main','Luna');
    while(Player.Dead())
        {
        var ankh = Orion.FindTypeEx('0x0005',any,ground,'item',15)[0];
        if(!ankh)
            return Orion.CharPrint(self,1159,'No nearby ankh found! Halting...');
        while(!Orion.GumpExists('generic', self, '0x000008AF'))
            {
            Orion.WalkTo(ankh.X(),ankh.Y());
            Orion.Wait(500);
            }
        var gump = Orion.GetGump(self, '0x000008AF');
        gump.Select(Orion.CreateGumpHook(2));
        Orion.Wait(1300);
        }
    while(!Orion.ObjAtLayer('RightHand'))
        {
        DressLuck();
        Orion.Wait(1300);
        }
    while(Orion.FindType('0x1F03','0x08FD')[0])
        {
        Orion.DropType('0x1F03','0x08FD', backpack, 0, Player.X()+1, Player.Y()+1, Player.Z());
        Orion.Wait(1300);
        }
    if(Orion.Count('0x0E21') < 50 && Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(), 'the weaver') && !Orion.Contains(vendor.Properties(), 'guild')})[0])
        {
        while(Player.X() != 984 && Player.Y() != 519)
            {
            Orion.WalkTo(984, 519, 0, 0);
            Orion.Wait(500);
            }
        BandieBuy();
        }
    if(!Orion.ObjAtLayer('Mount'))
        {
        while(Player.X() != 1028 && Player.Y() != 495)
            {
            Orion.WalkTo(1028, 495, 0, 0);
            Orion.Wait(500);
            }
        Orion.Wait(1300);
        BuyHorse();
        Orion.Wait(1300);
        }
    RecallByGump('Main','Home');
    }

function BuyHorse()
    {
    var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the animal trainer') && !Orion.Contains(vendor.Properties(), 'guild');
        });
    var shopnpcSerial = vendors[0].Serial();
    var shoplist = Orion.GetShopList('Horsey');
    var items = [
        new ShopListItem('0x00E4|0x00C8|0x00E2|0x00CC', '0x0000', '', 1),
        ];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    Orion.BuyHook('Horsey');
    Orion.WaitContextMenuID(shopnpcSerial, 110);
    Orion.RequestContextMenu(shopnpcSerial);
    Orion.Wait(1300);
    var horsey = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'blue|green').filter(function(mobile)
        {
        return Orion.Contains(mobile.Name(), 'a horse');  
        })[0];
    while(!Orion.ObjAtLayer('Mount'))
        {
        Orion.Say('all follow me');
        Orion.UseObject(horsey.Serial())
        Orion.Wait(1300);
        }
    }

function sayInitHome()
	{
	Orion.SayGuild('inithome')
	}

function sayInitFarm()
	{
	Orion.SayGuild('initfarm')
	}

function sayInitScripts()
	{
	Orion.SayGuild('initscripts')
	}

function sayHaltScripts()
	{
	Orion.SayGuild('haltscripts')
	}

function sayCloseFollow()
	{
	Orion.SayGuild('closefollow')
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

function isTargetHour(targetHour)
	{
	var now = new Date();
	var UTCHour = now.getUTCHours();
	return UTCHour == targetHour;
	}

function RecallRepair()
	{
	RecallByGump('Main', 'Repair');
	Orion.WarMode(0);
	do
		{
		Orion.Step('n');
		Orion.Wait(250);
		var bench = Orion.FindTypeEx('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 10)[0];
		} while(!bench)
	if(!Orion.WalkTo(bench.X(),bench.Y()))
		Orion.WalkTo(bench.X(),bench.Y());
	RepairGear();
	Orion.Wait(1500);
	Orion.Exec('WalkThroughCurrentFarm');
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
		'0x1087','earrings','tinker',
		'0x4049',	'Gargish Leather Chest',					'tailor',
		'0x404C', 	'Gargish Leather Kilt',						'tailor',
		'0x4047',	'Gargish Leather Arms',						'tailor',
		'0x4D0A',	'Gargish Stone Amulet',						'masonry',
		'0x4066',	'Gargish Cloth Leggings',					'tailor',
		'0x4644',	'Mace and Shield Reading Glasses',	'tinker',
		'0x405A',	'Gargish Stone Chest',						'masonry',
		'0x0284',	'Bone Arms',									'tailor',
		'0x4056',	'Platemail Legs',								'blacksmith',
		'0x4D0B',	'Gargish Amulet',							'blacksmith',
		'0x4211',	'Gargish Bracelet',							'tinker',
		'0x090A',	'Glaive of The Infinite Swarm',			'blacksmith',
		'0x030A',	'Platemail Tunic',							'blacksmith',
		'0x404E',	'Leather Leggings',							'tailor',
		'0x4050',	'Platemail Arms',							'blacksmith',
		'0x405C',	'Gargish Stone Kilt',							'masonry',
		'0x405D',	'Gargish Stone Leggings',				'masonry',
		'0x4058',	'Gargish Stone Arms',						'masonry',
		'0x46B5',	'Lieutenant Of The Royal Guard',		'tailor',
		'0x4062',	'Gargish Cloth Chest',						'tailor',
		'0x404B',	'Gargish Leather Kilt',						'tailor',
		'0x4057',	'Gargish Stone Arms',						'masonry',
		'0x46B4',	'Gargish Sash Bearing the Crest of Blackthorn',		'tailor',
		'0x4210',	'Gargish Necklace',							'tinker',
		'0x4052',	'Gargish Platemail Chest',				'blacksmith',
	
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
							case 'masonry':
					    		b = 2010;
					    		break;
					    	default:
					    		return Orion.Print('Type error in repair');
					    	}
				        if(!Orion.GumpExists('generic', any, '0x00002415'))
				        	Orion.UseObject(bench);
				        if(Orion.WaitForGump(2000))
				            {
				            var gump = Orion.GetGump(any, '0x00002415');
				            if(gump !== null)
								{
								var blacksmithCount = gump.Text(3);
								var tailorCount = gump.Text(7);
								if(+blacksmithCount < 50 || +tailorCount < 50)
									DiscordPush(Orion.ShardName() + ': Check Oni repair bench!');
				               	gump.Select(Orion.CreateGumpHook(b));
								}
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
		var players = Orion.FindTypeEx(any,any,ground,'human|live|ignoreself',24,'blue|orange|gray')
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
			{
			DiscordPush('Players Detected: ' + deltaPlayers);
			Orion.SayGuild('inithome');
			}
		var deltaTime = Orion.Now() - startTime;
		Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
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