//#include Master/VarietyFunctions.oajs
//#include Master/MonitorFunctions.oajs
//#include Master/CallFunctions.oajs
function TrainTracking()
	{
	while(true)
		{
		if(!Player.Hidden())
			{		
			Orion.UseSkill('Tracking');
			Orion.Wait(1000);
			}
		}
	}
	
function TrainAnimalLore()
	{
	Orion.WaitForAddObject('myTarget')
	var serial = Orion.GetSerial('myTarget');
	while(true)
		{
		Orion.UseSkill('Animal Lore');
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(serial);
		Orion.Wait(500);
		}
	}
function Catalogue()
    {
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20)
        .map(function(safe)
            {   
            var gump = Orion.GetGump(any);
            while(gump)
                {
                Orion.Print('Closing gump: ' + gump.ID());
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                gump = Orion.GetGump(any);
                }
            while(safe.Distance() > 2)
                {
                Orion.WalkTo(safe.X(),safe.Y())
                Orion.Wait(500);
                }
            while(!Orion.GumpExists((any,'0x000F3ED6')))
                {
                Orion.UseObject(safe.Serial());
                Orion.WaitForGump(1300);
                }
            var gump = Orion.GetGump(any, '0x000F3ED6');
            var textList = gump.TextList();
            var platBid = textList[0] || 0;
            var goldBid = textList[1] || 0;
            var platBuy = textList[2] || 0;
            var goldBuy = textList[3] || 0;
            Orion.SetSearchArea(safe.X(),safe.Y(),safe.X(),safe.Y())
            var items = Orion.FindTypeEx('0x0FF1',any,ground,'item',20)[0];
            var bookInd = items.filter(function(item){return item.Graphic() == '0x0FF1'})[0]
            var saleItem = items.filter(function(item){return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19')})[0]
            Orion.ResetSearchArea();
            if(bookInd)
                bookInd = +bookInd.Name();
            else
                bookInd = 'MissingIndex';
            if(saleItem)
                saleItem = saleItem.Properties();
            else
                saleItem = 'MissingItem';
            var outStr = bookInd + '\nBid: ' + platBid + 'p ' + goldBid + 'gp\n' + 'B/O: ' + platBuy + 'p ' + goldBuy + 'gp\n' + saleItem + '\n'
            return [bookInd, outStr]
            })
        .sort(function(a,b)
            {
            return a[0] - b[0];
            });
    TextWindow.Open();
    safes.forEach(function(safe)
        {
        TextWindow.Print(safe[1])
        });
    }

function drrar()
	{
	Orion.DropDraggedItemRelative(1,1)
	}

function OpenBook()
	{
	Orion.SetSearchArea(Player.X()+1,Player.Y()+1,Player.X()+1,Player.Y()+1)
	var book = Orion.FindType('0x0FF1',any,ground)[0];
	if(book)
		{
		Orion.UseObject(book);
		}
	}

function LowerBooks()
	{
	Orion.ResetSearchArea()
	var book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
		{
		return item.Z() != 12;
		})[0];
	while(book)
		{
		if(Orion.WaitForTarget(1000))
			Orion.TargetObject(book.Serial());
		Orion.Wait(10);
		book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
			{
			return item.Z() != 12;
			})[0];
		}
	}

function TrainingRegimen2()
	{
	Orion.ToggleScript('JournalScan');
	Orion.ToggleScript('TrainMagery');
	}
function TrainingRegimen1()
	{
	Orion.ToggleScript('JournalScan');
	Orion.ToggleScript('TrainHiding');
	Orion.ToggleScript('TrainMagery');
	}
function TrainingRegimen3()
	{
	Orion.Exec('JournalScan');
	Orion.Exec('TrainMagery');
	Orion.Wait(100);
	Orion.Exec('TrainPeacemaking');
	}
function TrainingRegimen4()
	{
	Orion.Exec('JournalScan');
	Orion.Exec('TrainMagery');
	}

