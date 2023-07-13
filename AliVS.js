var search1 = [
    ['Hit Harm',50],
    ['Splintering Weapon',20],
    ['Spell Channeling'],
    ['Not Antique'],
    ['Not Brittle'],
    ['Name','Bokuto'],
]

var search2 = [
    ['Defense Chance Increase',15],
    ['Faster Cast Recovery',3],
    ['Magery',15],
]

var mainSearch = search2;


function VSSearcher() 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliVSSavedSearches.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var savedSearches = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        savedSearches = JSON.parse(fileString);

    var title = "Ali VS Searcher";
    //var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10423); 
	var rowStart = 40;
	var columnStart = 25;
    var height = 575;
    var width = 285;

    gump.Clear();
    gump.SetCallback('VSSearchCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    var xPos = columnStart;
    var yPos = rowStart;
    
    var heightAdjust = 25;
    var shared;
    

        
    gump.AddText(xPos,yPos,554,'Item Name:');
    yPos += heightAdjust;
    gump.AddResizepic(xPos, yPos , '0x0BB8', 240, 19);
    gump.AddTextEntry(5000, xPos + 3, yPos, 0, Shared.GetVar('VS Name',''), 240, 20);
    gump.AddTooltip('Item name to search');
    yPos += heightAdjust;
    gump.AddText(xPos,yPos,554,'Mod Name(no spaces):');
    gump.AddText(xPos + 175,yPos,554,'Mod Value:');
    yPos += heightAdjust;
    for(var i=1;i<12;i++)
        {
        var responseCode = i;
        shared = 'VS ' + responseCode;
        gump.AddResizepic(xPos, yPos , '0x0BB8', 200, 19);
        gump.AddTextEntry(responseCode, xPos + 3, yPos, 0, Shared.GetVar(shared + ' Mod',''), 200, 20);
        gump.AddTooltip('Mod to Search');
        gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 35, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 205 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 35, 20);
        gump.AddTooltip('Mod Value Threshold');
        yPos += heightAdjust;
        }

    yPos += heightAdjust;

    gump.AddText(30,yPos - 20,554,'Saved Searches');
    shared = Shared.GetVar('Save Name',undefined);
    gump.AddComboBox(20000, xPos, yPos, '0x0BB8', 0, '0x0BB8', 160, -3,savedSearches.length);
    for(var j=0;j<savedSearches.length;j++)
        gump.AddComboBoxText(savedSearches[j][0],0,shared == savedSearches[j][0] ? 1 : 0,160,'left');
    gump.AddButton(999, xPos + 170, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Load Saved Criteria');
    gump.AddText(211,yPos - 1,554,'Load');
    gump.AddTooltip('Load Saved Criteria');

    yPos += heightAdjust;
    gump.AddResizepic(xPos, yPos , '0x0BB8', 160, 19);
    gump.AddTextEntry(20001, xPos + 3, yPos, 0, '', 160, 20);
    gump.AddTooltip('Enter Saved Search Name');
    gump.AddButton(998, xPos + 170, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Save Current Criteria');
    gump.AddText(211,yPos - 1,554,'Save');
    gump.AddTooltip('Save Current Criteria. Enter name to the left');

    yPos += heightAdjust;
    gump.AddButton(1000, xPos + 170, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddText(xPos + 170 + 11,yPos + 20,554,'Search');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddButton(1001, xPos + 85, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Clear the search menu');
    gump.AddText(xPos + 85 + 15,yPos + 20,554,'Clear');
    gump.AddTooltip('Clear the search menu');
    gump.AddButton(997, xPos, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Delete currently selected saved search');
    gump.AddText(xPos + 11,yPos + 20,554,'Delete');
    gump.AddTooltip('Delete currently selected saved search');
    gump.AddButton(996, xPos, yPos + 45, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Move items that meet the criteria above');
    gump.AddText(xPos + 11,yPos + 45,554,'Move');
    gump.AddTooltip('Move items that meet the criteria above');

    gump.Update();
    
    //Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function VSSearchCallback(_) 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliVSSavedSearches.json';
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0)
        return;
    else if(code == 1000) //Search
        {
        var searchModsList = [];
        for(var i=1;i<12;i++)
            {
            var responseCode = i;
            var textEntryMod = CustomGumpResponse.Text(responseCode) || '';
            var textEntryValue = CustomGumpResponse.Text(responseCode+500) || '';
            Shared.AddVar('VS ' + responseCode + ' Mod',textEntryMod);
            Shared.AddVar('VS ' + responseCode + ' Value',textEntryValue);
            searchModsList.push([textEntryMod,textEntryValue]);
            }
        var searchName = CustomGumpResponse.Text(5000) || '';
        if(searchName)
            {
            searchModsList.push(['Name',searchName])
            Shared.AddVar('VS Name',searchName);
            }
        SearchByMods(searchModsList)
        }
    else if(code == 1001) //Clear
        {
        Shared.ClearVars();
        }
    else if(code == 999) //Recall saved search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo]; //[ ["test1","1"],["test2","2"] ]
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')
        Orion.Print('savedSearch: ' + savedSearch)
        Shared.ClearVars();
        //[ ["test",[["asdgf","1"]]] ]
        for(var i=0;i<savedSearch[1].length;i++)
            {
            var j = i + 1;
            var savedMod = savedSearch[1][i];
            if(savedMod[0] == 'Name')
                {
                Shared.AddVar('VS Name',savedMod[1])
                continue;
                }
            Shared.AddVar('VS ' + j + ' Mod',savedMod[0]);
            Shared.AddVar('VS ' + j + ' Value',savedMod[1]);
            }
        }
    else if(code == 998) //Save Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        var searchModsList = [];
        for(var i=1;i<12;i++)
            {
            var responseCode = i;
            var textEntry1 = CustomGumpResponse.Text(responseCode) || '';
            var textEntry2 = CustomGumpResponse.Text(responseCode+500) || '';
            Shared.AddVar('VS ' + responseCode + ' Mod',textEntry1);
            Shared.AddVar('VS ' + responseCode + ' Value',textEntry2 || '');
            if(textEntry1)
                {
                searchModsList.push([textEntry1,textEntry2]);
                } 
            }
        var searchName = CustomGumpResponse.Text(5000) || '';
        Shared.AddVar('VS Name',searchName);
        if(searchName)
            searchModsList.push(['Name',searchName])
        var saveName = CustomGumpResponse.Text(20001)
        if(!saveName)
            return Orion.CharPrint(self,1159,'You must choose a name for the save');
        var overwrite = false;
        for(var i=0;i<savedSearches.length;i++)
            {
            var savedSearch = savedSearches[i];
            if(saveName == savedSearch[0])
                {
                savedSearch[1] = searchModsList;
                overwrite = true;
                break;
                }
            }
        if(!overwrite)
            {
            savedSearches.push(
                [
                    saveName,
                    searchModsList,
                ])
            }
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(savedSearches));
        tmpFile.Close();
        }
    else if(code == 997) //Delete Saved Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        tmpFile.Close()
        
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')

        var outArr = savedSearches.filter(function(item)
            {
            return item[0] !== savedSearch[0];
            })
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(outArr));
        tmpFile.Close();
        }
    //Orion.Print(gumpButtons);
    //Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    VSSearcher();
	}




