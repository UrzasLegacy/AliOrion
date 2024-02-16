function PlaceSparkles()
    {
    var backPackSerial = Orion.GetSerial(backpack);
    var x = Player.X();
    var y = Player.Y() + 1;
    var startZ = -83;
    var endZ = -69;
    var xyzString = 'xyz: ' + x + ',' + y + ',';
    var endSparkle = Orion.FindType('0x374A',any,ground,'item',xyzString + endZ)[0];
    while(!endSparkle)
        {
        for(var i=0;i<15;i++)
            {
            var currZ = startZ + i;
            var currSparkle = Orion.FindType('0x374A',any,ground,'item',xyzString + currZ)[0];
            if(currSparkle)
                continue;
            var packSparkle = Orion.FindType('0x374A')[0];
            while(Orion.GetContainer(packSparkle) == backPackSerial)
                {
                Orion.Drop(packSparkle,0,x,y,currZ);
                Orion.Wait(1300);
                }
            var startTime = Orion.Now();
            var check = Orion.InJournal('Locked down!','',0,'any',startTime,0)
            while(!check)
                {
                Orion.Say('I wish to secure this');
                
                if(Orion.WaitForTarget(2000))
                    {
                    Orion.TargetObject(packSparkle);
                    Orion.Wait(1300);
                    }
                Orion.Wait(100);
                check = Orion.InJournal('Locked down!','',0,'any',startTime,0)
                Orion.Print(check)
                }
            Orion.Wait(1300);
            Orion.CancelTarget();
            while(!currSparkle)
                {
                if(Orion.HaveTarget())
                    Orion.TargetObject(packSparkle);
                else
                    {
                    Orion.UseType('0x0FC1');
                    var gump = WaitForSpecificGump(2000, 'generic', '0x466B301A', '0x0000028C');
                    if(gump)
                        {
                        gump.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(200);
                        }
                    }
                Orion.Wait(200);
                currSparkle = Orion.FindType('0x374A',any,ground,'item',xyzString + currZ)[0];
                }
            Orion.Wait(1300);
            Orion.CancelTarget();
            }
        endSparkle = Orion.FindType('0x374A',any,ground,'item',xyzString + endZ)[0];
        }
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