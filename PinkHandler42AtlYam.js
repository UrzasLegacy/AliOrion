//v42 Atl/Yamato
//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the last column of scrollinfo array
var passphrase = 'BallTableHorseShoe'; //say this near GoodWill to turn off reconnect and log out

var maxCountAtlantic = 5
var maxCountYamato = 2
Shared.AddVar('debug',true);
//------------------------------------------------------------------------------------------------------------------------------ATLANTIC
var scrollinfoAtlantic = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc Atlantic
		["Arms Lore",           0,  0,  1044064,    99999],
		["Begging",             0,  1,  1044066,    1699999],
		["Camping",             0,  2,  1044070,    30000],
		["Cartography",         0,  3,  1044072,    1999999],
		["Forensics",           0,  4,  1044079,    30000],
		["Item Identification", 0,  5,  1044063,    30000],
		["Taste Identification",0,  6,  1044096,    30000],
	//1 Combat Atlantic
		["Anatomy",             1,  0,  1044061,    3999999],
		["Archery",             1,  1,  1044091,    3124999],
		["Fencing",             1,  2,  1044102,    2499999],
		["Focus",               1,  3,  1044110,    499999],
		["Healing",             1,  4,  1044077,    3888887],
		["Mace Fighting",       1,  5,  1044101,    999996],
		["Parrying",            1,  6,  1044065,    4999999],
		["Swordsmanship",       1,  7,  1044100,    6499999],
		["Tactics",             1,  8,  1044087,    7499999],
		["Throwing",            1,  9,  1044117,    99999],
		["Wrestling",           1,  10, 1044103,    907499],
	//2 Trade Skills Atlantic
		["Alchemy",             2,  0,  1044060,    4499999],
		["Blacksmithing",       2,  1,  1044067,    4399999],
		["Fletching",           2,  2,  1044068,    2299998],
		["Carpentry",           2,  3,  1044071,    2299998],
		["Cooking",             2,  4,  1044073,    799999],
		["Inscription",         2,  5,  1044083,    5299998],
		["Lumberjacking",       2,  6,  1044104,    349999],
		["Mining",              2,  7,  1044105,    349999],
		["Tailoring",           2,  8,  1044094,    3999999],
		["Tinkering",           2,  9,  1044097,    4199998],
	//3 Magic Atlantic
		["Bushido",             3,  0,  1044112,    17999997], 
		["Chivalry",            3,  1,  1044111,    2999998],
		["Eval Intelligence",   3,  2,  1044076,    4999999],
		["Imbuing",             3,  3,  1044116,    6999999],
		["Magery",              3,  4,  1044085,    7999999],
		["Meditation",          3,  5,  1044106,    30000],
		["Mysticism",           3,  6,  1044115,    8999998],
		["Necromancy",          3,  7,  1044109,    5899998],
		["Ninjitsu",            3,  8,  1044113,    18999998],
		["Resisting Spells",    3,  9,  1044086,    10999998],
		["Spellweaving",        3,  10, 1044114,    3999998],
		["Spirit Speak",        3,  11, 1044092,    2499999],
	//4 Wilderness Atlantic
		["Animal Lore",         4,  0,  1044062,    2999998],
		["Animal Taming",       4,  1,  1044095,    39499998],
		["Fishing",             4,  2,  1044078,    2999998],
		["Herding",             4,  3,  1044080,    30000],
		["Tracking",            4,  4,  1044098,    1399999],
		["Veterinary",          4,  5,  1044099,    6777776],
	//5 Thievery Atlantic
		["Detecting Hidden",    5,  0,  1044074,    1799999],
		["Hiding",              5,  1,  1044081,    1999999],
		["Lock Picking",        5,  2,  1044084,    4299998],
		["Poisoning",           5,  3,  1044090,    16399998],
		["Remove Trap",         5,  4,  1044108,    1399999],
		["Snooping",            5,  5,  1044088,    30000],
		["Stealing",            5,  6,  1044093,    2499999],
		["Stealth",             5,  7,  1044107,    1999999],
	//6 Bard Atlantic
		["Discordance",         6,  0,  1044075,    12499999],
		["Musicianship",        6,  1,  1044089,    1399999],
		["Peacemaking",         6,  2,  1044069,    899999],
		["Provocation",         6,  3,  1044082,    4333332],
	]
//------------------------------------------------------------------------------------------------------------------------------YAMATO
var scrollinfoYamato = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc Yamato
		["Arms Lore",           0,  0,  1044064,    399999],
		["Begging",             0,  1,  1044066,    3000000],
		["Camping",             0,  2,  1044070,    100000],
		["Cartography",         0,  3,  1044072,    5000000],
		["Forensics",           0,  4,  1044079,    100000],
		["Item Identification", 0,  5,  1044063,    100000],
		["Taste Identification",0,  6,  1044096,    100000],
	//1 Combat Yamato
		["Anatomy",             1,  0,  1044061,    10000000],
		["Archery",             1,  1,  1044091,    15000000],
		["Fencing",             1,  2,  1044102,    3500000],
		["Focus",               1,  3,  1044110,    5000000],
		["Healing",             1,  4,  1044077,    19999999],
		["Mace Fighting",       1,  5,  1044101,    3500000],
		["Parrying",            1,  6,  1044065,    30000000],
		["Swordsmanship",       1,  7,  1044100,    7999999],
		["Tactics",             1,  8,  1044087,    45000000],
		["Throwing",            1,  9,  1044117,    10000000],
		["Wrestling",           1,  10, 1044103,    5000000],
	//2 Trade Skills Yamato
		["Alchemy",             2,  0,  1044060,    9000000],
		["Blacksmithing",       2,  1,  1044067,    9000000],
		["Fletching",           2,  2,  1044068,    6000000],
		["Carpentry",           2,  3,  1044071,    6000000],
		["Cooking",             2,  4,  1044073,    3000000],
		["Inscription",         2,  5,  1044083,    6000000],
		["Lumberjacking",       2,  6,  1044104,    2000000],
		["Mining",              2,  7,  1044105,    3000000],
		["Tailoring",           2,  8,  1044094,    10000000],
		["Tinkering",           2,  9,  1044097,    9000000],
	//3 Magic Yamato
		["Bushido",             3,  0,  1044112,    65000000],
		["Chivalry",            3,  1,  1044111,    60000000],
		["Eval Intelligence",   3,  2,  1044076,    20000000],
		["Imbuing",             3,  3,  1044116,    25000000],
		["Magery",              3,  4,  1044085,    50000000],
		["Meditation",          3,  5,  1044106,    1000000],
		["Mysticism",           3,  6,  1044115,    20000000],
		["Necromancy",          3,  7,  1044109,    20000000],
		["Ninjitsu",            3,  8,  1044113,    50000000],
		["Resisting Spells",    3,  9,  1044086,    20000000],
		["Spellweaving",        3,  10, 1044114,    50000000],
		["Spirit Speak",        3,  11, 1044092,    5000000],
	//4 Wilderness Yamato
		["Animal Lore",         4,  0,  1044062,    9999999],
		["Animal Taming",       4,  1,  1044095,    80000000],
		["Fishing",             4,  2,  1044078,    10000000],
		["Herding",             4,  3,  1044080,    1000000],
		["Tracking",            4,  4,  1044098,    5000000],
		["Veterinary",          4,  5,  1044099,    10000000],
	//5 Thievery Yamato
		["Detecting Hidden",    5,  0,  1044074,    3000000],
		["Hiding",              5,  1,  1044081,    10000000],
		["Lock Picking",        5,  2,  1044084,    5000000],
		["Poisoning",           5,  3,  1044090,    10000000],
		["Remove Trap",         5,  4,  1044108,    2000000],
		["Snooping",            5,  5,  1044088,    1000000],
		["Stealing",            5,  6,  1044093,    7000000],
		["Stealth",             5,  7,  1044107,    10000000],
	//6 Bard Yamato
		["Discordance",         6,  0,  1044075,    30000000],
		["Musicianship",        6,  1,  1044089,    8000000],
		["Peacemaking",         6,  2,  1044069,    15000000],
		["Provocation",         6,  3,  1044082,    15000000],
	]

//------------------------------------------------------------------------------------------------------------------------------
var shard = Orion.ShardName();
if(shard == 'Atlantic')
    {
    var scrollinfo = scrollinfoAtlantic;
    var maxcount = maxCountAtlantic;
    }
else if(shard == 'Yamato')
    {
    var scrollinfo = scrollinfoYamato
    var maxcount = maxCountYamato;
    }

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
    var roundPrices = false;
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
        if(roundPrices)
            {
            if(price < 100000)
                var rounded = Math.round(price / 10000) * 10000;
            else //if(price < 1000000)
                var rounded = Math.round(price / 100000) * 100000;
            //else
                //var rounded = Math.round(price / 1000000) * 1000000;
            }
        else
            var rounded = price;
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
        [ [100, 30, b++, "VSPinks", 'VSResultPinks'], [100, 30, b++, "VendorResults", 'CheckAllNearbyVendors'] ]
    ]

function combostsest()
    {
    TextWindow.Open();

    var tempArr1 = CombinationCall([1,2,3],50);
    var tempArr2 = CombinationCall([4,5,6,7,8,9,10],50);
    TextWindow.Print(tempArr1.length)
    TextWindow.Print(tempArr2.length)

    }

