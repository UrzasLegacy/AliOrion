//gump ID
//var gump0 = '0x000001CC';

//materials
var blankScroll = '0x0EF3';
var emptyBottle = '0x0F0E';
var eggs = '0x09B5';
var ingots = '0x1BF2';

//containers
var trashBarrels = Orion.FindTypeEx('0x0E77', '0x0358', ground, ' ', '2')
var trashBarrel = trashBarrels[0];

//tools
var tinkerTools = ['0x1EB9', 9003, 11, 'Tinker Tools']
var mortarPestle = ['0x09EB', 9003, 9, 'Mortar and Pestle']
var scribePen = ['0x0FBF', 9003, 30, 'Scribes Pen'] 

//magery reagents
var garlic = '0x0F84';
var ginseng = '0x0F85';
var spiderSilk = '0x0F8D';
var nightShade = '0x0F88';
var sulfurishAsh = '0x0F8C';
var blackPearl = '0x0F7A';
var bloodMoss = '0x0F7B';
var mandrakeRoot = '0x0F86';

//necro reagents
var graveDust = '0x0F8F';

//potions
var greaterHealPot = ['0x0F0C', 9001, 42, 'Greater Heal Potion']
var greaterCurePot = ['0x0F07', 9001, 72, 'Greater Cure Potion']
var greaterStrengthPot = ['0x0F09', 9002, 51, 'Greater Strength Potion']
var greaterAgilityPot = ['0x0F08', 9002, 21, 'Greater Agility Potion']
var greaterRefreshPot = ['0x0F0B', 9001, 11, 'Greater Refreshment Potion']
//var greaterConflagration = Orion.FindType('0x0F06', '0x0489', resourceSecure); //(9004, 102)
var deadlyPoisonPot = ['0x0F0A', 9003, 63, 'Deadly Poison Potion']
//var invisibilityPotion = Orion.FindType('0x0F06', '0x0132', resourceSecure); //(9002, 103)
var smokeBomb = ['0x2808', 9005, 83, 'Smoke Bomb'] //(9005, 83)

//scrolls & books
//books
var spellBook = ['0x0EFA', 9006, 202, 'Spellbook']
var runicAtlas = ['0x9C16', 9006, 694, 'Runic Atlas']
var runeBook = ['0x22C5', 9006, 200, 'Runebook']

//magery first circle
var clumsy = '0x1F2E'; //(9001, 1)
var createFood = '0x1F2F'; //(9001, 2)
var feebleMind = '0x1F30'; //(9001, 3)
var heal = '0x1F31'; //(9001, 4)
var magicArrow = '0x1F32'; //(9001, 5)
var nightSight = '0x1F33'; //(9001, 6)
var reactiveArmor = '0x1F2D'; //(9001, 7)
var weaken = '0x1F34'; //(9001, 8)
//magery second circle
var agility = '0x1F35'; //(9001, 9)
var cunning = '0x1F36'; //(9001, 10)
var cure = '0x1F37'; //(9001, 11)
var harm = '0x1F38'; //(9001, 12)
var magicTrap = '0x1F39'; //(9001, 13)
var magicUntrap = '0x1F3A'; //(9001, 14)
var protection = '0x1F3B'; //(9001, 15)
var strength = '0x1F3C'; //(9001, 16)
//magery third circle
var bless = '0x1F3D'; //(9002, 17)
var fireBall = '0x1F3E'; //(9002, 18)
var magicLock = '0x1F3F'; //(9002, 19)
var poison = '0x1F40'; //(9002, 20)
var telekinesis = '0x1F41'; //(9002, 21)
var teleport = '0x1F42'; //(9002, 22)
var unlock = '0x1F43'; //(9002, 23)
var wallOfstone = '0x1F44'; //(9002, 24)
//magery fourth circle
var archCure = '0x1F45'; //(9002, 25)
var archProtection = '0x1F46'; //(9002, 26)
var curse = '0x1F47'; //(9002, 27)
var fireField = '0x1F48'; //(9002, 28)
var greaterHeal = '0x1F49'; //(9002, 29)
var lightning = '0x1F4A'; //(9002, 30)
var manaDrain = '0x1F4B'; //(9002, 31)
var recall = '0x1F4C'; //(9002, 32)
//magery fifth circle
var bladeSpirits = '0x1F4D'; //(9003, 33)
var dispelField = '0x1F4E'; //(9003, 34)
var incognito = '0x1F4F'; //(9003, 35)
var magicReflection = '0x1F50'; //(9003, 36)
var mindBlast = '0x1F51'; //(9003, 37)
var paralyze = '0x1F52'; //(9003, 38)
var poisonField = '0x1F53'; //(9003, 39)
var summonCreature = '0x1F54'; //(9003, 40)

