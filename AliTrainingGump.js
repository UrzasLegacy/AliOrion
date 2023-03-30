var pageArr= 
    [ //'skillName','functionName','instructionString'
        ['General', "Hello! Welcome to my skill trainer!\nOn the right you will see a text input box for 'Target Value', this is where you'll put how high you want to train the skill.\nNext, select the skill you would like to train in the 'Current Skill' dropdown list."],
        //['Alchemy'],
        //['Anatomy'],
        //['Animal Lore'],
        //['Animal Taming'],
        //['Archery'],
        //['Arms Lore',],
        //['Begging'],
        //['Blacksmithy'],
        //['Bowcraft/Fletching'],
        //['Bushido'],
        //['Camping'],
        //['Carpentry'],
        ['Chivalry',"0-30: Buy from NPC\n30.1-45: Consecrate Weapon (Must have a weapon equipped!)\n45.1-60: Divine Fury\n60.1-70: Enemy of One\n70.1-90: Holy Light\n90.1-120: Noble Sacrifice (Stand away from other players/NPCs!)\n\nTips:\nMaximizing Mana Regeneration on your equipment will help immensely.\nBe sure to also have 40 Lower Mana Cost and wear medable gear to take advantage of the Meditation skill.\nLower Reagent Cost does affect Tithing points spent per cast, so 100% is useful"],
        //['Cooking'],
        //['Detecting Hidden'],
        //['Discordance'],
        //['Eval Int'],
        //['Fencing'],
        //['Fishing'],
        //['Focus'],
        //['Forensic Evaluation'],
        ['Healing'],
        //['Herding'],
        ['Hiding'],
        //['Imbuing'],
        //['Inscription'],
        //['Item Identification'],
        //['Lockpicking'],
        //['Lumberjacking'],
        //['Mace Fighting'],
        ['Magery'],
        //['Meditation'],
        //['Mining'],
        //['Musicianship'],
        ['Mysticism'],
        ['Necromancy'],
        ['Ninjitsu'],
        //['Parrying'],
        //['Peacemaking'],
        //['Poisoning'],
        //['Provocation'],
        //['Remove Trap'],
        //['Resisting Spells'],
        //['Snooping'],
        //['Spellweaving'],
        //['Spirit Speak'],
        //['Stealing'],
        ['Stealth'],
        //['Swordsmanship'],
        //['Tactics'],
        //['Tailoring'],
        //['Taste Identification'],
        //['Throwing'],
        //['Tinkering'],
        ['Tracking'],
        //['Veterinary'],
        //['Wrestling'],
    ]

var buttonGraphic = ['0x2EE3','0x2EE3','0x2EE4']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
function TrainingGump(reset)
	{
    if(!reset)
        {
        Shared.AddVar('currentIndex', 0);
        Shared.AddVar('targetValue',1000);
        Shared.RemoveVar('currentSkill')
        Shared.RemoveVar('startTime');
        Shared.RemoveVar('lastGainMS');
        Shared.RemoveVar('startTime');
        Shared.RemoveVar('startValue');
        Shared.RemoveVar('pauseTime');
        BackgroundRenderer(0);
        }
	while(true)
		{
		var currentSkill = Shared.GetVar('currentSkill',false);
		while(currentSkill)// && Orion.ScriptRunning('Train' + currentSkill) > 0)
			{
            FastRenderer(currentSkill);
			Orion.Wait(1000);
			}
		Orion.Wait(1000);
		}
	}

function FastRenderer(currentSkill)
    {
    //In order to avoid updating assets that don't need to be updated, I pass off a bit of the rendering to a smaller function just for updating frequently changing assets.
    //If you update, for example, a dropdown list while a user is currently interacting with it, it will interrupt what they're doing and lead to a bad user experience :(
    //I assigned an index number to each asset so that they overwrite themselves, insteading of using gump.Clear() which would clear the entire gump.
    var gump = Orion.CreateCustomGump(10420); //I've found that creating the gump in the global scope causes problems and trying to save a gump object in Shared crashes Orion lol, just use CreateCustomGump with the same serial to fetch the gump each time
    
    var startTime = Shared.GetVar('startTime',false)
    var status = Orion.ScriptRunning('Train' + currentSkill)
	if(status > 0)
		{
		status = 'Running';
		var color = 64;
		}
	else if(status == 0)
		{
		status = 'Stopped';
		var color = 32;
		}
	else if(status < 0)
		{
		status = 'Paused';
		var color = 52;
		}
    var currentValue = Orion.SkillValue(currentSkill);
    if(currentValue > Shared.GetVar('lastValue',1201))
        Shared.AddVar('lastGainMS',Orion.Now())
    Shared.AddVar('lastValue',currentValue);

    var lastGainMS = Shared.GetVar('lastGainMS',false)
    if(lastGainMS)
        {
        var pauseTime = Shared.GetVar('pauseTime');
        if(pauseTime)
            {
            var pauseInterval = Orion.Now() - pauseTime;
            var newLastGainMS = lastGainMS + pauseInterval;
            Shared.AddVar('lastGainMS',newLastGainMS)
            lastGainMS = newLastGainMS;
            }
        ms = Orion.Now() - lastGainMS;
		date = new Date(ms);
		var timeSinceLastGain = date.toISOString().substring(11, 19);
        }
    else
        var timeSinceLastGain = '00:00:00';

    var startValue = Shared.GetVar('startValue',currentValue);
	var statPosX = 370;
	var statPosY = 180;
    if(startTime)
        {
        var pauseTime = Shared.GetVar('pauseTime');
        if(pauseTime)
            {
            var pauseInterval = Orion.Now() - pauseTime;
            var newStartTime = startTime + pauseInterval;
            Shared.AddVar('startTime',newStartTime)
            startTime = newStartTime;
            Shared.RemoveVar('pauseTime');
            }
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        }
    else
        var time = '00:00:00'
    gump.AddText(statPosX + 90,statPosY,553,time,90,50);
	gump.AddText(statPosX + 90,statPosY + 20,553,(startValue/10).toFixed(1),90,51);
	gump.AddText(statPosX + 90,statPosY + 40,553,(currentValue/10).toFixed(1),90,52);
	gump.AddText(statPosX + 90,statPosY + 60,553,((currentValue - startValue)/10).toFixed(1),90,53);
	gump.AddText(statPosX + 90,statPosY + 80,553,timeSinceLastGain,90,54);
	
	gump.AddButton(3, statPosX, statPosY + 120, 30533, 30533, 30533, '0x0000');
	gump.AddText(statPosX + 90,statPosY + 120,color,status,90,55);
    gump.Update();
    }

function BackgroundRenderer(index)
    {
    //This function does the bulk of the work rendering the main assets of the gump, specifically those assets that are only seldom updated
    var currentArr = pageArr[index];
    var skill = currentArr[0];
    var instructions = currentArr[1] || 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ';
    var width = 550;
    var height = 400;
    
    
    //Main background
    var gump = Orion.CreateCustomGump(10420);
    gump.Clear();
    gump.SetCallback('TrainingGumpCallback');
    gump.SetNoClose(true);
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0);
    gump.AddText(218,10,554,"Ali's MultiSkill Trainer");

	//Instructions Panel
    var htmlWidth = 330;
    var htmlHeight = 330;
    gump.AddResizepic(20, 40, '0xBB8', htmlWidth, htmlHeight); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddHtmlGump(3, 30 ,40,htmlWidth - 10,htmlHeight,'0xBB8',0,1) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump',3);
    gump.AddHtmlText('doesnt matter what', 'i put here', htmlWidth - 20,htmlHeight, 0, "<left><h2>" + skill + " Instructions:</h2>\n\n" + instructions + "</left>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');

	//Target Value Input
    var textInputPostX = 395;
    var textInputPostY = 100;
    gump.AddResizepic(textInputPostX, textInputPostY , '0x0BB8', 100, 19);
	gump.AddTextEntry(100, textInputPostX + 5, textInputPostY - 1, 1159, Shared.GetVar('targetValue','1000'), 100, 20);
	gump.AddText(textInputPostX,textInputPostY - 18,554,'Target Value:');
	gump.AddText(textInputPostX,textInputPostY + 18,554,'(1000 = 100.0)');
	gump.AddColoredPolygone(textInputPostX, textInputPostY, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
	gump.AddTooltip('Update');

	//Skills List Dropdown
    var comboPosX = 383;
    var comboPosY = 50;
    var comboPosWidth = 125;
    var currentSkill = Shared.GetVar('currentSkill',false);
	Orion.Print(currentSkill)
    gump.AddComboBox(200, comboPosX, comboPosY, '0x0BB8', 0, '0x0BB8', comboPosWidth, -3,10);
    for(var j=1;j<pageArr.length;j++)
        gump.AddComboBoxText(pageArr[j][0],0,currentSkill === pageArr[j][0] ? 1 : 0,comboPosWidth,'center');
    gump.AddText(comboPosX,comboPosY - 18,554,'Select Skill:');
    gump.AddColoredPolygone(comboPosX, comboPosY, comboPosWidth - 1, 19, '#FF666600', 1, 2, 0, 0, 0);
    gump.AddButton(300, comboPosX + comboPosWidth - 20, comboPosY + 1, '0x16CF', '0x16D0', '0x16D0', '0x0000');
    gump.AddButton(0, 525, 10, 22150, 22151, 22152, '0x0000'); //close
    gump.AddButton(1, 370, 350, 2119, 2121, 2120, '0x0000'); //stop
    gump.AddButton(2, 460, 350, 2111, 2113, 2112, '0x0000'); //start
    gump.AddButton(4, 505, 10, 22153, 22154, 22155, '0x0000'); //help


	var startTime = Shared.GetVar('startTime',false)
	if(startTime)
		{
		var ms = Orion.Now() - startTime;
		var date = new Date(ms);
		var time = date.toISOString().substring(11, 19);
		}
	else
		var time = '00:00:00'
	
	if(currentSkill)
		{
		var currentValue = Orion.SkillValue(currentSkill);
		var startValue = Shared.GetVar('startValue',currentValue);
		var skillStr = currentSkill;
		}
	else
		{
		var currentValue = 0;
		var startValue = 0;
		var skillStr = 'None';
		}
	var statPosX = 370;
	var statPosY = 180;
	
    gump.AddColoredPolygone(statPosX - 13, statPosY - 11, 180, 120, '#FF666600', 1, 1, 0, 0, 0);
	//gump.AddResizepic(statPosX - 13, statPosY - 11, '9400', 180, 120, 3, 1);
	gump.AddText(statPosX + 12,statPosY - 38,553,"Current Skill:");
	gump.AddText(statPosX + 100,statPosY - 38,553,skillStr,90,49);
	gump.AddText(statPosX,statPosY,553,"Time Elapsed:");
	gump.AddText(statPosX + 90,statPosY,553,time,90,50);
	gump.AddText(statPosX,statPosY + 20,553,"Start:");
	gump.AddText(statPosX + 90,statPosY + 20,553,(startValue/10).toFixed(1),90,51);
	gump.AddText(statPosX,statPosY + 40,553,"Current:");
	gump.AddText(statPosX + 90,statPosY + 40,553,(currentValue/10).toFixed(1),90,52);
	gump.AddText(statPosX,statPosY + 60,553,"Gains:");
	gump.AddText(statPosX + 90,statPosY + 60,553,((currentValue - startValue)/10).toFixed(1),90,53);
	gump.AddText(statPosX,statPosY + 80,553,"Last Gain:");
	gump.AddText(statPosX + 90,statPosY + 80,553,'00:00:00',90,54);
	
	gump.AddText(statPosX + 35,statPosY + 120,553,"Status:",90);
	gump.AddText(statPosX + 90,statPosY + 120,0,' ',90,55);

	gump.AddButton(3, statPosX, statPosY + 120, 30533, 30533, 30533, '0x0000');
		
    gump.Update();
    }

function TrainingGumpCallback(_) 
	{
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print('Code: ' + code)
    if(code == 0)
        {
        var gump = Orion.CreateCustomGump(10420)
        Orion.Terminate('all','TrainingGumpCallback');
        gump.Close()
        return;
        }
    else if(code == 1)
        {
        Orion.Terminate('all','TrainingGumpCallback');
        Shared.AddVar('currentIndex', 0);
        Shared.AddVar('targetValue',1000);
        Shared.RemoveVar('currentSkill')
        Shared.RemoveVar('startTime');
        Shared.RemoveVar('lastGainMS');
        Shared.RemoveVar('startTime');
        Shared.RemoveVar('startValue');
        Shared.RemoveVar('pauseTime');
        BackgroundRenderer(0);
        }
	else if(code == 2)
		{
		var index = Shared.GetVar('currentIndex',0);
		if(index == 0)
			BackgroundRenderer(0);
		else
			{
			var currentSkill = Shared.GetVar('currentSkill')
			Orion.Print(currentSkill)
			if(!currentSkill)
				return;
			Shared.AddVar('startTime',Orion.Now());
			Shared.AddVar('startValue',Orion.SkillValue(currentSkill,'real'))
			Orion.Exec('Train' + currentSkill,true);
            Orion.Exec('TrainingGump',true,[true]);
			}
		}
    else if(code == 3)
        {
        var currentSkill = Shared.GetVar('currentSkill')
        if(!currentSkill)
            return;
        if(Orion.ScriptRunning('Train' + currentSkill))
            {
            if(Shared.GetVar('pauseTime'))
                {
                Orion.ResumeScript('all');
                }
            else
                {
                Shared.AddVar('pauseTime',Orion.Now());
                var gump = Orion.CreateCustomGump(10420)
	            gump.AddText(460,300,52,'Paused',90,55);
                gump.Update();
                Orion.PauseScript('all','TrainingGumpCallback');
                }
            }
        }
    else if(code == 4)
        {
        BackgroundRenderer(0);
        }
    else if(code == 300)
        {
        var skillInd = CustomGumpResponse.ComboBox(200) + 1;
        var targetValue = CustomGumpResponse.Text(100);
        var skill = pageArr[skillInd][0];
		Shared.RemoveVar('startValue')
		Shared.RemoveVar('startTime')
        Shared.AddVar('currentSkill', skill);
        Shared.AddVar('currentIndex', +skillInd);
        Shared.AddVar('targetValue',+targetValue);
        BackgroundRenderer(skillInd);
        }
    else if(code == 500)
        {
        Orion.Terminate('all','AliGumpCallback');
        Orion.Wait(50);
        return TrainingGumpRenderer();
        }
    //Orion.Print(gumpButtons);
    //Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
	}

function TrainTracking()
	{
	while(true)
		{
		if(!Player.Hidden())
			{		
			Orion.UseSkill('Tracking');
			Orion.Wait(1000);
			}
		}
	}


function TrainChivalry() 
	{
    var skillCap = 1100
    Orion.Exec('SkillGump', true, ['Chivalry', 'TrainChivalry']);
    var skillLevel = Orion.SkillValue('Chivalry');
    while(skillLevel < skillCap) 
        {
        skillLevel = Orion.SkillValue('Chivalry');
        if(skillLevel < 300) 
            return Orion.Print('Train skill at an NPC first!');   	
        else if(skillLevel <= 450)
            Orion.Cast('Consecrate Weapon');
        else if(skillLevel <= 600)
            Orion.Cast('Divine Fury')
        else if(skillLevel <= 700)
            Orion.Cast('Enemy of One')
        else if(skillLevel <= 900)
            Orion.Cast('Holy Light')
        else if(skillLevel < 1200) 
            Orion.Cast('Noble Sacrifice')
        WaitPingAdjusted(750);
        }
    TextWindow.Open();
    TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Chivalry Finished");
    Orion.CloseUO();
    }

function TrainEvalResist()
	{
	while (!Player.Dead())
		{
		if(Player.Mana() < 20) 
        	{
            while (Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1500);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				}
            }
		 Orion.Cast('Weaken', self);
		 Orion.Wait(800);
		 Orion.Cast('Feeblemind', self);
		 Orion.Wait(800);
		 Orion.Cast('Clumsy', self);
		 Orion.Wait(800);	 
		}
	}
	
