//#include Ali/AliGumpHUD.js
// Nested pouches one tile south, containers to PUT things west of character, containers to PULL things from to the east
// Start helper, then compressor

var itemsPerContainer = 110;

var gumpAssets = 
[
    [ ['toggle','AliCompressor','Compressor'], ['toggle','AliCompressorHelper','Helper'] ],
    [ ['toggle','ConsolidateItems','ConsolidateItems'], ['toggle','EggMover6000','MoveEggs'], ['toggle','CountReadyBackpacks','CountReady'],],
    [ ['toggle','NestContainerZero','NestPouches'], ['toggle','DropHere','DropHere'] ],
];
function ControlsGump()
    {
    AliGumpRenderer()
    }
//----------------------
var itemGraphic = any//'0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18';
var pouchGraphic = '0x0E79';
var backpackGraphic = '0x0E75';

function CountReadyBackpacks()
    {
    var playerX = Player.X()
    var containers = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        return Orion.Contains(item.Properties(),'Contents: ' + itemsPerContainer) && item.X() < playerX
        });
    Orion.Print(containers.length)
    }

function AliCompressor()
    {
    var backpackSerial = Orion.GetSerial(backpack);
    var startPouchX = Player.X();
    var startPouchY = Player.Y() + 1;
    var startPouch = Orion.FindType(pouchGraphic,any,ground,'item',("xyz: " + startPouchX + ',' + startPouchY))[0];
    if(!startPouch)
        return Orion.CharPrint(self,1159,'Start pouch missing!');
    VerifyOpenContainer(startPouch);
    var bagNegative = Orion.FindType(pouchGraphic,any,startPouch)[0];
    if(!bagNegative)
        return Orion.CharPrint(self,1159,'Bag Negative missing!');
    VerifyOpenContainer(bagNegative);
    var bagZero = Orion.FindType(pouchGraphic,any,startPouch)[0];
    if(!bagZero)
        return Orion.CharPrint(self,1159,'Bag Zero missing!');
    var subPouches = GetAllSubPouches(bagZero);
    while(true)
        { 
        var currentPouch = subPouches.pop();
        if(!currentPouch)
            {
            Orion.UdpSend(42420,'bloop');
            return Orion.CharPrint(self,1159,'Out of pouches to fill');
            }
        while(Orion.FindType(any,any,currentPouch).length == 1)
            Orion.Wait(100);
        while(Orion.FindType(any,any,currentPouch).length == 0)
            {
            var loadBackpack = Orion.FindTypeEx(backpackGraphic,any,ground,'item',2).filter(function(backpack)
                {
                return Orion.Contains(backpack.Properties(), 'Contents: ' + itemsPerContainer)
                })[0];
            if(!loadBackpack)
                {
                Orion.UdpSend(42420,'bloop');
                return Orion.CharPrint(self,1159,'Out of backpacks to load');
                }
            var loadBackpackSerial = loadBackpack.Serial();
            while(Orion.GetContainer(loadBackpackSerial) != backpackSerial)
                {
                Orion.CharPrint(loadBackpackSerial,1159,'Retrieving backpack from ground to load');
                Orion.WaitContextMenuID(loadBackpackSerial, 1012);
                Orion.RequestContextMenu(loadBackpackSerial);
                Orion.Wait(1300);
                Orion.Print('Serial of Load Container: ' + Orion.GetContainer(loadBackpackSerial) + '\nSerial of Player Backpack' + backpackSerial + '\nSerial of Load' + loadBackpackSerial)
                }
            Orion.CharPrint(self,1159,'Moving backpack to current pouch');
            Orion.MoveItem(loadBackpackSerial,0,currentPouch);
            Orion.Wait(1300);
            //Orion.CloseGump('container',currentPouch);
            }
        Orion.Wait(100);
        }
    }

function AliCompressorHelper()
    { //floats bags for the main character
    var startPouchX = Player.X();
    var startPouchY = Player.Y() + 1;
    var startPouch = Orion.FindType(pouchGraphic,any,ground,'item',("xyz: " + startPouchX + ',' + startPouchY))[0];
    if(!startPouch)
        return Orion.CharPrint(self,1159,'Start pouch missing!');
    VerifyOpenContainer(startPouch);
    var bagNegative = Orion.FindType(pouchGraphic,any,startPouch)[0];
    if(!bagNegative)
        return Orion.CharPrint(self,1159,'Bag Negative missing!');
    VerifyOpenContainer(bagNegative);
    var bagZero = Orion.FindType(pouchGraphic,any,startPouch)[0];
    if(!bagZero)
        return Orion.CharPrint(self,1159,'Bag Zero missing!');
    Orion.RemoveAllUdpServers();
    var port = 42420;
    var create = Orion.CreateUdpServer('Compressor', port);
    if(create != 0)
        return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
    subContainersArr = []
    var subPouches = GetAllSubPouches(bagZero);
    var endIndex = subPouches.length - 1;
    while(true)
        {
        if(endIndex < 0)
            return;
        var currentPouch = subPouches[endIndex--];
        while(Orion.FindType(any,any,currentPouch).length == 0)
            {
            Orion.Wait(1300);
            if(Orion.UdpRecv('Compressor'))
                {
                Orion.DropDraggedItemRelative(0,0);
                return Orion.CharPrint(self,1159,'Finished!');
                }
            }
        Orion.Wait(500)
        while(Orion.Dragging())
            {
            Orion.DropDraggedItemRelative(0,0);
            Orion.Wait(1300);
            }
        if(Orion.UdpRecv('Compressor'))
            {
            Orion.DropDraggedItemRelative(0,0);
            return Orion.CharPrint(self,1159,'Finished!');
            }
        var floatPouchCheck = Orion.FindType(any,any,currentPouch)[0];
        while(!floatPouchCheck)
            {
            if(Orion.UdpRecv('Compressor'))
                {
                Orion.DropDraggedItemRelative(0,0);
                return Orion.CharPrint(self,1159,'Finished!');
                }
            Orion.Wait(100);
            floatPouchCheck = Orion.FindType(any,any,currentPouch)[0];
            }
        if(Orion.UdpRecv('Compressor'))
            {
            Orion.DropDraggedItemRelative(0,0);
            return Orion.CharPrint(self,1159,'Finished!');
            }
        Orion.DragItem(currentPouch)
        Orion.Wait(500)
        }
    }

