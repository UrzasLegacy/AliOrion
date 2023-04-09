var profiles = 
    {
    Thorns: 
        {
        mobGraphic: any, //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useOnslaught: false,
        useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: false, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useCounterAttack: false, //true , false.
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }

var profile = profiles.Thorns;

var timerObj =
    {
    '0x05BC6E7E': '1000', //caern
    '0x068CB859': '2000', //i am a samp
    '0x05449675': '3000', //hot chip
    'PlayerSerialEtc': '4000'
    }
Orion.Exec('JournalScan',true);
function MainLoop()
    {
    Orion.ControlAgent('autoloot','BotLoot','start')
    var playerSerial = Player.Serial();
    var timer = timerObj[playerSerial]
    var bunnyGraphic = '0x0606';
    var greenThornGraphic = '0x0F42';
    var x = 4642;
    var y = 1292;
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
        if(!Orion.InJournal('strange green thorn'))
            {
            Orion.UseType(greenThornGraphic)
            if(Orion.WaitForTarget(1000))
                Orion.TargetTile('land',x,y,0);
            }
        Orion.Wait(1000);
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