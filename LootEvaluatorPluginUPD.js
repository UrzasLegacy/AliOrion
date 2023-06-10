
var lootItems = {
    '0x400B': true, //shame crystals
    '0x0F87': true, //lucky coin
    '0x0EED': true, //gold
}

var serialIndex = 1;
var ModularGumpButtons = //[ xsize, ysize, CallBackID, 'displayText', 'functionName', optional: [arguments] ]
    [
        [ [100, 30, serialIndex++, "TestItem", 'EvalKeep'], [100, 30, serialIndex++, "MoveKeepers", 'MoveKeepers'], ],
        [ [100, 30, serialIndex++, "TestJewelry", 'testEvalJewelry'], [100, 30, serialIndex++, "TestArmor", 'testEvalArmor'], [100, 30, serialIndex++, "TestWeapon", 'testEvalWeapon'], ],
        [], //blank row
        [ [100, 30, serialIndex++, "SortJewelry", "testSortJewelry"], [100, 30, serialIndex++, "SortArmor", "testSortArmor"], [100, 30, serialIndex++, "SortWeapons", "testSortWeapon"], ],
        [ [100, 30, serialIndex++, "MoveAll", "MoveAll"] ],
    ]
    
function Debug(msg)
    {
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print('DEBUG:' + Orion.Time() + ': ' + msg);
    }

