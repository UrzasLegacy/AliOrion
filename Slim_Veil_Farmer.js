const rareBag = '0x421D298A';
const trashCan = '0x435CDC15';
const discoKey = '';


const boatDropOFf = [3631,2219];


const tanner = [[0x13C7,'Leather Gorget',0x1DB9,'Leather Cap',0x13C5,'Leather Sleeves',0x13C5,'Leather Sleeves',0x13CB,'Leather Leggings',0x13C6,'Leather Gloves', 0x13D6,'Studded Gorget',0x13D4,'Studded Sleeves',0x13DB,'Studded Tunic', 
							0x13DA,'Studded Leggings',0x13D5,'Studded Gloves',0x1C02,'Studded Armor',0x1C04,'Female Plate',0x1C06,'Female Leather Armor',0x1C00,'Leather Shorts',0x1C08,'Leather Skirt',0x1C0A,'Leather Bustier',0x1C0B,'Leather Bustier', 
							0x1C0C,'Studded Bustier',0x1C0D,'Studded Bustier',0x0E76,'Bag',0x0E79,'Pouch',0x0E75,'Backpack',0x1081,'Cut Leather',0x0EC4,'Skinning Knife',0x1EBA,'A Taxidermy Kit'],[],[3610,2612]];

const butcher = [[0x0978,'Bacon',0x09D3,'Ham',0x09C1,'Sausage',0x1607,'Chicken Leg',0x09B9,'Raw Bird',0x1609,'Lamb',0x09F1,'Ribs',0x13F6,'Butcher Knife',0x0EC3,'Cleaver',0x0EC4,'Skinning Knife']];

const tailor = [[0x1F7B,'Doublet',0x1FA1,'Tunic',0x1F9F,'Jester Suit',0x171C,'Jester Hat',0x1713,'Floppy Hat',0x1714,'Wide-brim Hat',0x1715,'Cap',0x1716,'Tall Straw Hat',0x1717,'Straw Hat',0x1718,'Wizard\'s Hat',
						0x1DB9,'Leather Cap',0x171A,'Feathered Hat',0x171B,'Tricorne Hat',0x153F,'Bandana',0x1544,'Skullcap',0x0F95,'Bolt Of Cloth',0x1766,'Cut Cloth',0x1767,'Cloth',0x0DF9,'Bale Of Cotton',0x0DF8,'Pile Of Wool',0x1A9C,'Flax Bundle',
						0x0FA0,'Spool Of Thread',0x0F9D,'Sewing Kit',0x0F9E,'Scissors',0x0FAB,'Dyeing Tub',0x0FA9,'Dyes',0x1F7B,'Doublet',0x152E,'Short Pants',0x1EFD,'Fancy Shirt',0x1539,'Long Pants',0x1EFF,'Fancy Dress',0x1F01,'Plain Dress',0x1516,'Skirt',
						0x1537,'Kilt',0x153B,'Half Apron',0x1F03,'Robe',0x1515,'Cloak',0x1517,'Shirt'],[3710,2248],[3666,2587]];
						
const cobbler = [[0x1711,'Thigh Boots',0x170F,'Shoes',0x170B,'Boots',0x170D,'Sandals'],[3710,2248]];

const provisioner = [[0x0DF0,'Black Staff',0x13B4,'Club',0x13F8,'Gnarled Staff',0x0F5C,'Mace',0x143B,'Maul',0x0E89,'Quarter Staff',0x13F5,'Crook',0x13E3,'Smith',0x1403,'Short Spear',0x0F62,'Spear',0x1439,'War Hammer',0x1407,'War Mace',0x26BC,'Scepter',
									0x26BD,'Bladed Staff',0x0F3F,'Arrow',0x1BFB,'Crossbow Bolt',0x0E75,'Backpack',0x0E79,'Pouch',0x0E76,'Bag',0x0A0F,'Candle',0x0F64,'Torch',0x0A25,'Lantern',0x1C18,'Oil Flask',0x14FB,'Lockpick',0x1713,'Floppy Hat',0x1714,'Wide-brim Hat',
									0x1715,'Cap',0x1716,'Tall Straw Hat',0x1717,'Straw Hat',0x1718,'Wizard\'s Hat',
									0x1DB9,'Leather Cap',0x171A,'Feathered Hat',0x171B,'Tricorne Hat',0x153F,'Bandana',0x1544,'Skullcap',0x103B,'Bread Loaf',0x160A,'Lamb',0x1608,'Chicken leg',
									0x09B7,'Cooked Bird',0x099F,'A Bottle Of Ale',0x09C7,'A Bottle Of Wine',0x099B,'A Bottle Of Liquor',0x09C8,'A Jug Of Cider',0x172D,'Pear',0x09D0,'Apple',0x1422,'Beeswax',0x0F84,'Garlic',0x0F85,'Ginseng',0x0F0E,'Empty Bottle',
									0x0FF2,'Book',0x0E7D,'Wooden Box',0x100E,'Copper Key',0x0A59,'Bedroll',0x0DE1,'Kindling',0x14F2,'Small Ship Deed',0x0EFF,'Hair Dye',0x0EFF,'Skin Tingeing Tincture',0x0FA6,'A Chessboard',0x0FA6,'A Checker Board',0x0FAD,'Backgammon Game',
									0x0FAA,'Mahjong Game',0x0FA7,'Dice And Cup',0x15FD,'A Plant Bowl',0x2256,'Bagball',0x2257,'Bagball',0x0E76,'Salvage Bag'],[3710,2248],[3636,2574]];

