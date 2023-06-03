var lootItems = {
	'0x400B': true, //shame crystals
	'0x0F87': true, // lucky coin
}

function testJewelry()
    {
    Orion.WaitForAddObject('myTarget');
    var obj = Orion.FindObject('myTarget');
    var parse = parseJewelryProperties(obj.Properties())
    Orion.Print(KeepJewelry(parse))
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
    var itemGraphic = item.Graphic();
	if(lootItems[itemGraphic])
        return true;
	var props = item.Properties();
	
    var isJewelry = Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', itemGraphic);
	var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
	var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
    var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;

    if(!isJewelry && !is2hWeapon && !is1hWeapon && !isArmor)
        {
        //Handle shields, only luck
        if(Orion.Contains('0x1B72|0x1BC3|0x1BC4|0x1B7B|0x1B73|0x1B74|0x1B77|0x1B78|0x1B75|0x1B76|0x1BC5|0x1B79|0x1B7A', itemGraphic) && props.indexOf("Luck 150") > -1)
            return true;
        return false;
        }

    //Special Cases
    //Exclude cursed items and ranged weapons (looted bows and throwing weps are never good)
	if(props.indexOf('Cursed') > -1 || props.indexOf('Weight: 50 Stones') > -1)
        return false;
    if(props.indexOf('Skill Required: Archery') > -1) 
        return false;
    if(props.indexOf('Skill Required: Throwing') > -1) 
        return false;

    //Handle weapons
	//Exclude weapons that will never be good
	if(is2hWeapon)
        { // I want to exclude all 2h EXCEPT these
		if( 
			!(props.indexOf('Hatchet') > -1) && 
			!(props.indexOf('Spear') > -1 && props.indexOf('Weapon Speed 2.75') > -1) && //Not short spear
			!(props.indexOf('Pitchfork') > -1) && 
			!(props.indexOf('No-dachi') > -1) && 
			!(props.indexOf('Double Axe') > -1) && 
			!(props.indexOf('Bladed Staff') > -1 && props.indexOf('Double Bladed Staff') === -1) &&  //Not double bladed staff
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
        { //I want to exclude these specific 1h weapons
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
        if(props.indexOf("Spell Channeling") > -1 && props.indexOf('Luck 150') > -1 && props.indexOf('Mage Weapon') > -1)
            return true;
	    }

    if(is1hWeapon || is2hWeapon)
        {
        var parse = parseWeaponProperties(props);
        return KeepWeapon(parse,props);
        }

    //Handle jewelry
	if(isJewelry)
        {
        var parse = parseJewelryProperties(props);
        return KeepJewelry(parse,props);
	    }

    //Handle armor
	if(isArmor)
        {
        var parse = parseJewelryProperties(props);
        return KeepArmor(parse,props);
		// if(props.indexOf("Fortified") > -1 || props.indexOf("Of Defense") > -1)
		// 	return false;
		// if(
		// 	(props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1) && 
		// 	(props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1)
        // )
        //     {
		// 	return false;
		//     }
	    }
	return false;
    }

function KeepWeapon(propertiesObj,props)
    {
    var wepObj = propertiesObj;
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
    var isPvmWep = props.indexOf("Bladed Staff") > -1 || propertiesObj.indexOf("Longsword") || propertiesObj.indexOf("Broadsword") || props.indexOf("Hatchet") > -1 || props.indexOf("Katana") > -1 || props.indexOf("Leafblade") > -1;
    var isImbuable = Object.keys(wepObj).length <= 4;
    
    if(isAntique && !isBokuto)
        return false;

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
        if(isImbuable && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter))
            return true;
        else 
            return false;		
        }
    
    if(isPvmWep)
        {
        var isHitFatigue = wepObj['HitFatigue'] >= 50;
        var isHitManaDrain = wepObj['HitManaDrain'] >= 50;
        var isHitStaminaLeech = wepObj['HitStaminaLeech'] >= 40;
        var isHitManaLeech = wepObj['HitManaLeech'] >= 70;
        var isHitLifeLeech = wepObj['HitManaLeech'] >= 70;
        if(isHitFatigue && isHitManaDrain && isHitStaminaLeech && isHitManaLeech && isHitLifeLeech)
            return true;
        }
    
    return false;
    }

