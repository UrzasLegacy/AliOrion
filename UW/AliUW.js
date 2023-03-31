//#include Ali/AliUWComs.js
//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliGumpHUD.js

var leaderSerial = '0x01DD7DAE'; //Apollo

var profiles = 
	{
	Underwater: 
		{
		useGatherMobs: true, //boolean. Set to true to attack all mobs in the area to gather them towards you.
		useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
			singleTargetSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
		useMultiTargetSpecial: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
			multiTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
		useMomentumStrike: false, //boolean. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
		useCounterAttack: false, //boolean. Set to true to maintain Counter Attack at all times.
		useEnemyOfOne: false, //boolean. Set to true to maintain Enemy Of One at all times. Careful using this! It's not smart enough to change enemies.
		useConsecrateWeapon: true, //boolean. Set to true to maintain Consecrate Weapon at all times.
		useDivineFury: true, //boolean, Set to true to maintain Divine Fury at all times.
		useConfidence: false, //boolean. Set to true to use Confidence when HP drops below a percentage threshold defined below.
			useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
		useBandieSelf: true, //boolean. Set to true to heal self with bandage when HP drops below a percentage threshold defined below.
			useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
		useBandieOthers: true, //boolean. Will preferentially heal others over self if BandieSelf and BandieOthers are both on.
			useBandieOtherThresholdPercent: 60, //Percentage of other's HP to attempt to use bandage on others
		}
	}
var profile = profiles.Underwater;
Orion.Exec('JournalScan', true);

var defaultAssets = 
[
    // [ ['toggle','Example1Function','Example1','0x2c88|0x2c89|0x2c8A','0x2c92|0x2c93|0x2c94', 6, 6], ['toggle','Example3Function','Three'], ['toggle','Example4Function','4'] ],
    // [ ['toggle','Example2Function','ExampleTwo'],['ySpacer',10] ],
    [ ['text','Leader:',554,1,1],['text',Shared.GetVar('leaderName','Unknown'),554,1,1] ],
    [ ['textInput','Ignore Mobs'],['horizontalLine',30,0,0,'#FF660066',2],['verticalLine',30,0,0,'#FF660066',10] ],
    [ ['comboBox', 'Single Target', 'Primary', 'Secondary'], ['comboBox', 'Two Targets', 'Primary', 'Secondary'], ['comboBox', 'Multi Target', 'Primary', 'Secondary']],
    [ ['xSpacer', 330],['button','ClearAll',20,0,2,'0x2EE3|0x2EE3|0x2EE4'] ]
];

function Autostart()
	{
	Orion.Wait(2000);
	VerifyOpenContainer(backpack);
	if(Player.Serial() == leaderSerial)
        Orion.Exec('AliComLeader',true);
    else
        Orion.Exec('AliComFollower',true);
	}

function TerminateScripts()
	{
	Orion.Terminate('all','JournalScan')
	}

//--#Inits
function ________________________INITS(_){}

function SmartStart()
	{
	var role = Shared.GetVar('myRole','misc');
	switch(role)
		{
		case 'leader':
			UWLeaderStartup();
			break
		case 'dexxer':
			UWSampStartup();
			break;
		case 'healer':
			UWHealerStartup();
			break;
		case 'misc':
			initMisc();
			break;
		default:
			break;
		}
	}

function initUWLeader()
	{
	if(UWSetup)
		UWLeaderStartup();
	Orion.Exec('AliComLeader',true);
	Orion.Exec('SingleMageHealBot', true);
	Orion.Exec('UWAvoidBot', true, [8]);
	}

function initUWBarrels()
	{
	//if(UWSetup)
		//UWBarrelsStartup();
	Orion.Exec('UWBarrels', true);
	Orion.Exec('UWBarrelsHealSelf', true);
	}

function initUWArcher()
	{
	if(UWSetup)
		UWArcherStartup();
	Orion.Exec('AutoAttackArcher', true);
	Orion.Exec('AutoBuffs', true);
	Orion.Exec('BandieBot', true);
	Orion.Exec('AliComFollower', true);
	Orion.Exec('UWAvoidBot', true, [5]);
	}
	
function initUWSamp()
	{
	if(UWSetup)
		UWSampStartup();
	Orion.Exec('UWSamp', true);
	Orion.Exec('AutoAttack', true);
	}

function initUWMystic()
	{
	if(UWSetup)
		UWHealerStartup();
	Orion.Exec('UWMysticBot', true);
	Orion.Exec('UWHealBotListen', true);
	Orion.Exec('UWAvoidBot', true, [8]);
	}

function initUWMage()
	{
	if(UWSetup)
		UWHealerStartup();
	Orion.Exec('SingleMageHealBot', true);
	Orion.Exec('UWAvoidBot', true, [8]);
	}

//--#BarrelBot
function ________________________BARRELS(_){}

function UWBarrels()
    {
	Orion.Exec('UWBarrelsHealSelf',true);
    var locArr =
        [
            ['Flywheel',6426,1733], //0x46FE
            ['Bearing Assembly',6436,1733],//0x0E74
            ['Wire Spool',6426,1753],//0x4CDB
            ['Power Core',6436,1753]//0x47E6
        ];
	for(var i=0;i<locArr.length;i++)
		{
		var loc = locArr[i];
		var component = Orion.FindTypeEx(any).filter(function(item)
			{
			return Orion.Contains(item.Properties(),loc[0]);
			})[0];
		if(component)
			continue;
		var x = loc[1];
		var y = loc[2];
		while(Orion.GetDistance(x,y) > 0)
			{
			Orion.WalkTo(x,y,0,0);
			Orion.Wait(200);
			}
		ClearRoom();
		}
	while(Orion.GetDistance(6432,1699) > 0)
		{
		Orion.WalkTo(6432, 1699, 0, 0);
		Orion.Wait(100);
		}
    }

function ClearRoom()
 	{
 	Orion.IgnoreReset();
 	Orion.ClearFakeMapObjects();
	Orion.Exec('UWBarrelsHealSelf',true);
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
			if(!Orion.AbilityStatus('primary') && Player.Mana() >= 15)
				Orion.UseAbility('primary');	
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
    	DrawSquare(x1,y1,x2,y2);
    	Orion.SetSearchArea(x1,y1,x2,y2);
	    var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, 'near', '24');
	    Orion.ResetSearchArea();
	    if(barrels[0])
	    	{
			if(!Orion.AbilityStatus('primary') && Player.Mana() >= 15)
				Orion.UseAbility('primary');
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
	Orion.Wait(10);
	//Orion.WalkTo(6432, 1699, 0, 0);
	}

function UWBarrelsHealSelf()
	{
	while(!Player.Dead()) 
		{
		while(Player.Hits('%') < 90 || Player.Poisoned())
			{
			if(!Orion.BuffExists('Healing Skill'))
				{
				var bandie = Orion.FindType('0x0E21')
				if(bandie[0])
					{
					Orion.UseObject(bandie[0]);
					Orion.WaitForTarget(3000)
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

function ParseWinch()
	{
	var winch = Orion.FindTypeEx('0x280E',any,ground,'item',24)[0];
	if(!winch)
		return false;
	var winchProps = winch.Properties();
	var statusArr = winchProps.match(/>(\w+)</g)
	var statusMap = statusArr.map(function(ele)
		{
		return ele == '>READY<'
		})
	Orion.Print(statusMap);
	}






//--#Melee
function ________________________MELEE(_){}
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


//-#Healers
function ________________________HEALERS(_){}

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
                WalkToRadiusBorder(listenArr[1], 6) 
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
		else if(target && target.Poisoned())
			{
			Orion.CancelTarget();
			Orion.Cast('Cure');
			if(Orion.WaitForTarget(3000))
				Orion.TargetObject(target.Serial());	
			}
		else if(target)
			{
			if(Orion.WaitForTarget(3000))
				Orion.TargetObject(target.Serial());	
			}
		Orion.Wait(300);
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
			WalkToRadiusBorder(lord[0].Serial(), 5);
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


function UWAvoidBot(distance)
	{
	// var distanceActual = distance || 5;
	// if(Orion.WalkTo(6432, 1699, 0, 0))
	// 	{
	// 	var ladder = Orion.FindType(0x08A6, any, ground, '', 24);
	// 	Orion.UseObject(ladder[0]);
	//  	Orion.Wait(500);
	//  	}
	//  if(Orion.WalkTo(6306, 1711, 0, 0))
	// 	{
	// 	Orion.Step(128, true);
	//  	}

	// Orion.Wait(500);
	// Orion.Resend();
	// Orion.Wait(500);
	while(!Player.Dead())
		{	
        Orion.Wait(100)
		var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(part)
			{
			return part.Properties().match(/Shadowlord/i);
			});
		var corpse = Orion.FindTypeEx('0x2006', any, ground, '-1', 24).filter(function(part)
			{
			return part.Properties().match(/Evil/i);
			});
	   	if(lord[0])
			{
            WalkToRadiusBorder(lord[0].Serial(), distanceActual);
			}
		if(corpse[0])
    		{
    		//BotPush('Shadowlord Dead!');
    		Orion.Wait(Orion.Random(1,5) * 1000);   		
    		Orion.WalkTo(corpse[0].X(),corpse[0].Y());
    		ListLoot("BotLoot");
    		Orion.Wait(100);
            Orion.Terminate('all');
    		}		
		}
	}

//--#Misc


function EquipLuckSuitByBotName()
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

//deprecated
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