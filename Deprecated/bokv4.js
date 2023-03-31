function BokInit()
    {
    Orion.Exec('Bok', true);
    Orion.Exec('BokGump', true);
    Orion.Exec('GMJournalScan', true);
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
        while(Orion.Count('0x1BD7') < 20)
            {
            Orion.CharPrint(self,1159,'Restocking Boards');
            Restock('0x1BD7', supplyContainer.Serial(), 200);
            }
        while(!Orion.FindType('0x10E7')[0]) //no carpenter tool
            {
            while(!Orion.FindType('0x1EB9')[0]) //no tinker tool
                {
                while(Orion.Count('0x1BF2') < 5) //no ingots
                    {
                    Orion.CharPrint(self,1159,'Restocking Ingots');
                    Restock('0x1BF2', supplyContainer.Serial(), 50);
                    }
                Orion.CharPrint(self,1159,'Restocking Tinker Tool');
                Restock('0x1EB9', supplyContainer.Serial(), 1);
                }
            Orion.CharPrint(self,1159,'Crafting Carpenter Tool');
            CraftItem('0x1EB9', 9003, 10);
            }
        var inviableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
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
        var viableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
            {
            var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
            return charges >= 4;
            });
        while(!viableRunics[0])
            {
            Orion.CharPrint(self,1159,'Restocking Runic Tool');
            Restock('0x1029', supplyContainer.Serial(), 0);
            viableRunics = Orion.FindTypeEx('0x1029').filter(function(runic)
                {
                var charges = Number(runic.Properties().match(/Uses Remaining: (\d+)/)[1]);
                return charges >= 4;
                });
            }
        while(!Orion.FindType('0x27A8')[0])
            {
            Orion.CharPrint(self,1159,'Crafting Bokuto');
            CraftItem('0x10E7', 9004, 121);
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
    Orion.SetGlobal('reforged', '1');
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

function Restock(graphicID, supplyContainerSerial, amount)
    {
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1200);
        }
    var needed = amount - Orion.Count(graphicID);
    var restockItem = Orion.FindType(graphicID, any, supplyContainerSerial);
    if(needed > 0 && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + graphicID);
        return Orion.PauseScript('Bok');
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0]);
        Orion.Wait(1200);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed);
        Orion.Wait(1200);
        }
    Orion.Wait(100);
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
    Orion.Wait(200);
    var elapsedTime = Orion.Now() - startTime;
    if(elapsedTime < 1200)
        Orion.Wait(1200 - elapsedTime);
    }


function GMJournalScan()
	{
	var msg = 'Are you there|Begin GM Chat';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'Are':		
				case 'Begin':
					BotPush(Player.Name() + ': GM');
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all');
                    Orion.Wait(1000);
                    Orion.Step('n');
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);			
					break;	
				default:
					break;
				}
			}
		}
	}

function Eval()
	{
	Orion.WaitForAddObject('myTarget');
	var bok = Orion.FindObject('myTarget');
	Orion.Print(EvalBok(bok))
	}
	
function EvalBok(bok)
	{
	if(Orion.Contains(bok.Properties(), 'Hit Lightning 70%|Hit Fireball 70%|Hit Harm 70%|Hit Lower Defense 70%') && Orion.Contains(bok.Properties(), 'Fire Damage|Cold Damage|Poison Damage|Energy Damage'))
		return true;
	return false;	
	}

function BotPush(message) 
	{
	var hook;
	var key;
    if (hook == null && key == null) 
    	{
        var file = Orion.NewFile();
        open = file.Open('discordkey3.conf');
        if (!file.Opened()) 
        	{
            return;
        	}
        hook = file.Read();
        key = file.Read();
        file.Close();
    }
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var paramText = "content=" + message;
    Orion.HttpPost(bot, paramText);
}