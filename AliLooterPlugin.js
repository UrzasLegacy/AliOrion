var lootItems = {
    '0x400B': true, //shame crystals
    '0x0F87': true, //lucky coin
    '0x0EED': true, //gold
}
var keepTrainingArmor = true;
var serialIndex = 1;
var ModularGumpButtons = //[ xsize, ysize, CallBackID, 'displayText', 'functionName', optional: [arguments] ]
    [
        [ [100, 30, serialIndex++, "MoveKeepers", 'MoveKeepers'], [100, 30, serialIndex++, "MoveTrash", 'MoveTrash'], [100, 30, serialIndex++, "MoveAll", "MoveAll"]],
        [ [100, 30, serialIndex++, 'HighlightKeepers', 'HighlightKeepers'], [100, 30, serialIndex++, 'HighlightTrash', 'HighlightTrash'], [100, 30, serialIndex++, "TestItem", 'EvalKeep'],],
        [ [100, 30, serialIndex++, 'HighlightArea', 'HighlightAreaKeepers'] ],
        [], //blank row
        [ [100, 30, serialIndex++, "MoveAll0Skill", 'MoveAllJewelBySkill',[0]], [100, 30, serialIndex++, "MoveAll1Skill", 'MoveAllJewelBySkill',[1]], [100, 30, serialIndex++, "MoveAll2Skill", 'MoveAllJewelBySkill',[2]], ],
        [ [100, 30, serialIndex++, "MoveAll3Skill", 'MoveAllJewelBySkill',[3]], [100, 30, serialIndex++, "MoveAll4Skill", 'MoveAllJewelBySkill',[4]], [100, 30, serialIndex++, "MoveAll5Skill", 'MoveAllJewelBySkill',[5]], ],
        [], //blank row
        [ [100, 30, serialIndex++, "TestJewelry", 'testEvalJewelry'], [100, 30, serialIndex++, "TestArmor", 'testEvalArmor'], [100, 30, serialIndex++, "TestWeapon", 'testEvalWeapon'], ],
        [ [100, 30, serialIndex++, "SortJewelry", "testSortJewelry"], [100, 30, serialIndex++, "SortArmor", "testSortArmor"], [100, 30, serialIndex++, "SortWeapons", "testSortWeapon"], ],

    ]

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
    debug = true;
    Orion.CharPrint(self,1159,'Target item');
    Orion.WaitForAddObject('myTarget')
    var serial = Orion.GetSerial('myTarget');
    var startTime = Orion.Now();
    Orion.Print('Keep: ' + AliKeep(serial) + '\nEvalKeepMS: ' + (Orion.Now() - startTime));
    }

function MoveKeepers()
    {
    MoveLootCall(true);
    }

function MoveTrash()
    {
    MoveLootCall(false);
    }

function MoveAll()
    {
    MoveLootCall('all');
    }

function MoveLootCall(keep)
    {
    Orion.CharPrint(self,1159,'Target FROM container')
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    Orion.CharPrint(self,1159,'Target TO container')
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(toContainer);
    var totalItems = 0;
    var items = Orion.FindType(any,any,fromContainer).filter(function(item)
        {
        totalItems++;
        if(keep == 'all')
            return true;
        if(keep)
            return AliKeep(item);
        return !AliKeep(item);
        });
    Orion.Print('Total Matching: ' + items.length + '\nTotal Searched: ' + totalItems + '\nRatio: ' + (items.length / totalItems).toFixed(2))
    while(items.length)
        {
        for(var i=0;i<items.length;i++)
            {
            Orion.MoveItem(items[i],0,toContainer);
            Orion.Wait(1300);
            }
        items = Orion.FindType(any,any,fromContainer).filter(function(item)
            {
            if(keep == 'all')
                return true;
            if(keep)
                return AliKeep(item);
            return !AliKeep(item);
            });
        } 
    }

function MoveAllJewelBySkill(skillIntTarget)
	{
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        }
    Orion.CharPrint(self,1159,"Select 'From' container");
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    var item = Orion.FindTypeEx(any,any,fromContainer).filter(function(item)
        {
        var isJewelry = Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', item.Graphic());
        if(!isJewelry)
            return false;
        var parse = parseJewelryProperties(item.Properties());
        var skillInt = CountMatchingMods(parse,skillMods)
        return skillInt == skillIntTarget;
        })[0];
    while(item)
        {
        Orion.MoveItem(item.Serial(),0,toContainer);
        Orion.Wait(1200);
        item = Orion.FindTypeEx(any,any,fromContainer).filter(function(item)
            {
            var isJewelry = Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', item.Graphic());
            if(!isJewelry)
                return false;
            var parse = parseJewelryProperties(item.Properties());
            var skillInt = CountMatchingMods(parse,skillMods)
            return skillInt == skillIntTarget;
            })[0];
        }
	}

