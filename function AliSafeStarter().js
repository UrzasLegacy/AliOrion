function AliSafeStarter()
    {
    var uncheckedHue = 1159;
    var checkedHue = 1152;
    Orion.RemoveDisplayTimer('idleTimer');
    Orion.ClearFakeMapObjects();
    var safesHash = {};
    var itemCooldown = Orion.Now();
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
    var idleSafes = outArr.filter(function(safe)
        {
        return safe[5] === true;
        });
    idleSafes.forEach(function(safe)
        {
        Orion.TestItemColor(safe[4],'1152')
        });
    var idleSafesLength = idleSafes.length;
    var negativeIndex = 0;
    for(var i=0;i<outArr.length;i++)
        {
        var safe = outArr[i];
        if(safe[5] !== true)
            continue;
        AvoidTeleporters(); 
        Orion.CharPrint(self,1159,'Idle Safes: ' + i + '/' + idleSafesLength + '\nETA: ' + ((idleSafesLength - i) * 5) + ' min');
        negativeIndex++;
        var safeSerial = safe[4];
        var safeObj = Orion.FindObject(safeSerial);
        if(safeObj)
            {
            while(safeObj.Distance() > 5)
                {
                Orion.WalkTo(safeObj.X(),safeObj.Y(),0,2);
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
            while(!Orion.GumpExists('generic', safeSerial, '0x000F3ED6'))
                {
                Debug('Catching Gump');
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safeSerial);
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                }
            Debug('Caught');
            var gump = Orion.GetGump(any, '0x000F3ED6');
            var commandList = gump.CommandList();
            if(commandList && commandList.join().indexOf(' 1156414 ') > -1) //if 'Start Auction' cliloc found
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
                    Orion.TestItemColor(safeSerial,safeObj.Color());
                    safe[5] = true;
                    tmpFile = Orion.NewFile();
                    tmpFile.Remove(tmpFilePath);
                    tmpFile.Open(tmpFilePath);
                    Orion.Print("Recording To File: " + tmpFilePath); 
                    Debug("Recording catalogue");
                    tmpFile.Write(JSON.stringify(outArr));
                    tmpFile.Close();
                    }
                else
                    {
                    gump = Orion.GetGump(any, '0x000F3ED6');
                    commandList = gump.CommandList();
                    if(commandList.join().indexOf(' 1156415 ') > -1)
                        {
                        Debug('Safe Started: ' + safe[0]);
                        Orion.TestItemColor(safeSerial,safeObj.Color());
                        safe[5] = true;
                        tmpFile = Orion.NewFile();
                        tmpFile.Remove(tmpFilePath);
                        tmpFile.Open(tmpFilePath);
                        Orion.Print("Recording To File: " + tmpFilePath); 
                        Debug("Recording catalogue");
                        tmpFile.Write(JSON.stringify(outArr));
                        tmpFile.Close();
                        }
                    else
                        {
                        Debug('Timed out, trying again');
                        i--;
                        negativeIndex--;
                        Orion.Wait(200);
                        continue;
                        }
                    }
                }
            else
                {
                Orion.TestItemColor(safeSerial,'0');
                Debug('Auction already started');
                }
            }
        Orion.Wait(100);
        }
    }

