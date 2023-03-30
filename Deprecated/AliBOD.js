/*
AliBod v8
PATCH NOTES
v1: Carpentry BOD Briber Framework
v2: Carpentry BOD Crafter Framework
v3: Crafter generalization refactor
v4: Ash Dovetail combining and turnin added. Misc helper functions
v5: Menu Gump added
v6: Bokuto crafter
v7: Refactor prep. Added _item
v8: Full generalization refactor. Blacksmithy added. Gump Updated
*/
var CAnumRunes = 25; //Input number of carpenter rune locations in your atlas
var BAnumRunes = 40; //Input number of blacksmith rune locations in your atlas

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

//Gump ---------------------------------/
var buttons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, 3, "BSBodBriber", 'BodBriber', ['Blacksmithy']], [100, 30, 4, "BSBodCrafter", 'BodCrafter', ['Blacksmithy']], [100, 30, 5, "BSBodGrabber", 'BODgrabber', ['Blacksmithy']] ],
        [ [100, 30, 6, "ShadowCombiner", 'RunicCombiner', [_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron]],[100, 30, 7, "CopperCombiner", 'RunicCombiner', [_item.BlacksmithRunic.Graphic,_item.Ingot.Copper]], [100, 30, 8, "MoveHammers", 'MoveAll', [_item.BlacksmithRunic.Graphic]] ],
        [ [100, 30, 9, "ShadowTurnin", 'BodTurnin', ['Blacksmithy', 117]], [100, 30, 10, "CopperTurnin", 'BodTurnin', ['Blacksmithy', 123]], [100, 30, 11, "BSBodMule", 'BodMule', ['Blacksmithy']] ],
        [],
        [ [100, 30, 12, "CABodBriber", 'BodBriber', ['Carpentry']], [100, 30, 13, "CABodCrafter", 'BodCrafter', ['Carpentry']], [100, 30, 14, "CABodGrabber", 'BODgrabber', ['Carpentry']] ],
        [ [100, 30, 15, "AshCombiner", 'RunicCombiner', [_item.CarpenterRunic.Graphic,_item.Board.Ash]], [], [100, 30, 16, "MoveSaws", 'MoveAll', [_item.CarpenterRunic.Graphic]] ],
        [ [100, 30, 17, "AshTurnin", 'BodTurnin', ['Carpentry', 115]], [], [100, 30, 18, "CABodMule", 'BodMule', ['Carpentry']] ],
        [],
        [ [100, 30, 19, "MoveBODs", 'MoveAll', ['0x2258']] ],
        [],
        [ [100, 30, 20, "Bok", 'BokInit'] ]

    ]