function TrainNinjitsuTo60()
	{ //cast mirror image, ready focus attack, attack mirror image. You need a melee weapon equipped
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsuTo60']);
	var msg = Player.Name() + '|The spell fizzles'
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump')
		if(Player.Mana() > 25)
			{
			Orion.Cast('Mirror Image');
			var check = Orion.WaitJournal(msg, Orion.Now(), Orion.Now() + 5000)
			WaitPingAdjusted(200);
			var mirror = Orion.FindTypeEx(any,any,ground,'ignoreself|mobile', 5).filter(function(part){return Orion.Contains(part.Properties(), Player.Name())});
			if(mirror.length)
				{
				WaitPingAdjusted(10);
				Orion.Cast('Focus Attack');
				WaitPingAdjusted(10);
				while(mirror[0].Exists())
					{
					Orion.Attack(mirror[0].Serial());
					Orion.Wait(10);
					}
				}
			WaitPingAdjusted(750);
			}
		WaitPingAdjusted(10);
		}
	}
function TrainNinjitsu60to100()
	{//stand somewhere you can reliably shadowjump
	Orion.ClientOptionSet('AlwaysRun', 0);
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsu60to100']);
	var x1 = Player.X();
	var x2 = Player.X()-1;
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump');
		if(!Player.Hidden())
			{
			Orion.UseSkill('Hiding');
			WaitPingAdjusted(0);
			if(Player.X() == x1)
				Orion.Step('w',false);
			else
				Orion.Step('e',false);
			}
		if(Player.Mana() > 25)
			{
			Orion.Cast('Shadowjump');
			Orion.WaitForTarget(2000);
			if(Player.X() == x1)
				Orion.TargetTile('land', x2, Player.Y(), Player.Z());
			else
				Orion.TargetTile('land', x1, Player.Y(), Player.Z());
			WaitPingAdjusted(600);
			}
		else if(Orion.SkillValue('Meditation') > 400)
        	{
        	WaitPingAdjusted(500);
            while(Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1000);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				Orion.PrintFast(self,1159,0,'Meditating... ' + Player.Mana() + '/' + Player.MaxMana());
				}
            }
		Orion.Wait(10);
		}
	}