function Gump()
    {
    //var tempArr1 = CombinationCall([1,2,3,4,5,6,7,8,9,10],50);
    //Orion.Print('test')
    //var tempArr2 = tempArr1.slice(35027).reverse()
    //var tempArr2 = CombinationCall([4,5,6,7,8,9,10],50);
    //tempArr.push([50,0,0,0,0,0,0])
    //Shared.AddArray('combo50', tempArr2);
    //Orion.Print(tempArr2.length)
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

function FullSetPrice()
	{
	var goldPrice = scrollinfo.reduce(function(a,b)
		{
		return a + b[4];
		}, 0);
	var platPrice = 80; //USD
	var usdPrice = ((goldPrice/1000000000)*platPrice).toFixed(2);
	var fullSetsPrice = (usdPrice*99).toFixed(2);
	var goldPriceFormatted = goldPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	var usdPriceFormatted = usdPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	var fullPriceFormatted = fullSetsPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	Orion.Print('Set of 5.0s price: ' + '\n' + 'Gold: ' + goldPriceFormatted + '\n' + 'USD ($' + platPrice + ' per plat): $' + usdPriceFormatted + '\n\n' + '99 sets: $' + fullPriceFormatted);
	}

function UnlockBooks()
    {
    Orion.ResetSearchArea()
    var books = Orion.FindTypeEx('0x14F0|0x577E',any,'ground','item',6).filter(function(book)
        {
        return Orion.Contains(book.Properties(), '300/300');
        });
       Orion.Print(books.length)
    for(var i = 0;i<books.length;i++)
        {
        var book = books[i].Serial();
        Orion.WaitContextMenuID(book, 1012);
        Orion.RequestContextMenu(book);
        Orion.Wait(1300);
        }
    }
function CountEmpties()
	{
	var books = Orion.FindTypeEx('0x14F0|0x577E',any,'ground','item',6).filter(function(book)
        {
        return !Orion.Contains(book.Properties(), '300/300');
        });
    Orion.Print(books.length)
	}    

var pinkArr = [];
function CheckAllNearbyVendors()
    {
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print('---Starting Vendor Check---\nSymbols:\n+:\tWe are lower than them by more than 1 gp\n-:\tThey are lower than us\n=:\tWe are exactly 1 gp below their price\n==:Their price is exactly the same as ours\nSymbol SuggestedPrice/CurrentPrice:\tSkillName:\t[all prices on vendors]');
    var vendors = Orion.FindTypeEx(any,any,ground,'live',15,'yellow').filter(function(npc)
        {
        return Orion.Contains(npc.Properties(),'Shop Name:');
        });
    for(var i=0;i<vendors.length;i++)
        {
        var vendor = vendors[i];
        var vendorSerial = vendor.Serial();
        var vendorPack = Orion.ObjAtLayer('backpack',vendorSerial).Serial();
        VerifyOpenVendor(vendorSerial,vendorPack);
        GetAllPinkPrices(vendorPack);
        }
    var outMsg = '';
    for(var i=0;i<scrollinfoAtlantic.length;i++)
        {
        var skillArr = scrollinfoAtlantic[i];
        var skillName = skillArr[0];
        var skillPrice = skillArr[4];
        var skillPinks = pinkArr.filter(function(pinkObj)
            {
            var pinkProps = pinkObj.Properties();
            var nameCheck = Orion.Contains(pinkProps,skillName);
            var strCheck = Orion.Contains(pinkProps,'5.0 Skill Points');
            var priceCheck = Orion.Contains(pinkProps,'Price: ');
            return priceCheck && nameCheck && strCheck;
            }).map(function(pinkObj)
                {
                var priceRaw = pinkObj.Properties().match(/Price: ([\d,]+)/)[1];
                var priceFormat = priceRaw.replace(/,/g,'');
                return +priceFormat;
                });
        if(skillPinks.length)
            {
            skillPinks.sort(function(a,b)
                {
                return a - b;
                });
            var lowPrice = skillPinks[2] || skillPinks [1] || skillPinks[0];
            if(lowPrice == skillPrice)
                var symbol = '==\t' + lowPrice + '/' + skillPrice;
            else if(lowPrice - 1 == skillPrice)
                var symbol = '=\t' + lowPrice + '/' + skillPrice;
            else if(lowPrice < skillPrice)
                symbol = '-\t' + (lowPrice - 1) + '/' + skillPrice;
            else
                symbol = '+\t' + (lowPrice - 1) + '/' + skillPrice;
            var skillMsg = symbol + ':\t' + skillName + ':\t' + JSON.stringify(skillPinks);
            //TextWindow.Print(skillMsg);
            outMsg += skillMsg;
            if(i < scrollinfoAtlantic.length - 1)
           		 outMsg += '\n';
            }
        }
    TextWindow.Print(outMsg);
    TextWindow.Print('---Ending Vendor Check---');
    }

function GetAllPinkPrices(containerSerial)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    Orion.FindTypeEx('0x14EF','0x0490',containerSerial).forEach(function(pink)
        {
        pinkArr.push(pink);
        });
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var props = item.Properties();
        var bool = Orion.Contains(props,'Contents: ') && !Orion.Contains(props, 'Contents: 0/125');
        return bool;
        });
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllPinkPrices(subContainer.Serial());
        }
    Orion.CloseGump('container',containerSerial);
    return pinkArr;
    }

