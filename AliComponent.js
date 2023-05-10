function initScripts()
    {
    Orion.Exec('ComponentTraveler',true);
    Orion.Exec('Recover',true);
    }
    function test()
	{
	Orion.ClearBadLocations()
	AliWalkTo(Player.X() - 10,Player.Y())
	}
function ComponentTraveler()
    {
    var portal = {X: 1064,Y: 509};
    var portalArr = ['Britain','Jhelom','Moonglow','Ocllo','Serpent','Skara','Trinsic','Vesper', 'Yew']
    var containerArrCopy = JSON.parse(JSON.stringify(containerArr));
    while(true)
        {
        for(var i=0;i<portalArr.length;i++)
            {
            var loc = portalArr[i];
            if(Orion.GetDistance(portal.X,portal.Y) > 150)
                {
                while(!Player.Hidden())
                    {
                    Orion.Cast('Invisibility');
                    if(Orion.WaitForTarget(5000))
                        Orion.TargetObject(self);
                    Orion.Wait(500);
                    }
                RecallByGump('Main','Portal');
                AliWalkTo(portal.X,portal.Y);
                }
            else
                AliAtlas(portal.X,portal.Y,'Malas');
            var tempX = Player.X();
            var tempY = Player.Y();
            while(Player.X() == tempX && Player.Y() == tempY)
                {
                Orion.SayWhisper('fel ' + loc + ' mint');
                Orion.Wait(1000);
                }
            var nearbyContainers = containerArr.filter(function(container)
                {
                return Orion.GetDistance(container[0],container[1]) < 500;
                }).sort(function(a,b)
                    {
                    return Orion.GetDistance(a[0],a[1]) - Orion.GetDistance(b[0],b[1]);
                    });
            SetBadLocations();
            for(var j=0;j<nearbyContainers.length;j++)
                {
                var container = nearbyContainers[j];
                AliWalkTo(container[0],container[1],0,1);
                var foundContainerSerial = Orion.FindType(container[3],any,ground,'item','xyz: ' + container[0] + ',' + container[1] + ','+ container[2])[0];
                if(foundContainerSerial)
                    {
                    ComponentContainer(foundContainerSerial)
                    Orion.Wait(1000);
                    }
                }
            
            }
        Orion.Wait(100);
        }
    }

