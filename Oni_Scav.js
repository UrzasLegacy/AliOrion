function initScripts()
	{
	Orion.Exec('JournalScan', true);
	Orion.Exec('OniScav', true);
	Orion.Exec('Preservation', true);
	}

function Autostart()
	{
    while(!Orion.GumpExists('container',backpack))
        {
        Orion.UseObject(backpack);
        Orion.Wait(1300);
        }
    Orion.Wait(2000);
	initScripts();
	}

function TrashMaps()
	{
	var trash = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
		{
		return Orion.Contains(item.Properties(),'trash');
		})[0];
	if(!trash)
		return Orion.CharPrint(self,1159,'No trash nearby!');
	var trashSerial = trash.Serial();
	var map = Orion.FindType('0x14EB',any,Player.BankSerial())[0];
	while(map)
		{
		Orion.MoveItem(map,0,trashSerial);
		Orion.Wait(1000);
		map = Orion.FindType('0x14EB',any,Player.BankSerial())[0];
		}
	}

function MoveJunkFromBank()
	{
	var junk = Orion.FindTypeEx(any,any,Player.BankSerial()).filter(function(item)
		{
		return !Orion.Contains(item.Properties(), 'Fragment|Essence|Contents|Blessed|Treasure Map|Goblin Blood|Boura Pelt|Reflective Wolf|Raptor|Slith|Brilliant Amber|Chisels')
		})[0];
	while(junk)
		{
		Orion.MoveItem(junk.Serial());
		Orion.Wait(1000);
		junk = Orion.FindTypeEx(any,any,Player.BankSerial()).filter(function(item)
			{
			return !Orion.Contains(item.Properties(), 'Fragment|Essence|Contents|Blessed|Treasure Map|Goblin Blood|Boura Pelt|Reflective Wolf|Raptor|Slith|Brilliant Amber|Chisels')
			})[0];
		}
	}

function OniScav()
	{
	Orion.Exec('OniScavGump', true);
	Orion.ResumeScript('OniScavGump');
	var memoryMS = 600000;
	var allNames = Orion.CreateClientMacro('AllNames')
	var corpseQueue = [];
	var corpseHash = {};
	if(Orion.GetDistance(170,650) > 50)
		WalkThroughCurrentFarm();
	var startX = Player.X();
	var startY = Player.Y();
	while(true)
		{
		if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
			{
			DropOff();
			WalkThroughCurrentFarm();
			}
		allNames.Play();
		for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
			var msgSerial = msg.Serial();	
			if(msg.Text() == 'an oni corpse' && msg.Flags() == 0x08 && msg.Color() == '0x03B2' && !corpseHash[msgSerial])
				{
				Orion.Print(msg.Text());
				var corpseObj = Orion.FindObject(msgSerial);
				var corpseX = corpseObj.X();
				var corpseY = corpseObj.Y();
				var arr = [msgSerial, corpseX, corpseY];
				corpseQueue.push(arr);
				corpseHash[msgSerial] = Orion.Now();
				}
			}
		Orion.Print('Corpses in queue: ' + corpseQueue.length);
		while(corpseQueue.length)
			{
			if(isTargetHour(12))
				{
				Orion.PauseScript('all','OniScav|JournalScan');
				Orion.CharPrint(self,1159,'Stopping 1 hour before server down!');
				Orion.Wait(500);
				RecallByGump('Main','Bank');
				Orion.Wait(1000);
				Orion.CloseUO();
				}
			if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
				{
				DropOff();
				WalkThroughCurrentFarm();
				break;
				}
			var corpseArr = corpseQueue.shift();
			var corpseSerial = corpseArr[0];
			var corpseX = corpseArr[1];
			var corpseY = corpseArr[2];
			var corpse = Orion.FindObject(corpseSerial);
			if(!corpse || !corpse.Exists())
				continue;
			var endTime = Orion.Now() + 5000
			while(Orion.GetDistance(corpseX,corpseY) > 2 && Orion.Now() < endTime)
				{
				Orion.CharPrint(self,1159,'Walking to corpse');
				Orion.WalkTo(corpseX,corpseY);
				Orion.Wait(200);
				}
			var endTime = Orion.Now() + 5000
			while(!Orion.GumpExists('container',corpseSerial) && Orion.Now() < endTime)
				{
				if(!corpse || !corpse.Exists() || corpse.Distance() > 20)
					break;
				Orion.CharPrint(self,1159,'Opening corpse container');
				Orion.Print(corpse.Properties() + ':' + corpse.Distance())
				Orion.UseObject(corpseSerial);
				Orion.Wait(1000);
				}
			var items = Orion.FindTypeEx(any,any,corpseSerial).filter(function(item)
				{
				var itemProps = item.Properties();
				return !Orion.Contains(itemProps,'Weight: 50') && Orion.Contains(itemProps, 'Gold|Major|Artifact|Map');
				});
			Orion.Print('Items on corpse: ' + items.length);
			while(items.length)
				{
				if(Player.Weight() > Player.MaxWeight() - 75 || Orion.FindType(any).length > 120)
					break;
				Orion.CharPrint(self,1159,'Moving item');
				Orion.MoveItem(items[0].Serial());
				Orion.Wait(1000);
				items = Orion.FindTypeEx(any,any,corpseSerial).filter(function(item)
					{
					var itemProps = item.Properties();
					return !Orion.Contains(itemProps,'Weight: 50') && Orion.Contains(itemProps, 'Gold|Major|Artifact|Map');
					});
				Orion.Print('Items on corpse: ' + items.length);
				}
			Shared.AddVar('OniLooted',Shared.GetVar('OniLooted') + 1)
			}
		Orion.ClearJournal();
		if(Orion.GetDistance(startX,startY) > 2)
			{
			Orion.CharPrint(self,1159,'Walking back to starting location');
			Orion.WalkTo(startX,startY);
			}
		Orion.Wait(1000);
		Shared.AddVar('LastHashLength',Object.keys(corpseHash).length)
		var cullTime = Orion.Now() - memoryMS;
		for(var hash in corpseHash)
			{
			if(corpseHash[hash] < cullTime)
				delete corpseHash[hash]
			}
		}
	}

function isTargetHour(targetHour)
	{
	var now = new Date();
	var UTCHour = now.getUTCHours();
	return UTCHour == targetHour;
	}
	
function OniScavGump()
    {
    var startTime = Orion.Now();
    Shared.AddVar('OniLooted', 0);
    Shared.AddVar('fragCount',0)
	Shared.AddVar('essenceCount',0)
	Shared.AddVar('goldCount',0)
	Shared.AddVar('LastHashLength',0)
    while(true)
        {
        if(!Orion.ScriptRunning('OniScav'))
        	Orion.PauseScript('OniScavGump');
    	var gump = Orion.CreateCustomGump(11001);
        var sec = Orion.Now() - startTime;
        var date = new Date(sec);
        var time = date.toISOString().substring(11, 19);
        var divisor = 1/(sec/3600000);
        var oniLooted = Shared.GetVar('OniLooted');
        var fragmentsLooted = Shared.GetVar('fragCount');
        var essencesLooted = Shared.GetVar('essenceCount');
        var goldLooted = Shared.GetVar('goldCount');
        var lastHashLength = Shared.GetVar('LastHashLength');
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 160, 190);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(95, 10, "0", time);
        gump.AddText(10, 25, "0",'Onis Looted: ');
        gump.AddText(95, 25, "0",  oniLooted);
        gump.AddText(10, 40, "0",'Looted/hr: ');
        gump.AddText(95, 40, "0",(oniLooted * divisor).toFixed(1));
        gump.AddText(10, 55, "0",'Fragments: ');
        gump.AddText(95, 55, "0",  fragmentsLooted);
        gump.AddText(10, 70, "0",'Frags/hr: ');
        gump.AddText(95, 70, "0",(fragmentsLooted * divisor).toFixed(1));
        gump.AddText(10, 85, "0",'Essences: ');
        gump.AddText(95, 85, "0",  essencesLooted);
        gump.AddText(10, 100, "0",'Essence/hr: ');
        gump.AddText(95, 100, "0",(essencesLooted * divisor).toFixed(1));
        gump.AddText(10, 115, "0",'Gold: ');
        gump.AddText(95, 115, "0",  goldLooted);
        gump.AddText(10, 130, "0",'Gold/hr: ');
        gump.AddText(95, 130, "0",(goldLooted * divisor).toFixed(1));
        gump.AddText(10, 160, "0",'Hash #: ');
        gump.AddText(95, 160, "0",lastHashLength);
        gump.Update();
        Orion.Wait(500);
        }
    }

