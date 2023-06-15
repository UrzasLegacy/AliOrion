var miscItems =
	[
	//'Board Deed 60000',
	//'Oak Deed 60000',
	//'Ash Deed 60000',
	//'Yew Deed 60000',
	//'Heartwood Deed 60000',
	//'Bloodwood Deed 60000',
	//'Frostwood Deed 60000',
	'Serpent Skin Quiver',
	'Mushroom Cultivator Apron',
	'Corp Mani Xen',
	'Solaria Secret Poison',
	'Ankh of Devotion',
	'Decorative Plinth',
	'Scabbard of',
	'Mantle of Archlich',
	'20th Anniversary Token',
	'Book Transcendence',
	'Soles Providence',
	]

var auctionItems =
	[
	'Beast Handcuff',
	'Change Fall 2016',
	'Deathly Greetings Ashmedai',
	'Fragment Casca Coronation',
	'Lucky Raptor Scale',
	'Rod Luck Dragon',
	'Traversis Areum Taris',
	'Snowy Scene Deceit',
	'Recognition Bravery Ophidian',
	'Void Spore',
	'Witches Cauldron',
	'Alert Chime Tokuno',
	'Ancient Cathedral Love',
	'Bane of Hythloth',
	'Fluid Queen Ogre',
	'Calm',
	'Cloak Starry Night',
	'Fishing Event Arirang',
	'Fishing Event Balhae',
	'Greetings EM Thrixx',
	'Fast Escape Mesanna',
	'Icy Sandals Uno',
	'Illuminated Manuscript Drollery',
	'Remembrance Kingpin Confederates',
	'Encrusted Blackthorn Hilt',
	'Minstrel Harp',
	'Pacify',
	'Pirate Werewolf Ninja',
	'Quell',
	'Relic Fossilized Zog',
	'Sentient Effigy Misbegotten',
	'Spirit of Izumo',
	'Standard of Catskills',
	'Subdue',
	'Surcoat Embroidered Jhelom',
	'Crazy Llama Grinch',
	'Throne Orcish Agitator',
	'Fear the Grinch',
	'Orb of Dominion',
	'Rotting Lifeless Vaeg',
	'Unfortunate Victim Catastrophic',
	'Seed So Small',
	'Disco Dancing Shoes'
	]
function VSResultParserMISC()
	{
	TextWindow.Open();
	for(var i=0;i<miscItems.length;i++)
		{
		var searchText = miscItems[i];
		var resultArr = VSsearch(searchText);
		Orion.Print(resultArr);
		if(resultArr.length)
			{
			if(resultArr[0] == 'No items matched')
				{
				TextWindow.Print(searchText + ': No items matched');
				}
			else if(resultArr[0] == 'Timed Out')
				{
				i--;
				continue;
				}
			else
				{
				TextWindow.Print(searchText + ': ' + resultArr);
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
	}

function VSResultParserAuction()
	{
	TextWindow.Open();
	for(var i=0;i<auctionItems.length;i++)
		{
		var searchText = auctionItems[i];
		var resultArr = VS_AuctionSearch(searchText);
		Orion.Print(searchText + ': ' + resultArr);
		if(resultArr.length)
			{
			if(resultArr[0] == 'No items matched')
				{
				TextWindow.Print(searchText + ': No items matched');
				}
			else if(resultArr[0] == 'Timed Out')
				{
				i--;
				continue;
				}
			else
				{
				TextWindow.Print(searchText + ': ' + resultArr);
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
	}

function VSResultParserFullReadTwoPages()
	{
	TextWindow.Open();
	for(var i=0;i<scrollinfo.length;i++)
		{
		var skill = scrollinfo[i][0]
		var searchText = '5.0 ' + skill;
		var resultArr = VSsearch2pages(searchText);
		Orion.Print(resultArr);
		if(resultArr.length)
			{
			if(resultArr[0] == 'No items matched')
				{
				resultArr.unshift(skill);
				TextWindow.Print(JSON.stringify(resultArr) + ',');
				}
			else if(resultArr[0] == 'Timed Out')
				{
				i--;
				continue;
				}
			else
				{
				var lowestPrice = resultArr[4];
				var currentPrice = scrollinfo[i][4];
				resultArr.unshift(skill);
				resultArr.unshift('Low: ' + (lowestPrice - 1) + ' Current: ' + currentPrice);
				TextWindow.Print(resultArr);//JSON.stringify(resultArr) + ',');
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
	}

function CloseGumps()
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

function VStest()
	{
	VSsearch('trans book')
	}

function VSpricetest()
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1154512)
		gumpHook.AddEntry(7, "5000");
		gumpHook.AddEntry(8, "10000");
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(67)
		gumpHook.AddEntry(1079760, "10");
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}

	}

function VSTarget()
	{
	Orion.WaitForAddObject('myTarget');
	var obj = Orion.FindObject('myTarget');
	var itemName = obj.Name();
	var split = itemName.split(' ');
	split.sort(function(a,b)
		{
		return b.length - a.length;
		})
	var searchString = split[0] + ' ' + split[1] + ' ' + split[2]
	VSsearch(searchString);
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
			CloseGumps();
			return ['No items matched'];
			}
		}
	else
		{
		CloseGumps();
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
	//CloseGumps();
	return prices;
	}
	
function VS_AuctionSearch(text)
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
			CloseGumps();
			return ['No items matched'];
			}
		}
	else
		{
		CloseGumps();
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
			return Orion.Contains(cmdLine, 'button ');
			}).map(function(cmdLine)
				{
				var mapButton = (cmdLine.match(/(\d+).$/) || [])[1]
				if(mapButton == '502')
					return +mapButton;
				vendorSearchResults.Select(Orion.CreateGumpHook(mapButton));
				vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
				Orion.Wait(200);
				return +mapButton
				});
		}
	CloseGumps();
	return prices;
	}

function page2test()
	{
	TextWindow.Open()
	TextWindow.Print(JSON.stringify(VSsearch2pages('5.0 Bushido')));
	}

function VSsearch2pages(text)
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
	Orion.AddDisplayTimer('searchWait', 30000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(30000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseGumps();
			return ['No items matched'];
			}
		}
	else
		{
		CloseGumps();
		Orion.Print(typeof vendorSearchGump);
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
		Orion.Wait(100);
		vendorSearchResults.Select(Orion.CreateGumpHook(502));
		Orion.Wait(500);
		var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
		if(vendorSearchResults)
			{
			Orion.RemoveDisplayTimer('searchWait');
			var cmdList = vendorSearchResults.CommandList()
			var prices2 = cmdList.filter(function(cmdLine)
				{
				return Orion.Contains(cmdLine, '1043304');
				}).map(function(cmdLine)
					{
					var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
					var commaNeg = numberString.replace(/,/g, "");
					return +commaNeg
					});
			var prices3 = prices.concat(prices2);
			}
		}
	CloseGumps();
	return prices3;
	}	
	
function GeneratedScript_157()
{
	if (Orion.WaitForGump(1000))
	{
		var gump = Orion.GetGump('last');
		var cmdList = gump.CommandList()
		var prices = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1043304');
			})
			.map(function(cmdLine)
				{
				var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
				var commaNeg = numberString.replace(/,/g, "");
				return +commaNeg
				});
		TextWindow.Open();
		TextWindow.Print(JSON.stringify(prices));
	}
}

function WaitForSpecificGump(delay, type, serial, id)
    {
    var deltaTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < deltaTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }