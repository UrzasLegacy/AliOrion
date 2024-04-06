function JewelryScoreSearchGump()
    {
    Orion.Exec('JewelryScoreSearch',true)
    }
function JewelryScoreSearchGump()
    {
    Orion.Exec('JewelryScoreSearch',true)
    }
//#include AliLooterPlugin.js
function JewelryScoreSearch()
	{
    var templates = [
        'MysticWrestle',
        'NecroWrestle',
        'MysticBalakai',
        'NecroBalakai',
        'Disarmcher',
        'GlendaBasher',
        'DSer',
        'HSBokMage',
        'LSBokMage',
        'HSBokMystic',
        'LSBokMystic',
        'FoNMage',
        'NoxMage',
        'HolyFister',
        'ArcherFister',
        'any'
    ];
    var title = "Ali Jewelry Score Search"
    var gump = Orion.CreateCustomGump(10421); 
	var rowStart = 40;
	var columnStart = 25;
    var height = 175;
    var width = 325;

    gump.Clear();
    gump.SetCallback('JewelryScoreCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Assets
	//gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
	//gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    var xPos = columnStart;
    var yPos = rowStart;
    var heightAdjust = 25;

    gump.AddText(xPos,yPos,554,'Template Name');
    gump.AddText(xPos + 180,yPos,554,'Score');
    gump.AddText(xPos + 240,yPos,554,'Skill');

    var responseCode = 1;
    yPos += heightAdjust;
    gump.AddComboBox(responseCode, xPos, yPos, '0x0BB8', 0, '0x0BB8', 150, -3,templates.length + 1);
    for(var j=0;j<templates.length;j++)
        gump.AddComboBoxText(templates[j],0,Shared.GetVar('Template Name',undefined) == templates[j] ? 1 : 0,115,'left');

    gump.AddResizepic(xPos + 180, yPos , '0x0BB8', 28, 19);
    gump.AddTextEntry(2, xPos + 180 + 3, yPos, 0, Shared.GetVar('Score',''), 28, 20);
    gump.AddTooltip('Minimum Score');

    gump.AddResizepic(xPos + 240, yPos , '0x0BB8', 28, 19);
    gump.AddTextEntry(3, xPos + 240 + 3, yPos, 0, Shared.GetVar('Minimum Skill Amount',''), 28, 20);
    gump.AddTooltip('Minimum Skill Amount');
    yPos += heightAdjust * 2;

    gump.AddButton(1000, xPos + 143, yPos, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddText(xPos + 143 + 11,yPos,554,'Search');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddButton(1001, xPos + 73, yPos, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Clear the search menu');
    gump.AddText(xPos + 73 + 17,yPos,554,'Clear');
    gump.AddTooltip('Clear the search menu');
    gump.AddButton(1002, xPos + 270, yPos + 25, '22153', '22154', '22155', '0x0000');
    gump.AddTooltip('Calculate Score');

    gump.Update();
	}

function JewelryScoreCallback(_) 
	{
    var templates = [
        'MysticWrestle',
        'NecroWrestle',
        'MysticBalakai',
        'NecroBalakai',
        'Disarmcher',
        'GlendaBasher',
        'DSer',
        'HSBokMage',
        'LSBokMage',
        'HSBokMystic',
        'LSBokMystic',
        'FoNMage',
        'NoxMage',
        'HolyFister',
        'ArcherFister',
        'any'
    ];
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0)
        return;
    else if(code == 1000) //search
        {
        var combo = CustomGumpResponse.ComboBox(1);
        var textEntry = CustomGumpResponse.Text(2);
        var textEntry2 = CustomGumpResponse.Text(3) || '0';
        if(combo == -1)
            return Orion.CharPrint(self,1159,'Choose a template');
        if(!textEntry)
            return Orion.CharPrint(self,1159,'Enter a minimum score');
        value = Shared.AddVar('Template Name',templates[combo]);
        value = Shared.AddVar('Score',textEntry);
        value = Shared.AddVar('Minimum Skill Amount',textEntry2);   
        HighlightJewelryScore(templates[combo],textEntry,textEntry2);
        }
    else if(code == 1001)
        {
        Shared.ClearVars();
        }
    else if(code == 1002)
        {
        Orion.Exec('CalculateScore',true);
        }
    Orion.Wait(50);
    JewelryScoreSearch();
	}

function CalculateScore()
    {
    Orion.WaitForAddObject('myTarget');
    var exampleString = Orion.FindObject('myTarget').Properties();
    //var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +20\nEvaluateIntelligence +20\nMysticism +20\nResisting Spells +20\nAntique\nDefense Chance Increase 20%\nFaster Cast Recovery 4\nEnhance Potions 35%\nMana Regeneration 4\nDurability 255 / 255\nMajor Artifact";
    //var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +100\nMana Regeneration 4\nFaster Cast Recovery 4\nEnhance Potions 35%\nDurability 255 / 255\nMajor Artifact";
    //Debug(exampleString + '\n')
    //var exampleString = "Ring\nWeight: 1 Stone\nNinjitsu +20\nNecromancy +15\nSpirit Speak +15\nAntique\nDexterity Bonus 8\nNight Sight\nHit Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nMajor Artifact"

    //var exampleString = "Resisting Spells +15\nEvaluate Intelligence +15\nMagery +20\nStrength Bonus 8\nDexterity Bonus 8\nEnhance Potions 25%\nDefense Chance Increase 15%\nDamage Increase 25%\n"

    var parse = parseJewelryProperties(exampleString);
    var values = calculateTemplateValues(parse);
    //TextWindow.Open();
    //TextWindow.Clear();
    var outMsg = '';
    values.forEach(function(value)
        {
        outMsg += value[1] + '(' + value[2] + '): ' + value[0] + '\n';
        });
    //TextWindow.Print(outMsg)
    Orion.Print(outMsg)
    }

function HighlightJewelryScore(templateString,score,skillInt)
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
        Orion.FindTypeEx('0x1F06|0x1086|0x108A|0x1F09',any,container.Serial(),'item', 'finddistance', '', true).filter(function(item)
            {
            Orion.TestItemColor(item.Serial(), item.Color())
            totalItems++;
            var parse = parseJewelryProperties(item.Properties());
            var value = calculateTemplateValues(parse).filter(function(template)
                {
                if(templateString == 'any')
                    return true;
                return template[0] == templateString;  
                })[0];
            return value[1] && value[1] >= score && value[2] >= skillInt;
            }).forEach(function(keeper)
                {
                totalHighlighted++;
                Orion.TestItemColor(keeper.Serial(), 1152)
                });
        }
    Orion.Print('Total Highlighted: ' + totalHighlighted + '\nTotal Searched: ' + totalItems + '\nRatio: ' + (totalHighlighted / totalItems).toFixed(2) + '\nScan Time: ' + (Orion.Now() - startTime) + 'ms')
    }

