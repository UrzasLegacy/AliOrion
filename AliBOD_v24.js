//#include AliImbueFavorites.js
/*
AliBod v23
PATCH NOTES
v1: Carpentry BOD Briber Framework
v2: Carpentry BOD Crafter Framework
v3: Crafter generalization refactor
v4: Ash Dovetail combining and turnin added. Misc helper functions
v5: Menu Gump added
v6: Bokuto crafter
v7: Refactor prep. Added _item
v8: Full generalization refactor. Blacksmithy added. Gump Updated
v9: Crafter speed refactor
v10: RegRead to Shared. Added gump cliloc check for material type
v11: Plate Luck Suit crafter
v12: Gump Button Array serialIndex added
v13: Changed BodCrafter to use container instead of bank
v14: BODBriber skip blocked runes
v15: Added SuitGrabber, added SuitReader
v16: Added PofGearInBag, added SuitReader to gump
v17: Added Luck Shield crafting, added elemental katana/double axe/bladed staff crafting
v18: Added PoF bribing and related utility functions, fixed tool crafting hangup, 100% energy weapon typo fix
v19: MoveItem functions open containers automatically, BodBriber now cycles through rune locations continuously
v20: Fixed MoveItem interacting poorly with using BOD book or another player as the receiver, added imbuing framework
v21: Fixed Bok script not restocking iron ingots properly
v22: Added ImbuingFavorites
v23: Fixed PlateSuit Gump
v24: Automatically insure after imbuing items
*/
var CAnumRunes = 25; //Input number of carpenter rune locations in your atlas
var BSnumRunes = 40; //Input number of blacksmith rune locations in your atlas

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
var serialIndex = 1;
var BODGumpButtons = //xsize ysize CallBackID Text FunctionName
    [
        [ [100, 30, serialIndex++, "BSBodBriber", 'BodBriber', ['Blacksmithy']], [100, 30, serialIndex++, "BSBodCrafter", 'BodCrafter', ['Blacksmithy']], [100, 30, serialIndex++, "BSBodGrabber", 'BODgrabber', ['Blacksmithy']] ],
        [ [100, 30, serialIndex++, "ShadowCombiner", 'RunicCombiner', [_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron.Color]],[100, 30, serialIndex++, "CopperCombiner", 'RunicCombiner', [_item.BlacksmithRunic.Graphic,_item.Ingot.Copper.Color]], [100, 30, serialIndex++, "MoveHammers", 'MoveAll', [_item.BlacksmithRunic.Graphic]] ],
        [ [100, 30, serialIndex++, "ShadowTurnin", 'BodTurnin', ['Blacksmithy', 117]], [100, 30, serialIndex++, "CopperTurnin", 'BodTurnin', ['Blacksmithy', 123]], [100, 30, serialIndex++, "BSBodMule", 'BodMule', ['Blacksmithy']] ],
        [],
        [ [100, 30, serialIndex++, "PoFBodBriber", 'BodBriber', ['BlacksmithyPOF']], [100, 30, serialIndex++, "PoFTurnin", 'BodTurnin', ['Blacksmithy', 112]], [100, 30, serialIndex++, "MovePoF", 'MoveAll', ['0x1006']] ],
        [ [100, 30, serialIndex++, "PoFKegFiller", 'PoFKegFiller'] ],
        [],
        [ [100, 30, serialIndex++, "CABodBriber", 'BodBriber', ['Carpentry']], [100, 30, serialIndex++, "CABodCrafter", 'BodCrafter', ['Carpentry']], [100, 30, serialIndex++, "CABodGrabber", 'BODgrabber', ['Carpentry']] ],
        [ [100, 30, serialIndex++, "AshCombiner", 'RunicCombiner', [_item.CarpenterRunic.Graphic,_item.Board.Ash.Color]], [], [100, 30, serialIndex++, "MoveSaws", 'MoveAll', [_item.CarpenterRunic.Graphic]] ],
        [ [100, 30, serialIndex++, "AshTurnin", 'BodTurnin', ['Carpentry', 115]], [], [100, 30, serialIndex++, "CABodMule", 'BodMule', ['Carpentry']] ],
        [],
        [ [100, 30, serialIndex++, "MoveBODs", 'MoveAll', ['0x2258']] ],
        [],
        [ [100, 30, serialIndex++, "Bok", 'BokInit'] ],
        [],
        [ [100, 30, serialIndex++, "Helm", 'PlateSuit',['Helm']], [100, 30, serialIndex++, "Gorget", 'PlateSuit',['Gorget']], [100, 30, serialIndex++, "Arms", 'PlateSuit',['Arms']] ],
        [ [100, 30, serialIndex++, "Gloves", 'PlateSuit',['Gloves']], [100, 30, serialIndex++, "Tunic", 'PlateSuit',['Tunic']], [100, 30, serialIndex++, "Legs", 'PlateSuit',['Legs']] ],
        [ [100, 30, serialIndex++, "Shield", 'PlateSuit',['Shield']] ],
        [],
        [ [100, 30, serialIndex++, "SuitGrabber", 'initSuitGrabber'], [100, 30, serialIndex++, "PieceCheck", 'PlatemailCheck'] ],
        [],
        [ [100, 30, serialIndex++, "PofGearInBag", 'PofGearInBag'], [100, 30, serialIndex++, "SuitReader", 'SuitReader'] ],
        [],
        [ [100, 30, serialIndex++, "ExcKatana", 'ExcKatana'], [100, 30, serialIndex++, "ExcDoubleAxe", 'ExcDoubleAxe'], [100, 30, serialIndex++, "ExcBladedStaff", 'ExcBladedStaff'] ],
        [ [100, 30, serialIndex++, "NormKatana", 'NormKatana'], [100, 30, serialIndex++, "NormDoubleAxe", 'NormDoubleAxe'], [100, 30, serialIndex++, "NormBladedStaff", 'NormBladedStaff'] ],
        [],
        [ [100, 30, serialIndex++, "ImbueGump", "ImbueGump"] ],
    ]
    function PlateHelm()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Helm')
    }

function PlateGorget()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Gorget')
    }

function PlateArms()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Arms')
    }

function PlateGloves()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Gloves')
    }

function RingmailTunic()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Tunic')
    }

function ChainmailLegs()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Legs')
    }

function PlateShield()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Shield')
    }
