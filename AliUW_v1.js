//#include underworldpuzzle2.oajs
//v1.1

//Replace the names here with the names of your healers
var healerArr = ['Alyx','Beatrix','Couli','Daemont']
var enpointe = 'Iona'
var healLeader = 'Daemont'

function test()
	{
	Orion.Print(Player.Hits('%'));
	}

function Autostart()
	{
	Orion.Wait(2000);
	Orion.UseObject(backpack);
	Orion.ToggleScript('JournalScan');
	}

function initUWLeader()
	{
	Orion.SayGuild('initdrop');
	Orion.Wait(1100);
	var core = Orion.FindTypeEx('0x47E6', any, ground, '', 2);
	var flywheel = Orion.FindTypeEx('0x46FE', any, ground, '', 2);
	var bearing = Orion.FindTypeEx('0x0E74', any, ground, '', 2);
	var spool = Orion.FindTypeEx('0x4CDB', any, ground, '', 2);
	if(core[0])
		{
		Orion.DragItem(core[0].Serial())
		Orion.DropDraggedItem();
		Orion.Wait(1200);
		}
	if(flywheel[0])
		{
		Orion.DragItem(flywheel[0].Serial())
		Orion.DropDraggedItem();
		Orion.Wait(1200);
		}	
	if(bearing[0])
		{
		Orion.DragItem(bearing[0].Serial())
		Orion.DropDraggedItem();
		Orion.Wait(1200);
		}	
	if(spool[0])
		{
		Orion.DragItem(spool[0].Serial())
		Orion.DropDraggedItem();
		Orion.Wait(1200);
		}
	
	var corecheck = Orion.FindTypeEx('0x47E6');
	var flywheelcheck = Orion.FindTypeEx('0x46FE');
	var bearingcheck = Orion.FindTypeEx('0x0E74');
	var spoolcheck = Orion.FindTypeEx('0x4CDB');
	
	if(corecheck[0] && flywheelcheck[0] && bearingcheck[0] && spoolcheck[0])
		Orion.Wait(10);
	else
		{
		Orion.Print('Missing a component! Halting...')
		return;
		}
	if(Orion.WalkTo(6432, 1699, 0, 0))
		{
		var ladder = Orion.FindType(0x08A6, any, ground, '', 24);
		Orion.UseObject(ladder[0]);
	 	Orion.Wait(500);
	 	}
	if(Orion.WalkTo(6311, 1704, 0, 0))
		{
		WinchDrop();
		Orion.Wait(1000);
	 	}	
	if(Orion.WalkTo(6306, 1711, 0, 0))
		{
		Orion.SayGuild('inituw');
		Orion.Cast('Invisibility');
		Orion.Wait(3000);
		Orion.Step(128, true);
		Orion.Wait(1000);
		Orion.TargetObject(self);
		Orion.Wait(200);
		Orion.UseObject(self);
		Orion.Say('all kill');
		Orion.WaitForTarget(1000);
		var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
				{
				return (part.Properties().match(/Shadowlord/i))
				});
		Orion.TargetObject(lord[0].Serial());
		initUWMage();
	 	}
	}

function initUWBarrels()
	{
	UWBarrelsPosition();
	Orion.ToggleScript('UWBarrels', true);
	Orion.ToggleScript('UWBarrelsHealSelf', true);
	}

function initUWSamp()
	{
	Orion.ToggleScript('UWSamp', true);
	Orion.ToggleScript('UWSampAttackScimitar', true);
	}
	
function initUWMystic()
	{
	Orion.ToggleScript('UWMysticBot', true);
	Orion.ToggleScript('UWHealBotListen', true);
	}

function initUWMage()
	{
	Orion.ToggleScript('UWMageBot', true);
	Orion.ToggleScript('UWAvoidBot', true);
	}


//--#Barrels
function UWBarrelsPosition()
    {
    var sampArr = ['Ephie','Fiska','Grejt','Hejti'];
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var _pName = Player.Name().slice(5, Player.Name().length);
	else
		var _pName = Player.Name();
    var locArr =
        [
            [6426,1733],
            [6436,1733],
            [6426,1753],
            [6436,1753]
        ];
	var ind = sampArr.indexOf(_pName);
	Orion.WalkTo(locArr[ind][0], locArr[ind][1], 0, 0);
    }

