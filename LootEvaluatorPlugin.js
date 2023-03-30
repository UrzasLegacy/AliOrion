var lootItems = {
	'0x400B': true, //shame crystals
	'0x0F87': true, // lucky coin
}

function itemEvalUnitTest()
    {
    Orion.WaitForAddObject('myTarget')
    if(ShouldKeepItem('myTarget'))
        Orion.Print('True');
    else
        Orion.Print('False');
    }

function LootCorpses()
    {
    var corpseStringIgnore = 'a horde minion corpse|a headless corpse';
	var corpseGraphic = '0x2006';
    var backpackSerial = Orion.GetSerial(backpack);
    var corpses = Orion.FindTypeEx(corpseGraphic, any, ground, "", 2).filter(function(corpse)
        {
        return !Orion.Contains(corpse.Properties(), corpseStringIgnore);
        });
    if(!corpses.length)
        return false;
    var corpseId = corpses[corpses.length - 1];
    var corpseIdSerial = corpseId.Serial();
    if(!corpseId.IsCorpse())
        {
        Orion.Ignore(corpseIdSerial);
        return true;
        }
    while(!Orion.GumpExists('container', corpseIdSerial))
        {
        Orion.OpenContainer(corpseIdSerial);
        Orion.Wait(1300);
        }
    Orion.Print("Start Evaluate Item")
    var itemsInCorpse = Orion.FindTypeEx('any', 'any', lastcontainer);
    for(var i=0;i<itemsInCorpse.length;i++)
        {
        var item = itemsInCorpse[i];
        var itemSerial = item.Serial();
        if(item && item.Container() !== backpackSerial && ShouldKeepItem(itemSerial))
            {
            while(item.Container() !== backpackSerial)
                {
                Orion.MoveItem(itemSerial);
                Orion.Wait(1300);
                }
            }				
        }
    Orion.Print("Finish Evaluate Items");
    Orion.Ignore(corpseIdSerial);
    return true;
    }

function LootCorpsesOLD()
    {
    var lootToBackpack = true;
    var lootBagType = '';
	var corpseGraphic = '0x2006';
    var useLootCorpses = true;
	if(useLootCorpses)
        {
		var corpses = Orion.FindTypeEx(corpseGraphic, any, ground, "", 2);
		if(!corpses.length)
	        return;
	    var corpseId = corpses[corpses.length - 1];
        var corpseIdSerial = corpseId.Serial();
		if(!corpseId.IsCorpse())
            {
			Orion.Ignore(corpseIdSerial);
			return;
		    }
		while(!Orion.GumpExists('container', corpseIdSerial))
            {
            Orion.OpenContainer(corpseIdSerial);
            Orion.Wait(1300);
            }
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
				    }
			    }				
		    });
		Orion.Print("Finish Evaluate Items");
		Orion.Ignore(corpseId.Serial());
        }
    }