function Gump()
    {
    Orion.Exec('GMJournalScan',true);
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, BODGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, BODGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    BODGumpButtons.forEach(function(rowLayer)
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
    BODGumpButtons.forEach(function(rowLayer)
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

function ImbueGump()
    {
    Orion.Exec('GMJournalScan',true);
    var gump = Orion.CreateCustomGump(12003);
    gump.Clear();
    gump.SetCallback('ImbueGumpCallback');
    var widest = Math.max.apply(Math, imbueGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, imbueGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    imbueGumpButtons.forEach(function(rowLayer)
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

function ImbueGumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    imbueGumpButtons.forEach(function(rowLayer)
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
    return x * 105 + 2
    }
function gridY(y){
    return y * 30
    }
function gridTX(x){
    return x * 105 + 7
    }
function gridTY(y){
    return y * 30 + 4
    }

//Utilities -------------------------/
function DropDraggedToContainer()
	{
	var dropContainer = Orion.FindObject('dropContainer');
	if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}

function ContainerGumpToggle()
	{
    Orion.ClientOptionSet('GriddedContainers', !Orion.ClientOptionGet('GriddedContainers'));
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
    Gump();
    }

//Helpers ------------------------/
function AutoBriber(craftType)
    {
    var startTime = Orion.Now();
    switch(craftType)
        {
        case 'Carpentry':
            var npcProfessionString = 'the carpenter';
            var atlasName = 'Carpenters';
            break;
        case 'Blacksmithy':
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths';
            break;
        case 'BlacksmithyPOF':
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths';
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in AutoBriber')
        }
    AtlasByName(atlasName, '1');
    var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 20, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), npcProfessionString);
        });
    if(npc.length)
        Orion.WalkTo(npc[0].X(),npc[0].Y(),npc[0].Z(), 1);
    else
        return Orion.CharPrint(self,1159,'No NPC found! Halting...');
    while(true)
        {
        if(BribePossible(npc[0].Serial()))
            {
            var deltaTime = Orion.Now() - startTime;
            var date = new Date(deltaTime);
            var time = date.toISOString().substring(11, 19);
            TextWindow.Open();
            TextWindow.Print(time);
            if(Orion.WaitForTarget())
                Orion.CancelTarget();
            Orion.Wait(500);
            BodBriber(craftType);
            Orion.Wait(5000);
            return AutoBriber(craftType);
            }
        Orion.Wait(10000);
        Orion.UseObject(backpack);
        Orion.Wait(10000);
        }
    }

function BodBriber(craftType)
    {
    var totalBribeCost = 0;
    var totalBodsBribed = 0;
    var gump = Orion.CreateCustomGump(12001);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, 200, 30);
    gump.AddText(15, 5, "0",'Price per BOD: ');
    gump.AddText(110, 5, "0", '0gp');
    gump.Update();
    Shared.AddVar('runeIndex', '1');
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
            var numRunes = CAnumRunes;
            var bribeLimit = 100000;
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse;
            var craftArr = BlacksmithyArr;
            var targetPointValue = 650;
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths';
            var numRunes = BSnumRunes;
            var bribeLimit = 70000;
            break;
        case 'BlacksmithyPOF':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse;
            var craftArr = BlacksmithyArr;
            var targetPointValue = 450;
            var npcProfessionString = 'the blacksmith|the armourer|the weaponsmith';
            var atlasName = 'Blacksmiths';
            var numRunes = BSnumRunes;
            var bribeLimit = 25000;
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BodBriber')
        }
    while(true)
        {
        //if(+Shared.GetVar('runeIndex') > numRunes)
            //return Orion.CharPrint('End of rune rotation! Halting...');
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor)[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCraftArr = craftArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCraftArr || bodInfo.Size == 'Large Bulk Order')
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
                            var bribeCost = BribeCheck(npc.Serial(), bodObj.Serial());
                            if(bribeCost > -1 && bribeCost < bribeLimit)
                                {
                                Orion.MoveItem(bodObj.Serial(), 0, npc.Serial());
                                Orion.Wait(1300);
                                totalBribeCost += bribeCost;
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
                    totalBodsBribed++;
                    var gump = Orion.CreateCustomGump(12001);
                    gump.Clear();
                    gump.AddResizepic(0, 0, 0xBB8, 200, 30);
                    gump.AddText(15, 5, "0",'Price per BOD: ');
                    gump.AddText(110, 5, "0", (totalBribeCost / totalBodsBribed).toFixed(0) + 'gp');
                    gump.Update();
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
            var professionClilocPrefix = ' xmfhtmltok 50 365 250 18 0 0 16777215 ';
            break;
        case 'Blacksmithy':
            var BODGraphic = _item.BlacksmithBOD.Graphic;
            var BODColor = _item.BlacksmithBOD.Color;
            var BodParse = BSBodParse;
            var craftArr = BlacksmithyArr;
            var atlasName = 'Blacksmiths';
            var toolGraphic = '0x0FBC'; //Tongs
            var toolColor = '0x0000';
            var toolButtonCode = 20;
            var materialUseType = _item.Ingot.Iron.Graphic;
            var runicGraphic = _item.BlacksmithRunic.Graphic;
            var runicColor = _item.BlacksmithRunic.Color;
            var professionClilocPrefix = ' xmfhtmltok 50 365 170 18 0 0 32767 ';
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in BodCrafter')
        }
    Orion.CharPrint(self,1159,'Target your supply container. It should contain iron ingots, necessary materials, and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', supplyContainer))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        Orion.UseObject(supplyContainer);
        Orion.Wait(1300);
        }
    while(Orion.FindType(runicGraphic,runicColor)[0]) //put away runics
        {
        Orion.CharPrint(self,1159,'Storing Runics in supply container');
        Orion.MoveItem(Orion.FindType(runicGraphic,runicColor)[0], 0, supplyContainer);
        Orion.Wait(1300);
        }
    while(true)
        {
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor)[0];
        if(bodObj)
            {
            var bodInfo = BodParse(bodObj);
            var bodCraftArr = craftArr.filter(function(item)
                {
                return item[0] == bodInfo.Item;
                })[0];
            if(!bodCraftArr || bodInfo.Size == 'Large Bulk Order')
                {
                var invalidBODBook = Orion.FindTypeEx(_item.BODBook.Graphic).filter(function(book)
                    {
                    return Orion.Contains(book.Properties(), atlasName + ' Invalid', false);
                    })[0];
                if(invalidBODBook)
                    {
                    Orion.Wait(1300);
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
                    Orion.Wait(1300);
                    }
                else
                    {
                    while(!Orion.GumpExists('container', supplyContainer))
                        {
                        Orion.CharPrint(self,1159,'Opening Supply Container');
                        Orion.UseObject(supplyContainer);
                        Orion.Wait(1300);
                        }
                    Orion.Wait(1300);
                    Orion.MoveItem(bodObj.Serial(), 0, supplyContainer);
                    Orion.Wait(1300);
                    }
                }
            else if(bodCraftArr && bodInfo.Size == 'Small Bulk Order')
                {
                if(bodInfo.Fulfilled != bodInfo.Amount)
                    {
                    CraftTool(toolGraphic,toolColor,toolButtonCode,supplyContainer);
                    CloseAllGumps();
                    Orion.CharPrint(self,1159,'Setting Material type');
                    var materialType = BodParse(bodObj).MaterialColor;
                    while(!CheckGumpCliloc('0x000001CC', professionClilocPrefix + bodInfo.MaterialCliloc))
                        {
                        Orion.UseObject(Orion.FindType(toolGraphic,toolColor)[0]);
                        if(Orion.WaitForGump(2000))
                            {
                            var gumpMaterial = Orion.GetGump(any, '0x000001CC');
                            if(gumpMaterial !== null)
                                {
                                gumpMaterial.Select(Orion.CreateGumpHook(BodParse(bodObj).MaterialCode));
                                Orion.Wait(200);
                                }
                            }
                        Orion.Wait(1300);
                        }
                    CloseAllGumps();
                    var firstPass = true;
                    while(BodParse(bodObj).Fulfilled < BodParse(bodObj).Amount)
                        {
                        var needed = BodParse(bodObj).Amount - BodParse(bodObj).Fulfilled;
                        Orion.CharPrint(self, 1159, 'Items Needed: ' + needed)
                        for(var i=0;i<needed;i++)
                            {
                            while(Player.Weight() > 500)
                                {
                                Orion.CharPrint(self,1159,'Over weight threshold, tidying inventory');
                                while(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0])
                                    {
                                    Orion.MoveItem(Orion.FindType('0x1BD7|0x1BF2|0x1766|0x318F|0x1BD1|0x0EF3')[0], 0, supplyContainer);
                                    Orion.Wait(1300);
                                    }
                                }
                            if(!Orion.FindType(toolGraphic,toolColor)[0])
                                {
                                CloseAllGumps();
                                CraftTool(toolGraphic,toolColor,toolButtonCode, supplyContainer);
                                firstPass = true;
                                }
                            while(Orion.Count(materialUseType, materialType, backpack, 0, false) < 50)
                                {
                                Orion.CharPrint(self,1159,'Restocking Resources');
                                if(!Restock('Resources', materialUseType, supplyContainer, 150, materialType))
                                    return;
                                }
                            Orion.CharPrint(self,1159,'Crafting: ' + bodCraftArr[0] + ' ' + (i + 1));                        
                            if(firstPass)
                                {
                                CraftItem(toolGraphic, bodCraftArr[1], bodCraftArr[2]);
                                firstPass = false;
                                }
                            else
                                CraftLast(toolGraphic);
                            Orion.Wait(1);
                            }
                        Orion.Wait(1300);
                        while(Orion.GetGump(any))
                            {
                            Orion.Print(Orion.GetGump(any).ID())
                            Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
                            Orion.Wait(100);
                            } 
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
                        Orion.Wait(1300);
                        }
                    Orion.Wait(500);
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
                Orion.CharPrint(self,1159,'Moving resources back to supply container');
                Orion.MoveItemType(_item.Board.Wood.Graphic, any, backpack, 0, supplyContainer) || Orion.MoveItemType(_item.Ingot.Iron.Graphic, '!0x0000', backpack, 0, supplyContainer);
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
            break;
        default:
            return Orion.CharPrint(self,1159,'Type error in BodTurnin');
        }
    var npc = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), npcProfessionString);
        })[0];
    if(!npc)
        return Orion.Print('No npc within two tiles! Halting...')
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
        var bodObj = Orion.FindTypeEx(BODGraphic,BODColor).sort(function(a,b)
            {
            if(BodParse(a).Fulfilled == BodParse(b).Fulfilled)
                return 1
            return -1;
            })[0];
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
                    return Orion.Contains(book.Properties(), atlasName + ' Valid', false) && +book.Properties().match(/Deeds In Book: (\d+)/)[1] < 500
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
    var materialCode = materialInfo[0][1];
    var materialColor = materialInfo[0][2];
    var materialCliloc = materialInfo[0][3];
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
    var bodObj = {Size: size, Material: material, MaterialCode: materialCode, MaterialColor: materialColor, MaterialCliloc: materialCliloc, Quality: quality, Amount: amount, Fulfilled: fulfilled, Item: item, Points: numPoints};
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
    var materialCliloc = materialInfo[0][3];
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
    var bodObj = {Size: size, Material: material, MaterialCode: materialCode, MaterialColor: materialColor, MaterialCliloc: materialCliloc, Quality: quality, Amount: amount, Fulfilled: fulfilled, Item: item, Points: numPoints};
    return bodObj;
    }

function MoveAll(itemGraphic,itemColor)
    {
    var itemGraphicThru = itemGraphic || any;
    var itemColorThru = itemColor || any;
    Orion.CharPrint(self, 1159, 'Target FROM container');
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container');
    Orion.WaitForAddObject('toContainer');
    var fromSerial = Orion.GetSerial('fromContainer');
    var toSerial = Orion.GetSerial('toContainer');
    VerifyOpenObjectGump(fromSerial);
    var toCheck = Orion.FindObject(toSerial);
    if(!toCheck.Mobile() && !Orion.Contains(toCheck.Properties(), 'Bulk Order Book'))
        VerifyOpenObjectGump(toSerial);
    while(Orion.FindType(itemGraphicThru, itemColorThru, fromSerial)[0])
        {
        Orion.MoveItem(Orion.FindType(itemGraphicThru, itemColorThru, fromSerial)[0], 0, toSerial);
        Orion.Wait(1100);
        }
    }

function VerifyOpenObjectGump(itemSerial)
    {
    while(!Orion.GumpExists('container', itemSerial) && !Orion.GumpExists('generic', itemSerial))
        {
        Orion.UseObject(itemSerial);
        Orion.Wait(1300);
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

function PoFKegFiller()
    {
    while(true)
        {
        var pof = Orion.FindType('0x1006','0x0973')[0];
        if(!pof) break;
        var keg = Orion.FindTypeEx('0x1940').filter(function(item)
            {
            return +(item.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'251'])[1] < 241;
            }).sort(function(a,b)
                {
                return +(b.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'251'])[1] - +(a.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'251'])[1]
                })[0];
        if(!keg) break;
        Orion.MoveItem(pof, 0, keg.Serial());
        Orion.Wait(1300);
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
            var numRunes = BSnumRunes;
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in GoToNPC');
        }
    if(!Shared.GetVar('runeIndex'))
        Shared.AddVar('runeIndex', '1');
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
        var runeIndex = Shared.GetVar('runeIndex');
        if(+runeIndex <= numRunes)
            Shared.AddVar('runeIndex', String(+runeIndex + 1));
        else
            {
            Shared.AddVar('runeIndex', '1');
            runeIndex = '1';
            //Orion.Print('End of rotation! Halting...');
            //Orion.Terminate('all', 'GMJournalScan|AutoBriber');
            }
        AtlasByName(atlasName, runeIndex);
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

function BribePossible(npcSerial)
    {
    Orion.WaitContextMenuID(npcSerial, 419);
    Orion.RequestContextMenu(npcSerial);
    var check = Orion.WaitJournal("My business is being watched by the Guild", Orion.Now()-1000, Orion.Now() + 1000, 'mobile', npcSerial)
    if(check)
        return false;
    return true;
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

function AtlasByName(bookName,runeName,backupBook,backupRune) 
	{
    if(!Shared.GetVar('runeIndex'))
        Shared.AddVar('runeIndex', '1');
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
            var numRunes = BSnumRunes;
            break;
        default:
            return Orion.CharPrint(self,1159,'Type Error in GoToNPC');
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
	if(check)
		{
        Orion.Wait(2000);
        var runeIndex = Number(Shared.GetVar('runeIndex'));
        if(runeIndex < numRunes)
            Shared.AddVar('runeIndex', String(+runeIndex + 1));
        else
            return Orion.Print('End of rotation! Halting...')
        return AtlasByName(bookName, Shared.GetVar('runeIndex'),backupBook,Shared.GetVar('runeIndex'));
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
    [ //name, button code, color, cliloc
        ['Wood', 5000, '0x0000', '1072643'],
        ['Oak', 5001, '0x07DA', '1072644'],
        ['Ash', 5002, '0x04A7', '1072645'],
        ['Yew', 5003, '0x04A8', '1072646'],
        ['Heartwood', 5004, '0x04A9', '1072647'],
        ['Bloodwood', 5005, '0x04AA', '1072648'],
        ['Frostwood', 5006, '0x047F', '1072649']
    ];

var BSMaterialArr =
    [ //name, button code, color
        ['Iron', 5000, '0x0000', '1044022'],
        ['Dull Copper', 5001, '0x0973', '1044023'],
        ['Shadow Iron', 5002, '0x0966', '1044024'],
        ['Copper', 5003, '0x096D', '1044025'],
        ['Bronze', 5004, '0x0972', '1044026'],
        ['Gold', 5005, '0x08A5', '1044027'],
        ['Agapite', 5006, '0x0979', '1044028'],
        ['Verite', 5007, '0x089F', '1044029'],
        ['Valorite', 5008, '0x08AB', '1044030']
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
        {Material: 'Gold',	        Quality: 'Normal',		Amount: 10,	Points:	410},
        {Material: 'Gold',	        Quality: 'Normal',		Amount: 15,	Points:	425},
        {Material: 'Gold',	        Quality: 'Normal',		Amount: 20,	Points:	450},
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
        {Material: 'Gold',	        Quality: 'Exceptional',	Amount: 10,	Points:	610},
        {Material: 'Gold',	        Quality: 'Exceptional',	Amount: 15,	Points:	625},
        {Material: 'Gold',	        Quality: 'Exceptional',	Amount: 20,	Points:	650},
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


    /*
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
    */

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


//Luck Suits ------------------------------------------------//
var plateInfo = {
    'Helm': {
        itemGraphic: '0x140E',
        categoryCode: 9002,
        itemCode: 23
    },
    'Gorget': {
        itemGraphic: '0x1413',
        categoryCode: 9001,
        itemCode: 10
    },
    'Tunic': {
        itemGraphic: '0x1415',
        categoryCode: 9001,
        itemCode: 12
    },
    'Arms': {
        itemGraphic: '0x1410',
        categoryCode: 9001,
        itemCode: 8
    },
    'Gloves': {
        itemGraphic: '0x1414',
        categoryCode: 9001,
        itemCode: 9
    },
    'Legs': {
        itemGraphic: '0x1411',
        categoryCode: 9001,
        itemCode: 11
    },
}

function PlateHelm()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Helm')
    }

function PlateGorget()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Gorget')
    }

function PlateArms()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Arms')
    }

function PlateGloves()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Gloves')
    }