function Gump()
    {
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('ModularGumpCallback');
    var widest = Math.max.apply(Math, ModularGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 4, ModularGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    ModularGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(column * 105 + 4, row * 29 + 2, '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(column * 105 + 10, row * 29 + 6, '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

function ModularGumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(12002);
        gump.Close();
        }
    ModularGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if(button[2] == code)
                {
                //Orion.Print('Code: ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function EvalKeep()
    {
    Orion.CharPrint(self,1159,'Target item');
    Orion.WaitForAddObject('myTarget')
    var serial = Orion.GetSerial('myTarget');
    var startTime = Orion.Now();
    Orion.Print('Keep: ' + AliKeep(serial) + '\nEvalKeepMS: ' + (Orion.Now() - startTime));
    }

function MoveKeepers()
    {
    Orion.CharPrint(self,1159,'Target FROM container')
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    Orion.CharPrint(self,1159,'Target TO container')
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(toContainer);
    var items = Orion.FindType(any,any,fromContainer).filter(function(item)
        {
        return AliKeep(item);
        });
    while(items.length)
        {
        for(var i=0;i<items.length;i++)
            {
            Orion.MoveItem(items[i],0,toContainer);
            Orion.Wait(1300);
            }
        items = Orion.FindType(any,any,fromContainer).filter(function(item)
            {
            return AliKeep(item);
            });
        }
    }

function testEvalWeapon()
    {
    var startTime = testEvalItem(parseWeaponProperties,KeepWeapon);
    Orion.Print('EvalWeaponMS: ' + (Orion.Now() - startTime))
    }
function testEvalJewelry()
    {
    var startTime = testEvalItem(parseJewelryProperties,KeepJewelry);
    Orion.Print('EvalJewelryMS: ' + (Orion.Now() - startTime))
    }
function testEvalArmor()
    {
    var startTime = testEvalItem(parseArmorProperties,KeepArmor);
    Orion.Print('EvalArmorMS: ' + (Orion.Now() - startTime))
    }

function testSortWeapon()
    {
    testSortItem(parseWeaponProperties,KeepWeapon)
    }
function testSortJewelry()
    {
    testSortItem(parseJewelryProperties,KeepJewelry)
    }
function testSortArmor()
    {
    testSortItem(parseArmorProperties,KeepArmor)
    }

function testEvalItem(parseFn,keepFn)
    {
    Orion.CharPrint(self,1159,'Target Item')
    Orion.WaitForAddObject('myTarget');
    var startTime = Orion.Now();
    var item = Orion.FindObject('myTarget');
    var parse = parseFn(item.Properties())
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Clear();
    for(mod in parse)
        {
        TextWindow.Print(mod + ': ' + parse[mod])
        }
    Orion.Print('Keeper: ' + keepFn(parse,item.Properties(),item.Graphic()));
    return startTime;
    }

function testSortItem(parseFn,keepFn)
    {
    Orion.CharPrint(self,1159,'Target FROM container')
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    Orion.CharPrint(self,1159,'Target TO container')
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(toContainer);
    var items = Orion.FindTypeEx(any,any,fromContainer).filter(function(item)
        {
        var parse = parseFn(item.Properties())
        return keepFn(parse,item.Properties(),item.Graphic())
        });
    while(items.length)
        {
        for(var i=0;i<items.length;i++)
            {
            Orion.MoveItem(items[i].Serial(),0,toContainer);
            Orion.Wait(1300);
            }
        items = Orion.FindTypeEx(any,any,fromContainer).filter(function(item)
            {
            var parse = parseFn(item.Properties())
            return keepFn(parse,item.Properties(),item.Graphic())
            });
        }
    }

function itemEvalUnitTest()
    {
    Orion.WaitForAddObject('myTarget')
    var serial = Orion.GetSerial('myTarget');
    Orion.Print(AliKeep(serial));
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
        if(item && item.Container() !== backpackSerial && AliKeep(itemSerial))
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
				if(AliKeep(item))
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

function AliKeep(itemSerial)
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
    var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1 && props.indexOf("Energy Resist") > -1;

    //Special Cases
    //Exclude cursed items and ranged weapons (looted bows and throwing weps are never good)
	if(props.indexOf('Cursed') > -1 || props.indexOf('Weight: 50 Stones') > -1)
        return false;
    if(props.indexOf('Skill Required: Archery') > -1) 
        return false;
    if(props.indexOf('Skill Required: Throwing') > -1) 
        return false;

    if(!isJewelry && !is2hWeapon && !is1hWeapon && !isArmor)
        {
        //Handle shields, only luck
        if(Orion.Contains('0x1B72|0x1BC3|0x1BC4|0x1B7B|0x1B73|0x1B74|0x1B77|0x1B78|0x1B75|0x1B76|0x1BC5|0x1B79|0x1B7A', itemGraphic) && props.indexOf("Luck 150") > -1)
            return true;
        return false;
        }

    if(is1hWeapon || is2hWeapon)
        {
        var parse = parseWeaponProperties(props);
        return KeepWeapon(parse,props);
        }

	if(isJewelry)
        {
        var parse = parseJewelryProperties(props);
        return KeepJewelry(parse,props);
	    }

	if(isArmor)
        {
        var parse = parseArmorProperties(props);
        return KeepArmor(parse,props,itemGraphic);
	    }

	return false;
    }

function KeepWeapon(propertiesObj,props)
    {
    //ssi requirement on slow weps
    //brittle raises requirements
    var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
	var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
	if(is2hWeapon) //handle 2 handed weapon special cases
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
	if(is1hWeapon) //handle 1 handed weapon special cases
        { //I want to exclude THESE specific 1h weapons
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
    var wepObj = propertiesObj;

    var isOverCapSplinter = wepObj['SplinteringWeapon'] > 20;
    var isSplinter = wepObj['SplinteringWeapon'] >= 20;
    var isAntique = props.indexOf('Antique') > -1;
    var isClean = props.indexOf('Antique') == -1 && props.indexOf('Brittle') == -1;
    var isOverCapFireball = wepObj['HitFireball'] > 50;
    var isOverCapLightning = wepObj['HitLightning'] > 50;
    var isOverCapHarm = wepObj['HitHarm'] > 50;
    var isHitSpell = wepObj['HitFireball'] >= 50 || wepObj['HitLightning'] >= 50 || wepObj['HitHarm'] >= 50;
    var isLowerD = wepObj['HitLowerDefense'] >= 30;
    var isHighManaLeech = wepObj['HitManaLeech'] >= 80;
    var isSpellChanneling = wepObj['SpellChanneling'] >= 1;
    var isBokuto = props.indexOf("Bokuto") > -1;
    var isPvmWep = props.indexOf("Bladed Staff") > -1 || props.indexOf("Longsword") || props.indexOf("Broadsword") || props.indexOf("Hatchet") > -1 || props.indexOf("Katana") > -1 || props.indexOf("Leafblade") > -1;
    var numProps = Object.keys(wepObj).length;
    var isImbuable = numProps <= 4;
    var isTwoMod = numProps == 2;
    if(isAntique && !isBokuto)
        return false;

    if(isBokuto && isSplinter)
        {
        if(isOverCapSplinter && (isHitSpell || isLowerD))
            return true;
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm)
            return true;
        if(isHitSpell && isLowerD) //Keep brittle weapons (and antique boks) if HLD, hit spell, and splinter
            return true;
        // if(isBokuto && isHitSpell && isSpellChanneling) //Keep all hit spell and splinter bokutos
        //     return true;
        if(isImbuable && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter))
            return true;
        if(isPvmWep && isHighManaLeech && (isHitSpell || isLowerD || isImbuable))
            return true;
        return false;		
        }

    if(isSplinter)
        {
        if(isOverCapSplinter && (isHitSpell || isLowerD))
            return true;
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm)
            return true;
        if(isHitSpell && isLowerD) //Keep brittle weapons (and antique boks) if HLD, hit spell, and splinter
            return true;
        // if(isBokuto && isHitSpell && isSpellChanneling) //Keep all hit spell and splinter bokutos
        //     return true;
        if(isImbuable && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter))
            return true;
        if(isPvmWep && isHighManaLeech && (isHitSpell || isLowerD || isImbuable))
            return true;
        return false;		
        }

    if(isPvmWep)
        {
        var isHitFatigue = wepObj['HitFatigue'] >= 50;
        var isHitManaDrain = wepObj['HitManaDrain'] >= 50;
        var isHitStaminaLeech = wepObj['HitStaminaLeech'] >= 40;
        var isHitManaLeech = wepObj['HitManaLeech'] >= 70;
        var isHitLifeLeech = wepObj['HitLifeLeech'] >= 70;
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
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        
        }
    var statMods = 
        {
        StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,
        StaminaIncrease:true,ManaIncrease:true,
        }
    var mageMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,
        Mysticism:true,SpellDamageIncrease:true,LowerReagentCost:true,
        }
    var dexxerMods = 
        {
        Archery:true,Healing:true,Throwing:true,
        }
    var hybridMods =
        {
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,EnhancePotions:true,
        StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,ManaRegeneration:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,LowerManaCost:true,ManaIncrease:true,
        MaceFighting:true,Fencing:true,Swordsmanship:true,SwingSpeedIncrease:true,DamageIncrease:true,
        FasterCasting:true,Tactics:true,StaminaIncrease:true,Necromancy:true,FasterCastRecovery:true,
        AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,Chivalry:true,Stealth:true,
        }
    if(propertiesObj['Chivalry'] == 20 && propertiesObj['FasterCasting'] && propertiesObj['FasterCastRecovery'])
        {
        Debug('Keep: 1/3 +20 Chiv Samp Jewel');
        return true;
        }
    var skillInt = countMatchingMods(propertiesObj, skillMods);
    if(skillInt == 0)
        {
        if(!propertiesObj['EnhancePotions'] || !propertiesObj['DefenseChanceIncrease'] || !propertiesObj['ManaRegeneration'])
            {
            Debug('Trash: Zero skills, missing EP or DCI or MR');
            return false;
            }
        targetModCount++;
        }
    if(skillInt == 1 && !propertiesObj['EnhancePotions'] && !propertiesObj['DefenseChanceIncrease'] && !propertiesObj['HitChanceIncrease'])
        {
        Debug('Trash: One skill mod and must have at least one of EP/DCI/HCI');
        return false;
        }
    if(skillInt >= 4)
        {
        Debug('Keep: >= 4 skill mods');
        return true;
        }
    var statInt = countMatchingMods(propertiesObj,statMods);
    if(skillInt >= 2 && statInt >= 3)
        return false;
    var mageInt = countMatchingMods(propertiesObj, mageMods);
    var dexxerInt = countMatchingMods(propertiesObj, dexxerMods);
    var hybridInt = countMatchingMods(propertiesObj, hybridMods);
    Orion.Print('mageInt: ' + mageInt + '\ndexxerInt: ' + dexxerInt + '\nhybridInt: ' + hybridInt + '\nskillInt: ' + skillInt + '\nstatInt: ' + statInt + '\nclean: ' + isClean);
    if(mageInt + hybridInt >= targetModCount || dexxerInt + hybridInt >= targetModCount)
        {
        Debug('Keep: 7 or 8 good mods (or 6 if clean)');
        return true;
        }
    return false;
    }

