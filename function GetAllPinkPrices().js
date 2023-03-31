var scrollinfoAtlantic = //[skillname, categoryindex, skillindex, bookbutton, price]
	[
	//0 Misc Atlantic
		["Arms Lore",           0,  0,  1044064,    999999],
		["Begging",             0,  1,  1044066,    3999999],
		["Camping",             0,  2,  1044070,    29999],
		["Cartography",         0,  3,  1044072,    7999999],
		["Forensics",           0,  4,  1044079,    49999],
		["Item Identification", 0,  5,  1044063,    29999],
		["Taste Identification",0,  6,  1044096,    29999],
	//1 Combat Atlantic
		["Anatomy",             1,  0,  1044061,    11999999],
		["Archery",             1,  1,  1044091,    7999999],
		["Fencing",             1,  2,  1044102,    2999999],
		["Focus",               1,  3,  1044110,    499999],
		["Healing",             1,  4,  1044077,    7999999],
		["Mace Fighting",       1,  5,  1044101,    999999],
		["Parrying",            1,  6,  1044065,    9999999],
		["Swordsmanship",       1,  7,  1044100,    17999999],
		["Tactics",             1,  8,  1044087,    14999999],
		["Throwing",            1,  9,  1044117,    499999],
		["Wrestling",           1,  10, 1044103,    4999997],
	//2 Trade Skills Atlantic
		["Alchemy",             2,  0,  1044060,    14999991],
		["Blacksmithing",       2,  1,  1044067,    9487997],
		["Fletching",           2,  2,  1044068,    5999999],
		["Carpentry",           2,  3,  1044071,    7999999],
		["Cooking",             2,  4,  1044073,    9999999],
		["Inscription",         2,  5,  1044083,    7399999],
		["Lumberjacking",       2,  6,  1044104,    1749993],
		["Mining",              2,  7,  1044105,    2099999],
		["Tailoring",           2,  8,  1044094,    8699998],
		["Tinkering",           2,  9,  1044097,    9999998],
	//3 Magic Atlantic
		["Bushido",             3,  0,  1044112,    49999999], 
		["Chivalry",            3,  1,  1044111,    9999998],
		["Eval Intelligence",   3,  2,  1044076,    17999999],
		["Imbuing",             3,  3,  1044116,    19999999],
		["Magery",              3,  4,  1044085,    17999999],
		["Meditation",          3,  5,  1044106,    399997],
		["Mysticism",           3,  6,  1044115,    14999999],
		["Necromancy",          3,  7,  1044109,    14999999],
		["Ninjitsu",            3,  8,  1044113,    29999999],
		["Resisting Spells",    3,  9,  1044086,    14999999],
		["Spellweaving",        3,  10, 1044114,    7999999],
		["Spirit Speak",        3,  11, 1044092,    6999999],
	//4 Wilderness Atlantic
		["Animal Lore",         4,  0,  1044062,    14999999],
		["Animal Taming",       4,  1,  1044095,    49999999],
		["Fishing",             4,  2,  1044078,    7999999],
		["Herding",             4,  3,  1044080,    49999],
		["Tracking",            4,  4,  1044098,    4999999],
		["Veterinary",          4,  5,  1044099,    19999999],
	//5 Thievery Atlantic
		["Detecting Hidden",    5,  0,  1044074,    2999999],
		["Hiding",              5,  1,  1044081,    4999999],
		["Lock Picking",        5,  2,  1044084,    7999999],
		["Poisoning",           5,  3,  1044090,    29999996],
		["Remove Trap",         5,  4,  1044108,    3999999],
		["Snooping",            5,  5,  1044088,    49999],
		["Stealing",            5,  6,  1044093,    4999999],
		["Stealth",             5,  7,  1044107,    4999999],
	//6 Bard Atlantic
		["Discordance",         6,  0,  1044075,    29999999],
		["Musicianship",        6,  1,  1044089,    2999999],
		["Peacemaking",         6,  2,  1044069,    2999998],
		["Provocation",         6,  3,  1044082,    3999998],
	]

var pinkArr = [];
function CheckAllNearbyVendors()
    {
    var vendors = Orion.FindTypeEx(any,any,ground,'live',24,'yellow').filter(function(npc)
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
    TextWindow.Open();
    TextWindow.Print('Starting Vendor Check');
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
            var symbol = '=';
            if(lowPrice < skillPrice)
                symbol = '-';
            else if(lowPrice > skillPrice)
                symbol = '+';
            var skillMsg = symbol + '\t' + (lowPrice - 1) + '/' + skillPrice + ':\t' + skillName + ':\t' + JSON.stringify(skillPinks);
            TextWindow.Print(skillMsg);
            outMsg += skillMsg + '\n';
            }
        }
    TextWindow.Print('Ending Vendor Check');
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
