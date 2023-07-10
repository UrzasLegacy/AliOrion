//--# AliQoL
// Written by Ali

function TestHue()
    {
    var hue = 2730;
    Orion.WaitForAddObject('myTarget');
    var serial = Orion.GetSerial('myTarget');
    Orion.TestItemColor(serial, hue);
    }
    
function RecallRepair()
	{
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallRepair');
    Orion.Wait(500);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallRepair');
	RecallByGump('Main', 'Home', 'Main', 'Home2');
	Orion.WarMode(0);
	do
		{
		Orion.Step('n');
		Orion.Wait(250);
		var bench = Orion.FindTypeEx('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 10)[0];
		} while(!bench)
	if(!Orion.WalkTo(bench.X(),bench.Y()))
		Orion.WalkTo(bench.X(),bench.Y());
	RepairGear();
	Orion.Wait(1500);
	//Orion.Exec('WalkThroughCurrentFarm');
	}

function RecallArrowBuy()
    {
    var currentArrows = Orion.Count('0x0F3F');
    Orion.Print('Current Arrow Count: ' + currentArrows)
    if(currentArrows >= 1000)
        return;
	Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallArrowBuy');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallArrowBuy');
    RecallByGump('Main','Arrows', 'Main','Arrows2');
	ArrowBuy();
    }

function ArrowBuy()
	{
    var currentArrows = Orion.Count('0x0F3F');
    // var quivers = Orion.FindTypeEx(any,any,backpack)
    // quivers.push(Orion.ObjAtLayer(20));
    // quivers.forEach(function(item)
    //     {
    //     var itemProps = item.Properties();
    //     if(Orion.Contains(itemProps,'Ammo: '))
    //         {
    //         var arrowsQuiverMatch = (itemProps.match(/Ammo: (\d+)\//) || [])
    //         var arrowsQuiver = arrowsQuiverMatch[1];
    //         if(arrowsQuiver)
    //             currentArrows += +arrowsQuiver;
    //         }
    //     });
	do {
		var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
			{
			return Orion.Contains(vendor.Properties(), 'the bowyer|the provisioner') && !Orion.Contains(vendor.Properties(), 'guild');
			})[0];
		Orion.Wait(1000);
		} while(!vendors)
    var shopnpcSerial = vendors.Serial();
    while(currentArrows < 1000)
        {
		Orion.WalkTo(vendors.X(),vendors.Y());
        var shoplist = Orion.GetShopList('Arrows');
        var amount = 1000 - currentArrows;
        var items = [new ShopListItem('0x0F3F', '0x0000', '', amount)];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Arrows');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(3000);
        currentArrows = Orion.Count('0x0F3F');
        }
    var quivers = Orion.FindTypeEx(any,any,backpack);
    var back = Orion.ObjAtLayer(20);
    if(back)
        quivers.push(back);
    quivers.forEach(function(item)
        {
        var itemProps = item.Properties();
        if(Orion.Contains(itemProps,'Ammo: '))
            {
            var arrowsQuiverMatch = (itemProps.match(/Ammo: (\d+)\//) || [])
            var arrowsQuiver = arrowsQuiverMatch[1];
            var needed = 500 - +arrowsQuiver
            if(needed > 0)
                {
                Orion.MoveItemType('0x0F3F', any, backpack, needed, item.Serial());
                Orion.Wait(1300);
                }
            }
        });
     if(Player.Weight() > Player.MaxWeight())
		{
		DiscordPush(Orion.ShardName() + ': ' + Player.Name() + ': Overweight after buying arrows. Halting...')
		RecallByGump('Main','Home');
		Orion.LogOut();
		}
	}

function RecallTithe()
	{
    var tithingPoints = Player.TithingPoints();
    Orion.Print('Current Tithing Points: ' + tithingPoints)
	if(tithingPoints > 10000)
        return;
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RecallTithe');
    Orion.Wait(500);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RecallTithe');
    RecallByGump('Main','Tithing','Main','Tithing2');
    Tithe();
	Orion.Wait(1500);
	//Orion.Exec('WalkThroughCurrentFarm');
	}


function Tithe()
    {
    CloseAllGumps();
    var endTime = Orion.Now() + 10000;
    while(Player.TithingPoints() < 100000)
        {
        if(Orion.Now() > endTime)
            {
            return DiscordPush(Player.Name() + "couldn't tithe to 100,000")
            }
        var subEndTime = Orion.Now() + 5000;
        var ankh = Orion.FindTypeEx('0x0005|0x0002|0x0003|0x0004',any,ground,'item',20)[0];
        do
            {
            if(Orion.Now() > subEndTime)
                return DiscordPush(Player.Name() + "couldn't find ankh!")
            Orion.WalkTo(ankh.X(),ankh.Y())
            Orion.Wait(500);
            } while(!Orion.FindType('0x0005|0x0002|0x0003|0x0004',any,ground,'item',2)[0])
        Orion.WaitContextMenuID(ankh.Serial(), 412);
        Orion.RequestContextMenu(ankh.Serial());
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(300);
                }
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(2));
                Orion.Wait(300);
                }
            }
        Orion.Wait(1000);
        }
    }

