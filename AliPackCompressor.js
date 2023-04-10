function Move62()
    {
    Orion.CharPrint(self,1159,'Target source container')
    Orion.WaitForAddObject('myTarget');
    var sourceContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target destination container')
    Orion.WaitForAddObject('myTarget');
    var destinationContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(sourceContainer)
    VerifyOpenContainer(destinationContainer)
    while(Orion.FindType(any,any,sourceContainer).length > 62 && Orion.FindType(any,any,destinationContainer).length < 62)
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
    GetAllSubContainers(container)
    }

var subContainersArr = [];
function GetAllSubContainers(containerSerial)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    Orion.MoveGump('container', 0, 0, containerSerial);
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var bool = Orion.Contains(item.Properties(),'Contents: ');
        return bool;
        });
    if(!subContainers.length)
        Orion.PauseScript('all');
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllSubContainers(subContainer.Serial());
        }
    Orion.CloseGump('container',containerSerial);
    return subContainersArr;
    }