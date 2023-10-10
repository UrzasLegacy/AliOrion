var fileName = '/AliCatalogueJSON' + '.json'
var searchDistance = 10
var debug = false;

function CatalogueSafes()
    {
    var amOwnerFlag = true; //set to true if you own the auction safes you are cataloguing, false if they are someone else's
    var printToTextWindow = true;
    var startTime = Orion.Now();
    var safes = FloorRowColumnScanEnumerateSafes(); //returns a sorted array of all safe info arrays
    var safeCount = safes.length;
    var outArr = [];
    var index = 1;
    TextWindow.Open();
    TextWindow.Print('\\*');
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
    if(amOwnerFlag)
        SafeStarter();
    }

function SafeStarter() //[index, itemInfoString, saleItemSerial, safeSerial, idleStatus] idleStatus is null if safe is empty and false if auction is running
    {
    Orion.RemoveDisplayTimer('idleTimer');
    Orion.SetTimer('StayLoggedIn');
    Orion.ClearFakeMapObjects();
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    tmpFile.Close();
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
    if(idleSafesLength == 0)
        return Orion.CharPrint(self,1159,'No idle safes in list');
    var negativeIndex = 0;
    for(var i=0;i<outArr.length;i++)
        {
        var safe = outArr[i];
        if(safe[5] !== true)
            continue;
        AvoidTeleporters();
        var currTimer = Orion.DisplayTimerGetTime('idleTimer') + 1;
        var idleMins = Math.floor(currTimer / 60000);
        var eta = ((idleSafesLength - negativeIndex) * 5 + idleMins) + ' min'
        Orion.CharPrint(self,1159,'Safes started: ' + negativeIndex + '/' + idleSafesLength + '\nETA: ' + eta);
        var safeSerial = safe[4];
        var safeObj = Orion.FindObject(safeSerial);
        var safeX = safeObj.X();
        var safeY = safeObj.Y();
        if(safeObj)
            {
            while(safeObj.Distance() > 5)
                {
                Orion.WalkTo(safeX,safeY,0,2);
                Orion.Wait(500);
                }
            while(Orion.DisplayTimerExists('idleTimer'))
                {
                if(Orion.Timer('StayLoggedIn') > 60000)
                    {
                    Orion.UseObject(backpack);
                    Orion.SetTimer('StayLoggedIn');
                    }
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
            var startTime = Orion.Now();
            gump = Orion.GetGump(any, '0x000F3ED6');
            while(!gump)
                {
                Debug('Catching Gump');
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safeSerial);
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                gump = Orion.GetGump(any, '0x000F3ED6')
                }
            Debug('Caught');
            var commandList = gump.CommandList();
            if(commandList && commandList.join().indexOf(' 1156414 ') > -1) //if 'Start Auction' cliloc found
                {
                Debug('Attempting to start auction');
                var journalStart = Orion.Now() - 500;
                var journalEnd = journalStart + 3500;
                gump.Select(Orion.CreateGumpHook(106));
                var journalCheck = Orion.WaitJournal('before starting a new auction.', journalStart, journalEnd, 'sys|oa');
                Debug('journalCheck: ' + journalCheck);
                if(journalCheck)
                    {
                    var seconds = Number(journalCheck.Text().match(/\d+/));
                    if(seconds > 0)
                        {
                        Orion.AddDisplayTimer('idleTimer', seconds * 1000, 'AboveChar', 'Circle|bar', 'Waiting for Cooldown');
                        Orion.SetTimer('StayLoggedIn');
                        Debug('Cooldown: ' + seconds + 's');
                        i--;
                        Orion.Wait(200);
                        continue;
                        }
                    }
                else
                    {
                    gump = Orion.GetGump(any, '0x000F3ED6');
                    commandList = gump.CommandList();
                    if(commandList.join().indexOf(' 1156415 ') > -1)
                        {
                        Debug('Safe Started: ' + safe[0]);
                        Orion.TestItemColor(safeSerial,'0');
                        safe[5] = false;
                        negativeIndex++;
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

function AvoidTeleporters()
    {
    if(Orion.Now() < Shared.GetVar('AvoidTimer',0))
        return;
    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    Shared.AddVar('AvoidTimer',Orion.Now() + 600000)
    var teleporters = Orion.FindTypeEx(any,any,ground,'item',22).filter(function(item)
        {
        return item.Properties().toLowerCase().indexOf('teleporter') > -1 && item.Z() == Player.Z();
        });
    Debug('Avoiding ' + teleporters.length + ' nearby teleporters');
    teleporters.forEach(function(teleporter,ind)
        {
        var teleporterX = teleporter.X();
        var teleporterY = teleporter.Y();
        Orion.SetBadLocation(teleporterX,teleporterY);
        Orion.AddFakeMapObject(ind, '0x051A', '32', teleporterX, teleporterY, Player.Z() + 1);
        })
    }

function DiscordPush(msg)
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + msg;
	Orion.HttpPost(bot, paramText);
	}
	
function ReadCatalogue()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        outArr = JSON.parse(fileString);
    TextWindow.Open();
    TextWindow.Clear();
    var outStr = '';
    outArr.forEach(function(safe,ind)
        {
        var lineOut = safe[1].replace(/.*Bid: ([\d,]+p [\d,]+gp)\nB\/O: [\d,]+p [\d,]+gp/,'Price: $1').replace(/Auction Item/,'').replace(/\n\n/,'\n').trim()
     	TextWindow.Print(lineOut + '\n');
     	outStr += lineOut + '\n'
        });
    //TextWindow.Print('*/');
    //TextWindow.Print('var prevCatalogue = [')
    //outArr.forEach(function(safe)
        //{
        //TextWindow.Print(JSON.stringify(safe) + ',');
        //})
    //TextWindow.Print(']\n\n')
    tmpFile.Close();
    }
    
function StraticsFormatCatalogueTable()
    {
    var raresMode = false;
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        outArr = JSON.parse(fileString);
    TextWindow.Open();
    TextWindow.Clear();
    var outStr = '';
    //var picAttach = '[ATTACH type="full" alt="imperatrix.png"]138957[/ATTACH]'
    //TextWindow.Print("[CENTER][COLOR=rgb(0, 0, 0)][B][SIZE=5]Visit [/SIZE][/B][/COLOR] [COLOR=rgb(147, 101, 184)][SIZE=6][B][FONT=tahoma][U]Impe[/U][/FONT][/B][/SIZE][/COLOR][COLOR=rgb(85, 57, 130)][SIZE=6][B][FONT=tahoma][U]ratrix[/U][/FONT][/B][/SIZE][/COLOR] [COLOR=rgb(0, 0, 0)] [SIZE=5][B]Trammel New Magincia[/B][/SIZE]\n[B][SIZE=5]PvP Jewelry and Weapons[/SIZE][/B]\n[SIZE=5]A light stroll northeast from the Moongate[/SIZE]\n\n" + picAttach + "[/COLOR]\n\n\n[COLOR=rgb(147, 101, 184)]╔═══════°∴,*⋅✲════ ✧･ﾟ: *✧･ﾟ:* ════°∴,*⋅✲════〖✰〗════✲⋅*,∴°════ *:･ﾟ✧*:･ﾟ✧ ════✲⋅*,∴°═══════╗[/COLOR] [COLOR=rgb(0, 0, 0)]\n[B][SIZE=5]I prefer a [I]laissez-faire[/I] approach so it's a bit of a toss-up whether I'll respond to DMs.[/SIZE]\n[SIZE=5]I appreciate your understanding![/SIZE]\n\n[SIZE=5]The numbers correspond to the respective safe labeled in the picture above.[/SIZE]\n[SIZE=5]CTRL+F is advised![/SIZE]\n[SIZE=5][ICODE]:)[/ICODE][/SIZE][/B][/COLOR]\n\n[COLOR=rgb(85, 57, 130)]╚═══ °∴,*⋅✲══════ ✧･ﾟ: *✧･ﾟ:* ══════°∴,*⋅✲════〖✰〗════✲⋅*,∴°══════ *:･ﾟ✧*:･ﾟ✧ ══════✲⋅*,∴° ═══╝[/COLOR]\n\n[/CENTER]");
    TextWindow.Print('[TABLE]\n[TR]')
    outArr.forEach(function(safe,ind)
        {
        if(raresMode)
            {
            if(safe[3] == 'No Name')
                var lineOut = safe[1].replace(/Bid: [\dgp\s]+/,'').replace(/Auction Item/,'').replace(/B\/O: [\dgp\s]+/,'').replace(/Auction Item/,'').replace(/\n\n/,'\n').replace(/:\n([\w \-\'\";\.\,]+)/g,':\n[B]' + 'No Item' + '[/B]').replace(/\n\n/,'\n').trim()      
            else
                {
                var bbcLink = LinkFormatter(safe[3],'Search',true);
                //var lineOut = safe[1].replace(/Bid:/,'Start:').replace(/Auction Item/,'').replace(/\n\n/,'\n').replace(/:\n([\w \-\'\";\.\,\:]+)/g,':\n[B]' + bbcLink + '[/B]').replace(/\n\n/,'\n').trim()  
                var lineOut = safe[1].replace(/Bid:/,'Start:').replace(/Auction Item/,'').replace(/\n\n/,'\n').replace(/:\n(.+)/g,':\n[B]' + bbcLink + '[/B]').replace(/\n\n/,'\n').trim()  
                }
            }
        else
            var lineOut = safe[1].replace(/Bid:/,'Start:').replace(/Auction Item/,'').replace(/\n\n/,'\n').replace(/:\n(.+)/g,':\n[B]$1[/B]').replace(/\n\n/,'\n').trim()
     	TextWindow.Print('[TD][CENTER][COLOR=rgb(0, 0, 0)]' + lineOut + '[/COLOR][/CENTER][/TD]');
     	outStr += lineOut + '\n';
        if(ind == outArr.length - 1)
            TextWindow.Print('[/TR]');
        else if(ind && ((ind + 1) % 7) == 0)
            TextWindow.Print('[/TR]\n[TR]');
        });
    TextWindow.Print('[/TABLE]')
    //TextWindow.Print('*/');
    //TextWindow.Print('var prevCatalogue = [')
    //outArr.forEach(function(safe)
        //{
        //TextWindow.Print(JSON.stringify(safe) + ',');
        //})
    //TextWindow.Print(']\n\n')
    tmpFile.Close();
    }

function LinkFormatter(itemName,type,bbCode)
    {
    switch(type)
        {
        case 'Search':
            var formattedName = itemName.replace(/\s/g,'+') //https://wiki.stratics.com/index.php?search=Body+Fluid+Of+Queen+Ogre+Bee+Larva&title=Special%3ASearch&fulltext=Search
            var outMsg = "\"https://wiki.stratics.com/index.php?search=" + formattedName + "&title=Special%3ASearch&fulltext=Search\"";
            break;
        case 'UO Link':
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=UO:" + formattedName + "\"";
            break;
        default:
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=" + formattedName + "\"";
            break;
        }
    if(bbCode)
        outMsg = "[URL=" + outMsg + ']' + itemName + "[/URL]"
    return outMsg;
    }

function SalesCheck()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + fileName;
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var prevCatalogue = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        prevCatalogue = JSON.parse(fileString);
    var sold = [];
    for(var i=0;i<prevCatalogue.length;i++)
        {
        var item = prevCatalogue[i];
        if(item[2] != 'No Item' && !Orion.FindObject(item[2]))
            sold.push(item);
        }
    if(sold[0])
        {
        Orion.CharPrint(self,1159, sold.length + ' items sold');
        TextWindow.Open();
        sold.forEach(function(item)
            {
            TextWindow.Print(item[1])
            });
        }
    else
        Orion.CharPrint(self,1159,'No items sold');
    }

function FloorRowColumnScanEnumerateSafes()
    {
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',searchDistance).map(function(safe)
        {
        return [safe.Serial(), safe.X(), safe.Y(), safe.Z()];
        }).sort(function(a,b)
            {
            if(a[3] != b[3])
                return b[3] - a[3];
            else if(a[2] != b[2])
                return a[2] - b[2];
            else
                return a[1] - b[1];
            })
    safes.forEach(function(safe,ind)
        {
        if(Player.Z() == safe[3])
            Orion.CharPrint(safe[0], 1159, ind + 1)
        });
    return safes;
    }

function ASCII_Input()
    {
	 var text = "\n/'-| Imperatrix |-'\\\n\\,-| PvP Gear |-,/"
//var text = '\n _____| | Imperatrix ______\n|/_/_/| | ____________/\n |_| PvP Gear  \n'
//var text = '\n  _______| | Imperatrix __________ \n|/_/_/_/| |_________________/\n |_| PvP Gear   \n'
    Orion.SendPrompt(text)
    }

function Debug(msg)
    {
    if(!debug)
        return
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print('DEBUG:' + Orion.Time() + ': ' + msg);
    }