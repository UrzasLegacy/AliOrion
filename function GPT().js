function GPT()
	{
	Orion.RemoveAllUdpServers();
	var port = 60420;
	var create = Orion.CreateUdpServer('Coms', port);
	if(create != 0)
		return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
	Orion.Print('Port: ' + port);
    Orion.UdpSend(59005,'Test')
	while(true)
		{
		var recv = Orion.UdpRecv('Coms');
		if(recv)
			{
			Orion.Print(recv);
			}
		Orion.Wait(100);
		}
	}