function PlayerAlert()
	{
	var mem = 60000; // how long to remember a player in ms
	var ali;
	var s;
	var t = [];
	var o = [];
	var r = [];
	Orion.IgnoreReset();
	while (true)
		{
		ali = Orion.FindType('-1', '-1', ground, 'human|ignoreself', 24, 'blue|gray|orange|red|ignorefriends|criminal');
		s = 0
		while (!ali.length)
			{
			Orion.Wait(250);
			s = s + .25;	
			ali = Orion.FindType('-1', '-1', ground, 'human|ignoreself', 24, 'blue|gray|orange|red|ignorefriends|criminal');
			if  (s % 1 == 0)
				{
				Orion.Print(t)
				if (o[0] && o[0][1] < Orion.Now())
					{
					Orion.Ignore(o[0][0], false)
					t.shift();
					o.shift();
					r.shift();
					}
				}
			if (s % 60 == 0)
				{
				Orion.OpenContainer('backpack'); //opens backpack once per minute to keep character logged in
				}
			}
		Orion.Wait(10);
		ali = Orion.FindTypeEx('-1', '-1', ground, 'human|ignoreself', 24, 'blue|gray|orange|red|ignorefriends|criminal');
		if (ali.length)
			{
			for (var i = 0; i < ali.length; i++)
				{
				Orion.Wait(10);
				if (r.indexOf(ali[i].Serial()) === -1)
					{
					t.push(' ' + ali[i].Name())
					o.push([ali[i].Serial(), Orion.Now() + mem])
					r.push(ali[i].Serial())
					BotPush('Player(s) Detected:' + t);
					Orion.Ignore(ali[i].Serial())			
					}
				Orion.Wait(10);
				}
			}
		Orion.Wait(10);
		}
	}


function Healing() 
	{
	Orion.Print("Target the friend you'd like to heal");
    Orion.WaitForAddObject('myTarget');
    var target = Orion.FindObject('myTarget');
    while (!Player.Dead()) 
    	{
         if(target && !Orion.BuffExists('healing skill') && target.Distance() <= 2 && (target.Poisoned() || target.Hits() < target.MaxHits()))
         	{
         	Orion.BandageTarget('myTarget');
            Orion.AddDisplayTimer('bandageFriend', Orion.BuffTimeRemaining('healing skill'), 'Top', 'Circle', 'HealFriend', 0, 0, 'any', -1, '0x0000FFFE');
            Orion.DisplayTimerSetIcon('bandageFriend', 'Top', '0x0E21');
         	}
    	Orion.Wait(500);
    	}
	}



//--#Magic




function TrainBushidoPhase1() 
	{
	Orion.SetArm('TrainingWeapon');
	var skillLevel = Orion.SkillValue('Bushido');
    while (skillLevel < 750) 
      	{
      	Orion.Wait(500);
      	skillLevel = Orion.SkillValue('Bushido');
        if (Player.Mana() < 20) 
        	{
            Meditate();
            Orion.Arm('TrainingWeapon');
            }
        if (skillLevel < 300) 
        	{
        	Orion.Print('Train skill at an NPC first!');
        	break;
        	}
        if (skillLevel >= 300 && skillLevel <= 600)
        	{
            Orion.Cast('Confidence');
            Orion.Wait(300);
        	}
       	if (skillLevel > 600 && skillLevel <= 750) 
       		{
       		Orion.Cast('Counter Attack')
       		Orion.Wait(500);
       		}
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() +  ": Bushido Phase 1 Finished");
	}

function TrainBushidoPhase2()
	{
	var starttime
	var trainingTarget1 = SelectTarget(' first training target').Serial();
	var trainingTarget2 = SelectTarget(' second training target').Serial();
	while (!Player.Dead())
		{
		starttime = Orion.Now();
    	Orion.Wait(200);
		if (Player.Mana() > 15 && !Orion.BuffExists('Momentum Strike'))
    		{
       		Orion.Cast('Momentum Strike');
        	Orion.Wait(100);
        	} 
        Orion.Wait(200);
        if (Orion.InJournal('There are no valid', 'normal', 0, any, starttime, (Orion.Now()+3000)) != null)
			{
			Orion.Wait(200);
			Orion.Attack(trainingTarget1);
			Orion.Wait(200);
			Orion.Attack(trainingTarget2);
			Orion.Wait(200);
			}	
        }
	}

