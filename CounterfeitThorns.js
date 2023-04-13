var bunnyGraphic = '0x0606';
var greenThornGraphic = '0x0F42';

// Setup Instructions
// Change x and y to the coordinates of the tile you'd like to target with the green thorns. Has to be farm land.
// Use your characters to stam block the bunny, you only need 2 if you have a fence corner to work with.
var x = 4577;
var y = 1480;
//Do not do this in guard zone in tram, you won't be able to hurt the bunnies.
//No benefit to doing it in fel, fel luck bonus does not apply to this, confirmed by devs

//Tweak these settings and don't forget to change the Discord hook and key
var profiles = 
    {
    Thorns: 
        {
        mobGraphic: bunnyGraphic, //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useOnslaught: false,
        useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: false, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useCounterAttack: false, //true , false.
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '88726863736875314', //Put Discord WebHook here
            discordKey: 'SJfWniY7drrewqrvXSPb3EasdFs7VH5_qTg695utEsfasdfVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }

var profile = profiles.Thorns;

Orion.Exec('JournalScan',true);

function MainLoop()
    {
    var timerObj =
        { //'PlayerSerial: 'msString'
        '0x068B2AA0': '1000', //marceline
        '0x068B33C8': '2000', //Catti-brie
        '0x068B2FB5': '3000', //marion
        '0x05A17672': '1000',
        '0x04B41304': '2000',
        '0x054976B5': '3000',
        }
    Orion.ControlAgent('autoloot','BotLoot','start')
    var playerSerial = Player.Serial();
    var timer = timerObj[playerSerial]
    Orion.Exec('AutoAttack',true);
    while(!Player.Dead())
        {
        var bunny = Orion.FindType(bunnyGraphic,any,ground,'live',3)[0]
        while(bunny)
            {
            Orion.Attack(bunny)
            Orion.Wait(50);
            bunny = Orion.FindType(bunnyGraphic,any,ground,'live',3)[0]
            Orion.ClearJournal();
            }
        Orion.Wait(timer)
        if(!Orion.InJournal('strange green thorn') && !Orion.FindType(any,any,ground,'live','xyz: ' + x + ',' + y)[0])
            {
            Orion.UseType(greenThornGraphic)
            if(Orion.WaitForTarget(1000))
                Orion.TargetTile('land',x,y,0);
            }
        Orion.Wait(1000);
        }
    }

function ToTTurnIns()
	{ //BE VERY CAREFUL! WILL TURN IN EVERY DROP IN YOUR BACKPACK AND SUBCONTAINERS. Open turn in gump and start script
	while(true)
		{
        if(Orion.WaitForGump(2000))
			{
			var gump = Orion.GetGump('last');
			if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00002336'))
				{
                gump.Select(Orion.CreateGumpHook(100));
				Orion.Wait(100);
				}
			}
		else
			break;
		}
	}

function terminateScripts()
    {
    Orion.Terminate('all')
    }

function AutoAttack()
    {
    //Orion.Exec('AutoBuffs',true);
    var useSingleTargetSpecial = profile.useSingleTargetSpecial;
    var singleTargetSpecial = profile.singleTargetSpecial;
    var useMomentumStrike = profile.useMomentumStrike;
    var useWhirlwind = profile.useWhirlwind;
    var whirlwindSpecial = profile.whirlwindSpecial;
	var useOnslaught = profile.useOnslaught;
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
				if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
					{
					Orion.Cast('Onslaught');
					var startTime = Orion.Now();
					var endTime = startTime + 3000;
					var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
					if(check)
						Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
					}
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
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
                else if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
                    {
                    Orion.Cast('Onslaught');
                    var startTime = Orion.Now();
                    var endTime = startTime + 3000;
                    var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
                    if(check)
                        Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
                    }
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
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
                else if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
                    {
                    Orion.Cast('Onslaught');
                    var startTime = Orion.Now();
                    var endTime = startTime + 3000;
                    var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
                    if(check)
                        Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
                    }
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
                break;
            }
        Orion.Wait(500);
        }
    }

function JournalScan()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = true//profile.useAlarmSound;
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
						Orion.PlayWav('GMAlert.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					//Orion.CloseUO();
					Orion.Wait(6000);
					break;
				case 'severely':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": Equipment is damaged")
					//if(useAlarmSound)
						//Orion.PlayWav('Alarm.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					Orion.Exec('EquipmentDamage',true);
					break;
				default:
					break;
				}
			}
		}
	}

function EggMover6000()
	{
    Orion.CharPrint(self,1159,'Target source container')
    Orion.WaitForAddObject('myTarget');
    var sourceContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target destination container')
    Orion.WaitForAddObject('myTarget');
    var destinationContainer = Orion.GetSerial('myTarget');
	while(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, sourceContainer)[0])
		{
		Orion.MoveItemType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, sourceContainer, 0, destinationContainer);
		Orion.Wait(1100);
		}
	}	
	
function RareEggMover6000() //need to add new rare hues
	{
	while(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', '0x0AC7|0x0AC6|0x0AC1|0x0AB0|0x081C|0x081B|0x0AA1|0x044B|0x044C', sourceContainer)[0])
		{
		Orion.MoveType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', '0x0AC7|0x0AC6|0x0AC1|0x0AB0|0x081C|0x081B|0x0AA1|0x044B|0x044C', sourceContainer, 0, destinationContainer);
		Orion.Wait(1100);
		}
	}

function SetDiscordRegistryEntry()
    {
    var discordConfig = "https://discordapp.com/api/webhooks/" + profile.discordHook + '/' + profile.discordKey;
    var registryName = 'discordConfig';
    Orion.RegWrite(registryName, discordConfig);
    return discordConfig;
    }

function DiscordPush(message)
	{
	var bot = Orion.RegRead('discordConfig') || SetDiscordRegistryEntry();
	Orion.HttpPost(bot, "content=" + message);
	}