function ConsolidateItems()
    {
    var playerX = Player.X();
    var containers = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        return Orion.Contains(item.Properties(),'Contents: ')
        });
    var containersPut = containers.filter(function(container)
        {
        var contents = +((container.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
        return container.X() < playerX && contents < itemsPerContainer;
        }).sort(function(a,b)
            {
            var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            return bContents - aContents;
            });
    var containersPull = containers.filter(function(container)
        {
        var contents = +((container.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
        return container.X() > playerX && contents > 0;
        }).sort(function(a,b)
            {
            var aContents = +((a.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            var bContents = +((b.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            return aContents - bContents;
            });
    if(containersPut.length == 0)
            return Orion.CharPrint(self,1159,'Out of containers to put things into!')
    if(containersPull.length == 0)
            return Orion.CharPrint(self,1159,'Out of containers to pull things from!')
    while(containersPut.length && containersPull.length)
        {
        Orion.Print('test1')
        var currentPut = containersPut[0];
        var currentPull = containersPull[0];
        var currentPutContents = +((currentPut.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
        var currentPullContents = +((currentPull.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
        while(
            currentPutContents < itemsPerContainer 
            && currentPullContents > 0
            )
            {
                Orion.Print('test2')
            var currentPutSerial = currentPut.Serial();
            var currentPullSerial = currentPull.Serial();
            VerifyOpenContainer(currentPullSerial);
            VerifyOpenContainer(currentPutSerial);
            Orion.MoveItemType(itemGraphic, any, currentPullSerial, 0, currentPutSerial);
            Orion.Wait(1200);
            currentPutContents = +((currentPut.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            currentPullContents = +((currentPull.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            }
        containersPut = containers.filter(function(container)
            {
            var contents = +((container.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            return container.X() < playerX && contents < itemsPerContainer;
            });
        containersPull = containers.filter(function(container)
            {
            var contents = +((container.Properties().match(/Contents: (\d+)/) || [])[1] || '0');
            return container.X() > playerX && contents > 0 && contents != itemsPerContainer;
            });  
        Orion.Wait(100)
        }
    }

function Move80()
    {
    Orion.CharPrint(self,1159,'Target source container')
    Orion.WaitForAddObject('myTarget');
    var sourceContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target destination container')
    Orion.WaitForAddObject('myTarget');
    var destinationContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(sourceContainer)
    VerifyOpenContainer(destinationContainer)
    while(Orion.FindType(any,any,destinationContainer).length < 80)
        {
        Orion.MoveItemType('any', 'any', sourceContainer, 0, destinationContainer);
        Orion.Wait(1100);
        }
    }

function DropHere()
    {
    Orion.DropDraggedItemRelative(0,0);
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

function OpenAll()
    {
    Orion.WaitForAddObject('myTarget')
    var container = Orion.GetSerial('myTarget')
    var a = GetAllSubPouches(container)
    Orion.Print(a.length)
    var b = Orion.FindObject(a[40])
    Orion.Print(b.Properties())
    }

var subContainersArr = [];
function GetAllSubPouches(containerSerial)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    Orion.MoveGump('container', 0, 0, containerSerial);
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(pouchGraphic,any,containerSerial).filter(function(item)
        {
        var bool = Orion.Contains(item.Properties(),'Contents: ');
        return bool;
        });
    var backPackCheck = Orion.FindType(backpackGraphic,any,containerSerial)[0];
    if(backPackCheck)
        return subContainersArr;
    // if(!subContainers.length)
    //     Orion.PauseScript('all');
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllSubPouches(subContainer.Serial());
        }
    return subContainersArr;
    }

function NestContainerZero()
    {
    while(true)
        {
        var pouchesEmpty = Orion.FindTypeEx(pouchGraphic).filter(function(pouch)
            {
            return Orion.Contains(pouch.Properties(), 'Contents: 0/')
            })
        var pouchFull = Orion.FindTypeEx(pouchGraphic).filter(function(pouch)
            {
            return !Orion.Contains(pouch.Properties(), 'Contents: 0/')
            })[0];
        if(pouchesEmpty.length == 0)
            return
        if(!pouchFull)
            pouchFull = pouchesEmpty.shift();
        Orion.MoveItem(pouchFull.Serial(),0,pouchesEmpty[0].Serial())
        Orion.Wait(1100);
        }
    }