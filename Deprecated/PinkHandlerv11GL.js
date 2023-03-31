//v11
//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the last column of scrollinfo array
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
//ATTENTION THIS IS FOR GL --------------------------------------------------------------------------->>>>>
var maxcount = 7
var scrollinfo = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc
        ['Arms Lore',           0,  0,  1044064,    2000000],
        ['Begging',             0,  1,  1044066,    2000000],
        ['Camping',             0,  2,  1044070,    300000],
        ['Cartography',         0,  3,  1044072,    4000000],
        ['Forensics',           0,  4,  1044079,    350000],
        ['Item Identification', 0,  5,  1044063,    350000],
        ['Taste Identification',0,  6,  1044096,    350000],
    //1 Combat
        ['Anatomy',             1,  0,  1044061,    9000000],
        ['Archery',             1,  1,  1044091,    12000000],
        ['Fencing',             1,  2,  1044102,    2000000],
        ['Focus',               1,  3,  1044110,    350000],
        ['Healing',             1,  4,  1044077,    27500000],
        ['Mace Fighting',       1,  5,  1044101,    2000000],
        ['Parrying',            1,  6,  1044065,    35000000],
        ['Swordsmanship',       1,  7,  1044100,    19000000],
        ['Tactics',             1,  8,  1044087,    42000000],
        ['Throwing',            1,  9,  1044117,    3000000],
        ['Wrestling',           1,  10, 1044103,    5000000],
    //2 Trade Skills
        ['Alchemy',             2,  0,  1044060,    8400000],
        ['Blacksmithing',       2,  1,  1044067,    8000000],
        ['Fletching',           2,  2,  1044068,    4000000],
        ['Carpentry',           2,  3,  1044071,    4000000],
        ['Cooking',             2,  4,  1044073,    4000000],
        ['Inscription',         2,  5,  1044083,    5000000],
        ['Lumberjacking',       2,  6,  1044104,    3000000],
        ['Mining',              2,  7,  1044105,    3000000],
        ['Tailoring',           2,  8,  1044094,    15000000],
        ['Tinkering',           2,  9,  1044097,    5000000],
    //3 Magic
        ['Bushido',             3,  0,  1044112,    53000000],
        ['Chivalry',            3,  1,  1044111,    25000000],
        ['Eval Intelligence',   3,  2,  1044076,    10000000],
        ['Imbuing',             3,  3,  1044116,    29000000],
        ['Magery',              3,  4,  1044085,    34000000],
        ['Meditation',          3,  5,  1044106,    350000],
        ['Mysticism',           3,  6,  1044115,    24000000],
        ['Necromancy',          3,  7,  1044109,    15000000],
        ['Ninjitsu',            3,  8,  1044113,    22000000],
        ['Resisting Spells',    3,  9,  1044086,    25000000],
        ['Spellweaving',        3,  10, 1044114,    35000000],
        ['Spirit Speak',        3,  11, 1044092,    3000000],
    //4 Wilderness
        ['Animal Lore',         4,  0,  1044062,    13000000],
        ['Animal Taming',       4,  1,  1044095,    75000000],
        ['Fishing',             4,  2,  1044078,    25000000],
        ['Herding',             4,  3,  1044080,    1000000],
        ['Tracking',            4,  4,  1044098,    1000000],
        ['Veterinary',          4,  5,  1044099,    12000000],
    //5 Thievery
        ['Detecting Hidden',    5,  0,  1044074,    5000000],
        ['Hiding',              5,  1,  1044081,    5000000],
        ['Lock Picking',        5,  2,  1044084,    5000000],
        ['Poisoning',           5,  3,  1044090,    15000000],
        ['Remove Trap',         5,  4,  1044108,    8000000],
        ['Snooping',            5,  5,  1044088,    350000],
        ['Stealing',            5,  6,  1044093,    7500000],
        ['Stealth',             5,  7,  1044107,    8000000],
    //6 Bard
        ['Discordance',         6,  0,  1044075,    22000000],
        ['Musicianship',        6,  1,  1044089,    3000000],
        ['Peacemaking',         6,  2,  1044069,    9000000],
        ['Provocation',         6,  3,  1044082,    15000000]
    ];

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

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'Are you there|Begin GM Chat';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'Are':		
				case 'Begin':
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

