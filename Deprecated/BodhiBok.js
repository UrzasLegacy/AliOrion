var numRunes = 25;
var smallBODs = true;
var buttons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, 3, "BodhiBriber", 'BodhiBriber'], [100, 30, 4, "BodhiCrafter", 'BodhiCrafter'], [100, 30, 5, "DovetailTurnin", 'BodhiAshDoveTailTurnin'] ],
        [ [100, 30, 6, "SawCombiner", 'SawCombiner'], [100, 30, 7, "MoveAllSaws", 'MoveAllSaws'], [100, 30, 8, "MoveAllBODs", 'MoveAllBODs'] ],
        [],
        [ [100, 30, 9, "Bok", 'BokInit'] ]

    ]

function Gump()
    {
    Orion.Exec('GMJournalScan',true);
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
                {
                return rows.length
                }));
    gump.AddHtmlGump(1, 0, 0, widest * 100 + 20, buttons.length * 30 + 3, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(gridX(column), gridY(row), '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(gridTX(column), gridTY(row), '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

function GumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if (button[2] == code)
                {
                Orion.Print('Toggle ' + button[4]);
                Orion.ToggleScript(button[4]);
                return;
                }
            })
        });
    }

function gridX(x){
    return x * 105 + 4
    }
function gridY(y){
    return y * 29 + 2
    }
function gridTX(x){
    return x * 105 + 10
    }
function gridTY(y){
    return y * 29 + 6
    }

function BodhiBriber()
    {
    Orion.Exec('GMJournalScan',true);
    while(true)
        {
        var bodObj = Orion.FindTypeEx('0x2258','0x05E8')[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCheck = CarpentryArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCheck || bodInfo.Size == 'Large Bulk Order')
                {
                var invalidBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), 'Invalid', false);
                    })[0];
                if(invalidBODBook)
                    {
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, invalidBODBook.Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump1 = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump1 !== null)
                            {
                            closeBookGump1.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1100);  
                    }
                else
                    {
                    Orion.Wait(1100);
                    AtlasByName('Carpenters', 'Bank');
                    Orion.Say('bank');
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, Player.BankSerial());
                    Orion.Wait(1100);
                    }
                }
            else if(bodInfo.Size == 'Small Bulk Order')
                {
                if(bodInfo.Fulfilled == 0)
                    {
                    while(BodParse(bodObj).Points < 750)
                        {
                        var carpenter = GoToCarpenter();
                        if(carpenter)
                            {
                            var bribeCost = BribeCheck(carpenter.Serial(), bodObj.Serial())
                            if(bribeCost > -1 && bribeCost < 100000)
                                {
                                Orion.MoveItem(bodObj.Serial(), 0, carpenter.Serial());
                                Orion.Wait(1100);
                                }
                            else
                                Orion.Ignore(carpenter.Serial());
                            //Orion.Wait(1100);
                            }
                        }
                    var bribeBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                        {
                        return Orion.Contains(book.Properties(), 'Bribed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                        });
                    Orion.MoveItem(bodObj.Serial(), 0, bribeBODBook[0].Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump1 = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump1 !== null)
                            {
                            closeBookGump1.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1200);
                    }
                }
            }
        if(!Orion.FindType('0x2258','0x05E8')[0])
            {
            Orion.CharPrint(self,1159,'Pulling BOD from backup book');
            var backupBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                {
                return Orion.Contains(book.Properties(), 'Valid', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(backupBODBook[0])
                {
                Orion.UseObject(backupBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Backup BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function BodhiCrafter()
    {
    Orion.Exec('GMJournalScan',true);
    Orion.Say('bank');
    Orion.Wait(1100);
    var bank = Player.BankSerial();
    while(true)
        {
        var bodObj = Orion.FindTypeEx('0x2258','0x05E8')[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCheck = CarpentryArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCheck || bodInfo.Size == 'Large Bulk Order')
                {
                var invalidBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), 'Invalid', false);
                    })[0];
                if(invalidBODBook)
                    {
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, invalidBODBook.Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump1 = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump1 !== null)
                            {
                            closeBookGump1.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1100);  
                    }
                else
                    {
                    Orion.Say('bank');
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, Player.BankSerial());
                    Orion.Wait(1100);
                    }
                }
            else if(bodInfo.Size == 'Small Bulk Order')
                {
                if(bodInfo.Fulfilled != bodInfo.Amount)
                    {
                    while(Orion.FindType('0x1029','0x04A7')[0]) //put away runics
                        {
                        Orion.CharPrint(self,1159,'Storing Runics in Bank');
                        var pouch = Orion.FindType('0x0E79', any, bank)[0];
                        Orion.MoveItem(Orion.FindType('0x1029','0x04A7')[0], 0, pouch);
                        Orion.Wait(1200);
                        }
                    while(Orion.Count('0x1BF2') < 30)
                        {
                        Orion.CharPrint(self,1159,'Restocking Ingots');
                        if(!Restock('Iron Ingots','0x1BF2', bank, 50))
                            return;
                        }
                    while(!Orion.FindType('0x1EB9')[0])
                        {
                        Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                        if(!Restock('Tinker Tool', '0x1EB9', bank, 0))
                            return;
                        }
                    while(!Orion.FindType('0x10E7')[0] && Orion.Count('0x1BF2') > 4)
                        {
                        if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                            {
                            Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
                            CraftItem('0x1EB9', 9003, 10);
                            }   
                        else
                            {
                            Orion.CharPrint(self,1159,'Restocking Carpenter Tool');
                            if(!Restock('Carpenter Tool','0x10E7', bank, 0))
                                return;
                            }
                        }
                    Orion.CharPrint(self,1159,'Setting Material type');
                    var materialType = BodParse(bodObj).MaterialColor
                    Orion.UseObject(Orion.FindType('0x10E7')[0]);
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpMaterial = Orion.GetGump(any, '0x000001CC');
                        if (gumpMaterial !== null)
                            {
                            gumpMaterial.Select(Orion.CreateGumpHook(BodParse(bodObj).MaterialCode));
                            Orion.Wait(200);
                            }
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpMaterial = Orion.GetGump(any, '0x000001CC');
                        if (gumpMaterial !== null)
                            {
                            gumpMaterial.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1200);
                    while(Orion.GetGump(any))
                        {
                        Orion.Print(Orion.GetGump(any).ID())
                        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
                        Orion.Wait(100);
                        }
                    while(BodParse(bodObj).Fulfilled < BodParse(bodObj).Amount)
                        {
                        var needed = BodParse(bodObj).Amount - BodParse(bodObj).Fulfilled;
                        for(var i=0;i<needed;i++)
                            {
                            while(Player.Weight() > 500)
                                {
                                Orion.CharPrint(self,1159,'Over weight threshold, moving things around');
                                while(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0])
                                    {
                                    Orion.MoveItem(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0], 0, bank);
                                    Orion.Wait(1200);
                                    }
                                }
                            while(bodCheck[3] && Orion.Count('0x1BD7', materialType) < 50)
                                {
                                Orion.CharPrint(self,1159,'Restocking Boards');
                                if(!Restock('Boards', '0x1BD7', bank, 150, materialType))
                                    return;
                                }
                            while(Orion.Count('0x1BF2') < 30)
                                {
                                Orion.CharPrint(self,1159,'Restocking Ingots');
                                if(!Restock('Iron Ingots','0x1BF2', bank, 50))
                                    return;
                                }
                            while(!Orion.FindType('0x10E7')[0] && Orion.Count('0x1BF2') > 4)
                                {
                                while(!Orion.FindType('0x1EB9')[0])
                                    {
                                    Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                                    if(!Restock('Tinker Tools','0x1EB9', bank, 0))
                                        return;
                                    }
                                if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                                    {
                                    Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
                                    CraftItem('0x1EB9', 9003, 10);
                                    }   
                                else
                                    {
                                    Orion.CharPrint(self,1159,'Restocking Carpenter Tool');
                                    if(!Restock('Carpenter Tool', '0x10E7', bank, 0))
                                        return;
                                    }
                                }
                            Orion.CharPrint(self,1159,'Crafting: ' + bodCheck[0]);
                            CraftItem('0x10E7', bodCheck[1], bodCheck[2]);
                            }
                        Orion.Wait(1000);
                        Orion.CharPrint(self,1159,'Attempting to combine items to BOD');
                        Orion.UseObject(bodObj.Serial());
                        if(Orion.WaitForGump(2000))
                            {
                            var gumpTurnin1 = Orion.GetGump(any, '0x000001C8');
                            if(gumpTurnin1 !== null)
                                {
                                gumpTurnin1.Select(Orion.CreateGumpHook(11));
                                Orion.Wait(200);
                                }
                            }
                        if(Orion.WaitForTarget(2000))
                            Orion.TargetObject(backpack);
                        if(Orion.WaitForGump(2000))
                            {
                            var gumpTurnin2 = Orion.GetGump(any, '0x000001C8');
                            if(gumpTurnin2 !== null)
                                {
                                gumpTurnin2.Select(Orion.CreateGumpHook(0));
                                Orion.Wait(200);
                                }
                            }
                        Orion.Wait(1200)
                        }
                    }
                }
            var completedBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                {
                return Orion.Contains(book.Properties(), 'Completed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                });
            Orion.MoveItem(bodObj.Serial(),0,completedBODBook[0].Serial());
            if(Orion.WaitForGump(2000))
                {
                var closeBookGump1 = Orion.GetGump(any, '0x0000029C');
                if(closeBookGump1 !== null)
                    {
                    closeBookGump1.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    }
                }
            Orion.Wait(1200);
            while(Orion.FindType('0x1BD7')[0])
                {
                Orion.CharPrint(self,1159,'Moving resources back to bank');
                Orion.MoveItem(Orion.FindType('0x1BD7')[0], 0, bank);
                Orion.Wait(1200);
                }
            }
        Orion.Wait(1200);
        if(!Orion.FindType('0x2258','0x05E8')[0])
            {
            Orion.CharPrint(self,1159,'Pulling BOD from bribed book');
            var bribeBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                {
                return Orion.Contains(book.Properties(), 'Bribed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(bribeBODBook[0])
                {
                Orion.UseObject(bribeBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Bribed BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function BodhiAshDoveTailTurnin()
    {
    BodhiTurnin(115)
    }

function BodhiCopperMalletTurnin()
    {
    BodhiTurnin(111)
    }

function BodhiTurnin(rewardCode)
    {
    Orion.Exec('GMJournalScan',true);
    var carpenter = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'the carpenter')
        })[0];
    if(!carpenter)
        return Orion.Print('No carpenter in vicinity! Halting...')
    Orion.CharPrint(self,1159,'Requesting BOD');
    Orion.WaitContextMenuID(carpenter.Serial(), 403);
    Orion.RequestContextMenu(carpenter.Serial());
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001C7');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(1));
            Orion.Wait(100);
            }
        }
    Orion.Wait(1200);
    while(true)
        {
        var bodObj = Orion.FindTypeEx('0x2258','0x05E8')[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            if(bodInfo.Fulfilled == bodInfo.Amount)
                {
                Orion.CharPrint(self,1159,'Turning in Completed BOD');
                Orion.MoveItem(bodObj.Serial(), 0, carpenter.Serial());
                Orion.Wait(500);
                if(Orion.WaitForGump(2000))
                    {
                    var completegump0 = Orion.GetGump(any, '0x00004268');
                    if(completegump0 !== null)
                        {
                        completegump0.Select(Orion.CreateGumpHook(rewardCode));
                        Orion.Wait(100);
                        }
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var completegump1 = Orion.GetGump(any, '0x00004269');
                    if(completegump1 !== null)
                        {
                        completegump1.Select(Orion.CreateGumpHook(7));
                        Orion.Wait(100);
                        }
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var completegump2 = Orion.GetGump(any, '0x00004268');
                    if(completegump2 !== null)
                        {
                        completegump2.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(500);
                Orion.CharPrint(self,1159,'Requesting BOD');
                Orion.WaitContextMenuID(carpenter.Serial(), 403);
                Orion.RequestContextMenu(carpenter.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001C7');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(1));
                        Orion.Wait(100);
                        }
                    }
                }
            else
                {
                var validBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), 'Valid', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                    });
                Orion.MoveItem(bodObj.Serial(), 0, validBODBook[0].Serial())
                if(Orion.WaitForGump(2000))
                    {
                    var closeBookGump1 = Orion.GetGump(any, '0x0000029C');
                    if(closeBookGump1 !== null)
                        {
                        closeBookGump1.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(200);
                        }
                    }
                }
            }
        Orion.Wait(600);
        if(!Orion.FindType('0x2258','0x05E8')[0])
            {
            Orion.Wait(600);
            Orion.CharPrint(self,1159,'Pulling BOD from completed book');
            var completedBODBook = Orion.FindTypeEx('0x2259').filter(function(book)
                {
                return Orion.Contains(book.Properties(), 'Completed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(completedBODBook[0])
                {
                Orion.UseObject(completedBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Completed BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{	
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}

function BODgrabber()
	{
	var armoire = Orion.FindType('0x0A4F', any, ground, '', 2)[0]
	var bodBook = Orion.FindTypeEx('0x2259').filter(function(book)
                {
                return Orion.Contains(book.Properties(), 'Valid', false);
                })[0];
	Orion.UseObject(armoire);
	Orion.Wait(1100);
	while(true)
		{
		while(Orion.FindType('0x2258','0x05E8',armoire)[0])
			{
			Orion.MoveItem(Orion.FindType('0x2258','0x05E8',armoire)[0], 0, bodBook.Serial())
			Orion.Wait(1100);
			}
		Orion.Wait(500);
		}
	}

function BODMules()
    {
    Orion.Wait(2000);
    Orion.OpenContainer(backpack);
    Orion.Wait(1000);
    var carpenter = Orion.FindTypeEx(any, any, ground, 'mobile', 24).filter(function(npc)
            {
            return Orion.Contains(npc.Properties(), 'the carpenter');
            })[0];
    var armoire = Orion.FindType('0x0A4F', any, ground, '', 2)[0];
    while(true)
        {
        Orion.WaitContextMenuID(carpenter.Serial(), 403);
        Orion.RequestContextMenu(carpenter.Serial());
        if (Orion.WaitForGump(1000))
            {
            var gump = Orion.GetGump(any, '0x000001C7');
            if (gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        while(Orion.FindType('0x2258','0x05E8')[0])
            {
            Orion.MoveItem(Orion.FindType('0x2258','0x05E8')[0], 0, armoire)
            Orion.Wait(1100);
            }
        var check = Orion.WaitJournal('An offer may be available in about', Orion.Now()-5000, Orion.Now()+1000, 'mobile', carpenter.Serial());
        if(check)
            break;
        }
    Orion.CloseUO();
    }

function BodInfo()
    {
    Orion.WaitForAddObject('myTarget');
    var target = Orion.FindObject('myTarget');
    var bod = BodParse(target);
    Orion.Print('Bod Size: ' + bod.Size);
    Orion.Print('Bod Material: ' + bod.Material);
    Orion.Print('Bod Material Code: ' + bod.MaterialCode);
    Orion.Print('Bod Material Color: ' + bod.MaterialColor);
    Orion.Print('Bod Quality: ' + bod.Quality);
    Orion.Print('Bod Amount: ' + bod.Amount);
    Orion.Print('Bod Fulfilled: ' + bod.Fulfilled);
    Orion.Print('Bod Item: ' + bod.Item);
    Orion.Print('Bod Points: ' + bod.Points);
    if(bod.Points >= 750)
        Orion.CharPrint(self,1159, 'Keeper!');
    }

function BodParse(bod)
    {
    var bodPropLines = bod.Properties().match(/^.*$/gm);
    var size = bodPropLines[3];
    var material = bodPropLines[4];
    var materialInfo = materialArr.filter(function(part)
        {
        return part[0] == material;
        });
    var materialCode = materialInfo[0][1]
    var materialColor = materialInfo[0][2]
    var quality =  bodPropLines[5];
    var amount = Number(bodPropLines[6].match(/Amount To Make: (\d+)/)[1]);
    var itemfulfilled = bodPropLines[7].match(/([\w\-\)\( ]*): (\d+)/);
    var item = itemfulfilled[1];
    var fulfilled = Number(itemfulfilled[2]);
    var points = pointsArr.filter(function(compare)
            {
            return material == compare.Material && quality == compare.Quality && amount == compare.Amount;
            })[0].Points;
    var numPoints = Number(points);
    var bodObj = {Size: size, Material: material, MaterialCode: materialCode, MaterialColor: materialColor, Quality: quality, Amount: amount, Fulfilled: fulfilled, Item: item, Points: numPoints};
    return bodObj;
    }

function MoveAll()
    {
    Orion.CharPrint(self, 1159, 'Target FROM container')
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container')
    Orion.WaitForAddObject('toContainer');
    while(Orion.FindType(any, any, 'fromContainer')[0])
        {
        Orion.MoveItem(Orion.FindType(any, any, 'fromContainer')[0], 0, 'toContainer')
        Orion.Wait(1100);
        }
    }

function MoveAllBODs()
    {
    Orion.CharPrint(self, 1159, 'Target FROM container')
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container')
    Orion.WaitForAddObject('toContainer');
    while(Orion.FindType('0x2258', any, 'fromContainer')[0])
        {
        Orion.MoveItem(Orion.FindType('0x2258', any, 'fromContainer')[0], 0, 'toContainer')
        Orion.Wait(1100);
        }
    }

function MoveAllSaws()
    {
    Orion.CharPrint(self, 1159, 'Target FROM container')
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container')
    Orion.WaitForAddObject('toContainer');
    while(Orion.FindType('0x1029', any, 'fromContainer')[0])
        {
        Orion.MoveItem(Orion.FindType('0x1029', any, 'fromContainer')[0], 0, 'toContainer')
        Orion.Wait(1100);
        }
    }

function SawCombiner()
	{
	while(true)
		{
		var saws = Orion.FindTypeEx('0x1029').filter(function(part)
			{
			return  +part.Properties().match(/Uses Remaining: (\d+)/)[1] < 50;
			});
		if(saws[1])
			{
			Orion.UseObject(saws[0].Serial())
			Orion.WaitForTarget(2000);
			Orion.TargetObject(saws[1].Serial());
			}
		else
			break;
		Orion.Wait(1200);
		}
	}

function BokInit()
    {
    Orion.ToggleScript('Bok', true);
    Orion.ToggleScript('BokGump', true);
    }

function Bok()
    {
    Orion.ResumeScript('BokGump');
    Orion.CharPrint(self,1159,'Target your supply container. It should contain boards, ingots, ash runics, and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var trashBarrel = Orion.FindType('0x0E77', '0x0358', ground, ' ', 2)[0];
    var soulForge = Orion.FindType('0x44C7', any, ground, ' ', 2)[0];
    while(true)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        if(!trashBarrel || Orion.GetDistance(trashBarrel) > 2)
            return Orion.Print('Trash Barrel not found! Halting...');
        if(!soulForge || Orion.GetDistance(soulForge) > 2)
            return Orion.Print('Soul Forge not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1200);
            } 
        while(Player.MaxWeight() - Player.Weight() < 100)
            {
            Orion.CharPrint(self,1159,'Over weight threshold, moving imbuing mats');
            while(Orion.FindType('0x2DB1|0x2DB2|0x2DB3')[0])
                {
                Orion.MoveItem(Orion.FindType('0x2DB1|0x2DB2|0x2DB3')[0], 0, supplyContainer.Serial());
                Orion.Wait(1100);
                }
            }
        while(Orion.Count('0x1BD7') < 20)
            {
            Orion.CharPrint(self,1159,'Restocking Boards');
            if(!Restock('Boards','0x1BD7', supplyContainer.Serial(), 200))
                return;
            }
        while(!Orion.FindType('0x10E7')[0]) //no carpenter tool
            {
            while(!Orion.FindType('0x1EB9')[0]) //no tinker tool
                {
                while(Orion.Count('0x1BF2') < 5) //no ingots
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots','0x1BF2', supplyContainer.Serial(), 50))
                        return;
                    }
                Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                if(!Restock('Tinker Tool','0x1EB9', supplyContainer.Serial(), 1))
                    return;
                }
            Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
            CraftItem('0x1EB9', 9003, 10);
            }
        var inviableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
            {
            var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
            return charges < 4;
            });
        if(inviableRunics.length > 1)
            {
            Orion.CharPrint(self,1159,'Combining Runic Tools');
            Orion.UseObject(inviableRunics[0].Serial());
            Orion.WaitForTarget(2000);
            Orion.TargetObject(inviableRunics[1].Serial());
            Orion.Wait(1100);
            Orion.MoveItem(inviableRunics[0].Serial());
            Orion.Wait(1100);
            }
        var viableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
            {
            var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
            return charges >= 4;
            });
        while(!viableRunics[0])
            {
            Orion.CharPrint(self,1159,'Restocking Runic Tool');
            if(!Restock('Runic Tool','0x1029', supplyContainer.Serial(), 0))
                return;
            viableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges >= 4;
                });
            }
        while(!Orion.FindType('0x27A8')[0])
            {
            Orion.CharPrint(self,1159,'Crafting Bokuto');
            CraftItem('0x10E7', 9004, 121);
            Orion.Wait(200);
            }
        if(Orion.GetGlobal('created'))
            {
            var createdIncrement = Number(Orion.GetGlobal('created')) + 1;
            Orion.SetGlobal('created', createdIncrement);
            }
        var bok = Orion.FindTypeEx('0x27A8')[0];
        Orion.MoveItem(bok.Serial());
        Orion.Wait(1100);
        if(Orion.Contains(bok.Properties(), 'Exceptional'))
            {
            while(!Orion.Contains(bok.Properties(), 'Reforged'))
                {
                Orion.CharPrint(self,1159,'Reforging Bokuto');
                Orion.UseObject(viableRunics[0].Serial());
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(bok.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    if(!CheckGumpCliloc('0x000F3EAC', 1151715))
                        {
                        TextWindow.Open();
                        TextWindow.Print('Reforge not set to Vicious / of Slaughter. Pausing...');
                        Orion.PauseScript('Bok');
                        }
                    var gumpReforge = Orion.GetGump(any, '0x000F3EAC');
                    if(gumpReforge !== null)
                        {
                        gumpReforge.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(1100);
                Orion.MoveItem(bok.Serial());
                Orion.Wait(1100);
                }
            if(Orion.GetGlobal('reforged'))
                {
                var reforgeIncrement = Number(Orion.GetGlobal('reforged')) + 1;
                Orion.SetGlobal('reforged', reforgeIncrement);
                }
            if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%|Hit Fireball 70%|Hit Harm 70%|Hit Lower Defense 70%') && Orion.Contains(bok.Properties(), 'Chaos Damage|Fire Damage|Cold Damage|Poison Damage|Energy Damage'))
                {
                Orion.CharPrint(self,1159,'70/70 made!');
                while(Orion.FindType('0x27A8')[0])
                    {
                    Orion.MoveItem(bok.Serial(), 0, supplyContainer.Serial());
                    Orion.Wait(1100);
                    }
                if(Orion.GetGlobal('saved7070'))
                    {
                    var seventyseventyIncrement = Number(Orion.GetGlobal('saved7070')) + 1;
                    Orion.SetGlobal('saved7070', seventyseventyIncrement);
                    }
                }
            else if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%'))
                {
                Orion.CharPrint(self,1159,'70 lightning made!');
                while(Orion.FindType('0x27A8')[0])
                    {
                    Orion.MoveItem(bok.Serial(), 0, supplyContainer.Serial());
                    Orion.Wait(1100);
                    }
                if(Orion.GetGlobal('saved70lightning'))
                    {
                    var lightningIncrement = Number(Orion.GetGlobal('saved70lightning')) + 1;
                    Orion.SetGlobal('saved70lightning', lightningIncrement);
                    } 
                }
            else
                {
                while(bok.Exists())
                    {
                    Orion.CharPrint(self,1159,'Unraveling Bokuto');
                    Orion.UseSkill('Imbuing');
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpImbue = Orion.GetGump(any, '0x000F3E93');
                        if(gumpImbue !== null)
                            {
                            gumpImbue.Select(Orion.CreateGumpHook(2));
                            Orion.Wait(100);
                            }
                        }   
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(bok.Serial());
                    Orion.Wait(500);
                    }
                }   
            }
        else
            {
            while(Orion.FindType('0x27A8')[0])
                {
                Orion.CharPrint(self,1159,'Trashing Bokuto');
                Orion.MoveItem(bok.Serial(), 0, trashBarrel);
                Orion.Wait(1100);
                }
            }
        }
    }

function BokGump(_)
    {
    Orion.SetGlobal('created', '0');
    Orion.SetGlobal('reforged', '0');
    Orion.SetGlobal('saved7070', '0');
    Orion.SetGlobal('saved70lightning', '0');
    var startTime = Orion.Now(); 
    while(true)
        {
        if(!Orion.ScriptRunning('Bok'))
            {
            var startPause = Orion.Now();
            Orion.PauseScript('BokGump');
            var adjustForPause = Orion.Now() - startPause;
            startTime += adjustForPause;
            }
        var created = Number(Orion.GetGlobal('created'));
        var reforged = Number(Orion.GetGlobal('reforged'));
        var saved7070 = Number(Orion.GetGlobal('saved7070'));
        var saved70lightning = Number(Orion.GetGlobal('saved70lightning'));
        var sec = ((Orion.Now() - startTime)/1000).toFixed(0);
        var min = Math.floor(sec/60);
        var hour = Math.floor(min/60);
        var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2)
        Orion.Wait(1000);
        var reforgedperhour = reforged / ((sec / 3600).toFixed(3));  
		var gump = Orion.CreateCustomGump(12001);
		gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 190, 105);
		
        gump.AddText(15, 5, "0",'Time Elapsed: ');
        gump.AddText(110, 5, "0",time);
        gump.AddText(15, 20, "0",'Created: ');
        gump.AddText(110, 20, "0",created);
        gump.AddText(15, 35, "0",'Reforged: ');
        gump.AddText(110, 35, "0",reforged);
        gump.AddText(15, 50, "0",'70/70s: ');
        gump.AddText(110, 50, "0",saved7070);
        gump.AddText(15, 65, "0",'70 Lightning: ');
        gump.AddText(110, 65, "0",saved70lightning);
        gump.AddText(15, 80, "0",'Reforged/hr: ');
        gump.AddText(110, 80, "0",reforgedperhour.toFixed(2));

        gump.Update();
        }
    }

function CheckGumpCliloc(gumpID, clilocID)//check if clilocID is in gump. Return 1 if it is, 0 if not, and null if gump isn't found. 
	{
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID)
        if(gump !== null)
		    return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
	}

function Eval()
	{
	Orion.WaitForAddObject('myTarget');
	var bok = Orion.FindObject('myTarget');
	Orion.Print(EvalBok(bok))
	}
	
function EvalBok(bok)
	{
	if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%|Hit Fireball 70%|Hit Harm 70%|Hit Lower Defense 70%') && Orion.Contains(bok.Properties(), 'Fire Damage|Cold Damage|Poison Damage|Energy Damage'))
		return true;
	return false;	
	}

function GoToCarpenter() 
    {
    if(!Orion.RegRead('runeIndex'))
		Orion.RegWrite('runeIndex', '1');
	var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'the carpenter')
        });
	if(npc.length)
        {
        Orion.WalkTo(npc[0].X(),npc[0].Y(),npc[0].Z(), 1);
        return npc[0];
	    }
    else
        {
        var runeIndex = Orion.RegRead('runeIndex');
        AtlasByName('Carpenters', runeIndex);
        if(runeIndex < numRunes)
            Orion.RegWrite('runeIndex', +runeIndex + 1);
        else
            Orion.RegWrite('runeIndex', '1');
        }
	return GoToCarpenter();
    }

function BribeCheck(carpenterSerial, bodSerial)
    {
    Orion.WaitContextMenuID(carpenterSerial, 419);
    Orion.RequestContextMenu(carpenterSerial);
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(bodSerial);
    var check = Orion.WaitJournal("If you help me out, I'll help you out", Orion.Now()-1000, Orion.Now() + 1000, 'mobile', carpenterSerial)
    if(check)
        {
        var cost = Number(check.Text().match(/\d+/))
        return cost;
        }
    return -1;
    }

function CraftItem(toolSet, menuButtonID, itemButtonID)
    {
    Orion.UseObject(Orion.FindType(toolSet)[0]);
    var startTime = Orion.Now()
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(menuButtonID));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(itemButtonID));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(5000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(1000))
        {
        var gump4 = Orion.GetGump(any, '0x000001CC');
        if(gump4 !== null)
            {
            gump4.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            }
        }
    Orion.Wait(200);
    var elapsedTime = Orion.Now() - startTime;
    if(elapsedTime < 1200)
        Orion.Wait(1200 - elapsedTime);
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID)
    {
    if(!colorID)
        colorID = any;
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, backpack, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        Orion.Wait(100);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0]);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
    }

function AtlasByName(bookName,runeName,backupBook,backupRune) 
	{
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x9C16').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName;
        });
    if(!runeItem[0])
        {
        Orion.Print("Atlas named '" + bookName + "' not found!");
        Orion.Wait(500);
        return false;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 500)
    	var recallType = 4000; //recall
	else
		var recallType = 5000; //sacred journey
    Orion.CharPrint(self, 1159, "Recalling to: '" + runeName + "' in Atlas: '" + bookName + "'");
	Orion.UseObject(runeItem[0].Serial());
	if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(runeName) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001F2');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(100);
                        }
                    }
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(runeName) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(runeName);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 23)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        break;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    	    break;
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001F2');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(5));
                        Orion.Wait(100);
                        }
                    }
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(buttonCode));
            Orion.Wait(100);
            }
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(recallType));
            Orion.Wait(100);
            }
        }
	var check = Orion.WaitJournal('Something is blocking the location.|You cannot teleport into that area.', Orion.Now(), Orion.Now()+4000, 'sys');
	if(check && check.Text() == 'Something is blocking the location.')
		{
        Orion.Wait(2000);
        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
            {
            return part.Properties().match(/.+$/) == backupBook;
            });
        if(backup)
            return AtlasByName(backupBook, backupRune, bookName, runeName);
        else
            Orion.Print("No backup atlas named '" + backupBook + "' found!");
		}
    else if(check && check.Text() == 'You cannot teleport into that area.')
		{
        var runeIndex = Orion.RegRead('runeIndex');
        if(runeIndex < numRunes)
            Orion.RegWrite('runeIndex', +runeIndex + 1);
        else
            Orion.RegWrite('runeIndex', '1');
        return AtlasByName(bookName, runeIndex);
		}
	if(x == Player.X() && y == Player.Y()) 
        return AtlasByName(bookName,runeName,backupBook,backupRune);
    return true;
	}

function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}

if(smallBODs == true)
    {
    var CarpentryArr =
    [//Name, CategoryButton, ItemButton, Wood, Bark Fragments, Cloth, Feathers, Scrolls
    //other
        ['Barrel Staves', 9001, 68, 1, 0, 0],
        ['Barrel Lid', 9001, 69, 1, 0, 0],
    //furniture
        ['Foot Stool', 9002, 82, 1, 0, 0],
        ['Stool', 9002, 83, 1, 0, 0],
    //containers
        ['Crate', 9003, 98, 1, 0, 0],
    ];
    }
else
    {
    var CarpentryArr =
        [//Name, CategoryButton, ItemButton, Wood, Bark Fragments, Cloth, Feathers, Scrolls
        //other
            ['Barrel Staves', 9001, 68, 1, 0, 0],
            ['Barrel Lid', 9001, 69, 1, 0, 0],
            ['Music Stand', 9001, 70, 1, 0, 0],
            //['short music stand right', 9001, 71, 1, 0, 0],
            //['tall music stand left', 9001, 72, 1, 0, 0],
            //['tall music stand right', 9001, 73, 1, 0, 0],
            //['easel south', 9001, 74, 1, 0, 0],
            ['Easel', 9001, 75, 1, 0, 0],
            //['easel north', 9001, 76, 1, 0, 0],
            ['Red Hanging Lantern', 9001, 77, 1, 0, 0, 0, 1], //scrolls wtf
            ['White Hanging Lantern', 9001, 78, 1, 0, 0, 0, 1], //scrolls wtf
            //['Shoji Screen', 9001, 79, 1, 0, 1], //too expensive
            //['Bamboo Screen', 9001, 80, 1, 0, 1],//too expensive
            ['Fishing Pole', 9001, 81, 1, 0, 1],
        //furniture
            ['Foot Stool', 9002, 82, 1, 0, 0],
            ['Stool', 9002, 83, 1, 0, 0],
            ['Straw Chair', 9002, 84, 1, 0, 0],
            ['Wooden Chair', 9002, 85, 1, 0, 0],
            ['Vesper-style Chair', 9002, 86, 1, 0, 0],
            ['Trinsic-style Chair', 9002, 87, 1, 0, 0],
            ['Wooden Bench', 9002, 88, 1, 0, 0],
            ['Wooden Throne', 9002, 89, 1, 0, 0],
            ['Magincia-style Throne', 9002, 90, 1, 0, 0],
            ['Small Table', 9002, 91, 1, 0, 0],
            ['Writing Table', 9002, 92, 1, 0, 0],
            ['Large Table', 9002, 93, 1, 0, 0],
            ['Yew-wood Table', 9002, 94, 1, 0, 0],
            ['Elegant Low Table', 9002, 95, 1, 0, 0],
            ['Plain Low Table', 9002, 96, 1, 0, 0], 
            //deed['Ornate Table (south)', 9002, 209, 1, 0, 0],
            //deed['Ornate Table (east)', 9002, 210, 1, 0, 0],
            //deed/too expensive['Hardwood Table (south)', 9002, 211, 1, 0, 0],
            //deed/too expensive['Hardwood Table (east)', 9002, 212, 1, 0, 0],
            ['Elven Podium', 9002, 300, 1, 0, 0],
            //recipe['Ornate Elven Chairs', 9002, 304, 1, 0, 0],
            ['Cozy Elven Chair', 9002, 305, 1, 0, 0],
            ['Reading Chair', 9002, 307, 1, 0, 0],
            ['Ter-Mur Style Chair', 9002, 315, 1, 0, 0],
            //too expensive['Ter-Mur Style Table', 9002, 316, 1, 0, 0],
            //['Upholstered Chair', 9002, 931, 1, 0, 0],
        //containers
            ['Wooden Box', 9003, 97, 1, 0, 0],
            ['Crate', 9003, 98, 1, 0, 0],
            ['Medium Crate', 9003, 99, 1, 0, 0],
            ['Large Crate', 9003, 100, 1, 0, 0],
            ['Wooden Chest', 9003, 101, 1, 0, 0],
            ['Wooden Shelf', 9003, 102, 1, 0, 0],
            ['Armoire Red', 9003, 103, 1, 0, 0],
            ['Armoire', 9003, 104, 1, 0, 0],
            ['Plain Wooden Chest', 9003, 105, 1, 0, 0],
            ['Ornate Wooden Chest', 9003, 106, 1, 0, 0],
            ['Gilded Wooden Chest', 9003, 107, 1, 0, 0],
            ['Wooden Footlocker', 9003, 108, 1, 0, 0],
            ['Finished Wooden Chest', 9003, 109, 1, 0, 0],
            ['Tall Cabinet', 9003, 110, 1, 0, 0],
            ['Short Cabinet', 9003, 111, 1, 0, 0],
            ['Red Armoire', 9003, 112, 1, 0, 0],
            ['Elegant Armoire', 9003, 113, 1, 0, 0],
            ['Maple Armoire', 9003, 114, 1, 0, 0],
            ['Cherry Armoire', 9003, 115, 1, 0, 0],
            //['Keg', 9003, 116, 1, 0, 0], //too many ingredients
            //recipe/too expensive/deed['Arcane Bookshelf (south)', 9003, 205, 1, 0, 0],
            //recipe/too expensive/deed['Arcane Bookshelf (east)', 9003, 206, 1, 0, 0],
            //recipe['Ornate Elven Chest (south)', 9003, 213, 1, 0, 0],
            //recipe['Ornate Elven Chest (east)', 9003, 214, 1, 0, 0],
            //deed['Elven Wash Basin (south)', 9003, 215, 1, 0, 0],
            //deed['Elven Wash Basin (east)', 9003, 216, 1, 0, 0],
            //recipe/too expensive/deed['Elven Dresser (south)', 9003, 217, 1, 0, 0],
            //recipe/too expensive/deed['Elven Dresser (east)', 9003, 218, 1, 0, 0],
            //recipe['Elven Armoire (fancy)', 9003, 302, 1, 0, 0], //too expensive
            //recipe['Elven Armoire (simple)', 9003, 303, 1, 0, 0], //too expensive
            ['Rarewood Chest', 9003, 308, 1, 0, 0],
            ['Decorative Box', 9003, 309, 1, 0, 0],
            //special mats['Academic Bookcase', 9003, 313, 1, 0, 0],
            ['Gargish Chest', 9003, 317, 1, 0, 0],
            //special mats['Empty Liquor Barrel', 9003, 318, 1, 0, 0],
        //weapons
            ["Shepherd's Crook", 9004, 117, 1, 0, 0],
            ['Quarter Staff', 9004, 118, 1, 0, 0],
            ['Gnarled Staff', 9004, 119, 1, 0, 0],
            ['Bokuto', 9004, 121, 1, 0, 0],
            ['Fukiya', 9004, 122, 1, 0, 0],
            ['Tetsubo', 9004, 123, 1, 0, 0],
            ['Wild Staff', 9004, 135, 1, 0, 0],
            //recipe['Phantom Staff', 9004, 137],
            //recipe["Arcanist's Wild Staff", 9004, 157],
            //recipe['Ancient Wild Staff', 9004, 158],
            //recipe['Thorned Wild Staff', 9004, 159],
            //recipe['Hardened Wild Staff', 9004, 160],
            //recipe['Serpentstone Staff', 9004, 161],
            ['Gargish Gnarled Staff', 9004, 164, 1, 0, 0],
            ['Club', 9004, 312, 1, 0, 0],
            ['Black Staff', 9004, 906, 1, 0, 0],
            //['Kotl Black Rod', 9004, 957],
            //['Gargish Kotl Black Rod', 9004, 958],
        //armor
            ['Wooden Shield', 9005, 120, 1, 0, 0],
            //['Woodland Chest', 9005, 140, 1, 1, 0],
            //['Woodland Arms', 9005, 141, 1, 1, 0],
            //['Woodland Gauntlets', 9005, 142, 1, 1, 0],
            //['Woodland Leggings', 9005, 143, 1, 1, 0],
            //['Woodland Gorget', 9005, 144, 1, 1, 0],
            //['Raven Helm', 9005, 145, 1, 1, 0, 1],
            //['Vulture Helm', 9005, 146, 1, 1, 0, 1],
            //['Winged Helm', 9005, 147, 1, 1, 0, 1],
            //['Ironwood Crown', 9005, 148],
            //['Bramble Coat', 9005, 149],
            //['Darkwood Crown', 9005, 150],
            //['Darkwood Chest', 9005, 151],
            //['Darkwood Gorget', 9005, 152],
            //['Darkwood Leggings', 9005, 153],
            //['Darkwood Pauldrons', 9005, 154],
            //['Darkwood Gauntlets', 9005, 155],
            //['Gargish Wooden Shield', 9005, 163],
            //['Pirate Shield', 9005, 962],
        //instruments
            ['Lap Harp', 9006, 124, 1, 0, 1],
            ['Standing Harp', 9006, 125, 1, 0, 1],
            ['Drum', 9006, 126, 1, 0, 1],
            ['Lute', 9006, 127, 1, 0, 1],
            ['Tambourine', 9006, 128, 1, 0, 1],
            //['Tambourine', 9006, 129, 1, 0, 1], //tassel
            ['Bamboo Flute', 9006, 130, 1, 0, 0],
            //['Aud-char', 9006, 162],
            //['Snake Charmer Flute', 9006, 518],
            //['Cello', 9006, 927],
            //['Wall Mounted Bell', 9006, 928],
            //['Wall Mounted Bell', 9006, 929], //east
            //['Trumpet', 9006, 930],
            //['Cowbell', 9006, 948],
        //misc addons
            //too expensive['Bulletin Board (east)', 9007, 131, 1, 0, 0],
            //['Bulletin Board (west)', 9007, 132, 1, 0, 0],
            //deed['Parrot Perch', 9007, 156, 1, 0, 0],
            //deed['Arcane Circle', 9007, 200],
            //recipe['Tall Elven Bed', 9007, 201],
            //recipe['Tall Elven Bed (east)', 9007, 202],
            //deed/too expensive['Elven Bed (south)', 9007, 203, 1, 0, 1],
            //deed/too expensive['Elven Bed (east)', 9007, 204, 1, 0, 1],
            //deed/too expensive['Elven Loveseat (south)', 9007, 207, 1, 0, 0],
            //deed/too expensive['Elven Loveseat (east)', 9007, 208, 1, 0, 0],
            //deed/too expensive['Alchemist Table (south)', 9007, 224, 1, 0, 0],
            //deed/too expensive['Alchemist Table (east)', 9007, 225, 1, 0, 0],
            //deed/too expensive['Small Bed (south)', 9007, 500, 1, 0, 1],
            //deed/too expensive['Small Bed east', 9007, 501, 1, 0, 1],
            //deed/too expensive['Large Bed (east)', 9007, 502, 1, 0, 1],
            //deed/too expensive['Large Bed (east)', 9007, 503, 1, 0, 1],
            //deed['Dartboard', 9007, 504],
            //['Dartboard east', 9007, 505],
            //deed['Ballot Box', 9007, 506],
            //deed['Pentagram', 9007, 507],
            //deed['Abbatoir', 9007, 508],
            //deed/too expensive['Gargish Couch (south)', 9007, 510, 1, 0, 0],
            //deed/too expensive['Gargish Couch (east)', 9007, 511],
            //deed/too expensive['Long Table (south)', 9007, 512, 1, 0, 0],
            //deed/too expensive['Long Table (east)', 9007, 513],
            //deed/too expensive['Short Table', 9007, 514, 1, 0, 0],
            //deed/too expensive['Ter-Mur Style Dresser (south)', 9007, 515, 1, 0, 0],
            //deed/too expensive['Ter-Mur Style Dresser (east)', 9007, 516],
        //tailoring and cooking
            ['Dress Form', 9008, 133, 1, 0, 1]
            //['Dress Form', 9008, 134, 1, 0, 1], //side
            //deed/too expensive['Elven Spinning Wheel (east)', 9008, 220, 1, 0, 1],
            //deed/too expensive['Elven Spinning Wheel (south)', 9008, 221, 1, 0, 1],
            //deed/too expensive['Elven Oven (east)', 9008, 222, 1, 0, 0],
            //deed/too expensive['Elven Oven (south)', 9008, 223, 1, 0, 0],
            //deed/too expensivedeed['Spinning Wheel (east)', 9008, 800],
            //deed/too expensive['Spinning Wheel (south)', 9008, 801],
            //deed['Loom (east)', 9008, 802, 1, 0, 1],
            //deed['Loom (south)', 9008, 803, 1, 0, 1],
            //deed['Stone Oven (east)', 9008, 900], //ingots
            //deed['Stone Oven (south)', 9008, 901],
            //deed['Flour Mill (east)', 9008, 902], //ingots
            //deed['Flour Mill (south)', 9008, 903],
            //deed['Water Trough (east)', 9008, 904]
            //deed['Water Trough (south)', 9008, 905]
        ];
    }