function KeepArmor(propertiesObj,props,itemGraphic)
    {    
    var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1 && props.indexOf("Energy Resist") > -1;
    if(!isArmor)
        return false
    if(props.indexOf('Antique') > -1)
        return false;
    if(props.indexOf("Fortified") > -1 && props.indexOf("Of Defense") > -1)
        return false;
    if((props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1)
        && (props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1))
        return false;
    var lmcArr = 
        { //graphic: [intrinsicLMC,comment]
        '0x153F':['0','Bandana(mono)'],
        '0x140D':['1','Bascinet(left)'],
        '0x140C':['1','Bascinet(right)'],
        '0x1545':['0','Bear Mask(mono)'],
        '0x1454':['3','Bone Armor(left)'],
        '0x144F':['3','Bone Armor(right)'],
        '0x144E':['3','Bone Arms(left)'],
        '0x1453':['3','Bone Arms(right)'],
        '0x1450':['3','Bone Gloves(left)'],
        '0x1455':['3','Bone Gloves(right)'],
        '0x1451':['3','Bone Helmet(left)'],
        '0x1456':['3','Bone Helmet(right)'],
        '0x1457':['3','Bone Leggings(left)'],
        '0x1452':['3','Bone Leggings(right)'],
        '0x13BB':['1','Chainmail Coif(left)'],
        '0x13C0':['1','Chainmail Coif(right)'],
        '0x2774':['1','Chainmail Hatsuburi(mono)'],
        '0x13C3':['1','Chainmail Leggings(left)'],
        '0x13BE':['1','Chainmail Leggings(right)'],
        '0x13C4':['1','Chainmail Tunic(left)'],
        '0x13BF':['1','Chainmail Tunic(right)'],
        '0x1409':['1','Close Helm(left)'],
        '0x1408':['1','Close Helmet(right)'],
        '0x2778':['1','Decorative Platemail Kabuto(mono)'],
        '0x1547':['0','Deer Mask(mono)'],
        '0x171A':['0','Feathered Hat(mono)'],
        '0x1C07':['0','Female Leather Armor(left)'],
        '0x1C06':['0','Female Leather Armor(right)'],
        '0x1C05':['1','Female Plate(left)'],
        '0x1C04':['1','Female Plate(right)'],
        '0x1713':['0','Floppy Hat(mono)'],
        '0x2777':['1','Heavy Platemail Jingasa(mono)'],
        '0x140B':['1','Helmet(left)'],
        '0x140A':['1','Helmet(right)'],
        '0x2B75':['3','Hide Gloves(mono)'],
        '0x2B76':['3','Hide Gorget(mono)'],
        '0x2B78':['3','Hide Pants(mono)'],
        '0x2B77':['3','Hide Pauldrons(mono)'],
        '0x2B74':['3','Hide Tunic(mono)'],
        '0x171C':['0','Jester Hat(mono)'],
        '0x2798':['0','Kasa(mono)'],
        '0x2FC8':['0','Leaf Arms(mono)'],
        '0x2FC6':['0','Leaf Gloves(mono)'],
        '0x2FC7':['0','Leaf Gorget(mono)'],
        '0x2FC9':['0','Leaf Leggings(mono)'],
        '0x2FCA':['0','Leaf Tonlet(mono)'],
        '0x2FC5':['0','Leaf Tunic(mono)'],
        '0x1C0B':['0','Leather Bustier(left)'],
        '0x1C0A':['0','Leather Bustier(right)'],
        '0x1DB9':['0','Leather Cap(left)'],
        '0x1DBA':['0','Leather Cap(right)'],
        '0x277B':['0','Leather Do(mono)'],
        '0x13C6':['0','Leather Gloves(left)'],
        '0x13CE':['0','Leather Gloves(right)'],
        '0x13C7':['0','Leather Gorget(mono)'],
        '0x278A':['0','Leather Haidate(mono)'],
        '0x277E':['0','Leather Hiro Sode(mono)'],
        '0x2776':['0','Leather Jingasa(mono)'],
        '0x13D2':['0','Leather Leggings(left)'],
        '0x13CB':['0','Leather Leggings(right)'],
        '0x277A':['0','Leather Mempo(mono)'],
        '0x278E':['0','Leather Ninja Hood(mono)'],
        '0x2793':['0','Leather Ninja Jacket(mono)'],
        '0x2792':['0','Leather Ninja Mitts(mono)'],
        '0x2791':['0','Leather Ninja Pants(mono)'],
        '0x1C01':['0','Leather Shorts(left)'],
        '0x1C00':['0','Leather Shorts(right)'],
        '0x1C09':['0','Leather Skirt(left)'],
        '0x1C08':['0','Leather Skirt(right)'],
        '0x13C5':['0','Leather Sleeves(left)'],
        '0x13CD':['0','Leather Sleeves(right)'],
        '0x2786':['0','Leather Suneate(mono)'],
        '0x13D3':['0','Leather Tunic(left)'],
        '0x13CC':['0','Leather Tunic(right)'],
        '0x2781':['1','Light Platemail Jingasa(mono)'],
        '0x140F':['1','Norse Helm(left)'],
        '0x140E':['1','Norse Helm(right)'],
        '0x1F0B':['0','Orc Helm(left)'],
        '0x1F0C':['0','Orc Helm(right)'],
        '0x141B':['0','Orc Mask(mono)'],
        '0x1412':['1','Plate Helm(left)'],
        '0x1419':['1','Plate Helm(right)'],
        '0x1410':['1','Platemail Arms(left)'],
        '0x1417':['1','Platemail Arms(right)'],
        '0x2785':['1','Platemail Battle Kabuto(mono)'],
        '0x277D':['1','Platemail Do(mono)'],
        '0x1414':['1','Platemail Gloves(left)'],
        '0x1418':['1','Platemail Gloves(right)'],
        '0x1413':['1','Platemail Gorget(mono)'],
        '0x278D':['1','Platemail Haidate(mono)'],
        '0x2775':['1','Platemail Hatsuburi(mono)'],
        '0x2780':['1','Platemail Hiro Sode(mono)'],
        '0x141A':['1','Platemail Legs(left)'],
        '0x1411':['1','Platemail Legs(right)'],
        '0x2779':['1','Platemail Mempo(mono)'],
        '0x2788':['1','Platemail Suneate(mono)'],
        '0x1416':['1','Platemail Tunic(left)'],
        '0x1415':['1','Platemail Tunic(right)'],
        '0x2B71':['0','Raven Helm(mono)'],
        '0x13EB':['1','Ringmail Gloves(left)'],
        '0x13F2':['1','Ringmail Gloves(right)'],
        '0x13F1':['1','Ringmail Leggings(left)'],
        '0x13F0':['1','Ringmail Leggings(right)'],
        '0x13EF':['1','Ringmail Sleeves(left)'],
        '0x13EE':['1','Ringmail Sleeves(right)'],
        '0x13ED':['1','Ringmail Tunic(left)'],
        '0x13EC':['1','Ringmail Tunic(right)'],
        '0x1543':['0','Skullcap(mono)'],
        '0x2784':['1','Small Platemail Jingasa(mono)'],
        '0x2789':['1','Standard Platemail Kabuto(mono)'],
        '0x1717':['0','Straw Hat(mono)'],
        '0x1C03':['3','Studded Armor(mono)'],
        '0x1C0D':['3','Studded Bustier(left)'],
        '0x1C0C':['3','Studded Bustier(right)'],
        '0x277C':['3','Studded Do(mono)'],
        '0x13D5':['3','Studded Gloves(left)'],
        '0x13DD':['3','Studded Gloves(right)'],
        '0x13D6':['3','Studded Gorget(mono)'],
        '0x278B':['3','Studded Haidate(mono)'],
        '0x277F':['3','Studded Hiro Sode(mono)'],
        '0x13E1':['3','Studded Leggings(left)'],
        '0x13DA':['3','Studded Leggings(right)'],
        '0x279D':['3','Studded Mempo(mono)'],
        '0x13D4':['3','Studded Sleeves(left)'],
        '0x13DC':['3','Studded Sleeves(right)'],
        '0x2787':['3','Studded Suneate(mono)'],
        '0x13E2':['3','Studded Tunic(left)'],
        '0x13DB':['3','Studded Tunic(right)'],
        '0x1716':['0','Tall Straw Hat(mono)'],
        '0x1549':['0','Tribal Mask A(mono)'],
        '0x154B':['0','Tribal Mask B(mono)'],
        '0x171B':['0','Tricorne Hat(mono)'],
        '0x2B72':['0','Vulture Helm(mono)'],
        '0x1714':['0','Wide-brim Hat(mono)'],	
        '0x2B73':['0','Winged Helm(mono)'],
        '0x1718':['0',"Wizard's Hat(mono)"],	
        '0x2B6C':['0','Woodland Arms(mono)'],
        '0x2B67':['0','Woodland Chest(mono)'],
        '0x2B6A':['0','Woodland Gauntlets(mono)'],
        '0x2B69':['0','Woodland Gorget(mono)'],
        '0x2B6B':['0','Woodland Leggings(mono)'],
        '0x4049':['0','Gargish Leather Chest'],
        '0x404A':['0','Gargish Leather Chest'],
        '0x404C':['0','Gargish Leather Kilt'],
        '0x4047':['0','Gargish Leather Arms'],
        '0x4066':['0','Gargish Cloth Leggings'],
        '0x0284':['1','Gargish Stone Arms'],
        '0x4056':['1','Gargish Platemail Legs'],
        '0x030A':['1','Gargish Platemail Tunic'],
        '0x404E':['0','Gargish Leather Leggings'],
        '0x4050':['1','Gargish Platemail Arms'],
        '0x405C':['1','Gargish Stone Kilt'],
        '0x405D':['1','Gargish Stone Leggings'],
        '0x405E':['1','Gargish Stone Leggings'],
        '0x4058':['1','Gargish Stone Arms'],
        '0x4057':['1','Gargish Stone Arms'],
        '0x405A':['1','Gargish Stone Chest'],
        '0x4D0A':['1','Gargish Stone Amulet'],
        '0x4062':['0','Gargish Cloth Chest'],
        '0x404B':['0','Gargish Leather Kilt'],
        '0x4210':['0','Gargish Necklace'],
        '0x4052':['1','Gargish Platemail Chest'],
        '0x4053':['1','Gargish Platemail Kilt'],
        '0x4066':['0','Gargish Cloth Leggings'],
        '0x4048':['0','Gargish Leather Sleeves'],
        '0x4064':['0','Gargish Cloth Kilt'],
        '0x404D':['0','Gargish Leather Shorts'],
        }
    var hpi = propertiesObj['HitPointIncrease'] || 0;
    var stam = propertiesObj['StaminaIncrease'] || 0;
    var mana = propertiesObj['ManaIncrease'] || 0;
    var hpr = propertiesObj['HitPointRegeneration'] || 0;
    //var sr = propertiesObj['StaminaRegeneration'] || 0;
    var mr = propertiesObj['ManaRegeneration'] || 0;
    var str = propertiesObj['StrengthBonus'] || 0;
    var dex = propertiesObj['DexterityBonus'] || 0;
    var int = propertiesObj['IntelligenceBonus'] || 0;
    var lrc = propertiesObj['LowerReagentCost'] || 0;
    var lmc = propertiesObj['LowerManaCost'] || 0;
    var hci = propertiesObj['HitChanceIncrease'] || 0;
    var dci = propertiesObj['DefenseChanceIncrease'] || 0;
    //var cf = propertiesObj['CastingFocus'] || 0;
    var damageEater = propertiesObj['DamageEater'] || 0;
    var kineticEater = propertiesObj['KineticEater'] || 0;
    var poisonEater = propertiesObj['PoisonEater'] || 0;
    var fireEater = propertiesObj['FireEater'] || 0;
    var energyEater = propertiesObj['EnergyEater'] || 0;
    var coldEater = propertiesObj['ColdEater'] || 0;
    //var rpd = propertiesObj['ReflectPhysicalDamage'] || 0;
    //var ep = propertiesObj['EnhancePotions'] || 0;
    var luck = propertiesObj['Luck'] || 0;
    //var nightsight = propertiesObj['NightSight'] || 0;

    var goodEater = damageEater || poisonEater || fireEater || coldEater || energyEater || kineticEater;
    var totalStats = hpi + stam + mana + str + dex + int;
    var isArtifact = props.indexOf('Artifact') > -1;
    var intrinsicLMCArr = lmcArr[itemGraphic];
    if(!intrinsicLMCArr)
        {
        Debug('intrinsicLMC check defaulted on graphic: ' + itemGraphic + '\n' + props);
        var intrinsicLMC = '3';
        }
    else
        var intrinsicLMC = intrinsicLMCArr[0];
        
    Orion.Print('\ngoodEater: ' + goodEater + '\ntotalStats: ' + totalStats + '\nMR: ' + mr + '\nHPR: ' + hpr + '\nisArtifact: ' + isArtifact + '\nintrinsicLMC: ' + intrinsicLMC)
    
    if(hpi >= 3)
        { //treat as Vitality
        switch(intrinsicLMC)
            {
            default: //default to best case scenario
                Debug('hpi intrinsicLMC switch defaulted on graphic: ' + itemGraphic + '\n' + props);
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = lrc >= 20 ? 1 : 5;
                var mrThreshold = 2;
                var statThreshold = goodEater ? 10 : 15;
                break;
            case '1':
                var lrcThreshold = 15;
                var lmcThreshold = 8;
                var mrThreshold = 3;
                var statThreshold = goodEater ? 15 : 20;
                break;
            case '0':
                var lrcThreshold = 20;
                var lmcThreshold = 10;
                var mrThreshold = 4;
                var statThreshold = goodEater ? 19 : 24;
                break;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold)
            return true;
        if(lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold + 3)
            return true;
        if(stam > 5 && isArtifact)
            return true;
        }

    if(stam >= 7)
        { //treat as Haste
        switch(intrinsicLMC)
            {
            case '3':
                var lrcThreshold = 15;
                var lmcThreshold = 5;
                var mrThreshold = 3;
                var statThreshold = 20;          
                break
            default: //default to best case scenario
                Debug('stam intrinsicLMC switch defaulted on graphic: ' + itemGraphic + '\n' + props);
            case '1':
                var lrcThreshold = 20;
                var lmcThreshold = 6;
                var mrThreshold = 0;
                var statThreshold = 25;  
                break
            case '0':
                return false;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold - 5)
            return true;
        if(lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold)
            return true;
        }

    if(isArtifact)
        { //everything else
        if(luck == 150 || (hci == 5 || dci == 5)) //keep 150 luck or 5 dci/hci artifact armor
            return true;
        switch(intrinsicLMC)
            {
            default: //default to best case scenario
                Debug('General intrinsicLMC switch defaulted on graphic: ' + itemGraphic + '\n' + props);
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = 5;
                var mrThreshold = 3;
                var hprThreshold = 2;
                var statThreshold = goodEater ? 5 : 9;
                break;
            case '1':
                var lrcThreshold = 15;
                var lmcThreshold = 8;
                var mrThreshold = 3;
                var hprThreshold = 3;
                var statThreshold = goodEater ? 7 : 11;  
                break;
            case '0':
                var lrcThreshold = 20;
                var lmcThreshold = 10;
                var mrThreshold = 4;
                var hprThreshold = 4;
                var statThreshold = goodEater ? 10 : 15;
                break;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && mr >= mrThreshold && hpr >= hprThreshold && totalStats >= statThreshold)
            return true;
        if(lmc >= lmcThreshold && mr >= mrThreshold && hpr >= hprThreshold &&  totalStats >= statThreshold + 3)
            return true;
        }

    return false;
    }

