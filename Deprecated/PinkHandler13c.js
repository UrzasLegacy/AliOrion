//v11
//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the last column of scrollinfo array
var maxcount = 7
var scrollinfo = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc
        ['Arms Lore',           0,  0,  1044064,    449999],
        ['Begging',             0,  1,  1044066,    2199999],
        ['Camping',             0,  2,  1044070,    299997],
        ['Cartography',         0,  3,  1044072,    1999999],
        ['Forensics',           0,  4,  1044079,    199999],
        ['Item Identification', 0,  5,  1044063,    40000],
        ['Taste Identification',0,  6,  1044096,    49999],
    //1 Combat
        ['Anatomy',             1,  0,  1044061,    5999999],
        ['Archery',             1,  1,  1044091,    7999999],
        ['Fencing',             1,  2,  1044102,    699999],
        ['Focus',               1,  3,  1044110,    239993],
        ['Healing',             1,  4,  1044077,    19999999],
        ['Mace Fighting',       1,  5,  1044101,    599999],
        ['Parrying',            1,  6,  1044065,    25999998],
        ['Swordsmanship',       1,  7,  1044100,    7999999],
        ['Tactics',             1,  8,  1044087,    32999998],
        ['Throwing',            1,  9,  1044117,    1999997],
        ['Wrestling',           1,  10, 1044103,    2899996],
    //2 Trade Skills
        ['Alchemy',             2,  0,  1044060,    4999999],
        ['Blacksmithing',       2,  1,  1044067,    6999999],
        ['Fletching',           2,  2,  1044068,    1249996],
        ['Carpentry',           2,  3,  1044071,    1699997],
        ['Cooking',             2,  4,  1044073,    1699998],
        ['Inscription',         2,  5,  1044083,    4999999],
        ['Lumberjacking',       2,  6,  1044104,    599998],
        ['Mining',              2,  7,  1044105,    1199999],
        ['Tailoring',           2,  8,  1044094,    8499999],
        ['Tinkering',           2,  9,  1044097,    1599998],
    //3 Magic
        ['Bushido',             3,  0,  1044112,    34999999],
        ['Chivalry',            3,  1,  1044111,    12999999],
        ['Eval Intelligence',   3,  2,  1044076,    7499999],
        ['Imbuing',             3,  3,  1044116,    21999999],
        ['Magery',              3,  4,  1044085,    25999999],
        ['Meditation',          3,  5,  1044106,    174999],
        ['Mysticism',           3,  6,  1044115,    11999999],
        ['Necromancy',          3,  7,  1044109,    9999999],
        ['Ninjitsu',            3,  8,  1044113,    20499999],
        ['Resisting Spells',    3,  9,  1044086,    7399996],
        ['Spellweaving',        3,  10, 1044114,    24499999],
        ['Spirit Speak',        3,  11, 1044092,    2999999],
    //4 Wilderness
        ['Animal Lore',         4,  0,  1044062,    10499999],
        ['Animal Taming',       4,  1,  1044095,    75700000],
        ['Fishing',             4,  2,  1044078,    11499999],
        ['Herding',             4,  3,  1044080,    99995],
        ['Tracking',            4,  4,  1044098,    99995],
        ['Veterinary',          4,  5,  1044099,    7499999],
    //5 Thievery
        ['Detecting Hidden',    5,  0,  1044074,    1499996],
        ['Hiding',              5,  1,  1044081,    3799999],
        ['Lock Picking',        5,  2,  1044084,    4999998],
        ['Poisoning',           5,  3,  1044090,    7399999],
        ['Remove Trap',         5,  4,  1044108,    5699998],
        ['Snooping',            5,  5,  1044088,    149999],
        ['Stealing',            5,  6,  1044093,    3999998],
        ['Stealth',             5,  7,  1044107,    7999999],
    //6 Bard
        ['Discordance',         6,  0,  1044075,    14499999],
        ['Musicianship',        6,  1,  1044089,    1999999],
        ['Peacemaking',         6,  2,  1044069,    5999999],
        ['Provocation',         6,  3,  1044082,    8999999]
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
const combo49Arr = CombinationCall([4,5,6,7,8,9,10],49);
const combo48Arr = CombinationCall([4,5,6,7,8,9,10],48);
const combo47Arr = CombinationCall([4,5,6,7,8,9,10],47);
const combo46Arr = CombinationCall([4,5,6,7,8,9,10],46);
const combo45Arr = CombinationCall([4,5,6,7,8,9,10],45);
const combo44Arr = CombinationCall([4,5,6,7,8,9,10],44);
const combo43Arr = CombinationCall([4,5,6,7,8,9,10],43);
const combo42Arr = CombinationCall([4,5,6,7,8,9,10],42);
const combo41Arr = CombinationCall([4,5,6,7,8,9,10],41);

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
    	TextWindow.Print(JSON.stringify(ArrayFormat(answer)) + ',');
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
    if(binder.length < 2)
        {
        Orion.Print('Need 2 blank scrollbinders in pack! Halting...');
        return false;
        }
    OpenBook();
    if(CheckInBook([0,0,0,0,0,0,0,0,0,0,2]))
        {
        if(PrepCombo([2,1,0],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([0,2,0],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([2,0,1],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([0,1,1],            [0,0,0,0,0,0,0,0,1,0,2]))
            return true;
        if(PrepCombo([0,0,2],            [0,0,0,0,0,0,0,1,0,0,2]))
            return true;
        if(PrepCombo([0,0,1,1],          [0,0,0,0,0,0,0,1,0,0,2]))
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
    if(CheckInBook([2,1,0]))
        {
        for(var i=0;i<combo49Arr.length;i++)
            {
            if(PrepCombo([2,1,0], combo49Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,2,0]))
        {
        for(var i=0;i<combo49Arr.length;i++)
            {
            if(PrepCombo([0,2,0], combo49Arr[i]))
                return true;
            }
        }
    if(CheckInBook([2,0,1]))
        {
        for(var i=0;i<combo49Arr.length;i++)
            {
            if(PrepCombo([2,0,1], combo49Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,1,1]))
        {
        for(var i=0;i<combo49Arr.length;i++)
            {
            if(PrepCombo([0,1,1], combo49Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,2]) || CheckInBook([0,0,1,1]))
        {
        for(var i=0;i<combo48Arr.length;i++)
            {
            if(PrepCombo([0,0,2], combo48Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,1,1]))
        {
        for(var i=0;i<combo48Arr.length;i++)
            {
            if(PrepCombo([0,0,1,1], combo48Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,2]))
        {
        for(var i=0;i<combo47Arr.length;i++)
            {
            if(PrepCombo([0,0,0,2], combo47Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,1,1]))
        {
        for(var i=0;i<combo47Arr.length;i++)
            {
            if(PrepCombo([0,0,0,1,1], combo47Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,2]))
        {
        for(var i=0;i<combo46Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,2], combo46Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,1,1]))
        {
        for(var i=0;i<combo46Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,1,1], combo46Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,2]))
        {
        for(var i=0;i<combo45Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,2], combo45Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,1,1]))
        {
        for(var i=0;i<combo45Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,1,1], combo45Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,2]))
        {
        for(var i=0;i<combo44Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,2], combo44Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,1,1]))
        {
        for(var i=0;i<combo44Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,1,1], combo44Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,0,2]))
        {
        for(var i=0;i<combo43Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,0,2], combo43Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,0,1,1]))
        {
        for(var i=0;i<combo43Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,0,1,1], combo43Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,0,0,2]))
        {
        for(var i=0;i<combo42Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,0,0,2], combo42Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,0,0,1,1]))
        {
        for(var i=0;i<combo42Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,0,0,1,1], combo42Arr[i]))
                return true;
            }
        }
    if(CheckInBook([0,0,0,0,0,0,0,0,0,2]))
        {
        for(var i=0;i<combo41Arr.length;i++)
            {
            if(PrepCombo([0,0,0,0,0,0,0,0,0,2], combo41Arr[i]))
                return true;
            }
        }
    Orion.Print('All out of combos! Halting...')
    return false;
    }