function RingmailTunic()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Tunic')
    }

function ChainmailLegs()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Legs')
    }

function PlateShield()
    {
    Orion.Exec('PlateGump',true);
    PlateSuit('Shield')
    }

function PlateSuit(itemName)
    {
    var plateInfo = {
        'Helm': {
            itemGraphic: '0x140E',
            categoryCode: 9002,
            itemCode: 23
            },
        'Gorget': {
            itemGraphic: '0x1413',
            categoryCode: 9001,
            itemCode: 10
            },
        'Tunic': {
            itemGraphic: '0x13EC',
            categoryCode: 9001,
            itemCode: 4
            },
        'Arms': {
            itemGraphic: '0x1410',
            categoryCode: 9001,
            itemCode: 8
            },
        'Gloves': {
            itemGraphic: '0x1414',
            categoryCode: 9001,
            itemCode: 9
            },
        'Legs': {
            itemGraphic: '0x13BE',
            categoryCode: 9001,
            itemCode: 6
            },
        'Shield': {
            itemGraphic: '0x1B73',
            categoryCode: 9003,
            itemCode: 33
            },
        }
    var piece = plateInfo[itemName];
    var itemGraphic = piece.itemGraphic;
    var categoryCode = piece.categoryCode;
    var itemCode = piece.itemCode;
    CloseAllGumps();
    Orion.Exec('PlateGump',true);
    Orion.ResumeScript('PlateGump');
    Orion.CharPrint(self,1159,'Target your supply container. It should contain ingots, copper runics, and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var destinationContainer = Orion.FindTypeEx('0x0E41|0x09AB', any, ground, 'item', 2).filter(function(chest)
        {
        return Orion.Contains(chest.Properties(), 'Engraved: ' + itemName);
        })[0];
    while(!CheckGumpCliloc('0x000001CC', ' xmfhtmltok 50 365 170 18 0 0 32767 1044022'))
        {
        CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
        Orion.UseObject(Orion.FindType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color)[0]);
        if(Orion.WaitForGump(2000))
            {
            Orion.CharPrint(self,1159,'Setting Material Type to Iron');
            var gumpMaterial = Orion.GetGump(any, '0x000001CC');
            if(gumpMaterial !== null)
                {
                gumpMaterial.Select(Orion.CreateGumpHook(5000));
                Orion.Wait(200);
                }
            }
        Orion.Wait(1300);
        }
    while(true)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        if(!destinationContainer || destinationContainer.Distance() > 2)
            return Orion.Print('Destination Container not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1300);
            }
        while(!Orion.GumpExists('container', destinationContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Destination Container');
            Orion.UseObject(destinationContainer.Serial());
            Orion.Wait(1300);
            }
        var subContainerPerfect = Orion.FindTypeEx('0x0E75','0x0000',destinationContainer.Serial()).filter(function(backpack)
            {
            return Orion.Contains(backpack.Properties(), 'Engraved: Perfect');
            })[0];
        var subContainerAcceptable = Orion.FindTypeEx('0x0E75','0x0000',destinationContainer.Serial()).filter(function(backpack)
            {
            return Orion.Contains(backpack.Properties(), 'Engraved: Acceptable');
            })[0];
        while(!Orion.GumpExists('container', subContainerPerfect.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Destination SubContainer');
            Orion.UseObject(subContainerPerfect.Serial());
            Orion.Wait(1300);
            }
        while(!Orion.GumpExists('container', subContainerAcceptable.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Destination SubContainer');
            Orion.UseObject(subContainerAcceptable.Serial());
            Orion.Wait(1300);
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
        while(Orion.Count(_item.Ingot.Iron.Graphic,'0x0000') < 50)
            {
            Orion.CharPrint(self,1159,'Restocking Iron Ingots');
            if(!Restock('Iron Ingots', _item.Ingot.Iron.Graphic, supplyContainer.Serial(), 400,'0x0000'))
                return;
            }
        var item = Orion.FindTypeEx(itemGraphic)[0];
        while(!item)
            {
            CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
            Orion.CharPrint(self,1159,'Crafting Plate Piece');
            CraftItem('0x0FBC', categoryCode, itemCode);
            item = Orion.FindTypeEx(itemGraphic)[0];
            }
        incrementShared('created');
        Orion.Wait(250);
        var itemParse = PlatemailParse(item);
        var subContainerChosen;
        var posX;
        var posY;
        if(itemParse.Exceptional)
            {
            if(itemParse.Perfect)
                {
                Orion.CharPrint(self,1159,'Perfect made!');
                subContainerChosen = subContainerPerfect;
                incrementShared('createdPerfect');
                switch(itemParse.Perfect)
                    {
                    case 1:
                        posX = 45;
                        posY = 76;
                        break;
                    case 2:
                        posX = 85;
                        posY = 76;
                        break;
                    case 3:
                        posX = 135;
                        posY = 76;
                        break;
                    default:
                        posX = 85;
                        posY = 120;
                        break;
                    }
                }
            else if(itemParse.Acceptable)
                {
                Orion.CharPrint(self,1159,'Acceptable made!');
                var subContainerChosen = subContainerAcceptable;
                incrementShared('createdAcceptable');
                switch(itemParse.Acceptable)
                    {
                    case 1:
                        posX = 45;
                        posY = 76;
                        break;
                    case 2:
                        posX = 85;
                        posY = 76;
                        break;
                    case 3:
                        posX = 135;
                        posY = 76;
                        break;
                    default:
                        posX = 85;
                        posY = 120;
                        break;
                    }
                }
            else
                {
                while(item.Exists())
                    {
                    CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
                    CloseAllGumps();
                    Orion.CharPrint(self,1159,'Smelting Plate Piece');
                    Orion.UseType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color);
                    if(Orion.WaitForGump(2000))
                        {
                        var gump = Orion.GetGump(any, '0x000001CC');
                        if (gump !== null)
                            {
                            gump.Select(Orion.CreateGumpHook(7000));
                            Orion.Wait(200);
                            }
                        }
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(item.Serial());
                    Orion.Wait(1300);
                    }
                incrementShared('smelted');
                continue;
                }
            var inviableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.Copper.Color).filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges < 4;
                });
            while(inviableRunics.length > 1)
                {
                Orion.CharPrint(self,1159,'Combining Runic Tools');
                Orion.UseObject(inviableRunics[0].Serial());
                Orion.WaitForTarget(2000);
                Orion.TargetObject(inviableRunics[1].Serial());
                Orion.Wait(1300);
                inviableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.Copper.Color).filter(function(runic)
                    {
                    var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                    return charges < 4;
                    });
                }
            var viableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.Copper.Color).filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges >= 4;
                });
            while(!viableRunics[0])
                {
                Orion.CharPrint(self,1159,'Restocking Runic Tool');
                if(!Restock('Runic Tool',_item.BlacksmithRunic.Graphic, supplyContainer.Serial(), 0,_item.Ingot.Copper.Color))
                    return;
                viableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.Copper.Color).filter(function(runic)
                    {
                    var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                    return charges >= 4;
                    });
                }
            CloseAllGumps();
            while(!Orion.Contains(item.Properties(), 'Reforged'))
                {
                Orion.CharPrint(self,1159,'Reforging Plate Piece');
                Orion.UseObject(viableRunics[0].Serial());
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(item.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    if(!CheckGumpCliloc('0x000F3EAC', 1151713))
                        {
                        TextWindow.Open();
                        TextWindow.Print('Reforge not set to Auspicious / of Fortune. Pausing...');
                        Orion.PauseScript('all', 'GMJournalScan');
                        }
                    var gumpReforge = Orion.GetGump(any, '0x000F3EAC');
                    if(gumpReforge !== null)
                        {
                        gumpReforge.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(1300);
                Orion.MoveItem(item.Serial());
                Orion.Wait(1300);
                }
            incrementShared('reforged');
            var resistRecount = PlatemailParse(item);
            //if(Orion.Contains(item.Properties(), 'Luck 150|Luck 140') && resistRecount.TotalResists == 35)
            if(Orion.Contains(item.Properties(), 'Luck 150') && resistRecount.TotalResists == 35)
                {
                Orion.CharPrint(self,1159,'Luck Piece made!');
                if(Orion.Contains(item.Properties(), 'Luck 150'))
                    incrementShared('createdLuck150');
                else
                    incrementShared('createdLuck140');
                while(item.Container() == Orion.GetSerial(backpack))
                    {
                    Orion.MoveItem(item.Serial(), 0, subContainerChosen.Serial(), posX, posY);
                    Orion.Wait(1300);
                    }
                }
            else
                {
                while(item.Exists())
                    {
                    Orion.CharPrint(self,1159,'Unraveling Plate Piece');
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
                        Orion.TargetObject(item.Serial());
                    Orion.Wait(1300);
                    }
                incrementShared('unraveled');
                }
            }
        else
            {
            while(item.Exists())
                {
                CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
                CloseAllGumps();
                Orion.CharPrint(self,1159,'Smelting Plate Piece');
                Orion.UseType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color);
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001CC');
                    if (gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(7000));
                        Orion.Wait(200);
                        }
                    }
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(item.Serial());
                Orion.Wait(1300);
                }
            incrementShared('smelted');
            }
        }
    }

function PlateGump(_)
    {
    Shared.AddVar('created', 0);
    Shared.AddVar('smelted', 0);
    Shared.AddVar('reforged', 0);
    Shared.AddVar('unraveled', 0);
    Shared.AddVar('createdPerfect', 0);
    Shared.AddVar('createdAcceptable', 0);
    Shared.AddVar('createdLuck140', 0);
    Shared.AddVar('createdLuck150', 0);

    var startTime = Orion.Now(); 
    while(true)
        {
        if(!Orion.ScriptRunning('PlateSuit'))
            {
            var startPause = Orion.Now();
            Orion.PauseScript('PlateGump');
            var adjustForPause = Orion.Now() - startPause;
            startTime += adjustForPause;
            }
        var created = Shared.GetVar('created');
        var smelted = Shared.GetVar('smelted');
        var reforged = Shared.GetVar('reforged');
        var unraveled = Shared.GetVar('unraveled');
        var createdPerfect = Shared.GetVar('createdPerfect');
        var createdAcceptable = Shared.GetVar('createdAcceptable');
        var createdLuck140 = Shared.GetVar('createdLuck140');
        var createdLuck150 = Shared.GetVar('createdLuck150');
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var hourDivisor = ms/3600000;
        Orion.Wait(200);
        
		var gump = Orion.CreateCustomGump(12001);
		gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 250, 155);
		
        gump.AddText(15, 5, "0",'Time Elapsed: ');
        gump.AddText(110, 5, "0",time);
        gump.AddText(180, 5, "0",'Per Hour');
        gump.AddText(15, 20, "0",'Created: ');
        gump.AddText(110, 20, "0",created);
        gump.AddText(195, 20, "0",(created/hourDivisor).toFixed(0));
        gump.AddText(15, 35, "0",'Smelted: ');
        gump.AddText(110, 35, "0",smelted);
        gump.AddText(195, 35, "0",(smelted/hourDivisor).toFixed(0));
        gump.AddText(15, 50, "0",'Reforged: ');
        gump.AddText(110, 50, "0",reforged);
        gump.AddText(195, 50, "0",(reforged/hourDivisor).toFixed(0));
        gump.AddText(15, 65, "0",'Unravel: ');
        gump.AddText(110, 65, "0",unraveled);
        gump.AddText(195, 65, "0",(unraveled/hourDivisor).toFixed(0));
        gump.AddText(15, 80, "0",'Perfects: ');
        gump.AddText(110, 80, "0",createdPerfect);
        gump.AddText(195, 80, "0",(createdPerfect/hourDivisor).toFixed(0));
        gump.AddText(15, 95, "0",'Acceptables: ');
        gump.AddText(110, 95, "0",createdAcceptable);
        gump.AddText(195, 95, "0",(createdAcceptable/hourDivisor).toFixed(0));
        gump.AddText(15, 110, "0",'Luck 140: ');
        gump.AddText(110, 110, "0",createdLuck140);
        gump.AddText(195, 110, "0",(createdLuck140/hourDivisor).toFixed(0));
        gump.AddText(15, 125, "0",'Luck 150: ');
        gump.AddText(110, 125, "0",createdLuck150);
        gump.AddText(195, 125, "0",(createdLuck150/hourDivisor).toFixed(0));

        gump.Update();
        }
    }

