var _item = {
    BlacksmithBOD: {Graphic: '0x2258', Color: '0x044E'},
    CarpenterBOD: {Graphic: '0x2258', Color: '0x05E8'},
    TinkerTool: {Graphic: '0x1EB9|0x1EBC', Color: '0x0000'},
    BlacksmithTool: {Graphic: '0x102A|0x13E3|0x0FB5|0x0FBC', Color: '0x0000'},
    BlacksmithRunic: {Graphic: '0x13E3', Color: '0x0973|0x0966|0x0972|0x096D|0x08A5|0x0979|0x089F|0x08AB'},
    CarpenterTool: {Graphic: '0x1029|0x1034|0x102C|0x1032|0x1030|0x10E5|0x10E7|0x10E6|0x10E4', Color: '0x0000'},
    CarpenterRunic: {Graphic: '0x1029', Color: '0x07DA|0x04A7|0x04A8|0x04A9|0x04AA|0x047F'},
    BODBook: {Graphic: '0x2259', Color: any},
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

function BokInit()
    {
    Orion.ToggleScript('Bok', true);
    Orion.ToggleScript('BokGump', true);
    }

function Bok()
    {
    Orion.ResumeScript('BokGump');
    Orion.CharPrint(self,1159,'Target your supply container. It should contain boards, ingots, ash runics, and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var trashBarrel = Orion.FindType('0x0E77', '0x0358', ground, ' ', 2)[0];
    var soulForge = Orion.FindType('0x44C7', any, ground, ' ', 2)[0];
    while(true)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        if(!trashBarrel || Orion.GetDistance(trashBarrel) > 2)
            return Orion.Print('Trash Barrel not found! Halting...');
        if(!soulForge || Orion.GetDistance(soulForge) > 2)
            return Orion.Print('Soul Forge not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1200);
            }
        while(Player.MaxWeight() - Player.Weight() < 100)
            {
            Orion.CharPrint(self,1159,'Over weight threshold, moving imbuing mats');
            while(Orion.FindType('0x2DB1|0x2DB2|0x2DB3')[0])
                {
                Orion.MoveItem(Orion.FindType('0x2DB1|0x2DB2|0x2DB3')[0], 0, supplyContainer.Serial());
                Orion.Wait(1100);
                }
            }
        while(Orion.Count(_item.Board.Wood.Graphic,_item.Board.Wood.Color) < 20)
            {
            Orion.CharPrint(self,1159,'Restocking Boards');
            if(!Restock('Boards',_item.Board.Wood.Graphic, supplyContainer.Serial(), 200,_item.Board.Wood.Color))
                return;
            }
        while(!Orion.FindType(_item.CarpenterTool.Graphic,_item.CarpenterTool.Color)[0]) //no carpenter tool
            {
            while(Orion.Count(_item.Ingot.Iron.Graphic) < 5) //no ingots
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, supplyContainer.Serial(), 50, '0x0000'))
                    return;
                }
            while(!Orion.FindType(_item.TinkerTool.Graphic)[0]) //no tinker tool
                {
                while(Orion.Count(_item.Ingot.Iron.Graphic) < 5) //no ingots
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, supplyContainer.Serial(), 50, '0x0000'))
                        return;
                    }
                Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                if(!Restock('Tinker Tool',_item.TinkerTool.Graphic, supplyContainer.Serial(), 1))
                    return;
                }
            Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
            CraftItem(_item.TinkerTool.Graphic, 9003, 10);
            }
        var inviableRunics = Orion.FindTypeEx(_item.CarpenterRunic.Graphic,'0x04A7').filter(function(runic)
            {
            var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
            return charges < 4;
            });
        if(inviableRunics.length > 1)
            {
            Orion.CharPrint(self,1159,'Combining Runic Tools');
            Orion.UseObject(inviableRunics[0].Serial());
            Orion.WaitForTarget(2000);
            Orion.TargetObject(inviableRunics[1].Serial());
            Orion.Wait(1100);
            Orion.MoveItem(inviableRunics[0].Serial());
            Orion.Wait(1100);
            }
        var viableRunics = Orion.FindTypeEx(_item.CarpenterRunic.Graphic,'0x04A7').filter(function(runic)
            {
            var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
            return charges >= 4;
            });
        while(!viableRunics[0])
            {
            Orion.CharPrint(self,1159,'Restocking Runic Tool');
            if(!Restock('Runic Tool',_item.CarpenterRunic.Graphic, supplyContainer.Serial(), 0))
                return;
            viableRunics = Orion.FindTypeEx(_item.CarpenterRunic.Graphic,'0x04A7').filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges >= 4;
                });
            }
        while(Orion.GetGump(any))
            {
            Orion.Print(Orion.GetGump(any).ID());
            Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
            Orion.Wait(100);
            }
        var bok = Orion.FindTypeEx('0x27A8')[0];
        while(!bok)
            {
            Orion.CharPrint(self,1159,'Crafting Bokuto');
            CraftItem('0x10E7', 9004, 121);
            bok = Orion.FindTypeEx('0x27A8')[0];
            }
        while(Orion.GetGump(any))
            {
            Orion.Print(Orion.GetGump(any).ID());
            Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
            Orion.Wait(100);
            }
        if(Orion.GetGlobal('created'))
            {
            var createdIncrement = Number(Orion.GetGlobal('created')) + 1;
            Orion.SetGlobal('created', createdIncrement);
            }
        Orion.MoveItem(bok.Serial());
        Orion.Wait(1100);
        if(Orion.Contains(bok.Properties(), 'Exceptional'))
            {
            while(!Orion.Contains(bok.Properties(), 'Reforged'))
                {
                Orion.CharPrint(self,1159,'Reforging Bokuto');
                Orion.UseObject(viableRunics[0].Serial());
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(bok.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    if(!CheckGumpCliloc('0x000F3EAC', 1151715))
                        {
                        TextWindow.Open();
                        TextWindow.Print('Reforge not set to Vicious / of Slaughter. Pausing...');
                        Orion.PauseScript('Bok');
                        }
                    var gumpReforge = Orion.GetGump(any, '0x000F3EAC');
                    if(gumpReforge !== null)
                        {
                        gumpReforge.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(1100);
                Orion.MoveItem(bok.Serial());
                Orion.Wait(1100);
                }
            if(Orion.GetGlobal('reforged'))
                {
                var reforgeIncrement = Number(Orion.GetGlobal('reforged')) + 1;
                Orion.SetGlobal('reforged', reforgeIncrement);
                }
            if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%|Hit Fireball 70%|Hit Harm 70%|Hit Lower Defense 70%') && Orion.Contains(bok.Properties(), 'Chaos Damage|Fire Damage|Cold Damage|Poison Damage|Energy Damage'))
                {
                Orion.CharPrint(self,1159,'70/70 made!');
                var bokTemp = Orion.FindType('0x27A8')[0];
                while(bokTemp)
                    {
                    Orion.MoveItem(bokTemp, 0, supplyContainer.Serial());
                    Orion.Wait(1100);
                    bokTemp = Orion.FindType('0x27A8')[0];
                    }
                if(Orion.GetGlobal('saved7070'))
                    {
                    var seventyseventyIncrement = Number(Orion.GetGlobal('saved7070')) + 1;
                    Orion.SetGlobal('saved7070', seventyseventyIncrement);
                    }
                }
            else
                {
                while(bok.Exists())
                    {
                    Orion.CharPrint(self,1159,'Unraveling Bokuto');
                    Orion.UseSkill('Imbuing');
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpImbue = Orion.GetGump(any, '0x000F3E93');
                        if(gumpImbue !== null)
                            {
                            gumpImbue.Select(Orion.CreateGumpHook(2));
                            Orion.Wait(100);
                            }
                        }   
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(bok.Serial());
                    Orion.Wait(500);
                    }
                }   
            }
        else
            {
            while(Orion.FindType('0x27A8')[0])
                {
                Orion.CharPrint(self,1159,'Trashing Bokuto');
                Orion.MoveItem(bok.Serial(), 0, trashBarrel);
                Orion.Wait(1100);
                }
            }
        }
    }

