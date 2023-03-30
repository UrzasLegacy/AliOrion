function BuyFromPlayerVendor()
    {
    var propertyString = 'of the Archlich';
    var priceThreshold = 1800000;
    Orion.WaitForAddObject('myTarget')
    var vendorBackpackSerial = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('Container',vendorBackpackSerial))
    	{
	    Orion.UseObject(vendorSerial);
	    Orion.Wait(1300)
	    }
    var items = Orion.FindTypeEx(any,any,vendorBackpackSerial).filter(function(item)
    	{
    	var itemProps = item.Properties();
        var itemPrice = +((itemProps.match(/Price: ([\d,]+)/) || [])[1] || '').replace(/,/g,'');
    	return Orion.Contains(itemProps, propertyString) && itemPrice && itemPrice <= priceThreshold;
    	});
    Orion.Print('Items Found: ' + items.length);
    for(var i=0;i<items.length;i++)
    	{
    	var item = items[i];
    	var itemSerial = item.Serial();
		Orion.WaitContextMenuID(itemSerial, 608);
    	Orion.RequestContextMenu(itemSerial);
		if (Orion.WaitForGump(2000))
			{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E60'))
				{
				gump0.Select(Orion.CreateGumpHook(2));
				Orion.Wait(100);
				}
			}
		Orion.Wait(1300);
    	}
    }

function TurnIns()
	{ //BE VERY CAREFUL! WILL TURN IN EVERY DROP IN YOUR BACKPACK AND SUBCONTAINERS. Open turn in gump and start script
	while(true)
		{
        if(Orion.WaitForGump(2000))
			{
			var gump = Orion.GetGump('last');
			if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00002336'))
				{
                gump.Select(Orion.CreateGumpHook(100));
				Orion.Wait(100);
				}
			}
		else
			break;
		}
	}