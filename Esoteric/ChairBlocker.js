var brokenChairGraphic = '0x1F14'
var targetSerial = 0x003DB071;
var shadowlordGraphic = '0x02C0' 

function ChairBlocker()
	{
            Orion.ResetSearchArea();
	Orion.Print(Orion.FindType(brokenChairGraphic).length)
    if(Orion.FindType(brokenChairGraphic).length < 4)
        return Orion.CharPrint(self,1159,'Not enough broken chairs! Halting...');
	while(!Player.Dead())
		{
        var shadowlord = Orion.FindTypeEx(shadowlordGraphic,any,ground,'mobile',24)[0];
        //var shadowlord = Orion.FindObject(targetSerial);
        if(!shadowlord)
            {
            Orion.CharPrint(self,1159,'Looking for Shadowlord');
            Orion.Wait(500);
            continue;
            }
        if(CheckForChairs(shadowlord.X(),shadowlord.Y()))
            {
            Orion.Wait(500);
            Orion.CharPrint(shadowlord.Serial(),1159,'Sitting Duck')
            continue;
            //return true;
            }
        var startX = shadowlord.X();
        var startY = shadowlord.Y();
        var endTime = Orion.Now() + 10000;
        while(Orion.GetDistance(startX + 1,startY + 1) > 0 && Orion.Now() < endTime && !Player.Dead())
            {
            Orion.CharPrint(self,1159,'Walking to Shadowlord');
            Orion.WalkTo(startX + 1,startY + 1,0,0);
            Orion.Wait(100);
            }
        var chairPositions = [
            [startX - 1,startY],
            [startX,startY - 1],
            [startX + 1,startY],
            [startX,startY + 1],
            ];
        var continueCheck = false;
        for(var i=0;i<chairPositions.length;i++)
            {
            if(CheckShadowlordMovement(shadowlord.X(),shadowlord.Y(),startX,startY))
                {
                break;
                }
            var chairPosition = chairPositions[i];
            var chairX = chairPosition[0];
            var chairY = chairPosition[1];
            Orion.Print(startX + ':' + startY);
            Orion.SetSearchArea(chairX,chairY,chairX,chairY);
            var chair = Orion.FindType(brokenChairGraphic,any,ground,'item',24)[0];
            Orion.ResetSearchArea();
            Orion.Print(i)
            if(!chair)
                {
                continueCheck = true;
                Orion.CharPrint(self,1159,'Placing chair ' + (i + 1));
                Orion.DropType(brokenChairGraphic, any, backpack, 0, chairX, chairY, 0);
                Orion.Wait(1300);
                }
            if(!continueCheck)
                break;
            }
		}
	}

function CheckShadowlordMovement(shadowlordX,shadowlordY,startX,startY)
    {
    if(shadowlordX != startX || shadowlordY != startY)
        {
        var endTime = Orion.Now() + 10000
        var chair = Orion.FindType(brokenChairGraphic,any,ground,'item',2)[0];
        while(chair && Orion.Now() < endTime)
            {
            Orion.CharPrint(chair,1159,'Picking up chair');
            Orion.MoveItem(chair);
            Orion.Wait(1300);
            chair = Orion.FindType(brokenChairGraphic,any,ground,'item',2)[0];
            }
        failCheck = true;
        Orion.Print('Shadowlord Movement Detected')
        return true;
        }
    return false;    
    }

/*
look for shadowlord
note starting position
if at any point the shadowlord moves
    pick up chairs
    restart from beginning
move to shadowlord
drop chairs around shadowlord
*/

function CheckForChairs(targetX,targetY)
	{
	var north = [targetX,targetY-1];
	var east = [targetX+1,targetY];
	var south = [targetX,targetY+1];
	var west = [targetX-1,targetY];
	
	Orion.SetSearchArea(north[0],north[1],north[0],north[1]);
	var blockNorth = Orion.FindType(brokenChairGraphic,any,ground,'item',20)[0];
	Orion.SetSearchArea(east[0],east[1],east[0],east[1]);
	var blockEast = Orion.FindType(brokenChairGraphic,any,ground,'item',20)[0];
	Orion.SetSearchArea(south[0],south[1],south[0],south[1]);
	var blockSouth = Orion.FindType(brokenChairGraphic,any,ground,'item',20)[0];
	Orion.SetSearchArea(west[0],west[1],west[0],west[1]);
	var blockWest = Orion.FindType(brokenChairGraphic,any,ground,'item',20)[0];
	Orion.ResetSearchArea();
	if(blockNorth && blockEast && blockSouth && blockWest)
		return true;
	return false;
	}