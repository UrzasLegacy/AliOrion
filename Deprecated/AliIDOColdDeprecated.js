
function SubPetBallPlacer()
    {
    var hook = '1060433841111695410';
    var key = 'THDHA-UrLnAcuDpmbbKmRDQyCWCcEqcUhMwp1gOsJjVUSGEfqPjS4RwlmrK6VjEt1jzL';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var categoryCode = houseButtons[0];
    var houseCode = houseButtons[1];
    Shared.AddVar('categoryCode',categoryCode);
    Shared.AddVar('houseCode',houseCode);
    var coordX = houseTargetCoords[0];
    var coordY = houseTargetCoords[1];
    Shared.AddVar('coordX',coordX);
    Shared.AddVar('coordY',coordY);
    
    var tool = Orion.FindType('0x14F6')[0];
    if(!tool)
        return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
    if(Shared.GetVar('PlacementTimer') == false);
        Shared.AddVar('PlacementTimer', Orion.Now())
    var closeGump = Orion.GetGump(any);
    while(closeGump)
        {
        Orion.Print('Closing gump: ' + closeGump.ID());
        closeGump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
        closeGump = Orion.GetGump(any);
        }
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var i = 65000;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime)
        {
        create = Orion.CreateUdpServer('DomPetBall', ++i);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + i);
    Orion.Wait(2000);
    if(fullAuto)
        {
        Orion.CharPrint(self,1159,'Waiting 10 seconds before sending Start signal...')
        Orion.Wait(10000);
        Orion.UdpSend(60000,'Start');
        }
    Orion.ClearJournal('attempted to place a house too many times recently.');
    Orion.Exec('KeepUpHouseTarget',true);
    while(true) 
        {
        var recv = Orion.UdpRecv('DomPetBall');
        if(recv)
            {
            var placeX = Shared.GetVar('coordX',coordX);
            var placeY = Shared.GetVar('coordY',coordY);
            Orion.TargetTile('any', placeX, placeY, 0);
            var startTime = Orion.Now();
            Orion.PauseScript('KeepUpHouseTarget');
            var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
            while(!gump && Orion.Now() < startTime + 2000 && !Orion.InJournal('This is an invalid location.', 'sys', '0', any, startTime))
                {
                Orion.Print('Catching gump');
                Orion.Wait(1);
                gump = Orion.GetGump(any, '0x000001EC');
                }
            if(gump)
                gump.Select(Orion.CreateGumpHook(1));
            var endTime = Orion.Now();
            var check = Orion.WaitJournal('gold has been removed from your bank box.', startTime, Orion.Now() + 2000);
            if(!check && placeRepeatedlyOnFailure)
                {
                var outStr = Player.Name() + '\nPetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime - startTime) + 'ms\nFirst try failed! Trying again';
                Orion.HttpPost(bot,'content=' + outStr);
                }
            while(!check && placeRepeatedlyOnFailure)
                {
                Orion.CharPrint(self,1159,'Trying to place again...');
                HouseTarget();
                Orion.TargetTile('any', coordX, coordY, 0);
                var startTime2 = Orion.Now();
                var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
                while(!gump && Orion.Now() < startTime2 + 1000)
                    {
                    Orion.Print('Catching gump');
                    Orion.Wait(10);
                    gump = Orion.GetGump(any, '0x000001EC');
                    }
                if(gump)
                    {
                    gump.Select(Orion.CreateGumpHook(1));
                    check = Orion.WaitJournal('gold has been removed from your bank box.', startTime2, Orion.Now() + 1500);
                    }
                else if(Orion.InJournal('attempted to place a house too many times recently.', 'sys', '0', 'any'))
                    {
                    endTime2 = Orion.Now();
                    break;
                    }
                endTime2 = Orion.Now();
                Orion.Wait(100);
                }
            Orion.Wait(5000);
            break;
            }
        Orion.Wait(1);
        }
    if(startTime2)
        var outStr = Player.Name() + '\npetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime2 - startTime2) + 'ms';
    else
        var outStr = Player.Name() + '\npetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime - startTime) + 'ms';
    var signObj = Orion.FindTypeEx(any,any,ground,'item',16).filter(function(item)
        {
        var itemProps = item.Properties();
        return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, Player.Name());
        })[0];
    if(check && signObj)
        outStr += '\n**Success!**';
    else
        outStr += '\n**Failed**';
    var placementTimer = Shared.GetVar('PlacementTimer',0);
    if(placementTimer)
        {
        var ms = startTime - placementTimer;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        outStr += '\nTime to Place: ' + time;
        }
    Orion.HttpPost(bot,'content=' + outStr);
    Orion.Wait(2000);
    Orion.UdpSend(60000, Player.Name());
    Orion.Wait(2000);
    Orion.RemoveAllUdpServers();
    // if(fullAuto)
    //     Orion.CloseUO();
    Orion.Terminate('all');
    }

