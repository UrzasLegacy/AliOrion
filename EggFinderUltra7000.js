var eggIndex = '1';
var numRunes = 16;

function tester()
	{
	Orion.Resend();
	}

function TurnIns()
    {
    while(true)
        {
        if (Orion.WaitForGump(1000))
            {
            var gump0 = Orion.GetGump('last');
            if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
                {
                gump0.Select(Orion.CreateGumpHook(100));
                Orion.Wait(100);
                }
            }
        else
            Orion.Wait(100);
        }
    }

function Candelabra()
	{
	var a = Orion.FindType('0x0A27',any,ground,'',2);
	Orion.Print(a.length);
	}

function HayMonitor()
	{
	var shopnpc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
	        {
	        return Orion.Contains(part.Properties(), 'the farmer')
	        })[0];
	var shopnpcSerial = shopnpc.Serial();
	var shoplist = Orion.GetShopList('TradeRoute');
	var items =[new ShopListItem('0x0F36', '0x0000', '', 999)];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
	while(!Player.Dead())
		{
	    Orion.WaitContextMenuID(shopnpcSerial, 110);
	    Orion.RequestContextMenu(shopnpcSerial);
	    Orion.Wait(750);
	    if(Orion.GumpExists('shop'))
	        {
	        var npcInventory = Orion.ObjAtLayer("Buy", shopnpcSerial).Serial();
	        var npcItem = Orion.FindType('0x0F36', any, npcInventory);
	        if(npcItem[0])
		    	{
			    Orion.Wait(500);
			    Orion.BuyHook('TradeRoute');
			    Orion.WaitContextMenuID(shopnpcSerial, 110);
			    Orion.RequestContextMenu(shopnpcSerial);
			    Orion.Wait(1000);
			    Orion.CloseGump('shop', shopnpcSerial);
		    	}
	        }
		}
	}
function HayMonitor2()
	{
	var shopnpc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
	        {
	        return Orion.Contains(part.Properties(), 'the farmer')
	        })[0];
	var shopnpcSerial = shopnpc.Serial();
	var shoplist = Orion.GetShopList('TradeRoute');
	var items =[new ShopListItem('0x0F36', '0x0000', '', 999)];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
	while(!Player.Dead())
		{
	    Orion.WaitContextMenuID(shopnpcSerial, 110);
	    Orion.RequestContextMenu(shopnpcSerial);
	    Orion.Wait(750);
	    if(Orion.GumpExists('shop'))
	        {
	        var npcInventory = Orion.ObjAtLayer("Buy", shopnpcSerial).Serial();
	        var npcItem = Orion.FindType('0x0F36', any, npcInventory);
	        if(npcItem[0])
		    	{
			    Orion.Wait(500);
			    Orion.BuyHook('TradeRoute');
			    Orion.WaitContextMenuID(shopnpcSerial, 110);
			    Orion.RequestContextMenu(shopnpcSerial);
			    Orion.Wait(1000);
			    Orion.CloseGump('shop', shopnpcSerial);
			    Orion.AddDisplayTimer('buycooldown', 1500000, 'AboveChar', 'Circle|bar', 'Restock Cooldown', 0,0,any,-1, '0x00FF00FE');
			    Orion.Wait(3000);
			    while(Orion.DisplayTimerExists('buycooldown'))
			    	{
			    	Orion.Wait(1200);
			    	Orion.UseObject(backpack);
			    	Orion.Wait(60000)
			    	}
		    	}
		    else
		    	{
		    	Orion.Wait(250);
		    	Orion.CloseGump('shop', shopnpcSerial);
		    	Orion.Wait(250);
	        	}
	        }
		}
	}
function BuyHay()
    {
    var shoplist = Orion.GetShopList('TradeRoute');
    var shopnpc = Orion.FindTypeEx(any, any, ground, 'mobile', 24, 'yellow').filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'the farmer')
        })[0];
    Orion.WaitContextMenuID(shopnpc.Serial(), 110);
    Orion.RequestContextMenu(shopnpc.Serial());
    Orion.Wait(750);
    if(Orion.GumpExists('shop'))
        {
        var npcInventory = Orion.ObjAtLayer("Buy", shopnpc.Serial()).Serial();
        var npcItem = Orion.FindType('0x0F36', any, npcInventory);
        }
   if(npcItem && npcItem.length > 0) //divide amount needed by number of entries for the needed item in the vendor inventory
		Orion.Print(npcItem.length)
    var items =[new ShopListItem('0x0F36', '0x0000', '', 999)];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
   Orion.Wait(500);
    Orion.BuyHook('TradeRoute');
   Orion.WaitContextMenuID(shopnpc.Serial(), 110);
    Orion.RequestContextMenu(shopnpc.Serial());
    }
