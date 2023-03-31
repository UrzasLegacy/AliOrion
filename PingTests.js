function ping()
    {
    TextWindow.Open()
    var ethy = Orion.FindTypeEx(any).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Mount Hue:')
        })[0];
    if(ethy) var ethySerial = ethy.Serial();
    while(true)
        {
        var startTime = Orion.Now();
        Orion.UseObject(ethySerial);
        var check = Orion.WaitJournal('You cannot use this while mounted.', startTime, Orion.Now() + 1500, 'sys|item')
        if(check)
            {
            TextWindow.Print((Orion.Now() - startTime) + 'ms')
            }
        Orion.Wait(2000);
        }
    }

function timetestDOMcallback()
    {
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('DomEthy', 60000);
    if(create == 0)
        Orion.Print('Server Creation Success');
    else
        return Orion.Print('Server Creation Fail');
    TextWindow.Open();
    while(true)
        {
        var recv = Orion.UdpRecv('DomEthy')
        if(recv)
            TextWindow.Print(Orion.Time());
        Orion.Wait(1);
        }
    //Orion.SetUdpServerCallback('DomEthy','timetestRecvCallback')
    }
function timetestSUBcallback()
    {
    TextWindow.Open();
    TextWindow.Print(Orion.Time())
    Orion.UdpSend(60000,'a');
    }

function timetestRecvCallback(recv)
    {
    TextWindow.Print(Orion.Time())
    }

function testTime()
    {
    var timeStamp = Orion.Now();
    var b = Orion.Time();
    Orion.Print(Orion.Now() - timestamp)
    }

    function soloCheck()
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
    Orion.Wait(2000);
    TextWindow.Open();	
    //var a = Orion.Time();
    var startTime = Orion.Now();
    Orion.UseObject(ethySerial)
    var check = Orion.WaitJournal('You cannot use this in your current form.|You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1500, 'sys|item')
    if(check)
        {
        var checkText = check.Text();
        if(checkText == 'You cannot use this while mounted.')
            {
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x000001D0');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(houseCode[1]));
                    }
                }
            Orion.WaitForTarget(2000);
            Orion.TargetTile('any', houseTargetCoords[0], houseTargetCoords[1], houseTargetCoords[2]);
            if(Orion.WaitForGump(5000))
                {
                TextWindow.Print(Orion.Now() - startTime + 'ms\n')
                var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(1));
                    Orion.UdpSend(60000, Player.Name());
                    Orion.RemoveAllUdpServers();
                    Orion.Terminate('all','GMJournalScan');
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
        }
    }
 