function VerifyOpenVendor(vendorSerial,vendorPack,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',vendorPack))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(vendorSerial);
        Orion.Wait(1000);
        }
    return true;
    }
    
function VSResultPinks()
	{
		Orion.RemoveDisplayTimer('searchWait');
    var pushToDiscord = false;
    var hook = '1080059761640353863';
    var key = 'eLZBOOgTXWoMxy2pFu2aEMtnlAuoP9pEV8fgDkUhCmXmBZQwlB_MwvqmAzVcTERsV0KB';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
	TextWindow.Open();
    TextWindow.Print('--START VS--');
    if(pushToDiscord)
        Orion.HttpPost(bot,'content=--START VS--');
    var totalVSprice = 0;
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
				TextWindow.Print('\\\t' + currentPrice + ':\t' + skill + ': No items matched');
				}
			else if(resultArr[0] == 'Timed Out')
				{
                Orion.CharPrint(self,1159,'Search Timed Out, trying again...');
				i--;
				continue;
				}
			else
				{
                var outMsg = '';
                var addArray = resultArr.reduce(function(sum,ele)
                    {
                    return sum + ele;
                    });
                totalVSprice += addArray;
                Orion.Print('total: ' + totalVSprice)
                var formatArray = FormatArray(resultArr)
				var lowestPrice = resultArr[2] || resultArr[1] || resultArr[0];
                if(lowestPrice < 30000)
                    {
                    tab = '\t\t';
                    outMsg += "\\\t" + 30000 + ':\t'
                    }
				else if(lowestPrice < currentPrice)
					{
                    if(lowestPrice - 1 < 1000000)
                        tab = '\t\t';
                    outMsg += "-\t" + (lowestPrice-1);
					}
				else if((lowestPrice == currentPrice || lowestPrice - 1 == currentPrice))
                    {
                    if(currentPrice < 1000000)
                        tab = '\t\t';
                    outMsg += "=\t" + currentPrice;
                    }
                else if(lowestPrice > currentPrice)
                    {
                    if(lowestPrice - 1 < 1000000)
                        var tab = '\t\t';
					outMsg = "+\t" + (lowestPrice-1);
                    }
                outMsg += '/' + currentPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ':' + tab + skill
                var truncArr = Orion.Split(formatArray,'|');
                var truncMsg = outMsg + ': [ ' + truncArr[0] + '|' + truncArr[1] + '|' + truncArr[2] + '|' + truncArr[3] + '|' + truncArr[4] + '|' + truncArr[5] + ']';
                outMsg += ' (' + resultArr.length + ':' + addArray.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '): [' + formatArray + ']: Acc Total: ' + totalVSprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                TextWindow.Print(outMsg);
                if(pushToDiscord)
                    Orion.HttpPost(bot,'content=' + truncMsg);
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
    TextWindow.Print('Total price of VS: ' + totalVSprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +'\n--END VS--');
    if(pushToDiscord)
        Orion.HttpPost(bot,'content=--End VS--');
	}

