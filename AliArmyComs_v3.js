//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliGumpHUD.js
var leaderSerial = '0x02F4684A';

function followme()
	{
	FollowerMassMessage('Follow:0');
	}

function allinit()
	{
	FollowerMassMessage('Init');
	}
    
function allterminate()
	{
	FollowerMassMessage('TerminateAll');
	}
    
var profiles = 
    {
    Primeval: 
        {
        farmType: 'Mobile', //false, 'Static' , 'Mobile' , 'Leash'
        useGatherMobs: true, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
        mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
		useOnslaught: false,
        useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useEnemyOfOne: false, //true , false.
        useCounterAttack: true, //true , false.
        useConsecrateWeapon: true, //true , false.
        useDivineFury: true, //true , false.
        useAutoLoot: false, //true, false.
        useConfidence: true, //true , false.
            useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
        useBandieSelf: false, //true , false.
            useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
        useBandieOthers: false, //true , false.
            useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
        },
    }

function Autostart()
    {
    var startTime = Orion.Now();
    var endTime = startTime + 5000;
    while(!Orion.GumpExists('container',backpack))
        {
        if(Orion.Now() > endTime)
            {
            Orion.CharPrint(self,1159,'Backpack didnt open');
            break;
            }
        Orion.UseObject(backpack);
        Orion.Wait(1000);
        }
    if(Player.Serial() == leaderSerial)
        Orion.Exec('AliComLeader',true);
    else
        Orion.Exec('AliComFollower',true);
    }

function checkarr()
    {
    Orion.Print(Shared.GetArray('followerArr'))
    }

var profile = profiles.Primeval;
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
            Orion.Print('recv: ' + recv);
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
                            {//if botPort matches but botSerial doesn't, this port needs to be overwritten with the correct bot
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
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
                Orion.Exec(functionString,true,recvSplit)
            else
                Orion.Print('Command unrecognized: ' + functionString)
            }
		}
	}

var cmdsObj = {
    'Init': Init,
    'Follow': Follow,
    'TerminateAll': TerminateAll
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
        Orion.Exec('AliComLeader',true);
        }
    else if(Orion.SkillValue('Swordsmanship') >= 100)
        {
        Orion.Exec('AliComFollower',true);
        Orion.Exec('AutoAttack',true);
        Orion.Exec('AutoBuffs',true);
        if(profile.useBandieSelf || profile.useBandieOthers)
            Orion.Exec('BandieBot',true);
        }
    }

function Follow(distance)
    {
    do
        {
        var leaderObj = Orion.FindObject(leaderSerial);
        Orion.Wait(200);
        Orion.Print(false)
        } while(!leaderObj)
    if(distance == undefined)
        distance = 1;
    else
        distance = +distance;
    while(true)
        {
        if(leaderObj && leaderObj.Exists() && leaderObj.Distance() > distance)
            Orion.WalkTo(leaderObj.X(),leaderObj.Y(),leaderObj.Z(),distance,10,1,1);
        Orion.Wait(100);
        }
    }

function TerminateAll()
    {
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|TerminateAll');
    Orion.Wait(250);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|TerminateAll');
    }