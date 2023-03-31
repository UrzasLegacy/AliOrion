function AliLeaderComs()
	{
	Orion.RemoveAllUdpServers();
	var port = 60420;
	var create = Orion.CreateUdpServer('Coms','broadcast', port);
	if(create != 0)
        create = Orion.CreateUdpServer('Coms','broadcast', ++port);
    
	Orion.Print('Port: ' + port);
	while(true)
		{
		var recv = Orion.UdpRecv('Coms');
		if(recv)
			{
            Orion.Print(recv)
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

function sendUDP()
    {
    Orion.UdpSend('broadcast','hello')
    }