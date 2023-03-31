/*====================================================================
 *	Script	: Altiric's Amazing Angler
 *	Author	: Altiric
 *	EMail 	: Altiric@gmail.com
 *	Version	: 0.5
 *	Created	: Dec 10, 2021
 *	Revised : May  4, 2022
 *
 *	Usage	: Will cast recall/gate/journey to your boat and start fishing
 *			  If a pack animal is set, fish will be transfered as needed
 *			  Sea serpents will be killed and looted with MiBs being collected
 *			  Will recall to secure once you're near max weight
 *			  The process continues :)
 *
 *	Revisions:
 *		0.5 - Complete rewrite for public release!
 *			*- Cleaned up and streamed the gumps, squashed bugs
 *			- Added 'fancy' touches :)
 *			*- Added status panel that displays tracked items
 *		0.4 - Added pack animal option, leaving blank is fine.
 *			- If a goat is around, it will be fed footwear!
 *			- Now eats special fish automaticlly
 *			- Drops footwear on serpents after looting
 *		0.3 - Created Counter system, now tracks fish and items
 *			- Made a journal system to show last 50 actions taken
 *		0.2 - Added combat ability with auto looter
 *			- Added basic travel ability
 *		0.1 - Created gump based GUI that imports/exports settings
 *			- Standard High Seas fishing
 ====================================================================*/

 const fishTypes = [
	{name: "Amberjack",			data: {graphic: '0x44C6', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Black Seabass",		data: {graphic: '0x09CE', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Blue Grouper",		data: {graphic: '0x4306', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Bluefish",			data: {graphic: '0x09CC', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Bluegill Sunfish", 	data: {graphic: '0x4306', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Bonefish",			data: {graphic: '0x44C3', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Bonito",			data: {graphic: '', color: '', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Brook Trout",		data: {graphic: '0x09CC', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Cape Cod",			data: {graphic: '0x4306', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Captain Snook",		data: {graphic: '0x44C5', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Cobia",				data: {graphic: '0x4303', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Crag Snapper",		data: {graphic: '0x44C4', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Cutthroat Trout",	data: {graphic: '0x4303', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Darkfish",			data: {graphic: '0x4307', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Demon Trout",		data: {graphic: '0x4302', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Drake Fish",		data: {graphic: '', color: '', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Dungeon Chub",		data: {graphic: '', color: '', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Gray Snapper",		data: {graphic: '0x4302', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Green Catfish",		data: {graphic: '0x44C6', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Grim Cisco",		data: {graphic: '0x44C3', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Haddock",			data: {graphic: '0x09CC', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Infernal Tuna",		data: {graphic: '', color: '', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Kokanee Salmon",	data: {graphic: '0x4303', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Lurker Fish",		data: {graphic: '0x09CE', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Mahi-Mahi",			data: {graphic: '0x44C5', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "OrcBass",			data: {graphic: '0x09CC', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Pike",				data: {graphic: '0x44C4', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Pumpkinseed Sunfish",data: {graphic: '0x4307', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Rainbow Trout",		data: {graphic: '0x4302', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "RedDrum",			data: {graphic: '0x4302', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Red Grouper",		data: {graphic: '0x4307', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Red Snook",			data: {graphic: '0x09CD', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Redbelly Bream",	data: {graphic: '0x4307', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Shad",				data: {graphic: '0x4302', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Smallmouth Bass",	data: {graphic: '', color: '', found: 'shores', rarity: 'common', cut: true}},
	{name: "Snaggletooth Bass", data: {graphic: '0x09CF', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Tarpon",			data: {graphic: '0x44C3', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Tormented Pike",	data: {graphic: '0x44C3', color: '0x0000', found: 'dungeons', rarity: 'common', cut: true}},
	{name: "Uncommon Shiner",	data: {graphic: '0x09CE', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Walleye",			data: {graphic: '0x09CF', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Yellow Perch",		data: {graphic: '0x4303', color: '0x0000', found: 'shores', rarity: 'common', cut: true}},
	{name: "Yellowfin Tuna",	data: {graphic: '0x44C4', color: '0x0000', found: 'deep water', rarity: 'common', cut: true}},

	// Rare
	{name: "Autumn Dragonfish",	data: {graphic: '', color: '0x0000', found: 'illshenar', rarity: 'rare', cut: true}},
	{name: "Bull Fish",			data: {graphic: '', color: '0x0000', found: 'labyrinth', rarity: 'rare', cut: true}},
	{name: "Crystal Fish",		data: {graphic: '', color: '0x0000', found: 'prism of light', rarity: 'rare', cut: true}},
	{name: "Fairy Salmon",		data: {graphic: '', color: '0x0000', found: 'termur', rarity: 'rare', cut: true}},
	{name: "Fire Fish",			data: {graphic: '', color: '0x0000', found: 'shame', rarity: 'rare', cut: true}},
	{name: "Giant Koi",			data: {graphic: '', color: '0x0000', found: 'tokuno', rarity: 'rare', cut: true}},
	{name: "Great Barracuda",	data: {graphic: '0x44C3|0x44C4', color: '0x05B5', found: 'felucca', rarity: 'rare', cut: true}},
	{name: "Holy Mackerel",		data: {graphic: '', color: '0x0000', found: 'gravewater lake', rarity: 'rare', cut: true}},
	{name: "Lava Fish",			data: {graphic: '', color: '0x0000', found: 'stigian abyss', rarity: 'rare', cut: true}},
	{name: "Reper Fish",		data: {graphic: '', color: '0x0000', found: 'doom', rarity: 'rare', cut: true}},
	{name: "Summer Dragonfish",	data: {graphic: '', color: '0x0000', found: 'destard', rarity: 'rare', cut: true}},
	{name: "Unicorn Fish",		data: {graphic: '', color: '0x0000', found: 'twisted weald', rarity: 'rare', cut: true}},
	{name: "Yellowtail Barracuda",data: {graphic: '', color: '0x0000', found: 'trammel', rarity: 'rare', cut: true}},

	// Legendary
	{name: "Abyssal Dragonfish",data: {graphic: '', color: '0x0000', found: 'destard', rarity: 'legendary', cut: true}},
	{name: "Black Marlin",		data: {graphic: '0x4304', color: '0x09C4', found: 'felucca', rarity: 'legendary', cut: true}},
	{name: "Blue Marlin",		data: {graphic: '', color: '0x0000', found: 'trammel', rarity: 'legendary', cut: true}},
	{name: "Dungeon Pike",		data: {graphic: '', color: '0x0000', found: 'terathan keep', rarity: 'legendary', cut: true}},
	{name: "Giant Samurai Fish",data: {graphic: '', color: '0x0000', found: 'tokuno', rarity: 'legendary', cut: true}},
	{name: "Golden Tuna",		data: {graphic: '', color: '0x0000', found: 'tokuno', rarity: 'legendary', cut: true}},
	{name: "Kingfish",			data: {graphic: '', color: '0x0A2C', found: 'trammel felucca', rarity: 'legendary', cut: true}},
	{name: "Lantern Fish",		data: {graphic: '', color: '0x0000', found: 'prism of light', rarity: 'legendary', cut: true}},
	{name: "Rainbow Fish",		data: {graphic: '', color: '0x0000', found: 'twisted weald', rarity: 'legendary', cut: true}},
	{name: "Red Herring",		data: {graphic: '', color: '0x0676', found: 'deep water', rarity: 'common', cut: true}},
	{name: "Seeker Fish",		data: {graphic: '', color: '0x0000', found: 'labyrinth', rarity: 'legendary', cut: true}},
	{name: "Spring Dragonfish",	data: {graphic: '', color: '0x0000', found: 'illshenar', rarity: 'legendary', cut: true}},
	{name: "Stone Fish",		data: {graphic: '', color: '0x0000', found: 'lost lands trammel', rarity: 'legendary', cut: false}},
	{name: "Winter Dragonfish", data: {graphic: '', color: '0x0000', found: 'ice dungeon', rarity: 'legendary', cut: true}},
	{name: "Zombie Fish",		data: {graphic: '', color: '0x0000', found: 'gravewater lake', rarity: 'legendary', cut: true}},

	//Other
	{name: "Delicate Scales",	data: {graphic: '0x573A', color: '0x0000', found: 'everywhere', rarity: 'common', cut: false}},
	{name: "MiB",				data: {graphic: '0xA30C', color: '0x0000', found: 'deep water', rarity: 'uncommon', cut: false}},
	{name: "White Pearl",		data: {graphic: '0x3196', color: '0x0000', found: 'deep water', rarity: 'rare', cut: false}},
];

const color = {
	green 	: {light: '0x0046', norm: '0x0044', dark: '0x00A7'},
	blue	: {light: '0x0064', norm: '0x0062', dark: '0x00C5'},
	red		: {light: '0x0028', norm: '0x0026', dark: '0x0089'},
	orange	: {light: '0x002D', norm: '0x002B', dark: '0x008E'},
	purple	: {light: '0x001E', norm: '0x0017', dark: '0x007A'},
	yellow	: {light: '0x0037', norm: '0x0035', dark: '0x0098'},
	white	: {light: '0x801', norm: '0x7F4', dark: '0x7E6'},
	wood	: {oak: '0x4A5', ash: '0x4A6', yew: '0x4A7', heartwood: '0x4A8', bloodwood: '0x4A9', frostwood: '0x4AB'},
	metal	: {iron: '0x0000', dull: '0x0973', shadow: '0x0966', copper: '0x096D', bronze: '0x0972', gold: '0x08A5', agapite: '0x0979', verite: '0x089F', valorite: '0x08AB'},
	cloth 	: {spined: '0x08AC', horned: '0x0845', barbed: '0x0851'},
	fade	: {l: '0x7E2', k: '0x7E6', j: '0x7E8', i: '0x7EB', h: '0x7EE', g: '0x7F1', f: '0x7F4', e: '0x7F7', d: '0x7FA', c: '0x7FD', b: '0x7FF', a: '0x801'},
	elemental: {fire: '0x4E8', cold: '0x4EE', poison: '0x4F4', energy: '0x4FA'}
};

const items = {
	"fishpole"	: '0x0DBF',
	"mib"		: '0xA30C',
	"eatfish"	: '0x0DD6',
	"gate"		: '0x0DDB',
	"boots"		: '0x170F|0x1710|0x170E|0x170D|0x170C|0x170B|0x1711|0x1712',
	"goat"		: '0x00D1',
	"pearls"	: '0x3196',
	"scales"	: '0x573A',
	"nets"		: '0x0DCA'
};

var disp = Orion.CreateCustomGump(70000), fisher = readFisher(), version = "0.5";
Shared.AddVar('fishing', false);
Shared.RemoveArray('history');
Shared.AddVar('action', "Loading...");
Orion.ClearIgnoreList('serpCorpse');

function AutoRun(){
	var width = 300, height = 250;
	disp.Clear();
	disp.SetCallback('handler');
	disp.AddResizepic(25, 25, 0x1400, width, height);
	disp.AddButton(80005, 250, 65, 0x7D6, 0x7D8, 0x7D7, 0x0000, 0, 1);
	disp.AddTooltip("Load Options");
	if(Shared.GetVar('fishing', false)){
		disp.AddButton(80006, 250, 90, 0x842, 0x844, 0x843, 0x0000);
		disp.AddTooltip("Stop Fishing");
	} else {
		disp.AddButton(80006, 250, 90, 0x83F, 0x841, 0x840, 0x0000);
		disp.AddTooltip("Begin Fishing");
	}
	disp.AddButton(80007, 250, 115, 0x7DC, 0x7DE, 0x7DC, 0x0000);
	disp.AddTooltip("View Journal");
	disp.AddButton(80008, 250, 140, 0x7EB, 0x7ED, 0x7EC, 0x0000, 0, 4);
	disp.AddTooltip("View Collection Status");

	if(!fisher.runebook)
		disp.SetPage(1);
	disp.AddPage(0);
		disp.AddText(40, 30, color.yellow.norm, "Altiric's Amazing Angler v" +version, 300, 70031);
		var history = Shared.GetArray('history');
		if(history){
			var hist;
			hist = history.pop();
			if(hist){
				disp.AddText(35, (height-5), color.white.norm, '[' +hist.time +']', 300, 70011);
				disp.AddText(100, (height-5), color.white.norm, hist.text, 300, 70012);
			}
			hist = history.pop();
			if(hist){
				disp.AddText(35, (height-20), color.white.dark, '[' +hist.time +']', 300, 70013);
				disp.AddText(100, (height-20), color.white.dark, hist.text, 300, 70014);
			}
			hist = history.pop();
			if(hist){
				disp.AddText(35, (height-35), color.white.dark, '[' +hist.time +']', 300, 70015);
				disp.AddText(100, (height-35), color.white.dark, hist.text, 300, 70016);
			}
		}
	disp.AddPage(1);
		disp.AddButton(80001, 60, 72, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.runebook)
			disp.AddTooltip("Clear Runebook");
		else
			disp.AddTooltip("Set Runebook");
		disp.AddText(80, 70, fisher.runebook ? color.green.norm : color.red.norm, "Runebook", 300, 70002);

		disp.AddButton(80002, 60, 87, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.fish)
			disp.AddTooltip("Clear Fish Secure")
		else
			disp.AddTooltip("Set Fish Secure");
		disp.AddText(80, 85, fisher.fish ? color.green.norm : color.red.norm, "Fish Secure", 300, 70003);

		disp.AddButton(80009, 60, 102, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.mib)
			disp.AddTooltip("Clear MiB Secure")
		else
			disp.AddTooltip("Set MiB Secure");
		disp.AddText(80, 100, fisher.mib ? color.green.norm : color.red.norm, "MiB Secure", 300, 70026);

		disp.AddButton(80010, 60, 117, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.loot)
			disp.AddTooltip("Clear Loot Secure")
		else
			disp.AddTooltip("Set Loot Secure");
		disp.AddText(80, 115, fisher.loot ? color.green.norm : color.red.norm, "Loot Secure", 300, 70027);

		disp.AddButton(80003, 60, 132, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.pack)
			disp.AddTooltip("Clear Pack Animal");
		else
			disp.AddTooltip("Set Pack Animal");
		disp.AddText(80, 130, fisher.pack ? color.green.norm : color.red.norm, "Pack Animal", 300, 70004);

		disp.AddButton(80004, 60, 147, 0x4B9, 0x4BA, 0x4B9, 0x0000);
		if(fisher.tiller)
			disp.AddTooltip("Clear Tillerman");
		else
			disp.AddTooltip("Set Tillerman");
		disp.AddText(80, 145, fisher.tiller ? color.green.norm : color.red.norm, "Tillerman", 300, 70005);

		disp.AddText(60, 160, color.white.norm, "Travel Method", 300, 70006);
		disp.AddComboBox(90000, 150, 160, 0x0BB8, 0, 0x0BB8, 100, -3);
		disp.AddComboBoxText("Recall", color.black, fisher.runebook.travel == 0 ? 0 : 1);
		disp.AddComboBoxText("Gate Travel", color.black, fisher.runebook.travel == 1 ? 0 : 1);
		disp.AddComboBoxText("Sacred Journey", color.black, fisher.runebook.travel == 2 ? 0 : 1);

		disp.AddText(60, 180, color.white.norm, "Home Rune", 300, 70007);
		disp.AddComboBox(90001, 150, 180, 0x0BB8, 0, 0x0BB8, 50, -3);
		for(i=1;i<17;i++)
			disp.AddComboBoxText(i, color.black, fisher.runebook.home == i ? 1 : 0);

		disp.AddText(60, 200, color.white.norm, "Ship Rune", 300, 70008);
		disp.AddComboBox(90002, 150, 200, 0x0BB8, 0, 0x0BB8, 50, -3);
		for(i=1;i<17;i++)
			disp.AddComboBoxText(i, color.black, fisher.runebook.ship == i ? 1 : 0);
	disp.AddPage(2);
		disp.AddText(40, 40, color.white.light, "Location:", 200, 70017);
		disp.AddText(100, 40, color.white.norm, Orion.XYToSextant(Player.X(), Player.Y()), 300, 70018);
		disp.AddText(40, 55, color.white.light, "Weight:", 200, 70019);
		disp.AddGumpPic(90, 60, 0x0805, color.fade.g, 60005, 0);
		var bar = 0x0808;
		if(Player.Weight("%") > 70 && Player.Weight("%") < 85)
			var bar = 0x0809;
		else if(Player.Weight("%") >= 85)
			var bar = 0x805;
		disp.AddGumpPic(90, 60, bar, 0, 60006, 0, Math.round((Player.Weight()/Player.MaxWeight())*100+9), 12);

		if(fisher.pack){
			var packy = Orion.FindObject(fisher.pack.serial);
			disp.AddText(40, 70, color.white.light, "Packy:", 200, 70030);
			disp.AddGumpPic(90, 75, 0x0805, color.fade.g, 60007, 0);
			var weight = ((packy.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0);
			var perc = Math.round((weight / 1600)*100+9);
			var bar = 0x0808;
			if(perc > 70 && perc < 85)
				var bar = 0x0809;
			else if(perc >= 85)
				var bar = 0x805;
			disp.AddGumpPic(90, 75, bar, 0, 60008, 0, perc, 12);
		}
		disp.AddText(40, 85, color.white.light, "Action:", 200, 70021);
		disp.AddText(90, 85, color.white.norm, Shared.GetVar('action'), 300, 70022);
	disp.AddPage(3);
		var hitsColor = 0x0386, manaColor = 0x0386;
		disp.AddText(40, 40, color.white.light, "Health:", 200, 70023);
		disp.AddGumpPic(90, 45, 0x0805, 0x0000, 60001, 0x0000);
		var bar = 0x0806;
		if(Player.Poisoned())
			var bar = 0x0808;
		else if(Player.YellowHits())
			var bar = 0x0809;
		else if(Player.Hits("%") < 30)
			var bar = 0x805;
		disp.AddGumpPic(90, 45, bar, 0, 60002, 0, Math.round((Player.Hits()/Player.MaxHits())*100+9), 12);

		disp.AddText(40, 55, color.white.light, "Mana:", 200, 70028);
		disp.AddGumpPic(90, 60, 0x0805, 0x0000, 60003, 0x0000);
		var bar = 0x0806;
		if(Player.Mana("%") > 30 && Player.Mana("%") < 70)
			var bar = 0x0809;
		else if(Player.Mana("%") < 30)
			var bar = 0x805;
		disp.AddGumpPic(90, 60, bar, 0, 60004, 0, Math.round((Player.Mana()/Player.MaxMana())*100+9), 12);

		var targ = Orion.FindObject(Orion.ClientLastAttack());
		if(targ){
			disp.AddText(40, 70, color.white.light, "Target:", 75, 70029);
			disp.AddGumpPic(90, 75, 0x0805, 0x0000, 60009, 0x0000);
			var bar = 0x0806;
			if(targ.Poisoned())
				var bar = 0x808;
			else if(targ.YellowHits())
				var bar = 0x0809;
			else if(Player.Hits("%") < 30)
				var bar = 0x805;
			disp.AddGumpPic(90, 75, bar, 0, 60010, 0, Math.round((targ.Hits()/targ.MaxHits())*100+9), 12);
		}
	disp.Update();
}

function handler(){
	var button = CustomGumpResponse.ReturnCode();
	fisher.runebook.travel = CustomGumpResponse.ComboBox(90000);
	fisher.runebook.home = (CustomGumpResponse.ComboBox(90001)+1);
	fisher.runebook.ship = (CustomGumpResponse.ComboBox(90002)+1);

	if(button == 0)
		saveFisher(fisher);
	else if(button == 80001){
		if(fisher.runebook){
			fisher.runebook = false;
			saveFisher(fisher);
			setStatus("Runebook Cleared");
		} else {
			setStatus("Select a runebook");
			Orion.WaitForAddObject('target');
			var item = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.runebook = {name: item.Name(), serial: item.Serial()};
			saveFisher(fisher);
			setStatus("New Runebook Set");
		}
	} else if(button == 80002){
		if(fisher.fish){
			fisher.fish = false;
			saveFisher(fisher);
			setStatus("Fish Secure Cleared");
		} else {
			setStatus("Select a secure for Fish");
			Orion.WaitForAddObject('target');
			var item = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.fish = {name:item.Name(),serial:item.Serial(),x:item.X(),y:item.Y(),z:item.Z()};
			saveFisher(fisher);
			setStatus("Fish Secure Container Set");
		}
	} else if(button == 80009){
		if(fisher.mib){
			fisher.mib = false;
			saveFisher(fisher);
			setStatus("MiB Secure Cleared");
		} else {
			setStatus("Select a secure for MiBs");
			Orion.WaitForAddObject('target');
			var item = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.mib = {name:item.Name(),serial:item.Serial(),x:item.X(),y:item.Y(),z:item.Z()};
			saveFisher(fisher);
			setStatus("MiB Secure Container Set");
		}
	} else if(button == 80010){
		if(fisher.loot){
			fisher.secure.loot = false;
			saveFisher(fisher);
			setStatus("Loot Secure Cleared");
		} else {
			setStatus("Select a secure for Loot");
			Orion.WaitForAddObject('target');
			var item = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.loot = {name:item.Name(),serial:item.Serial(),x:item.X(),y:item.Y(),z:item.Z()};
			saveFisher(fisher);
			setStatus("Loot Secure Container Set");
		}
	} else if(button == 80003){
		if(fisher.pack){
			fisher.pack = false;
			saveFisher(fisher);
			setStatus("Pack Animal Cleared");
		} else {
			setStatus("Select a Pack Animal");
			Orion.WaitForAddObject('target');
			var object = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.pack = {name: object.Name(), serial: object.Serial()};
			saveFisher(fisher);
			setStatus("New Pack Animal set");
		}
	} else if(button == 80004){
		if(fisher.tiller){
			fisher.tiller = false;
			saveFisher(fisher);
			setStatus("Tillerman Cleared");
		} else {
			setStatus("Select your Tillerman");
			Orion.WaitForAddObject('target');
			var object = Orion.FindObject('target');
			Orion.RemoveObject('target');
			fisher.tiller = {serial: object.Serial()};
			saveFisher(fisher);
			setStatus("Tillerman Set");
		}
	} else if(button == 80006){
		if(Shared.GetVar('fishing') == true){
			disp.SetPage(0);
			Shared.AddVar('fishing', false);
			setStatus("Stopping Auto Fisher");
		} else {
			disp.SetPage(2);
			Shared.AddVar('fishing', true);
			setStatus("Running Auto Fisher");
			autoFisher();
		}
	} else if(button == 80007){
		setStatus("Opening Journal");
		if(!TextWindow.IsOpened())
			TextWindow.Open();
		TextWindow.Clear();
		var hist = Shared.GetArray('history');
		for(i in hist)
			TextWindow.Print('[' +hist.time +'] ' +hist.text);
	}
}

function readFisher(){
	var file = Orion.NewFile(), pfile, lines, data = [[]];
	file.Open(Player.Serial() + '.fish');
	pfile = file.ReadAll();
	file.Close();
	lines = pfile.split('\n');
	data.runebook 	= lines[0] ? JSON.parse(lines[0]) : false;
	data.fish		= lines[1] ? JSON.parse(lines[1]) : false;
	data.mib 		= lines[2] ? JSON.parse(lines[2]) : false;
	data.loot		= lines[3] ? JSON.parse(lines[3]) : false;
	data.pack 		= lines[2] ? JSON.parse(lines[4]) : false;
	data.tiller 	= lines[3] ? JSON.parse(lines[5]) : false;
	data.filter(Boolean);
	return data;
}

function saveFisher(data){
	data.filter(Boolean);
	var file = Orion.NewFile();
	file.Open(Player.Serial() + '.fish');
	file.Write(JSON.stringify(data.runebook)+'\n');
	file.Write(JSON.stringify(data.fish)+'\n');
	file.Write(JSON.stringify(data.mib)+'\n');
	file.Write(JSON.stringify(data.loot)+'\n');
	file.Write(JSON.stringify(data.pack)+'\n');
	file.Write(JSON.stringify(data.tiller)+'\n');
	file.Close();
}

function setStatus(txt){
	var hist = Shared.GetArray('history');
	hist.push({time: Orion.Time('hh:mm:ss'), text: txt});
	Shared.AddArray('history', hist);
	if(TextWindow.IsOpened())
		TextWindow.Print('[' +Orion.Time('hh:mm:ss') +'] ' +txt);
	AutoRun();
}

function setAction(txt){
	Shared.AddVar('action', txt);
	AutoRun();
}

function autoFisher(){
	var x = -4, y = -4;
	Orion.ClearJournal();
	if(Orion.FindObject(fisher.fish.serial)){
		if(Player.Weight("%") > 70){
			Orion.WalkTo(fisher.fish.x, fisher.fish.y, fisher.fish.z, 2, 255, 0, 1);
			Orion.Wait(200);
			unloadPack();
		}
	}

	while(!Orion.FindObject(fisher.tiller.serial)){
		travel(fisher.runebook.ship);
		Orion.Wait(2000);
	}

	var tiller = Orion.FindObject(fisher.tiller.serial);
	Orion.SetBadLocation(tiller.X(), (tiller.Y()-2));
	Orion.WalkTo(tiller.X(), (tiller.Y()-1), tiller.Z(), 0, 255, 0);
	Orion.Wait(200);
	if(Orion.ObjAtLayer('Mount')){
		Orion.UseObject('self');
		Orion.Wait('useitemdelay');
	}

	while(Orion.Connected()){
		Orion.Resend();
		while(x < 5 && y < 5){
			if(!Shared.GetVar('fishing')){
				Orion.ToggleScript('autoFisher', true);
				setStatus("Stopped Fishing");
				return;
			}
			checkWeight();
			if(!Orion.DisplayTimerExists('fishing')){
				setAction("Fishing");
				Orion.AddWaitTargetTileRelative('water', x, y, Player.Z());
				setRod();
				Orion.AddDisplayTimer('fishing', 8500, 'UnderChar', 'Line|Bar', 'Fishing', 0, 0, 'any', -1, '0x0000FFFE');
				Orion.Wait('useitemdelay');
				Orion.CancelWaitTarget();
			}
			if(Orion.Count(items['eatfish']) > 0){
				Orion.UseType(items['eatfish']);
				Orion.Wait('useitemdelay');
			}
			feedGoat();
			if(Orion.InJournal("You pull out an item")){
				var msg = Orion.InJournal("You pull out an item");
				var fish = msg.Text().match(/You\spull\sout\san\s(.*):\s(.*)/i)[2] || 'unknown';
				for(i in fishTypes){
					if(fishTypes[i].name.toLowerCase() == fish){
						var newCnt = addCount(fish);
						setStatus("Caught " +fish +' (' +newCnt +')');
					}
				}
				Orion.ClearJournal("You pull out an item");
				Orion.RemoveDisplayTimer('fishing');
			}
			if(Orion.InJournal("As you reel in, you notice")){
				Orion.ClearJournal("As you reel in, you notice");
				addCount("delicate scales");
			}
			if(Orion.InJournal("You have found a white pearl")){
				Orion.ClearJournal("You have found a white pearl");
				var newCnt = addCount("White Pearl");
				setStatus("Found White Pearl (" +newCnt +')');
			}
			if(Orion.InJournal("The fish don't seem to be")){
				Orion.ClearJournal("The fish don't seem to be");
				Orion.RemoveDisplayTimer('fishing');
				Orion.Wait(500);
				x+=8;
				if(x>4){
					x=-4;
					y+=8;
				}
				if(y > 8)
					return;
			}
			if(Orion.FindType(0x0096, any, ground, 'near|mobile|live', 12, 'gray|criminal|enemy').length > 0){
				disp.SetPage(3);
				setStatus("Fighting");
				var serpents = Orion.FindType(0x0096, any, ground, 'near|mobile|live', 12, 'gray|criminal|enemy');
				var serp = Orion.FindObject(serpents[0]);
				while(serp.Exists()){
					Orion.Cast('Mind Blast', serp.Serial());
					Orion.Wait(3000);
					AutoRun();
				}
				while(!Orion.FindType(0x2006, any, ground, 'item', 6))
					Orion.Wait(500);
				setStatus("Looting");
				Orion.Wait(2000);
				var corpse = Orion.FindTypeEx(0x2006, any, ground, 'item', 6)[0];
				Orion.UseIgnoreList('serpCorpse');
				if(corpse.Distance() > 2){
					Orion.WalkTo(corpse.X(), corpse.Y(), corpse.Z(), 2, 255, 0);
					Orion.Wait(200);
					var moved = true;
				}
				Orion.UseObject(corpse.Serial());
				Orion.WaitForContainerGump();
				Orion.Wait('useitemdelay');

				Orion.FindTypeEx(items['mib'], any, lastcontainer).forEach(function(item){
					if(Orion.MoveItemType(items['mib'], any, corpse.Serial(), 0, backpack))
						addCount("MiB");
					Orion.Wait('moveitemdelay');
				});
				Orion.FindType(items['boots'], any, backpack).forEach(function(boot){
					Orion.MoveItem(boot, 0, corpse.Serial());
					Orion.Wait('moveitemdelay');
				});
				Orion.AddIgnoreListObject('serpCorpse', corpse.Serial(), Orion.Time('hh:mm:ss'));
				if(moved){
					var moved = false;
					var tiller = Orion.FindObject(fisher.tiller.serial);
					Orion.SetBadLocation(tiller.X(), (tiller.Y()-2));
					Orion.WalkTo(tiller.X(), (tiller.Y()-1), tiller.Z(), 0, 255, 0);
					Orion.Wait(200);
				}
				disp.SetPage(2);
				disp.Update();
			}
			Orion.Wait(500);
		}
		Orion.Say("Forward");
		Orion.Wait(10000);
		Orion.Say("Stop");
	}
	Orion.Wait(500);
}

function setRod(){
	var held = Orion.ObjAtLayer('LeftHand');
	if(held && Orion.Contains(held.Name(), "Fishing")){
		Orion.UseObject(held.Serial());
		Shared.AddVar('lastRod', held.Serial());
	} else if(Orion.FindObject(Shared.GetVar('lastRod')))
		Orion.UseObject(Shared.GetVar('lastRod'));
	else if(Orion.Count(items['fishpole']) > 0)
		Orion.UseType(items['fishpole'], any, backpack);
	else {
		travel(fisher.runebook.home);
		Orion.WalkTo(fisher.secure.x, fisher.secure.y, fisher.secure.z, 1, 255, 0);
		unloadPack();
		setStatus("Out of Rods");
		Orion.PauseScript();
	}
}

function checkWeight(){
	if(Player.Weight("%") < 90)
		return;
	if(fisher.pack){
		var pack = Orion.FindObject(fisher.pack.serial);
		if(((pack.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0) > 1400)
			secureRun();
		else
			loadPack();
	} else {
		secureRun();
	}
	if(Player.Weight("%") > 80)
		secureRun();
}

function secureRun(){
	setAction("Secure Run");
	while(!travel(fisher.runebook.home))
		Orion.Wait(2000);
	setStatus("Moving to secure");
	while(!Orion.WalkTo(fisher.fish.x, fisher.fish.y, fisher.fish.z, 1, 255, 0, 1))
		Orion.Wait(1000);
	setStatus("Unloading Backpack");
	fishTypes.filter(function(fish){
		return Orion.FindType(fish.data.graphic, fish.data.color, backpack).length > 0;
	}).forEach(function(fish){
		AutoRun();
		Orion.MoveItemType(fish.data.graphic, fish.data.color, backpack, 0, fisher.fish.serial);
		Orion.Wait('moveitemdelay');
	});
	unloadPack();
	if(Orion.ShardName().match(/Siege Perilous/i)){
		if(Orion.Count(items['fishrod']) < 3){
			Orion.UseObject(fisher.loot.serial);
			Orion.WaitForContainerGump();
			Orion.Wait('useitemdelay');
			if(Orion.FindType(items['fishrod'], any, fisher.loot.serial)){
				if(Orion.Count(items['fishrod']) < 3){
					Orion.MoveItemType(items['fishrod'], any, fisher.loot.serial, 0, backpack);
					Orion.Wait('moveitemdelay');
				}
			}
		}
	}

	setStatus("Returning to Ship");
	while(!travel(fisher.runebook.ship))
		Orion.Wait(2000);
}

function loadPack(){
	if(!fisher.pack)
		return;
	setStatus("Loading " +fisher.pack.name);
	var pack = Orion.FindObject(fisher.pack.serial);
	var fishFound = fishTypes.filter(function(fish){
		return Orion.FindType(fish.data.graphic, fish.data.color, backpack).length > 0;
	});
	fishFound.forEach(function(fish){
		AutoRun();
		if(((pack.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0) > 1400)
			return false;
		if(Orion.MoveItemType(fish.data.graphic, fish.data.color, backpack, 0, fisher.pack.serial))
			Orion.Wait('moveitemdelay');
	});
}

function unloadPack(){
	if(!fisher.pack)
		return;
	setStatus("Unloading " +fisher.pack.name);
	Orion.RequestContextMenu(fisher.pack.serial);
	Orion.WaitContextMenuID(fisher.pack.serial, 508);
	Orion.WaitForContainerGump();
	Orion.Wait('useitemdelay');
	Orion.FindTypeEx(any, any, lastcontainer).forEach(function(item){
		if(item.Graphic() == items['mib'])
			Orion.MoveItem(item.Serial(), 0, fisher.mib.serial);
		else if(item.Graphic() == items['pearls'] || item.Graphic() == items['scales'] || item.Graphic() == items['nets'])
			Orion.MoveItem(item.Serial(), 0, fisher.loot.serial);
		else
			Orion.MoveItem(item.Serial(), 0, fisher.fish.serial);
		AutoRun();
		Orion.Wait('moveitemdelay');
	});
}

function travel(location){
	var psx = Player.X(), psy = Player.Y();
	Orion.Wait('useitemdelay');
	Orion.Print("Stored Method: " +fisher.runebook.travel);
	if(fisher.runebook.travel == 0){ // Recall
		setStatus("Recalling");
		location += 49;
	} else if(fisher.runebook.travel == 1){ // Gate
		setStatus("Gate Travel");
		location += 99;
	} else if(fisher.runebook.travel == 2){ // Secred Journey
		setStatus("Sacred Journey");
		location += 74;
	}
	Orion.UseObject(fisher.runebook.serial);
	Orion.WaitGump(Orion.CreateGumpHook(location));
	if(fisher.runebook.travel == 1){
		Orion.SetTimer('break');
		while(Orion.Timer('break') < 5000 && !Orion.FindType(items['gate'], any, ground, 'near|item', 2))
			Orion.Wait(500);
		Orion.Wait(4000);
		Orion.SetTimer('break');
		while(Orion.Timer('break') < 5000 && Player.X() == psx && Player.Y() == psy){
			Orion.UseFromGround(items['gate'], any, 2, 'item|near')
			Orion.Wait(3000);
		}
	}
	Orion.Wait('useitemdelay');
	Orion.CancelWaitGump();
	Orion.CancelWaitTarget();
	if(Player.X() == psx && Player.Y() == psy)
		return false;
	return true;
}

function addCount(fishName){
	var file = Orion.NewFile(), newCnt = 1, found = false;
	file.Open(Player.Serial() +'.fcnt');
	var fdata = file.ReadAll();
	file.Close();
	var data = fdata.length > 0 ? JSON.parse(fdata) : [];
	for(i in data){
		if(data[i].name == fishName){
			newCnt = data[i].count;
			newCnt++;
			data[i].count = newCnt;
			found = true;
		}
	}
	if(found == false)
		data.push({name: fishName, count: 1});

	file.Open(Player.Serial() +'.fcnt');
	file.Write(JSON.stringify(data));
	file.Close();
	return newCnt;
}

function feedGoat(){
	var goat = Orion.FindType(0x00D1, any, ground)[0];
	if(!goat)
		return;
	var boots = Orion.FindType(items['boots'], any, backpack).forEach(function(boot){
		Orion.MoveItem(boot, 0, goat);
		Orion.Wait('moveitemdelay');
	});
}