function TrainChivalry() 
	{
	var skillLevel = Orion.SkillValue('Chivalry');
	var skillCap = 1000
    while (skillLevel < skillCap) 
      	{
      	Orion.Wait(500);
      	skillLevel = Orion.SkillValue('Chivalry');
        if (skillLevel < 300) 
        	{
        	Orion.Print('Train skill at an NPC first!');
        	break;
        	}
        if (skillLevel >= 300 && skillLevel <= 450)
        	{
            Orion.Cast('Consecrate Weapon');
            Orion.Wait(300);
        	}
       	if (skillLevel > 450 && skillLevel <= 600) 
       		{
       		Orion.Cast('Divine Fury')
       		Orion.Wait(500);
       		}
       	if (skillLevel > 600 && skillLevel <= 700) 
       		{
       		Orion.Cast('Enemy of One')
       		Orion.Wait(500);
       		}
       	if (skillLevel > 700 && skillLevel <= 900) 
       		{
       		Orion.Cast('Holy Light')
       		Orion.Wait(750);
       		}
       	if (skillLevel > 900 && skillLevel < 1200) 
       		{
       		Orion.Cast('Noble Sacrifice')
       		Orion.Wait(500);
       		}
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Chivalry Finished");    	
	}

function TrainEvalResist()
	{
	while (!Player.Dead())
		{
		if (Player.Mana() < 20) 
		     	{
		         Meditate();
		         }
		 Orion.Cast('Weaken', self);
		 Orion.Wait(800);
		 Orion.Cast('Feeblemind', self);
		 Orion.Wait(800);
		 Orion.Cast('Clumsy', self);
		 Orion.Wait(800);	 
		}
	}

function TrainMagery() 
	{
	var skillCap = 1100; //set to your target skill level. 1000 = 100.0
	Orion.Exec('SkillGump', false, ['Magery']);
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
       	WaitPingAdjusted(500);  	
        }
  	TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Magery Finished");
	}

function TrainMysticism() 
	{
	var skillLevel = Orion.SkillValue('Mysticism','real');
	var skillCap = 1150
    while(skillLevel < skillCap) 
      	{
      	Orion.Wait(500);
      	skillLevel = Orion.SkillValue('Mysticism','real');
        if(Player.Mana() < 30) 
        	{
            while(Player.Mana() < Player.MaxMana()) 
                {
                if(!Orion.BuffExists('Meditation')) 
                    Orion.UseSkill('Meditation');
                Orion.Wait(1500);
                }
            }
        if(skillLevel < 300)
        	return Orion.Print('Train skill at an NPC first!');
        else if(skillLevel <= 630)
        	{
            Orion.Cast('Stone Form');
            Orion.Wait(1000);
        	}
       	else if(skillLevel <= 800) 
       		{
       		while(Orion.BuffExists('Stone Form'))
        		{
        		Orion.Cast('Stone Form');
				Orion.Wait(1500)
        		}
       		Orion.Cast('Cleansing Winds', self);
       		Orion.Wait(1600);
       		}
       	else if(skillLevel <= 950) 
       		{
       		Orion.Cast('Hail Storm', self);
       		Orion.Wait(1700);
       		}
       	else if(skillLevel <= 1200) 
       		{
       		Orion.Cast('Nether Cyclone', self);
       		Orion.Wait(1700);
       		}
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() +  ": Mysticism Finished");
	}