const blacksmith = [[0x0F4F,'Crossbow',0x13FD,'Heavy Crossbow',0x1441,'Cutlass',0x0F51,'Dagger',0x143F,'Halberd',0x143D,'Hammer Pick',0x13FF,'Katana',0x1401,'Kryss',0x0F5E,'Broadsword',0x0F61,'Longsword',0x13B8,'Long Sword',0x13B9,'Viking Sword',0x0EC3,'Cleaver',
								   0x0F49,'Axe',0x0F4B,'Double Axe',0x0E86,'Pickaxe',0x0E87,'Pitchfork',0x13B6,'Scimitar',0x0EC4,'Skinning Knife',0x13FB,'Large Battle Axe',0x13B0,'War Axe',0x26BB,'Bone Harvester',0x26C1,'Crescent Blade',0x26BF,'Double Bladed Staff',
 								   0x26C0,'Lance',0x26BE,'Pike',0x26BA,'Scythe',0x26C2,'Composite Bow',0x26C3,'Repeating Crossbow',0x0DF0,'Black Staff',0x13B4,'Club',0x13F8,'Gnarled Staff',0x0F5C,'Mace',0x143B,'Maul',0x0E89,'Quarter Staff',0x13F5,'Crook',0x13E3,'Smith\'s Hammer',
								   0x1403,'Short Spear',0x0F62,'Spear',0x1439,'War Hammer',0x1407,'War Mace',0x26BC,'Scepter',0x26BD,'Bladed Staff',0x1BF2,'Ingots',0x0FBB,'Tongs',0x1BE9,'Malleable',0x1B72,'Bronze Shield',0x1B73,'Buckler ',0x1B74,'Metal Kite Shield',
								   0x1B76,'Heater Shield',0x1B79,'Tear Kite Shield',0x1B7B,'Metal Shield',0x1B7A,'Wooden Shield',0x1413,'Platemail Gorget',0x1415,'Platemail Tunic',0x1411,'Platemail Legs',0x1417,'Platemail Arms',0x1414,'Platemail Gloves',0x1412,'Plate Helm',
								   0x1408,'Close Helmet',0x1409,'Close Helm',0x140A,'Helmet',0x140B,'Helmet',0x140E,'Norse Helm',0x140F,'Norse Helm',0x1412,'Plate Helm',0x140D,'Bascinet',0x13BB,'Chainmail Coif',0x13BF,'Chainmail Tunic',0x13BE,'Chainmail Leggings',
								   0x13EC,'Ringmail Tunic',0x13F0,'Ringmail Leggings',0x13EE,'Ringmail Sleeves',0x13EB,'Ringmail Gloves',0x0F45,'Executioner\'s Axe', 
								   0x0F4D,'Bardiche',0x0F47,'Battle Axe',0x1443,'Two Handed Axe',0x13B2,'Bow',0x13F6,'Butcher Knife'],[3710,2248],[3649,2603]];

const healer = [[0x0E21,'Bandage',0x0F0C,'Healing Potion',0x0F85,'Ginseng',0x0F84,'Garlic',0x0F0B,'Refresh Potion'],[3702,2222],[3628,2611]];

const crab = [[0x44CF,'Lobster Trap'],[3669,2250]];

const ship = [[0x14F2,'Small Ship Deed',0x14F2,'Small Dragon Ship Deed',0x14F2,'Medium Ship Deed',0x14F2,'Medium Dragon Ship Deed',0x14F2,'Large Ship Deed',0x14F2,'Large Dragon Ship Deed',0x14F5,'Spyglass'],[3669,2250],[3637,2638]];

const map = [[0x14EB,'Map',0x0EF3,'Blank Scroll',0x0FC0,'Mapmaker\'s Pen'],[3676,2259],[3637,2638]];

