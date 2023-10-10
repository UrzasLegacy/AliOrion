//Supply container should have reagents, empty bottles, and some backup tinker tools. Takes about 21 bot hours per 60k potions.
//It's fine to have multiple chars use the same supply container.

//MakePots Config
var MakeUntilHave = 60000; //Make potions until you have this many of each type in the supply container

//BottleBuyer Config
var BuyBottleUntilHave = 1000000; //Buy empty bottles until you have this many in the bank
var bottleMaxPurchasePrice = 50; //If price per 500 bottles is greater than or equal to this number, the script will stop

//ReagentBuyer Config
var BuyRegsUntilHave = 1000000; //Buy reagents until you have at least this many of each in the bank
var reagentMaxPurchasePrice = 25;  //Ignore reagents more expensive than this


var numRunes = 15; //set to the number of rune locations to rotate through

//No edit
var runeIndex = '1';


var buttons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, 13, "MakeAllPots", 'MakeAllPots'], [100, 30, 14, "MakeGHeals", 'MakeGreaterHealPots'], [100, 30, 15, "MakeGCures", 'MakeGreaterCurePots'] ],
        [ [100, 30, 16, "MakeGRefresh", 'MakeGreaterRefreshPots'], [100, 30, 17, "MakeGStrength", 'MakeGreaterStrengthPots'], [100, 30, 18, "MakeGAgility", 'MakeGreaterAgilityPots'] ],
        [],
        [ [100, 30, 19, "BottleBuyer", 'BottleBuyer'], [100, 30, 20, "ReagentBuyer", 'ReagentBuyer']],
        [],
        [ [100, 30, 21, "MoveDeeds", 'MoveCommodityDeeds'], [100, 30, 22, "CommAll60k", 'CommodifyEverything60k'], [100, 30, 23, "CommPots10k", 'CombinePots10k']],
    ]

function Gump()
    {
    Orion.Exec('GMScan',true);
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 100 + 20, buttons.length * 30 + 2, '0x0BB8', 1, 0);
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

function test()
    {
    Orion.Print(Orion.FindTypeEx(any,any,ground,'mobile',24,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');
        }).length);
    }

function MakeAllPots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.gheal, supplyContainer);
    MakePot(pot.gcure, supplyContainer);
    MakePot(pot.grefr, supplyContainer);
    MakePot(pot.gstre, supplyContainer);
    MakePot(pot.gagil, supplyContainer);
    }

function MakeGreaterHealPots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.gheal, supplyContainer);
    }

function MakeGreaterCurePots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.gcure, supplyContainer);
    }

function MakeGreaterRefreshPots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.grefr, supplyContainer);
    }

function MakeGreaterStrengthPots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.gstre, supplyContainer);
    }

function MakeGreaterAgilityPots()
    {
    var supplyContainer = DefineSupplyContainer();
    MakePot(pot.gagil, supplyContainer);
    }

function BottleBuyer()
    {
    Orion.CharPrint(self,1159,'Make sure you have room for 500 stones!');
    var shoplist = Orion.GetShopList('Bottles');
    var items = [new ShopListItem(emptyBottleGraphic, '0x0000', '', 500, bottleMaxPurchasePrice)];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    while(true)
        {
        RecallByGump('ReagentsOne',runeIndex,'ReagentsTwo',runeIndex);
        var vendors = Orion.FindTypeEx(any,any,ground,'mobile',24,'yellow').filter(function(vendor)
            {
            return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the provisioner') && !Orion.Contains(vendor.Properties(), 'guild');
            });
        while(vendors[0])
            {
            if(Player.MaxWeight() - Player.Weight() < 100)
                {
                RecallByGump('ReagentsOne','Bank','ReagentsTwo','Bank');
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                var playerBankSerial = Player.BankSerial();
                while(Orion.FindType(emptyBottleGraphic)[0]) 
                    {
                    var emptyBottle = Orion.FindType(emptyBottleGraphic)[0]
                    Orion.MoveItem(emptyBottle, 0, playerBankSerial)
                    Orion.Wait(1300);
                    }
                if(Orion.Count(emptyBottleGraphic, '0x0000', playerBankSerial, 2, false) >= BuyBottleUntilHave)
                    {
                    TextWindow.Open();
                    TextWindow.Print('Bottle Amount Threshold Met! Halting...');
                    return;
                    }
                RecallByGump('ReagentsOne',runeIndex,'ReagentsTwo',runeIndex);
                }
            var shopnpc = vendors[0];
            while(shopnpc.Distance() > 6)
                Orion.WalkTo(shopnpc.X(),shopnpc.Y(),shopnpc.Z(), 5);
            Orion.Wait(2000);
            Orion.BuyHook('Bottles');
            Orion.WaitContextMenuID(shopnpc.Serial(), 110);
            Orion.RequestContextMenu(shopnpc.Serial());
            var journalCheck = Orion.WaitJournal('No items to bought. Waiting cancelled.|Preveous waiting for shopping cancelled.', Orion.Now()-1000, Orion.Now()+6000);
            if(journalCheck)    
                {
                Orion.Ignore(shopnpc.Serial());
                vendors = Orion.FindTypeEx(any,any,ground,'mobile',24,'yellow').filter(function(vendor)
                    {
                    return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the provisioner') && !Orion.Contains(vendor.Properties(), 'guild');
                    });
                }
            Orion.CloseGump('shop', shopnpc.Serial());
            }
        var runeIndexNum = +runeIndex + 1;
        if(runeIndexNum <= numRunes)
            runeIndex = String(runeIndexNum); 
        else
            runeIndex = '1';
        }
    }