function TrainNecro() 
	{
    var skillLevel = Orion.SkillValue('Necromancy');
    //var trainingTarget = SelectTarget().Serial();
    while (Orion.SkillValue('Necromancy') < 1001) 
    	{
        Orion.Wait(500)
        skillLevel =210// Orion.SkillValue('Necromancy');
        if (Player.Mana() < 20)
        	{
        	Meditate();
        	}
        if (skillLevel < 200)
        	{
        	Orion.Print('Train skill at an NPC first!');
        	break;
        	}
        else if (skillLevel >= 200 && skillLevel <= 350) 
        	{
           	Orion.Cast('Curse Weapon');
			Orion.Wait(250);
        	}
        else if (skillLevel > 350 && skillLevel <= 500 && Player.Hits() > 30)
        	{
            Orion.Cast('Pain Spike', self);
            Orion.Wait(500);
            }
		else if (skillLevel > 500 && skillLevel <= 700)
        	{
            Orion.Cast('Horrific Beast');
			Orion.Wait(1500);
	       	}
        else if (skillLevel > 700 && skillLevel <= 900) 
        	{
        	while (Orion.BuffExists('Horrific Beast'))
        		{
        		Orion.Cast('Horrific Beast');
				Orion.Wait(1500)
        		}
            Orion.Cast('Wither');
            Orion.Wait(750);
        	}
        else if (skillLevel > 900) 
        	{
            Orion.Cast('Lich Form', self);
            Orion.Wait(1500);
        	}
        }  
	if (skillLevel >= 1000)
		{
		while (Orion.BuffExists('Lich Form'))
			{
            Orion.Cast('Lich Form', self);
            Orion.Wait(1500);			
			}
		TextWindow.Open()
		TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() +  ": Necromancy Finished")
		}
	}



	
//--#Thieving
function TrainStealing()
	{
	Orion.CancelWaitTarget()
	Orion.Print('Target your pack animal')
	Orion.WaitForAddObject('stealingpacky')
	var packy = Orion.FindObject('stealingpacky')
	Orion.OpenContainer(packy.Serial())
	var container = Orion.GetSerial(lastcontainer);
	Orion.Wait(1100);
	
	while(!Player.Dead() && Orion.SkillValue('Stealing') < 1200)
		{
		Orion.PauseScript('all','TrainStealing|JournalScan')
		Orion.Wait(300);
		var stackcount = Math.floor((Orion.SkillValue('Stealing') / 100)) * 150
		var items = Orion.FindType(0x0EED)
		Orion.MoveItem(items[0], stackcount, packy.Serial());
		Orion.Wait(500);
		var target = Orion.FindType(0x0EED, any, container)
		Orion.AddWaitTargetObject(target[0])
		Orion.UseSkill('Stealing')
		Orion.Wait(600);
		Orion.CancelWaitTarget()
		target = Orion.FindType(0x0EED, any, container)
		if(target.length)
			Orion.MoveItem(target[0], 0, backpack)
		var consolidate = Orion.FindType(0x0EED)
		var t = 0
		while(consolidate.length > 1)
			{
			Orion.MoveItem(consolidate[0], 0, backpack)
			Orion.Wait(1100);
			t++
			consolidate = Orion.FindType(0x0EED)
			}
		Orion.ResumeScript('all','TrainStealing|JournalScan')
		Orion.Wait(10000 - t * 1000);
		}
	Orion.LogOut();
	}

function TrainStealth()
	{	
	var cycle = Orion.Now()
	Orion.Exec('SkillGump', false, ['Stealth']);
	while(!Player.Dead())
		{
		Orion.UseType('0x0F6C', '0xFFFF', 'ground');
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
				{
				var gumpHook0 = Orion.CreateGumpHook(1);
				gumpHook0.AddCheck(7, true);
				gump0.Select(gumpHook0);
				}
			}
		Orion.Wait(500);
		Orion.Step(1, false);
		Orion.Wait(300);
		Orion.SayWhisper('`');
		Orion.Wait(300);
		if(Orion.Now() > cycle + 12000)
			{
			Orion.UseSkill('21');
			cycle = Orion.Now();
			}
		Orion.Wait(500);
		Orion.Step(5, false);
		Orion.Wait(500);
		Orion.UseType('0x0F6C', '0xFFFF', 'ground');
		if (Orion.WaitForGump(1000))
			{
			var gump1 = Orion.GetGump('last');
			if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00000258'))
				{
					var gumpHook1 = Orion.CreateGumpHook(1);
					gumpHook1.AddCheck(8, true);
					gump1.Select(gumpHook1);
				}
			}
		Orion.Wait(500);
		Orion.Step(1, false);
		Orion.Wait(300);
		Orion.SayWhisper('`');
		Orion.Wait(300);
		if(Orion.Now() > cycle + 12000)
			{
			Orion.UseSkill('21');
			cycle = Orion.Now();
			}
		Orion.Wait(500);
		Orion.Step(5, false);
		Orion.Wait(500);
		}
	}

