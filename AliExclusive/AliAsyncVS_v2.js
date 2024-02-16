var orders = [
    'Parox Dragon',
    'Serpent Skin Quiver',
	'Mushroom Cultivator Apron',
	'Corp Mani Xen',
	'Solaria Secret Poison',
	'Ankh of Devotion',
	'Decorative Plinth',
	'Scabbard of',
	'Mantle of Archlich',
    'Commodity Deed Box',
    'Character Transfer Token',
]

function AliVSLeader() {
    Orion.RemoveAllUdpServers();
    var port = 60420;
    var create = Orion.CreateUdpServer('Coms', port);
    if (create != 0)
        return Orion.CharPrint(self, 1159, 'Server Creation Failed: ' + create);
    Orion.Print('Port: ' + port);
    TextWindow.Open();
    var searchTerm = 0;
    var outMsg = '';
    while (true) {
        var recv = Orion.UdpRecv('Coms');
        if (recv) {
            Orion.Print(recv)
            var recvSplit = Orion.Split(recv, '!');
            switch (recvSplit[0]) {
                case 'Request':
                    var botPort = recvSplit[1];
                    var resultStr = recvSplit[2];
                    if (resultStr) {
                        TextWindow.Print(resultStr);
                        outMsg += resultStr + '\n';
                    }
                    if (searchTerm < orders.length)
                        Orion.UdpSend(botPort, 'Search!' + orders[searchTerm++]);
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

function AliVSFollower() {
    Orion.RemoveAllUdpServers();
    var port = 59999;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while (create != 0 && Orion.Now() < endTime && port < 60099) {
        create = Orion.CreateUdpServer('Coms', ++port);
        Orion.Wait(10);
    }
    if (create != 0)
        return Orion.CharPrint(self, 1159, 'Server Creation Failed: ' + create);
    Orion.Print('Port: ' + port);
    Orion.Wait(200);
    Orion.UdpSend(60420, 'Request!' + port);
    while (true) {
        var recv = Orion.UdpRecv('Coms');
        if (recv) {
            Orion.Print('CommandString: ' + recv);
            var recvSplit = Orion.Split(recv, '!');
            var command = recvSplit[0];
            if (command != 'Search') {
                if (command == 'Stop')
                    return;
                continue;
            }
            var searchTerm = recvSplit[1];
            var outMsg = searchTerm + ': ';
            Orion.Print('Command: ' + command);
            var result = VSsearch(searchTerm);
            if(result[0] == 'No items matched')
                outMsg += 'No items matched';
            else
                outMsg += JSON.stringify(result);
            Orion.UdpSend(60420, 'Request!' + port + '!' + outMsg);
        }
        Orion.Wait(100);
    }
}

function VSsearch(text)
	{
    CloseGumps();
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8');
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8');
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList();
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseGumps();
			return ['No items matched'];
			}
		}
	else
		{
		return VSsearch(text);
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9');
	if(vendorSearchResults)
		{
		Orion.RemoveDisplayTimer('searchWait');
		var cmdList = vendorSearchResults.CommandList();
		var prices = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1043304');
			}).map(function(cmdLine)
				{
				var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1];
				var commaNeg = numberString.replace(/,/g, "");
				return +commaNeg;
				});
		}
	CloseGumps();
	return prices;
	}

function WaitForSpecificGump(delay, type, serial, id)
    {
    var deltaTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < deltaTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }

function CloseGumps()
	{
	var vendorSearchResults = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC9');
	if(vendorSearchResults)
		{
		vendorSearchResults.Select(Orion.CreateGumpHook(0));
		Orion.Wait(100);
		}
	var vendorSearchGump = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC8');
	if(vendorSearchGump)
		{
		vendorSearchGump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(100);
		}
	}