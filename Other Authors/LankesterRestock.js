
function RestockChecklist() {
    var resourceSecure = Orion.GetSerial('resourceSecure');
    var potionRestockList = [
        [gHealPot, 'Greater Heal Potion', [emptyBottle, 'Empty Bottles', 50, ginseng, 'Ginseng', 500] ],									//0
        [gCurePot, 'Greater Cure Potion', [emptyBottle, 'Empty Bottles', 50, garlic, 'Garlic', 500] ],											//1
        [gStrPot, 'Greater Strength Potion', [emptyBottle, 'Empty Bottles', 50, mandrakeRoot, 'Mandrake Root', 500] ],			//2
        [gAgiPot, 'Greater Agility Potion', [emptyBottle, 'Empty Bottles', 50, bloodMoss, 'Blood Moss', 500] ],							//3
        [gRefreshPot, 'Greater Refresh Potion', [emptyBottle, 'Empty Bottles', 50, blackPearl, 'Black Pearl', 500] ],					//4
        [deadlyPoisonPot, 'Deadly Poison Potion', [emptyBottle, 'Empty Bottles', 50, nightShade, 'Night Shade', 500] ],				//5
        [smokeBomb, 'Smoke Bomb', [emptyBottle, 'Empty Bottles', 50, ginseng, 'Ginseng', 500] ],											//6
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
    while (Orion.Count(itemGraphic, '0x0000', 'backpack') < itemQty) {
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
        } else {
            return false; //restock failed
        }
    }
return true; //restock succeeded
}

