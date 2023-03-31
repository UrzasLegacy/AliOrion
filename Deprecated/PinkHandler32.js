//v32
//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the last column of scrollinfo array
var maxcount = 2
var scrollinfo = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc
		["Arms Lore",           0,  0,  1044064,    599998],
		["Begging",             0,  1,  1044066,    1399999],
		["Camping",             0,  2,  1044070,    99998],
		["Cartography",         0,  3,  1044072,    1199998],
		["Forensics",           0,  4,  1044079,    99998],
		["Item Identification", 0,  5,  1044063,    29999],
		["Taste Identification",0,  6,  1044096,    29999],
	//1 Combat
		["Anatomy",             1,  0,  1044061,    3899997],
		["Archery",             1,  1,  1044091,    7399997],
		["Fencing",             1,  2,  1044102,    499999],
		["Focus",               1,  3,  1044110,    1899999],
		["Healing",             1,  4,  1044077,    17899999],
		["Mace Fighting",       1,  5,  1044101,    1199999],
		["Parrying",            1,  6,  1044065,    17998999],
		["Swordsmanship",       1,  7,  1044100,    5899993],
		["Tactics",             1,  8,  1044087,    27999999],
		["Throwing",            1,  9,  1044117,    249999],
		["Wrestling",           1,  10, 1044103,    999999],
	//2 Trade Skills
		["Alchemy",             2,  0,  1044060,    4799999],
		["Blacksmithing",       2,  1,  1044067,    4498999],
		["Fletching",           2,  2,  1044068,    399999],
		["Carpentry",           2,  3,  1044071,    999999],
		["Cooking",             2,  4,  1044073,    499999],
		["Inscription",         2,  5,  1044083,    3799999],
		["Lumberjacking",       2,  6,  1044104,    474996],
		["Mining",              2,  7,  1044105,    299999],
		["Tailoring",           2,  8,  1044094,    2799999],
		["Tinkering",           2,  9,  1044097,    2399899],
	//3 Magic
		["Bushido",             3,  0,  1044112,    36499999],
		["Chivalry",            3,  1,  1044111,    18499999],
		["Eval Intelligence",   3,  2,  1044076,    9399999],
		["Imbuing",             3,  3,  1044116,    8199999],
		["Magery",              3,  4,  1044085,    25999999],
		["Meditation",          3,  5,  1044106,    29999],
		["Mysticism",           3,  6,  1044115,    6499998],
		["Necromancy",          3,  7,  1044109,    12899999],
		["Ninjitsu",            3,  8,  1044113,    12999999],
		["Resisting Spells",    3,  9,  1044086,    11399999],
		["Spellweaving",        3,  10, 1044114,    12999994],
		["Spirit Speak",        3,  11, 1044092,    799999],
	//4 Wilderness
		["Animal Lore",         4,  0,  1044062,    7799999],
		["Animal Taming",       4,  1,  1044095,    54499999],
		["Fishing",             4,  2,  1044078,    3999999],
		["Herding",             4,  3,  1044080,    99996],
		["Tracking",            4,  4,  1044098,    399999],
		["Veterinary",          4,  5,  1044099,    2499999],
	//5 Thievery
		["Detecting Hidden",    5,  0,  1044074,    1799999],
		["Hiding",              5,  1,  1044081,    4999899],
		["Lock Picking",        5,  2,  1044084,    4499999],
		["Poisoning",           5,  3,  1044090,    6499999],
		["Remove Trap",         5,  4,  1044108,    2389999],
		["Snooping",            5,  5,  1044088,    39999],
		["Stealing",            5,  6,  1044093,    4499999],
		["Stealth",             5,  7,  1044107,    6999899],
	//6 Bard
		["Discordance",         6,  0,  1044075,    19799999],
		["Musicianship",        6,  1,  1044089,    4799999],
		["Peacemaking",         6,  2,  1044069,    3499999],
		["Provocation",         6,  3,  1044082,    8999999],
	]

function Autostart()
    {
    while(!Orion.GumpExists('container',backpack))
        {
        Orion.UseObject(backpack);
        Orion.Wait(1300);
        }
    Orion.Exec('GMJournalScan',true);
    Orion.Exec('MonitorVendorsForSales',true);
    if(Orion.GetDistance(775,729) < 6 || Orion.GetDistance(794,749) < 6)
        {
        Orion.Wait(1300);
        Orion.Exec('MonitorVendorsForSales',true);
        Orion.Exec('FullAutoVendor',true);
        }
    }

function ScrollListFormatter()
    {
    var cats = ['Misc','Combat','Trade Skills','Magic','Wilderness','Thievery','Bard'];
    var fullStr = '';
    fullStr += 'var scrollinfo = //[skillname, categoryindex, skillindex, bookbutton, price]\n\t[\n';
    for(var i=0;i<scrollinfo.length;i++)
        {
        var scroll = scrollinfo[i];
        if(scroll[2] == 0)
        fullStr += '\t//' + scroll[1] + ' ' + cats[scroll[1]] + '\n';
        var string = JSON.stringify(scroll)
        var rep = Orion.Split(string,',');
        var outStr = '';
        for(var ii=0;ii<rep.length;ii++)
        	{
        	var stringLens = rep[ii].length
        	var spaces = '';
        	var deltaSpace = 3 - stringLens;
        	if(ii == 0)
        		deltaSpace = 23 - stringLens;
        	else if(ii == 3)
        		deltaSpace = 11 - stringLens;
        	else if(ii == rep.length - 1)
        		deltaSpace = 0;
        	for(var iii=0;iii<deltaSpace;iii++)
        		{
        		spaces += ' ';
        		}
        	outStr +=  rep[ii] + ',' + spaces;
        	}
        fullStr += '\t\t' + outStr + '\n';
        }
    fullStr += '\t]\n';
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print(fullStr);
    return fullStr;
    }

function ScrollPriceListGump()
    {
    var cats = {
        0: 'Misc',
        1: 'Combat',
        2: 'Trade',
        3: 'Magic',
        4: 'Wilderness',
        5: 'Thievery',
        6: 'Bard'
    }
    var gump = Orion.CreateCustomGump(12501);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xDAC, 481, 590);
    var mark = 0;
    var x1 = 25;
    var x2 = x1 + 125;
    var y = -15;
    var yInc = 15;
    for(var i=0;i<scrollinfo.length;i++)
        {
        var scroll = scrollinfo[i];
        var price = scroll[4];
        if(price < 100000)
        	var rounded = Math.round(price / 10000) * 10000;
        else //if(price < 1000000)
        	var rounded = Math.round(price / 100000) * 100000;
        //else
        	//var rounded = Math.round(price / 1000000) * 1000000;
        y += yInc;
        if(scroll[1] >= mark)
            {
            mark++;
            if(scroll[1] == 3)
                {
                y = 0;
                x1 = 260;
                x2 = x1 + 125;
                }
            y += yInc;
            gump.AddText(x1 - 5,y,0,"<u><big>" + cats[scroll[1]] + '</big></u>')
            y += yInc;
            }
        gump.AddText(x1,y,0,scroll[0]);
        gump.AddText(x2,y,0,rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        }
    gump.Update();
    }

function CheckAuctionSafe()
	{
	var safe = Orion.FindType('0x9C18|0x9C19',any,ground,'near|item',6)[0];
	if(safe)
		Orion.UseObject(safe);
	}
//------------------------------------------------------------------------Begin Gump Script
var b = 3;
var buttons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, b++, "RepeatCombo", 'RepeatCombo'], [100, 30, b++, "RepeatFives", 'RepeatFivesCombo'], [100, 30, b++, "ComboCategories", 'ComboCategories'] ],
        [],
        [ [100, 30, b++, "MoveAllPinks", 'MoveAllScrollsInPack'], [100, 30, b++, "MoveAll5s", 'MoveAll5sInPack'], [100, 30, b++, "MoveAllBinders", 'MoveAllBinders'] ],
        [ [100, 30, b++, "MoveAllBooks", 'MoveAllBooks'], [100, 30, b++, "CountInPack", 'CountInPack'], [100, 30, b++, "GridToggle", 'ContainerGumpToggle'] ],
        [],
        [ [100, 30, b++, "PinkToVendor", 'ManualVendor'], [100, 30, b++, "GetVendorGold", 'GetAllVendorGold'], [100, 30, b++, "AutoVendor", 'AutoVendor'] ],
        [],
        [ [100, 30, b++, "PinkSort", 'PinkSort'], [100, 30, b++, "EmptyPinkBook", 'EmptyPinkBook'], [100, 30, b++, "SetSecurity", 'CoOwnerAccessSortContainer'] ],
        [ [100, 30, b++, "ReplaceBooks", 'ReplaceSortBooks'], [100, 30, b++, "TokenCracker", 'PinkTokenCracker'] ],
        [],
        [ [100, 30, b++, "MakeWoodPulp", 'MakeWoodPulp'], [100, 30, b++, "MakeBinders", 'MakeBinders'] ],
        [],
        [ [100, 30, b++, "VSPinks", 'VSResultPinks'] ]
    ]

function Gump()
    {
    Shared.AddArray('combo49', CombinationCall([4,5,6,7,8,9,10],49));
    Shared.AddArray('combo48', CombinationCall([4,5,6,7,8,9,10],48));
    Shared.AddArray('combo47', CombinationCall([4,5,6,7,8,9,10],47));
    Shared.AddArray('combo46', CombinationCall([4,5,6,7,8,9,10],46));
    Shared.AddArray('combo45', CombinationCall([4,5,6,7,8,9,10],45));
    Shared.AddArray('combo44', CombinationCall([4,5,6,7,8,9,10],44));
    Shared.AddArray('combo43', CombinationCall([4,5,6,7,8,9,10],43));
    Shared.AddArray('combo42', CombinationCall([4,5,6,7,8,9,10],42));
    Shared.AddArray('combo41', CombinationCall([4,5,6,7,8,9,10],41));
    Orion.Exec('GMJournalScan',true);
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 100 + 20, buttons.length * 30 - 6, '0x0BB8', 1, 0);
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

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
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

function fullsetprice(_)
	{
	var goldPrice = scrollinfo.reduce(function(a,b)
		{
		return a + b[4];
		}, 0);
	var platPrice = 80; //USD
	var usdPrice = ((goldPrice/1000000000)*platPrice).toFixed(2);
	var fullSetsPrice = usdPrice*99;
	var goldPriceFormatted = goldPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	var usdPriceFormatted = usdPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	var fullPriceFormatted = fullSetsPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	Orion.Print('Set of 5.0s price: ' + '\n' + 'Gold: ' + goldPriceFormatted + '\n' + 'USD ($' + platPrice + ' per plat): $' + usdPriceFormatted + '\n\n' + '99 sets: $' + fullPriceFormatted);
	}

function VSResultPinks()
	{
    var showEqual = true;
	TextWindow.Open();
    TextWindow.Print('--START VS--');
	for(var i=0;i<scrollinfo.length;i++)
		{
        var tab = '\t';
		var skill = scrollinfo[i][0]
        var currentPrice = scrollinfo[i][4];
		var searchText = '5.0 ' + skill;
		var resultArr = VSsearchPageTurner(searchText);
		Orion.Print(skill + ':' + resultArr);
		if(resultArr.length)
			{
			if(resultArr[0] == 'No items matched')
				{
				resultArr.unshift(skill);
				TextWindow.Print('\\\t' + currentPrice + ':\t' + skill + ': No items matched : Current: ' + currentPrice);
				}
			else if(resultArr[0] == 'Timed Out')
				{
                Orion.CharPrint(self,1159,'Search Timed Out, trying again...')
				i--;
				continue;
				}
			else
				{
				var lowestPrice = resultArr[2] || resultArr[1] || resultArr[0];
				if(lowestPrice < currentPrice)
					{
                    if(lowestPrice - 1 < 1000000)
                        tab = '\t\t';
					TextWindow.Print("-\t" + (lowestPrice-1) + '/' + currentPrice + ':' + tab + skill + ': [' + resultArr + ']');
					}
				else if(showEqual && (lowestPrice == currentPrice || lowestPrice - 1 == currentPrice))
                    {
                    if(currentPrice < 1000000)
                        tab = '\t\t';
                    TextWindow.Print("=\t" + currentPrice + '/' + currentPrice +":" + tab + skill + ': [' + resultArr + ']');
                    }
                else if(lowestPrice > currentPrice)
                    {
                    if(lowestPrice - 1 < 1000000)
                        var tab = '\t\t';
					TextWindow.Print("+\t" + (lowestPrice-1) + '/' + currentPrice + ':' + tab + skill + ': [' + resultArr + ']');
                    }
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
    TextWindow.Print('--END VS--');
	}

function VSsearch(text)
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseAllGumps();
			return ['No items matched'];
			}
		}
	else
		{
        CloseAllGumps();
		return ['Timed Out'];
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
	if(vendorSearchResults)
		{
		Orion.RemoveDisplayTimer('searchWait');
		var cmdList = vendorSearchResults.CommandList()
		var prices = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1043304');
			}).map(function(cmdLine)
				{
				var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
				var commaNeg = numberString.replace(/,/g, "");
				return +commaNeg
				});
		}
    CloseAllGumps();
	return prices;
	}

function VSsearchPageTurner(text)
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseAllGumps();
			return ['No items matched'];
			}
		}
	else
		{
        CloseAllGumps();
		return ['Timed Out'];
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
    var pricesFull = [];
	while(vendorSearchResults)
		{
        Orion.RemoveDisplayTimer('searchWait');
        var cmdList = vendorSearchResults.CommandList()
        var prices = cmdList.filter(function(cmdLine)
            {
            return Orion.Contains(cmdLine, '1043304');
            }).map(function(cmdLine)
                {
                var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
                var commaNeg = numberString.replace(/,/g, "");
                return +commaNeg
                }).forEach(function(price)
                    {
                    pricesFull.push(price);
                    });
        var button = GetPageTurnButton(vendorSearchResults);
        if(!button || button == '2')
            {     
	        CloseGumps();
            break;
            }
        vendorSearchResults.Select(Orion.CreateGumpHook(button));
        Orion.Wait(300);
        var waitTIme = 2000;
        vendorSearchResults = WaitForSpecificGump(waitTIme, 'generic', self, '0x000F3EC9')
		}
    CloseAllGumps();
	return pricesFull;
	}

