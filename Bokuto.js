function CraftBoks()
    {
        
        Orion.CharPrint(self,1159,'Target the container with your Bokutos.')
        Orion.WaitForAddObject('objectName');
        var armorContainer = Orion.FindObject(Orion.GetSerial('objectName'));
        var Exceptitem = Orion.FindTypeEx(any,any,armorContainer.Serial()).filter(function(duraCheck)
            {
            return Orion.Contains(duraCheck.Properties(),'Exceptional');
            })[0];
        
        while(item)
        {
            //working on this part
            Orion.UseType(lookup.Pfortkeg.Graphic);
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(Exceptitem.Serial());
            Orion.Wait(1300);
            item = Orion.FindTypeEx(any,any,armorContainer.Serial()).filter(function(duraCheck)
                {
                return !Orion.Contains(duraCheck.Properties(),'Exceptional');
                })[0];
        }
        Orion.CharPrint(self,1159,'Armor Fortification Complete.')
    }

    function ReforgingBok()
    {
        var item = Orion.FindTypeEx(any ,any,'backpack').filter(function(craftProp)
        {
            return Orion.Contains(craftProp.Properties(), 'Exceptional')
        })[0];
        while(item)
        {
            //reforging
            Orion.UseObject('0x4021E1EE');
           	Orion.CharPrint(self,1159,'Using Runic Tool');
            Orion.Wait(1300);
            if(Orion.WaitForTarget(2000))
            {
                Orion.TargetObject(item.Serial());
            	Orion.Wait(1300);
                Orion.CharPrint(self,1159,'Reforging item');
                ReforgingGump(2); 
            }
            Orion.CharPrint(self,1159,'Item Reforged');

            Orion.Wait(1300);
            var Baditem = Orion.FindTypeEx(any ,any,'0x4377D472').filter(function(craftProp)
            {
                return Orion.Contains(craftProp.Properties(), 'Reforged')
            })[0];
            if(Baditem)
            {
                Orion.MoveItem(Baditem.Serial(), 0, playerBankSerial)
            }
        }
        var reforgeditem = Orion.FindTypeEx('0x27A8',any,'backpack').filter(function(reforgeProp)
        {
            return Orion.Contains(reforgeProp.Properties(), '70%')
        })[0];
        while(reforgeditem)
        {
            Orion.MoveItem(reforgeditem.Serial(), '0x4664862F');
            Orion.Wait(1000);
        }
    }

    function ReforgingGump(reforgingButtonID)
    {
    Orion.UseObject(lookup.Ashrunicsaw);
    Orion.Wait(1000);
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000F3EAC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(reforgingButtonID));
            Orion.Wait(1000);
            }
        }
    Orion.Wait(1500);
    }

    const lookup = 
    {
        Ashrunicsaw: {Graphic: '0x1029'},
        Bokuto: {Graphic: '0x27A8'},
    }