function HighlightContainersMultiColor()
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
    var fullItems = [];
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i]
        if(container == 'ground')
            containerSerial = 'ground';
        else
            containerSerial = container.Serial();
        if(!container)
            Orion.Print(container)
        Orion.FindTypeEx('0x1F06|0x1086|0x108A|0x1F09',any,containerSerial,'item', 'finddistance', '', true).forEach(function(item)
            {
            var itemSerial = item.Serial();
            Orion.TestItemColor(itemSerial, item.Color())
            totalItems++;
            var parse = parseJewelryProperties(item.Properties());
            var value = calculateTemplateValues(parse)[0];
            if(value[1] && value[1] >= 60 && value[2] >= 0)
                fullItems.push([itemSerial,value[1],value[2]])
            })
        }
    var colors = {
        yellow: 1174,
        blue: 1152,
        purple: 1283,
        pink: 2735,
        green: 1969,
        gray: 2029,
        white: 2050, //2728
    }
    fullItems.forEach(function(keeper)
        {
        totalHighlighted++;
        if(keeper[1] >= 140)
            var color = colors.blue;
        else if(keeper[1] >= 120)
            var color = colors.yellow
        else if(keeper[1] >= 100)
            var color = colors.purple
        else if(keeper[1] >= 80)
            var color = colors.green
        else if(keeper[1] >= 60)
            var color = colors.white
        Orion.TestItemColor(keeper[0], color)
        });
    Orion.Print('Total Highlighted: ' + totalHighlighted + '\nTotal Searched: ' + totalItems + '\nRatio: ' + (totalHighlighted / totalItems).toFixed(2) + '\nScan Time: ' + (Orion.Now() - startTime) + 'ms')
    }

