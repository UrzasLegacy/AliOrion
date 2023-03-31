function BuyVendor()
    {
    Orion.WaitForAddObject('myTarget')
    var itemSerial = Orion.GetSerial('myTarget');
    Orion.WaitContextMenuID(itemSerial, 608);
    Orion.RequestContextMenu(itemSerial);
    if(Orion.WaitForGump(2000))
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