function SubPetBallPlacerCastle()
    {
    var hook = '1060433841111695410';
    var key = 'THDHA-UrLnAcuDpmbbKmRDQyCWCcEqcUhMwp1gOsJjVUSGEfqPjS4RwlmrK6VjEt1jzL';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var categoryCode = houseButtons[0];
    var houseCode = houseButtons[1];
    Shared.AddVar('categoryCode',categoryCode);
    Shared.AddVar('houseCode',houseCode);
    var coordX = houseTargetCoords[0];
    var coordY = houseTargetCoords[1];
    Shared.AddVar('coordX',coordX);
    Shared.AddVar('coordY',coordY);
    
    var tool = Orion.FindType('0x14F6')[0];
    if(!tool)
        return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
    if(Shared.GetVar('PlacementTimer') == false);
        Shared.AddVar('PlacementTimer', Orion.Now())
    var closeGump = Orion.GetGump(any);
    while(closeGump)
        {
        Orion.Print('Closing gump: ' + closeGump.ID());
        closeGump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
        closeGump = Orion.GetGump(any);
        }
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var i = 65000;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime)
        {
        create = Orion.CreateUdpServer('DomPetBall', ++i);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + i);
    Orion.Wait(2000);
    if(fullAuto)
        {
        Orion.CharPrint(self,1159,'Waiting 10 seconds before sending Start signal...')
        Orion.Wait(10000);
        Orion.UdpSend(60000,'Start');
        }
    Orion.ClearJournal('attempted to place a house too many times recently.');
    Orion.Exec('KeepUpHouseTarget',true);
    while(true) 
        {
        var recv = Orion.UdpRecv('DomPetBall');
        if(recv)
            {
            var placeX = Shared.GetVar('coordX',coordX);
            var placeY = Shared.GetVar('coordY',coordY);
            Orion.TargetTile('any', placeX, placeY, 0);
            var startTime = Orion.Now();
            Orion.PauseScript('all');
            var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
            while(!gump && Orion.Now() < startTime + 2000 && !Orion.InJournal('This is an invalid location.', 'sys', '0', any, startTime))
                {
                Orion.Print('Catching gump');
                Orion.Wait(1);
                gump = Orion.GetGump(any, '0x000001EC');
                }
            if(gump)
                gump.Select(Orion.CreateGumpHook(1));
            var endTime = Orion.Now();
            var check = Orion.WaitJournal('gold has been removed from your bank box.', startTime, Orion.Now() + 2000);
            if(!check && placeRepeatedlyOnFailure)
                {
                var outStr = Player.Name() + '\npetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime - startTime) + 'ms\nFirst try failed! Trying again';
                Orion.HttpPost(bot,'content=' + outStr);
                }
            while(!check && placeRepeatedlyOnFailure)
                {
                Orion.CharPrint(self,1159,'Trying to place again...');
                HouseTarget();
                Orion.TargetTile('any', coordX, coordY, coordZ);
                var startTime2 = Orion.Now();
                var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
                while(!gump && Orion.Now() < startTime2 + 1000)
                    {
                    Orion.Print('Catching gump');
                    Orion.Wait(10);
                    gump = Orion.GetGump(any, '0x000001EC');
                    }
                if(gump)
                    {
                    gump.Select(Orion.CreateGumpHook(1));
                    check = Orion.WaitJournal('gold has been removed from your bank box.', startTime2, Orion.Now() + 1500);
                    }
                else if(Orion.InJournal('attempted to place a house too many times recently.', 'sys', '0', 'any'))
                    {
                    endTime2 = Orion.Now();
                    break;
                    }
                endTime2 = Orion.Now();
                Orion.Wait(100);
                }
            Orion.Wait(5000);
            break;
            }
        Orion.Wait(1);
        }
    if(startTime2)
        var outStr = Player.Name() + '\npetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime2 - startTime2) + 'ms';
    else
        var outStr = Player.Name() + '\npetBall Ping: ' + recv + 'ms\nPlace Ping: ' + (endTime - startTime) + 'ms';
    var signObj = Orion.FindTypeEx(any,any,ground,'item',16).filter(function(item)
        {
        var itemProps = item.Properties();
        return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, Player.Name());
        })[0];
    if(check && signObj)
        outStr += '\n**Success!**';
    else
        outStr += '\n**Failed**';
    var placementTimer = Shared.GetVar('PlacementTimer',0);
    if(placementTimer)
        {
        var ms = startTime - placementTimer;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        outStr += '\nTime to Place: ' + time;
        }
    Orion.HttpPost(bot,'content=' + outStr);
    Orion.Wait(2000);
    Orion.UdpSend(60000, Player.Name());
    Orion.Wait(2000);
    Orion.RemoveAllUdpServers();
    // if(fullAuto)
    //     Orion.CloseUO();
    Orion.Terminate('all');
    }

