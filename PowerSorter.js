//set maxcount to how many of each scroll you want to stock
//set price of each scroll in the first through third columns of scrollinfo array
var maxcount = 2
var scrollinfo = //[price 120, price 115, price 110, categoryindex, skillindex, skillname, bookgumpbutton]
		[
			[	//0 Combat
				[35000000, 	7500000, 	1750000, 	0, 0, 'Anatomy', 					1044061],
				[3000000, 		150000, 	50000, 		0, 1, 'Archery', 					1044091],
				[500000, 		150000, 	50000, 		0, 2, 'Fencing', 					1044102],
				[32000000, 	5000000, 	2000000, 	0, 3, 'Focus', 						1044110],
				[12000000, 	2000000, 	1500000, 	0, 4, 'Healing', 					1044077],
				[100000, 		75000, 		50000, 		0, 5, 'Mace Fighting', 			1044101],
				[74000000,	10000000,	1750000, 	0, 6, 'Parrying', 					1044065],
				[9000000, 		1500000,		50000, 		0, 7, 'Swordsmanship', 		1044100],
				[100000000, 	9000000, 	2000000, 	0, 8, 'Tactics', 					1044087],
				[100000, 		70000, 		50000, 		0, 9, 'Throwing', 				1044117],
				[40000000, 	8000000, 	1500000, 	0, 10, 'Wrestling', 				1044103]
			],
			[	//1 Magic
				[5000000, 		3000000, 	350000, 	1, 0, 'Bushido', 					1044112],
				[6000000, 		1500000, 	300000, 	1, 1, 'Chivalry', 					1044111],	
				[10000000, 	4500000, 	750000, 	1, 2, 'Evaluate Intelligence',	1044076],
				[22222222, 	11515151,	11010101, 1, 3, 'Imbuing', 					1044116],
				[30000000, 	8000000, 	1000000, 	1, 4, 'Magery', 					1044085],
				[23000000, 	3000000, 	1750000, 	1, 5, 'Meditation', 				1044106],
				[3000000, 		2000000, 	1000000, 	1, 6, 'Mysticism', 				1044115],
				[1500000, 		750000, 	100000, 	1, 7, 'Necromancy', 			1044109],
				[2000000, 		750000, 	250000, 	1, 8, 'Ninjitsu', 					1044113],
				[80000000, 	9000000, 	1500000, 	1, 9, 'Resisting Spells', 		1044086],
				[1000000, 		750000, 	500000, 	1, 10, 'Spellweaving', 			1044114],
				[1000000, 		200000, 	100000, 	1, 11, 'Spirit Speak', 			1044092]
			],
			[	//2 Misc
				[22222222, 	11515151,	11010101,	2, 0, 'Blacksmithing', 			1044067],	
				[22222222, 	11515151,	11010101,	2, 1, 'Tailoring', 					1044094],
				[6000000, 		1000000, 	100000, 	2, 2, 'Animal Lore', 			1044062],
				[6000000, 		1000000, 	100000, 	2, 3, 'Animal Taming',			1044095],
				[22222222, 	11515151,	11010101,	2, 4, 'Fishing', 					1044078],
				[100000, 		75000, 		50000, 		2, 5, 'Veterinary', 				1044099],
				[3000000, 		150000, 	50000, 		2, 6, 'Stealing', 					1044093],
				[500000, 		100000, 	50000, 		2, 7, 'Stealth', 					1044107],
				[5000000, 		1500000, 	250000, 	2, 8, 'Discordance', 			1044075],
				[2500000, 		150000, 	50000, 		2, 9, 'Musicianship', 			1044089],
				[1500000, 		150000, 	50000, 		2, 10, 'Peacemaking',			1044069],
				[1000000, 		150000, 	50000, 		2, 11, 'Provocation', 			1044082]
			]
		];

//--Don't Edit Below--//