function Recover()
    {
    var healerArr =
        [
        [1477,1611], //britain
        [2248,1229], //voidpool trade
        [4397,1089], //moonglow
        [3747,1309], //nujelm
        [1915,2815], //trinsic
        [2995,3442], //serpents hold
        [1411,3793], //jhelom
        [2928,854], //vesper
        [2707,2153], //bucs den
        [2578,604], //minoc
        [624,2226], //skara brae
        [3627,2617], //ocllo
        [544,966], //yew
        ]
    
    
    var poisoned;
    var hurt;
    while(true)
        {
        while(!Player.Dead())
            {
            poisoned = false;
            hurt = false;
            if(Player.Poisoned())
                {
                poisoned = true;
                if(!Orion.HaveTarget())
                    {
                    Orion.PauseScript('ComponentTraveler');
                    Orion.Cast('Cure');
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(self)
                    Orion.Wait(200);
                    }
                }
            else if(Player.Hits('%') < 80)
                {
                hurt = true;
                if(!Orion.HaveTarget())
                    {
                    Orion.PauseScript('ComponentTraveler');
                    Orion.Cast('Heal');
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(self)
                    Orion.Wait(200);
                    }
                }
            if(!poisoned && !hurt && Orion.ScriptRunning('ComponentTraveler') < 0)
                Orion.ResumeScript('ComponentTraveler');
            Orion.Wait(200);
            }
        var deathX = Player.X();
        var deathY = Player.Y();
        Orion.Exec('AutoRes',true)
        Orion.PauseScript('ComponentTraveler');
        Orion.Wait(500);
        while(Player.Dead())
            {
            var closestHealer = healerArr.sort(function(a,b)
                {
                return Orion.GetDistance(a[0],a[1]) - Orion.GetDistance(b[0],b[1]);
                })[0];
            Orion.WalkTo(closestHealer[0],closestHealer[1],0,0);
            var healer = Orion.FindTypeEx(any,any,ground,'live',24).filter(function(mob)
                {
                var mobProperties = mob.Properties();
                return Orion.Contains(mobProperties, 'Healer') && !Orion.Contains(mobProperties,'Quest Giver');
                });
            if(!healer.length)
                {
                Orion.CharPrint(self,1159,'No healer found!');
                continue;
                }
            Orion.WalkTo(healer[0].X(),healer[0].Y());
            WalkToRadiusBorder(healer[0].Serial(),6);
            Orion.Wait(5000);
            }
        AliWalkTo(deathX,deathY);
        while(!Orion.ObjAtLayer('Ring'))
            {
            var corpse = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                return Orion.Contains(item.Properties(), 'corpse')
                });
            for(var i=0;i<corpse.length;i++)
                {
                AliWalkTo(corpse[i].X(),corpse[i].Y(),0,1);
                Orion.UseObject(corpse[i].Serial());
                Orion.Wait(1300);
                }
            }
        while(!Orion.ObjAtLayer('Mount'))
            {
            var ethy = Orion.FindTypeEx(any).filter(function(item)
                {
                return Orion.Contains(item.Properties(),'Mount Hue');
                })[0];
            if(ethy)
                {
                while(!Orion.ObjAtLayer('Mount'))
                    {
                    Orion.UseObject(ethy.Serial());
                    Orion.Wait(1000);
                    }
                break;
                }
            else
                {
                var horse = Orion.FindTypeEx(any,any,ground,'live',24).filter(function(mob)
                    {
                    return mob.CanChangeName();
                    })[0];
                Orion.Say('all follow me');
                if(horse)
                    {
                    if(horse.Distance() > 2)
                        Orion.WalkTo(horse.X(),horse.Y())
                    Orion.UseObject(horse.Serial());
                    Orion.Wait(1300);
                    }
                }
            Orion.Wait(2000);
            }
        var endTime = Orion.Now() + 120000;
        var guardCheck = Orion.FindTypeEx(any,any,ground,'live',15).filter(function(mob)
            {
            return Orion.Contains(mob.Properties(),'Guard')
            });
        var guardCount = guardCheck.length;
        while(guardCheck.length == guardCount && Orion.Now() < endTime)
            {
            Orion.CharPrint(self,1159,'Waiting for guards to leave...');
            Orion.Wait(1000);
            guardCheck = Orion.FindTypeEx(any,any,ground,'live',15).filter(function(mob)
                {
                return Orion.Contains(mob.Properties(),'Guard');
                });
            }
        Orion.Wait(200);
        Orion.ResumeScript('ComponentTraveler');
        }
    }

function AutoRes()
    {
    while(Player.Dead())
        {
        var gump = Orion.GetGump('any','0x000008AF');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(2));
            Orion.Wait(200);
            }
        Orion.Wait(1000);
        }
    }

function StayHidden()
    {
    var startX = Player.X();
    var startY = Player.Y();
    while(!Player.Dead() && Player.X() == startX && Player.Y() == startY)
        {
        if(!Orion.BuffExists('hiding'))
            {
            AttackNearest();
            Orion.Wait(1000);
            Orion.UseSkill('Hiding');
            }
        Orion.Wait(250);
        }
    }
    
function SetBadLocations(_)
    {
    Orion.SetBadLocation(1409,3824);
    Orion.SetBadLocation(1414,3827);
    Orion.SetBadLocation(1419,3832);
    }

function WalkToRadiusBorder(targetSerial, distance) 
    {
    var target = Orion.FindObject(targetSerial)
    if(target) 
        {
        var x = target.X();
        var y = target.Y();
        var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
            .filter(function(tile) 
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                return (x == (tileX - distance))
                || (x == (tileX + distance))
                || (y == (tileY - distance))
                || (y == (tileY + distance));
                }).sort(function (a,b) 
                    {
                    return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y())
                    });
        tiles.forEach(function(tile,ind)
            {
            Orion.AddFakeMapObject(ind + 40000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            })
        for(var i=0;i<tiles.length;i++)
            {             
            var closest = tiles[i]; 
            Orion.AddFakeMapObject(55555, '0x051A', 32, closest.X(), closest.Y(), closest.Z());
            if(Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0))
                break;
            }
        }
    }

function singleContainer()
    {
    ComponentContainer()
    }

function ComponentContainer(containerSerial)
	{
    if(containerSerial == undefined)
        {
        Orion.WaitForAddObject('myTarget');
        var container = Orion.FindObject('myTarget');
        if(!container)
            {
            return
            }
        var containerSerial = container.Serial()
        }
    else
        var container = Orion.FindObject(containerSerial)
    if(!container)
        return Orion.CharPrint(self,1159,'Missing container!')
    Orion.Print(container.X() + ',' + container.Y())
    if(Orion.Contains(container.Properties(),'Contents'))
        return;
	var lockpick = Orion.FindType(0x14FB)[0];
    if(!lockpick)
        return Orion.CharPrint(self,1159,'Missing lockpicks!');
    Orion.ClearJournal('It appears to be locked.');
    var check = false;
    while(!check)
        {
        AliWalkTo(container.X(),container.Y(),0,1);
        Orion.UseObject(lockpick)
        if(Orion.WaitForTarget(2000))
            {
            Orion.TargetObject(containerSerial)
            var startTime = Orion.Now();
            var endTime = startTime + 1000;
            var journal = Orion.WaitJournal("The lock quickly yields to your skill.|This does not appear to be locked.|You are unable to pick the lock.",startTime,endTime,'sys|item')
            if(journal && (journal.Text() == "The lock quickly yields to your skill." || journal.Text() == "This does not appear to be locked."))
                check = true;
            }
        Orion.Wait(1000);
        }
    while(!Orion.GumpExists('container',containerSerial))
        {
        AliWalkTo(container.X(),container.Y(),0,1);
        if(Orion.InJournal('It appears to be locked.'))
            {
            var check = false;
            while(!check)
                {
                Orion.UseObject(lockpick)
                if(Orion.WaitForTarget(2000))
                    {
                    Orion.TargetObject(containerSerial)
                    var startTime = Orion.Now();
                    var endTime = startTime + 1000;
                    var journal = Orion.WaitJournal("The lock quickly yields to your skill.|This does not appear to be locked.|You are unable to pick the lock.",startTime,endTime,'sys|item')
                    if(journal && (journal.Text() == "The lock quickly yields to your skill." || journal.Text() == "This does not appear to be locked."))
                        check = true;
                    }
                Orion.Wait(1000);
                }
            }
        Orion.UseObject(containerSerial);
        Orion.Wait(1100);
        }
    var component = true;
    var stealable = Orion.FindTypeEx('0x142B|0x4CDA|0x142A|0x4CD9|0x2D61|0x4CD8',any,containerSerial)[0];
    if(!stealable)
        {
        var npcCheck = Orion.FindType(any,any,ground,'live|inlos',8).length;
        var itemWeight = 'Weight: 1 S';
        for(var i=0;i<10;i++)
            {
            var stones = 10 - i;
            if(i >= npcCheck)
                itemWeight += '|Weight: ' + stones + ' Stones';
            }
        Debug('NPCs: ' + npcCheck + ', Weights: ' + itemWeight);
        stealable = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
            {
            return Orion.Contains(item.Properties(),itemWeight);
            })[0];
        component = false;
        } 
    if(!stealable)
        return Orion.CharPrint(self,1159,'Nothing to steal!')
    else
        {
        var check = false;
        var stealableSerial = stealable.Serial();
        while(!check)
            {
            AliWalkTo(container.X(),container.Y(),0,1);
            Orion.UseSkill('Stealing');
            if(Orion.WaitForTarget(2000))
                {
                Orion.TargetObject(stealableSerial)
                var startTime = Orion.Now();
                var endTime = startTime + 1000;
                var journal = Orion.WaitJournal("You successfully steal the item.|You can't steal that.|You fail to steal the item|This item is too heavy to steal from someone's backpack.|This does not appear to be locked.",startTime,endTime,'sys|item')
                if(journal && journal.Text() == "You successfully steal the item.")
                    check = true;
                else if(journal && journal.Text() == 'You can\'t steal that.')
                    return ComponentContainer(containerSerial);
                }
            Orion.Wait(1000);
            }
        TimerContainer(containerSerial);
        Orion.CloseGump('container',containerSerial);
        if(component)
            {
            while(!Orion.Contains(stealable.Properties(),'insured'))
                {
                Orion.RequestContextMenu(self);
                Orion.WaitContextMenuID(self, 418);
                if(Orion.WaitForTarget(2000))
                    {
                    Orion.TargetObject(stealableSerial)
                    Orion.WaitForTarget(2000);
                    if(Orion.HaveTarget())
                        Orion.CancelTarget();
                    }
                Orion.Wait(500);
                }
            }
        }
	}

function Debug(msg)
    {
    if(false)
        return;
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print(Orion.Time() + ': ' + msg);
    }

function TimerContainer(serial)
    {
    Orion.AddDisplayTimer(serial, 10000000, 'AboveChar','Line');
    Orion.DisplayTimerSetObject(serial,serial)
    }

function watchcontainer(serial)
    {
    var ms, date, timeStr, startTime = Orion.Now();
    if(serial == undefined)
        {
        Orion.WaitForAddObject('myTarget');
        serial = Orion.GetSerial('myTarget');
        }
    var container = Orion.FindObject(serial)
    while (Orion.Contains(container.Properties(),'Contents:'))
        {
        ms = Orion.Now() - startTime;
        date = new Date(ms);
        timeStr = date.toISOString().substring(11, 23);
        var gump = Orion.CreateCustomGump(420);
        gump.Clear()
        gump.AddResizepic(0, 0, '0x0BB8', 100, 25);
        gump.AddText(10, 3, '0', timeStr);
        gump.Update();
        Orion.Wait(100);
        }
    TextWindow.Open();
    TextWindow.Print(timeStr);
    }

function MoveComponents()
    {
    
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    var stealable = Orion.FindType('0x142B|0x4CDA|0x142A|0x4CD9|0x2D61|0x4CD8')[0];
    while(stealable)
        {
        Orion.MoveItem(stealable,0,toContainer);
        Orion.Wait(1100);
        stealable = Orion.FindType('0x142B|0x4CDA|0x142A|0x4CD9|0x2D61|0x4CD8')[0];
        }
    }

function GetContainerInfo()
    {
    Orion.WaitForAddObject('myTarget');
    var container = Orion.FindObject('myTarget');
    if(!TextWindow.IsOpened())
        TextWindow.Open()
    TextWindow.Print("'" + container.X() + ':' + container.Y() + ':' + container.Z() + "': '" + container.Graphic() + "',")
    }

function getnearbycontainers()
    {
    var nearbyContainers = containerArr.filter(function(container)
        {
        return Orion.GetDistance(container[0],container[1]) < 500;
        }).sort(function(a,b)
            {
            return Orion.GetDistance(a[0],a[1]) - Orion.GetDistance(b[0],b[1]);
            });
    Orion.Print(nearbyContainers.length)
    nearbyContainers.forEach(function(cont)
        {
        Orion.Print(cont[0]+ ',' + cont[1])
        Orion.WalkTo(cont[0],cont[1])
        Orion.Wait(1000)
        })
    }

var containerArr =
    [
    [1421, 1547, 36, '0x09A8'],
    //[2213, 1165, 6, '0x09A8'],
    //[1432, 1608, 26, '0x09A8'],
    //[4384, 1111, 6, '0x0E80'],
    //[3544, 1197, 0, '0x0E7C'],
    [3019, 3424, 15, '0x09AB'],
    [3011, 3424, 15, '0x0E41'],
    //[1352, 3757, 8, '0x0E80'],
    //[1442, 3718, 6, '0x0E80'],
    [2842, 792, 6, '0x09A8'],
    [2864, 848, 6, '0x09A8'],
    //[2637, 2084, 10, '0x0E77'],
    //[2637, 2085, 10, '0x0E77'],
    // [1437, 1597, 20, '0x0E7D'],
    // [1437, 1596, 20, '0x0E3C'],
    // [1437, 1595, 20, '0x09A9'],
    // [1437, 1595, 23, '0x0E7E'],
    // [1437, 1595, 25, '0x0E7E'],
    // [1437, 1594, 20, '0x0E7E'],
    // [1437, 1594, 22, '0x0E7E'],
    // [1430, 1592, 20, '0x0E77'],
    // [1430, 1592, 25, '0x0E77'],
    // [1429, 1592, 30, '0x0E77'],
    // [1429, 1592, 25, '0x0E77'],
    // [1429, 1592, 20, '0x0E77'],
    [1432, 3824, 6, '0x0E80'],
    //[2507, 474, 21, '0x0E80'],
    [4408, 1089, 6, '0x0E80'],
    //[2938, 3500, 10, '0x0E7D'],
    //[2936, 3502, 10, '0x0E7C'],
    //[2936, 3505, 10, '0x0E7C'],
    [625, 2161, 6, '0x0E80'],
    [634, 2160, 3, '0x0E3C'],
    [634, 2160, 0, '0x0E3C'],
    [635, 2160, 7, '0x0E3C'],
    [636, 2159, 3, '0x0E3E'],
    [636, 2159, 0, '0x0E3E'],
    [636, 2161, 0, '0x09A9'],
    [634, 2161, 3, '0x0E3C'],
    [634, 2161, 0, '0x0E3C'],
    [635, 2162, 7, '0x0E3E'],
    [635, 2163, 6, '0x0E7E'],
    [634, 2163, 0, '0x09A9'],
    [1466, 1691, 0, '0x0E7C'],
    [1553, 1657, 32, '0x09A8'],
    [4456, 1063, 6, '0x0E80'],
    [1359, 3782, 6, '0x09A8'],
    [1452, 4000, 6, '0x09A8'],
    [2960, 624, 6, '0x0E80'],
    [2839, 880, 6, '0x09A8'],
    [562, 1008, 6, '0x09A8'],
    [3013, 3402, 15, '0x0E3D'],
    [3012, 3406, 15, '0x0E77'],
    [3012, 3402, 15, '0x0E3D'],
    [3012, 3401, 15, '0x0E3D'],
    [3012, 3401, 18, '0x0E3D'],
    [3011, 3401, 15, '0x0E3D'],
    [3011, 3401, 18, '0x0E3D'],
    [3011, 3400, 15, '0x0E3D'],
    //[3012, 3406, 15, '0x0E77'],
    //[2520, 521, 6, '0x09A8'],
    [3664, 2584, 6, '0x09A8'],
    [3641, 2596, 6, '0x09A8'],
    [2918, 806, 0, '0x0E3D'],
    [2918, 806, 3, '0x0E3D'],
    [2918, 806, 6, '0x0E3D'],
    [2918, 806, 9, '0x0E3D'],
    [2917, 806, 6, '0x0E3D'],
    [2917, 806, 3, '0x0E3D'],
    [2917, 806, 0, '0x0E3D'],
    [648, 2181, 6, '0x0E80'],
    [590, 2164, 6, '0x0E80'],
    [1984, 2838, 21, '0x09A8'],
    [1988, 2865, 26, '0x09A8'],
    [2839, 880, 6, '0x09A8'],
    [2860, 998, 6, '0x0E80'],

    ]

