//Need two runebooks. Each book will have a set of matching runes. If the recall location in the first book is blocked, it'll attempt to use the matching
// rune in the second book. The first book should be named 'First' and the second book 'More'.
//When marking locations, mark a spot and put it in the first book and then mark a spot a few steps away from the first and put it in the second book.
//You need one rune in each book named 'Bank' marked at any bank location for dropping off materials. The rest of the 15 runes in each book should be numbered
// from 1 to 15. Each location should be greater than 40 tiles away from the last, so that there isn't any overlap and your character doesn't visit the same
// trees twice.


var runeIndex = '1';
var numRunes = 15;
var usingBeetle = false;
var range = 20;

var resources = '0x1BD7|0x318F|0x3191|0x2F5F|0x3190|0x3199';
var colorsToss = '0x0000|0x07DA';
var colorsKeep = '0x04A7|0x04A8|0x04A9|0x04AA|0x047F';

// 0x0000 regular
// 0x07DA oak
// 0x04A7 ash
// 0x04A8 yew
// 0x04A9 heartwood
// 0x04AA bloodwood
// 0x047F frostwood

function Autostart()
    {
    Orion.Wait(5000);
    while(!Orion.GumpExists('container', backpack))
        {
        Orion.OpenContainer(backpack)
        Orion.Wait(1500);
        }
    initScripts();
    }

function initScripts()
    {
    Orion.Exec('GMJournalScan', true);
    Orion.Exec('BarkGump', true);
    Orion.Exec('Preservation', true);
    Orion.Exec('AutoLumberjack', true);
    }

var lastObjectUsedTime = 0;
function WaitForObjectTimeout()
    {
    var nowTime = Orion.Now();
    var deltaTime = nowTime - lastObjectUsedTime;
    if(deltaTime < 1300)
        Orion.Wait(1300 - deltaTime);
    }

//WaitForObjectTimeout();
//Orion.UseObject();
//lastObjectUsedTime = Orion.Now();

var storageRune;
var lastLocationRune;
var usedTrees = [];
var beetleMobile;
var axe = null;
var axes = '0x0F44|0xF47|0xF4B|0xF45|0xF43|0x13FB|0x1443|0x13B0|0xF49';

