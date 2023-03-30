var leaderSerial = '0x01DD7DAE'; //Apollo

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

function Autostart()
    {
	Orion.Wait(2000);
	while(!Orion.GumpExists('container',backpack))
		{
		Orion.UseObject(backpack);
		Orion.Wait(1300);
		}
    if(Player.Serial() == leaderSerial)
        Orion.Exec('LeaderComs',true);
    else if(Orion.SkillValue('Archery') >= 100)
        Orion.Exec('ArcherComs',true);
	Orion.Exec('JournalScan',true);
    }

function init()
    {
	Orion.Exec('JournalScan',true);
    if(Player.Serial() == leaderSerial)
        {
        Orion.Exec('LeaderComs',true);
        }
    else if(Orion.SkillValue('Archery') >= 100)
        {
        Orion.Exec('ArcherComs',true);
        Orion.Exec('AutoAttackArcher',true);
        Orion.Exec('AutoBuffs',true);
        Orion.Exec('BandieBot',true);
        }
    }

function testSharedArray()
    {
    var archerArr = Shared.GetArray('archerArr',false);
    var healerArr = Shared.GetArray('healerArr',false);
    var miscArr = Shared.GetArray('miscArr',false);
    Orion.Print('archerArr: ' + JSON.stringify(archerArr) + '\nhealerArr: ' + JSON.stringify(healerArr) + '\nmiscArr: ' + JSON.stringify(miscArr))
    }

function FollowLeader(leaderSerial,distance)
    {
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
				case 'Check': //'Check:playerSerial!PlayerName!role:port'
					var botString = recvSplit[1];
					var port = +recvSplit[2];
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
    var botPort = arr[0];
    var botSerial = arr[1];
    var botName = arr[2];
    var arrayName = arr[3];
    var roleArr = Shared.GetArray(arrayName,[]); //[port,serial,name]
    for(var i=0;i<roleArr.length;i++)
        {
        var bot = roleArr[i];
        if(botPort == bot[0] && botSerial == bot[1]) //skip if the bot is already in the list
            {
			Orion.UdpSend(botPort,'Heard:' + Player.Name());
            return;
            }
        else if(botPort == bot[0]) //if the port matches but the serial doesn't, overwrite with this bot arr
            {
            roleArr[i] = [botPort,botSerial,botName];
            Shared.AddArray(arrayName,roleArr);
            Orion.UdpSend(botPort,'Heard:' + Player.Name());
            return;
            }
        else if(botSerial == bot[1]) //if the serial matches but the port doesn't, overwrite with this bot arr
            {
            roleArr[i] = [botPort,botSerial,botName];
            Shared.AddArray(arrayName,roleArr);
            Orion.UdpSend(botPort,'Heard:' + Player.Name());
            return;
            }
        }
	roleArr.push([botPort,botSerial,botName]);
	Shared.AddArray(arrayName,roleArr);
    Orion.UdpSend(botPort,'Heard:' + Player.Name());
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
	Orion.Print('Server Creation Success! Port: ' + port);
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

function startArcherScripts()
	{
	Orion.Exec('AutoAttackArcher',true);
	Orion.Exec('AutoBuffs',true);
	Orion.Exec('BandieBot',true);
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

function AutoBuffs()
	{
	var useConfidence = false;
	var useConfidenceThresholdPercent = 60;
	var useEnemyOfOne = false;
	var useCounterAttack = false;
	var useConsecrateWeapon = true;
	var useDivineFury = true;
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
	var useBandieOthers = true;
	var useBandieOtherThresholdPercent = 90;
	var useBandieSelf = true;
	var useBandieSelfThresholdPercent = 70;
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