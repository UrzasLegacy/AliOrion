Orion.Exec('GMJournalScan',true);
function StayLoggedIn()
	{
	while(!Player.Dead())
		{
		Orion.UseObject(backpack);
		Orion.Wait(60000);
		}
	}

function initScripts()
	{
	Orion.Exec('TrainNinjitsu60to100', true);
	}
	
function TrainEvalResist()
	{
	while (!Player.Dead())
		{
		if(Player.Mana() < 20) 
        	{
            while (Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1500);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				}
            }
		 Orion.Cast('Weaken', self);
		 Orion.Wait(800);
		 Orion.Cast('Feeblemind', self);
		 Orion.Wait(800);
		 Orion.Cast('Clumsy', self);
		 Orion.Wait(800);	 
		}
	}

function TrainNinjitsuTo60()
	{ //cast mirror image, ready focus attack, attack mirror image. You need a melee weapon equipped
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsuTo60']);
	var msg = Player.Name() + '|The spell fizzles'
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump');
		if(Player.Mana() > 25)
			{
			Orion.Cast('Mirror Image');
			var check = Orion.WaitJournal(msg, Orion.Now(), Orion.Now() + 5000)
			WaitPingAdjusted(200);
			var mirror = Orion.FindTypeEx(any,any,ground,'ignoreself|mobile', 5).filter(function(part){return Orion.Contains(part.Properties(), Player.Name())});
			if(mirror.length)
				{
				WaitPingAdjusted(10);
				Orion.Cast('Focus Attack');
				WaitPingAdjusted(10);
				while(mirror[0].Exists())
					{
					Orion.Attack(mirror[0].Serial());
					Orion.Wait(10);
					}
				}
			WaitPingAdjusted(750);
			}
		WaitPingAdjusted(10);
		}
	}

function TrainNinjitsu60to100()
	{//stand somewhere you can reliably shadowjump
	Orion.ClientOptionSet('AlwaysRun', 0);
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsu60to100']);
	var x1 = Player.X();
	var x2 = Player.X()-1;
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump');
		if(!Player.Hidden())
			{
			Orion.UseSkill('Hiding');
			WaitPingAdjusted(0);
			if(Player.X() == x1)
				Orion.Step('w',false);
			else
				Orion.Step('e',false);
			}
		if(Player.Mana() > 25)
			{
			Orion.Cast('Shadowjump');
			Orion.WaitForTarget(2000);
			if(Player.X() == x1)
				Orion.TargetTile('land', x2, Player.Y(), Player.Z());
			else
				Orion.TargetTile('land', x1, Player.Y(), Player.Z());
			WaitPingAdjusted(600);
			}
		else if(Orion.SkillValue('Meditation') > 400)
        	{
        	WaitPingAdjusted(500);
            while(Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1000);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				Orion.PrintFast(self,1159,0,'Meditating... ' + Player.Mana() + '/' + Player.MaxMana());
				}
            }
		Orion.Wait(10);
		}
	}

function TrainNinjitsu85to100()
	{ //cast mirror image, ready focus attack, attack mirror image. You need a melee weapon equipped
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsu85to100']);
	var msg = Player.Name() + '|The spell fizzles'
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump');
		if(Player.Mana() > 25)
			{
			Orion.Cast('Mirror Image');
			var check = Orion.WaitJournal(msg, Orion.Now(), Orion.Now() + 5000)
			WaitPingAdjusted(200);
			var mirror = Orion.FindTypeEx(any,any,ground,'ignoreself|mobile', 5).filter(function(part){return Orion.Contains(part.Properties(), Player.Name())});
			if(mirror.length)
				{
				WaitPingAdjusted(10);
				Orion.Cast('Death Strike');
				WaitPingAdjusted(10);
				while(mirror[0].Exists())
					{
					Orion.Attack(mirror[0].Serial());
					Orion.Wait(10);
					}
				}
			WaitPingAdjusted(750);
			}
		else if(Orion.SkillValue('Meditation') > 400)
        	{
        	WaitPingAdjusted(500);
            while(Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1000);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				Orion.PrintFast(self,1159,0,'Meditating... ' + Player.Mana() + '/' + Player.MaxMana());
				}
            }
		WaitPingAdjusted(10);
		}
	}
	
