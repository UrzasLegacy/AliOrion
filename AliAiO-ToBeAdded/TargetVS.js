function SearchByTarget()
    {
    Orion.CharPrint(self,1159,'Select item for which to search');
    if(Orion.WaitForAddObject('myTarget') != 1)
        return Orion.CharPrint('Invalid selection! Halting...');
    var itemSerial = Orion.GetSerial('myTarget');
    var itemObj = Orion.FindObject(itemSerial);
    var itemName = itemObj.Name();
    var nameSplit = Orion.Split(itemName,' ');
    if(nameSplit.length > 3)
        {
        nameSplit.sort(function(a,b)
            {
            return b.length - a.length;
            });
        itemName = nameSplit[0] + ' ' + nameSplit[1] + ' ' + nameSplit[2];
        }
    Orion.Print(itemName);
    }

function VSResultTarget()
	{
    Orion.CharPrint(self,1159,'Select item for which to search');
    if(Orion.WaitForAddObject('myTarget') != 1)
        return Orion.CharPrint('Invalid selection! Halting...');
    var itemSerial = Orion.GetSerial('myTarget');
    var itemObj = Orion.FindObject(itemSerial);
    var itemName = itemObj.Name();
    var nameSplit = Orion.Split(itemName,' ');
    if(nameSplit.length > 3)
        {
        nameSplit.sort(function(a,b)
            {
            return b.length - a.length;
            });
        itemName = nameSplit[0] + ' ' + nameSplit[1] + ' ' + nameSplit[2];
        }
	TextWindow.Open();
    var resultArr = VSsearchPageTurner(itemName);
    Orion.Print(itemName + ':' + resultArr);
    if(resultArr.length)
        {
        if(resultArr[0] == 'No items matched')
            {
            TextWindow.Print(itemName + ': No items matched');
            }
        else if(resultArr[0] == 'Timed Out')
            {
            Orion.CharPrint(self,1159,'Search Timed Out, trying again...')
            }
        else
            {
            var suggestedPrice = +(resultArr[0].replace(/,/g,'')) - 1
            var resultString = suggestedPrice + ' |VS:| ';
            Orion.CopyToClipboard(suggestedPrice)
            for(var i=0;i<resultArr.length;i++)
                {
                resultString += resultArr[i];
                if(i != resultArr.length - 1) 
                    resultString += '|'
                }
            TextWindow.Print(itemName + ': ' + resultString);
            }
        }
    else
        Orion.Print('false')
	}

function VSsearch(text)
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseAllGumps();
			return ['No items matched'];
			}
		}
	else
		{
        CloseAllGumps();
		return ['Timed Out'];
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9');
	if(vendorSearchResults)
		{
		Orion.RemoveDisplayTimer('searchWait');
		var cmdList = vendorSearchResults.CommandList()
		var prices = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1043304');
			}).map(function(cmdLine)
				{
				var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
				var commaNeg = numberString.replace(/,/g, "");
				return +commaNeg
				});
		}
    //CloseAllGumps();
	return prices;
	}

function VSsearchPageTurner(text)
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseAllGumps();
			return ['No items matched'];
			}
		}
	else
		{
        CloseAllGumps();
		return ['Timed Out'];
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
    var pricesFull = [];
	while(vendorSearchResults)
		{
        Orion.RemoveDisplayTimer('searchWait');
        var cmdList = vendorSearchResults.CommandList()
        var prices = cmdList.filter(function(cmdLine)
            {
            return Orion.Contains(cmdLine, '1043304');
            }).map(function(cmdLine)
                {
                var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
                //var commaNeg = numberString.replace(/,/g, "");
                return numberString//+commaNeg
                }).forEach(function(price)
                    {
                    pricesFull.push(price);
                    });
        var button = GetPageTurnButton(vendorSearchResults);
        if(!button || button == '2')
            {     
            CloseAllGumps();
            break;
            }
        vendorSearchResults.Select(Orion.CreateGumpHook(button));
        Orion.Wait(300);
        var waitTIme = 2000;
        vendorSearchResults = WaitForSpecificGump(waitTIme, 'generic', self, '0x000F3EC9')
		}
    CloseAllGumps();
	return pricesFull;
	}

function GetPageTurnButton(gump)
	{
	var buttons = gump.ButtonList().filter(function(b)
		{
		return Orion.Contains(b,' button ') && !Orion.Contains(b, ' button 386')
		});
	if(buttons.length == 2)
		{
        var nextCheck = buttons[1].slice(-3).trim()
		if(nextCheck == '2')
			return +nextCheck;
		else
			return +buttons[0].slice(-4).trim()
		}
	else if(buttons.length == 1)
        {
        var nextCheck = +buttons[0].slice(-4).trim();
        var xPosCheck = buttons[0].slice(8,11).trim();
        if(nextCheck == '502' && xPosCheck == '430')
            return nextCheck;
        }
    return false;
	}

function WaitForSpecificGump(delay, type, serial, id)
    {
    var endTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }

function CloseAllGumps()
    {
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }