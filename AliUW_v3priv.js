//--#Include

var healerArr = ['Alyx','Beatrix','Couli','Daemont'];
var enpointe = 'Iona'
var healLeader = 'Daemont'
var leaderSerial = '0x01DD7DAE'; //Apollo
var UWSetup = true;

var profiles = 
	{
	Ali: 
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
var profile = profiles.Ali;

Orion.Exec('JournalScan', true);

function Autostart()
	{
	Orion.Wait(2000);
	VerifyOpenContainer(backpack);
	if(Player.Serial() == leaderSerial)
        Orion.Exec('AliComLeader',true);
    else
        Orion.Exec('AliComFollower',true);
	}

function Gump()
	{
    var serialIndex = 1;
    var buttons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
        [
            [ [100, 30, serialIndex++, "init", 'init'] ],
            [],
            [ [100, 30, serialIndex++, "FollowLeader", "SendFollowLeaderMessage"], [100, 30, serialIndex++, "FollowClose", "SendFollowLeaderCloseMessage" ] ],
            [ [100, 30, serialIndex++, "SendInit", "SendInitMessage" ], [100, 30, serialIndex++, "SendKite", "SendKiteMessage" ]],
            [],
            [],
            [ [100, 30, serialIndex++, "ArcherArrows", 'ArcherMassMessage', ['restock:Arrows']], [100, 30, serialIndex++, "ArcherBandies", 'ArcherMassMessage', ['restock:Bandies']], [100, 30, serialIndex++, "ArcherTithe", 'ArcherMassMessage', ['tithe']] ],
        ]
    Shared.AddArray('buttons',buttons);
	var gump = Orion.CreateCustomGump(12002);
	gump.Clear();
	gump.SetCallback('GumpCallback');
	var widest = Math.max.apply(Math, buttons.map(function (rows)
		{
		return rows.length
		}));
	gump.AddHtmlGump(1, 0, 0, widest * 105 - 2, buttons.length * 30 + 1, '0x0BB8', 1, 0);
	gump.Select('htmlgump', 1);
	var row = 0;
	var column = 0;
	buttons.forEach(function(rowLayer)
		{
		rowLayer.forEach(function(button)
			{
			gump.AddResizepic(column * 105, row * 29 + 2, '0x24EA', button[0], button[1], button[2], 1);
			gump.AddText(column * 105 + 4, row * 29 + 6, '0', button[3]);
			column++;
			});
		column = 0;
		row++;
		});
	gump.Select('gump');
	gump.Update();
	}

function GumpCallback(_) 
	{
    var buttons = Shared.GetArray('buttons');
	var code = CustomGumpResponse.ReturnCode();
	if(code == 0) 
		{
		var gump = Orion.CreateCustomGump(15);
		gump.Close();
		}
	buttons.forEach(function(rowLayer)
		{
		rowLayer.forEach(function(button)
			{
			if(button[2] == code)
				{
				Orion.Print('Toggle ' + button[3]);
				Orion.ToggleScript(button[4], false, button[5]);
				return;
				}
			})
		});
	}

//--#Inits
function ________________________INITS(_){}

function SmartStart()
	{
	if(Player.Serial() == leaderSerial)
		initUWLeader();
    else if(Orion.SkillValue('Archery') >= 100)
		initUWArcher();
    else if(Orion.SkillValue('Swordsmanship') >= 100)
		initUWSamp();
	else if(Orion.SkillValue('Magery') >= 70)
		initUWMage();
	else if(Orion.SkillValue('Mysticism') >= 70)
		initUWMystic();
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
	if(UWSetup)
		UWBarrelsStartup();
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
	Orion.Exec('UWSampAttackScimitar', true);
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

//--#Startups
function ________________________STARTUPS(_){}

function UWLeaderStartup()
	{
	if(Orion.WalkTo(6432, 1699, 0, 0))
		{
		var ladder = Orion.FindType('0x08A6', any, ground, '', 24);
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
		while(!Orion.HaveTarget())
			{
			Orion.Cast('Invisibility');
			Orion.WaitForTarget(3000)
			}
		Orion.Wait(2000);
		var playerX = Player.X();
		var playerY = Player.Y();
		Orion.Step(128, true);
		while(Player.X() == playerX && Player.Y() == playerY)
			{
			Orion.Wait(100);
			}
		Orion.Wait(200);
		Orion.TargetObject(self);
		while(!Orion.BuffExists('Invisibility'))
			Orion.Wait(50);
		var endTime = Orion.Now() + 5000;
		while(Orion.BuffExists('Invisibility') && Orion.Now() < endTime)
			Orion.Wait(50);
		Orion.UseSkill('Hiding')
		endTime = Orion.Now() + 3000;
		while(!Player.Hidden() && Orion.Now() < endTime)
			Orion.Wait(50);
		endTime = Orion.Now() + 5000;
		while(Player.Hidden() && Orion.Now() < endTime)
			Orion.Wait(50);
		if(!Player.Hidden())
			ResetLeader();
		else
			ChairBlocker();
		ArcherMassMessage('Init');
		HealerMassMessage('Init');
		var mobs = Orion.FindType(any,any,ground,'mobile',24).length;
		while(Orion.FindType(any,any,ground,'mobile',24) == mobs)
			Orion.Wait(50);
		initUWMage();
	 	}
	}

function UWArcherStartup()
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
	}

//--#Coms
function ________________________COMS(_){}

function testSharedArray()
    {
    var archerArr = Shared.GetArray('archerArr',false);
    var healerArr = Shared.GetArray('healerArr',false);
    var miscArr = Shared.GetArray('miscArr',false);
    Orion.Print('archerArr: ' + JSON.stringify(archerArr) + '\nhealerArr: ' + JSON.stringify(healerArr) + '\nmiscArr: ' + JSON.stringify(miscArr))
    }

//leader port 60420
//barrel port 60422
//archer ports 60000-60099
//healer ports 60100-60199
function AliComLeader()
	{
	Orion.RemoveAllUdpServers();
	var port = 60420;
	var create = Orion.CreateUdpServer('Coms', port);
	if(create != 0)
		return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
	Orion.Print('Port: ' + port);
	while(true)
		{
		var recv = Orion.UdpRecv('Coms');
		if(recv)
			{
			var recvSplit = Orion.Split(recv,':');
			switch(recvSplit[0])
				{
				case 'Check': //"cmd:playerSerial!playerName!role:port"
					var botString = recvSplit[1];
					var botPort = +recvSplit[2];
                    var botSplit = Orion.Split(botString,'!'); //playerSerial + '!' + Player.Name() + '!' + roleArrName
                        var botSerial = botSplit[0];
                        var botName = botSplit[1];
                        var botRole = botSplit[2];
                    var skip = false;
                    var roleArr = Shared.GetArray(botRole,[]); //[port,serial,name,roleArrName]
                    for(var i=0;i<roleArr.length;i++)
                        {
                        var bot = roleArr[i];
                        if(botSerial == bot[1] && botPort == bot[0])
                            {
                            skip = true;
                            break;
                            }
                        else if(botPort == bot[0])
                            {
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
                            skip = true;
                            break;
                            }
                        }
                    if(!skip)
                        {
                        roleArr.push([botPort,botSerial,botName,botRole]);
                        Shared.AddArray(botRole,roleArr);
                        }
                    Orion.UdpSend(+botPort,'Heard:' + Player.Name());
					break;
				case '':
					break;
				case '':
					break;
				case undefined:
					break;
				default:
                    break;
				}
			}
		Orion.Wait(100);
		}
	}

function AliComFollower()
	{
	Orion.RemoveAllUdpServers();
	var port = 59999;
	var create = 1;
	var endTime = Orion.Now() + 5000;
	while(create != 0 && Orion.Now() < endTime && port < 60099) 
		{
		create = Orion.CreateUdpServer('Coms', ++port);
		Orion.Wait(10);
		}
	if(create != 0)
		return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
	Orion.Print('Port: ' + port);
    var playerSerial = Player.Serial();
    if(Orion.SkillValue('Archery') > 600)
        var role = 'archerArr';
    else if(Orion.SkillValue('Mysticism') > 700 || Orion.SkillValue('Magery') >= 700)
        var role = 'healerArr';
    else
        var role = 'miscArr';
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self,1159,'Sending signal to leader');
    Orion.UdpSend(60420,'Check:' + playerString + ':' + port);
    Orion.Wait(200);
    var pulseTime = Orion.Now() + 5000;
    while(true)
        {
        recv = Orion.UdpRecv('Coms')
        if(recv)
            {
            var split = Orion.Split(recv,':');
            if(split[0] == 'Heard')
                break;
            }
        Orion.Wait(100);
        if(Orion.Now() > pulseTime)
            {
            Orion.CharPrint(self,1159,'Retrying connection to leader');
            Orion.UdpSend(60420,'Check:' + playerString + ':' + port);
            pulseTime = Orion.Now() + 5000;
            }
        }
    Orion.CharPrint(self,1159,'Connected to leader: ' + split[1]);
    while(true)
        {
        var recv = Orion.UdpRecv('Coms');
        if(recv)
            {
            Orion.Print(recv);
            var recvSplit = Orion.Split(recv,':');
            switch(recvSplit[0])
                {
                case 'FollowLeader':
					Orion.PauseScript('FollowLeader|ArcherKiteTarget');
					Orion.StopWalking();
					Orion.Wait(250);
                    Orion.Terminate('FollowLeader|ArcherKiteTarget');
					Orion.Wait(250);
					var leaderSerial = recvSplit[1];
					var distance = recvSplit[2];
					if(distance == undefined) distance = 1;
                    Orion.Exec('FollowLeader',true,[leaderSerial,distance]);
                    break;
                case 'TerminateAll':
					Orion.PauseScript('all','JournalScan|AliComFollower');
					Orion.Wait(250);
                    Orion.Terminate('all','JournalScan|AliComFollower');
                    break;
                case 'init':
                    Orion.Exec('init',true);
                    break;
                case 'kite':
					var targetSerial = recvSplit[1];
					Orion.PauseScript('FollowLeader|ArcherKiteTarget');
					Orion.StopWalking();
					Orion.Wait(250);
					Orion.Terminate('FollowLeader|ArcherKiteTarget');
					Orion.Wait(250);
                    Orion.Exec('ArcherKiteTarget',true,[targetSerial]);
                    break;
                case undefined:
                    break;
                default:
                    break;
                }
            }
        Orion.Wait(100);
		}
	}

function ArcherMassMessage(msg)
	{
	var archerArr = Shared.GetArray('archerArr',[]);
	if(!archerArr[0])
		return Orion.CharPrint(self,1159,'No archers to command');
	for(var i = 0;i<archerArr.length;i++)
		Orion.UdpSend(archerArr[i],msg);
	}

function HealerMassMessage(msg)
	{
	var healerArr = Shared.GetArray('healerArr',[]);
	if(!healerArr[0])
		return Orion.CharPrint(self,1159,'No healers to command');
	for(var i = 0;i<healerArr.length;i++)
		Orion.UdpSend(healerArr[i],msg);
	}

function FollowLeader(followSerial,distance)
    {
    if(followSerial == undefined)
        followSerial = leaderSerial;
    do
        {
        var leaderObj = Orion.FindObject(leaderSerial);
        Orion.Wait(200);
        } while(!leaderObj)
    if(distance == undefined)
        distance = 1;
    while(true)
        {
        if(leaderObj.Exists() && leaderObj.Distance() > distance)
            Orion.WalkTo(leaderObj.X(),leaderObj.Y(),leaderObj.Z(),distance,10,1,1);
        Orion.Wait(100);
        }
    }

function ArcherKiteTarget(targetSerial)
	{
	var targetObj = Orion.FindObject(targetSerial);
	while(targetObj && targetObj.Exists())
		{
		WalkToRadiusBorder(targetSerial, 5);
		}
	}

