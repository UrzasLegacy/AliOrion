function AliLeaderComs()
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
				case 'Check': // "cmd:playerSerial!playerName!role:port"
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
    // if(Orion.SkillValue('Archery') > 600)
    //     var role = 'archerArr';
    // else if(Orion.SkillValue('Mysticism') > 700 || Orion.SkillValue('Magery') >= 700)
    //     var role = 'healerArr';
    // else
    //     var role = 'miscArr';
    var role = 'followerArr';
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self,1159,'Sending signal to leader');
    Orion.UdpSend(60420,'Check:' + playerString + ':' + port); //[cmd,[playerSerial,playerName,role],port]
    Orion.Wait(200);
    var pulseTime = Orion.Now() + 5000;
    while(true)
        {
        recv = Orion.UdpRecv('Coms');
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
                case 'Init':
                    Init();
                    break;
                case 'FollowLeader': //'cmd:leaderSerial:distance'
                    var leaderSerial = recvSplit[1];
                    var distance = recvSplit[2];
                    if(distance == undefined) distance = 1;
                    FollowLeader(leaderSerial,distance);
                    break;
                case 'TerminateAll': //'cmd'
                    TerminateAll();
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

function FollowerMassMessage(msg)
	{
	var followerArr = Shared.GetArray('followerArr',[]);  //[botPort,botSerial,botName]
	if(!followerArr[0])
		return Orion.CharPrint(self,1159,'No followers to command');
	for(var i = 0;i<followerArr.length;i++)
		Orion.UdpSend(followerArr[i][0],msg);
	}

function Init()
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

function FollowLeader(leaderSerial,distance)
    {
    Orion.PauseScript('FollowLeader|KiteTarget');
    Orion.StopWalking();
    Orion.Wait(250);
    Orion.Terminate('FollowLeader|KiteTarget');
    Orion.Wait(250);
    Orion.Exec('FollowLeader',true,[leaderSerial,distance]);
    }

function TerminateAll(_)
    {
    Orion.PauseScript('all','JournalScan|FollowerComs');
    Orion.Wait(250);
    Orion.Terminate('all','JournalScan|FollowerComs');
    }