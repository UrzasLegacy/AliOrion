function MakeWoodPulp()
	{
    const skilletGraphic = '0x097F';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const barkGraphic = '0x318F';
    const pulpGraphic = '0x26B8';
	Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
	var supplyContainer = Orion.GetSerial('myTarget');
    var firstPass = true;
	while(true)
		{
        while(!Orion.FindType(skilletGraphic)[0]) //skillet check
            {
            while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
            while(!Orion.FindType(tinkerToolGraphic)[1])
                {
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
                }
            if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                {
                Orion.CharPrint(self,1159,'Crafting Skillet');
                CraftItem('0x1EB9', 9003, 26);
                }   
            else
                {
                Orion.CharPrint(self,1159,'Restocking Skillet');
                if(!Restock('Skillet', skilletGraphic, supplyContainer, 0))
                    return;
                }
            firstPass = true;
            }
        while(!Orion.FindType('0x1F9D','0x047E')[0]) //decanter check
			{
            Orion.CharPrint(self,1159,'Restocking Decanter');
            if(!Restock('Decanter', '0x1F9D', supplyContainer, 0, '0x047E'))
                return;
			}
        while(!Orion.FindType(barkGraphic)[0]) //bark check
			{
            while(Orion.FindType(pulpGraphic)[0]) //pulp check
                {
                var pulp = Orion.FindType(pulpGraphic)[0]
                Orion.MoveItem(pulp, 0, supplyContainer)
                Orion.Wait(1300);
                }
            Orion.CharPrint(self,1159,'Restocking Bark Fragments');
            if(!Restock('Bark Fragments', barkGraphic, supplyContainer, Player.MaxWeight() - Player.Weight() - 10))
                return;
			}
        if(firstPass)
            {
            var beforeCount = Orion.Count(pulpGraphic)
            CraftItem(skilletGraphic,9002,57);
            if(Orion.Count(pulpGraphic) > beforeCount)
                firstPass = false;
            }
        else
            CraftLast(skilletGraphic);
		}
	}

function MakeBinders()
    {
    const scribePenGraphic = '0x0FBF';
    const tinkerToolGraphic = '0x1EB9|0x1EBC';
    const ingotGraphic = '0x1BF2';
    const pulpGraphic = '0x26B8';
    const pouchGraphic = '0x0E79';
    Orion.CharPrint(self,1159,'Select your supply container')
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    var firstPass = true;
    while(true)
        {
        while(!Orion.FindType(pouchGraphic).length)
            {
            Orion.CharPrint(self,1159,'Restocking Pouch');
            var validNearbyPouch = Orion.FindTypeEx(pouchGraphic,0,ground,'',2).filter(function(part)
                {
                return Orion.Contains(part.Properties(), 'Contents: 0/125');
                })[0];
            if(validNearbyPouch)
                {
                var nearbyPouchSerial = validNearbyPouch.Serial();
	            Orion.WaitContextMenuID(nearbyPouchSerial, 1012);
                Orion.RequestContextMenu(nearbyPouchSerial);
                Orion.Wait(1300);
                }
            else if(!Restock('Pouch', pouchGraphic, supplyContainer, 0))
                return Orion.Terminate('all', 'GMJournalScan');
            }
        var pouch = Orion.FindType(pouchGraphic)[0];
        VerifyOpenContainer(pouch);
        while(Orion.FindType('0x14EF','0x0664',pouch).length < 119 && Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 125)
            {
            while(!Orion.FindType(scribePenGraphic)[0])
                {
                while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                        return Orion.Terminate('all', 'GMJournalScan');
                    }
                while(!Orion.FindType(tinkerToolGraphic)[1])
                    {
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
                    }
                Orion.CharPrint(self,1159,'Crafting Scribe Pen');
                CraftItem(tinkerToolGraphic, 9003, 30);
                firstPass = true;
                }
            var haveAmount = Orion.Count(pulpGraphic, any, pouch, 0, false) + Orion.FindType('0x14EF','0x0664',pouch).length
            while(haveAmount < 119)
                {
                Orion.CharPrint(self,1159,'Restocking Wood Pulp');
                var pulp = Orion.FindType(pulpGraphic, any, supplyContainer);
                var neededAmount = 119 - haveAmount;
                if(Orion.Count(pulpGraphic, any, supplyContainer, 0, false) < neededAmount)
                    return Orion.Print('Out of Wood Pulp! Halting...');
                Orion.MoveItem(pulp[0], neededAmount, pouch);
                Orion.Wait(1300);
                haveAmount = Orion.Count(pulpGraphic, any, pouch, 0, false) + Orion.FindType('0x14EF','0x0664',pouch).length
                }
            if(firstPass)
                {
                CraftItem(scribePenGraphic,9006,301); //make binder
                firstPass = false;
                }
            else
                CraftLast(scribePenGraphic);
            }
        Orion.Wait(1300);
        if(Orion.WaitForGump(2000))
            {
            var gump = Orion.GetGump(any, '0x000001CC');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                }
            }
        Orion.Drop(pouch, 0, Player.X() - 1, Player.Y(), Player.Z());
        Orion.Wait(1300);
        var pouchObj = Orion.FindObject(pouch);
        while(!Orion.Contains(pouchObj.Properties(), 'Locked Down'))
            {
            Orion.Say('i wish to secure this');
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(pouch);
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x00000295');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(2));
                    Orion.Wait(200);
                    }
                }
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x00000295');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    }
                }
            Orion.MoveItem(pouch);
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