function incrementShared(variableName)
    {
    var int = Shared.GetVar(variableName) || 0;
    Shared.AddVar(variableName, ++int);
    }

function PlatemailCheck()
    {
    Orion.WaitForAddObject('myTarget');
    var itemObj = Orion.FindObject('myTarget');
    var parse = PlatemailParse(itemObj);
    Orion.Print('Type: ' + parse.Type + '\nGraphic: ' + parse.Graphic + '\nExceptional: ' + parse.Exceptional + '\nAcceptable: ' + parse.Acceptable + '\nPerfect: ' + parse.Perfect
    + '\nPhysical: ' + parse.Physical + '\nFire: ' + parse.Fire + '\nCold: ' + parse.Cold + '\nPoison: ' + parse.Poison + '\nEnergy: ' + parse.Energy + '\nTotal Resists: ' + parse.TotalResists);
    }

function PlatemailParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var itemGraphic = itemObj.Graphic();
    var graphicList = {
        '0x140E': 'Helm', //norse helm
        '0x1413': 'Gorget', //plate gorget
        '0x13EC': 'Tunic', //ringmail tunic
        '0x1410': 'Arms', //plate arms
        '0x1414': 'Gloves', //plate gloves
        '0x13BE': 'Legs', //chainmail legs
        '0x1B73': 'Shield', //buckler
        }
    var itemType = graphicList[itemGraphic];
    if(itemType == 'Shield')
        {
        var itemExceptional = Orion.Contains(itemProperties,'Exceptional');
        return {
            Type: itemType,
            Graphic: itemGraphic,
            Exceptional: itemExceptional,
            Acceptable: 0,
            Perfect: 1,
            Physical: 0,
            Fire: 0,
            Cold: 0,
            Poison: 0,
            Energy: 0,
            TotalResists: 35,
            }
        }
    else if(itemType == 'Helm')
        {
        var idealResists = [4,1,4,4,2];
        var acceptableResists = [5,2,5,5,3];
        }
    else if(itemType == 'Tunic')
        {
        var idealResists = [3,3,1,5,3];
        var acceptableResists = [4,4,2,6,4];
        }
    else if(itemType == 'Legs')
        {
        var idealResists = [4,4,4,1,2];
        var acceptableResists = [5,5,5,2,3];
        }
    else
        {
        var idealResists = [5,3,2,3,2];
        var acceptableResists = [6,4,3,4,3];
        }
    var itemExceptional = Orion.Contains(itemProperties,'Exceptional');
    var resists = itemProperties.match(/Physical Resist (\d+)%\nFire Resist (\d+)%\nCold Resist (\d+)%\nPoison Resist (\d+)%\nEnergy Resist (\d+)%\n/) || [];
    var resultArr = [];
    if(resists.shift())
        {
        for(var i = 0,totalResists = 0;i<resists.length;i++)
            {
            var resist = +resists[i];
            totalResists += resist;
            if(resist <= idealResists[i])
                resultArr[i] = 2;
            else if(resist <= acceptableResists[i])
                resultArr[i] = 1;
            else
                resultArr[i] = 0;
            }
        }
    else
        return Orion.CharPrint(self,1159,'Error in ItemParse!');
    var numAcceptable = CountElements(resultArr, 1);
    var numPerfect = CountElements(resultArr, 2);
    return {
        Type: itemType,
        Graphic: itemGraphic,
        Exceptional: itemExceptional,
        Acceptable: numAcceptable,
        Perfect: numPerfect,
        Physical: resultArr[0],
        Fire: resultArr[1],
        Cold: resultArr[2],
        Poison: resultArr[3],
        Energy: resultArr[4],
        TotalResists: totalResists,
        }
    }

function CountElements(arr, ele)
    {
    for(var i=0,t=0;i<arr.length;i++)
        {
        if(arr[i] === ele)
            t++;
        }
    return t;
    }


//Suit Grabber
function initSuitGrabber()
    {
    Orion.Exec('SuitGrab',true);
    Orion.Exec('StayLoggedIn', true);
    }