function HighlightAreaKeepers()
    {
    Orion.FindType(any,any,ground,'item', 22).filter(function(item)
        {
        return AliKeep(item);
        }).forEach(function(keeper)
            {
            Orion.TestItemColor(keeper, 1152)
            });
    }

function HighlightKeepers()
    {
    HighlightContainersCall(true);
    }

function HighlightTrash()
    {
    HighlightContainersCall(false);
    }

function HighlightContainersCall(keep)
    {
    var startTime = Orion.Now();
    var groundContainers = Orion.FindTypeEx(any,any,ground,'item', 4, '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var packContainers = Orion.FindTypeEx(any, any, self, 'item', 'finddistance', '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var npcContainers = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(npc)
        {
        return Orion.ObjAtLayer('backpack',npc.Serial())
        }).map(function(npc)
            {
            var npcPack = Orion.ObjAtLayer('backpack',npc.Serial());
            return npcPack;
            });
    var containers = groundContainers.concat(packContainers).concat(npcContainers);
    var totalItems = 0;
    var totalHighlighted = 0;
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i]
        if(!container)
            Orion.Print(container)
        Orion.FindType(any,any,container.Serial(),'item', 'finddistance', '', true).filter(function(item)
            {
            totalItems++;
            if(keep)
                return AliKeep(item);
            return !AliKeep(item);
            }).forEach(function(keeper)
                {
                    totalHighlighted++;
                Orion.TestItemColor(keeper, 1152)
                });
        }
    Orion.Print('Total Highlighted: ' + totalHighlighted + '\nTotal Searched: ' + totalItems + '\nRatio: ' + (totalHighlighted / totalItems).toFixed(2) + '\nScan Time: ' + (Orion.Now() - startTime) + 'ms')
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
        return 'Kept by Item Graphic';
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
            return 'Luck Shield';
        Debug('Trash: !isJewelry && !is2hWeapon && !is1hWeapon && !isArmor && not luck shield')
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
    Debug('Trash: Failed all other checks');
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
            Debug('Trash: Excluded Two Handed Weapon');
			return false;
		    }
	    }
	if(is1hWeapon) //handle 1 handed weapon special cases
        { 
        if(props.indexOf("Spell Channeling") > -1 && props.indexOf('Luck 150') > -1 && props.indexOf('Mage Weapon') > -1)
            return 'Luck Weapon';
		if( //I want to exclude THESE specific 1h weapons
			props.indexOf('Elven Machete') > -1 ||
			props.indexOf('Radiant Scimitar') > -1 || 
			props.indexOf('Wild Staff') > -1 ||
			props.indexOf('Lance') > -1 ||
			props.indexOf('Scepter') > -1 ||
			props.indexOf('Viking Sword') > -1 ||
			props.indexOf('War Mace') > -1 ||
			props.indexOf("Smith's Hammer") > -1 ||
			props.indexOf('Sledge Hammer') > -1
		)
            {
            Debug('Trash: Excluded One Handed Weapon');
			return false;
		    }
        }
    var wepObj = propertiesObj;

    var isOverCapSplinter = wepObj['SplinteringWeapon'] > 20;
    var isSplinter = wepObj['SplinteringWeapon'] >= 20;
    var isAntique = props.indexOf('Antique') > -1;
    var isClean = props.indexOf('Antique') === -1 && props.indexOf('Imbued') === -1 && props.indexOf('Brittle') === -1;
    var isOverCapFireball = wepObj['HitFireball'] > 50;
    var isOverCapLightning = wepObj['HitLightning'] > 50;
    var isOverCapHarm = wepObj['HitHarm'] > 50;
    var isHitSpell = wepObj['HitFireball'] >= 50 || wepObj['HitLightning'] >= 50 || wepObj['HitHarm'] >= 50;
    var isLowerD = wepObj['HitLowerDefense'] >= 30;
    var isHighManaLeech = wepObj['HitManaLeech'] >= 80;
    var isSpellChanneling = wepObj['SpellChanneling'] >= 1;
    var isBokuto = props.indexOf("Bokuto") > -1;

    var numProps = Object.keys(wepObj).length;
    if(wepObj['FasterCasting'] === -1)
        numProps--;
    if(isHitSpell || wepObj['HitDispel'] || wepObj['HitMagicArrow'])
        var imbueProps = numProps - 1;
    else
        var imbueProps = numProps;
    var isImbuable = imbueProps <= 4;
    var isEleDamage = props.indexOf('Physical Damage 100%') == -1
    Debug('numProps: ' + numProps)
    if(isBokuto && isSplinter)
        {
        if(isAntique && !isOverCapSplinter) //Reject any boks that aren't overcap splinter
            {
            Debug('Trash: Antique Bok w/o Overcap Splinter')
            return false;
            }
        if(isOverCapSplinter)
            {
            if(isHitSpell)
                return '25+/50+ Bok';
            if(isLowerD)
                return '25+/0/50+ Bok';
            }
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm)
            return '20/60+ Bok';
        if(isHitSpell && isEleDamage)
            return '20/50+ Ele Damage Bok';
        if(isHitSpell && isLowerD)
            return '20/50/50+ Bok';
        if(isSpellChanneling && isHitSpell)
            return '20/50 SC Bok';
        if(numProps <= 3 || (numProps == 4 && (isOverCapSplinter || isHitSpell || isLowerD || isSpellChanneling)))
            return 'Imbuable Bok';
        if(numProps == 1)
            return 'One Mod Splinter Bok';
        Debug('Trash: Splinter bok');
        return false;		
        }
    var isAIWep = props.indexOf("Bladed Staff") > -1 || props.indexOf("Longsword") || props.indexOf("Broadsword") || props.indexOf("Hatchet") > -1 || props.indexOf("Katana") > -1 || props.indexOf("Leafblade") > -1;
    if(isSplinter)
        {
        var isBloodDrinker = wepObj['BloodDrinker'];
        var isReactiveParalyze = wepObj['ReactiveParalyze'];
        var isDisarmWep = props.indexOf("Butcher Knife") > -1 && props.indexOf("Ornate Axe") > -1 && props.indexOf("War Cleaver") > -1 && props.indexOf("War Fork") > -1 && props.indexOf("Mace") > -1 && props.indexOf("Wand") > -1 && props.indexOf("Hatchet") > -1 && props.indexOf("Pickaxe") > -1;
        var isSlowWep = props.indexOf('Weapon Speed 3.25s') > -1 || props.indexOf('Weapon Speed 3.5s') > -1 || props.indexOf('Weapon Speed 3.75s') > -1 || props.indexOf('Weapon Speed 4s') > -1 || props.indexOf('Weapon Speed 4.25s') > -1 || props.indexOf('Weapon Speed 4.5') > -1 || props.indexOf('Weapon Speed 4.75s') > -1
        if(numProps == 1)
            return 'One Mod Splinter Weapon';
        if(numProps == 2)
            return 'Two Mod Splinter Weapon';
        if(numProps == 3 && isReactiveParalyze)
            return 'Three Mod Reactive Paralyze Weapon';
        if((isHitSpell || isImbuable))
            {
            if(isEleDamage)
                return 'Splinter Ele Weapon';
            if(isOverCapSplinter)
                return 'OverCap Splinter Weapon';
            }
        if(isHitSpell && isLowerD && (isEleDamage || (isSlowWep && wepObj['SwingSpeedIncrease']) || isBloodDrinker || isReactiveParalyze || isSpellChanneling))
            return '20+/50+/50+ God Weapon';
        if(!isClean)
            {
            Debug('Trash: Splinter non-bok isn\'t clean');
            return false;
            }
        if(isSlowWep && !wepObj['SwingSpeedIncrease'])
            {
            Debug('Trash: Slow weapon without SSI');
            return false;
            }
        if(isOverCapSplinter && isLowerD)
            return 'Clean 25+/0/50+ Weapon';
        if(isOverCapLightning || isOverCapFireball || isOverCapHarm)
            return 'Clean 20/60+ Weapon';
        if(isHitSpell && isLowerD)
            return 'Clean 20/50/50+ Weapon';
        if(isHitSpell && isSpellChanneling)
            return 'Clean 20/50 SC Weapon';
        if(isAIWep && isHighManaLeech && (isHitSpell || (isLowerD && isImbuable)))
            return 'Clean High Mana Leech AI Weapon';
        if(isDisarmWep && isOverCapSplinter && isLowerD)
            return 'Clean 25+/0+/50+ Butcher Knife';
        Debug('Trash: Splinter weapon failed all previous checks');
        return false;		
        }
    if(isAIWep)
        {
        var isHitFatigue = wepObj['HitFatigue'] >= 50;
        var isHitManaDrain = wepObj['HitManaDrain'] >= 50;
        var isHitStaminaLeech = wepObj['HitStaminaLeech'] >= 40;
        var isHitManaLeech = wepObj['HitManaLeech'] >= 70;
        var isHitLifeLeech = wepObj['HitLifeLeech'] >= 70;
        if(isHitFatigue && isHitManaDrain && isHitStaminaLeech && isHitManaLeech && isHitLifeLeech)
            return 'PvM Hit Drainer';
        }
    Debug('Trash: Non-splinter weapon failed all previous checks');
    return false;
    }

