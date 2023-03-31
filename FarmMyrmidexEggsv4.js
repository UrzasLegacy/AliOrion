//Myrmidex v4
var profiles = 
    {
    Myrmidex: 
        {
        useGatherMobs: true, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
        mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useEnemyOfOne: false, //true , false.
        useCounterAttack: true, //true , false.
        useConsecrateWeapon: false, //true , false.
        useDivineFury: false, //true , false.
        useConfidence: false, //true , false.
            useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
        useBandieSelf: false, //true , false.
            useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
        useBandieOthers: false, //true , false.
            useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '1022287622137200660', //Put Discord WebHook here
            discordKey: 'w0Nsz8IXTJK2ZcJM0hntdlPMeeLKOLSMweHtBhWb7-0vUI8-lvZdkVUUv10r08_vUJMl', //Put Discord Bot Key here
        journalScanType: '', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }
var profile = profiles.Myrmidex;

function FarmMyrmidexEggs()
    {
    var memoryMinutes = 15;
    var nodes = [
        [980,1794],
        [980,1864],
        ]
    var memMs = memoryMinutes * 60 * 100000;
    var hashMem = [];
    while(true)
        {
        Orion.Print('main')
        var cullTime = Orion.Now() - memMs;
        for(var hash in hashMem)
            {
            if(hashMem[hash] < cullTime)
                delete hashMem[hash]
            }
        for(var i=0;i<nodes.length;i++)
            {
            var node = nodes[i];
            var x = node[0] + Orion.Random(-2,3);
            var y = node[1] + Orion.Random(-2,3);
            while(Orion.GetDistance(x,y) > 1)
                {
                Orion.CharPrint(self,1159,'Walking to node: ' + (i + 1))
                Orion.WalkTo(x,y,0,0);
                Orion.Wait(300);
                }
            var drone = Orion.FindTypeEx('0x057A',any,ground,'live',20).filter(function(object)
                {
                return Orion.Contains(object.Properties(),'a myrmidex drone') && !hashMem[object.Serial()]
                }).sort(function(a,b)
					{
					return a.Distance() - b.Distance();	
					})[0];
			
            while(drone)
                {
                Orion.CharPrint(drone.Serial(),1159,'here')
                var droneSerial = drone.Serial();
                Orion.CharPrint(droneSerial,1159,'Drone Found');
				while(drone && drone.Exists())
					{
					var droneX = drone.X();
					var droneY = drone.Y();
					if(Orion.GetDistance(droneX,droneY) > 1)
						{
                        Orion.CharPrint(droneSerial,1159,'Moving to Drone');
						Orion.WalkTo(droneX,droneY);
						Orion.Wait(300);
						}
					Orion.Wait(100);
					}
				Orion.Wait(1000);
				var corpses = Orion.FindTypeEx('0x2006',any,ground,'',2).filter(function(object)
					{
					return Orion.Contains(object.Properties(),'a myrmidex drone') && !hashMem[object.Serial()]
					});
				while(corpses[0])
					{
					for(var c=0;c<corpses.length;c++)
						{
						var corpse = corpses[c];
						var corpseSerial = corpse.Serial();
						var corpseX = corpse.X();
						var corpseY = corpse.Y();
						Orion.CharPrint(corpseSerial,1159,'Corpse Found');
						while(Orion.GetDistance(corpseX,corpseY) > 2)
							{
							Orion.CharPrint(corpseSerial,1159,'Moving to Corpse');
							Orion.WalkTo(corpseX,corpseY);
							Orion.Wait(300);
							}
						Orion.CharPrint(corpseSerial,1159,'Opening Corpse');
						var startTime = Orion.Now();
						var endTime = startTime + 5000;
						while(!Orion.OpenContainer(corpseSerial,1300))
							{
							if(Orion.Now() > endTime)
								{
								hashMem[corpseSerial] = Orion.Now();
								drone = Orion.FindTypeEx('0x057A',any,ground,'live',20).filter(function(object)
									{
									return Orion.Contains(object.Properties(),'a myrmidex drone') && !hashMem[object.Serial()]
									}).sort(function(a,b)
										{
										return a.Distance() - b.Distance();	
										})[0];
								break;
								}
							Orion.CharPrint(corpseSerial,1159,'Reattempting Open Corpse');
							Orion.Wait(1300);
							}
						if(Orion.Now() - startTime < 1300)
							Orion.Wait(1300 - (Orion.Now() - startTime));
						corpseContainer = Orion.GetSerial(lastcontainer);
						var eggCount = 0;
						var eggSac = Orion.FindTypeEx('0x2808',any,corpseContainer)[0];
						while(eggSac && eggSac.Container() != Orion.GetSerial(backpack))
							{
							var tempCount = eggSac.Count();
							Orion.CharPrint(self,1159,'Looting Myrmidex Eggsac: ' + tempCount);
							eggCount += tempCount;
							Orion.MoveItem(eggSac.Serial());
							Orion.Wait(1100);
							eggSac = Orion.FindTypeEx('0x2808',any,corpseContainer)[0];
							}
						var increment = Shared.GetVar('Eggsacs',0) + eggCount;
						Shared.AddVar('Eggsacs', increment);
						hashMem[corpseSerial] = Orion.Now();
						}
					corpses = Orion.FindTypeEx('0x2006',any,ground,'',2).filter(function(object)
						{
						return Orion.Contains(object.Properties(),'a myrmidex drone') && !hashMem[object.Serial()]
						});
					}
                Orion.Wait(500)
                drone = Orion.FindTypeEx('0x057A',any,ground,'live',20).filter(function(object)
                    {
                    return Orion.Contains(object.Properties(),'a myrmidex drone') && !hashMem[object.Serial()]
                    }).sort(function(a,b)
						{
						return a.Distance() - b.Distance();	
						})[0];
                }
            }
        Orion.Wait(1000);
        }
    }

function MyrmidexGump()
    {
    var startTime = Orion.Now();
    Shared.AddVar('Eggsacs',0);
    while(true)
        {
        var sacCounter = Shared.GetVar('Eggsacs',0);
    	var gump = Orion.CreateCustomGump(11001);
        //
		var sec = Orion.Now() - startTime;
        var date = new Date(sec);
        var time = date.toISOString().substring(11, 19);
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 160, 75);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(95, 10, "0", time);
        gump.AddText(10, 25, "0",'Eggsacs: ');
        gump.AddText(95, 25, "0", sacCounter);
        gump.AddText(10, 40, "0",'Eggsacs/hr: ');
        gump.AddText(95, 40, "0", (sacCounter / (sec/3600000)).toFixed(2));
        gump.Update();
        Orion.Wait(500);
        }
    }

function initScripts()
	{
	Orion.Exec('JournalScan', true);
	Orion.Exec('AutoAttack', true);
	Orion.Exec('AutoEvade', true);
	Orion.Exec('AutoGatherMobs', true);
	Orion.Exec('FarmMyrmidexEggs', true);
	Orion.Exec('MyrmidexGump', true);
	if(profile.useConfidence || profile.useConsecrateWeapon || profile.useCounterAttack || profile.useDivineFury || profile.useEnemyOfOne)
		Orion.Exec('AutoBuffs', true);
	if(profile.useBandieSelf || profile.useBandieOthers)
		Orion.Exec('BandieBot', true);
	}

function terminateScripts()
	{
	Orion.Terminate('all', 'BandieBot|JournalScan|DecoHighlighter|Listener');
	}

function AutoAttack()
    {
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
	var lowestHPPercent = 40;
	var highestHPPercent = 60;
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

function BandieBot()
	{
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
					DiscordPush(Player.Name() + ': Low on Bandies');
					break;
					}
				}
			var target = injuredCheck(2, useBandieOtherThresholdPercent, true);
			if(useBandieOthers && target && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(target.Serial());
				}
			else if(useBandieSelf && Player.Hits('%') < useBandieSelfThresholdPercent && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(self);
				}
			}
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

function JournalScan()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = profile.useAlarmSound;
	var journalScanType = profile.journalScanType;
	var msg = 'GM'
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
		'0x1087','earrings','tinker',
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


function CastEvasion()
	{
	Orion.Cast('Evasion')
	var check = Orion.WaitJournal('before you can use this ability again.|You feel that you might be able to deflect any attack!', Orion.Now(), Orion.Now() + 2000, 'sys');
	if(check && check.Text() == 'You feel that you might be able to deflect any attack!')
		Orion.AddDisplayTimer('Evasion', 20000 + Orion.BuffTimeRemaining('Evasion'), 'UnderChar', 'bar', 'Evasion CD', 0, 40);
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