function UWBarrelsHealSelf()
	{
	while(!Player.Dead()) 
		{
		while(Player.Hits()/Player.MaxHits() < .9 || Player.Poisoned())
			{
			if(!Orion.BuffExists('Healing Skill'))
				{
				var bandie = Orion.FindType('0x0E21')
				if(bandie[0])
					{
					Orion.UseObject(bandie[0]);
					Orion.WaitForTarget();
					Orion.TargetObject(self);
					}
				}
			Orion.Wait(250);
			if(!Orion.BuffExists('Confidence'))
				Orion.Cast('Confidence');
			}
        Orion.Wait(250);
		}
	}

function UWBarrelsHealSelf1()
	{
	while(!Player.Dead()) 
		{
		while(Player.Hits()/Player.MaxHits() < .9 || Player.Poisoned())
			{
			if(!Orion.BuffExists('Healing Skill'))
				Orion.BandageSelf();
			Orion.Wait(100);
			if(!Orion.BuffExists('Confidence'))
				Orion.Cast('Confidence');
			}
        Orion.Wait(250);
		}
	}

function UWBarrels()
 	{
 	Orion.IgnoreReset();
 	Orion.ClearFakeMapObjects();
 	var startPos = [Player.X(), Player.Y()];
 	var locker = Orion.FindTypeEx(0x285E, any, ground, 'near', 24);
 	var lockerX = locker[0].X();
 	var lockerY = locker[0].Y();
 	if(Player.X() > lockerX)
 		var x1 = lockerX + 4;
 	else
 		var x1 = lockerX - 4;
 	var y1 = lockerY;
 	var x2 = lockerX;
	var y2 = lockerY;
    var phase = 1;
    while (!Player.Dead()) 
    	{
    	var mobcheck = Orion.FindTypeEx('0x00D7|0x013D|0x005C|0x0018', '-1', 'ground', 'inlos', 10);
		while(mobcheck[0] && mobcheck[0].Exists())
			{
			if(mobcheck[0].Distance() > 1)
				Orion.WalkTo(mobcheck[0].X(), mobcheck[0].Y());
			else
				Orion.Attack(mobcheck[0].Serial());
			Orion.Wait(250);	
			}
		Orion.Wait(250);
		if(Player.Stam()/Player.MaxStam() < 1 && Player.Hits()/Player.MaxHits() > .8)
            {
            Orion.Cast('Divine Fury');
            Orion.Wait(1000);
            }
    	while(Player.Hits()/Player.MaxHits() < .8)
    		{
    		Orion.Wait(100);
    		}
		var key = Orion.FindTypeEx('0x410B', '-1', 'ground', 'fast', '10');
		if(key[0])
			{
			Orion.WalkTo(key[0].X(), key[0].Y());
			Orion.MoveItem(key[0].Serial());
			Orion.Wait(500);
			}
        var check = Orion.FindType('0x410B');
        if(check[0] && Orion.WalkTo(locker[0].X(),locker[0].Y()))
            {
            Orion.Wait(1100);
            Orion.UseObject(check[0]);
            Orion.Wait(500);
            Orion.WaitForTarget();
            Orion.TargetObject(locker[0].Serial());
            Orion.Wait(1000);
            Orion.Print(locker[0].Name() + ':' + locker[0].Properties());
            check = Orion.FindType('0x410B');
            if(!check[0])
                break;
            }
        switch(phase)    
            {
            case 1:
            	break;
            case 2:
                x1 = lockerX - 2;
                y1 = lockerY - 2;
                x2 = lockerX + 2;
                y2 = lockerY + 2;
                break;
            case 3:
                x1 = lockerX - 4;
                y1 = lockerY - 4;
                x2 = lockerX + 4;
                y2 = lockerY + 4;
                break;
            default:
                break;
            }
    	DrawRangeUW(x1,y1,x2,y2);
    	Orion.SetSearchArea(x1,y1,x2,y2);
	    var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, 'near', '24');
	    Orion.ResetSearchArea();
	    if(barrels[0])
	    	{
            if(barrels[0].Distance() > 1)
            	if(Orion.WalkTo(barrels[0].X(), barrels[0].Y(), 0))
               		Orion.Attack(barrels[0].Serial());
               	else
               		Orion.Ignore(barrels[0].Serial());
            else
                Orion.Attack(barrels[0].Serial());
	       	}
	    else
			{
			Orion.IgnoreReset();
			Orion.SetSearchArea(x1,y1,x2,y2);
		    var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, 'near', '24');
		    Orion.ResetSearchArea();
			Orion.ClearFakeMapObjects();
	    	if(!barrels[0] && phase < 3)
	    		phase++;
			}	    	
	    Orion.Wait(500);
	 	}
	Orion.Wait(1500);
	Orion.WalkTo(6432, 1699, 0, 0);
	}

function UWBarrels1()
 	{
 	Orion.IgnoreReset();
 	Orion.ClearFakeMapObjects();
 	var startPos = [Player.X(), Player.Y()];
 	var locker = Orion.FindTypeEx(0x285E, any, ground, 'near', 24);
 	var x1;
 	var y1;
 	var x2;
	var y2;
    var phase = 1;
    while (!Player.Dead()) 
    	{
    	var mobcheck = Orion.FindTypeEx('0x00D7|0x013D|0x005C|0x0018', '-1', 'ground', 'inlos', 10);
		while(mobcheck[0] && mobcheck[0].Exists())
			{
			if(mobcheck[0].Distance() > 1)
				Orion.WalkTo(mobcheck[0].X(), mobcheck[0].Y());
			else
				Orion.Attack(mobcheck[0].Serial());
			Orion.Wait(250);	
			}
		Orion.Wait(250);
		if(Player.Stam()/Player.MaxStam() < 1 && Player.Hits()/Player.MaxHits() > .8)
            {
            Orion.Cast('Divine Fury');
            Orion.Wait(1000);
            }
    	while(Player.Hits()/Player.MaxHits() < .8)
    		{
    		Orion.Wait(100);
    		}
		var key = Orion.FindTypeEx('0x410B', '-1', 'ground', 'fast', '10');
		if(key[0])
			{
			Orion.WalkTo(key[0].X(), key[0].Y());
			Orion.MoveItem(key[0].Serial());
			Orion.Wait(500);
			}
        var check = Orion.FindType('0x410B');
        if(check[0] && Orion.WalkTo(locker[0].X(),locker[0].Y()))
            {
            Orion.Wait(1100);
            Orion.UseObject(check[0]);
            Orion.Wait(500);
            Orion.WaitForTarget();
            Orion.TargetObject(locker[0].Serial());
            Orion.Wait(1000);
            Orion.Print(locker[0].Name() + ':' + locker[0].Properties());
            check = Orion.FindType('0x410B');
            if(!check[0])
                break;
            }
        switch(phase)    
            {
            case 1:
                x1 = Player.X();
                y1 = Player.Y();
                x2 = locker[0].X();
                y2 = locker[0].Y();
                break;
            case 2:
                x1 = locker[0].X() - 2;
                y1 = locker[0].Y() - 2;
                x2 = locker[0].X() + 2;
                y2 = locker[0].Y() + 2;
                break;
            case 3:
                x1 = locker[0].X() - 4;
                y1 = locker[0].Y() - 4;
                x2 = locker[0].X() + 4;
                y2 = locker[0].Y() + 4;
                break;
            default:
                break;
            }
    	DrawRangeUW(x1,y1,x2,y2);
    	Orion.SetSearchArea(x1,y1,x2,y2);
	    var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, 'near', '24');
	    Orion.ResetSearchArea();
	    if(barrels[0])
	    	{
            if(barrels[0].Distance() > 1)
            	if(Orion.WalkTo(barrels[0].X(), barrels[0].Y(), 0))
               		Orion.Attack(barrels[0].Serial());
               	else
               		Orion.Ignore(barrels[0].Serial());
            else
                Orion.Attack(barrels[0].Serial());
	       	}
	    else
			{
			Orion.IgnoreReset();
			Orion.SetSearchArea(x1,y1,x2,y2);
		    var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, 'near', '24');
		    Orion.ResetSearchArea();
			Orion.ClearFakeMapObjects();
	    	if(!barrels[0])
	    		phase++;
			}	    	
	    Orion.Wait(500);
	 	}
	Orion.Wait(1500);
	Orion.WalkTo(6432, 1699, 0, 0);
	}