function Gump()
    {
    Orion.Exec('GMJournalScan',true);
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 100 + 20, buttons.length * 30 + 3, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(gridX(column), gridY(row), '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(gridTX(column), gridTY(row), '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

function GumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if (button[2] == code)
                {
                Orion.Print('Toggle ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function gridX(x){
    return x * 105 + 4
    }
function gridY(y){
    return y * 29 + 2
    }
function gridTX(x){
    return x * 105 + 10
    }
function gridTY(y){
    return y * 29 + 6
    }

//Utilities -------------------------/
function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
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

function _itemFormatter()
    {
    Orion.WaitForAddObject('myTarget');
    var item = Orion.FindObject('myTarget');
    var string = item.Name() + ": {Graphic: '" + item.Graphic() + "', Color: '" + item.Color() + "'},"
    TextWindow.Open();
    TextWindow.Print(string);
    }

function _itemGroupGraphicFormatter()
    {
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container',container))
        {
        Orion.UseObject(container);
        Orion.Wait(1200);
        }
    var items = Orion.FindTypeEx(any,any,container);
    var string = '';
    for(var i=0;i<items.length;i++)
        {
        var item = items[i];
        string += item.Graphic() + '|';
        if(i == items.length - 1)
            string = string.slice(0, -1);
        }
    TextWindow.Open();
    TextWindow.Print(string);
    }

//Autostart
function Autostart()
    {
    Orion.Wait(2000);
    BODMule('Blacksmithy');
    }

//Helpers ------------------------/
function BodBriber(craftType)
    {
    switch(craftType)
        {
        case 'Carpentry':
            var BODGraphic = _item.CarpenterBOD.Graphic;
            var BODColor = _item.CarpenterBOD.Color;
            var BodParse = CABodParse;
            var craftArr = CarpentryArr;
            var targetPointValue = 750;
            var npcProfessionString = 'the carpenter';
            var atlasName = 'Carpenters';
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse;
            var craftArr = BlacksmithyArr;
            var targetPointValue = 650;
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths';
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BodBriber')
        }
    while(true)
        {
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor)[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCheck = craftArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCheck || bodInfo.Size == 'Large Bulk Order')
                {
                var invalidBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), atlasName + ' Invalid', false);
                    })[0];
                if(invalidBODBook)
                    {
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, invalidBODBook.Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1100);  
                    }
                else
                    {
                    Orion.Wait(1100);
                    AtlasByName(atlasName, 'Bank');
                    Orion.Say('bank');
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, Player.BankSerial());
                    Orion.Wait(1100);
                    }
                }
            else if(bodInfo.Size == 'Small Bulk Order')
                {
                if(bodInfo.Fulfilled == 0)
                    {
                    while(BodParse(bodObj).Points < targetPointValue)
                        {
                        var npc = GoToNPC(npcProfessionString,atlasName);
                        if(npc)
                            {
                            var bribeCost = BribeCheck(npc.Serial(), bodObj.Serial())
                            if(bribeCost > -1 && bribeCost < 100000)
                                {
                                Orion.MoveItem(bodObj.Serial(), 0, npc.Serial());
                                Orion.Wait(1100);
                                }
                            else
                                Orion.Ignore(npc.Serial());
                            //Orion.Wait(1100);
                            }
                        }
                    var bribeBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                        {
                        return Orion.Contains(book.Properties(), atlasName + ' Bribed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                        });
                    Orion.MoveItem(bodObj.Serial(), 0, bribeBODBook[0].Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1200);
                    }
                }
            }
        if(!Orion.FindType(BODGraphic,BODColor)[0])
            {
            Orion.CharPrint(self,1159,'Pulling BOD from backup book');
            var backupBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                {
                return Orion.Contains(book.Properties(), atlasName+ ' Valid', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(backupBODBook[0])
                {
                Orion.UseObject(backupBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Backup ' + atlasName + ' BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function BodCrafter(craftType)
    {
    switch(craftType)
        {
        case 'Carpentry':
            var BODGraphic = _item.CarpenterBOD.Graphic;
            var BODColor = _item.CarpenterBOD.Color;
            var BodParse = CABodParse;
            var craftArr = CarpentryArr;
            var atlasName = 'Carpenters';
            var toolGraphic = _item.CarpenterTool.Graphic;
            var toolColor = _item.CarpenterTool.Color;
            var toolButtonCode = 10;
            var materialUseType = _item.Board.Wood.Graphic;
            var runicGraphic = _item.CarpenterRunic.Graphic;
            var runicColor = _item.CarpenterRunic.Color;
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse;
            var craftArr = BlacksmithyArr;
            var atlasName = 'Blacksmiths';
            var toolGraphic = _item.BlacksmithTool.Graphic;
            var toolColor = _item.BlacksmithTool.Color;
            var toolButtonCode = 20;
            var materialUseType = _item.Ingot.Iron.Graphic;
            var runicGraphic = _item.BlacksmithRunic.Graphic;
            var runicColor = _item.BlacksmithRunic.Color;
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BodhiCrafter')
        }
    Orion.Say('bank');
    Orion.Wait(1100);
    var bank = Player.BankSerial();
    while(true)
        {
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor)[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCheck = craftArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCheck || bodInfo.Size == 'Large Bulk Order')
                {
                var invalidBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), atlasName + ' Invalid', false);
                    })[0];
                if(invalidBODBook)
                    {
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, invalidBODBook.Serial());
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1100);  
                    }
                else
                    {
                    Orion.Say('bank');
                    Orion.Wait(1100);
                    Orion.MoveItem(bodObj.Serial(), 0, Player.BankSerial());
                    Orion.Wait(1100);
                    }
                }
            else if(bodInfo.Size == 'Small Bulk Order')
                {
                if(bodInfo.Fulfilled != bodInfo.Amount)
                    {
                    while(Orion.FindType(runicGraphic,runicColor)[0]) //put away runics
                        {
                        Orion.CharPrint(self,1159,'Storing Runics in Bank');
                        var pouch = Orion.FindType('0x0E79', any, bank)[0];
                        Orion.MoveItem(Orion.FindType(runicGraphic,runicColor)[0], 0, pouch);
                        Orion.Wait(1200);
                        }
                    while(Orion.Count(_item.Ingot.Iron.Graphic) < 30)
                        {
                        Orion.CharPrint(self,1159,'Restocking Ingots');
                        if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, bank, 50, '0x0000'))
                            return;
                        }
                    while(!Orion.FindType(_item.TinkerTool.Graphic)[0])
                        {
                        Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                        if(!Restock('Tinker Tool', _item.TinkerTool.Graphic, bank, 0))
                            return;
                        }
                    while(!Orion.FindType(toolGraphic,toolColor)[0] && Orion.Count(_item.Ingot.Iron.Graphic) > 4)
                        {
                        if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType(_item.TinkerTool.Graphic)[0])
                            {
                            Orion.CharPrint(self,1159,'Crafting Tool');
                            CraftItem(_item.TinkerTool.Graphic, 9003, toolButtonCode);
                            }   
                        else
                            {
                            Orion.CharPrint(self,1159,'Restocking Tool');
                            if(!Restock('Tool',toolGraphic, bank, 0,_item.CarpenterTool.Color))
                                return;
                            }
                        }
                    Orion.CharPrint(self,1159,'Setting Material type');
                    var materialType = BodParse(bodObj).MaterialColor
                    Orion.UseObject(Orion.FindType(toolGraphic,toolColor)[0]);
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpMaterial = Orion.GetGump(any, '0x000001CC');
                        if (gumpMaterial !== null)
                            {
                            gumpMaterial.Select(Orion.CreateGumpHook(BodParse(bodObj).MaterialCode));
                            Orion.Wait(200);
                            }
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var gumpMaterial = Orion.GetGump(any, '0x000001CC');
                        if (gumpMaterial !== null)
                            {
                            gumpMaterial.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(200);
                            }
                        }
                    Orion.Wait(1200);
                    while(Orion.GetGump(any))
                        {
                        Orion.Print(Orion.GetGump(any).ID())
                        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
                        Orion.Wait(100);
                        }
                    while(BodParse(bodObj).Fulfilled < BodParse(bodObj).Amount)
                        {
                        var needed = BodParse(bodObj).Amount - BodParse(bodObj).Fulfilled;
                        for(var i=0;i<needed;i++)
                            {
                            while(Player.Weight() > 500)
                                {
                                Orion.CharPrint(self,1159,'Over weight threshold, moving things around');
                                while(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0])
                                    {
                                    Orion.MoveItem(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0], 0, bank);
                                    Orion.Wait(1200);
                                    }
                                }
                            while(Orion.Count(materialUseType, materialType) < 50)
                                {
                                Orion.CharPrint(self,1159,'Restocking Resources');
                                if(!Restock('Boards', materialUseType, bank, 150, materialType))
                                    return;
                                }
                            while(Orion.Count(_item.Ingot.Iron.Graphic) < 30)
                                {
                                Orion.CharPrint(self,1159,'Restocking Ingots');
                                if(!Restock('Iron Ingots',_item.Ingot.Iron.Graphic, bank, 50, '0x0000'))
                                    return;
                                }
                            while(!Orion.FindType(toolGraphic,toolColor)[0] && Orion.Count(_item.Ingot.Iron.Graphic) > 4)
                                {
                                while(!Orion.FindType(_item.TinkerTool.Graphic)[0])
                                    {
                                    Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                                    if(!Restock('Tinker Tools',_item.TinkerTool.Graphic, bank, 0))
                                        return;
                                    }
                                if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType(_item.TinkerTool.Graphic)[0])
                                    {
                                    Orion.CharPrint(self,1159,'Crafting Tool');
                                    CraftItem(_item.TinkerTool.Graphic, 9003, toolButtonCode);
                                    }   
                                else
                                    {
                                    Orion.CharPrint(self,1159,'Restocking Tool');
                                    if(!Restock('Crafting Tool', toolGraphic, bank, 0,_item.CarpenterTool.Color))
                                        return;
                                    }
                                }
                            Orion.CharPrint(self,1159,'Crafting: ' + bodCheck[0]);
                            CraftItem(toolGraphic, bodCheck[1], bodCheck[2]);
                            }
                        Orion.Wait(1300);
                        Orion.CharPrint(self,1159,'Attempting to combine items to BOD');
                        Orion.UseObject(bodObj.Serial());
                        if(Orion.WaitForGump(2000))
                            {
                            var gumpTurnin1 = Orion.GetGump(any, '0x000001C8');
                            if(gumpTurnin1 !== null)
                                {
                                gumpTurnin1.Select(Orion.CreateGumpHook(11));
                                Orion.Wait(200);
                                }
                            }
                        if(Orion.WaitForTarget(2000))
                            Orion.TargetObject(backpack);
                        if(Orion.WaitForGump(2000))
                            {
                            var gumpTurnin2 = Orion.GetGump(any, '0x000001C8');
                            if(gumpTurnin2 !== null)
                                {
                                gumpTurnin2.Select(Orion.CreateGumpHook(0));
                                Orion.Wait(200);
                                }
                            }
                        Orion.Wait(1200)
                        }
                    }
                }
            var completedBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                {
                return Orion.Contains(book.Properties(), atlasName + ' Completed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                });
            Orion.MoveItem(bodObj.Serial(),0,completedBODBook[0].Serial());
            if(Orion.WaitForGump(2000))
                {
                var closeBookGump = Orion.GetGump(any, '0x0000029C');
                if(closeBookGump !== null)
                    {
                    closeBookGump.Select(Orion.CreateGumpHook(0));
                    Orion.Wait(200);
                    }
                }
            Orion.Wait(1200);
            while(Orion.FindType(_item.Board.Wood.Graphic)[0])
                {
                Orion.CharPrint(self,1159,'Moving resources back to bank');
                Orion.MoveItemType(_item.Board.Wood.Graphic, any, backpack, 0, bank) || Orion.MoveItemType(_item.Ingot.Iron.Graphic, any, backpack, 0, bank);
                Orion.Wait(1200);
                }
            }
        Orion.Wait(1200);
        if(!Orion.FindType(BODGraphic,BODColor)[0])
            {
            Orion.CharPrint(self,1159,'Pulling BOD from bribed book');
            var bribeBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                {
                return Orion.Contains(book.Properties(), atlasName + ' Bribed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(bribeBODBook[0])
                {
                Orion.UseObject(bribeBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Bribed ' + atlasName + ' BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function BodTurnin(craftType, rewardCode)
    {
    switch(craftType)
        {
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths'
            break;
        case 'Carpentry':
            var BODGraphic = _item.CarpenterBOD.Graphic;
            var BODColor = _item.CarpenterBOD.Color;
            var BodParse = CABodParse
            var npcProfessionString = 'the carpenter';
            var atlasName = 'Carpenters'
        default:
            return Orion.CharPrint('Type error in BodTurnin');
        }
    var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), npcProfessionString);
        })[0];
    if(!npc)
        return Orion.Print('No npc in vicinity! Halting...')
    Orion.CharPrint(self,1159,'Requesting BOD');
    Orion.WaitContextMenuID(npc.Serial(), 403);
    Orion.RequestContextMenu(npc.Serial());
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001C7');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(1));
            Orion.Wait(100);
            }
        }
    Orion.Wait(1200);
    while(true)
        {
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor)[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            if(bodInfo.Fulfilled == bodInfo.Amount)
                {
                Orion.CharPrint(self,1159,'Turning in Completed BOD');
                Orion.MoveItem(bodObj.Serial(), 0, npc.Serial());
                Orion.Wait(500);
                if(Orion.WaitForGump(2000))
                    {
                    var completegump0 = Orion.GetGump(any, '0x00004268');
                    if(completegump0 !== null)
                        {
                        completegump0.Select(Orion.CreateGumpHook(rewardCode));
                        Orion.Wait(100);
                        }
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var completegump1 = Orion.GetGump(any, '0x00004269');
                    if(completegump1 !== null)
                        {
                        completegump1.Select(Orion.CreateGumpHook(7));
                        Orion.Wait(100);
                        }
                    }
                if(Orion.WaitForGump(2000))
                    {
                    var completegump2 = Orion.GetGump(any, '0x00004268');
                    if(completegump2 !== null)
                        {
                        completegump2.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(500);
                Orion.CharPrint(self,1159,'Requesting BOD');
                Orion.WaitContextMenuID(npc.Serial(), 403);
                Orion.RequestContextMenu(npc.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001C7');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(1));
                        Orion.Wait(100);
                        }
                    }
                }
            else
                {
                var validBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), atlasName + ' Valid', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 300
                    });
                Orion.MoveItem(bodObj.Serial(), 0, validBODBook[0].Serial())
                if(Orion.WaitForGump(2000))
                    {
                    var closeBookGump = Orion.GetGump(any, '0x0000029C');
                    if(closeBookGump !== null)
                        {
                        closeBookGump.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(200);
                        }
                    }
                }
            }
        Orion.Wait(600);
        if(!Orion.FindType(BODGraphic,BODColor)[0])
            {
            Orion.Wait(600);
            Orion.CharPrint(self,1159,'Pulling BOD from completed book');
            var completedBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                {
                return Orion.Contains(book.Properties(), atlasName + ' Completed', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] > 0
                });
            if(completedBODBook[0])
                {
                Orion.UseObject(completedBODBook[0].Serial());
                if(Orion.WaitForGump(2000))
                    {
                    var bookGump = Orion.GetGump(any, '0x0000029C');
                    if(bookGump !== null)
                        {
                        bookGump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(200);
                        }
                    if(Orion.WaitForGump(2000))
                        {
                        var closeBookGump = Orion.GetGump(any, '0x0000029C');
                        if(closeBookGump !== null)
                            {
                            closeBookGump.Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            }
                        }
                    }
                }
            else
                {
                TextWindow.Open();
                return TextWindow.Print('Completed ' + atlasName + ' BOD book empty or missing');
                }
            }
        Orion.Wait(1200);
        }
    }

function BODgrabber(craftType)
	{
    switch(craftType)
        {
        case 'Carpentry':
            var BODGraphic = _item.CarpenterBOD.Graphic;
            var BODColor = _item.CarpenterBOD.Color;
            var atlasName = 'Carpenters';
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var atlasName = 'Blacksmiths';
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BODgrabber')
        }
	var armoire = Orion.FindType('0x0A4F|0x0A9B', any, ground, '', 2)[0]
	var bodBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
        {
        return Orion.Contains(book.Properties(), atlasName + ' Valid', false);
        })[0];
	Orion.UseObject(armoire);
	Orion.Wait(1300);
	while(true)
		{
		while(Orion.FindType(BODGraphic,BODColor,armoire)[0])
			{
			Orion.MoveItem(Orion.FindType(BODGraphic,BODColor,armoire)[0], 0, bodBook.Serial())
			Orion.Wait(1300);
			}
		Orion.Wait(100);
		}
	}

function BODMule(craftType)
    {
    switch(craftType)
        {
        case 'Carpentry':
            var BODGraphic = _item.CarpenterBOD.Graphic;
            var BODColor = _item.CarpenterBOD.Color;
            var npcProfessionString = 'the carpenter';
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BODMule')
        }
    while(!Orion.GumpExists('container', backpack))
        {
        Orion.OpenContainer(backpack);
        Orion.Wait(1300);
        }
    var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 24).filter(function(npc)
            {
            return Orion.Contains(npc.Properties(), npcProfessionString);
            })[0];
    var armoire = Orion.FindType('0x0A4F|0x0A9B', any, ground, '', 2)[0];
    while(true)
        {
        Orion.WaitContextMenuID(npc.Serial(), 403);
        Orion.RequestContextMenu(npc.Serial());
        if (Orion.WaitForGump(1000))
            {
            var gump = Orion.GetGump(any, '0x000001C7');
            if (gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        while(Orion.FindType(BODGraphic,BODColor)[0])
            {
            Orion.MoveItem(Orion.FindType(BODGraphic,BODColor)[0], 0, armoire)
            Orion.Wait(1100);
            }
        var check = Orion.WaitJournal('An offer may be available in about', Orion.Now()-5000, Orion.Now()+1000, 'mobile', npc.Serial());
        if(check)
            break;
        }
    Orion.LogOut();
    }

function BSBodInfo()
    {
    Orion.WaitForAddObject('myTarget');
    var target = Orion.FindObject('myTarget');
    var bod = BSBodParse(target);
    Orion.Print('Bod Size: ' + bod.Size);
    Orion.Print('Bod Material: ' + bod.Material);
    Orion.Print('Bod Material Code: ' + bod.MaterialCode);
    Orion.Print('Bod Material Color: ' + bod.MaterialColor);
    Orion.Print('Bod Quality: ' + bod.Quality);
    Orion.Print('Bod Amount: ' + bod.Amount);
    Orion.Print('Bod Fulfilled: ' + bod.Fulfilled);
    Orion.Print('Bod Item: ' + bod.Item);
    Orion.Print('Bod Points: ' + bod.Points);
    if(bod.Points >= 750)
        Orion.CharPrint(self,1159, 'Keeper!');
    }

function CABodParse(bod)
    {
    var bodPropLines = bod.Properties().match(/^.*$/gm);
    var size = bodPropLines[3];
    var material = bodPropLines[4];
    var materialInfo = CAMaterialArr.filter(function(part)
        {
        return part[0] == material;
        });
    var materialCode = materialInfo[0][1]
    var materialColor = materialInfo[0][2]
    var quality =  bodPropLines[5];
    var amount = Number(bodPropLines[6].match(/Amount To Make: (\d+)/)[1]);
    var itemfulfilled = bodPropLines[7].match(/([\w\-\)\( ]*): (\d+)/);
    var item = itemfulfilled[1];
    var fulfilled = Number(itemfulfilled[2]);
    var points = CAPointsArr.filter(function(compare)
            {
            return material == compare.Material && quality == compare.Quality && amount == compare.Amount;
            })[0].Points;
    var numPoints = Number(points);
    var bodObj = {Size: size, Material: material, MaterialCode: materialCode, MaterialColor: materialColor, Quality: quality, Amount: amount, Fulfilled: fulfilled, Item: item, Points: numPoints};
    return bodObj;
    }

function BSBodParse(bod)
    {
    var bodPropLines = bod.Properties().match(/^.*$/gm);
    var size = bodPropLines[3];
    var materialLine = bodPropLines[4];
    if(Orion.Contains(materialLine, 'All Items Must'))
        {
        var substring1 = materialLine.slice(28);
        var substring2 = substring1.substring(0,substring1.length - 8);
        var material = substring2;
        }
    else
        var material = 'Iron';
    var materialInfo = BSMaterialArr.filter(function(part)
        {
        return part[0] == material;
        });
    var materialCode = materialInfo[0][1];
    var materialColor = materialInfo[0][2];
    var quality =  bodPropLines[5];
    var amount = Number(bodPropLines[6].match(/Amount To Make: (\d+)/)[1]);
    var itemfulfilled = bodPropLines[7].match(/([\w\-\)\( ]*): (\d+)/);
    var item = itemfulfilled[1];
    var fulfilled = Number(itemfulfilled[2]);
    var points = BSPointsArr.filter(function(compare)
            {
            return material == compare.Material && quality == compare.Quality && amount == compare.Amount;
            })[0].Points;
    var numPoints = Number(points);
    var bodObj = {Size: size, Material: material, MaterialCode: materialCode, MaterialColor: materialColor, Quality: quality, Amount: amount, Fulfilled: fulfilled, Item: item, Points: numPoints};
    return bodObj;
    }

function MoveAll(itemGraphic,itemColor)
    {
    itemGraphic || any;
    itemColor || any;
    Orion.CharPrint(self, 1159, 'Target FROM container')
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container')
    Orion.WaitForAddObject('toContainer');
    while(Orion.FindType(any, any, 'fromContainer')[0])
        {
        Orion.MoveItem(Orion.FindType(itemGraphic, itemGraphic, 'fromContainer')[0], 0, 'toContainer')
        Orion.Wait(1100);
        }
    }

function RunicCombiner(runicGraphic,runicColor)
	{
	while(true)
		{
		var runics = Orion.FindTypeEx(runicGraphic,runicColor).filter(function(part)
			{
			return  +part.Properties().match(/Uses Remaining: (\d+)/)[1] <= 50;
			});
		if(runics[1])
			{
			Orion.UseObject(runics[0].Serial())
			Orion.WaitForTarget(2000);
			Orion.TargetObject(runics[1].Serial());
			}
		else
			break;
		Orion.Wait(1200);
		}
	}

function GoToNPC(npcProfessionString, atlasName) 
    {
    switch(atlasName)
        {
        case 'Carpenters':
            var numRunes = CAnumRunes;
            break;
        case 'Blacksmiths':
            var numRunes = BAnumRunes;
            break;
        default:
            return Orion.CharPrint('Type Error in GoToNPC');
        }
    if(!Orion.RegRead('runeIndex'))
		Orion.RegWrite('runeIndex', '1');
	var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 20, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), npcProfessionString);
        });
	if(npc.length)
        {
        Orion.WalkTo(npc[0].X(),npc[0].Y(),npc[0].Z(), 1);
        return npc[0];
	    }
    else
        {
        var runeIndex = Orion.RegRead('runeIndex');
        AtlasByName(atlasName, runeIndex);
        if(runeIndex < numRunes)
            Orion.RegWrite('runeIndex', +runeIndex + 1);
        else
            Orion.RegWrite('runeIndex', '1');
        }
	return GoToNPC(npcProfessionString, atlasName);
    }

