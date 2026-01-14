function SeedGump()
	{
    var gump;
    var starttime = Orion.Now();
    var numseeds = 0;
    var attempts = 0;
    var successes = 0;
    var scanmessage = 'reach into|successfully';
    while(!Player.Dead())
        {
        var currenttime = ((Orion.Now() - starttime) / 1000) / 60;
        var startseeds = Orion.Count(0x1727)
        // var successrate = successes / attempts;
        // var seedrate = numseeds / attempts
        // Orion.Print('Minutes: ' + currenttime.toFixed(2) + ' Attempts: ' + t + '  Successes: ' + s + ' Seeds: ' + numseeds);
        // Orion.Print('Success Rate: ' + successrate.toFixed(2) + ' Seed Rate: ' + seedrate.toFixed(2));
        var check = Orion.WaitJournal(scanmessage, Orion.Now(), Orion.Now()+5000, ' ');
        if(check)
            {
            var checkarr = Orion.Split(check.Text(), ' ')
            for(i = 0;i<checkarr.length;i++)
                {
                switch(checkarr[i])
                    {
                    case 'reach':
                        attempts++;
                        break;
                    case 'successfully':
                        attempts++;
                        successes++;
                        break;
                    default:
                        break;
                    }
                }
            }
        if(Orion.Count(0x1727) > startseeds)
            numseeds++
        var seedsperhour = numseeds / ((currenttime.toFixed(0) / 60).toFixed(2))
		var gump = Orion.CreateCustomGump(11001);
        gump.Clear();
        gump.SetX(-10);
        gump.SetY(130);
        gump.AddResizepic(0, 0, 0xBB8, 150, 140);
        gump.AddText(15, 15, "0",'Minutes: ');
        gump.AddText(100, 15, "0",currenttime.toFixed(2));
        gump.AddText(15, 30, "0",'Attempts: ');
        gump.AddText(100, 30, "0",attempts);
        gump.AddText(15, 45, "0",'Successes: ');
        gump.AddText(100, 45, "0",successes);
        gump.AddText(15, 60, "0",'Success Rate: ');
        gump.AddText(100, 60, "0",(successes / attempts).toFixed(2));
        gump.AddText(15, 75, "0",'Seeds: ');
        gump.AddText(100, 75, "0",numseeds);
        gump.AddText(15, 90, "0",'Seed Rate: ');
        gump.AddText(100, 90, "0",(numseeds / successes).toFixed(2));
        gump.AddText(15, 105, "0",'Seeds/hr: ');
        gump.AddText(100, 105, "0",seedsperhour.toFixed(0));
        gump.Update();
        }
    }

//function Autostart()
	//{
	//Orion.Wait(1500);
	//Orion.Exec('GMJournalScan', true);
	//}
// kirin graphic 0x0084
function OrganizeStealList(itemSerial)
	{
	if(itemSerial ==- undefined)
		{
		Orion.CharPrint(self, 1159, 'Select target container');
		Orion.WaitForAddObject('myTarget');
		var container = Orion.GetSerial('myTarget');
		}
	else
		var container = itemSerial;
	var item = Orion.FindType('0x1F13')[0];
	while(item)
		{
		Orion.MoveItem(item, 0, container);
		Orion.Wait(1200);
		item = Orion.FindType('0x1F13')[0];
		}
	}

function initScripts()
	{
	Orion.Exec('SeedOfLifeWander', true);
	Orion.Exec('GMJournalScan', true);
	Orion.Exec('SeedGump', true);
	Orion.Exec('Preservation', true);
	}

function termScripts()
	{
	Orion.Terminate('all', 'GMJournalScan');
	}

function Trash()
	{
	Orion.Terminate('all', 'Trash|GMJournalScan');
	var rune = Orion.FindTypeEx(0x22C5).filter(function(part)
		{
		return Orion.Contains(part.Properties(), 'Trash')
		});
	if(!rune.length)
		{
		Orion.CharPrint(self, 40, "Set your runebook or rune name to 'Trash' and restart script")
		return;
		}
	RecallRune(rune[0].Serial());
	Orion.Wait(1000);
	var trashBarrel = Orion.FindType('0x0E7C|0x0E40', '0x0A27|0x0064', ground, 'item', 2)[0];
	if(trashBarrel)
		OrganizeStealList(trashBarrel);
	Orion.Wait(1000);
	Orion.Exec('WalkThroughSprirituality', true);
	}