//--#Samp
function UWSamp()
	{
	if(Orion.WalkTo(6432, 1699, 0, 0))
		{
		var ladder = Orion.FindType(0x08A6, any, ground, '', 24);
		Orion.UseObject(ladder[0]);
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6306, 1711, 0, 0))
		{
		Orion.Step(128, true);
	 	}

	Orion.Wait(500);
	Orion.Resend();
	Orion.Wait(500);
	while(!Player.Dead())
		{	
		var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
				{
				return (part.Properties().match(/Shadowlord/i))
				});
		var wisp = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
				{
				return (part.Properties().match(/wisp/i))
				});
		var corpse = Orion.FindTypeEx('0x2006', any, ground, '-1', 24).filter(function(part)
				{
				return (part.Properties().match(/Evil/i))
				});
	   	if(wisp[0])
			{
			wisp.forEach(function(part)
						{
						Orion.Attack(part.Serial());
						Orion.Wait(50);
						});
			if(wisp[0].Distance() > 0)
				Orion.WalkTo(wisp[0].X(),wisp[0].Y(), 0, 0);
			else
				Orion.Attack(wisp[0].Serial());
			}
	   	else if(lord[0])
			{
			if(lord[0].Distance() > 1)
				Orion.WalkTo(lord[0].X(),lord[0].Y(), 0, 1);
			else
				Orion.Attack(lord[0].Serial());
			}
		if(corpse[0])
    		{
    		Orion.Wait(500);   		
    		Orion.WalkTo(corpse[0].X(),corpse[0].Y());
    		ListLoot("BotLoot");
    		Orion.Wait(100);
            Orion.Terminate('all');
    		Orion.Wait(100);
    		break;
    		}		
        Orion.Wait(250);
		}
	}

function UWSampAttackScimitar()
	{
	var consecrate = true
	var divinefury = true
	var momentumstrike = true
	var primary = true
	var secondary = true	
	
	while (!Player.Dead()) 
    	{
    	if(Orion.BuffExists('Blood Oath'))
    		{
    		Orion.Cast('Remove Curse');
    		Orion.WaitForTarget(5000);
    		Orion.TargetObject(self);
    		}
         if(Player.Mana() > 20 && !Orion.BuffExists('Consecrate Weapon') && consecrate == true)
        	 {
           	Orion.Cast('Consecrate Weapon');
           	Orion.Wait(100);
            }
        if(Player.Mana() > 17 && !Orion.BuffExists('Divine Fury') && divinefury == true)
        	 {
           	Orion.Cast('Divine Fury');
           	Orion.Wait(100);
            }
        var enemies = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends", 2, 'gray|red|criminal|enemy');
        var enemyCount = enemies.length;
        if(enemyCount > 0)
        	{
            switch(enemyCount)
            	{
              	case 1:
                	if(!Orion.AbilityStatus('secondary') && Player.Mana() >= 25  && secondary == true) 
                        Orion.UseAbility('secondary');
                    Orion.Wait(10);
               		break;
             	case 2:
	             	if(!Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8  && momentumstrike == true) 
	                     Orion.Cast('Momentum Strike');
	            	Orion.Wait(10);
	                break;
              	default:
                	if(!Orion.AbilityStatus('primary') && Player.Mana() >= 15  && primary == true) 
                        Orion.UseAbility('primary');
                 	Orion.Wait(10)
                 	break;	
        		}
        	}
        Orion.Wait(500);
    	}
	}