function ShouldKeepItem(itemId)
    {
	var item = Orion.FindObject(itemId);
	if(!item) return false;
	//loot by type
	if(lootItems[item.Graphic()]) return true;
	
	var props = item.Properties();
	
	//handle cursed items
	if(props.indexOf('Cursed') > -1 || props.indexOf('Weight: 50 Stones') > -1)
        return false;
	//exclude archery weapons (never seen a good one)
	if(props.indexOf('Skill Required: Archery') > -1) 
        return false;

	var isJewelry = props.indexOf('Ring') > -1 || props.indexOf('Bracelet') > -1;
	var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
	var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
	var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;
	
	
	//I want to exclude weapons that will never be good
	if(is2hWeapon)
        { // I want to exclude all 2h except spears, ornate axes and hatchets
		if( 
			!(props.indexOf('Hatchet') > -1) && 
			!(props.indexOf('Spear') > -1 && props.indexOf('Weapon Speed 2.75') > -1) && 
			!(props.indexOf('Pitchfork') > -1) && 
			!(props.indexOf('No-dachi') > -1) && 
			!(props.indexOf('Double Axe') > -1) && 
			!(props.indexOf('Bladed Staff') > -1 && props.indexOf('Double Bladed Staff') === -1) && 
			!(props.indexOf('Gnarled Staff') > -1) &&
			!(props.indexOf('Lajatang') > -1) &&
			!(props.indexOf('Ornate Axe') > -1) &&
			!(props.indexOf('Scythe') > -1) &&
			!(props.indexOf('War Cleaver') > -1) &&
            !(props.indexOf('Tetsubo') > -1)
		)
            {
			return false;
		    }
	    }
	if(is1hWeapon)
        { //I want to exclude specific 1h weapons
		if(
			props.indexOf('Elven Machete') > -1 ||
			props.indexOf('Radiant Scimitar') > -1 || 
			props.indexOf('Wild Staff') > -1 ||
			props.indexOf('Lance') > -1 ||
			props.indexOf('Sledge Hammer') > -1
		)
            {
			return false;
		    }
	    }
	
	//Handle max level Tmaps 
	//var cache = " Cache";
	//if(props.indexOf(cache) > -1) return true;
	
	//Handle Named Jewelry
	if(isJewelry)
        {
		if(props.indexOf("Arcane") > -1 && props.indexOf("Sorcery") > -1) 
            return false;//I do not want arcane Jewel of sorcery.
	    }
	
	if(ShouldKeepItem_Splinter(props))
		return true;
    else if(is1hWeapon) //if it's weapon and it's not splinter I don't want it
        {
        if(props.indexOf("Spell Channeling") > -1 && props.indexOf('Luck 150') > -1)
            return true;
		return false;
        }
    else if(is2hWeapon)
        return false;

	if(ShouldKeepItem_CheckCleanSsi(props))
        return true;
	
	if(!isArmor && !isJewelry && !is2hWeapon && !is1hWeapon)
        {
		if(ShouldKeepItem_LuckShield(props))
            return true;
	    }
	
	if(isArmor)
        {
		if(props.indexOf("Fortified") > -1 || props.indexOf("Of Defense") > -1)
			return false;
		if(
			(props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1) && 
			(props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1)
        )
            {
			return false;
		    }
	    }
	
	//Handle Legendary
	if(props.indexOf('Legendary Artifact') > -1)
        return true;
	
	//Handle Major
	if(props.indexOf('Major Artifact') > -1)
        {
		if(isJewelry)
			return true;
		else 
            {
			//return false; // we cant decide if we want to throw out major arti armor
		    }
	    }
	return false;
    }

function ShouldKeepItem_CheckCleanSsi(props)
    {
    //handle clean SSI Jewls
    if(props.indexOf('Antique') > -1)
        return false;
    if(props.indexOf('Ring') > -1 || props.indexOf('Bracelet') > -1)
        {
        if(props.indexOf('Swing Speed Increase') > -1)
            {
            var propsStart = " Stones\n";
            var startIndex = props.indexOf(propsStart);
            if(startIndex === -1)
                {
                propsStart = " Stone\n";
                startIndex = props.indexOf(propsStart);
                if(startIndex === -1)
                    {
                    Orion.Print("startIndex is -1, SOMETHING WENT WRONG");
                    Orion.Print(props);
                    return false;
                    }
                }
            var endIndex = props.indexOf('\nDurability');			
            var propsSubstring = props.substring(startIndex + propsStart.length, endIndex);
            Orion.Print(propsSubstring)
            var newLinesCount = propsSubstring.split('\n').length;
            Orion.Print(newLinesCount)
            if(newLinesCount === 2)
                return true;
            if(newLinesCount === 3)
                return true;
            if(newLinesCount === 4)
                {
                if(
                    propsSubstring.indexOf('Dexterity Bonus') > -1
                    || propsSubstring.indexOf('Intelligence Bonus') > -1
                    || propsSubstring.indexOf('Strength Bonus') > -1
                    || propsSubstring.indexOf('Hit Chance Increase') > -1
                    || (propsSubstring.indexOf('Damage Increase') > -1 && propsSubstring.indexOf('Spell Damage Increase') === -1)
                    || propsSubstring.indexOf('Defense Chance Increase') > -1
                    || propsSubstring.indexOf('Prized') > -1	
                ) 
                    {
                    return true;
                    }
                }
            
            if(newLinesCount === 5 && propsSubstring.indexOf('Prized') > -1)
                {
                if(
                    propsSubstring.indexOf('Dexterity Bonus') > -1
                    || propsSubstring.indexOf('Intelligence Bonus') > -1
                    || propsSubstring.indexOf('Strength Bonus') > -1
                    || propsSubstring.indexOf('Hit Chance Increase') > -1
                    || (propsSubstring.indexOf('Damage Increase') > -1 && propsSubstring.indexOf('Spell Damage Increase') === -1)
                    || propsSubstring.indexOf('Defense Chance Increase') > -1
                )
                    {
                    return true;
                    }
                }
            }
        }
    return false;
    }

