function TinkeringInit()
    {
    Orion.Exec('Tinkering', true);
    //Orion.Exec('CarpentryGump', true, ['Carpentry']);
    Orion.Exec('GMJournalScan', true);
    }

function Tinkering()
    {
    var targetSkillValue = 1000;
    var toolString = '0x1EB9';
    Orion.CharPrint(self,1159,'Target your supply container. It should contain ingots and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var trashBarrel = Orion.FindType('0x0E77', '0x0358', ground, ' ', 2)[0];
    while(Orion.SkillValue('Tinkering') < targetSkillValue)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        if(!trashBarrel || Orion.GetDistance(trashBarrel) > 2)
            return Orion.Print('Trash Barrel not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1200);
            }
        while(Player.Weight() > 500)
            {
            while(Orion.FindType(any).length)
                {
                Orion.CharPrint(self,1159,'Over weight threshold, moving everything into supply container');
                Orion.MoveItem(Orion.FindType(any)[0], 0, supplyContainer.Serial());
                Orion.Wait(1100);
                }
            }
        while(Orion.Count('0x1BF2') < 10)
            {
            Orion.CharPrint(self,1159,'Restocking Ingots');
            Restock('0x1BF2', supplyContainer.Serial(), 400);
            }
        while(!Orion.FindType('0x1EB9')[1] && Orion.Count('0x1BF2') > 4)
            {
            Orion.CharPrint(self,1159,'Crafting Tinker Tool');
            if(Orion.SkillValue('Tinkering') > 400 && Orion.FindType('0x1EB9')[0])
                CraftItem('0x1EB9', 9003, 11);
            else
                Restock('0x1EB9', supplyContainer.Serial(), 0);
            }
        var skillValue = Orion.SkillValue('Tinkering');
        if(skillValue < 300)
            return Orion.Print('Train up to 30.0 first! Halting...')
        else if(skillValue < 450)
            {
            var menuButtonID = 9003;// Scissors
            var itemButtonID = 8;
            }
        else if(skillValue < 600)
            {
            var menuButtonID = 9003; // Tongs
            var itemButtonID = 20;
            }
        else if(skillValue < 750)
            {
            var menuButtonID = 9003; // Lockpick
            var itemButtonID = 25;
            }
        else if(skillValue < 850)
            {
            var menuButtonID = 9001;// Bracelet
            var itemButtonID = 2;
            }
        else if(skillValue < 900)
            {
            var menuButtonID = 9006; // Spyglass
            var itemButtonID = 56;
            }
        else if(skillValue < 1000)
            {
            var menuButtonID = 9001; // Ring
            var itemButtonID = 1;
            }

        var startInventory = Orion.FindType(any);
        CraftItem(toolString, menuButtonID, itemButtonID);
        while(Orion.FindType(any).filter(function(checkSerial){return startInventory.indexOf(checkSerial) == -1})[0])
            {
            Orion.MoveItem(Orion.FindType(any).filter(function(checkSerial){return startInventory.indexOf(checkSerial) == -1})[0], 0, trashBarrel);
            Orion.Wait(1100);
            }
        }
    }

function CarpentryInit()
    {
    Orion.Exec('Carpentry', true);
    //Orion.Exec('CarpentryGump', true, ['Carpentry']);
    Orion.Exec('GMJournalScan', true);
    }

function Carpentry()
    {
    var targetSkillValue = 1000;
    var toolString = '0x10E7';
    Orion.CharPrint(self,1159,'Target your supply container. It should contain ingots and tinker tools');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.FindObject('myTarget');
    var hatchet = Orion.FindTypeEx(any).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Hatchet');
        })[0].Serial();
    while(Orion.SkillValue('Carpentry') < targetSkillValue)
        {
        if(!supplyContainer || supplyContainer.Distance() > 2)
            return Orion.Print('Supply Container not found! Halting...');
        while(!Orion.GumpExists('container', supplyContainer.Serial()))
            {
            Orion.CharPrint(self,1159,'Opening Supply Container');
            Orion.UseObject(supplyContainer.Serial());
            Orion.Wait(1200);
            }
        while(Player.Weight() > 500)
            {
            Orion.CharPrint(self,1159,'Over weight threshold, moving things around');
            while(Orion.FindType('0x1BD7|0x1BF2')[0])
                {
                Orion.MoveItem(Orion.FindType('0x1BD7|0x1BF2')[0], 0, supplyContainer.Serial());
                Orion.Wait(1100);
                }
            }
        while(Orion.Count('0x1BD7') < 50)
            {
            Orion.CharPrint(self,1159,'Restocking Boards');
            Restock('0x1BD7', supplyContainer.Serial(), 200);
            }
        while(Orion.Count('0x1BF2') < 30)
            {
            Orion.CharPrint(self,1159,'Restocking Ingots');
            Restock('0x1BF2', supplyContainer.Serial(), 50);
            }
        while(!Orion.FindType('0x1EB9')[0])
            {
            Orion.CharPrint(self,1159,'Restocking Tinker Tool');
            Restock('0x1EB9', supplyContainer.Serial(), 0);
            }
        while(!Orion.FindType('0x10E7')[0] && Orion.Count('0x1BF2') > 4)
            {
            if(Orion.SkillValue('Tinkering') > 300 && Orion.FindType('0x1EB9')[0])
                {
                Orion.CharPrint(self,1159,'Crafting Carpenter Tool');    
                CraftItem('0x1EB9', 9003, 10);
                }   
            else
                {
                Orion.CharPrint(self,1159,'Restocking Carpenter Tool');
                Restock('0x10E7', supplyContainer.Serial(), 0);
                }
            }
        var skillValue = Orion.SkillValue('Carpentry');
        if(skillValue < 300)
            return Orion.Print('Train up to 30.0 first! Halting...')
        else if(skillValue < 480)
            {
            var menuButtonID = 9003;// Medium Crate
            var itemButtonID = 99;
            }
        else if(skillValue < 530)
            {
            var menuButtonID = 9003; // Large Crate
            var itemButtonID = 100;
            }
        else if(skillValue < 600)
            {
            var menuButtonID = 9005; // Wooden Shield
            var itemButtonID = 120;
            }
        else if(skillValue < 740)
            {
            var menuButtonID = 9004; // Fukiya
            var itemButtonID = 122;
            }
        else if(skillValue < 790)
            {
            var menuButtonID = 9004;// Quarter Staff
            var itemButtonID = 118;
            }
        else if(skillValue < 820)
            {
            var menuButtonID = 9004; // Gnarled Staff
            var itemButtonID = 119;
            }
        else if(skillValue < 960)
            {
            var menuButtonID = 9004; // Black Staff
            var itemButtonID = 906;
            }
        else if(skillValue < 1000)
            {
            var menuButtonID = 9004; // Wild Staff
            var itemButtonID = 135;
            }
        var startInventory = Orion.FindType(any);
        CraftItem(toolString, menuButtonID, itemButtonID);
        while(Orion.FindType(any).filter(function(checkSerial){return startInventory.indexOf(checkSerial) == -1})[0])
            {
            Orion.UseObject(hatchet);
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(Orion.FindType(any).filter(function(checkSerial){return startInventory.indexOf(checkSerial) == -1})[0]);
            Orion.Wait(1100);
            }
        }
    }

function CarpentryGump(_)
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
        return Orion.PauseScript('all');
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
