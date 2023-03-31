var houseCode = [3, 5243];
var houseTargetCoords = [0,0,0];

function EtherealPlace()
	{
	var ethy = Orion.FindTypeEx(any).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'Ethereal')
		})[0];
	if(!ethy)
		return Orion.CharPrint(self,1159,'No ethy found! Halting...');
	var ethySerial = ethy.Serial();
	while(true)
		{
		var startTime = Orion.Now();
		Orion.UseObject(ethySerial);
		var check = Orion.WaitJournal('You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1500, 'sys|item')
		if(check)
			{
			var checkText = check.Text();
			if(checkText == 'You cannot use this while mounted.')
				{
				break;
				}
			else if(checkText == 'You cannot cast spells here.')
				{
				Orion.Wait(1);
				}
			}
		Orion.Wait(100);
		}
	TextWindow.Open();
	TextWindow.Print(Orion.Time())
	}

function RecallPlace()
	{
	while(true)
		{
		var startTime = Orion.Now();
		Orion.Cast('Recall');
		var check = Orion.WaitJournal('You cannot teleport from here to the destination.|Kal Ort Por', startTime, Orion.Now() + 1500, 'sys|my')
		if(check)
			{
			var checkText = check.Text();
			if(checkText == 'Kal Ort Por')
				{
				break;
				}
			else if(checkText == 'You cannot teleport from here to the destination.')
				{
				Orion.Wait(1);
				}
			}
		Orion.Wait(10);
		}
	TextWindow.Open();
	TextWindow.Print(Orion.Time())
	}

function ReactivePlace()
	{
	Orion.WaitForAddObject('myTarget');
	var triggerSerial = Orion.GetSerial('myTarget');
	Orion.Wait(2000);
	var tool = Orion.FindType('0x14F6')[0];
	if(!tool)
		return Orion.CharPrint(self,1159,'Placement Tool Missing!')
	while(Orion.FindObject(triggerSerial))
		{
		Orion.Wait(1);
		if(!Orion.HaveTarget())
			{
			Orion.UseObject(tool);
			if(Orion.WaitForGump(2000))
				{
				var gump = Orion.GetGump(any, '0x000001D0');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(houseCode[0]));
					Orion.Wait(200);
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
				}
			else
				continue;
			Orion.WaitForTarget(2000);
			}
		}
	Orion.TargetTile('any', houseTargetCoords[0], houseTargetCoords[1], houseTargetCoords[2]);
	}


function Autostart()
	{
	while(!Orion.GumpExists('container',backpack))
		{
		Orion.UseObject(backpack);
		Orion.Wait(1300);
		}
	Orion.Exec('Sub',true);
	}

function Dom()
	{
	Orion.RemoveAllUdpServers();
	var create = Orion.CreateUdpServer('Dom', 50000);
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
	var recv = Orion.UdpRecv('Dom');
	while(recv)
		{
		var recvSplit = Orion.Split(recv, ':');
		playerList.push(+recvSplit[0]);
		namesStr += recvSplit[1] + '\n';
        Orion.Wait(10);
		recv = Orion.UdpRecv('Dom');
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
	   	Orion.UdpSend(player, 'P')
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
		Orion.Print('Closing gump: ' + gump.ID());
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
    Orion.Wait(2000);
	var tool = Orion.FindType('0x14F6')[0];
	if(!tool)
		return Orion.CharPrint(self,1159,'Placement Tool Missing!')
	Orion.UseObject(tool);
    Orion.Wait(1000);
	var timeStamp = Orion.Now();
	while(true) 
    	{
		if(!Orion.GetGump(any, '0x000001D0')) //new
			Orion.UseObject(tool);
        var recv = Orion.UdpRecv('Dom');
        if(recv.length)
            {
            if(recv == 'P')
				{
				if(HousePlace())
					{
					Orion.ActivateClient();
					return Orion.UdpSend(50000, i + ':' + Player.Name());
					}
				Orion.Print('Interval: ' + (Orion.Now() - timeStamp) + 'ms');
				timeStamp = Orion.Now();
				}
            else if(recv == 'R')
            	{
            	Orion.Print('Sending Report');
            	Orion.UdpSend(50000, i + ':' + Player.Name());
				Orion.Wait(500);
            	}
            }
    	Orion.Wait(10);
        }
	}



function EthyChecker()
	{
	var ethy = Orion.FindTypeEx(any).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'Ethereal')
		})[0];
	if(!ethy)
		return Orion.CharPrint(self,1159,'No ethy found! Halting...');
	var ethySerial = ethy.Serial();
	while(true)
		{
		var startTime = Orion.Now();
		Orion.UseObject(ethySerial);
		var check = Orion.WaitJournal('You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1500, 'sys|item')
		if(check)
			{
			var checkText = check.Text();
			if(checkText == 'You cannot use this while mounted.')
				{
				break;
				}
			else if(checkText == 'You cannot cast spells here.')
				{
				Orion.Wait(1);
				}
			}
		Orion.Wait(100);
		}
	TextWindow.Open();
	TextWindow.Print(Orion.Time())
	}

function HousePlace()
	{
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


function TimeoutTest()
	{
	var gump = Orion.GetGump(any);
	while(gump)
		{
		Orion.Print(gump.ID());
		gump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(200);
		gump = Orion.GetGump(any);
		}
    var tool = Orion.FindType('0x14F6')[0];
    if(!tool)
        return Orion.CharPrint(self,1159,'Placement Tool Missing!');
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
	while(true)
		{
		var timeStamp = Orion.Now();
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
                }
            }
		Orion.Wait(14000);
		Orion.Print('Interval: ' + (Orion.Now() - timeStamp) + 'ms')
		}
	}

function testservers()
	{
	Orion.Print(Orion.UdpServersList())
	}
function removeudp()
	{
	Orion.RemoveAllUdpServers();
	}