function SafeStarter2() //[index, itemInfoString, saleItemSerial, safeSerial, idleStatus] idleStatus is null if safe is empty and false if auction is running
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
    var idleSafesLength = idleSafes.length;
    //var negativeIndex = 0;
    for(var i=0;i<idleSafes.length;i++)
        {
        var safe = idleSafes[i];
        if(safe[5] !== true)
            continue;
        AvoidTeleporters(); 
        Orion.CharPrint(self,1159,'Idle Safes: ' + i + '/' + idleSafesLength + '\nETA: ' + ((idleSafesLength - i) * 5) + ' min');
        //negativeIndex++;
        var safeObj = Orion.FindObject(safe[4]);
        if(safeObj)
            {
            while(safeObj.Distance() > 5)
                {
                Orion.WalkTo(safeObj.X(),safeObj.Y(),0,2);
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
                while(Orion.DisplayTimerExists('idleTimer'))
                    {
                    if(Orion.Timer('StayLoggedIn') > 60000)
                        {
                        Orion.UseObject(backpack);
                        Orion.SetTimer('StayLoggedIn');
                        }
                    Orion.Wait(1000);
                    }
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


function CatalogueSafes()
    {
    for(var i=0;i<safes.length;i++)
        {
        AvoidTeleporters();
        var safe = Orion.FindObject(safes[i][0]);
        var gump = Orion.GetGump(any);
        while(gump)
            {
            Debug('Closing gump: ' + gump.ID());
            gump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            gump = Orion.GetGump(any);
            }
        while(safe.Distance() > 5)
            {
            Orion.WalkTo(safe.X(),safe.Y(),0,2)
            Orion.Wait(500);
            }
        while(!Orion.GumpExists('generic', safe.Serial(), '0x000F3ED6'))
            {
            Debug('Catching Gump');
            Orion.Wait(1300 - (Orion.Now() - startTime))
            Orion.UseObject(safe.Serial());
            startTime = Orion.Now();
            Orion.WaitForGump(1300);
            }
        Debug('Caught');
        var gump = Orion.GetGump(any, '0x000F3ED6');
        var idle = false;
        var commandList = gump.CommandList();
        if(commandList && commandList.join().indexOf(' 1156414 ') > -1)
            idle = true;
        var textList = gump.TextList();
        if(amOwnerFlag)
            {
            var platBid = textList[0] || 0;
            var goldBid = textList[1] || 0;
            var platBuy = textList[2] || 0;
            var goldBuy = textList[3] || 0;
            }
        else
            {
            var platBid = textList[4] ? textList[4].slice(24) : '0';
            var goldBid = textList[5] ? textList[5].slice(24) : '0';
            var platBuy = textList[7] ? textList[7].slice(24) : '0';
            var goldBuy = textList[8] ? textList[8].slice(24) : '0';
            }
        platBid = platBid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") || '0';
        goldBid = goldBid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        platBuy = platBuy.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        goldBuy = goldBuy.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        Orion.SetSearchArea(safe.X(),safe.Y(),safe.Z() + 1,safe.X(),safe.Y(),safe.Z() + 12);
        var saleItem = Orion.FindTypeEx(any,any,ground,'item',20).filter(function(item)
            {
            return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19');
            })[0];
        Orion.ResetSearchArea();
        if(saleItem)
            var saleItemProps = saleItem.Properties();
        else
            var saleItemProps = 'MissingItem';
        Orion.CharPrint(self,1159,index + '/' + safeCount + ' ETA: ' + ((safeCount - index) * 2) + 's');
        var outStr = index + ':\n' + JSON.parse(JSON.stringify(saleItemProps)) +  '\nBid: ' + platBid + 'p ' + goldBid + 'gp\n' + 'B/O: ' + platBuy + 'p ' + goldBuy + 'gp\n';
        if(saleItem)
            outArr.push([index++, outStr, saleItem.Serial(), saleItem.Name(), safe.Serial(), idle]);
        else
            outArr.push([index++, outStr, 'No Item', 'No Name', safe.Serial(), null]);
        if(printToTextWindow)
            TextWindow.Print(outStr);
        }
    if(printToTextWindow)
        {
        //outArr.forEach(function(safe){TextWindow.Print(safe[1])});
        TextWindow.Print('*/');
        TextWindow.Print('var prevCatalogue = [')
        outArr.forEach(function(safe)
            {
            TextWindow.Print(JSON.stringify(safe) + ',');
            })
        TextWindow.Print(']\n\n')
        }
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Remove(tmpFilePath);
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording To File: " + tmpFilePath); 
    Debug("Recording catalogue");
    tmpFile.Write(JSON.stringify(outArr));
    tmpFile.Close();
    SafeStarter();
    }