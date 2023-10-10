//Weight
var maxWeight = Player.MaxWeight() - 375;

//materials
var emptyBottle = '0x0F0E';
var eggs = '0x09B5';
var ingots = '0x1BF2';

//containers
var trashBarrels = Orion.FindTypeEx('0x0E77', '0x0358', ground, ' ', '2')
var trashBarrel = trashBarrels[0];

//tools
var tinkerTools = ['0x1EB9', 9003, 11, 'Tinker Tools']
var mortarPestle = ['0x0E9B', 9003, 9, 'Mortar and Pestle']

//magery reagents
var ga = '0x0F84'; //garlic
var gi = '0x0F85'; //ginseng
var ss = '0x0F8D'; //spider's silk
var ns = '0x0F88'; //nightshade
var sa = '0x0F8C'; //sulfuric ash
var bp = '0x0F7A'; //black pearl
var bm = '0x0F7B'; //blood moss
var mr = '0x0F86'; //mandrake root

//necro reagents
var gd = '0x0F8F'; //grave dust

//potions
var gHealPot = ['0x0F0C', 9001, 42, 'Greater Heal Potion']
var gCurePot = ['0x0F07', 9001, 72, 'Greater Cure Potion']
var gStrPot = ['0x0F09', 9002, 51, 'Greater Strength Potion']
var gAgiPot = ['0x0F08', 9002, 21, 'Greater Agility Potion']
var gRefreshPot = ['0x0F0B', 9001, 11, 'Greater Refreshment Potion']
//var greaterConflagration = Orion.FindType('0x0F06', '0x0489', resourceSecure); //(9004, 102)
var deadlyPoisonPot = ['0x0F0A', 9003, 63, 'Deadly Poison Potion']
//var invisibilityPotion = Orion.FindType('0x0F06', '0x0132', resourceSecure); //(9002, 103)
var smokeBomb = ['0x2808', 9005, 83, 'Smoke Bomb'] //(9005, 83)

var makeItem = gCurePot;
var amountWanted = 500;

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
	Orion.Print("Checking Tools");
		Orion.Print("Checking for Tinker Tools");
		Orion.Wait(500);
		if (Orion.Count(tinkerTools[0], '0x0000', 'backpack') < 1) {
			Orion.Print("You are out of Tinkering Tools.  Halting...");
			break;
		} else if (Orion.Count(tinkerTools[0], '0x0000', 'backpack') <2) {
			Orion.Print("Crafting Tinker Tools");
			craftTinkerTools(tinkerTools[1], tinkerTools[2])
		}
		if (makeItem === gHealPot ||makeItem === gCurePot ||makeItem === gStrPot ||makeItem === gAgiPot ||makeItem === gRefreshPot ||makeItem === deadlyPoisonPot ||makeItem === smokeBomb) {
			Orion.Print("Checking for Mortar and Pestle");
			Orion.Wait(250)
			if (Orion.Count(mortarPestle[0], '0x0000', 'backpack') < 1 && Orion.Count(tinkerTools[0], '0x0000', 'backpack') >= 1) {
				Orion.Print("Crafting Mortar & Pestles");
				craftMortarPestle(mortarPestle[1], mortarPestle[2])
			}
			Orion.Wait(1000)
		}

		Orion.Print("Running restock checklist");
		RestockChecklist()
		Orion.Wait(500)		
	for (var i = 0; i < amountWanted; i++) {
		var amtCrafted = i + 1;
		craftAlchemyItems(makeItem[1], makeItem[2]);
		Orion.Wait(1000);
		Orion.Print(amtCrafted + " " + makeItem[3] + "s crafted.");
		}
	if  (amtCrafted >= amountWanted) {
		Orion.Print("Crafting completed.  Emptying backpack");
		storeMaterials()
		Orion.Wait(500)
		}
	}