//------------------------------------------------------------------------Begin Gump Script
var buttons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, 3, "RepeatCombo", 'RepeatCombo'] ],
        [],
        [ [100, 30, 4, "Comb1sto2", 'Comb1sto2'], [100, 30, 5, "Comb2to2", 'Comb2to2'], [100, 30, 6, "Comb3to3", 'Comb3to3'] ],
        [ [100, 30, 7, "Comb9to9", 'Comb9to9'], [100, 30, 8, "Comb4&5to9", 'Comb4and5to9'], [100, 30, 9, "20sand9binder", 'Comb20sandbound9to49'] ],
        [ [100, 30, 10, "Comb49", 'Comb49'], [100, 30, 11, "Comb7sto49", 'Comb7sto49'], [100, 30, 12, "Trick", 'Trick'] ],
        [],
        [ [100, 30, 13, "MoveAllPinks", 'MoveAllScrollsInPack'], [100, 30, 14, "MoveAll5s", 'MoveAll5sInPack'], [100, 30, 15, "MoveAllBinders", 'MoveAllBinders'] ],
        [ [100, 30, 16, "CountInPack", 'CountInPack'], [100, 30, 17, "GridToggle", 'ContainerGumpToggle'] ],
        [],
        [ [100, 30, 18, "PinkToVendor", 'PinkToVendor'], [100, 30, 19, "GetAllVendorGold", 'GetAllVendorGold'] ],
        [],
        [ [100, 30, 20, "PinkSort", 'PinkSort'], [100, 30, 21, "EmptyPinkBook", 'EmptyPinkBook'], [100, 30, 22, "Set Security", 'CoOwnerAccessSortContainer'] ],
        [ [100, 30, 23, "ReplaceSortBooks", 'ReplaceSortBooks'] ],
        [],
        [ [100, 30, 24, "MakeWoodPulp", 'MakeWoodPulp'], [100, 30, 25, "MakeBinders", 'MakeBinders'] ]
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

//------------------------------------------------------------------------End Gump Script
//--#Vendor
//------------------------------------------------------------------------Begin Vendor Script
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

function PinkToVendor()
	{
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
    Orion.CharPrint(self,1159,'Select vendor');
    Orion.WaitForAddObject('myTarget');
	var vendor = Orion.FindObject('myTarget');
	Orion.UseObject(vendor.Serial());
	VendorGumpButton(1, 1000);
	var vendorContainer = Orion.GetSerial(lastcontainer);
    VerifyPrices(vendorContainer);
	var groups = ['Misc', 'Combat', 'Trade Skills', 'Magic', 'Wilderness', 'Thievery', 'Bard'];
	var group = groups.indexOf(vendor.Name());
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
        //return Orion.Print('Vendor is already fully stocked! Halting...');
        Orion.SetSearchArea(vendor.X(),vendor.Y(), vendor.X(),vendor.Y());
        var bookPouch = Orion.FindType('0x0E75', any, ground, 'item', 2)[0];
        Orion.ResetSearchArea();
        if(bookPouch)
            Orion.UseObject(bookPouch);
        else
            return Orion.Print('Book Pouch not found! Halting...');
        Orion.Wait(1500);
        var book = Orion.FindType('0x577E', '0x0490', bookPouch, 'item', 2)[0];
        Orion.UseObject(book);
        Orion.Wait(1500);
        if(!PinkPull(updScrollInfo, requestArr))
            {
            Orion.Print('Retrying book pull one more time...');
            requestArr = PinkBookRequestCount(updScrollInfo,vendorContainer);
            if(!PinkPull(updScrollInfo, requestArr))
                {
                TextWindow.Open();
                TextWindow.Print('Restock Vendor Book: ' + vendor.Name() + ': ' + PinkBookRequestCount(updScrollInfo,vendorContainer));
                }
            }
        PinkGumpButton(0);
        }
    var verifyCheck = false;
	while(PutToVendor(vendorContainer))
        {
        verifyCheck = true;
        Orion.Wait(100);
        }
    if(verifyCheck)
        {
        Orion.Print('Finished putting scrolls on vendor! Verifying prices...');
        Orion.CloseGump('container', vendorContainer);
        Orion.Wait(1100);
        Orion.UseObject(vendor.Serial());
        VendorGumpButton(1, 1000);
        Orion.Wait(1100);
        var vendorContainer = Orion.GetSerial(lastcontainer);
        VerifyPrices(vendorContainer);
        }
	}

function MonitorVendorsForSales()
	{
	var vendors = '0x064028DF|0x064026A8|0x064022C9|0x06401FE1|0x06401F29|0x06401F19|0x03E20F6F'
	while(true)
		{
		var check = Orion.WaitJournal('',Orion.Now(),0,'mobile',vendors);
		var vendor = Orion.FindObject(check.Serial());
		if(check.Text() == 'Take a look at my goods.')
            {
            var hook = '949444453188390982';
			var key = 'zBJe--X6khd7MuFOomtx_JFaHUDDIOWXCO4cTK_vJIKa0rdO9MUNgAh6EYF7ZNr8GRTb';
		    var bot =
		        "https://discordapp.com/api/webhooks/"
		        + hook
		        + "/"
		        + key; // Webhook url
		    var paramText = "content=" + vendor.Name();
		    Orion.HttpPost(bot, paramText);
            Orion.Wait(2000);
            }
        }
	}

function GetAllVendorGold()
	{
	var gump = Orion.GetGump('last');
	if ((gump !== null) && (gump.ID() === '0x000002AB'))
		{
		var gold = Orion.Split(gump.Text(2), ',').join('');
		gump.Select(Orion.CreateGumpHook(7));
		if(Orion.WaitJournal('How much of the', Orion.Now(), Orion.Now() + 2000))
			Orion.SendPrompt(gold);
		}
	Orion.CancelWaitPrompt();
	}

function PinkBookRequestCount(categoryArr,vendorContainer)
	{
	var requestcountarr = categoryArr.map(function(skill)
        {
        var countVendor = Orion.FindTypeEx('0x14EF','0x0490',vendorContainer).filter(function(part){return Orion.Contains(part.Properties(), skill[0])}).length;
        var countBackpack = Orion.FindTypeEx('0x14EF','0x0490',backpack).filter(function(part){return Orion.Contains(part.Properties(), skill[0])}).length;
        var needed = maxcount - countVendor - countBackpack;
        return needed;
        });
	return requestcountarr;
	}

function PinkPull(updScrollInfo, requestArr)
	{
	for(var i=0;i<updScrollInfo.length;i++)
		{
		if(!requestArr[i])
			continue;
        var skillButton = updScrollInfo[i][3];
		var skillButton50 = skillButton + '12';
		var backbutton = updScrollInfo[i][1] + 2;
        PinkGumpButton(skillButton, 200);
		for(var c=0;c<requestArr[i];c++)
			{
			PinkGumpButton(skillButton50);
			}
        PinkGumpButton(backbutton, 200);
        }
    if(Verify5s(updScrollInfo, requestArr))
        {
        Orion.Print('All pinks verified in pack.');
        return true;
        }
    else
        {
        Orion.Print('Some pinks are missing! Either book is out of that skill or lag happened!');
        return false;
        }
    }

function PutToVendor(vendorContainer)
	{
    var pinks = Orion.FindTypeEx('0x14EF', '0x0490').sort(function(a, b)
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
            Orion.WaitPrompt(price);
			Orion.Wait(600);
			Orion.MoveItem(pinks[0].Serial(), 0, vendorContainer, xpos, ypos);
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

function PinkGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('last');
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000023C5'))
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


function MoveAllScrollsInPack(_)
	{
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var container = Orion.FindObject('myTarget');
	for(var attempts = 0;attempts < 2;attempts++)
		{
		var scrolls = Orion.FindTypeEx('0x14EF','0x0490')
		for(var i=0;i<scrolls.length;i++)
			{
			Orion.MoveItem(scrolls[i].Serial(),0,container.Serial())
			Orion.Wait(1000);
			}
		}
	}
function MoveAll5sInPack(_)
	{
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var container = Orion.FindObject('myTarget');
	for(var attempts = 0;attempts < 2;attempts++)
		{
		var scrolls = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part)
					{
					return Orion.Contains(part.Properties(), '5.0 Skill');
					});
		for(var i=0;i<scrolls.length;i++)
			{
			Orion.MoveItem(scrolls[i].Serial(),0,container.Serial());
			Orion.Wait(1000);
			}
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