function TrainHiding()
	{
	while(!Player.Dead())
		{
		Orion.PauseScript('all', 'TrainHiding|JournalScan');
		Orion.Wait(2000);
		Orion.CancelTarget();		
		if (!Orion.BuffExists('Meditation') && Player.Mana() > 50)
			{
			Orion.UseSkill('Hiding');
			}
		Orion.ResumeScript('all')		
		Orion.Wait(9000);
		}
	}

//--#Bard
function TrainMusic()
	{
	Orion.Exec('SkillGump', false, ['Musicianship'])
	while(!Player.Dead() && Orion.SkillValue('Musicianship') < 1000)
		{
		var instrument = Orion.FindType('0x0E9D|0x0EB4')
		if(instrument[0])
			Orion.UseObject(instrument[0])
		else
			Orion.Print('No instruments found');
		Orion.Wait(1100);
		}
	TextWindow.Open()
	TextWindow.Print('skill done');
	//Orion.LogOut();
	}

function TrainDiscordance()
    {
    var target
    Orion.Exec('SkillGump', false, ['Discordance'])
    while(!Player.Dead())
        { 
        //SkillGump('Discordance', startValue, startTime);
        var discordSkill = Orion.SkillValue('Discordance');
        if(discordSkill <= 420)
        	target = 0x00D5 //polar bears
        if(discordSkill > 420 && discordSkill <= 500)
        	target = 0x00D4 //grizzly bears
        if(discordSkill > 500 && discordSkill <= 650)
        	target = 0x00F8 //gaman
        if(discordSkill > 650 && discordSkill <= 900)
        	target = 0x02CB //ruddy boura
        if(discordSkill > 900 && discordSkill <= 1000)
        	target = 0x0115 //cu sidhe
        if(discordSkill <= 1000)
        	{
	        var targets = Orion.FindType(target, any, ground, 'mobile', 24);
	        Orion.Print('Valid Targets: ' + targets.length);
	        for(var i=0;i<targets.length;i++)
	            {
	            //SkillGump('Discordance', startValue, startTime);
	            if(Orion.HaveTarget())
	            	Orion.CancelTarget();
	            Orion.Print(i);
	            Orion.UseSkill('Discordance');
	            Orion.Wait(200);
	            Orion.WaitForTarget(2000);
	            if(Orion.InJournal('instrument shall you', ' ', 0, any, Orion.Now() - 3000, Orion.Now() + 3000))
	                {
	                var a = Orion.FindType(0x0E9D)
	                Orion.TargetObject(a[0])
	                Orion.WaitForTarget(2000);
	                Orion.TargetObject(targets[i])
	                }
	            else
	                Orion.TargetObject(targets[i]);
	            Orion.Wait(200);
	            if(Orion.InJournal('You attempt to disrupt your target, but fail.', ' ', 0, any, Orion.Now() - 3000, Orion.Now() + 3000))
	                i--
	            if(i < targets.length - 1)
	                Orion.Wait(11000);
	            }
	        if(Orion.SkillValue('Hiding') >= 1000)
	        	{
	        	Orion.Wait(11000);
	        	Orion.UseSkill('Hiding');
	        	}
	        else
	        	{
		        Orion.Cast('Invisibility')
		        Orion.WaitForTarget(5000);
		        Orion.TargetObject(self);
	        	}
	        Orion.Wait(16000);    	
	        }
	    if(discordSkill > 1000)
	    	{
	    	 if(Orion.HaveTarget())
	            	Orion.CancelTarget();
            Orion.UseSkill('Discordance');
            Orion.Wait(200);
            Orion.WaitForTarget(2000);
            if(Orion.InJournal('instrument shall you', ' ', 0, any, Orion.Now() - 3000, Orion.Now() + 3000))
                {
                var a = Orion.FindType(0x0E9D)
                Orion.TargetObject(a[0])
                Orion.WaitForTarget(2000);
	            Orion.TargetObject(self)
                }
            else
                Orion.TargetObject(self);
            Orion.Wait(200);
            if(Orion.InJournal('You attempt to disrupt your target, but fail.', ' ', 0, any, Orion.Now() - 3000, Orion.Now() + 3000))
	        	var wait = 6000
	        else
	        	var wait = 9000
            Orion.Wait(wait);
	    	}
        }
    }