function WalkThroughSprirituality()
	{
	Orion.Terminate('all', 'WalkThroughSprirituality');
	var rune = Orion.FindTypeEx(0x22C5).filter(function(part)
		{
		return Orion.Contains(part.Properties(), 'Jaw')
		});
	if(!rune.length)
		{
		Orion.CharPrint(self, 40, "Set your runebook or rune name to 'Jaw' and restart script")
		return;
		}
	RecallRune(rune[0].Serial());
	Orion.Wait(1000);
	var jaw = Orion.FindTypeEx('0x9F74', any, ground, 'item|near', 24);
	if(jaw.length && Orion.WalkTo(jaw[0].X(),jaw[0].Y()))
		Orion.UseObject(jaw[0].Serial());
	if(Orion.WaitForGump(1000))
		{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000023FD'))
			{
			gump0.Select(Orion.CreateGumpHook(4));
			Orion.Wait(100);
			}
		}
	Orion.Wait(1000);
	Orion.Exec('initScripts', true);
	}

function RecallRune(runeItem, runeItem2)
	{
	var x = Player.X();
	var y = Player.Y();
	if (Orion.SkillValue('Magery') >= 600)
		var spell = 'Recall';
	else
		var spell = 'Sacred Journey';
	Orion.Cast(spell)
	if(Orion.WaitForTarget(5000))
		Orion.TargetObject(runeItem);
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
    while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
        {
        if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal) && runeItem2)
            {
            Orion.Wait(2000);
			return RecallRune(runeItem2);
            }
        Orion.Wait(500);
        }
	Orion.Wait(1500);
	Orion.Resend();
	Orion.Wait(500);
	if(x == Player.X() && y == Player.Y())
		return RecallRune(runeItem, runeItem2);
	}

function regroup()
	{
	Orion.Terminate('all', 'regroup');
	Orion.WalkTo(1567,1047);
	var beetle = Orion.FindTypeEx(0x0317, any, ground, 'mobile', 24);
	if(beetle[0] && Orion.WalkTo(beetle[0].X(), beetle[0].Y(), beetle[0].Z()))
		{
		var item = Orion.FindType('0x1727|0x1848|0x1C18')[0];
		while(item)
			{
			Orion.MoveItem(item, 0, beetle[0].Serial());
			Orion.Wait(1200);
			item = Orion.FindType('0x1727|0x1848|0x1C18')[0];
			}
		}
	}

function Preservation()
    {
    while(!Player.Dead())
        {
        var enemy = Orion.FindTypeEx(any, any, ground, 'ignoreself|fast|mobile', 10).filter(function(part)
			{
			return Orion.Contains(part.Name(), 'skeleton|harpy');
			});
        if(Player.Hits('%') < 60)
        	{
        	Orion.PauseScript('all', 'Preservation|GMJournalScan')
        	Orion.WalkTo(1528,1321);
        	Orion.Cast('Greater Heal');
            Orion.WaitForTarget(4000);
            Orion.TargetObject(self);
        	Orion.Wait(30000);
        	Orion.ResumeScript('all')
        	}
        else if(Player.Poisoned())
            {
            Orion.Cast('Cure');
            Orion.WaitForTarget(4000);
            Orion.TargetObject(self);
            Orion.Wait(1000);
            }
        else if(Player.Hits() < Player.MaxHits() - 15)
            {
            var NA = Orion.FindTypeEx(any, any, ground, 'ignoreself|fast|live', 4);
            if(NA.length && NA[0].Exists())
                {
                StayAway(NA[0].Serial(), 15);
                Orion.Wait(200);
                }
            Orion.Cast('Greater Heal');
            Orion.WaitForTarget(4000);
            Orion.TargetObject(self);
            Orion.Wait(1000);
            }
        else if(enemy.length)
            {
            Orion.PauseScript('all', 'Preservation|GMJournalScan')
			StayAway(enemy[0].Serial(), 8);
		    Orion.Cast('Flame Strike');
		    StayAway(enemy[0].Serial(), 8);
		    Orion.WaitForTarget(4000);
		    Orion.TargetObject(enemy[0].Serial());
		    Orion.Wait(3000);
		    Orion.ResumeScript('all')
            }
        else
        	Orion.Wait(500);
        }
    }

