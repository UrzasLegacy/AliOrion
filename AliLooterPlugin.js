var lootItems = {
    '0x400B': true, //shame crystals
    '0x0F87': true, //lucky coin
    //'0x0EED': true, //gold
}
var keepTrainingArmor = true;

var debug = false;



var serialIndex = 1;
var ModularGumpButtons = //[ xsize, ysize, CallBackID, 'displayText', 'functionName', optional: [arguments] ]
    [
        [ [100, 30, serialIndex++, "AliLootHouse", 'AliLootHouse'], [100, 30, serialIndex++, "PutAwayLoot", 'PutAwayLoot'] ],
        [],
        [ [100, 30, serialIndex++, 'HighlightKeepers', 'HighlightKeepers'], [100, 30, serialIndex++, 'HighlightTrash', 'HighlightTrash'], [100, 30, serialIndex++, "TestKeeper", 'EvalKeep'],],
        [ [100, 30, serialIndex++, 'HighlightArea', 'HighlightAreaKeepers'] ],
        [ [100, 30, serialIndex++, "MoveKeepers", 'MoveKeepers'], [100, 30, serialIndex++, "MoveTrash", 'MoveTrash'], [100, 30, serialIndex++, "MoveAll", "MoveAll"] ],
        [],
        [ [100, 30, serialIndex++, "ScoreSearch", 'JewelryScoreSearch'], [100, 30, serialIndex++, "ModSearch", 'JewelryModSearch'], [100, 30, serialIndex++, "MultiColorScore", "MultiColorScore"] ],
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
        Throwing:true,Archery:true,Healing:true,
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

function AliLootUW()  //v2
    {
    var corpse = Orion.FindTypeEx('0x2006', any, ground, 10).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'An Evil One');
        })[0];
    if(!corpse)
        return Orion.CharPrint(self,1159,'No corpse found');
    var corpseSerial = corpse.Serial();
    var instanceSerials = Orion.FindType(any,any,corpseSerial);
    var endTime = Orion.Now() + 10000;
    do
        {
        Orion.UseObject(corpseSerial);
        Orion.Wait(1300);
        instanceSerials = Orion.FindType(any,any,corpseSerial);
        } while(instanceSerials.length == 0 && Orion.Now() < endTime && !Orion.GumpExists('container',corpseSerial))
    if(instanceSerials.length)
        {
        var test = Orion.FindObject(instanceSerials[0]);
        if(test && test.Graphic() !== '0x2006')
            {
            Orion.CharPrint(self,1159,'Corpse is public');
            var corpseInstanceSerial = corpseSerial;
            }
        else
            {
            var corpseInstanceSerial = instanceSerials[instanceSerials.length - 1];
            }
        Debug('instanceMatch: lastcontainer = ' + Orion.GetSerial(lastcontainer) + ' corpseInstance = ' + corpseInstanceSerial)
        }
    else
        return Orion.CharPrint(self,1159,'Corpse is empty')
    var backpackSerial = Orion.GetSerial(backpack);
    for(var attempts=0;attempts<2;attempts++)
        {
        var itemsInCorpse = Orion.FindTypeEx(any,any,corpseInstanceSerial);
        for(var i=0;i<itemsInCorpse.length;i++)
            {
            var item = itemsInCorpse[i];
            if(!item)
                continue;
            while(corpse.Distance() > 2)
                {
                Orion.WalkTo(corpse.X(),corpse.Y())
                Orion.Wait(250);
                }
            var itemSerial = item.Serial();
            if(AliKeep(itemSerial))
                {
                var endTime = Orion.Now() + 5000;
                while(item.Container() !== backpackSerial)
                    {
                    if(Orion.Now() < endTime)
                        DebugLoot("Item wasn't picked up!\n" + item.Properties())
                    Orion.MoveItem(itemSerial);
                    Orion.Wait(1300);
                    }
                }
            Orion.Wait(10);	
            }
        }	
    }

function AliLootHouse()
    {
    Orion.ClearFakeMapObjects();
    Orion.ResetSearchArea();
    Orion.IgnoreReset();
    var unsortedBook = Orion.FindTypeEx('0x0FF1|0x0FF2',any,ground,'item',24).filter(function(item)
        {
        return Orion.Contains(item.Properties(),'Unsorted');
        })[0];
    if(!unsortedBook)
        return Orion.CharPrint(self,1159,'Unsorted Book Not Found!');
    var unsortedX = unsortedBook.X();
    var unsortedY = unsortedBook.Y();
    var range = 2;
    var unsortedX1 = unsortedX - range;
    var unsortedY1 = unsortedY - range;
    var unsortedX2 = unsortedX + range;
    var unsortedY2 = unsortedY + range;
    
    Orion.SetSearchArea(unsortedX1,unsortedY1,unsortedX2,unsortedY2);
    var unsortedContainer = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
        {
        var properties = item.Properties();
        return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 0/') === -1;
        }).sort(function(a,b)
            {
            var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
            var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
            return aContents - bContents;
            })[0];
    Orion.ResetSearchArea();
    if(!unsortedContainer)
        return Orion.CharPrint(self,1159,'No Containers to Sort!');
    while(unsortedContainer)
        {
        Orion.ClearFakeMapObjects();
        Orion.GetTilesInRect('land',unsortedX1, unsortedY1, unsortedX2, unsortedY2).forEach(function(tile,ind)
            {
            Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            });
        Orion.AddFakeMapObject(10000, '0x051A', 1152, unsortedX, unsortedY, Player.Z());
        var fullCheck = false;
        var unsortedContainerSerial = unsortedContainer.Serial();
        while(Orion.GetDistance(unsortedContainerSerial) > 2)
            {
            Orion.WalkTo(unsortedContainer.X(),unsortedContainer.Y());
            Orion.Wait(100);
            }
        VerifyOpenContainer(unsortedContainerSerial);
        var items = Orion.FindType(any,any,unsortedContainerSerial).filter(function(item)
            {
            return AliKeep(item);
            });
        while(items.length)
            {
            for(var i=0;i<items.length;i++)
                {
                Orion.MoveItem(items[i]);
                Orion.Wait(1300);
                var fullCheck = ((Orion.ObjAtLayer('backpack').Properties().match(/Contents: (\d+)\//) || [])[1] || 125) == 125
                    || (Player.Weight() > Player.MaxWeight() - 20);
                if(fullCheck)
                    break;
                }
            if(fullCheck)
                break;
            items = Orion.FindType(any,any,unsortedContainerSerial).filter(function(item)
                {
                return AliKeep(item);
                });
            }
        if(!fullCheck)
            {
            MoveTrashContainer(unsortedContainerSerial);
            Orion.SetSearchArea(unsortedX1,unsortedY1,unsortedX2,unsortedY2);
            unsortedContainer = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                var properties = item.Properties();
                return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 0/') === -1;
                }).sort(function(a,b)
                    {
                    var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                    var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                    return aContents - bContents;
                    })[0];
            Orion.ResetSearchArea();
            }
        else
            {
            PutAwayLoot();
            }
        Orion.Wait(500);
        }
    PutAwayLoot();
    }

function HighlightPartiallyFilledBoxes()
    {
    Orion.FindTypeEx(any,any,ground,'item',3).forEach(function(item)
        {
        var props = item.Properties();
        if(props.indexOf('Contents: ') > -1)
            {
            if(props.indexOf('Contents: 125/') > -1)
                Orion.TestItemColor(item.Serial(), 1161)
            else if(props.indexOf('Contents: 0/') == -1)
                Orion.TestItemColor(item.Serial(), 1152)
            else
                Orion.TestItemColor(item.Serial(), item.Color())
            }
        })
    }