function KeepJewelry(propertiesObj,props)
    {
    function countMatchingMods(propObj, mods)
        {
        return Object.keys(propObj).filter(function(prop)
            {
            return mods[prop] === true;
            }).length;
        }
    var isClean = props.indexOf('Antique') === -1;
    var targetModCount = isClean ? 6 : 7;
    var mageMods = 
        {
        Magery:true,SpiritSpeak:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Mysticism:true,
        Necromancy:true,SpellDamageIncrease:true,LowerReagentCost:true,
        }
    var dexxerMods = 
        {
        Stealth:true,Archery:true,Chivalry:true,Healing:true,Throwing:true,
        }
    var hybridMods =
        {
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,EnhancePotions:true,
        StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,ManaRegeneration:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,LowerManaCost:true,ManaIncrease:true,
        MaceFighting:true,Fencing:true,Swordsmanship:true,SwingSpeedIncrease:true,DamageIncrease:true,
        FasterCasting:true,Tactics:true,StaminaIncrease:true,FasterCastRecovery:true,
        }
    
    var mageInt = countMatchingMods(propertiesObj, mageMods);
    var dexxerInt = countMatchingMods(propertiesObj, dexxerMods);
    var hybridInt = countMatchingMods(propertiesObj, hybridMods);
    Orion.Print('mageInt: ' + mageInt + '\ndexxerInt: ' + dexxerInt + '\nhybridInt: ' + hybridInt + 'clean: ' + isClean)
    if(mageInt + hybridInt >= targetModCount || dexxerInt + hybridInt >= targetModCount)
        return true;

    return false;
    }

function KeepArmor(propertiesObj,props)
    {
    
    return true;
    }

function parseJewelryProperties(jewelryProperties)
    {
    var targetMods = 
        {
        //good mods
        Magery:true,MaceFighting:true,Fencing:true,Swordsmanship:true,AnimalTaming:true,SpiritSpeak:true,Tactics:true,Wrestling:true,
        Focus:true,Parrying:true,Stealth:true,Anatomy:true,Bushido:true,EvaluateIntelligence:true,Mysticism:true,
        Necromancy:true,Archery:true,Chivalry:true,Healing:true,Ninjitsu:true,Throwing:true,ResistingSpells:true,ManaIncrease:true,
        StaminaIncrease:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,ManaRegeneration:true,EnhancePotions:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,SwingSpeedIncrease:true,DamageIncrease:true,SpellDamageIncrease:true,
        FasterCastRecovery:true,FasterCasting:true,LowerManaCost:true,LowerReagentCost:true,
        //bad mods
        NightSight:true,Luck:true,PoisonResist:true,PhysicalResist:true,FireResist:true,EnergyResist:true,ColdResist:true,Musicianship:true,
        Provocation:true,Meditation:true,Discordance:true,Veterinary:true,Stealing:true,Peacemaking:true
        }
    var lines = jewelryProperties.split("\n");
    var modsObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName])
                {
                var modValue = parseInt(modMatch[2]);
                modsObj[modName] = modValue;
                }
            }
        });
    return modsObj; //[{goodMods},totalModsInt]
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
        ManaRegeneration:true,HitPointRegeneration:true,StaminaRegeneration:true,StrengthBonus:true,DexterityBonus:true,Intelligence:true,
        EnhancePotions:true,ReactiveParalyze:true,HitFatigue:true,HitManaDrain:true,Splintering:true,BattleLust:true,LowerRequirements:true,
        }
    var lines = weaponProperties.split("\n");
    var propertiesObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*(-?[0-9]+)/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(modName == 'SpellChanneling')
                {
                if(weaponProperties.indexOf('Faster Casting') === -1)
                    propertiesObj['FasterCasting'] = 1;
                }
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]);
                propertiesObj[modName] = modValue;
                }
            }
        });
    return propertiesObj;
    }

function parseArmorProperties(armorProperties)
    {
    var targetMods = 
        {
        ManaIncrease:true,StaminaIncrease:true,HitPointIncrease:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,
        ManaRegeneration:true,HitPointRegeneration:true,LowerReagentCost:true,LowerManaCost:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,CastingFocus:true,
        DamageEater:true,KineticEater:true,PoisonEater:true,FireEater:true,EnergyEater:true,ColdEater:true,
        ReflectPhysicalDamage:true,StaminaRegeneration:true,EnhancePotions:true,Luck:true,NightSight:true,
        }
    var lines = armorProperties.split("\n");
    var propertiesObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]);
                propertiesObj[modName] = modValue;
                }
            }
        });
    return propertiesObj;
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

function AliLootSorter()
    {
    var multi = Orion.GetMultisRect().sort(function(a,b)
        {
        var playerX = Player.X();
        var playerY = Player.Y();
		var distOne = Math.floor(Math.sqrt(Math.pow(a.x - playerX, 2) + Math.pow(a.y - playerY, 2)));
		var distTwo = Math.floor(Math.sqrt(Math.pow(b.x - playerX, 2) + Math.pow(b.y - playerY, 2)));
		return distOne - distTwo;
		})[0];
	if(!multi)
		return Orion.CharPrint(self,1159,"House not found! Halting...");
    Orion.Print(multi.x + ':' + multi.y)
    }