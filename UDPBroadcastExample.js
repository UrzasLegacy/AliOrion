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
			}
		Orion.Wait(100);
		}
	}

function sendUDP()
    {
    Orion.UdpSend('broadcast',60420,'hello')
    }