function PutAwayLoot()
    {
    Orion.ResetSearchArea();
    var playerBackpack = Orion.GetSerial(backpack);
    var items = Orion.FindTypeEx(any).filter(function(item)
        {
        return AliKeep(item.Serial());
        })
    if(items.length === 0)
        return Orion.CharPrint(self,1159,'No items to put away!');
    var jewelry = [];
    var weapons = [];
    var armor = [];
    var shields = [];
    for(var i=0;i<items.length;i++)
        {
        var item = items[i];
        var props = item.Properties();
        if(Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', item.Graphic()))
            {
            jewelry.push(item);
            continue;
            }
        if(props.indexOf('Two-handed Weapon') > -1 || props.indexOf('One-handed Weapon') > -1)
            {
            weapons.push(item);
            continue;
            }
        if(props.indexOf("Poison Resist") > -1 && props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1 && props.indexOf("Energy Resist") > -1)
            {
            armor.push(item);
            continue;
            }
        shields.push(item);
        }

    //Put Away Jewels
    PutAwayJewelry(jewelry)

    //Put away armor
    var containerNames = ['Vitality','Haste','Restoration','Misc'];
    var armorArr = [[],[],[],[]]
    for(var i=0;i<armor.length;i++)
        {
        var item = armor[i];
        var itemSerial = item.Serial()
        var result = AliKeep(itemSerial);
        switch(result)
            {
            case 'LRC Vitality Armor':
            case 'LMC Vitality Armor':
                armorArr[0].push(itemSerial);
                break;
            case 'LRC Stamina Armor':
            case 'LMC Stamina Armor':
                armorArr[1].push(itemSerial);
                break;
            case 'LRC Misc Armor':
            case 'LMC Misc Armor':
                armorArr[2].push(itemSerial);
                break;
            case 'LRC Stam/HP Armor':
            case 'LMC Stam/HP Armor':
            case 'Misc HP/Stam Armor':
            case 'Luck Armor':
            case 'Training Armor':
                armorArr[3].push(itemSerial);
                break;
            default:
                break;
            }
        }
    for(var i=0;i<armorArr.length;i++)
        {
        var armorCategoryArr = armorArr[i];
        var armorCategoryName = containerNames[i];
        if(armorCategoryArr.length === 0)
            continue;
        Orion.ResetSearchArea();
        var categoryBook = Orion.FindTypeEx('0x0FF1|0x0FF2',any,ground,'item',24).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Armor ' + armorCategoryName) > -1;
            })[0];
        if(!categoryBook)
            {
            DiscordPush('Category Book Missing: ' + 'Armor ' + armorCategoryName);
            Orion.Terminate('all');
            }
        var categoryX = categoryBook.X();
        var categoryY = categoryBook.Y();
        var sortContainerArmor = Orion.FindTypeEx(any,any,ground,'item','xyz: ' + categoryX + ',' + categoryY).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 125/') === -1;
            }).sort(function(a,b)
                {
                var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                return bContents - aContents;
                })[0];
        if(!sortContainerArmor)
            {
            DiscordPush(Player.Name() + ' - Armor: ' + armorCategoryName + ' Containers Are Full Or Missing!')
            Orion.Terminate('all');
            }
        while(sortContainerArmor.Distance() > 2)
            {
            Orion.WalkTo(sortContainerArmor.X(),sortContainerArmor.Y());
            Orion.Wait(100);
            }
        VerifyOpenContainer(sortContainerArmor.Serial());
        for(var j=0;j<armorCategoryArr.length;j++)
            {
            var armor = armorCategoryArr[j];
            while(Orion.GetContainer(armor) == playerBackpack)
                {
                Orion.MoveItem(armor,0,sortContainerArmor.Serial());
                Orion.Wait(1300);
                }
            if(Orion.Contains(sortContainerArmor.Properties(),'Contents: 125'))
                {
                Orion.CloseGump('container',sortContainerArmor.Serial());
                sortContainerArmor = Orion.FindTypeEx(any,any,ground,'item','xyz: ' + categoryX + ',' + categoryY).filter(function(item)
                    {
                    var properties = item.Properties();
                    return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 125/') === -1;
                    }).sort(function(a,b)
                        {
                        var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                        var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                        return bContents - aContents;
                        })[0];
                if(!sortContainerArmor)
                    {
                    DiscordPush(Player.Name() + ' - Armor: ' + armorCategoryName + ' Containers Are Full Or Missing!')
                    Orion.Terminate('all');
                    }
                while(sortContainerArmor.Distance() > 2)
                    {
                    Orion.WalkTo(sortContainerArmor.X(),sortContainerArmor.Y());
                    Orion.Wait(100);
                    }
                VerifyOpenContainer(sortContainerArmor.Serial());
                }
            }
        }

    //Weapons / Shields
    var weapons = weapons.concat(shields);
    if(weapons.length)
        {    
        Orion.ResetSearchArea();
        var categoryBook = Orion.FindTypeEx('0x0FF1|0x0FF2',any,ground,'item',24).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Weapon') > -1;
            })[0];
        if(!categoryBook)
            {
            DiscordPush('Category Book Missing: ' + 'Weapon');
            Orion.Terminate('all');
            }
        var categoryX = categoryBook.X();
        var categoryY = categoryBook.Y();
        var sortContainerWeapon = Orion.FindTypeEx(any,any,ground,'item','xyz: ' + categoryX + ',' + categoryY).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 125/') === -1;
            }).sort(function(a,b)
                {
                var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                return bContents - aContents;
                })[0];
        if(!sortContainerWeapon)
            {
            DiscordPush(Player.Name() + ' - Weapon Containers Are Full Or Missing!')
            Orion.Terminate('all');
            }
        while(sortContainerWeapon.Distance() > 2)
            {
            Orion.WalkTo(sortContainerWeapon.X(),sortContainerWeapon.Y());
            Orion.Wait(100);
            }
        VerifyOpenContainer(sortContainerWeapon.Serial());
        for(var i=0;i<weapons.length;i++)
            {
            var weapon = weapons[i];
            var weaponSerial = weapon.Serial();
            if(!AliKeep(weaponSerial))
                continue;
            while(Orion.GetContainer(weaponSerial) == playerBackpack)
                {
                Orion.MoveItem(weaponSerial,0,sortContainerWeapon.Serial());
                Orion.Wait(1300);
                }
            if(Orion.Contains(sortContainerWeapon.Properties(),'Contents: 125'))
                {
                Orion.CloseGump('container',sortContainerWeapon.Serial());
                sortContainerWeapon = Orion.FindTypeEx(any,any,ground,'item','xyz: ' + categoryX + ',' + categoryY).filter(function(item)
                    {
                    var properties = item.Properties();
                    return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 125/') === -1;
                    }).sort(function(a,b)
                        {
                        var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                        var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || 125);
                        return bContents - aContents;
                        })[0];
                if(!sortContainerWeapon)
                    {
                    DiscordPush(Player.Name() + ' - Weapon Containers Are Full Or Missing!')
                    Orion.Terminate('all');
                    }
                while(sortContainerWeapon.Distance() > 2)
                    {
                    Orion.WalkTo(sortContainerWeapon.X(),sortContainerWeapon.Y());
                    Orion.Wait(100);
                    }
                VerifyOpenContainer(sortContainerWeapon.Serial());
                }
            }
        }    
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
function DropDraggedToContainer2() //v2
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer2');
	if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer2');
	else
		{
		var lastSerial = Orion.GetSerial('dropContainer2');
		if(Orion.WaitForAddObject('dropContainer2') != 1)
			Orion.AddObject('dropContainer2', lastSerial);
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

function SecureAndCoOwn(itemSerial)
    {
    if(itemSerial === undefined)
        {
        Orion.WaitForAddObject('myTarget');
        var itemSerial = Orion.GetSerial('myTarget');
        }
    var startTime = Orion.Now();
    var target = Orion.FindObject(itemSerial);
    var targetSerial = target.Serial();
    while(true)
        {
        Orion.Say('i wish to secure this');
        if(Orion.WaitForTarget(3000))
            {
            Orion.TargetObject(targetSerial);
            var endTime = Orion.Now() + 4000;
            check = Orion.WaitJournal('Secure!|Locked down!',startTime,endTime,'item',targetSerial);
            if(check)
                {
                startTime = Orion.Now();
                var gump = Orion.GetGump(any, '0x00000295');
                while(!gump)
                    {
                    Orion.WaitContextMenuID(targetSerial, 600);
                    Orion.RequestContextMenu(targetSerial);
                    Orion.Wait(500);
                    gump = Orion.GetGump(any, '0x00000295');
                    }
                gump.Select(Orion.CreateGumpHook(2));
                endTime = Orion.Now() + 4000;
                check = Orion.WaitJournal('New access level set.',startTime,endTime,'sys');
                if(check)
                    break;
                }
            }
        Orion.Wait(100);
        }
    Orion.CharPrint(self,1159,'Secured and Access Set')
    }

function JewelryModSearch() 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliJewelrySavedSearches.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var savedSearches = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        savedSearches = JSON.parse(fileString);
    var skills =
        [
        'Anatomy','AnimalLore','AnimalTaming','Archery','Bushido','Chivalry','EvaluateIntelligence','Fencing','Focus','Healing','MaceFighting',
        'Magery','Mysticism','Necromancy','Ninjitsu','Parrying','ResistingSpells','SpiritSpeak','Stealth','Swordsmanship','Tactics','Throwing','Wrestling',
        'Clear'
        ]
    var mods = 
        [
        'StrengthBonus','DexterityBonus','IntelligenceBonus','ManaIncrease','StaminaIncrease',
        'ManaRegeneration','EnhancePotions','HitChanceIncrease','DefenseChanceIncrease',
        'FasterCastRecovery','FasterCasting','LowerManaCost','SpellDamageIncrease','LowerReagentCost','SwingSpeedIncrease','DamageIncrease',
        'Clear'
        ]

    var title = "Ali Jewelry Search"
    //var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 
	var rowStart = 40;
	var columnStart = 25;
    var height = 650;
    var width = 285;

    gump.Clear();
    gump.SetCallback('JewelryModSearchCallback');
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
    
    var heightAdjust;
    var value;
    var shared;

    heightAdjust = 25;

    for(var i=0;i<8;i++)
        {
        var responseCode = i + 1;
        shared = 'Skill ' + responseCode;
        value = Shared.GetVar(shared,undefined);
        gump.AddText(xPos,yPos,554,shared);
        gump.AddComboBox(responseCode, xPos + 50, yPos, '0x0BB8', 0, '0x0BB8', 150, -3,skills.length);
        for(var j=0;j<skills.length;j++)
            gump.AddComboBoxText(skills[j],0,value == skills[j] ? 1 : 0,115,'left');
        gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 205 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 28, 20);
        gump.AddTooltip('Skill Minimum Value');
        yPos += heightAdjust;
        }
    
    gump.AddText(xPos + 35,yPos,554,'Minimum Total Skill Amount');
    gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
    gump.AddTextEntry(2000, xPos + 205 + 3, yPos, 0, Shared.GetVar('Skill Amount',''), 28, 20);
    gump.AddTooltip('The sum of any combination of the above skills must be at least this amount to pass');
    yPos += heightAdjust * 2;

    for(var i=0;i<8;i++)
        {
        var responseCode = i + 101;
        shared = 'Mod ' + (responseCode - 100);
        value = Shared.GetVar(shared,undefined);
        gump.AddText(xPos,yPos,554,shared);
        gump.AddComboBox(responseCode, xPos + 50, yPos, '0x0BB8', 0, '0x0BB8', 150, -3,mods.length);
        for(var j=0;j<mods.length;j++)
            gump.AddComboBoxText(mods[j],0,value == mods[j] ? 1 : 0,150,'left');
        gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 205 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 28, 20);
        gump.AddTooltip('Mod Minimum Value');
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

    gump.Update();
    
    //Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function JewelryModSearchCallback(_) 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliJewelrySavedSearches.json';
    var skills =
        [
        'Anatomy','AnimalLore','AnimalTaming','Archery','Bushido','Chivalry','EvaluateIntelligence','Fencing','Focus','Healing','MaceFighting',
        'Magery','Mysticism','Necromancy','Ninjitsu','Parrying','ResistingSpells','SpiritSpeak','Stealth','Swordsmanship','Tactics','Throwing','Wrestling',
        'Clear',
        ]
    var mods = 
        [
        'StrengthBonus','DexterityBonus','IntelligenceBonus','ManaIncrease','StaminaIncrease',
        'ManaRegeneration','EnhancePotions','HitChanceIncrease','DefenseChanceIncrease',
        'FasterCastRecovery','FasterCasting','LowerManaCost','SpellDamageIncrease','LowerReagentCost','SwingSpeedIncrease','DamageIncrease',
        'Clear',
        ]
    var code = CustomGumpResponse.ReturnCode();
    //Orion.Print('Code: ' + code)
    if(code == 0)
        return;
    else if(code == 1000)
        {
        var skillObj = {};
        var modObj = {};
        var skillCheck = false;
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 1;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(skills[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Skill ' + responseCode);
                    Shared.RemoveVar('Skill ' + responseCode + ' Value');
                    continue;
                    }
                skillCheck = true;
                Shared.AddVar('Skill ' + responseCode,skills[combo]);
                Shared.AddVar('Skill ' + responseCode + ' Value',textEntry);
                skillObj[skills[combo]] = +textEntry;
                }
            }
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 101;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            //if(i==0) Orion.Print('combo: ' + combo)
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(mods[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Mod ' + (i + 1));
                    Shared.RemoveVar('Mod ' + (i + 1) + ' Value');
                    continue;
                    }
                Shared.AddVar('Mod ' + (i + 1),mods[combo]);
                Shared.AddVar('Mod ' + (i + 1) + ' Value',textEntry);
                modObj[mods[combo]] = +textEntry;
                }
            }
        var skillAmount = CustomGumpResponse.Text(2000) || (skillCheck ? '1' : 0);
        Shared.AddVar('Skill Amount', skillAmount)
        SearchJewelry(+skillAmount,skillObj,modObj)
        //Orion.Print(JSON.stringify(skillObj) + '\n' + JSON.stringify(modObj))
        }
    else if(code == 1001)
        {
        Shared.ClearVars();
        }
    else if(code == 999) //Apply saved search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        
        Shared.ClearVars();
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')

        var searchName = savedSearch[0];
        var skillAmount = savedSearch[1];
        var skillObj = savedSearch[2];
        var modObj = savedSearch[3];
        var i = 1;
        for(prop in skillObj)
            {
            if(i > 9)
                break;
            Shared.AddVar('Skill ' + i,prop);
            Shared.AddVar('Skill ' + i + ' Value',skillObj[prop]);
            i++;
            }
        i = 1;
        for(prop in modObj)
            {
            if(i > 9)
                break;
            Shared.AddVar('Mod ' + i,prop);
            Shared.AddVar('Mod ' + i + ' Value',modObj[prop]);
            i++;
            }
        Shared.AddVar('Skill Amount', skillAmount);
        Shared.AddVar('Save Name',searchName);
        }
    else if(code == 998) //Save Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        var skillObj = {};
        var modObj = {};
        var skillCheck = false;
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 1;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(skills[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Skill ' + responseCode);
                    Shared.RemoveVar('Skill ' + responseCode + ' Value');
                    continue;
                    }
                Shared.AddVar('Skill ' + responseCode,skills[combo]);
                Shared.AddVar('Skill ' + responseCode + ' Value',textEntry);
                skillObj[skills[combo]] = +textEntry;
                }
            }
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 101;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(mods[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Mod ' + (i + 1));
                    Shared.RemoveVar('Mod ' + (i + 1) + ' Value');
                    continue;
                    }
                Shared.AddVar('Mod ' + (i + 1),mods[combo]);
                Shared.AddVar('Mod ' + (i + 1) + ' Value',textEntry);
                modObj[mods[combo]] = +textEntry;
                }
            }
        var skillAmount = CustomGumpResponse.Text(2000) || (skillCheck ? '1' : 0);
        var saveName = CustomGumpResponse.Text(20001)
        if(!saveName)
            return Orion.CharPrint(self,1159,'You must choose a name for the save');
        var overwrite = false;
        for(var i=0;i<savedSearches.length;i++)
            {
            var savedSearch = savedSearches[i];
            if(saveName == savedSearch[0])
                {
                savedSearch[1] = skillAmount;
                savedSearch[2] = skillObj;
                savedSearch[3] = modObj;
                overwrite = true;
                break;
                }
            }
        if(!overwrite)
            {
            savedSearches.push(
                [
                    saveName,
                    skillAmount,
                    skillObj,
                    modObj
                ])
            }
        Shared.AddVar('Skill Amount', skillAmount)
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
    JewelryModSearch();
	}

