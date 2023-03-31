//Sub
function BotListen() 
	{
    var udpPort = 50000 + Player.Name().charCodeAt(0);
    //50075 == K
    //Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer(Player.Name(), udpPort);
    if (create == 0)  
        Orion.Print('UDP server created and listening port: ' + udpPort);
    else
        Orion.Print('Failed to create UDP server, port: ' + udpPort + ' error: ' + created);
    while (create == 0) 
    	{
        var recv = Orion.UdpRecv(Player.Name());
        if (recv.length) 
        	{
            var recvp = Orion.Split(recv, ':')
            if (recvp[0] == 'F') 
            	{
                //Orion.ToggleScript(
            	}
            if (recvp[0] == 'W')
            	{
                Orion.Print('Walking')
                Orion.WalkTo(recvp[1], recvp[2], 0, 0)
            	}
        	}
        else
            Orion.Wait(50);
    	Orion.Wait(50)
        }
	}

function removeudp()
	{
	Orion.RemoveAllUdpServers();
	}

//Dom
function DomListen() 
	{
    var udpPort = 55555;
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('Dom', udpPort);
    if (create == 0)  
        Orion.Print('UDP server created and listening port: ' + udpPort);
    else
        Orion.Print('Failed to create UDP server, port: ' + udpPort + ' error: ' + created);
    while (create == 0) 
    	{
        var recv = Orion.UdpRecv('Dom');
        if (recv.length) 
        	{
            var recvp = Orion.Split(recv, ':')
            if (recvp[0] == 'F') 
            	{
                Orion.Follow(recvp[1])
            	}
            if (recvp[0] == 'W')
            	{
                Orion.Print('Walking')
                Orion.WalkTo(recvp[1], recvp[2], 0, 0)
            	}
        	}
        else
            Orion.Wait(50);
    	Orion.Wait(50)
        }
	}


var botArr = [50075, 50076, 50077, 50078, 50079, 50080]
function botInit() 
    {
    botArr.forEach(function(port)
        {
        Orion.UdpSend(port, 'I')
        });
    }

function botblankcommand()
    {
    botArr.forEach(function(port)
        {
        Orion.UdpSend(port, ' ')
        });
    }

function walkToMe() {
    Orion.UdpSend(udpPort, 'W:' + Player.X() + ':' + Player.Y());
}

function walkToHere() {
    var pathLocation = SelectCoordinate();
    Orion.UdpSend(udpPort, 'W:' + pathLocation.X() + ':' + pathLocation.Y());
}


var udpPort = 2598;

function recvHelloWorld() 
	{
    while (true) 
    	{
        var recv = Orion.UdpRecv('test');

        // Result buffer (string) is not empty - package received
        if (recv.length) 
        	{
            Orion.Print('debug')
            var recvp = Orion.Split(recv, ':')
            if (recvp[0] == 'F') 
            	{
                Orion.Follow(recvp[1])
            	}
            if (recvp[0] == 'W')
            	{
                Orion.Print('Walking')
                Orion.WalkTo(recvp[1], recvp[2], 0, 0)
            	}
        	}
        else
            Orion.Wait(50);
    	}
	}

function removeudp()
	{
	Orion.RemoveAllUdpServers();
	}

var udpPort = 2598;

// UDP server with manual data handling
function ExampleUdpServerManual() {
    // Remove all UDP servers
    Orion.RemoveAllUdpServers();

    // Prepare log
    TextWindow.Open();
    TextWindow.Clear();

    // Create UDP server
    var created = Orion.CreateUdpServer('test', udpPort);

    // Result code is 0 - is created
    if (created == 0) {
        TextWindow.Print('UDP server created and listening port: ' + udpPort);

        // Trying to receive data
    }
    else
        TextWindow.Print('Failed to create UDP server, port: ' + udpPort + ' error: ' + created);
}

function followMe() {
    Orion.UdpSend(udpPort, 'F:' + Player.Serial());
}

function walkToMe() {
    Orion.UdpSend(udpPort, 'W:' + Player.X() + ':' + Player.Y());
}

function walkToHere() {
    var pathLocation = SelectCoordinate();
    Orion.UdpSend(udpPort, 'W:' + pathLocation.X() + ':' + pathLocation.Y());
}