function TrainPeacemaking()
	{
	Orion.Exec('SkillGump', false, ['Peacemaking'])
	while(!Player.Dead())
		{
		Orion.PauseScript('all', 'TrainPeacemaking|SkillGump|JournalScan');
		Orion.Wait(2000);
		if(Orion.HaveTarget())
	    	Orion.CancelTarget();		
		if (!Orion.BuffExists('Meditation') && Player.Mana() > 50)
			{
			Orion.UseSkill('Peacemaking');
			Orion.Wait(200);
			Orion.WaitForTarget(1000);
			if(Orion.InJournal('instrument shall you', ' ', 0, any, Orion.Now() - 3000, Orion.Now() + 3000))
				{
				var a = Orion.FindType(0x0E9D)
				Orion.TargetObject(a[0])
				Orion.WaitForTarget(1000);
				Orion.TargetObject(self);
				}
			else
				Orion.TargetObject(self);
			}
		Orion.ResumeScript('all')		
		Orion.Wait(8000);
		}
	}
	
//--#Utility and Calls
function KarmaUp()
	{
	var blesstar = SelectTarget()
	while(!Player.Dead())
		//{

		//var fulllist = Orion.FindType("-1", "-1", 'ground', "live|ignoreself|inlos", '10', "blue|green");
  		//for (var i = 0; i < fulllist.length; i++)
			{
			//Orion.GetStatus(fulllist[i]);
			Orion.Cast('Bless');
			Orion.WaitForTarget(2000)
			Orion.TargetObject(blesstar.Serial())
			Orion.Wait(1000);
		  	}
		//Orion.Wait(100);
		//}
	}

function AdjustStats()
	{
	var strcap = 125
	var dexcap = 90
	var intcap = 125
	Orion.SetSkillStatus('Magery', 'Up');
	Orion.SetSkillStatus('Resisting Spells', 'Up');
	Orion.SetSkillStatus('Focus', 'Up');
	Orion.SetSkillStatus('Meditation', 'Up');
	Orion.SetSkillStatus('Evaluating Intelligence', 'Up');
	if(Player.Str() < strcap)
		Orion.SetStatStatus('str', 'Up');
	else if(Player.Str() > strcap)
		Orion.SetStatStatus('str', 'Down');
	else
		Orion.SetStatStatus('str', 'Lock');
	
	if(Player.Dex() < dexcap)
		Orion.SetStatStatus('dex', 'Up');
	else if(Player.Dex() > dexcap)
		Orion.SetStatStatus('dex', 'Down');
	else
		Orion.SetStatStatus('dex', 'Lock');
		
	if(Player.Int() < intcap)
		Orion.SetStatStatus('int', 'Up');
	else if(Player.Int() > intcap)
		Orion.SetStatStatus('int', 'Down');
	else
		Orion.SetStatStatus('int', 'Lock');
	
	while(Player.Str() < strcap)
		{
		Orion.Cast('Feeblemind');
		Orion.WaitForTarget(2000);
		Orion.TargetObject(self);
 		Orion.Wait(200);
		}
	Orion.SetStatStatus('str', 'Lock');
	
	while(Player.Dex() < dexcap)
		{
 		Orion.Cast('Weaken');
		Orion.WaitForTarget(2000);
		Orion.TargetObject(self);
 		Orion.Wait(200);
		}
	Orion.SetStatStatus('dex', 'Lock');
	
	while(Player.Int() < intcap)
		{
 		Orion.Cast('Weaken');
		Orion.WaitForTarget(2000);
		Orion.TargetObject(self);
 		Orion.Wait(200);
		}
	Orion.SetStatStatus('int', 'Lock');
	
	Orion.SetSkillStatus('Magery', 'Lock');
	Orion.SetSkillStatus('Resisting Spells', 'Lock');
	Orion.SetSkillStatus('Focus', 'Lock');
	Orion.SetSkillStatus('Meditation', 'Lock');
	Orion.SetSkillStatus('Evaluating Intelligence', 'Lock');					
	}