function SuitReader()
    {
    Orion.CharPrint(self, 1159, 'Select player or container to evaluate:');
    Orion.WaitForAddObject('myTarget');
    var propertiesList = SuitReaderCall('myTarget');
    if(!propertiesList)
        return;
    var y = 15;
    var yOffset = 15;
    var x1 = 15;
    var x2 = 145;
    var x3 = 100;
    var x4 = 185;
    var xOffset = 95;
    var xOffset2 = 45;
    var gump = Orion.CreateCustomGump(12001);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, 275, 21*yOffset+20);
    gump.AddText(x1, y, "0", 'Physical Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[0][1]);
    gump.AddText(x2, y, "0", 'Kinetic Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[6][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Fire Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[1][1]);
    gump.AddText(x2, y, "0", 'Fire Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[7][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Cold Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[2][1]);
    gump.AddText(x2, y, "0", 'Cold Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[8][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Poison Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[3][1]);
    gump.AddText(x2, y, "0", 'Poison Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[9][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Energy Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[4][1]);
    gump.AddText(x2, y, "0", 'Energy Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[10][1]);
    y+=yOffset;
    gump.AddText(x2, y, "0", 'Damage Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[5][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Enhanced Pots:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[11][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'DI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[12][1]);
    gump.AddText(x3, y, "0", 'SSI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[13][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'DCI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[14][1]);
    gump.AddText(x3, y, "0", 'HCI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[15][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Str+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[16][1]);
    gump.AddText(x3, y, "0", 'HP+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[19][1]);
    gump.AddText(x4, y, "0", 'HPR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[22][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Dex+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[17][1]);
    gump.AddText(x3, y, "0", 'Stam+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[20][1]);
    gump.AddText(x4, y, "0", 'SR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[23][1]); 
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Int+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[18][1]); 
    gump.AddText(x3, y, "0", 'Mana+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[21][1]); 
    gump.AddText(x4, y, "0", 'MR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[24][1]); 
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'CF:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[25][1]);
    gump.AddText(x3, y, "0", 'FCR:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[26][1]);
    gump.AddText(x4, y, "0", 'FC:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[27][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'LMC:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[28][1]);
    gump.AddText(x3, y, "0", 'LRC:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[29][1]);
    gump.AddText(x4, y, "0", 'SDI:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[30][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Luck:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[31][1]);
    gump.AddText(x3, y, "0", 'RPD:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[32][1]);
    gump.Update();
    }

function AliVendorBuy()
    {
    // QoL function to make buying from player vendors less tedious. Just target the item you'd like to purchase.
    // Also reports your total spending during your session. Resets when you close the client completely.
    // Set to a keybind and check the 'Run one script' checkbox.

    // WARNING WARNING WARNING
    // Will purchase whatever you target without a confirmation prompt! Do not target something you don't intend to buy!
    // WARNING WARNING WARNING

    // To avoid accidentally buying overpriced items, you can enter a maximum price here:
    var maximumPrice = 50000000; // less than or equal to


    //No edit
    Orion.CharPrint(self,1159,'Select item to purchase')
    Orion.WaitForAddObject('myTarget')
    var itemObj = Orion.FindObject('myTarget');
    if(!itemObj)
        return Orion.CharPrint(self,1159,'No item selected')
    var itemProps = itemObj.Properties();
    var itemPrice = +((itemProps.match(/Price: ([\d,]+)/) || [])[1] || '').replace(/,/g,'');
    if(itemPrice > maximumPrice)
        return Orion.CharPrint(self,1159,'No deal! Item overpriced!');
    var totalSpentThisSession = Shared.GetVar('totalSpent',0) + itemPrice;
    var itemSerial = itemObj.Serial();
    Orion.WaitContextMenuID(itemSerial, 608);
    Orion.RequestContextMenu(itemSerial);
    if(Orion.WaitForGump(2000,true))
        {
        var gump = Orion.GetGump(any,'0x000F3E60');
        if(gump)
            {
            gump.Select(Orion.CreateGumpHook(2));
            Shared.AddVar('totalSpent',totalSpentThisSession);
            var formattedWithCommas = totalSpentThisSession.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        }
    Orion.Wait(200);
    Orion.Print('Total Spent: ' + formattedWithCommas + 'gp');
    }

function AliVendorBuyWithComments()
    { 

    // WARNING WARNING WARNING
    // Will purchase whatever you target instantly, do not target something you don't intend to buy!
    // WARNING WARNING WARNING

    // To avoid buying overpriced items, you can enter a maximum price here:
    var maximumPrice = 50000000; // less than or equal to

    Orion.CharPrint(self,1159,'Target item to purchase')
    Orion.WaitForAddObject('myTarget') // this will grab the serial number of whatever you target and assign it an alias string, using FindObject or GetSerial next is a good habit
    var itemObj = Orion.FindObject('myTarget'); // will return an Orion Object or null if you didn't click on an item. Search 'obj' in the help tab for a list of methods that can be called on Orion Objects
    if(!itemObj)
        return Orion.CharPrint(self,1159,'Failed to target item');
    var itemProps = item.Properties();
    var itemPriceMatch = itemProps.match(/Price: ([\d,]+)/); // this regular expression returns an array like this ['Price: 100,000','100,000'] or null if no match is found
    var itemPriceMatchValidate = itemPriceMatch || []; // if itemPriceMatch is null, an empty array [] is used for the next steps instead
    var itemPriceMatchGroup = itemPriceMatchValidate[1]; // we want the second string in the array. In JS referring to an index in an array that doesn't exist such as [][1] will return undefined.
    var itemPriceStrValidate = itemPriceMatchGroup || ''; // use the match from the array '100,000' OR an empty string if the previous step returned an empty array
    var itemPriceStrNoCommas = itemPriceStrValidate.replace(/,/g,''); //this regex will replace all commas with an empty string
    var itemPriceInt = +itemPriceStrNoCommas; // or Number(itemPriceStrNoCommas) to change the previous string to an integer. An empty string will evaluate to 0.
    if(itemPriceInt > maximumPrice)
        {
        Orion.CharPrint(self,1159,'No deal! Item overpriced!');
        return; //exit the function
        }
    var itemSerial = itemObj.Serial();
    Orion.WaitContextMenuID(itemSerial, 608); // sets a hook to click this context menu option on the next context menu that pops up
    Orion.RequestContextMenu(itemSerial); // opens the context menu of the item. Create a macro and click a context menu option and then do To Script to easily grab its ID
    if(Orion.WaitForGump(2000)) // wait up to 2 seconds until the next gump appears, in this case the purchase confirmation gump
        {
        var gump = Orion.GetGump(any,'0x000F3E60'); //to get a gump's ID, type _infogump in game for information about the last gump opened
        if (gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(2)); //selects confirm in the gump. Create a macro and click button gumps to easily grab button IDs
            Orion.Wait(200); //this is a small wait to account for server latency
            }
        }
    }

function AliVendorBuyAll()
    {
    var propertyString = 'Curiously Adorned Egg';
    var priceThreshold = 1800000;
    Orion.WaitForAddObject('myTarget')
    var vendorBackpackSerial = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('Container',vendorBackpackSerial))
    	{
	    Orion.UseObject(vendorSerial);
	    Orion.Wait(1300)
	    }
    var items = Orion.FindTypeEx(any,any,vendorBackpackSerial).filter(function(item)
    	{
    	var itemProps = item.Properties();
        var itemPrice = +((itemProps.match(/Price: ([\d,]+)/) || [])[1] || '').replace(/,/g,'');
    	return Orion.Contains(itemProps, propertyString) && itemPrice && itemPrice <= priceThreshold;
    	});
    Orion.Print('Items Found: ' + items.length);
    for(var i=0;i<items.length;i++)
    	{
    	var item = items[i];
    	var itemSerial = item.Serial();
		Orion.WaitContextMenuID(itemSerial, 608);
    	Orion.RequestContextMenu(itemSerial);
		if (Orion.WaitForGump(2000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E60'))
				{
				gump0.Select(Orion.CreateGumpHook(2));
				Orion.Wait(100);
				}
			}
		Orion.Wait(1300);
    	}
    }

function RepairGear()
	{//v1
    Orion.ResetSearchArea();
    var RepairGearVersion = '1';
    var durabilityThreshold = 80; //Durability below which to repair
	//Equipment with less than 2 * durabilityThreshold will appear in yellow

    var tinkerLowAlarm = true; //Leave false to ignore this repair type for the alarm
    var blacksmithLowAlarm = true; //Set to true to get an alarm for this repair type running low
    var carpentryLowAlarm = true;
    var tailorLowAlarm = true;
    var masonryLowAlarm = false;
    var glassblowingLowAlarm = false;
    var fletchingLowAlarm  = false;
	
    var alarmThreshold = 20; //If the repair bench gets below this number of scrolls for a repair type, send a discord message

	var flavorText = true; //adds overhead emotes describing the amount of items you need to repair
    
    var repairDict = 
        { //graphicString: buttonCode
        // tinker: 2001 | tinker: 2001 | bsmith: 2002 | carpenter: 2003 | tailor: 2006 | fletcher: 2009 | masonry: 2010
        '0x170B': 2006,'0x2D2D': 2002,'0x2D21': 2002,'0x0F4A': 2002,'0x0F49': 2002,'0x0F4E': 2002,'0x0F4D': 2002,'0x0F48': 2002,'0x0F47': 2002,'0x0DF0': 2003,'0x0DF1': 2003,'0x26BD': 2002,'0x26C7': 2002,'0x27A8': 2003,'0x26BB': 2002,'0x26C5': 2002,'0x13B1': 2009,'0x13B2': 2009,'0x0F5F': 2002,'0x0F5E': 2002,'0x1B72': 2002,'0x1B73': 2002,
        '0x26CB': 2002,'0x13F4': 2003,'0x13F5': 2003,'0x0F50': 2009,'0x0F4F': 2009,'0x1440': 2002,'0x1441': 2002,'0x0F52': 2002,'0x0F51': 2002,'0x27A9': 2002,'0x2D30': 2002,'0x2D24': 2002,'0x0F4C': 2002,'0x0F4B': 2002,'0x26BF': 2002,'0x26C9': 2002,'0x2D2A': 2009,'0x2D1E': 2009,'0x2D35': 2002,'0x2D29': 2002,'0x2D2C': 2002,
        '0x2D20': 2002,'0x0F46': 2002,'0x0F45': 2002,'0x13F9': 2003,'0x13F8': 2003,'0x143E': 2002,'0x143F': 2002,'0x143C': 2002,'0x143D': 2002,'0x0F44': 2001,'0x0F43': 2001,'0x1B77': 2002,'0x1B76': 2002,'0x13FC': 2009,'0x13FD': 2009,'0x27AD': 2002,'0x13FE': 2002,'0x13FF': 2002,'0x1400': 2002,'0x1401': 2002,'0x27A7': 2002,
        '0x26C0': 2002,'0x26CA': 2002,'0x13FA': 2002,'0x13FB': 2002,'0x2D2E': 2002,'0x2D22': 2002,'0x0F60': 2002,'0x0F61': 2002,'0x0F5D': 2002,'0x0F5C': 2002,'0x2D2B': 2009,'0x2D1F': 2009,'0x143A': 2002,'0x143B': 2002,'0x1B75': 2002,'0x1B74': 2002,'0x1B7B': 2002,'0x27A2': 2002,'0x27AE': 2001,'0x1BC5': 2002,'0x1BC4': 2002,
        '0x2D34': 2002,'0x2D28': 2002,'0x0E85': 2001,'0x0E86': 2001,'0x26BE': 2002,'0x26C8': 2002,'0x0E88': 2001,'0x0E87': 2001,'0x0E8A': 2003,'0x0E89': 2003,'0x2D33': 2002,'0x2D27': 2002,'0x26C3': 2009,'0x26CD': 2009,'0x2D32': 2002,'0x2D26': 2002,'0x27AF': 2002,'0x26BC': 2002,'0x26C6': 2002,'0x13B5': 2002,'0x13B6': 2002,
        '0x26BA': 2002,'0x26C4': 2002,'0x1402': 2002,'0x1403': 2002,'0x0EC5': 2001,'0x0EC4': 2001,'0x0FB4': 2001,'0x0FB5': 2001,'0x13E3': 2001,'0x13E4': 2001,'0x0F63': 2002,'0x0F62': 2002,'0x1B79': 2002,'0x1B78': 2002,'0x27AB': 2002,'0x27A3': 2002,'0x27A6': 2003,'0x1442': 2002,'0x1443': 2002,'0x13BA': 2002,'0x13B9': 2002,
        '0x27A4': 2002,'0x13AF': 2002,'0x13B0': 2002,'0x2D2F': 2002,'0x2D23': 2002,'0x1404': 2002,'0x1405': 2002,'0x1438': 2002,'0x1439': 2002,'0x1406': 2002,'0x1407': 2002,'0x2D31': 2003,'0x2D25': 2003,'0x1B7A': 2003,'0x27A5': 2009,'0x153F': 2006,'0x140D': 2002,'0x140C': 2002,'0x1545': 2006,'0x1454': 2006,'0x144F': 2006,
        '0x144E': 2006,'0x1453': 2006,'0x1450': 2006,'0x1455': 2006,'0x1451': 2006,'0x1456': 2006,'0x1457': 2006,'0x1452': 2006,'0x1F06': 2001,'0x1086': 2001,'0x13BB': 2002,'0x13C0': 2002,'0x2774': 2002,'0x13C3': 2002,'0x13BE': 2002,'0x13C4': 2002,'0x13BF': 2002,'0x1409': 2002,'0x1408': 2002,'0x2778': 2002,'0x1547': 2006,
        '0x171A': 2006,'0x1C07': 2006,'0x1C06': 2006,'0x1C05': 2002,'0x1C04': 2002,'0x1713': 2006,'0x2777': 2002,'0x140B': 2002,'0x140A': 2002,'0x2B75': 2006,'0x2B76': 2006,'0x2B78': 2006,'0x2B77': 2006,'0x2B74': 2006,'0x171C': 2006,'0x2798': 2006,'0x2FC8': 2006,'0x2FC6': 2006,'0x2FC7': 2006,'0x2FC9': 2006,'0x2FCA': 2006,
        '0x2FC5': 2006,'0x1C0B': 2006,'0x1C0A': 2006,'0x1DB9': 2006,'0x1DBA': 2006,'0x277B': 2006,'0x13C6': 2006,'0x13CE': 2006,'0x13C7': 2006,'0x278A': 2006,'0x277E': 2006,'0x2776': 2006,'0x13D2': 2006,'0x13CB': 2006,'0x277A': 2006,'0x278E': 2006,'0x2793': 2006,'0x2792': 2006,'0x2791': 2006,'0x1C01': 2006,'0x1C00': 2006,
        '0x1C09': 2006,'0x1C08': 2006,'0x13C5': 2006,'0x13CD': 2006,'0x2786': 2006,'0x13D3': 2006,'0x13CC': 2006,'0x2781': 2002,'0x140F': 2002,'0x140E': 2002,'0x1F0B': 2006,'0x1F0C': 2006,'0x141B': 2006,'0x1412': 2002,'0x1419': 2002,'0x1410': 2002,'0x1417': 2002,'0x2785': 2002,'0x277D': 2002,'0x1414': 2002,'0x1418': 2002,
        '0x1413': 2002,'0x278D': 2002,'0x2775': 2002,'0x2780': 2002,'0x141A': 2002,'0x1411': 2002,'0x2779': 2002,'0x2788': 2002,'0x1416': 2002,'0x1415': 2002,'0x2B71': 2003,'0x1F09': 2001,'0x108A': 2001,'0x13EB': 2002,'0x13F2': 2002,'0x13F1': 2002,'0x13F0': 2002,'0x13EF': 2002,'0x13EE': 2002,'0x13ED': 2002,'0x13EC': 2002,
        '0x1543': 2006,'0x2784': 2002,'0x2789': 2002,'0x1717': 2006,'0x1C03': 2006,'0x1C0D': 2006,'0x1C0C': 2006,'0x277C': 2006,'0x13D5': 2006,'0x13DD': 2006,'0x13D6': 2006,'0x278B': 2006,'0x277F': 2006,'0x13E1': 2006,'0x13DA': 2006,'0x279D': 2006,'0x13D4': 2006,'0x13DC': 2006,'0x2787': 2006,'0x13E2': 2006,'0x13DB': 2006,
        '0x1716': 2006,'0x1549': 2006,'0x154B': 2006,'0x171B': 2006,'0x2B72': 2003,'0x1714': 2006,'0x2B73': 2003,'0x1718': 2006,'0x2B6C': 2003,'0x2B67': 2003,'0x2B6A': 2003,'0x2B69': 2003,'0x2B6B': 2003,'0x153B': 2006,'0x2643': 2002,'0x1541': 2006,'0x2647': 2002,'0x2FB8': 2001,'0x1087': 2001,'0x4049': 2006,'0x404C': 2006,
        '0x4047': 2006,'0x4D0A': 2010,'0x4066': 2006,'0x4644': 2001,'0x405A': 2010,'0x0284': 2006,'0x4056': 2002,'0x4D0B': 2002,'0x4211': 2001,'0x090A': 2002,'0x030A': 2002,'0x404E': 2006,'0x4050': 2002,'0x405C': 2010,'0x405D': 2010,'0x4058': 2010,'0x46B5': 2006,'0x4062': 2006,'0x404B': 2006,'0x4057': 2010,'0x46B4': 2006,
        '0x4052': 2002,'0x13F7': 2001,'0x13F6': 2001,'0x1BC3': 2002,'0x0EC2': 2001,'0x0EC3': 2001,'0x13B3': 2003,'0x13B4': 2003,'0x26C2': 2009,'0x26CC': 2009,'0x26C1': 2002,'0x2F5B': 2001,'0x1712': 2006,'0x170D': 2006,'0x2309': 2006,'0x27A0': 2006
        }

    //Do not edit below
	var layers = [0,'RightHand','LeftHand','Shoes','Pants','Shirt','Helmet','Gloves','Ring','Talisman','Necklace','Hair','Waist','InnerTorso','Bracelet','Face','Beard','MidTorso','Earrings','Arms','Cloak','Backpack','Robe','Eggs','Legs']
	Orion.Print("Repair threshold set at: " + durabilityThreshold)
    var outStrs = [];
	for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
            if(!objDict && Orion.Contains(objProperties, 'Durability'))
                Orion.Print('Item needs to be added: ' + obj.Graphic() + ': ' + obj.Name())
			else if(Orion.Contains(objProperties, 'Durability'))
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold * 2 && min < max)
                    outStrs.push(layers[obj.Layer()] + ':::' + obj.Name() + ':::' + min + ':::' + max);
      			}
    		}
  		}
    if(!outStrs[0])
    	{
    	var gump = Orion.CreateCustomGump(11420);
    	if(gump)
    		gump.Close()
        if(flavorText)
            return Orion.CharPrint(self,1159,'*You check your equipment and find it is in perfect condition*')
        return Orion.CharPrint(self,1159,'No repairs necessary')
        }
    else if(!flavorText)
        Orion.Wait(1);
    else if(outStrs.length == 1)
        Orion.CharPrint(self,1159,'*You check your equipment and find something in need of repair*')
    else if(outStrs.length < 3)
        Orion.CharPrint(self,1159,'*You check your equipment and find some things that need your attention*')
    else if(outStrs.length < 8)
        Orion.CharPrint(self,1159,"*You check your equipment and make a mental note to not get hit so much in the future*") 
    else if(outStrs.length < 20)
        Orion.CharPrint(self,1159,"*You check what's left of your equipment and marvel that any of it is still attached to you given its abysmal condition*")
    outStrs.sort(function(a,b)
    	{
    	var aSplit = Orion.Split(a,':::');
    	var bSplit = Orion.Split(b,':::');
    	var aMin = aSplit[2];
    	var bMin = bSplit[2];
    	var aMax = aSplit[3];
    	var bMax = bSplit[3];
    	return (aMax - aMin) - (bMax - bMin);
    	});
    var rowAdj = 20;
    var rowMargin = 20;
    var columnMargin = 25;
    var width = 450;
    var height = (outStrs.length * rowAdj) + (rowMargin * 2);
    var gump = Orion.CreateCustomGump(11420);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, width, height);
    // gump.AddColoredPolygone(1, 2, width - 3, height - 6, '#FF000000', 1, 7, 1); //gump border
    for(var i=0;i<outStrs.length;i++)
        {
        var textColor = '0';
        var str = outStrs[i];
        var strSplit = Orion.Split(str,':::');
        var layerName = strSplit[0];
        var itemName = strSplit[1];
        var minDura = +strSplit[2];
        var maxDura = +strSplit[3];
        if(minDura < durabilityThreshold)
            textColor = '32';
        else if(minDura < durabilityThreshold * 2)
            textColor = '53'
        gump.AddText(columnMargin, rowMargin + (rowAdj * i), '0', layerName, width - 250);
        gump.AddText(columnMargin + 100, rowMargin + (rowAdj * i), textColor, itemName, width - 250);
        gump.AddText(columnMargin + 320, rowMargin + (rowAdj * i), textColor, minDura + '/' + maxDura, width - 250);
        }
    gump.AddText(415 ,height - 25,0,"v" + RepairGearVersion)
    gump.Update();
    for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
			if(Orion.Contains(objProperties, 'Durability') && objDict)
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold && min < max)
			        {
				    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
			        if(bench)
			        	{
			        	var repairType = objDict;
                        var endTime = Orion.Now() + 10000;
                        var repairGump = Orion.GetGump(any, '0x00002415');
				        while(!repairGump && Orion.Now() < endTime)
                            {
                            Orion.UseObject(bench);
				        	Orion.WaitForGump(2000);
                            repairGump = Orion.GetGump(any, '0x00002415');
                            }
                        if(repairGump !== null)
                            {
                            repairGump.Select(Orion.CreateGumpHook(repairType));
                            var tinkerCount = tinkerLowAlarm && +repairGump.Text(1) < alarmThreshold;
                            var blacksmithCount =  blacksmithLowAlarm && +repairGump.Text(3) < alarmThreshold;
                            var carpentryCount =  carpentryLowAlarm && +repairGump.Text(5) < alarmThreshold;
                            var tailorCount =  tailorLowAlarm && +repairGump.Text(7) < alarmThreshold;
                            var masonryCount =  masonryLowAlarm && +repairGump.Text(9) < alarmThreshold;
                            var glassblowingCount =  glassblowingLowAlarm && +repairGump.Text(11) < alarmThreshold;
                            var fletchingCount = fletchingLowAlarm && +repairGump.Text(13) < alarmThreshold;
                            if(tinkerCount || blacksmithCount || carpentryCount || tailorCount || masonryCount || glassblowingCount || fletchingCount)
                                Orion.CharPrint(self,32,'Check repair bench!')  //DiscordPush(Orion.ShardName() + ': Check repair bench!');
                            if(Orion.WaitForTarget(2000))
                                Orion.TargetObject(obj.Serial());
                            }
                        Orion.WaitForGump(2000);
				        }		   
			        }
      			}
    		}
        Orion.Wait(100);
  		}
    Orion.Wait(1000);
    for(var i=1;i<layers.length;i++)
        {
        if(Orion.ObjAtLayer(i))
            {
            var obj = Orion.ObjAtLayer(i);
            var objProperties = obj.Properties();
            var objDict = repairDict[obj.Graphic()];
            if(objDict && Orion.Contains(objProperties, 'Durability'))
                {
                var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/);
                var min = +dura[1];
                var max = +dura[2];
                if(dura[0] && min < durabilityThreshold && min < max)
                    {
                    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
                    if(bench)
                        return RepairGear();
                    }                   
                }
            }
        }
    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
    gump = Orion.CreateCustomGump(11420);
    if(bench && gump)
        gump.Close();
	}

function GetAllVendorGold()
	{
	var gump = Orion.GetGump('any','0x000002AB');
	if(gump !== null)
		{
		var gold = Orion.Split(gump.Text(3), ',').join('');
		gump.Select(Orion.CreateGumpHook(7));
		if(Orion.WaitJournal('How much of the', Orion.Now(), Orion.Now() + 2000))
            {
            Orion.Wait(100);
			Orion.SendPrompt(gold);
            }
		}
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
	}

function DropDraggedToContainer() //v2
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer');
	if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}

function DropDraggedHere() //v3
    {
    if(!Orion.Dragging())
        return Orion.CharPrint(self,1159,'Drag an item onto your cursor first');
    var range = 2;
    var endTimeMain = Orion.Now() + 6000;
    var hash = {};
    while(Orion.Dragging() && Orion.Now() < endTimeMain)
        {
        //Orion.ResetSearchArea(); //uncomment this IF it won't mess with your other search areas
        var firstPassTiles = Orion.GetTilesInRect('land',Player.X()-range,Player.Y()-range,Player.X()+range,Player.Y()+range)
            .filter(function(tile)
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                var tileZ = tile.Z();
                if(tileZ != Player.Z())
                    return false;
                var tileHash = "" + tileX + tileY + tileZ;
                if(hash[tileHash])
                    return false;
                var mobCheck = Orion.FindType(any,any,ground,'live','xyz: ' + tileX + ',' + tileY).length == 0;
                var itemCheck = Orion.FindType(any,any,ground,'item','xyz: ' + tileX + ',' + tileY).length <= 5;
                return mobCheck && itemCheck;
                });
        if(!firstPassTiles.length)
            Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
        var validTiles = [];
        for(var i=0;i<firstPassTiles.length;i++)
            {
            var tile = firstPassTiles[i];
            //if(Orion.GetPathArray(tile.X(),tile.Y(),Player.Z(),0,1,1,0)[0])
            if(Orion.CanWalk('1', tile.X(), tile.Y(), tile.Z()))
                {
                validTiles.push(tile);
                if(validTiles.length >= 4)
                    break;
                }
            }
        var endTimeSub = Orion.Now() + 2000;
        while(validTiles.length && Orion.Dragging() && Orion.Now() < endTimeSub)
            {
            var validTile = validTiles.shift();
            var validTileX = validTile.X();
            var validTileY = validTile.Y();
            var validTileZ = validTile.Z();
            Orion.AddFakeMapObject(0, '0x051A', 1152, validTileX, validTileY, validTileZ);
            Orion.DropDraggedItem(ground, validTileX, validTileY, validTileZ);
            Orion.Wait(500);
            }
        if(validTile && Orion.Dragging())
            hash['' + validTileX + validTileY + validTileZ] = true;
        }
    if(!validTiles.length)
        Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
    }

function AddToDropQueue()
    {
    while(true)
        {
        var check = Orion.WaitForAddObject('myTarget');
        if(check != 1)
            break;
        Orion.Exec('DropFromQueue',true);
        var serial = Orion.GetSerial('myTarget');
        var tempArr = Shared.GetArray('dropQueue', []);
        //Orion.Print(tempArr);
        var ind = tempArr.indexOf(serial);
        if(ind == -1)
            {
            tempArr.push(serial);
            Orion.TestItemColor(serial, '1159');
            }
        else
            {
            tempArr.splice(ind,1);
            Orion.TestItemColor(serial, '0');
            }
        Shared.AddArray('dropQueue',tempArr);
        Orion.Wait(1);
        }
    }

function DropFromQueue(_)
    {
    var endStamp = Orion.Now() + 5000;
    while(true)
        {
        var tempArr = Shared.GetArray('dropQueue');
        if(tempArr[0])
            {
            var itemSerial = tempArr.shift();
            Shared.AddArray('dropQueue',tempArr);
            while(Orion.FindType(any).indexOf(itemSerial) > -1)
                {
                var validTiles = Orion.GetTilesInRect('land|any', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
                    .filter(function(tile)
                        {
                        var mobCheck = Orion.FindType(any,any,ground,'live','xyz: ' + tile.X() + ',' + tile.Y() + ',' + tile.Z()).length == 0;
                        var itemCheck = Orion.FindType(any,any,ground,'item','xyz: ' + tile.X() + ',' + tile.Y() + ',' + tile.Z()).length < 8;
                        return mobCheck && itemCheck;
                        });
                Orion.ResetSearchArea();
                var validTile = null;
                for(var i=0;i<validTiles.length;i++)
                    {
                    if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
                        {
                        validTile = validTiles[i];
                        break;
                        }
                    }
                if(validTile)
                    {
                    var validTileX = validTile.X();
                    var validTileY = validTile.Y();
                    var validTileZ = validTile.Z();
                    //Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
                    Orion.Drop(itemSerial, 0, validTileX, validTileY, validTileZ);
                    }
                Orion.Wait(250);  
                }
            endStamp = Orion.Now() + 5000;
            }
        if(Orion.Now() > endStamp)
            break;
        Orion.Wait(1);
        }
    }

function MoveAll()
	{
    Orion.CharPrint(self,1159,"Select 'From' container");
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    var item = Orion.FindType(any,any,fromContainer)[0];
    while(item)
        {
        Orion.MoveItem(item,0,toContainer);
        Orion.Wait(1200);
        item = Orion.FindType(any,any,fromContainer)[0];
        }
	}

function ContainerGumpToggle()
	{//Easily toggle between gridded and classic containers.
    Orion.ClientOptionSet('GriddedContainers', !Orion.ClientOptionGet('GriddedContainers'));
	}

function ZAxisToggle()
	{
    Orion.ClientOptionSet('CustomMaxDrawZOffsetValue', 1)
	if (Orion.ClientOptionGet('UseCustomMaxDrawZOffset') == 1)
		Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 0)
	else
		Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 1)
	}

function LandGridToggle()
	{
	if(Orion.ClientOptionGet('MarkingLandTiles') == 1)
		Orion.ClientOptionSet('MarkingLandTiles', 0)
	else
		Orion.ClientOptionSet('MarkingLandTiles', 1)
	}

function AutoPriceSimple()
	{
	while(true)
		{
		if(Orion.WaitForPrompt(1000))
			Orion.SendPrompt('30000');
		}
	}
    
function HighlightUnlocked()
	{ //Highlights all items nearby that don't have 'Locked Down' in their tooltip
	Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
		{
		return !Orion.Contains(item.Properties(),'Locked Down');
		}).forEach(function(item)
			{
			Orion.TestItemColor(item.Serial(),1152)
			});
	}

function NeedleInAHayStack()
    { //v1
    var textSearch = 'Retouch';
    var containers = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item) //get all containers on the ground within 24 tiles
        {
        var itemZ = item.Z();
        var itemProps = item.Properties();
        var playerZ = Player.Z();
        var zCheck = itemZ >= playerZ && itemZ <= playerZ + 19
        var containerCheck = Orion.Contains(itemProps,'Contents: ');
        var emptyCheck = Orion.Contains(itemProps,'Contents: 0/');
        return zCheck && containerCheck && !emptyCheck;
        }).sort(function(a,b) //sort by nearest
            {
            return a.Distance() - b.Distance();
            });
    for(var i=0;i<containers.length;i++) //loop through em
        {
        var containerObj = containers[i];
        var containerSerial = containerObj.Serial();
        var containerX = containerObj.X();
        var containerY = containerObj.Y();
        var containerZ = containerObj.Z();
        VerifyWalkTo(containerX,containerY,containerZ,1);
        var subContainers = GetAllSubContainers(containerSerial,true);
        for(var j=0;j<subContainers.length;j++)
            {
            var subContainerSerial = subContainers[j];
            var searchItem = Orion.FindTypeEx(any,any,subContainerSerial).filter(function(item)
                {
                return Orion.Contains(item.Properties(),textSearch)
                });
            while(searchItem[0])
                {
                Orion.CharPrint(containerSerial,1159,textSearch + ' Found!')
				Orion.TestItemColor(containerSerial, 1152);
                Orion.MoveItem(searchItem[0].Serial());
                Orion.Wait(1300);
                searchItem = Orion.FindTypeEx(any,any,subContainerSerial).filter(function(item)
                    {
                    return Orion.Contains(item.Properties(),textSearch)
                    });
                }
            }
        }
    }

function LogOut()
    {
    //This function will log you out and disable autoreconnect.
    Orion.OAOptionSet('AutoReconnect', 0);
    Orion.LogOut();
    }

function AliAtlasTest()
	{ //[x,y,'facet']
	AliAtlas([3688,2079,'Trammel'])
	}

function StayLoggedIn()
	{
	while(!Player.Dead())
		{
		Orion.UseObject('backpack');
		Orion.Wait(60000);
		}
	}

function HideTilHidden()
	{
	Orion.Terminate('AlwaysAttackAdjacent');
	while(!Player.Dead() && !Orion.BuffExists('hiding'))
		{
		var startTile = '' + Player.X() + Player.Y();
		Orion.UseSkill('Hiding');
		Orion.Wait(1000);
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 1, 'gray|red|criminal|orange');
		if(!Orion.BuffExists('hiding') && enemies.length)
			{
			Orion.Attack(enemies[0]);
			if(!Orion.AbilityStatus(profile.singleTargetSpecial) && Player.Mana() >= 15)
				Orion.UseAbility(profile.singleTargetSpecial);
			}
		}
	Orion.SetTimer('StayLoggedIn');
	while(Orion.BuffExists('hiding'))
		{
		if(Orion.Timer('StayLoggedIn') > 60000)
			{
			Orion.UseObject(backpack);
			Orion.SetTimer('StayLoggedIn');
			}
		Orion.Wait(500)
		}
	Orion.Wait(1000);
	if((''+ Player.X() + Player.Y()) == startTile)
		{
		DiscordPush(Player.Name() + ' Revealed!')
		return HideTilHidden();
		}
	}