function TrainNinjitsu85to100()
	{ //cast mirror image, ready focus attack, attack mirror image. You need a melee weapon equipped
	Orion.Exec('SkillGump', true, ['Ninjitsu', 'TrainNinjitsu85to100']);
	var msg = Player.Name() + '|The spell fizzles'
	while(!Player.Dead())
		{
		Orion.ResumeScript('SkillGump');
		if(Player.Mana() > 25)
			{
			Orion.Cast('Mirror Image');
			var check = Orion.WaitJournal(msg, Orion.Now(), Orion.Now() + 5000)
			WaitPingAdjusted(200);
			var mirror = Orion.FindTypeEx(any,any,ground,'ignoreself|mobile', 5).filter(function(part){return Orion.Contains(part.Properties(), Player.Name())});
			if(mirror.length)
				{
				WaitPingAdjusted(10);
				Orion.Cast('Death Strike');
				WaitPingAdjusted(10);
				while(mirror[0].Exists())
					{
					Orion.Attack(mirror[0].Serial());
					Orion.Wait(10);
					}
				}
			WaitPingAdjusted(750);
			}
		else if(Orion.SkillValue('Meditation') > 400)
        	{
        	WaitPingAdjusted(500);
            while(Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1000);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				Orion.PrintFast(self,1159,0,'Meditating... ' + Player.Mana() + '/' + Player.MaxMana());
				}
            }
		WaitPingAdjusted(10);
		}
	}
	