//Scorer
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
        'SwordsArcherFister',
        'MeleeArcherFister',
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
        'SwordsArcherFister',
        'MeleeArcherFister',
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
        Shared.AddVar('Template Name',templates[combo]);
        Shared.AddVar('Score',textEntry);
        Shared.AddVar('Minimum Skill Amount',textEntry2);   
        HighlightJewelryScore(templates[combo],textEntry,textEntry2);
        }
    else if(code == 1001)
        {
        Shared.ClearVars();
        }
    else if(code == 1002)
        {
        var combo = CustomGumpResponse.ComboBox(1);
        if(combo == -1 || templates[combo] == 'any')
            {
            Shared.AddVar('Template Name','any');
            CalculateScoreCall();
            }
        else
            {
            Shared.AddVar('Template Name',templates[combo]);
            CalculateScoreCall(templates[combo]);
            }
        }
    Orion.Wait(50);
    JewelryScoreSearch();
	}

function CalculateScoreCall(templateName)
    {
    if(!exampleString)
        {
        Orion.WaitForAddObject('myTarget');
        var exampleString = Orion.FindObject('myTarget').Properties();
        }
    var parse = parseJewelryProperties(exampleString);
    var values = calculateTemplateValues(parse,templateName);
    var outMsg = '';
    values.forEach(function(value)
        {
        outMsg += value[1] + '(' + value[2] + '): ' + value[0] + '\n';
        });
    //TextWindow.Print(outMsg)
    Orion.Print(outMsg)
    }