//
function craftAlchemyItems(categoryIndex, itemIndex) {	
	var resourceSecure = Orion.GetSerial('resourceSecure');
	var destinationSecure = Orion.GetSerial('destinationSecure');
	if (Player.Weight() > maxWeight) {
		Orion.Print("Player is overloaded.  Storing potions...");
		Orion.Wait(200);
		unloadPotions()
	}
	if (Orion.Count(tinkerTools[0], '0x0000', 'backpack') <2) {
			Orion.Print("Crafting Tinker Tools");
			craftTinkerTools(tinkerTools[1], tinkerTools[2])
	}
	if (Orion.Count(mortarPestle[0], '0x0000', 'backpack') < 2) { //Check backpack for tools, return if they aren't found
		Orion.CharPrint(self, 1159, 'You are out of Mortar and Pestles.  Crafting!');
		craftMortarPestle(makeItem[1], makeItem[2]);
	}
	RestockChecklist()
	Orion.Wait(600);
	Orion.UseType(mortarPestle);
	if (Orion.WaitForGump(1500)) {
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC')) {
			gump0.Select(Orion.CreateGumpHook(categoryIndex));
			Orion.Wait(800)
			if (Orion.WaitForGump(1500)) {
				var gump0 = Orion.GetGump('last');
				if (gump0 !==null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
					gump0.Select(Orion.CreateGumpHook(itemIndex));
					Orion.Wait(800);
						if (Orion.WaitForGump(1500)) {
						var gump0 = Orion.GetGump('last');
						if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
							gump0.Close()
							}
						}
					}
				}
			}
		}
	}

function RestockChecklist() {
    var resourceSecure = Orion.GetSerial('resourceSecure');
    var potionRestockList = [
		[gHealPot, 'Greater Heal Potion', [emptyBottle, 'Empty Bottles', 50, gi, 'Ginseng', 500] ],							//0
		[gCurePot, 'Greater Cure Potion', [emptyBottle, 'Empty Bottles', 50, ga, 'Garlic', 500] ],								//1
		[gStrPot, 'Greater Strength Potion', [emptyBottle, 'Empty Bottles', 50, mr, 'Mandrake Root', 500] ],			//2
		[gAgiPot, 'Greater Agility Potion', [emptyBottle, 'Empty Bottles', 50, bm, 'Blood Moss', 500] ],						//3
		[gRefreshPot, 'Greater Refresh Potion', [emptyBottle, 'Empty Bottles', 50, bp, 'Black Pearl', 500] ],				//4
		[deadlyPoisonPot, 'Deadly Poison Potion', [emptyBottle, 'Empty Bottles', 50, ns, 'Night Shade', 500] ],			//5
		[smokeBomb, 'Smoke Bomb', [eggs, 'Eggs', 50, gi, 'Ginseng', 500] ],														//6
    ];

    for (var i=0; i < potionRestockList.length; i++) {
        var potGraphic = potionRestockList[i][0];
        var potName = potionRestockList[i][1];
        Orion.Print('Checking ingredients for ' + potName)
        var ingredientsList = potionRestockList[i][2];
        for (var j=0;j < ingredientsList.length; j+=3) {
            if (!ingredientsList[j]) //if there's no more ingredients, this will evaluate to undefined, meaning we're done :)
                break;
            var itemGraphic = ingredientsList[j];
            var itemName = ingredientsList[j+1];
            var itemQty = ingredientsList[j+2];
            if (!RestockToAmount(resourceSecure,itemGraphic,itemName,itemQty)) {
                Orion.Print(itemName + ' missing from resourceSecure! Pausing...');
                Orion.PauseScript();
            }
        }
    }
}

function RestockToAmount(resourceSecure,itemGraphic,itemName,itemQty) {
    var originalCount = Orion.Count(itemGraphic, '0x0000', 'backpack');
    while (Orion.Count(itemGraphic, '0x0000', 'backpack') < 10) {
        var itemFound = Orion.FindType(itemGraphic, '0x0000', resourceSecure);
        if (itemFound.length) {
            var amountNeeded = itemQty - Orion.Count(itemGraphic, '0x0000', 'backpack')
            Orion.Print(amountNeeded + " " + itemName +" needed.");
            Orion.Wait(600)
            Orion.MoveItem(itemFound[0], amountNeeded, 'backpack');
            Orion.Wait(600)
            var updatedCount = Orion.Count(itemGraphic, '0x0000', 'backpack');
            var addedAmount = updatedCount - originalCount;
            Orion.Print(addedAmount + " " + itemName + " added.");
            originalCount = updatedCount;
            Orion.Wait(600);
        } else {
            return false; //restock failed
        }
    }
		    if (Player.Weight() > maxWeight) {
    			Orion.Print("Unloading pots");
    			unloadPotions()
	}
return true; //restock succeeded
}