function SeedOfLifeWander()
	{
 	var locArr =
		[
			[1610, 1080],
			[1675, 1080],
			[1610, 1128],
			[1675, 1128],
			[1630, 1145],
			[1600, 1135]
		];

 	var deathcycle;
 	var ignorecycle = Orion.Now();
    var loc = 0;
    while(!Player.Dead())
        {
        if(Orion.Now() >= ignorecycle + 5000)
            {
            Orion.IgnoreReset();
            Orion.Print('ignores reset');
            ignorecycle = Orion.Now();
            }
        var mobs = Orion.FindTypeEx('-1', '0x0455', ground, 'live|mobile', 24, 'gray|ignorefriends|criminal' );
        if(mobs.length)
        	var mob = mobs[Orion.Random(0,mobs.length)]
        if(mob && !Orion.DisplayTimerExists('stealtimer') && Orion.WalkTo(mob.X(), mob.Y(), mob.Z(),0,100,1,1,10000))
            {
            Orion.Cast('Recall');
            var castcheck = Orion.WaitJournal('cannot teleport', Orion.Now(), Orion.Now() + 400, 'sys');
            if(!castcheck)
                {
                Orion.InterruptCast();
                Orion.Wait(300);
                while(mob.Exists() && !Player.Dead())
                    {
                    Orion.Cast('Mind Blast');
                    Orion.WaitForTarget(4000);
                    Orion.TargetObject(mob.Serial());
                    Orion.Wait(2000);
                    }
                }
            deathcycle = Orion.Now();
            while(mob.Exists() && !Player.Dead())
                {
                if(!Orion.DisplayTimerExists('stealtimer') && Orion.WalkTo(mob.X(), mob.Y(), mob.Z(),0,100,1,1,10000))
                    {
                    Orion.Cast('Recall');
		            var castcheck = Orion.WaitJournal('cannot teleport', Orion.Now(), Orion.Now() + 400, 'sys');
		            if(!castcheck)
		                {
		                Orion.InterruptCast();
		                Orion.Wait(300);
		                while(mob.Exists())
		                    {
		                    Orion.Cast('Mind Blast');
		                    Orion.WaitForTarget(4000);
		                    Orion.TargetObject(mob.Serial());
		                    Orion.Wait(2000);
		                    }
		                break;
		                }
                    Orion.UseSkill('Stealing');
                    Orion.WaitForTarget(2000);
                    Orion.TargetObject(mob.Serial());
                   	Orion.AddDisplayTimer('stealtimer', 11000, 'AboveChar', 'Circle|bar', 'Steal', 0, 0, 'any', -1, '0x00FF00FE');
                    Orion.Wait(1000);
                    if(Orion.Now() > deathcycle + 120000 || Orion.InJournal('successfully steal|already been stolen', ' ', 0, any, Orion.Now()-3000, Orion.Now()+3000))
                        {
                        while(mob.Exists())
                            {
                            Orion.Cast('Mind Blast');
                            Orion.WaitForTarget(4000);
                            Orion.TargetObject(mob.Serial());
                            Orion.Wait(2000);
                            }
                        }
                    }
                else if(Orion.DisplayTimerExists('stealtimer'))
                    {
                    Orion.WalkTo(mob.X(), mob.Y(), mob.Z(),0,100,1,1,10000)
					Orion.Wait(100);
                    Consolidate();
                    }
                else
                    {
                    Orion.Print('temporary ignore: ' + mobs[0].Name());
                    Orion.Ignore(mob.Serial());
                    Orion.Wait(100);
                    }
                }
            }
        else if(Orion.DisplayTimerExists('stealtimer'))
			Consolidate();
		else
            {
            if(loc >= locArr.length)
                loc = 0;
            var locCurrX = locArr[loc][0];
            var locCurrY = locArr[loc][1];
            Orion.WalkTo(locCurrX, locCurrY, 0, 1, 255, 1)
            Orion.Wait(100);
            loc++;
            }
        Orion.Wait(1000);
        }
    }

function Consolidate()
	{
	var consolidate1 = Orion.FindType('0x1727');
	while(consolidate1[1] && Orion.DisplayTimerExists('stealtimer'))
		{
		Orion.MoveItem(consolidate1[0], 0, backpack);
		Orion.Wait(1100);
		consolidate1 = Orion.FindType('0x1727');
		}
	var consolidate2 = Orion.FindType('0x1C18');
	while(consolidate2[1] && Orion.DisplayTimerExists('stealtimer'))
		{
		Orion.MoveItem(consolidate2[0], 0, backpack);
		Orion.Wait(1100);
		consolidate2 = Orion.FindType('0x1C18');
		}
	var consolidate3 = Orion.FindType('0x1848');
	while(consolidate3[1] && Orion.DisplayTimerExists('stealtimer'))
		{
		Orion.MoveItem(consolidate3[0], 0, backpack);
		Orion.Wait(1100);
		consolidate3 = Orion.FindType('0x1848');
		}
	var drop = Orion.FindType('0x0EFD|0x0EFC|0x1847|0x0EFB|0x0FFB')[0];
	while(drop && Orion.DisplayTimerExists('stealtimer'))
		{
		Orion.Wait(500);
		Orion.DragItem(drop);
		Orion.Wait(200);
		Orion.DropDraggedItemRelative(1, 1);
		Orion.Wait(500);
		drop = Orion.FindType('0x0EFD|0x0EFC|0x1847|0x0EFB|0x0FFB')[0];
		}
	}

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '' //hook
        + "/"
        + ''; //key
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