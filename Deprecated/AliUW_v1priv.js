var healerArr = ['Alyx','Beatrix','Couli','Daemont']
var enpointe = 'Iona'
var healLeader = 'Daemont'
var leaderSerial = '0x01DD7DAE'; //Apollo
Orion.Exec('JournalScan', true);
function Autostart()
	{
	Orion.Wait(2000);
	VerifyOpenContainer(backpack);
	if(Player.Serial() == leaderSerial)
        Orion.Exec('LeaderComs',true);
    else if(Orion.SkillValue('Archery') >= 100)
        Orion.Exec('ArcherComs',true);
    else if(Orion.SkillValue('Magery') >= 70 || Orion.SkillValue('Mysticism') >= 70)
        Orion.Exec('HealerComs',true);
	Orion.Exec('JournalScan',true);
	}

	var serialIndex = 1;
	var buttons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
		[
			[ [100, 30, serialIndex++, "init", 'init'] ],
			[],
			[ [100, 30, serialIndex++, "FollowLeader", "SendFollowLeaderMessage"], [100, 30, serialIndex++, "FollowClose", "SendFollowLeaderCloseMessage" ] ],
			[ [100, 30, serialIndex++, "SendInit", "SendInitMessage" ], [100, 30, serialIndex++, "SendKite", "SendKiteMessage" ]]
		]
	
function Gump()
	{
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
function initUWLeader()
	{
	UWLeaderStartup();
	Orion.Exec('SingleMageHealBot', true);
	Orion.Exec('UWAvoidBot', true, [8]);
	}

function initUWBarrels()
	{
	UWBarrelsStartup();
	Orion.Exec('UWBarrels', true);
	Orion.Exec('UWBarrelsHealSelf', true);
	}

function initUWArcher()
	{
	UWArcherStartup();
	Orion.Exec('AutoAttackArcher', true);
	Orion.Exec('AutoBuffs', true);
	Orion.Exec('BandieBot', true);
	Orion.Exec('ArcherComs', true);
	Orion.Exec('UWAvoidBot', true, [5]);
	}
	
function initUWSamp()
	{
	UWSampStartup();
	Orion.Exec('UWSamp', true);
	Orion.Exec('UWSampAttackScimitar', true);
	}

function initUWMystic()
	{
	UWHealerStartup();
	Orion.Exec('UWMysticBot', true);
	Orion.Exec('UWHealBotListen', true);
	Orion.Exec('UWAvoidBot', true, [8]);
	}

function initUWMage()
	{
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

function UWArcherSetup()
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
function LeaderComs()
	{
	Orion.RemoveAllUdpServers();
	var port = 60420;
	var create = Orion.CreateUdpServer('Coms', port);
	if(create != 0)
		return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
	Orion.Print('Port: ' + port);
	while(true)
		{
		// while(Player.Dead())
		// 	{
		// 	if(Orion.UdpRecv('Coms') == 'Dead Function')
		// 		Orion.Exec('Dead Function',true);
		// 	Orion.Wait(500);
		// 	}
		var recv = Orion.UdpRecv('Coms');
		if(recv)
			{
			var recvSplit = Orion.Split(recv,':');
			switch(recvSplit[0])
				{
				case 'Check':
					var botString = recvSplit[1];
					var port = recvSplit[2];
                    var botSplit = Orion.Split(botString,'!');
                    var botSerial = botSplit[0];
                    var botName = botSplit[1];
                    var botRole = botSplit[2];
                    var botArr = [port,botSerial,botName];
                    if(botRole == 'Archer')
                        {
                        botArr.push('archerArr');
                        AddBotToShared(botArr) //[port,serial,name,arrayName]
                        }
                    else if(botRole == 'Healer')
                        {
                        botArr.push('healerArr');
                        AddBotToShared(botArr) //[port,serial,name,arrayName]
                        }
                    else if(botRole == 'Misc')
                        {
                        botArr.push('miscArr');
                        AddBotToShared(botArr) //[port,serial,name,arrayName]
                        }
					break;
				case '':
					break;
				case '':
					break;
				case undefined:
					break;
				
				}
			}
		Orion.Wait(100);
		}
	}

function AddBotToShared(arr) //[port,serial,name,arrayName]
    {
    var skip = false;
    var botPort = arr[0];
    var botSerial = arr[1];
    var botName = arr[2];
    var arrayName = arr[3];
    var roleArr = Shared.GetArray(arrayName,[]); //[port,serial,name]
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
            roleArr[i] = [botPort,botSerial,botName];
            Shared.AddArray(arrayName,roleArr);
            skip = true;
            break;
            }
        }
    if(!skip)
        {
        roleArr.push([botPort,botSerial,botName]);
        Shared.AddArray(arrayName,roleArr);
        }
    Orion.UdpSend(+botPort,'Heard:' + Player.Name());
    }