function TrainStealth()
	{//stand near a moongate and press start.
	Orion.Exec('SkillGump', true, ['Stealth', 'TrainStealth']);
	Orion.ClientOptionSet('AlwaysRun', 0);
	var timingMS = 600
	var hidingCap = 1000;
	var stealthCap = 1000;
	while(!Player.Dead() && (Orion.SkillValue('Hiding') < hidingCap || Orion.SkillValue('Stealth') < stealthCap))
		{
		Orion.ResumeScript('SkillGump');
		ChangeSuit();
		//if(Orion.SkillValue('Stealth') >= 800)
			//Orion.SetSkillStatus('Stealth', 'Lock');
		for(var i = 0;i<2;i++)
			{
			var gate = Orion.FindTypeEx('0x0F6C', '0xFFFF', 'ground', 10)[0];
			var endTime = Orion.Now() + 10000;
			while(gate && gate.Distance())
				{
				if(Orion.Now() > endTime)
					{
					Orion.Print(500);
					//TextWindow.Open();
					//TextWindow.Print('timeout')
					break;
					}
				Orion.WalkTo(gate.X(),gate.Y(),0,0);
				Orion.Wait(timingMS);
				}
			if(Orion.WaitForGump(2000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
					{
					var gumpHook0 = Orion.CreateGumpHook(1);
					gumpHook0.AddCheck(22 + (i * 2), true);
					gump0.Select(gumpHook0);
					Orion.CloseGump('generic',gate.Serial());
					}
				}
			WaitPingAdjusted(timingMS);
			while(false && i == 1 && !Orion.BuffExists('arcane empowerment') && Orion.GetDistance(528,216) < 10)
				{
				Orion.Wait(100);
				}
			Orion.Resend();
			Orion.Step(Orion.Random(0,9), false);
			WaitPingAdjusted(timingMS);
			if(Player.Hidden())
				Orion.UseSkill('Stealth');
			if(Player.Hidden())
				Orion.SayWhisper("'");
			WaitPingAdjusted(timingMS);
			}
		}
	Orion.LogOut();
	}

function TrainStealthComplex()
	{//stand near a moongate and press start. Check online for correct suit pieces to wear depending on skill level
	Orion.Exec('SkillGump', true, ['Stealth', 'TrainStealthComplex']);
	Orion.ClientOptionSet('AlwaysRun', 0);
	var timingMS = 400
	var lastRand = 0;
	var moongates = [5,6,7,8]
	while(!Player.Dead())
		{
		Orion.Print(2);
		Orion.ResumeScript('SkillGump');
		ChangeSuit();
		do var rand = Orion.Random(1,10); while(rand == lastRand || rand == 4 || rand == 3)
		if(rand == 9)
			{
			var randArr = [9,1];
			lastRand = 1;
			}
		else
			{
			var randArr = [rand,++rand];
			lastRand = rand + 1;
			}
		for(var i = 0;i<2;i++)
			{
			var gate = Orion.FindTypeEx('0x0F6C', '0xFFFF', 'ground', 10)[0];
			var endTime = Orion.Now() + 10000;
			while(gate && gate.Distance())
				{
				Orion.Print(1);
				if(Orion.Now() > endTime)
					{
					Orion.Print(666);
					TextWindow.Open();
					TextWindow.Print('timeout')
					break;
					}
				Orion.WalkTo(gate.X(),gate.Y(),0,0);
				Orion.Wait(500);
				}
			if(Orion.WaitForGump(2000))
				{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
					{
					var gumpHook0 = Orion.CreateGumpHook(1);
					gumpHook0.AddCheck(randArr[i], true);
					gump0.Select(gumpHook0);
					Orion.CloseGump('generic',gate.Serial());
					}
				}
			WaitPingAdjusted(timingMS);
			Orion.Step(Orion.Random(0,9), false);
			WaitPingAdjusted(timingMS);
			Orion.UseSkill('Stealth');
			Orion.Resend();
			Orion.SayWhisper("'");
			WaitPingAdjusted(timingMS);
			}
		}
	}

function BuyStealthSuitPieces()
	{
	var graphic = {
		'LeatherTunic': 0x13CC,
		'LeatherGloves': 0x13C6,
		'LeatherGorget': 0x13C7,
		'LeatherCap': 0x1DB9,
		'LeatherSleeves': 0x13C5,
		'StuddedSleeves': 0x13D4,
		'StuddedGorget': 0x13D6,
		'ChainmailTunic': 0x13BF,
		'RingmailGloves': 0x13EB,
		'RingmailSleeves': 0x13EE,
		'RingmailLeggings': 0x13F0,
		'PlatemailGorget': 0x1413
		}	
	var shoplist = Orion.GetShopList('Stealth');
	var items = [
		new ShopListItem(0x13CC, '0x0000', '', 1),
		new ShopListItem(0x13C6, '0x0000', '', 1),
		new ShopListItem(0x13C7, '0x0000', '', 1),
		new ShopListItem(0x1DB9, '0x0000', '', 1),
		new ShopListItem(0x13C5, '0x0000', '', 1),
		new ShopListItem(0x13CB, '0x0000', '', 1),
		new ShopListItem(0x13D4, '0x0000', '', 1),
		new ShopListItem(0x13D6, '0x0000', '', 1),
		];
	shoplist.SetItems(items);
	Orion.UpdateShopList(shoplist);
	var armourer = Orion.FindTypeEx(any,any,ground,'mobile',10).filter(function(npc)
		{
		return Orion.Contains(npc.Properties(), 'armourer')
		})[0];
	Orion.WalkTo(armourer.X(), armourer.Y());
	Orion.BuyHook('Stealth');
	Orion.WaitContextMenuID(armourer.Serial(), 110);
	Orion.RequestContextMenu(armourer.Serial());
	Orion.Wait(5000);
	items = [
		new ShopListItem(0x13BF, '0x0000', '', 1),
		new ShopListItem(0x13EB, '0x0000', '', 1),
		new ShopListItem(0x13EE, '0x0000', '', 1),
		new ShopListItem(0x13F0, '0x0000', '', 1),
		new ShopListItem(0x1413, '0x0000', '', 1),
		];
	shoplist.SetItems(items);
	Orion.UpdateShopList(shoplist);
	var blacksmith = Orion.FindTypeEx(any,any,ground,'mobile',10).filter(function(npc)
		{
		return Orion.Contains(npc.Properties(), 'blacksmith');
		})[0];
	Orion.WalkTo(blacksmith.X(), blacksmith.Y());
	Orion.BuyHook('Stealth');
	Orion.WaitContextMenuID(blacksmith.Serial(), 110);
	Orion.RequestContextMenu(blacksmith.Serial());
	}
	
function ChangeSuit()
	{
	var graphic = {
		'LeatherTunic': 0x13CC,
		'LeatherGloves': 0x13C6,
		'LeatherGorget': 0x13C7,
		'LeatherCap': 0x1DB9,
		'LeatherSleeves': 0x13C5,
		'LeatherLeggings': 0x13CB,
		'StuddedSleeves': 0x13D4,
		'StuddedGorget': 0x13D6,
		'ChainmailTunic': 0x13BF,
		'RingmailGloves': 0x13EB,
		'RingmailSleeves': 0x13EE,
		'RingmailLeggings': 0x13F0,
		'PlatemailGorget': 0x1413
		}	
	if(Orion.SkillValue('Stealth') < 580)
		{
		EquipSuit([graphic.LeatherGorget, graphic.LeatherGloves]);
		}
	else if(Orion.SkillValue('Stealth') < 650)
		{
		EquipSuit([graphic.RingmailGloves, graphic.LeatherSleeves, graphic.LeatherGorget]);
		}
	else if(Orion.SkillValue('Stealth') < 845)
		{
		EquipSuit([graphic.RingmailGloves, graphic.RingmailSleeves, graphic.LeatherGorget]);
		}
	else if(Orion.SkillValue('Stealth') < 950)
		{
		EquipSuit([graphic.RingmailGloves, graphic.StuddedSleeves, graphic.StuddedGorget, graphic.LeatherTunic, graphic.RingmailLeggings]);
		}
	else if(Orion.SkillValue('Stealth') < 1000)
		{
		while(Orion.ObjAtLayer('Arms'))
			{
			Orion.Print(4);
			Orion.Unequip('Arms');
			Orion.Wait(1300);
			}
		while(Orion.ObjAtLayer('Gloves'))
			{
			Orion.Print(3);
			Orion.Unequip('Gloves');
			Orion.Wait(1300);
			}
		EquipSuit([graphic.LeatherLeggings, graphic.ChainmailTunic, graphic.StuddedGorget, graphic.LeatherCap]);
		}
	else if(Orion.SkillValue('Stealth') < 1200)
		{
		while(Orion.ObjAtLayer('Legs'))
			{
			Orion.Print(5);
			Orion.Unequip('Legs');
			Orion.Wait(1300);
			}
		while(Orion.ObjAtLayer('Helmet'))
			{
			Orion.Print(6);
			Orion.Unequip('Helmet');
			Orion.Wait(1300);
			}
		EquipSuit([graphic.ChainmailTunic, graphic.RingmailSleeves, graphic.PlatemailGorget]);
		}
	}

function EquipSuit(arr)
	{
	for(var i=0;i<arr.length;i++)
		{
		var piece = Orion.FindType(arr[i])[0];
		if(piece)
			{
			Orion.Wait(2000);
			Orion.Equip(piece);
			piece = Orion.FindType(arr[i])[0];
			}
		}
	}
	
function TrainMagery() 
	{
	var skillCap = 1100; //set to your target skill level. 1000 = 100.0
	Orion.Exec('SkillGump', true, ['Magery', 'TrainMagery']);
	var skillLevel = Orion.SkillValue('Magery', 'base');
	var skillLevelreal = Orion.SkillValue('Magery');
	var iteminpack = Orion.FindType(any);
	if(iteminpack[0])
		var trainingTarget = iteminpack[0];
	else
		return Orion.CharPrint(self,1159,'No item in backpack to target!');
    while (skillLevelreal < skillCap) 
      	{
      	skillLevel = Orion.SkillValue('Magery', 'base');
      	skillLevelreal = Orion.SkillValue('Magery');
        if(Player.Mana() < 20) 
        	{
            while (Player.Mana() < Player.MaxMana()) 
				{
				Orion.Wait(1500);
				if(!Orion.BuffExists('Meditation')) 
					Orion.UseSkill('Meditation');
				}
            }
        else if(skillLevel < 300) 
        	{
        	Orion.Cast('Cure');
        	Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
        	}
        else if(skillLevel <= 450)
        	{
            Orion.Cast('Fireball');
            Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
        	}
       	else if(skillLevel <= 550) 
       		{
       		Orion.Cast('Lightning');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 650) 
       		{
       		Orion.Cast('Paralyze');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 800) 
       		{
       		Orion.Cast('Reveal');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(self);
       		}
       	else if(skillLevel <= 900) 
       		{
       		Orion.Cast('Flame Strike');
       		Orion.WaitForTarget(5000);
            Orion.TargetObject(trainingTarget);
       		}
       	else if(skillLevel <= 1200) 
       		{
       		Orion.Cast('Earthquake');
       		WaitPingAdjusted(1000);
       		}  
       	WaitPingAdjusted(700);  	
        }
  	TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Magery Finished");
	}

function TrainChivalry() 
	{
	var skillCap = 1100
	Orion.Exec('SkillGump', true, ['Chivalry', 'TrainChivalry']);
	var skillLevel = Orion.SkillValue('Chivalry');
    while(skillLevel < skillCap) 
      	{
      	skillLevel = Orion.SkillValue('Chivalry');
        if(skillLevel < 300) 
        	return Orion.Print('Train skill at an NPC first!');   	
        else if(skillLevel <= 450)
            Orion.Cast('Consecrate Weapon');
       	else if(skillLevel <= 600)
       		Orion.Cast('Divine Fury')
       	else if(skillLevel <= 700)
       		Orion.Cast('Enemy of One')
       	else if(skillLevel <= 900)
       		Orion.Cast('Holy Light')
       	else if(skillLevel < 1200) 
       		Orion.Cast('Noble Sacrifice')
       	WaitPingAdjusted(750);
        }
    TextWindow.Open();
	TextWindow.Print(Orion.Time("hh:mm:ss") + ' ' + Player.Name() + ": Chivalry Finished");
	Orion.CloseUO();
	}



function GMJournalScan()
	{
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
					DiscordPush(Player.Name() + ': GM');
					//Orion.PlayWav('Alarm09.wav');
					Orion.PauseScript('all');
                    Orion.Wait(1000);
                    Orion.Step('n');
					Orion.OAOptionSet('AutoReconnect', '0');
					Orion.Wait(2000);	
					//Orion.LogOut();		
					break;	
				default:
					break;
				}
			}
		}
	}

function DiscordPushAli(message)
	{ //private notification channel
	var bot = "https://discordapp.com/api/webhooks/"
	+ '887268637315047444' //hook
	+ "/"
	+ 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
	Orion.HttpPost(bot, "content=" + message);
	}
	
function DiscordPush(message)
	{ //private notification channel
	var bot = "https://discordapp.com/api/webhooks/"
	+ '941921319463841843' //hook
	+ "/"
	+ '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
	Orion.HttpPost(bot, "content=" + message);
	}



//Asset Types:
//'button': A custom graphic button. Args: 'functionName', widthAdjust, xAdj, yAdj, 'graphic|graphicSelected|graphicPressed'
//'toggle': A gem toggle button. Args: 'functionName', 'displayName', ('altOnGraphic|altOnGraphicSelected|altOnGraphicPressed','altOffGraphic|altOffGraphicSelected|altOffGraphicPressed',xAdj,yAdj)
//'textInput': A text input. Args: 'storedVarName'
//'text': Text. Args: 'textString', textColor, xAdj, yAdj
//'horizontalLine': A horizontal line. Args: width,xAdj,yAdj,color,lineWidth
//'verticalLine': A vertical line. Args: height,xAdj,yAdj,color,lineWidth
//'comboBox': A dropdown box. Args: storedVarName, option1, option2, option3... etc
//'xSpacer': A blank asset spacer. Args: width
//'ySpacer': A blank row spacer. Args: height
//'tooltip': Add a tooltip to the previous asset. Args: 'text'

