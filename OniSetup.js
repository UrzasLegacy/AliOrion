function initScripts()
    {
    initChiv();
    }

function initChiv()
    {
    Orion.Exec('TrainChivalry',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.Exec('GMJournalScan',true);
    }

function initHealing()
    {
    Orion.Exec('TrainHealing',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.Exec('StatLocker',true);
    Orion.Exec('GMJournalScan',true);
    }

function initParry()
    {
    Orion.Exec('TrainParry',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.Exec('StatLocker',true);
    Orion.Exec('GMJournalScan',true);
    }

function initSpider()
    {
    Orion.Exec('TrainSpider',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.Exec('StatLocker',true);
    Orion.Exec('GMJournalScan',true);
    }

function InitialSetup()
    {
    //get lrc suit and gold first
    //set all skills to 'Lock' in Orion Assistant
    Orion.ClientOptionSet('AutoOpenDoorsMode', 1);
    Orion.ClientOptionSet('AlwaysRun', 1);
    Orion.SetSkillStatus('Swordsmanship', 'up');
    Orion.SetSkillStatus('Tactics', 'up');
    Orion.SetSkillStatus('Anatomy', 'up');
    Orion.SetSkillStatus('Healing', 'up');
    Orion.SetSkillStatus('Chivalry', 'up');
    Orion.SetSkillStatus('Parrying', 'up');
    Orion.SetSkillStatus('Resisting Spells', 'up');
    if(Orion.Contains(Player.Properties(), '(young)'))
        {
        Orion.Say('i renounce my young player status');
        if(Orion.WaitForGump(1000))
            {
            var gump0 = Orion.GetGump('last');
            if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00005B9C'))
                {
                gump0.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        }
    if(!Orion.ObjAtLayer('Mount'))
        {
        while(Player.X() != 3523 && Player.Y() != 2576)
            {
            Orion.WalkTo(3523, 2576, 0, 0);
            Orion.Wait(500);
            }
        Orion.Wait(1300);
        var vendors = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(vendor)
            {
            return Orion.Contains(vendor.Properties(), 'the animal trainer') && !Orion.Contains(vendor.Properties(), 'guild');
            });
        var shopnpcSerial = vendors[0].Serial();
        var shoplist = Orion.GetShopList('Horsey');
        var items = [
            new ShopListItem('0x00E4', '0x0000', '', 1),
            ];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Horsey');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(1300);
        var horsey = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'blue|green').filter(function(mobile)
            {
            return Orion.Contains(mobile.Name(), 'a horse');  
            })[0];
        while(!Orion.ObjAtLayer('Mount'))
            {
            Orion.Say('all follow me');
            Orion.UseObject(horsey.Serial())
            Orion.Wait(1300);
            }
        }
    if(Orion.SkillValue('Healing') < 400)
        {
        while(Player.X() != 3466 && Player.Y() != 2559)
            {
            Orion.WalkTo(3466, 2559, 0, 0);
            Orion.Wait(500);
            }
        Orion.Wait(1300);
        var instructor = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(instructor)
            {
            return Orion.Contains(instructor.Properties(), 'the Healing Instructor') && !Orion.Contains(instructor.Properties(), 'guild');
            })[0];
        while(Orion.SkillValue('Healing') < 400)
            {
            Orion.WalkTo(instructor.X(), instructor.Y());
            Orion.RequestContextMenu(instructor.Serial());
            Orion.WaitContextMenuID(instructor.Serial(), 217);
            Orion.Wait(2000);
            Orion.MoveItemType('0x0EED', '0x0000', backpack, 400, instructor.Serial());
            Orion.Wait(2000);
            }
        }
    if(Player.TithingPoints() < 100000)
        {
        while(Player.X() != 3526 && Player.Y() != 2517)
            {
            Orion.WalkTo(3526, 2517, 0, 0);
            Orion.Wait(500);
            }
        var ankh = Orion.FindType('0x0005',any,ground,'item',2)[0];
        Orion.RequestContextMenu(ankh);
        Orion.WaitContextMenuID(ankh, 412);
        if(Orion.WaitForGump(2000))
            {
            var gump0 = Orion.GetGump('last');
            if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000293'))
                {
                gump0.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        if(Orion.WaitForGump(2000))
            {
            var gump1 = Orion.GetGump('last');
            if((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00000293'))
                {
                var gumpHook0 = Orion.CreateGumpHook(2);
                gumpHook0.AddEntry(1, "");
                gump1.Select(gumpHook0);
                Orion.Wait(100);
                }
            }
        }
    if(Orion.SkillValue('Chivalry') < 400 || !Orion.FindType('0x2252')[0])
        {
        while(Player.X() != 3535 && Player.Y() != 2510)
            {
            Orion.WalkTo(3535, 2510, 0, 0);
            Orion.Wait(500);
            }
        var instructor = Orion.FindTypeEx(any,any,ground,'mobile',20,'yellow').filter(function(instructor)
            {
            return Orion.Contains(instructor.Properties(), 'the Chivalry Instructor') && !Orion.Contains(instructor.Properties(), 'guild');
            })[0];
        var instructorSerial = instructor.Serial();
        }
    while(Orion.SkillValue('Chivalry') < 400)
        {
        Orion.WalkTo(instructor.X(), instructor.Y());
        Orion.RequestContextMenu(instructorSerial);
        Orion.WaitContextMenuID(instructorSerial, 251);
        Orion.Wait(2000);
        Orion.MoveItemType('0x0EED', '0x0000', backpack, 400, instructorSerial);
        Orion.Wait(2000);
        }
    if(!Orion.FindType('0x2252')[0])
        {
        Orion.WalkTo(instructor.X(), instructor.Y());
        var shoplist = Orion.GetShopList('ChivBook');
        var items = [
            new ShopListItem('0x2252', '0x0000', '', 1),
            ];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('ChivBook');
        Orion.WaitContextMenuID(instructorSerial, 110);
        Orion.RequestContextMenu(instructorSerial);
        Orion.Wait(1300);
        }
    if(Orion.SkillValue('Healing') >= 400 && Orion.SkillValue('Chivalry') >= 400 && Orion.FindType('0x2252')[0] && Orion.ObjAtLayer('Mount') && Player.Map() == 1 && Player.TithingPoints() == 100000)
        {
        while(Player.X() != 3450 && Player.Y() != 2677)
            {
            Orion.WalkTo(3450, 2677, 0, 0);
            Orion.Wait(500);
            }
        var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 24);
        if(gate[0])
            {
            Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
            Orion.Resend();
            Orion.Wait(1000);
            if(Player.X() != gate[0].X() || Player.Y() != gate[0].X())
                Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
            Orion.UseObject(gate[0].Serial());
            Orion.Wait(1000);
            if(Orion.WaitForGump(2000))
                {
                var gump0 = Orion.GetGump('last');
                if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
                    {
                    var gumpHook0 = Orion.CreateGumpHook(1);
                    gumpHook0.AddCheck(28, true);
                    gump0.Select(gumpHook0);
                    Orion.Wait(100);
                    gump0.Select(Orion.CreateGumpHook(0));
                    }
                }
            Orion.Wait(3000);
            }
        }
    }

function TrainSpider()
    {
    var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ': Durability Low';
    while(!Player.Dead())
        {
        while(!Orion.ObjAtLayer('RightHand'))
            {
            Orion.CharPrint(self,1159,'Waiting for weapon...');
            Orion.Wait(2000)
            }
        var weapon = Orion.ObjAtLayer('RightHand');
        var dura = (weapon.Properties().match(/Durability (\d+)/) || [])[1];
        if(dura && +dura < 10)
            {
            Orion.HttpPost(bot, paramText);
            Orion.Step('e');
            Orion.Wait(250);
            Orion.Step('e');
            Orion.Wait(250);
            Orion.Step('e');
            Orion.Wait(250);
            Orion.Step('e');
            Orion.Wait(250);
            while(Orion.ObjAtLayer('RightHand'))
                {
                Orion.Unequip('RightHand');
                Orion.Wait(1300);
                }
            }
        }
    }

function TrainParry()
    {
       Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(mobile)
           {
           return Orion.Contains(mobile.Properties(), "a cat|a sheep")
           }).forEach(function(sheepcat)
               {
               var sheepcatSerial = sheepcat.Serial();
               Orion.Attack(sheepcatSerial)
               Orion.TargetSystemSerial(sheepcatSerial)
               Orion.Wait(10);
               });
       Orion.Wait(1000);
       Orion.WarMode(0);
    while(Orion.SkillValue('Parrying') < 1000)
        {
        while(Orion.ObjAtLayer('LeftHand'))
            {
            if(!Orion.BuffExists('healing skill') && (Player.Poisoned() || Player.Hits() < Player.MaxHits()))
                Orion.BandageSelf();
            Orion.Wait(1000);
            }
        while(!Orion.ObjAtLayer('LeftHand'))
            {
            var shield = Orion.FindTypeEx(any).filter(function(item)
                {
                return Orion.Contains(item.Properties(), 'shield')
                })[0];
            if(shield)
                Orion.Equip(shield.Serial());
            else
                return Orion.CharPrint(self,1159,'Out of shields! Halting...');
            Orion.Wait(1300);
            }
        }  
    }

function TrainChivalry() 
	{
	var skillCap = 750
    var skillLevel = Orion.SkillValue('Chivalry');
    while(skillLevel < skillCap) 
      	{
      	Orion.Wait(500);
        if(Player.Mana() < 30) 
          {
          while(Player.Mana() < Player.MaxMana()) 
              {
              Orion.Wait(1500);
              if(!Orion.BuffExists('Meditation')) 
                  Orion.UseSkill('Meditation');
              }
          }
        skillLevel = Orion.SkillValue('Chivalry');
        if(skillLevel < 150)
        	{
        	Orion.Print('Train skill at an NPC first!');
        	break;
        	}
        else if(skillLevel <= 450)
        	{
            Orion.Cast('Consecrate Weapon');
            Orion.Wait(300);
        	}
        else if(skillLevel <= 600) 
       		{
       		Orion.Cast('Divine Fury')
       		Orion.Wait(500);
       		}
        else if(skillLevel <= 700) 
       		{
       		Orion.Cast('Enemy of One')
       		Orion.Wait(500);
       		}
        else if(skillLevel <= 900) 
       		{
       		Orion.Cast('Holy Light')
       		Orion.Wait(750);
       		}
        else if(skillLevel < 1200) 
       		{
       		Orion.Cast('Noble Sacrifice')
       		Orion.Wait(500);
       		}
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Chivalry Finished");    	
	}

function TrainHealing() 
    {
    var skillCap = 1000;
    Orion.Print("Target the friend you'd like to heal");
    Orion.WaitForAddObject('myTarget');
    var target = Orion.FindObject('myTarget');
    while(Orion.SkillValue('Healing') < skillCap && !Player.Dead()) 
        {
        if(target && !Orion.BuffExists('healing skill') && target.Distance() <= 2 && (target.Poisoned() || target.Hits() < target.MaxHits()))
            {
            Orion.BandageTarget('myTarget');
            }
        Orion.Wait(500);
        }
    Orion.LogOut();
    }

function StatLocker()
    {
    var targetStr = 120;
    var targetDex = 120;
    var targetInt = 10;
    while(true)
        {
        if(Player.Str() == targetStr)
            Orion.SetStatStatus('str', 'Lock');
        if(Player.Dex() == targetDex)
            Orion.SetStatStatus('dex', 'Lock');
        if(Player.Int() == targetInt)
            Orion.SetStatStatus('int', 'Lock');
        Orion.Wait(500);
        }
    }

function StayLoggedIn()
	{
	while(!Player.Dead())
		{
		Orion.UseObject('backpack');
		Orion.Wait(60000);
		}
	}

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0);
		if(check)
            {
            Orion.HttpPost(bot, paramText);
            //Orion.PlayWav('Alarm09.wav');
            Orion.PauseScript('all', 'GMJournalScan');
            Orion.Wait(1000);
            Orion.StopWalking();
            Orion.OAOptionSet('AutoReconnect', '0');
            Orion.Wait(2000);
            }
		}
	}

function RecallBandieBuy()
    {
    RecallByGump('Main','Luna');
    var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the weaver') && !Orion.Contains(vendor.Properties(), 'guild');
        })[0];
    Orion.WalkTo(vendors.X(),vendors.Y());
    var shopnpcSerial = vendors.Serial();
    while(!Orion.FindType('0x0F9B')[0] || !Orion.FindType('0x0F9E')[0])
        {
        var shoplist = Orion.GetShopList('Cloth');
        var amount = (Player.MaxWeight() - Player.Weight() - 25)/5
        if(amount < 1)
            amount = 1;
        if(!Orion.FindType('0x0F9E')[0])
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount), new ShopListItem('0x0F9E', '0x0000', '', 1)];
        else
            var items = [new ShopListItem('0x0F9B', '0x0000', '', amount)];
        shoplist.SetItems(items);
        Orion.UpdateShopList(shoplist);
        Orion.BuyHook('Cloth');
        Orion.WaitContextMenuID(shopnpcSerial, 110);
        Orion.RequestContextMenu(shopnpcSerial);
        Orion.Wait(1300);
        }
    var scissors = Orion.FindType('0x0F9E')[0];
    var bolts = Orion.FindType('0x0F9B')[0];
    Orion.UseObject(scissors)
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(bolts);
    do
        {
        Orion.Wait(2000);
        var cloth = Orion.FindType('0x1766')[0];
        } while(!cloth)
    Orion.Wait(2000);
    Orion.UseObject(scissors);
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(cloth);
    do
        {
        Orion.Wait(2000);
        var bandies = Orion.FindType('0x0E21', any, ground)[0] || Orion.FindType('0x0E21')[0];
        } while(!bandies)
    while(Orion.FindType('0x0E21', any, ground)[0])
        {
        Orion.MoveItem(bandies);
        Orion.Wait(1300);
        }
    }

function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X();
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName;
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return false;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else
		var startInd = 75; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	var runebookSerial = runeBook[0].Serial();
    Orion.Wait(1300);
	Orion.UseObject(runebookSerial);
	var gump = WaitForSpecificGump(2000, 'generic', runebookSerial, '0x00000059');
	if(gump)
		{
		var runeInd = gump.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(rotateToggle && backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            var runeIndexNum = +runeIndex + 1 
	            if(runeIndexNum <= numRunes)
					runeIndex = String(runeIndexNum); 
	            else
					runeIndex = '1';
	            return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            });
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeIndex);
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	        {
	        Orion.Wait(2000);
            if(rotateToggle)
                {
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                }
	        return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle);
	}
    
function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}