function ArcherComs()
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
    ConnectToLeader(port);
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
					Orion.Wait(100);
                    Orion.Terminate('FollowLeader|ArcherKiteTarget');
					Orion.StopWalking();
					Orion.Wait(100);
					var leaderSerial = recvSplit[1];
					var distance = recvSplit[2];
					if(distance == undefined) distance = 1;
                    Orion.Exec('FollowLeader',true,[leaderSerial,distance]);
                    break;
                case 'TerminateAll':
					Orion.PauseScript('all','JournalScan|ArcherComs|HealerComs');
					Orion.Wait(100);
                    Orion.Terminate('all','JournalScan|ArcherComs|HealerComs');
                    break;
                case 'init':
                    Orion.Exec('init',true);
                    break;
                case 'kite':
					var targetSerial = recvSplit[1];
					Orion.PauseScript('FollowLeader|ArcherKiteTarget');
					Orion.Wait(100);
					Orion.Terminate('FollowLeader|ArcherKiteTarget');
					Orion.StopWalking();
					Orion.Wait(100);
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

function HealerComs()
	{
	Orion.RemoveAllUdpServers();
	var port = 60100;
	var create = 1;
	var endTime = Orion.Now() + 5000;
	while(create != 0 && Orion.Now() < endTime && port < 60199) 
		{
		create = Orion.CreateUdpServer('Coms', port++);
		Orion.Wait(10);
		}
	if(create != 0)
		return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
	Orion.Print('Port: ' + port);
    while(true)
        {
		while(Player.Dead())
			{
			if(Orion.UdpRecv('Coms') == 'Dead Function')
				Orion.Exec('Dead Function',true);
			Orion.Wait(500);
			}
        var recv = Orion.UdpRecv('Coms');
        if(recv)
            {
			if(Orion.Contains(recv,'Progress'))
				{
				Orion.Exec('WalkSpawn',true);
				}
			else if(Orion.Contains(recv,'Retrieve'))
				{
				Orion.Terminate('all','Listener|DecoHighlighter|AutoEvade|JournalScan');
				Orion.Exec('RetrieveDeco',true);
				}
			else if(Orion.Contains(recv,'Candles'))
				{
				var split = Orion.Split(recv,':');
				var redCandles = split[0];
				var whiteCandles = split[1];
				Shared.AddVar('candleStr', recv);
				var gump = Orion.CreateCustomGump(15001);
				gump.Clear();
				gump.AddResizepic(0, 0, 0xDAC, 100, 80);
				gump.AddTilePic(17,10,0x1853,0x0026);
				gump.AddTilePic(17,35,0x1854,0);
				gump.AddText(55,15,0,redCandles);
				gump.AddText(55,45,0,whiteCandles);
				gump.Update();
				}
            }
		Orion.Wait(100);
		}
	}

function ConnectToLeader(followerPort)
    {
    var playerSerial = Player.Serial();
    if(Orion.SkillValue('Archery') > 600)
        var role = 'Archer';
    else if(Orion.SkillValue('Mysticism') > 700 || Orion.SkillValue('Magery') >= 700)
        var role = 'Healer';
    else
        var role = 'Misc';
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self,1159,'Sending signal to leader');
    Orion.UdpSend(60420,'Check:' + playerString + ':' + followerPort);
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
            Orion.UdpSend(60420,'Check:' + playerString + ':' + followerPort);
            pulseTime = Orion.Now() + 5000;
            }
        }
    Orion.CharPrint(self,1159,'Connected to leader: ' + split[1]);
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

function Tithe()
    {
    RecallByGump('Main','Tithing','Main','Tithing2');
    var shrine = Orion.FindType('0x0002|0x0003',any,ground,'item',20)[0];
    if(!shrine)
        return DiscordPush(Player.Name() + "couldn't find shrine!")
    Orion.RequestContextMenu(shrine);
    Orion.WaitContextMenuID(shrine, 412);
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
    }

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

function JournalScan()
	{
	var msg = 'Greetings|GM|Are you there|Begin GM Chat|equipment is severely'
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
				default:
					break;
				}
			}
		}
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