const tavern = [[0x099F,'A Bottle Of Ale',0x09C7,'A Bottle Of Wine',0x099B,'A Bottle Of Liquor',0x09C8,'A Jug Of Cider',0x1F95,'A Pitcher Of Ale',0x1F97,'A Pitcher Of Cider',0x0FF6,'A Pitcher Of Water',0x1F99,'A Pitcher Of Liquor',0x09F0,'A Pitcher Of Milk',
							0x1F9B,'A Pitcher Of Wine',0x1F9D,'A Pitcher Of Water',0x103B,'Loaf',0x097E,'Wheel Of Cheese',0x09B7,'Cooked Bird',0x160A,'Leg Of Lamb',0x15F9,'Bowl Of Carrots',0x15FA,'Bowl Of Corn',0x15FB,'Bowl Of Lettuce',0x15FC,'Bowl Of Peas',0x15FD,'Pewter Bowl',
							0x15FF,'Bowl Of Corn',0x1601,'Bowl Of Peas',0x1602,'Bowl Of Potatoes',0x1606,'Tomato Soup',0x1041,'Backed Pie',0x0FA6,'A Chessboard',0x0FA6,'A Checker Board',0x0FAD,'Backgammon Game',0x0FA7,'Dice And Cup',
							0x14F0,'A Contract Of Employment' ,0x14F0,'A Commission Contract Of Employment',0x14F0,'A Vendor Rental Contract'],[3692,2251],[3671,2654]];
							
const cook = [[0x103C,'Bread Loaf',0x103B,'Bread Loaf',0x1041,'Baked Pie',0x09E9,'Cake',0x09EA,'Muffin',0x097E,'Wheel Of Cheese',0x09B7,'Cooked Bird',0x160A,'Leg Of Lamb',0x1608,'Chicken Leg',0x15F9,'Bowl Of Carrots',0x15FA,'Bowl Of Corn',
						0x15FB,'Bowl Of Lettuce',0x15FC,'Bowl Of Peas',0x15FD,'Pewter Bowl',0x15FF,'Bowl Of Corn',0x1600,'Bowl Of Lettuce',0x1601,'Bowl Of Peas',0x1602,'Bowl Of Potatoes',0x1604,'Bowl Of Stew',0x1606,'Tomato Soup',0x09BB,'Roast Pig',
						0x1039,'Sack Of Flour',0x09EC,'Jar Of Honey',0x1043,'Rolling Pin',0x103E,'Sifter',0x097F,'Skillet'],[3692,2251],[3671,2654]];
						
const waiter = [[0x099F,'A Bottle Of Ale',0x09C7,'A Bottle Of Wine',0x099B,'A Bottle Of Liquor',0x09C8,'A Jug Of Cider',0x1F95,'A Pitcher Of Ale',0x1F97,'A Pitcher Of Cider',0x0FF6,'A Pitcher Of Water',0x1F99,'A Pitcher Of Liquor',0x09F0,'A Pitcher Of Milk',
							0x1F9B,'A Pitcher Of Wine',0x1F9D,'A Pitcher Of Water',0x103B,'Loaf',0x097E,'Wheel Of Cheese',0x09B7,'Cooked Bird',0x160A,'Leg Of Lamb',0x15F9,'Bowl Of Carrots',0x15FA,'Bowl Of Corn',0x15FB,'Bowl Of Lettuce',0x15FC,'Bowl Of Peas',
							0x15FD,'Pewter Bowl',0x15FF,'Bowl Of Corn',0x1601,'Bowl Of Peas',0x1602,'Bowl Of Potatoes',0x1606,'Tomato Soup',0x1041,'Backed Pie'],[3692,2251],[3671,2654]];
						
const gardener = [[0x0E86,'Hoe',	0x14F0,'Gardening Contract',0x15FD,'A Plant Bowl',	0x1F9D,'A Pitcher Of Water'],[3668,2109]];	

const banker = [[0x14F0,'A Vendor Rental Contract',0x14F0,'A Contract Of Employment',0x14F0,'A Commission Contract Of Employment',0x14F0,'Commodity Deed'],[3794,2247]];	

const weaver = [[0x0FA9,'Dyes',0x0FAB,'Dyeing Tub',0x0F9E,'Scissors'],[3710,2248],[3666,2587]];

const scribe = [[0x0FF2,'Book'],[],[3615,2474]];
	
const vendorsList1 = ['tailor','cobbler', 'provisioner', 'blacksmith', 'healer', 'crab', 'ship', 'map', 'tavern', 'cook', 'waiter', 'gardener', 'banker', 'weaver'];	