//magery sixth circle
var dispel = '0x1F55'; //(9003, 41)
var energyBolt = '0x1F56'; //(9003, 42)
var explosion = '0x1F57'; //(9003, 43)
var invisibility = '0x1F58'; //(9003, 44)
var mark = '0x1F59'; //(9003, 45)
var massCurse = '0x1F5A'; //(9003, 46)
var paralyzeField = '0x1F5B'; //(9003, 47)
var reveal = '0x1F5C'; //(9003, 48)

//magery seventh circle
var chainLightning = '0x1F5D'; //(9003, 49)
var energyField = '0x1F5E'; //(9003, 50)
var flamestrike = '0x1F5F'; //(9003, 51)
var gateTravel = '0x1F60'; //(9003, 52)
var manaVampire = '0x1F61'; //(9003, 53)
var massDispel = '0x1F62'; //(9003, 54)
var meteorSwarm = '0x1F63'; //(9003, 55)
var polymorph = '0x1F64'; //(9003, 56)

//magery eighth circle
var earthquake = '0x1F65'; //(9003, 57)
var energyVortex = '0x1F66'; //(9003, 58)
var resurrection = '0x1F67'; //(9003, 59)
var airElemental = '0x1F68'; //(9003, 60)
var daemon = '0x1F69'; //(9003, 61)
var earthElemental = '0x1F6A'; //(9003, 62)
var fireElemental = '0x1F6B'; //(9003, 63)
var waterElemental = '0x1F6C'; //(9003, 64)

var makeItem = tinkerTools;
var amountWanted = 50;

function main() {
	Orion.OpenContainer(backpack)
	Orion.CharPrint(self, 1159, 'Select Resource Secure')
	Orion.WaitForAddObject('resourceSecure');
	var resourceSecure = Orion.GetSerial('resourceSecure');
	if (resourceSecure) {
		Orion.OpenContainer(resourceSecure);
		Orion.Wait(1000)
	} else {
		Orion.Print("No resource container found")
	}
	Orion.CharPrint(self, 1159, 'Select Destination Secure')
	Orion.WaitForAddObject('destinationSecure');
	var destinationSecure = Orion.GetSerial('destinationSecure');
	if (destinationSecure) {
		Orion.OpenContainer(destinationSecure);
		Orion.Wait(1000)
	} else {
		Orion.Print("No destination container found")
	}
	if (trashBarrel) {
		Orion.Print(trashBarrel.Name()+" "+trashBarrel.Serial()+" is within range.")
		Orion.Wait(200)
	} else {
		Orion.Print("No trash barrel in range")
	}
	for (var i = 0; i < amountWanted; i++) {
 		craftAlchemyItems(makeItem[1], makeItem[2]);
		Orion.Wait(1000);
 		} else {
 			Orion.Print("You have finished crafting")
		}
	}

