var priceThreshold = 3000000;

function ASCIIInput()
    {
	 var text = " /'-| Imperatrix |-'\\     ";
//var text = '\n _____| | Imperatrix ______\n|/_/_/| | ____________/\n |_| PvP Gear  \n'
//var text = '\n  _______| | Imperatrix __________ \n|/_/_/_/| |_________________/\n |_| PvP Gear   \n'
    Orion.SendPrompt(text)
    }
function VSTeleRings()
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, 'Ring Teleport Charges');
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 30000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(30000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseGumps();
			return Orion.CharPrint(self,1159,'No items matched');
			}
		}
	else
		{
		CloseGumps();
		Orion.RemoveDisplayTimer('searchWait');
		return VSTeleRings();
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
	while(vendorSearchResults)
		{
		Orion.RemoveDisplayTimer('searchWait');
        Orion.Wait(200)
		vendorSearchResults = GetMaps(vendorSearchResults);
        Orion.Wait(300);
        var button = GetPageTurnButton(vendorSearchResults);
        if(!button)
            {
	        CloseGumps();
            return Orion.CharPrint(self,1159,'No more results');
            }
        vendorSearchResults.Select(Orion.CreateGumpHook(button));
        Orion.Wait(300);
        if(button == '2')
            {
            var waitTIme = 30000;
	        Orion.AddDisplayTimer('searchWait', 30000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
            }
        else
            var waitTIme = 3000;
        vendorSearchResults = WaitForSpecificGump(waitTIme, 'generic', self, '0x000F3EC9')
		}
	CloseGumps();
    Orion.RemoveDisplayTimer('searchWait');
	}

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

function GetMaps(gump)
	{
	var commandList = gump.CommandList()
	var buttons = [];
    for(var i=0;i<commandList.length;i++)
    	{
        if(commandList[i] === ' tooltip 1024234   ')
        	{
        	var price = +Orion.Split(commandList[i+2],'@')[1].trim().replace(/,/g,'');
        	var charges = +Orion.Split(commandList[i+3],'@')[1].trim();
        	if(Orion.Contains(commandList[i+4], '1043305'))
        		var button = commandList[i+5].slice(-3).trim();
        	else
        		var button = commandList[i+4].slice(-3).trim();
            var pricePerCharge = Math.floor(price / charges);
            Orion.Print('Price per charge: ' + pricePerCharge)
        	if(pricePerCharge <= priceThreshold)
                buttons.push(button);
            }
		}
	buttons.forEach(function(button)
        {
        gump.Select(Orion.CreateGumpHook(button));
        Orion.Wait(300);
        gump = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
        });
    return gump;
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
        if(nextCheck == '502')
            return nextCheck;
        }
    return false;
	}

function CloseGumps(_)
	{
	var vendorSearchResults = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC9')
	if(vendorSearchResults)
		{
		vendorSearchResults.Select(Orion.CreateGumpHook(0));
		Orion.Wait(100);
		}
	var vendorSearchGump = WaitForSpecificGump(1000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		vendorSearchGump.Select(Orion.CreateGumpHook(0));
		Orion.Wait(100);
		}
	}

function WaitForSpecificGump(delay, type, serial, id)
    {
    var deltaTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < deltaTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }