/*
Combine and Commodify Resources
Written by Ali
August 1, 2022

Commodifier Call Variants:
    Commodifier(stackSize);
    Commodifier(stackSize, useCommodityDeeds);
    Commodifier(stackSize, useCommodityDeeds, useSpecificArray);
Arguments:
    stackSize: integer. Size of stacks to create.
    useCommodityDeeds: boolean. Use commodity deed on complete stacks. Default value: true.
    useSpecificArray: array [[graphicId, colorId]]. If this is specified, only items included in the array will be combined. Default: false. Everything is combined

Commodifier will first Combine everything to the stackSize you set and then use a commodity deed on any stacks that meet the stackSize.
You must have commodity deeds in either your bank or the commodity deed box you target if useCommodityDeeds is true.
*/

function CommodifyEverything60k()
    { //will combine stacks to 60k and then use a commodity deed on the stack
    Commodifier(60000);
    }

function CombineEverything60k()
    { //will combine stacks to 60k without using a commodity deed on the stack
    Commodifier(60000, false);
    }

function CommodifyEverything10k()
    {
    Commodifier(10000);
    }

function CombineEverything10k()
    {
    Commodifier(10000, false);
    }

function CombineSpecificItemsArrayExample()
    {
    var itemArr = [
        //[graphicId, colorId]
        ['0x1BF2', '0x0000'], //iron ingot
        ['0x1BF2', '0x0973'], //dull copper ingot
        ['0x1BF2', '0x0966'], //shadow iron ingot
        ['0x1BF2', '0x0972'], //bronze ingot
        ['0x1BF2', '0x096D'], //copper ingot
        ['0x1BF2', '0x08A5'], //gold ingot
        ['0x1BF2', '0x0979'], //agapite ingot
        ['0x1BF2', '0x089F'], //verite ingot
        ['0x1BF2', '0x08AB'], //valorite ingot
    ];
    Commodifier(10000, false, itemArr); //will combine everything in the array to stacks of 10,000 without using a commodity deed on them
    }

function MoveCommodityDeeds()
	{ //Easily move large amounts of filled or unfilled commodity deeds from one container to another
    Orion.CharPrint(self,1159,"Peaceful = unfilled deeds\nWarmode = filled deeds");
    Orion.CharPrint(self,1159,"Select 'From' container\nPress Escape to select Bank");
    var fromCheck = Orion.WaitForAddObject('myTarget');
    if(fromCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var fromContainer = Player.BankSerial();
        }
    else if(fromCheck == 1)
        {
        var fromContainer = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', fromContainer))
            {
            Orion.UseObject(fromContainer);
            Orion.Wait(1300);
            }
        }
    Orion.CharPrint(self,1159,"Select 'To' container\nPress Escape to select Bank");
    var toCheck = Orion.WaitForAddObject('myTarget');
    if(toCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var toContainer = Player.BankSerial();
        }
    else if(toCheck == 1)
        {
        var toContainer = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', toContainer))
            {
            Orion.UseObject(toContainer);
            Orion.Wait(1300);
            }
        }
    do
        {
        var colorString = Player.WarMode() ? '0x0592' : '0x0047';
        commodity = Orion.FindType('0x14F0',colorString,fromContainer)[0];
        Orion.MoveItem(commodity,0,toContainer);
        Orion.Wait(1300);
        } while(commodity)
	}

//Helper Functions
function Commodifier(stackSize,useCommodityDeeds,useSpecificArray)
    {
    if(useCommodityDeeds == undefined)
        useCommodityDeeds = true;
    Orion.CharPrint(self,1159,"Select container\nPress Escape to select Bank");
    var fromCheck = Orion.WaitForAddObject('myTarget');
    if(fromCheck == 0)
        {
        while(!Orion.GumpExists('container', Player.BankSerial()))
            {
            Orion.Say('bank');
            Orion.Wait(1300);
            }
        var container = Player.BankSerial();
        }
    else if(fromCheck == 1)
        {
        var container = Orion.GetSerial('myTarget');
        while(!Orion.GumpExists('container', container))
            {
            Orion.UseObject(container);
            Orion.Wait(1300);
            }
        }
    if(useSpecificArray)
        {
        for(var i=0;i<useSpecificArray.length;i++)
            {
            var item = useSpecificArray[i];
            var itemGraphic = item[0];
            var itemColor = item[1];
            Combine(itemGraphic,itemColor,container,stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    else
        {
        var itemHash = {};
        var items = Orion.FindTypeEx(any,any,container);
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            var graphicColorPair = item.Graphic() + ':' + item.Color();
            itemHash[graphicColorPair] = true;
            }    
        for(graphicColor in itemHash)
            {
            var graphicColorSplit = Orion.Split(graphicColor, ':');
            var itemGraphic = graphicColorSplit[0];
            var itemColor = graphicColorSplit[1];
            Combine(itemGraphic, itemColor, container, stackSize);
            if(useCommodityDeeds)
                Commodify(itemGraphic, itemColor, container, stackSize);
            }
        }
    }

function Combine(graphicSerial, colorCode, containerSerial, stackCount)
	{
    var itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
        {
        var itemCount = item.Count();
        return itemCount > 1 && itemCount > stackCount;
        });
    while(itemOverstacked[0])
        {
        Orion.MoveItem(itemOverstacked[0].Serial(), stackCount, containerSerial, 0, 0);
        Orion.Wait(1300);
        itemOverstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            var itemCount = item.Count();
            return itemCount > 1 && itemCount > stackCount;
            });
        }
	var itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
		{
        var itemCount = item.Count();
		return itemCount > 1 && itemCount < stackCount;
		});
	while(itemUnderstacked[1])
		{
		var neededCount = stackCount - itemUnderstacked[0].Count();
		Orion.MoveItem(itemUnderstacked[1].Serial(), neededCount, itemUnderstacked[0].Serial())
		Orion.Wait(1300);
		itemUnderstacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
			{
            var itemCount = item.Count();
            return itemCount > 1 && itemCount < stackCount;
			});
		}
	}

function Commodify(graphicSerial, colorCode, containerSerial, stackCount)
    {
    var itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
		{
		return item.Count() == stackCount;
		})[0];
    while(itemStacked)
        {
        var commodityDeed = Orion.FindTypeEx('0x14F0','0x0047',containerSerial)[0];
        if(!commodityDeed)
            return false;
        while(Orion.Contains(commodityDeed.Properties(), 'Unfilled'))
            {
            Orion.UseObject(commodityDeed.Serial());
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(itemStacked.Serial());
            Orion.Wait(1300);
            }
        itemStacked = Orion.FindTypeEx(graphicSerial, colorCode, containerSerial).filter(function(item)
            {
            return item.Count() == stackCount;
            })[0];
        }
    }