function ReagentBuyer()
    {
    //graphicsString
    //runebookNameString
    //npcTitlesString
    //shoplistItemsArray
    //buyAmount (how to generalize?)
    Orion.OAOptionSet('JournalEcho', '1');
    var reagentString = '0x0F7B|0x0F7A|0x0F84|0x0F85|0x0F86|0x0F88|0x0F8C|0x0F8D|0x0F78|0x0F7D|0x0F8A|0x0F8E|0x0F8F';
    while(true)
        {
        RecallByGump('ReagentsOne',runeIndex,'ReagentsTwo',runeIndex);
        var vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
            {
            return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');
            });
        while(vendors[0])
            {
            if(Player.MaxWeight() - Player.Weight() < 100)
                {
                RecallByGump('ReagentsOne','Bank','ReagentsTwo','Bank');
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                var playerBankSerial = Player.BankSerial();
                while(Orion.FindType(reagentString)[0])
                    {
                    var reagent = Orion.FindType(reagentString)[0];
                    Orion.MoveItem(reagent, 0, playerBankSerial);
                    Orion.Wait(1300);
                    }
                RecallByGump('ReagentsOne',runeIndex,'ReagentsTwo',runeIndex);
                }
            var shopnpc = vendors[0];
            var shopnpcSerial = shopnpc.Serial();
            while(shopnpc.Distance() > 6)
                Orion.WalkTo(shopnpc.X(),shopnpc.Y(),shopnpc.Z(), 5);
            Orion.WaitContextMenuID(shopnpcSerial, 110);
            Orion.RequestContextMenu(shopnpcSerial);
            var startTime = Orion.Now();
            var endTime = startTime + 5000;
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
                    return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');;
                    }); 
                Orion.CloseGump('shop', shopnpcSerial);
                continue;
                }
            var npcInventoryObj = Orion.ObjAtLayer("Buy", shopnpcSerial);
            if(!npcInventoryObj)
                continue;
            var npcInventory = npcInventoryObj.Serial();
            var npcItems = Orion.FindType(reagentString, any, npcInventory).length;
            if(npcItems == 0)
                {
                Orion.Print('# of items matched on vendor: 0');
                Orion.Wait(2000);
                Orion.Ignore(shopnpcSerial);
                vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                    {
                    return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');;
                    }); 
                Orion.CloseGump('shop', shopnpcSerial);
                continue;
                }
            else
                var buyAmount = Math.floor( ((Player.MaxWeight() - Player.Weight() - 25)*10) / npcItems );
            var shoplist = Orion.GetShopList('Reagents');
            var items = [
                new ShopListItem(reag.BM, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.BP, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.GA, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.GS, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.MR, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.NS, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.SA, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.SS, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                
                new ShopListItem(reag.BW, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.DB, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.PI, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.NC, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                new ShopListItem(reag.GD, '0x0000', '', buyAmount, reagentMaxPurchasePrice),
                ];
            shoplist.SetItems(items);
            Orion.UpdateShopList(shoplist);
            Orion.Print('# of items matched on vendor: ' + npcItems + '\nAmount of each reg to buy: ' + buyAmount);
            Orion.Wait(1300 - (Orion.Now() - startTime));
            Orion.BuyHook('Reagents');
            Orion.WaitContextMenuID(shopnpcSerial, 110);
            Orion.RequestContextMenu(shopnpcSerial);
            var journalCheck = Orion.WaitJournal('No items to bought. Waiting cancelled.|Preveous waiting for shopping cancelled.|My thanks for the patronage.', Orion.Now()-1000, Orion.Now()+15000);
            if(!journalCheck)
                {
                Orion.Wait(2000);
                Orion.Ignore(shopnpcSerial);
                vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
                    {
                    return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');;
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
                        return Orion.Contains(vendor.Properties(), 'the alchemist|the herbalist|the holy mage|the mage|the necromancer') && !Orion.Contains(vendor.Properties(), 'guild');;
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

function CombineAllStacks()
    {
    if(Player.WarMode())
        var container = Player.BankSerial();
    else
        {
        Orion.WaitForAddObject('myTarget');
        var container = Orion.GetSerial('myTarget');
        }
    for(prop in reag)
        {
        CombineStacks(prop, '0x0000', container, 60000);
        }
    CombineStacks(emptyBottleGraphic, '0x0000', container, 60000);
    }

//Helper Functions
function MakePot(potion, supplyContainer)
    {
    var firstPass = true;
    TidyInventory(supplyContainer);
    var numBottles = 175//Math.max(Player.MaxWeight() - Player.Weight() - 200, 100);
    var numReagents = 1000
    while(Orion.Count(potion.Graphic, '0x0000', supplyContainer, 2, false) + Orion.Count(potion.Graphic, '0x0000', backpack, 2, false) < MakeUntilHave)
        {
        while(!Orion.FindType(mortarPestleGraphic)[0])
            {
            while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                    return;
                }
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
                if(!Orion.FindType(tinkerToolGraphic)[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                    if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                        return;
                    }
                else
                    {
                    Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                    CraftItem(tinkerToolGraphic, 9003, 11);
                    }
                }
            Orion.CharPrint(self,1159,'Crafting Mortar and Pestle');
            CraftItem(tinkerToolGraphic, 9003, 9);
            firstPass = true;
            }
        while(!Orion.FindType(emptyBottleGraphic)[0])
            {
            while(Orion.FindType(potion.Graphic)[0]) 
                {
                Orion.CharPrint(self,1159,'Putting Away Brewed Potions');
                var brewed = Orion.FindType(potion.Graphic)[0]
                Orion.MoveItem(brewed, 0, supplyContainer)
                Orion.Wait(1300);
                }
            Orion.CharPrint(self,1159,'Restocking Empty Potions');
            if(!Restock('Empty Bottles', emptyBottleGraphic, supplyContainer, numBottles))
                return;
            }
        while(Orion.Count(potion.Reagent, '0x0000', backpack, 0, false) < 20)
            {
            Orion.CharPrint(self,1159,'Restocking Reagents');
            if(!Restock(potion.ReagentName, potion.Reagent, supplyContainer, numReagents))
                return;
            }
        if(firstPass)
            {
            CraftItem(mortarPestleGraphic,potion.Category,potion.Selection);
            if(Orion.FindType(potion.Graphic)[0])
                firstPass = false;
            }
        else
            CraftLast(mortarPestleGraphic);
        if(Player.Weight() > 500)
            TidyInventory(supplyContainer);
        }
    TidyInventory(supplyContainer);
    }

function TidyInventory(supplyContainer)
    {
    while(Orion.FindType('0x0F0E|0x0F7B|0x0F7A|0x0F84|0x0F85|0x0F86|0x0F88|0x0F8C|0x0F8D|0x0F0C|0x0F07|0x0F0B|0x0F08|0x0F09')[0]) 
        {
        Orion.CharPrint(self,1159,'Tidying inventory');
        var brewed = Orion.FindType('0x0F0E|0x0F7B|0x0F7A|0x0F84|0x0F85|0x0F86|0x0F88|0x0F8C|0x0F8D|0x0F0C|0x0F07|0x0F0B|0x0F08|0x0F09')[0];
        Orion.MoveItem(brewed, 0, supplyContainer);
        Orion.Wait(1300);
        }
    }

function DefineSupplyContainer(_)
    {
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    if(!supplyContainer || supplyContainer.Mobile())
        return Orion.CharPrint(self,1159,'Invalid target! Halting...');
    return supplyContainer.Serial();
    }

function CraftItem(toolSet, menuButtonID, itemButtonID)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(500);
            }
        }
    Orion.UseObject(Orion.FindType(toolSet, '0x0000')[0]);
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
    Orion.Wait(1500);
    }