function RepairGear()
	{
	var itemArr = 
		[
		'0x2D2D',	'Assassin Spike(left)',							'blacksmith',
		'0x2D21',	'Assassin Spike(right)',						'blacksmith',
		'0x0F4A',	'Axe(left)',											'blacksmith',
		'0x0F49',	'Axe(right)',										'blacksmith',
		'0x0F4E',	'Bardiche(left)',									'blacksmith',
		'0x0F4D',	'Bardiche(right)',									'blacksmith',
		'0x0F48',	'Battle Axe(left)',									'blacksmith',
		'0x0F47',	'Battle Axe(right)',								'blacksmith',
		'0x0DF0',	'Black Staff(left)',								'carpenter',
		'0x0DF1',	'Black Staff(right)',								'carpenter',
		'0x26BD',	'Bladed Staff(left)',								'blacksmith',
		'0x26C7',	'Bladed Staff(right)',							'blacksmith',
		'0x27A8',	'Bokuto(mono)',									'carpenter',
		'0x26BB',	'Bone Harvester(left)',							'blacksmith',
		'0x26C5',	'Bone Harvester(right)',						'blacksmith',
		'0x13B1',	'Bow(left)',											'fletcher',
		'0x13B2',	'Bow(right)',										'fletcher',
		'0x0F5F',	'Broadsword(left)',								'blacksmith',
		'0x0F5E',	'Broadsword(right)',							'blacksmith',
		'0x1B72',	'Bronze Shield(mono)',						'blacksmith',
		'0x1B73',	'Buckler (mono)',								'blacksmith',
		'0x13F7',	'Butcher Knife(left)',							'tinker',
		'0x13F6',	'Butcher Knife(right)',							'tinker',
		'0x1BC3',	'Chaos Shield(mono)',							'blacksmith',
		'0x0EC2',	'Cleaver(left)',									'tinker',
		'0x0EC3',	'Cleaver(right)',									'tinker',
		'0x13B3',	'Club(left)',											'carpenter',
		'0x13B4',	'Club(right)',										'carpenter',
		'0x26C2',	'Composite Bow(left)',							'fletcher',
		'0x26CC',	'Composite Bow(right)',						'fletcher',
		'0x26C1',	'Crescent Blade(left)',							'blacksmith',
		'0x26CB',	'Crescent Blade(right)',						'blacksmith',
		'0x13F4',	'Crook(left)',										'carpenter',
		'0x13F5',	'Crook(right)',										'carpenter',
		'0x0F50',	'Crossbow(left)',									'fletcher',
		'0x0F4F',	'Crossbow(right)',								'fletcher',
		'0x1440',	'Cutlass(left)',										'blacksmith',
		'0x1441',	'Cutlass(right)',									'blacksmith',
		'0x0F52',	'Dagger(left)',										'blacksmith',
		'0x0F51',	'Dagger(right)',									'blacksmith',
		'0x27A9',	'Daisho(mono)',									'blacksmith',
		'0x2D30',	'Diamond Mace(left)',							'blacksmith',
		'0x2D24',	'Diamond Mace(right)',						'blacksmith',
		'0x0F4C',	'Double Axe(left)',								'blacksmith',
		'0x0F4B',	'Double Axe(right)',								'blacksmith',
		'0x26BF',	'Double Bladed Staff(left)',					'blacksmith',
		'0x26C9',	'Double Bladed Staff(right)',					'blacksmith',
		'0x2D2A',	'Elven Composite Longbow(left)',			'fletcher',
		'0x2D1E',	'Elven Composite Longbow(right)',		'fletcher',
		'0x2D35',	'Elven Machete(left)',							'blacksmith',
		'0x2D29',	'Elven Machete(right)',						'blacksmith',
		'0x2D2C',	'Elven Spellblade(left)',						'blacksmith',
		'0x2D20',	'Elven Spellblade(right)',						'blacksmith',
		'0x0F46',	"Executioner's Axe(left)",						'blacksmith',
		'0x0F45',	"Executioner's Axe(right)",					'blacksmith',
		'0x13F9',	'Gnarled Staff(left)',							'carpenter',
		'0x13F8',	'Gnarled Staff(right)',							'carpenter',
		'0x143E',	'Halberd(left)',									'blacksmith',
		'0x143F',	'Halberd(right)',									'blacksmith',
		'0x143C',	'Hammer Pick(left)',							'blacksmith',
		'0x143D',	'Hammer Pick(right)',							'blacksmith',
		'0x0F44',	'Hatchet(left)',									'tinker',
		'0x0F43',	'Hatchet(right)',									'tinker',
		'0x1B77',	'Heater Shield(left)',							'blacksmith',
		'0x1B76',	'Heater Shield(right)',							'blacksmith',
		'0x13FC',	'Heavy Crossbow(left)',						'fletcher',
		'0x13FD',	'Heavy Crossbow(right)',						'fletcher',
		'0x27AD',	'Kama(mono)',									'blacksmith',
		'0x13FE',	'Katana(left)',										'blacksmith',
		'0x13FF',	'Katana(right)',									'blacksmith',
		'0x1400',	'Kryss(left)',										'blacksmith',
		'0x1401',	'Kryss(right)',										'blacksmith',
		'0x27A7',	'Lajatang(mono)',								'blacksmith',
		'0x26C0',	'Lance(left)',										'blacksmith',
		'0x26CA',	'Lance(right)',										'blacksmith',
		'0x13FA',	'Large Battle Axe(left)',						'blacksmith',
		'0x13FB',	'Large Battle Axe(right)',						'blacksmith',
		'0x2D2E',	'Leafblade(left)',									'blacksmith',
		'0x2D22',	'Leafblade(right)',								'blacksmith',
		'0x0F60',	'Longsword(left)',								'blacksmith',
		'0x0F61',	'Longsword(right)',								'blacksmith',
		'0x0F5D',	'Mace(left)',										'blacksmith',
		'0x0F5C',	'Mace(right)',										'blacksmith',
		'0x2D2B',	'Magical Shortbow(left)',						'fletcher',
		'0x2D1F',	'Magical Shortbow(right)',					'fletcher',
		'0x143A',	'Maul(left)',										'blacksmith',
		'0x143B',	'Maul(right)',										'blacksmith',
		'0x1B75',	'Metal Kite Shield(left)',						'blacksmith',
		'0x1B74',	'Metal Kite Shield(right)',						'blacksmith',
		'0x1B7B',	'Metal Shield(mono)',							'blacksmith',
		'0x27A2',	'No-dachi(mono)',								'blacksmith',
		'0x27AE',	'Nunchaku(mono)',								'tinker',
		'0x1BC5',	'Order Shield(left)',								'blacksmith',
		'0x1BC4',	'Order Shield(right)',							'blacksmith',
		'0x2D34',	'Ornate Axe(left)',								'blacksmith',
		'0x2D28',	'Ornate Axe(right)',								'blacksmith',
		'0x0E85',	'Pickaxe(left)',									'tinker',
		'0x0E86',	'Pickaxe(right)',									'tinker',
		'0x26BE',	'Pike(left)',											'blacksmith',
		'0x26C8',	'Pike(right)',										'blacksmith',
		'0x0E88',	'Pitchfork(left)',									'tinker',
		'0x0E87',	'Pitchfork(right)',									'tinker',
		'0x0E8A',	'Quarter Staff(left)',							'carpenter',
		'0x0E89',	'Quarter Staff(right)',							'carpenter',
		'0x2D33',	'Radiant Scimitar(left)',						'blacksmith',
		'0x2D27',	'Radiant Scimitar(right)',						'blacksmith',
		'0x26C3',	'Repeating Crossbow(left)',					'fletcher',
		'0x26CD',	'Repeating Crossbow(right)',				'fletcher',
		'0x2D32',	'Rune Blade(left)',								'blacksmith',
		'0x2D26',	'Rune Blade(right)',								'blacksmith',
		'0x27AF',	'Sai(mono)',										'blacksmith',
		'0x26BC',	'Scepter(left)',									'blacksmith',
		'0x26C6',	'Scepter(right)',									'blacksmith',
		'0x13B5',	'Scimitar(left)',									'blacksmith',
		'0x13B6',	'Scimitar(right)',									'blacksmith',
		'0x26BA',	'Scythe(left)',										'blacksmith',
		'0x26C4',	'Scythe(right)',									'blacksmith',
		'0x1402',	'Short Spear(left)',								'blacksmith',
		'0x1403',	'Short Spear(right)',							'blacksmith',
		'0x0EC5',	'Skinning Knife(left)',							'tinker',
		'0x0EC4',	'Skinning Knife(right)',							'tinker',
		'0x0FB4',	'Sledge Hammer(left)',						'tinker',
		'0x0FB5',	'Sledge Hammer(right)',						'tinker',
		'0x13E3',	"Smith's Hammer(left)",						'tinker',
		'0x13E4',	"Smith's Hammer(right)",					'tinker',
		'0x0F63',	'Spear(left)',										'blacksmith',
		'0x0F62',	'Spear(right)',									'blacksmith',
		'0x1B79',	'Tear Kite Shield(left)',						'blacksmith',
		'0x1B78',	'Tear Kite Shield(right)',						'blacksmith',
		'0x27AB',	'Tekagi(mono)',									'blacksmith',
		'0x27A3',	'Tessen(mono)',									'blacksmith',
		'0x27A6',	'Tetsubo(mono)',								'carpenter',
		'0x1442',	'Two Handed Axe(left)',						'blacksmith',
		'0x1443',	'Two Handed Axe(right)',						'blacksmith',
		'0x13BA',	'Viking Sword(left)',							'blacksmith',
		'0x13B9',	'Viking Sword(right)',							'blacksmith',
		'0x27A4',	'Wakizashi(mono)',								'blacksmith',
		'0x13AF',	'War Axe(left)',									'blacksmith',
		'0x13B0',	'War Axe(right)',									'blacksmith',
		'0x2D2F',	'War Cleaver(left)',								'blacksmith',
		'0x2D23',	'War Cleaver(right)',							'blacksmith',
		'0x1404',	'War Fork(left)',									'blacksmith',
		'0x1405',	'War Fork(right)',								'blacksmith',
		'0x1438',	'War Hammer(left)',							'blacksmith',
		'0x1439',	'War Hammer(right)',							'blacksmith',
		'0x1406',	'War Mace(left)',								'blacksmith',
		'0x1407',	'War Mace(right)',								'blacksmith',
		'0x2D31',	'Wild Staff(left)',									'carpenter',
		'0x2D25',	'Wild Staff(right)',								'carpenter',
		'0x1B7A',	'Wooden Shield(mono)',						'carpenter',
		'0x27A5',	'Yumi(mono)',									'fletcher',
		'0x153F',	'Bandana(mono)',								'tailor',
		'0x140D',	'Bascinet(left)',									'blacksmith',
		'0x140C',	'Bascinet(right)',									'blacksmith',
		'0x1545',	'Bear Mask(mono)',								'tailor',
		'0x1454',	'Bone Armor(left)',								'tailor',
		'0x144F',	'Bone Armor(right)',							'tailor',
		'0x144E',	'Bone Arms(left)',								'tailor',
		'0x1453',	'Bone Arms(right)',								'tailor',
		'0x1450',	'Bone Gloves(left)',								'tailor',
		'0x1455',	'Bone Gloves(right)',							'tailor',
		'0x1451',	'Bone Helmet(left)',								'tailor',
		'0x1456',	'Bone Helmet(right)',							'tailor',
		'0x1457',	'Bone Leggings(left)',							'tailor',
		'0x1452',	'Bone Leggings(right)',						'tailor',
		'0x1F06',	'Bracelet(mono)',								'tinker',
		'0x1086',	'Bracelet(mono)',								'tinker',
		'0x13BB',	'Chainmail Coif(left)',							'blacksmith',
		'0x13C0',	'Chainmail Coif(right)',						'blacksmith',
		'0x2774',	'Chainmail Hatsuburi(mono)',				'blacksmith',
		'0x13C3',	'Chainmail Leggings(left)',				'blacksmith',
		'0x13BE',	'Chainmail Leggings(right)',				'blacksmith',
		'0x13C4',	'Chainmail Tunic(left)',						'blacksmith',
		'0x13BF',	'Chainmail Tunic(right)',						'blacksmith',
		'0x1409',	'Close Helm(left)',								'blacksmith',
		'0x1408',	'Close Helmet(right)',							'blacksmith',
		'0x2778',	'Decorative Platemail Kabuto(mono)',	'blacksmith',
		'0x1547',	'Deer Mask(mono)',							'tailor',
		'0x171A',	'Feathered Hat(mono)',						'tailor',
		'0x1C07',	'Female Leather Armor(left)',				'tailor',
		'0x1C06',	'Female Leather Armor(right)',				'tailor',
		'0x1C05',	'Female Plate(left)',							'blacksmith',
		'0x1C04',	'Female Plate(right)',							'blacksmith',
		'0x1713',	'Floppy Hat(mono)',							'tailor',
		'0x2777',	'Heavy Platemail Jingasa(mono)',			'blacksmith',
		'0x140B',	'Helmet(left)',										'blacksmith',
		'0x140A',	'Helmet(right)',									'blacksmith',
		'0x2B75',	'Hide Gloves(mono)',							'tailor',
		'0x2B76',	'Hide Gorget(mono)',							'tailor',
		'0x2B78',	'Hide Pants(mono)',							'tailor',
		'0x2B77',	'Hide Pauldrons(mono)',						'tailor',
		'0x2B74',	'Hide Tunic(mono)',							'tailor',
		'0x171C',	'Jester Hat(mono)',								'tailor',
		'0x2798',	'Kasa(mono)',										'tailor',
		'0x2FC8',	'Leaf Arms(mono)',								'tailor',
		'0x2FC6',	'Leaf Gloves(mono)',							'tailor',
		'0x2FC7',	'Leaf Gorget(mono)',							'tailor',
		'0x2FC9',	'Leaf Leggings(mono)',						'tailor',
		'0x2FCA',	'Leaf Tonlet(mono)',							'tailor',
		'0x2FC5',	'Leaf Tunic(mono)',								'tailor',
		'0x1C0B',	'Leather Bustier(left)',							'tailor',
		'0x1C0A',	'Leather Bustier(right)',						'tailor',
		'0x1DB9',	'Leather Cap(left)',								'tailor',
		'0x1DBA',	'Leather Cap(right)',							'tailor',
		'0x277B',	'Leather Do(mono)',							'tailor',
		'0x13C6',	'Leather Gloves(left)',							'tailor',
		'0x13CE',	'Leather Gloves(right)',						'tailor',
		'0x13C7',	'Leather Gorget(mono)',						'tailor',
		'0x278A',	'Leather Haidate(mono)','					tailor',
		'0x277E',	'Leather Hiro Sode(mono)',					'tailor',
		'0x2776',	'Leather Jingasa(mono)',						'tailor',
		'0x13D2',	'Leather Leggings(left)',						'tailor',
		'0x13CB',	'Leather Leggings(right)',						'tailor',
		'0x277A',	'Leather Mempo(mono)',						'tailor',
		'0x278E',	'Leather Ninja Hood(mono)',				'tailor',
		'0x2793',	'Leather Ninja Jacket(mono)',				'tailor',
		'0x2792',	'Leather Ninja Mitts(mono)',					'tailor',
		'0x2791',	'Leather Ninja Pants(mono)'	,				'tailor',
		'0x1C01',	'Leather Shorts(left)',							'tailor',
		'0x1C00',	'Leather Shorts(right)',						'tailor',
		'0x1C09',	'Leather Skirt(left)',								'tailor',
		'0x1C08',	'Leather Skirt(right)',							'tailor',
		'0x13C5',	'Leather Sleeves(left)',						'tailor',
		'0x13CD',	'Leather Sleeves(right)',						'tailor',
		'0x2786',	'Leather Suneate(mono)',					'tailor',
		'0x13D3',	'Leather Tunic(left)',							'tailor',
		'0x13CC',	'Leather Tunic(right)',							'tailor',
		'0x2781',	'Light Platemail Jingasa(mono)',			'blacksmith',
		'0x140F',	'Norse Helm(left)',								'blacksmith',
		'0x140E',	'Norse Helm(right)',							'blacksmith',
		'0x1F0B',	'Orc Helm(left)',									'tailor',
		'0x1F0C',	'Orc Helm(right)',								'tailor',
		'0x141B',	'Orc Mask(mono)',								'tailor',
		'0x1412',	'Plate Helm(left)',								'blacksmith',
		'0x1419',	'Plate Helm(right)',								'blacksmith',
		'0x1410',	'Platemail Arms(left)',							'blacksmith',
		'0x1417',	'Platemail Arms(right)',						'blacksmith',
		'0x2785',	'Platemail Battle Kabuto(mono)',			'blacksmith',
		'0x277D',	'Platemail Do(mono)',							'blacksmith',
		'0x1414',	'Platemail Gloves(left)',						'blacksmith',
		'0x1418',	'Platemail Gloves(right)',						'blacksmith',
		'0x1413',	'Platemail Gorget(mono)',					'blacksmith',
		'0x278D',	'Platemail Haidate(mono)',					'blacksmith',
		'0x2775',	'Platemail Hatsuburi(mono)',				'blacksmith',
		'0x2780',	'Platemail Hiro Sode(mono)',				'blacksmith',
		'0x141A',	'Platemail Legs(left)',							'blacksmith',
		'0x1411',	'Platemail Legs(right)',						'blacksmith',
		'0x2779',	'Platemail Mempo(mono)',					'blacksmith',
		'0x2788',	'Platemail Suneate(mono)',					'blacksmith',
		'0x1416',	'Platemail Tunic(left)',							'blacksmith',
		'0x1415',	'Platemail Tunic(right)',						'blacksmith',
		'0x2B71',	'Raven Helm(mono)',							'carpenter',
		'0x1F09',	'Ring(mono)',										'tinker',
		'0x108A',	'Ring(mono)',										'tinker',
		'0x13EB',	'Ringmail Gloves(left)',						'blacksmith',
		'0x13F2',	'Ringmail Gloves(right)',						'blacksmith',
		'0x13F1',	'Ringmail Leggings(left)',						'blacksmith',
		'0x13F0',	'Ringmail Leggings(right)',					'blacksmith',
		'0x13EF',	'Ringmail Sleeves(left)',						'blacksmith',
		'0x13EE',	'Ringmail Sleeves(right)',						'blacksmith',
		'0x13ED',	'Ringmail Tunic(left)',							'blacksmith',
		'0x13EC',	'Ringmail Tunic(right)',						'blacksmith',
		'0x1543',	'Skullcap(mono)',								'tailor',
		'0x2784',	'Small Platemail Jingasa(mono)',			'blacksmith',
		'0x2789',	'Standard Platemail Kabuto(mono)',		'blacksmith',
		'0x1717',	'Straw Hat(mono)',								'tailor',
		'0x1C03',	'Studded Armor(mono)',						'tailor',
		'0x1C0D',	'Studded Bustier(left)',						'tailor',
		'0x1C0C',	'Studded Bustier(right)',						'tailor',
		'0x277C',	'Studded Do(mono)',							'tailor',
		'0x13D5',	'Studded Gloves(left)',							'tailor',
		'0x13DD',	'Studded Gloves(right)',						'tailor',
		'0x13D6',	'Studded Gorget(mono)',						'tailor',
		'0x278B',	'Studded Haidate(mono)',					'tailor',
		'0x277F',	'Studded Hiro Sode(mono)',					'tailor',
		'0x13E1',	'Studded Leggings(left)',						'tailor',
		'0x13DA',	'Studded Leggings(right)',					'tailor',
		'0x279D',	'Studded Mempo(mono)',					'tailor',
		'0x13D4',	'Studded Sleeves(left)',						'tailor',
		'0x13DC',	'Studded Sleeves(right)',						'tailor',
		'0x2787',	'Studded Suneate(mono)',					'tailor',
		'0x13E2',	'Studded Tunic(left)',							'tailor',
		'0x13DB',	'Studded Tunic(right)',						'tailor',
		'0x1716',	'Tall Straw Hat(mono)',						'tailor',
		'0x1549',	'Tribal Mask A(mono)',						'tailor',
		'0x154B',	'Tribal Mask B(mono)',						'tailor',
		'0x171B',	'Tricorne Hat(mono)',							'tailor',
		'0x2B72',	'Vulture Helm(mono)',							'carpenter',
		'0x1714',	'Wide-brim Hat(mono)',						'tailor',
		'0x2B73',	'Winged Helm(mono)',						'carpenter',
		'0x1718',	"Wizard's Hat(mono)",						'tailor',
		'0x2B6C',	'Woodland Arms(mono)',						'carpenter',
		'0x2B67',	'Woodland Chest(mono)',					'carpenter',
		'0x2B6A',	'Woodland Gauntlets(mono)',				'carpenter',
		'0x2B69',	'Woodland Gorget(mono)',					'carpenter',
		'0x2B6B',	'Woodland Leggings(mono)',				'carpenter',
		'0x153B',	'Apron',												'tailor',
		'0x2643',	'Dragon Gloves',	'blacksmith',
		'0x1541', 'Sash', 'tailor',
		'0x2647', 'Dragon Leggings', 'blacksmith',
		'0x2FB8','Elven Glasses','tinker',
		'0x1087','earrings','tinker',
		'0x4049',	'Gargish Leather Chest',					'tailor',
		'0x404C', 	'Gargish Leather Kilt',						'tailor',
		'0x4047',	'Gargish Leather Arms',						'tailor',
		'0x4D0A',	'Gargish Stone Amulet',						'masonry',
		'0x4066',	'Gargish Cloth Leggings',					'tailor',
		'0x4644',	'Mace and Shield Reading Glasses',	'tinker',
		'0x405A',	'Gargish Stone Chest',						'masonry',
		'0x0284',	'Bone Arms',									'tailor',
		'0x4056',	'Platemail Legs',								'blacksmith',
		'0x4D0B',	'Gargish Amulet',							'blacksmith',
		'0x4211',	'Gargish Bracelet',							'tinker',
		'0x090A',	'Glaive of The Infinite Swarm',			'blacksmith',
		'0x030A',	'Platemail Tunic',							'blacksmith',
		'0x404E',	'Leather Leggings',							'tailor',
		'0x4050',	'Platemail Arms',							'blacksmith',
		'0x405C',	'Gargish Stone Kilt',							'masonry',
		'0x405D',	'Gargish Stone Leggings',				'masonry',
		'0x4058',	'Gargish Stone Arms',						'masonry',
		'0x46B5',	'Lieutenant Of The Royal Guard',		'tailor',
		'0x4062',	'Gargish Cloth Chest',						'tailor',
		'0x404B',	'Gargish Leather Kilt',						'tailor',
		'0x4057',	'Gargish Stone Arms',						'masonry',
		'0x46B4',	'Gargish Sash Bearing the Crest of Blackthorn',		'tailor',
		'0x4210',	'Gargish Necklace',							'tinker',
		'0x4052',	'Gargish Platemail Chest',				'blacksmith',
	
		]
	minDura = 40; //Durability below which to repair
	layers = 
		[
		0,
		"RightHand",
		"LeftHand",
		'Shoes',
		"Pants",
		'Shirt',
		'Helmet',
		'Gloves',
		'Ring',
		'Talisman',
		'Necklace',
		'Hair',
		'Waist',
		'InnerTorso',
		'Bracelet',
		'Face',
		'Beard',
		'MidTorso',
		'Earrings',
		'Arms',
		'Cloak',
		'Backpack',
		'Robe',
		'Eggs',
		'Legs'
		]
	Orion.Print("Repair threshold set at: " + minDura)
	for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var theobj = Orion.ObjAtLayer(i);
			var objProperties = theobj.Properties();
			var objInd = itemArr.indexOf(theobj.Graphic());
			//var adjObjInd = objInd + 2
			if(!Orion.Contains(objProperties, 'Durability') || objInd < 0)
			  	Orion.Wait(10);
      		else
      			{
				var dura = theobj.Properties().match(/Durability (\d+) \/ (\d+)/)
				if(dura.shift() && Number(dura[0]) < minDura && Number(dura[0]) < Number(dura[1]))
			        {
			        //Orion.CharPrint(self, 40, layers[theobj.Layer()] + ": " +dura[0] + " / " +dura[1]);		        
			        Orion.Print(theobj.Name() + ' | ' + dura[0] + '/' + dura[1] + ' | ' + layers[theobj.Layer()]);
				    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
			        if(bench)
			        	{
			        	var b;
			        	var repairType = itemArr[objInd + 2];
					    switch(repairType)
					    	{
					    	case 'tinker':
					    		b = 2001;
					    		break;
					    	case 'blacksmith':
					    		b = 2002;
					    		break;
					    	case 'carpenter':
					    		b = 2003;
					    		break;
					    	case 'tailor':
					    		b = 2006;
					    		break;
							case 'masonry':
					    		b = 2010;
					    		break;
					    	default:
					    		return Orion.Print('Type error in repair');
					    	}
				        if(!Orion.GumpExists('generic', any, '0x00002415'))
				        	Orion.UseObject(bench);
				        if(Orion.WaitForGump(1000))
				            {
				            var gump = Orion.GetGump(any, '0x00002415');
				            if(gump !== null)
				               	gump.Select(Orion.CreateGumpHook(b));
				            }
				        Orion.WaitForTarget(2000);
				        Orion.TargetObject(theobj.Serial());
				        Orion.Wait(200)
				        }			   
			        }
      			}
    		}
  		}
	}
	