function AliAtlas(targetX,targetY,targetMap)
    { //[x,y,facet]
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var gateArr = 
        [//location name, facet, facet# x, y
            ['Moonglow', 'Trammel', 1, 4467, 1283],
            ['Britain', 'Trammel', 2, 1421, 1696],
            ['Jhelom', 'Trammel', 3, 1499, 3771],
            ['Yew', 'Trammel', 4, 771, 752],
            ['Minoc', 'Trammel', 5, 2701, 692],
            ['Trinsic', 'Trammel', 6, 1828, 2948],
            ['Skara Brae', 'Trammel', 7, 643, 2067],
            ['New Magincia', 'Trammel', 8, 3566, 2140],
            ['New Haven', 'Trammel', 27, 3450, 2677],
            ['Moonglow', 'Felucca', 9, 4467, 1283],
            ['Britain', 'Felucca', 10, 1421, 1696],
            ['Jhelom', 'Felucca', 11, 1499, 3771],
            ['Yew', 'Felucca', 12, 771, 752],
            ['Minoc', 'Felucca', 13, 2701, 692],
            ['Trinsic', 'Felucca', 14, 1828, 2948],
            ['Skara Brae', 'Felucca', 15, 643, 2067],
            ['New Magincia', 'Felucca', 16, 3566, 2140],
            ['Buccaneers Den', 'Felucca', 26, 2711, 2234],
            ['Compassion', 'Ilshenar', 17, 1215, 467],
            ['Honesty', 'Ilshenar', 18, 772, 1366],
            ['Honor', 'Ilshenar', 19, 744, 724],
            ['Humility', 'Ilshenar', 20, 281, 1016],
            ['Justice', 'Ilshenar', 21, 987, 1011],
            ['Sacrifice', 'Ilshenar', 22, 1174, 1286],
            ['Spirituality', 'Ilshenar', 23, 1532, 1340],
            ['Valor', 'Ilshenar', 24, 528, 216],
            ['Chaos', 'Ilshenar', 25, 1721, 218],
            ['Luna', 'Malas', 28, 1015, 527],
            ['Umbra', 'Malas', 29, 1997, 1386],
            ['Isamu-Jima', 'TerMur', 30, 1169, 998],
            ['Makoto-Jima', 'TerMur', 31, 802, 1204],
            ['Homare-Jima', 'TerMur', 32, 270, 628],
            ['Royal City', 'TerMur', 33, 850, 3525],
            ['Valley of Eodon', 'TerMur', 34, 719, 1863],
        ]
    var map = maps[Orion.ObjAtLayer('backpack').Map()]
    if(Orion.GetDistance(targetX,targetY) == 0)
        {
        Orion.CharPrint(self,1159,'Already at destination: ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(0);
        return;
        }
    if(Orion.GetDistance(targetX,targetY) < 250 && Orion.GetPathArray(targetX, targetY, 256, 0).length > 0 && map == targetMap)
        {
        Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(1);
        AliWalkTo(targetX,targetY);
        Orion.WarMode(0);
        return;
        }
    var nearestGate = gateArr.filter(function(gate){return gate[1] == map})
    	//.filter(function(gate)
    	//{
    	//return Orion.GetPathArray(gate[3], gate[4], 256, 0).length
        //return Orion.GetDistance(gate[3],gate[4]) < 1000;
        //})
        .sort(function(a,b)
        	{
	        //return Orion.GetPathArray(a[3], a[4], 256, 0).length - Orion.GetPathArray(b[3], b[4], 256, 0).length
	        return Orion.GetDistance(a[3],a[4]) - Orion.GetDistance(b[3],b[4]);
	        })[0];
    if(Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length == 0)
        {
        return RecallByGump('Main','Portal');
        }
    var destinationGate = gateArr.filter(function(gate){return gate[1] == targetMap})
        .sort(function(a,b)
        {
        return DistBetweenPoints(targetX,targetY,a[3],a[4]) - DistBetweenPoints(targetX,targetY,b[3],b[4])
        })[0];
    Orion.Print(nearestGate[1] + ' - ' + nearestGate[0] + ' ' + nearestGate[3] + ', ' + nearestGate[4] + ':' + Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length)
    Orion.Print(destinationGate[1] + ' - ' + destinationGate[0] + ' ' + destinationGate[3] + ', ' + destinationGate[4])
    Orion.WarMode(1);
    
    Orion.CharPrint(self,1159,'Walking to nearest gate');
    AliWalkTo(nearestGate[3], nearestGate[4])
    //var tempX = Player.X();
    //var tempY = Player.Y();
    while(Orion.GetDistance(destinationGate[3],destinationGate[4]) > 10)
        {
        Orion.Print('Waiting for gate gump')
        var gump = Orion.GetGump('any','0x00000258');
        if(gump !== null)
            {
            var gumpHook = Orion.CreateGumpHook(1);
            gumpHook.AddCheck(destinationGate[2], true);
            gump.Select(gumpHook);
            Orion.Wait(100);
            }
        else
            {
            var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 23);
            Orion.CharPrint(self,1159,'Searching for gate');
            if(gate[0])
                {
                Orion.CharPrint(self,1159,'Walking to gate');
                AliWalkTo(gate[0].X(), gate[0].Y());
                Orion.Wait(500);
                Orion.Resend();
                Orion.Wait(500);
                Orion.UseObject(gate[0].Serial());
                }
            else 
                {
                Orion.CharPrint(self,1159,'Walking to nearest gate');
                if(!AliWalkTo(nearestGate[3], nearestGate[4]))
                    if(!AliWalkTo(1174, 1283))
                        AliWalkTo(1016, 524);
                }
            }
        Orion.Wait(1000);
        }
    Orion.WarMode(1);
    Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
    AliWalkTo(targetX,targetY);
    Orion.WarMode(0);
    }

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }

function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn,staggerCheck)
    {//Your maxWalkingTime must be longer than the time it takes to run one chunk
    if(z === undefined) z = 0;
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 2000;
    if(pathMarkers === undefined) pathMarkers = false;
    if(staggerCheck === undefined) staggerCheck = 0;
    if(typeof startCallBackFn == 'function')
        {
        startCallBackFn();
        }
    if(staggerCheck > 0)
        Orion.CharPrint(self,1159,'Stagger: ' + staggerCheck + '/3');
    var playerX = Player.X();
    var playerY = Player.Y();
    var zeroMovement = playerX == x && playerY == y;

    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    if(pathMarkers)
        Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0 && !zeroMovement)
        return false;
    if(!zeroMovement)
        {
        var shortStop = pathTiles[pathTiles.length - 1];

        var shortX = shortStop.X();
        var shortY = shortStop.Y();
        if(pathMarkers)
            {
            pathTiles.forEach(function(tile,i)
                {
                Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
                });
            Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
            }
        if(pathTiles.length >= chunkSize)
            var chunk = pathTiles[chunkSize - 1];
        else
            var chunk = shortStop;
        var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
        if(pathMarkers)
            {
            Orion.AddFakeMapObject(10000, '0x051A', 32, x,y,z);
            Orion.AddFakeMapObject(10001, '0x051A', 32, chunkX,chunkY,chunkZ);
            }
        if(!Orion.WalkTo(chunkX,chunkY,chunkZ,0,distanceZ,run,openDoor,maxWalkingTime))
            staggerCheck++;
        else
            staggerCheck = 0;
        if(staggerCheck > 2 && Player.X() == playerX && Player.Y() == playerY)
            {
            Orion.CharPrint(self,1159,'Correcting stagger...');
            Orion.SetBadLocation(pathTiles[0].X(),pathTiles[0].Y())
            staggerCheck = 0;
            pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
            if(pathTiles.length === 0)
                return false;
            }
        Orion.Wait(1);
        }

    if(typeof endCallBackFn == 'function')
        {
        var passThroughReturn = endCallBackFn();
        }

    if(!zeroMovement && Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn,staggerCheck);
    return passThroughReturn || true;
    }

function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global scope variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X(); //noting player start position to check later to see if recall was successful
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName; //this is using Regex to find the last line of the item properties i.e., the runebook name
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return false;
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	var runebookSerial = runeBook[0].Serial();
    Orion.Wait(1300);
	Orion.UseObject(runebookSerial);
	var gump = WaitForSpecificGump(2000, 'generic', runebookSerial, '0x00000059');
	if(gump)
		{
		var runeInd = gump.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(startInd + runeInd));
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
	            })[0];
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeName);
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

function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}