function PowerToVendor()
	{
	//if (Orion.ClientOptionGet('GriddedContainers') != 0)
		//Orion.ClientOptionSet('GriddedContainers', 0);
	if(Orion.PromptExists())
		Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
	
	var vendor = SelectTarget('vendor');
	Orion.UseObject(vendor.Serial());
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000002AB'))
			{
			gump0.Select(Orion.CreateGumpHook(1));
			Orion.Wait(100);
			}
		};
	var destbag = lastcontainer;
	Orion.SetSearchArea(vendor.X(),vendor.Y() - 1, vendor.X(),vendor.Y() - 1);
	var book = Orion.FindType(0x9AA7, 0x0481, ground, 'item', 2)[0];
	Orion.ResetSearchArea();
	Orion.Wait(1100);
	var request = PowerRequestCount(vendor,destbag);
	PowerBook(book, request);
	Orion.Wait(1100);
	var groups = ['Combat', 'Magic', 'Misc'];
	var group = groups.indexOf(Orion.Split(vendor.Name(), ' ')[1]);
	var items = Orion.FindTypeEx(0x14EF, 0x0481).filter(function(part)
				{
				var check = PowerInfo(part.Name())
				var count = PowerCount(destbag, check[5])
				return check[3] == group && count < maxcount
				});
	items.sort(function(a, b)
		{
		if(a.Properties() < b.Properties())
			return -1
		if(a.Properties() > b.Properties())
			return 1
		return 0
		});
	var xstart = 48;
	var xend = 142;
		var xoffset = 30;
	var ystart = 66;
	var yend = 121;
		var yoffset = 27;
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
	Orion.Wait(600);
	for(i=0;i<items.length;i++)
		{
		var scrollinfo = PowerInfo(items[i].Name());
		var level = Orion.Split(vendor.Name(), ' ')[0]
		var price
		switch (level)
			{
			case '110': 
				price = scrollinfo[2];
				break;
			case '115':
				price = scrollinfo[1];
				break;
			case '120':
				price = scrollinfo[0];
				break;
			}
		var xpos = pos[scrollinfo[4]][0];
		var ypos = pos[scrollinfo[4]][1];
		if(items[i])
			{
			Orion.WaitPrompt(price);
			Orion.Wait(600);
			Orion.MoveItem(items[i].Serial(), 0, destbag, xpos, ypos);
			Orion.Wait(600);	
			Orion.CancelWaitPrompt();	
			Orion.Wait(200);	
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

function SelectTarget(itemUsage) 
	{
  	if (itemUsage != null) 
  		{
    	Orion.Print("Select your " + itemUsage);
  		};
  	Orion.WaitForAddObject('myTarget');
  	var target = Orion.FindObject('myTarget');
  	return target;
	}	

function PowerRequestCount(vendor,vendorcontainer)
	{
	var groups = ['Combat', 'Magic', 'Misc'];
	var group = groups.indexOf(Orion.Split(vendor.Name(), ' ')[1]);
	var level = Orion.Split(vendor.Name(), ' ')[0]
	var requestcountarr = [];
	requestcountarr.push(group);
	requestcountarr.push(level);
	for(i=0;i<scrollinfo[group].length;i++)
		{
		var count = PowerCount(vendorcontainer, scrollinfo[group][i][5]);
		if(count < maxcount)
			requestcountarr.push(maxcount-count);
		else
			requestcountarr.push(0);
		}
	Orion.Print(requestcountarr);
	return requestcountarr;
	}

function PowerCount(container, skillstring)
	{
	var list = Orion.FindTypeEx(0x14EF,0x0481,container).filter(function(part)
				{
				return Orion.Contains(part.Name(), skillstring)
				});
	return list.length;
	}

function PowerBook(book, requestcountarr)
	{
	Orion.UseObject(book);
	Orion.Wait(200);
	var group = requestcountarr[0];
	var level = requestcountarr[1];
	for(i=0;i<requestcountarr.length-2;i++)
		{
		if(!requestcountarr[i+2])
			continue;
		var button = scrollinfo[group][i][6];
		switch (level)
			{
			case '110': 
				var button2 = parseInt(button + '01');
				break;
			case '115':
				var button2 = parseInt(button + '02');
				break;
			case '120':
				var button2 = parseInt(button + '03');
				break;
			}
		var scrollindex =scrollinfo[group][i][4]
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
				{
				gump0.Select(Orion.CreateGumpHook(button));
				Orion.Wait(100);
				}
			}
		for(c=0;c<requestcountarr[i+2];c++)
			{
			if (Orion.WaitForGump(1000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
					{
					gump0.Select(Orion.CreateGumpHook(button2));
					Orion.Wait(100);
					}
				}
			}
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
				{
				if(group == 0)
					gump0.Select(Orion.CreateGumpHook(3));
				if(group == 1)
					gump0.Select(Orion.CreateGumpHook(5));
				if(group == 2)
					{
					if(scrollindex <= 1)
						gump0.Select(Orion.CreateGumpHook(4));
					if(scrollindex >= 2 && scrollindex <= 5)
						gump0.Select(Orion.CreateGumpHook(6));
					if(scrollindex >= 6 && scrollindex <= 7)
						gump0.Select(Orion.CreateGumpHook(7));
					if(scrollindex >= 8 && scrollindex <= 11)
						gump0.Select(Orion.CreateGumpHook(8));
					}
				Orion.Wait(100);
				}
			}
		if (Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
				{
				gump0.Select(Orion.CreateGumpHook(1));
				Orion.Wait(100);
				}
			}
		}
	if (Orion.WaitForGump(1000))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023C5'))
			{
				gump0.Select(Orion.CreateGumpHook(0));
				Orion.Wait(100);
			}
		}
	}