function AutoLumberjack()
    {
    if(usingBeetle)
        {
        WaitForObjectTimeout();
        Orion.UseObject(Player.Serial());
        lastObjectUsedTime = Orion.Now();
        Orion.Wait(500);
        var beetles = Orion.FindTypeEx('0x0317', any, ground, 'mobile', 4);
        if(beetles.length > 0)
            {
            beetleMobile = beetles[0];
            Orion.Print(beetleMobile.Serial())
            Orion.Print(((beetleMobile.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0));
            Orion.WalkTo(beetleMobile.X(), beetleMobile.Y(), beetleMobile.Z());
            WaitForObjectTimeout();
            Orion.UseObject(beetleMobile.Serial());
            lastObjectUsedTime = Orion.Now(); 
            }
        else
            return Orion.CharPrint(self, 1159, 'Beetle not found! Halting...');
        }
    axe = Orion.FindTypeEx(axes, any, backpack | Player.Serial())[0];
    if(usingBeetle)
        {
        WaitForObjectTimeout();
        Orion.UseObject(self);
        lastObjectUsedTime = Orion.Now();
        }
    var trees = [];
    while(!Player.Dead())
        {
        RecallByGump('Trees', runeIndex, 'More', runeIndex, true);
        EquipAxe();
        trees = GetTrees();
        Orion.Print("Trees: " + trees.length)
        usedTrees = usedTrees.concat(trees.map(function(stTree)
            {
            return stTree.X().toString() + stTree.Y().toString()
            }));

        while(trees.length > 0)
            {
            var treeTile = trees.shift();
            //TextWindow.Print(treeTile.X(), treeTile.Y(), treeTile.Z(), 0, Player.Z(), 1, 1);
            //TextWindow.Print('Orion.WalkTo(' + treeTile.X() + ', ' + treeTile.Y() + ', ' + treeTile.Z() + ', 1, ' + 255 + ', 1, 1);');
            var outcome = (Orion.GetDistance(treeTile.X(), treeTile.Y()) < (range - 4)) &&
                Orion.WalkTo(treeTile.X(), treeTile.Y(), treeTile.Z(), 1, 255, 1, 1);
            Orion.Print("Walked: " + outcome)
            //Orion.WalkTo(treeTile.X(), treeTile.Y(), treeTile.Z(), 1, 255, 1, 1)
            if(outcome)
                {
                Chop(treeTile)
                Orion.RemoveFakeMapObject(treeTile.X().toString() + treeTile.Y().toString());
                }
            Orion.ClearJournal();
            trees.sort(function(treeA, treeB)
                {
                return Orion.GetDistance(treeA.X(), treeA.Y()) - Orion.GetDistance(treeB.X(), treeB.Y());
                });
            Orion.Print("Changing location")
            }
        usedTrees = [];
        var runeIndexNum = +runeIndex + 1;
        if(runeIndexNum <= numRunes)
            runeIndex = String(runeIndexNum); 
        else
            runeIndex = '1';
        Orion.Wait(200);
        }
    }

function Preservation()
    {
    //0x002F reaper
    //0x0035 troll
    //0x0008 corpser
    //0x0027 mongbat
    //0x0004 gargoyle
    //0x0001 ogre
    //0x00EE sewer rat
    //0x001E harpy
    //0x0023 lizardman
    //0x001F headless one
    //0X004A imp
    var enemiesGraphicList = '0x004A|0x001F|0x002F|0x0035|0x0008|0x0027|0x0004|0x0001|0x00EE|0x001E|0x0023'
    while(!Player.Dead())
        {
        var enemy = Orion.FindTypeEx(enemiesGraphicList, any, ground, 'ignoreself|fast|mobile', 14)
        if(Player.Poisoned())
            {
            Orion.Cast('Cure');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
            Orion.Wait(1000);
            }
        else if(Player.Hits('%') < 60)
        	{
        	Orion.PauseScript('all', 'BarkGump|Preservation|GMJournalScan')
        	Orion.Cast('Greater Heal');
            if(Orion.WaitForTarget(4000))
                Orion.TargetObject(self);
        	Orion.Wait(1000);
        	Orion.ResumeScript('all')
        	}
        else if(enemy[0])
            {
            Orion.PauseScript('all', 'BarkGump|Preservation|GMJournalScan')
            while(!Player.Dead() && enemy[0].Exists())
				{
                if(Player.Poisoned())
                    {
                    Orion.Cast('Cure');
                    if(Orion.WaitForTarget(4000))
                        Orion.TargetObject(self);
                    Orion.Wait(1000);
                    }
                else if(Player.Hits('%') < 60)
                    {
                    Orion.PauseScript('all', 'BarkGump|Preservation|GMJournalScan')
                    Orion.Cast('Greater Heal');
                    if(Orion.WaitForTarget(4000))
                        Orion.TargetObject(self);
                    Orion.Wait(1000);
                    Orion.ResumeScript('all')
                    }
				if(enemy[0].Distance() > 1)
					Orion.WalkTo(enemy[0].X() + Orion.Random(-1,2), enemy[0].Y() + Orion.Random(-1,2), enemy[0].Z(), 0);
                else
                    Orion.Attack(enemy[0].Serial());
				Orion.Wait(500);
				}
		    Orion.Wait(1000);
		    Orion.ResumeScript('all')
            }
        else
        	Orion.Wait(500);
        }
    }



function Chop(tile)
    {
    var saveX;
    var saveY;
    while(Orion.GetDistance(tile.X(), tile.Y()) <= 2
        && (Orion.LastJournalMessage() == null
            || (Orion.LastJournalMessage().Text().match(/(not\senough\swood)|(use\san\saxe)|(cannot\sbe\sseen)|(far\saway)/gi) || []).length == 0))
        {
        if(Player.Weight('%') > 80)
            {
            Orion.FindType('0x1BDD', colorsToss, backpack).forEach(function(wood)
                {
                WaitForObjectTimeout();
                DropHere(wood);
                lastObjectUsedTime = Orion.Now();
                Orion.Wait(200);
                });
            Orion.FindType('0x1BDD', colorsKeep, backpack).forEach(function(wood)
                {
                WaitForObjectTimeout();
                Orion.UseObject(axe.Serial());
                lastObjectUsedTime = Orion.Now();
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(wood);
                Orion.Wait(200);
                });
            if(usingBeetle)
                {
                Orion.Wait(500);
                Orion.FindTypeEx(resources).forEach(function(resource)
                    {
                    WaitForObjectTimeout();
                    Orion.MoveItem(resource.Serial(), 0, beetleMobile.Serial());
                    lastObjectUsedTime = Orion.Now();
                    });
                }
            }
        if((!usingBeetle && Player.Weight('%') > 80)
            || (usingBeetle && ((beetleMobile.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0) > 1400))
            {
            if(usingBeetle)
                {
                Orion.WalkTo(beetleMobile.X(), beetleMobile.Y(), beetleMobile.Z())  
                WaitForObjectTimeout();
                Orion.UseObject(beetleMobile.Serial());
                lastObjectUsedTime = Orion.Now();
                }
            saveX = Player.X();
            saveY = Player.Y();
            RecallByGump('Trees', 'Bank', 'More', 'Bank', true);
            while(!Orion.GumpExists('container', Player.BankSerial()))
                {
                Orion.Say('bank');
                Orion.Wait(500);
                }
            var bankBox = Player.BankSerial();
            MoveItems(backpack, bankBox, resources);
            if(usingBeetle)
                {
                WaitForObjectTimeout();
                Orion.UseObject(self);
                lastObjectUsedTime = Orion.Now();
                Orion.Wait(500);
                Orion.WaitContextMenuCliloc(beetleMobile.Serial(), 3006145);
                Orion.RequestContextMenu(beetleMobile.Serial());
                Orion.Wait(500);
                MoveItems(lastcontainer, bankBox);
                Orion.WalkTo(beetleMobile.X(), beetleMobile.Y(), beetleMobile.Z())    
                WaitForObjectTimeout();
                Orion.UseObject(beetleMobile.Serial());
                lastObjectUsedTime = Orion.Now();
                }
            RecallByGump('Trees', runeIndex, 'More', runeIndex, true);
            Orion.WalkTo(saveX, saveY, 0, 0);
            if(usingBeetle)
                {
                WaitForObjectTimeout();
                Orion.UseObject(self);
                lastObjectUsedTime = Orion.Now();
                } 
            }
        
        EquipAxe();
        WaitForObjectTimeout();
        Orion.UseObject(axe.Serial());
        lastObjectUsedTime = Orion.Now();
        if(Orion.WaitForTarget(2000))
            Orion.TargetTile(any, tile.X(), tile.Y(), tile.Z());
        Orion.Wait(800);
        }
    }

function EquipAxe()
    {
    if(axe == null)
        axe = Orion.FindTypeEx(axes, any, backpack)[0];
    while(axe.Layer() == 0)
        {
        WaitForObjectTimeout();
        Orion.Equip(axe.Serial());
        lastObjectUsedTime = Orion.Now();
        Orion.Wait(200);
        }
    }

function GetTrees(_)
    {
    Orion.Print('Range ' + range);
    var trees = Orion.GetTilesInRect('tree', Player.X() - range, Player.Y() - range, Player.X() + range, Player.Y() + range)
        .filter(function (tree)
            {
            return (Player.Z() + 15) > tree.Z() || Orion.GetTilesInRect('tree', tree.X() - 2, tree.Y() - 2, tree.X() + 2, tree.Y() + 2).length < 16;
            })
        .filter(function (tree)
            {
            return usedTrees.indexOf(tree.X().toString() + tree.Y().toString()) == -1;
            })
        .sort(function (t1, t2)
            {
            return Orion.GetDistance(t1.X(), t1.Y()) - Orion.GetDistance(t2.X(), t2.Y())
            });
    Orion.ClearFakeMapObjects();
    trees.forEach(function(tree)
        {
        Orion.AddFakeMapObject(tree.X().toString() + tree.Y().toString(), '0x1BDD', '', tree.X(), tree.Y(), tree.Z() + 15);
        });
    return trees;
    }

function SelectTarget(text)
    {
    if(text)
        Orion.CharPrint(self, 1159, 'Select ' +  text)
    Orion.WaitForAddObject('myTarget');
    return Orion.FindObject('myTarget');
    }

function DropHere(itemSerial)
	{
	var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
		.filter(function(tile)
			{
			Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
			var mobCheck = Orion.FindType(any,any,ground,'live');
			var itemCheck = Orion.FindType(any,any,ground,'item');
			return mobCheck.length == 0 && itemCheck.length < 5;
			});
    Orion.ResetSearchArea();
    var validTile = null;
    for(var i=0;i<validTiles.length;i++)
        {
        if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),256,0).length)
            {
            validTile = validTiles[i];
            break;
            }
        }
	if(validTile)
        Orion.Drop(itemSerial, 0, validTile.X(), validTile.Y(), validTile.Z());
	else 
		Orion.CharPrint(self, 1159, 'No free tiles nearby!');
	}