function FetchPrices()
    {
    var gump = Orion.GetGump('any','0x000F3EC9');
    if(!gump) return;
    var cmdList = gump.CommandList();
    if(!cmdList) return;
    var rowStart = 20,columnStart = 25,heightAdjust = 75,height = 500,width = 144;
    var displayGump = Orion.CreateCustomGump(12000);
    displayGump.Clear();
    displayGump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    displayGump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    displayGump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    displayGump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    displayGump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    displayGump.Select('htmlgump');
    displayGump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>Ali Auction Peeker</center>"); //x,y arguments are bugged and don't do anything
    displayGump.Select('gump');
    var yPos = rowStart + heightAdjust;
    for(var i=0;i<cmdList.length;i++)
        {
        var line = cmdList[i];
        if(!Orion.Contains(line,'1060643|1012001|1012000|1063258|1112178'))
            continue;
        var split = Orion.Split(line,'@')[1].trim()
        var price = split.length == 1 ? split + 'p+' : split.length == 13 ? '2p+' : split;
        displayGump.AddText(columnStart,yPos,554,price)
        yPos += heightAdjust
        }
    displayGump.Update();
    }

//1060643 malas
//1012001 felucca
//1012000 trammel
//1063258 tokuno islands
//1112178 ter mur
function InputSearch()
    {
    for(var i=0;i<mainSearch.length;i++)
        {
        var search = mainSearch[i]
        VSButtonPress(search[0],search[1])
        }
    }