function SubPetBallChecker()
    {
    Orion.Exec('StayHidden',true);
    Orion.Exec('GMJournalScan',true);
    var petBall = Orion.FindTypeEx(any).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Crystal Ball of Pet Summoning')
        })[0];
    if(petBall) var petBallSerial = petBall.Serial();
    if(!petBallSerial)
        return Orion.CharPrint(self,1159,'No petBall found! Halting...');
    while(!Orion.BuffExists('Animal Form'))
        {
        Orion.Cast('Animal Form');
        if(Orion.WaitForGump(5000))
            {
            var gump = Orion.GetGump('any', '0x00002336');
            if(gump !== null)
                {
                var buttons = gump.ButtonList().filter(function(button)
                    {
                    return Orion.Contains(button, 'buttontileart');
                    }).length;
                gump.Select(Orion.CreateGumpHook(98 + buttons));
                Orion.Wait(200);
                }
            }
        Orion.Wait(500);
        }
    var gump = Orion.GetGump(any);
    while(gump)
        {
        Orion.Print('Closing gump: ' + gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
        gump = Orion.GetGump(any);
        }
    Orion.RemoveAllUdpServers();
    var port = 60000;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime) 
        {
        create = Orion.CreateUdpServer('DomPetBall', ++port);
        Orion.Wait(10);
        }
    Orion.Print('Port: ' + port);
    Orion.Wait(2000);
    while(true)
        {
        var recv = Orion.UdpRecv('DomPetBall');
        if(recv)
            {
            Orion.Print('Sending Report');
            Orion.UdpSend(60000, port + ':' + Player.Name());
            break;
            }
        Orion.Wait(500);
        }
    while(true) 
        {
        var recv = Orion.UdpRecv('DomPetBall');
        if(recv)
            {
            var startTime = Orion.Now();
            //var time = Orion.Time();
            Orion.UseObject(petBallSerial);
            var check = Orion.WaitJournal('You cannot use this in your current form.|You cannot use this while mounted.|You cannot cast spells here.', startTime, Orion.Now() + 1000, 'sys|item')
            if(check)
                {
                if(check.Text() == 'You cannot use this in your current form.')
                    {
                    for(var i=65001;i<65010;i++)
                        {
                        Orion.UdpSend(i,Orion.Now() - startTime);
                        }
                    Orion.RemoveAllUdpServers();
                    break;
                    }
                }
            if(recv == 'removeudp')
                {
                Orion.RemoveAllUdpServers();
                Orion.Terminate('all');
                }
            }
        Orion.Wait(1);
        }
    Orion.Wait(500);
    if(fullAuto)
        {
        Orion.Wait(Orion.Random(1,25) * 200);
        Orion.CloseUO();
        }
    }

 function DomPetBall()
    {
    Orion.Exec('StayHidden',true);
    Orion.Exec('GMJournalScan',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('DomPetBall', 60000);
    if(create == 0)
        Orion.Print('Server Creation Success');
    else
        return Orion.Print('Server Creation Fail');
    while(fullAuto && !Orion.UdpRecv('DomPetBall'))
        {
        Orion.Wait(500);
        }
    for(var i=60001;i<60051;i++)
        {
        Orion.UdpSend(i,'R')
        Orion.Wait(10);
        }
    Orion.Wait(2000);
    var playerList = [];
    var namesStr = '';
    var recv = Orion.UdpRecv('DomPetBall');
    while(recv)
        {
        var recvSplit = Orion.Split(recv, ':');
        playerList.push(+recvSplit[0]);
        namesStr += recvSplit[1] + '\n';
        Orion.Wait(10);
        recv = Orion.UdpRecv('DomPetBall');
        }
    if(!playerList.length)
        return Orion.CharPrint(self,1159,'No Subs Connected! Halting...');
    playerList.sort(function(a,b)
        {
        return a - b;
        });
    var interval = (1250/playerList.length).toFixed(0);
    TextWindow.Open();
    TextWindow.Print('Players: ' + playerList.length + '\nInterval: ' + interval + 'ms\n' + namesStr)
    Orion.Wait(100);
    while(true)
        {
        //var timeStamp = Orion.Now();
        var player = playerList.shift()
        playerList.push(player);
        //Orion.Print(player)
        Orion.UdpSend(player, 'E')
        Orion.Wait(interval);
        var recv = Orion.UdpRecv('DomPetBall');
        if(recv)
            {
            TextWindow.Print(recv);
            break;
            }
        Orion.Print('Running');
        //Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
        }
    if(fullAuto)
        {
        Orion.Wait(Orion.Random(1,25) * 200);
        Orion.CloseUO();
        }
    }
   

function IDOCBarrels()
 	{
    Orion.ClientViewRange(24);
    var dragItems = '0x14F6';
 	var barrels = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, ' ', '24').filter(function(barrel)
        {
        return !Orion.Contains(barrel.Properties(),'Weight:')
        });
	if(!barrels[0])
        {
        Orion.Wait(5000);
		return IDOCBarrels();
        }
	var Wbound = barrels.sort(function(a,b){return a.X()-b.X()})[0].X();
	var Nbound = barrels.sort(function(a,b){return a.Y()-b.Y()})[0].Y();
	var Ebound = barrels.sort(function(a,b){return b.X()-a.X()})[0].X();
	var Sbound = barrels.sort(function(a,b){return b.Y()-a.Y()})[0].Y();
	if(castleMode)
		{
		Nbound = Sbound - 29;
		Ebound = Wbound + 29;
		}
    var startX = Wbound - 1;
    var startY = Sbound - 2;
	Orion.ClearFakeMapObjects();
	var i = 0;
	Orion.GetTilesInRect('land', Wbound+1, Nbound+1, Ebound-1, Sbound-1)
    	.concat(Orion.GetTilesInRect('land', Wbound, Sbound-2, Wbound, Sbound-2))
      		.forEach(function(tile) 
      			{
           		Orion.AddFakeMapObject(i++, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
				});
	Orion.Wait(100);
    while(!Player.Dead()) //grey barrel color 0x09C4, brown 0x0000
    	{
        Orion.SetSearchArea(Wbound, Sbound-2, Wbound, Sbound-2);
	    var barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea();
        if(!barrel)
            break;
        var cancelCheck = false;
        var startSearchTime = Orion.Now() + 10000;
        var searchFlag = true;
        while(barrel.Exists() && barrel.Color() != '0x0000')
            {
            if(Orion.GetDistance(startX,startY) > 0)
                Orion.WalkTo(startX,startY,0,0,255,0);
            Orion.Wait(1000);
            if(searchFlag && Orion.Now() > startSearchTime)
                {
                Orion.SetSearchArea(Wbound+1, Nbound+1, Ebound-1, Sbound-1);
                var barrelInside = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
                Orion.ResetSearchArea();
                if(!barrelInside)
                    {
                    cancelCheck = true;
                    break;
                    }
                searchFlag = false;
                }
            }
        if(cancelCheck)
            break;
        Shared.AddVar('PlacementTimer', Orion.Now());
        if(Orion.GetDistance(startX,startY) > 0)
            Orion.WalkTo(startX,startY,0,0,255,1);
        else
            Orion.Attack(barrel.Serial());
        Orion.Wait(250);
        if(!Orion.Dragging())
            Orion.DragItemType('0x14F6');
        }
    if(Orion.Dragging())
        Orion.DropDraggedItem();
    while(!Player.Dead())
        {
        if(cancelCheck)
            break;
        Orion.SetSearchArea(Wbound+1, Nbound+1, Ebound-1, Sbound-1);
	    barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea()
        if(!barrel)
            break;
        if(barrel.Distance() > 1)
            Orion.WalkTo(barrel.X(), barrel.Y(), 0, 1, 255, 1);
        Orion.Attack(barrel.Serial());
        Orion.Wait(200);
        //Orion.Exec('DropGarbageHere',true);
	 	}
    if(Orion.Dragging())
        Orion.DropDraggedItem();
    while(!Player.Hidden())
        {
        Orion.UseSkill('Hiding');
        Orion.Wait(1000);
        }
    if(relogAccounts && !fullAuto)
        RelogAccountToDifferentShard();
    if(walkToFront)
        {
        var frontX = startX + 6;
        var frontY = startY + 4
        var endTime = Orion.Now() + 20000;
        while(Orion.GetDistance(frontX,frontY) > 0 && Orion.Now() < endTime)
            {
            Orion.WalkTo(frontX,frontY,0,0,255,0);
            Orion.Wait(500);
            }
        }
    else
        {
        var endTime = Orion.Now() + 20000;
        while(Orion.GetDistance(startX,startX) > 0 && Orion.Now() < endTime)
            {
            Orion.WalkTo(startX,startY,0,0,255,0);
            Orion.Wait(500);
            }
        }
	Orion.Wait(1000);
    if(fullAuto)
        {
        Orion.Wait(2000);
        if(Orion.Contains(Player.Properties(),placerName))
            {
            var frontX = startX + 6;
            var frontY = startY + 4
            var endTime = Orion.Now() + 20000;
            while(Orion.GetDistance(frontX,frontY) > 0 && Orion.Now() < endTime)
                {
                Orion.WalkTo(startX + 6,startY + 4,0,0,255,0);
                Orion.Wait(500);
                }
            Orion.Exec('SubPetBallPlacer');
            }
        else
            Orion.Exec('SubPetBallChecker');
        }
    else
        Gump();
    if(limitViewRange)
        Orion.ClientViewRange(5);
	}