function SurveyMarkRange()
    {
    Orion.ClearFakeMapObjects()
    var startX = Player.X() - range * 2;
    var endX = Player.X() + range * 2;
    var startY = Player.Y() - range * 2;
    var endY = Player.Y() + range * 2;
    var tiles = Orion.GetTilesInRect('land', startX, startY, endX, endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY);
            Orion.AddFakeMapObject(serial, '0x051A', 1159, tileX, tileY, tileZ);
            });
    var startX = Player.X() - range;
    var endX = Player.X() + range;
    var startY = Player.Y() - range;
    var endY = Player.Y() + range;
    var tiles = Orion.GetTilesInRect('land', startX, startY, endX, endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY) + String(tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 5, tileX, tileY, tileZ);
            });
    var startX = Player.X() - range * 2;
    var endX = Player.X() + range * 2;
    var startY = Player.Y() - range * 2;
    var endY = Player.Y() + range * 2;
    var tiles = Orion.GetTilesInRect('land', Player.X(), startY, Player.X(), endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY) + String(tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            });
    var tiles = Orion.GetTilesInRect('land', startX, Player.Y(), endX, Player.Y());
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY) + String(tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            }); 
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    }

function ClearMarkers()
    {
    Orion.ClearFakeMapObjects();
    }