function calculateTemplateValues(mods)
    {
    var templates = 
        {
        //Caster
        MysticWrestle: {
            'Mysticism': .83,'Focus': .83,'Magery': .83,'EvaluateIntelligence': .83,'Wrestling': .83,'Parrying': .63,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.67,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':6,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.2,'DamageIncrease':0,'LowerReagentCost':.5
            },
        NecroWrestle: {
            'Necromancy': .83,'SpiritSpeak': .83,'Magery': .83,'EvaluateIntelligence': .83,'Wrestling': .83,'Parrying': .63,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.67,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':6,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.2,'DamageIncrease':0,'LowerReagentCost':.5
            },
        MysticBalakai: {
            'Mysticism': .83,'Focus': .83,'Magery': .83,'EvaluateIntelligence': .83,'Bushido': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':0,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':0,'DamageIncrease':0,'LowerReagentCost':.5
            },
        NecroBalakai: {
            'Necromancy': .83,'SpiritSpeak': .83,'Magery': .83,'EvaluateIntelligence': .83,'Bushido': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':0,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':0,'DamageIncrease':0,'LowerReagentCost':.5
            },
        //Dexxer
        Disarmcher: {
            'Archery':.83,'Swordsmanship':.67,'Parrying':.83,'ResistingSpells':.83,'Anatomy':.83,'Tactics':.83,'Healing':.83,
            'StrengthBonus':.88,'DexterityBonus':.88,'IntelligenceBonus':.88,'ManaIncrease':.8,'StaminaIncrease':2,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':.67,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2.5,'DamageIncrease':.5,'LowerReagentCost':0
            },
        GlendaBasher: {
            'MaceFighting': .83,'Tactics': .83,'Anatomy': .83,'Healing': .83,'Ninjitsu': .83,'Bushido': .83,'Parrying': .53,'ResistingSpells': .83,
            'StrengthBonus':.88,'DexterityBonus':.88,'IntelligenceBonus':.88,'ManaIncrease':.8,'StaminaIncrease':1.2,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':0,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2.5,'DamageIncrease':.5,'LowerReagentCost':0
            },
        DSer: {
            'Swordsmanship':.83,'Ninjitsu':.83,'Tactics':.53,'Parrying':.83,'ResistingSpells':.83,
            'StrengthBonus':.88,'DexterityBonus':.88,'IntelligenceBonus':.88,'ManaIncrease':.8,'StaminaIncrease':1.2,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':0,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2.5,'DamageIncrease':.5,'LowerReagentCost':0
            },
        //Hybrid
        HSBokMage: {
            'Swordsmanship': .53,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2,'DamageIncrease':.24,'LowerReagentCost':.5
            },
        LSBokMage: {
            'Swordsmanship': .83,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.67,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':.53,
            'SwingSpeedIncrease':2,'DamageIncrease':.32,'LowerReagentCost':.5
            },
        HSBokMystic: {
            'Swordsmanship': .53,'Mysticism': .53,'Focus': .83,'Parrying': .83,'ResistingSpells': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2,'DamageIncrease':.24,'LowerReagentCost':.5
            },
        LSBokMystic: {
            'Swordsmanship': .83,'Mysticism': .83,'Focus': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.67,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':.53,
            'SwingSpeedIncrease':2,'DamageIncrease':.32,'LowerReagentCost':.5
            },
        FoNMage: {
            'MaceFighting': .83,'Tactics': .83,'Anatomy': .83,'Magery':.83,'EvaluateIntelligence':.83,'Parrying': .83,'ResistingSpells': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2.5,'DamageIncrease':.5,'LowerReagentCost':.5
            },
        NoxMage: {
            'Swordsmanship': .53,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':10,'LowerManaCost':1.25,'SpellDamageIncrease':.53,
            'SwingSpeedIncrease':2,'DamageIncrease':.32,'LowerReagentCost':.5
            },
        HolyFister: {
            'Swordsmanship': .6,'Tactics':.4,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1.25,'SpellDamageIncrease':.53,
            'SwingSpeedIncrease':2,'DamageIncrease':.5,'LowerReagentCost':0
            },
        ArcherFister: {
            'Archery': .6,'Tactics':.83,'Anatomy':.83,'Parrying': .83,'ResistingSpells': .83,
            'StrengthBonus':.75,'DexterityBonus':.75,'IntelligenceBonus':1,'ManaIncrease':.8,'StaminaIncrease':.8,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.83,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1.25,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':2.5,'DamageIncrease':.5,'LowerReagentCost':0
            },
        }
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        Throwing:true,Healing:true, Archery:true,
        }
    var templateValues = [];
    
    for(var templateName in templates)
        {
        var template = templates[templateName];
        var totalValue = 0;
        var totalSkills = 0;
        // Calculate the individual mod values
        for(var mod in mods)
            {
            if(template.hasOwnProperty(mod))
                {
                var modValue = mods[mod] * template[mod];
                totalValue += modValue;
                if(skillMods.hasOwnProperty(mod))
                    {
                    totalValue += modValue;
                    totalSkills += mods[mod];
                    }
                //Debug('Mod: ' + mod + ', Value: ' + modValue + ', Total Value: ' + totalValue);
                }
            }
        templateValues.push([templateName,+totalValue.toFixed(),totalSkills])
        }

    return templateValues.sort(function(a,b)
        {
        return b[1] - a[1];
        });
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
                //Debug(modName + ': ' + modValue);
                modsObj[modName] = modValue;
                }
            }
        });
    return modsObj;
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