//--#Healers
function UWHealLeader()
    {
    while(true)
        {
        var target = injuredCheck(.8)
        if(target)
            {
            var healer = healerArr.shift()
            healerArr.push(healer);
            Orion.TargetSystemSerial(target.Serial());
            Orion.SayGuild(healer + ':' + target.Serial())
            Orion.Wait(500);
            }
        Orion.Wait(100);
        }
    }
    
function UWHealBotListen()
	{
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var _pName = Player.Name().slice(5, Player.Name().length)
	else
		var _pName = Player.Name()
	while(true)
		{
		var listen = Orion.WaitJournal(_pName, Orion.Now(), 0);
		if(listen && listen.Color() == 0x03B2 && Orion.HaveTarget())
            {
            var listenArr = Orion.Split(listen.Text(), ':')
            if(Orion.GetDistance(listenArr[1]) > 9)
                {
                Orion.PauseScript('UWMysticBot')
                StayAway(listenArr[1], 6)     
                Orion.TargetObject(listenArr[1])
                Orion.ResumeScript('UWMysticBot')  
                }
            else
                {
                Orion.TargetObject(listenArr[1])
                }
            }
		Orion.Wait(10);
		}
	}

function UWMysticBot()
	{
	if(Orion.WalkTo(6432, 1699, 0, 0))
		{
		var ladder = Orion.FindType(0x08A6, any, ground, '', 24);
		Orion.UseObject(ladder[0]);
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6306, 1711, 0, 0))
		{
		Orion.Step(128, true);
	 	}

	Orion.Wait(500);
	Orion.Resend();
	Orion.Wait(500);
	while(!Player.Dead())
		{	
        Orion.Wait(50)
		var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
				{
				return (part.Properties().match(/Shadowlord/i))
				});
		var corpse = Orion.FindTypeEx('0x2006', any, ground, '-1', 24).filter(function(part)
				{
				return (part.Properties().match(/Evil/i))
				});
	   	if(lord[0])
			{
			StayAway(lord[0].Serial(), 5);
			}
		if(corpse[0])
    		{
    		//BotPush('Shadowlord Dead!');
    		Orion.Wait(Orion.Random(1,5) * 1000);   		
    		Orion.WalkTo(corpse[0].X(),corpse[0].Y());
    		ListLoot("BotLoot");
    		Orion.Wait(100);
            Orion.Terminate('all');
    		Orion.Wait(100);
    		break;
    		}		
		if(!Orion.HaveTarget() && !Player.Frozen())
			Orion.Cast("Cleansing Winds");
		}
	}


function UWAvoidBot()
	{
	if(Orion.WalkTo(6432, 1699, 0, 0))
		{
		var ladder = Orion.FindType(0x08A6, any, ground, '', 24);
		Orion.UseObject(ladder[0]);
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6306, 1711, 0, 0))
		{
		Orion.Step(128, true);
	 	}

	Orion.Wait(500);
	Orion.Resend();
	Orion.Wait(500);
	while(!Player.Dead())
		{	
        Orion.Wait(50)
		var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
				{
				return (part.Properties().match(/Shadowlord/i))
				});
		var corpse = Orion.FindTypeEx('0x2006', any, ground, '-1', 24).filter(function(part)
				{
				return (part.Properties().match(/Evil/i))
				});
	   	if(lord[0])
			{
			StayAway(lord[0].Serial(), 5);
			}
		if(corpse[0])
    		{
    		//BotPush('Shadowlord Dead!');
    		Orion.Wait(Orion.Random(1,5) * 1000);   		
    		Orion.WalkTo(corpse[0].X(),corpse[0].Y());
    		ListLoot("BotLoot");
    		Orion.Wait(100);
            Orion.Terminate('all');
    		Orion.Wait(100);
    		break;
    		}		
		}
	}
function UWMageBot()
    {
    //Asynchronous
    while(!Player.Dead())
        {
         if (!Orion.HaveTarget() && !Player.Frozen())
             Orion.Cast("Greater Heal");            
         var target = injuredCheck(.5);
         if(target)
             {        
             Orion.WaitForTarget(3000);
             Orion.TargetObject(target.Serial());
             }    
        Orion.Wait(200);
        }
    }


