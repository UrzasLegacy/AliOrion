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

function AliItemEval(itemSerial)
    {
	var item = Orion.FindObject(itemSerial);
	if(!item)
        return false;
	//loot by graphic
	if(lootItems[item.Graphic()])
        return true;
	var props = item.Properties();
	//Exclude cursed items
	if(props.indexOf('Cursed') > -1 || props.indexOf('Weight: 50 Stones') > -1)
        return false;
    if(props.indexOf('Skill Required: Archery') > -1) 
        return false;

	var isJewelry = (props.indexOf('Ring') > -1 && props.indexOf('Ringmail') === -1) || props.indexOf('Bracelet') > -1;
	var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
	var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
	var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;
	
	//Exclude weapons that will never be good
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
	
	if(isJewelry)
        {
		// if(props.indexOf("Arcane") > -1 && props.indexOf("Sorcery") > -1) 
        //     return false;//I do not want arcane Jewel of sorcery.
        var jewelryObj = parseJewelryProperties(props);
        var numProps = Object.keys(jewelryObj).length;
        if(numProps >= 7)
            return true;
        else
            return false;
	    }
	
	if(ShouldKeepItem_Splinter(props))
		return true;
    else if(is1hWeapon) //if it's weapon and it's not splinter I don't want it unless its a luck weapon
        {
        if(props.indexOf("Spell Channeling") > -1 && props.indexOf('Luck 150') > -1 && props.indexOf('Mage Weapon') > -1)
            return true;
		return false;
        }
    else if(is2hWeapon)
        return false;
	
	if(!isArmor && !isJewelry && !is2hWeapon && !is1hWeapon)
        {
        if(props.indexOf("Luck 150") > -1) //luck shields
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

function AliJewelryEval(propertiesObj)
    {
    var numProps = Object.keys(propertiesObj).length;
    if(numProps < 7)
        return 0;
    return true;
    }

function parseJewelryProperties(jewelryProperties)
    {
    var targetMods = 
        {
        Magery:true,MaceFighting:true,Fencing:true,Swordsmanship:true,AnimalTaming:true,SpiritSpeak:true,Tactics:true,Wrestling:true,
        Focus:true,Parrying:true,Stealth:true,Meditation:true,Anatomy:true,Bushido:true,EvaluateIntelligence:true,Mysticism:true,
        Necromancy:true,Archery:true,Chivalry:true,Healing:true,Ninjitsu:true,Throwing:true,ResistingSpells:true,ManaIncrease:true,
        StaminaIncrease:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,ManaRegeneration:true,EnhancePotions:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,SwingSpeedIncrease:true,DamageIncrease:true,SpellDamageIncrease:true,
        FasterCastRecovery:true,FasterCasting:true,LowerManaCost:true,LowerReagentCost:true,
        }
    var lines = jewelryProperties.split("\n");
    var propertiesObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName])
                {
                var modValue = parseInt(modMatch[2]);
                propertiesObj[modName] = modValue;
                }
            }
        });
    return propertiesObj;
    }

function parseWeaponProperties(weaponProperties)
    {
    var targetMods = 
        {
        SpellChanneling:true,MageWeapon:true,FasterCasting:true,DamageIncrease:true,SwingSpeedIncrease:true,Balanced:true,HitChanceIncrease:true,
        DefenseChanceIncrease:true,UseBestWeaponSkill:true,HitPoisonArea:true,HitPhysicalArea:true,HitFireArea:true,HitEnergyArea:true,
        HitColdArea:true,HitStaminaLeech:true,HitManaLeech:true,HitMagicArrow:true,HitLowerDefense:true,HitLowerAttack:true,HitLightning:true,
        HitLifeLeech:true,HitHarm:true,HitFireball:true,HitDispel:true,Luck:true,PoisonResist:true,PhysicalResist:true,FireResist:true,
        EnergyResist:true,ColdResist:true,WaterElementalSlayer:true,TrollSlayer:true,TerathanSlayer:true,SpiderSlayer:true,SnowElementalSlayer:true,
        SnakeSlayer:true,ScorpionSlayer:true,PoisonElementalSlayer:true,OrcSlayer:true,OphidianSlayer:true,OgreSlayer:true,LizardmanSlayer:true,
        GargoyleSlayer:true,FireElementalSlayer:true,EarthElementalSlayer:true,DragonSlayer:true,BloodElementalSlayer:true,AirElementalSlayer:true,
        UndeadSlayer:true,ReptileSlayer:true,RepondSlayer:true,FeySlayer:true,ElementalSlayer:true,DemonSlayer:true,ArachnidSlayer:true,
        }
    var lines = weaponProperties.split("\n");
    var propertiesObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName])
                {
                var modValue = parseInt(modMatch[2]);
                propertiesObj[modName] = modValue;
                }
            }
        });
    return propertiesObj;
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

function AliWeaponEval(props)
    {
	var wepObj = parseWeaponProperties(props);
	//todo handle clean splinter weapons (can be imbued)
	var isOverCapSplinter = wepObj['SplinteringWeapon'] > 20;
	var isSplinter = wepObj['SplinteringWeapon'] >= 20;
	var isAntique = props.indexOf('Antique') > -1;
	var isOverCapFireball = wepObj['HitFireball'] > 50;
	var isOverCapLightning = wepObj['HitLightning'] > 50;
	var isOverCapHarm = wepObj['HitHarm'] > 50;
    var isHitSpell = wepObj['HitFireball'] >= 50 || wepObj['HitLightning'] >= 50 || wepObj['HitHarm'] >= 50;
	var isLowerD = wepObj['HitLowerDefense'] >= 30;
	var isBokuto = props.indexOf("Bokuto") > -1;
	
    var isImbuable = Object.keys(wepObj).length <= 4;

	if(isSplinter)
        {
        if(isOverCapSplinter && (isHitSpell || isLowerD))
            return true;
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm)
            return true;
        if(isHitSpell && isLowerD) //Keep antique or brittle weapons if HLD, hit spell, and splinter
            return true;
        if(isBokuto && isHitSpell) //Keep all hit spell bokutos
            return true;
        if(isAntique)
            return false;
        if(isImbuable && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter))
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


