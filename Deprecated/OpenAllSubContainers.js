var subContainersArr = [];
function GetAllSubContainers(containerSerial)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var bool = Orion.Contains(item.Properties(),'Contents: ');
        return bool;
        });
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllSubContainers(subContainer.Serial());
        }
    Orion.CloseGump('container',containerSerial);
    return subContainersArr;
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
