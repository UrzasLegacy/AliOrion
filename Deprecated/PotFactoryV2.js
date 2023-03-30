//Supply container should have reagents, empty bottles, and some backup tinker tools. Takes about 21 bot hours per 60k potions.
//It's fine to have multiple chars use the same supply container.

//MakePots Config
var MakeUntilHave = 60000; //Make potions until you have this many of each type in the supply container

//BottleBuyer Config
var BuyBottleUntilHave = 60000; //Buy empty bottles until you have this many in the bank
var PricePer500ToHaltBottles = 50000 //If price per 500 bottles is greater than or equal to this number, the script will stop

//ReagentBuyer Config
var BuyRegsUntilHave = 60000; //Buy reagents until you have at least this many of each in the bank
var PricePer500ToHaltReagents = 100000 //If price per 5000 reagents is greater than or equal to this number, the script will stop


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
    Orion.CharPrint(self,1159,'Stand near bank and empty bottle vendor and make sure you have room for 500 stones');
    Orion.CharPrint(self,1159,'Select NPC vendor')
    Orion.WaitForAddObject('myTarget');
    var shopnpc = Orion.GetSerial('myTarget');
    var shoplist = Orion.GetShopList('Bottles');
    var items = [new ShopListItem(emptyBottleGraphic, '0x0000', '', 999)];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    while(Orion.Count(emptyBottleGraphic, '0x0000', Player.BankSerial(), 2, false) + Orion.Count(emptyBottleGraphic, '0x0000', backpack, 2, false) < BuyBottleUntilHave)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        Orion.BuyHook('Bottles');
        Orion.WaitContextMenuID(shopnpc, 110);
        Orion.RequestContextMenu(shopnpc);
        var journalCheck = Orion.WaitJournal('The total of your purchase is', Orion.Now()-1000, Orion.Now()+1000);
        if(journalCheck)    
            {
            var gold = journalCheck.Text().match(/\d+/) || 0;
            if(+gold > PricePer500ToHaltBottles)
                return Orion.CharPrint(self,1159,'Overpriced! Halting...');
            }
        Orion.Wait(3000);
        Orion.CloseGump('shop', shopnpc)
        while(Orion.FindType(emptyBottleGraphic)[0]) 
            {
            var emptyBottle = Orion.FindType(emptyBottleGraphic)[0]
            Orion.MoveItem(emptyBottle, 0, Player.BankSerial())
            Orion.Wait(1300);
            }
        }
	}

function ReagentBuyer()
	{
    var reagentString = pot.gheal.Reagent + '|' + pot.gcure.Reagent + '|' + pot.grefr.Reagent + '|' + pot.gstre.Reagent + '|' + pot.gagil.Reagent
    Orion.CharPrint(self,1159,'Stand near bank and empty bottle vendor and make sure you have room for 500 stones');
    Orion.CharPrint(self,1159,'Select NPC vendor')
    Orion.WaitForAddObject('myTarget');
    var shopnpc = Orion.GetSerial('myTarget');
    var shoplist = Orion.GetShopList('Reagents');
    var items = [
    new ShopListItem(pot.gheal.Reagent, '0x0000', '', 999),
    new ShopListItem(pot.gcure.Reagent, '0x0000', '', 999),
    new ShopListItem(pot.grefr.Reagent, '0x0000', '', 999),
    new ShopListItem(pot.gstre.Reagent, '0x0000', '', 999),
    new ShopListItem(pot.gagil.Reagent, '0x0000', '', 999)
    ];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    while(
        Orion.Count(pot.gheal.Reagent, '0x0000', Player.BankSerial(), 2, false) < BuyRegsUntilHave
        && Orion.Count(pot.gcure.Reagent, '0x0000', Player.BankSerial(), 2, false) < BuyRegsUntilHave
        && Orion.Count(pot.grefr.Reagent, '0x0000', Player.BankSerial(), 2, false) < BuyRegsUntilHave
        && Orion.Count(pot.gstre.Reagent, '0x0000', Player.BankSerial(), 2, false) < BuyRegsUntilHave
        && Orion.Count(pot.gagil.Reagent, '0x0000', Player.BankSerial(), 2, false) < BuyRegsUntilHave)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        Orion.BuyHook('Reagents');
        Orion.WaitContextMenuID(shopnpc, 110);
        Orion.RequestContextMenu(shopnpc);
        var journalCheck = Orion.WaitJournal('The total of your purchase is', Orion.Now()-1000, Orion.Now()+1000);
        if(journalCheck)    
            {
            var gold = journalCheck.Text().match(/\d+/) || 0;
            if(+gold > PricePer500ToHaltReagents)
                return Orion.CharPrint(self,1159,'Overpriced! Halting...');
            }
        Orion.Wait(3000);
        Orion.CloseGump('shop', shopnpc)
        while(Orion.FindType(reagentString)[0]) 
            {
            var reagent = Orion.FindType(reagentString)[0]
            Orion.MoveItem(reagent, 0, Player.BankSerial())
            Orion.Wait(1300);
            }
        }
	}

//Helper Functions
function MakePot(potion, supplyContainer)
    {
    var firstPass = true;
    while(Orion.FindType('0x0F0E|0x0F7B|0x0F7A|0x0F84|0x0F85|0x0F86|0x0F88|0x0F8C|0x0F8D|0x0F0C|0x0F07|0x0F0B|0x0F08|0x0F09')[0]) 
        {
        Orion.CharPrint(self,1159,'Tidying inventory');
        var brewed = Orion.FindType('0x0F0E|0x0F7B|0x0F7A|0x0F84|0x0F85|0x0F86|0x0F88|0x0F8C|0x0F8D|0x0F0C|0x0F07|0x0F0B|0x0F08|0x0F09')[0];
        Orion.MoveItem(brewed, 0, supplyContainer);
        Orion.Wait(1300);
        }
    var numBottles = Math.max(Player.MaxWeight() - Player.Weight() - 200, 100);
    var numReagents = Math.max(10*(Player.MaxWeight() - Player.Weight() - 100), 1000);
    while(Orion.Count(potion.Graphic, '0x0000', supplyContainer, 2, false) + Orion.Count(potion.Graphic, '0x0000', backpack, 2, false) < MakeUntilHave)
        {
        while(!Orion.FindType(mortarPestleGraphic)[0])
            {
            while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                    return Orion.Terminate('all');
                }
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
                if(!Orion.FindType(tinkerToolGraphic)[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                    if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                        return Orion.Terminate('all');
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
                return Orion.Terminate('all');
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
        }
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
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
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
    Orion.UseObject(Orion.FindType(toolSet)[0]);
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
        Orion.UseObject(Orion.FindType(toolSet)[0]);
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