function parseJewelryProperties(jewelryProperties)
    {
    var targetMods = 
        {
        //good mods
        Magery:true,MaceFighting:true,Fencing:true,Swordsmanship:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,Tactics:true,
        Focus:true,Parrying:true,Stealth:true,Anatomy:true,Bushido:true,EvaluateIntelligence:true,Mysticism:true,Wrestling:true,
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
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)?/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName])
                {
                var modValue = parseInt(modMatch[2]);
                Orion.Print(modName + ': ' + modValue)
                modsObj[modName] = modValue || 1;
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
        ManaRegeneration:true,HitPointRegeneration:true,StaminaRegeneration:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,
        EnhancePotions:true,ReactiveParalyze:true,HitFatigue:true,HitManaDrain:true,SplinteringWeapon:true,BattleLust:true,LowerRequirements:true,
        StaminaIncrease:true,LowerManaCost:true
        }
    var lines = weaponProperties.split("\n");
    var propertiesObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*(-?[0-9]+)?/);
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
                propertiesObj[modName] = modValue || 1;
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
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)?/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]);
                propertiesObj[modName] = modValue || 1;
                }
            }
        });
    return propertiesObj;
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

function DropDraggedToContainer() //v2
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer');
	if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function MoveAll()
	{
    Orion.CharPrint(self,1159,"Select 'From' container");
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    var item = Orion.FindType(any,any,fromContainer)[0];
    while(item)
        {
        Orion.MoveItem(item,0,toContainer);
        Orion.Wait(1200);
        item = Orion.FindType(any,any,fromContainer)[0];
        }
	}