var materialArr =
    [ //name, button code, color
        ['Wood', 5000, '0x0000'],
        ['Oak', 5001, '0x07DA'],
        ['Ash', 5002, '0x04A7'],
        ['Yew', 5003, '0x04A8'],
        ['Heartwood', 5004, '0x04A9'],
        ['Bloodwood', 5005, '0x04AA'],
        ['Frostwood', 5006, '0x047F']
    ];

var pointsArr = 
    [
        //Normal
        {Material: 'Wood',			Quality: 'Normal',		Amount: 10,	Points:	10},
        {Material: 'Wood',			Quality: 'Normal',		Amount: 15,	Points:	25},
        {Material: 'Wood',			Quality: 'Normal',		Amount: 20,	Points:	50},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 10,	Points:	310},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 15,	Points:	325},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 20,	Points:	350},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 10,	Points:	360},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 15,	Points:	375},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 20,	Points:	400},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 10,	Points:	410},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 15,	Points:	425},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 20,	Points:	450},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 10,	Points:	460},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 15,	Points:	475},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 20,	Points:	500},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 10,	Points:	510},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 15,	Points:	525},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 20,	Points:	550},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 10,	Points:	560},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 15,	Points:	575},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 20,	Points:	600},
        //Exceptional
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 10,	Points:	210},
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 15,	Points:	225},
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 20,	Points:	250},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 10,	Points:	510},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 15,	Points:	525},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 20,	Points:	550},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 10,	Points:	560},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 15,	Points:	575},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 20,	Points:  600},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 10,	Points:	610},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 15,	Points:	625},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 20,	Points:	650},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 10,	Points:	660},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 15,	Points:	675},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 20,	Points:	700},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 10,	Points:	710},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 15,	Points:	725},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 20,	Points:	750},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 10,	Points:	760},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 15,	Points:	775},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 20,	Points:	800}
    ]