function craftAlchemyItems(categoryIndex, ItemIndex) {
	if (Orion.Count(mortarPestle[0], '0x0000', 'backpack') < 1) { //Check backpack for tools, return if they aren't found
		return Orion.CharPrint(self, 1159, 'You are out of Tinkering Tools.  Halting!');
	}
	Orion.UseType(mortarPestle);
	if (Orion.WaitForGump(1000)) {
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC')) {
			gump0.Select(Orion.CreateGumpHook(categoryIndex));
			//Orion.Wait(1500)
			if (Orion.WaitForGump(1000)) {
				var gump0 = Orion.GetGump('last');
				if (gump0 !==null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
					gump0.Select(Orion.CreateGumpHook(itemIndex));
					Orion.Wait(100);

function restock() {
	var resourceSecure = Orion.GetSerial('resourceSecure');
	var itemList = [
		[Ingots, '0x0000', 10, 'Iron Ingots'], 						//0
		[blankScroll, '0x0000', 50, 'Blank Scroll'], 				//1
		[emptyBottle, '0x0000', 50, 'Empty Bottle'], 			//2
		[eggs, '0x0000', 50, 'Eggs'],									//3
		[garlic, '0x0000', 200, 'Garlic'],								//4
		[ginseng, '0x0000', 200, 'Ginseng'],						//5
		[spiderSilk, '0x0000', 200, 'Spiders Silk'],				//6
		[nightShade, '0x0000', 200, 'Nightshade'],				//7
		[sulfurishAsh, '0x0000', 200, 'Sulfurish Ash'],		//8
		[blackPearl, '0x0000', 200, 'Black Pearl'],				//9
		[bloodMoss, '0x0000', 200, 'Blood Moss'],				//10
		[mandrakeRoot, '0x0000', 200, 'Mandrake Root'],	//11
		[graveDust, '0x0000', 200, 'Grave Dust']				//12
	];
	var potionRestockList = [
		[greaterHealPot, itemList[2], itemList[5]],				//0
		[greaterCurePot, itemList[2], itemList[4]],				//1
		[greaterStrengthPot, itemList[2], itemList[11]],		//2
		[greaterAgilityPot, itemList[2], itemList[10]],			//3
		[greaterRefreshPot, itemList[2], itemList[9]],		//4
		[deadlyPoisonPot, itemList[2], itemList[7]],			//5
		[smokeBomb, itemList[3], itemList[5]],					//6
	];
	
		
for (i=0; i < countRows; i++){
	var itemGraphic = itemList[i][0];
	var itemColor = itemList[i][1];
	var restockQuantity = itemList[i][2];
	var itemName = itemLIst[i][3];
	var originalCount = Orion.Count(itemGraphic, itemColor);
	while (Orion.Count(itemGraphic,  itemColor) < restockQuantity){
		itemFound = Orion.FindType(itemGraphic, itemColor, ResourceContainer);
		if (itemFound.length){
			var amountNeeded = restockQuantity - Orion.Count(itemGraphic,  itemColor);
			Orion.Wait(600);
			Orion.MoveItem(itemFound[0], amountNeeded);
			Orion.Wait(600);
			var updatedCount = Orion.Count(itemGraphic, itemColor);
			var addedAmount = updatedCount - originalCount;
			Orion.Print('63', '+ ' + addedAmount + ' ' + itemName + 's');
			originalCount = updatedCount;
		} else {
			break;
		}
	}
}


//function craftTinkerTools(catergoryIndex, itemIndex) {
//	if (Orion.Count(tinkerTools, '0x0000', 'backpack') < 1) {
//		return Orion.CharPrint(self, 1159, 'You are out of Tinkering Tools.  Halting!');
//	} else {
//		Orion.UseType(tinkerTools)
//	if (Orion.WaitForGump(1500)) {
//		var gump0 = Orion.GetGump('last');
//		if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
//			gump0.Select(Orion.CreateGumpHook(catergoryIndex))
			//Orion.Wait(1500)
//			if (Orion.WaitForGump(1500)) {
//				var gump0 = Orion.GetGump('last');
//				if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
//					gump0.Select(Orion.CreateGumpHook(itemIndex))
//					Orion.Wait(500)
//					gump0.Close()
//					Orion.Wait(1500);
//					}
//				}
//			}
//		}
//	}
//}
//function craftTinkerTool(catergoryIndex, itemIndex) {