function skillgumptest()
	{
	var gumpSerial = 11001
	while(Orion.GumpExists('custom', gumpSerial))
		gumpSerial++

	var gump = Orion.CreateCustomGump(gumpSerial);
	    gump.Clear()
	    //gump.SetX(-10);
	    //gump.SetY(130);
	    gump.AddResizepic(0, 0, 0x13BE, 150, 115);
	    //gump.Close();
	    gump.Update();
	//var startValue = Orion.SkillValue('Hiding')
	//var startTime = Orion.Now()
	//while(true)
		//{
		
		//SkillGump('Hiding', startValue, startTime);
		//Orion.Wait(400);
		//}
	}
function SkillGump(skill, scriptName)
	{
	if(!scriptName)
		scriptName = 'Train' + skill;
	var gumpSerial = 11001;
	while(Orion.GumpExists('custom', gumpSerial))
		gumpSerial++;
	var startValue = Orion.SkillValue(skill);
	var startTime = Orion.Now();
	while(true)
		{
		if(!Orion.ScriptRunning(scriptName))
			Orion.PauseScript('SkillGump');
		var currentValue = Orion.SkillValue(skill);
	    var sec = ((Orion.Now() - startTime)/1000).toFixed(0);
	    var min = Math.floor(sec/60);
	    var hour = Math.floor(min/60);
	    var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2);
	   
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
function SkillGump2(skill)
	{
	var gumpSerial = 11001
	while(Orion.GumpExists('custom', gumpSerial))
		gumpSerial++
	var startValue = Orion.SkillValue(skill)
	var startTime = Orion.Now()
	while(true)
		{
		var currentValue = Orion.SkillValue(skill);
	    
	    var sec = ((Orion.Now() - startTime)/1000).toFixed(0);
	    var min = Math.floor(sec/60);
	    var hour = Math.floor(min/60);
	    var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2)
	   
		var gump = Orion.CreateCustomGump(gumpSerial);
	    gump.Clear();
	    //gump.SetX(-10);
	    //gump.SetY(130);
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

function SkillGumpCall(skill, startValue, startTime)
	{
	var currentValue = Orion.SkillValue(skill)
    
    var sec = ((Orion.Now() - startTime)/1000).toFixed(0)
    var min = Math.floor(sec/60);
    var hour = Math.floor(min/60);
    var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2);
    
	var gump = Orion.CreateCustomGump(11001);
	gump.Clear();
    gump.SetX(-10);
    gump.SetY(130);
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
    gump.AddText(75, 75, "0", time)     //((Orion.Now() - startTime)/1000).toFixed(0));
    gump.Update();
	}

function Meditate() 
	{
	while (Player.Mana() < Player.MaxMana()) 
		{
		Orion.Wait(1500);
		if (!Orion.BuffExists('Meditation')) 
			{
			Orion.UseSkill('Meditation');
			}
		}
	Orion.Wait(1000);
	}

function StayLoggedIn()
	{
	while (true)
		{
		Orion.OpenContainer('backpack');
		Orion.Wait(60000);
		}
	}

function SelectTarget(itemUsage) {
  if (itemUsage != null) {
    Orion.Print("Select your" + itemUsage);
  }
  Orion.WaitForAddObject('myTarget');
  Orion.TargetObject('myTarget');
  var target = Orion.FindObject('myTarget');
  return target;
}

//Create discordkey2.conf in "Orion Launcher" folder
//First Word 1  = Discord hook ID
//single space
//Second Word 2 = API key
var hook;
var key;
function BotPush(message) 
	{
    if (hook == null && key == null) 
    	{
        var file = Orion.NewFile();
        open = file.Open('discordkey2.conf');
        if (!file.Opened()) 
        	{
            return;
        	}
        hook = file.Read();
        key = file.Read();
        file.Close();
    }
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var paramText = "content=" + message;
    Orion.HttpPost(bot, paramText);
}

function WaitPingAdjusted(ms)
    {
    var ping = Orion.GetPing('Average')
    if(ping == 9999)
        ping = 200
    Orion.Wait(ms + ping);
    }