function BokGump(_)
    {
    Orion.SetGlobal('created', '0');
    Orion.SetGlobal('reforged', '0');
    Orion.SetGlobal('saved7070', '0');
    Orion.SetGlobal('saved70lightning', '0');
    var startTime = Orion.Now(); 
    while(true)
        {
        if(!Orion.ScriptRunning('Bok'))
            {
            var startPause = Orion.Now();
            Orion.PauseScript('BokGump');
            var adjustForPause = Orion.Now() - startPause;
            startTime += adjustForPause;
            }
        var created = Number(Orion.GetGlobal('created'));
        var reforged = Number(Orion.GetGlobal('reforged'));
        var saved7070 = Number(Orion.GetGlobal('saved7070'));
        var saved70lightning = Number(Orion.GetGlobal('saved70lightning'));
        var sec = ((Orion.Now() - startTime)/1000).toFixed(0);
        var min = Math.floor(sec/60);
        var hour = Math.floor(min/60);
        var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2)
        Orion.Wait(1000);
        var reforgedperhour = reforged / ((sec / 3600).toFixed(3));  
		var gump = Orion.CreateCustomGump(12001);
		gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 190, 105);
		
        gump.AddText(15, 5, "0",'Time Elapsed: ');
        gump.AddText(110, 5, "0",time);
        gump.AddText(15, 20, "0",'Created: ');
        gump.AddText(110, 20, "0",created);
        gump.AddText(15, 35, "0",'Reforged: ');
        gump.AddText(110, 35, "0",reforged);
        gump.AddText(15, 50, "0",'70/70s: ');
        gump.AddText(110, 50, "0",saved7070);
        gump.AddText(15, 65, "0",'70 Lightning: ');
        gump.AddText(110, 65, "0",saved70lightning);
        gump.AddText(15, 80, "0",'Reforged/hr: ');
        gump.AddText(110, 80, "0",reforgedperhour.toFixed(2));

        gump.Update();
        }
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID, destinationContainerSerial)
    {
    if(!colorID)
        var colorID = any;
    if(!destinationContainerSerial)
        var destinationContainerSerial = Orion.GetSerial(backpack);
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', destinationContainerSerial))
        {
        Orion.UseObject(destinationContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, destinationContainerSerial, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        Orion.Wait(100);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0], 0, destinationContainerSerial);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed, destinationContainerSerial);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
    }