function CastSpellOnTarget(spellName, targetID)
    {
    while(!Orion.HaveTarget())
        {
        Orion.Cast(spellName);
        Orion.WaitForTarget(5000);
        }
    Orion.TargetObject(targetID);
    Orion.Wait(200);
    }

function MarkRune(runeItem)
    {
    if(typeof runeItem === "string")
        runeItem = Orion.FindObject(runeItem)
    CastSpellOnTarget("Mark", runeItem.Serial());
    }

function RecallRune(runeItemSerial)
    {
    var x = Player.X();
    var y = Player.Y();
    if(Orion.SkillValue('Magery', 'base') > 40)
        CastSpellOnTarget("Recall", runeItemSerial);
    else if(Orion.SkillValue('Chivalry', 'base') > 30)
        CastSpellOnTarget("Sacred Journey", runeItemSerial);
    var check = Orion.WaitJournal('Something is blocking the location.', Orion.Now(), Orion.Now()+4000, 'sys');
    if(check)
        Orion.PauseScript();
    if (x == Player.X() && y == Player.Y())
        RecallRune(runeItemSerial);
    return true;
    }

function BarkGump()
    {
    Orion.ClearJournal();
    var startTime = Orion.Now();
    var regularCounter = 0;
    var oakCounter = 0;
    var ashCounter = 0;
    var yewCounter = 0;
    var heartwoodCounter = 0;
    var bloodwoodCounter = 0;
    var frostwoodCounter = 0;
    var fungiCounter = 0;
    var amberCounter = 0;
    var parasiticCounter = 0;
    var switchCounter = 0;
    var barkCounter = 0;
    while(true)
        {
        var yPosition = 10;
    	var gump = Orion.CreateCustomGump(11001);
        var sec = Orion.Now() - startTime;
        var date = new Date(sec);
        var time = date.toISOString().substring(11, 19);
        var gold = regularCounter * 14 + oakCounter * 75 + ashCounter * 40 + yewCounter * 180 + bloodwoodCounter * 800 + frostwoodCounter * 1200
        var divisor = sec/3600000;
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 160, 435);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(95, 10, "0", time);
        gump.AddText(10, 25, "0",'Regular: ');
        gump.AddText(95, 25, "0", regularCounter);
        gump.AddText(10, 40, "0",'Regular/hr: ');
        gump.AddText(95, 40, "0", (regularCounter / divisor).toFixed(2));
        gump.AddText(10, 55, "0",'Oak: ');
        gump.AddText(95, 55, "0", oakCounter);
        gump.AddText(10, 70, "0",'Oak/hr: ');
        gump.AddText(95, 70, "0", (oakCounter / divisor).toFixed(2));
        gump.AddText(10, 85, "0",'Ash: ');
        gump.AddText(95, 85, "0", ashCounter);
        gump.AddText(10, 100, "0",'Ash/hr: ');
        gump.AddText(95, 100, "0", (ashCounter / divisor).toFixed(2));
        gump.AddText(10, 115, "0",'Yew: ');
        gump.AddText(95, 115, "0", yewCounter);
        gump.AddText(10, 130, "0",'Yew/hr: ');
        gump.AddText(95, 130, "0", (yewCounter / divisor).toFixed(2));
        gump.AddText(10, 145, "0",'Heartwood: ');
        gump.AddText(95, 145, "0", heartwoodCounter);
        gump.AddText(10, 160, "0",'Heartwood/hr: ');
        gump.AddText(95, 160, "0", (heartwoodCounter / divisor).toFixed(2));
        gump.AddText(10, 175, "0",'Bloodwood: ');
        gump.AddText(95, 175, "0", bloodwoodCounter);
        gump.AddText(10, 190, "0",'Bloodwood/hr: ');
        gump.AddText(95, 190, "0", (bloodwoodCounter / divisor).toFixed(2));
        gump.AddText(10, 205, "0",'Frostwood: ');
        gump.AddText(95, 205, "0", frostwoodCounter);
        gump.AddText(10, 220, "0",'Frostwood/hr: ');
        gump.AddText(95, 220, "0", (frostwoodCounter / divisor).toFixed(2));
        gump.AddText(10, 235, "0",'Amber: ');
        gump.AddText(95, 235, "0", amberCounter);
        gump.AddText(10, 250, "0",'Amber/hr: ');
        gump.AddText(95, 250, "0", (amberCounter / divisor).toFixed(2));
        gump.AddText(10, 265, "0",'Parasitic: ');
        gump.AddText(95, 265, "0", parasiticCounter);
        gump.AddText(10, 280, "0",'Parasitic/hr: ');
        gump.AddText(95, 280, "0", (parasiticCounter / divisor).toFixed(2));
        gump.AddText(10, 295, "0",'Fungi: ');
        gump.AddText(95, 295, "0", fungiCounter);
        gump.AddText(10, 310, "0",'Fungi/hr: ');
        gump.AddText(95, 310, "0", (fungiCounter / divisor).toFixed(2));
        gump.AddText(10, 325, "0",'Switch: ');
        gump.AddText(95, 325, "0", switchCounter);
        gump.AddText(10, 340, "0",'Switch/hr: ');
        gump.AddText(95, 340, "0", (switchCounter / divisor).toFixed(2));
        gump.AddText(10, 355, "0",'Bark: ');
        gump.AddText(95, 355, "0", barkCounter);
        gump.AddText(10, 370, "0",'Bark/hr: ');
        gump.AddText(95, 370, "0", (barkCounter / divisor).toFixed(2));
        gump.AddText(10, 385, "0",'Revenue: ');
        gump.AddText(65, 385, "0", gold + 'gp');
        gump.AddText(10, 400, "0",'GP/hr: ');
        gump.AddText(65, 400, "0", (gold / divisor).toFixed(0) + 'gp');
        gump.Update();
        Orion.Wait(500);
        if(Orion.InJournal('ordinary logs', 'sys', 0, 'any'))
            {
            regularCounter += 20;
            Orion.ClearJournal('ordinary logs');
            }
        if(Orion.InJournal('oak logs', 'sys', 0, 'any'))
            {
            oakCounter += 20;
            Orion.ClearJournal('oak logs');
            }
        if(Orion.InJournal('ash logs', 'sys', 0, 'any'))
            {
            ashCounter += 20;
            Orion.ClearJournal('ash logs');
            }
        if(Orion.InJournal('yew logs', 'sys', 0, 'any'))
            {
            yewCounter += 20;
            Orion.ClearJournal('yew logs');
            }
        if(Orion.InJournal('heartwood logs', 'sys', 0, 'any'))
            {
            heartwoodCounter += 20;
            Orion.ClearJournal('heartwood logs');
            }
        if(Orion.InJournal('bloodwood logs', 'sys', 0, 'any'))
            {
            bloodwoodCounter += 20;
            Orion.ClearJournal('bloodwood logs');
            }
        if(Orion.InJournal('frostwood logs', 'sys', 0, 'any'))
            {
            frostwoodCounter += 20;
            Orion.ClearJournal('frostwood logs');
            }
        if(Orion.InJournal('luminescent fungi', 'sys', 0, 'any'))
            {
            fungiCounter++;
            Orion.ClearJournal('luminescent fungi');
            }
        if(Orion.InJournal('switch', 'sys', 0, 'any'))
            {
            switchCounter++;
            Orion.ClearJournal('switch');
            }
        if(Orion.InJournal('parasitic plant', 'sys', 0, 'any'))
            {
            parasiticCounter++;
            Orion.ClearJournal('parasitic plant');
            }
        if(Orion.InJournal('brilliant amber', 'sys', 0, 'any'))
            {
            amberCounter++;
            Orion.ClearJournal('brilliant amber');
            }
        if(Orion.InJournal('You found a bark fragment!', 'sys', 0, 'any'))
            {
            barkCounter++;
            Orion.ClearJournal('You found a bark fragment!');
            }
        }
    }

