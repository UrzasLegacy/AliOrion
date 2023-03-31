function AliComLeader()
	{
    Shared.AddVar('myRole','leader');
	Orion.RemoveAllUdpServers();
    var port = 42420;
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
				case 'Check': //"Check:botSerial!botName!botRole:port"
					var botString = recvSplit[1];
					var botPort = +recvSplit[2];
                    var botSplit = Orion.Split(botString,'!'); //playerSerial + '!' + Player.Name() + '!' + roleArrName
                        var botSerial = botSplit[0];
                        var botName = botSplit[1];
                        var botRole = botSplit[2];
                    var skip = false;
                    var roleArr = Shared.GetArray(botRole,[]); //[port,serial,name,roleArrName]
                    for(var i=0;i<roleArr.length;i++) // check for duplicates of each bot in the array
                        {
                        var bot = roleArr[i];
                        if(botSerial == bot[1] && botPort == bot[0]) 
                            {//if botSerial and botPort match a bot already in the array, just skip
                            skip = true;
                            break;
                            }
                        else if(botPort == bot[0])
                            {//if botPort matches but botSerial doesn't, this port needs to be overwritten with the correct bot
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
                            skip = true;
                            break;
                            }
                        else if(botSerial == bot[1])
                            {//if botSerial matches but botPort doesn't, this port needs to be overwritten with the correct bot
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
                            skip = true;
                            break;
                            }
                        }
                    if(!skip)
                        { //if the bot isn't in the array, add it.
                        roleArr.push([botPort,botSerial,botName,botRole]);
                        Shared.AddArray(botRole,roleArr);
                        }
                    Orion.UdpSend(+botPort,'Heard:' + Player.Name()); //send signal back to bot so they know they're connected
					break;
				// case '':
				// 	break;
				case '':
					break;
				case undefined:
					break;
				default:
                    Orion.Print('Error: Unrecognized Command: ' + recvSplit[0]);
                    break;
				}
			}
		Orion.Wait(100);
		}
	}

function AliComFollower()
	{
    // Bot Commands
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

    function Follow(leaderSerial,distance)
        {
        do
            {
            var leaderObj = Orion.FindObject(leaderSerial);
            Orion.CharPrint(self,1159,'Searching for Leader to follow...')
            Orion.Wait(200);
            } while(!leaderObj)
        if(distance == undefined)
            distance = 1;
        while(true)
            {
            var toggle = Shared.GetVar('Follow');
            if(toggle)
                {
                var leader = Shared.GetVar('Leader')
                if(leader && leaderObj.Exists() && leaderObj.Distance() > distance)
                    Orion.WalkTo(leaderObj.X(),leaderObj.Y(),leaderObj.Z(),distance,10,1,1);
                }
            Orion.Wait(100);
            }
        }

    function TerminateAll(_)
        {
        Orion.PauseScript('all','JournalScan|FollowerComs');
        Orion.Wait(250);
        Orion.Terminate('all','JournalScan|FollowerComs');
        }
    
    //Main Logic
    var cmdsObj = 
        {
        'Init': Init,
        'Follow': Follow, //leaderSerial:distance
        'TerminateAll': TerminateAll
        }
	Orion.RemoveAllUdpServers();
	var port = 39999;
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
    if(Orion.SkillValue('Archery') >= 1000)
        var role = 'archer';
    else if(Orion.SkillValue('Mysticism') > 700 || Orion.SkillValue('Magery') >= 700)
        var role = 'healer';
    else if(Orion.SkillValue('Swordsmanship') >= 1000)
        var role = 'dexxer';
    else
        var role = 'misc';
    Shared.Var('myRole',role);
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self,1159,'Sending signal to leader');
    Orion.UdpSend(42420,'Check:' + playerString + ':' + port); //[cmd,[playerSerial,playerName,role],port]
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
            Orion.UdpSend(42420,'Check:' + playerString + ':' + port);
            pulseTime = Orion.Now() + 5000;
            }
        }
    Orion.CharPrint(self,1159,'Connected to leader: ' + split[1]);
    while(true)
        {
        Orion.Wait(100);
        var recv = Orion.UdpRecv('Coms');
        if(recv)
            {
            Orion.Print('CommandString: ' + recv) //'cmd:arg1:arg2:arg3:etc'
            var recvSplit = Orion.Split(recv,':');
            if(!recvSplit.length)
            	continue;
            Orion.Print('Command: ' + recvSplit[0]);
            var functionString = recvSplit.shift();
            var callFunction = cmdsObj[functionString];
            if(callFunction)
                callFunction.apply(null,recvSplit);
            else
            	Orion.Print('Command unrecognized: ' + functionString)
            }
		}
	}


//--# Leader Commands
function MiscFollowMe()
	{
    MassMessage('misc','Follow:' + Player.Serial());
	}

function MassMessage(role,msg)
    {
    var roleArr = Shared.GetArray(role,[]);  //[botPort,botSerial,botName]
    if(!roleArr[0])
        return Orion.CharPrint(self,1159,'No followers to command');
    for(var i = 0;i<roleArr.length;i++)
        Orion.UdpSend(roleArr[i][0],msg);
    }




