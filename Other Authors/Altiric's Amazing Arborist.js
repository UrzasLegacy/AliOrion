/*
 * Script   : Altiric's Amazing Arborist
 * Author   : Altiric
 * Created  : May 20, 2022
 * Revised  : Jul 25, 2023
 * Version  : 1.0
 * Comments, Updates, Support: http://www.scriptuo.com/
 * 
 * Usage:
 * -Run Autostart()
 * -Target a secure container, unless done previously
 * -Enjoy
 * 
 * Setup:
 * -Have a secure container in an accessible location of your main floor.
 * -If axes break on your shard, have extras in a pouch inside the secure.
 * -run Autostart()
 * -You don't even need any skills to get started!
 * 
 * Function:
 * -Script starts by setting up secure container if one has not been set.
 * -If a giant beetle is found, its set as pack animal
 * -Scans for and chops trees, reducing logs to boards
 * -Moves wood to beetle if available
 * -Unloads to secure when full and continues
 * -Will return to secure if beetle or player enter battle or a hostile player is detected
 * -Script will stop taking actions while in war mode
 * -Activates war mode while walking if stuck on stairs (also toggles avoid walking on stairs in war mode on)
 * -Attempts to recover pack animal that gets stuck on stairs
 * 
 * Complete revemp: Removed everything extra and just kept and built on what works.
 * The function of the script is simple, collect as many boards/resources as possible, 
 * as easily as possible!
 * 
 */

const logLevel = 1; // logLevel 0 = none, 1 = actions, 2 = debug
const maxRangeFromSecure = 150; // Max scan distance from secure
const axesBreak = false; // Automatically true on Siege/Mugen

function Autostart(){
    log(1, "Starting Script");
    setup();
    var secure = Orion.FindObject('secure');

    while(true){
        log(2, "beginning main loop");

        if(Orion.GetDistance(secure.X(), secure.Y()) > maxRangeFromSecure){
            log(2, "secure out of range, approaching");
            walkTo(secure.X(), secure.Y(), 5, 60000, true);
        }

        var trees = getTrees();

        if(trees.length < 1){
            log(2, "no trees found");
        	if(Orion.GetDistance(secure.X(), secure.Y()) > 100){
                log(2, "returning to secure");
	            walkTo(secure.X(), secure.Y(), 2, 60000, true);
    	        Orion.Wait(100);
    	    }
            trees = getTrees();
            if(trees.length < 1){
                log(2, "resetting chopped list");
                Orion.RemoveHighlightArea('all');
                chopped = [];
                continue;
            }
        }

        log(2, "entering harvest loop");
        while((trees && trees.length) && !Player.Dead())
            trees = harvest(trees);
        
        Orion.Wait(250);
    }
}

function setup(_internal){
    Orion.ClientOptionSet('BlockWalkingOnMultiStairsInWarMode', true);
    Orion.RemoveHighlightArea('all');
    Orion.ClearJournal();

    var testSecure = Orion.FindObject('secure');
    if(!testSecure || !testSecure.length){
        log(2, "Selecting secure");
        do {
            Orion.CharPrint(self, color.yellow.norm, "Select Secure Container");
            Orion.WaitForAddObject('secure');
    
            var secure = Orion.FindObject('secure');
            if(!secure){
                log(2, "No secure targeted");
                Orion.Print("A valid secure is required");
            }
        } while(!secure);
        log(2, "secure set");
    } else {
        log(2, "Using previous secure");
    }

    var secure = Orion.FindObject('secure');
    Shared.AddVar('secureX', secure.X());
    Shared.AddVar('secureY', secure.Y());
    
    dismount();
    var animal = Orion.FindTypeEx(0x0317, any, ground, 'mobile', 3, 'innocent|friendly')[0];

    if(animal){
        log(2, "animal found");
        Orion.AddObject('animal', animal.Serial());
    }
    
    checkWeight();
}