const vendorsList2 = ['tailor', 'provisioner', 'blacksmith', 'ship', 'map', 'tavern', 'cook', 'waiter','weaver','scribe','tanner','healer'];	

function buyVendor(name, graphic, amount)
{
	var items = [new ShopListItem(graphic, 'any', '', amount , 0, name)];
	var wtf = Orion.GetShopList('shit');
	wtf.SetItems(items);
	Orion.UpdateShopList(wtf);
	
	var items1 = wtf.Items();
}

function main()
{
	var counter = 0;
	var buyLine;
	var rbooks = Orion.FindType('any', 'any', 'backpack');
	var rbook;
	
	Orion.RegWrite((Orion.ShardName()+Player.Name()), 0)	//This run
	
	Orion.SetTimer('slim',130000);
	
	if(rbooks.length > 0)
	{
		for(i=0;i<rbooks.length;i++)
		{
			if(Orion.Contains(Orion.FindObject(rbooks[i]).Properties(), 'slim') == true && Orion.Contains(Orion.FindObject(rbooks[i]).Properties(), 'Blessed') == true)
			{
				rbook = rbooks[i];
			}
		}
	}
	while(true)
	{	
		if(Orion.SkillValue('Stealth','base') >= 800)
		{
			if(Orion.ScriptRunning('hidden') == 0)
			{
				Orion.ToggleScript('hidden', true);
			}		
		}
	
		if(Orion.GetPathArray(3674,2251).length > 0 || Orion.GetPathArray(3684,2309).length > 0)
		{
			if(fillBox(vendorsList1) == -2)
			{
				if(Orion.FindType('any').length < 30)
				{
					if(Orion.Timer('slim') > 130000);
					{
						if(Orion.FindType(0x14F4).length > 0)
						{
							findMinister();
						}
						else
						{							
							Orion.UseObject(rbook);
							if (Orion.WaitForGump(1000))
							{
								var gump0 = Orion.GetGump('last');
								if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
								{
									gump0.Select(Orion.CreateGumpHook(301));
									Orion.Wait(500);
									if(Orion.BuffExists('Animal Form') == true)
									{
										Orion.Cast('503');
										Orion.Wait(5000);
									}
									Orion.Wait(1000);
									Orion.CastTarget('32',rbook);
									Orion.SetTimer('hidingTimer');
									Orion.Wait(1500);	
								}
							}						
						}
					}
					Orion.Wait(1000);
				}
				else
					home();
			}
			
			if(fillBox(vendorsList1) == true || fillBox(vendorsList1) == false )
			{
				if(Orion.SkillValue('Stealth','base') < 800)
				{
					walkToLocation(3684,2309);
				}
				else
				{
					walkToLocation(3657,2243);
					walkToLocation(boatDropOFf[0],boatDropOFf[1]); //		3684,2309
				}
				if(boat() == 'On the boat')
				{
					if(Orion.SkillValue('Stealth','base') < 800)
					{
						walkToLocation((Player.X() - 1),(Player.Y() + 6));
					}
					else
						walkToLocation((Player.X() - 1),(Player.Y() + 8));    
				}
			}
		}
		
		if(Orion.GetPathArray(3674,2251).length == 0 && Orion.GetPathArray(3661,2656).length == 0 && Orion.GetPathArray(3684,2309).length == 0)
		{
			if(fillBox(vendorsList2) != -2)
			{
				Orion.Say('Forward');
				Orion.WaitJournal('stopped sir', Orion.Now(), 0);
				if(boat() == 'Have the boat')
				{
					if(Orion.SkillValue('Stealth','base') >= 800)
					{
						walkToLocation(3574,2538); 
					}   
				}	
			}
			else if(fillBox(vendorsList2) == -2 && Orion.FindType(0x14F4).length <= 0)
			{
				Orion.Say('Forward');
				Orion.WaitJournal('stopped sir', Orion.Now(), 0);
				if(boat() == 'Have the boat')
				{
					Orion.UseObject(rbook);
					if (Orion.WaitForGump(1000))
					{
						var gump0 = Orion.GetGump('last');
						if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
						{
							gump0.Select(Orion.CreateGumpHook(302));
							Orion.Wait(500);
							if(Orion.BuffExists('Animal Form') == true)
							{
								Orion.Cast('503');
								Orion.Wait(5000);
							}
							Orion.Wait(1000);
							Orion.CastTarget('32',rbook);
							Orion.SetTimer('hidingTimer');
							Orion.Wait(1500);	
						}
					}						   
				}	
			}
			else
			{
				Orion.UseObject(rbook);
				if (Orion.WaitForGump(1000))
				{
					var gump0 = Orion.GetGump('last');
					if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
					{
						gump0.Select(Orion.CreateGumpHook(302));
						Orion.Wait(500);
						if(Orion.BuffExists('Animal Form') == true)
						{
							Orion.Cast('503');
							Orion.Wait(5000);
						}
						Orion.Wait(1000);
						Orion.CastTarget('32',rbook);
						Orion.SetTimer('hidingTimer');
						Orion.Wait(1500);	
					}
				}
			}			
		}
		
		if(Orion.GetPathArray(3661,2656).length > 0)
		{
			if(fillBox(vendorsList2) == true)
			{		
				if(toSlim() == 'home')
				{
					home();
				}
				else
				{
					Orion.UseObject(rbook);
					if (Orion.WaitForGump(1000))
					{
						var gump0 = Orion.GetGump('last');
						if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
						{
							gump0.Select(Orion.CreateGumpHook(302));
							Orion.Wait(500);
							if(Orion.BuffExists('Animal Form') == true)
							{
								Orion.Cast('503');
								Orion.Wait(5000);
							}
							Orion.Wait(1000);
							Orion.CastTarget('32',rbook);
							Orion.SetTimer('hidingTimer');	
						}
						Orion.Wait(1500);
					}
				}	
			}
			else if(fillBox(vendorsList2) == -2)
			{
				Orion.UseObject(rbook);
				if (Orion.WaitForGump(1000))
				{
					var gump0 = Orion.GetGump('last');
					if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
					{
						gump0.Select(Orion.CreateGumpHook(302));
						Orion.Wait(500);
						if(Orion.BuffExists('Animal Form') == true)
						{
							Orion.Cast('503');
							Orion.Wait(5000);
						}
						Orion.Wait(1000);
						Orion.CastTarget('32',rbook);
						Orion.SetTimer('hidingTimer');	
					}
					Orion.Wait(1500);
				}
				Orion.SetTimer('hidingTimer');		
			}
			else if(fillBox(vendorsList2) == false)
			{
				//shit went wrong tried 3 times
				var boxs = Orion.FindType('any');	
				if(boxs.length > 0)
				{
					for(i=0;i < boxs.length;i++)
					{
						var box = Orion.FindObject(boxs[i]);
						if(Orion.Contains(box.Properties(), 'NO-TRADE') == true)
						{
							Orion.RequestContextMenu(box.Serial());
							Orion.WaitContextMenuID(box.Serial(), 351);
							if (Orion.WaitForGump(1000))
							{
								var gump0 = Orion.GetGump('last');
								if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023EC'))
								{
									gump0.Select(Orion.CreateGumpHook(1));
									Orion.Wait(1500);
								}
							}	
							home();					
						}						
					}
				}
			}
		}
	}
}