//--#Coms Hotkeys
function SendKiteMessage()
	{
	Orion.CharPrint(self,1159,'Select target to kite');
	Orion.WaitForAddObject('myTarget');
	var serial = Orion.GetSerial('myTarget');
	ArcherMassMessage('kite:' + serial);
	}
function SendFollowLeaderMessage()
	{
	ArcherMassMessage('FollowLeader:' + leaderSerial)
	}
function SendFollowLeaderCloseMessage()
	{
	ArcherMassMessage('FollowLeader:' + leaderSerial + ':0')
	}
function SendInitMessage()
	{
	ArcherMassMessage('init')
	}
function SendRestockMessage()
	{
	ArcherMassMessage('restock')
	}
//--#Leader

//--#BarrelBot
function ________________________BARRELS(_){}

function UWBarrels()
    {
	Orion.Exec('UWBarrelsHealSelf',true);
    // var sampArr = ['Ephie','Fiska','Grejt','Hejti'];
    // if(Orion.Contains(Player.Name(), 'Lady|Lord'))
	// 	var _pName = Player.Name().slice(5, Player.Name().length);
	// else
	// 	var _pName = Player.Name();
    var locArr =
        [
            ['Flywheel',6426,1733],
            ['Bearing Assembly',6436,1733],
            ['Wire Spool',6426,1753],
            ['Power Core',6436,1753]
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

//--#Archer
function ________________________ARCHERS(_){}

function AutoAttackArcher()
	{
	var useGatherMobs = profile.useGatherMobs;
	var useSingleTargetSpecial = profile.useSingleTargetSpecial;
	var singleTargetSpecial = profile.singleTargetSpecial;
	var useMultiTargetSpecial = profile.useMultiTargetSpecial;
	var multiTargetSpecial = profile.multiTargetSpecial;
	while(!Player.Dead())
		{
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 10, 'gray|red|criminal|enemy|orange');
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
		if(Orion.FindType(any,any,ground,'live',10,'criminal|gray|red|orange')[0] && Orion.Now() > nextSpellTime && Player.Mana() > 10)
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

function GatherMobs()
	{
	Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|nothuman', 20, 'gray|criminal|red|orange')
		.forEach(function(mob)
			{
			Orion.TargetSystemSerial(mob);
			Orion.Attack(mob);
			Orion.Wait(10);
			});
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red|orange')[0]; 
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}

function AttackNearest()
	{
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red|orange')[0]; 
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}



function ArcherMassMessage(msg)
	{
	var archerArr = Shared.GetArray('archerArr',[]);  //[botPort,botSerial,botName]
	if(!archerArr[0])
		return Orion.CharPrint(self,1159,'No archers to command');
	for(var i = 0;i<archerArr.length;i++)
		Orion.UdpSend(archerArr[i][0],msg);
	}

	
//NOCHANGE
	
//NOCHANGE
	
//NOCHANGE
	
//NOCHANGE

//-#Healers
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
			if(!bandies) Orion.CharPrint(self,1159,'Out of bandies!');
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

//--#Utility Functions
function ________________________UTILITY(_){}

function HideTilHidden()
	{
	Orion.Terminate('AlwaysAttackAdjacent');
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
	Orion.SetTimer('StayLoggedIn');
	while(Orion.BuffExists('hiding'))
		{
		if(Orion.Timer('StayLoggedIn') > 60000)
			{
			Orion.UseObject(backpack);
			Orion.SetTimer('StayLoggedIn');
			}
		Orion.Wait(500)
		}
	Orion.Wait(1000);
	if((''+ Player.X() + Player.Y()) == startTile)
		{
		DiscordPush(Player.Name() + ' Revealed!')
		return HideTilHidden();
		}
	}

function RecallBandieBuy()
    {
    var currentBandies = Orion.Count('0x0E21');
    Orion.Print('Current Bandie Count: ' + currentBandies)
    if(currentBandies >= 400)
        return;
	Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallBandieBuy');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallBandieBuy');
    RecallByGump('Main','Tailor', 'Main','Tailor2');
	BandieBuy();
    }

function BandieBuy()
	{
	do {
		var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
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

function RecallArrowBuy()
    {
    var currentArrows = Orion.Count('0x0F3F');
    Orion.Print('Current Arrow Count: ' + currentArrows)
    if(currentArrows >= 1000)
        return;
	Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallArrowBuy');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallArrowBuy');
    RecallByGump('Main','Arrows', 'Main','Arrows2');
	ArrowBuy();
    }

function ArrowBuy()
	{
    var currentArrows = Orion.Count('0x0F3F');
    // var quivers = Orion.FindTypeEx(any,any,backpack)
    // quivers.push(Orion.ObjAtLayer(20));
    // quivers.forEach(function(item)
    //     {
    //     var itemProps = item.Properties();
    //     if(Orion.Contains(itemProps,'Ammo: '))
    //         {
    //         var arrowsQuiverMatch = (itemProps.match(/Ammo: (\d+)\//) || [])
    //         var arrowsQuiver = arrowsQuiverMatch[1];
    //         if(arrowsQuiver)
    //             currentArrows += +arrowsQuiver;
    //         }
    //     });
	do {
		var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
			{
			return Orion.Contains(vendor.Properties(), 'the bowyer|the provisioner') && !Orion.Contains(vendor.Properties(), 'guild');
			})[0];
		Orion.Wait(1000);
		} while(!vendors)
    var shopnpcSerial = vendors.Serial();
    while(currentArrows < 1000)
        {
		Orion.WalkTo(vendors.X(),vendors.Y());
        var shoplist = Orion.GetShopList('Arrows');
        var amount = 1000 - currentArrows;
        var items = [new ShopListItem('0x0F3F', '0x0000', '', amount)];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Arrows');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(3000);
        currentArrows = Orion.Count('0x0F3F');
        }
    var quivers = Orion.FindTypeEx(any,any,backpack);
    var back = Orion.ObjAtLayer(20);
    if(back)
        quivers.push(back);
    quivers.forEach(function(item)
        {
        var itemProps = item.Properties();
        if(Orion.Contains(itemProps,'Ammo: '))
            {
            var arrowsQuiverMatch = (itemProps.match(/Ammo: (\d+)\//) || [])
            var arrowsQuiver = arrowsQuiverMatch[1];
            var needed = 500 - +arrowsQuiver
            if(needed > 0)
                {
                Orion.MoveItemType('0x0F3F', any, backpack, needed, item.Serial());
                Orion.Wait(1300);
                }
            }
        });
     if(Player.Weight() > Player.MaxWeight())
		{
		DiscordPush(Orion.ShardName() + ': ' + Player.Name() + ': Overweight after buying arrows. Halting...')
		RecallByGump('Main','Home');
		Orion.LogOut();
		}
	}

function RecallTithe()
	{
    var tithingPoints = Player.TithingPoints();
    Orion.Print('Current Tithing Points: ' + tithingPoints)
	if(tithingPoints > 10000)
        return;
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallTithe');
    Orion.Wait(500);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallTithe');
    RecallByGump('Main','Tithing','Main','Tithing2');
    Tithe();
	Orion.Wait(1500);
	//Orion.Exec('WalkThroughCurrentFarm');
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

function RecallRepair()
	{
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallRepair');
    Orion.Wait(500);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallRepair');
	RecallByGump('Main', 'Home', 'Main', 'Home2');
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
	//Orion.Exec('WalkThroughCurrentFarm');
	}

function RepairGear()
	{
    CloseAllGumps();
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
	minDura = 80; //Durability below which to repair
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

//--#Misc
function ________________________MISC(_){}

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
    //Orion.Wait(1300);
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

function WalkToRadiusBorder(targetSerial, distance) 
	{
    var target = Orion.FindObject(targetSerial)
  	if(target) 
  		{
    	var x = target.X();
    	var y = target.Y();
    	var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
        	.filter(function (tile) 
        		{
				var tileX = tile.X();
				var tileY = tile.Y();
          		return (x == (tileX - distance))
					|| (x == (tileX + distance))
					|| (y == (tileY - distance))
					|| (y == (tileY + distance));
        		}).sort(function (a,b) 
					{
					return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y())
					});
        for(var i=0;i<tiles.length;i++)
            {             
            var closest = tiles[i]; 
            if(Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0))
                break;
            }
  		}
	}

function DrawSquare(minX,minY,maxX,maxY)
	{
	Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
		.forEach(function (tile,ind) 
			{
			Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
			});
	}
// function BorderEdge(x, y, p2, range) 
//     {
//       return (x == (p2.X() - range))
//         || (x == (p2.X() + range))
//         || (y == (p2.Y() - range))
//         || (y == (p2.Y() + range));
//     }

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

function VerifyOpenContainer(containerSerial)
	{
	while(!Orion.GumpExists('container',containerSerial))
		{
		Orion.UseObject(containerSerial);
		Orion.Wait(1300);
		}
	}

//--#Looter
function ________________________LOOTER(_){}

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

function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}

function CloseAllGumps(_)
    {
    var endTime = Orion.Now() + 3000;
    while(Orion.GetGump(any) && Orion.Now() < endTime)
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
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

//AliAuto