function RecallRepair()
	{
	RecallByGump('Main', 'Repair', 'Main','Repair');
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
	Orion.Exec('WalkThroughCurrentFarm');
	}

function testCall()
    {
    TextWindow.Open();
    TextWindow.Clear();
    Orion.WaitForAddObject('myTarget');
    var a = Orion.FindObject('myTarget');
    var startTime = Orion.Now();
    Orion.Print(UnravelEval(a.Properties()))
    Orion.Print('Processing time = ' + (Orion.Now()-startTime) + 'ms');
    }

function UnravelEval(itemProperties)
	{
    var propertiesList = 
        [
            ['Physical Resist', 6],
            ['Fire Resist', 6],
            ['Cold Resist', 6],
            ['Poison Resist', 6],
            ['Energy Resist', 6],
            ['Damage Eater', 15],
            ['Kinetic Eater', 6],
            ['Fire Eater', 6],
            ['Cold Eater', 6],
            ['Poison Eater', 6],
            ['Energy Eater', 6],
            ['Enhance Potions', 4],
            ['Damage Increase', 2],
            ['Swing Speed Increase', 3.6],
            ['Defense Chance Increase', 7.33],
            ['Hit Chance Increase', 8.66],
            ['Strength Bonus', 13.75],
            ['Dexterity Bonus', 13.75],
            ['Intelligence Bonus', 13.75],
            ['Hit Point Increase', 22],
            ['Stamina Increase', 13.75],
            ['Mana Increase', 13.75],
            ['Hit Point Regeneration', 50],
            ['Stamina Regeneration', 33.33],
            ['Mana Regeneration', 50],
            ['Casting Focus', 40], //25
            ['Faster Cast Recovery', 40],
            ['Faster Casting', 140],
            ['Lower Mana Cost', 13.75],
            ['Lower Reagent Cost', 5],
            ['Spell Damage Increase', 8.33],
            ['Luck', 1],
            ['Reflect Physical Damage', 6.66],
            ['Night Sight', 100],
            ['Spell Channeling', 100],
            ['Lower Requirements', 1],
            ['Durability', 1],
            ['Reactive Paralyze', 140],
            ['Battle Lust', 100],
            ['Blood Drinker', 100],
            ['Splintering Weapon', 7.5],
            ['Mage Weapon', 10],
            ['Use Best Weapon Skill', 150],
            ['Hit Poison Area', 2],
            ['Hit Physical Area', 2],
            ['Hit Fire Area', 2],
            ['Hit Energy Area', 2],
            ['Hit Cold Area', 2],
            ['Hit Stamina Leech', 2],
            ['Hit Mana Leech', 2.2],
            ['Hit Life Leech', 2.2],
            ['Hit Magic Arrow', 2.4],
            ['Hit Lower Defense', 2.6],
            ['Hit Lower Attack', 2.2],
            ['Hit Lightning', 2.8],
            ['Hit Harm', 2.2],
            ['Hit Fireball', 2.8],
            ['Hit Dispel', 2],
            ['Hit Mana Drain', 2.5],
            ['Hit Fatigue', 2.5],
            ['Velocity', 2.8],
            ['[\\w ]+Slayer', 110],
            ['Balanced', 100],
            ['[\\w ]+\\+', 9],
        ]
    var weight = 0;
    var outMsg = '';
    var numMods = 0;
    var duraModifier = 1;
    var durability = +((itemProperties.match(/Durability (\d+)/) || [])[1] || 0)
    if(durability && durability < 50)
        duraModifier = 1 - ((50 - durability) * .02)
    outMsg += itemProperties + '\n\n';
    var itemPropLines = itemProperties.split(/\r?\n/);
    for(var i=0;i<itemPropLines.length;i++)
        {
        var prop = itemPropLines[i];
        if(Orion.Contains(prop, 'Durability'))
            {
            if(!Orion.Contains(prop, '+'))
                continue;
            }
        for(var ii=0;ii<propertiesList.length;ii++)
            {
            var propPair = propertiesList[ii];
            var regex = "^" + propPair[0] + "\\s?(-?\\+?\\d+)?";
            var outcome = prop.match(regex);
            if(outcome)
                {
                if(outcome[1] == undefined)
                    outcome[1] = 1;
                numMods++;
                var weightMultiplier = propPair[1];
                if(Orion.Contains(propPair[0], 'Resist') && !Orion.Contains(itemProperties, 'Ring|Bracelet'))
                    {
                    if(+outcome[1] < 6)
                        {
                        numMods--;
                        continue;
                        }
                    outcome[1] = Math.max(+outcome[1] - 5, 0);
                    }
                else if(Orion.Contains('Balanced|Damage Increase|Spell Channeling|Faster Casting|Mage Weapon|[\\w ]+Slayer|[\\w ]+\\+', propPair[0]))
                    {
                    if(propPair[0] == 'Damage Increase')
                        { 
                        if(Orion.Contains(itemProperties, 'Ring|Bracelet'))
                            weightMultiplier = 4;
                        }
                    else if(propPair[0] == 'Spell Channeling')
                        {
                        if(!Orion.Contains(itemProperties, 'Faster Casting -1'))
                            weightMultiplier = 240;
                        }
                    else if(propPair[0] == '[\\w ]+\\+' && Orion.Contains(prop, 'Durability'))
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Faster Casting' && outcome[1] == '-1')
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Mage Weapon')
                        {
                        outcome[1] = +outcome[1] + 30;
                        }
                    else if(propPair[0] == '[\\w ]+Slayer')
                        {
                        Orion.Print(propPair[0])
                        if(Orion.Contains(prop, 'Undead|Reptile|Repond|Fey|Elemental|Demon|Arachnid'))
                            weightMultiplier = 140;
                        }
                    else if(propPair[0] == 'Balanced')
                        {
                        if(Orion.Contains(itemProperties, 'Skill Required: Archery'))
                            weightMultiplier = 150;
                        }
                    }
                var add = +outcome[1] * weightMultiplier
                weight += add;
                outMsg += propPair[0] + ': ' + outcome[1] + '*' + weightMultiplier + ' = ' + add + '\n';
                }
            }
        }
    outMsg += '\nNumber of Mods: ' + numMods;
    if(numMods > 5)
        {
        weight = ((weight/numMods)*5 + 30) * duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\n((Total Weight \\ ' + numMods + ') * 5) * ' + duraModifier + ' = ' + weightRounded;
        }
    else
        {
        weight = (weight + 30)*duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\nTotal Weight * ' + duraModifier + ': ' + weightRounded;
        }
    //TextWindow.Print(outMsg);
    return weightRounded;
    }