function FormatArray(arr)
    {
    var outMsg = '';
    arr.forEach(function(price)
        {
        outMsg += price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ' | ';
        })
    var outMsg = outMsg.slice(0,-3);
    return outMsg;
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
	Orion.AddDisplayTimer('searchWait', 60000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(60000, 'generic', self, '0x000F3EC8')
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
	Orion.AddDisplayTimer('searchWait', 60000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(60000, 'generic', self, '0x000F3EC8')
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
    if(shard == 'Atlantic')
        {
        var vendors = [
            [0x057F6DBC, 12*maxcount, 'Magic'],
            [0x057F6D78, 11*maxcount, 'Combat'],
            [0x057F6D5A, 10*maxcount, 'Trade Skills'],
            [0x057F5FD8, 8*maxcount, 'Thievery'],
            [0x057F5FF9, 6*maxcount, 'Wilderness'],
            [0x057F5FCB, 4*maxcount, 'Bard'],
            [0x057F5F5D, 7*maxcount, 'Misc'],
            ]
        }
    else if(shard == 'Yamato')
        {
        var vendors = [
            [0x002F800C, 12*maxcount, 'Magic'],
            [0x002F7FF5, 11*maxcount, 'Combat'],
            [0x002F7FDF, 10*maxcount, 'Trade Skills'],
            [0x002F7FBD, 8*maxcount, 'Thievery'],
            [0x002F7FA5, 6*maxcount, 'Wilderness'],
            [0x002F7F98, 4*maxcount, 'Bard'],
            [0x002F7F8E, 7*maxcount, 'Misc'],
            ]
        }

    var loopInterval = 1000 * 5; //check vendor backpacks every 5 seconds
    var restockDelay = 1000 * 15; //when someone buys a scroll, wait this long before restocking the first vendor
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
        if(Orion.InJournal(passphrase))
            {
            Orion.OAOptionSet('AutoReconnect', '0');
            Orion.LogOff();
            }
        if(Orion.Now() > saluteTimer)
        	{
        	Orion.EmoteAction('salute');
        	saluteTimer = Orion.Now() + saluteInterval;
        	}
        if(Orion.Now() > reportTimer)
            {
            Orion.Print('SalesReport')
            SalesReport();
            reportTimer = Orion.Now() + reportInterval;
            }
        if(Orion.Now() > vendorCheckTimer)
            {
            Orion.Print('AutoVendor');
            AutoVendor();
            vendorCheckTimer = Orion.Now() + vendorInterval;
            }
        if(Orion.Now() > invCntTimer)
            {
            Orion.Print('AutoCountStock')
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
                Orion.CharPrint(vendor[0],1159,itemCount + '/' + vendor[1]);
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
    if(shard == 'Atlantic')
        {
        var vendorSerials = [
            '0x057F6DBC',
            '0x057F6D78',
            '0x057F6D5A',
            '0x057F5FD8',
            '0x057F5FF9',
            '0x057F5FCB',
            '0x057F5F5D'
            ]
        }
    else if(shard == 'Yamato')
        {
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
        var vendorObj = Orion.FindObject(vendorSerial);
        var posX = vendorObj.X();
        var posY = vendorObj.Y();
        while(Orion.GetDistance(posX,posY) > 2)
            {
            Orion.WalkTo(posX,posY,0,2);
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
                var hook = '1058909586746265733';
                var key = 'KeRvl3b8x6cbI91JQXVc5cLbWxblkHcrIqd2XwQTcC54G-nl0GjLvlGAbCk1gqCushAk';
                var bot =
                    "https://discordapp.com/api/webhooks/"
                    + hook
                    + "/"
                    + key; // Webhook url
                Orion.HttpPost(bot,'content=' + 'Restock Vendor Book: ' + vendorName + ': ' + PinkBookRequestCount(updScrollInfo,vendorContainer));
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
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/Pink Info ' + shard + '/IndividualSales' + Orion.Date() + '.json';
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
    for(var i=0,j=0,len=tmpRunningTotals.length;i<len;i++)
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
        Orion.HttpPost(bot, "content=\n" + shard + ':\n**' + groupName + ':**\n' + discordString);
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
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/Pink Info ' + shard + '/IndividualSales' + Orion.Date() + '.json';
    var newFilePath = Orion.CurrentScriptDirPath() + '/Pink Info ' + shard + '/TotalSalesReport' + Orion.Date() + '.json';
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
		    for(var i=0,len=curr.length;i<len;i++)
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
    var outStr = '**Report ' + shard + '**:';
    var overallTotal = 0;
    var gumpStr = '';
    for(var i=0,len=totalSales.length;i<len;i++) //categories
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
        for(var ii=0,len=categoryScrollInfo.length;ii<len;ii++) //values
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
    if(shard == 'Atlantic')
        outStr += '**\nOverall Total: ' + overallTotal + '**\nBank of GoodWill Balance: ' + ParsePlayerGold();
    if(shard == 'Yamato')
        outStr += '**\nOverall Total: ' + overallTotal + '**\nBank of Hunting Balance: ' + ParsePlayerGold();
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
    
function AutoCountStock(_)
    {
    if(Orion.GetDistance(775,729) < 6)
        {
        var startX = 773, startY = 729; 
        var vendorSerials = [
            '0x057F6DBC',
            '0x057F6D78',
            '0x057F6D5A',
            '0x057F5FD8',
            '0x057F5FF9',
            '0x057F5FCB',
            '0x057F5F5D'
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
    var fullScrollInfo = []
    for(var i=0,len=vendorSerials.length;i<len;i++)
        {
        while(!Player.Hidden())
            {
            Orion.UseSkill('Hiding');
            Orion.Wait(1000);
            }
        var vendorSerial = vendorSerials[i];
        var vendorObj = Orion.FindObject(vendorSerial);
        var posX = vendorObj.X();
        var posY = vendorObj.Y();
        while(Orion.GetDistance(posX,posY) > 2)
            {
            Orion.WalkTo(posX,posY);
            Orion.Wait(500);
            }
        var categoryInfo = PinkStockCount(vendorSerial)
        if(!categoryInfo)
            return Orion.CharPrint(self,1159,'Books Missing! Halting...');
        for(var ii=0,len2=categoryInfo.length;ii<len2;ii++)
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
    var skillGroupContainers = Orion.FindType('0x0E79|0x0E75',any,restockContainer)
    var fullCategoryInfo = [];
    for(var i=0,len=skillGroupContainers.length;i<len;i++)
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
            return Orion.HttpPost(bot, "content=\n" + shard + ':\n**' + vendorName + ':**\nBooks Missing!');
        for(var ii=0,len2=books.length;ii<len2;ii++)
            {
            var book = books[ii];
            for(var iii=0,len3=updScrollInfo.length;iii<len3;iii++)
                {
                var currentSkillName = updScrollInfo[iii][0];
                var skillButton = updScrollInfo[iii][3];
                var skillButton50 = skillButton + '12';
                var backbutton = updScrollInfo[iii][1] + 2;
                while(!Orion.GumpExists('generic',book))
                    {
                    Orion.UseObject(book);
                    Orion.Wait(1300);
                    }
                if(Orion.WaitForGump(3000))
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
                PinkGumpButton(skillButton, 1000);
                if(Orion.WaitForGump(3000))
                    {
                    var gump = Orion.GetGump(any, '0x000023C5');
                    if(gump !== null)
                        {
                        var skillCount = gump.Text(12);
                        updScrollInfo[iii][5] = (updScrollInfo[iii][5] || 0) + +skillCount;
                        Orion.Print(currentSkillName + updScrollInfo[iii][5])
                        }
                    }  
                PinkGumpButton(backbutton, 1000);
                }
            PinkGumpButton('0', 1000);
            }
        }
    var outString = vendorName + '\n';
    var discordString = '';
    for(var i=0,len=updScrollInfo.length;i<len;i++)
        {
        var skillName = updScrollInfo[i][0];
        var skillAmount = updScrollInfo[i][5] || 0;
        outString += skillName + ': ' + skillAmount + '\n';
        if(skillAmount < 50)
            discordString += skillName + ': ' + skillAmount + ' remaining\n';
        fullCategoryInfo.push(updScrollInfo[i]);
        }
    if(discordString)
        Orion.HttpPost(bot, "content=\n" + shard + ':\n**' + vendorName + ':**\n' + discordString);
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
    if(shard = 'Atlantic')
	    var vendors = '0x057F6DBC|0x057F6D78|0x057F6D5A|0x057F5FD8|0x057F5FF9|0x057F5FCB|0x057F5F5D';
    else if(shard = 'Yamato')
	    var vendors = '0x002F800C|0x002F7FF5|0x002F7FDF|0x002F7FBD|0x002F7FA5|0x002F7F98|0x002F7F8E';
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

function ParsePlayerGold(_)
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
	for(var i=0,len=updScrollInfo.length;i<len;i++)
		{
        var currentSkill = updScrollInfo[i];
        var currentSkillIndex = currentSkill[2]
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
        for(var ii=0,len2=books.length;ii<len2;ii++)
            {
            var book = books[ii][0];
            while(!Orion.GumpExists('generic',book))
                {
                Orion.UseObject(book);
                Orion.Wait(1300); 
                }
            var skillButton = currentSkill[3];
            var skillButton50 = skillButton + '12';
            var backbutton = currentSkill[1] + 2;
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
    for(var v=0,len=updScrollInfo.length;v<len;v++)
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
    for(var v=0,len=verify.length;v<len;v++)
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
function RepeatCombo()
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

function ComboCategories()
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
        for(var i = 0,len=scrollinfo.length;i<len;i++)
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
        var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Transcendence:');
            });
        if(binder.length < 4)
            PutAway5s(combinedParentContainer,currentSkillIndex)
        while(DoCombo())
            {
            var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
                {
                return !Orion.Contains(part.Properties(), 'Transcendence:');
                });
            if(binder.length < 4)
                PutAway5s(combinedParentContainer,currentSkillIndex)
            Orion.Wait(100);
            if(Orion.InJournal('This scroll does not match the type currently being bound.'))
                {
                Debug('ComboCategories: Scroll mismatch')
                Orion.ClearJournal('This scroll does not match the type currently being bound.');
                TextWindow.Open();
                TextWindow.Print('Mismatched scroll binder in pack! Halting...');
                Orion.PlayWav('Alarm.wav');
                return;
                }
            }
        Orion.Wait(1300);
        ResetPinkBook();
        PutAway5s(combinedParentContainer,currentSkillIndex);
        var pinkBook = Orion.FindTypeEx('0x577E')[0];
        while(pinkBook)
            {
            if(fullBooks[1])
                {
                while(!Orion.Contains(pinkBook.Properties(), 'Scrolls In Book: 0/300'))
                    {
                    Orion.Wait(1300);
                    EmptyPinkBook();
                    Debug('ComboCategories: EmptyPinkBook')
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(pinkBook.Serial(), any, uncombinedParentContainer);
                Orion.Wait(1300);
                }
            else
                {
                Debug('ComboCategories: Putting away last book of this skill')
                var lastPinkBook = pinkBook.Serial();
                Orion.MoveItem(lastPinkBook, any, combinedParentContainer);
                Orion.Wait(1300);
                }
            pinkBook = Orion.FindTypeEx('0x577E')[0]   
            }
        if(!fullBooks[1])
            {
            Debug('ComboCategories: Putting away last of the pinks of this skill')
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

function testputaway()
    {
    Orion.WaitForAddObject('myTarget')
    var a = Orion.GetSerial('myTarget');
    PutAway5s(a,0)
    }

function PutAway5s(combinedParentContainer,currentSkillIndex)
    {
    Debug('PutAway5s')
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
    }

function initCombination()
    {
    TextWindow.Open();
    TextWindow.Clear();
    var candidates = [1,2,3,4,5,6,7,8,9,10];
    var target = 50;
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

function CombinationCall(candidates, target)
    {
    var results = [];
    candidates.sort(function (a, b) { return a - b; });
    function backtrack(combination, currentSum, remainingTarget, start)
        {//TextWindow.Print("combination:" + combination + "currentSum:" + currentSum + "remainingTarget:" + remainingTarget + "start:" + start);
        if(remainingTarget === 0)
            {//TextWindow.Print("found combination:" + combination);
            results.push(ArrayFormat(combination));
            return;
            }
        for(var i = start, len = candidates.length; i < len; i++)
            {//TextWindow.Print("considering candidate:" +  candidates[i]);
            if (candidates[i] > remainingTarget)
                break; //TextWindow.Print("candidate too large, stopping loop");
            backtrack(combination.concat(candidates[i]), currentSum + candidates[i], remainingTarget - candidates[i], i);
            }
        }
    backtrack([], 0, target, 0);
    return results;
    }

function ArrayFormat(arr)
    {
    var emptyArr = [0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0,len=arr.length;i<len;i++)
        {
        var value = arr[i] - 1;
        if(value == 19)
            value = 10;
        else if(value == 29)
            value = 11;
        emptyArr[value]++
        }
    return emptyArr;
    }

function DoCombo()
    {
    var binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Transcendence:');
        });
    if(binder.length < 4)
        {  
        if(!MoveAllBinders())
            return Orion.Print('Need at least 4 blank scrollbinders in pack! Halting...');
        binder = Orion.FindTypeEx('0x14EF','0x0664').filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Transcendence:');
            });
        if(binder.length < 4)
            return Orion.Print('Need at least 4 blank scrollbinders in pack! Halting...');
        }
    if(!OpenBook())
        return Orion.Print('Book empty! Halting...');
    Orion.PrintFast(self, 1159, 0, 'Checking 5.0 combos');
    var tempArr = PrunedComboArray();
    // while(tempArr == false)
    //     tempArr = PrunedComboArray();
    for(var i=0,len=tempArr.length;i<len;i++)
        if(PrepCombo(tempArr[i]))
            return true;
    Orion.Print('All out of combos! Halting...')
    return false;
    }

function PrunedComboArray()
    {
    // if(Orion.WaitForGump(3000))
         var gump = Orion.GetGump(any, '0x000023C5');
    // if(gump == null)
    //     return false;
    var text = gump.TextList();
    var numbers = text.map(function(a)
        {
        return +a;
        })
    numbers.splice(-3);
    var valueArr = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','2.0'];
    var updatedNumbers = numbers.map(function(part,ind)
        {
        var pinks = Orion.FindTypeEx('0x14EF','0x0490').filter(function(pink)
            {
		    return Orion.Contains(pink.Properties(), valueArr[ind]);
            });
        return part + pinks.length;
        });
    var candidates = [];
    for(var i=0,len=updatedNumbers.length;i<len;i++)
        {
        if(updatedNumbers[i] != 0)
            candidates.push(i+1);
        }
    Orion.Print(numbers)
    Orion.Print(updatedNumbers)
    Orion.Print(candidates)
    var tempArr = CombinationCall(candidates,50);
    var returnArr = tempArr.reverse();
    Orion.Print(returnArr.length)
    return returnArr
    }

function testPrepCombo()
    {
    PrepCombo([9,1,6,4,1,0,0,0,0,0,0]);
    }

function PrepCombo(fullComboArr)
    {
    Orion.Print(fullComboArr)
    if(CheckInBook(fullComboArr))
        {
        var fullComboArrClone = ArrayClone(fullComboArr);
        Orion.CharPrint(self,1159, '' + fullComboArr);
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
        for(var i=0,targetPink=null,len=fullComboArrClone.length;i<len;i++)
            {
            if(targetPink != null)
                {
                VerifyCombination(binder[0],targetPink);
                targetPink = null;
                i = -1;
                continue;
                }
            if(fullComboArrClone[i] > 0)
                {
                targetPink = pink[i].shift();
                var valueCheck = SumValues(binder[0],targetPink)
                Debug('PrepCombo: valueCheck = ' + valueCheck);
                if(valueCheck == '2.0')
                    {
                    var oldPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                    VerifyCombination(binder[0],targetPink);
                    var newPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                    while(newPink.length <= oldPink.length)
                        {
                        Orion.Wait(1000);
                        newPink = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '2.0')});
                        }
                    pink[10].push(newPink.pop());
                    fullComboArrClone[10]++;
                    targetPink = null;
                    binder[0] = binder.pop();
                    fullComboArrClone[i]--;
                    i = -1;
                    continue;
                    }
                fullComboArrClone[i]--;
                i = -1;
                continue;
                }
            }
        return true;
        }
    return false
    }
    
function ArrayClone(arr)
	{
	var clone = [];
	for(var i=0,len=arr.length;i<len;i++)
		clone[i] = arr[i];
	return clone;
	}

function ArrCombiner(arr1,arr2)
	{ //arr2.length must be >= arr1.length
	var arr1Clone = ArrayClone(arr1);
	var arr2Clone = ArrayClone(arr2);
	for(var i=0,len=arr2Clone.length;i<len;i++)
		{
		if(!arr1Clone[i])
		    continue;
		arr2Clone[i] += arr1Clone[i];
		}
	return arr2Clone;
	}

function OpenBook(_)
    {
    CloseAllGumps();
    var book = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300')
        })[0]; 
    if(!book)
        return false;
    Orion.UseObject(book.Serial());
    if(Orion.WaitForGump(5000,true))
        {
        var gump = Orion.GetGump('any','0x000023C5');
        if(gump !== null)
            {
            updScrollInfo = scrollinfo.filter(function(part)
                {
                return Orion.Contains(gump.ButtonList(), part[3])
                });
            gump.Select(Orion.CreateGumpHook(updScrollInfo[0][3]));
            Orion.Wait(500);
            }
        else
            {
            Debug('OpenBook: Gump didnt match')
            return OpenBook();
            }
        }
    else
        {
        Debug('OpenBook: Gump didnt appear')
        return OpenBook();
        }
    Orion.Wait(1500);
    Debug('OpenBook: Book opened')
    return true;
    }

function ResetPinkBook(_)
    {
    Debug('ResetPinkBook');
    PinkGumpButton(3,500);
    PinkGumpButton(1,500);
    PinkGumpButton(0,500);
    }

function FindNeededPinks(requestArr)
    {
    var valueArr = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','2.0'];
    var neededArr = requestArr.map(function(part,ind)
        {
        if(part == 0)
            return 0;
        var pinks = Orion.FindTypeEx('0x14EF','0x0490').filter(function(pink)
            {
		    return Orion.Contains(pink.Properties(), valueArr[ind]);
            });
        return Math.max(part - pinks.length,0);
        });
    return neededArr;
    }

function CheckInBook(requestArr)
    {
    var updRequestArr = FindNeededPinks(requestArr);
    //var gump = Orion.GetGump(any, '0x000023C5');
    var gump = Orion.GetGump('last');
    var text = gump.TextList();
    //Orion.Print('text: ' + JSON.stringify(text))
    for(var n=0,len=updRequestArr.length;n<len;n++)
        {
        if(updRequestArr[n] == 0)
            continue;
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
        for(var i=0,len=arr.length;i<len;i++)
            {
            for(var ii=0;ii<arr[i];ii++)
                {
                PinkGumpButton(updScrollInfo[0][3] + ('0' + i).slice(-2));
                }
            }
        PinkGumpButton(updScrollInfo[0][1] + 2); //go back from skill
        
        PinkGumpButton(1,500);
        PinkGumpButton(0,500);
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
    
    Debug("VerifyCombination:\n" + binder.Properties());
    if(!Orion.Contains(binder.Properties(), ' ' + sumString))
        {
        Debug("VerifyCombination: Rechecking Binder Tooltip");
        Orion.MoveItem(binder.Serial());
        Orion.Wait(1100);
        if(!Orion.Contains(binder.Properties(), ' ' + sumString))
            {
            Debug("VerifyCombination: Rechecking Binder Tooltip AGAIN");
            return VerifyCombination(binder,pink);
            }
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
    Debug("SumValues: " + binderValue + " + " + pinkValue + " = " + sumString);
    return sumString
    }

function Debug(msg)
    {
    if(Shared.GetVar('debug',false) !== true)
        return;
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print(Orion.Time() + ': ' + msg);
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
            if(packCheck >= 70)
                {
                Orion.CharPrint(self, 1159, 'Backpack full to threshold!');
                //Orion.CloseGump('container', fromContainer);
                return true;
                }
            }
        Orion.MoveItem(binder,0,toContainer);
        Orion.Wait(1200);
        binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
        }
    //Orion.CloseGump('container', fromContainer);
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
		for(var i=0,len=updScrollInfo.length;i<len;i++)
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
    for(var i=0,len=refArr1.length;i<len;i++)
        {
        for(var ii=0,len2=refArr1[i].length;ii<len2;ii++)
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

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function CloseAllGumps()
    {
    var endTime = Orion.Now() + 3000;
    var gump = Orion.GetGump(any);
    while(gump && Orion.Now() < endTime)
        {
        Orion.Print(gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        gump = Orion.GetGump(any);
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