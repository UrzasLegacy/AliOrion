function SuitReader()
    {
    Orion.CharPrint(self, 1159, 'Select player or container to evaluate:');
    Orion.WaitForAddObject('myTarget');
    var propertiesList = SuitReaderCall('myTarget');
    if(!propertiesList)
        return;
    var y = 15;
    var yOffset = 15;
    var x1 = 15;
    var x2 = 145;
    var x3 = 100;
    var x4 = 185;
    var xOffset = 95;
    var xOffset2 = 45;
    var gump = Orion.CreateCustomGump(12001);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, 275, 21*yOffset+20);
    gump.AddText(x1, y, "0", 'Physical Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[0][1]);
    gump.AddText(x2, y, "0", 'Kinetic Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[6][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Fire Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[1][1]);
    gump.AddText(x2, y, "0", 'Fire Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[7][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Cold Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[2][1]);
    gump.AddText(x2, y, "0", 'Cold Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[8][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Poison Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[3][1]);
    gump.AddText(x2, y, "0", 'Poison Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[9][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Energy Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[4][1]);
    gump.AddText(x2, y, "0", 'Energy Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[10][1]);
    y+=yOffset;
    gump.AddText(x2, y, "0", 'Damage Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[5][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Enhanced Pots:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[11][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'DI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[12][1]);
    gump.AddText(x3, y, "0", 'SSI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[13][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'DCI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[14][1]);
    gump.AddText(x3, y, "0", 'HCI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[15][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Str+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[16][1]);
    gump.AddText(x3, y, "0", 'HP+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[19][1]);
    gump.AddText(x4, y, "0", 'HPR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[22][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Dex+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[17][1]);
    gump.AddText(x3, y, "0", 'Stam+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[20][1]);
    gump.AddText(x4, y, "0", 'SR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[23][1]); 
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Int+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[18][1]); 
    gump.AddText(x3, y, "0", 'Mana+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[21][1]); 
    gump.AddText(x4, y, "0", 'MR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[24][1]); 
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'CF:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[25][1]);
    gump.AddText(x3, y, "0", 'FCR:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[26][1]);
    gump.AddText(x4, y, "0", 'FC:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[27][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'LMC:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[28][1]);
    gump.AddText(x3, y, "0", 'LRC:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[29][1]);
    gump.AddText(x4, y, "0", 'SDI:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[30][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Luck:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[31][1]);
    gump.AddText(x3, y, "0", 'RPD:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[32][1]);
    gump.Update();
    }

function SuitReaderCall(playerOrContainerSerial)
	{
    var propertiesList = 
    [
        ['Physical Resist', 0], //0
        ['Fire Resist', 0],
        ['Cold Resist', 0],
        ['Poison Resist', 0],
        ['Energy Resist', 0],
        ['Damage Eater', 0], //5
        ['Kinetic Eater', 0],
        ['Fire Eater', 0],
        ['Cold Eater', 0],
        ['Poison Eater', 0],
        ['Energy Eater', 0], //10
        ['Enhance Potions', 0],
        ['Damage Increase', 0],
        ['Swing Speed Increase', 0],
        ['Defense Chance Increase', 0],
        ['Hit Chance Increase', 0], //15
        ['Strength Bonus', 0],
        ['Dexterity Bonus', 0],
        ['Intelligence Bonus', 0],
        ['Hit Point Increase', 0],
        ['Stamina Increase', 0], //20
        ['Mana Increase', 0],
        ['Hit Point Regeneration', 0],
        ['Stamina Regeneration', 0],
        ['Mana Regeneration', 0],
        ['Casting Focus', 0], //25
        ['Faster Cast Recovery', 0],
        ['Faster Casting', 0],
        ['Lower Mana Cost', 0],
        ['Lower Reagent Cost', 0],
        ['Spell Damage Increase', 0], //30
        ['Luck', 0],
        ['Reflect Physical Damage', 0]
    ]
    var selected = Orion.FindObject(playerOrContainerSerial);
    if(selected && selected.Mobile())
        {
        Orion.WaitContextMenuID(selected.Serial(), 520);
        Orion.RequestContextMenu(selected.Serial());
        var startTime = Orion.Now();
        while(Orion.Now() < startTime + 2000 && !Orion.GumpExists('paperdoll', selected.Serial()))
            Orion.Wait(100);
        if(!Orion.GumpExists('paperdoll', selected.Serial()))
            return Orion.CharPrint(self, 1159, "Target paperdoll didn't open");
        Orion.Wait(100);
        for(var i=1;i<25;i++)
            {
            var item = Orion.ObjAtLayer(i, selected.Serial());
            if(!item)
                continue;
            var itemProps = item.Properties().split(/\r?\n/);
            itemProps.forEach(function(prop)
                {
                if(!Orion.Contains(prop, '(total)'))
                    {
                    propertiesList.forEach(function(propPair)
                        {
                        var regex = "^" + propPair[0] + "\\s+(-?\\d+)?";
                        var outcome = prop.match(regex);
                        if(outcome)
                            propertiesList[propertiesList.indexOf(propPair)][1] += parseInt(outcome[1]);
                        });
                    }
                });
            }
        }
    else if(selected)
        {
        if(!Orion.OpenContainer(selected.Serial()))
            return Orion.CharPrint(self, 1159, "Target container didn't open");
        Orion.Wait(100);
        var items = Orion.FindTypeEx(any,any,selected.Serial());
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            if(!item)
                continue;
            var itemProps = item.Properties().split(/\r?\n/);
            itemProps.forEach(function(prop)
                {
                if(!Orion.Contains(prop, '(total)'))
                    {
                    propertiesList.forEach(function(propPair)
                        {
                        var regex = "^" + propPair[0] + "\\s?(-?\\d+)?";
                        var outcome = prop.match(regex);
                        if(outcome)
                            propertiesList[propertiesList.indexOf(propPair)][1] += parseInt(outcome[1]);
                        });
                    }
                });
            }
        }
    else
        return Orion.CharPrint(self, 1159, 'Target invalid');
    return propertiesList;
    }