function CalculateScore()
    {
    var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +20\nEvaluateIntelligence +20\nFocus +20\nWrestling +20\nResisting Spells +20\nAntique\nFaster Cast Recovery 4\nEnhance Potions 35%\nMana Regeneration 4\nDurability 255 / 255\nMajor Artifact";
    var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +15\nEvaluateIntelligence +15\nFocus +15\nWrestling +15\nResisting Spells +15\nAntique\nFaster Cast Recovery 3\nEnhance Potions 25%\nMana Regeneration 3\nDurability 255 / 255\nMajor Artifact";
    var template = 'MysticWrestle' || undefined;
    if(!exampleString)
        {
        Orion.WaitForAddObject('myTarget');
        var exampleString = Orion.FindObject('myTarget').Properties();
        }
  //var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +100\nMana Regeneration 4\nFaster Cast Recovery 4\nEnhance Potions 35%\nDurability 255 / 255\nMajor Artifact";
    //DebugLoot(exampleString + '\n')
    //var exampleString = "Ring\nWeight: 1 Stone\nNinjitsu +20\nNecromancy +15\nSpirit Speak +15\nAntique\nDexterity Bonus 8\nNight Sight\nHit Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nMajor Artifact"

    //var exampleString = "Resisting Spells +15\nEvaluate Intelligence +15\nMagery +20\nStrength Bonus 8\nDexterity Bonus 8\nEnhance Potions 25%\nDefense Chance Increase 15%\nDamage Increase 25%\n"

    var parse = parseJewelryProperties(exampleString);
    var values = calculateTemplateValues(parse,template);
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

function MultiColorScore()
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
    Orion.FindTypeEx('0x1F06|0x1086|0x108A|0x1F09',any,ground,'item', 24).forEach(function(item)
        {
        var itemSerial = item.Serial();
        Orion.TestItemColor(itemSerial, item.Color())
        totalItems++;
        var parse = parseJewelryProperties(item.Properties());
        var value = calculateTemplateValues(parse)[0];
        if(value[1] && value[1] >= 60 && value[2] >= 0)
            fullItems.push([itemSerial,value[1],value[2]])
        })
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
        var color;
        if(keeper[1] >= 100)
            color = colors.blue;
        else if(keeper[1] >= 90)
            color = colors.yellow
        else if(keeper[1] >= 80)
            color = colors.purple
        else if(keeper[1] >= 70)
            color = colors.green
        else if(keeper[1] >= 60)
            color = colors.white
        if(color)
            {
            totalHighlighted++;
            Orion.TestItemColor(keeper[0], color)
            }
        });
    Orion.Print('Total Highlighted: ' + totalHighlighted + '\nTotal Searched: ' + totalItems + '\nRatio: ' + (totalHighlighted / totalItems).toFixed(2) + '\nScan Time: ' + (Orion.Now() - startTime) + 'ms')
    }



// var modValueRanges =
//     { //[minimum,cap,overcap] OR [minimum,cap] OR [one possible value]
//     Magery: [5,15,20],
//     MaceFighting: [5,15,20],
//     Fencing: [5,15,20],
//     Musicianship: [5,15,20],
//     Swordsmanship: [5,15,20],
//     AnimalTaming: [5,15,20],
//     SpiritSpeak: [5,15,20],
//     Tactics: [5,15,20],
//     Wrestling: [5,15,20],
//     AnimalLore: [5,15,20],
//     Discordance: [5,15,20],
//     Focus: [5,15,20],
//     Parrying: [5,15,20],
//     Stealth: [5,15,20],
//     Anatomy: [5,15,20],
//     Bushido: [5,15,20],
//     EvaluateIntelligence: [5,15,20],
//     Mysticism: [5,15,20],
//     Necromancy: [5,15,20],
//     Archery: [5,15,20],
//     Chivalry: [5,15,20],
//     Healing: [5,15,20],
//     Ninjitsu: [5,15,20],
//     ResistingSpells: [5,15,20],
//     ManaIncrease: [1,5],
//     StaminaIncrease: [1,5],
//     StrengthBonus: [1,8,10],
//     DexterityBonus: [1,8,10],
//     IntelligenceBonus: [1,8,10],
//     ManaRegeneration: [1,3,44],
//     EnhancePotions: [15,25,35],
//     HitChanceIncrease: [5,15,20],
//     DefenseChanceIncrease: [5,15,20],
//     SwingSpeedIncrease: [5,10],
//     DamageIncrease: [15,25,35],
//     SpellDamageIncrease: [8,15,18],
//     FasterCastRecovery: [1,3,4],
//     FasterCasting: [1,1,1],
//     LowerManaCost: [1,8,10],
//     LowerReagentCost: [10,20,25],
//     PhysicalResist: [5,15,20],
//     FireResist: [5,15,20],
//     ColdResist: [5,15,20],
//     PoisonResist: [5,15,20],
//     EnergyResist: [5,15,20],
//     };

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

function AliKeep(itemSerial)
    {
	var item = Orion.FindObject(itemSerial);
	if(!item)
        return false;
	//loot by graphic
    DebugLoot('Item: ' + item.Name())
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
        DebugLoot('Trash: !isJewelry && !is2hWeapon && !is1hWeapon && !isArmor && not luck shield:\n' + props)
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
    DebugLoot('Trash: Failed all other checks');
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
            DebugLoot('Trash: Excluded Two Handed Weapon');
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
            DebugLoot('Trash: Excluded One Handed Weapon');
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
        {
        numProps--;
        }
    var isImbuable = numProps <= 4;
    var isEleDamage = props.indexOf('Physical Damage 100%') == -1
    if(isBokuto && isSplinter)
        {
        if(isAntique && !isOverCapSplinter) //Reject any boks that aren't overcap splinter
            {
            DebugLoot('Trash: Antique Bok w/o Overcap Splinter')
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
        DebugLoot('Trash: Splinter bok');
        return false;		
        }
    var isAIWep = props.indexOf("Bladed Staff") > -1 || props.indexOf("Longsword") > 1 || props.indexOf("Broadsword") > 1 || props.indexOf("Hatchet") > -1 || props.indexOf("Katana") > -1 || props.indexOf("Leafblade") > -1 || props.indexOf("War Axe") > -1 || props.indexOf("Hammer Pick") > -1;
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
            DebugLoot('Trash: Splinter non-bok isn\'t clean');
            return false;
            }
        if(isSlowWep && !wepObj['SwingSpeedIncrease'])
            {
            DebugLoot('Trash: Slow weapon without SSI');
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
        DebugLoot('Trash: Splinter weapon failed all previous checks');
        return false;		
        }
    if(isAIWep)
        {
        var isHitFatigue = wepObj['HitFatigue'] >= 50;
        var isHitManaDrain = wepObj['HitManaDrain'] >= 50;
        var isHitStaminaLeech = wepObj['HitStaminaLeech'] >= 40;
        var isHitManaLeech = wepObj['HitManaLeech'] >= 70;
        //var isHitLifeLeech = wepObj['HitLifeLeech'] >= 70;
        if(isHitFatigue && isHitManaDrain && isHitStaminaLeech && isHitManaLeech)// && isHitLifeLeech)
            return 'PvM Hit Drainer';
        }
    DebugLoot('Trash: Non-splinter weapon failed all previous checks');
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
    var isClean = props.indexOf('Antique') === -1 && props.indexOf('Imbued') === -1;
    var targetModCount = isClean ? 6 : 7;
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        Throwing:true,Healing:true, Archery:true,Meditation:true,
        }
    // var statMods = 
    //     {
    //     StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,
    //     StaminaIncrease:true,ManaIncrease:true,
    //     }
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
        HitChanceIncrease:true,DefenseChanceIncrease:true,LowerManaCost:true,ManaIncrease:true,Meditation:true,
        MaceFighting:true,Fencing:true,Swordsmanship:true,SwingSpeedIncrease:true,DamageIncrease:true,
        FasterCasting:true,Tactics:true,StaminaIncrease:true,Necromancy:true,FasterCastRecovery:true,
        AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,Chivalry:true,Stealth:true,
        }
    if(propertiesObj['Chivalry'] == 20 && propertiesObj['FasterCasting'] && propertiesObj['FasterCastRecovery'])
        return '1/3 +20 Chiv Samp Jewel';
    if(propertiesObj['Magery'] == 20 && propertiesObj['FasterCasting'] && propertiesObj['FasterCastRecovery'])
        return '1/3 +20 Magery Jewel';
    var score = calculateTemplateValues(propertiesObj)[0][1];
    Orion.Print('score: ' + score)
    if(score < 50)
        {
        DebugLoot('Trash: score < 50');
        return false;
        }
    var overcapInt = CountJewelryOvercaps(propertiesObj);
    var skillInt = CountMatchingMods(propertiesObj, skillMods);
    if(skillInt == 0)
        {
        if(overcapInt == 0 && (!propertiesObj['EnhancePotions'] || !propertiesObj['DefenseChanceIncrease'] || !propertiesObj['ManaRegeneration']))
            {
            if(propertiesObj['StrengthBonus'] == 10 && propertiesObj['DexterityBonus'] == 10 && propertiesObj['IntelligenceBonus'] == 10)
                return 'Str10/Dex10/Int10';
            if(score >= 80)
                return '0skill,0overcaps,missing either EP,DCI or MR, but score >= 80'
            DebugLoot('Trash: Zero skills, zero overcaps, and missing either EP, DCI or MR');
            return false;
            }
        else if(overcapInt >= 3)
            return 'No Skill, 3+ Overcaps';
        targetModCount++; //at this point, if its zero skill and failed the previous two checks, it must be 8 good mods to pass instead of 7
        }
    if(skillInt == 1 && !propertiesObj['EnhancePotions'] && !propertiesObj['DefenseChanceIncrease'] && !propertiesObj['HitChanceIncrease'] && !propertiesObj['FasterCastRecovery'])
        {
        if(overcapInt < 3 && score < 80)
            {
            DebugLoot('Trash: One skill mod and must have at least one of EP/DCI/HCI/FCR/3+overcaps');
            return false;
            }
        }
    if(skillInt >= 4)
        return '4+ skill mods';
    // var statInt = CountMatchingMods(propertiesObj,statMods);
    // if(skillInt >= 2 && statInt >= 3)
    //     {
    //     DebugLoot('Trash: 2+ skill mods and 3+ stat mods');
    //     return false;
    //     }
    var mageInt = CountMatchingMods(propertiesObj, mageMods);
    var dexxerInt = CountMatchingMods(propertiesObj, dexxerMods);
    var hybridInt = CountMatchingMods(propertiesObj, hybridMods);
    DebugLoot('mageInt: ' + mageInt + '\ndexxerInt: ' + dexxerInt + '\nhybridInt: ' + hybridInt + '\nskillInt: ' + skillInt + '\nclean: ' + isClean);
    if(mageInt + hybridInt >= targetModCount || dexxerInt + hybridInt >= targetModCount)
        return '7 or 8 good mods (or 6 if clean)';
    if(propertiesObj['StrengthBonus'] == 10 && propertiesObj['DexterityBonus'] == 10 && propertiesObj['IntelligenceBonus'] == 10)
        return 'Str10/Dex10/Int10';
    if(score && score >= 70)
        {
        return 'Failed all previous checks, but score >= 70'
        }
    DebugLoot('Trash: Jewelry failed all previous checks and score < 70');
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
        DebugLoot('Failed: Is Not Armor!');
        return false
        }
    if(props.indexOf('Antique') > -1)
        {
        DebugLoot('Trash: Antique Armor');
        return false;
        }
    if(props.indexOf("Fortified") > -1 && props.indexOf("Of Defense") > -1)
        {
        DebugLoot('Trash: Fortified Armor of Defense');
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
        '0x13CD':'0','0x2786':'0','0x13D3':'0','0x13CC':'0','0x2781':'1','0x140F':'1','0x140E':'1','0x1F0B':'1','0x1F0C':'3','0x141B':'0',
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
        DebugLoot('intrinsicLMC check defaulted on graphic: ' + itemGraphic + '\n' + props);
        Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
        var intrinsicLMC = '3';
        }
    else
        var intrinsicLMC = intrinsicLMCArr[0];
        
    DebugLoot('\ngoodEater: ' + goodEater + '\ntotalStats: ' + totalStats + '\nMR: ' + mr + '\nHPR: ' + hpr + '\nisArtifact: ' + isArtifact + '\nintrinsicLMC: ' + intrinsicLMC);

    if(hpi >= 3)
        { //treat as Vitality
        switch(intrinsicLMC)
            {
            default: //default to best case scenario
                DebugLoot('hpi intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = lrc >= 20 ? 0 : 4;
                var mrThreshold = 2;
                var hprThreshold = 0;
                var statThreshold = goodEater ? 3 : 5;
                break;
            case '1':
                var lrcThreshold = 15;
                var lmcThreshold = 6;
                var mrThreshold = 3;
                var hprThreshold = 2;
                var statThreshold = goodEater ? 10 : 13;
                break;
            case '0':
                var lrcThreshold = 20;
                var lmcThreshold = 6;
                var mrThreshold = 3;
                var statThreshold = goodEater ? 10 : 13;
                break;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold)
            return 'LRC Vitality Armor';
        if(lmc >= lmcThreshold && mr >= mrThreshold && totalStats >= statThreshold)
            return 'LMC Vitality Armor';
        if(isArtifact && stam && mr && lmc)
            return 'Misc HP/Stam Armor';
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
                DebugLoot('stam intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list');
            case '1':
                var lrcThreshold = 10;
                var lmcThreshold = 6;
                var statThreshold = 25;  
                break
            case '0':
                if(!hpi)
                    {
                    DebugLoot('Trash: Leather Stam Armor');
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
                return 'LRC Stam/HP Armor';
            return 'LRC Stamina Armor';
            }
        if(lmc >= lmcThreshold && totalStats >= statThreshold)
            {
            if(hpi)
                return 'LMC Stam/HP Armor';
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
                DebugLoot('General intrinsicLMC defaulted on graphic: ' + itemGraphic + '\n' + props);
                Orion.Print('Add ' + itemGraphic + ' to intrinsicLMC list')
            case '3':
                var lrcThreshold = 10;
                var lmcThreshold = 3;
                var mrThreshold = 3;
                var hprThreshold = 2;
                var statThreshold = goodEater ? 2 : 7;
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
                var statThreshold = goodEater ? 10 : 13;
                break;
            }
        if(lrc >= lrcThreshold && lmc >= lmcThreshold && mr >= mrThreshold && hpr >= hprThreshold && totalStats >= statThreshold)
            return 'LRC Misc Armor';
        if(lmc >= lmcThreshold && mr >= mrThreshold && hpr >= hprThreshold &&  totalStats >= statThreshold)
            return 'LMC Misc Armor';
        }
    var strengthRequirement = +((props.match(/Strength Requirement (\d+)/) || [])[1] || 95);
    if(keepTrainingArmor && lrc >= 20 && lmc >= 8 && mr == 4 && strengthRequirement <= 50)
        return 'Training Armor';
    DebugLoot('Trash: Armor failed all previous checks');
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
                DebugLoot(modName + ': ' + modValue);
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

function DebugLoot(msg)
    {
    if(!debug)
        return;
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    Orion.Print(msg);
    TextWindow.Print('DEBUG:' + Orion.Time() + ': ' + msg);
    }

function DiscordPush(message)
	{
	var bot = Orion.RegRead('discordConfig') || SetDiscordRegistryEntry();
	Orion.HttpPost(bot, "content=" + message);
	}

function SetDiscordRegistryEntry()
    {
    var discordConfig = "https://discordapp.com/api/webhooks/" + profile.discordHook + '/' + profile.discordKey;
    var registryName = 'discordConfig';
    Orion.RegWrite(registryName, discordConfig);
    return discordConfig;
    }

function MoveTrashContainer(serial)
    {
    Orion.ResetSearchArea();
    Orion.ClearFakeMapObjects();
    if(serial === undefined)
        {
        Orion.CharPrint(self,1159,'Target trash container');
        Orion.WaitForAddObject('myTarget');
        serial = Orion.GetSerial('myTarget');
        }
    var trashBook = Orion.FindTypeEx('0x0FF1|0x0FF2',any,ground,'item',24).filter(function(item)
        {
        return Orion.Contains(item.Properties(),'Trash');
        })[0];
    if(!trashBook)
        return Orion.CharPrint(self,1159,'Trash Book Not Found!');
    var trashX = trashBook.X();
    var trashY = trashBook.Y();
    var range = 1;
    var trashX1 = trashX - range;
    var trashY1 = trashY - range;
    var trashX2 = trashX + range;
    var trashY2 = trashY + range;
    var validTiles = Orion.GetTilesInRect('land',trashX1, trashY1, trashX2, trashY2).filter(function(tile,ind)
        {
        var tileX = tile.X();
        var tileY = tile.Y();
        if(tile.Z() != Player.Z() || (tileX == trashX && tileY == trashY))
            return false;
        Orion.AddFakeMapObject(ind, '0x051A', 1159, tileX, tileY, tile.Z());
        var mobCheck = Orion.FindType(any,any,ground,'live','xyz: ' + tileX + ',' + tileY).length == 0;
        var itemCheck = Orion.FindType(any,any,ground,'item','xyz: ' + tileX + ',' + tileY).length <= 5;
        return mobCheck && itemCheck;
        })
    Orion.AddFakeMapObject(10000, '0x051A', 1152, trashX, trashY, Player.Z());
    if(!validTiles.length)
        {
        DiscordPush(Player.Name() + ' ran out of space for trash containers');
        Orion.Terminate('all');
        }
    var validTile = validTiles.shift();
    var validTileX = validTile.X();
    var validTileY = validTile.Y();
    var trashContainer = Orion.FindObject(serial);
    var startTime = Orion.Now();
    var endTime = startTime + 3000;
    while(trashContainer.X() != validTileX || trashContainer.Y() != validTileY)
        {
        while(trashContainer.Distance() > 2)
            {
            Orion.WalkTo(trashContainer.X(),trashContainer.Y());
            Orion.Wait(200);
            }
        Orion.Say('i wish to release this');
        if(Orion.WaitForTarget(2000))
            {
            Orion.TargetObject(serial);
            var check = Orion.WaitJournal('(no longer secure)',startTime,endTime,'item',serial);
            if(!check)
                var check = Orion.InJournal('This is not locked down or secured.', 'my', '0', 'any', startTime, endTime);
            if(check)
                {
                while(!Orion.Dragging())
                    {
                    Orion.DragItem(serial);
                    Orion.Wait(500);
                    }
                while(Orion.GetDistance(validTileX,validTileY) > 2)
                    {
                    Orion.WalkTo(validTileX,validTileY);
                    Orion.Wait(200);
                    }
                Orion.DropDraggedItem('ground',validTileX,validTileY,Player.Z())
                while(Orion.Dragging())
                    {
                    Orion.Wait(200);
                    }
                startTime = Orion.Now() - 500;
                endTime = startTime + 3500;
                Orion.Say('i wish to secure this');
                if(Orion.WaitForTarget(3000))
                    {
                    Orion.TargetObject(serial);
                    check = Orion.WaitJournal('Secure!',startTime,endTime,'item',serial);
                    if(check)
                        continue;
                    }
                }
            }
        validTile = validTiles.shift()
        var validTileX = validTile.X();
        var validTileY = validTile.Y();
        Orion.Wait(1300);
        }
    }

function PutAwayJewelry(jewelry)
    {
    var playerBackpack = Orion.GetSerial(backpack);
    var skillMods = 
        {
        Magery:true,Wrestling:true,Focus:true,EvaluateIntelligence:true,Chivalry:true,
        Mysticism:true,MaceFighting:true,Fencing:true,Swordsmanship:true,Stealth:true,
        Parrying:true,Bushido:true,Ninjitsu:true,ResistingSpells:true,Anatomy:true,
        Tactics:true,Necromancy:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,
        Throwing:true,Archery:true,Healing:true,
        }
    var jewelryArr = [[],[],[],[],[],[]];
    for(var i=0;i<jewelry.length;i++)
        {
        var item = jewelry[i];
        var parse = parseJewelryProperties(item.Properties());
        var skillInt = CountMatchingMods(parse,skillMods)
        jewelryArr[skillInt].push(item);
        }
    for(var i=0;i<jewelryArr.length;i++)
        {
        var skillIntArr = jewelryArr[i];
        if(skillIntArr.length === 0)
            continue;
        Orion.ResetSearchArea();
        var categoryBook = Orion.FindTypeEx('0x0FF1|0x0FF2',any,ground,'item',24).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Jewelry ' + i + ' Skill') > -1;
            })[0];
        if(!categoryBook)
            {
            DiscordPush('Category Book Missing: ' + 'Jewelry ' + i + ' Skill');
            Orion.Terminate('all');
            }
        var categoryX = categoryBook.X();
        var categoryY = categoryBook.Y();
        var sortContainerSkills = Orion.FindTypeEx(any,any,ground,'item','xyz: ' + categoryX + ',' + categoryY).filter(function(item)
            {
            var properties = item.Properties();
            return properties.indexOf('Contents: ') > -1 && properties.indexOf('Contents: 125/') === -1;
            }).sort(function(a,b)
                {
                return b.Z() - a.Z();
                });
        if(sortContainerSkills.length < 5)
            {
            DiscordPush(Player.Name() + ' - Jewelry: ' + i + ' Skills Containers Are Full Or Missing!')
            Orion.Terminate('all');
            }
        while(Orion.GetDistance(categoryX,categoryY) > 2)
            {
            Orion.WalkTo(categoryX,categoryY);
            Orion.Wait(100);
            }
        for(var j=0;j<skillIntArr.length;j++)
            {
            var jewel = skillIntArr[j];
            var jewelSerial = jewel.Serial();
            var parse = parseJewelryProperties(jewel.Properties());
            var score = calculateTemplateValues(parse)[0][1];
            Orion.Print(score)
            var sortContainerScore;
            if(score >= 100)
                sortContainerScore = sortContainerSkills[0];
            else if(score >= 90)
                sortContainerScore = sortContainerSkills[1];
            else if(score >= 80)
                sortContainerScore = sortContainerSkills[2];
            else if(score >= 70)
                sortContainerScore = sortContainerSkills[3];
            else
                sortContainerScore = sortContainerSkills[4];
            while(Orion.GetContainer(jewelSerial) == playerBackpack)
                {
                Orion.MoveItem(jewelSerial,0,sortContainerScore.Serial());
                Orion.Wait(1300);
                }
            if(Orion.Contains(sortContainerScore.Properties(),'Contents: 125'))
                {
                DiscordPush(Player.Name() + ' - Jewelry: ' + i + ' Skills ' + score + ' Score Container Is Full!')
                Orion.Terminate('all');
                }
            }
        }
    }