function PlayerDetector()
	{
	var memoryMS = 60000; //how long to ignore a player after detecting them.
	var scanFrequencyMS = 100; //how often to scan for players.
    var flag = true;
	//Orion.GetIgnoreList('PlayerDetectorIgnoreList');
	//Orion.ClearIgnoreList('PlayerDetectorIgnoreList');
	var playersDetected = {};
	var gumpWidth = 200;
	var gumpHeight = 30;
	var gumpHeightOffset = 15;
	var line;
	while(true)
		{
        if(Orion.InJournal('initfarm'))
            {
            flag = true;
            Orion.ClearJournal('initfarm');
            }
		var startTime = Orion.Now();
		var players = Orion.FindTypeEx('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'ignoreself',24,'blue|orange|gray')
			.filter(function(npcCheck)
				{
				if(!npcCheck.ProfileReceived())
					Orion.GetProfile(npcCheck.Serial());
				//if(!npcCheck.ProfileReceived())
				//	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
				return npcCheck.ProfileReceived() || npcCheck.Dead();
				});
		//Orion.ResetIgnoreList();
		var playerSerialList = players.map(function(obj){return obj.Serial()});
		var nowTime = Orion.Now();
		var deltaPlayers = [];
		for(var i=0;i<players.length;i++)
			{
			var playerSerial = players[i].Serial();
			var playerName = players[i].Name();
			var playerX = players[i].X();
			var playerY = players[i].Y();
			if(!playersDetected[playerSerial])
				{
				playersDetected[playerSerial] = [playerName, nowTime + memoryMS, playerX, playerY];
				deltaPlayers.push(playerName + ':' + playerSerial + ':' + playerX + ':' + playerY);
				}
			//Orion.PrintFast(playerSerial, 5, 0, 'Player');
			}
		for(var property in playersDetected)
			if(nowTime > playersDetected[property][1])
				delete playersDetected[property];
		var gump = Orion.CreateCustomGump(11005);
		gump.Clear();
		gump.AddResizepic(0, 0, 0xBB8, gumpWidth, gumpHeight + (Object.keys(playersDetected).length * gumpHeightOffset));
		gump.AddText(55, 5, "0", 'Players:');
		gump.AddText(125, 5, '0', players.length);
		line = 0;	
		for(var property in playersDetected)
			{
			if(playerSerialList.indexOf(property) > -1)
				var textColor = '1159';
			else
				var textColor = '0';
			gump.AddText(5, 5 + (gumpHeightOffset * ++line), textColor, playersDetected[property][0] + '  ' + playersDetected[property][2] + ':' + playersDetected[property][3]);
			}
		gump.Update();
		if(deltaPlayers[0])
			{
            if(flag)
                {
			    //Orion.SayAlliance('inithome');
                flag = false;
                }
			DiscordPush('Players Detected on ' + Orion.ShardName() + ': ' + deltaPlayers);
			}
		var deltaTime = Orion.Now() - startTime;
		Orion.Print('Scan Time: ' + deltaTime +'ms')
		if(deltaTime < scanFrequencyMS)
			Orion.Wait(scanFrequencyMS - deltaTime);
		}
	}

function Preservation()
    {
    while(!Player.Dead())
        {
		if(!Orion.BuffExists('Protection'))
        	Orion.Cast('Protection');
        else if(Player.Poisoned())
            {
            Orion.Cast('Cure');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
            }
        else if(Player.Hits('%') < 75)
        	{
        	Orion.Cast('Greater Heal');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
        	}
        Orion.Wait(500);
        }
    }

function gumptest()
	{
	Orion.Print(CheckGumpCliloc('0x00000320', '@@#1112537'))
	}
	
function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}
	