function SearchByMods(mods)
    {
    if(!Orion.GumpExists('generic','0x000F3EC8'))
        {
        Orion.WaitContextMenuID('0x0373C887', 1016);
        Orion.RequestContextMenu('0x0373C887');
        Orion.Wait(500);
        }
    VSButtonPress('Clear')
    for(var i=0;i<mods.length;i++)
        {
        var search = mods[i]
        if(search[0])
            VSButtonPress(search[0],search[1])
        }
    }

function VSSearchTargetJewel()
    {
    Orion.WaitForAddObject('myTarget');
    var obj = Orion.FindObject('myTarget');
    var parse = parseJewelryProperties(obj.Properties())
    for(mod in parse)
        {
        VSButtonPress(mod,parse[mod])
        }
    }

function VSSearchTargetJewel()
    {
    Orion.WaitForAddObject('myTarget');
    var obj = Orion.FindObject('myTarget');
    var parse = parseJewelryProperties(obj.Properties())
    for(mod in parse)
        {
        VSButtonPress(mod,parse[mod])
        }
    }

function VSSearchTargetArmor()
    {
    Orion.WaitForAddObject('myTarget');
    var obj = Orion.FindObject('myTarget');
    var parse = parseArmorProperties(obj.Properties())
    for(mod in parse)
        {
        VSButtonPress(mod,parse[mod])
        }
    }

function VSSearchTargetWeapon()
    {
    Orion.WaitForAddObject('myTarget');
    var obj = Orion.FindObject('myTarget');
    var parse = parseWeaponProperties(obj.Properties())
    for(mod in parse)
        {
        VSButtonPress(mod,parse[mod])
        }
    }