function PowerInfo(name)
	{	
	var list = Orion.Split(name, ' ');
	switch (list[4])
		{
		case 'Anatomy':
			return scrollinfo[0][0];
		case 'Archery':
			return scrollinfo[0][1];
		case 'Fencing':
			return scrollinfo[0][2];
		case 'Focus':
			return scrollinfo[0][3];
		case 'Healing':
			return scrollinfo[0][4];
		case 'Mace':
			return scrollinfo[0][5];
		case 'Parrying':
			return scrollinfo[0][6];
		case 'Swordsmanship':
			return scrollinfo[0][7];
		case 'Tactics':
			return scrollinfo[0][8];
		case 'Throwing':
			return scrollinfo[0][9];
		case 'Wrestling':
			return scrollinfo[0][10];
		case 'Bushido':
			return scrollinfo[1][0];
		case 'Chivalry':
			return scrollinfo[1][1];
		case 'Evaluate':
			return scrollinfo[1][2];
		case 'Imbuing':
			return scrollinfo[1][3];
		case 'Magery':
			return scrollinfo[1][4];
		case 'Meditation':
			return scrollinfo[1][5];
		case 'Mysticism':
			return scrollinfo[1][6];
		case 'Necromancy':
			return scrollinfo[1][7];
		case 'Ninjitsu':
			return scrollinfo[1][8];
		case 'Resisting':
			return scrollinfo[1][9];
		case 'Spellweaving':
			return scrollinfo[1][10];
		case 'Spirit':
			return scrollinfo[1][11];
		case 'Blacksmithing':
			return scrollinfo[2][0];
		case 'Tailoring':
			return scrollinfo[2][1];
		case 'Animal':
			if(list[5] == 'Lore')
				return scrollinfo[2][2];
			else
				return scrollinfo[2][3];
		case 'Fishing':
			return scrollinfo[2][4];
		case 'Veterinary':
			return scrollinfo[2][5];
		case 'Stealing':
			return scrollinfo[2][6];
		case 'Stealth':
			return scrollinfo[2][7];
		case 'Discordance':
			return scrollinfo[2][8];
		case 'Musicianship':
			return scrollinfo[2][9];
		case 'Peacemaking':
			return scrollinfo[2][10];
		case 'Provocation':
			return scrollinfo[2][11];
		default:
			return null;
		}
	}