function StayHidden()
    {
    while(!Player.Dead())
        {
        while(!Orion.BuffExists('Hiding'))
            {
            Orion.UseSkill('Hiding');
            Orion.Wait(500);
            }
        Orion.Wait(500);
        }
    }

function AttackNearest()
    {
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
    }

function GatherMobs()
    {
    Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red')
        .forEach(function(mob)
            {
            Orion.TargetSystemSerial(mob);
            Orion.Attack(mob);
            Orion.Wait(10);
            });
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends|ignoreself|nothuman', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
    }

function FindOwnCorpse()
    {//Runs to and loots your corpse. Might need to spam the hotkey
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var body = Orion.FindTypeEx(any, any, ground, 'ignoreself', 24).filter(function(part)
		{
		return Orion.Contains(part.Properties(), _pName)
		});
    if(Orion.WalkTo(body[0].X(), body[0].Y()))
        Orion.UseObject(body[0].Serial());
    }

function ActivateChampSpawn()
	{
	var altar = Orion.FindType('0x1F18',any,ground,'',20)[0];
	if(!altar)
		return Orion.CharPrint(self,1159,'No altar found!');
	Orion.InvokeVirtue('valor')
	if(Orion.WaitForTarget(2000))
		Orion.TargetObject(altar);
	}	