function CountJewelryOvercaps(propertiesObj)
    {
    var overCaps =
        {
        Parrying:15,Bushido:15,Ninjitsu:15,ResistingSpells:15,Anatomy:15,EnhancePotions:25,
        StrengthBonus:10,DexterityBonus:10,IntelligenceBonus:10,ManaRegeneration:4,
        HitChanceIncrease:15,DefenseChanceIncrease:15,LowerManaCost:8,ManaIncrease:5,
        MaceFighting:15,Fencing:15,Swordsmanship:15,SwingSpeedIncrease:10,DamageIncrease:25,
        FasterCasting:1,Tactics:15,StaminaIncrease:5,Necromancy:15,FasterCastRecovery:3,
        AnimalTaming:15,AnimalLore:15,SpiritSpeak:15,Chivalry:15,Stealth:15,
        Archery:15,Healing:15,Throwing:15,
        Magery:15,Wrestling:15,Focus:15,EvaluateIntelligence:15,
        Mysticism:15,SpellDamageIncrease:18,LowerReagentCost:25,
        }
    return Object.keys(propertiesObj).filter(function(prop)
        {
        return propertiesObj[prop] > overCaps[prop];
        }).length;
    }

function KeepJewelry(propertiesObj,props)
    {
    var isClean = props.indexOf('Antique') === -1 && props.indexOf('Imbued') === -1 && props.indexOf('Brittle') === -1;
    var targetModCount = isClean ? 6 : 7;
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        Throwing:true,Healing:true, Archery:true,
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
        return '1/3 +20 Chiv Samp Jewel';
    if(propertiesObj['Magery'] == 20 && propertiesObj['FasterCasting'] && propertiesObj['FasterCastRecovery'])
        return '1/3 +20 Magery Jewel';
    var overcapInt = CountJewelryOvercaps(propertiesObj);
    var skillInt = CountMatchingMods(propertiesObj, skillMods);
    if(skillInt == 0)
        {
        if(overcapInt == 0 && !propertiesObj['EnhancePotions'] || !propertiesObj['DefenseChanceIncrease'] || !propertiesObj['ManaRegeneration'])
            {
            if(propertiesObj['StrengthBonus'] == 10 && propertiesObj['DexterityBonus'] == 10 && propertiesObj['IntelligenceBonus'] == 10)
                return 'Str10/Dex10/Int10';
            Debug('Trash: Zero skills, missing EP or DCI or MR');
            return false;
            }
        else if(overcapInt >= 4)
            return 'No Skill, 4+ Overcaps';
        targetModCount++;
        }
    if(skillInt == 1 && !propertiesObj['EnhancePotions'] && !propertiesObj['DefenseChanceIncrease'] && !propertiesObj['HitChanceIncrease'] && !propertiesObj['FasterCastRecovery'])
        {
        if(overcapInt < 3)
            {
            Debug('Trash: One skill mod and must have at least one of EP/DCI/HCI/FCR');
            return false;
            }
        }
    if(skillInt >= 4)
        return '4+ skill mods';
    var statInt = CountMatchingMods(propertiesObj,statMods);
    if(skillInt >= 2 && statInt >= 3)
        {
        Debug('Trash: 2+ skill mods and 3+ stat mods');
        return false;
        }
    var mageInt = CountMatchingMods(propertiesObj, mageMods);
    var dexxerInt = CountMatchingMods(propertiesObj, dexxerMods);
    var hybridInt = CountMatchingMods(propertiesObj, hybridMods);
    Debug('mageInt: ' + mageInt + '\ndexxerInt: ' + dexxerInt + '\nhybridInt: ' + hybridInt + '\nskillInt: ' + skillInt + '\nstatInt: ' + statInt + '\nclean: ' + isClean);
    if(mageInt + hybridInt >= targetModCount || dexxerInt + hybridInt >= targetModCount)
        return '7 or 8 good mods (or 6 if clean)';
    if(propertiesObj['StrengthBonus'] == 10 && propertiesObj['DexterityBonus'] == 10 && propertiesObj['IntelligenceBonus'] == 10)
        return 'Str10/Dex10/Int10';
    Debug('Trash: Jewelry failed all previous checks');
    return false;
    }

