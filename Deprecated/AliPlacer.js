var houseCode = [2, 5100];
var houseTargetCoords = [0,0,0];

function GetTargetCoords()
	{
	var x = SelectedTile.X();
	var y = SelectedTile.Y();
	var z = SelectedTile.Z();
	var str = '[' + x + ',' + y +',' + z + ']';
	TextWindow.Open();
	TextWindow.Print(str);
	Orion.CopyToClipboard(str);
	//Shared.AddArray('coords', [x,y,z]);
	}

function Dom()
	{
	Orion.RemoveAllUdpServers();
	Orion.CreateUdpServer('Dom', 50000);
	var create = Orion.CreateUdpServer('Dom', 50000);
    if(create == 0)
    	Orion.Print('Server Creation Success');
    else
    	return Orion.Print('Server Creation Fail');
    var playerList = [];
	var namesStr = '';
 	for(var i=50001;i<50051;i++)
 		{
 		Orion.UdpSend(i,'Report')
        Orion.Wait(1);
 		}
	Orion.Wait(200);
	var recv = Orion.UdpRecv('Dom');
	while(recv)
		{
		var recvSplit = Orion.Split(recv, ':');
		playerList.push(+recvSplit[0]);
		namesStr += recvSplit[1] + '\n';
		recv = Orion.UdpRecv('Dom');
        Orion.Wait(10);
		}
	if(!playerList.length)
		return Orion.CharPrint(self,1159,'No Subs Connected! Halting...');
 	var interval = 16000/playerList.length;
 	Orion.Print(namesStr + 'Players: ' + playerList.length + '\nInterval: ' + interval + 'ms')
 	while(true)
		{
		var timeStamp = Orion.Now();
		var player = playerList.shift()
	    playerList.push(player);
	    Orion.Print(player)
	   	Orion.UdpSend(player, 'Place')
	    Orion.Wait(interval);
		var recv = Orion.UdpRecv('Dom');
		if(recv)
			return Orion.Print(recv);
		Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
	    }
	}

function Sub()
	{
	var gump = Orion.GetGump(any);
	while(gump)
		{
		Orion.Print(gump.ID());
		gump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(200);
		gump = Orion.GetGump(any);
		}
	Orion.RemoveAllUdpServers();
	var i = 50000;
	var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
    	{
        create = Orion.CreateUdpServer('Dom', ++i);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + i);
	var timeStamp = Orion.Now();
	while(true) 
    	{
        var recv = Orion.UdpRecv('Dom');
        if(recv.length)
            {
            if(recv == 'Place')
				{
				Orion.Print('Interval: ' + (Orion.Now() - timeStamp) + 'ms');
				timeStamp = Orion.Now();
				HouseTarget();
				if(HousePlace())
					{
					Orion.ActivateClient();
					return Orion.UdpSend(50000, i + ':' + Player.Name());
					}
				}
            else if(recv == 'Report')
            	{
            	Orion.Print('Sending Report');
            	Orion.UdpSend(50000, i + ':' + Player.Name());
            	continue;
            	}
            }
		else
			HouseTarget();
    	Orion.Wait(10);
        }
	}

function TimeoutTest()
	{
	while(true)
		{
		var timeStamp = Orion.Now();
		var tool = Orion.FindType('0x14F6')[0];
		if(!tool)
			return Orion.CharPrint(self,1159,'Placement Tool Missing!')
		Orion.UseObject(tool);
		if(Orion.WaitForGump(2000))
			{
			var gump = Orion.GetGump(tool, '0x000001D0');
			if(gump !== null)
				{
				gump.Select(Orion.CreateGumpHook(houseCode[0]));
				Orion.Wait(200);
				}
			}
		if(Orion.WaitForGump(2000))
			{
			var gump = Orion.GetGump(tool, '0x000001D0');
			if(gump !== null)
				{
				gump.Select(Orion.CreateGumpHook(houseCode[1]));
				Orion.Wait(200);
				}
			}
		if(Orion.WaitForTarget(2000))
			HousePlace()
		Orion.Wait(16000);
		Orion.Print('Interval: ' + (Orion.Now() - timeStamp) + 'ms')
		}
	}

function HouseTarget()
	{
	if(Orion.HaveTarget() || Orion.WaitForTarget(300))
		return true;
	var tool = Orion.FindType('0x14F6')[0];
	if(!tool)
		return Orion.CharPrint(self,1159,'Placement Tool Missing!')
	var gump = Orion.GetGump(any);
	while(gump)
        {
		if(gump.ID() == '0x000001EC')
			return true;
        Orion.Print(gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
		gump = Orion.GetGump(any);
    	}
	Orion.UseObject(tool);
	if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump(tool, '0x000001D0');
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(houseCode[0]));
			Orion.Wait(200);
			}
		}
	if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump(tool, '0x000001D0');
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(houseCode[1]));
			Orion.Wait(200);
			}
		}
	if(Orion.WaitForTarget(2000))
		return true;
	return HouseTarget();
	}

function HousePlace()
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
				Orion.Wait(100);
				}
			if(Orion.WaitForGump(2000))
				{
				gump = Orion.GetGump(any, '0x000001D0');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(0));
					Orion.Wait(100);
					}
				}
			}
		}
	var gump = Orion.GetGump(any);
	while(gump)
        {
        Orion.Print(gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
		gump = Orion.GetGump(any);
    	}
	return false;
	}


function testservers()
	{
	Orion.Print(Orion.UdpServersList())
	}
function removeudp()
	{
	Orion.RemoveAllUdpServers();
	}