//--#Misc
function EquipSuitByBotName()
	{
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var _pName = Player.Name().slice(5, Player.Name().length);
	else
		var _pName = Player.Name()
	var setname = _pName + ' Luck Suit'
	Orion.Dress(setname);
	}

function EquipUWSuitByBotName()
	{
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var _pName = Player.Name().slice(5, Player.Name().length);
	else
		var _pName = Player.Name()
	var setname = _pName + ' UW Suit'
	Orion.Dress(setname);
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
				});
	if(Orion.WalkTo(body[0].X(), body[0].Y()))
		Orion.UseObject(body[0].Serial());
	}

function ResetPosition()
	{
	Orion.Terminate('all','ResetPosition|JournalScan');
	if(Orion.WalkTo(6432, 1633, 0, 0)) //uwboss area
		{
		var ladder = Orion.FindType(0x08A4, any, ground, ' ', 24);
		Orion.UseObject(ladder[0]);
		Orion.Wait(500);
		}
	if(Orion.WalkTo(6305, 1673, 0, 0)) //upper deck
		{
	 	var ladder = Orion.FindType(0x08A6, any, ground, ' ', 24);
	 	Orion.UseObject(ladder[0]);
	 	}
	 if(Orion.WalkTo(1700, 1636, 0, 0))//uw dock
		{
		var whirlpool = Orion.FindType(0x3789, any, ground, ' ', 24);
		Orion.UseObject(whirlpool[0]);
		Orion.Wait(1000);
		}
	 if(Orion.WalkTo(6321, 1711, 0, 0))//outside boat
		{
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6432, 1699, 0, 0))//below deck
		{
	 	Orion.Wait(10);
	 	}
	Orion.Exec('JournalScan', true);
	Orion.Wait(500);
	}

function LeaveUW()
	{
	if(Orion.WalkTo(6432, 1633, 0, 0))
		{
		var ladder = Orion.FindType(0x08A4, any, ground, ' ', 2);
		Orion.UseObject(ladder[0]);
		Orion.Wait(500);
		}
	if(Orion.WalkTo(6305, 1673, 0, 0))
		{
	 	ladder = Orion.FindType(0x08A6, any, ground, ' ', 2);
	 	Orion.UseObject(ladder[0]);
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6447, 1743, 0, 0))
		{
	 	Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(6279, 1772, 0, 0))
		{
	 	var rope = Orion.FindType(0x14FA, any, ground, ' ', 2);
		Orion.UseObject(rope[0]);
		Orion.Wait(500);
	 	}
	 if(Orion.WalkTo(1700, 1564, 0, 0))
		{
		Orion.Wait(10);
	 	}
	Orion.Wait(500);
	}

function LootUW()
    {
	ListLoot('BotLoot')
    //ListLoot('BotLoot', "ignorelist")
    }

function DropDraggedHere()
	{
	Orion.DropDraggedItemRelative(-1, 1);
	}

function LogOut()
	{
	Orion.LogOut();
	}

function JournalScan()
	{
	var msg = 'Greetings|GM|Are you there|Begin GM Chat|equipment is severely|inituw|initdrop'
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		var checkarr = Orion.Split(check.Text(), ' ')
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'GM':
				case 'Are':		
				case 'Begin':
					TextWindow.Open()
					TextWindow.Print(Player.Name() + ': GM');
					Orion.PlayWav('Alarm09.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Wait(1000);
					Orion.PauseScript('all');	
					break;	
				case 'severely':
					TextWindow.Open()
					TextWindow.Print(Player.Name() + ': Durability Low');
					Orion.PlayWav('Alarm.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					break;
				case  'inituw':
					if(check.Color() == 0x03B2)
						{
						if(Orion.Contains(Player.Name(), enpointe))
			            	Orion.Wait(10);
						else if(Orion.SkillValue('Swordsmanship') > 900)
							{
							Orion.Terminate('all', 'JournalScan');
            				initUWSamp();
			            	}
			            else if(Orion.SkillValue('Mysticism') > 900)
			            	initUWMystic();
			            else if(Orion.SkillValue('Magery') > 500)
			            	initUWMage();
			            if(Orion.Contains(Player.Name(), healLeader))
			            	Orion.Exec('UWHealLeader',true);
						}
					break;
				case  'initdrop':
					if(check.Color() == 0x03B2 && !Orion.Contains(Player.Name(), enpointe))
						ComponentDrop();
					break;
				default:
					break;
				}
			}
		}
	}


