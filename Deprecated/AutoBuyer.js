function testArr()
    {
    var npcInventoryObj = Orion.ObjAtLayer("Buy", 0x004A0DA4);
    var npcInventory = npcInventoryObj.Serial();
    var npcItems = Orion.FindTypeEx('0x0F26', any, npcInventory);
    Orion.Print(npcItems[0].Count() / +npcItems[0].Properties().match(/Weight: (\d+)/)[1]);
    }

function GemBuyer()
    {//GemBuyer Config
    var runebookOne = 'GemsOne'; //Locations named 1,2,3,4,etc and one location to a bank named 'Bank'
    var runebookTwo = 'GemsTwo'; //backup duplicate runebook in case first recall location is blocked
    var maxPurchasePrice = 200;  //Ignore gems more expensive than this;
    var numRunes = 2; //set to the number of rune locations to rotate through
    var shopkeepTitles = 'the jeweler';
    //new ShopListItem('graphic', 'color', 'name', count, price, 'comment', enabled);
    var items = [
        new ShopListItem('0x0F26', '0x0000', '', 1, maxPurchasePrice + 100), //Diamond
        new ShopListItem('0x0F25', '0x0000', '', 1, maxPurchasePrice), //Amber
        new ShopListItem('0x0F18', '0x0000', '', 1, maxPurchasePrice), //Tourmaline
        new ShopListItem('0x0F16', '0x0000', '', 1, maxPurchasePrice), //Amethyst
        new ShopListItem('0x0F15', '0x0000', '', 1, maxPurchasePrice), //Citrine
        new ShopListItem('0x0F13', '0x0000', '', 1, maxPurchasePrice), //Ruby
        new ShopListItem('0x0F11', '0x0000', '', 1, maxPurchasePrice), //Sapphire
        new ShopListItem('0x0F10', '0x0000', '', 1, maxPurchasePrice), //Emerald
        new ShopListItem('0x0F0F', '0x0000', '', 1, maxPurchasePrice), //Star Sapphire
        ];
    var itemsPerStone = 10;
    
    //No edit
    AliBuyer(items, itemsPerStone, shopkeepTitles, runebookOne, runebookTwo, numRunes);
    }

function AliBuyer(items, itemsPerStone, shopkeepTitles, runebookOne, runebookTwo, numRunes)
    {
    var runeIndex = '1';
    Shared.AddVar('numRunes', numRunes);
    Orion.OAOptionSet('JournalEcho', '1');
    var stringPiper = '';
    items.forEach(function(shopListItem)
        {
        stringPiper += shopListItem.Graphic() + '|';
        });
    var graphicsString = stringPiper.slice(0,-1);
    while(true)
        {
        RecallByGump(runebookOne,runeIndex,runebookTwo,runeIndex);
        Orion.IgnoreReset();
        var vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
            {
            return Orion.Contains(vendor.Properties(), shopkeepTitles) && !Orion.Contains(vendor.Properties(), 'guild');
            });
        while(vendors[0])
            {
            vendors.sort(function(a,b)
                {
                return a.Distance() - b.Distance();
                });
            if(Player.MaxWeight() - Player.Weight() < 100)
                {
                RecallByGump(runebookOne,'Bank',runebookTwo,'Bank');
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                var playerBankSerial = Player.BankSerial();
                while(Orion.FindType(graphicsString)[0])
                    {
                    var gemMove = Orion.FindType(graphicsString)[0];
                    Orion.MoveItem(gemMove, 0, playerBankSerial);
                    Orion.Wait(1300);
                    }
                RecallByGump(runebookOne,runeIndex,runebookTwo,runeIndex);
                }
            var shopnpc = vendors[0];
            var shopnpcSerial = shopnpc.Serial();
            while(shopnpc.Distance() > 6)
                Orion.WalkTo(shopnpc.X(),shopnpc.Y(),shopnpc.Z(), 5);
            Orion.WaitContextMenuID(shopnpcSerial, 110);
            Orion.RequestContextMenu(shopnpcSerial);
            var startTime = Orion.Now();
            var endTime = startTime + 2000;
            while(!Orion.GumpExists('shop', shopnpcSerial) && Orion.Now() < endTime)
                {
                Orion.Wait(100);
                }
            if(!Orion.GumpExists('shop', shopnpcSerial))
                {
                Orion.WaitContextMenuID(shopnpcSerial, 110);
                Orion.RequestContextMenu(shopnpcSerial);
                startTime = Orion.Now();
                endTime = startTime + 2000;
                while(!Orion.GumpExists('shop', shopnpcSerial) && Orion.Now() < endTime)
                    {
                    Orion.Wait(100);
                    }
                if(!Orion.GumpExists('shop', shopnpcSerial))
                    {
                    Orion.Wait(2000);
                    Orion.Ignore(shopnpcSerial);
                    vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                        {
                        return Orion.Contains(vendor.Properties(), shopkeepTitles) && !Orion.Contains(vendor.Properties(), 'guild');
                        }); 
                    Orion.CloseGump('shop', shopnpcSerial);
                    continue;
                    }
                }
            var npcInventoryObj = Orion.ObjAtLayer("Buy", shopnpcSerial);
            if(!npcInventoryObj)
                continue;
            var npcInventory = npcInventoryObj.Serial();
            var npcItems = Orion.FindTypeEx(graphicsString, any, npcInventory);
            if(npcItems.length == 0)
                {
                Orion.Print('# of items matched on vendor: 0');
                Orion.Wait(2000);
                Orion.Ignore(shopnpcSerial);
                vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                    {
                    return Orion.Contains(vendor.Properties(), shopkeepTitles) && !Orion.Contains(vendor.Properties(), 'guild');
                    }); 
                Orion.CloseGump('shop', shopnpcSerial);
                continue;
                }
            else
                var buyAmount = Math.floor( ((Player.MaxWeight() - Player.Weight() - 25)*itemsPerStone) / npcItems.length );
            var shoplist = Orion.GetShopList('AliBuyer');
            for(var i=0;i<items.length;i++)
                {
                Orion.Print(items[i].Graphic())
                items[i].SetCount(buyAmount);
                }
            shoplist.SetItems(items);
            Orion.UpdateShopList(shoplist);
            Orion.Print('# of items matched on vendor: ' + npcItems.length + '\nAmount of each gem to buy: ' + buyAmount);
            Orion.Wait(1300 - (Orion.Now() - startTime));
            Orion.BuyHook('AliBuyer');
            Orion.WaitContextMenuID(shopnpcSerial, 110);
            Orion.RequestContextMenu(shopnpcSerial);
            var journalCheck = Orion.WaitJournal('No items to bought. Waiting cancelled.|Preveous waiting for shopping cancelled.|My thanks for the patronage.', Orion.Now()-1000, Orion.Now()+15000);
            if(!journalCheck)
                {
                Orion.Wait(2000);
                Orion.Ignore(shopnpcSerial);
                vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                    {
                    return Orion.Contains(vendor.Properties(), shopkeepTitles) && !Orion.Contains(vendor.Properties(), 'guild');
                    }); 
                Orion.CloseGump('shop', shopnpcSerial);
                continue;
                }
            switch(journalCheck.Text())
                {
                case 'No items to bought. Waiting cancelled.':
                case 'Preveous waiting for shopping cancelled.':
                    Orion.Wait(1000);
                    Orion.Ignore(shopnpcSerial);
                    vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                        {
                        return Orion.Contains(vendor.Properties(), shopkeepTitles) && !Orion.Contains(vendor.Properties(), 'guild');
                        });
                    break;
                case 'My thanks for the patronage.':
                    break;
                default:
                    break;
                }
            Orion.Wait(1000);
            Orion.CloseGump('shop', shopnpcSerial);
            }
        var runeIndexNum = +runeIndex + 1;
        if(runeIndexNum <= numRunes)
            runeIndex = String(runeIndexNum);
        else
            runeIndex = '1';
        }
    }

function RecallByGump(bookName,runeName,backupBook,backupRune) 
    {
    //create global variable runeIndex to increment through the book starting from 1
    //global variable numRunes declares total runes to increment through 
    if(backupBook == undefined)
        var backupBook = bookName;
    if(backupRune == undefined)
        var backupRune = runeName;
    var numRunes = Shared.GetVar('numRunes');
    var x = Player.X();
    var y = Player.Y();
    var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
                {
                return Orion.Contains(part.Properties(), bookName)
                });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
        var startInd = 50; //recall index
    else
        var startInd = 75; //sacred journey index
    Orion.Wait(1300);
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
    Orion.UseObject(runeItem[0].Serial());
    lastObjectUsedTime = Orion.Now();
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump('last');
        var runeCheck = gump.TextList().indexOf(runeName) - 2;
        if(runeCheck == -1)
            Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00000059'))
            {
            gump.Select(Orion.CreateGumpHook(startInd + runeCheck));
            Orion.Wait(200);
            }
        Orion.CloseGump('generic', gump.Serial());
        }
    var startJournal = Orion.Now();
    var endWait = startJournal + 5000;
    while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
        {
        if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
            {
            Orion.Wait(2000);
            if(backupBook == 'skipDoubleBlocked')
                {
                //BotPush('Double Blocked at ' + eggIndex);
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                return RecallByGump(bookName,runeIndex,backupBook,runeIndex);
                }
            var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
                {
                return part.Properties().match(/.+$/) == backupBook;
                });
            if(backup)
                return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked');
            else
                Orion.Print("No backup runebook named '" + backupBook + "' found!");
            }
        else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal) && numRunes && runeIndex)
            {
            Orion.Wait(2000);
            var runeIndexNum = +runeIndex + 1 
            if(runeIndexNum <= numRunes)
                runeIndex = String(runeIndexNum); 
            else
                runeIndex = '1';
            return RecallByGump(bookName,runeIndex,backupBook,runeIndex);
            }
        Orion.Wait(500);
        }
    Orion.Wait(1500);
    Orion.Resend();
    Orion.Wait(500);
    if(x == Player.X() && y == Player.Y())
        return RecallByGump(bookName,runeName,backupBook,backupRune);
    }