function HayRemover()
	{
	var cuttables = '0x0B34|0x09A9|0x0E7E|0x0E7D|0x09AA|0x0B35'
	Orion.PauseScript('all','GMJournalScan|HayRemover');
	while(Orion.ObjAtLayer(25))
		{
		Orion.UseObject(self);
		Orion.Wait(1200);
		}
	var axe = Orion.FindType('0x0F47')[0];
	var table = Orion.FindType(cuttables, any, ground, 'near', 2)[0];
	var hay = Orion.FindType('0x0F36', any, ground, '', 1);
	var horse = Orion.FindTypeEx(any, any, ground, '', 2).filter(function(part)
		{
		return Orion.Contains(part.Name(), 'a horse');
		})
		.filter(function(part2)
			{
			Orion.RequestContextMenu(part2.Serial())
			return Orion.WaitForContextMenu(1000);
			})[0].Serial();
	while(hay[0])
		{
		Orion.Print(hay.length)
		Orion.MoveItem(hay[Orion.Random(0,hay.length)], 0, horse);
		Orion.Wait(1200);
		hay = Orion.FindType('0x0F36', any, ground, '', 1);
		}
	while(table)
		{
		Orion.UseObject(axe);
		if(Orion.WaitForTarget(2000))
			Orion.TargetObject(table);
		Orion.Wait(1200);
		table = Orion.FindType(cuttables, any, ground, 'near', 2)[0];
		}
	Orion.UseObject(horse);
	Orion.Wait(1200);
	Orion.ResumeScript('all');
	}

function staff()
	{
	var staff = Orion.FindType('0x0DF0')[0]
	Orion.Equip(staff);
	}

function initScripts()
    {
    Orion.Exec('EggFinderUltra6000',true);
    Orion.Exec('GMJournalScan',true);
    Orion.Exec('Preservation',true); 
    }

function GetHue()
    {
    Orion.WaitForAddObject('myTarget');
    var target = Orion.FindObject('myTarget')
    Orion.Print(parseInt(target.Color()));
    Orion.Print(target.Graphic());
    }

function EggFinderUltra6000()
	{
	while(!Player.Dead() && Number(Orion.FindObject(backpack).Properties().match(/Contents: (\d*)\/125/)[1]) < 120)
		{
        Orion.IgnoreReset();
        RecallByGump('Eggs',eggIndex,'Moar',eggIndex);
       	if(Orion.GetDistance(4420,1460) < 24)
       		{
	       	Orion.SetSearchArea(4389,1431,4444,1452);
	       	var a = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(a.length)
	       		a.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4427,1452,4436,1475);
	       	var b = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(b.length)
	       		b.forEach(function(part){Orion.Ignore(part)});
	       	Orion.ResetSearchArea();
       		}
       	if(Orion.GetDistance(4556,1498) < 24)
       		{
	       	Orion.SetSearchArea(4522,1469,4549,1508);
	       	var a = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(a.length)
	       		a.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4546,1508,4571,1525);
	       	var b = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(b.length)
	       		b.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4557,1469,4589,1482);
	       	var c = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(c.length)
	       		c.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4575,1484,4615,1506);
	       	var d = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(d.length)
	       		d.forEach(function(part){Orion.Ignore(part)});
	       	Orion.ResetSearchArea();
       		}
       	if(Orion.GetDistance(4630,1324) < 24)
       		{
	       	Orion.SetSearchArea(4644,1320,4660,1328);
	       	var a = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(a.length)
	       		a.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4600,1293,4657,1319);
	       	var b = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(b.length)
	       		b.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4598,1339,4648,1360);
	       	var c = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(c.length)
	       		c.forEach(function(part){Orion.Ignore(part)});
	       	Orion.SetSearchArea(4597,1308,4621,1339);
	       	var d = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
	       	if(d.length)
	       		d.forEach(function(part){Orion.Ignore(part)});
	       	Orion.ResetSearchArea();
       		}
        Orion.SetGlobal('startX', String(Player.X()));
        Orion.SetGlobal('startY', String(Player.Y()));
		if(!Player.WarMode())
            Orion.WarMode(1);
        var egg = Orion.FindTypeEx('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, 'near', 24)[0];
		while(egg)
			{
			Orion.CharPrint(self, egg.Color(), 'Egg found!');
			if(Orion.WalkTo(egg.X(),egg.Y(),0,0,255,2,2,10000))
				Orion.MoveItem(egg.Serial());
			else
				Orion.Ignore(egg.Serial());
            Orion.Wait(500);
            egg = Orion.FindTypeEx('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, 'near', 24)[0];
			}
		Orion.Wait(1200);
        var eggInsure = Orion.FindTypeEx('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18').filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Insured');
            });
        if(!Player.Dead() && eggInsure[0])
            {
            Orion.WaitContextMenuID(self, 418);
            Orion.RequestContextMenu(self);
            for(var i=0;i<eggInsure.length;i++)
            	{
	            if(Orion.WaitForTarget(2000))
	                Orion.TargetObject(eggInsure[i].Serial());
            	}
            Orion.Wait(600);
            Orion.CancelTarget();
            }
		if(eggIndex == String(numRunes) && Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18').length >= 20)
			{
			Ingots();
			}
		var eggIndexNum = +eggIndex + 1;
        if(eggIndexNum <= numRunes)
            eggIndex = String(eggIndexNum); 
        else
            eggIndex = '1';
		}
    BotPush('Backpack full');
	}

function guards()
    {
    while(!Player.Dead())
        {
        if(Player.Hits('%') < 90)
            {
            Orion.Say('guards');
            Orion.Wait(10000);
            }
        Orion.Wait(500);
        }
    }

function Preservation()
    {
    while(!Player.Dead())
        {
        if(Player.Hits('%') < 80)
            {
            var startX = +Orion.GetGlobal('startX');
            var startY = +Orion.GetGlobal('startY');
            Orion.Print(startX + ' ' + startY)
            Orion.StopWalking();
            Orion.Wait(100);
            Orion.PauseScript('EggFinderUltra6000');
            Orion.Wait(100);
            Orion.Say('guards');
            while(!Player.Dead() && !Orion.WalkTo(startX,startY,0,0))
                Orion.Wait(100);
            while(!Player.Dead() && Player.Hits('%') < 90)
                {
                Orion.Say('guards');
                if(Player.Poisoned())
                    {
                    Orion.Cast('Cure')
                    if(Orion.WaitForTarget(3000))
                        Orion.TargetObject(self);
                    Orion.Wait(500);
                    }
                Orion.Cast('Greater Heal')
                if(Orion.WaitForTarget(4000))
                    Orion.TargetObject(self);
                Orion.Wait(500);
                }
            var egg = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, ground, '', 24);
            egg.forEach(function(part)
                {
                Orion.Ignore(part);
                Orion.Wait(10);
                });
            Orion.Wait(100);
            Orion.ResumeScript('EggFinderUltra6000');
            }
        Orion.Wait(500);
        }
    BotPush('Dead');
    }

function Butterflies()
    {
    EggQuester('Butterflies', 'the lepidopterist', 5, '0x2838');
    }

function Hedges()
    {
    EggQuester('Hedges', 'the horticulturist', 3, '0x0DEC');
    }

function Candles()
    {
    EggQuester('Candles', 'the monk of the virtues', 25, '0x1430');
    }

function Parrots()
    {
    EggQuester('Parrots', 'the rare parrot breeder', 20, '0x4D09');
    }

function Ingots()
    {
    EggQuester('Ingots', 'the curio collector', 10, '0x1BEB');
    }

