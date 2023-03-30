function MakeCandelabras()
    {
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const boxGraphic = '0x0E7D|0x09AA';
    const candelabraGraphic = '0x0A27';
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    var firstPassCandel = true;
    while(true)
        {
        //while(Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)   
        var validNearbyBox = Orion.FindTypeEx(boxGraphic,any,ground,'',2).filter(function(pouch)
            {
            if(Orion.Contains(pouch.Properties(),'Commodity'))
                return false;
            var contentsAmount = +(pouch.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
            return contentsAmount < 125;
            }).sort(function(a,b)
                {
                var aC = +(a.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                var bC = +(b.Properties().match(/Contents: (\d+)/) || [125, 125])[1];
                return bC - aC;
                })[0];
        if(validNearbyBox)
            {
            var nearbyBoxSerial = validNearbyBox.Serial();
            Orion.MoveItemType(candelabraGraphic, any, backpack, 0, nearbyBoxSerial);
            Orion.Wait(1300);
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
                while(Orion.Count(ingotGraphic, '0x0973', backpack, 0, false) < 50)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Dull Copper Ingots', ingotGraphic, supplyContainer, 50, '0x0973'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                if(!Orion.FindType(tinkerToolGraphic)[0])
                    {
                    Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                    if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                else
                    {
                    Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                    CraftItem(tinkerToolGraphic, 9003, 11);
                    }
                firstPassCandel = true;
                }
            if(Orion.Count(ingotGraphic, '0x0973', backpack, 0, false) < 50)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Dull Copper Ingots', ingotGraphic, supplyContainer, 500, '0x0973'))
                    return Orion.Terminate('all', 'GMJournalScan');
                }
            if(firstPassCandel)
                {
                CraftItem(tinkerToolGraphic,9006,52); //make candelebra
                firstPassCandel = false;
                }
            else
                CraftLast(tinkerToolGraphic);
            }
        else 
            {
            Orion.CharPrint(self, 1159, 'Waiting for space in a box...');
            Orion.Wait(1300);
            Orion.UseObject(backpack);
            Orion.Wait(1300);
            }
        }
    }

function CraftItem(toolSet, menuButtonID, itemButtonID)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(500);
            }
        }
    Orion.UseObject(Orion.FindType(toolSet)[0]);
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(menuButtonID));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(itemButtonID));
            Orion.Wait(200);
            }
        }
    Orion.Wait(1500);
    }

function CraftLast(toolSet)
    {
    var endTime = Orion.Now() + 2000;
    while(!Orion.GumpExists('generic', any, '0x000001CC') && Orion.Now() < endTime)
        {
        Orion.Wait(100);
        }
    if(!Orion.GumpExists('generic', any, '0x000001CC'))
        {
        Orion.UseObject(Orion.FindType(toolSet)[0]);
        Orion.Wait(1300);
        }
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(1999));
            Orion.Wait(200);
            }
        }
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID)
    {
    if(!colorID)
        colorID = any;
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, backpack, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0]);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{	
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}