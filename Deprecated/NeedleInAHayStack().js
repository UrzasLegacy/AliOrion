function NeedleInAHayStack()
    {
    var textSearch = 'Orc Chieftain';
    var containers = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item) //get all containers on the ground within 24 tiles
        {
        var itemZ = item.Z();
        var playerZ = Player.Z();
        var zCheck = itemZ >= playerZ && itemZ <= playerZ + 19
        var containerCheck = Orion.Contains(item.Properties(),'Contents: ')
        return zCheck && containerCheck;
        }).sort(function(a,b) //sort by nearest
            {
            return a.Distance() - b.Distance();
            });
    for(var i=0;i<containers.length;i++) //loop through em
        {
        var containerObj = containers[i];
        var containerSerial = containerObj.Serial();
        var containerX = containerObj.X();
        var containerY = containerObj.Y();
        var containerZ = containerObj.Z();
        VerifyWalkTo(containerX,containerY,containerZ,1);
        var subContainers = GetAllSubContainers(containerSerial);
        for(var j=0;j<subContainers.length;j++)
            {
            var subContainerSerial = subContainers[j];
            var searchItem = Orion.FindTypeEx(any,any,subContainerSerial).filter(function(item)
                {
                return Orion.Contains(item.Properties(),textSearch)
                });
            while(searchItem[0])
                {
                Orion.CharPrint(containerSerial,1159,textSearch + ' Found!')
				Orion.TestItemColor(containerSerial, 1152);
                Orion.MoveItem(searchItem[0].Serial());
                Orion.Wait(1300);
                searchItem = Orion.FindTypeEx(any,any,subContainerSerial).filter(function(item)
                    {
                    return Orion.Contains(item.Properties(),textSearch)
                    });
                }
            }
        }
    }

var subContainersArr = [];
function GetAllSubContainers(containerSerial)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var itemProps = item.Properties();
        var bool = Orion.Contains(itemProps,'Contents: ') && !Orion.Contains(itemProps,'Contents: 0/125');
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

function VerifyWalkTo(x,y,z,distance,delay)
    {
    var endTime = Orion.Now() + (delay || 20000);
    while(Orion.GetDistance(x,y) > (distance || 0))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.WalkTo(x,y,z,(distance || 0));
        Orion.Wait(100);
        }
    return true;
    }