function CountMatchingMods(propObj, mods)
    {
    return Object.keys(propObj).filter(function(prop)
        {
        return mods[prop] === true;
        }).length;
    }

function KeepArmor(propertiesObj,props,itemGraphic)
    {    
    var isArmor = props.indexOf("Poison Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1 && props.indexOf("Energy Resist") > -1;
    if(!isArmor)
        {
        Debug('Failed: Is Not Armor!');
        return false
        }
    if(props.indexOf('Antique') > -1)
        {
        Debug('Trash: Antique Armor');
        return false;
        }
    if(props.indexOf("Fortified") > -1 && props.indexOf("Of Defense") > -1)
        {
        Debug('Trash: Fortified Armor of Defense');
        return false;
        }
    if((props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1)
        && (props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1))
            {
            if(keepTrainingArmor)
                return 'Training Armor';
            Debug('Trash: Training Armor');
            return false;
            }
    var lmcArr = 
        { //graphic: intrinsicLMCBonus
        '0x153F':'0','0x140D':'1','0x140C':'1','0x1545':'0','0x1454':'3','0x144F':'3','0x144E':'3','0x1453':'3','0x1450':'3','0x1455':'3',
        '0x1451':'3','0x1456':'3','0x1457':'3','0x1452':'3','0x13BB':'1','0x13C0':'1','0x2774':'1','0x13C3':'1','0x13BE':'1','0x13C4':'1',
        '0x13BF':'1','0x1409':'1','0x1408':'1','0x2778':'1','0x1547':'0','0x171A':'0','0x1C07':'0','0x1C06':'0','0x1C05':'1','0x1C04':'1',
        '0x1713':'0','0x2777':'1','0x140B':'1','0x140A':'1','0x2B75':'3','0x2B76':'3','0x2B78':'3','0x2B77':'3','0x2B74':'3','0x171C':'0',
        '0x2798':'0','0x2FC8':'0','0x2FC6':'0','0x2FC7':'0','0x2FC9':'0','0x2FCA':'0','0x2FC5':'0','0x1C0B':'0','0x1C0A':'0','0x1DB9':'0',
        '0x1DBA':'0','0x277B':'0','0x13C6':'0','0x13CE':'0','0x13C7':'0','0x278A':'0','0x277E':'0','0x2776':'0','0x13D2':'0','0x13CB':'0',
        '0x277A':'0','0x278E':'0','0x2793':'0','0x2792':'0','0x2791':'0','0x1C01':'0','0x1C00':'0','0x1C09':'0','0x1C08':'0','0x13C5':'0',
        '0x13CD':'0','0x2786':'0','0x13D3':'0','0x13CC':'0','0x2781':'1','0x140F':'1','0x140E':'1','0x1F0B':'0','0x1F0C':'0','0x141B':'0',
        '0x141C':'0','0x1412':'1','0x1419':'1','0x1410':'1','0x1417':'1','0x2785':'1','0x277D':'1','0x1414':'1','0x1418':'1','0x1413':'1',
        '0x278D':'1','0x2775':'1','0x2780':'1','0x141A':'1','0x1411':'1','0x2779':'1','0x2788':'1','0x1416':'1','0x1415':'1','0x2B71':'0',
        '0x13EB':'1','0x13F2':'1','0x13F1':'1','0x13F0':'1','0x13EF':'1','0x13EE':'1','0x13ED':'1','0x13EC':'1','0x1543':'0','0x1544':'0',
        '0x2784':'1','0x2789':'1','0x1717':'0','0x1C02':'3','0x1C03':'3','0x1C0D':'3','0x1C0C':'3','0x277C':'3','0x13D5':'3','0x13DD':'3',
        '0x13D6':'3','0x278B':'3','0x277F':'3','0x13E1':'3','0x13DA':'3','0x279D':'3','0x13D4':'3','0x13DC':'3','0x2787':'3','0x13E2':'3',
        '0x13DB':'3','0x1716':'0','0x1549':'0','0x154B':'0','0x171B':'0','0x2B72':'0','0x1714':'0','0x2B73':'0','0x1718':'0','0x2B6C':'0',
        '0x2B67':'0','0x2B6A':'0','0x2B69':'0','0x2B6B':'0','0x4049':'0','0x404A':'0','0x404C':'0','0x4047':'0','0x4066':'0','0x0284':'1',
        '0x4056':'1','0x030A':'1','0x404E':'0','0x4050':'1','0x405C':'1','0x405D':'1','0x405E':'1','0x4058':'1','0x4057':'1','0x405A':'1',
        '0x4D0A':'1','0x4062':'0','0x404B':'0','0x4210':'0','0x4052':'1','0x4053':'1','0x4066':'0','0x4048':'0','0x4064':'0','0x404D':'0',
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
        Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
        var intrinsicLMC = '3';
        }
    else
        var intrinsicLMC = intrinsicLMCArr[0];
        
    Debug('\ngoodEater: ' + goodEater + '\ntotalStats: ' + totalStats + '\nMR: ' + mr + '\nHPR: ' + hpr + '\nisArtifact: ' + isArtifact + '\nintrinsicLMC: ' + intrinsicLMC);
    
    if(hpi >= 3)
        { //treat as Vitality
        switch(intrinsicLMC)
            {
            default: //default to best case scenario
                Debug('hpi intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = lrc >= 20 ? 1 : 5;
                var mrThreshold = 2;
                var statThreshold = goodEater ? 8 : 12;
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
            return 'LRC Vitality Armor';
        if(lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold + 3)
            return 'LMC Vitality Armor';
        if(stam > 5 && isArtifact)
            return 'HP/Stam Armor';
        }

    if(stam >= 7)
        { //treat as Haste
        switch(intrinsicLMC)
            {
            case '3':
                var lrcThreshold = 15;
                var lmcThreshold = 5;
                var statThreshold = mr >= 2 ? 20 : 25;          
                break
            default: //default to best case scenario
                Debug('stam intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
            case '1':
                var lrcThreshold = 20;
                var lmcThreshold = 6;
                var statThreshold = 25;  
                break
            case '0':
                if(!hpi)
                    {
                    Debug('Trash: Leather Stam Armor')
                    return false;
                    }
                var lrcThreshold = 15;
                var lmcThreshold = 5;
                var statThreshold = mr >= 2 ? 20 : 25;  
                break;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && totalStats >= statThreshold - 5)
            {
            if(hpi)
                return 'LRC Stam/HP Armor'
            return 'LRC Stamina Armor';
            }
        if(lmc >= lmcThreshold && totalStats >= statThreshold)
            {
            if(hpi)
                return 'LMC Stam/HP Armor'
            return 'LMC Stamina Armor';
            }
        }

    if(isArtifact)
        { //everything else
        if(luck == 150) //keep 150 luck or 5 dci/hci artifact armor
            return 'Luck Armor';
        if(hci == 5 || dci == 5) //keep 150 luck or 5 dci/hci artifact armor
            return 'HCI or DCI Armor';
        switch(intrinsicLMC)
            {
            default: //default to best case scenario
                Debug('General intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = 5;
                var mrThreshold = 3;
                var hprThreshold = 2;
                var statThreshold = goodEater ? 3 : 6;
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
            return 'LRC Misc Armor';
        if(lmc >= lmcThreshold && mr >= mrThreshold && hpr >= hprThreshold &&  totalStats >= statThreshold + 3)
            return 'LMC Misc Armor';
        }
    Debug('Trash: Armor failed all previous checks');
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
                var modValue = parseInt(modMatch[2]) || 1;
                Debug(modName + ': ' + modValue);
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
        ManaRegeneration:true,HitPointRegeneration:true,StaminaRegeneration:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,
        EnhancePotions:true,ReactiveParalyze:true,HitFatigue:true,HitManaDrain:true,SplinteringWeapon:true,BattleLust:true,LowerRequirements:true,
        StaminaIncrease:true,LowerManaCost:true,BloodDrinker:true,ReflectPhysicalDamage:true
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
                    {
                    propertiesObj['FasterCasting'] = 1;
                    Debug('Faster Casting: 1');
                    }
                }
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]) || 1;
                Debug(modName + ': ' + modValue);
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
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)?/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]) || 1;
                Debug(modName + ': ' + modValue);
                propertiesObj[modName] = modValue;
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

var debug = false;
function Debug(msg)
    {
    if(!debug)
        return;
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    Orion.Print(msg);
    TextWindow.Print('DEBUG:' + Orion.Time() + ': ' + msg);
    }