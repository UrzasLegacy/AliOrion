function testCall()
    {
    TextWindow.Open();
    TextWindow.Clear();
    Orion.WaitForAddObject('myTarget');
    var a = Orion.FindObject('myTarget');
    var startTime = Orion.Now();
    Orion.Print(UnravelEval(a.Properties()))
    Orion.Print('Processing time = ' + (Orion.Now()-startTime) + 'ms');
    }

function UnravelEval(itemProperties)
	{
    var propertiesList = 
        [
            ['Physical Resist', 6],
            ['Fire Resist', 6],
            ['Cold Resist', 6],
            ['Poison Resist', 6],
            ['Energy Resist', 6],
            ['Damage Eater', 15],
            ['Kinetic Eater', 6],
            ['Fire Eater', 6],
            ['Cold Eater', 6],
            ['Poison Eater', 6],
            ['Energy Eater', 6],
            ['Enhance Potions', 4],
            ['Damage Increase', 2],
            ['Swing Speed Increase', 3.6],
            ['Defense Chance Increase', 7.33],
            ['Hit Chance Increase', 8.66],
            ['Strength Bonus', 13.75],
            ['Dexterity Bonus', 13.75],
            ['Intelligence Bonus', 13.75],
            ['Hit Point Increase', 22],
            ['Stamina Increase', 13.75],
            ['Mana Increase', 13.75],
            ['Hit Point Regeneration', 50],
            ['Stamina Regeneration', 33.33],
            ['Mana Regeneration', 50],
            ['Casting Focus', 40], //25
            ['Faster Cast Recovery', 40],
            ['Faster Casting', 140],
            ['Lower Mana Cost', 13.75],
            ['Lower Reagent Cost', 5],
            ['Spell Damage Increase', 8.33],
            ['Luck', 1],
            ['Reflect Physical Damage', 6.66],
            ['Night Sight', 100],
            ['Spell Channeling', 100],
            ['Lower Requirements', 1],
            ['Durability', 1],
            ['Reactive Paralyze', 140],
            ['Battle Lust', 100],
            ['Blood Drinker', 100],
            ['Splintering Weapon', 7.5],
            ['Mage Weapon', 10],
            ['Use Best Weapon Skill', 150],
            ['Hit Poison Area', 2],
            ['Hit Physical Area', 2],
            ['Hit Fire Area', 2],
            ['Hit Energy Area', 2],
            ['Hit Cold Area', 2],
            ['Hit Stamina Leech', 2],
            ['Hit Mana Leech', 2.2],
            ['Hit Life Leech', 2.2],
            ['Hit Magic Arrow', 2.4],
            ['Hit Lower Defense', 2.6],
            ['Hit Lower Attack', 2.2],
            ['Hit Lightning', 2.8],
            ['Hit Harm', 2.2],
            ['Hit Fireball', 2.8],
            ['Hit Dispel', 2],
            ['Hit Mana Drain', 2.5],
            ['Hit Fatigue', 2.5],
            ['Velocity', 2.8],
            ['[\\w ]+Slayer', 110],
            ['Balanced', 100],
            ['[\\w ]+\\+', 9],
        ]
    var weight = 0;
    var outMsg = '';
    var numMods = 0;
    var duraModifier = 1;
    var durability = +((itemProperties.match(/Durability (\d+)/) || [])[1] || 0)
    if(durability && durability < 50)
        duraModifier = 1 - ((50 - durability) * .02)
    outMsg += itemProperties + '\n\n';
    var itemPropLines = itemProperties.split(/\r?\n/);
    for(var i=0;i<itemPropLines.length;i++)
        {
        var prop = itemPropLines[i];
        if(Orion.Contains(prop, 'Durability'))
            {
            if(!Orion.Contains(prop, '+'))
                continue;
            }
        for(var ii=0;ii<propertiesList.length;ii++)
            {
            var propPair = propertiesList[ii];
            var regex = "^" + propPair[0] + "\\s?(-?\\+?\\d+)?";
            var outcome = prop.match(regex);
            if(outcome)
                {
                if(outcome[1] == undefined)
                    outcome[1] = 1;
                numMods++;
                var weightMultiplier = propPair[1];
                if(Orion.Contains(propPair[0], 'Resist') && !Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', item.Graphic()))
                    {
                    if(+outcome[1] < 6)
                        {
                        numMods--;
                        continue;
                        }
                    outcome[1] = Math.max(+outcome[1] - 5, 0);
                    }
                else if(Orion.Contains('Balanced|Damage Increase|Spell Channeling|Faster Casting|Mage Weapon|[\\w ]+Slayer|[\\w ]+\\+', propPair[0]))
                    {
                    if(propPair[0] == 'Damage Increase')
                        {
                        if(Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', item.Graphic()))
                            weightMultiplier = 4;
                        }
                    else if(propPair[0] == 'Spell Channeling')
                        {
                        if(!Orion.Contains(itemProperties, 'Faster Casting -1'))
                            weightMultiplier = 240;
                        }
                    else if(propPair[0] == '[\\w ]+\\+' && Orion.Contains(prop, 'Durability'))
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Faster Casting' && outcome[1] == '-1')
                        {
                        numMods--;
                        continue;
                        }
                    else if(propPair[0] == 'Mage Weapon')
                        {
                        outcome[1] = +outcome[1] + 30;
                        }
                    else if(propPair[0] == '[\\w ]+Slayer')
                        {
                        Orion.Print(propPair[0])
                        if(Orion.Contains(prop, 'Undead|Reptile|Repond|Fey|Elemental|Demon|Arachnid'))
                            weightMultiplier = 140;
                        }
                    else if(propPair[0] == 'Balanced')
                        {
                        if(Orion.Contains(itemProperties, 'Skill Required: Archery'))
                            weightMultiplier = 150;
                        }
                    }
                var add = +outcome[1] * weightMultiplier
                weight += add;
                outMsg += propPair[0] + ': ' + outcome[1] + '*' + weightMultiplier + ' = ' + add + '\n';
                }
            }
        }
    outMsg += '\nNumber of Mods: ' + numMods;
    if(numMods > 5)
        {
        weight = ((weight/numMods)*5 + 50) * duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\n((Total Weight \\ ' + numMods + ') * 5) * ' + duraModifier + ' = ' + weightRounded;
        }
    else
        {
        weight = (weight + 50)*duraModifier;
        var weightRounded = Math.floor(weight);
        outMsg += '\nTotal Weight * ' + duraModifier + ': ' + weightRounded;
        }
    TextWindow.Print(outMsg);
    return weightRounded;
    }

/* 'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [
if(Orion.Contains(itemProps, 'Skill Required: Throwing'))
    return Orion.CharPrint(self,1159,'Throwing weapons currently unsupported! Boo gargoyles');//return throwingMod;
else if(Orion.Contains(itemProps, 'One-handed Weapon'))
    return weapon1hMod;
else if(Orion.Contains(itemProps, 'Skill Required: Archery'))
    return bowMod;
else if(Orion.Contains(itemProps, 'Two-handed Weapon'))
    return weapon2hMod;
else if(Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', itemObj.Graphic()))
    return jewelryMod;
else if(Orion.Contains('0x1B72|0x1BC3|0x1BC4|0x1B7B|0x1B73|0x1B74|0x1B77|0x1B78|0x1B75|0x1B76|0x1BC5|0x1B79|0x1B7A', itemObj.Graphic()))
    return shieldMod;
else if(Orion.Contains(itemProps, ' Resist '))
    return armorMod;
else
    return Orion.CharPrint(self,1159,'Error in Type initImbueMods')
*/