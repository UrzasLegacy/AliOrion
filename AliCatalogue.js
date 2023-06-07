function ASCII_Input()
    {
	 var text = "\n/'-| Imperatrix |-'\\\n\\,-| PvP Gear |-,/"
//var text = '\n _____| | Imperatrix ______\n|/_/_/| | ____________/\n |_| PvP Gear  \n'
//var text = '\n  _______| | Imperatrix __________ \n|/_/_/_/| |_________________/\n |_| PvP Gear   \n'
    Orion.SendPrompt(text)
    }

function CatalogueRowColumn()
    {
    var amOwnerFlag = true; //set to true if you own the auction safes you are cataloguing, false if they are someone else's
    var startTime = Orion.Now();
    var safes = RowColumnScanEnumerateSafes();
    var outArr = [];
    var index = 1;
    TextWindow.Open();
    TextWindow.Print('\\*');
    for(var i=0;i<safes.length;i++)
        {
        var safe = safes[i];
        for(var j=0;j<safe.length;j++)
            {
            var safe = Orion.FindObject(safe[j][0]);
            var gump = Orion.GetGump(any);
            while(gump)
                {
                Orion.Print('Closing gump: ' + gump.ID());
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
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safe.Serial());
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                }
            var gump = Orion.GetGump(any, '0x000F3ED6');
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
            var idle = false;
            var commandList = gump.CommandList();
            if(commandList && commandList.join().indexOf(' 1156414 ') > -1)
                idle = true;
            var saleItem = Orion.FindTypeEx(any,any,ground,'item',20).filter(function(item)
                {
                return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19');
                })[0];
            Orion.ResetSearchArea();
            if(saleItem)
                var saleItemProps = saleItem.Properties();
            else
                var saleItemProps = 'MissingItem';
            Orion.CharPrint(self,1159,index + '/' + safes.length + ' ETA: ' + ((safes.length - index) * 2) + 's');
            var outStr = index + ':\n' + JSON.parse(JSON.stringify(saleItemProps)) +  '\nBid: ' + platBid + 'p ' + goldBid + 'gp\n' + 'B/O: ' + platBuy + 'p ' + goldBuy + 'gp\n';
            if(saleItem)
                outArr.push([index++, outStr, saleItem.Serial(), safe.Serial(), idle]);
            else
                outArr.push([index++, outStr, 'No Item', safe.Serial(), null]);
            TextWindow.Print(outStr);
            }
        }
    //outArr.forEach(function(safe){TextWindow.Print(safe[1])});
    TextWindow.Print('*/');
    TextWindow.Print('var prevCatalogue = [')
    outArr.forEach(function(safe)
        {
        TextWindow.Print(JSON.stringify(safe) + ',');
        })
    TextWindow.Print(']\n\n')
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliCatalogueJSON' + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Remove(tmpFilePath);
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording To File: " + tmpFilePath); 
    Orion.Print("Recording catalogue");
    tmpFile.Write(JSON.stringify(outArr));
    tmpFile.Close();

    for(var i=0;i<outArr.length;i++)
        {
        var safe = outArr[i];
        if(safe[4] == true)
            {
            var safeObj = Orion.FindObject(safe[3]);
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
                    Orion.Print('Closing gump: ' + gump.ID());
                    gump.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    gump = Orion.GetGump(any);
                    }
                Orion.Wait(200);
                startTime = 0;
                while(!Orion.GumpExists('generic', safeObj.Serial(), '0x000F3ED6'))
                    {
                    Orion.Wait(1300 - (Orion.Now() - startTime))
                    Orion.UseObject(safeObj.Serial());
                    startTime = Orion.Now();
                    Orion.WaitForGump(1300);
                    }
                var gump = Orion.GetGump(any, '0x000F3ED6');
                var commandList = gump.CommandList();
                if(commandList && commandList.join().indexOf(' 1156414 ') > -1)
                    {
                    var journalStart = Orion.Now();
                    Orion.CharPrint(self,1159,'Attempting to start auction');
                    gump.Select(Orion.CreateGumpHook(106));
                    Orion.Wait(500);
                    Orion.WaitForGump(2000);
                    gump = Orion.GetGump(any, '0x000F3ED6');
                    if(!gump)
                        {
                        i--;
                        Orion.Wait(100);
                        continue;
                        }
                    else
                        {
                        var journalCheck = Orion.InJournal('before starting a new auction.','sys','0','any',journalStart,Orion.Now());
                        Orion.Print('journalCheck: ' + journalCheck);
                        if(journalCheck)
                            {
                            var seconds = Number(journalCheck.Text().match(/\d+/));
                            Orion.Print(seconds)
                            if(seconds > 0)
                                {
                                Orion.AddDisplayTimer('idleTimer', seconds * 1000, 'AboveChar', 'Circle|bar', 'Waiting for Idle Timer')
                                Orion.SetTimer('StayLoggedIn');
                                while(Orion.DisplayTimerExists('idleTimer'))
                                    {
                                    if(Orion.Timer('StayLoggedIn') > 60000)
                                        {
                                        Orion.UseObject(backpack);
                                        Orion.SetTimer('StayLoggedIn');
                                        }
                                    Orion.Wait(1000);
                                    }
                                i--;
                                Orion.Wait(100);
                                continue;
                                }
                            }
                        commandList = gump.CommandList();
                        if(commandList.join().indexOf(' 1156415 ') === -1)
                            {
                            i--;
                            Orion.Wait(100);
                            continue;
                            }       
                        }
                    }
                }
            }
        Orion.Wait(100);
        }
    }
    