function CraftLast(toolSet)
    {
    var endTime = Orion.Now() + 2000;
    while(!Orion.GumpExists('generic', any, '0x000001CC') && Orion.Now() < endTime)
        {
        Orion.Wait(100);
        }
    if(!Orion.GumpExists('generic', any, '0x000001CC'))
        {
        Orion.UseObject(Orion.FindType(toolSet,'0x0000')[0]);
        Orion.Wait(1300);
        }
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(1999));
            Orion.Wait(200);
            }
        }
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID)
    {
    if(!colorID)
        colorID = any;
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, backpack, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if(needed > 0 && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
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

const mortarPestleGraphic = '0x0E9B';
const tinkerToolGraphic = '0x1EB9|0x1EBC';
const ingotGraphic = '0x1BF2';
const emptyBottleGraphic = '0x0F0E';

const pot =
    {
    gheal: {Graphic: '0x0F0C', Category: 9001, Selection: 42, Reagent: '0x0F85', ReagentName: 'Ginseng'},
    gcure: {Graphic: '0x0F07', Category: 9001, Selection: 72, Reagent: '0x0F84', ReagentName: 'Garlic'},
    grefr: {Graphic: '0x0F0B', Category: 9001, Selection: 11, Reagent: '0x0F7A', ReagentName: 'Black Pearl'},
    gstre: {Graphic: '0x0F09', Category: 9002, Selection: 51, Reagent: '0x0F86', ReagentName: 'Mandrake Root'},
    gagil: {Graphic: '0x0F08', Category: 9002, Selection: 21, Reagent: '0x0F7B', ReagentName: 'Blood Moss'},
    }

const reag = {
    BP: '0x0F7A',
    BM: '0x0F7B',
    GA: '0x0F84',
    GS: '0x0F85',
    MR: '0x0F86',
    NS: '0x0F88',
    SA: '0x0F8C',
    SS: '0x0F8D',
        
    BW: '0x0F78',
    DB: '0x0F7D',
    PI: '0x0F8A',
    NC: '0x0F8E',
    GD: '0x0F8F',
    }

function DiscordKeyInitialize()
    {
    var hook = '999457009227280446'
    var key = 'X_5lXqC-IOh-z1EBVmVDTSTiQhHUUkvikbI2ikEaOBlh5BYUeArrqOK4qG5mB3-yVhTj'
    var file = Orion.NewFile();
    var endTime = Orion.Now() + 5000;
    while(!file.Opened() && Orion.Now() < endTime)
        {
        file.Open('discordkey.conf');
        Orion.Wait(500);
        }
    file.Write(hook + ' ' + key);
    file.Close();
    }

function GMScan()
	{
	var useDiscordPush = true//profile.useDiscordPush;
	var useAlarmSound = true//profile.useAlarmSound;
    var closeUO = false;
    var timeStamp = 0;
    var gmCheck;
	while(true)
		{
        gmCheck = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(mob)
            {
            return mob.Properties().indexOf('GM ') > -1;
            }).length || Orion.InJournal('GM ', 'sys', '0', 'any', timeStamp - 500, Orion.Now() + 1000);
        timeStamp = Orion.Now();    
        if(gmCheck)
            {
			 if(useDiscordPush)
			    DiscordPush(Player.Name() + ": GM");
			if(useAlarmSound)
			    Orion.PlayWav('GMAlert.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
			Orion.PauseScript('all','GMScan');
			Orion.Wait(500);
			Orion.Terminate('all', 'GMScan');
			Orion.StopWalking();
			Orion.Wait(5000);
			if(closeUO)
			    {
			    Orion.OAOptionSet('AutoReconnect', '0');
			    Orion.CloseUO();
			    }
			}
        Orion.Wait(3000);
		}
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
	
function RecallByGump(bookName,runeName,backupBook,backupRune) 
    {
    //create global variable runeIndex to increment through the book starting from 1
    //global variable numRunes declares total runes to increment through 
    if(backupBook == undefined)
        var backupBook = bookName;
    if(backupRune == undefined)
        var backupRune = runeName;
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
        if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal) && numRunes && runeIndex)
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

function RecallByIndex(indexNum)
    {
    //global variable numRunes declares total runes to increment through
    var x = Player.X();
    var y = Player.Y();
    if(Orion.SkillValue('Magery', 'base') >= 600)
        var startInd = 49; //recall index
    else
        var startInd = 74; //sacred journey index
    var bookCounter = 1;
    while(indexNum > 16)
        {
        bookCounter++;
        indexNum -= 16;
        }
    var bookName = 'ReagentOne' + bookCounter;
    var backupBook = 'ReagentTwo' + bookCounter;
    var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return Orion.Contains(part.Properties(), bookName)
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    Orion.Wait(1300);
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
    Orion.UseObject(runeBook[0].Serial());
    lastObjectUsedTime = Orion.Now();
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x00000059');
        var runeCheck = gump.TextList().indexOf(runeName) - 2;
        if(runeCheck == -1)
            Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
        Orion.WaitGump(Orion.CreateGumpHook(rune));
        Orion.UseObject(book);
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(startInd + indexNum));
            Orion.Wait(200);
            }
        Orion.CloseGump('generic', gump.Serial());
        }
    var startJournal = Orion.Now();
    var endWait = startJournal + 5000;
    while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
        {
        if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal) && numRunes && runeIndex)
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

