function SafeStarter() //[index, itemInfoString, saleItemSerial, safeSerial, idleStatus] idleStatus is null if safe is empty and false if auction is running
    {
    Orion.RemoveDisplayTimer('idleTimer');
    Orion.ClearFakeMapObjects();
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        outArr = JSON.parse(fileString);
    if(outArr.length == 0)
        return Debug('Error reading Catalogue file');
    var changeCheck = false;
    var idleSafes = outArr.filter(function(safe)
        {
        return safe[5] === true;
        });
    idleSafes.forEach(function(safe)
        {
        Orion.TestItemColor(safe[4],'1152')
        });
    idleSafes = idleSafes.length;
    var negativeIndex = 0;
    for(var i=0;i<outArr.length;i++)
        {
        var safe = outArr[i];
        if(safe[5] !== true)
            continue;
        while(Orion.DisplayTimerExists('idleTimer'))
            {
            if(Orion.Timer('StayLoggedIn') > 60000)
                {
                Orion.UseObject(backpack);
                Orion.SetTimer('StayLoggedIn');
                }
            Orion.Wait(1000);
            }
        AvoidTeleporters(); 
        Orion.CharPrint(self,1159,'Idle Safes: ' + negativeIndex + '/' + idleSafes + '\nETA: ' + ((idleSafes - negativeIndex) * 5) + ' min')
        negativeIndex++;
        var safeObj = Orion.FindObject(safe[4]);
        if(safeObj)
            {
            while(safeObj.Distance() > 5)
                {
                Orion.WalkTo(safeObj.X(),safeObj.Y(),0,2)
                Orion.Wait(500);
                }
            var gump = Orion.GetGump(any);
            while(gump)
                {
                Debug('Closing gump: ' + gump.ID());
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                gump = Orion.GetGump(any);
                }
            Orion.Wait(200);
            startTime = 0;
            while(!Orion.GumpExists('generic', safeObj.Serial(), '0x000F3ED6'))
                {
                Debug('Catching Gump');
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safeObj.Serial());
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                }
            Debug('Caught');
            var gump = Orion.GetGump(any, '0x000F3ED6');
            var commandList = gump.CommandList();
            if(commandList && commandList.join().indexOf(' 1156414 ') > -1) //if 'Start Auction' cliloc found
                {
                var journalStart = Orion.Now();
                Debug('Attempting to start auction');
                gump.Select(Orion.CreateGumpHook(106));
                Orion.Wait(2000);
                gump = Orion.GetGump(any, '0x000F3ED6');
                if(!gump)
                    {
                    Debug('Gump timed out');
                    i--;
                    negativeIndex--;
                    Orion.Wait(200);
                    continue;
                    }
                else
                    {
                    Debug('Gump found, waiting for journal check');
                    var journalCheck = Orion.WaitJournal('before starting a new auction.|Gump choice successful.', journalStart, Orion.Now() + 3000, 'sys|oa');
                    Debug('journalCheck: ' + journalCheck);
                    if(journalCheck)
                        {
                        var journalText = journalCheck.Text();
                        Debug('journalText: ' + journalText);
                        if(journalText == 'Gump choice successful.')
                            {
                            Debug('Auction started by journalCheck, index: ' + safe[0]);
                            safe[5] = false;
                            changeCheck = true;
                            Orion.TestItemColor(safe[4],'0');
                            Orion.AddDisplayTimer('idleTimer', 300000, 'AboveChar', 'Circle|bar', 'Waiting for Idle Timer')
                            Debug('Cooldown: 300s')
                            Orion.SetTimer('StayLoggedIn');
                            Orion.Wait(200);
                            continue;
                            }
                        var seconds = Number(journalCheck.Text().match(/\d+/));
                        Debug('Cooldown: ' + seconds + 's')
                        if(seconds > 0)
                            {
                            Orion.AddDisplayTimer('idleTimer', seconds * 1000, 'AboveChar', 'Circle|bar', 'Waiting for Idle Timer')
                            Orion.SetTimer('StayLoggedIn');
                            }
                        }
                    else
                        {
                        Debug('journalCheck timed out');
                        i--;
                        negativeIndex--;
                        Orion.Wait(100);
                        continue;
                        }
                    commandList = gump.CommandList();
                    if(commandList.join().indexOf(' 1156415 ') > -1)
                        {
                        Debug('clilocCheck Stop Auction, index: ' + safe[0]);
                        }
                    }
                }
            else
                {
                Orion.TestItemColor(safe[4],'0');
                Debug('Auction already started');
                }
            }
        Orion.Wait(100);
        }
    if(changeCheck)
        {
        tmpFile = Orion.NewFile();
        tmpFile.Remove(tmpFilePath);
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        Debug("Recording catalogue");
        tmpFile.Write(JSON.stringify(outArr));
        tmpFile.Close();
        }
    }