function OrganizeAllList()
	{
	OrganizeThisToThat('all', '0')
	}	

function ComponentDrop()
	{
	var core = Orion.FindTypeEx('0x47E6');
	var flywheel = Orion.FindTypeEx('0x46FE');
	var bearing = Orion.FindTypeEx('0x0E74');
	var spool = Orion.FindTypeEx('0x4CDB');
	if(core[0])
		{
		Orion.DragItem(core[0].Serial())
		Orion.DropDraggedItemRelative(1, 1);
		Orion.Wait(1100);
		}
	if(flywheel[0])
		{
		Orion.DragItem(flywheel[0].Serial())
		Orion.DropDraggedItemRelative(1, 1);
		Orion.Wait(1100);
		}	
	if(bearing[0])
		{
		Orion.DragItem(bearing[0].Serial())
		Orion.DropDraggedItemRelative(1, 1);
		Orion.Wait(1100);
		}	
	if(spool[0])
		{
		Orion.DragItem(spool[0].Serial())
		Orion.DropDraggedItemRelative(1, 1);
		Orion.Wait(1100);
		}
	}

function WinchDrop()
	{
	var core = Orion.FindTypeEx('0x47E6');
	var flywheel = Orion.FindTypeEx('0x46FE');
	var bearing = Orion.FindTypeEx('0x0E74');
	var spool = Orion.FindTypeEx('0x4CDB');
	var winch = Orion.FindTypeEx('0x280E', any, ground, '', 24);
	if(winch[0])
		Orion.WalkTo(winch[0].X(),winch[0].Y())
	if(core[0])
		{
		Orion.DragItem(core[0].Serial())
		Orion.DropDraggedItem(winch[0].Serial());
		Orion.Wait(1200);
		}
	if(flywheel[0])
		{
		Orion.DragItem(flywheel[0].Serial())
		Orion.DropDraggedItem(winch[0].Serial());
		Orion.Wait(1200);
		}	
	if(bearing[0])
		{
		Orion.DragItem(bearing[0].Serial())
		Orion.DropDraggedItem(winch[0].Serial());
		Orion.Wait(1200);
		}	
	if(spool[0])
		{
		Orion.DragItem(spool[0].Serial())
		Orion.DropDraggedItem(winch[0].Serial());
		Orion.Wait(1200);
		}
	var lever = Orion.FindTypeEx('0x108E|0x108C', any, ground, '',24);
	if(lever[0])
		{
		if(lever[0].Distance() > 2)
			Orion.WalkTo(lever[0].X(),lever[0].Y())
		Orion.UseObject(lever[0].Serial());
		}
	}
//--#Call Functions
function OrganizeFromList(frombag, tobag, listname, amount) {  //sub function for moving items around
	var item = Orion.FindList(listname, frombag);
	if ( item !== null ) {
		Orion.CharPrint('self', '906', 'moving items');
		for (var i = 0; i < item.length; i++) {
			Orion.MoveItem(item[i], amount, tobag);
			Orion.Wait(1100);
		}
	}
	else
		Orion.CharPrint('self', '906', 'item not found');
}


function OrganizeThisToThat(listname, amount) {
	Orion.RemoveObject('MoveFrom');
	Orion.RemoveObject('MoveTo');

	if (!Orion.FindObject('MoveFrom') ) {
		Orion.CharPrint('self', '906', 'select move from bag');
		Orion.AddObject('MoveFrom');
		while(Orion.HaveTarget())
			{
			Orion.Wait('50');
			}
		Orion.OpenContainer('MoveFrom');
		Orion.Wait(100);
		Orion.CloseGump('container', 'MoveFrom')
			//WaitForPlayerToTarget();
	}
	if (!Orion.FindObject('MoveTo') ) {
		Orion.CharPrint('self', '906', 'select move to bag');
		Orion.AddObject('MoveTo');
		while(Orion.HaveTarget())
			{
			Orion.Wait('50');
			}
		
		//WaitForPlayerToTarget();
	}
	if ( 'MoveFrom' !== null && 'MoveTo' !== null ) {
		OrganizeFromList( 'MoveFrom', 'MoveTo', listname, amount);
	}
}