function harvest(trees){
    var noWood = "There's not enough wood";
    var tooFar = "That is too far";
    var cantSee= "Cannot see";
    var messages = [noWood, tooFar].join('|');

    trees.sort(function(a, b){ return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y()) });
    var minDistance = Orion.GetDistance(trees[0].X(), trees[0].Y());
    var closestTrees = trees.filter(function(tree){ 
        return Orion.GetDistance(tree.X(), tree.Y()) === minDistance });

    var tree = closestTrees[Math.floor(Math.random() * closestTrees.length)];
    currentTree = tree;
    trees = trees.filter(function(t){ return t.X() !== tree.X() || t.Y() !== tree.Y() });
    chopped.push([tree.X(), tree.Y()]);
    log(2, "tree selected");

    Orion.AddHighlightArea(tree.X()+tree.Y(), -1, 'pos', color.white.light, 0, 0, 'static', tree.X(), tree.Y());

    walkTo(tree.X(), tree.Y(), Orion.Random(1,2), 10000)

    log(1, "Chopping");
    do {
        useAxe(tree.X(), tree.Y());
        Orion.SetTimer('chop');
        while(!Orion.InJournal("You chop|You hack") && Orion.Timer('chop') < 1600)
            Orion.Wait(100);            Orion.ClearJournal("You chop|You hack");
    } while(!Orion.InJournal(messages) && !Player.Dead() && !Player.WarMode());
    log(2, "tree out of wood");
    
    lastTree = tree;
    trees = trees.filter(function(t){ 
        var remove = distance(tree, t) < 3;
        if(remove){
            Orion.AddHighlightArea(tree.X()+tree.Y(), -1, 'pos', color.red.dark, 0, 0, 'static', tree.X(), tree.Y());
            return false;
        } else {
            return true;
        }
    });
    Orion.AddHighlightArea(tree.X()+tree.Y(), -1, 'pos', color.red.dark, 0, 0, 'static', tree.X(), tree.Y());
    Orion.ClearJournal(messages);
    Orion.Wait(100);
    return trees;
}

function log(level, text){
    if(level == 1 && (logLevel == 1 || logLevel == 2) || level == 2 && logLevel == 2){
        Orion.Print(color.yellow.norm, Orion.Time('hh:mm:ss') +": " +text);
        if(logLevel == 2){
            if(!TextWindow.IsOpened()){
                TextWindow.Open();
                TextWindow.Clear();
            }
            TextWindow.Print(level == 2 ? Orion.Time('hh:mm:ss')  +": " +text : text);
            TextWindow.SaveToFile('debug.log');
        }
    }
}

function useAxe(x, y){
    log(2, "chopping x" +x +" y" +y);
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    Orion.CancelWaitTarget();

    checkWeight();

    var hostiles = findHostiles();
    if(hostiles){
        log(1, hostiles + " detected, pausing");
        secureDrop();
        Orion.PauseScript();
    }
    
    if(Orion.ObjAtLayer('Mount') !== null)
        dismount();
    if(Orion.FindObject('animal'))
        checkAnimal();

    var held = Orion.ObjAtLayer('LeftHand') ? Orion.ObjAtLayer('LeftHand') : Orion.ObjAtLayer('RightHand');
	if(!held){
        log(2, "no axes held");
        if(Orion.FindType(items['axes'], any, backpack).length){
            log(2, "found axe in pack");
            Orion.EquipT(items['axes'], any, backpack);
            Orion.Wait('moveitemdelay');
            held = Orion.ObjAtLayer('LeftHand') ? Orion.ObjAtLayer('LeftHand') : Orion.ObjAtLayer('RightHand');
        } else {
            log(2, "no axes in pack");
            Orion.Print(color.yellow.norm, "Could not find an Axe");
            secureDrop();
            returnTree();
        }
    }

	if(Orion.UseType(items['axes'], any, self)){
        Orion.WarMode(false);
        Orion.WaitTargetTile('tree', x, y, 0);
        Orion.Wait('useitemdelay');
    } else {
        log(2, "unable to use axe");
        Orion.Print(color.yellow.norm, "Could not find an Axe");
        secureDrop();
        returnTree();
    }
}

function getTrees(_internal){
    log(2, "loading trees");
    var trees = Orion.GetTilesInRect('tree', Player.X()-24, Player.Y()-24, Player.X()+24, Player.Y()+24)
        .filter(function(tree){ return isReachable(tree) })
        .filter(function(tree){
            return !chopped.some(function(choppedTree){
                return choppedTree[0] === tree.X() && choppedTree[1] === tree.Y() });
        });

    trees.forEach(function(tree){
        Orion.AddHighlightArea(tree.X()+tree.Y(), -1, 'pos', color.green.dark, 0, 0, 'static', tree.X(), tree.Y());
    });
    log(2, Object.keys(trees).length +" trees found");
    return trees;
}

function isReachable(tree){
    return Orion.GetTilesInRect('tree', tree.X() - 2, tree.Y() - 2, tree.X() + 2, tree.Y() + 2).length < 16;
}

function checkWeight(_internal){
    Shared.AddVar('lastX', Player.X());
    Shared.AddVar('lastY', Player.Y());

    if(Player.Weight("%") > 90){
        log(2, "logs2boards");
        Orion.FindTypeEx(items['logs'], any, backpack).forEach(function(log){
            Orion.AddWaitTargetObject(log.Serial());
            Orion.UseType(items['axes']);
            Orion.Wait('useitemdelay');
        });

        if(Player.Weight("%") > 70){
            var animal = Orion.FindObject('animal');
            if(animal){
                log(2, "moving items to animal");
                var weight = ((animal.Properties().match(/Weight:\s(\d*)/i) || [])[1] || 0);
                var space = 1600 - weight;
                if(Orion.Count(items['boards']) > space){
                    log(1, "Animal full, unloading at secure");
                    secureDrop();
                    returnTree();
                } else {
                    log(1, "Loading " +animal.Name());
                    while(Orion.Count(items['boards']) > 0){
                        Orion.MoveItemType(items['boards'], any, backpack, 0, animal.Serial());
                        Orion.Wait('moveitemdelay');
                    }
                }
            } else {
                log(1, "Backpack full, unloading at secure");
                secureDrop();
                returnTree();
            }
        }
    }
}

function secureDrop(_internal){
    log(2, "Going to Secure");
    var reqAxes = Orion.ShardName() == "Siege Perilous" ? 3 : 1;

    walkTo(Shared.GetVar('secureX'), Shared.GetVar('secureY'), 1, 60000, true);

    var secure = Orion.FindObject('secure');
    if(secure.Distance() > 2){
        Orion.WarMode(false);
        walkTo(secure.X(), secure.Y(), 1);
    }

    Orion.UseSkill('Hiding');
    Orion.Wait('useitemdelay');
    dismount();

    var animal = Orion.FindObject('animal');
    if(animal){
        log(2, "unloading animal");
        Orion.RequestContextMenu(animal.Serial());
        Orion.WaitContextMenuID(animal.Serial(), 508);
        Orion.WaitForContainerGump();
        Orion.Wait('useitemdelay');
        Orion.FindTypeEx(any, any, lastcontainer).forEach(function(item){
            Orion.MoveItem(item.Serial(), 0, secure.Serial());
            Orion.Wait('moveitemdelay');
        });
    }

    log(2, "unloading pack");
    Orion.FindTypeEx(items['harvest']+'|'+items['boards'], any, backpack).forEach(function(item){
        Orion.MoveItem(item.Serial(), 0, secure.Serial());
        Orion.Wait('useitemdelay');
    });

    log(2, "checking for axes");
    if(axeCount() < reqAxes && (Orion.ShardName() == "Siege Perilous" || Orion.ShardName() == "Mugen" || axesBreak)){
        log(2, "Have " +axeCount() +" of " +reqAxes +" axes");
        Orion.UseObject(secure.Serial());
        Orion.WaitForContainerGump();
        Orion.Wait('useitemdelay');
        Orion.UseType(0x0E76, any, secure.Serial());
        Orion.WaitForContainerGump();
        Orion.Wait('useitemdelay');
        var available = Orion.FindTypeEx(items['axes'], any, 'secure', 'item', '', '', true);
        if(available){
            var needed = reqAxes - axeCount();
            log(2, "moving " +needed +" axes to pack");
            for(i=0;i<needed;i++){
                Orion.MoveItem(available[i].Serial());
                Orion.Wait('moveitemdelay');
            }
        } else {
            log(2, "no axes available");
        }
        if(axeCount() < reqAxes){
            log(1, "Need more axes");
            Orion.PauseScript();
        }
    }
}

function returnTree(_internal){
    log(2, "returning to last tree");
    walkTo(currentTree.X(), currentTree.Y(), 1, 60000, true);
    Orion.Wait(500);
}

function walkTo(x, y, distance, timeout, ride){
    distance = distance ? distance : 2;
    timeout = timeout ? timeout : 10000;
    if(ride)
        mount();
    Orion.Exec('walkWatch', true);
    log(2, "Walking to: x" +x +" y" +y);
    if(Orion.WalkTo(x, y, Player.Z(), distance, 255, Orion.ObjAtLayer('Mount') ? 2 : 1, 1, timeout)){
        log(2, "Arrived");
        Orion.Wait(100);
        Orion.WarMode(false);
        return true;
    } else {
        log(2, "failed to reach destination");
        return false;
    }
}

function walkWatch(_internal){
    Orion.Wait(500);
    do {
        var cx = Player.X(), cy = Player.Y();
        Orion.Wait(3000);
        if(Orion.GetDistance(cx, cy) < 2 && Orion.IsWalking()){
            log(1, "Path blocked, warmode active");
            Orion.WarMode(true);
        }
        Orion.Wait(50);
    } while(Orion.IsWalking());
}

function axeCount(_internal){
    var held = Orion.FindType(items['axes'], any, self);
    var carried = Orion.FindType(items['axes'], any, backpack);
    return held.length + carried.length || 0;
}

