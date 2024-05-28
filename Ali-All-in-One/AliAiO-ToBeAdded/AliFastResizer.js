/*
keep
1,124
Coords: [2073,1254,7]

13x17
3,5182
Coords: [2054,1257,0]


13x15
3,5180
Coords: [2054,1234,0]

demolish gump buttons
gump0.Select(Orion.CreateGumpHook(501));
gump1.Select(Orion.CreateGumpHook(1));
*/

function PullUpDemolishGump()
    {
    var nearbySign = Orion.FindTypeEx(any,any,ground,"item",5).filter(function(item)
        {
        return Orion.Contains(item.Name(),"a house sign")
        }).sort(function(a,b)
            {
            return a.Distance() - b.Distance(); 
            })[0]
    if(!nearbySign)
        return Orion.CharPrint(self,1159,"No sign within 5 tiles, try again")
    var endTime = Orion.Now() + 5000;
    var demolishGump = Orion.GetGump('any','0x000009E6')
    while(nearbySign && !demolishGump)
        {
        Orion.Wait(250)
        if(Orion.Now() > endTime)
            {
            Orion.CharPrint(self,1159,"Something went wrong pulling up the demolish gump!")
            return false
            }
        var gump = Orion.GetGump('any','0x000009E5');
        if(!gump !== null)
            Orion.UseObject(nearbySign.Serial())
        if(Orion.WaitForGump(2000))
            {
            gump = Orion.GetGump('any','0x000009E5');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(104));
                Orion.Wait(200);
                if(Orion.WaitForGump(2000))
                    {
                    gump = Orion.GetGump('any','0x000009E5');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(501));
                        Orion.Wait(200);
                        }
                    }
                }
            }
        demolishGump = Orion.GetGump('any','0x000009E6')
        }
    return demolishGump
    }

function DemolishHouse()
    {
    var nearbySign = Orion.FindTypeEx(any,any,ground,"item",5).filter(function(item)
        {
        return Orion.Contains(item.Name(),"a house sign")
        }).sort(function(a,b)
            {
            return a.Distance() - b.Distance(); 
            })[0] 
    if(nearbySign)
        {
        nearbySignSerial = nearbySign.Serial()
        var gump = PullUpDemolishGump();
        if(gump)
            gump.Select(Orion.CreateGumpHook(1));
        else
            return DemolishHouse();
        var endTime = Orion.Now() + 5000;
        while(nearbySign)
            {
            if(Orion.Now() > endTime)
                {
                Orion.CharPrint(self,1159,"Something went wrong, house wasn't demolished!")
                return false;
                }
            Orion.Wait(10);
            nearbySign = Orion.FindObject(nearbySignSerial);
            }
        }
    }

function SubDemolisher()
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
    var port = 60000;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
        {
        create = Orion.CreateUdpServer('DomResizer', ++port);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + port);
    Orion.Wait(2000);
    while(true)
        {
        var recv = Orion.UdpRecv('DomResizer');
        if(recv == "R")
            {
            Orion.Print('Sending Report');
            Orion.UdpSend(60000, port + ':' + Player.Name());
            break;
            }
        Orion.Wait(500);
        }
    var check = false
    while(true) 
        {
        var recv = Orion.UdpRecv('DomResizer');
        if(recv)
            {
            if(recv == "check")
                {
                var startTime = Orion.Now();
                var endTime = startTime + 600
                //var time = Orion.Time();
                Orion.UseObject(petBallSerial);
                check = false
                while(Orion.Now() < endTime)
                    {
                    if(Player.Frozen())
                        {
                        check = true;
                        break;
                        }
                    Orion.Wait(1)
                    }
                if(check)
                    {
                    for(var i=65001;i<65010;i++)
                        {
                        Orion.UdpSend(i,Orion.Now() - startTime);
                        }
                    Orion.Wait(5)
                    for(var i=60001;i<60051;i++)
                        {
                        Orion.UdpSend(i,"stop");
                        }
                    Orion.RemoveAllUdpServers();
                    while(!Orion.BuffExists('Hiding'))
                        {
                        Orion.UseSkill('Hiding');
                        Orion.Wait(500);
                        }
                    MountMyPet()
                    return;
                    }
                }
            else if(recv == 'stop')
                {
                while(!Orion.BuffExists('Hiding'))
                    {
                    Orion.UseSkill('Hiding');
                    Orion.Wait(500);
                    }
                MountMyPet()
                break;
                }
            else if(recv == 'removeudp')
                {
                Orion.RemoveAllUdpServers();
                Orion.Terminate('all');
                }
            }
        Orion.Wait(1);
        }
    Orion.Wait(500);
    while(!Orion.BuffExists('Hiding'))
        {
        Orion.UseSkill('Hiding');
        Orion.Wait(500);
        }
    MountMyPet()
    Orion.Wait(Orion.Random(1,25) * 200);
    Orion.CloseUO();
    }