function DiscordPush(msg)
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + msg;
	Orion.Print(Orion.HttpPost(bot, paramText));
	}
	
function ReadCatalogue()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliCatalogueJSON' + '.json';
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
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliCatalogueJSON' + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        outArr = JSON.parse(fileString);
    TextWindow.Open();
    TextWindow.Clear();
    var outStr = '';
    var picAttach = '[ATTACH type="full" alt="imperatrix.png"]138957[/ATTACH]'
    TextWindow.Print("[CENTER][COLOR=rgb(0, 0, 0)][B][SIZE=5]Visit [/SIZE][/B][/COLOR] [COLOR=rgb(147, 101, 184)][SIZE=6][B][FONT=tahoma][U]Impe[/U][/FONT][/B][/SIZE][/COLOR][COLOR=rgb(85, 57, 130)][SIZE=6][B][FONT=tahoma][U]ratrix[/U][/FONT][/B][/SIZE][/COLOR] [COLOR=rgb(0, 0, 0)] [SIZE=5][B]Trammel New Magincia[/B][/SIZE]\n[B][SIZE=5]PvP Jewelry and Weapons[/SIZE][/B]\n[SIZE=5]A light stroll northeast from the Moongate[/SIZE]\n\n" + picAttach + "[/COLOR]\n\n\n[COLOR=rgb(147, 101, 184)]╔═══════°∴,*⋅✲════ ✧･ﾟ: *✧･ﾟ:* ════°∴,*⋅✲════〖✰〗════✲⋅*,∴°════ *:･ﾟ✧*:･ﾟ✧ ════✲⋅*,∴°═══════╗[/COLOR] [COLOR=rgb(0, 0, 0)]\n[B][SIZE=5]I prefer a [I]laissez-faire[/I] approach so it's a bit of a toss-up whether I'll respond to DMs.[/SIZE]\n[SIZE=5]I appreciate your understanding![/SIZE]\n\n[SIZE=5]The numbers correspond to the respective safe labeled in the picture above.[/SIZE]\n[SIZE=5]CTRL+F is advised![/SIZE]\n[SIZE=5][ICODE]:)[/ICODE][/SIZE][/B][/COLOR]\n\n[COLOR=rgb(85, 57, 130)]╚═══ °∴,*⋅✲══════ ✧･ﾟ: *✧･ﾟ:* ══════°∴,*⋅✲════〖✰〗════✲⋅*,∴°══════ *:･ﾟ✧*:･ﾟ✧ ══════✲⋅*,∴° ═══╝[/COLOR]\n\n[/CENTER]");
    TextWindow.Print('[TABLE]\n[TR]')
    outArr.forEach(function(safe,ind)
        {
        var lineOut = safe[1].replace(/.*Bid: ([\d,]+p [\d,]+gp)\nB\/O: [\d,]+p [\d,]+gp/,'Price: $1').replace(/Auction Item/,'').replace(/\n\n/,'\n').replace(/:\n([\w \-\']+)/g,':\n[B]$1[/B]').replace(/\n\n/,'\n').trim()
     	TextWindow.Print('[TD][CENTER][COLOR=rgb(0, 0, 0)]' + lineOut + '[/COLOR][/CENTER][/TD]');
     	outStr += lineOut + '\n'
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

function SalesCheck()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliCatalogueJSON' + '.json';
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

function RowColumnScanEnumerateSafes()
    {
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20).map(function(safe)
        {
        return [safe.Serial(), safe.X(), safe.Y()];
        })
    var safeRows = safes.sort(function(a,b)
        {
        return a[2] - b[2];
        })
    var rowHash = {};
    var safesSorted = [];
    for(var i=0;i<safeRows.length;i++)
        {
        var tempRow = [];
        if(!rowHash[safeRows[i][2]])
            {
            rowHash[safeRows[i][2]] = true;
            var tempSafes = safes.filter(function(safe)
                {
                return safe[2] == safeRows[i][2];
                })
            tempSafes.sort(function(a,b)
                    {
                    return a[1] - b[1];
                    })
                .forEach(function(safe)
                    {
                    tempRow.push(safe);
                    });
            }
        safesSorted.push(tempRow);
        }
    var index = 1;
    safesSorted.forEach(function(row)
        {
        row.forEach(function(column)
            {
            Orion.CharPrint(column[0], 1159, index++)
            //Orion.Wait(100);
            })
        });
    Orion.CharPrint('0x44557D13',1159, 'Rares')
    return safesSorted;
    }

function LowerBooks()
	{
	Orion.ResetSearchArea()
	var book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
		{
		return item.Z() != 12 && item.Z() != 32;
		})[0];
	while(book)
		{
		if(Orion.WaitForTarget(1000))
			Orion.TargetObject(book.Serial());
		Orion.Wait(10);
		book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
			{
			return item.Z() != 12 && item.Z() != 32;
			})[0];
		}
	}

function LootHouseLocationSetup()
    {
    var getLoc = function(type)
        {
        Orion.WarMode(0);
        Orion.CharPrint(self,1159,'Stand near ' + type + ' containers and enter warmode');
        while(!Player.WarMode())
            {
            Orion.Wait(100);
            }
        return {x: Player.X(),y:Player.Y()}
        }
    var armorLoc = getLoc('Armor/Shield');
    var weaponLoc = getLoc('Weapon');
    var jewelryLoc = getLoc('Jewelry');
    Orion.Print(JSON.stringify(armorLoc))
    }