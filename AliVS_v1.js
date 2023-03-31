var orders = [

]

function AliVSOrders() {
    var followers = Shared.GetArray('followerArr', false);
    if (!followers)
        return Orion.CharPrint(self, 1159, 'No followers to command');9
}

function AliVSLeader() {
    Orion.RemoveAllUdpServers();
    var port = 60420;
    var create = Orion.CreateUdpServer('Coms', port);
    if (create != 0)
        return Orion.CharPrint(self, 1159, 'Server Creation Failed: ' + create);
    Orion.Print('Port: ' + port);
    var searchTerm = 0;
    var outMsg = '';
    while (true) {
        var recv = Orion.UdpRecv('Coms');
        if (recv) {
            var recvSplit = Orion.Split(recv, ':');
            switch (recvSplit[0]) {
                case 'Check': // "cmd:playerSerial!playerName!role:port"
                    var botString = recvSplit[1];
                    var botPort = +recvSplit[2];
                    var botSplit = Orion.Split(botString, '!'); //playerSerial + '!' + Player.Name() + '!' + roleArrName
                    var botSerial = botSplit[0];
                    var botName = botSplit[1];
                    var botRole = botSplit[2];
                    var skip = false;
                    var roleArr = Shared.GetArray(botRole, []); //[port,serial,name,roleArrName]
                    for (var i = 0; i < roleArr.length; i++) {
                        var bot = roleArr[i];
                        if (botSerial == bot[1] && botPort == bot[0]) {
                            skip = true;
                            break;
                        }
                        else if (botPort == bot[0]) {
                            roleArr[i] = [botPort, botSerial, botName, botRole];
                            Shared.AddArray(botRole, roleArr);
                            skip = true;
                            break;
                        }
                    }
                    if (!skip) {
                        roleArr.push([botPort, botSerial, botName, botRole]);
                        Shared.AddArray(botRole, roleArr);
                    }
                    Orion.UdpSend(+botPort, 'Heard:' + Player.Name());
                    break;
                case 'Request':
                    var botPort = recvSplit[1];
                    var resultStr = recvSplit[2];
                    if (resultStr) {
                        TextWindow.Print(resultStr);
                        outMsg += resultStr + '\n';
                    }
                    var tempArr = Shared.GetArray('followerArr',[]);
                    var currentFollower = tempArr.shift();
                    tempArr.push(currentFollower);
                    Shared.AddArray('followerArr',tempArr);
                    searchTerm
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
    var playerSerial = Player.Serial();
    var role = 'followerArr';
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self, 1159, 'Sending signal to leader');
    Orion.UdpSend(60420, 'Check:' + playerString + ':' + port); //[cmd,[playerSerial,playerName,role],port]
    Orion.Wait(200);
    var pulseTime = Orion.Now() + 5000;
    while (true) {
        recv = Orion.UdpRecv('Coms');
        if (recv) {
            var split = Orion.Split(recv, ':');
            if (split[0] == 'Heard')
                break;
        }
        Orion.Wait(100);
        if (Orion.Now() > pulseTime) {
            Orion.CharPrint(self, 1159, 'Retrying connection to leader');
            Orion.UdpSend(60420, 'Check:' + playerString + ':' + port);
            pulseTime = Orion.Now() + 5000;
        }
    }
    Orion.CharPrint(self, 1159, 'Connected to leader: ' + split[1]);
    while (true) {
        var recv = Orion.UdpRecv('Coms');
        if (recv) {
            Orion.Print('CommandString: ' + recv)
            var recvSplit = Orion.Split(recv, ':');
            if (!recvSplit[0])
                continue;
            Orion.Print('Command: ' + recvSplit[0])
            var callFunction = cmdsObj[recvSplit.shift()];
            if (callFunction)
                callFunction.apply(null, recvSplit);
            else
                Orion.Print('Command unrecognized!')
            //
        }
        Orion.Wait(100);
    }
}