function testPrepCombo()
    {
    var exampleArr1 = [0,0,2];
    var exampleArr2 = [0,0,0,0,0,1,6,0,0,0,0]; // 5 6 7 8 9 10
    //var fullComboArr = ArrCombiner(exampleArr1,exampleArr2)
    //Orion.Print(JSON.stringify(fullComboArr))
    PrepCombo(exampleArr1, exampleArr2);
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
            } //[0,0,2]
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
                Orion.Print('valueCheck = ' + valueCheck)
                if(valueCheck == '1.0' || valueCheck == '2.0')
                    {
                    pink[i].unshift(targetPink);
                    targetPink = null;
                    continue;
                    }
                highComboArrClone[i]--;
                i = -1;
                continue;
                }
            }
            
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
        } 
    }

function FindNeededPinks(requestArr)
    {
    //[.1,.2,.3,.4,.5,.6,.7,.8,.9,1.0,2.0] 
    var neededArr = requestArr.map(function(part,ind)
        {
        var pinks = Orion.FindTypeEx('0x14EF','0x0490').filter(function(pink)
            {
            if(ind == 10)
            	return Orion.Contains(pink.Properties(), '2.0');
		    return Orion.Contains(pink.Properties(), String(((ind+1)/10).toFixed(1)));
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
    //[.1,.2,.3,.4,.5,.6,.7,.8,.9,1.0,2.0] 
    for(var v=0;v<arr.length;v++)
        {
        var verify = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part)
            {
            if(v == 10)
            	return Orion.Contains(part.Properties(), '2.0');
            return Orion.Contains(part.Properties(), String(((v+1)/10).toFixed(1)));
            });
        if(verify.length < arr[v])
            return false;
        }
    return true;
    }

function testVerifyCombination()
    {
    
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
        TextWindow.Print('Trick Failed, trying again');
        return Trick(highBinder, lowBinder, lowPink);
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
    if(PrepCombo([2]))
        {
        var pink1s = Orion.FindTypeEx('0x14EF','0x0490').filter(function(part){return Orion.Contains(part.Properties(), '0.1')});
        VerifyCombination(binder[0],pink1s[0],'0.1');
        VerifyCombination(binder[0],pink1s[1],'0.2');
        return true
        }
    return false
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

function MoveAllBinders(_)
	{
    Orion.CharPrint(self,1159,"Select 'From' container");
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
    Orion.UseObject(fromContainer);
    Orion.Wait(1200);
    var binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
    while(binder)
        {
        var packCheck = +(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/) || [])[1]
        if(packCheck >= 105)
            return Orion.CharPrint(self, 1159, 'Backpack full to threshold! Halting...');
        Orion.MoveItem(binder,0,toContainer);
        Orion.Wait(1200);
        binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
        }
	}    

//--------------------------------------------------------------------------End Combiner Script
//--#Sorter
//--------------------------------------------------------------------------Begin Sorter Script
function PinkSort()
    {
    var unsortedContainer = Orion.FindTypeEx('0x09AA', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Unsorted')
        })[0];
    var emptiesContainer = Orion.FindTypeEx('0x09AA', '0x0000', ground, '', 2).filter(function(part)
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
            Orion.Wait(1200);
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
                Orion.Wait(1200);
                }
            else
                return Orion.Print('No more unsorted books! Halting...');
            }
        EmptyPinkBook();
        PinkDrop(bookArr1, bookArr2, bookArr1reference)
        Orion.Wait(1100);
        }
    }

