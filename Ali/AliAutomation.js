function GMScan()
	{
	var useDiscordPush = true//profile.useDiscordPush;
	var useAlarmSound = true//profile.useAlarmSound;
    var closeUO = false;
    var timeStamp = 0;
    var gmCheck;
	while(true)
		{
        gmCheck = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(mob)
            {
            return mob.Properties().indexOf('GM ') > -1;
            }).length || Orion.InJournal('GM ', 'sys', '0', 'any', timeStamp - 500, Orion.Now() + 1000);
        timeStamp = Orion.Now();    
        if(gmCheck)
            {
			 if(useDiscordPush)
			    DiscordPush(Player.Name() + ": GM");
			if(useAlarmSound)
			    Orion.PlayWav('GMAlert.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
			Orion.PauseScript('all','GMScan');
			Orion.Wait(500);
			Orion.Terminate('all', 'GMScan');
			Orion.StopWalking();
			Orion.Wait(5000);
			if(closeUO)
			    {
			    Orion.OAOptionSet('AutoReconnect', '0');
			    Orion.CloseUO();
			    }
			}
        Orion.Wait(3000);
		}
	}

function JournalScan()
	{
	var useDiscordPush = true//profile.useDiscordPush;
	var useAlarmSound = true//profile.useAlarmSound;
	var journalScanType = true//profile.journalScanType;
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


//--# AliAutomation
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

function AutoEvade()
	{
	Orion.Exec('BuffMonitor',true);
	Shared.AddVar('AutoEvade',true);
	var lowestHPPercent = 30;
	var highestHPPercent = 50;
	while(!Player.Dead())
		{
		var count = Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red').length;
		if(!Orion.DisplayTimerExists('Evasion') && !Orion.BuffExists('Evasion') && Player.Hits('%') < Math.min((lowestHPPercent + (2 * count)), highestHPPercent))
			Orion.Cast('Evasion');
		Orion.Wait(100);
		}
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
                if(useMomentumStrike && !Orion.BuffExists('Momentum Strike'))
                    {
                    if(Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    }
                else if(useWhirlwind && !Orion.AbilityStatus(whirlwindSpecial))
                    {
                    if(Player.Mana() >= 15)
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
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial))
                    {
                    if(Player.Mana() >= 15)
                        Orion.UseAbility(singleTargetSpecial);
                    }
                break;
            default: //more than 2 enemies
                if(useWhirlwind && !Orion.AbilityStatus(whirlwindSpecial))
                    {
                    if(Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    }
                else if(useMomentumStrike && !Orion.BuffExists('Momentum Strike'))
                    {
                    if(Player.Mana() >= 8)
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
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial))
                    {
                    if(Player.Mana() >= 15)
                        Orion.UseAbility(singleTargetSpecial);
                    }
                break;
            }
        Orion.Wait(500);
        }
    }
	
function AutoAttackBackup()
    {
    //Orion.Exec('AutoBuffs',true);
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

function AutoAttackArcher()
	{
	var useGatherMobs = false
	var useSingleTargetSpecial = true
	var singleTargetSpecial = 'Primary';
	var useMultiTargetSpecial = false
	var multiTargetSpecial = 'Secondary';
	while(!Player.Dead())
		{
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 10, 'gray|red|criminal|enemy');
		var enemyCount = enemies.length;
		if(enemyCount && useGatherMobs)
			GatherMobs();
		else if(enemyCount)
			AttackNearest();
		switch(enemyCount)
			{
			case 0:
				break;
			case 1:
				if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
					Orion.UseAbility(singleTargetSpecial);
				break;
			default: //more than 1 enemies. Currently same as 1 enemy
				if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
					Orion.UseAbility(singleTargetSpecial);
				break;
			}
		Orion.Wait(500);
		}
	}

function AlwaysAttackAdjacent()
	{
	while(true)
		{
		var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignoreself|ignorefriends', 1, 'gray|criminal|red')[0]; 
		Orion.TargetSystemSerial(target);
		Orion.Attack(target);
		Orion.Wait(200);
		}
	}

