function AliSafeStarter()
    {
    var uncheckedHue = 1159;
    var checkedHue = 1152;
    Orion.RemoveDisplayTimer('idleTimer');
    Orion.ClearFakeMapObjects();
    var safesHash = {};
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',searchDistance).filter(function(safe)
        {
        var safeSerial = safe.Serial();
        Orion.TestItemColor(safeSerial,uncheckedHue);
        return !safesHash[safeSerial];    
        }).sort(function(a,b)
            {
            return a.Distance() - b.Distance();
            });
    for(var i=0;i<safes.length;i++)
        {
        var safe = safes[i];
        var safeSerial = safe.Serial();
        var safeX = safe.X();
        var safeY = safe.Y();
        AvoidTeleporters();
        Orion.CharPrint(self,1159,'Safes Checked: ' + i + '/' + safes.length);
        while(safe.Distance() > 5)
            {
            Orion.WalkTo(safeX,safeY,0,2);
            Orion.Wait(500);
            }
        var anyGump = Orion.GetGump(any);
        while(anyGump)
            {
            Debug('Closing gump: ' + anyGump.ID());
            anyGump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            anyGump = Orion.GetGump(any);
            }
        var itemCooldown = Orion.Now();
        while(!Orion.GumpExists('generic', safeSerial, '0x000F3ED6'))
            {
            Debug('Catching Gump');
            Orion.Wait(1300 - (Orion.Now() - itemCooldown))
            Orion.UseObject(safeSerial);
            itemCooldown = Orion.Now();
            Orion.WaitForGump(1300);
            }
        var gump = Orion.GetGump(any, '0x000F3ED6');
        var commandList = gump.CommandList();
        if(commandList && commandList.join().indexOf(' 1156414 ') > -1)
            {
            while(Orion.DisplayTimerExists('idleTimer'))
                {
                if(Orion.Timer('StayLoggedIn') > 60000)
                    {
                    Orion.UseObject(backpack);
                    Orion.SetTimer('StayLoggedIn');
                    }
                Orion.Wait(500);
                }
            Debug('Attempting to start auction');
            var journalStart = Orion.Now();
            gump.Select(Orion.CreateGumpHook(106));
            var journalCheck = Orion.WaitJournal('before starting a new auction.', journalStart, journalStart + 3000, 'sys|oa');
            Debug('journalCheck: ' + journalCheck);
            if(journalCheck)
                {
                var seconds = Number(journalCheck.Text().match(/\d+/));
                Debug('Cooldown: ' + seconds + 's')
                if(seconds > 0)
                    {
                    Orion.AddDisplayTimer('idleTimer', seconds * 1000, 'AboveChar', 'Circle|bar', 'Waiting for Idle Timer')
                    Orion.SetTimer('StayLoggedIn');
                    Orion.Wait(200);
                    }
                Debug('Safe Started: ' + safeSerial);
                Orion.TestItemColor(safeSerial,checkedHue);
                safesHash[safeSerial] = true;
                }
            else
                {
                gump = Orion.GetGump(any, '0x000F3ED6');
                commandList = gump.CommandList();
                if(commandList.join().indexOf(' 1156415 ') > -1)
                    {
                    Debug('Safe Started: ' + safe[0]);
                    Orion.TestItemColor(safeSerial,checkedHue);
                    safesHash[safeSerial] = true;
                    }
                else
                    {
                    Debug('Timed out, trying again');
                    i--;
                    Orion.Wait(200);
                    continue;
                    }
                }
            }
        else
            {
            Orion.TestItemColor(safeSerial,checkedHue);
            Debug('Auction already started');
            }
        }
    }