function EggQuester(runeString, npcTitleString, eggNumber, rewardGraphicID)
    {
    var questgiver = Orion.FindTypeEx(any,any,ground,'',24).filter(function(npc)
        	{
        	return Orion.Contains(npc.Properties(), npcTitleString);
        	})[0];
    if(!questgiver)
        {
        RecallByGump('Destard', runeString, 'Destard', runeString + 2);
        if(runeString == 'Parrots')
            {
            var gate = Orion.FindTypeEx(0x0F6C, any, ground, 'near', 24);
            if(gate[0])
                Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
            Orion.Resend();
            Orion.Wait(500);
            if(gate[0])
                if(Player.X() != gate[0].X() || Player.Y() != gate[0].X())
                    Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
            Orion.Wait(500);
            if(Orion.WaitForGump(2000))
                {
                var gump0 = Orion.GetGump('last');
                if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
                    {
                    var gumpHook0 = Orion.CreateGumpHook(1);
                    gumpHook0.AddCheck(34, true);
                    gump0.Select(gumpHook0);
                    Orion.Wait(100);
                    }
                }
            Orion.Wait(2000);
            Orion.WalkTo(548,1832);
            Orion.Wait(500);
            }
        else if(runeString == 'Ingots')
            {
            Orion.Wait(1000);
            Orion.Say('Dungeon Destard');
            Orion.Wait(2000);
            }
        }
    var eggCheck = Orion.FindTypeEx('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18')
    while(!Player.Dead() && eggCheck.length >= eggNumber)
        {
        var questgiver = Orion.FindTypeEx(any,any,ground,'',24).filter(function(npc)
        	{
        	return Orion.Contains(npc.Properties(), npcTitleString);
        	})[0];
        //Orion.WalkTo(questgiver.X(),questgiver.Y());
        Orion.UseObject(questgiver.Serial());
        Orion.Wait(1500);
        var gump0 = Orion.GetGump(any, '0x00000320');
        if (gump0 !== null)
            {
            gump0.Select(Orion.CreateGumpHook(1));
            Orion.Wait(100);
            }
        Orion.Wait(1100);
        Orion.WaitContextMenuID(self, 801);
        Orion.RequestContextMenu(self);
        var egg = Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18');
        for(var i=0;i<eggNumber;i++)
            {
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(egg[i]);
            Orion.Wait(500);
            }
        if(Orion.WaitForTarget(2000))
            Orion.CancelTarget();
        Orion.Wait(1100);
        Orion.UseObject(questgiver.Serial());
        Orion.Wait(1500);
      	var gump1 = Orion.GetGump(any, '0x0000032A');
      	if(gump1 !== null)
			{
			gump1.Select(Orion.CreateGumpHook(4));
			Orion.Wait(100);
			 }
        Orion.Wait(1500);
		var gump2 = Orion.GetGump(any, '0x00000323');
		if (gump2 !== null)
		    {
		    gump2.Select(Orion.CreateGumpHook(1));
		    Orion.Wait(100);
		    }
       	Orion.Wait(1500);
        var reward = Orion.FindTypeEx(rewardGraphicID).filter(function(part)
            {
            return !Orion.Contains(part.Properties(), 'Insured')  
            })[0];
        while(!Player.Dead() && reward)
            {
            Orion.WaitContextMenuID(self, 418);
            Orion.RequestContextMenu(self);
            if (Orion.WaitForTarget(2000))
                Orion.TargetObject(reward.Serial());
            Orion.Wait(1100);
            Orion.CancelTarget();
            reward = Orion.FindTypeEx(rewardGraphicID).filter(function(part)
                {
                return !Orion.Contains(part.Properties(), 'Insured')  
                })[0];
            }
        eggCheck = Orion.FindTypeEx('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18');
        }
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'Are you there|GM';
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

function BotPush(text)
    {
    var bot = "https://discordapp.com/api/webhooks/"
    + '887268637315047444' //hook
    + "/"
    + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + Player.Name() + ': ' + text;
    Orion.HttpPost(bot, paramText);
    }

function IngotMover5000()
	{
	Orion.WaitForAddObject('myBag');
	Orion.WaitForAddObject('myTarget');
	while(Orion.FindType('0x1BEB', '0x0AC3', 'myBag')[0])
		{
		var butterfly = Orion.FindType('0x1BEB', '0x0AC3', 'myBag')[0]
		Orion.MoveItem(butterfly, 0, 'myTarget');
		Orion.Wait(1100);
		}
	}
	
function EggMover5000()
	{
	Orion.WaitForAddObject('myBag');
	Orion.WaitForAddObject('myTarget');
	while(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, 'myBag')[0])
		{
		Orion.MoveItem(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', any, 'myBag')[0], 0, 'myTarget');
		Orion.Wait(1100);
		}
	}	
	
function RareEggMover5000()
	{
	Orion.WaitForAddObject('myBag');
	Orion.WaitForAddObject('myTarget');
	
	while(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', '0x0AC7|0x0AC6|0x0AC1|0x0AB0|0x081C|0x081B', 'myBag')[0])
		{
		Orion.MoveItem(Orion.FindType('0x9F13|0x9F14|0x9F15|0x9F16|0x9F17|0x9F18', '0x0AC7|0x0AC6|0x0AC1|0x0AB0|0x081C|0x081B', 'myBag')[0], 0, 'myTarget');
		Orion.Wait(1100);
		}
	}

function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}

function toost()
	{
	while(true)
		{
		if (Orion.WaitForPrompt(1000))
			Orion.SendPrompt('1000000 Curiously Adorned Egg');
		}
	}

function RecallByGump2(bookName,runeName,backupBook,backupRune) 
	{
	while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID())
        if(Orion.GetGump(any).ID() == '0x00000320' || Orion.GetGump(any).ID() == '0x00000323')
        	Orion.GetGump(any).Select(Orion.CreateGumpHook(1));
        else
        	Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
                {
                return Orion.Contains(part.Properties(), bookName)
                });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 650)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	Orion.UseObject(runeItem[0].Serial());
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		var runeInd = gump0.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
			{
			gump0.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump0.Serial());
		}
    var check = Orion.WaitJournal('Something is blocking the location.|You cannot teleport into that area.', Orion.Now(), Orion.Now()+4000, 'sys');
    if(check && check.Text() == 'Something is blocking the location.')
        {
        Orion.Wait(2000);
        if(backupBook == 'skipDoubleBlocked')
            {
            //BotPush('Double Blocked at ' + eggIndex);
            eggIndexNum = +eggIndex + 1 
            if(eggIndexNum <= numRunes)
                eggIndex = String(eggIndexNum); 
            else
                eggIndex = '1';
            return RecallByGump('Eggs',eggIndex,'Moar',eggIndex);
            }
        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
            {
            return part.Properties().match(/.+$/) == backupBook;
            });
        if(backup)
            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked');
        else
            Orion.Print("No backup runebook named '" + backupBook + "' found!");
        }
    else if(check && check.Text() == 'You cannot teleport into that area.')
        {
        eggIndexNum = +eggIndex + 1 
        if(eggIndexNum <= numRunes)
            eggIndex = String(eggIndexNum); 
        else
            eggIndex = '1';
        return RecallByGump('Eggs',eggIndex,'Moar',eggIndex);
        }
	if(x == Player.X() && y == Player.Y()) 
        RecallByGump(bookName,runeName,backupBook,backupRune);
	}

function RecallByGump(bookName,runeName,backupBook,backupRune) 
	{
	while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID())
        if(Orion.GetGump(any).ID() == '0x00000320' || Orion.GetGump(any).ID() == '0x00000323')
        	Orion.GetGump(any).Select(Orion.CreateGumpHook(1));
        else
        	Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
                {
                return Orion.Contains(part.Properties(), bookName)
                });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 650)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	Orion.UseObject(runeItem[0].Serial());
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		var runeInd = gump0.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059'))
			{
			gump0.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump0.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 20000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            eggIndexNum = +eggIndex + 1 
	            if(eggIndexNum <= numRunes)
	                eggIndex = String(eggIndexNum); 
	            else
	                eggIndex = '1';
	            return RecallByGump('Eggs',eggIndex,'Moar',eggIndex);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            });
	        if(backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked');
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	       {
	       Orion.Wait(2000);
	        eggIndexNum = +eggIndex + 1 
	        if(eggIndexNum <= numRunes)
	            eggIndex = String(eggIndexNum); 
	        else
	            eggIndex = '1';
	        return RecallByGump('Eggs',eggIndex,'Moar',eggIndex);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(200);
	Orion.CheckLag(5000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune);
	}