function EmptyPinkBook()
	{
	var latency = 50;
	var updScrollInfo;
	var book = Orion.FindTypeEx('0x577E', '0x0490').filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Scrolls In Book: 0/300');
        });
	if(book[0])
		{
            Orion.UseObject(book[0].Serial());
		if(Orion.WaitForGump(2000))
			{
			var gump = Orion.GetGump('last');
			if ((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000023C5'))
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
			if(Orion.WaitForGump(1000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
					{
					gump0.Select(Orion.CreateGumpHook(updScrollInfo[i][3]));
					Orion.Wait(latency);
					}
				if(Orion.WaitForGump(1000))
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
				if(Orion.WaitForGump(1000))
					{
					var gump2 = Orion.GetGump('last');
					var amount = gump2.TextList()[b];
					//Orion.Print(amount);
					if(amount == '0')
						continue;
					for(var a=0;a<amount;a++)
						{
                        PinkGumpButton(updScrollInfo[i][3] + ('0' + b).slice(-2), latency);//take out scroll
						if(Number((Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/) || [])[1]) >= 110)
							{
                            PinkGumpButton(0);
                            return Orion.Print('Scrolls ready to sort in backpack');
                            }
                        }
					if(Orion.WaitForGump(1000))
						{
						var gumpcheck = Orion.GetGump('last');
						if(gumpcheck.TextList()[b] != '0')
							b--
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
			Orion.Print(bookArr1[ pinkArr[1] ][ pinkArr[2] ]);
            var startScan = Orion.Now();
			Orion.MoveItem(pink.Serial(), 0, bookArr1[ pinkArr[1] ][ pinkArr[2] ]);
			Orion.Wait(1200);
            if(Orion.InJournal('This book is full.', 'sys', '0', 'any', startScan))
                {
                Orion.Print('Debug: InJournal')
                bookArr1[ pinkArr[1] ][ pinkArr[2] ] = bookArr2[ pinkArr[1] ][ pinkArr[2] ];
                Orion.ClearJournal('This book is full.');
                if(BooksFullCheck(refArr1))
                    {
                    TextWindow.Open();
                    TextWindow.Print('One set of books is completely full! Halting...');
                    Orion.Terminate('all','GMJournalScan');
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
	var sortedContainer1 = Orion.FindTypeEx('0x09AA', '0x0000', ground, '', 2).filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'Engraved: Sorted1')
        })[0];
	var sortedContainer2 = Orion.FindTypeEx('0x09AA', '0x0000', ground, '', 2).filter(function(part)
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
            bookArrReference1.push(books);
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
            bookArrReference2.push(books);
            });
    if(comparator1 > comparator2)
        var fullBookArr = [bookArrDefine1, bookArrDefine2, bookArrReference1, bookArrReference2];
    else
        var fullBookArr = [bookArrDefine2, bookArrDefine1, bookArrReference2, bookArrReference1];
   	return fullBookArr;
	}

function VerifyOpenContainer(containerSerial)
    {
    while(!Orion.GumpExists('container', containerSerial))
        {
        Orion.UseObject(containerSerial);
        Orion.Wait(1300);
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
			Orion.MoveItem(emptyBook,0,'toContainer',pos[coord].X,pos[coord].Y);
			Orion.Wait(1300);
			}
		}
	}

//--------------------------------------------------------------------------End Sorter Script
//--#Crafting
//--------------------------------------------------------------------------Begin Crafting Script
function MakeWoodPulp()
	{
	Orion.SetSearchArea(2147, 3428, 2147, 3428);
	var supplyContainer = Orion.FindTypeEx('0x09AA|0x0E7D', any, ground, 'item', 24)[0];
    Orion.ResetSearchArea();
    if(!supplyContainer)
        return Orion.Print('Supply container not found! Halting');
	while(true)
		{
        if(Player.X() != 2148 || Player.Y() != 3427)
            Orion.WalkTo(2148, 3427, 255, 0);
        var bbq = Orion.FindTypeEx('0x9D98|0x9D99', any, ground, 'item', 2);
        if(!bbq[0])
            return Orion.Print('BBQ not found! Halting...');
        var bbqHopper = Orion.FindTypeEx('0x9D9D', any, ground, 'item', 1);
        if(!bbqHopper[0])
            return Orion.Print('BBQ chest not found! Halting...');
		while(!Orion.GumpExists('container', supplyContainer.Serial()))
			{
			Orion.UseObject(supplyContainer.Serial());
			Orion.Wait(1200);
			}
        var bbqCount = Number(bbq[0].Properties().match(/Uses Remaining: (\d*)/)[1]);
        while(bbqCount < 500)
            {
            var skillets = Orion.FindType('0x097F', any, supplyContainer.Serial());
            if(!skillets[0])
                return Orion.Print('Out of skillets! Halting...');
            Orion.DragItem(skillets[0]);
            Orion.Wait(600);
            Orion.DropDraggedItem(bbqHopper[0].Serial());
            Orion.Wait(300);
            bbqCount = Number(bbq[0].Properties().match(/Uses Remaining: (\d*)/)[1]);
            Orion.Wait(300);
            }
        while(!Orion.FindType('0x1F9D','0x047E').length)
			{
			var decanter = Orion.FindType('0x1F9D','0x047E', supplyContainer.Serial());
			if(!decanter[0])
				return Orion.Print('Decanter missing! Halting...');
			Orion.MoveItem(decanter[0]);
			Orion.Wait(1200);
			}
        while(!Orion.FindType('0x318F').length)
			{
			var bark = Orion.FindType('0x318F', any, supplyContainer.Serial());
			if(!bark[0])
				return Orion.Print('Out of Bark Fragments! Halting...');
			var amount = Player.MaxWeight() - Player.Weight() - 10;
			Orion.MoveItem(bark[0], amount);
			Orion.Wait(1200);
			}
		Orion.UseObject(bbq[0].Serial());
		if(Orion.WaitForGump(2000))
			{
			var gump0 = Orion.GetGump('last');
			if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC'))
				{
				gump0.Select(Orion.CreateGumpHook(9002));
				Orion.Wait(100);
				}
			}
		if(Orion.WaitForGump(2000))
			{
			var gump1 = Orion.GetGump('last');
			if((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001CC'))
				{
				gump1.Select(Orion.CreateGumpHook(1057));
				Orion.Wait(100);
				}
			}
		if(Orion.WaitForGump(2000))
			{
			var gump2 = Orion.GetGump('last');
			if((gump2 !== null) && (!gump2.Replayed()) && (gump2.ID() === '0x000002AD'))
				{
				gump2.Select(Orion.CreateGumpHook(11057));
				Orion.Wait(100);
				}
			}
		while(Orion.Count('0x318F', any, backpack))
			{
            Orion.Wait(2500);
            Orion.UseObject(backpack);
			Orion.Wait(2500);
			}
		var pulp = Orion.FindType('0x26B8');
		if(pulp.length)
			{
			Orion.MoveItem(pulp[0], 0, supplyContainer.Serial());
			Orion.Wait(1200);
			}
		}
	}

function MakeBinders()
	{
    Orion.SetSearchArea(2147, 3428, 2147, 3428);
    var supplyContainer = Orion.FindTypeEx('0x09AA|0x0E7D', any, ground, 'item', 24)[0];
    Orion.ResetSearchArea();
    if(!supplyContainer)
        return Orion.Print('Supply container not found! Halting');
	while(true)
		{
        if(Player.X() != 2147 || Player.Y() != 3427)
            Orion.WalkTo(2147, 3427, 255, 0);
        var desk = Orion.FindTypeEx('0x9FEA|0x9FEB', any, ground, 'item', 1);
        if(!desk[0])
            return Orion.Print('Writing Desk not found! Halting...');
        var deskHopper = Orion.FindTypeEx('0x9FF9', any, ground, 'item', 1);
        if(!deskHopper[0])
            return Orion.Print('Writing Desk chest not found! Halting...');
		while(!Orion.GumpExists('container', supplyContainer.Serial()))
			{
			Orion.UseObject(supplyContainer.Serial());
			Orion.Wait(1100);
			}
        var deskCount = Number(desk[0].Properties().match(/Uses Remaining: (\d*)/)[1]);
        while(deskCount < 500)
			{
			var pens = Orion.FindType('0x0FBF', any, supplyContainer.Serial());
			if(!pens[0])
				return Orion.Print('Out of scribe pens! Halting...');
			Orion.DragItem(pens[0]);
			Orion.Wait(600);
            Orion.DropDraggedItem(deskHopper[0].Serial());
            Orion.Wait(300);
            deskCount = Number(desk[0].Properties().match(/Uses Remaining: (\d*)/)[1]);
            Orion.Wait(300);
			}
		var pouch = Orion.FindType('0x0E79');
        while(!Orion.FindType('0x0E79').length)
			{
			pouch = Orion.FindType('0x0E79', any, supplyContainer.Serial());
			if(!pouch[0])
				return Orion.Print('Pouch missing! Halting...');
			Orion.MoveItem(pouch[0]);
			Orion.Wait(1100);
			}
        while(!Orion.GumpExists('container', pouch[0]))
			{
			Orion.UseObject(pouch[0]);
			Orion.Wait(1100);
			}
		var haveAmount = Orion.Count('0x26B8', any, pouch[0]) + Orion.FindType('0x14EF','0x0664',pouch[0]).length
        while(haveAmount < 120)
			{
			var pulp = Orion.FindType('0x26B8', any, supplyContainer.Serial());
			var neededAmount = 120 - haveAmount;
            if(Orion.Count('0x26B8', any, supplyContainer.Serial()) < neededAmount)
				return Orion.Print('Out of Wood Pulp! Halting...');
            Orion.MoveItem(pulp[0], neededAmount, pouch[0]);
            Orion.Wait(600);
            haveAmount = Orion.Count('0x26B8', any, pouch[0]) + Orion.FindType('0x14EF','0x0664',pouch[0]).length
			Orion.Wait(600);
			}
		while(Orion.Count('0x26B8', any, pouch[0]))
			{
            Orion.UseObject(desk[0].Serial());
            if(Orion.WaitForGump(2000))
                {
                var gump0 = Orion.GetGump(all, '0x000001CC');
                if(gump0 !== null)
                    {
                    gump0.Select(Orion.CreateGumpHook(9006));
                    Orion.Wait(200);
                    }
                }
            if(Orion.WaitForGump(2000))
                {
                var gump1 = Orion.GetGump(all, '0x000001CC');
                if(gump1 !== null)
                    {
                    gump1.Select(Orion.CreateGumpHook(1301));
                    Orion.Wait(200);
                    }
                }
            if(Orion.WaitForGump(2000))
                {
                var gump3 = Orion.GetGump(all, '0x000001CC');
                if(gump3 !== null)
                    {
                    gump3.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    }
                }
			Orion.Wait(1200);
			}
        if(Orion.FindType('0x14EF','0x0664',pouch[0]).length > 119)
            {
            Orion.WalkTo(2135, 3430);
            Orion.Wait(600);
            Orion.Drop(pouch[0], 0, 2135, 3430, Player.Z());
            Orion.Wait(600);
            var pouchObj = Orion.FindObject(pouch[0]);
            while(!Orion.Contains(pouchObj.Properties(), 'Locked Down'))
                {
                Orion.Say('i wish to secure this');
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(pouch[0]);
                if(Orion.WaitForGump(2000))
                    {
                    var gump4 = Orion.GetGump(all, '0x00000295');
                    if(gump4 !== null)
                        {
                        gump4.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(200);
                        }
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var gump5 = Orion.GetGump(all, '0x00000295');
                    if(gump5 !== null)
                        {
                        gump5.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(200);
                        }
                    }
                Orion.Wait(600);
                }
            }
		}
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
    Orion.Wait(200);
    var elapsedTime = Orion.Now() - startTime;
    if(elapsedTime < 1300)
        Orion.Wait(1300 - elapsedTime);
    }

function Restock(graphicID, supplyContainerSerial, amount, colorID)
    {
    if(!colorID)
        colorID = any;
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if(needed > 0 && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + graphicID);
        return Orion.PauseScript('all');
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
    }
//--------------------------------------------------------------------------End Crafting Script

function MakeWoodPulp1()
	{
	Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
	var supplyContainer = Orion.GetSerial('myTarget');
	while(true)
		{
        while(!Orion.FindType('0x097F')[0]) //skillet check
            {
            while(Orion.Count('0x1BF2') < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                Restock('0x1BF2', supplyContainer, 50);
                }
            while(!Orion.FindType('0x1EB9')[0])
                {
                Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                Restock('0x1EB9', supplyContainer, 0);
                }
            if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                {
                Orion.CharPrint(self,1159,'Crafting Skillet');
                CraftItem('0x1EB9', 9003, 26);
                }   
            else
                {
                Orion.CharPrint(self,1159,'Restocking Skillet');
                Restock('0x097F', supplyContainer, 0);
                }
            }
        while(!Orion.FindType('0x1F9D','0x047E')[0]) //decanter check
			{
            Orion.CharPrint(self,1159,'Restocking Decanter');
            Restock('0x1F9D', supplyContainer, 0, '0x047E');
			}
        while(!Orion.FindType('0x318F')[0]) //bark check
			{
            while(Orion.FindType('0x26B8')[0]) //pulp check
                {
                var pulp = Orion.FindType('0x26B8')[0]
                Orion.MoveItem(pulp, 0, supplyContainer)
                Orion.Wait(1300);
                }
            Orion.CharPrint(self,1159,'Restocking Bark Fragments');
            Restock('0x318F', supplyContainer, Player.MaxWeight() - Player.Weight() - 10);
			}
		CraftItem('0x097F',9002,57);
		}
	}

function MakeBinders1()
	{
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
	while(true)
		{
        while(!Orion.FindType('0x0E79').length)
			{
            Orion.CharPrint(self,1159,'Restocking Pouch');
            Restock('0x0E79', supplyContainer, 0)
			}
        var pouch = Orion.FindType('0x0E79');
        while(!Orion.GumpExists('container', pouch[0]))
			{
			Orion.UseObject(pouch[0]);
			Orion.Wait(1300);
			}
		var haveAmount = Orion.Count('0x26B8', any, pouch[0]) + Orion.FindType('0x14EF','0x0664',pouch[0]).length
        while(haveAmount < 120)
			{
			var pulp = Orion.FindType('0x26B8', any, supplyContainer);
			var neededAmount = 120 - haveAmount;
            if(Orion.Count('0x26B8', any, supplyContainer) < neededAmount)
				return Orion.Print('Out of Wood Pulp! Halting...');
            Orion.MoveItem(pulp[0], neededAmount, pouch[0]);
            Orion.Wait(1300);
            haveAmount = Orion.Count('0x26B8', any, pouch[0]) + Orion.FindType('0x14EF','0x0664',pouch[0]).length
			}
		while(Orion.Count('0x26B8', any, pouch[0]) && Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)
			{
            while(!Orion.FindType('0x0FBF')[0]) //pen check
                {
                while(Orion.Count('0x1BF2') < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    Restock('0x1BF2', supplyContainer, 50);
                    }
                while(!Orion.FindType('0x1EB9')[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                    Restock('0x1EB9', supplyContainer, 0);
                    }
                if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                    {
                    Orion.CharPrint(self,1159,'Crafting Pen');
                    CraftItem('0x1EB9', 9003, 30);
                    }   
                else
                    {
                    Orion.CharPrint(self,1159,'Restocking Pen');
                    Restock('0x0FBF', supplyContainer, 0);
                    }
                }
            CraftItem('0x0FBF',9006,301);
			}
        if(Orion.FindType('0x14EF','0x0664',pouch[0]).length > 119)
            {
            //Orion.WalkTo(2135, 3430);
            //Orion.Wait(600);
            //Orion.Drop(pouch[0], 0, 2135, 3430, Player.Z());
            Orion.Drop(pouch[0], 0, Player.X() - 1, Player.Y(), Player.Z());
            Orion.Wait(1200);
            var pouchObj = Orion.FindObject(pouch[0]);
            while(!Orion.Contains(pouchObj.Properties(), 'Locked Down'))
                {
                Orion.Say('i wish to secure this');
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(pouch[0]);
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
                Orion.Wait(1000);
                }
            }
		}
	}