function TeleportChargeCounter()
    {
    Orion.CharPrint(self,1159,'Target container full of rings');
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', container))
        {
        Orion.UseObject(container);
        Orion.Wait(1300);
        }
    var rings = Orion.FindTypeEx(any,any,container).filter(function(ring)
        {
        return Orion.Contains(ring.Properties(), 'Ring') && Orion.Contains(ring.Properties(), 'Teleport Charges:')
        });
    var charges = rings.reduce(function(sum, current)
        {
        var currentCharges = +((current.Properties().match(/Teleport Charges: (\d+)/) || [])[1] || 0);
        return sum + currentCharges;
        }, 0);
    Orion.Print('Total charges: ' + charges);
    Orion.Print('Average charges per ring: ' + (charges/rings.length));
    }