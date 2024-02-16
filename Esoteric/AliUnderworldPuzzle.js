function testttt()
	{
	while(true)
		{
		Orion.Print(SelectedTile.Serial())
		Orion.Wait(100);
		}
	}

//make sure Sound Echo is checked on in the Main tab list of options on the left and your backpack is open.
//stand near a Corrupted Portal and start FullRun()
function FullRun()
	{
	Startup();
	
	EnterUnderworld();
	
	var key1 = Orion.FindType('0x1012')
	var gem = Orion.FindType('0x193F');
	if(!gem[0] && !key1[0])
		PickUpKey();
	
	var key2 = Orion.FindTypeEx('0x1013').filter(function(part)
				{
				return Orion.Contains(part.Name(), 'Partial')
				});
	gem = Orion.FindType('0x193F');
	if(!key2[0] && !gem[0])
		GridPuzzleEast();
	
	var key3 = Orion.FindTypeEx('0x1013').filter(function(part)
			{
			return Orion.Contains(part.Name(), 'A Puzzle Key')
			});
	gem = Orion.FindType('0x193F');
	if(!key3[0] && !gem[0])
		GridPuzzleWest();

    gem = Orion.FindType('0x193F');
	if(!gem[0])
		ColorPuzzle();
	
	HiddenDoor();
	
	ExperimentalRooms();
		
	Orion.Terminate('TimerGump');
	}

function Startup()
	{
	Orion.Exec('TimerGump', true);
	if(!Orion.GumpExists('container', 'backpack'))
		Orion.OpenContainer(backpack);
	var portal = Orion.FindType('0x468A', '0x0A29', ground, ' ', 2)
	if(portal[0])
		{
		Orion.Say('Dungeon Underworld');
		Orion.Wait(2000);
		}
	}

function EnterUnderworld()
	{
	RunTo(4195,3260);
	Orion.Wait(1000);
	}

function PickUpKey()
	{
	RunTo(1110,1152);
	var key = Orion.FindType('0x1012', any, ground)
	if(key[0])
		{
		Orion.UseObject(key[0]);
		Orion.Wait(500);
		if(Orion.WaitForGump(2000))
			{
			var gump0 = Orion.GetGump('last');
			if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x0000237C'))
				{
				gump0.Select(Orion.CreateGumpHook(1));
				Orion.Wait(100);
				}
			}
		}
	}

function GridPuzzleEast()
	{
	GridPuzzle(1103,1171);
	}

function GridPuzzleWest()
	{
	GridPuzzle(1091,1171);
	}


function GridPuzzle(x,y)
	{
	RunTo(x,y);
	Orion.Wait(1000);
	var box = Orion.FindType('0x0E80',any,ground,' ', 2);
	Orion.UseObject(box[0]);
	Orion.Wait(1100);
	var puzzleboard = Orion.FindTypeEx('0x2AAA');
	var solutionArr = [];
	var attemptsArr = [];
	Orion.UseObject(puzzleboard[0].Serial());
	Orion.Wait(1100);
	while(puzzleboard[0] && puzzleboard[0].Exists())
		{
		var choicesArr = ['right','down','left','up'];
		Heal(.6,false);
		if(solutionArr.length)
			{
			var lastSolution = solutionArr[solutionArr.length-1];
			var choiceSkip;
			switch(lastSolution)
				{
				case 'right':
					choiceSkip = 'left';
					break;
				case 'down':
					choiceSkip = 'up';
					break;
				case 'left':
					choiceSkip = 'right';
					break;
				case 'up':
					choiceSkip = 'down';
					break;
				default:
					break;
				}
			choicesArr = choicesArr.filter(function(part)
						{
						return part != choiceSkip
						}); 
			}
		choicesArr = choicesArr.filter(function(part)
					{
					return attemptsArr.indexOf(part) == -1
					});
		puzzleboxControl(choicesArr[0]);
		var check = Orion.WaitJournal('id=0x01F4|generator', Orion.Now()-500, Orion.Now()+500);
		if(check)
			{
			var checkarr = Orion.Split(check.Text(), ' ');
			for(i = 0;i<checkarr.length;i++)
				{
				switch(checkarr[i])
					{
					case 'id=0x01F4':
						solutionArr.push(choicesArr[0]);
						attemptsArr = [];
						break;
					case 'generator':
						attemptsArr.push(choicesArr[0]);
						Orion.Wait(1100);
						Orion.UseObject(puzzleboard[0].Serial());
						Orion.Wait(1100);
						if(solutionArr.length)
							{
							for(var i=0;i<solutionArr.length;i++)
								{
								puzzleboxControl(solutionArr[i]);
								}
							}
						break;		
					default:
						break;
					}
				}
			}
		else
			{
			attemptsArr.push(choicesArr[0]);
			}
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	}

function puzzleboxControl(direction)
	{
	var dir;
	switch(direction)
		{
		case 'up':
			dir = 1;
			break;
		case 'right':
			dir = 2;
			break;
		case 'down':
			dir = 3;
			break;
		case 'left':
			dir = 4;
			break;
		default:
			break;
		}
	if (Orion.WaitForGump(1000))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002710'))
			{
				gump0.Select(Orion.CreateGumpHook(dir));
				Orion.Wait(300);
			}
		}
	}

function ColorPuzzle()
    {
    RunTo(1097,1164);
	Orion.Wait(1000);
    var box = Orion.FindType('0x09A8',any,ground,' ', 2);
	Orion.UseObject(box[0]);
	Orion.Wait(1100);
    var phase = 1;
    var button = 6249;
    var puzzleboard = Orion.FindTypeEx('0x2AAA');
    while(puzzleboard[0] && puzzleboard[0].Exists() && phase < 6)
        {
        Heal(.6,false);
        Orion.UseObject(puzzleboard[0].Serial());
        var checkmark = '9' + phase;
        if(Orion.WaitForGump(1000))
            {
            var gump0 = Orion.GetGump('last');
            if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x0000012A'))
                {
                var gumpHook0 = Orion.CreateGumpHook(button++)
                gumpHook0.AddCheck(checkmark, true);
                gump0.Select(gumpHook0);
                Orion.Wait(250);
                }
            }
        if(Orion.WaitForGump(1000))
            {
            var gump1 = Orion.GetGump('last');
            if((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x0000012A'))
                {
                gump1.Select(Orion.CreateGumpHook(89));
                Orion.Wait(250);
                }
            }
        if(Orion.WaitForGump(1000))
            {
            var gump2 = Orion.GetGump('last');
            if((gump2 !== null) && (!gump2.Replayed()) && (gump2.ID() === '0x0000012C'))
                {
                var checktext = gump2.Text(0);
                Orion.Print(checktext + '/5');
                gump2.Select(Orion.CreateGumpHook(0));
                if(checktext == phase)
                    {
                    phase++;
                    button = 6249;
                    }
                Orion.Wait(250);
                }
            }
        Orion.Wait(1100);
        }
    Heal();
    Orion.Wait(1000);
    }

function HiddenDoor()
	{
	if(Orion.SkillValue('Magery') >= 900)
		Orion.Cast('Invisibility');
	RunTo(1008,1119);
	if(Orion.HaveTarget())
		Orion.TargetObject(self);
	var wall = Orion.FindType('0x0057',any,ground,' ', 2);
	Orion.UseObject(wall[0]);
	Orion.Wait(3000);
	}

function ExperimentalRooms()
	{
	RunTo(984,1118);
	Orion.Wait(1000);
	if(Orion.SkillValue('Magery') >= 900)
		{
		Orion.Cast('Invisibility');
		Orion.WaitForTarget(3000);
		Orion.TargetObject(self);
		Orion.Wait(1000);
		}
	var gem = Orion.FindType('0x193F');
	Orion.UseObject(gem[0]);
	if(Orion.WaitForGump(2000))
		{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x0000237D'))
			{
			gump0.Select(Orion.CreateGumpHook(1));
			Orion.Wait(100);
			}
		}
	Orion.Wait(1000);
	Orion.Step('n');
	Orion.Wait(1000);
	Room1();
	Room2();
	Room3();
	Orion.WalkTo(984,1066,0,0)
	Orion.Wait(1100);
	var gem = Orion.FindType('0x193F');
	var box = Orion.FindType('0x09A8', any, ground, ' ', 2);
	Orion.Wait(1100);
	Orion.UseObject(box[0]);
	Orion.Wait(1100);
	Orion.UseObject(box[0]);
	Heal();
	}
	
function Room1(_)
	{
	var msg = 'Freezing|Blazing|Cold|Warm';
	var freezingTile = Orion.GetTiles('land',988,1110)[0];
	var blazingTile = Orion.GetTiles('land',980,1110)[0];
	var coldTile = Orion.GetTiles('land',980,1107)[0];
	var warmTile = Orion.GetTiles('land',988,1107)[0];
	var gem = Orion.FindTypeEx('0x193F');
	Orion.WalkTo(984 + Orion.Random(-1,2),1108 + Orion.Random(-1,2),0,0);
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'Freezing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(blazingTile.X() + Orion.Random(-1,2),blazingTile.Y() + Orion.Random(-1,2),0,0);
					break;
				case 'Blazing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(freezingTile.X() + Orion.Random(-1,2),freezingTile.Y() + Orion.Random(-1,2),0,0);
					break;		
				case 'Cold':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(warmTile.X() + Orion.Random(-1,2),warmTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				case 'Warm':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(coldTile.X() + Orion.Random(-1,2),coldTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				default:
					break;
				}
			}
		while(gem[0].Color() != 0x0838)
			{
			Orion.Wait(200);
			}
		if(Orion.InJournal('The next room has been unlocked!', 'my', 0, any, Orion.Now()-1000, Orion.Now()+1000))
			return;
		Orion.WalkTo(984 + Orion.Random(-1,2),1108 + Orion.Random(-1,2),0,0);
		}
	}
	
function Room2(_)
	{
	var msg = 'Freezing|Blazing|Cold|Warm|Poison|Cure'
	var freezingTile = Orion.GetTiles('land',981,1096)[0];
	var blazingTile = Orion.GetTiles('land',987,1093)[0];
	var coldTile = Orion.GetTiles('land',981,1093)[0];
	var warmTile = Orion.GetTiles('land',987,1099)[0];
	var poisonTile = Orion.GetTiles('land',987,1096)[0];
	var cureTile = Orion.GetTiles('land',981,1099)[0];
	var gem = Orion.FindTypeEx('0x193F');
	Orion.WalkTo(984 + Orion.Random(-1,2),1096 + Orion.Random(-1,2),0,0);
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, 'my');
		var checkarr = Orion.Split(check.Text(), ' ')
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'Freezing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(blazingTile.X() + Orion.Random(-1,2),blazingTile.Y() + Orion.Random(-1,2),0,0);
					break;
				case 'Blazing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(freezingTile.X() + Orion.Random(-1,2),freezingTile.Y() + Orion.Random(-1,2),0,0);
					break;		
				case 'Cold':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(warmTile.X() + Orion.Random(-1,2),warmTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				case 'Warm':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(coldTile.X() + Orion.Random(-1,2),coldTile.Y() + Orion.Random(-1,2),0,0);
					break;
				case 'Poison':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(cureTile.X() + Orion.Random(-1,2),cureTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				case 'Cure':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(poisonTile.X() + Orion.Random(-1,2),poisonTile.Y() + Orion.Random(-1,2),0,0);
					break;		
				default:
					break;
				}
			}
		while(gem[0].Color() != 0x0838)
			{
			Orion.Wait(200);
			}
		if(Orion.InJournal('The next room has been unlocked!', 'my', 0, any, Orion.Now()-1000, Orion.Now()+1000))
			return;
		Orion.WalkTo(984 + Orion.Random(-1,2),1096 + Orion.Random(-1,2),0,0);
		}
	}
	
function Room3(_)
	{
	var msg = 'Freezing|Blazing|Cold|Warm|Poison|Cure'
	var freezingTile = Orion.GetTiles('land',987,1080)[0];
	var blazingTile = Orion.GetTiles('land',978,1077)[0];
	var coldTile = Orion.GetTiles('land',981,1077)[0];
	var warmTile = Orion.GetTiles('land',990, 1080)[0];
	var lpoisonTile = Orion.GetTiles('land',990, 1077)[0];
	var gpoisonTile = Orion.GetTiles('land',978,1080)[0];
	var lcureTile = Orion.GetTiles('land',981,1080)[0];
	var gcureTile = Orion.GetTiles('land',987,1077)[0];
	var gem = Orion.FindTypeEx('0x193F');
	Orion.WalkTo(984 + Orion.Random(-1,2),1079 + Orion.Random(-1,2),0,0);
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, 'my');
		var checkarr = Orion.Split(check.Text(), ' ')
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{
				case 'Freezing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(blazingTile.X() + Orion.Random(-1,2),blazingTile.Y() + Orion.Random(-1,2),0,0);
					break;
				case 'Blazing':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(freezingTile.X() + Orion.Random(-1,2),freezingTile.Y() + Orion.Random(-1,2),0,0);
					break;		
				case 'Cold':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(warmTile.X() + Orion.Random(-1,2),warmTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				case 'Warm':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(coldTile.X() + Orion.Random(-1,2),coldTile.Y() + Orion.Random(-1,2),0,0);
					break;
				case 'Lesser':
					if(checkarr[i+1] == 'Poison')
						{
						Orion.Wait(100 * Orion.Random(3,6));
						Orion.WalkTo(lcureTile.X() + Orion.Random(-1,2),lcureTile.Y() + Orion.Random(-1,2),0,0);
						}
					else
						{
						Orion.Wait(100 * Orion.Random(3,6));
						Orion.WalkTo(lpoisonTile.X() + Orion.Random(-1,2),lpoisonTile.Y() + Orion.Random(-1,2),0,0);
						}
					break;	
				case 'Greater':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(gpoisonTile.X() + Orion.Random(-1,2),gpoisonTile.Y() + Orion.Random(-1,2),0,0);
					break;	
				case 'Lethal':
					Orion.Wait(100 * Orion.Random(3,6));
					Orion.WalkTo(gcureTile.X() + Orion.Random(-1,2),gcureTile.Y() + Orion.Random(-1,2),0,0);
					break;		
				default:
					break;
				}
			}
		while(gem[0].Color() != 0x0838)
			{
			Orion.Wait(200);
			}
		if(Orion.InJournal('Congratulations!!', 'sys', 0, any, Orion.Now()-1000, Orion.Now()+1000))
			return;
		Orion.WalkTo(984 + Orion.Random(-1,2),1079 + Orion.Random(-1,2),0,0);
		}
	}

function Healtest()
	{
	Heal(.5);
	}

function Heal(threshold,poisoncheck)
	{
	if(threshold === undefined)
		threshold = 1
	if(poisoncheck === undefined)
		poisoncheck = true
	var hitRatio = Player.Hits()/Player.MaxHits()
	if(hitRatio < threshold || (Player.Poisoned() && poisoncheck))
		{
		while(hitRatio < 1 || (Player.Poisoned() && poisoncheck))
			{
			if(Orion.SkillValue('Bushido') >= 900 && !Orion.BuffExists('Confidence'))
				Orion.Cast('Confidence');
			if(Orion.SkillValue('Magery') >= 900)
				{
				if(Player.Poisoned())
					Orion.Cast('Cure');
				else
					Orion.Cast('Greater Heal');
				Orion.WaitForTarget(2000);
				Orion.TargetObject(self);
				Orion.Wait(200);
				}
			else if(Orion.SkillValue('Healing') >= 900)
				{
				if(!Orion.BuffExists('Healing Skill'))
					Orion.BandageSelf();
				Orion.Wait(200);
				}
			else if(Orion.SkillValue('Chivalry') >= 500)
				{
				if(Player.Poisoned())
					Orion.Cast('Cleanse by Fire');
				else
					Orion.Cast('Close Wounds');
				Orion.WaitForTarget(4000);
				Orion.TargetObject(self);
				Orion.Wait(200);
				}
			hitRatio = Player.Hits()/Player.MaxHits()	
			}
		}
	return;
	}

function RunTo(x,y)
	{
	if(Orion.WalkTo(x, y, 0, 0, 255, 1, 1))
		{
		Orion.Wait(10);
		}
	else
		{
		if(Orion.GetDistance(x,y) < 300)
			RunTo(x,y);
		}
	}

function TimerGump()
    {
    var startTime = Orion.Now();
    while(true)
        {
        var time = TimeDiff(startTime, Orion.Now());

        var gump = Orion.CreateCustomGump(11001);
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, 155, 40);
        gump.AddText(10, 10, "0",'Time Elapsed: ');
        gump.AddText(90, 10, "0", time);
        gump.Update();
        Orion.Wait(1000);
        }
    }
function TimeDiff(startTimeMS,endTimeMS)
    {
    var sec = ((endTimeMS - startTimeMS)/1000).toFixed(0);
    var min = Math.floor(sec/60);
    var hour = Math.floor(min/60);
    var time = ('0' + hour).slice(-2) + ':' + ('0' + (min - (60*hour))).slice(-2) + ':' + ('0' + (sec - (60*min))).slice(-2); //format 00:00:00
    return time;
    }