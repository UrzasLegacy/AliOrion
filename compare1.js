function DomEthy()
    {
    Orion.Exec('GMJournalScan',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('DomEthy', 60000);
    if(create == 0)
        Orion.Print('Server Creation Success');
    else
        return Orion.Print('Server Creation Fail');
    while(fullAuto && !Orion.UdpRecv('DomEthy'))
        {
        Orion.Wait(500);
        }
    for(var i=60001;i<60051;i++)
        {
        Orion.UdpSend(i,'R')
        Orion.Wait(10);
        }
    Orion.Wait(2000);
    var playerList = [];
    var namesStr = '';
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
    var interval = (1250/playerList.length).toFixed(0);
    TextWindow.Open();
    TextWindow.Print('Players: ' + playerList.length + '\nInterval: ' + interval + 'ms\n' + namesStr)
    Orion.Wait(100);
    while(true)
        {
        //var timeStamp = Orion.Now();
        var player = playerList.shift()
        playerList.push(player);
        //Orion.Print(player)
        Orion.UdpSend(player, 'E')
        Orion.Wait(interval);
        var recv = Orion.UdpRecv('DomEthy');
        if(recv)
            {
            TextWindow.Print(recv);
            break;
            }
        Orion.Print('Running');
        //Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
        }
    if(fullAuto)
        {
        Orion.Wait(Orion.Random(1,25) * 200);
        Orion.CloseUO();
        }
    }

function SubEthyChecker()
    {
    Orion.Exec('GMJournalScan',true);
    var ethy = Orion.FindTypeEx(any).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Mount Hue:')
        })[0];
    if(ethy) var ethySerial = ethy.Serial();
    if(!ethySerial)
        return Orion.CharPrint(self,1159,'No ethy found! Halting...');
    while(!Orion.BuffExists('Animal Form'))
        {
        Orion.Cast('Animal Form');
        if(Orion.WaitForGump(5000))
            {
            var gump = Orion.GetGump('any', '0x00002336');
            if(gump !== null)
                {
                var buttons = gump.ButtonList().filter(function(button)
                    {
                    return Orion.Contains(button, 'buttontileart');
                    }).length;
                gump.Select(Orion.CreateGumpHook(98 + buttons));
                Orion.Wait(200);
                }
            }
        Orion.Wait(500);
        }
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
        var recv = Orion.UdpRecv('DomEthy');
        if(recv)
            {
            var startTime = Orion.Now();
            //var time = Orion.Time();
            Orion.UseObject(ethySerial);
            var check = Orion.WaitJournal('You cannot use this in your current form.|You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1000, 'sys|item')
            if(check)
                {
                if(check.Text() == 'You cannot use this in your current form.')
                    {
                    for(var i=65001;i<65010;i++)
                        {
                        Orion.UdpSend(i,'Ethy Ping: ' + (Orion.Now() - startTime) + 'ms');
                        }
                    Orion.RemoveAllUdpServers();
                    break;
                    }
                }
            if(recv == 'removeudp')
                {
                Orion.RemoveAllUdpServers();
                Orion.Terminate('all');
                }
            }
        Orion.Wait(1);
        }
    Orion.Wait(500);
    if(fullAuto)
        {
        Orion.Wait(Orion.Random(1,25) * 200);
        Orion.CloseUO();
        }
    }