function BribeCheck(npcSerial, bodSerial)
    {
    Orion.WaitContextMenuID(npcSerial, 419);
    Orion.RequestContextMenu(npcSerial);
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(bodSerial);
    var check = Orion.WaitJournal("If you help me out, I'll help you out", Orion.Now()-1000, Orion.Now() + 1000, 'mobile', npcSerial)
    if(check)
        {
        var cost = Number(check.Text().match(/\d+/))
        return cost;
        }
    return -1;
    }

function CraftItem(toolSet, menuButtonID, itemButtonID)
    {
    Orion.UseObject(Orion.FindType(toolSet)[0]);
    var startTime = Orion.Now()
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
    if(Orion.WaitForGump(5000))
        {
        var gump = Orion.GetGump(any, '0x000001CC');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(1000))
        {
        var gump4 = Orion.GetGump(any, '0x000001CC');
        if(gump4 !== null)
            {
            gump4.Select(Orion.CreateGumpHook(0));
            Orion.Wait(200);
            }
        }
    Orion.Wait(200);
    var elapsedTime = Orion.Now() - startTime;
    if(elapsedTime < 1200)
        Orion.Wait(1200 - elapsedTime);
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID)
    {
    if(!colorID)
        colorID = any;
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, backpack, 0, false);
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

