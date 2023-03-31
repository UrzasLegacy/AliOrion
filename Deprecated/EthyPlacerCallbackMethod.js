var houseCode = [3, 5243];
var houseTargetCoords = [775,736,0];

var serialIndex = 1;
var buttons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
    [
        [ [100, 30, serialIndex++, "Dom", 'DomEthy'] ],
        [],
        [ [100, 30, serialIndex++, "Checker", "SubEthyChecker"], [100, 30, serialIndex++, "Placer", "SubEthyPlacer"]],
    ]

function Autostart()
	{
	while(!Orion.GumpExists('container',backpack))
		{
		Orion.UseObject(backpack);
		Orion.Wait(1300);
		}
	Orion.Exec('GMJournalScan',true);
	Gump();
	}

function Gump()
    {
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, buttons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(gridX(column), gridY(row), '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(gridTX(column), gridTY(row), '0', button[3]);
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
            if (button[2] == code)
                {
                Orion.Print('Toggle ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function gridX(x){
    return x * 105 + 4
    }
function gridY(y){
    return y * 29 + 2
    }
function gridTX(x){
    return x * 105 + 10
    }
function gridTY(y){
    return y * 29 + 6
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
 	for(var i=60001;i<60051;i++)
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
 	var interval = (1200/playerList.length).toFixed(0);
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
			return TextWindow.Print(recv);
		Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
	    }
	}

function SubEthyChecker()
	{
	var ethy = Orion.FindTypeEx(any).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'Mount Hue:')
		})[0];
	if(ethy) var ethySerial = ethy.Serial();
	if(!ethySerial)
		return Orion.CharPrint(self,1159,'No ethy found! Halting...');
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
	var port = 60000;
	var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
    	{
        create = Orion.CreateUdpServer('DomEthy', ++port);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + port);
    Orion.Wait(2000);
    while(true)
        {
        var recv = Orion.UdpRecv('DomEthy');
        if(recv)
            {
            Orion.Print('Sending Report');
            Orion.UdpSend(60000, port + ':' + Player.Name());
            break;
            }
        Orion.Wait(500);
        }
	while(true) 
    	{
		var startTime = Orion.Now();
		var time = Orion.Time();
		Orion.UseObject(ethySerial);
		var check = Orion.WaitJournal('You cannot use this in your current form.|You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1000, 'sys|item')
		if(check)
			{
			if(check.Text() == 'You cannot use this in your current form.')
				{
				for(var i=65001;i<65010;i++)
					{
					Orion.UdpSend(i,time + ' ::: Ethy Ping: ' + (Orion.Now() - startTime) + 'ms');
					}
				Orion.RemoveAllUdpServers();
				break;
				}
			Orion.Wait(1);
			}
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
    //Orion.SetUdpServerCallback('DomEthy','EthyPlacerCallback');
	while(true) 
    	{
		var recv = Orion.UdpRecv('DomEthy');
		if(recv)
			{
			var startTime = Orion.Now();
			Orion.TargetTile('any', houseTargetCoords[0], houseTargetCoords[1], houseTargetCoords[2]);
			Orion.UdpSend(60000, Player.Name());
			if(Orion.WaitForGump(5000))
				{
				var time = Orion.Time();
				TextWindow.Open();
				TextWindow.Print(recv + '\n' + time + ' ::: Place Ping: ' + (Orion.Now() - startTime) + 'ms\n')
				var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(1));
					Orion.RemoveAllUdpServers();
					break;
					}
				else
					{
					gump = Orion.GetGump(any, '0x000001D0');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(0));
						}
					}
				}
			}
        else if(!Orion.HaveTarget())
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
    	Orion.Wait(1);
        }
	}

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{	
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}

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