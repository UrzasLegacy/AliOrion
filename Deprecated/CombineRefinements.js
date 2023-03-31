/*
Combine All Refinements
Written by Ali
January 16, 2023

Call Variants:
    CombineAllRefinements();
Arguments:
    N/A
Result:
    Does not return a value
*/

function CombineAllRefinements()
    {
    var amalgamator = Orion.FindType('0x9966','0x0480')[0];
    if(!amalgamator)
        return Orion.CharPrint(self,1159,'No empty amalgamator in backpack! Halting...');
    var upgradeAmount = {'Defense': 2,'Protection': 3,'Hardening': 4,'Fortification': 5}
    var refinements = [['0x4CD9', 'Scour'],['0x142B', 'Cure'],['0x2D61', 'Varnish'],['0x142A', 'Wash'],['0x4CDA', 'Gloss'],['0x4CD8', 'Polish']]
    var armors = ['Platemail','Chainmail','Ringmail','Dragon','Platemail Samurai','Gargish Platemail','Gargish Stone','Woodland','Bone','Hide','Studded Leather','Studded Samurai']
    var levels = ['Defense','Protection','Hardening','Fortification']
    Orion.CharPrint(self,1159,'Target container full of refinements');
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container',container))
        {
        Orion.UseObject(container);
        Orion.Wait(1300);
        }
    for(var r=0;r<refinements.length;r++) 
        {
        var refinement = refinements[r];
        for(var a=0;a<armors.length;a++)
            {
            var armor = armors[a];
            for(var l=0;l<levels.length;l++) 
                {
                var level = levels[l];
                var amount = upgradeAmount[level];
                var items = Orion.FindType(refinement[0],any,container).filter(function(item)
                    {
                    var parse = ParseRefinement(item);
                    return parse['level'] == level && parse['armor'] == armor;
                    });
                while(items.length >= amount)
                    {
                    Orion.CharPrint(self,1159, 'Combining ' + amount + ' ' + refinement[1] + ' of ' + level + ': ' + armor)
                    if(!Combine(items,amount))
                        return Orion.CharPrint(self,1159,'Empty amalgamator missing! Halting...');
                    var resultItem = Orion.FindType(refinement)[0];
                    while(resultItem)
                        {
                        Orion.MoveItem(resultItem,0,container)
                        Orion.Wait(1300);
                        resultItem = Orion.FindType(refinement)[0];
                        }
                    items = Orion.FindType(refinement[0],any,container).filter(function(item)
                        {
                        var parse = ParseRefinement(item);
                        return parse['level'] == level && parse['armor'] == armor;
                        });
                    }
                }
            }
        }
    }

function Combine(items,amount)
    {
    var amalgamator = Orion.FindType('0x9966','0x0480')[0];
    if(!amalgamator)
        return false;
    var backpackSerial = Orion.GetSerial(backpack);
    for(var i=0;i<amount;i++)
        {
        while(Orion.GetContainer(items[i]) != backpackSerial)
            {
            Orion.MoveItem(items[i]);
            Orion.Wait(1300);
            }
        while(ParseAmalgamator(amalgamator).fulfilled == i)
            {
            Orion.UseObject(amalgamator);
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(items[i]);
            Orion.Wait(1300);
            }
        }
    return true;
    }

function ParseRefinement(itemSerial)
    {
    var itemObj = Orion.FindObject(itemSerial);
    var itemProps = itemObj.Properties();
    var itemInfo = itemProps.match(/(\w+) Of (\w+)[\w\/\:\n\r<>\s]+Armor Type: ([\w ]+)\nBonus Type: (\w+)/) || [];
    if(!itemInfo[0])
        return false;
    var type = itemInfo[1];
    var level = itemInfo[2];
    var armor = itemInfo[3];
    var bonus = itemInfo[4];
    return {'type': type,'level': level,'armor': armor,'bonus': bonus};
    }

function ParseAmalgamator(itemSerial)
    {
    var itemObj = Orion.FindObject(itemSerial);
    if(itemObj.Color() == '0x0480') //empty amalgamator
        return {'fulfilled': 0, 'requested': 0};
    var itemProps = itemObj.Properties();
    var itemInfo = itemProps.match(/(\w+) Of (\w+)[\w\/\:\n\r<>\s]+Armor Type: ([\w ]+)\nBonus Type: (\w+)\nCurrent Status : (\d+)\/(\d)/) || [];
    if(!itemInfo[0])
        return false;
    var type = itemInfo[1];
    var level = itemInfo[2];
    var armor = itemInfo[3];
    var bonus = itemInfo[4];
    var fulfilled = itemInfo[5];
    var requested = itemInfo[6];
    return {'type': type,'level': level,'armor': armor,'bonus': bonus, 'fulfilled': fulfilled, 'requested': requested,'empty': false};
    }