function AtlasByName(bookName,runeName,backupBook,backupRune) 
	{
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    switch(bookName)
        {
        case 'Carpenters':
            var numRunes = CAnumRunes;
            break;
        case 'Blacksmiths':
            var numRunes = BAnumRunes;
            break;
        default:
            return Orion.CharPrint('Type Error in GoToNPC');
        }
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x9C16').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName;
        });
    if(!runeItem[0])
        {
        Orion.Print("Atlas named '" + bookName + "' not found!");
        Orion.Wait(500);
        return false;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 500)
    	var recallType = 4000; //recall
	else
		var recallType = 5000; //sacred journey
    Orion.CharPrint(self, 1159, "Recalling to: '" + runeName + "' in Atlas: '" + bookName + "'");
	Orion.UseObject(runeItem[0].Serial());
	if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(runeName) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001F2');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(100);
                        }
                    }
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(runeName) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(runeName);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 23)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        break;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    	    break;
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001F2');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(5));
                        Orion.Wait(100);
                        }
                    }
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(buttonCode));
            Orion.Wait(100);
            }
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(recallType));
            Orion.Wait(100);
            }
        }
	var check = Orion.WaitJournal('Something is blocking the location.|You cannot teleport into that area.', Orion.Now(), Orion.Now()+4000, 'sys');
	if(check && check.Text() == 'Something is blocking the location.')
		{
        Orion.Wait(2000);
        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
            {
            return part.Properties().match(/.+$/) == backupBook;
            });
        if(backup)
            return AtlasByName(backupBook, backupRune, bookName, runeName);
        else
            Orion.Print("No backup atlas named '" + backupBook + "' found!");
		}
    else if(check && check.Text() == 'You cannot teleport into that area.')
		{
        var runeIndex = Orion.RegRead('runeIndex');
        if(runeIndex < numRunes)
            Orion.RegWrite('runeIndex', +runeIndex + 1);
        else
            Orion.RegWrite('runeIndex', '1');
        return AtlasByName(bookName, runeIndex);
		}
	if(x == Player.X() && y == Player.Y()) 
        return AtlasByName(bookName,runeName,backupBook,backupRune);
    return true;
	}