function BuyHorse()
    {
    var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the animal trainer') && !Orion.Contains(vendor.Properties(), 'guild');
        });
    var shopnpcSerial = vendors[0].Serial();
    var shoplist = Orion.GetShopList('Horsey');
    var items = [
        new ShopListItem('0x00E4|0x00C8|0x00E2|0x00CC', '0x0000', '', 1),
        ];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    Orion.BuyHook('Horsey');
    Orion.WaitContextMenuID(shopnpcSerial, 110);
    Orion.RequestContextMenu(shopnpcSerial);
    Orion.Wait(1300);
    var horsey = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'blue|green').filter(function(mobile)
        {
        return Orion.Contains(mobile.Name(), 'a horse');  
        })[0];
    while(!Orion.ObjAtLayer('Mount'))
        {
        Orion.Say('all follow me');
        Orion.UseObject(horsey.Serial())
        Orion.Wait(1300);
        }
    }

function RecallBandieBuy()
    {
	Orion.PauseScript('all','JournalScan|RecallBandieBuy');
	Orion.Wait(500);
	Orion.Terminate('all','JournalScan|RecallBandieBuy');
    RecallByGump('Main','Luna');
	BandieBuy();
	Orion.Wait(1500);
	Orion.Exec('WalkThroughCurrentFarm');
    }
    
