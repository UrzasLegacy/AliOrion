//v11ALT
//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the last column of scrollinfo array
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

//------------------------------------------------------------------------End Gump Script
//--#Vendor
//------------------------------------------------------------------------Begin Vendor Script
//Positional Data
var xstart = 48;
var xend = 142;
    var xoffset = 4;
var ystart = 64;
var yend = 121;
    var yoffset = 28;
var column1 = xstart+xoffset*0;
var column2 = xstart+xoffset*1;
var column3 = xstart+xoffset*2;
var column4 = xstart+xoffset*3;
var column5 = xstart+xoffset*4;
var column6 = xstart+xoffset*5;
var column7 = xstart+xoffset*6;
var column8 = xstart+xoffset*7;
var column9 = xstart+xoffset*8;
var column10 = xstart+xoffset*9;
var column11 = xstart+xoffset*10;
var column12 = xstart+xoffset*11;
var column13 = xstart+xoffset*12;
var column14 = xstart+xoffset*13;
var column15 = xstart+xoffset*14;
var column16 = xstart+xoffset*15;
var column17 = xstart+xoffset*16;
var column18 = xstart+xoffset*17;
var column19 = xstart+xoffset*18;
var column20 = xstart+xoffset*19;
var row1 = ystart+yoffset*0;
var row2 = ystart+yoffset*1;
var row3 = ystart+yoffset*2;
var pos =
    [
        [column1, row1],
        [column2, row1],
        [column3, row1],
        [column4, row1],
        [column5, row1],
        [column6, row1],
        [column7, row1],
        [column8, row1],
        [column9, row1],
        [column10, row1],
        [column11, row1],
        [column12, row1],
        [column13, row1],
        [column14, row1],
        [column15, row1],
        [column16, row1],
        [column17, row1],
        [column18, row1],
        [column19, row1],
        [column20, row1],
        [column1, row2],
        [column2, row2],
        [column3, row2],
        [column4, row2],
        [column5, row2],
        [column6, row2],
        [column7, row2],
        [column8, row2],
        [column9, row2],
        [column10, row2],
        [column11, row2],
        [column12, row2],
        [column13, row2],
        [column14, row2],
        [column15, row2],
        [column16, row2],
        [column17, row2],
        [column18, row2],
        [column19, row2],
        [column20, row2],
        [column1, row3],
        [column2, row3],
        [column3, row3],
        [column4, row3],
        [column5, row3],
        [column6, row3],
        [column7, row3],
        [column8, row3],
        [column9, row3],
        [column10, row3],
        [column11, row3],
        [column12, row3],
        [column13, row3],
        [column14, row3],
        [column15, row3],
        [column16, row3],
        [column17, row3],
        [column18, row3],
        [column19, row3],
        [column20, row3],
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
            var pinkInd = scrollinfo.indexOf(pinkArr);
            var price = pinkArr[4] - 1;
            var xpos = pos[ pinkInd ][0];
            var ypos = pos[ pinkInd ][1];
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
                if(Number(pinkPrice) != pinkArr[4] - 1)
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
        if(packCheck >= 114)
            return Orion.CharPrint(self, 1159, 'Backpack full to threshold! Halting...');
        Orion.MoveItem(binder,0,toContainer);
        Orion.Wait(1200);
        binder = Orion.FindType('0x14EF','0x0664',fromContainer)[0];
        }
	}