var CarpentryArr =
    [//Name, CategoryButton, ItemButton
    //other
        ['Barrel Staves', 9001, 68],
        ['Barrel Lid', 9001, 69],
    //furniture
        ['Foot Stool', 9002, 82],
        ['Stool', 9002, 83],
    //containers
        ['Crate', 9003, 98],
    ];
    
var BlacksmithyArr =
    [//Name, CategoryButton, ItemButton
    ['Buckler ', 9003, 33], //the space after 'Buckler' is necessary
    ['Bronze Shield', 9003, 34],
    ['Metal Shield', 9003, 36],
    ['Tear Kite Shield', 9003, 38],
    ];

var CAMaterialArr =
    [ //name, button code, color
        ['Wood', 5000, '0x0000'],
        ['Oak', 5001, '0x07DA'],
        ['Ash', 5002, '0x04A7'],
        ['Yew', 5003, '0x04A8'],
        ['Heartwood', 5004, '0x04A9'],
        ['Bloodwood', 5005, '0x04AA'],
        ['Frostwood', 5006, '0x047F']
    ];

var BSMaterialArr =
    [ //name, button code, color
        ['Iron', 5000, '0x0000'],
        ['Dull Copper', 5001, '0x0973'],
        ['Shadow Iron', 5002, '0x0966'],
        ['Copper', 5003, '0x096D'],
        ['Bronze', 5004, '0x0972'],
        ['Gold', 5005, '0x08A5'],
        ['Agapite', 5006, '0x0979'],
        ['Verite', 5007, '0x089F'],
        ['Valorite', 5008, '0x08AB']
    ];