function hidden()
{
	while(Player.Dead() == false)
	{		
		if(Player.Hidden() == false)
		{
			if((Orion.Timer('hidingTimer') > 5000 || Orion.Timer('hidingTimer') == -1))
			{
				Orion.UseSkill('Hiding');
				Orion.SetTimer('hidingTimer');
			}
		}
		if(Orion.BuffExists('Animal Form') == false)
		{		
			if(Orion.IsWalking() == true)
			{
				if(Orion.GetPathArray(3674,2251).length != 0 || Orion.GetPathArray(3661,2656).length != 0)
				{		
					Orion.Cast('503');
				}			
			}	
		}		
		Orion.Wait(1000);
	}
}

function home()				//4012,554
{
	var rbooks = Orion.FindType('any', 'any', 'backpack');
	var rbook;
	if(rbooks.length > 0)
	{
		for(i=0;i<rbooks.length;i++)
		{
			if(Orion.Contains(Orion.FindObject(rbooks[i]).Properties(), 'Slim') == true && Orion.Contains(Orion.FindObject(rbooks[i]).Properties(), 'Blessed') == true)
			{
				rbook = rbooks[i];
			}
		}
	}	
	
	if(Orion.GetPathArray(4011, 569).length == 0)
	{
		Orion.Wait(1000);
		Orion.UseObject(rbook);
		if (Orion.WaitForGump(1000))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
			{
				gump0.Select(Orion.CreateGumpHook(300));
				Orion.Wait(500);
				if(Orion.BuffExists('Animal Form') == true)
				{
					Orion.Cast('503');
					Orion.Wait(5000);
				}
				Orion.CastTarget('32',rbook);
				Orion.Wait(2000);				
			}
		}		
	}
	

	Orion.Wait(1500);
	Orion.WalkTo(1900,2541,6);
	Orion.Wait(1500);
	var items = Orion.FindType('any');
	if(items.length >0)
	{
		for(i=0;i<items.length;i++)
		{
			if(Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Skill Points') == true)
			{
				Orion.DragItem(items[i]);
				Orion.Wait('600');
				Orion.DropDraggedItem(pinkBook);
				Orion.Wait('1000');	
			}
			else if((Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Slim') == true && Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Blessed') == false )|| Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Forged') == true  || Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Voucher') == true )
			{
				Orion.DragItem(items[i]);
				Orion.Wait('600');
				Orion.DropDraggedItem(rareBag);
				Orion.Wait('1000');	
			}
			else if(Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Insured') == false && 	Orion.Contains(Orion.FindObject(items[i]).Properties(), 'Blessed') == false)
			{
				Orion.DragItem(items[i]);
				Orion.Wait('600');
				Orion.DropDraggedItem(trashCan); //trash
				Orion.Wait('1000');					
			}		
		}		
	}
}

