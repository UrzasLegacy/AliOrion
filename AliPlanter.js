var plantGraphics = '0x0CA5|0x0CA9';
var gardenPlotGraphics = '0x4B22|0x4B23|0x4B24|0x4B25|0x4B26|0x4B27|0x4B28|0x4B29|0x4B2A';
var seedGraphic = '0x0DCF'
var resourceGraphics = '0x0F42|0x4022|0x5736|0x0DCF|0x0F81'
var fertileDirtGraphic = '0x0F81';
var dirtMoundGraphic = '0x0913'
var clipperGraphic = '0x0DFD|0x0DFC';
var teleTiles = '0x1820|0x181F|0x181E|0x181D';

var mainGumpID = '0x00007492';
var subGumpID = '0x000056CE';
var plantSeedGumpID = '0x000023BB';
var setDecorativeGumpID = '0x0000A5B6';

function AliPlanter()
    {
    Orion.ClearBadLocations();
    StoreAndRestock();
    while(Player.Z() > -83)
        GoDownFloor()
    for(var i = -83;i<-22;i+=20)
        {
        Orion.ClearBadLocations();
        while(Player.Z() != i)
            GoUpFloor();
        HarvestPlants();
        PlantEmptyPlots();
        }
    }

function HarvestPlants()
    {
    CloseAllGumps();
    Orion.SetSearchArea(1380,1352,1399,1371);
    var grownPlants = Orion.FindTypeEx(plantGraphics,any,ground,'',24).filter(function(plant)
        {
        var plantZ = plant.Z();
        var playerZ = Player.Z();
        return plantZ > playerZ && plantZ < playerZ + 10;
        }).sort(function(a,b)
            {
            return a.Distance() - b.Distance();
            });
    Orion.ResetSearchArea();
    if(grownPlants.length == 0)
        return;
    for(var i=0;i<grownPlants.length;i++)
        {
        StoreAndRestock();
        Orion.SetBadLocation(1389, 1361);
        Orion.SetBadLocation(1389, 1360);
        Orion.SetBadLocation(1382, 1369);
        var plant = grownPlants[i];
        var plantSerial = plant.Serial();
        var plantX = plant.X();
        var plantY = plant.Y();
        while(Orion.GetDistance(plantX,plantY) > 3)
            {
            P('Walking to plant');
            Orion.WalkTo(plantX,plantY,plant.Z(),3);
            Orion.Wait(100);
            }
        while(!Orion.GumpExists('generic',plantSerial))
            {
            Orion.UseObject(plantSerial);
            Orion.Wait(1000);
            }
        PressGumpButton(mainGumpID,1);
        while(ParseSubGump().seedMin > 0)
            PressGumpButton(subGumpID,6,500);
        while(ParseSubGump().resourceMin > 0)
            PressGumpButton(subGumpID,8,500);
        var parse = ParseSubGump();
        if(parse.seedMax == 0 && parse.resourceMax == 0)
            {    
            PressGumpButton(subGumpID,2,500);
            PressGumpButton(setDecorativeGumpID,1,500);
            ClipPlants();
            }
        else
            {
            Orion.SetSearchArea(plantX,plantY,plantX,plantY)
            var plot = Orion.FindTypeEx('0x4B22|0x4B23|0x4B24|0x4B25|0x4B26|0x4B27|0x4B28|0x4B29|0x4B2A',any,ground,'',20).filter(function(plot)
                {
                return plot.Z() == Player.Z()
                })[0]
            Orion.ResetSearchArea();
            Orion.Ignore(plantSerial);
            if(plot)
                Orion.Ignore(plot.Serial());
            }
        CloseAllGumps()
        }
    }

function PlantEmptyPlots()
    {
    CloseAllGumps();
    StoreAndRestock(true);
    Orion.SetSearchArea(1380,1352,1399,1371);
    var emptyPlots = Orion.FindTypeEx('0x4B22|0x4B23|0x4B24|0x4B25|0x4B26|0x4B27|0x4B28|0x4B29|0x4B2A',any,ground,'',20).filter(function(plot)
        {
        var plotX = plot.X();
        var plotY = plot.Y();
        var plotZ = plot.Z();
        Orion.SetSearchArea(plotX,plotY,plotZ + 10,plotX,plotY,plotZ + 1);
        var occupied = Orion.FindType(any,any,ground,'item',20).length;
        Orion.ResetSearchArea();
        return plotZ == Player.Z() && occupied == 0;
        }).sort(function(a,b)
        	{
        	return a.Distance() - b.Distance();
        	});
    Orion.ResetSearchArea();
    for(var i=0;i<emptyPlots.length;i++)
        {  
        StoreAndRestock(true);
        Orion.SetBadLocation(1389, 1361);
        Orion.SetBadLocation(1389, 1360);
        Orion.SetBadLocation(1382, 1369);
        CloseAllGumps();
        var plot = emptyPlots[i];
        var plotSerial = plot.Serial();
        var plotX = plot.X();
        var plotY = plot.Y();
        while(Orion.GetDistance(plotX,plotY) > 10)
            {
            Orion.WalkTo(plotX,plotY,Player.Z(),10);
            Orion.Wait(100);
            }
        var seedSerial = Orion.FindType(seedGraphic)[0];
        if(!seedSerial)
            StoreAndRestock(true);
        while(!Orion.GumpExists('generic',seedSerial))
            {
            P('Planting seed');
            Orion.UseObject(seedSerial);
            if(Orion.WaitForTarget(3000))
                {
                Orion.TargetObject(plotSerial)
                Orion.Wait(1300);
                }
            Orion.Wait(10);
            }
        PressGumpButton(plantSeedGumpID,1);
        }
    CloseAllGumps();
    }