var CAPointsArr = 
    [
        //Normal
        {Material: 'Wood',			Quality: 'Normal',		Amount: 10,	Points:	10},
        {Material: 'Wood',			Quality: 'Normal',		Amount: 15,	Points:	25},
        {Material: 'Wood',			Quality: 'Normal',		Amount: 20,	Points:	50},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 10,	Points:	310},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 15,	Points:	325},
        {Material: 'Oak',				Quality: 'Normal',		Amount: 20,	Points:	350},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 10,	Points:	360},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 15,	Points:	375},
        {Material: 'Ash',				Quality: 'Normal',		Amount: 20,	Points:	400},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 10,	Points:	410},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 15,	Points:	425},
        {Material: 'Yew',				Quality: 'Normal',		Amount: 20,	Points:	450},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 10,	Points:	460},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 15,	Points:	475},
        {Material: 'Heartwood',	Quality: 'Normal',		Amount: 20,	Points:	500},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 10,	Points:	510},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 15,	Points:	525},
        {Material: 'Bloodwood',	Quality: 'Normal',		Amount: 20,	Points:	550},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 10,	Points:	560},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 15,	Points:	575},
        {Material: 'Frostwood',	Quality: 'Normal',		Amount: 20,	Points:	600},
        //Exceptional
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 10,	Points:	210},
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 15,	Points:	225},
        {Material: 'Wood',			Quality: 'Exceptional',	Amount: 20,	Points:	250},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 10,	Points:	510},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 15,	Points:	525},
        {Material: 'Oak',				Quality: 'Exceptional',	Amount: 20,	Points:	550},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 10,	Points:	560},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 15,	Points:	575},
        {Material: 'Ash',				Quality: 'Exceptional',	Amount: 20,	Points:  600},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 10,	Points:	610},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 15,	Points:	625},
        {Material: 'Yew',				Quality: 'Exceptional',	Amount: 20,	Points:	650},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 10,	Points:	660},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 15,	Points:	675},
        {Material: 'Heartwood',	Quality: 'Exceptional',	Amount: 20,	Points:	700},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 10,	Points:	710},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 15,	Points:	725},
        {Material: 'Bloodwood',	Quality: 'Exceptional',	Amount: 20,	Points:	750},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 10,	Points:	760},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 15,	Points:	775},
        {Material: 'Frostwood',	Quality: 'Exceptional',	Amount: 20,	Points:	800}
    ]

