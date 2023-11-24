function Main()
    {
    var dyeTheTubs = true;
    Orion.CharPrint(self,1159,'Select your supply container');
    Orion.WaitForAddObject('myTarget');
    var supplyContainerObj = Orion.FindObject('myTarget');
    if(!supplyContainerObj || supplyContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var supplyContainer = supplyContainerObj.Serial();
    Orion.CharPrint(self,1159,'Select your storage container');
    Orion.WaitForAddObject('myTarget');
    var storageContainerObj = Orion.FindObject('myTarget');
    if(!storageContainerObj || storageContainerObj.Mobile())
        {
        Orion.CharPrint(self,1159,'Invalid target! Halting...');
        Orion.Terminate('all');
        }
    var storageContainer = storageContainerObj.Serial();
    while(true)
        {
        MakeTrapBox(supplyContainer,storageContainer,dyeTheTubs);
        }
    }

function MakeTrapBox(supplyContainer,storageContainer,dyeTheTubs)
    {
    var trashBarrel = Orion.FindTypeEx('0x0E77','0x0358',ground,'item',2)[0];
    if(!trashBarrel)
        {
        Orion.Wait(1000);
        return Orion.CharPrint(self,1159,'No trash barrel nearby! Halting...');
        }
    var crateInBackpack = Orion.FindTypeEx('0x0E7E|0x09A9')[0];
    while(!crateInBackpack)
        {
        CraftSmallCrate(supplyContainer);
        crateInBackpack = Orion.FindTypeEx('0x0E7E|0x09A9')[0];
        }
    var crateSerial = crateInBackpack.Serial();
    while(crateInBackpack.Graphic() != _item.Crate.NorthSouth.Graphic)
        ToggleCrateState(crateSerial);
    CraftTinkerTrap(crateSerial,supplyContainer);
    var key = HandleKey(crateSerial);
    MageUnlock(crateSerial);
    while(crateInBackpack.Graphic() != _item.Crate.EastWest.Graphic)
        ToggleCrateState(crateSerial);
    var currentColor = crateInBackpack.Color();
    while(dyeTheTubs && crateInBackpack.Color() == currentColor)
        {
        Orion.UseType(_item.DyeTub.Graphic);
        if(Orion.WaitForTarget(3000))
            Orion.TargetObject(crateSerial);
        Orion.Wait(1300);
        }
    while(crateInBackpack.Container() == Orion.GetSerial(backpack))
        {
        Orion.MoveItem(crateSerial,0,storageContainer);
        Orion.Wait(1300);
        }
    while(key.Container() == Orion.GetSerial(backpack))
        {
        Orion.MoveItem(key.Serial(),0,trashBarrel.Serial());
        Orion.Wait(1300)
        }
    }   

var _item = {
    TinkerTool: {Graphic: '0x1EB9|0x1EBC', Color: '0x0000'},
    BlacksmithTool: {Graphic: '0x102A|0x13E3|0x0FB5|0x0FBC', Color: '0x0000'},
    CarpenterTool: {Graphic: '0x1029|0x1034|0x102C|0x1032|0x1030|0x10E5|0x10E7|0x10E6|0x10E4', Color: '0x0000'},
    Axe: {Graphic: '0x0F4B|0x0F44|0x09C4', Color: any},
    Ingot: {Graphic: '0x1BF2', Color: '0x0000'},
    Board: {Graphic: '0x1BD7', Color: '0x0000'},
    CrossbowBolt: {Graphic: '0x1BFB', Color: any},
    DyeTub: {Graphic: '0x0FAB', Color: any},
    CrateKey: {Graphic: '0x100E', Color: any},
    Crate: {
        NorthSouth: {Graphic: '0x0E7E',Color: any},
        EastWest: {Graphic: '0x09A9',Color: any}
        },
    }

function ToggleCrateState(crateSerial)
    {
    var crateObj = Orion.FindObject(crateSerial);
    var playerX = Player.X();
    var playerY = Player.Y();
    var EWtoNS = [playerX - 1,playerY];
    var NStoEW = [playerX,playerY + 1];
    var orientations = {
        '0x09A9': EWtoNS, //Deactivate
        '0x0E7E': NStoEW, //Activate
        }
    var currentOrientation = crateObj.Graphic();
    var orientationAdjust = orientations[currentOrientation];
    while(crateObj.Graphic() == currentOrientation)
        {
        Orion.Drop(crateSerial, 0, orientationAdjust[0], orientationAdjust[1], Player.Z());
        Orion.Wait(1300);
        Orion.MoveItem(crateSerial);
        Orion.Wait(1300);
        }
    }

function CraftSmallCrate(supplyContainer)
    {
    const tinkerToolGraphic = _item.TinkerTool.Graphic;
    const carpenterToolGraphic = _item.CarpenterTool.Graphic;
    const ingotGraphic = _item.Ingot.Graphic;
    const boardGraphic = _item.Board.Graphic;
    while(!Orion.FindType(carpenterToolGraphic)[0])
        {
        while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
            {
            Orion.CharPrint(self,1159,'Restocking Ingots');
            if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                return Orion.Terminate('all', 'GMScan');
            }
        while(!Orion.FindType(tinkerToolGraphic)[1])
            {
            if(!Orion.FindType(tinkerToolGraphic)[0])
                {
                Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                    return Orion.Terminate('all', 'GMScan');
                }
            else
                {
                Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                CraftItem(tinkerToolGraphic, 9003, 11);
                }
            }
        Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
        CraftItem(tinkerToolGraphic, 9003, 10); 
        }
    if(Orion.Count(boardGraphic, '0x0000', backpack, 0, false) < 10)
        {
        if(!Restock('Boards', boardGraphic, supplyContainer, 100, '0x0000'))
            return Orion.Terminate('all', 'GMScan');
        }
    CraftItem(carpenterToolGraphic,9003,98); 
    Orion.Wait(1300);
    var crate = Orion.FindTypeEx("0x0E7E|0x09A9")[0]
    if(crate && !Orion.Contains(crate.Properties(),'Exceptional') && Orion.UseType(_item.Axe.Graphic) && Orion.WaitForTarget(2000))
        {
        Orion.TargetObject(crate.Serial());
        Orion.Wait(500);
        }
    }

function CraftTinkerTrap(crateSerial,supplyContainer)
    {
    const tinkerToolGraphic = _item.TinkerTool.Graphic;
    const ingotGraphic = _item.Ingot.Graphic;
    const boltGraphic = _item.CrossbowBolt.Graphic;
    while(!Orion.FindType(tinkerToolGraphic)[1])
        {
        while(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 30)
            {
            Orion.CharPrint(self,1159,'Restocking Ingots');
            if(!Restock('Iron Ingots', ingotGraphic, supplyContainer, 50, '0x0000'))
                return Orion.Terminate('all', 'GMScan');
            }
        while(!Orion.FindType(tinkerToolGraphic)[1])
            {
            if(!Orion.FindType(tinkerToolGraphic)[0])
                {
                Orion.CharPrint(self,1159,'Restocking Tinker Tools');
                if(!Restock('Tinker Tools', tinkerToolGraphic, supplyContainer, 0))
                    return Orion.Terminate('all', 'GMScan');
                }
            else
                {
                Orion.CharPrint(self,1159,'Crafting Tinker Tools');
                CraftItem(tinkerToolGraphic, 9003, 11);
                }
            }
        }
    if(Orion.Count(ingotGraphic, '0x0000', backpack, 0, false) < 20)
        {
        if(!Restock('Ingots', ingotGraphic, supplyContainer, 100, '0x0000'))
            return Orion.Terminate('all', 'GMScan');
        }
    if(Orion.Count(boltGraphic, '0x0000', backpack, 0, false) < 20)
        {
        if(!Restock('Bolts', boltGraphic, supplyContainer, 100, '0x0000'))
            return Orion.Terminate('all', 'GMScan');
        }
    CraftItem(tinkerToolGraphic,9008,400);
    if(Orion.WaitForTarget(3000))
        Orion.TargetObject(crateSerial);
    if(Orion.WaitForGump(5000) && CheckGumpCliloc("0x000001CC", 1044043))
        {
        Orion.CharPrint(self,1159,"Failed trap, retrying...");
        return CraftTinkerTrap(crateSerial,supplyContainer);
        }
    return true
    }

function MageUnlock(crateSerial)
    {
    var crateObj = Orion.FindObject(crateSerial);
    while(!Orion.Contains(crateObj.Properties(),'Contents: '))
        {
        Orion.Cast('Unlock');
        if(Orion.WaitForTarget(5000))
            {
            Orion.TargetObject(crateSerial);
            Orion.Wait(1300);
            }
        }
    return Orion.Contains(crateObj.Properties(),'Contents: ');
    }

function HandleKey(crateSerial)
    {
    if(!crateSerial)
        {
        Orion.WaitForAddObject('myTarget');
        crateSerial = Orion.GetSerial('myTarget');
        }
    VerifyOpenContainer(crateSerial);
    var key = Orion.FindTypeEx(_item.CrateKey.Graphic,any,crateSerial)[0];
    if(key)
        {
        var crateObj = Orion.FindObject(crateSerial);
        var keySerial = key.Serial();
        while(key.Container() == crateSerial)
            {
            Orion.MoveItem(keySerial);
            Orion.Wait(1300);
            }
        while(Orion.Contains(crateObj.Properties(),'Contents: '))
            {
            Orion.UseObject(keySerial);
            if(Orion.WaitForTarget(2000))
                {
                Orion.TargetObject(crateSerial);
                Orion.Wait(1300);
                }
            }
        }
    return key
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

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function CheckGumpCliloc(gumpID, clilocID)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID);
        if(gump !== null)
            return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
    }