function CraftTool(toolGraphic,toolColor,toolButtonCode,supplyContainer)
    {
    if(supplyContainer === undefined)
        supplyContainer = Player.BankSerial();
    while(!Orion.FindType(toolGraphic,toolColor)[0])
        {
        CloseAllGumps();
        while(!Orion.FindType(_item.TinkerTool.Graphic)[1])
            {
            while(Orion.Count(_item.Ingot.Iron.Graphic, '0x0000', backpack, 0, false) < 30)
                {
                Orion.CharPrint(self,1159,'Restocking Ingots');
                if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, supplyContainer, 50, '0x0000'))
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
    //Orion.Wait(2000);
    Orion.CharPrint(self,1159,'CraftLast')
    var endTime = Orion.Now() + 2000;
    while(!Orion.GumpExists('generic', any, '0x000001CC') && Orion.Now() < endTime)
        {
        Orion.Wait(100);
        }
    if(!Orion.GumpExists('generic', any, '0x000001CC'))
        {
        Orion.UseObject(Orion.FindType(toolSet,'0x0000')[0]);
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

function CheckGumpCliloc(gumpID, clilocID)//check if clilocID is in gump. Return 1 if it is, 0 if not, and null if gump isn't found. 
	{
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID)
        if(gump !== null)
		    return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
	}