var title = "Ali's Modular Gump"

var defaultAssets = 
[
    [ ['toggle','Example1Function','Example1','0x2c88|0x2c89|0x2c8A','0x2c92|0x2c93|0x2c94', 6, 6], ['toggle','Example3Function','Three'], ['toggle','Example4Function','4'] ],
    [ ['toggle','Example2Function','ExampleTwo'],['ySpacer',10] ],
    [ ['text','Sample Text Here',554,1,1] ],
    [ ['textInput','Ignore Mobs'],['horizontalLine',30,0,0,'#FF660066',2],['verticalLine',30,0,0,'#FF660066',10] ],
    [ ['comboBox', 'Single Target', 'Primary', 'Secondary'], ['comboBox', 'Two Targets', 'Primary', 'Secondary'], ['comboBox', 'Multi Target', 'Primary', 'Secondary']],
    [ ['xSpacer', 330],['button','ClearAll',20,0,2,'0x2EE3|0x2EE3|0x2EE4'] ]
];

function AliGumpRenderer() 
	{
    var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 

    var rowAdj = 45;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
	var rowStart = 35;
	var columnStart = 25;

    var gumpButtons = defaultAssets;//Shared.GetArray('gumpValues',[]);
    //Orion.Print(gumpButtons)
    if(!gumpButtons[0])
        {
        Orion.Print('Resetting to default Assets')
        Shared.AddArray('gumpValues',defaultAssets)
        gumpButtons = defaultAssets;
        }
    var heightAdjust = 0;
    var width = Math.max.apply(Math, gumpButtons.map(function (rows)
        {
        var length = rows.reduce(function(sum,ele)
            {
            var assetType = ele[0];
            var widthAdjust = 0
            switch(assetType)
                {
                case 'button':
                    widthAdjust = ele[2];
                    break;
                case 'toggle':
                    widthAdjust = (ele[2].length * characterAdj) + buttonTextHorAdj + 23 + (ele[5] || 0);
                    break;
                case 'comboBox':
                    widthAdjust = 142;
                    heightAdjust += 3;
                    break;
                case 'textInput':
                    widthAdjust = 135;
                    break;
                case 'text':
                    var string = ele[1];
                    var xAdj = ele[2];
                    widthAdjust = (string.length * characterAdj) + xAdj// + 20;
                    break;
                case 'horizontalLine':
                    widthAdjust = ele[1] + 10;
                    break;
                case 'verticalLine':
                    widthAdjust = ele[5];
                    heightAdjust += ele[1];
                    break;
                case 'xSpacer':
                    widthAdjust = ele[1];
                    break;
                case 'ySpacer':
                    heightAdjust += ele[1];
                    break;
                default:
                    break;
                }
            return sum + widthAdjust;
            },0);
        return length + 25;
        }));
    var height = (gumpButtons.length * rowAdj) + rowStart + heightAdjust;
    gump.Clear();
    gump.SetCallback('AliGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
	//gump.AddText(20,9, 554, 'Modular Gump') //title
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Assets
	//gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
	//gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    
    //Modular Assets
    var rowPos = rowStart;
    var colPos = columnStart;
    var i = 1;
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            var assetType = asset[0];
            switch(assetType)
                {
                case 'button':
                    var gumpOption = asset[1];
                    var widthAdjust = asset[2];
                    var xAdj = asset[3] || 0;
                    var yAdj = asset[4] || 0;
                    var buttonGraphic = asset[5] != undefined ? Orion.Split(asset[5],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, buttonGraphic[0], buttonGraphic[1], buttonGraphic[2], '0x0000');
                    colPos += widthAdjust;
                    break;
                case 'toggle':
                    var gumpOption = asset[1];
                    var gumpTitle = asset[2];
	                var buttonOnGraphic = asset[3] != undefined ? Orion.Split(asset[3],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
	                var buttonOffGraphic = asset[4] != undefined ? Orion.Split(asset[4],'|') : ['0x25F8','0x25F9','0x25F9']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    var xAdj = asset[5] || 0;
                    var yAdj = asset[6] || 0;
                    var stateGraphic //graphic,selected,pressed
                    Orion.ScriptRunning(gumpOption) ? stateGraphic = buttonOnGraphic : stateGraphic = buttonOffGraphic;
                    gump.AddText(colPos + buttonTextHorAdj, rowPos + buttonTextVerAdj, textColor, gumpTitle);
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, stateGraphic[0], stateGraphic[1], stateGraphic[2], '0x0000');
                    colPos += (gumpTitle.length * characterAdj) + buttonTextHorAdj + 20;
                    break;
                case 'comboBox': //['comboBox', 'Single Target', 'Primary', 'Secondary']
                    var gumpOption = asset[1];
                    var dropLength = Math.ceil((asset.length - 2));
                    var value = Shared.GetVar(gumpOption,undefined);
                    gump.AddComboBox(i + 300, colPos, rowPos, '0x0BB8', 0, '0x0BB8', 125, -3,dropLength);
                    for(var j=2;j<asset.length;j++)
                        {
                        gump.AddComboBoxText(asset[j],0,value == asset[j] ? 1 : 0,115,'center');
                        }
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 124, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos - 9, rowPos + 1, '0x16CD', '0x16CE', '0x16CE', '0x0000');
                    colPos += 140;
                    break;
                case 'textInput':
                    var gumpOption = asset[1];
                    gump.AddResizepic(colPos, rowPos , '0x0BB8', 100, 19);
                    gump.AddTextEntry(i + 200, colPos + 5, rowPos - 1, 1159, Shared.GetVar(gumpOption,''), 100, 20);
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos + 87, rowPos + 1, '0x16CF', '0x16D0', '0x16D0', '0x0000');
                    gump.AddTooltip('Update');
                    colPos += 135;
                    break;
                case 'text':
                    var string = asset[1];
                    var color = asset[2];
                    var xAdj = asset[3];
                    var yAdj = asset[4];
                    gump.AddText(colPos + xAdj, rowPos + yAdj,color,string);
                    colPos += (string.length * characterAdj) + xAdj;
                    break;
                case 'horizontalLine':
                    var width = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj + width,rowPos + yAdj, color, lineWidth);
                    colPos += width + 10;
                    break;
                case 'verticalLine':
                    var height = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj,rowPos + yAdj + height, color, lineWidth);
                    colPos += 10;
                    break;
                case 'xSpacer':
                    var xAdjust = asset[1];
                    colPos += xAdjust;
                    break;
                case 'ySpacer':
                    var yAdjust = asset[1];
                    rowPos += yAdjust;
                    break;
                case 'tooltip':
                    var text = asset[1];
                    gump.AddTooltip(text);
                    break;
                default:
                    break;
                }
			i += 1;
            }
        colPos = columnStart;
        rowPos += rowAdj;
        }
    //Custom Assets
    
    gump.Update();
    Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function AliGumpCallback(_) 
	{
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print('Code: ' + code)
    if(code == 0)
        return;
    else if(code == 100)
        {
        //Orion.Print(true);
        }
    else if(code == 101)
        {
        Orion.Terminate('all','AliGumpCallback');
        Orion.Wait(50);
        return AliGumpRenderer();
        }
    var i = 1;
    var gumpButtons = defaultAssets;//Shared.GetArray('gumpValues');
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            if(code == i)
                {
                var assetType = asset[0];
                switch(assetType)
                    {
                    case 'toggle':
                        var gumpOption = asset[1]; //Function name to toggle
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'button':
                        var gumpOption = asset[1]; //Function name to exec
                        Orion.Exec(gumpOption,true);
                        break;
                    case 'textInput':
                        var text = CustomGumpResponse.Text(code + 200);
                        var gumpOption = asset[1]; //Shared Variable Name
                        Shared.AddVar(gumpOption,text);
                        Orion.Print(text);
                        break;
                    case 'comboBox':
                        var gumpOption = asset[1];
                        var value = CustomGumpResponse.ComboBox(i+300)
                        if(value > -1)
                            var parsedValue = asset[2 + value];
                        else
                            var parsedValue = undefined;
                        Shared.AddVar(gumpOption,parsedValue);
                        Orion.Print(gumpOption + ' value: ' + parsedValue)
                        break;
                    default:
                        break;
                    }
                }
            i++
            }
        }
    //Orion.Print(gumpButtons);
    //Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    AliGumpRenderer();
	}
	
function Example1Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example2Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example3Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example4Function()
    {
    while(true) Orion.Wait(1000);
    }