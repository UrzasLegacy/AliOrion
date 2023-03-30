function VendorRepricer()
    {
    var adjAmount = .9; //multiply current price by this to get adjusted price
    Orion.CancelWaitPrompt();
    if(Orion.PromptExists())
        Orion.SendPrompt(' ');
    Orion.CharPrint(self,1159,'Choose vendor or container to deprice')
    Orion.WaitForAddObject('myTarget');
    var containerSerial = Orion.GetSerial('myTarget');
    var containerObj = Orion.FindObject(containerSerial);
    if(containerObj.Mobile())
    	var vendorContainer = Orion.ObjAtLayer('backpack', containerSerial).Serial();
    else
    	var vendorContainer = containerSerial
    while(!Orion.GumpExists('container', vendorContainer))
        {
        Orion.UseObject(vendorContainer)
        Orion.Wait(1300);
        }
    var items = Orion.FindTypeEx(any,any, vendorContainer);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i];
        var priceString = (item.Properties().match(/Price: ([\d,]+)/) || [])[1];
        if(!priceString)
            continue;
        var itemSerial = item.Serial();
        var itemX = item.X();
        var itemY = item.Y();
        var priceNumber = +priceString.replace(/,/g, '');
        var adjPrice = Math.floor(priceNumber * adjAmount);
        Orion.Print(item.Name());
        Orion.Print(priceNumber + ' -> ' + adjPrice);
        Orion.MoveItem(itemSerial);
        Orion.Wait(1300);
        Orion.WaitPrompt(adjPrice);
        Orion.Wait(700);
        Orion.MoveItem(itemSerial, 0, vendorContainer, itemX, itemY);
        Orion.Wait(700);	
        Orion.CancelWaitPrompt();
        if(Orion.PromptExists())
            Orion.SendPrompt(' ');
        Orion.Wait(700);
        }
    }