function GetPageTurnButton(gump)
	{
	var buttons = gump.ButtonList().filter(function(b)
		{
		return Orion.Contains(b,' button ') && !Orion.Contains(b, ' button 386')
		});
	if(buttons.length == 2)
		{
        var nextCheck = buttons[1].slice(-3).trim()
		if(nextCheck == '2')
			return +nextCheck;
		else
			return +buttons[0].slice(-4).trim()
		}
	else if(buttons.length == 1)
        {
        var nextCheck = +buttons[0].slice(-4).trim();
        var xPosCheck = buttons[0].slice(8,11).trim();
        if(nextCheck == '502' && xPosCheck == '430')
            return nextCheck;
        }
    return false;
	}
function WaitForSpecificGump(delay, type, serial, id)
    {
    var endTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }
function CloseGumps(_)
    {
    var vendorSearchResults = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC9')
    if(vendorSearchResults)
        {
        vendorSearchResults.Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    var vendorSearchGump = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC8')
    if(vendorSearchGump)
        {
        vendorSearchGump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }
//------------------------------------------------------------------------End Gump Script
//--#Vendor
//------------------------------------------------------------------------Begin Vendor Script
function FullAutoVendor()
    {
    var vendors = [
        [0x064028DF, 12*maxcount, 'Magic'],
        [0x064026A8, 11*maxcount, 'Combat'],
        [0x064022C9, 10*maxcount, 'Trade Skills'],
        [0x06401FE1, 8*maxcount, 'Thievery'],
        [0x06401F29, 6*maxcount, 'Wilderness'],
        [0x06401F19, 4*maxcount, 'Bard'],
        [0x03E20F6F, 7*maxcount, 'Misc'],
    ]
    var loopInterval = 1000 * 5; //check vendor backpacks every 5 seconds
    var restockDelay = 1000 * 30; //when someone buys a scroll, wait this long before restocking the first vendor
    var saluteInterval = 1000 * 60 * 2; //salute every 2 minutes to stay logged in
    var reportInterval = 1000 * 60 * 60 * 3; //send sales report every 3 hours
    var invCntInterval = 1000 * 60 * 60 * 6; //count inventory every 6 hours
    var vendorInterval = 1000 * 60 * 60 * 1; //do a round of checking vendors every 1 hour;
    var saluteTimer = Orion.Now() + saluteInterval;
    var reportTimer = Orion.Now() + reportInterval;
    var invCntTimer = 0;
    var vendorCheckTimer = 0;
    while(!Player.Dead())
        {
        if(Orion.Now() > saluteTimer)
        	{
        	Orion.EmoteAction('salute');
        	saluteTimer = Orion.Now() + saluteInterval;
        	}
        if(Orion.Now() > reportTimer)
            {
            SalesReport();
            reportTimer = Orion.Now() + reportInterval;
            }
        if(Orion.Now() > vendorCheckTimer)
            {
            AutoVendor();
            vendorCheckTimer = Orion.Now() + vendorInterval;
            }
        if(Orion.Now() > invCntTimer)
            {
            AutoCountStock();
            invCntTimer = Orion.Now() + invCntInterval;
            }
        var first = true;
        for(var i=0;i<vendors.length;i++)
            {
            var vendor = vendors[i];
            var vendorBackpack = Orion.ObjAtLayer('Backpack',vendor[0]);
            if(vendorBackpack)
                {
                var itemCount = (vendorBackpack.Properties().match(/Contents: (\d+)/) || [])[1];
                Orion.CharPrint(vendor[0],1159,itemCount);
                if(itemCount && +itemCount < vendor[1])
                    {
                    if(first)
                        {
                        first = false;
                        Orion.AddDisplayTimer('restockDelay', restockDelay, 'AboveChar', 'bar', 'Waiting Out Restock Delay');
                        Orion.Wait(restockDelay);
                        }
                    var vendorObj = Orion.FindObject(vendor[0]);
                    var posX = vendorObj.X();
                    var posY = vendorObj.Y();;
                    while(Orion.GetDistance(posX,posY) > 1)
                        {
                        Orion.WalkTo(posX,posY);
                        Orion.Wait(500);
                        }
                    while(!Player.Hidden())
                        {
                        Orion.UseSkill('Hiding');
                        Orion.Wait(1000);
                        }
                    PinkToVendorCall(vendor[0]);
                    if(Orion.FindType('0x14EF','0x0490')[0] || Orion.FindType('0x14EF','0x0490')[0] || Orion.FindType('0x14EF','0x0490')[0])
                        i--;
                    }
                else if(!itemCount)
                    {
                    while(!Orion.GumpExists('paperdoll',vendor[0]))
                        {
                        Orion.WaitContextMenuID(vendor[0],520);
                        Orion.RequestContextMenu(vendor[0]);
                        Orion.Wait(200);
                        }
                    Orion.CancelContextMenu();
                    while(Orion.GumpExists('paperdoll',vendor[0]))
                        {
                        Orion.ClosePaperdoll(vendor[0]);
                        Orion.Wait(200);
                        }
                    }
                }
            }
        Orion.Wait(loopInterval);
        }
    }

function AutoVendor()
    {
    if(Orion.GetDistance(775,729) < 6)
        {
        var startX = 773, startY = 729; 
        var vendorSerials = [
            '0x064028DF',
            '0x064026A8',
            '0x064022C9',
            '0x06401FE1',
            '0x06401F29',
            '0x06401F19',
            '0x03E20F6F'
            ]
        }
    else if(Orion.GetDistance(794,749) < 6)
        {
        var startX = 790, startY = 750;
        var vendorSerials = [
            '0x002F800C',
            '0x002F7FF5',
            '0x002F7FDF',
            '0x002F7FBD',
            '0x002F7FA5',
            '0x002F7F98',
            '0x002F7F8E'
            ]
        }
    for(var i=0;i<vendorSerials.length;i++)
        {
        while(!Player.Hidden())
            {
            Orion.UseSkill('Hiding');
            Orion.Wait(1000);
            }
        var vendorSerial = vendorSerials[i];
        var posX = startX + Math.min(i,4);
        var posY = startY;
        while(Orion.GetDistance(posX,startY) > 0)
            {
            Orion.WalkTo(posX,posY,0,0);
            Orion.Wait(500);
            }
        Orion.Wait(500);
        GetAllVendorGoldCall(vendorSerial);
        Orion.Wait(1300);
        PinkToVendorCall(vendorSerial);
        if(Orion.FindType('0x14EF','0x0490')[0] || Orion.FindType('0x14EF','0x0490')[0])
            i--;
        }
    
    }

function ManualVendor()
    {
    Orion.CharPrint(self,1159,'Select vendor');
    Orion.WaitForAddObject('myTarget');
    var vendorSerial = Orion.GetSerial('myTarget');
    PinkToVendorCall(vendorSerial)
    }

function PinkToVendorCall(vendorSerial)
	{
    //Positional Data
    var xstart = 48;
    var xend = 142;
        var xoffset = 30;
    var ystart = 58;
    var yend = 121;
        var yoffset = 30;
    var column1 = xstart+xoffset*0;
    var column2 = xstart+xoffset*1;
    var column3 = xstart+xoffset*2;
    var column4 = xstart+xoffset*3;
    var row1 = ystart+yoffset*0;
    var row2 = ystart+yoffset*1;
    var row3 = ystart+yoffset*2;
    var pos =
        [
            [column1, row1],	// position 1
            [column2, row1],	// position 2
            [column3, row1],	// position 3
            [column4, row1],	// position 4
            [column1, row2],	// position 5
            [column2, row2],	// position 6
            [column3, row2],	// position 7
            [column4, row2],	// position 8
            [column1, row3],	// position 9
            [column2, row3],	// position 10
            [column3, row3],	// position 11
            [column4, row3],	// position 12
        ];
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
	var vendor = Orion.FindObject(vendorSerial);
	var vendorContainer = Orion.ObjAtLayer(21,vendorSerial).Serial();
    var vendorName = vendor.Name();
    while(!Orion.GumpExists('container',vendorContainer))
        {
        Orion.UseObject(vendorContainer);
        Orion.Wait(1300);
        }
    VerifyPrices(vendorContainer);
	var groups = ['Misc', 'Combat', 'Trade Skills', 'Magic', 'Wilderness', 'Thievery', 'Bard'];
	var group = groups.indexOf(vendorName);
    var updScrollInfo = scrollinfo.filter(function(part)
        {
        return part[1] == group;
        });
    var requestArr = PinkBookRequestCount(updScrollInfo,vendorContainer);
    var checkEmptyRequestArr = requestArr.every(function(ele)
        {
        return ele == 0;
        });
    if(!checkEmptyRequestArr)
        {
        var passArr = JSON.parse(JSON.stringify(requestArr));
        passArr.unshift(vendorName);
        AppendRequestArrayToFile(passArr);
        DecrementRunningTotals(passArr);
        Orion.SetSearchArea(vendor.X(),vendor.Y(), vendor.X(),vendor.Y());
        var bookPouch = Orion.FindType('0x0E75', any, ground, 'item', 2)[0];
        Orion.ResetSearchArea();
        if(!bookPouch)
            return Orion.Print('Book pouch not found! Halting...');
        if(!PinkPull(updScrollInfo, requestArr, bookPouch,vendorContainer))
            {
            Orion.Print('Retrying book pull one more time...');
            requestArr = PinkBookRequestCount(updScrollInfo,vendorContainer);
            if(!PinkPull(updScrollInfo, requestArr, bookPouch,vendorContainer))
                {
                TextWindow.Open();
                TextWindow.Print('Restock Vendor Book: ' + vendorName + ': ' + PinkBookRequestCount(updScrollInfo,vendorContainer));
                }
            }
        PinkGumpButton(0);
        Orion.CloseGump('container', bookPouch);
        }
    var scrollNames = ListPiper(updScrollInfo);
    var verifyCheck = false;
	while(PutToVendor(vendorContainer,scrollNames,pos))
        {
        verifyCheck = true;
        Orion.Wait(100);
        }
    if(verifyCheck)
        {
        Orion.Print('Finished putting scrolls on vendor! Verifying prices...');
        Orion.CloseGump('container', vendorContainer);
        Orion.Wait(1300);
        while(!Orion.GumpExists('container',vendorContainer))
            {
            Orion.UseObject(vendorContainer);
            Orion.Wait(1300);
            }
        VerifyPrices(vendorContainer);
        }
    Orion.CloseGump('container', vendorContainer);
    Orion.Wait(1300);
	}

function ListPiper(arr)
    {
    var result = '';
    arr.forEach(function(string)
        {
        result += string[0] + '|';
        })
    return result.slice(0,-1);
    }

function AppendRequestArrayToFile(requestArr)
    {//var requestArr = ["Thievery",0,0,1,3,4,0,1]
    var passArr = JSON.parse(JSON.stringify(requestArr));
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/Pink Info/IndividualSales' + Orion.Date() + '.json';
    var requestArrJSON = JSON.stringify(passArr);
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var fileJson = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        fileJson = JSON.parse(fileString);
    tmpFile.Remove();
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording " + requestArrJSON + ' To File: ' + tmpFilePath);
    fileJson.push(passArr);
    tmpFile.Write(JSON.stringify(fileJson));
    tmpFile.Close();
    }

function DecrementRunningTotals(requestArr)
    {//var requestArr = ["Thievery",0,0,1,3,4,0,1]
    var hook = '1058909586746265733';
    var key = 'KeRvl3b8x6cbI91JQXVc5cLbWxblkHcrIqd2XwQTcC54G-nl0GjLvlGAbCk1gqCushAk';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var passArr = JSON.parse(JSON.stringify(requestArr));
    var groups = ['Misc', 'Combat', 'Trade Skills', 'Magic', 'Wilderness', 'Thievery', 'Bard'];
    var groupName = passArr.shift();
    var group = groups.indexOf(groupName);
    var tmpRunningTotals = Shared.GetArray('runningTotals',[]);
    var discordString = '';
    for(var i=0,j=0;i<tmpRunningTotals.length;i++)
        {
        var skillAmount = tmpRunningTotals[i][5] || 0;
        if(tmpRunningTotals[i][1] == group)
            skillAmount -= passArr[j++];
        if(skillAmount < 0)
            skillAmount = 0;
        if(skillAmount < 50)
            discordString += tmpRunningTotals[i][0] + ': ' + skillAmount + ' remaining\n';
        }
    if(discordString)
        Orion.HttpPost(bot, "content=" + ':\n**' + groupName + ':**\n' + discordString);
    Shared.AddArray('runningTotals', tmpRunningTotals);    
    }

function SalesReport()
    {
    var hook = '949444453188390982';
    var key = 'zBJe--X6khd7MuFOomtx_JFaHUDDIOWXCO4cTK_vJIKa0rdO9MUNgAh6EYF7ZNr8GRTb';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/Pink Info/IndividualSales' + Orion.Date() + '.json';
    var newFilePath = Orion.CurrentScriptDirPath() + '/Pink Info/TotalSalesReport' + Orion.Date() + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var fileString = tmpFile.ReadAll(); 
    tmpFile.Close();
    if(fileString)
        pinkSales = JSON.parse(fileString);
    else
        return Orion.Print('Missing data in file!');
    var miscSales = pinkSales.filter(function(sale){return sale[0] == 'Misc';})
    var combatSales = pinkSales.filter(function(sale){return sale[0] == 'Combat';})
    var tradeSales = pinkSales.filter(function(sale){return sale[0] == 'Trade Skills';})
    var magicSales = pinkSales.filter(function(sale){return sale[0] == 'Magic';})
    var wildernessSales = pinkSales.filter(function(sale){return sale[0] == 'Wilderness';})
    var thieverySales = pinkSales.filter(function(sale){return sale[0] == 'Thievery';})
    var bardSales = pinkSales.filter(function(sale){return sale[0] == 'Bard';})
    var allSales = [miscSales,combatSales,tradeSales,magicSales,wildernessSales,thieverySales,bardSales];
    var filteredSales = allSales.filter(function(sales)
        {
        return sales[0];
        })
    var totalSales = filteredSales.map(function(sales)
        {
        return sales.reduce(function(sum,curr)
            {
            var tmpArr = [];
		    for(var i=0;i<curr.length;i++)
		        {
		        if(typeof curr[i] == 'string')
		            tmpArr[i] = curr[i];
		        else
		            tmpArr[i] = curr[i] + (sum[i] || 0);
		        }
		    return tmpArr;
            },[]);
        });
    var newFile = Orion.NewFile();
    newFile.Open(newFilePath);
    newFile.Write(JSON.stringify(totalSales));
    var groups = ['Misc', 'Combat', 'Trade Skills', 'Magic', 'Wilderness', 'Thievery', 'Bard'];
    var group = groups.indexOf(groupName);
    var outStr = '**Report**:';
    var overallTotal = 0;
    var gumpStr = '';
    for(var i=0;i<totalSales.length;i++) //categories
        {
        var categoryArr = totalSales[i];
        var groupName = categoryArr.shift();
        var group = groups.indexOf(groupName);
        var categoryScrollInfo = scrollinfo.filter(function(skill)
            {
            return skill[1] == group;
            })
        var groupTotal = 0;
        outStr += '\n**' + groupName + '**\n';
        for(var ii=0;ii<categoryScrollInfo.length;ii++) //values
            {
            if(categoryArr[ii] > 0)
                {
                outStr += categoryScrollInfo[ii][0] + ': ' + categoryArr[ii] + '\n';
                groupTotal += categoryArr[ii];
                }
            }
        overallTotal += groupTotal;
        outStr += '                   **Total**: ' + groupTotal + '\n';
        gumpStr += groupName + 'Total: ' + groupTotal + '\n';
        }
    outStr += '**\nOverall Total: ' + overallTotal + '**\nBank of GoodWill Balance: ' + ParsePlayerGold();
    gumpStr += '   Overall Total: ' + overallTotal;
    Shared.AddVar('gumpStr', gumpStr);
    Orion.HttpPost(bot,'content=' + outStr);
    }

function VendorInfoGump()
    {
    var textList = Shared.GetVar('gumpStr', 'Var not found')
    var lines = Orion.Split(textList,'\n');
    var gump = Orion.CreateCustomGump('12420');
    gump.Clear();
    gump.AddResizepic(0, 0, 0xDAC, 175, 155);
    var y = 5;
    var yI = 20;
    for(var i=0;i<lines.length;i++)
            { 
            gump.AddText(5,y += yI,0,lines[i]);
            } 

    gump.Update();
    }
    

function AutoCountStock()
    {
    var startX = 773, startY = 729;
    var vendorSerials = [
        '0x064028DF',
        '0x064026A8',
        '0x064022C9',
        '0x06401FE1',
        '0x06401F29',
        '0x06401F19',
        '0x03E20F6F'
        ]
    var fullScrollInfo = []
    for(var i=0;i<vendorSerials.length;i++)
        {
        while(!Player.Hidden())
            {
            Orion.UseSkill('Hiding');
            Orion.Wait(1000);
            }
        var vendorSerial = vendorSerials[i];
        
        var posX = startX + Math.min(i,4);
        var posY = startY;
        while(Orion.GetDistance(posX,startY) > 0)
            {
            Orion.WalkTo(posX,posY,0,0);
            Orion.Wait(500);
            }
        var categoryInfo = PinkStockCount(vendorSerial)
        for(var ii=0;ii<categoryInfo.length;ii++)
            {
            fullScrollInfo.push(categoryInfo[ii]);
            }
        }
    Shared.AddArray('runningTotals', fullScrollInfo);
    Orion.Wait(1000);
    }


function PinkStockCount(vendorSerial)
    {
    var hook = '1058909586746265733';
    var key = 'KeRvl3b8x6cbI91JQXVc5cLbWxblkHcrIqd2XwQTcC54G-nl0GjLvlGAbCk1gqCushAk';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var vendor = Orion.FindObject(vendorSerial);
    var vendorName = vendor.Name();
    var groups = ['Misc', 'Combat', 'Trade Skills', 'Magic', 'Wilderness', 'Thievery', 'Bard'];
    var group = groups.indexOf(vendorName);
    var updScrollInfo = scrollinfo.filter(function(part)
        {
        return part[1] == group;
        });
    Orion.SetSearchArea(vendor.X(),vendor.Y(), vendor.X(),vendor.Y());
    var restockContainer = Orion.FindType('0x0E75', any, ground, 'item', 2)[0];
    Orion.ResetSearchArea();
    var containerGumps = [];
    while(!Orion.GumpExists('container',restockContainer))
        {
        Orion.UseObject(restockContainer);
        Orion.Wait(1300);
        }
    containerGumps.push(restockContainer);
    var lastItemUse = 0;
    var skillGroupContainers = Orion.FindType('0x0E79|0x0E75',any,restockContainer)
    var fullCategoryInfo = [];
    for(var i=0;i<skillGroupContainers.length;i++)
        {
        var skillGroupContainer = skillGroupContainers[i];
        while(!Orion.GumpExists('container',skillGroupContainer))
            {
            Orion.UseObject(skillGroupContainer);
            Orion.Wait(1300);
            }
        containerGumps.push(skillGroupContainer);
        var books = Orion.FindType('0x577E', '0x0490', skillGroupContainer, 'item', 2)
        if(!books[0])
            return Orion.Print('Book not found! Halting...');
        for(var ii=0;ii<books.length;ii++)
            {
            var book = books[ii];
            for(var iii=0;iii<updScrollInfo.length;iii++)
                {
                var currentSkillName = updScrollInfo[iii][0];
                var skillButton = updScrollInfo[iii][3];
                var skillButton50 = skillButton + '12';
                var backbutton = updScrollInfo[iii][1] + 2;
                while(!Orion.GumpExists('generic',book))
                    {
                    Orion.UseObject(book);
                    Orion.Wait(Math.max(1300 - (Orion.Now() - lastItemUse),100));
                    lastItemUse = Orion.Now();
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000023C5');
                    if(gump !== null)
                        {
                        var gumpButtons = gump.ButtonList();
                        var buttonCheck = gumpButtons.filter(function(button)
                            {
                            return Orion.Contains(button, skillButton);
                            });
                        if(!buttonCheck[0])
                            {
                            //PinkGumpButton('0', 500);
                            continue;
                            }
                        }
                    }  
                PinkGumpButton(skillButton, 200);
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000023C5');
                    if(gump !== null)
                        {
                        var skillCount = gump.Text(12);
                        updScrollInfo[iii][5] = (updScrollInfo[iii][5] || 0) + +skillCount;
                        Orion.Print(currentSkillName + updScrollInfo[iii][5])
                        }
                    }  
                PinkGumpButton(backbutton, 200);
                }
            PinkGumpButton('0', 500);
            }
        }
    var outString = vendorName + '\n';
    var discordString = '';
    for(var i=0;i<updScrollInfo.length;i++)
        {
        var skillName = updScrollInfo[i][0];
        var skillAmount = updScrollInfo[i][5] || 0;
        outString += skillName + ': ' + skillAmount + '\n';
        if(skillAmount < 50)
            discordString += skillName + ': ' + skillAmount + ' remaining\n';
        fullCategoryInfo.push(updScrollInfo[i]);
        }
    if(discordString)
        Orion.HttpPost(bot, "content=" + ':\n**' + vendorName + ':**\n' + discordString);
    TextWindow.Open();
    TextWindow.Print(outString);
    containerGumps.forEach(function(gump)
        {
        while(Orion.GumpExists('container',gump))
            {
            Orion.CloseGump('container',gump);
            Orion.Wait(10);
            }
        });
    return fullCategoryInfo;
    }

function PrintRunningTotals()
    {
    var runningScrollInfo = Shared.GetArray('runningTotals', []);
    TextWindow.Open();
    TextWindow.Print('[');
    runningScrollInfo.forEach(function(scroll)
        {
        TextWindow.Print(JSON.stringify(scroll));
        });
    TextWindow.Print(']');
    }

function MonitorVendorsForSales()
	{
	var vendors = '0x064028DF|0x064026A8|0x064022C9|0x06401FE1|0x06401F29|0x06401F19|0x03E20F6F'
    var hook = '949444453188390982';
	var key = 'zBJe--X6khd7MuFOomtx_JFaHUDDIOWXCO4cTK_vJIKa0rdO9MUNgAh6EYF7ZNr8GRTb';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
	while(true)
		{
		var check = Orion.WaitJournal('',Orion.Now(),0,'mobile',vendors,'0x03B2');
		var vendor = Orion.FindObject(check.Serial());
		if(!Orion.Contains(check.Text() ,'Take a look at|How much of the|I am holding no|Your gold has been transferred|Very well. I will hold'))
            {
		    var paramText = "content=" + vendor.Name() + ': ' + check.Text();
		    Orion.HttpPost(bot, paramText);
            Orion.Wait(10000);
            }
        }
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

function GetAllVendorGoldCall(vendorSerial)
	{
    var gump = false;
    var endTime = Orion.Now() + 5000
    while(!gump && Orion.Now() < endTime)
        {
        Orion.UseObject(vendorSerial);
        Orion.WaitForGump(1000);
	    gump = Orion.GetGump('any','0x000002AB');
        Orion.Wait(100);
        }
	if(gump !== null)
		{
		var gold = Orion.Split(gump.Text(3), ',').join('');
        if(gold == '0')
            {
            CloseAllGumps();
            return;
            }
		gump.Select(Orion.CreateGumpHook(7));
		if(Orion.WaitJournal('How much of the', Orion.Now()-500, Orion.Now() + 3000))
            {
            Orion.Wait(300);
			Orion.SendPrompt(gold);
            }
		}
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
    Orion.Wait(1300);
    CloseAllGumps();
	}

function ParsePlayerGold()
    {
    var safe = Orion.FindType('0x9C18|0x9C19',any,ground,'near|item',5)[0];
    if(!safe)
        return "Auction safe missing, couldn't parse player gold";
    while(!Orion.GumpExists('generic', safe, '0x000F3ED6'))
        {
        Orion.UseObject(safe);
        Orion.Wait(1300);
        }
    var gump = Orion.GetGump(any, '0x000F3ED6');
    var textList = gump.TextList();
    var plat = textList[3].slice(24);
    var gold = textList[2].slice(24);
    Orion.CloseGump('generic',safe, '0x000F3ED6');
    return plat + 'p ' + gold + 'g';
    }

function PinkBookRequestCount(categoryArr,vendorContainer)
	{
	var requestcountarr = categoryArr.map(function(skill)
        {
        var countVendor = Orion.FindTypeEx('0x14EF','0x0490',vendorContainer).filter(function(part){return Orion.Contains(part.Properties(), skill[0])}).length;
        var countBackpack = Orion.FindTypeEx('0x14EF','0x0490',backpack).filter(function(part){return Orion.Contains(part.Properties(), skill[0])}).length;
        var needed = maxcount - countVendor - countBackpack;
        return Math.max(needed,0);
        });
	return requestcountarr;
	}

function UpdateRequestArray(categoryArr,requestArr)
    {
    var newArr = categoryArr.map(function(skill,ind)
        {
        var countBackpack = Orion.FindTypeEx('0x14EF','0x0490',backpack).filter(function(part){return Orion.Contains(part.Properties(), skill[0])}).length;
        return requestArr[ind] - countBackpack;
        })
    return newArr;
    }

function PinkPull(updScrollInfo, requestArr, restockContainer, vendorContainer)
	{
    var containerGumps = [];
	for(var i=0;i<updScrollInfo.length;i++)
		{
        var currentSkillIndex = updScrollInfo[i][2]
        if(requestArr[currentSkillIndex] < 1)
            continue;
        if(currentSkillIndex == 0 || currentSkillIndex == 1 || currentSkillIndex == 2)
            var skillGroupStr = 'Engraved: One';
        else if(currentSkillIndex == 3 || currentSkillIndex == 4 || currentSkillIndex == 5)
            var skillGroupStr = 'Engraved: Two';
        else if(currentSkillIndex == 6 || currentSkillIndex == 7 || currentSkillIndex == 8)
            var skillGroupStr = 'Engraved: Three';
        else if(currentSkillIndex == 9 || currentSkillIndex == 10 || currentSkillIndex == 11)
            var skillGroupStr = 'Engraved: Four';
        while(!Orion.GumpExists('container',restockContainer))
            {
            Orion.UseObject(restockContainer);
            Orion.Wait(1300);
            }
        var skillGroupContainer = Orion.FindTypeEx('0x0E79|0x0E75',any,restockContainer).filter(function(container)
            {
            return Orion.Contains(container.Properties(), skillGroupStr);
            })[0].Serial();
        while(!Orion.GumpExists('container',skillGroupContainer))
            {
            Orion.UseObject(skillGroupContainer);
            Orion.Wait(1300);
            }
        containerGumps.push(skillGroupContainer);
        var booksMap = Orion.FindTypeEx('0x577E', '0x0490', skillGroupContainer, 'item', 2).map(function(book)
            {
            var scrollCount = (book.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0;
            return [book.Serial(),+scrollCount];
            });
        if(!booksMap[0])
            return Orion.Print('Book not found! Halting...');
        var books = booksMap.filter(function(book)
            {
            return book[1] > 0;
            }).sort(function(a,b)
                {
                return a[1] - b[1];
                });
        for(var ii=0;ii<books.length;ii++)
            {
            var book = books[ii][0];
            while(!Orion.GumpExists('generic',book))
                {
                Orion.UseObject(book);
                Orion.Wait(1300); 
                }
            var skillButton = updScrollInfo[i][3];
            var skillButton50 = skillButton + '12';
            var backbutton = updScrollInfo[i][1] + 2;
            PinkGumpButton(skillButton, 200);
            for(var c=0;c<requestArr[i];c++)
                {
                PinkGumpButton(skillButton50);
                }
            PinkGumpButton(backbutton, 500);
            PinkGumpButton('0', 500);
            Orion.Print(requestArr)
            requestArr = PinkBookRequestCount(updScrollInfo,vendorContainer)
            Orion.Print(requestArr)
            if(requestArr[currentSkillIndex] < 1)
                break;
            }
        }
    if(Verify5s(updScrollInfo, requestArr))
        {
        containerGumps.forEach(function(gump)
            {
            while(Orion.GumpExists('container',gump))
                {
                Orion.CloseGump('container',gump);
                Orion.Wait(10);
                }
            });
        Orion.Print('All pinks verified in pack.');
        return true;
        }
    else
        {
        Orion.Print('Some pinks are missing! Either book is out of that skill or lag happened!');
        return false;
        }
    }

function tesdsfasfdats()
    {
    var totalSales = filteredSales.map(function(sales)
        {
        return sales.reduce(function(sum,curr)
            {
            var tmpArr = [];
		    for(var i=0;i<curr.length;i++)
		        {
		        if(typeof curr[i] == 'string')
		            tmpArr[i] = curr[i];
		        else
		            tmpArr[i] = curr[i] + (sum[i] || 0);
		        }
		    return tmpArr;
            },[]);
        });
    }

function PutToVendor(vendorContainer,scrollNames,pos)
	{
    var pinks = Orion.FindTypeEx('0x14EF', '0x0490').filter(function(part)
        {
        return Orion.Contains(part.Properties(),scrollNames);
        }).sort(function(a, b)
        {
        if(a.Properties() < b.Properties())
            return -1;
        if(a.Properties() > b.Properties())
            return 1;
        return 0;
        });
	if(pinks[0])
        {
        var pinkRead = pinks[0].Properties().match(/Skill: ([\w ]+) \d.\d/);
		if(pinkRead[1])
			{
			var pinkSkillString = pinkRead[1];
			var pinkArr = scrollinfo.filter(function(part){return part[0] == pinkSkillString})[0];
            var price = pinkArr[4];
            var xpos = pos[ pinkArr[2] ][0];
            var ypos = pos[ pinkArr[2] ][1];
            var gridPos = pinkArr[2] * maxcount;
            Orion.WaitPrompt(price);
			Orion.Wait(600);
			Orion.MoveItem(pinks[0].Serial(), 0, vendorContainer, xpos, ypos, -1, gridPos);
            Orion.Wait(600);	
			Orion.CancelWaitPrompt();
			Orion.Wait(600);
            if(Orion.PromptExists())
                Orion.SendPrompt(' ');
            return true;
			}
        }
    else
        return false;
	}

function Verify5s(updScrollInfo, requestArr)
    {
    for(var v=0;v<updScrollInfo.length;v++)
        {
        var verify = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part)
            {
            return Orion.Contains(part.Properties(), updScrollInfo[v][0]);
            });
        if(verify.length < requestArr[v])
            return false;
        }
    return true;
    }

function VerifyPrices(vendorContainer)
    {
    var verify = Orion.FindTypeEx('0x14EF','0x0490',vendorContainer);
    for(var v=0;v<verify.length;v++)
        {
        var pinkRead = verify[v].Properties().match(/Skill: ([\w ]+) \d.\d/);
        if(pinkRead[1])
            {
            var pinkSkillString = pinkRead[1];
            var pinkArr = scrollinfo.filter(function(part){return part[0] == pinkSkillString})[0];
            var pinkPriceRaw = verify[v].Properties().match(/Price: ([\d,]+)/);
            if(pinkPriceRaw[1])
                {
                var pinkPrice = Orion.Split(pinkPriceRaw[1], ',').join('');
                if(Number(pinkPrice) != pinkArr[4])
                    {
                    Orion.Print('Moving incorrectly priced scroll to backpack: ' + pinkSkillString);
                    Orion.MoveItem(verify[v].Serial());
                    Orion.Wait(1300);
                    }
                }
            }
        }
    }

function CompetitorCheck()
	{
    var hook = '949444453188390982';
    var key = 'zBJe--X6khd7MuFOomtx_JFaHUDDIOWXCO4cTK_vJIKa0rdO9MUNgAh6EYF7ZNr8GRTb';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    Orion.SetSearchArea(3713,2187,3726,2187)
    var vendorA = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(),'Misc');
        })[0];
    var vendorB = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Combat');})[0];
    var vendorC = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Trade Skills');})[0];
    var vendorD = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Magic');})[0];
    var vendorE = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Wilderness');})[0];
    var vendorF = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Thievery');})[0];
    var vendorG = Orion.FindTypeEx(any,any,ground,'live',20,'yellow').filter(function(vendor){return Orion.Contains(vendor.Properties(),'Bard');})[0];
    Orion.ResetSearchArea();
    var vendors = [vendorA,vendorB,vendorC,vendorD,vendorE,vendorF,vendorG]
	while(true)
		{
        var pinks = [];
        for(var i=0;i<vendors.length;i++)
            {
            var vendor = vendors[i];
            var pinkList = PriceDifMonitor(vendor.Serial()).sort(function(a1,b1)
                {
                var a = a1.Properties().match(/Skill:\s([\w ]+)/)[1];
                var b = b1.Properties().match(/Skill:\s([\w ]+)/)[1];
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
                })
            pinkList.forEach(function(list){pinks.push(list)})
            }
        var arr = [];
        var stockChangeAlert = false;
        if(storedPinks)
            {
            for(var i=0;i<storedPinks.length;i++)
                {
                var check = pinks.filter(function(pink)
                    {
                    return storedPinks[i] == pink.Serial();
                    })[0];
                if(!check)
                    {
                    stockChangeAlert = true;
                    break;
                    }
                }
            }
        var storedPinks = [];
        for(var i=0;i<pinks.length;i++)
            {
            var pink = pinks[i];
            storedPinks.push(pink.Serial());
            var pinkRead = pink.Properties().match(/Skill: ([\w ]+) \d.\d/);
            if(pinkRead[1])
                {
                var pinkSkill = pinkRead[1];
                var pinkArr = scrollinfo.filter(function(part)
                    {
                    return part[0] == pinkSkill;
                    })[0];
                }
            var pinkPriceRaw = pink.Properties().match(/Price: ([\d,]+)/);
            if(pinkPriceRaw[1])
                {
                var pinkPrice = Orion.Split(pinkPriceRaw[1], ',').join('');
                if(Number(pinkPrice) <= pinkArr[4])
                    {
                    var pinkResult = 'Skill: ' + pinkSkill + ': Their Price: ' + pinkPriceRaw[1] + ': Our Price: ' + pinkArr[4] + ': Adj Price: ' + (+pinkPrice -1)
                    arr.push(pinkResult);
                    }
                }	   
            }
        var tempArr = uniq(arr);
		if(tempArr.length)
			{
			TextWindow.Open();
			TextWindow.Clear();
			TextWindow.Print('---------------');
			tempArr.forEach(function(print){TextWindow.Print(print)});
			}
        if(stockChangeAlert)
            Orion.HttpPost(bot,'content=' + 'New Mag Fel Stock changed');
        Orion.Wait(5000)
		}
	}

