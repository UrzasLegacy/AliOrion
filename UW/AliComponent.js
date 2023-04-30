function NPCComponent()
	{
	Orion.WaitForAddObject('myTarget')
	var container = Orion.FindObject('myTarget')
	var containerGraphics = '0x0E77|0x0E7C|0x0E80|0x09A8|0x0E7E|0x0E3C|0x0E3F|0x0E3E|0x09AB|0x0E41|0x0E3D|0x09A9|'
	var lockpick = Orion.FindType(0x14FB)[0];
	//var container = Orion.FindTypeEx(containerGraphics,any,ground,'item',2).filter(function(item)
	//	{
	//	return true// !Orion.Contains(item.Properties(),'Contents')
	//	})[0];
	if(lockpick && container)
		{
		var containerSerial = container.Serial();
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
		while(!Orion.GumpExists('container',containerSerial))
			{
			Orion.UseObject(containerSerial);
			Orion.Wait(1100);
			}
        var component = true;
        var stealable = Orion.FindTypeEx('0x142B|0x4CDA|0x142A|0x4CD9|0x2D61|0x4CD8',any,containerSerial)[0];
        if(!stealable)
            {
            stealable = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
                {
                return Orion.Contains(item.Properties(),'Weight: 1 S');
                })[0]
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
                Orion.UseSkill('Stealing');
                if(Orion.WaitForTarget(2000))
                    {
                    Orion.TargetObject(stealableSerial)
                    var startTime = Orion.Now();
                    var endTime = startTime + 1000;
                    var journal = Orion.WaitJournal("You successfully steal the item.|You fail to steal the item|This item is too heavy to steal from someone's backpack.|This does not appear to be locked.",startTime,endTime,'sys|item')
                    if(journal && journal.Text() == "You successfully steal the item." || journal.Text() == "This does not appear to be locked.")
                        check = true;
                    }
                Orion.Wait(1000);
                }
            if(component)
                {
                var itemProps = stealable.Properties();
                while(!Orion.Contains(itemProps,'insured'))
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
                    itemProps = stealable.Properties();
                    }
                }
            Orion.CloseGump('container',containerSerial);
            watchcontainer(containerSerial)
            }
		}
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

var containerArr = 
    {
    'X:Y:Z': true,
    }