function AttackNearest()
    {
	Orion.ResetSearchArea();
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignoreself|ignorefriends', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
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
		Orion.UseIgnoreList(insureIgnore);
		var item = Orion.FindList(insureFind);
		Orion.ResetIgnoreList();
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

function SingleMageHealBot()
	{
	while(!Player.Dead())
		{
		if(!Orion.HaveTarget() && !Player.Frozen())
			{
			Orion.Cast('Greater Heal')
			Orion.WaitForTarget(3000);
			}
		var target = injuredCheck(10, 50);
		if(Player.Hits('%') < 80)
			{
			if(Orion.WaitForTarget(3000))
				Orion.TargetObject(self);
			}
		else if(target)
			{
			if(target.Poisoned())
				{
				Orion.CancelTarget();
				Orion.Cast('Cure');
				if(Orion.WaitForTarget(3000))
					Orion.TargetObject(target.Serial());	
				}
			else
				{
				if(Orion.WaitForTarget(3000))
					Orion.TargetObject(target.Serial());	
				}
			}
		Orion.Wait(300);
		}
	}

function MysticHealBot()
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

function AutoTracker()
    {
    while(true)
        {
        for(var i=1;i<5;i++)
            {
			while(!Player.Hidden())
				{
				Orion.UseSkill('Hiding');
				Orion.Wait(100);
				}
            if(i == 2 || i == 3)
                continue;
            var msg = 'Searching for ';
            if(i == 1)
                msg += 'Animals';
            else if(i == 2)
                msg += 'Monsters';
            else
                msg += 'Players'
            //Orion.CharPrint(self,1159,msg);
            Orion.UseSkill('Tracking')
            var check = Orion.WaitJournal('What do you wish to track?',Orion.Now(),Orion.Now() + 2000,'sys');
            if(!check)
                {
                i--;
                continue;
                }
            var gump = WaitForSpecificGump(2000, 'generic', 'any', '0x00BC7230')
            if(gump)
                {
                gump.Select(Orion.CreateGumpHook(i));
                var check = Orion.WaitJournal('Select the one you would like to track.|You see no evidence of those in the area.',Orion.Now(),Orion.Now() + 5000,'sys');
                if(check && check.Text() == 'Select the one you would like to track.')
                    {
                    gump = WaitForSpecificGump(2000, 'generic', any, '0x00BC7231')
                    if(gump)
                        {
                        var textList = gump.TextList();
                        if(textList[0])
                            {
                            var outMsg = '';
                            for(var j=0;j<textList.length;j++)
                                {
                                var text = textList[j];
								if(Orion.Contains(text,'I AM A SAMPIRE|Disco Stu|Im With Leech|Thessaly|Pickle Chips|Ralph Waldo'))
									continue;
                                outMsg = text + '\n';
                                }
                            if(outMsg.length)
                                {
                                outMsg = Player.Name() + ':Players:\n' + outMsg;
                                DiscordPush(outMsg);
                                }
                            }
						else if(gump.ButtonList().length)
							{
							var msg = Player.Name() + ': ';
							if(i == 1)
								msg += 'Animal';
							else if(i == 2)
								msg += 'Monster';
							DiscordPush(msg + ' Detected!');
							}
                        gump.Select(Orion.CreateGumpHook(1));
                        }
                    }
                }
            }
        }
    }

/*
Combine All Refinements
Written by Ali
January 16, 2023

Call Variants:
    CombineAllRefinements();
Arguments:
    N/A
Result:
    Does not return a value
*/

function CombineAllRefinements()
    {
    var amalgamator = Orion.FindType('0x9966','0x0480')[0];
    if(!amalgamator)
        return Orion.CharPrint(self,1159,'No empty amalgamator in backpack! Halting...');
    var upgradeAmount = {'Defense': 2,'Protection': 3,'Hardening': 4,'Fortification': 5}
    var refinements = [['0x4CD9', 'Scour'],['0x142B', 'Cure'],['0x2D61', 'Varnish'],['0x142A', 'Wash'],['0x4CDA', 'Gloss'],['0x4CD8', 'Polish']]
    var armors = ['Platemail','Chainmail','Ringmail','Dragon','Platemail Samurai','Gargish Platemail','Gargish Stone','Woodland','Bone','Hide','Studded Leather','Studded Samurai']
    var levels = ['Defense','Protection','Hardening','Fortification']
    Orion.CharPrint(self,1159,'Target container full of refinements');
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container',container))
        {
        Orion.UseObject(container);
        Orion.Wait(1300);
        }
    for(var r=0;r<refinements.length;r++) 
        {
        var refinement = refinements[r];
        for(var a=0;a<armors.length;a++)
            {
            var armor = armors[a];
            for(var l=0;l<levels.length;l++) 
                {
                var level = levels[l];
                var amount = upgradeAmount[level];
                var items = Orion.FindType(refinement[0],any,container).filter(function(item)
                    {
                    var parse = ParseRefinement(item);
                    return parse['level'] == level && parse['armor'] == armor;
                    });
                while(items.length >= amount)
                    {
                    Orion.CharPrint(self,1159, 'Combining ' + amount + ' ' + refinement[1] + ' of ' + level + ': ' + armor)
                    if(!Combine(items,amount))
                        return Orion.CharPrint(self,1159,'Empty amalgamator missing! Halting...');
                    var resultItem = Orion.FindType(refinement)[0];
                    while(resultItem)
                        {
                        Orion.MoveItem(resultItem,0,container)
                        Orion.Wait(1300);
                        resultItem = Orion.FindType(refinement)[0];
                        }
                    items = Orion.FindType(refinement[0],any,container).filter(function(item)
                        {
                        var parse = ParseRefinement(item);
                        return parse['level'] == level && parse['armor'] == armor;
                        });
                    }
                }
            }
        }
    }

function FillRepairBench()
    {
    Orion.CharPrint(self, 1159, 'Select supply container. It should contain blank scrolls');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
    if(!bench || Orion.GetDistance(bench) > 2)
        return Orion.CharPrint(self, 1159, 'No repair bench close enough! Halting...');
    if(!supplyContainer || Orion.GetDistance(supplyContainer) > 2)
        return Orion.CharPrint(self, 1159, 'Supply container missing or too far away! Halting...');
    Fill('Tinker', 'Tinkering', 100, '0x1EB9|0x1EBC|0x1EB8', supplyContainer, bench, 1);
    Fill('Blacksmith', 'Blacksmithy', 180, '0x0FBC|0x13E3|0x0FB5', supplyContainer, bench, 3);
    Fill('Carpenter', 'Carpentry', 100, '0x10E4|0x102E|0x1030|0x1032|0x102C|0x102A|0x1034|0x1029|0x10E6|0x10E7|0x10E5', supplyContainer, bench, 5);
    Fill('Tailor', 'Tailoring', 120, '0x0F9D', supplyContainer, bench, 7);
    //Fill('Mason', 'Carpentry', 100, '0x12B3', supplyContainer, bench, 9); //works, but no check for Masonry Specialization in place
    //Fill('Alchemist', 'Alchemy', 100, '0x0E8A', supplyContainer, bench, 11); //untested, also no check for Glassblowing Specialization in place
    Fill('Fletcher', 'Bowcraft/Fletching', 100, '0x1022', supplyContainer, bench, 13);
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

function MaintainLunaRune()
	{
	Orion.WaitForAddObject('myTarget');
	var runeBag = Orion.GetSerial('myTarget');
	while(true)
		{
		while(!Orion.GumpExists('container',runeBag))
			{
			Orion.UseObject(runeBag);
			Orion.Wait(1300);
			}
		var PlayerX = Player.X();
		var PlayerY = Player.Y();
		Orion.SetSearchArea(PlayerX - 1,PlayerY - 1,PlayerX + 1,PlayerY +1);
		var runeCheck = Orion.FindTypeEx('0x1F14',any,ground,'',2).filter(function(rune)
			{
			return Orion.Contains(rune.Properties(),'Imperatrix');
			})[0];
		Orion.ResetSearchArea();
		if(!runeCheck)
			{
			var rune = Orion.FindTypeEx('0x1F14',any,runeBag).filter(function(rune)
				{
				return Orion.Contains(rune.Properties(),'Imperatrix');
				})[0];
			if(!rune)
				break;
			DropRuneHere(rune.Serial())
			}
		Orion.EmoteAction('salute')
		Orion.Wait(150000);
		}
	}