function PriceDifMonitor(vendorSerial)
	{
	var arr = [];
	var vendorContainer = Orion.ObjAtLayer('Backpack', vendorSerial).Serial();
	while(!Orion.GumpExists('container',vendorContainer))
		{
		Orion.UseObject(vendorSerial)
		Orion.Wait(2000);
		}
	var subContainers = Orion.FindTypeEx(any,any,lastcontainer).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'Contents:');
		});
	for(var i=0;i<subContainers.length;i++)
		{
		var cont = subContainers[i].Serial();
		while(!Orion.GumpExists('container', cont))
			{
			Orion.UseObject(cont);
			Orion.Wait(1300);
			}
		}
	var pinks = Orion.FindTypeEx('0x14EF','0x0490', vendorContainer,'item',0,'',true);
    return pinks;
	for(var i=0;i<pinks.length;i++)
		{
		var pink = pinks[i];
		var pinkRead = pink.Properties().match(/Skill: ([\w ]+) \d.\d/);
		if(pinkRead[1])
			{
			var pinkSkill = pinkRead[1];
			var pinkArr = scrollinfo.filter(function(part)
                {
                return part[0] == pinkSkill;
                })[0];
            }
		var pinkPriceRaw = pink.Properties().match(/Price: ([\d,]+)/);
      	if(pinkPriceRaw[1])
			{
			var pinkPrice = Orion.Split(pinkPriceRaw[1], ',').join('');
			if(Number(pinkPrice) <= pinkArr[4])
				{
				var pinkResult = 'Skill: ' + pinkSkill + ': Their Price: ' + pinkPriceRaw[1] + ': Our Price: ' + pinkArr[4] + ': Adj Price: ' + (+pinkPrice -1)
				arr.push(pinkResult);
				}
			}	   
		}
	return uniq(arr);
	}