function mount(_internal){
    checkAnimal()
    var animal = Orion.FindObject('animal');
    if(!animal){ 
        log(2, "no mount saved");
        return false;
    }
    if(animal.Distance() < 3){
        log(2, "mounting");
        Orion.UseObject(animal.Serial());
        Orion.Wait('useitemdelay');
    } else {
        log(2, "mount out of range");
    }
}

function dismount(_internal){
    if(Orion.ObjAtLayer('Mount') !== null){
        log(2, "dismounting");
        Orion.UseObject(Player.Serial());
        Orion.Wait('useitemdelay');
    }
}

function endScript(_internal){
    log(2, "end script function");
    Orion.WalkTo(982, 3428, Player.Z(), 0, 255, 1);
    Orion.Wait(100);
    Orion.PauseScript();
}

function distance(point1, point2){
    var dx = point1.X() - point2.X();
    var dy = point1.Y() - point2.Y();
    return Math.sqrt(dx*dx + dy*dy);
}

function convertTime(ms) {
    var hours = Math.floor(ms / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
  
    // Format the time with leading zeros if necessary
    var formattedHours = (hours < 10) ? "0" + hours : hours.toString();
    var formattedMinutes = (minutes < 10) ? "0" + minutes : minutes.toString();
    var formattedSeconds = (seconds < 10) ? "0" + seconds : seconds.toString();
  
    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}
  

var chopped = [], history = [], lastTree = null, currentTree = null;

const items = {
    logs    : '0x1BDD',
    boards  : '0x1BD7',
    axes    : '0xF47|0xF4B|0xF45|0xF43|0x13FB|0x1443|0x13B0|0xF49',
    harvest : '0x3191|0x2F5F|0x318F|0x3190|0x5738' // fungi, switch, bark, plant, shards
};

const harvestTypes = [
    {Name: 'ordinary',          Color: 0x0000, Graphic: items['logs']},
    {Name: 'oak',               Color: 0x07DA, Graphic: items['logs']},
    {Name: 'yew',               Color: 0x04A8, Graphic: items['logs']},
    {Name: 'ash',               Color: 0x04A7, Graphic: items['logs']},
    {Name: 'heartwood',         Color: 0x04a9, Graphic: items['logs']},
    {Name: 'bloodwood',         Color: 0x04AA, Graphic: items['logs']},
    {Name: 'frostwood',         Color: 0x04AE, Graphic: items['logs']},
    {Name: 'switch',            Color: 0x0000, Graphic: 0x2F5F},
    {Name: 'parasitic plant',   Color: 0x0000, Graphic: 0x3190},
    {Name: 'bark fragment',     Color: 0x0000, Graphic: 0x318F},
    {Name: 'luminescent fungi', Color: 0x0000, Graphic: 0x3191},
    {Name: 'crystal shards',    Color: 0x0000, Graphic: 0x5738},
    {Name: 'brilliant amber',   Color: 0x0035, Graphic: 0x3199},
];

const color = {
    green 	: {light: '0x0046', norm: '0x0044', dark: '0x00A7'},
    blue	: {light: '0x0064', norm: '0x0062', dark: '0x00C5'},
    red		: {light: '0x0028', norm: '0x0026', dark: '0x0089'},
    orange	: {light: '0x002D', norm: '0x002B', dark: '0x008E'},
    purple	: {light: '0x001E', norm: '0x0017', dark: '0x007A'},
    yellow	: {light: '0x0037', norm: '0x0035', dark: '0x0098'},
    white	: {light: '0x7FA',  norm: '0x7EE',  dark: '0x7E2' }
};

function findHostiles(_internal){
    var enemies = Orion.FindTypeEx(any, any, ground, 'mobile|live|ignoreself|human', 24, 'criminal|enemy|murderer');
    var hostile = enemies.length ? enemies[0].Name() : Player.Hits('%') < 90 ? "Low Health" : false;
    return hostile;
}

function checkAnimal(_internal){
    var pet = Orion.FindObject('animal');
    if(!pet) return;
    while(pet.WarMode()){
        log(2, "pet fighting");
        Orion.Say("All follow me");
        Orion.Wait(1500);
        mount();
        secureDrop();
    }
    if(pet.Distance() > 2){
        var distance = pet.Distance();
        log(2, "pet falling behind");
        Orion.Wait(2000);
        if(pet.Distance() < distance){
            log(2, "pet is following");
            return;
        }
        
        Orion.Say("All follow me");
        Orion.Wait(5000);
        if(pet && pet.Distance() == distance){
            log(2, "pet cant follow, approaching");
            walkTo(pet.X(), pet.Y(), 1, 20000);
            mount();
        }
    }
}