var _item = {
    TinkerTool: {Graphic: '0x1EB9|0x1EBC', Color: '0x0000'},
    BlacksmithTool: {Graphic: '0x102A|0x13E3|0x0FB5|0x0FBC', Color: '0x0000'},
    CarpenterTool: {Graphic: '0x1029|0x1034|0x102C|0x1032|0x1030|0x10E5|0x10E7|0x10E6|0x10E4', Color: '0x0000'},
    Ingot: {
        Iron: {Graphic: '0x1BF2', Color: '0x0000'},
        DullCopper: {Graphic: '0x1BF2', Color: '0x0973'},
        ShadowIron: {Graphic: '0x1BF2', Color: '0x0966'},
        Bronze: {Graphic: '0x1BF2', Color: '0x0972'},
        Copper: {Graphic: '0x1BF2', Color: '0x096D'},
        Gold: {Graphic: '0x1BF2', Color: '0x08A5'},
        Agapite: {Graphic: '0x1BF2', Color: '0x0979'},
        Verite: {Graphic: '0x1BF2', Color: '0x089F'},
        Valorite: {Graphic: '0x1BF2', Color: '0x08AB'}
        },
    Board: {
        Wood: {Graphic: '0x1BD7', Color: '0x0000'},
        Oak: {Graphic: '0x1BD7', Color: '0x07DA'},
        Ash: {Graphic: '0x1BD7', Color: '0x04A7'},
        Yew: {Graphic: '0x1BD7', Color: '0x04A8'},
        Heartwood: {Graphic: '0x1BD7', Color: '0x04A9'},
        Bloodwood: {Graphic: '0x1BD7', Color: '0x04AA'},
        Frostwood: {Graphic: '0x1BD7', Color: '0x047F'}
        }
    }

var AliCraft = {
    Toolset: _item.TinkerTool,
    ToolsetButtonCode: 11,
    Name: 'Void Orb',
    Graphic: '0x573E',
    Color: '0x0000',
    CategoryCode: 9007,
    ButtonCode: 716,
    Materials: [{Name: 'Dark Sapphire', Graphic: '0x3192', Color: '0x0000', RestockThreshold: 10, RestockAmount: 50}, {Name: 'Black Pearl', Graphic: '0x0F7A', Color: '0x0000', RestockThreshold: 500, RestockAmount: 2000}]
}

function MakeItem()
    {
    Orion.CharPrint(self,1159,'Select supply container');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    var firstPass = true;
    CloseAllGumps();
    TidyInventory(supplyContainer);
    while(true)
        {
        if(!Orion.FindType(AliCraft.Toolset.Graphic,AliCraft.Toolset.Color)[1])
            {
            CraftTool(AliCraft.Toolset.Graphic,AliCraft.Toolset.Color,AliCraft.ToolsetButtonCode,supplyContainer);
            firstPass = true;
            }
        var mats = AliCraft.Materials;
        for(var i=0;i<mats.length;i++)
            {
            var mat = mats[i];
            while(Orion.Count(mat.Graphic, mat.Color, backpack, 0, false) < mat.RestockThreshold)
                {
                Orion.CharPrint(self,1159,'Restocking ' + mat.Name);
                if(!Restock(mat.Name, mat.Graphic, supplyContainer, mat.RestockAmount, mat.Color))
                    return;
                }
            }
        if(firstPass)
            {
            CraftItem(AliCraft.Toolset.Graphic,AliCraft.CategoryCode,AliCraft.ButtonCode);
            firstPass = false;
            }
        else
            CraftLast(AliCraft.Toolset.Graphic);
        if(Player.Weight() > 500)
            {
            while(Orion.FindType(AliCraft.Graphic, AliCraft.Color)[0]) 
                {
                Orion.CharPrint(self,1159,'Putting away crafted items');
                var crafted = Orion.FindType(AliCraft.Graphic, AliCraft.Color)[0];
                Orion.MoveItem(crafted, 0, supplyContainer);
                Orion.Wait(1300);
                }
            if(Player.Weight() > 500)
                {
                TextWindow.Open();
                TextWindow.Print('Player overweighted!')
                TidyInventory(supplyContainer);
                }
            }
        }
    }

function TidyInventory(supplyContainer)
    {
    var item = Orion.FindTypeEx(any).filter(function(part)
        {
        return !Orion.Contains(part.Properties(), 'Blessed|Uses Remaining');
        })[0];
    while(item) 
        {
        Orion.CharPrint(self,1159,'Tidying inventory');
        Orion.MoveItem(item.Serial(), 0, supplyContainer);
        Orion.Wait(1300);
        item = Orion.FindTypeEx(any).filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Blessed|Uses Remaining');
            })[0];
        }
    }

function CloseAllGumps()
    {
    //Orion.WaitForGump(1000);
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }

function CraftItem(toolSet, menuButtonID, itemButtonID)
    {
    CloseAllGumps();
    Orion.CharPrint(self,1159,'CraftFirst')
    Orion.UseObject(Orion.FindType(toolSet, '0x0000')[0]);
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
    Orion.Wait(2000);
    }

function CraftLast(toolSet)
    {
    Orion.CharPrint(self,1159,'CraftLast')
    var endTime = Orion.Now() + 2000;
    while(!Orion.GumpExists('generic', any, '0x000001CC') && Orion.Now() < endTime)
        {
        Orion.Wait(100);
        }
    if(!Orion.GumpExists('generic', any, '0x000001CC'))
        {
        Orion.UseObject(Orion.FindType(toolSet, '0x0000')[0]);
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
    Orion.Wait(1000);
    }

function CraftTool(toolGraphic,toolColor,toolButtonCode,supplyContainer)
    {
    if(supplyContainer === undefined)
        supplyContainer = Player.BankSerial();
    while(!Orion.FindType(toolGraphic,toolColor)[1])
        {
        CloseAllGumps();
        while(!Orion.FindType(_item.TinkerTool.Graphic,'0x0000')[1])
            {
            while(Orion.Count(_item.Ingot.Iron.Graphic, _item.Ingot.Iron.Color, backpack, 0, false) < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, supplyContainer, 50, _item.Ingot.Iron.Color))
                    return Orion.Terminate('all');
                }
            if(!Orion.FindType(_item.TinkerTool.Graphic)[0])
                {
                Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                if(!Restock('Tinker Tools', _item.TinkerTool.Graphic, supplyContainer, 0))
                    return Orion.Terminate('all');
                }
            else
                {
                Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                CraftItem(_item.TinkerTool.Graphic, 9003, 11);
                CloseAllGumps();
                }
            }
        while(Orion.Count(_item.Ingot.Iron.Graphic, '0x0000', backpack, 0, false) < 30)
            {
            Orion.CharPrint(self,1159,'Restocking Ingots');
            if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, supplyContainer, 50, '0x0000'))
                return Orion.Terminate('all');
            }
        Orion.CharPrint(self,1159,'Crafting Profession Tool');
        CraftItem(_item.TinkerTool.Graphic, 9003, toolButtonCode);
        CloseAllGumps();
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
    if(needed > 0 && !restockItem[0])
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