function SearchJewelry(skillsThreshold,skillsSearchObject,modsSearchObject) //30,{'Magery':10,'EvaluatingIntelligence':10,'Mysticism':10},{'HitChanceIncrease':15}
    {
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
    var items = [];
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i];
        if(!container)
            Orion.Print(container);
        Orion.FindType('0x1F06|0x1086|0x108A|0x1F09',any,container.Serial(),'item', 'finddistance', '', true).forEach(function(item)
            {
            items.push(item);
            });
        }
    Orion.FindType('0x1F06|0x1086|0x108A|0x1F09',any,ground,'item', 22).forEach(function(item)
        {
        items.push(item);
        });
    var pass = items.filter(function(item)
        {
        var itemObj = Orion.FindObject(item);
        var itemProps = itemObj.Properties();
        var itemPropsObject = parseJewelryProperties(itemProps);
        var bool = AliCompareJewels(itemPropsObject,skillsThreshold,skillsSearchObject,modsSearchObject);
        if(!bool)
            Orion.TestItemColor(item,parseInt(itemObj.Color()));
        return bool;
        })
    Orion.Print('Items Found: ' + pass.length);
    pass.forEach(function(keeper)
        {
        Orion.TestItemColor(keeper, 1152);
        });
    }

function AliCompareJewels(itemToCompare, skillsThreshold,skillsSearchObject,modsSearchObject)//{'Magery':10,'EvaluatingIntelligence':10,'Mysticism':10},{'HitChanceIncrease':15}
    {
    var skillAmount = 0;
    for(var prop in skillsSearchObject)
        {
        if(itemToCompare.hasOwnProperty(prop))
            {
            if(itemToCompare[prop] < skillsSearchObject[prop])
                return false;
            else
                skillAmount += itemToCompare[prop];
            }
        }
    if(skillAmount < skillsThreshold)
        return false;
    for (var prop in modsSearchObject)
        {
        if(!itemToCompare.hasOwnProperty(prop) || itemToCompare[prop] < modsSearchObject[prop]) 
            return false;
        }
    return true;
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



function calculateTemplateValues(mods,templateName)
    {
    var templates = 
        {
        //Caster
        MysticWrestle: {
            'Mysticism': .83,'Focus': .83,'Magery': .83,'EvaluateIntelligence': .83,'Wrestling': .83,'Parrying': .67,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':7,'LowerManaCost':1,'SpellDamageIncrease':.4,
            'SwingSpeedIncrease':.5,'DamageIncrease':0,'LowerReagentCost':.4
            },
        NecroWrestle: {
            'Necromancy': .83,'SpiritSpeak': .83,'Magery': .83,'EvaluateIntelligence': .83,'Wrestling': .83,'Parrying': .67,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':7,'LowerManaCost':1,'SpellDamageIncrease':.4,
            'SwingSpeedIncrease':.5,'DamageIncrease':0,'LowerReagentCost':.4
            },
        MysticBalakai: {
            'Mysticism': .83,'Focus': .83,'Magery': .83,'EvaluateIntelligence': .83,'Bushido': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':11,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':0,'DamageIncrease':0,'LowerReagentCost':.4
            },
        NecroBalakai: {
            'Necromancy': .83,'SpiritSpeak': .83,'Magery': .83,'EvaluateIntelligence': .83,'Bushido': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':0,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':11,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':0,'DamageIncrease':0,'LowerReagentCost':.4
            },
        //Dexxer
        Disarmcher: {
            'Archery':.83,'Swordsmanship':.83,'SwordsmanshipCut':10,'Parrying':.83,'ResistingSpells':.83,'Anatomy':.83,'Tactics':.83,'Healing':.83,'Fencing':.53,'MaceFighting':.53,'Magery':.53,
            'StrengthBonus':.44,'DexterityBonus':.44,'IntelligenceBonus':.44,'ManaIncrease':.4,'StaminaIncrease':1,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':.67,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.25,'DamageIncrease':.5,'LowerReagentCost':0
            },
        GlendaBasher: {
            'MaceFighting': .83,'Tactics': .83,'Anatomy': .83,'Healing': .83,'Ninjitsu': .83,'Bushido': .83,'Parrying': .53,'ResistingSpells': .83,
            'StrengthBonus':.44,'DexterityBonus':.44,'IntelligenceBonus':.44,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':1,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.25,'DamageIncrease':.5,'LowerReagentCost':0
            },
        DSer: {
            'Swordsmanship':.83,'Ninjitsu':.83,'Tactics':.53,'Parrying':.83,'ResistingSpells':.83,
            'StrengthBonus':.44,'DexterityBonus':.44,'IntelligenceBonus':.44,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.83,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':1,'FasterCasting':6,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.1,'DamageIncrease':.5,'LowerReagentCost':0
            },
        //Hybrid
        HSBokMage: {
            'Swordsmanship': .83,'SwordsmanshipCut':10,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.27,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':.5,'DamageIncrease':.2,'LowerReagentCost':.4
            },
        LSBokMage: {
            'Swordsmanship': .83,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.67,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':.47,
            'SwingSpeedIncrease':.5,'DamageIncrease':.2,'LowerReagentCost':.4
            },
        HSBokMystic: {
            'Swordsmanship': .83,'SwordsmanshipCut':10,'Mysticism': .53,'Focus': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.27,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':.5,'DamageIncrease':.2,'LowerReagentCost':.4
            },
        LSBokMystic: {
            'Swordsmanship': .83,'Mysticism': .83,'Focus': .83,'Parrying': .83,'ResistingSpells': .83,'Tactics':.67,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':.47,
            'SwingSpeedIncrease':.5,'DamageIncrease':.2,'LowerReagentCost':.4
            },
        FoNMage: {
            'MaceFighting': .83,'Tactics': .83,'Anatomy': .83,'Magery':.83,'EvaluateIntelligence':.83,'Parrying': .83,'ResistingSpells': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.25,'DamageIncrease':.5,'LowerReagentCost':.4
            },
        NoxMage: {
            'Swordsmanship': .83,'Magery': .83,'EvaluateIntelligence': .83,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,'MaceFighting': .83,'Fencing': .83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.5,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':.5,'DamageIncrease':.2,'LowerReagentCost':.4
            },
        HolyFister: {
            'Swordsmanship': .83,'SwordsmanshipCut':10,'Tactics':.4,'Parrying': .83,'ResistingSpells': .83,'Ninjitsu': .83,'Fencing':.53,'MaceFighting':.53,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.38,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':.5,'DamageIncrease':.44,'LowerReagentCost':0
            },
        SwordsArcherFister: {
            'Archery': .83,'Tactics':.83,'Anatomy':.83,'Parrying': .83,'ResistingSpells': .83,'Swordsmanship':.83,'SwordsmanshipCut':10,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.38,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.1,'DamageIncrease':.5,'LowerReagentCost':0
            },
        MeleeArcherFister: {
            'Archery': .6,'Tactics':.83,'Anatomy':.83,'Parrying': .83,'ResistingSpells': .83,'Bushido':.83,'Fencing':.53,'MaceFighting':.53,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.38,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.1,'DamageIncrease':.5,'LowerReagentCost':0
            },
        NecroArcher: {
            'Archery': .83,'ArcheryCut': 10,'Tactics':.83,'Anatomy':.83,'ResistingSpells': .83,'Necromancy':.83,'SpiritSpeak':.83,
            'StrengthBonus':.38,'DexterityBonus':.38,'IntelligenceBonus':.38,'ManaIncrease':.4,'StaminaIncrease':.4,
            'ManaRegeneration':4.17,'EnhancePotions':.5,'HitChanceIncrease':.73,'DefenseChanceIncrease':.73,
            'FasterCastRecovery':4.17,'FasterCasting':12.5,'LowerManaCost':1,'SpellDamageIncrease':0,
            'SwingSpeedIncrease':1.1,'DamageIncrease':.5,'LowerReagentCost':0
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
    var specialBonus = 
        {
        'EnhancePotions':[35,5],
        'FasterCastRecovery':[4,5],
        }
    if(templateName == undefined)
        {
        var templateValues = [];
        for(var templateName in templates)
            {
            var template = templates[templateName];
            var totalValue = 0;
            var totalSkills = 0;
            // Calculate the individual mod values
            var temp = 0;
            for(var mod in mods)
                {
                if(template.hasOwnProperty(mod))
                    {
                    if(template[mod] == 0)
                        continue;
                    if(template.hasOwnProperty(mod + 'Cut') && mods[mod] > template[mod + 'Cut'])
                        {
                        temp = mods[mod];
                        mods[mod] = template[mod + 'Cut'];
                        }
                    var modValue = mods[mod] * template[mod];
                    totalValue += modValue;
                    if(specialBonus.hasOwnProperty(mod) && mods[mod] == specialBonus[mod][0])
                        totalValue += specialBonus[mod][1];
                    if(skillMods.hasOwnProperty(mod))
                        totalSkills += mods[mod];
                    if(temp)
                        {
                        mods[mod] = temp;
                        temp = 0;
                        }
                    }
                }
            templateValues.push([templateName,+totalValue.toFixed(),totalSkills])
            }
        return templateValues.sort(function(a,b)
            {
            return b[1] - a[1];
            });
        }
    else
        {
        var template = templates[templateName];
        var totalValue = 0;
        var totalSkills = 0;
        var outArr = [];
        var temp = 0;
        for(var mod in mods)
            {
            if(template.hasOwnProperty(mod))
                {
                if(template[mod] == 0)
                    continue;
                if(template.hasOwnProperty(mod + 'Cut') && mods[mod] > template[mod + 'Cut'])
                    {
                    temp = mods[mod];
                    mods[mod] = template[mod + 'Cut'];
                    }
                var modValue = mods[mod] * template[mod];
                var tempArr = [mod, mods[mod], template[mod], modValue];
                if(specialBonus.hasOwnProperty(mod) && mods[mod] >= specialBonus[mod][0])
                    {
                    tempArr.push(specialBonus[mod][1]);
                    totalValue += specialBonus[mod][1];
                    }
                else
                    tempArr.push(0);
                if(skillMods.hasOwnProperty(mod))
                    totalSkills += mods[mod];
                if(temp)
                    {
                    mods[mod] = temp;
                    temp = 0;
                    }
                totalValue += modValue;
                tempArr.push(totalValue);
                outArr.push(tempArr);
                }
            }
        Gump_DisplayInfo(templateName, outArr);
        return [[templateName,+totalValue.toFixed(),totalSkills]]
        }
    }

function Gump_DisplayInfo(templateName, outArr)
    {
    var gump = Orion.CreateCustomGump(10422);
    var rowStart = 30;
	var columnStart = 25;
    var heightAdjust = 25;
    var height = (outArr.length + 1) * 25 + 40;
    var width = 575;

    gump.Clear();
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + templateName + ' Info' + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    var yPos = rowStart + heightAdjust;
    var columns = [55,157,245,328,402,491];
    var columns2 = [25,175,260,335,410,495,560];
    var symbols = ["",'x','=','+','=',""];
    var strings = ['Mod','Amount','Weight','Value','Bonus','Total'];
    for(var i=0;i<strings.length;i++)
        {
        gump.AddText(columns[i],rowStart,554,'<big>' + strings[i] + '</big>');
        }
    for(var i=0;i<outArr.length;i++)
        {
        var lineArr = outArr[i];
        for(var j=0;j<lineArr.length;j++)
            {
            if(typeof lineArr[j] == 'number' && j != 1)
                var text = lineArr[j].toFixed(2)
            else
                var text = lineArr[j];
            gump.AddText(columns2[j],yPos,554,text);
            gump.AddText(columns2[j] + 50,yPos,554,symbols[j]);
            }
        yPos += heightAdjust;

        }
    gump.Update()
    }