function FindOwnCorpse()
    {
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
    
function RelicTurnin()
	{
	while(true)
		{
		while(Orion.Count('0x2DB3') < 50)
			{
			if(Player.X() != 2889 && Player.Y() != 680)
				RecallByGump('Main','Bank','Main','Bank2');
			while(!Orion.GumpExists('container', Player.BankSerial()))
				{
				Orion.Say('bank');
				Orion.Wait(1300);
				}
			var chisels = Orion.FindType('0x12B3')[0];
			while(chisels)
				{
				Orion.MoveItem(chisels,0,Player.BankSerial());
				Orion.Wait(1300);
				chisels = Orion.FindType('0x12B3')[0];
				}
			var frags = Orion.FindType('0x2DB3',any,Player.BankSerial())[0];
			Orion.MoveItem(frags,500 - Orion.Count('0x2DB3'),backpack);
			Orion.Wait(1300);
			if(Player.Weight() > Player.MaxWeight())
				{
				var items = Orion.FindTypeEx(any).filter(function(item)
					{
					return !Orion.Contains(item.Properties(),'blessed|contents:')
					});
				while(items[0])
					{
					Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
					Orion.Wait(1300);
					items = Orion.FindTypeEx(any).filter(function(item)
						{
						return !Orion.Contains(item.Properties(),'blessed|contents:')
						});
					}
				}
			}
		if(Player.X() != 798 && Player.Y() != 3434)
			RecallByGump('Main','Soulforge','Main','Soulforge2');
		while(Orion.Count('0x2DB3') >= 50)
			{
			var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
				{
				return Orion.Contains(check.Properties(), 'Ansikart the Artificer');
				})[0];
			if(!npc)
				return Orion.CharPrint('Quest NPC not nearby! Halting...');
			Orion.UseObject(npc.Serial());
			var time = Orion.Now();
			if(Orion.WaitForGump(2000))
				{
				Orion.Wait(250);
				if(CheckGumpCliloc('0x00000320', '@@#1112537'))
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
						}
					//Orion.Wait(1300 - (Orion.Now() - time));
					Orion.WaitContextMenuID('0x034EBD6D', 801);
					Orion.RequestContextMenu('0x034EBD6D');
					time = Orion.Now();
					if(Orion.WaitForTarget(2000))
						{
						Orion.TargetType('0x2DB3');
						Orion.Wait(200);
						if(Orion.WaitForTarget(2000))
							Orion.CancelTarget();
						}
					Orion.Wait(1300 - (Orion.Now() - time));
					Orion.UseObject(npc.Serial());
					if (Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x0000032A');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(4));
							Orion.Wait(100);
							}
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000323');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(1));
							Orion.Wait(100);
							}
						}
					}
				else
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(2));
						Orion.Wait(100);
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000326');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(3));
							Orion.Wait(100);
							}
						}
					Orion.Wait(1300);
					}
				}
			}
		if(Orion.FindType('0x0E75'))
			{
			if(Player.X() != 2889 && Player.Y() != 680)
				RecallByGump('Main','Bank','Main','Bank2');
			var chiselBackpacks = Orion.FindTypeEx('0x0E75').filter(function(chiselBackpack)
				{
				return !Orion.Contains(chiselBackpack.Properties(), 'Contents: 1/');
				});
			for(var i=0;i<chiselBackpacks.length;i++)
				{
				var pack = chiselBackpacks[i];
				var packSerial = pack.Serial();
				while(!Orion.GumpExists('container',packSerial))
					{
					Orion.UseObject(packSerial);
					Orion.Wait(1300);
					}
				var chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
				while(chiselInBackpack)
					{
					Orion.MoveItem(chiselInBackpack);
					Orion.Wait(1300);
					chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
					}
				}
			var trash = Orion.FindTypeEx(any,any,ground,'item').filter(function(trashCheck)
				{
				return Orion.Contains(trashCheck.Properties(), 'trash')
				})[0];
			if(!trash)
				return Orion.CharPrint(self,1159,'Trash barrel missing! Halting...');
			var leftOverPacks = Orion.FindType('0x0E75')[0];
			while(leftOverPacks)
				{
				Orion.MoveItem(leftOverPacks,0,trash.Serial());
				Orion.Wait(1300);
				leftOverPacks = Orion.FindType('0x0E75')[0];
				}
			}
		}
	}