function BarkGump1()
    {
    Orion.ClearJournal();
    var startTime = Orion.Now();
    var barkCounter = 0;
    while(true)
        {
    	var gump = Orion.CreateCustomGump(11001);
        var sec = Orion.Now() - startTime;
        var date = new Date(sec);
        var time = date.toISOString().substring(11, 19);
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 160, 75);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(95, 10, "0", time);
        gump.AddText(10, 25, "0",'Fragments: ');
        gump.AddText(95, 25, "0", barkCounter);
        gump.AddText(10, 40, "0",'Fragments/hr: ');
        gump.AddText(95, 40, "0", (barkCounter / (sec/3600000)).toFixed(2));
        gump.Update();
        Orion.Wait(500);
        if(Orion.InJournal('You found a bark fragment!', 'sys', 0, 'any'))
            {
            barkCounter++;
            Orion.ClearJournal('You found a bark fragment!');
            }
        }
    }

function MoveItems(fromContainer, toContainer, graphicIDs, color, amount)
    {
    if(!graphicIDs)
        graphicIDs = any;
    if(!color)
        color = any;
    if(!amount)
        amount = 0;
    var items = Orion.FindType(graphicIDs, color, fromContainer);
    Orion.CharPrint(self, 1159, items.length);
    while(items[0])
        {
        WaitForObjectTimeout();
        Orion.MoveItem(items[0], amount, toContainer)
        lastObjectUsedTime = Orion.Now();
        Orion.Wait(200);
        items = Orion.FindType(graphicIDs, color, fromContainer);
        Orion.CharPrint(self, 1159, items.length);
        }
    }
    
function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//create global variable runeIndex to increment through the book starting from 1
	//global variable numRunes declares total runes to increment through 
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return Orion.Contains(part.Properties(), bookName)
        });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    WaitForObjectTimeout();
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	Orion.UseObject(runeItem[0].Serial());
    lastObjectUsedTime = Orion.Now();
	if(Orion.WaitForGump(2000))
		{
		var gump = Orion.GetGump('last');
		var runeCheck = gump.TextList().indexOf(runeName) - 2;
		if(runeCheck == -1)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00000059'))
			{
            gump.Select(Orion.CreateGumpHook(startInd + runeCheck));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(rotateToggle && backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            var runeIndexNum = +runeIndex + 1 
	            if(runeIndexNum <= numRunes)
					runeIndex = String(runeIndexNum); 
	            else
					runeIndex = '1';
	            return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            });
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeIndex);
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	        {
	        Orion.Wait(2000);
            if(rotateToggle)
                {
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                }
	        return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle);
	}

function GMJournalScan()
	{
    var bot = "https://discordapp.com/api/webhooks/"
    + '941921319463841843' //hook
    + "/"
    + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{		
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}