function walkToLocation(x, y)
{
	while(true)
	{
		if(x == Player.X() && y == Player.Y())
		{
			return;
		}
		else if(Orion.IsWalking() == false)
		{
			if(Orion.GetPathArray(x, y).length == 0)
			{
				return;
			}
			else
			{
				Orion.WalkTo(x,y);
			}
		}		
		Orion.Wait(1000);		
	}
}

function reset()
{
	var test = (Orion.ShardName()+'TotalSlims');
	var pinks = (Orion.ShardName()+'Pinks');
	var rares = (Orion.ShardName()+'Rares');
	
	
}


function toSlim()
{
	var returnTo = 0;
	if(Orion.GetPathArray(3661,2656).length > 0)
	{
		walkToLocation(3661,2656);
		var people = Orion.FindType('any', 'any', ground, 'mobile', 15, 'yellow');
		Orion.Print(people.length);
		if(people.length >0)
		{
			for(q=0;q<people.length; q++)
			{
				if(Orion.Contains(Orion.FindObject(people[q]).Name(), 'Slim') == true)
				{
					Orion.RequestContextMenu(people[q]);
					Orion.WaitContextMenuID(people[q], 352);
					if (Orion.WaitForTarget(1000))
					{
						var boxs = Orion.FindType('any');

						if(boxs.length > 0)
						{
							for(i=0;i < boxs.length;i++)
							{
								var box = Orion.FindObject(boxs[i]);
								if(Orion.Contains(box.Properties(), 'NO-TRADE') == true)
								{							
									Orion.TargetObject(box.Serial());
									if (Orion.WaitForGump(1000))
									{
										var gump0 = Orion.GetGump('last');
										if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023F4'))
										{
											gump0.Select(Orion.CreateGumpHook(100));
											Orion.Wait(1000);
										}
									}
									Orion.Wait(500);
									
									// put the counter here
									var test = (Orion.ShardName()+'TotalSlims');
									var test1 = (Orion.ShardName()+Player.Name());
									var pinks = (Orion.ShardName()+'Pinks');
									var keys = (Orion.ShardName()+'Keys');
									var rares = (Orion.ShardName()+'Rares');
									var overAllTotal = Orion.RegRead(test);
									var thisRun = Orion.RegRead(test1);								
										
									if(overAllTotal>0)
									{										
										Orion.RegWrite(test, (parseInt(Orion.RegRead(test))+1));
									}
									else
										Orion.RegWrite(test, 1);
										
									if(thisRun>0)
									{
										Orion.RegWrite(test1,(parseInt(Orion.RegRead(test1))+1) );
									}	
									else
										Orion.RegWrite(test1,1);																												
									
									var items = Orion.FindType('any');
									if(items.length > 0)
									{
										for(t=0;t<items.length;t++)
										{
											var item = Orion.FindObject(items[t]);
											if(Orion.Contains(item.Name(), 'Shadow Veil') == true)
											{
												Orion.RequestContextMenu('self');
												Orion.WaitContextMenuID(Player.Serial() , 418);
												if (Orion.WaitForTarget(1000))
												{
													Orion.TargetObject(item.Serial());	
												}
												discord('@here Slims I think check it out!!!! ' + Player.Name());
												returnTo = 'home';									
											}
											else if(Orion.Contains(item.Name(), 'Scroll') == true) // or other shit
											{
												returnTo = 'home';	
												if(parseInt(Orion.RegRead(pinks))>0)
												{
													Orion.RegWrite(pinks,(parseInt(Orion.RegRead(pinks))+1) );
												}	
												else
													Orion.RegWrite(pinks,1);									
											}
											else if((Orion.Contains(item.Name(), 'Slim the') == true || Orion.Contains(item.Name(), 'Artwork') == true || Orion.Contains(item.Name(), 'Voucher') == true) && Orion.Contains(item.Properties(), 'Insured') == false) // count rares 
											{
												Orion.RequestContextMenu('self');
												Orion.WaitContextMenuID(Player.Serial(), 418);
												if (Orion.WaitForTarget(1000))
												{
													Orion.TargetObject(item.Serial());	
												}											
												if(parseInt(Orion.RegRead(rares))>0)
												{
													Orion.RegWrite(rares,(parseInt(Orion.RegRead(rares))+1) );
												}	
												else
													Orion.RegWrite(rares,1);									
											}																																										
										}
										discord('**This run:** '+ Orion.RegRead(test1) + ' **Total Pinks:** ' + Orion.RegRead(pinks) + ' **Total Rares:** ' + Orion.RegRead(rares) +' **Total number of Runs:** ' + Orion.RegRead(test));
									}
								}
							}
						}
					}
				}
			}
		}					
	}
	return returnTo;
}