function CalcNPCPurchasePrice()
    {
    var amount = 60000;
    var initialPrice = 3;
    var priceThreshold = 21;
    
    var totalPurchased = 0;
    var incrementThreshold = 1000;
    var totalIncrements = Math.floor(amount / incrementThreshold);
    var cost = 0;
    var lastPrice = 0;
    for(var i = 0;i<totalIncrements;i++)
        {
    if(lastPrice >= priceThreshold)
            {
            totalPurchased = (1000+(i*1000));
            Orion.Print('Total purchased: ' + totalPurchased)
            break;
            }
        lastPrice = initialPrice +  i
        cost += incrementThreshold * lastPrice;
        }
    Orion.Print('Last Purchase Price: ' + lastPrice);
    if(totalPurchased)
        Orion.Print('Average Price Per Unit: ' + (cost/totalPurchased).toFixed(2));
    else
        Orion.Print('Average Price Per Unit: ' + (cost/amount).toFixed(2));
    Orion.Print('Total Cost: ' + cost);
    }
//reagents starting at 3gp, ideal price threshold: 22, 684k per 60k, avg price 11.4gp
//bottles starting at 30gp, ideal price threshold: 49, 2.223m per 60k, avg price 37.05gp
//gheal = 7 GS, 79.8gp, 4.79m
//gcure = 6 GA, 68.4gp, 4.1m
//grefr = 5 BP, 57gp, 3.42m
//gstr = 5 MR, 57gp, 3.42m
//gagil = 3 BM, 34.2gp, 2.05m

/*
Combine and Commodify Resources
Written by Ali
August 1, 2022

Commodifier Call Variants:
    Commodifier(stackSize);
    Commodifier(stackSize, useCommodityDeeds);
    Commodifier(stackSize, useCommodityDeeds, useSpecificArray);
Arguments:
    stackSize: integer. Size of stacks to create.
    useCommodityDeeds: boolean. Use commodity deed on complete stacks. Default value: true.
    useSpecificArray: array [[graphicId, colorId]]. If this is specified, only items included in the array will be combined. Default: false. Everything is combined

Commodifier will first Combine everything to the stackSize you set and then use a commodity deed on any stacks that meet the stackSize.
You must have commodity deeds in either your bank or the commodity deed box you target if useCommodityDeeds is true.
Enter Warmode before starting the script to use your bank, otherwise you will be prompted to select a container.
*/

function CommodifyEverything60k()
    {
    Commodifier(60000);
    }

function CombineEverything60k()
    {
    Commodifier(60000, false);
    }

function CommodifyEverything10k()
    {
    Commodifier(10000);
    }

function CombineEverything10k()
    {
    Commodifier(10000, false);
    }

function CombinePots10k()
    {
    var itemArr = [];
    for(prop in pot)
        {
        itemArr.push([pot[prop].Graphic,'0x0000']);
        }
    Commodifier(10000, false, itemArr);
    }

function MoveCommodityDeeds()
    {
    Orion.CharPrint(self,1159,"Peaceful = unfilled deeds\nWarmode = filled deeds");
    Orion.CharPrint(self,1159,"Select 'From' container\nPress Escape to select Bank");
    var fromCheck = Orion.WaitForAddObject('myTarget');
    if(fromCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var fromContainer = Player.BankSerial();
        }
    else if(fromCheck == 1)
        {
        var fromContainer = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', fromContainer))
            {
            Orion.UseObject(fromContainer);
            Orion.Wait(1300);
            }
        }
    Orion.CharPrint(self,1159,"Select 'To' container\nPress Escape to select Bank");
    var toCheck = Orion.WaitForAddObject('myTarget');
    if(toCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var toContainer = Player.BankSerial();
        }
    else if(toCheck == 1)
        {
        var toContainer = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', toContainer))
            {
            Orion.UseObject(toContainer);
            Orion.Wait(1300);
            }
        }
    if(Player.WarMode())
        var colorString = '0x0592';
    else
        var colorString = '0x0047';
    var commodity = Orion.FindType('0x14F0',colorString,fromContainer)[0];
    while(commodity)
        {
        Orion.MoveItem(commodity,0,toContainer);
        Orion.Wait(1300);
        commodity = Orion.FindType('0x14F0',colorString,fromContainer)[0];
        }
    }

//Helper Functions
function Commodifier(stackSize,useCommodityDeeds,useSpecificArray)
    {
    if(useCommodityDeeds == undefined)
        useCommodityDeeds = true;
    Orion.CharPrint(self,1159,"Select container\nPress Escape to select Bank");
    var fromCheck = Orion.WaitForAddObject('myTarget');
    if(fromCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var container = Player.BankSerial();
        }
    else if(fromCheck == 1)
        {
        var container = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', container))
            {
            Orion.UseObject(container);
            Orion.Wait(1300);
            }
        }
    if(useSpecificArray)
        {
        for(var i=0;i<useSpecificArray.length;i++)
            {
            var item = useSpecificArray[i];
            var itemGraphic = item[0];
            var itemColor = item[1];
            Combine(itemGraphic,itemColor,container,stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    else
        {
        var itemHash = {};
        var items = Orion.FindTypeEx(any,any,container);
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            var graphicColorPair = item.Graphic() + ':' + item.Color();
            itemHash[graphicColorPair] = true;
            }    
        for(graphicColor in itemHash)
            {
            var graphicColorSplit = Orion.Split(graphicColor, ':');
            var itemGraphic = graphicColorSplit[0];
            var itemColor = graphicColorSplit[1];
            Combine(itemGraphic, itemColor, container, stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    }

function Combine(graphicSerial, colorCode, containerSerial, stackCount)
    {
    var itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
        {
        return item.Count() > 1 && item.Count() > stackCount;
        });
    while(itemOverstacked[0])
        {
        Orion.MoveItem(itemOverstacked[0].Serial(), stackCount, containerSerial, 0, 0);
        Orion.Wait(1300);
        itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            return item.Count() > 1 && item.Count() > stackCount;
            });
        }
    var itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
        {
        return item.Count() > 1 && item.Count() < stackCount;
        });
    while(itemUnderstacked[1])
        {
        var neededCount = stackCount - itemUnderstacked[0].Count();
        Orion.MoveItem(itemUnderstacked[1].Serial(), neededCount, itemUnderstacked[0].Serial())
        Orion.Wait(1300);
        itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            return item.Count() > 1 && item.Count() < stackCount;
            });
        }
    }

function Commodify(graphicSerial, colorCode, containerSerial, stackCount)
    {
    var itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
        {
        return item.Count() == stackCount;
        })[0];
    while(itemStacked)
        {
        var commodityDeed = Orion.FindTypeEx('0x14F0','0x0047',containerSerial)[0];
        if(!commodityDeed || !itemStacked)
            return false;
        while(Orion.Contains(commodityDeed.Properties(), 'Unfilled'))
            {
            Orion.UseObject(commodityDeed.Serial());
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(itemStacked.Serial());
            Orion.Wait(1300);
            }
        itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            return item.Count() == stackCount;
            })[0];
        }
    }