function AmberTurnin()
	{
	while(Orion.FindType('0x3199')[0])
		{
		var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
			{
			return Orion.Contains(check.Properties(), 'Ansikart the Artificer');
			})[0];
		if(!npc)
			return Orion.CharPrint('Quest NPC not nearby! Halting...');
		Orion.UseObject(npc.Serial());
		if(Orion.WaitForGump(2000))
			{
			Orion.Wait(250);
			if(CheckGumpCliloc('0x00000320', '@@#1113772'))
				{
				var gump = Orion.GetGump('any', '0x00000320');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(1));
					Orion.Wait(100);
					}
				Orion.WaitContextMenuID(self, 801);
				Orion.RequestContextMenu(self);
				var time = Orion.Now();
				if(Orion.WaitForTarget(2000))
					{
					Orion.TargetType('0x3199');
					Orion.Wait(200);
					if(Orion.WaitForTarget(2000))
						Orion.CancelTarget();
					}
				Orion.Wait(1300 - (Orion.Now() - time));
				Orion.UseObject(npc.Serial());
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x0000032A');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(4));
						Orion.Wait(100);
						}
					}
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x00000323');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
						}
					}
				Orion.Wait(500);
				var rewardBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
					{
					return Orion.Contains(bag.Properties(), 'Contents: 1/125');
					})[0];
				while(rewardBag)
					{
					var rewardBagSerial = rewardBag.Serial();
					while(!Orion.GumpExists('container', rewardBagSerial))
						{
						Orion.UseObject(rewardBagSerial);
						Orion.Wait(1300);
						}
					var reward = Orion.FindType(any,any,rewardBagSerial)[0];
					while(reward)
						{
						Orion.MoveItem(reward);
						Orion.Wait(1300);
						reward = Orion.FindType(any,any,rewardBagSerial)[0];						
						}
					rewardBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
						{
						return Orion.Contains(bag.Properties(), 'Contents: 1/125');
						})[0];
					}
				var emptyBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
					{
					return Orion.Contains(bag.Properties(), 'Contents: 0/125');
					})[0];
				while(emptyBag)
					{
					var emptyBagSerial = emptyBag.Serial();
					var dropBag = Orion.FindTypeEx('0x0E76',any,ground,'item',2).filter(function(bag)
						{
						return !Orion.Contains(bag.Properties(), 'Contents: 125/125');
						})[0];
					if(!dropBag)
						{
						Orion.Drop(emptyBagSerial, 0, Player.X(), Player.Y() + 1, -1);
						Orion.Wait(1300);
						}
					else
						{
						Orion.MoveItem(emptyBagSerial,0,dropBag.Serial());
						Orion.Wait(1300);
						}
					emptyBag = Orion.FindTypeEx('0x0E76').filter(function(bag)
						{
						return Orion.Contains(bag.Properties(), 'Contents: 0/125');
						})[0];
					}
				}
			else
				{
				var gump = Orion.GetGump('any', '0x00000320');
				if(gump !== null)
					{
					gump.Select(Orion.CreateGumpHook(2));
					Orion.Wait(100);
					}
				if(Orion.WaitForGump(2000))
					{
					var gump = Orion.GetGump('any', '0x00000326');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(3));
						Orion.Wait(100);
						}
					}
				Orion.Wait(1300);
				}
			}
		}
	}