function boat()
{
	if(Orion.FindType('0x14F4').length > 0)
	{
		Orion.UseType('0x14F4', '0xFFFF');
		if (Orion.WaitForGump(1000))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3EA4'))
			{
				gump0.Select(Orion.CreateGumpHook(3));
				Orion.Wait(100);
				if (Orion.WaitForTarget(1000))
				{
					if(Orion.SkillValue('Stealth','base') < 800)
					{
						Orion.TargetTileRelative('any', -8, 9, 65533);
					}
					else
					{
						Orion.TargetTileRelative('any', -10, 7, 65511);
					}
					Orion.Wait(1500);
				}				
			}
		}	
		var rope = Orion.FindType('0x14FA', 'any', 'ground', 'item',9);
		if(rope.length > 0)
		{
			for(m=0;m<rope.length;m++)
			{
				if(Orion.Contains(Orion.FindObject(rope[m]).Properties(), 'Mooring Line') == true);
				{		
					Orion.UseObject(rope[m]);
					Orion.Wait(1000);
					if(Orion.GetPathArray(3674,2251).length == 0)
					{
						return 'On the boat';
					}
				} 
			}
		}
	}
	else if(Orion.FindType('0x14FA', 'any', 'ground', 'item',6).length > 0)
	{
		var rope = Orion.FindType('0x14FA', 'any', 'ground', 'near|item',4);
		if(rope.length > 0)
		{
			for(m=0;m<rope.length;m++)
			{
				if(rope[m] != null)
				{
					if(Orion.Contains(Orion.FindObject(rope[m]).Properties(), 'Mooring Line') == true);
					{		
						Orion.UseObject(rope[m]);
						Orion.Wait(1000);
						if(Orion.GetPathArray(3661,2656).length > 0)
						{
							var pilot = Orion.FindType('any', 'any', ground, 'mobile', 20, 'yellow');
							if(pilot.length>0)
							{
								Orion.RequestContextMenu(pilot[0]);
								Orion.WaitContextMenuID(pilot[0], 937);
								if (Orion.WaitForGump(1000))
								{
									var gump0 = Orion.GetGump('last');
									if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E5F'))
									{
										gump0.Select(Orion.CreateGumpHook(2));
										Orion.Wait(1000);
										if(Orion.FindType('0x14F4').length > 0)
										{
											return 'Have the boat';
										}
									}
								}	
							}						
						}
					}
				} 
			}
		}
	}
}

function fillBox(side)
{
	var boxs = Orion.FindType('any');	
	if(boxs.length > 0)
	{
		for(i=0;i < boxs.length;i++)
		{
			var box = Orion.FindObject(boxs[i]);
			if(Orion.Contains(box.Properties(), 'NO-TRADE') == true)
			{
				Orion.SetTimer('slim');		
				var returnBox = true;
				var newLines = box.Properties().split('\n');
				for(p=6;p<(newLines.length-1);p++)//////////
				{
					var firstLine = Orion.Split(newLines[p],':');
					var amounts = Orion.Split(firstLine[1],'/');
					var haveAmount =	 amounts[0];
					var needAmount =  amounts[1];
					var itemNeeded = firstLine[0];
					
					Orion.Print('Need to buy: ' + itemNeeded  + ' Need amount: ' + (needAmount-haveAmount));	
					if(parseInt(haveAmount) < parseInt(needAmount))
					{		
						if(vendor(box.Serial(), itemNeeded ,(needAmount-haveAmount), side) == false)
						{
							returnBox = false;
						}
					}
				}
			}			
		}
		if(returnBox == null || returnBox == undefined)
		{
			return 	-2;
		}
		else
			return 	returnBox;			
	}
	else
		return 	-1;			
}