function uniq(arr)
    {
    var seen = {};
    return arr.filter(function(item)
        {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

function PinkGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000023C5');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(ms);
            }
        }   
    }

function VendorGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('last');
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000002AB'))
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(ms);
            }
        }   
    }

//--------------------------------------------------------------------------End Vendor Script
//--#Combiner
//--------------------------------------------------------------------------Begin Combiner Script
function RepeatCombo(_)
	{
    Orion.ClearJournal('This scroll does not match the type currently being bound.');
	while(DoCombo())
		{
		Orion.Wait(100);
        if(Orion.InJournal('This scroll does not match the type currently being bound.'))
            {
            Orion.ClearJournal('This scroll does not match the type currently being bound.');
            TextWindow.Open();
            TextWindow.Print('Mismatched scroll binder in pack! Halting...')
            break;
            }
        }
    Orion.PlayWav('Alarm.wav');
    Orion.Print('All done!')
	}

function ComboCategories(_)
	{
    Orion.ClearJournal('This scroll does not match the type currently being bound.');
    Orion.CharPrint(self,1159,'Target container with uncombined books');
    Orion.WaitForAddObject('myTarget');
    var uncombinedParentContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target container with combined books');
    Orion.WaitForAddObject('myTarget');
    var combinedParentContainer = Orion.GetSerial('myTarget');
	while(true)
        {
        var currentSkillIndex = false;
        VerifyOpenContainer(uncombinedParentContainer);
        for(var i = 0;i<scrollinfo.length;i++)
            {
            var uncombinedContainerObj = Orion.FindTypeEx('0x0E79',any,uncombinedParentContainer).filter(function(container)
                {
                return Orion.Contains(container.Properties(), scrollinfo[i][0]);
                })[0];
            if(uncombinedContainerObj && !Orion.Contains(uncombinedContainerObj.Properties(), 'Contents: 0/125'))
                {
                currentSkillIndex = scrollinfo[i][2];
                break;
                }
            }
        if(currentSkillIndex === false)
            {
            Orion.PlayWav('Alarm.wav');
            return Orion.CharPrint(self,1159,'Out of uncombined books! Halting...');
            }
        var uncombinedContainer = uncombinedContainerObj.Serial();
        VerifyOpenContainer(uncombinedParentContainer);
        VerifyOpenContainer(uncombinedContainer);
        var fullBooks = Orion.FindType('0x577E',any,uncombinedContainer);
        while(!Orion.FindType('0x577E')[0])
            {
            if(!fullBooks[0])
                {
                Orion.PlayWav('Alarm.wav');
                return Orion.CharPrint(self,1159,'Something went wrong! Out of full books! Halting...');
                }
            Orion.MoveItem(fullBooks[0]);
            Orion.Wait(1300);
            }
        while(DoCombo())
            {
            Orion.Wait(100);
            if(Orion.InJournal('This scroll does not match the type currently being bound.'))
                {
                Orion.ClearJournal('This scroll does not match the type currently being bound.');
                TextWindow.Open();
                TextWindow.Print('Mismatched scroll binder in pack! Halting...');
                Orion.PlayWav('Alarm.wav');
                return;
                }
            }
        Orion.Wait(1300);
        ResetPinkBook();
        VerifyOpenContainer(combinedParentContainer);
        if(currentSkillIndex == 0 || currentSkillIndex == 1 || currentSkillIndex == 2)
            var combinedPouchString = 'Engraved: One';
        else if(currentSkillIndex == 3 || currentSkillIndex == 4 || currentSkillIndex == 5)
            var combinedPouchString = 'Engraved: Two';
        else if(currentSkillIndex == 6 || currentSkillIndex == 7 || currentSkillIndex == 8)
            var combinedPouchString = 'Engraved: Three';
        else if(currentSkillIndex == 9 || currentSkillIndex == 10 || currentSkillIndex == 11)
            var combinedPouchString = 'Engraved: Four';
        var combinedContainer = Orion.FindTypeEx('0x0E79',any,combinedParentContainer).filter(function(container)
            {
            return Orion.Contains(container.Properties(), combinedPouchString);
            })[0].Serial();
        VerifyOpenContainer(combinedContainer);
        var combinedBooks = Orion.FindTypeEx('0x577E',any,combinedContainer).sort(function(a,b)
            {
            var scrollNumA = +((a.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0);
            var scrollNumB = +((b.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0);
            return scrollNumB - scrollNumA;
            }).map(function(book)
                {
                return book.Serial();
                });
        var maxScrolls = Orion.FindTypeEx('0x14EF','0x0490').filter(function(scroll)
            {
            return Orion.Contains(scroll.Properties(), '5.0 Skill');
            })[0];
        while(maxScrolls)
            {
            if(!combinedBooks[0])
                {
                Orion.PlayWav('Alarm.wav');
                return Orion.CharPrint(self,1159,'Out of combined books! Halting...');
                }
            var startScan = Orion.Now();
            Orion.MoveItem(maxScrolls.Serial(),0,combinedBooks[0]);
            Orion.Wait(1300);
            if(Orion.InJournal('This book can only hold up to 99 of each scroll.|This book is full.', 'sys', any, any, startScan))
                combinedBooks.shift();
            maxScrolls = Orion.FindTypeEx('0x14EF','0x0490').filter(function(scroll)
                {
                return Orion.Contains(scroll.Properties(), '5.0 Skill');
                })[0];
            }
        var pinkBook = Orion.FindTypeEx('0x577E')[0]
        while(pinkBook)
            {
            if(fullBooks[1])
                {
                while(!Orion.Contains(pinkBook.Properties(), 'Scrolls In Book: 0/300'))
                    {
                    Orion.Wait(1300);
                    EmptyPinkBook();
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(pinkBook.Serial(), any, uncombinedParentContainer);
                Orion.Wait(1300);
                }
            else
                {
                var lastPinkBook = pinkBook.Serial();
                Orion.MoveItem(lastPinkBook, any, combinedParentContainer);
                Orion.Wait(1300);
                }
            pinkBook = Orion.FindTypeEx('0x577E')[0]   
            }
        if(!fullBooks[1])
            {
            var lowScroll = Orion.FindType('0x14EF','0x0490')[0];
            while(lowScroll)
                {
                Orion.MoveItem(lowScroll,0,lastPinkBook);
                Orion.Wait(1300);
                lowScroll = Orion.FindType('0x14EF','0x0490')[0];
                }
            Orion.CloseGump('container', uncombinedContainer);
            }
        }
    Orion.PlayWav('Alarm.wav'); //never reach
    Orion.Print('All done!')
	}

function RepeatFivesCombo(_)
	{
    Orion.ClearJournal('This scroll does not match the type currently being bound.');
	while(DoFivesCombo())
		{
		Orion.Wait(100);
        if(Orion.InJournal('This scroll does not match the type currently being bound.'))
            {
            Orion.ClearJournal('This scroll does not match the type currently being bound.');
            TextWindow.Open();
            TextWindow.Print('Mismatched scroll binder in pack! Halting...')
            break;
            }
        }
    Orion.PlayWav('Alarm.wav');
    Orion.Print('All done!')
	}

function initCombination()
    {
    TextWindow.Open();
    TextWindow.Clear();
    var candidates = [4,5,6,7,8,9,10];
    var target = 49;
    var ans = [];
    var currComb = [];
    combination(candidates, target, currComb, 0, 0, ans);
    Orion.Print('Number of possible combinations: ' + ans.length);
    TextWindow.Print('[');
    ans.forEach(function(answer)
    	{
    	TextWindow.Print(JSON.stringify(answer));
    	});
    TextWindow.Print(']');
    }

function CombinationCall(candidates,target)
    {
    var ans = [];
    var currComb = [];
    combination(candidates, target, currComb, 0, 0, ans);
    return ans;
    }

function combination(candidates, target, currComb, currSum, currIndex, ans)
    {
    var currCombClone = ArrayClone(currComb);
    if(currSum > target) return; //backtrack
    if(currSum == target)
        {
        ans.unshift(ArrayFormat(currCombClone)); //store the solution and backtrack
        return;
        }
    for(var i=currIndex;i<candidates.length;i++)
        { //try all possible options for the next level
        currCombClone.push(candidates[i]); //put 1 option into the combination
        currSum+=candidates[i];
        combination(candidates, target, currCombClone, currSum, i, ans); //try with this combination, whether it gives a solution or not.
        currCombClone.pop(); //when this option backtrack to here, remove this and go on to the next option.
        currSum-=candidates[i];
        }
    }

function ArrayClone(arr)
	{
	var clone = [];
	for(var i=0;i<arr.length;i++)
		clone[i] = arr[i];
	return clone;
	}

function ArrayFormat(arr)
    {
    var emptyArr = [0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<arr.length;i++)
        {
        emptyArr[arr[i] - 1]++
        }
    return emptyArr;
    }

function DoCombo()
    {
    var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:');
        });
    if(binder.length < 6)
        {
        if(!MoveAllBinders())
            return Orion.Print('Need at least 6 blank scrollbinders in pack! Halting...');
        binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Transcendence:');
            });
        if(binder.length < 6)
            return Orion.Print('Need at least 6 blank scrollbinders in pack! Halting...');
        }
    if(!OpenBook())
        return Orion.Print('Book empty! Halting...');
    if(CheckInBook([0,0,0,0,0,0,0,0,0,0,2]))
        { 
        Orion.PrintFast(self, 1159, 0, 'Checking 2.0 combos');
        if(PrepCombo([2,1,0],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([2,1,0],            [0,0,0,1,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,2,0],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([0,2,0],            [0,0,0,1,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([2,0,1],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([2,0,1],            [0,0,0,1,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,1,1],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([0,1,1],            [0,0,0,1,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,2],            [0,0,0,0,0,0,0,1,0,0,2]))
            return true;
        if(PrepCombo([0,0,2],            [0,0,0,2,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,1,1],          [0,0,0,0,0,0,0,1,0,0,2]))
            return true;
        if(PrepCombo([0,0,1,1],          [0,0,0,2,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,2],          [0,0,0,0,0,0,1,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,1,1],        [0,0,0,0,0,0,1,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,2],        [0,0,0,0,0,1,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,1,1],      [0,0,0,0,0,1,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,2],      [0,0,0,0,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,1,1],    [0,0,0,0,1,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,2],    [0,0,0,1,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,1,1],  [0,0,0,1,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,0,2],  [0,0,1,0,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,0,1,1],[0,0,1,0,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,0,0,2],[0,1,0,0,0,0,0,0,0,0,2]))
            return true;
        if(PrepCombo([0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,2]))
            return true;
        Orion.Print('No 2.0 combos, moving on...');
        }
    Orion.PrintFast(self, 1159, 0, 'Checking 4.9 combos');
    if(CheckInBook([2,1,0]))
        for(var i=0;i<Shared.GetArray('combo49').length;i++)
            if(PrepCombo([2,1,0], Shared.GetArray('combo49')[i])) return true;
    if(CheckInBook([0,2,0]))
        for(var i=0;i<Shared.GetArray('combo49').length;i++)
            if(PrepCombo([0,2,0], Shared.GetArray('combo49')[i])) return true;
    if(CheckInBook([2,0,1]))
        for(var i=0;i<Shared.GetArray('combo49').length;i++)
            if(PrepCombo([2,0,1], Shared.GetArray('combo49')[i])) return true;
    if(CheckInBook([0,1,1]))
        for(var i=0;i<Shared.GetArray('combo49').length;i++)
            if(PrepCombo([0,1,1], Shared.GetArray('combo49')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.8 combos');
    if(CheckInBook([0,0,2]))
        for(var i=0;i<Shared.GetArray('combo48').length;i++)
            if(PrepCombo([0,0,2], Shared.GetArray('combo48')[i])) return true;
    if(CheckInBook([0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo48').length;i++)
            if(PrepCombo([0,0,1,1], Shared.GetArray('combo48')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.7 combos');
    if(CheckInBook([0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo47').length;i++)
            if(PrepCombo([0,0,0,2], Shared.GetArray('combo47')[i])) return true;
    if(CheckInBook([0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo47').length;i++)
            if(PrepCombo([0,0,0,1,1], Shared.GetArray('combo47')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.6 combos');
    if(CheckInBook([0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo46').length;i++)
            if(PrepCombo([0,0,0,0,2], Shared.GetArray('combo46')[i])) return true;
    if(CheckInBook([0,0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo46').length;i++)
            if(PrepCombo([0,0,0,0,1,1], Shared.GetArray('combo46')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.5 combos');
    if(CheckInBook([0,0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo45').length;i++)
            if(PrepCombo([0,0,0,0,0,2], Shared.GetArray('combo45')[i])) return true;
    if(CheckInBook([0,0,0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo45').length;i++)
            if(PrepCombo([0,0,0,0,0,1,1], Shared.GetArray('combo45')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.4 combos');
    if(CheckInBook([0,0,0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo44').length;i++)
            if(PrepCombo([0,0,0,0,0,0,2], Shared.GetArray('combo44')[i])) return true;
    if(CheckInBook([0,0,0,0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo44').length;i++)
            if(PrepCombo([0,0,0,0,0,0,1,1], Shared.GetArray('combo44')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.3 combos');
    if(CheckInBook([0,0,0,0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo43').length;i++)
            if(PrepCombo([0,0,0,0,0,0,0,2], Shared.GetArray('combo43')[i])) return true;
    if(CheckInBook([0,0,0,0,0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo43').length;i++)
            if(PrepCombo([0,0,0,0,0,0,0,1,1], Shared.GetArray('combo43')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.2 combos');
    if(CheckInBook([0,0,0,0,0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo42').length;i++)
            if(PrepCombo([0,0,0,0,0,0,0,0,2], Shared.GetArray('combo42')[i])) return true;
    if(CheckInBook([0,0,0,0,0,0,0,0,1,1]))
        for(var i=0;i<Shared.GetArray('combo42').length;i++)
            if(PrepCombo([0,0,0,0,0,0,0,0,1,1], Shared.GetArray('combo42')[i])) return true;
    Orion.PrintFast(self, 1159, 0, 'Checking 4.1 combos');
    if(CheckInBook([0,0,0,0,0,0,0,0,0,2]))
        for(var i=0;i<Shared.GetArray('combo41').length;i++)
            if(PrepCombo([0,0,0,0,0,0,0,0,0,2], Shared.GetArray('combo41')[i])) return true;
    Orion.Print('All out of combos! Halting...')
    return false;
    }

function DoFivesCombo()
    {
    var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:');
        });
    if(binder.length < 2)
        {
        Orion.Print('Need at least 2 blank scrollbinders in pack! Halting...');
        return false;
        }
    if(!OpenBook())
        return Orion.Print('Book empty! Halting...');
    if(PrepCombo([0,0,0,0,2], [0,0,0,0,0,1,0,0,0,0,2]))
        return true;
    else if(PrepCombo([0,0,0,0,0,2], [0,0,0,0,1,0,0,0,0,0,2]))
        return true;
    else if(PrepCombo([0,0,0,0,1,1], [0,0,0,0,0,1,0,0,0,0,2]))
        return true;
    else if(CheckInBook([0,0,0,0,10,1,0,0,0,0,0]))
        {
        Orion.CharPrint(self,1159, 'High: ' + [0,0,0,0,8,1,0,0,0,0,0] + '\n' + 'Low: ' + [0,0,0,0,2]);
        while(!VerifyPinks([0,0,0,0,10,1,0,0,0,0,0]))
            {
            Orion.Print('Retrieving Pinks...')
            PullFromBook(FindNeededPinks([0,0,0,0,10,1,0,0,0,0,0]))
            Orion.Wait(1500);
            }
        Orion.Print('Pinks Verified!')
        var fivePink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.5')});
        var sixPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.6')});
        var rawPink = fivePink.shift();
        VerifyCombination(binder[0], fivePink.shift());
        VerifyCombination(binder[1], sixPink[0]);
        for(var i=0;i<8;i++)
            {
            VerifyCombination(binder[1],fivePink[i]);
            }
        Trick(binder[1],binder[0],rawPink);
        return true;
        }
    else if(PrepCombo([0,0,0,0,0,2], [0,0,0,0,0,1,0,0,0,0,2]))
        return true;
    Orion.Print('All out of combos! Halting...')
    return false;
    }

function testPrepCombo()
    {
    PrepCombo([0,0,0,0,0,2], [0,0,0,0,9,0,0,0,0,0,0]);
    }

function PrepCombo(lowComboArr, highComboArr)
    {
    var fullComboArr = ArrCombiner(lowComboArr,highComboArr)
    if(CheckInBook(fullComboArr))
        {
        var lowComboArrClone = ArrayClone(lowComboArr);
        var highComboArrClone = ArrayClone(highComboArr);
        Orion.CharPrint(self,1159, 'High: ' + highComboArrClone + '\n' + 'Low: ' + lowComboArrClone);
        var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Transcendence:');
            });
        while(!VerifyPinks(fullComboArr))
            {
            Orion.Print('Retrieving Pinks...')
            PullFromBook(FindNeededPinks(fullComboArr))
            Orion.Wait(1500);
            }
        Orion.Print('Pinks Verified!')
        var pink =
            [
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.1')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.2')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.3')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.4')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.5')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.6')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.7')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.8')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.9')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '1.0')}),
            Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')})
            ]
        var rawPink = null;
        for(var i=lowComboArrClone.length - 1;i>-1;i--)
            {
            if(lowComboArrClone[i] > 0)
                {
                rawPink = pink[i].shift();
                lowComboArrClone[i]--;
                break;
                }
            }
        for(var i=0,targetPink=null;i<lowComboArrClone.length;i++)
            {
            if(targetPink != null)
                {
                VerifyCombination(binder[0],targetPink);
                targetPink = null;
                i = -1;
                continue;
                }
            if(lowComboArrClone[i] > 0)
                {
                targetPink = pink[i].shift();
                lowComboArrClone[i]--;
                i = -1;
                continue;
                }
            }
        for(var i=0,targetPink=null;i<highComboArrClone.length;i++)
            {
            if(targetPink != null)
                {
                VerifyCombination(binder[1],targetPink);
                targetPink = null;
                i = -1;
                continue;
                }
            if(highComboArrClone[i] > 0)
                {
                targetPink = pink[i].shift();
                var valueCheck = SumValues(binder[1],targetPink)
                //Orion.Print('valueCheck = ' + valueCheck)
                if(valueCheck == '2.0')
                    {
                    var oldPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                    VerifyCombination(binder[1],targetPink);
                    var newPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                    while(newPink.length <= oldPink.length)
                        {
                        Orion.Wait(1000);
                        newPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                        }
                    pink[10].push(newPink.pop());
                    highComboArrClone[10]++;
                    targetPink = null;
                    binder[1] = binder.pop();
                    highComboArrClone[i]--;
                    i = -1;
                    continue;
                    }
                highComboArrClone[i]--;
                i = -1;
                continue;
                }
            }
        if(rawPink)
            Trick(binder[1],binder[0],rawPink);
        return true;
        }
    return false
    }

function ArrCombiner(arr1,arr2)
	{ //arr2.length must be >= arr1.length
	var arr1Clone = ArrayClone(arr1);
	var arr2Clone = ArrayClone(arr2);
	for(var i=0;i<arr2Clone.length;i++)
		{
		if(!arr1Clone[i])
		    continue;
		arr2Clone[i] += arr1Clone[i];
		}
	return arr2Clone;
	}

function OpenBook(_)
    {
    var book = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300')
        }); 
    if(book[0])
		{
		Orion.UseObject(book[0].Serial());
        Orion.Wait(500);
		if(Orion.WaitForGump(3000))
			{
			var gump = Orion.GetGump('last');
			if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000023C5'))
				{
				updScrollInfo = scrollinfo.filter(function(part)
                    {
                    return Orion.Contains(gump.ButtonList(), part[3])
                    });
                gump.Select(Orion.CreateGumpHook(updScrollInfo[0][3]));
                Orion.Wait(500);
                }
			}
		Orion.Wait(1500);
        return true;
        }
    return false;
    }

function ResetPinkBook(_)
    {
    PinkGumpButton(3,500);
    PinkGumpButton(1,500);
    PinkGumpButton(0,500);
    }

function FindNeededPinks(requestArr)
    {
    var valueArr = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','2.0'];
    var neededArr = requestArr.map(function(part,ind)
        {
        var pinks = Orion.FindTypeEx('0x14EF','0x0490').filter(function(pink)
            {
		    return Orion.Contains(pink.Properties(), valueArr[ind]);
            });
        return part - pinks.length;
        });
    return neededArr;
    }

function CheckInBook(requestArr)
    {
    var updRequestArr = FindNeededPinks(requestArr);
    var gump = Orion.GetGump(any, '0x000023C5');
    var text = gump.TextList();
    for(var n=0;n<updRequestArr.length;n++)
        {
        if(+text[n] - updRequestArr[n] < 0)
            return false 
        }
    return true
    }

function PullFromBook(arr)
    {
    //[.1,.2,.3,.4,.5,.6,.7,.8,.9,1.0,2.0] 
    if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump('last');
		if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000023C5'))
			{
			updScrollInfo = scrollinfo.filter(function(part)
						{
						return Orion.Contains(gump.ButtonList(), part[3])
						});
            gump.Select(Orion.CreateGumpHook(updScrollInfo[0][3]));
            Orion.Wait(500);
        	}        
        for(var i=0;i<arr.length;i++)
            {
            for(var ii=0;ii<arr[i];ii++)
                {
                PinkGumpButton(updScrollInfo[0][3] + ('0' + i).slice(-2));
                }
            }
        PinkGumpButton(updScrollInfo[0][1] + 2); //go back from skill
        }
    }

function VerifyPinks(arr)
    {
    var valueArr = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','2.0'];
    for(var v=0;v<arr.length;v++)
        {
        var verify = Orion.FindTypeEx('0x14EF','0x0490').filter(function(pink)
            {
            return Orion.Contains(pink.Properties(), valueArr[v]);
            });
        if(verify.length < arr[v])
            return false;
        }
    return true;
    }

function VerifyCombination(binder,pink)
    {
    var sumString = SumValues(binder,pink);
    Orion.UseObject(binder.Serial());
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(pink.Serial());
    Orion.Wait(1100);
    if(!Orion.Contains(binder.Properties(), sumString))
        {
        Orion.MoveItem(binder.Serial());
        Orion.Wait(1100);
        if(!Orion.Contains(binder.Properties(), sumString))
            return VerifyCombination(binder,pink);
        }
    }

function SumValues(binder,pink)
    {
    var binderProps = binder.Properties();
    var pinkProps = pink.Properties();
    var binderValue = +(binderProps.match(/[a-zA-Z ]+Transcendence: ([\d.]+)/) || [])[1];
    if(!binderValue)
		binderValue = 0;
    var pinkValue = +(pinkProps.match(/Skill: [a-zA-Z ]+([\d.]+)/) || [])[1];
    var sumValue = binderValue + pinkValue;
    var sumString = String(sumValue.toFixed(1));
    return sumString
    }

function Trick(highBinder, lowBinder, lowPink)
    {
    Orion.UseObject(highBinder.Serial());
    if(Orion.WaitForTarget(3000))
        Orion.TargetObject(lowPink.Serial());
    else
        {
        Orion.UseObject(highBinder.Serial());
        if(Orion.WaitForTarget(3000))
            Orion.TargetObject(lowPink.Serial());
        }
    Orion.Wait(1500);
    if(!Orion.GumpExists('generic', any, '0x0000237A'))
        {
        TextWindow.Open();
        TextWindow.Print(Player.Name() + ': Trick Failed! Halting...');
        Orion.PauseScript('all');
        }
    Orion.UseObject(lowBinder.Serial());
    if(Orion.WaitForTarget(3000))
        Orion.TargetObject(highBinder.Serial());
    else
        {
        Orion.UseObject(lowBinder.Serial());
        if(Orion.WaitForTarget(3000))
            Orion.TargetObject(highBinder.Serial());
        }
    Orion.Wait(1500);
    var gump = Orion.GetGump(any, '0x0000237A');
    if(gump)
        gump.Select(Orion.CreateGumpHook(1));
    Orion.Wait(500);
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    }

//Manual Combine
function Comb1sto2(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    PrepCombo([], [2]);
	}

function Comb2to2(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,1]))
        {
        var pink2 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.2')});
        VerifyCombination(binder[0],pink2[0],'0.2');
        return true
        }
    return false
	}

function Comb3to3(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,1]))
        {
        var pink3 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.3')});
        VerifyCombination(binder[0],pink3[0],'0.3');
        return true
        }
    return false
	}

function Comb9to9(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,0,0,0,0,0,0,1]))
        {
        var pink9 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.9')});
        VerifyCombination(binder[0],pink9[0],'0.9');
        return true
        }
    return false
	}

function Comb4and5to9(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,0,1,1]))
        {
        var pink4 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.4')});
        var pink5 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.5')});
        VerifyCombination(binder[0],pink4[0],'0.4');
        VerifyCombination(binder[0],pink5[0],'0.9');
        return true
        }
    return false
	}

function Comb20sandbound9to49(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part){return Orion.Contains(part.Properties(), '0.9')});
    if(binder.length < 1)
        {
        Orion.Print('Need 1 0.9 scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,0,0,0,0,0,0,0,0,2]))
        {
        var pink20 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
        VerifyCombination(binder[0],pink20[0],'2.9');
        VerifyCombination(binder[0],pink20[1],'4.9');
        return true
        }
    return false
	}
    

function Comb49(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,0,1,1,1,1,1,1,1]))
        {
        var pink4 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.4')});
        var pink5 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.5')});
        var pink6 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.6')});
        var pink7 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.7')});
        var pink8 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.8')});
        var pink9 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.9')});
        var pink10 = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '1.0')});
        VerifyCombination(binder[0],pink4[0],'0.4');
        VerifyCombination(binder[0],pink5[0],'0.9');
        VerifyCombination(binder[0],pink6[0],'1.5');
        VerifyCombination(binder[0],pink7[0],'2.2');
        VerifyCombination(binder[0],pink8[0],'3.0');
        VerifyCombination(binder[0],pink9[0],'3.9');
        VerifyCombination(binder[0],pink10[0],'4.9');
        return true
        }
    return false
	}    

function Comb7sto49(_)
	{
	var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:')  
        });
    if(binder.length < 1)
        {
        Orion.Print('Need 1 blank scrollbinder in pack! Halting...')
        return false
        }
    //OpenBook();
    if(PrepCombo([0,0,0,0,0,0,7]))
        {
        var pink7s = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.7')});
        VerifyCombination(binder[0],pink7s[0],'0.7');
        VerifyCombination(binder[0],pink7s[1],'1.4');
        VerifyCombination(binder[0],pink7s[2],'2.1');
        VerifyCombination(binder[0],pink7s[3],'2.8');
        VerifyCombination(binder[0],pink7s[4],'3.5');
        VerifyCombination(binder[0],pink7s[5],'4.2');
        VerifyCombination(binder[0],pink7s[6],'4.9');
        return true
        }
    return false
	}    

function CountInPack(_)
    {
    var binders = Orion.FindTypeEx('0x14EF','0x0664')
    var pinks = Orion.FindTypeEx('0x14EF','0x0490')
    var binder49 = binders.filter(function(part){return Orion.Contains(part.Properties(), '4.9')});
    var binder2 = binders.filter(function(part){return Orion.Contains(part.Properties(), '0.2')});
    var binder3 = binders.filter(function(part){return Orion.Contains(part.Properties(), '0.3')});
    var binder9 = binders.filter(function(part){return Orion.Contains(part.Properties(), '0.9')});
    var pink2 = pinks.filter(function(part){return Orion.Contains(part.Properties(), '0.2')});
    var pink3 = pinks.filter(function(part){return Orion.Contains(part.Properties(), '0.3')});
    var pink20 = pinks.filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
    var pink50 = pinks.filter(function(part){return Orion.Contains(part.Properties(), '5.0')});
    if(binder49.length)
        Orion.Print('# of 4.9 binders: ' + binder49.length)
    if(binder2.length)
        Orion.Print('# of 0.2 binders: ' + binder2.length)
    if(binder3.length)
        Orion.Print('# of 0.3 binders: ' + binder3.length)
    if(binder9.length)
        Orion.Print('# of 0.9 binders: ' + binder9.length)
    if(pink2.length)
        Orion.Print('# of 0.2 pinks: ' + pink2.length)
    if(pink3.length)
        Orion.Print('# of 0.3 pinks: ' + pink3.length)
    if(pink20.length)
        Orion.Print('# of 2.0 pinks: ' + pink20.length)
    if(pink50.length)
        Orion.Print('# of 5.0 pinks: ' + pink50.length)
    }

function MoveAllScrollsInPack(_)
	{
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var container = Orion.GetSerial('myTarget');
    var scrolls = Orion.FindType('0x14EF','0x0490')[0];
    while(scrolls)
        {
        Orion.MoveItem(scrolls,0,container);
        Orion.Wait(1200);
        scrolls = Orion.FindType('0x14EF','0x0490')[0];
        }
	}

function MoveAll5sInPack(_)
	{
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var container = Orion.GetSerial('myTarget');
    var scrolls = Orion.FindTypeEx('0x14EF','0x0490').filter(function(scroll)
        {
        return Orion.Contains(scroll.Properties(), '5.0 Skill');
        })[0];
    while(scrolls)
        {
        Orion.MoveItem(scrolls.Serial(),0,container);
        Orion.Wait(1200);
        scrolls = Orion.FindTypeEx('0x14EF','0x0490').filter(function(scroll)
            {
            return Orion.Contains(scroll.Properties(), '5.0 Skill');
            })[0];
        }
	}

function MoveAllBinders(_)
	{
    var modeToggle = true;
    var backpackSerial = Orion.GetSerial(backpack);
    if(Player.WarMode())
        {
        modeToggle = false;
        Orion.CharPrint(self,1159,"Select 'From' container");
        Orion.WaitForAddObject('myTarget');
        var fromContainer = Orion.GetSerial('myTarget');
        Orion.CharPrint(self,1159,"Select 'To' container");
        Orion.WaitForAddObject('myTarget');
        var toContainer = Orion.GetSerial('myTarget');
        }
    else
        {
        var pouchStack = Orion.FindTypeEx('0x0E79', any, ground, '', 2).filter(function(pouch)
            {
            return !Orion.Contains(pouch.Properties(), 'Contents: 0/125');
            }).sort(function(a,b)
                {
                var aNum = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 0);
                var bNum = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 0);
                return aNum - bNum;
                });
        if(!pouchStack[0])
            {
            Orion.CharPrint(self,1159, 'No valid pouches found! Waiting and trying again...');
            Orion.Wait(5000);
            return MoveAllBinders();
            }
        var fromContainer = pouchStack[0].Serial();
        var toContainer = Orion.GetSerial(backpack);
        }
    VerifyOpenContainer(fromContainer);
    var binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
    while(binder)
        {
        VerifyOpenContainer(fromContainer);
        if(toContainer == backpackSerial)
            {
            var packCheck = +(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/) || [])[1];
            if(packCheck >= 105)
                {
                Orion.CharPrint(self, 1159, 'Backpack full to threshold!');
                Orion.CloseGump('container', fromContainer);
                return true;
                }
            }
        Orion.MoveItem(binder,0,toContainer);
        Orion.Wait(1200);
        binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
        }
    Orion.CloseGump('container', fromContainer);
    if(modeToggle)
        return MoveAllBinders();
	}

function MoveAllBooks(_)
	{
    Orion.CharPrint(self,1159,"Select 'From' container");
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    var book = Orion.FindType('0x577E',any,fromContainer)[0];
    while(book)
        {
        Orion.MoveItem(book,0,toContainer);
        Orion.Wait(1200);
        book = Orion.FindType('0x577E',any,fromContainer)[0];
        }
	}

function MoveAll(_)
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

//--------------------------------------------------------------------------End Combiner Script
//--#Sorter
//--------------------------------------------------------------------------Begin Sorter Script
function PinkSort()
    {
    var unsortedContainer = Orion.FindTypeEx('0x09AA|0x0E7D', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Unsorted')
        })[0];
    var emptiesContainer = Orion.FindTypeEx('0x09AA|0x0E7D', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Empties')
        })[0];
    if(!unsortedContainer)
        return Orion.Print('Unsorted books container missing! Halting...');
    if(!emptiesContainer)
        return Orion.Print('Empty books container missing! Halting...');
    var bookArrs = DefineBookSerials();
    var bookArr1 = bookArrs[0];
    var bookArr2 = bookArrs[1];
    var bookArr1reference = bookArrs[2];
    if(!bookArr1[0] || !bookArr2[0] || !bookArr1reference[0])
        return Orion.Print('Something went wrong defining book serials! Halting...');
    while(true)
        {
        var emptyBooks = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
            {
            return Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300')
            });
        while(emptyBooks[0])
            {
            Orion.MoveItem(emptyBooks[0].Serial(), 0, emptiesContainer.Serial());
            Orion.Wait(1500);
            emptyBooks = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
                {
                return Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300')
                });
            }
        while(Orion.FindType('0x577E', '0x0490').length == 0)
            {
            VerifyOpenContainer(unsortedContainer.Serial());
            var unsortedBooks = Orion.FindTypeEx('0x577E', '0x0490', unsortedContainer.Serial());
            if(unsortedBooks[0])
                {
                Orion.MoveItem(unsortedBooks[0].Serial());
                Orion.Wait(1500);
                }
            else
                return Orion.Print('No more unsorted books! Halting...');
            }
        EmptyPinkBook();
        PinkDrop(bookArr1, bookArr2, bookArr1reference)
        Orion.Wait(1500);
        }
    }

function EmptyPinkBook()
	{
	var latency = 50;
	var updScrollInfo = [];
	var book = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300');
        });
	if(book[0])
		{
        CloseAllGumps();
        Orion.UseObject(book[0].Serial());
		if(Orion.WaitForGump(5000))
			{
			var gump = Orion.GetGump('any','0x000023C5');
			if (gump !== null)
				{
				updScrollInfo = scrollinfo.filter(function(part)
                    {
                    return Orion.Contains(gump.ButtonList(), part[3]);
                    });
				}
			}
		for(var i=0;i<updScrollInfo.length;i++)
			{
			Orion.Print(updScrollInfo[i][0]);
			Orion.Wait(latency);
			if(Orion.WaitForGump(3000))
				{
				var gump0 = Orion.GetGump('any','0x000023C5');
				if(gump0 !== null)
					{
					gump0.Select(Orion.CreateGumpHook(updScrollInfo[i][3]));
					Orion.Wait(latency);
					}
				if(Orion.WaitForGump(3000))
					{
					Orion.Wait(latency);
					var gump1 = Orion.GetGump('last');
					if(gump1.TextList().length == 0)
						{
						gump1.Select(Orion.CreateGumpHook(updScrollInfo[i][1] + 2));
						continue;
						}
					}
				}
			for(var b=0;b<13;b++)
				{
				Orion.Wait(latency);
				if(Orion.WaitForGump(3000))
					{
					var gump2 = Orion.GetGump('last');
					var amount = gump2.TextList()[b];
					//Orion.Print(amount);
					if(amount == '0')
						continue;
					for(var a=0;a<amount;a++)
						{
                        PinkGumpButton(updScrollInfo[i][3] + ('0' + b).slice(-2), latency);//take out scroll
						if(Number((Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/) || [])[1]) >= 95)
							{
                            PinkGumpButton(0);
                            return Orion.Print('Scrolls ready to sort in backpack');
                            }
                        }
					if(Orion.WaitForGump(3000))
						{
						var gumpcheck = Orion.GetGump('last');
						if(gumpcheck.TextList()[b] != '0')
							b--;
						}
					}
				}
            PinkGumpButton(updScrollInfo[i][1] + 2);// back from skill
            PinkGumpButton(1);//back to main
			}
        PinkGumpButton(0);//close gump
        }
	}

function PinkDrop(bookArr1, bookArr2, refArr1)
	{
	var pink = Orion.FindTypeEx('0x14EF','0x0490')[0];
	while(pink)
		{
		var pinkRead = pink.Properties().match(/Skill: ([\w ]+) \d.\d/);
		if(pinkRead[1])
			{
			var pinkSkill = pinkRead[1];
			var pinkArr = scrollinfo.filter(function(part)
                {
                return part[0] == pinkSkill;
                })[0];
			Orion.Print(pinkSkill);
			//Orion.Print(bookArr1[ pinkArr[1] ][ pinkArr[2] ]);
            var startScan = Orion.Now();
			Orion.MoveItem(pink.Serial(), 0, bookArr1[ pinkArr[1] ][ pinkArr[2] ]);
			Orion.Wait(1000);
            if(Orion.InJournal('This book is full.', 'sys', '0', 'any', startScan))
                {
                bookArr1[ pinkArr[1] ][ pinkArr[2] ] = bookArr2[ pinkArr[1] ][ pinkArr[2] ];
                Orion.ClearJournal('This book is full.');
                if(BooksFullCheck(refArr1))
                    {
                    TextWindow.Open();
                    TextWindow.Print('One set of books is completely full!' + ' ' + pinkSkill);
                    }
                }
			}
        pink = Orion.FindTypeEx('0x14EF','0x0490')[0];
		}
	}

function testBooksFullCheck()
    {
    Orion.WaitForAddObject('myTarget')
    var a = Orion.GetSerial('myTarget');
    Orion.WaitForAddObject('myTarget')
    var b = Orion.GetSerial('myTarget');
    var ref = [[a],[b]]
    Orion.Print(BooksFullCheck(ref))
    }

function BooksFullCheck(refArr1)
    {
    for(var i=0;i<refArr1.length;i++)
        {
        for(var ii=0;ii<refArr1[i].length;ii++)
            {
            var book = Orion.FindObject(refArr1[i][ii]);
            var scrollNum = +((book.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0);
            if(scrollNum != 300)
                return false;
            }
        }
    return true;
    }

function DefineBookSerials()
	{
    var bookArrDefine1 = [];
    var bookArrDefine2 = [];
    var bookArrReference1 = [];
    var bookArrReference2 = [];
	var sortedContainer1 = Orion.FindTypeEx('0x09AA|0x0E7D', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Sorted1')
        })[0];
	var sortedContainer2 = Orion.FindTypeEx('0x09AA|0x0E7D', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Sorted2')
        })[0];
    var sortedContainer1Serial = sortedContainer1.Serial();
    var sortedContainer2Serial = sortedContainer2.Serial();
    VerifyOpenContainer(sortedContainer1Serial);
    VerifyOpenContainer(sortedContainer2Serial);
    var comparator1 = 0;
    Orion.FindTypeEx('0x0E75', any, sortedContainer1Serial).sort(function(a,b)
        {
        return a.X() - b.X();
        }).forEach(function(bag)
            {
            VerifyOpenContainer(bag.Serial());
            var books = Orion.FindTypeEx('0x577E', '0x0490', bag.Serial()).sort(function(a,b)
                {
                return a.X() - b.X();
                }).map(function(book)
                    {
                    var scrollNum = +((book.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0);
                    comparator1 += scrollNum;
                    return book.Serial();
                    });
            bookArrDefine1.push(books);
            bookArrReference1.push(ShallowCopy(books));
            });
    var comparator2 = 0;
    Orion.FindTypeEx('0x0E75', any, sortedContainer2Serial).sort(function(a,b)
        {
        return a.X() - b.X();
        }).forEach(function(bag)
            {
            VerifyOpenContainer(bag.Serial());
            var books = Orion.FindTypeEx('0x577E', '0x0490', bag.Serial()).sort(function(a,b)
                {
                return a.X() - b.X();
                }).map(function(book)
                    {
                    var scrollNum = +((book.Properties().match(/Scrolls In Book: (\d+)/) || [])[1] || 0);
                    comparator2 += scrollNum;
                    return book.Serial();
                    });
            bookArrDefine2.push(books);
            bookArrReference2.push(ShallowCopy(books));
            });
    if(comparator1 > comparator2)
        var fullBookArr = [bookArrDefine1, bookArrDefine2, bookArrReference1, bookArrReference2];
    else
        var fullBookArr = [bookArrDefine2, bookArrDefine1, bookArrReference2, bookArrReference1];
   	return fullBookArr;
	}

function ShallowCopy(arr)
    {
    var json = JSON.stringify(arr);
    return JSON.parse(json);
    }

function VerifyOpenContainer(containerSerial)
    {
    while(!Orion.GumpExists('container', containerSerial))
        {
        Orion.UseObject(containerSerial);
        Orion.Wait(1300);
        }
    }

function CloseAllGumps()
    {
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }

function PinkTokenCracker()
	{
	Orion.CharPrint(self,1159,'Select bag containing tokens')
	Orion.WaitForAddObject('myTarget');
	var tokenContainer = Orion.GetSerial('myTarget');
	Orion.CharPrint(self,1159,'Select container to put books')
	Orion.WaitForAddObject('myTarget');
	var bookContainer = Orion.GetSerial('myTarget');
	Orion.CharPrint(self,1159,'Select container to put bags')
	Orion.WaitForAddObject('myTarget');
	var discardContainer = Orion.GetSerial('myTarget');
	Orion.OpenContainer(tokenContainer);
	Orion.Wait(1300);
	var token = Orion.FindType('0x4BC6',any,tokenContainer)[0];
	while(token)
		{
		Orion.WaitGump(Orion.CreateGumpHook(105));
		Orion.UseObject(token);
		Orion.Wait(1300);
		var bag = Orion.FindType('0x0E76','0x0AA0')[0];
		while(bag)
			{
			Orion.OpenContainer(bag);
			Orion.Wait(1300);
			var book = Orion.FindType('0x577E',any,bag)[0];
			while(book)
				{
				Orion.MoveItem(book, 0, bookContainer);
				Orion.Wait(1300);
				book = Orion.FindType('0x577E',any,bag)[0];
				}
			Orion.MoveItem(bag, 0, discardContainer);
			Orion.Wait(1300);
			bag = Orion.FindType('0x0E76','0x0AA0')[0];
			}
		token = Orion.FindType('0x4BC6',any,tokenContainer)[0];
		}
	}

function ContainerGumpToggle()
	{
	if (Orion.ClientOptionGet('GriddedContainers') == 1)
		Orion.ClientOptionSet('GriddedContainers', 0)
	else
		Orion.ClientOptionSet('GriddedContainers', 1)
	}
function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}

function CoOwnerAccessSortContainer()
	{
	Orion.WaitForAddObject('myTarget');
	var target = Orion.FindObject('myTarget');
	Orion.Wait(600);
	Orion.WaitContextMenuID(target.Serial(), 600);
	Orion.RequestContextMenu(target.Serial());
	Orion.Wait(500);
	var gump = Orion.GetGump(any, '0x00000295');
	if(gump !== null)
		{
		gump.Select(Orion.CreateGumpHook(2));
		Orion.Wait(500);
		}
	Orion.Wait(600);
	VerifyOpenContainer(target.Serial());
	Orion.FindType('0x0E75', any, target.Serial()).forEach(function(bag)
		{
		Orion.WaitContextMenuID(bag, 600);
		Orion.RequestContextMenu(bag);
		Orion.Wait(500);
		var gump0 = Orion.GetGump(any, '0x00000295');
		if(gump0 !== null)
			{
			gump0.Select(Orion.CreateGumpHook(2));
			Orion.Wait(500);
			}
		VerifyOpenContainer(bag);
		Orion.FindType('0x577E','0x0490',bag).forEach(function(book)
			{
			Orion.WaitContextMenuID(book, 600);
			Orion.RequestContextMenu(book);
			Orion.Wait(500);
			var gump0 = Orion.GetGump(any, '0x00000295');
			if(gump0 !== null)
				{
				gump0.Select(Orion.CreateGumpHook(2));
				Orion.Wait(500);
				}
            Orion.Wait(200);
			});
        Orion.Wait(200);
		});
	}
	
function CoOwnerAccessTarget()
	{
	Orion.WaitForAddObject('myTarget');
	var target = Orion.FindObject('myTarget');
	Orion.WaitContextMenuID(target.Serial(), 600);
	Orion.RequestContextMenu(target.Serial());
	Orion.Wait(500);
	var gump0 = Orion.GetGump(any, '0x00000295');
	if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000295'))
		{
		gump0.Select(Orion.CreateGumpHook(2));
		Orion.Wait(100);
		}
	}

function ReplaceSortBooks()
	{
	var pos = 
		[
			{X: 44, Y: 65},
			{X: 52, Y: 65},
			{X: 60, Y: 65},
			{X: 68, Y: 65},
			{X: 76, Y: 65},
			{X: 84, Y: 65},
			{X: 92, Y: 65},
			{X: 100, Y: 65},
			{X: 108, Y: 65},
			{X: 116, Y: 65},
			{X: 124, Y: 65},
			{X: 132, Y: 65}
		];
	
	var categories =
		[
			'Misc', 7,
			'Combat', 11,
			'Trade', 10,
			'Magic', 12,
			'Wilderness', 6,
			'Thievery', 8,
			'Bard', 4
		]
	
	Orion.CharPrint(self, 1159, 'Select FROM container')
	Orion.WaitForAddObject('fromContainer');
	Orion.CharPrint(self, 1159, 'Select TO container')
	Orion.WaitForAddObject('toContainer');
    VerifyOpenContainer('fromContainer');
    VerifyOpenContainer('toContainer');
	var toContainerCategory = Orion.FindObject('toContainer').Properties().match(/Engraved: (.+)/)[1];
	var numBooks = categories[categories.indexOf(toContainerCategory) + 1]	
	for(var coord=0;coord<numBooks;coord++)
		{
		var emptyBook = Orion.FindType('0x577E',any,'fromContainer')[0];
		var posCheck = Orion.FindTypeEx('0x577E',any,'toContainer').filter(function(book)
			{
			return book.X() == pos[coord].X && book.Y() == pos[coord].Y;
			});
		if(emptyBook && !posCheck[0])
			{
			Orion.MoveItem(emptyBook,0,'toContainer',pos[coord].X,pos[coord].Y,-1,coord);
			Orion.Wait(1300);
			}
		}
	}

//--------------------------------------------------------------------------End Sorter Script
//--#Crafting
//--------------------------------------------------------------------------Begin Crafting Script
function MakeWoodPulp()
	{
    const skilletGraphic = '0x097F';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const barkGraphic = '0x318F';
    const pulpGraphic = '0x26B8';
	Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
	var supplyContainer = Orion.GetSerial('myTarget');
    var firstPass = true;
	while(true)
		{
        while(!Orion.FindType(skilletGraphic)[0]) //skillet check
            {
            while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
                if(!Orion.FindType(tinkerToolGraphic)[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                    if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                else
                    {
                    Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                    CraftItem(tinkerToolGraphic, 9003, 11);
                    }
                }
            if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                {
                Orion.CharPrint(self,1159,'Crafting Skillet');
                CraftItem('0x1EB9', 9003, 26);
                }   
            else
                {
                Orion.CharPrint(self,1159,'Restocking Skillet');
                if(!Restock('Skillet', skilletGraphic, supplyContainer, 0))
                    return;
                }
            firstPass = true;
            }
        while(!Orion.FindType('0x1F9D','0x047E')[0]) //decanter check
			{
            Orion.CharPrint(self,1159,'Restocking Decanter');
            if(!Restock('Decanter', '0x1F9D', supplyContainer, 0, '0x047E'))
                return;
			}
        while(!Orion.FindType(barkGraphic)[0]) //bark check
			{
            while(Orion.FindType(pulpGraphic)[0]) //pulp check
                {
                var pulp = Orion.FindType(pulpGraphic)[0]
                Orion.MoveItem(pulp, 0, supplyContainer)
                Orion.Wait(1300);
                }
            Orion.CharPrint(self,1159,'Restocking Bark Fragments');
            if(!Restock('Bark Fragments', barkGraphic, supplyContainer, Player.MaxWeight() - Player.Weight() - 10))
                return;
			}
        if(firstPass)
            {
            var beforeCount = Orion.Count(pulpGraphic)
            CraftItem(skilletGraphic,9002,57);
            if(Orion.Count(pulpGraphic) > beforeCount)
                firstPass = false;
            }
        else
            CraftLast(skilletGraphic);
		}
	}

function MakeBindersOLD()
    {
    const scribePenGraphic = '0x0FBF';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const pulpGraphic = '0x26B8';
    const pouchGraphic = '0x0E79';
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    var firstPass = true;
    while(true)
        {
        while(!Orion.FindType(pouchGraphic).length)
            {
            Orion.CharPrint(self,1159,'Restocking Pouch');
            var validNearbyPouch = Orion.FindTypeEx(pouchGraphic,0,ground,'',2).filter(function(pouch)
                {
                return Orion.Contains(pouch.Properties(), 'Contents: 0/125');
                }).sort(function(a,b)
                    {
                    return a.Z() - b.Z();
                    })[0];
            if(validNearbyPouch)
                {
                var nearbyPouchSerial = validNearbyPouch.Serial();
	            Orion.WaitContextMenuID(nearbyPouchSerial, 1012);
                Orion.RequestContextMenu(nearbyPouchSerial);
                Orion.Wait(1300);
                }
            else 
                {
                Orion.CharPrint(self, 1159, 'Waiting for an empty pouch...');
                Orion.Wait(1300);
                Orion.UseObject(backpack);
                Orion.Wait(1300);
                }
            }
        var pouch = Orion.FindType(pouchGraphic)[0];
        VerifyOpenContainer(pouch);
        while(Orion.FindType('0x14EF','0x0664',pouch).length < 119 && Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)
            {
            while(!Orion.FindType(scribePenGraphic)[0])
                {
                while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                while(!Orion.FindType(tinkerToolGraphic)[1])
                    {
                    if(!Orion.FindType(tinkerToolGraphic)[0])
                        {
                        Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                        if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                            return Orion.Terminate('all', 'GMJournalScan');
                        }
                    else
                        {
                        Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                        CraftItem(tinkerToolGraphic, 9003, 11);
                        }
                    }
                Orion.CharPrint(self,1159,'Crafting Scribe Pen');
                CraftItem(tinkerToolGraphic, 9003, 30);
                firstPass = true;
                }
            var haveAmount = Orion.Count(pulpGraphic, any, pouch, 0, false) + Orion.FindType('0x14EF','0x0664',pouch).length
            while(haveAmount < 119)
                {
                Orion.CharPrint(self,1159,'Restocking Wood Pulp');
                var pulp = Orion.FindType(pulpGraphic, any, supplyContainer);
                var neededAmount = 119 - haveAmount;
                if(Orion.Count(pulpGraphic, any, supplyContainer, 0, false) < neededAmount)
                    return Orion.Print('Out of Wood Pulp! Halting...');
                Orion.MoveItem(pulp[0], neededAmount, pouch);
                Orion.Wait(1300);
                haveAmount = Orion.Count(pulpGraphic, any, pouch, 0, false) + Orion.FindType('0x14EF','0x0664',pouch).length
                }
            if(firstPass)
                {
                CraftItem(scribePenGraphic,9006,301); //make binder
                firstPass = false;
                }
            else
                CraftLast(scribePenGraphic);
            }
        Orion.Wait(1300);
        if(Orion.WaitForGump(2000))
            {
            var gump = Orion.GetGump(any, '0x000001CC');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                }
            }
        var leftoverPulp = Orion.FindType(pulpGraphic,any,pouch)[0];
        Orion.MoveItem(leftoverPulp);
        Orion.Wait(1300);
        Orion.Drop(pouch, 0, Player.X() - 2, Player.Y(), Player.Z());
        Orion.Wait(1300);
        var pouchObj = Orion.FindObject(pouch);
        while(!Orion.Contains(pouchObj.Properties(), 'Locked Down'))
            {
            Orion.Say('i wish to secure this');
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(pouch);
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x00000295');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(2));
                    Orion.Wait(200);
                    }
                }
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x00000295');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    }
                }
            Orion.MoveItem(pouch);
            Orion.Wait(1300);
            }
        }
    }

function MakeBindersOLD()
    {
    const scribePenGraphic = '0x0FBF';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const pulpGraphic = '0x26B8';
    const pouchGraphic = '0x0E79';
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    var firstPass = true;
    while(true)
        {
        //while(Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)   
        var validNearbyPouch = Orion.FindTypeEx(pouchGraphic,0,ground,'',2).filter(function(pouch)
            {
            var contentsAmount = +(pouch.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
            return contentsAmount < 125;
            }).sort(function(a,b)
                {
                var aC = +(a.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                var bC = +(b.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                return bC - aC;
                })[0];
        if(validNearbyPouch)
            {
            var nearbyPouchSerial = validNearbyPouch.Serial();
            }
        else 
            {
            Orion.CharPrint(self, 1159, 'Waiting for space in a pouch...');
            Orion.Wait(1300);
            Orion.UseObject(backpack);
            Orion.Wait(1300);
            continue;
            }
        Orion.MoveItemType('0x14EF', '0x0664', backpack, 0, nearbyPouchSerial);
        Orion.Wait(1300);
        while(!Orion.FindType(scribePenGraphic)[0])
            {
            while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                    return Orion.Terminate('all', 'GMJournalScan');
                }
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
                if(!Orion.FindType(tinkerToolGraphic)[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                    if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                else
                    {
                    Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                    CraftItem(tinkerToolGraphic, 9003, 11);
                    }
                }
            Orion.CharPrint(self,1159,'Crafting Scribe Pen');
            CraftItem(tinkerToolGraphic, 9003, 30);
            firstPass = true;
            }
        if(Orion.Count(pulpGraphic, any, backpack, 0, false) < 10)
            {
            if(!Restock('Wood Pulp', pulpGraphic, supplyContainer, 100))
                return Orion.Terminate('all', 'GMJournalScan');
            }
        if(firstPass)
            {
            CraftItem(scribePenGraphic,9006,301); //make binder
            firstPass = false;
            }
        else
            CraftLast(scribePenGraphic);
        }
    }

function MakeBinders()
    {
    const scribePenGraphic = '0x0FBF';
    const skilletGraphic = '0x097F';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const barkGraphic = '0x318F';
    const pulpGraphic = '0x26B8';
    const pouchGraphic = '0x0E79';
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    var firstPassPulp = true;
    var firstPassBinder = true;
    while(true)
        {
        //while(Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)   
        var validNearbyPouch = Orion.FindTypeEx(pouchGraphic,0,ground,'',2).filter(function(pouch)
            {
            var contentsAmount = +(pouch.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
            return contentsAmount < 125;
            }).sort(function(a,b)
                {
                var aC = +(a.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                var bC = +(b.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                return bC - aC;
                })[0];
        if(validNearbyPouch)
            {
            var nearbyPouchSerial = validNearbyPouch.Serial();
            Orion.MoveItemType('0x14EF', '0x0664', backpack, 0, nearbyPouchSerial);
            Orion.Wait(1300);
            while(!Orion.FindType(scribePenGraphic)[0])
                {
                while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                while(!Orion.FindType(tinkerToolGraphic)[1])
                    {
                    if(!Orion.FindType(tinkerToolGraphic)[0])
                        {
                        Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                        if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                            return Orion.Terminate('all', 'GMJournalScan');
                        }
                    else
                        {
                        Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                        CraftItem(tinkerToolGraphic, 9003, 11);
                        }
                    }
                Orion.CharPrint(self,1159,'Crafting Scribe Pen');
                CraftItem(tinkerToolGraphic, 9003, 30);
                firstPassBinder = true;
                }
            if(Orion.Count(pulpGraphic, any, backpack, 0, false) < 10)
                {
                if(!Restock('Wood Pulp', pulpGraphic, supplyContainer, 100))
                    return Orion.Terminate('all', 'GMJournalScan');
                }
            if(firstPassBinder)
                {
                CraftItem(scribePenGraphic,9006,301); //make binder
                firstPassBinder = false;
                }
            else
                CraftLast(scribePenGraphic);
            firstPassPulp = true;
            }
        else if(Orion.Count(barkGraphic, any, supplyContainer) > 50)
            {
            while(!Orion.FindType(skilletGraphic)[0]) //skillet check
                {
                while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                        {
                        Orion.CharPrint(self,1159,'Restocking Ingots');
                        if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                            return Orion.Terminate('all', 'GMJournalScan');
                        }
                while(!Orion.FindType(tinkerToolGraphic)[1])
                    {
                    if(!Orion.FindType(tinkerToolGraphic)[0])
                        {
                        Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                        if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                            return Orion.Terminate('all', 'GMJournalScan');
                        }
                    else
                        {
                        Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                        CraftItem(tinkerToolGraphic, 9003, 11);
                        }
                    }
                if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                    {
                    Orion.CharPrint(self,1159,'Crafting Skillet');
                    CraftItem('0x1EB9', 9003, 26);
                    }   
                else
                    {
                    Orion.CharPrint(self,1159,'Restocking Skillet');
                    if(!Restock('Skillet', skilletGraphic, supplyContainer, 0))
                        return;
                    }
                firstPassPulp = true;
                }
            while(!Orion.FindType('0x1F9D|0x0FF6','0x047E')[0]) //decanter check
                {
                Orion.CharPrint(self,1159,'Restocking Decanter');
                if(!Restock('Decanter', '0x1F9D|0x0FF6', supplyContainer, 0, '0x047E')) //0x0FF9
                    {
                    var a = Orion.FindTypeEx(any);
                    TextWindow.Open()
                    a.forEach(function(b)
                        {
                        TextWindow.Print(b.Name() + ': ' +b.Graphic())
                        })
                    return;
                    }
                }
            while(!Orion.FindType(barkGraphic)[0]) //bark check
                {
                while(Orion.FindType(pulpGraphic)[0]) //pulp check
                    {
                    var pulp = Orion.FindType(pulpGraphic)[0]
                    Orion.MoveItem(pulp, 0, supplyContainer)
                    Orion.Wait(1300);
                    }
                Orion.CharPrint(self,1159,'Restocking Bark Fragments');
                if(!Restock('Bark Fragments', barkGraphic, supplyContainer, 50))
                    break;
                }
            if(firstPassPulp)
                {
                var beforeCount = Orion.Count(pulpGraphic)
                CraftItem(skilletGraphic,9002,57);
                if(Orion.Count(pulpGraphic) > beforeCount)
                    firstPassPulp = false;
                }
            else
                CraftLast(skilletGraphic);
            firstPassBinder = true;
            }
        else 
            {
            Orion.CharPrint(self, 1159, 'Waiting for space in a pouch...');
            Orion.Wait(1300);
            Orion.UseObject(backpack);
            Orion.Wait(1300);
            }
        }
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
    if((needed > 0 || amount == 0) && !restockItem[0])
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
//--------------------------------------------------------------------------End Crafting Script