function DomTest()
    {
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('DomTest', 60000);
    if(create == 0)
        Orion.Print('Server Creation Success');
    else
        return Orion.Print('Server Creation Fail');
    Orion.SetUdpServerCallback('DomTest','CallbackTest')
    }

function CallbackTest(recv)
    {
    Orion.Print(recv);
    }

function SubTest()
    {
    Orion.UdpSend('DomTest','Testing');
    }

function DomEthy()
	{
	Orion.RemoveAllUdpServers();
	var create = Orion.CreateUdpServer('DomEthy', 60000);
    if(create == 0)
    	Orion.Print('Server Creation Success');
    else
    	return Orion.Print('Server Creation Fail');
    var playerList = [];
	var namesStr = '';
 	for(var i=50001;i<50051;i++)
 		{
 		Orion.UdpSend(i,'R')
        Orion.Wait(10);
 		}
	Orion.Wait(2000);
	var recv = Orion.UdpRecv('DomEthy');
	while(recv)
		{
		var recvSplit = Orion.Split(recv, ':');
		playerList.push(+recvSplit[0]);
		namesStr += recvSplit[1] + '\n';
        Orion.Wait(10);
		recv = Orion.UdpRecv('DomEthy');
		}
	if(!playerList.length)
		return Orion.CharPrint(self,1159,'No Subs Connected! Halting...');
	playerList.sort(function(a,b)
		{
		return a - b;
		});
 	var interval = (15500/playerList.length).toFixed(0);
	TextWindow.Open();
 	TextWindow.Print('Players: ' + playerList.length + '\nInterval: ' + interval + 'ms\n' + namesStr)
	Orion.Wait(100);
 	while(true)
		{
		var timeStamp = Orion.Now();
		var player = playerList.shift()
	    playerList.push(player);
	    Orion.Print(player)
	   	Orion.UdpSend(player, 'E')
	    Orion.Wait(interval);
		var recv = Orion.UdpRecv('DomEthy');
		if(recv)
			return Orion.Print(recv);
		Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
	    }
	}

function SubEthyChecker()
	{
	var ethy = Orion.FindTypeEx(any).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'Mount Hue:')
		})[0];
	if(!ethy)
		return Orion.CharPrint(self,1159,'No ethy found! Halting...');
	var ethySerial = ethy.Serial();
	var tool = Orion.FindType('0x14F6')[0];
	if(!tool)
		return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
	var gump = Orion.GetGump(any);
	while(gump)
		{
		Orion.Print('Closing gump: ' + gump.ID());
		gump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(200);
		gump = Orion.GetGump(any);
		}
	Orion.RemoveAllUdpServers();
	var i = 60000;
	var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
    	{
        create = Orion.CreateUdpServer('DomEthy', ++i);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + i);
    Orion.Wait(2000);
	var timeStamp = Orion.Now();
	while(true) 
    	{
		if(!Orion.GetGump(any, '0x000001D0')) //new
			Orion.UseObject(tool);
        var recv = Orion.UdpRecv('DomEthy');
        if(recv.length)
            {
            if(recv == 'E')
				{
                var startTime = Orion.Now();
                Orion.UseObject(ethySerial);
                var check = Orion.WaitJournal('You cannot use this in your current form.|You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1500, 'sys|item')
                if(check)
                    {
                    var time = Orion.Time();
                    var checkText = check.Text();
                    if(checkText == 'You cannot use this while mounted.')
                        {
                        TextWindow.Open();
                        TextWindow.Print(time);
                        for(var i=65001;i<65010;i++)
                            {
                            Orion.UdpSend(i,'P');
                            }
                        break;
                        }
                    //else if(checkText == 'You cannot cast spells here.' || checkText == 'You cannot use this in your current form.')
                        //{
                        //Orion.Wait(1);
                        //}
                    }
                Orion.Wait(100);
				}
            else if(recv == 'R')
            	{
            	Orion.Print('Sending Report');
            	Orion.UdpSend(60000, i + ':' + Player.Name());
				Orion.Wait(500);
            	}
            }
    	Orion.Wait(10);
        }
	}

function SubEthyPlacer()
	{
    var tool = Orion.FindType('0x14F6')[0];
	if(!tool)
		return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
	var gump = Orion.GetGump(any);
	while(gump)
		{
		Orion.Print('Closing gump: ' + gump.ID());
		gump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(200);
		gump = Orion.GetGump(any);
		}
	Orion.RemoveAllUdpServers();
	var i = 65000;
	var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
    	{
        create = Orion.CreateUdpServer('DomEthy', ++i);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + i);
    Orion.Wait(2000);
	while(true) 
    	{
        if(!Orion.HaveTarget())
            EthyHouseTarget();
        var recv = Orion.UdpRecv('DomEthy');
        if(recv.length)
            {
            if(recv == 'P')
				{
				if(EthyHousePlace())
					{
					Orion.ActivateClient();
					return Orion.UdpSend(60000, i + ':' + Player.Name());
					}
                else
                    break;
				}
            }
    	Orion.Wait(1);
        }
	}

function EthyPlacerCallback(recv)
    {
    //if(recv == 'P')
        //{
        if(EthyHousePlace())
            {
            Orion.ActivateClient();
            return Orion.UdpSend(60000, i + ':' + Player.Name());
            }
        //}
    }

function EthyHouseTarget()
	{
    if(!Orion.GetGump(any, '0x000001D0'))
        {
        var tool = Orion.FindType('0x14F6')[0];
        if(!tool)
            return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
        Orion.UseObject(tool);
        Orion.WaitForGump(2000);
        }
    if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump(any, '0x000001D0');
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(houseCode[0]));
			Orion.Wait(200);
			}
		}
	if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump(any, '0x000001D0');
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(houseCode[1]));
			Orion.Wait(200);
			}
		}
    Orion.WaitForTarget(2000);
	}

function EthyHousePlace()
    {
    Orion.TargetTile('any', houseTargetCoords[0], houseTargetCoords[1], houseTargetCoords[2]);
	if(Orion.WaitForGump(5000))
		{
		var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(1));
			Orion.Wait(200);
			return true;
			}
		else
			{
			gump = Orion.GetGump(any, '0x000001D0');
			if(gump !== null)
				{
				gump.Select(Orion.CreateGumpHook(0));
				Orion.Wait(200);
                return false;
				}
			}
		}
    }