function BandieBuy()
	{
	do {
		var vendors = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
			{
			return Orion.Contains(vendor.Properties(), 'the weaver') && !Orion.Contains(vendor.Properties(), 'guild');
			})[0];
		Orion.Wait(1000);
		} while(!vendors)
    var shopnpcSerial = vendors.Serial();
    while(!Orion.FindType('0x0F9B')[0] || !Orion.FindType('0x0F9E')[0])
        {
		Orion.WalkTo(vendors.X(),vendors.Y());
        var shoplist = Orion.GetShopList('Cloth');
        var amount = Math.max((Player.MaxWeight() - Player.Weight() - 275)/5, 4)
        if(!Orion.FindType('0x0F9E')[0])
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount), new ShopListItem('0x0F9E', '0x0000', '', 1)];
        else
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount)];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Cloth');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(1300);
        }
    var scissors = Orion.FindType('0x0F9E')[0];
    do
		{
		var bolts = Orion.FindType('0x0F9B')[0];
		Orion.UseObject(scissors)
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(bolts);
		Orion.Wait(2000)
        var cloth = Orion.FindType('0x1766')[0];
        } while(!cloth)
    do
        {
		Orion.UseObject(scissors);
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(cloth);
        Orion.Wait(2000);
        var bandies = Orion.FindType('0x0E21', any, ground)[0] || Orion.FindType('0x0E21')[0];
        } while(!bandies)
    while(Orion.FindType('0x0E21', any, ground)[0])
        {
        Orion.MoveItem(bandies);
        Orion.Wait(1300);
        }
     if(Player.Weight() > Player.MaxWeight())
		{
		DiscordPush(Orion.ShardName() + ': ' + Player.Name() + ': Overweight after buying bandies. Halting...')
		//RecallByGump('Main','Home');
		Orion.LogOut();
		Orion.PauseScript('all');
		Orion.Wait(1000);
		Orion.Terminate('all');
		}
	}

function TotTurnIns()
	{
	while(true)
		{
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
				{
				gump0.Select(Orion.CreateGumpHook(100));
				Orion.Wait(100);
				}
			}
		else
		    Orion.Wait(100);
		}
	}

function Tithe()
    {
    CloseAllGumps();
    var endTime = Orion.Now() + 10000;
    while(Player.TithingPoints() < 100000)
        {
        if(Orion.Now() > endTime)
            {
            return DiscordPush(Player.Name() + "couldn't tithe to 100,000")
            }
        var subEndTime = Orion.Now() + 5000;
        var ankh = Orion.FindTypeEx('0x0005|0x0002|0x0003|0x0004',any,ground,'item',20)[0];
        do
            {
            if(Orion.Now() > subEndTime)
                return DiscordPush(Player.Name() + "couldn't find ankh!")
            Orion.WalkTo(ankh.X(),ankh.Y())
            Orion.Wait(500);
            } while(!Orion.FindType('0x0005|0x0002|0x0003|0x0004',any,ground,'item',2)[0])
        Orion.WaitContextMenuID(ankh.Serial(), 412);
        Orion.RequestContextMenu(ankh.Serial());
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(300);
                }
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(2));
                Orion.Wait(300);
                }
            }
        Orion.Wait(1000);
        }
    }

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
*/