function Debug(msg)
    {
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print(msg);
    }

var modValueRanges =
    { //[minimum,cap,overcap] OR [minimum,cap] OR [one possible value]
    Magery: [5,15,20],
    MaceFighting: [5,15,20],
    Fencing: [5,15,20],
    Musicianship: [5,15,20],
    Swordsmanship: [5,15,20],
    AnimalTaming: [5,15,20],
    SpiritSpeak: [5,15,20],
    Tactics: [5,15,20],
    Wrestling: [5,15,20],
    AnimalLore: [5,15,20],
    Discordance: [5,15,20],
    Focus: [5,15,20],
    Parrying: [5,15,20],
    Stealth: [5,15,20],
    Anatomy: [5,15,20],
    Bushido: [5,15,20],
    EvaluateIntelligence: [5,15,20],
    Mysticism: [5,15,20],
    Necromancy: [5,15,20],
    Archery: [5,15,20],
    Chivalry: [5,15,20],
    Healing: [5,15,20],
    Ninjitsu: [5,15,20],
    ResistingSpells: [5,15,20],
    ManaIncrease: [1,5],
    StaminaIncrease: [1,5],
    StrengthBonus: [1,8,10],
    DexterityBonus: [1,8,10],
    IntelligenceBonus: [1,8,10],
    ManaRegeneration: [1,3,44],
    EnhancePotions: [15,25,35],
    HitChanceIncrease: [5,15,20],
    DefenseChanceIncrease: [5,15,20],
    SwingSpeedIncrease: [5,10],
    DamageIncrease: [15,25,35],
    SpellDamageIncrease: [8,15,18],
    FasterCastRecovery: [1,3,4],
    FasterCasting: [1,1,1],
    LowerManaCost: [1,8,10],
    LowerReagentCost: [10,20,25],
    PhysicalResist: [5,15,20],
    FireResist: [5,15,20],
    ColdResist: [5,15,20],
    PoisonResist: [5,15,20],
    EnergyResist: [5,15,20],
    };
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
function DropDraggedHere() //v3
    {
    if(!Orion.Dragging())
        return Orion.CharPrint(self,1159,'Drag an item onto your cursor first');
    var range = 2;
    var endTimeMain = Orion.Now() + 6000;
    var hash = {};
    while(Orion.Dragging() && Orion.Now() < endTimeMain)
        {
        //Orion.ResetSearchArea(); //uncomment this IF it won't mess with your other search areas
        var firstPassTiles = Orion.GetTilesInRect('land',Player.X()-range,Player.Y()-range,Player.X()+range,Player.Y()+range)
            .filter(function(tile)
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                var tileZ = tile.Z();
                if(tileZ != Player.Z())
                    return false;
                var tileHash = "" + tileX + tileY + tileZ;
                if(hash[tileHash])
                    return false;
                var mobCheck = Orion.FindType(any,any,ground,'live','xyz: ' + tileX + ',' + tileY).length == 0;
                var itemCheck = Orion.FindType(any,any,ground,'item','xyz: ' + tileX + ',' + tileY).length <= 5;
                return mobCheck && itemCheck;
                });
        if(!firstPassTiles.length)
            Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
        var validTiles = [];
        for(var i=0;i<firstPassTiles.length;i++)
            {
            var tile = firstPassTiles[i];
            //if(Orion.GetPathArray(tile.X(),tile.Y(),Player.Z(),0,1,1,0)[0])
            if(Orion.CanWalk('1', tile.X(), tile.Y(), tile.Z()))
                {
                validTiles.push(tile);
                if(validTiles.length >= 4)
                    break;
                }
            }
        var endTimeSub = Orion.Now() + 2000;
        while(validTiles.length && Orion.Dragging() && Orion.Now() < endTimeSub)
            {
            var validTile = validTiles.shift();
            var validTileX = validTile.X();
            var validTileY = validTile.Y();
            var validTileZ = validTile.Z();
            Orion.AddFakeMapObject(0, '0x051A', 1152, validTileX, validTileY, validTileZ);
            Orion.DropDraggedItem(ground, validTileX, validTileY, validTileZ);
            Orion.Wait(500);
            }
        if(validTile && Orion.Dragging())
            hash['' + validTileX + validTileY + validTileZ] = true;
        }
    if(!validTiles.length)
        Orion.CharPrint(self, 1159, 'No valid tiles nearby!');
    }