function ShouldKeepItem_Splinter(props)
    {
	//handle splinter
	
	//todo handle clean splinter weapons (can be imbued)
	var isOverCapSplinter = props.indexOf("Splintering Weapon 25") > -1 || props.indexOf("Splintering Weapon 30") > -1;
	var isSplinter =  props.indexOf("Splintering Weapon 20") > -1 || isOverCapSplinter;
	
	var isAntique = props.indexOf('Antique') > -1;
	
	var isFireball = props.indexOf("Hit Fireball") > -1;
	var isCappedFireball = props.indexOf("Hit Fireball 50") > -1
	var isOverCapFireball = props.indexOf("Hit Fireball 60") > -1 || props.indexOf("Hit Fireball 70") > -1;
	var isLightning = props.indexOf("Hit Lightning") > -1;
	var isCappedLightning = props.indexOf("Hit Lightning 50") > -1;
	var isOverCapLightning = props.indexOf("Hit Lightning 60") > -1 || props.indexOf("Hit Lightning 70") > -1;
	var isHarm = props.indexOf("Hit Harm") > -1;
	var isCappedHarm = props.indexOf("Hit Harm 50") > -1;
	var isOverCapHarm = props.indexOf("Hit Harm 60") > -1 || props.indexOf("Hit Harm 70") > -1;
    var isHitSpell = isFireball || isLightning || isHarm;

	var isLowerD = props.indexOf('Hit Lower Defense') > -1;
	var isBokuto = props.indexOf("Bokuto") > -1;
	
	if(isSplinter)
        {
        if(isOverCapSplinter && (isHitSpell || isLowerD))
            return true;
    
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm || isCappedFireball || isCappedLightning || isCappedHarm)
            return true;
    
        //we will keep antique or brittle if HLD hit spell and splinter
        if(isHitSpell && isLowerD)
            return true;
        
        //Keep hit spell bokutos
        if(isBokuto && isHitSpell)
            return true;
    
        if(isAntique)
            return false;
        
        //Lets Figure out how many imbue slots are open;
        var modCount = 0;
        var physDamageType = '\nPhysical Damage';
        var fireDamageType = '\nFire Damage';
        var coldDamageType = '\nCold Damage';
        var poisonDamageType = '\nPoison Damage';
        var energyDamageType = '\nEnergy Damage';
        var endIndex = 0;
        if(props.indexOf(physDamageType) > -1 && (endIndex == 0 || props.indexOf(physDamageType) < endIndex))
            endIndex = props.indexOf(physDamageType);
        if(props.indexOf(fireDamageType) > -1 && (endIndex == 0 || props.indexOf(fireDamageType) < endIndex))
            endIndex = props.indexOf(fireDamageType);
        if(props.indexOf(coldDamageType) > -1 && (endIndex == 0 || props.indexOf(coldDamageType) < endIndex))
            endIndex = props.indexOf(coldDamageType);
        if(props.indexOf(poisonDamageType) > -1 && (endIndex == 0 || props.indexOf(poisonDamageType) < endIndex))
            endIndex = props.indexOf(poisonDamageType);
        if(props.indexOf(energyDamageType) > -1 && (endIndex == 0 || props.indexOf(energyDamageType) < endIndex))
            endIndex = props.indexOf(energyDamageType);
        if(endIndex == 0)
            {
            Orion.Print("END INDEX IS 0, SOMETHING WENT WRONG");
            Orion.Print(props);
            return false;
            }
        var propsStart = " Stones\n";
        startIndex = props.indexOf(propsStart);
        if(startIndex === -1)
            {
            propsStart = " Stone\n";
            startIndex = props.indexOf(propsStart);
            if(startIndex === -1)
                {
                Orion.Print("startIndex is -1, SOMETHING WENT WRONG");
                Orion.Print(props);
                return false;
                }
            }
        var modsSubstring = props.substring(startIndex + propsStart.length, endIndex);
        modCount = modCount + modsSubstring.split('\n').length;

        if(props.indexOf("Brittle") > -1)
            modCount--;
        if(props.indexOf("Prized") > -1)
            modCount--;
        if(props.indexOf("Faster Casting -1") > -1)
            modCount--;
        if(props.indexOf("Spell Channeling") > -1 && props.indexOf("Faster Casting -1") === -1)
            modCount++;
        
        var imbueSlotsOpen = 5 - modCount;
        Orion.Print("IMBUE SLOTS OPEN");
        Orion.Print(imbueSlotsOpen);
        Orion.Print(modsSubstring);

        if(imbueSlotsOpen > 0 && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter))
            return true;
        else if(imbueSlotsOpen > 1) //todo: we need to condition is imbueable here 
            return true;
        else 
            return false;		
	    }
	return false;
    }

function ShouldKeepItem_LuckShield(props)
    {
	if(props.indexOf("Luck 150") > -1 )
		return true;
	return false;
    }