function parseProperties(itemProperties)
    {
    var targetMods = 
        {
        NightSight:true,EnhancePotions:true,LowerRequirements:true,Luck:true,ReflectPhysicalDamage:true,SelfRepair:true,DamageIncrease:true,
        DefenseChanceIncrease:true,HitChanceIncrease:true,SwingSpeedIncrease:true,SoulCharge:true,UseBestWeaponSkill:true,ReactiveParalyze:true,
        AssassinHoned:true,SearingWeapon:true,BloodDrinker:true,BattleLust:true,Balanced:true,Focus:true,FireEater:true,ColdEater:true,
        PoisonEater:true,EnergyEater:true,KineticEater:true,DamageEater:true,FireResonance:true,ColdResonance:true,PoisonResonance:true,
        EnergyResonance:true,KineticResonance:true,SpellDamageIncrease:true,CastingFocus:true,FasterCastRecovery:true,FasterCasting:true,
        LowerManaCost:true,LowerReagentCost:true,MageWeapon:true,MageArmor:true,SpellChanneling:true,PhysicalDamage:true,ColdDamage:true,
        FireDamage:true,PoisonDamage:true,EnergyDamage:true,HitDispel:true,HitFireball:true,HitHarm:true,HitCurse:true,HitLifeLeech:true,
        HitLightning:true,Velocity:true,HitLowerAttack:true,HitLowerDefense:true,HitMagicArrow:true,HitManaLeech:true,HitStaminaLeech:true,
        HitFatigue:true,HitManaDrain:true,SplinteringWeapon:true,Bane:true,HitColdArea:true,HitEnergyArea:true,HitFireArea:true,
        HitPhysicalArea:true,HitPoisonArea:true,ColdResist:true,EnergyResist:true,FireResist:true,PhysicalResist:true,PoisonResist:true,
        StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,HitPointsIncrease:true,StaminaIncrease:true,ManaIncrease:true,
        HitPointRegeneration:true,StaminaRegeneration:true,ManaRegeneration:true,ReptileSlayer:true,DragonSlayer:true,LizardmanSlayer:true,
        OphidianSlayer:true,SnakeSlayer:true,ArachnidSlayer:true,ScorpionSlayer:true,SpiderSlayer:true,TerathanSlayer:true,RepondSlayer:true,
        BatSlayer:true,BearSlayer:true,BeetleSlayer:true,BirdSlayer:true,BovineSlayer:true,FlameSlayer:true,GoblinSlayer:true,IceSlayer:true,
        MageSlayer:true,OgreSlayer:true,OrcSlayer:true,TrollSlayer:true,VerminSlayer:true,UndeadSlayer:true,WolfSlayer:true,DemonSlayer:true,
        GargoyleSlayer:true,FeySlayer:true,ElementalSlayer:true,AirElementalSlayer:true,BloodElementalSlayer:true,EarthElementalSlayer:true,
        FireElementalSlayer:true,PoisonElementalSlayer:true,SnowElementalSlayer:true,WaterElementalSlayer:true,Swordsmanship:true,Fencing:true,
        MaceFighting:true,Magery:true,Musicianship:true,Wrestling:true,Tactics:true,AnimalTaming:true,Provocation:true,SpiritSpeak:true,
        Stealth:true,Parrying:true,Meditation:true,AnimalLore:true,Discordance:true,Focus:true,Stealing:true,Anatomy:true,EvalIntelligence:true,
        Veterinary:true,Necromancy:true,Bushido:true,Mysticism:true,Healing:true,ResistingSpells:true,Peacemaking:true,Archery:true,Chivalry:true,
        Ninjitsu:true,Throwing:true,Lumberjacking:true,Snooping:true,Mining:true
        }
    var lines = itemProperties.split("\n");
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
                modsObj[modName] = modValue;
                }
            }
        });
    return modsObj;
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
                    DebugLoot('Faster Casting: 1');
                    }
                }
            if(targetMods[modName] || (modName == 'Durability' && Orion.Contains(line,'%')))
                {
                var modValue = parseInt(modMatch[2]) || 1;
                DebugLoot(modName + ': ' + modValue);
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
                DebugLoot(modName + ': ' + modValue);
                propertiesObj[modName] = modValue;
                }
            }
        });
    return propertiesObj;
    }


function VSButtonPress(buttonName,inputField)
    {
    var selection = vsSelections[buttonName];
    if(!selection)
        return Orion.CharPrint(self,1159,'Error Finding Selection: ' + buttonName);
	var gump = Orion.GetGump('any','0x000F3EC8');
    var endTime = Orion.Now() + 3000;
    while(!gump)
        {
        if(Orion.Now() > endTime)
            return Orion.CharPrint(self,1159,'Error Catching Gump')
        Orion.Wait(500);
        gump = Orion.GetGump('any','0x000F3EC8');
        }
    var gumpHook = Orion.CreateGumpHook(selection[0]);
    if(inputField)
        gumpHook.AddEntry(selection[1], inputField);
    gump.Select(gumpHook);
    Orion.Wait(400);
    }