function SuitGrab()
    {
    Orion.CharPrint(self, 1159, 'Target container to put assembled suits.\nIt should contain empty backpacks for each suit.');
    Orion.WaitForAddObject('myTarget');
    var parentContainer = Orion.GetSerial('myTarget');
    if(!parentContainer)
        return Orion.Print('Parent Container not found! Halting...');
    while(true)
        {
        var suit = GetSuit(); // an array of serials for each piece of the suit and an additional array of info (time, iterations) [[serial,serial,serial,serial,serial], [time, iterations]]
        if(!suit[0])
            {
            TextWindow.Open();
            TextWindow.Print('\nNo suits found!');
            return Orion.Print('No suits found!');
            }
        var suitSerials = suit[0];
        var suitInfo = suit[1];
        var infoMessage = '\nSuit found!\nTime: ' + suitInfo[0] + '\nIterations: ' + suitInfo[1] + '\n';
        Orion.CharPrint(self, 1159, infoMessage);
        Orion.Wait(1000);
        Orion.PauseScript('StayLoggedIn');
        Orion.Wait(1000);
        TextWindow.Open();
        TextWindow.Print(infoMessage + suitSerials);
        while(!Orion.GumpExists('container', parentContainer))
            {
            Orion.CharPrint(self,1159,'Opening Destination Container');
            Orion.UseObject(parentContainer);
            Orion.Wait(1300);
            }
        var subContainer = Orion.FindTypeEx('0x0E75','0x0000',parentContainer).filter(function(backpack)
            {
            return Orion.Contains(backpack.Properties(), 'Contents: 0/125');
            })[0];
        if(!subContainer)
            var subContainerSerial = parentContainer;
        else
            var subContainerSerial = subContainer.Serial();
        for(var i=0;i<suitSerials.length;i++)
            {
            do
                {
                while(!Orion.GumpExists('container', subContainerSerial))
                    {
                    Orion.CharPrint(self,1159,'Opening Suit Container');
                    Orion.UseObject(subContainerSerial);
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(suitSerials[i], 0, subContainerSerial);
                Orion.Wait(1300);
                var successCheck = Orion.FindType(any,any,subContainerSerial).filter(function(serial)
                    {
                    return serial == suitSerials[i];
                    })[0];
                } while(successCheck === undefined)
            }
        Orion.Wait(1000);
        Orion.ResumeScript('StayLoggedIn');
        Orion.Wait(1000);
        }
    }

function StayLoggedIn()
    {
    while(true)
        {
        Orion.UseObject(backpack);
        Orion.Wait(120000);
        }
    }

function ShallowCopy(arr)
    {
    var copy = JSON.stringify(arr);
    return JSON.parse(copy);
    }

function GetSuit(_)
    {
    var targetResists = [40,40,40,40,40]; //42,42,42,41,37
    var targetLows = [1,1,1,1,1];   //1,1,1,2,1
    var helmPiece;
    var gorgetPiece;
    var tunicPiece;
    var armsPiece;
    var glovesPiece;
    var legsPiece;
    var helmLows;
    var gorgetLows;
    var tunicLows;
    var armsLows;
    var glovesLows;
    var i = 0;
    var startTime = Orion.Now();
    var helmArr = GetResistArrays('Helm', targetLows); //this is an array of all armor pieces of this type that have a necessary low resist. [phys,fire,cold,poison,energy,serialNumber,[lowPhys,lowFire,lowCold,lowPoison,lowPoison]]
    for(var helm = 0;helm<helmArr.length;helm++)
        {
        Orion.Print('Helm Loop');
        helmLows = ShallowCopy(targetLows); //this is the array that tracks which low resists are still necessary for a suit. ShallowCopy creates a new array reference in memory
        helmPiece = helmArr[helm]; //this is the current armor piece being evaluated in each iteration of a loop
        var pieceLows = helmPiece[6]; //this is an array of the necessary target lows updated at each loop layer [0,0,0,0,0]
        for(var low = 0;low<pieceLows.length;low++)
            {
            if(pieceLows[low] > 0) //this logic determines which low resist is being covered by this armor piece
                helmLows[low]--; //and decrements the corresponding resist in the lows array accordingly
            }
        var gorgetArr = GetResistArrays('Gorget', helmLows); //the updated targetLows array is passed into the function that finds armor pieces of the next type, which can then exclude pieces that have a low resist we dont need.
        for(var gorget = 0;gorget<gorgetArr.length;gorget++) //and so on for each loop...
            {
            Orion.Print('Gorget Loop');
            gorgetLows = ShallowCopy(helmLows);
            gorgetPiece = gorgetArr[gorget];
            var pieceLows = gorgetPiece[6];
            for(var low = 0;low<pieceLows.length;low++)
                {
                if(pieceLows[low] > 0)
                    gorgetLows[low]--;
                }
            var tunicArr = GetResistArrays('Tunic', gorgetLows);
            for(var tunic = 0;tunic<tunicArr.length;tunic++)
                {
                Orion.Print('Tunic Loop');
                tunicLows = ShallowCopy(gorgetLows);
                tunicPiece = tunicArr[tunic];
                var pieceLows = tunicPiece[6];
                for(var low = 0;low<pieceLows.length;low++)
                    {
                    if(pieceLows[low] > 0)
                        tunicLows[low]--;
                    }
                var armsArr = GetResistArrays('Arms', tunicLows);
                for(var arms = 0;arms<armsArr.length;arms++)
                    {
                    Orion.Print('Arms Loop');
                    armsLows = ShallowCopy(tunicLows);
                    armsPiece = armsArr[arms];
                    var pieceLows = armsPiece[6];
                    for(var low = 0;low<pieceLows.length;low++)
                        {
                        if(pieceLows[low] > 0)
                            armsLows[low]--;
                        }
                    var glovesArr = GetResistArrays('Gloves', armsLows);
                    for(var gloves = 0;gloves<glovesArr.length;gloves++)
                        {
                        Orion.Print('Gloves Loop');
                        glovesLows = ShallowCopy(armsLows);
                        glovesPiece = glovesArr[gloves];
                        var pieceLows = glovesPiece[6];
                        for(var low = 0;low<pieceLows.length;low++)
                            {
                            if(pieceLows[low] > 0)
                                glovesLows[low]--;
                            }
                        var legsArr = GetResistArrays('Legs', glovesLows);
                        for(var legs = 0;legs<legsArr.length;legs++)
                            {
                            Orion.Print('Legs Loop');
                            Orion.PrintFast(self, 1159, 0, i++); //total number of combinations checked
                            legsPiece = legsArr[legs];
                            var suitArr = [helmPiece, gorgetPiece, tunicPiece, armsPiece, glovesPiece, legsPiece]; //the current combination of pieces being evaluated
                            var currentResists = ArrayAdder(suitArr); //this function adds the resists of each piece together into a new array [phys,fire,cold,poison,energy]
                            if(ArrayCompare(targetResists, currentResists)) //this compares the summed resists against the target resists
                                {
                                var deltaTime = Orion.Now() - startTime;
                                var dateObj = new Date(deltaTime);
                                var timestamp = dateObj.toISOString().substring(11, 19);
                                var suitArrMap = suitArr.map(function(suitPiece) //if the suit resist values match or exceed every resist type's target, an array of serials for each piece will be returned 
                                    {
                                    return suitPiece[5]; 
                                    });
                                return [suitArrMap, [timestamp, i]]; //[ [helmSerial,gorgetSerial,armsSerial,glovesSerial,legsSerial], ['00:00:00', iterationNumber] ]
                                }
                            }
                        }
                    }
                }
            }
        Orion.PauseScript('StayLoggedIn');
        Orion.Wait(1000);
        Orion.MoveItem(helmPiece[5]);
        Orion.Wait(1000);
        Orion.ResumeScript('StayLoggedIn');
        }
    return [];    
    }

function AdderTest()
    {
    var a = [ [1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1] ]
    var b = ArrayAdder(a);
    Orion.Print(JSON.stringify(b))
    }

function CompareTest()
    {
    var a = [6,7,5,4,5]
    var b = [6,7,5,4,5]
    Orion.Print(ArrayCompare(a,b))
    }

function ArrayCompare(targetArr, currentArr)
    {
    for(var i=0;i<targetArr.length;i++)
        {
        if(currentArr[i] < targetArr[i])
            return false;
        }
    return true;
    }

function ArrayAdder(arr)
    {
    var resistArr = [0,0,0,0,0];
    for(var i=0;i<arr.length;i++)
        {
        resistArr[0] += arr[i][0];
        resistArr[1] += arr[i][1];
        resistArr[2] += arr[i][2];
        resistArr[3] += arr[i][3];
        resistArr[4] += arr[i][4];
        }
    return resistArr;
    }

function GetResistArrays(layerName, targetLows)
    {
    var parentContainer = Orion.FindTypeEx(any, any, ground, 'item', 2).filter(function(chest)
        {
        return Orion.Contains(chest.Properties(), 'Engraved: ' + layerName);
        })[0];
    if(!parentContainer || parentContainer.Distance() > 2)
        return Orion.Print('Parent Container not found! Halting...');
    while(!Orion.GumpExists('container', parentContainer.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening ' + layerName + ' Container');
        Orion.UseObject(parentContainer.Serial());
        Orion.Wait(1300);
        }
    var subContainerPerfect = Orion.FindTypeEx('0x0E75','0x0000',parentContainer.Serial()).filter(function(backpack)
        {
        return Orion.Contains(backpack.Properties(), 'Engraved: Perfect');
        })[0];
    var subContainerAcceptable = Orion.FindTypeEx('0x0E75','0x0000',parentContainer.Serial()).filter(function(backpack)
        {
        return Orion.Contains(backpack.Properties(), 'Engraved: Acceptable');
        })[0];
    while(!Orion.GumpExists('container', subContainerPerfect.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening Perfect Subcontainer');
        Orion.UseObject(subContainerPerfect.Serial());
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', subContainerAcceptable.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening Acceptable Subcontainer');
        Orion.UseObject(subContainerAcceptable.Serial());
        Orion.Wait(1300);
        }
    if(targetLows.every(function(low){ return low <= 0 }))
        var itemsRaw = Orion.FindTypeEx('!0x0E75', any, parentContainer.Serial(), 'item', '2', '', true);
    else
        {
        var itemsRaw = Orion.FindTypeEx('!0x0E75', any, parentContainer.Serial(), 'item', '2', '', true).filter(function(item)
            { //[1,1,1,2,1]
            var check = false;
            var lows = ResistParse(item)[6]; //[2,0,0,0,0]
            for(var i=0;i<lows.length;i++)
                {
                if(lows[i] > 0 && targetLows[i] > 0)
                    {
                    check = true;
                    break;
                    }
                }
            return check;
            })
        }
    var items = itemsRaw.map(function(item)
            {
            return ResistParse(item);
            });
    return items;
    }

function ResistParseTest()
    {
    Orion.WaitForAddObject('myTarget');
    var a = Orion.FindObject('myTarget');
    var b = ResistParse(a);
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print(b);
    }

function ResistParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var itemGraphic = itemObj.Graphic();
    var graphicList = {
        '0x140E': 'Helm', //norse helm
        '0x1413': 'Gorget', //plate gorget
        '0x13EC': 'Tunic', //ringmail tunic
        '0x1410': 'Arms', //plate arms
        '0x1414': 'Gloves', //plate gloves
        '0x13BE': 'Legs', //chainmail legs
        }
    var itemType = graphicList[itemGraphic];
    if(itemType == 'Helm')
        {
        var idealResists = [4,1,4,4,2];
        var acceptableResists = [5,2,5,5,3];
        }
    else if(itemType == 'Tunic')
        {
        var idealResists = [3,3,1,5,3];
        var acceptableResists = [4,4,2,6,4];
        }
    else if(itemType == 'Legs')
        {
        var idealResists = [4,4,4,1,2];
        var acceptableResists = [5,5,5,2,3];
        }
    else
        {
        var idealResists = [5,3,2,3,2];
        var acceptableResists = [6,4,3,4,3];
        }
    var resists = itemProperties.match(/Physical Resist (\d+)%\nFire Resist (\d+)%\nCold Resist (\d+)%\nPoison Resist (\d+)%\nEnergy Resist (\d+)%\n/) || [];
    var resultArr = [];
    var lowArr = [0,0,0,0,0]
    if(resists.shift())
        {
        for(var i = 0;i<resists.length;i++)
            {
            var resist = +resists[i];
            resultArr[i] = resist;
            if(resist <= idealResists[i])
                lowArr[i] = 2;
            else if(resist <= acceptableResists[i])
                lowArr[i] = 1;
            else
                lowArr[i] = 0;
            }
        }
    else
        return Orion.CharPrint(self,1159,'Error in ItemParse!');
    resultArr.push(itemObj.Serial())
    resultArr.push(lowArr)
    return resultArr;
    }

//Suit Reader
function SuitReader()
    {
    Orion.CharPrint(self, 1159, 'Select player or container to evaluate:');
    Orion.WaitForAddObject('myTarget');
    var startTime = Orion.Now();
    var propertiesList = SuitReaderCall('myTarget');
    if(!propertiesList)
        return;
    var gump = Orion.CreateCustomGump(12001);
    gump.Clear();
    var y = 15;
    var yOffset = 15;
    var x1 = 15;
    var x2 = 145;
    var x3 = 100;
    var x4 = 185;
    var xOffset = 95;
    var xOffset2 = 45;
    gump.AddResizepic(0, 0, 0xBB8, 275, 21*yOffset+20);
    gump.AddText(x1, y, "0", 'Physical Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[0][1]);
    gump.AddText(x2, y, "0", 'Kinetic Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[6][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Fire Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[1][1]);
    gump.AddText(x2, y, "0", 'Fire Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[7][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Cold Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[2][1]);
    gump.AddText(x2, y, "0", 'Cold Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[8][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Poison Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[3][1]);
    gump.AddText(x2, y, "0", 'Poison Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[9][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Energy Resist:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[4][1]);
    gump.AddText(x2, y, "0", 'Energy Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[10][1]);
    y+=yOffset;
    gump.AddText(x2, y, "0", 'Damage Eater:');
    gump.AddText(x2+xOffset, y, "0", propertiesList[5][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Enhanced Pots:');
    gump.AddText(x1+xOffset, y, "0", propertiesList[11][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'DI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[12][1]);
    gump.AddText(x3, y, "0", 'SSI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[13][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'DCI:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[14][1]);
    gump.AddText(x3, y, "0", 'HCI:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[15][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Str+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[16][1]);
    gump.AddText(x3, y, "0", 'HP+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[19][1]);
    gump.AddText(x4, y, "0", 'HPR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[22][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Dex+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[17][1]);
    gump.AddText(x3, y, "0", 'Stam+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[20][1]);
    gump.AddText(x4, y, "0", 'SR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[23][1]); 
    y+=yOffset;
    gump.AddText(x1, y, "0", 'Int+:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[18][1]); 
    gump.AddText(x3, y, "0", 'Mana+:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[21][1]); 
    gump.AddText(x4, y, "0", 'MR:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[24][1]); 
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'CF:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[25][1]);
    gump.AddText(x3, y, "0", 'FCR:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[26][1]);
    gump.AddText(x4, y, "0", 'FC:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[27][1]);
    y+=yOffset;
    gump.AddText(x1, y, "0", 'LMC:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[28][1]);
    gump.AddText(x3, y, "0", 'LRC:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[29][1]);
    gump.AddText(x4, y, "0", 'SDI:');
    gump.AddText(x4+xOffset2, y, "0", propertiesList[30][1]);
    y+=yOffset*2;
    gump.AddText(x1, y, "0", 'Luck:');
    gump.AddText(x1+xOffset2, y, "0", propertiesList[31][1]);
    gump.AddText(x3, y, "0", 'RPD:');
    gump.AddText(x3+xOffset2, y, "0", propertiesList[32][1]);
    gump.Update();
    var deltaTime = Orion.Now() - startTime;
    Orion.Print(deltaTime);
    }

function SuitReaderCall(playerOrContainerSerial)
	{
    var propertiesList = 
    [
        ['Physical Resist', 0], //0
        ['Fire Resist', 0],
        ['Cold Resist', 0],
        ['Poison Resist', 0],
        ['Energy Resist', 0],
        ['Damage Eater', 0], //5
        ['Kinetic Eater', 0],
        ['Fire Eater', 0],
        ['Cold Eater', 0],
        ['Poison Eater', 0],
        ['Energy Eater', 0], //10
        ['Enhance Potions', 0],
        ['Damage Increase', 0],
        ['Swing Speed Increase', 0],
        ['Defense Chance Increase', 0],
        ['Hit Chance Increase', 0], //15
        ['Strength Bonus', 0],
        ['Dexterity Bonus', 0],
        ['Intelligence Bonus', 0],
        ['Hit Point Increase', 0],
        ['Stamina Increase', 0], //20
        ['Mana Increase', 0],
        ['Hit Point Regeneration', 0],
        ['Stamina Regeneration', 0],
        ['Mana Regeneration', 0],
        ['Casting Focus', 0], //25
        ['Faster Cast Recovery', 0],
        ['Faster Casting', 0],
        ['Lower Mana Cost', 0],
        ['Lower Reagent Cost', 0],
        ['Spell Damage Increase', 0], //30
        ['Luck', 0],
        ['Reflect Physical Damage', 0]
    ]
    var selected = Orion.FindObject(playerOrContainerSerial);
    if(selected && selected.Mobile())
        {
        Orion.WaitContextMenuID(selected.Serial(), 520);
        Orion.RequestContextMenu(selected.Serial());
        var startTime = Orion.Now();
        while(Orion.Now() < startTime + 2000 && !Orion.GumpExists('paperdoll', selected.Serial()))
            Orion.Wait(100);
        if(!Orion.GumpExists('paperdoll', selected.Serial()))
            return Orion.CharPrint(self, 1159, "Target paperdoll didn't open");
        Orion.Wait(100);
        for(var i=1;i<25;i++)
            {
            var item = Orion.ObjAtLayer(i, selected.Serial());
            if(!item)
                continue;
            var itemProps = item.Properties().split(/\r?\n/);
            itemProps.forEach(function(prop)
                {
                if(!Orion.Contains(prop, '(total)'))
                    {
                    propertiesList.forEach(function(propPair)
                        {
                        var regex = "^" + propPair[0] + "\\s+(-?\\d+)?";
                        var outcome = prop.match(regex);
                        if(outcome)
                            propertiesList[propertiesList.indexOf(propPair)][1] += parseInt(outcome[1]);
                        });
                    }
                });
            }
        }
    else if(selected)
        {
        if(!Orion.OpenContainer(selected.Serial()))
            return Orion.CharPrint(self, 1159, "Target container didn't open");
        Orion.Wait(100);
        var items = Orion.FindTypeEx(any,any,selected.Serial());
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            if(!item)
                continue;
            var itemProps = item.Properties().split(/\r?\n/);
            itemProps.forEach(function(prop)
                {
                if(!Orion.Contains(prop, '(total)'))
                    {
                    propertiesList.forEach(function(propPair)
                        {
                        var regex = "^" + propPair[0] + "\\s?(-?\\d+)?";
                        var outcome = prop.match(regex);
                        if(outcome)
                            propertiesList[propertiesList.indexOf(propPair)][1] += parseInt(outcome[1]);
                        });
                    }
                });
            }
        }
    else
        return Orion.CharPrint(self, 1159, 'Target invalid');
    return propertiesList;
    }

//POF
function PofGearInBag()
	{
	var minDura = 250; //Durability below which to powder
	Orion.Print("POF threshold set to: " + minDura)
	Orion.CharPrint(self, 1159, 'Select container with items you want to powder')
	Orion.WaitForAddObject('myTarget');
	var container = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', container))
        {
        Orion.CharPrint(self,1159,'Opening Container');
        Orion.UseObject(container);
        Orion.Wait(1300);
        }
	var items = Orion.FindTypeEx(any,any,container);
	Orion.Print(items.length);
	for(var i=0;i<items.length;i++)
		{
		var item = items[i];
		if(Orion.Contains(item.Properties(), 'Durability'))
   			{
   			var dura = Orion.Split(item.Properties().match(/Durability(.*)/g)[0].slice(10,20).trim(), ' / ');
	        if(dura.length)
		        {
		        while(Number(dura[1]) < minDura)
		        	{
                    var pof = Orion.FindTypeEx('0x1940').filter(function(item)
                        {
                        return +(item.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'0'])[1] > 0;
                        }).sort(function(a,b)
                            {
                            return +(a.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'251'])[1] - +(b.Properties().match(/Fortification.\nUses Remaining: (\d+)/) || [null,'251'])[1]
                            });
		        	if(pof[0])
		        		{
		        		Orion.UseObject(pof[0].Serial());
				        Orion.WaitForTarget(2000);
				        Orion.TargetObject(item.Serial());
				        Orion.Wait(1300)	
                        }
                    else
                        {
                        return Orion.CharPrint(self, 1159, 'Out of Fort Kegs! Halting...');
                        }
		        	dura = Orion.Split(item.Properties().match(/Durability(.*)/g)[0].slice(10,20).trim(), ' / ');
		        	}
		        }
		    Orion.Wait(500);
   			}	
  		}
	}

//Ele Wep
function ExcKatana()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('Katana',true);
    }

function ExcDoubleAxe()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('DoubleAxe',true);
    }

function ExcBladedStaff()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('BladedStaff',true);
    }

function NormKatana()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('Katana',false);
    }

function NormDoubleAxe()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('DoubleAxe',false);
    }

function NormBladedStaff()
    {
    Orion.Exec('WeaponGump',true);
    ElementalWeapon('BladedStaff',false); 
    }

function ElementalWeapon(itemName, exceptionalBool)
    {
    var weaponInfo = {
        'Katana': {
            itemGraphic: '0x13FF',
            categoryCode: 9004,
            itemCode: 46
            },
        'DoubleAxe': {
            itemGraphic: '0x0F4B',
            categoryCode: 9005,
            itemCode: 61
            },
        'BladedStaff': {
            itemGraphic: '0x26BD',
            categoryCode: 9006,
            itemCode: 67
            },
        }
    var piece = weaponInfo[itemName];
    var itemGraphic = piece.itemGraphic;
    var categoryCode = piece.categoryCode;
    var itemCode = piece.itemCode;
    CloseAllGumps();
    Orion.ResumeScript('WeaponGump');
    Orion.CharPrint(self,1159,'Target your supply container. It should contain ingots, shadow iron runics, and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var destinationContainer = Orion.FindTypeEx('0x0E41|0x09AB', any, ground, 'item', 2).filter(function(chest)
        {
        return Orion.Contains(chest.Properties(), 'Engraved: Weapons');
        })[0];
    while(!CheckGumpCliloc('0x000001CC', ' xmfhtmltok 50 365 170 18 0 0 32767 1044022'))
        {
        CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
        Orion.UseObject(Orion.FindType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color)[0]);
        if(Orion.WaitForGump(2000))
            {
            Orion.CharPrint(self,1159,'Setting Material Type to Iron');
            var gumpMaterial = Orion.GetGump(any, '0x000001CC');
            if(gumpMaterial !== null)
                {
                gumpMaterial.Select(Orion.CreateGumpHook(5000));
                Orion.Wait(200);
                }
            }
        Orion.Wait(1300);
        }
    while(true)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        if(!destinationContainer || destinationContainer.Distance() > 2)
            return Orion.Print('Destination Container not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1300);
            }
        while(!Orion.GumpExists('container', destinationContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Destination Container');
            Orion.UseObject(destinationContainer.Serial());
            Orion.Wait(1300);
            }
        while(Player.MaxWeight() - Player.Weight() < 100)
            {
            Orion.CharPrint(self,1159,'Over weight threshold, moving mats');
            while(Orion.FindType('0x1BF2|0x2DB1|0x2DB2|0x2DB3')[0])
                {
                Orion.MoveItem(Orion.FindType('0x1BF2|0x2DB1|0x2DB2|0x2DB3')[0], 0, supplyContainer.Serial());
                Orion.Wait(1300);
                }
            }
        while(Orion.Count(_item.Ingot.Iron.Graphic,'0x0000') < 50)
            {
            Orion.CharPrint(self,1159,'Restocking Iron Ingots');
            if(!Restock('Iron Ingots', _item.Ingot.Iron.Graphic, supplyContainer.Serial(), 400,'0x0000'))
                return;
            }
        var item = Orion.FindTypeEx(itemGraphic)[0];
        while(!item)
            {
            CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
            Orion.CharPrint(self,1159,'Crafting Weapon');
            CraftItem('0x0FBC', categoryCode, itemCode);
            item = Orion.FindTypeEx(itemGraphic)[0];
            }
        incrementShared('created');
        Orion.Wait(500);
        if(Orion.Contains(item.Properties(), 'Exceptional') == exceptionalBool)
            {
            var inviableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron.Color).filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges < 4;
                });
            while(inviableRunics.length > 1)
                {
                Orion.CharPrint(self,1159,'Combining Runic Tools');
                Orion.UseObject(inviableRunics[0].Serial());
                Orion.WaitForTarget(2000);
                Orion.TargetObject(inviableRunics[1].Serial());
                Orion.Wait(1300);
                inviableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron.Color).filter(function(runic)
                    {
                    var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                    return charges < 4;
                    });
                }
            var viableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron.Color).filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges >= 4;
                });
            while(!viableRunics[0])
                {
                Orion.CharPrint(self,1159,'Restocking Runic Tool');
                if(!Restock('Runic Tool',_item.BlacksmithRunic.Graphic, supplyContainer.Serial(), 0,_item.Ingot.ShadowIron.Color))
                    return;
                viableRunics = Orion.FindTypeEx(_item.BlacksmithRunic.Graphic,_item.Ingot.ShadowIron.Color).filter(function(runic)
                    {
                    var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                    return charges >= 4;
                    });
                }
            CloseAllGumps();
            while(!Orion.Contains(item.Properties(), 'Reforged'))
                {
                Orion.CharPrint(self,1159,'Reforging Plate Piece');
                Orion.UseObject(viableRunics[0].Serial());
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(item.Serial());
                if(Orion.WaitForGump(2000))
                    {
                    if(!CheckGumpCliloc('0x000F3EAC', 1151709))
                        {
                        TextWindow.Open();
                        TextWindow.Print('Reforge not set to Exquisite / of Quality. Pausing...');
                        Orion.PauseScript('all', 'GMJournalScan');
                        }
                    var gumpReforge = Orion.GetGump(any, '0x000F3EAC');
                    if(gumpReforge !== null)
                        {
                        gumpReforge.Select(Orion.CreateGumpHook(2));
                        Orion.Wait(100);
                        }
                    }
                Orion.Wait(1300);
                Orion.MoveItem(item.Serial());
                Orion.Wait(1300);
                }
            incrementShared('reforged');
            var itemParse = WeaponParse(item);
            if(itemParse.extraMods == false && (itemParse.fire70 || itemParse.cold70 || itemParse.fire100 || itemParse.cold100 || itemParse.pois100 || itemParse.ener100))
                {
                if(itemParse.fire70)
                    {
                    Orion.CharPrint(self,1159,'70% fire piece made!');
                    incrementShared('createdFire70');
                    //auto enhance here?
                    }
                else if(itemParse.cold70)
                    {
                    Orion.CharPrint(self,1159,'70% cold piece made!');
                    incrementShared('createdCold70');
                    //auto enhance here?
                    }
                else if(itemParse.fire100)
                    {
                    Orion.CharPrint(self,1159,'100% fire piece made!');
                    incrementShared('createdFire100');
                    }
                else if(itemParse.cold100)
                    {
                    Orion.CharPrint(self,1159,'100% cold piece made!');
                    incrementShared('createdCold100');
                    }
                else if(itemParse.pois100)
                    {
                    Orion.CharPrint(self,1159,'100% poison piece made!');
                    incrementShared('createdPois100');
                    }
                else if(itemParse.ener100)
                    {
                    Orion.CharPrint(self,1159,'100% energy piece made!');
                    incrementShared('createdEner100');
                    }
                while(item.Container() == Orion.GetSerial(backpack))
                    {
                    Orion.MoveItem(item.Serial(), 0, destinationContainer.Serial());
                    Orion.Wait(1300);
                    }
                }
            else if(itemParse.extraMods == true)
                {
                while(item.Exists())
                    {
                    Orion.CharPrint(self,1159,'Unraveling Weapon');
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
                        Orion.TargetObject(item.Serial());
                    Orion.Wait(1300);
                    }
                incrementShared('unraveled');
                }
            else
                {
                while(item.Exists())
                    {
                    CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
                    CloseAllGumps();
                    Orion.CharPrint(self,1159,'Smelting Weapon');
                    Orion.UseType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color);
                    if(Orion.WaitForGump(2000))
                        {
                        var gump = Orion.GetGump(any, '0x000001CC');
                        if (gump !== null)
                            {
                            gump.Select(Orion.CreateGumpHook(7000));
                            Orion.Wait(200);
                            }
                        }
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetObject(item.Serial());
                    Orion.Wait(1300);
                    }
                incrementShared('smelted');
                }
            }
        else
            {
            while(item.Exists())
                {
                CraftTool(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color,20,supplyContainer.Serial());
                CloseAllGumps();
                Orion.CharPrint(self,1159,'Smelting Weapon');
                Orion.UseType(_item.BlacksmithTool.Graphic,_item.BlacksmithTool.Color);
                if(Orion.WaitForGump(2000))
                    {
                    var gump = Orion.GetGump(any, '0x000001CC');
                    if (gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(7000));
                        Orion.Wait(200);
                        }
                    }
                if(Orion.WaitForTarget(2000))
                    Orion.TargetObject(item.Serial());
                Orion.Wait(1300);
                }
            incrementShared('smelted');
            }
        }
    }

function WeaponCheck()
    {
    Orion.WaitForAddObject('myTarget');
    var itemObj = Orion.FindObject('myTarget');
    var parse = WeaponParse(itemObj);
    Orion.Print('Exceptional: ' + parse.Exceptional + '\nExtraMods: ' + parse.extraMods + '\nfire70: ' + parse.fire70 + '\ncold70: ' + parse.cold70
    + '\nfire100: ' + parse.fire100 + '\ncold100: ' + parse.cold100 + '\npois100: ' + parse.pois100 + '\nener100: ' + parse.ener100);
    }

function WeaponParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var itemExceptional = Orion.Contains(itemProperties,'Exceptional');
    if(itemExceptional)
        var regex = "Stones\\nDamage Increase \\d+%\\n\\w+ Damage \\d+%";
    else
        var regex = "Stones\\n\\w+ Damage \\d+%";
    var extraMods = itemProperties.match(regex) ? false : true;
    var fire70 = Orion.Contains(itemProperties,'Fire Damage 70%');
    var cold70 = Orion.Contains(itemProperties,'Cold Damage 70%');
    var fire100 = Orion.Contains(itemProperties,'Fire Damage 100%');
    var cold100 = Orion.Contains(itemProperties,'Cold Damage 100%');
    var pois100 = Orion.Contains(itemProperties,'Poison Damage 100%');
    var ener100 = Orion.Contains(itemProperties,'Energy Damage 100%');
    return {
        Exceptional: itemExceptional,
        extraMods: extraMods,
        fire70: fire70, 
        cold70: cold70,
        fire100: fire100,
        cold100: cold100,
        pois100: pois100,
        ener100: ener100,
        }
    }

function WeaponGump(_)
    {
    Shared.AddVar('created', 0);
    Shared.AddVar('smelted', 0);
    Shared.AddVar('reforged', 0);
    Shared.AddVar('unraveled', 0);
    Shared.AddVar('createdFire70', 0);
    Shared.AddVar('createdCold70', 0);
    Shared.AddVar('createdFire100', 0);
    Shared.AddVar('createdCold100', 0);
    Shared.AddVar('createdPois100', 0);
    Shared.AddVar('createdEner100', 0);

    var startTime = Orion.Now(); 
    while(true)
        {
        if(!Orion.ScriptRunning('ElementalWeapon'))
            {
            var startPause = Orion.Now();
            Orion.PauseScript('WeaponGump');
            var adjustForPause = Orion.Now() - startPause;
            startTime += adjustForPause;
            }
        var created = Shared.GetVar('created');
        var smelted = Shared.GetVar('smelted');
        var reforged = Shared.GetVar('reforged');
        var unraveled = Shared.GetVar('unraveled');
        var createdFire70 = Shared.GetVar('createdFire70');
        var createdCold70 = Shared.GetVar('createdCold70');
        var createdFire100 = Shared.GetVar('createdFire100');
        var createdCold100 = Shared.GetVar('createdCold100');
        var createdPois100 = Shared.GetVar('createdPois100');
        var createdEner100 = Shared.GetVar('createdEner100');
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var hourDivisor = ms/3600000;
        Orion.Wait(200);
        
		var gump = Orion.CreateCustomGump(12001);
		gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 250, 185);
		
        gump.AddText(15, 5, "0",'Time Elapsed: ');
        gump.AddText(110, 5, "0",time);
        gump.AddText(180, 5, "0",'Per Hour');
        gump.AddText(15, 20, "0",'Created: ');
        gump.AddText(110, 20, "0",created);
        gump.AddText(195, 20, "0",(created/hourDivisor).toFixed(0));
        gump.AddText(15, 35, "0",'Smelted: ');
        gump.AddText(110, 35, "0",smelted);
        gump.AddText(195, 35, "0",(smelted/hourDivisor).toFixed(0));
        gump.AddText(15, 50, "0",'Reforged: ');
        gump.AddText(110, 50, "0",reforged);
        gump.AddText(195, 50, "0",(reforged/hourDivisor).toFixed(0));
        gump.AddText(15, 65, "0",'Unravel: ');
        gump.AddText(110, 65, "0",unraveled);
        gump.AddText(195, 65, "0",(unraveled/hourDivisor).toFixed(0));
        gump.AddText(15, 80, "0",'Fire70: ');
        gump.AddText(110, 80, "0",createdFire70);
        gump.AddText(195, 80, "0",(createdFire70/hourDivisor).toFixed(0));
        gump.AddText(15, 95, "0",'Cold70: ');
        gump.AddText(110, 95, "0",createdCold70);
        gump.AddText(195, 95, "0",(createdCold70/hourDivisor).toFixed(0));
        gump.AddText(15, 110, "0",'Fire100: ');
        gump.AddText(110, 110, "0",createdFire100);
        gump.AddText(195, 110, "0",(createdFire100/hourDivisor).toFixed(0));
        gump.AddText(15, 125, "0",'Cold100: ');
        gump.AddText(110, 125, "0",createdCold100);
        gump.AddText(195, 125, "0",(createdCold100/hourDivisor).toFixed(0));
        gump.AddText(15, 140, "0",'Pois100: ');
        gump.AddText(110, 140, "0",createdPois100);
        gump.AddText(195, 140, "0",(createdPois100/hourDivisor).toFixed(0));
        gump.AddText(15, 155, "0",'Ener100: ');
        gump.AddText(110, 155, "0",createdEner100);
        gump.AddText(195, 155, "0",(createdEner100/hourDivisor).toFixed(0));

        gump.Update();
        }
    }

// IMBUER
const Button =
    {
    'Close': 0,
    'ImbueItem': 1,
    'ReimbueLast': 4,
    'ImbueLastItem': 3,
    'ImbueLastProperty': 5,
    'UnravelItem': 2,
    'UnravelContainer': 6,
    
    'IncrementOne': 312,
    'IncrementTen': 315,
    'IncrementMax': 313,
    'DecrementOne': 311,
    'DecrementTen': 314,
    'DecrementMax': 310,
    'Back': 301,
    'Confirm': 302,
    }

function ImbueOniKatana()
    {
    ImbueItemsByFavorite(imbueFavorites.OniKatana)
    }
function ImbueOniShield()
    {
    ImbueItemsByFavorite(imbueFavorites["Oni Shield"])
    }

function ImbuePhysResistM2()
    {
    ImbueItemsByFavorite(imbueFavorites.PhysResistM2)
    }

function ImbueFireResistM2()
    {
    ImbueItemsByFavorite(imbueFavorites.FireResistM2)
    }

function ImbueColdResistM2()
    {
    ImbueItemsByFavorite(imbueFavorites.ColdResistM2)
    }

function ImbuePoisResistM2()
    {
    ImbueItemsByFavorite(imbueFavorites.PoisResistM2)
    }

function ImbueEnerResistM2()
    {
        ImbueItemsByFavorite(imbueFavorites.EnerResistM2)
    }

function ImbueItemsByFavorite(imbueFavoriteName)
    {
    var imbueFavorite = initImbueFavorites()[imbueFavoriteName];
    var supplyContainerObj = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Engraved: Special Mats');
        })[0];
    if(!supplyContainerObj)
        {
        Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
        Orion.WaitForAddObject('myTarget');
        var supplyContainer = Orion.GetSerial('myTarget');
        }
    else
        var supplyContainer = supplyContainerObj.Serial();
    Orion.CharPrint(self,1159,'Target item or container full of items to imbue.');
    Orion.WaitForAddObject('myTarget');
    var itemObj = Orion.FindObject('myTarget');
    var itemSerial = itemObj.Serial();
    if(!itemObj || itemObj.Mobile())
        return Orion.CharPrint(self,1159,'Invalid target! Halting...');
    else if(Orion.Contains(itemObj.Properties(), 'Contents: '))
        {
        while(!Orion.GumpExists('container',itemSerial))
            {
            Orion.UseObject(itemSerial);
            Orion.Wait(1300);
            }
        var items = Orion.FindType(any,any,itemSerial);
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            var itemMod = initImbueMods(item);
            for(var ii=0;ii<imbueFavorite.length;ii++)
                ImbueModByIncrements(item, supplyContainer, itemMod[imbueFavorite[ii][0]], imbueFavorite[ii][2], imbueFavorite[ii][1]);
            var itemObj = Orion.FindObject(item);
            while(!Orion.Contains(itemObj.Properties(),'<b>Insured</b>'))
                {
                Orion.WaitContextMenuID(self, 418);
                Orion.RequestContextMenu(self);
                if(Orion.WaitForTarget(3000))
                    Orion.TargetObject(item);
                Orion.Wait(1300);
                }
            }
        }
    else
        {
        var itemMod = initImbueMods(itemSerial);
        for(var i=0;i<imbueFavorite.length;i++)
            ImbueModByIncrements(itemSerial, supplyContainer, itemMod[imbueFavorite[i][0]], imbueFavorite[i][2], imbueFavorite[i][1]);
        }
    PressGumpInitialButton(Button.Close);
    }