function CommodifyEverything60k()
    { //will combine stacks to 60k and then use a commodity deed on the stack
    Commodifier(60000);
    }

function CombineEverything60k()
    { //will combine stacks to 60k without using a commodity deed on the stack
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

function CombineSpecificItemsArrayExample()
    {
    var itemArr = [
        //[graphicId, colorId]
        ['0x1BF2', '0x0000'], //iron ingot
        ['0x1BF2', '0x0973'], //dull copper ingot
        ['0x1BF2', '0x0966'], //shadow iron ingot
        ['0x1BF2', '0x0972'], //bronze ingot
        ['0x1BF2', '0x096D'], //copper ingot
        ['0x1BF2', '0x08A5'], //gold ingot
        ['0x1BF2', '0x0979'], //agapite ingot
        ['0x1BF2', '0x089F'], //verite ingot
        ['0x1BF2', '0x08AB'], //valorite ingot
    ];
    Commodifier(10000, false, itemArr); //will combine everything in the array to stacks of 10,000 without using a commodity deed on them
    }

function MoveCommodityDeeds()
	{ //Easily move large amounts of filled or unfilled commodity deeds from one container to another
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
    do
        {
        var colorString = Player.WarMode() ? '0x0592' : '0x0047';
        commodity = Orion.FindType('0x14F0',colorString,fromContainer)[0];
        Orion.MoveItem(commodity,0,toContainer);
        Orion.Wait(1300);
        } while(commodity)
	}

function TeleportChargeCounter()
    {
    Orion.CharPrint(self,1159,'Target container full of rings');
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', container))
        {
        Orion.UseObject(container);
        Orion.Wait(1300);
        }
    var rings = Orion.FindTypeEx(any,any,container).filter(function(ring)
        {
        return Orion.Contains(ring.Properties(), 'Ring') && Orion.Contains(ring.Properties(), 'Teleport Charges:')
        });
    var charges = rings.reduce(function(sum, current)
        {
        var currentCharges = +((current.Properties().match(/Teleport Charges: (\d+)/) || [])[1] || 0);
        return sum + currentCharges;
        }, 0);
    Orion.Print('Total charges: ' + charges);
    Orion.Print('Average charges per ring: ' + (charges/rings.length));
    }

function VendorRepricer()
    {
    var adjAmount = .8; //multiply current price by this to get adjusted price
    Orion.CancelWaitPrompt();
    if(Orion.PromptExists())
        Orion.SendPrompt(' ');
    Orion.CharPrint(self,1159,'Choose vendor or container to deprice')
    Orion.WaitForAddObject('myTarget');
    var containerSerial = Orion.GetSerial('myTarget');
    var containerObj = Orion.FindObject(containerSerial);
    if(containerObj.Mobile())
    	var vendorContainer = Orion.ObjAtLayer('backpack', containerSerial).Serial();
    else
    	var vendorContainer = containerSerial
    while(!Orion.GumpExists('container', vendorContainer))
        {
        Orion.UseObject(vendorContainer)
        Orion.Wait(1300);
        }
    var items = Orion.FindTypeEx(any,any, vendorContainer);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i];
        var priceString = (item.Properties().match(/Price: ([\d,]+)/) || [])[1];
        if(!priceString)
            {
            Orion.CharPrint(self,1159,'priceString failed, retrying...')
            i--;
            continue;
            }
        var itemSerial = item.Serial();
        var itemContainer = item.Container()
        var itemX = item.X();
        var itemY = item.Y();
        var itemIndex = item.GridIndex();
        var priceNumber = +priceString.replace(/,/g, '');
        var adjPrice = Math.floor(priceNumber * adjAmount);
        Orion.Print(item.Name());
        Orion.Print(priceNumber + ' -> ' + adjPrice);
        var endTime = Orion.Now() + 2000;
        var timeout = false;
        while(item.Container() == itemContainer && !timeout)
            {
            Orion.MoveItem(itemSerial);
            Orion.Wait(1300);
            timeout = Orion.Now() > endTime;
            }
        if(timeout)
            {
            Orion.CharPrint(self,1159,'Item didnt move, retrying...');
            i--;
            continue;
            }
        itemContainer = item.Container();
        Orion.WaitPrompt(adjPrice);
        endTime = Orion.Now() + 2000;
        timeout = false;
        while(itemContainer == item.Container() && !timeout)
            {
            Orion.MoveItem(itemSerial, 0, vendorContainer, itemX, itemY, -1, itemIndex);
            Orion.Wait(1300);	
            timeout = Orion.Now() > endTime;
            }
        Orion.CancelWaitPrompt();
        if(Orion.PromptExists())
            Orion.SendPrompt(' ');
        Orion.Wait(700);
        }
    }

function WaitForAuctionItem()
	{
	var searchString = 'lava'
	var startTime = Orion.Now();
	while(true)
		{
		var found = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
			{
			return Orion.Contains(item.Properties(), searchString);
			})[0];
		var journal = Orion.InJournal(searchString, "", '0', 'any', startTime);
		if(found || journal)
			{
			DiscordPush('Auction Item Up!');
			Orion.PauseScript();
			}
		Orion.Wait(1000);
		}
	}

function SecureAndCoOwn(itemSerial)
    {
    if(itemSerial === undefined)
        {
        Orion.WaitForAddObject('myTarget');
        var itemSerial = Orion.GetSerial('myTarget');
        }
    var startTime = Orion.Now();
    var target = Orion.FindObject(itemSerial);
    var targetSerial = target.Serial();
    while(true)
        {
        Orion.Say('i wish to secure this');
        if(Orion.WaitForTarget(3000))
            {
            Orion.TargetObject(targetSerial);
            var endTime = Orion.Now() + 4000;
            check = Orion.WaitJournal('Secure!|Locked down!',startTime,endTime,'item',targetSerial);
            if(check)
                {
                startTime = Orion.Now();
                var gump = Orion.GetGump(any, '0x00000295');
                while(!gump)
                    {
                    Orion.WaitContextMenuID(targetSerial, 600);
                    Orion.RequestContextMenu(targetSerial);
                    Orion.Wait(500);
                    gump = Orion.GetGump(any, '0x00000295');
                    }
                gump.Select(Orion.CreateGumpHook(2));
                endTime = Orion.Now() + 4000;
                check = Orion.WaitJournal('New access level set.',startTime,endTime,'sys');
                if(check)
                    break;
                }
            }
        Orion.Wait(100);
        }
    Orion.CharPrint(self,1159,'Secured and Access Set')
    }