var vsSelections = {
    //Miscellaneous
    "Name":['1','1'],
    "Clear":['2','2'],
    "ExcludeitemsonFelucca":["100"],
    "GargoylesOnly":["101"],
    "NotGargoylesOnly":["102"],
    "ElvesOnly":["103"],
    "NotElvesOnly":["104"],
    "FactionItem":["105"],
    "PromotionalToken":["106"],
    "NightSight":["107"],
    "Cursed":["108"],
    "NotCursed":["109"],
    "CannotBeRepaired":["110"],
    "NotCannotBeRepaired":["111"],
    "Brittle":["112"],
    "NotBrittle":["113"],
    "Antique":["114"],
    "NotAntique":["115"],
    "EnhancePotions":["116","33"],
    "LowerRequirements":["117","34"],
    "Luck":["118","35"],
    "ReflectPhysicalDamage":["119","36"],
    "SelfRepair":["120","37"],
    "ArtifactRarity":["121","38"],

    //Equipment
    "Footwear/Talons":["50"],
    "Pants/LegArmor":["51"],
    "Shirt":["52"],
    "Hat/HeadArmor":["53"],
    "Hand/KiltArmor":["54"],
    "Ring":["55"],
    "Talisman":["56"],
    "Necklace/NeckArmor":["57"],
    "Apron/Belt":["58"],
    "ChestArmor":["59"],
    "Bracelet":["60"],
    "Surcoat/Tunic/Sash":["61"],
    "Earrings/GargishGlasses":["62"],
    "ArmArmor":["63"],
    "Cloak/Quiver/WingArmor":["64"],
    "Dress/Robe":["65"],
    "Skirt":["66"],

    //Combat
    "DamageIncrease":["67","10"],
    "DefenseChanceIncrease":["68","11"],
    "HitChanceIncrease":["69","12"],
    "SwingSpeedIncrease":["70","13"],
    "SoulCharge":["71","14"],
    "UseBestWeaponSkill":["72"],
    "ReactiveParalyze":["73"],
    "AssassinHoned":["74"],
    "SearingWeapon":["75"],
    "BloodDrinker":["76"],
    "BattleLust":["77"],
    "Balanced":["78"],
    "Focus":["79"],
    "FireEater":["80","15"],
    "ColdEater":["81","16"],
    "PoisonEater":["82","17"],
    "EnergyEater":["83","18"],
    "KineticEater":["84","19"],
    "DamageEater":["85","20"],

    //Casting
    "FireResonance":["86","21"],
    "ColdResonance":["87","22"],
    "PoisonResonance":["88","23"],
    "EnergyResonance":["89","24"],
    "KineticResonance":["90","25"],
    "SpellDamageIncrease":["91","26"],
    "CastingFocus":["92","27"],
    "FasterCastRecovery":["93","28"],
    "FasterCasting":["94","29"],
    "LowerManaCost":["95","30"],
    "LowerReagentCost":["96","31"],
    "MageWeapon":["97","32"],
    "MageArmor":["98"],
    "SpellChanneling":["99"],

    //DamageType
    "PhysicalDamage":["122","39"],
    "ColdDamage":["123","40"],
    "FireDamage":["124","41"],
    "PoisonDamage":["125","42"],
    "EnergyDamage":["126","43"],

    //HitSpell
    "HitDispel":["127","44"],
    "HitFireball":["128","45"],
    "HitHarm":["129","46"],
    "HitCurse":["130","47"],
    "HitLifeLeech":["131","48"],
    "HitLightning":["132","49"],
    "Velocity":["133","50"],
    "HitLowerAttack":["134","51"],
    "HitLowerDefense":["135","52"],
    "HitMagicArrow":["136","53"],
    "HitManaLeech":["137","54"],
    "HitStaminaLeech":["138","55"],
    "HitFatigue":["139","56"],
    "HitManaDrain":["140","57"],
    "SplinteringWeapon":["141","58"],
    "Bane":["142"],

    //HitArea
    "HitColdArea":["143","59"],
    "HitEnergyArea":["144","60"],
    "HitFireArea":["145","61"],
    "HitPhysicalArea":["146","62"],
    "HitPoisonArea":["147","63"],

    //Resists
    "ColdResist":["184","64"],
    "EnergyResist":["185","65"],
    "FireResist":["186","66"],
    "PhysicalResist":["187","67"],
    "PoisonResist":["188","68"],

    //Stats
    "StrengthBonus":["189","69"],
    "DexterityBonus":["190","70"],
    "IntelligenceBonus":["191","71"],
    "HitPointsIncrease":["192","72"],
    "StaminaIncrease":["193","73"],
    "ManaIncrease":["194","74"],
    "HitPointRegeneration":["195","75"],
    "StaminaRegeneration":["196","76"],
    "ManaRegeneration":["197","77"],

    //Arachnid/ReptileSlayers
    "ReptileSlayer":["148"],
    "DragonSlayer":["149"],
    "LizardmanSlayer":["150"],
    "OphidianSlayer":["151"],
    "SnakeSlayer":["152"],
    "ArachnidSlayer":["153"],
    "ScorpionSlayer":["154"],
    "SpiderSlayer":["155"],
    "TerathanSlayer":["156"],

    //Repond/UndeadSlayers
    "RepondSlayer":["157"],
    "BatSlayer":["158"],
    "BearSlayer":["159"],
    "BeetleSlayer":["160"],
    "BirdSlayer":["161"],
    "BovineSlayer":["162"],
    "FlameSlayer":["163"],
    "GoblinSlayer":["164"],
    "IceSlayer":["165"],
    "MageSlayer":["166"],
    "OgreSlayer":["167"],
    "OrcSlayer":["168"],
    "TrollSlayer":["169"],
    "VerminSlayer":["170"],
    "UndeadSlayer":["171"],
    "WolfSlayer":["172"],

    //Demon/Fey/ElementalSlayers
    "DemonSlayer":["173"],
    "GargoyleSlayer":["174"],
    "FeySlayer":["175"],
    "ElementalSlayer":["176"],
    "AirElementalSlayer":["177"],
    "BloodElementalSlayer":["178"],
    "EarthElementalSlayer":["179"],
    "FireElementalSlayer":["180"],
    "PoisonElementalSlayer":["181"],
    "SnowElementalSlayer":["182"],
    "WaterElementalSlayer":["183"],

    //RequiredSkill
    "Swordsmanship":["198"],
    "MaceFighting":["199"],
    "Fencing":["200"],
    "Archery":["201"],
    "Throwing":["202"],

    //SkillGroup1
    "Swordsmanship":["203","78"],
    "Fencing":["204","79"],
    "MaceFighting":["205","80"],
    "Magery":["206","81"],
    "Musicianship":["207","82"],

    //SkillGroup2
    "Wrestling":["208","83"],
    "Tactics":["209","84"],
    "AnimalTaming":["210","85"],
    "Provocation":["211","86"],
    "SpiritSpeak":["212","87"],

    //SkillGroup3
    "Stealth":["213","88"],
    "Parrying":["214","89"],
    "Meditation":["215","90"],
    "AnimalLore":["216","91"],
    "Discordance":["217","92"],
    "Focus":["218","93"],

    //SkillGroup4
    "Stealing":["219","94"],
    "Anatomy":["220","95"],
    "EvalIntelligence":["221","96"],
    "Veterinary":["222","97"],
    "Necromancy":["223","98"],
    "Bushido":["224","99"],
    "Mysticism":["225","100"],

    //SkillGroup5
    "Healing":["226","101"],
    "ResistingSpells":["227","102"],
    "Peacemaking":["228","103"],
    "Archery":["229","104"],
    "Chivalry":["230","105"],
    "Ninjitsu":["231","106"],
    "Throwing":["232","107"],

    //SkillGroup6
    "Lumberjacking":["233","108"],
    "Snooping":["234","109"],
    "Mining":["235","110"],

    //SortResults
    "Price:LowtoHigh":["236"],
    "Price:HightoLow":["237"],

    //AuctionItem
    "NonAuctionItem":["238"],
    "AuctionItem":["239"],
 }

 