function initImbueMods(itemSerial)
    {
    const jewelryMod =
        {
        'Spell Damage Increase': [1114248, 205, 'Crystal Shards', '0x5738', '0x0000'],
        'Lower Reagent Cost': [1114248, 204, 'Faery Dust', '0x5745', '0x0000'],
        'Lower Mana Cost': [1114248, 203, 'Essence Of Order', '0x571C', '0x0481'],
        'Faster Casting': [1114248, 202, 'Essence Of Achievement', '0x571C', '0x002F'],
        'Faster Cast Recovery': [1114248, 201, 'Essence Of Diligence', '0x571C', '0x048E'],

        'Damage Increase': [1114249, 203, 'Crystal Shards', '0x5738', '0x0000'],
        'Hit Chance Increase': [1114249, 202, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 201, 'Essence Of Singularity', '0x571C', '0x0497'],

        'Night Sight': [1114252, 203, 'Bottle Of Ichor', '0x5748', '0x0000'],
        'Luck': [1114252, 202, 'Chaga Mushroom', '0x5743', '0x0000'],
        'Enhance Potions': [1114252, 201, 'Crushed Glass', '0x573B', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Fencing': [1114255, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Mace Fighting': [1114255, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Swordsmanship': [1114255, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Musicianship': [1114255, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Magery': [1114255, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Wrestling': [1114256, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Animal Taming': [1114256, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Spirit Speak': [1114256, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Tactics': [1114256, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Provocation': [1114256, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Focus': [1114257, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Parrying': [1114257, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Stealth': [1114257, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Meditation': [1114257, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Animal Lore': [1114257, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Discordance': [1114257, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Mysticism': [1114258, 207, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Bushido': [1114258, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Necromancy': [1114258, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Veterinary': [1114258, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Stealing': [1114258, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Eval Intelligence': [1114258, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Anatomy': [1114258, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Peacemaking': [1114259, 207, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Throwing': [1114259, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Ninjitsu': [1114259, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Chivalry': [1114259, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Archery': [1114259, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Resisting Spells': [1114259, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Healing': [1114259, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Strength Bonus': [1114262, 203, 'Fire Ruby', '0x3197', '0x0000'],
        'Intelligence Bonus': [1114262, 202, 'Blue Diamond', '0x3198', '0x0000'],
        'Dexterity Bonus': [1114262, 201, 'Turquoise', '0x3193', '0x0000'],
        }

    const armorMod =
        {
        'Lower Reagent Cost': [1114248, 202, 'Faery Dust', '0x5745', '0x0000'],
        'Lower Mana Cost': [1114248, 201, 'Essence Of Order', '0x571C', '0x0481'],

        'Reflect Physical Damage': [1114252, 203, 'Reflective Wolf Eye', '0x5749', '0x0000'],
        'Night Sight': [1114252, 202, 'Bottle Of Ichor', '0x5748', '0x0000'],
        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],

        'Stamina Increase': [1114262, 206, 'Luminescent Fungi', '0x3191', '0x0000'],
        'Hit Point Regeneration': [1114262, 205, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Stamina Regeneration': [1114262, 204, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Mana Regeneration': [1114262, 203, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Mana Increase': [1114262, 202, 'Luminescent Fungi', '0x3191', '0x0000'],
        'Hit Point Increase': [1114262, 201, 'Luminescent Fungi', '0x3191', '0x0000'],
        }

    const shieldMod =
        {
        'Spell Channeling': [1114248, 202, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Defense Chance Increase': [1114249, 201, 'Essence Of Singularity', '0x571C', '0x0497'],

        'Reflect Physical Damage': [1114252, 203, 'Reflective Wolf Eye', '0x5749', '0x0000'],
        'Lower Requirements': [1114252, 202, 'Elven Fletching', '0x5737', '0x0000'],
        'Durability': [1114252, 201, 'Powdered Iron', '0x573D', '0x0000'],
        }

    const weapon2hMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 206, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 205, 'Essence Of Control', '0x571C', '0x048D'],
        'Balanced': [1114249, 204, 'Essence Of Balance', '0x571C', '0x0043'],
        'Hit Chance Increase': [1114249, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Use Best Weapon Skill': [1114249, 201, 'Delicate Scales', '0x573A', '0x0000'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }

    const weapon1hMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 205, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 204, 'Essence Of Control', '0x571C', '0x048D'],
        'Hit Chance Increase': [1114249, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Use Best Weapon Skill': [1114249, 201, 'Delicate Scales', '0x573A', '0x0000'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }

    const bowMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 202, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 201, 'Essence Of Control', '0x571C', '0x048D'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Velocity': [1114253, 204],
        'Hit Chance Increase': [1114253, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114253, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Balanced': [1114253, 201, 'Essence Of Balance', '0x571C', '0x0043'],

        'Physical Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Poison Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }
    var itemObj = Orion.FindObject(itemSerial);
    var itemProps = itemObj.Properties();
    if(Orion.Contains(itemProps, 'Skill Required: Throwing'))
        return Orion.CharPrint(self,1159,'Throwing weapons currently unsupported! Boo gargoyles');//return throwingMod;
    else if(Orion.Contains(itemProps, 'One-handed Weapon'))
        return weapon1hMod;
    else if(Orion.Contains(itemProps, 'Skill Required: Archery'))
        return bowMod;
    else if(Orion.Contains(itemProps, 'Two-handed Weapon'))
        return weapon2hMod;
    else if(Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', itemObj.Graphic()))
        return jewelryMod;
    else if(Orion.Contains('0x1B72|0x1BC3|0x1BC4|0x1B7B|0x1B73|0x1B74|0x1B77|0x1B78|0x1B75|0x1B76|0x1BC5|0x1B79|0x1B7A', itemObj.Graphic()))
        return shieldMod;
    else if(Orion.Contains(itemProps, ' Resist '))
        return armorMod;
    else
        return Orion.CharPrint(self,1159,'Error in Type initImbueMods')
    }
    
const testGump = Orion.CreateCustomGump(5000);	
function testGumpStart()
	{
	var width = 600, height = 500;
    testGump.Clear();
    testGump.SetCallback('testProcess');
    testGump.AddResizepic(0, 0, 0x9BF5, width, height);
    //testGump.AddResizepic(0, 0, 0x2Ef8, width, height);
    testGump.AddComboBox(5101, 40, 55, '0x0BB8', 0, '0x0BB8', 200, -3, 20);
    testGump.AddComboBoxText('Choose Option:', '0', 1);
    for(var i=1;i<weaponOptions.length;i++)
        {
        testGump.AddComboBoxText(weaponOptions[i][2]);
        }
    testGump.AddButton(5001, 245, 54, 0xFA5, 0xFA5, 0xFA6, 0x0000); //Confirm button
    testGump.AddButton(5002, 460, 450, 0xFA5, 0xFA5, 0xFA6, 0x0000); //Confirm button
    testGump.Update();
	}

function testProcess(_hidden)
	{
     var button = CustomGumpResponse.ReturnCode();
     switch(button)
     	{
     	case 5001:
     		var response = CustomGumpResponse.ComboBox(5101)
     		Orion.SetGlobal('weaponOption', response)
     		//testGump.AddTextEntry(5201, 500, 55, '0', 'Enter Value', 100, 20);
            testGump.AddComboBox(5201, 295, 55, '0x0BB8', 0, '0x0BB8', 200, -3, weaponOptions[response][3].length);
     		for(var i=0;i<weaponOptions[response][3].length;i++)
                {
                testGump.AddComboBoxText(weaponOptions[response][3][i]);
                }
     		testGump.Update();
     		Orion.Print(response);
     		Orion.Print(button);
     		break;
     	case 5002:
            Orion.SetGlobal('weaponOptionValue')
     		Orion.Print(Orion.GetGlobal('testReg'))
     		Orion.Print(button);
     		return testGumpStart();
     		break;
     	}
	}

function test()
    {
    var mod = weapon1hMod['Damage Increase'];
    Orion.WaitForAddObject('myTarget');
    Orion.UseSkill('Imbuing')
    PressGumpInitialButton(Button.ImbueItem);
    if(Orion.WaitForTarget(2000))
    	Orion.TargetObject('myTarget');
    PressGumpSubButton(mod[0])
    PressGumpSubButton(mod[1])
    PressGumpSubButton(Button.IncrementOne);
    if(parse.CurrentValue == '10%')
    
    PressGumpSubButton(Button.IncrementOne);
    }

function test2()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Chance Increase'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne], '13%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Lower Defense'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Damage Increase'], [], '1%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Luck'], [Button.IncrementMax, Button.DecrementTen], '90');
    PressGumpInitialButton(Button.Close);
    }

function test3()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target container to imbue.')
    Orion.WaitForAddObject('myTarget');
    var containerSerial = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', containerSerial))
        {
        Orion.UseObject(containerSerial);
        Orion.Wait(1300);
        }
    var items = Orion.FindType(any,any,containerSerial);
    for(var i=0;i<items.length;i++)
        {
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Chance Increase'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne], '13%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Lower Defense'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Damage Increase'], [], '1%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Luck'], [Button.IncrementMax, Button.DecrementTen], '90');
        PressGumpInitialButton(Button.Close);
        }
    }

function ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString)
    { //incrementArr example: [Button.IncrementOne,Button.IncrementTen,Button.IncrementMax,Button.DecrementOne,Button.DecrementTen,Button.DecrementMax]
    var gemAmount = 200;
    var ingredient =
        {
        'Amethyst': '0x0F16',
        'Diamond': '0x0F26',
        'Citrine': '0x0F15',
        'Amber': '0x0F25',
        'Tourmaline': '0x0F18',
        'Star Sapphire': '0x0F0F',
        'Emerald': '0x0F10',
        'Ruby': '0x0F13',
        'Sapphire': '0x0F11',
        'Magical Residue': '0x2DB1',
        'Enchanted Essence': '0x2DB2',
        'Relic Fragment': '0x2DB3',
        }
    var imbuingContainer = Orion.FindTypeEx(0x0E75).filter(function(container)
        {
        return Orion.Contains(container.Properties(), 'Engraved: Imbuing');
        })[0];
    if(!imbuingContainer)
        {
        Orion.CharPrint(self,1159,"Engrave a backpack 'Imbuing' and restart script! Halting...");
        Orion.Terminate('all');
        }
    var imbuingContainerSerial = imbuingContainer.Serial();
    if(Shared.GetVar('NewItemCheck') != itemSerial || (!Orion.GumpExists('generic', self, '0x000F3E93') && !Orion.GumpExists('generic', self, '0x000F3E90')))
        {
        SetImbue(itemSerial);
        Shared.AddVar('NewItemCheck', itemSerial);
        }
    else if(Orion.GumpExists('generic', self, '0x000F3E93'))
        PressGumpInitialButton(Button.ImbueLastItem);
    PressGumpSubButton(Button.Back);
    PressGumpSubButton(mod[0]);
    PressGumpSubButton(mod[1]);
    if(ParseGump().SuccessChance == undefined)
        {
        Orion.Print('SuccessChance Failed');
        return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
        }
    if(incrementArr)
        {
        for(var i = 0;i<incrementArr.length;i++)
            {
            PressGumpSubButton(incrementArr[i]);
            }
        }
    if(verificationString && ParseGump().CurrentValue != verificationString)
        {
        Orion.Print('verificationString Failed');
        PressGumpSubButton(Button.Back);
        return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
        }
    PressGumpSubButton(Button.Confirm);
    var journalCheck = Orion.WaitJournal("You do not have enough resources to imbue this item.|You successfully imbue the item!|You attempt to imbue the item, but fail.|You must be near a soulforge to imbue an item.", Orion.Now() - 500, Orion.Now() + 5000, 'sys');
    if(journalCheck)
        {
        switch(journalCheck.Text())
            {
            case "You do not have enough resources to imbue this item.":
                if(!Restock('Amethyst', ingredient['Amethyst'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Diamond', ingredient['Diamond'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Citrine', ingredient['Citrine'], supplyContainerSerial, gemAmount, false, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Amber', ingredient['Amber'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Tourmaline', ingredient['Tourmaline'], supplyContainerSerial, gemAmount, false, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Star Sapphire', ingredient['Star Sapphire'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Emerald', ingredient['Emerald'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Ruby', ingredient['Ruby'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Sapphire', ingredient['Sapphire'], supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Magical Residue', ingredient['Magical Residue'], supplyContainerSerial, 30, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Enchanted Essence', ingredient['Enchanted Essence'], supplyContainerSerial, 30, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Relic Fragment', ingredient['Relic Fragment'], supplyContainerSerial, 30, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You successfully imbue the item!":
                GetImbueGump(true);
                return true;
            case "You attempt to imbue the item, but fail.":
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You must be near a soulforge to imbue an item.":
                Orion.PauseScript('all');
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            default:
                TextWindow.Open();
                TextWindow.Print('TypeError in imbueModByIncrements journalCheck! Halting...')
                Orion.Terminate('all');
                break;
            }
        }
    else
        {
        TextWindow.Open();
        TextWindow.Print('WaitJournal timed out in imbueModByIncrements! Halting...')
        Orion.Terminate('all');
        }
    }


//You do not have enough resources to imbue this item.
//You successfully imbue the item!

function SetImbue(itemSerial)
    {
    CloseAllGumps();
    Orion.Wait(1000);
    Orion.UseSkill('Imbuing')
    PressGumpInitialButton(Button.ImbueItem);
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(itemSerial);
    }

function ParseGump()
	{
	var gump = GetImbueGump();
	var text = gump.TextList();
	var parseObj =
		{
		'CurrentValue': text[0],
        'Property': text[1],
		'Weight': text[2],
		'Intensity': text[3],
		'CurrentProperties': Orion.Split(text[10], '/')[0],
		'MaxProperties': Orion.Split(text[10], '/')[1],
		'CurrentWeight': Orion.Split(text[11], '/')[0],
		'MaxWeight': Orion.Split(text[11], '/')[1],
		'CurrentTimes': Orion.Split(text[12], '/')[0],
		'MaxTimes': Orion.Split(text[12], '/')[1],
		'SuccessChance': text[13],
		}
	return parseObj;
	}

function GetImbueGump(initialBool, delay)
	{
    if(!delay)
        var delay = 3000;
    if(initialBool)
        var id = '0x000F3E93';
    else
        var id = '0x000F3E90';
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists('generic', self, id) && Orion.Now() < endTime)
	    Orion.Wait(100);
	if(Orion.GumpExists('generic', self, id))
		return Orion.GetGump(self, id);
	return false;
	}

function PressGumpInitialButton(buttonCode, delay)
    {
    if(!delay)
        var delay = 300;
    var gump = GetImbueGump(true);
    if(gump)
        {
        gump.Select(Orion.CreateGumpHook(buttonCode));
        Orion.Wait(delay);
        }
    }

function PressGumpSubButton(buttonCode, delay)
    {
    if(!delay)
        var delay = 300;
    var gump = GetImbueGump();
    if(gump)
        {
        gump.Select(Orion.CreateGumpHook(buttonCode));
        Orion.Wait(delay);
        }
    }