function findMinister()
{
	Orion.WalkTo(3674,2251);

	var minister = Orion.FindType('any', 'any', ground, 'mobile', 15, 'yellow');
	if(minister.length > 0)
	{
		for(b=0;b<minister.length;b++)
		{
			if(Orion.Contains(Orion.FindObject(minister[b]).Properties(),'Minister') == true)
			{
				Orion.ClientLastTarget(minister[b]);
				Orion.RequestContextMenu(lasttarget);
				Orion.WaitContextMenuID(lasttarget, 350);
				if (Orion.WaitForGump(1000))
				{
					var gump0 = Orion.GetGump('last');
					if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023EB'))
					{
						gump0.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
					}
				}							
			}
		}
	}
}

function vendor(theBox, itemNeeded ,needAmount, side)
{
	var theAmount = 0;
	for(a=0;a<side.length;a++)
	{	
		var evalVendorList = eval(side[a]);
		var vendorType = side[a];	
		if(evalVendorList[0].indexOf(itemNeeded) > 0 && parseInt(theAmount) < parseInt(needAmount))
		{
			if(vendorType != null || vendorType != undefined)
			{
				var theGraphic = evalVendorList[0][evalVendorList[0].indexOf(itemNeeded)-1];
				if(theGraphic != null || theGraphic != undefined)
				{	
					//Orion.Print(side + '~~~~~~' + vendorsList2 );							
					if(side == vendorsList1)
					{			
						walkToLocation(evalVendorList[1][0],evalVendorList[1][1]);
					}
					else if(side == vendorsList2)
					{			
						walkToLocation(evalVendorList[2][0],evalVendorList[2][1]);
					}
					var vendors = Orion.FindType('any', 'any', ground, 'mobile', 15, 'yellow'); 
					if(vendors.length >0)
					{
						for(b=0;b<vendors.length;b++)
						{
							var theVendor = Orion.FindObject(vendors[b]); 
							if(theVendor == null)
							{
								return false;
							}								
							if((Orion.Contains(theVendor.Properties(), vendorType) == true && parseInt(theAmount) < parseInt(needAmount) && vendorType != 'tailor') || (Orion.Contains(theVendor.Properties(), vendorType) == true && vendorType == 'tailor' && Orion.Contains(theVendor.Properties(),'Guildmistress') == false && Orion.Contains(theVendor.Properties(),'Guildmaster') == false && parseInt(theAmount) < parseInt(needAmount)))
							{
								if(theVendor.Distance()>9)
								{
									walkToLocation(theVendor.X(),theVendor.Y());
								}
								if( (itemNeeded == 'Cloak' || itemNeeded == 'Hair Dye' || itemNeeded== 'Fancy Shirt' || itemNeeded == 'Norse Helm' || itemNeeded == 'Helmet') || (Orion.ShardName() == 'Lake Austin' && itemNeeded == 'Kilt') || (Orion.ShardName() == 'Baja' && (itemNeeded == 'Kilt'|| itemNeeded == 'Doublet') ) )																																																																			
								{
									buyVendor(itemNeeded, theGraphic, Math.ceil((parseInt(needAmount)-parseInt(theAmount))/2));
								}
								else
								{
									buyVendor(itemNeeded, theGraphic, (parseInt(needAmount)-parseInt(theAmount)));	
								}
								Orion.Wait(1500);
								Orion.ClientLastTarget(theVendor.Serial());
								Orion.RequestContextMenu(lasttarget);
								Orion.WaitContextMenuID(lasttarget, 110);
								Orion.Wait(1500);
								Orion.CloseGump('shop');
								var theCount = Orion.FindType(theGraphic);
								if(theCount.length > 1)
								{
									theAmount = parseInt(theAmount) + parseInt(theCount.length);
									Orion.RequestContextMenu(theBox);
									Orion.WaitContextMenuID(theBox, 354);	
									Orion.Wait('1000');								
								}
								else if(theCount.length == 1)
								{
									theAmount = parseInt(theAmount) + parseInt(Orion.FindObject(theCount[0]).Count());							
									Orion.DragItem(theCount[0]);
									Orion.Wait('600');
									Orion.DropDraggedItem(theBox);
									Orion.Wait('1000');																																									
								}							
							}
						}
					}
				}
			}								
		}			
	}
	if(theAmount == needAmount)
	{
		return true;
	}
	else
		return false;
}

function discord(msg)
{
	var bot = discoKey;
	var paramText = "username="+ Player.Name() + "&content=";
	
	Orion.HttpPost(bot, paramText + msg);
}