function TrainStealth()
	{//stand near a moongate and press start.
	Orion.Exec('SkillGump', true, ['Stealth', 'TrainStealth']);
	Orion.ClientOptionSet('AlwaysRun', 0);
	var timingMS = 600
	var hidingCap = 1000;
	var stealthCap = 1000;
	while(!Player.Dead() && (Orion.SkillValue('Hiding') < hidingCap || Orion.SkillValue('Stealth') < stealthCap))
		{
		Orion.ResumeScript('SkillGump');
		ChangeSuit();
		for(var i = 0;i<2;i++)
			{
			var gate = Orion.FindTypeEx('0x0F6C', '0xFFFF', 'ground', 10)[0];
			var endTime = Orion.Now() + 10000;
			while(gate && gate.Distance())
				{
				if(Orion.Now() > endTime)
					{
					Orion.Print(500);
					//TextWindow.Open();
					//TextWindow.Print('timeout')
					break;
					}
				Orion.WalkTo(gate.X(),gate.Y(),0,0);
				Orion.Wait(timingMS);
				}
			if(Orion.WaitForGump(2000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
					{
					var gumpHook0 = Orion.CreateGumpHook(1);
					gumpHook0.AddCheck(22 + (i * 2), true);
					gump0.Select(gumpHook0);
					Orion.CloseGump('generic',gate.Serial());
					}
				}
			WaitPingAdjusted(timingMS);
			while(i == 1 && !Orion.BuffExists('arcane empowerment') && Orion.GetDistance(528,216) < 10)
				{
				Orion.Wait(100);
				}
			Orion.Resend();
			Orion.Step(Orion.Random(0,9), false);
			WaitPingAdjusted(timingMS);
			if(Player.Hidden())
				Orion.UseSkill('Stealth');
			if(Player.Hidden())
				Orion.SayWhisper("'");
			WaitPingAdjusted(timingMS);
			}
		}
	Orion.LogOut();
	}

function TrainStealthComplex()
	{//stand near a moongate and press start. Check online for correct suit pieces to wear depending on skill level
	Orion.Exec('SkillGump', true, ['Stealth', 'TrainStealthComplex']);
	Orion.ClientOptionSet('AlwaysRun', 0);
	var timingMS = 400
	var lastRand = 0;
	var moongates = [5,6,7,8]
	while(!Player.Dead())
		{
		Orion.Print(2);
		Orion.ResumeScript('SkillGump');
		ChangeSuit();
		do var rand = Orion.Random(1,10); while(rand == lastRand || rand == 4 || rand == 3)
		if(rand == 9)
			{
			var randArr = [9,1];
			lastRand = 1;
			}
		else
			{
			var randArr = [rand,++rand];
			lastRand = rand + 1;
			}
		for(var i = 0;i<2;i++)
			{
			var gate = Orion.FindTypeEx('0x0F6C', '0xFFFF', 'ground', 10)[0];
			var endTime = Orion.Now() + 10000;
			while(gate && gate.Distance())
				{
				Orion.Print(1);
				if(Orion.Now() > endTime)
					{
					Orion.Print(666);
					TextWindow.Open();
					TextWindow.Print('timeout')
					break;
					}
				Orion.WalkTo(gate.X(),gate.Y(),0,0);
				Orion.Wait(500);
				}
			if(Orion.WaitForGump(2000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
					{
					var gumpHook0 = Orion.CreateGumpHook(1);
					gumpHook0.AddCheck(randArr[i], true);
					gump0.Select(gumpHook0);
					Orion.CloseGump('generic',gate.Serial());
					}
				}
			WaitPingAdjusted(timingMS);
			Orion.Step(Orion.Random(0,9), false);
			WaitPingAdjusted(timingMS);
			Orion.UseSkill('Stealth');
			Orion.Resend();
			Orion.SayWhisper("'");
			WaitPingAdjusted(timingMS);
			}
		}
	}

function BuyStealthSuitPieces()
	{
	var graphic = {
		'LeatherTunic': 0x13CC,
		'LeatherGloves': 0x13C6,
		'LeatherGorget': 0x13C7,
		'LeatherCap': 0x1DB9,
		'LeatherSleeves': 0x13C5,
		'StuddedSleeves': 0x13D4,
		'StuddedGorget': 0x13D6,
		'ChainmailTunic': 0x13BF,
		'RingmailGloves': 0x13EB,
		'RingmailSleeves': 0x13EE,
		'RingmailLeggings': 0x13F0,
		'PlatemailGorget': 0x1413
		}	
	var shoplist = Orion.GetShopList('Stealth');
	var items = [
		new ShopListItem(0x13CC, '0x0000', '', 1),
		new ShopListItem(0x13C6, '0x0000', '', 1),
		new ShopListItem(0x13C7, '0x0000', '', 1),
		new ShopListItem(0x1DB9, '0x0000', '', 1),
		new ShopListItem(0x13C5, '0x0000', '', 1),
		new ShopListItem(0x13CB, '0x0000', '', 1),
		new ShopListItem(0x13D4, '0x0000', '', 1),
		new ShopListItem(0x13D6, '0x0000', '', 1),
		];
	shoplist.SetItems(items);
	Orion.UpdateShopList(shoplist);
	var armourer = Orion.FindTypeEx(any,any,ground,'mobile',10).filter(function(npc)
		{
		return Orion.Contains(npc.Properties(), 'armourer')
		})[0];
	Orion.WalkTo(armourer.X(), armourer.Y());
	Orion.BuyHook('Stealth');
	Orion.WaitContextMenuID(armourer.Serial(), 110);
	Orion.RequestContextMenu(armourer.Serial());
	Orion.Wait(5000);
	items = [
		new ShopListItem(0x13BF, '0x0000', '', 1),
		new ShopListItem(0x13EB, '0x0000', '', 1),
		new ShopListItem(0x13EE, '0x0000', '', 1),
		new ShopListItem(0x13F0, '0x0000', '', 1),
		new ShopListItem(0x1413, '0x0000', '', 1),
		];
	shoplist.SetItems(items);
	Orion.UpdateShopList(shoplist);
	var blacksmith = Orion.FindTypeEx(any,any,ground,'mobile',10).filter(function(npc)
		{
		return Orion.Contains(npc.Properties(), 'blacksmith');
		})[0];
	Orion.WalkTo(blacksmith.X(), blacksmith.Y());
	Orion.BuyHook('Stealth');
	Orion.WaitContextMenuID(blacksmith.Serial(), 110);
	Orion.RequestContextMenu(blacksmith.Serial());
	}
	
function ChangeSuit()
	{
	var graphic = {
		'LeatherTunic': 0x13CC,
		'LeatherGloves': 0x13C6,
		'LeatherGorget': 0x13C7,
		'LeatherCap': 0x1DB9,
		'LeatherSleeves': 0x13C5,
		'LeatherLeggings': 0x13CB,
		'StuddedSleeves': 0x13D4,
		'StuddedGorget': 0x13D6,
		'ChainmailTunic': 0x13BF,
		'RingmailGloves': 0x13EB,
		'RingmailSleeves': 0x13EE,
		'RingmailLeggings': 0x13F0,
		'PlatemailGorget': 0x1413
		}	
	if(Orion.SkillValue('Stealth') < 580)
		{
		EquipSuit([graphic.LeatherGorget, graphic.LeatherGloves]);
		}
	else if(Orion.SkillValue('Stealth') < 650)
		{
		EquipSuit([graphic.RingmailGloves, graphic.LeatherSleeves, graphic.LeatherGorget]);
		}
	else if(Orion.SkillValue('Stealth') < 845)
		{
		EquipSuit([graphic.RingmailGloves, graphic.RingmailSleeves, graphic.LeatherGorget]);
		}
	else if(Orion.SkillValue('Stealth') < 950)
		{
		EquipSuit([graphic.RingmailGloves, graphic.StuddedSleeves, graphic.StuddedGorget, graphic.LeatherTunic, graphic.RingmailLeggings]);
		}
	else if(Orion.SkillValue('Stealth') < 1000)
		{
		while(Orion.ObjAtLayer('Arms'))
			{
			Orion.Print(4);
			Orion.Unequip('Arms');
			Orion.Wait(1300);
			}
		while(Orion.ObjAtLayer('Gloves'))
			{
			Orion.Print(3);
			Orion.Unequip('Gloves');
			Orion.Wait(1300);
			}
		EquipSuit([graphic.LeatherLeggings, graphic.ChainmailTunic, graphic.StuddedGorget, graphic.LeatherCap]);
		}
	else if(Orion.SkillValue('Stealth') < 1200)
		{
		while(Orion.ObjAtLayer('Legs'))
			{
			Orion.Print(5);
			Orion.Unequip('Legs');
			Orion.Wait(1300);
			}
		while(Orion.ObjAtLayer('Helmet'))
			{
			Orion.Print(6);
			Orion.Unequip('Helmet');
			Orion.Wait(1300);
			}
		EquipSuit([graphic.ChainmailTunic, graphic.RingmailSleeves, graphic.PlatemailGorget]);
		}
	}

function EquipSuit(arr)
	{
	for(var i=0;i<arr.length;i++)
		{
		var piece = Orion.FindType(arr[i])[0];
		if(piece)
			{
			Orion.Wait(2000);
			Orion.Equip(piece);
			piece = Orion.FindType(arr[i])[0];
			}
		}
	}
	
function TrainMagery() 
	{
	var skillCap = 1000; //set to your target skill level. 1000 = 100.0
	Orion.Exec('SkillGump', true, ['Magery', 'TrainMagery']);
	var skillLevel = Orion.SkillValue('Magery', 'base');
	var skillLevelreal = Orion.SkillValue('Magery');
	var iteminpack = Orion.FindType(any);
	if(iteminpack[0])
		var trainingTarget = iteminpack[0];
	else
		return Orion.CharPrint(self,1159,'No item in backpack to target!');
    while (skillLevelreal < skillCap) 
      	{
      	skillLevel = Orion.SkillValue('Magery', 'base');
      	skillLevelreal = Orion.SkillValue('Magery');
        if(Player.Mana() < 20) 
        	{
            while (Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1500);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				}
            }
        else if(skillLevel < 300) 
        	{
        	Orion.Cast('Cure');
        	Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
        	}
        else if(skillLevel <= 450)
        	{
            Orion.Cast('Fireball');
            Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
        	}
       	else if(skillLevel <= 550) 
       		{
       		Orion.Cast('Lightning');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 650) 
       		{
       		Orion.Cast('Paralyze');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 800) 
       		{
       		Orion.Cast('Reveal');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(self);
       		}
       	else if(skillLevel <= 900) 
       		{
       		Orion.Cast('Flame Strike');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 1200) 
       		{
       		Orion.Cast('Earthquake');
       		WaitPingAdjusted(1000);
       		}  
       	WaitPingAdjusted(700);  	
        }
  	TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Magery Finished");
	}

function stop()
	{
	while(Orion.SkillValue('Stealth') < 1000)
		{
		Orion.Wait(100);
		}
	Orion.Terminate('TrainStealth');
	}

function TrainChivalry() 
	{
	var skillCap = 1100
	Orion.Exec('SkillGump', true, ['Chivalry', 'TrainChivalry']);
	var skillLevel = Orion.SkillValue('Chivalry');
    while(skillLevel < skillCap) 
      	{
      	skillLevel = Orion.SkillValue('Chivalry');
        if(skillLevel < 300) 
        	return Orion.Print('Train skill at an NPC first!');   	
        else if(skillLevel <= 450)
            Orion.Cast('Consecrate Weapon');
       	else if(skillLevel <= 600)
       		Orion.Cast('Divine Fury')
       	else if(skillLevel <= 700)
       		Orion.Cast('Enemy of One')
       	else if(skillLevel <= 900)
       		Orion.Cast('Holy Light')
       	else if(skillLevel < 1200) 
       		Orion.Cast('Noble Sacrifice')
       	WaitPingAdjusted(750);
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Chivalry Finished");
	Orion.CloseUO();
	}

function SkillGump(skill, scriptName)
	{
	var gumpSerial = 11001
	while(Orion.GumpExists('custom', gumpSerial))
		gumpSerial++
	var startValue = Orion.SkillValue(skill)
	var startTime = Orion.Now()
	while(true)
		{
		if(!Orion.ScriptRunning(scriptName))
			Orion.PauseScript('SkillGump');
		var currentValue = Orion.SkillValue(skill);
	    var sec = ((Orion.Now() - startTime)/1000).toFixed(0);
	    var min = Math.floor(sec/60);
	    var hour = Math.floor(min/60);
	    var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2)
	   
		var gump = Orion.CreateCustomGump(gumpSerial);
	    gump.Clear();
	    gump.AddResizepic(0, 0, 0xBB8, 150, 115);
	    gump.AddText(15, 10, "0",'Skill: ');
	    gump.AddText(60, 10, "0",skill);
	    gump.AddText(15, 30, "0",'Start: ');
	    gump.AddText(75, 30, "0",(startValue/10).toFixed(1));
	    gump.AddText(15, 45, "0",'Current: ');
	    gump.AddText(75, 45, "0",(currentValue/10).toFixed(1));
	    gump.AddText(15, 60, "0",'Gains: ');
	    gump.AddText(75, 60, "0",((currentValue - startValue)/10).toFixed(1));
	    gump.AddText(15, 75, "0",'Time: ');
	    gump.AddText(75, 75, "0", time);
	    gump.Update();
		Orion.Wait(1000);
		}
	}

function WaitPingAdjusted(ms)
    {
    var ping = Orion.GetPing('Average')
    if(ping > 200)
        ping = 200
    Orion.Wait(ms + ping);
    }
    
function GMJournalScan()
	{
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{	
				case 'GM':
					DiscordPush(Player.Name() + ': GM');
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all');
                    Orion.Wait(1000);
                    Orion.Step('n');
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);	
					//Orion.LogOut();		
					break;	
				default:
					break;
				}
			}
		}
	}

function DiscordPushAli(message)
	{ //private notification channel
	var bot = "https://discordapp.com/api/webhooks/"
	+ '887268637315047444' //hook
	+ "/"
	+ 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
	Orion.HttpPost(bot, "content=" + message);
	}
	
function DiscordPush(message)
	{ //private notification channel
	var bot = "https://discordapp.com/api/webhooks/"
	+ '941921319463841843' //hook
	+ "/"
	+ '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
	Orion.HttpPost(bot, "content=" + message);
	}