function CheckGumpCliloc(gumpID, clilocID)//check if clilocID is in gump. Return 1 if it is, 0 if not, and null if gump isn't found. 
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID)
        if(gump !== null)
            return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
    }

function DropOff()
	{
	RecallByGump('Main','Soulforge','Main','Soulforge2');
	Orion.Wait(2000);
	var currentWeight = Player.Weight();
	while(Player.Weight() == currentWeight)
		{
		Orion.UseSkill('Imbuing');
		if(Orion.WaitForGump(1000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E93'))
				{
				gump0.Select(Orion.CreateGumpHook(6));
				Orion.Wait(100);
				}
			}
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(backpack);
		if(Orion.WaitForGump(2000))
			{
			var gump1 = Orion.GetGump('last');
			if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000F3E95'))
				{
				gump1.Select(Orion.CreateGumpHook(1));
				Orion.Wait(100);
				}
			}
		Orion.Wait(2000);
		}
	RecallByGump('Main','Bank','Main','Bank2');
	while(!Orion.GumpExists('container',Player.BankSerial()))
		{
		Orion.Say('bank')
		Orion.Wait(500);
		}
	var frags = Orion.FindTypeEx('0x2DB3')[0];
	if(frags)
		{
		Shared.AddVar('fragCount',Shared.GetVar('fragCount') + frags.Count())
		}
	var essences = Orion.FindTypeEx('0x2DB2')[0];
	if(essences)
		{
		Shared.AddVar('essenceCount',Shared.GetVar('essenceCount') + essences.Count())
		}
	var gold = Orion.FindTypeEx('0x0EED')[0];
	if(gold)
		{
		Shared.AddVar('goldCount',Shared.GetVar('goldCount') + gold.Count())
		}
	var items = Orion.FindTypeEx(any).filter(function(item)
		{
		return !Orion.Contains(item.Properties(),'blessed|contents:')
		});
	while(items[0])
		{
		Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
		Orion.Wait(1300);
		items = Orion.FindTypeEx(any).filter(function(item)
			{
			return !Orion.Contains(item.Properties(),'blessed|contents:')
			});
		}
	}

function WalkThroughCurrentFarm()
	{
	Orion.Terminate('all', 'OniScav|OniScavGump|WalkThroughCurrentFarm|Preservation|JournalScan');
	//if(profile.walkThrough == 'Oni')
		{	
		RecallByGump('Main','Dojo', 'Main', 'Dojo2');
		WalkThrough([[987, 196, false, '67:337:w'],[66, 352, false, '63:524:w'],[103, 556, false, '76:691:w'],[176, 664, '176:664:w']]);
		}
	Orion.Wait(1000);
	Orion.Cast('Invisibility');
	if(Orion.WaitForTarget(6000))
		Orion.TargetObject(self);
	Orion.Wait(500);
	Orion.Exec('initScripts', true);
	}

function WalkThrough(ali)
	{
	// WalkThrough([ [waypointArray], [waypointArray], [waypointArray] ])
	// waypointArray = [x, y]
	// waypointArray = [x, y, step]
	// waypointArray = [x, y, step, testString]
	// testString format = 'xCoordToTest:yCoordToTest:stepDirection'
	
	// Walks to x,y and then if step isn't false, takes a step in whatever direction (e.g 'n','e','s','w'). This step can be useful
	// for certain area transitions, but usually isn't necessary and can be left as false.
	// If a testString is supplied, after attempting to walk to the coordinates given, a check is performed to see if the player
	// coordinates match. If they don't, your character will step in the direction provided and then attempt to walk to the original
	// coordinates again. The test step direction should be AWAY from the area transition, so that the character can re-attempt it.
	// Oni Array: WalkThrough([[987, 196, false, '67:337:w'],[66, 352],[103, 556],[176, 664]])
	for(var i=0;i<ali.length;i++)
		{
		var coords = ali[i];
		Orion.WalkTo(coords[0], coords[1], 0, 0, 255, 1, 1);
		if(coords[2])
			{
			Orion.Wait(250);
			Orion.Step(coords[2], true);
			}
		Orion.Wait(250);
		Orion.Resend();
		Orion.Wait(250);
		if(coords[3])
			{
			var testCoords = Orion.Split(coords[3], ':');
			Orion.Wait(500);
			if(Player.X() != Number(testCoords[0]) || Player.Y() != Number(testCoords[1]))
				{
				Orion.Print('retry');
				if(testCoords[2])
					Orion.Step(testCoords[2], true);
				i--;
				}
			}
		}
	}

function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X();
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName;
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return false;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	var runebookSerial = runeBook[0].Serial();
    Orion.Wait(1300);
	Orion.UseObject(runebookSerial);
	var gump = WaitForSpecificGump(2000, 'generic', runebookSerial, '0x00000059');
	if(gump)
		{
		var runeInd = gump.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(rotateToggle && backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            var runeIndexNum = +runeIndex + 1 
	            if(runeIndexNum <= numRunes)
					runeIndex = String(runeIndexNum); 
	            else
					runeIndex = '1';
	            return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            })[0];
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeName);
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	        {
	        Orion.Wait(2000);
            if(rotateToggle)
                {
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                }
	        return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle);
	}
	
function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}
	
function JournalScan()
	{
	var useDiscordPush = true
	var msg = 'GM|inithome|initfarm'
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0);
		var checkarr = Orion.Split(check.Text(), ' ')
		for(var i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{		
				case 'GM':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": GM")
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(6000);
					break;
				case 'inithome':
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(2000);
					Orion.Exec('RecallByGump', true, ['Main','Home']);
					break;
				case 'initfarm':
					Orion.Terminate('all', 'OniScav|OniScavGump|JournalScan');
					Orion.Exec('WalkThroughCurrentFarm', true);
					break;
				default:
					break;
				}
			}
		}
	}

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ '1022287622137200660' //hook
	+ "/"
	+ 'w0Nsz8IXTJK2ZcJM0hntdlPMeeLKOLSMweHtBhWb7-0vUI8-lvZdkVUUv10r08_vUJMl'; //key
	Orion.HttpPost(bot, "content=" + message);
	}

function test2()
	{
	var allNames = Orion.CreateClientMacro('AllNames')
	var corpseHash = {};
	while(true)
		{
		allNames.Play();
		var corpse = false;
		for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
			var msgSerial = msg.Serial();	
			if(msg.Flags() == 0x08 && msg.Color() == '0x03B2' && !corpseHash[msgSerial])
				{
				Orion.Print(msg.Text());
				corpse = Orion.FindObject(msgSerial);
				}
			}
		Orion.ClearJournal();
		Orion.Wait(1000);
		if(corpse)
			{
			
			corpseHash[msgSerial] = Orion.Now();
			}
		var cullTime = Orion.Now() - 3000;
        var i = 0
		for(var hash in corpseHash)
			{
            Orion.Print(i++)
			if(corpseHash[hash] < cullTime)
				delete corpseHash[hash]
			}
		}
	}

function LootCorpses()
    {
    var lootToBackpack = true;
    var lootBagType = '';
	var corpseGraphic = '0x2006';
    var useLootCorpses = true;
    var hashtable = {};
	if(useLootCorpses)
        {
		var corpses = Orion.FindTypeEx(corpseGraphic, any, ground, "", 20).filter(function(corpse)
            {
            var corpseSerial = corpse.Serial();
            if(hashtable[corpseSerial])
                return false;
            Orion.Click(corpseSerial)
            var publicCheck = Orion.WaitJournal('A Oni Corpse', Orion.Now() - 500, Orion.Now() + 500, 'item', corpseSerial, '0x03B2');
            return Orion.Contains(corpse.Properties(), 'A Oni Corpse') && publicCheck;
            });
		if(!corpses.length)
	        return;
	    var corpseId = corpses[corpses.length - 1];
		if(!corpseId.IsCorpse())
            {
			Orion.Ignore(corpseId.Serial());
			return;
		    }
		WaitForObjectTimeout();
		Orion.OpenContainer(corpseId.Serial());
		lastObjectUsedTime = Orion.Now();
		Orion.Wait(1300);
		Orion.Print("Start Evaluate Item")
		var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
		var lootbag = lootToBackpack ? Orion.GetSerial(backpack) : Orion.FindType(lootBagType, 'any', 'backpack')[0];
		itemsInCorpse.forEach(function(item)
            {
			var itemInstance = Orion.FindObject(item);
			if(itemInstance && itemInstance.Container() !== Player.Container() &&  itemInstance.Container() !== lootbag)
                {
				Orion.Print("Evaluate Item");
				if(ShouldKeepItem(item))
                    {
					WaitForObjectTimeout()
					var movedItem = Orion.FindObject(item);
					if(lootbag)
                        {
						Orion.MoveItem(item, 1000, lootbag);
					    }
					else
                        {
						Orion.MoveItem(item, 1000, 'backpack');
					    }
					var waitForLootbagIndex = 0;
					while(movedItem.Container() !== lootbag && waitForLootbagIndex < 15)
                        {
						waitForLootbagIndex++;
						Orion.Wait(100);
					    }
                    lastObjectUsedTime = Orion.Now();
					//if(useInsureItem)
                        //{
						//InsureItem(item);
					    //}
				    }
				Orion.Ignore(item);
			    }				
		    });
		Orion.Print("Finish Evaluate Items");
		Orion.Ignore(corpseId.Serial());
        }
    }