function StoreAndRestock(seeds)
    {  
    if(seeds && Orion.Count(seedGraphic) < 5)
        Orion.Wait(1);
    else if(Player.MaxWeight() - Player.Weight() > 20 && Orion.FindType(clipperGraphic).length >= 5 && Orion.Count(fertileDirtGraphic) >= 180)
        return;
    P('Putting stuff away and restocking');
    Orion.ClearBadLocations();
    var startX = Player.X();
    var startY = Player.Y();
    var startZ = Player.Z();
    while(Player.Z() > -83)
        GoDownFloor()
    var supplyContainer = Orion.FindTypeEx('0x0E75',any,ground,'item',24).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Supplies');
        })[0];
    if(!supplyContainer)
        {
        while(Orion.GetDistance(1388,1369) > 2)
            {
            Orion.WalkTo(1388,1369)
            Orion.Wait(300);
            }
        supplyContainer = Orion.FindTypeEx('0x0E75',any,ground,'item',24).filter(function(item)
            {
            return Orion.Contains(item.Properties(), 'Supplies');
            })[0];
        if(!supplyContainer)
            return Orion.CharPrint(self,1159,'Supply container missing! Halting...');
        }
    var supplyContainerX = supplyContainer.X();
    var supplyContainerY = supplyContainer.Y();
    var supplyContainerSerial = supplyContainer.Serial();
    while(Orion.GetDistance(supplyContainerX,supplyContainerY) > 2)
        {
        Orion.WalkTo(supplyContainerX,supplyContainerY)
        Orion.Wait(300);
        }
    while(!Orion.GumpExists('container',supplyContainerSerial))
        {
        P('Opening container')
        Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var storeItem = Orion.FindType(resourceGraphics)[0];
    while(storeItem)
        {
        P('Putting stuff away');
        Orion.MoveItem(storeItem,0,supplyContainerSerial);
        Orion.Wait(1300);
        storeItem = Orion.FindType(resourceGraphics)[0];
        }
    var clippers = Orion.FindType(clipperGraphic,any,supplyContainerSerial)[0];
    if(!clippers)
        return P('Out of clippers! Halting...');
    while(Orion.FindType(clipperGraphic).length < 5 && clippers)
        {
        P('Grabbing up to 5 clippers');
        Orion.MoveItem(clippers)
        Orion.Wait(1300);
        clippers = Orion.FindType(clipperGraphic,any,supplyContainerSerial)[0];
        }
    while(Orion.Count(fertileDirtGraphic) < 180)
        {
        P('Grabbing 1000 fertile dirt');
        Orion.MoveItemType(fertileDirtGraphic, any, supplyContainerSerial, 1000);
        Orion.Wait(1300);
        }
    while(seeds && Orion.Count(seedGraphic) < 50)
        {
        P('Grabbing 50 seeds');
        Orion.MoveItemType(seedGraphic, '0x0042', supplyContainerSerial, 50);
        Orion.Wait(1300);
        }
    while(Player.Z() != startZ)
        GoUpFloor();
    if(startX == 1389 && (startY == 1361 || startY == 1360))
        startY += 2;
    else if(startX == 1382 && startY == 1369)
        startX++;
    VerifyWalk(startX,startY);
    }

function ClipPlants()
    {
    var clippers = Orion.FindType(clipperGraphic)[0];
    if(!clippers)
        return RestockClippers();
    var plant = Orion.FindType(plantGraphics)[0];
    while(plant)
        {
        P('Clipping plant');
        Orion.UseObject(clippers);
        if(Orion.WaitForTarget(3000))
            Orion.TargetObject(plant);
        Orion.Wait(1200);
        plant = Orion.FindType(plantGraphics)[0];
        }
    }

function ParseSubGump()
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('any', subGumpID);
        if(gump !== null)
            {   
            var seed = gump.Text(1);
            var resource = gump.Text(2);
            var seedSplit = Orion.Split(seed,'/');
            var resourceSplit = Orion.Split(resource,'/');
            return {seedMin: +seedSplit[0],seedMax: +seedSplit[1],resourceMin: +resourceSplit[0],resourceMax: +resourceSplit[1]};
            }
        }
    return false;
    }

function PressGumpButton(gumpID,buttonCode,waitTime)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('any', gumpID);
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(buttonCode));
            Orion.Wait(waitTime || 200);
            return true;
            }
        }
    return false;
    }

function CloseAllGumps()
    {
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }
function cPrint(txt)
    {
    Orion.CharPrint(self,1159,txt) 
    }

function VerifyWalk(x,y,delay)
    {
    if(Orion.GetDistance(x,y) == 0)
        {
        Orion.Step('e');
        Orion.Wait(200);
        }
    var endTime = Orion.Now() + (delay || 2000);
    while(Orion.GetDistance(x,y) > 0 && Orion.Now() < endTime)
        {
        Orion.WalkTo(x,y,Player.Z(),0);
        Orion.Wait(100);
        }
    if(Orion.GetDistance(x,y) == 0)
        return true;
    return false;
    }

function GoUpFloor()
    {
    P('Going up a floor');
    var startZ = Player.Z();
    if(startZ <= -83)
        VerifyWalk(1382,1369);
    else if(Player.Z() >= -23)
        VerifyWalk(1389,1361);
    else
        VerifyWalk(1389,1360);
    while(Player.Z() == startZ)
        Orion.Wait(100);
    }

function GoDownFloor()
    {
    P('Going down a floor');
    var startZ = Player.Z();
    if(startZ <= -83)
        VerifyWalk(1389,1360);
    else
        VerifyWalk(1389,1361);
    while(Player.Z() == startZ)
        Orion.Wait(100);
    }