function StayAway(targetId, distance) 
	{
  	if (Orion.ObjectExists(targetId)) 
  		{
    	var target = Orion.FindObject(targetId)
    	var x = target.X();
    	var y = target.Y();
    	var tiles =
      	Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
        	.filter(function (tile) 
        		{
        		//Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
        		//var players = Orion.FindType(any,any,ground,'live|human|ignoreself',24);
        		//Orion.ResetSearchArea();
          		return BorderEdge(x, y, tile, distance)// && players.length == 0;
        		})
        	.sort(function (t1, t2) 
        		{
          		return Orion.GetDistance(t1.X(), t1.Y()) - Orion.GetDistance(t2.X(), t2.Y())
        		});
    	var closest = tiles.shift()
    	Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0);
  		}
	}

function BorderEdge(x, y, p2, range) 
	{
  	return (x == (p2.X() - range))
    	|| (x == (p2.X() + range))
    	|| (y == (p2.Y() - range))
    	|| (y == (p2.Y() + range));
	}

function WalkTo(object, distance, timeMS, walking) 
	{
	if (distance == null) 
		{
    	distance = 1;
  		}
 	if (timeMS == null) 
  		{
    	timeMS = 30000;
  		}
  	if (walking == null) 
  		{
    	walking = 1;
  		}
  	return Orion.WalkTo(object.X(), object.Y(), object.Z(), distance, 255, walking, 1, timeMS);
	}

function injuredCheck(threshold)
	{
	var injurelist = Orion.FindTypeEx(any, any, ground, 'live', 20, 'blue|green').filter(function(part)
				{
				return ((part.Hits() / part.MaxHits()) < threshold)
				}).sort(function(a,b)
							{
							if(a.Hits() < b.Hits())
								return -1
							if(a.Hits() > b.Hits())
								return 1
							return 0
							});
    
    if(injurelist[0])
        return injurelist[0]
    else
        return false
    }

function DrawRangeUW(minX,minY,maxX,maxY)
	{
  	var range = [1];
  	range.forEach(function (distance)
  		{
    	Orion.GetTilesInRect('land', minX, minY, maxX, maxY).concat()
      		.forEach(function (tile) 
      			{
      			i = String(tile.X()) + String(tile.Y());
           		Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
				});
		});
	}

function ListLoot(findlist,ignorelist)  //v1
    {
    var list = Orion.FindTypeEx('0x2006', '-1', ground, '2').filter(function(part)
    		{
    		return (part.Properties().match(/Evil/i))
    		});
    if(list.length) 
        var corpse = list[0];
    else
        Orion.Print('no corpse found');
    if(corpse == null) 
        {
        Orion.ResetIgnoreList();
        Orion.IgnoreReset();        
        }
    else 
        {
        Orion.UseObject(corpse.Serial());
        Orion.Wait(1100);
        var instancedcorpse = Orion.FindObject(Orion.GetSerial(lastcontainer))
        var lootbag = Orion.FindObject(Orion.GetSerial(backpack));       
        if(ignorelist)
            Orion.UseIgnoreList(ignorelist);
        var lootlist = Orion.FindList(findlist, instancedcorpse.Serial())
        if(lootlist.length)
            {
            for(var i = 0;i<lootlist.length;i++) 
                {            
                if(Orion.GetDistance(corpse.Serial()) > 2)
                    break;
                var b = Orion.FindObject(lootlist[i]);
                Orion.Print(b.Name());
                Orion.MoveItem(lootlist[i], 0, lootbag.Serial());
                Orion.Wait(1100);
                }
            }    
        Orion.Ignore(corpse.Serial())       
        }
    }