var BSPointsArr = 
    [
        //Normal
        {Material: 'Iron',			Quality: 'Normal',		Amount: 10,	Points:	10},
        {Material: 'Iron',			Quality: 'Normal',		Amount: 15,	Points:	25},
        {Material: 'Iron',			Quality: 'Normal',		Amount: 20,	Points:	50},
        {Material: 'Dull Copper',	Quality: 'Normal',		Amount: 10,	Points:	210},
        {Material: 'Dull Copper',	Quality: 'Normal',		Amount: 15,	Points:	225},
        {Material: 'Dull Copper',	Quality: 'Normal',		Amount: 20,	Points:	250},
        {Material: 'Shadow Iron',	Quality: 'Normal',		Amount: 10,	Points:	260},
        {Material: 'Shadow Iron',   Quality: 'Normal',		Amount: 15,	Points:	275},
        {Material: 'Shadow Iron',	Quality: 'Normal',		Amount: 20,	Points:	300},
        {Material: 'Copper',	    Quality: 'Normal',		Amount: 10,	Points:	310},
        {Material: 'Copper',	    Quality: 'Normal',		Amount: 15,	Points:	325},
        {Material: 'Copper',	    Quality: 'Normal',		Amount: 20,	Points:	350},
        {Material: 'Bronze',	    Quality: 'Normal',		Amount: 10,	Points:	360},
        {Material: 'Bronze',	    Quality: 'Normal',		Amount: 15,	Points:	375},
        {Material: 'Bronze',	    Quality: 'Normal',		Amount: 20,	Points:	400},
        {Material: 'Gold',	    Quality: 'Normal',		Amount: 10,	Points:	410},
        {Material: 'Gold',	    Quality: 'Normal',		Amount: 15,	Points:	425},
        {Material: 'Gold',	    Quality: 'Normal',		Amount: 20,	Points:	450},
        {Material: 'Agapite',	    Quality: 'Normal',		Amount: 10,	Points:	460},
        {Material: 'Agapite',	    Quality: 'Normal',		Amount: 15,	Points:	475},
        {Material: 'Agapite',	    Quality: 'Normal',		Amount: 20,	Points:	500},
        {Material: 'Verite',	    Quality: 'Normal',		Amount: 10,	Points:	510},
        {Material: 'Verite',	    Quality: 'Normal',		Amount: 15,	Points:	525},
        {Material: 'Verite',	    Quality: 'Normal',		Amount: 20,	Points:	550},
        {Material: 'Valorite',  	Quality: 'Normal',		Amount: 10,	Points:	560},
        {Material: 'Valorite',  	Quality: 'Normal',		Amount: 15,	Points:	575},
        {Material: 'Valorite',	    Quality: 'Normal',		Amount: 20,	Points:	600},
        //Exceptional
        {Material: 'Iron',			Quality: 'Exceptional',	Amount: 10,	Points:	210},
        {Material: 'Iron',			Quality: 'Exceptional',	Amount: 15,	Points:	225},
        {Material: 'Iron',			Quality: 'Exceptional',	Amount: 20,	Points:	250},
        {Material: 'Dull Copper',	Quality: 'Exceptional',	Amount: 10,	Points:	410},
        {Material: 'Dull Copper',	Quality: 'Exceptional',	Amount: 15,	Points:	425},
        {Material: 'Dull Copper',	Quality: 'Exceptional',	Amount: 20,	Points:	450},
        {Material: 'Shadow Iron',	Quality: 'Exceptional',	Amount: 10,	Points:	460},
        {Material: 'Shadow Iron',	Quality: 'Exceptional',	Amount: 15,	Points:	475},
        {Material: 'Shadow Iron',	Quality: 'Exceptional',	Amount: 20,	Points: 500},
        {Material: 'Copper',		Quality: 'Exceptional',	Amount: 10,	Points:	510},
        {Material: 'Copper',		Quality: 'Exceptional',	Amount: 15,	Points:	525},
        {Material: 'Copper',		Quality: 'Exceptional',	Amount: 20,	Points:	550},
        {Material: 'Bronze',	    Quality: 'Exceptional',	Amount: 10,	Points:	560},
        {Material: 'Bronze',	    Quality: 'Exceptional',	Amount: 15,	Points:	575},
        {Material: 'Bronze',	    Quality: 'Exceptional',	Amount: 20,	Points:	600},
        {Material: 'Gold',	    Quality: 'Exceptional',	Amount: 10,	Points:	610},
        {Material: 'Gold',	    Quality: 'Exceptional',	Amount: 15,	Points:	625},
        {Material: 'Gold',	    Quality: 'Exceptional',	Amount: 20,	Points:	650},
        {Material: 'Agapite',	    Quality: 'Exceptional',	Amount: 10,	Points:	660},
        {Material: 'Agapite',	    Quality: 'Exceptional',	Amount: 15,	Points:	675},
        {Material: 'Agapite',	    Quality: 'Exceptional',	Amount: 20,	Points:	700},
        {Material: 'Verite',	    Quality: 'Exceptional',	Amount: 10,	Points:	710},
        {Material: 'Verite',	    Quality: 'Exceptional',	Amount: 15,	Points:	725},
        {Material: 'Verite',	    Quality: 'Exceptional',	Amount: 20,	Points:	750},
        {Material: 'Valorite',	    Quality: 'Exceptional',	Amount: 10,	Points:	760},
        {Material: 'Valorite',	    Quality: 'Exceptional',	Amount: 15,	Points:	775},
        {Material: 'Valorite',	    Quality: 'Exceptional',	Amount: 20,	Points:	800}
    ]

//Bokuto Script ---------------------------------------------/
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
        while(!Orion.FindType('0x27A8')[0])
            {
            Orion.CharPrint(self,1159,'Crafting Bokuto');
            CraftItem(_item.CarpenterTool.Graphic, 9004, 121);
            Orion.Wait(200);
            }
        if(Orion.GetGlobal('created'))
            {
            var createdIncrement = Number(Orion.GetGlobal('created')) + 1;
            Orion.SetGlobal('created', createdIncrement);
            }
        var bok = Orion.FindTypeEx('0x27A8')[0];
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
                while(Orion.FindType('0x27A8')[0])
                    {
                    Orion.MoveItem(bok.Serial(), 0, supplyContainer.Serial());
                    Orion.Wait(1100);
                    }
                if(Orion.GetGlobal('saved7070'))
                    {
                    var seventyseventyIncrement = Number(Orion.GetGlobal('saved7070')) + 1;
                    Orion.SetGlobal('saved7070', seventyseventyIncrement);
                    }
                }
            else if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%'))
                {
                Orion.CharPrint(self,1159,'70 lightning made!');
                while(Orion.FindType('0x27A8')[0])
                    {
                    Orion.MoveItem(bok.Serial(), 0, supplyContainer.Serial());
                    Orion.Wait(1100);
                    }
                if(Orion.GetGlobal('saved70lightning'))
                    {
                    var lightningIncrement = Number(Orion.GetGlobal('saved70lightning')) + 1;
                    Orion.SetGlobal('saved70lightning', lightningIncrement);
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