function craftTinkerTools(catergoryIndex, itemIndex) {
	var resourceSecure = Orion.GetSerial('resourceSecure');
	var backpackIngots = Orion.Count(ingots, 0x0000, 'backpack');
	var ingotsRequired = '4';
	var ingotsMissing = ingotsRequired - backpackIngots;
	if (Orion.Count(ingots, '0x0000', 'backpack') < ingotsRequired) {
		Orion.MoveItemType(ingots, '0x0000', resourceSecure, ingotsMissing, 'backpack');
	}
	if (Orion.Count(tinkerTools[0], '0x0000', 'backpack') < 1) {
		return Orion.CharPrint(self, 1159, 'You are out of Tinkering Tools.  Halting!');
	} else while (Orion.Count(tinkerTools[0], '0x0000', 'backpack') < 2) {
		Orion.UseType(tinkerTools)
	if (Orion.WaitForGump(1000)) {
		var gump0 = Orion.GetGump('last');
		if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
			gump0.Select(Orion.CreateGumpHook(tinkerTools[1]))
			Orion.Wait(500)
			if (Orion.WaitForGump(1000)) {
				var gump0 = Orion.GetGump('last');
				if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
					gump0.Select(Orion.CreateGumpHook(tinkerTools[2]))
					Orion.Wait(500)
					gump0.Close()
					}
				}
			}
		}
	}
}

function craftMortarPestle(catergoryIndex, itemIndex) {
	var resourceSecure = Orion.GetSerial('resourceSecure');
	var backpackIngots = Orion.Count(ingots, 0x0000, 'backpack');
	var ingotsRequired = '6';
	var ingotsMissing = ingotsRequired - backpackIngots;
	if (Orion.Count(ingots, '0x0000', 'backpack') < ingotsRequired) {
		Orion.MoveItemType(ingots, '0x0000', resourceSecure, ingotsMissing, 'backpack');
	}
	if (Orion.Count(tinkerTools[0], '0x0000', 'backpack') < 1) {
		return Orion.CharPrint(self, 1159, 'You are out of Tinkering Tools.  Halting!');
	} else while (Orion.Count(mortarPestle[0], '0x0000', 'backpack') < 2) {
		Orion.UseType(tinkerTools)
		Orion.Wait(500)
	if (Orion.WaitForGump(1000)) {
		var gump0 = Orion.GetGump('last');
		if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
			gump0.Select(Orion.CreateGumpHook(mortarPestle[1]))
			Orion.Wait(500);
			if (Orion.WaitForGump(1000)) {
				var gump0 = Orion.GetGump('last');
				if (gump0 !== null && !gump0.Replayed() && gump0.ID() === '0x000001CC') {
					gump0.Select(Orion.CreateGumpHook(mortarPestle[2]))
					Orion.Wait(500)
					gump0.Close()
					}
				}
			}
		}
	}
}

function storeMaterials() {
	var resourceSecure = Orion.GetSerial('resourceSecure');
	var unusedMats = [
		[ga, 'Garlic'],
		[gi, 'Ginseng'],
		[ss, 'Spiders Silk'],
		[ns, 'Nightshade'],
		[sa, 'Sulfuric Ash'],
		[bp, 'Black Pearl'],
		[bm, 'Blood Moss'],
		[mr, 'Mandrake Root'],
		[gd, 'Grave Dust'],
		[emptyBottle, 'Empty Bottles'],
		[eggs, 'Eggs'],
	];
	for (var i=0; i < unusedMats.length; i++) {
		var matGraphic = unusedMats[i][0];
		var matName = unusedMats[i][1];
		while (Orion.Count(matGraphic, '0x0000', 'backpack') > 0) {
			Orion.Print("Checking backpack for unused Materials.");
			var matFound = Orion.FindType(matGraphic, '0x0000', 'backpack');
			var matCount = Orion.Count(matGraphic, '0x0000', 'backpack');
			if (matFound.length) {
				Orion.MoveItem(matFound[0], '0', resourceSecure);
				Orion.Print(matCount + " " + matName + " moved to resource secure successfully.");
				Orion.Wait(600);
			} else if (!matFound.length) {
				Orion.Print("No unused materials located in backpack.");
				return false;
			}
		}
	}
		return true;
}

function unloadPotions() {
	var destinationSecure = Orion.GetSerial('destinationSecure');
    var potions = [gHealPot[0], gCurePot[0], gStrPot[0], gAgiPot[0], gRefreshPot[0], deadlyPoisonPot[0], smokeBomb[0]];
    var potionsInBackpack = Orion.FindType(potions.join('|'), '-1', 'backpack');
    if ((Player.Weight() > maxWeight) && (potionsInBackpack)) {
    	Orion.Print("Unloading pots");
    	for (var i = 0; i < potionsInBackpack.length; i++) {
        	Orion.MoveItem(potionsInBackpack[i], -1, destinationSecure);
			Orion.Wait(1000); // wait for the move to complete
		}
    }
    return true;
}