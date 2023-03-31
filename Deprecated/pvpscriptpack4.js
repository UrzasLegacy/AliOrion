//Autostart scripts after login into the game. Example: Orion.Exec('AutoLootIgnore');

function Autostart()
{

  Orion.Exec('PVPGump',true);
}

//Script pack
//Version 4.0

//--#Potions
function AutoEverything(){
  //Giving the game time to load
  Orion.Wait(10000)
  //Dex-Str Chugging Variables
  autostartlevel = 0.70; //Percentage as decimal.
  //Other Start levels
  seedhits = 0.40;
  warcryhits = 0.50;
  autoheal = 0.60;

	while (true) {
    //Update everything that is currently toggled on
    var doSeed = Orion.GetGlobal("doSeed");
    var doBox = Orion.GetGlobal("doBox");
    var doApple = Orion.GetGlobal("doApple");
    var doRun = Orion.GetGlobal("doRun");
    var doCry = Orion.GetGlobal("doCry");
    var doDexStr = Orion.GetGlobal("doDexStr");
    var doCA = Orion.GetGlobal("doCA");
    var doHeal = Orion.GetGlobal("doHeal");
    //
    doCorpse = Orion.RegRead(Player.Name() + "/Corpse Skin");
    doSleep = Orion.RegRead(Player.Name() + "/Sleep");
    doMortal = Orion.RegRead(Player.Name() + "/Mortal Strike");
    doPlague = Orion.RegRead(Player.Name() + "/Spell Plague");
    doCurse = Orion.RegRead(Player.Name() + "/Curse");
    doStrangle = Orion.RegRead(Player.Name() + "/Strangle");
    //Getting the latest activation levels for auto things
    autostartlevel = Orion.RegRead(Player.Name() + "/dexstrAct")*0.01;
    seedhits = Orion.RegRead(Player.Name() + "/seedAct")*0.01;
    warcryhits = Orion.RegRead(Player.Name() + "/warcryAct")*0.01;
    autoheal = Orion.RegRead(Player.Name() + "/healAct")*0.01;
    //Autostart Dex/Str Pot Chugging script
    var hitsper = 0;
    hitsper = (Player.Hits()*1.0) / (Player.MaxHits()*1.0);
    if (doDexStr == 1 && hitsper < autostartlevel) {
      if (Orion.ScriptRunning('AutoDrinkDexStr')){
        Orion.SetTimer('AuotStartDexTimer',180000);
      }
      else {
        Orion.Exec('AutoDrinkDexStr');
        Orion.SetTimer('AuotStartDexTimer',180000);
      }
    }
    //Auto box pop
    nervepopdelay = 400;
    parapopdelay = 0;
    if(doBox == 1){
      var box = Orion.FindType('0x09A9', 'any', 'backpack');
      if(Array.isArray(box)){
        box = box[0];
      }
      Orion.Wait(100)
      if (Orion.BuffExists('Paralyzed') || Orion.BuffExists('Paralyze')){
          Orion.UseObject(box);
          Orion.Wait(350);
          Orion.Hide(Orion.GetSerial(box));
      }
      var NerveStriked = Orion.InJournal('Your attacker dealt a crippling nerve strike!','sys','0','any',Orion.Now()-2000,Orion.Now()+2000);
      if(NerveStriked){
        Orion.Wait(nervepopdelay);
        Orion.UseObject(box);
        Orion.Wait(350);
        Orion.Hide(Orion.GetSerial(box));
        Orion.ClearJournal();
      }
      Orion.Wait(50);
    }
    //Auto Seed
    if (doSeed == 1 && hitsper < seedhits && !Player.Dead() && Orion.Count('0x1727') > 0){
      if(Orion.Timer("SeedTimer") >= -1 && !Orion.HaveTarget()){
        Orion.UseType('0x1727');
        Orion.Wait(100);
        if(Orion.InJournal('bitter seed instantly','my')){
          Orion.SetTimer("SeedTimer",-60000*10);
          Orion.ClearJournal();
        }
      }
      Orion.Wait(1000);
    }
    //Auto Warcry
    if (doCry == 1 && hitsper < warcryhits && !Player.Dead() && Orion.SkillValue("bushido","real") > 1000){
      if(Orion.Timer("CryTimer") >= -1 && !Orion.HaveTarget()){
        Orion.Cast("Warcry");
        Orion.Wait(100);
        if(Orion.BuffExists("Warcry")){
          Orion.SetTimer("CryTimer",-60000*20);
        }
      }
      Orion.Wait(1000);
    }
    //Auto Apple
    if(doApple == 1 && (doCorpse == 1 && Orion.BuffExists('Corpse Skin')) || (doSleep == 1 && Orion.BuffExists('Sleep')) || (doMortal == 1 && Orion.BuffExists('Mortal Strike')) || (doPlague == 1 && Orion.BuffExists('Spell Plague')) || (doCurse == 1 && Orion.BuffExists('Curse')) || (doStrangle == 1 && Orion.BuffExists('Strangle'))){
      if(Orion.Timer("AppleTimer") >= -1 && !Orion.HaveTarget()){
        Orion.UseType('0x2FD8', '0x0488');
        Orion.Wait(100);
        if(Orion.InJournal('tasty bite of the enchanted','my','0','any',Orion.Now()-2000,Orion.Now()+2000)){
          Orion.SetTimer("AppleTimer",-30000);
          Orion.ClearJournal();
        }
      }
      Orion.Wait(500);
    }
    //Auto Run Toggle
    if(doRun == 1 && Player.Hidden()){
        Orion.OptionAlwaysRun(false);
    }
    else{
      Orion.OptionAlwaysRun(true);
    }
    //Auto Counterattack
    if(doCA == 1 && Orion.SkillValue("Bushido") > 1000 && !Player.Hidden() && !Orion.BuffExists("Counter Attack") && !Orion.HaveTarget() && Player.Mana() > 50 && Player.WarMode()){
      Orion.Cast("Counter Attack");
    }
    //Auto Cure/Heal
    if(doHeal == 1 && (Player.Poisoned() || hitsper < autoheal)){
      DrinkCureHeal();
    }
  Orion.Wait(500);
  var pos = Orion.GetGumpPosition('custom', 150);
  if(pos.X() != -1 && Orion.Timer("GumpUpdateTimerLaunch") >= -1){
    //Orion.Print('Custom gump now at: ' + pos.X() + ' ' + pos.Y());
    Orion.RegWrite(Player.Name()+"/launchgumpx",pos.X());
    Orion.RegWrite(Player.Name()+"/launchgumpy",pos.Y());
    Orion.SetTimer("GumpUpdateTimerLaunch",-1000);
  }
  //
  }
}

function ApplyPoison(){
	var PoisonPotion = Orion.FindType('0x0F0A');
	if ( !PoisonPotion.length) {
		Orion.Print('poison potion NOT found');
	}
	else {
		Orion.Print('poison potion found');
		var Rhand = Orion.ObjAtLayer('1');
		if (Rhand === null  ) {
			Orion.Print('something appropriate not armed');
		}
		else {
			//Orion.Print('right hand weapon is armed');
			Orion.UseSkill('Poisoning');
			Orion.WaitTargetObject(PoisonPotion);
			Orion.WaitTargetObject( Rhand.Serial() );
		}
	}
}
function AutoDrinkDexStr(){
  var dexbool = true;
  var strbool = true;
  if (Orion.GetGlobal("RunningAuotDexStr") == "") {
    Orion.SetGlobal("RunningAuotDexStr", "True");
  }
  else{
    if (Orion.GetGlobal("RunningAuotDexStr") == "True" || (!dexbool & !strbool)) {
      Orion.SetGlobal("RunningAuotDexStr", "False");
      Orion.Print('51',"Stopping Auto Dex/Str Chug");
      Orion.Terminate('AutoDrinkDexStr');

    }
    else {
      Orion.SetGlobal("RunningAuotDexStr", "True");
    }
  }
  var AutoDoIt = true;
  if(Orion.GetGlobal("RunningAuotDexStr") == "True") {
    AutoDoIt = true;
    Orion.Print('63',"Starting Auto Dex/Str Chug");
  }
  else {
    AutoDoIt  = false;
  }
  var bothhands = false;
  while (AutoDoIt) {
    if(Orion.ObjAtLayer('RightHand') && Orion.ObjAtLayer('RightHand').Properties().indexOf("Two-handed") != -1){
      var twohander = true;
    }
    else{
      var twohander = false;
    }
    if(Orion.ObjAtLayer('RightHand') && Orion.ObjAtLayer('LeftHand') || twohander){
      bothhands = true;
    }
    else{
      bothhands = false;
    }
    if (!Orion.BuffExists('Agility') && !Player.Hidden() && !Orion.HaveTarget()) {
      if (!Orion.FindType('0x0F08', 'any', 'backpack', 'any', 'any', 'any', true) ){
    		Orion.CharPrint('self', '63', 'No Agility Pots!');
        dexbool = false;
        //AutoDoIt == False;
      }
      else {
        Orion.UseType('0x0F08', '0x0000');
        Orion.Wait(100);
    	}
    }
    Orion.Wait(100);
    if (!Orion.BuffExists('Strength') && !Player.Hidden() && !Orion.HaveTarget()){
      if (!Orion.FindType('0x0F09', 'any', 'backpack', 'any', 'any', 'any', true) ){
    		Orion.CharPrint('self', '63', 'No Strength Pots!');
        strbool = false;
        //AutoDoIt == False;
      }
      else {
        Orion.UseType('0x0F09', '0x0000');
        Orion.Wait(100);
    	}
    }
    Orion.Wait(1000);
  }
}
function DrinkRefresh(){
	if ( Player.Stam() <= Player.MaxStam() ) {
    var Lhand = Orion.ObjAtLayer('2');
    var RHand = Orion.ObjAtLayer('RightHand');
  	if ( Lhand != null  && RHand != null){
      DisarmLeftHand();
      Orion.Wait(500);
    }
    Orion.UseType('0x0F0B', '0x0000');
  	if (!Orion.FindType('0x0F0B', 'any', 'backpack', 'any', 'any', 'any', true) ){
  		Orion.CharPrint('self', '63', 'refresh potion not found');
  	}
	}
	else {
		Orion.CharPrint('self', '63', 'Stamina is full.');
	}
}
function DrinkCureHeal(){
  if(Orion.ObjAtLayer('RightHand') && Orion.ObjAtLayer('LeftHand')){
    DisarmLeftHand();
    Orion.Wait(500);
  }
  if (Player.Poisoned()) {
      Orion.UseType('0x0F07', '0x0000');
  		Orion.Wait(50);
  		//Orion.ClearJournal();
  	}
  else if(Orion.Timer("chugheal") >= -1){
  	Orion.UseType('0x0F0C', '0x0000');
    Orion.Wait(100);
    if(Orion.InJournal("some damage",'sys','0','any',Orion.Now()-2000,Orion.Now()+2000)){
      Orion.SetTimer("chugheal",-12000)
    }
  	Orion.Wait(50);
  }
}

function EatApple() {
    Orion.UseType('0x2FD8', '0x0488');
}

function UseHealStone() {
    Orion.UseType('0x4078', '0x0000');
}

function UseBox() {
    Orion.UseType('0x09A9', '0x0000');
}

function AutoSeed() {
  seedhits = 40;
  warcryhits = 50;
  while (true){
    if (Player.Hits() < seedhits && !Player.Dead() && Orion.Count('0x1727') > 0){
      if(Orion.Timer("SeedTimer") >= -1 && !Orion.HaveTarget()){
        Orion.UseType('0x1727');
        if(Orion.InJournal('bitter seed instantly','my')){
          Orion.SetTimer("SeedTimer",-60000*10);
          Orion.ClearJournal();
        }
      }
      Orion.Wait(1000);
    }
    if (Player.Hits() < warcryhits && !Player.Dead() && Orion.SkillValue("bushido","real") > 1000){
      if(Orion.Timer("CryTimer") >= -1 && !Orion.HaveTarget()){
        Orion.Cast("Warcry");
        Orion.Wait(100);
        if(Orion.BuffExists("Warcry")){
          Orion.SetTimer("CryTimer",-60000*20);
        }
      }
      Orion.Wait(1000);
    }
    Orion.Wait(500);
  }
}

function AutoApple() {
  //debuff = ["Corpse Skin","Sleep"]
  while(true){
    if(Orion.BuffExists('Corpse Skin') || Orion.BuffExists('Sleep') || Orion.BuffExists('Mortal Strike')){
      if(Orion.Timer("AppleTimer") >= -1 && !Orion.HaveTarget()){
        Orion.UseType('0x2FD8', '0x0488');
        if(Orion.InJournal('tasty bite of the enchanted','my')){
          Orion.SetTimer("AppleTimer",-30000);
          Orion.ClearJournal();
        }
      }
      Orion.Wait(500);
    }
    Orion.Wait(500);
  }
}

function Use_Nova(){
  Orion.UseType('0x0F09', '0x000D')
  if(Orion.Timer("NovaTimer") >= -1){
    Orion.AddDisplayTimer("10", 120000, "Bottom", "Circle|Bar", "NOVA", 0, 0, '55', 0xFF, '0xFFFFFF');
    Orion.SetTimer("NovaTimer",-120000);
  }
}

function Use_Conflag(){
Orion.UseType('0x0F06', '0xFFFF');
}

//--#Mystic Scripts

function CreateCleaseTrigger(){
    Orion.Cast('686');
    if (Orion.WaitForGump(8000))
    {
        var gump0 = Orion.GetGump('last');
        if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
        {
            gump0.Select(Orion.CreateGumpHook(109));
            Orion.Wait(100);
        }
    }

}

function TriggerTarLT(){
Orion.UseType('0x4079', '0xFFFF');
	Orion.Wait(100);
	if (Orion.WaitForTarget(5000))
		Orion.TargetObject('lasttarget');
}

function CreateTriggerBombard(){
	Orion.Cast('686');
	if (Orion.WaitForGump(10000))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
		{
			gump0.Select(Orion.CreateGumpHook(110));
			Orion.Wait(100);
		}
	}
}
function CreateTriggerClense(){
	Orion.Cast('686');
	if (Orion.WaitForGump(10000))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002336'))
		{
			gump0.Select(Orion.CreateGumpHook(109));
			Orion.Wait(100);
		}
	}
}

function Enchant_Lightning()
{
	Orion.Cast('681');
	if (Orion.WaitForGump(10000))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000F3E91'))
		{
			gump0.Select(Orion.CreateGumpHook(4));
			Orion.Wait(100);
		}
	}
}

//--#Misc

function AddMount()
{
    Orion.AddObject('myMount');
    Orion.Print('-1', 'Target your mount')
}

function MountAndDismount()
{
    if(!Orion.ObjAtLayer('Mount'))
    {
        if(!Orion.FindObject('myMount'))
            AddMount();
        else
            Orion.UseObject('myMount');
    }
    else
        Orion.UseObject('self');
}


function UseGate()
{
    Orion.CancelWaitGump();
    Orion.WaitGump(Orion.CreateGumpHook(1));
    if (!Orion.UseFromGround("0x0F6C|0x4BCB", "-1", 2))
    {
        Orion.CharPrint(self, 1153, "Gate is too far away!");
        Orion.CancelWaitGump();
    }
}

//--#Weapon Equipping

function AutoRearm(){
//Requires a dress group labelled variable below
  doit = false;
  ondisarmonly = false;;
  //You can setup character specific settings there
  if(Player.Name() == "Neo-Terror"){
    ondisarmonly = true;
  }
  var runon = Orion.GetGlobal("doRearm") != 0 ? true : false;
  while(runon){
    prevwep = null;
    runon = Orion.GetGlobal("doRearm") != 0 ? true : false;
    ondisarmonly = Orion.GetGlobal("doRearmOnly") != 0 ? true : false;
    if(Orion.BuffExists("disarm") && Orion.Timer("DisarmTimer") >= -1){
      Orion.SetTimer("DisarmTimer",-4000);
      Orion.AddDisplayTimer("10", 4000, "AboveChar", "Circle|Bar", "Disarm", 0, 0, '55', 0xFF, '0xFFFFFF');
    }
    if((Orion.BuffExists("disarm") || Orion.BuffExists("no rearm")) || !ondisarmonly){
      doit = true
    }
    if(!(Orion.ObjAtLayer('RightHand') || Orion.ObjAtLayer('LeftHand')) && doit){
      wep = Orion.FindObject('PrevWep')
      while(!(Orion.ObjAtLayer('RightHand') || Orion.ObjAtLayer('LeftHand')) && wep){
        if(!Player.Frozen() && !(Orion.BuffExists("disarm") || Orion.BuffExists("no rearm"))){
          Orion.Equip(wep.Serial());
          Orion.Wait(500);
        }
        Orion.Wait(100);
      }
      doit = false;
    }
    if(Orion.ObjAtLayer('RightHand')){
      Orion.AddObject("PrevWep",Orion.ObjAtLayer('RightHand').Serial());
    }
    else if (Orion.ObjAtLayer('LeftHand')){
      Orion.AddObject("PrevWep",Orion.ObjAtLayer('LeftHand').Serial());
    }
    Orion.Wait(400);
  }

}

function ToggleRearm(){

if(Orion.ScriptRunning('AutoRearm')){
  Orion.Terminate('AutoRearm');
  Orion.Print('Terminating Auto-Rearm');
}
else{
  Orion.Print('Starting Auto-Rearm');
  Orion.Exec("AutoRearm");
}
}

function ToggleShield(sname){
  if(Orion.ObjAtLayer('2')){
    DisarmLeftHand();
  }
  else{
    Orion.Dress(sname);
  }

}

function DisarmLeftHand(){  //this is a sub-function for clearing left hand if needed before drinking a potion
	var Lhand = Orion.ObjAtLayer('2');
	if ( Lhand !== null) {
		Orion.Print('disarming left hand');
		Orion.MoveItem( Lhand.Serial(), 'all', 'backpack' );
		Orion.Wait(600);
	}
	else {
		//Orion.Print('nothing in left hand to disarm.');
    Orion.Wait(10);
	}
}

//--#Targetting

function SelectTargetScrolling()
{
    forward = true;
    var lastInd, lastDist, highVal;

    if (Orion.GetGlobal("forward") != String(forward))
    {
        Orion.SetGlobal("forward", String(forward));
        Orion.IgnoreReset();
        Orion.Ignore(Orion.ClientLastTarget());
    }
    typefilter = "live|ignoreself|ignorefriends|";
    if(Orion.RegRead(Player.Name() + "/Human Only") == 1){
      typefilter += "human|";
    }
    notefilter = ""
    if(Orion.RegRead(Player.Name() + "/Blue") == 1){
      notefilter += "blue|";
    }
    if(Orion.RegRead(Player.Name() + "/Green") == 1){
      notefilter += "green|";
    }
    if(Orion.RegRead(Player.Name() + "/Grey") == 1){
      notefilter += "gray|";
    }
    if(Orion.RegRead(Player.Name() + "/Criminal") == 1){
      notefilter += "criminal|";
    }
    if(Orion.RegRead(Player.Name() + "/Orange") == 1){
      notefilter += "orange|";
    }
    if(Orion.RegRead(Player.Name() + "/Red") == 1){
      notefilter += "red|";
    }
    if(Orion.RegRead(Player.Name() + "/Yellow") == 1){
      notefilter += "yellow";
    }
    var highlightLTcolor = Orion.RegRead(Player.Name()+"/TargetHighlight/actualval");
    var highlightcallercolor = Orion.RegRead(Player.Name()+"/CallerHighlight/actualval");
    var highlightcaller = Orion.RegRead(Player.Name()+"/Highlight Caller") != 0 ? true:false;
    for (var i = 0; i < 2; i++)
    {
        var mobArr = Orion.FindType("-1", "-1", ground, typefilter, 18, notefilter);

        if (mobArr.length)
        {
            forward ? (highVal = 18, lastDist = 0) : (highVal = 0, lastDist = 18);

            Orion.GetGlobal("lastDist") == "" ? lastDist = lastDist : lastDist = Number(Orion.GetGlobal("lastDist"));

            for (var ii = 0; ii < mobArr.length; ii++)
            {

                var dist = Orion.GetDistance(mobArr[ii]);

                if (forward && dist <= highVal && dist >= lastDist)
                {
                    highVal = dist;
                    lastInd = ii;
                }
                else if (!forward && dist >= highVal && dist <= lastDist)
                {
                    highVal = dist;
                    lastInd = ii;
                }
            }

            if (lastInd != undefined)
            {
                Orion.SetGlobal("lastDist", highVal);
                Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
                //Orion.ClearHighlightCharacters();

                Orion.ClientLastTarget(mobArr[lastInd]);
                //Orion.TargetSystemSerial(mobArr[lastInd]);
                var currtar = Orion.FindObject(mobArr[lastInd]);
                Orion.CharPrint(Player.Serial(), '48', "Target:[" + currtar.Name()+ "]");
                Orion.SetGlobal("LTHighlight",mobArr[lastInd]);
                Orion.AddHighlightCharacter(mobArr[lastInd], highlightLTcolor,true);
                CurrTarGump(currtar.Name(),currtar.Serial());
                Orion.Ignore(mobArr[lastInd]);
                return;
            }
        }

        if ((!mobArr.length && i == 0) || lastInd == undefined)
        {
            Orion.SetGlobal("lastDist", "");
            Orion.IgnoreReset();
        }
    }

    Orion.Print("No enemies!");
}

function SelectTargetScrollingBlue(forward)
{
    var lastInd, lastDist, highVal;

    if (Orion.GetGlobal("forward") != String(forward))
    {
        Orion.SetGlobal("forward", String(forward));
        Orion.IgnoreReset();
        Orion.Ignore(Orion.ClientLastTarget());
    }

    for (var i = 0; i < 2; i++)
    {
        var mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|human", 18, "blue|grey|criminal");

        if (mobArr.length)
        {
            forward ? (highVal = 18, lastDist = 0) : (highVal = 0, lastDist = 18);

            Orion.GetGlobal("lastDist") == "" ? lastDist = lastDist : lastDist = Number(Orion.GetGlobal("lastDist"));

            for (var ii = 0; ii < mobArr.length; ii++)
            {

                var dist = Orion.GetDistance(mobArr[ii]);

                if (forward && dist <= highVal && dist >= lastDist)
                {
                    highVal = dist;
                    lastInd = ii;
                }
                else if (!forward && dist >= highVal && dist <= lastDist)
                {
                    highVal = dist;
                    lastInd = ii;
                }
            }

            if (lastInd != undefined)
            {
                Orion.SetGlobal("lastDist", highVal);
                Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
                //Orion.ClientLastAttack(mobArr[lastInd]);
                Orion.ClientLastTarget(mobArr[lastInd]);
                //Orion.TargetSystemSerial(mobArr[lastInd]);
                var currtar = Orion.FindObject(mobArr[lastInd]);
                Orion.ClientLastTarget(mobArr[lastInd]);
                Orion.CharPrint(Player.Serial(), '2119', "Target:[" + currtar.Name()+ "]");
                Orion.SetGlobal("LTHighlight",mobArr[lastInd]);
                Orion.AddHighlightCharacter(mobArr[lastInd], '1152',true);
                Orion.AddDisplayTimer(101,30000, 'Top', 'Rectangle|Bar', currtar.Name(), 0, 0, '0xFFFF', 4, 'green');
                Orion.Ignore(mobArr[lastInd]);
                return;
            }
        }

        if ((!mobArr.length && i == 0) || lastInd == undefined)
        {
            Orion.SetGlobal("lastDist", "");
            Orion.IgnoreReset();
        }
    }

    Orion.Print("No enemies!");
}


function TargetNearestEnemy()
{

    var mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|human|near", 20, "orange");

    if (mobArr.length)
    {
          Orion.ClearHighlightCharacters(true);

          //Orion.ClientLastAttack(mobArr[lastInd]);
          var currtar = Orion.FindObject(mobArr[0]);
          Orion.ClientLastTarget(currtar.Serial());
          Orion.CharPrint(Player.Serial(), '48', "Target:[" + currtar.Name()+ "]");
          Orion.SetGlobal("LTHighlight",mobArr[0]);
          Orion.AddHighlightCharacter(mobArr[0], '1152',true);
          Orion.AddDisplayTimer(101,30000, 'Top', 'Rectangle|Bar', currtar.Name(), 0, 0, '0xFFFF', 4, 'green');
          //Orion.Ignore(mobArr[lastInd]);
          Orion.Attack(mobArr[0]);
      }
}

function TargetNearestCreature()
{

    var mobArr = Orion.FindTypeEx("-1", "-1", "ground", "live|mobile|ignoreself|ignorefriends", 15, "gray|criminal|red");
    attacktar = null;
    if (mobArr.length)
    {
      if(Array.isArray(mobArr)){
        attacktar = mobArr[0];
        //Orion.Print(attacktar.Name() + " " + attacktar.Distance())
        for(var i =0; i < mobArr.length;i++){
          //Orion.Print(Orion.GetDistance(mobArr[i]));
          //if(Orion.FindObject(mobArr[i])){
            //pot = Orion.FindObject(mobArr[i]);
            //if(Orion.GetDistance(mobArr[i]) <= 1 && pot.Name() != ""){
            //  attacktar = mobArr[i];
              //break;
            //}

            if(mobArr[i].Distance() < attacktar.Distance()){
              //Orion.Print(mobArr[i].Distance() + " " + attacktar.Distance())
              attacktar = mobArr[i];
            }
          //}
          Orion.Wait(10);
        }
      }
      else{
        attacktar = mobArr;
      }
      if(Orion.FindObject(attacktar.Serial())){
        Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
        //Orion.ClientLastAttack(mobArr[lastInd]);
        Orion.ClientLastTarget(attacktar.Serial());
        Orion.Attack(attacktar.Serial());
        var currtar = attacktar;
        Orion.CharPrint(Player.Serial(), '48', "Target:[" + currtar.Name() + "]");
        Orion.SetGlobal("LTHighlight",attacktar.Serial());
        Orion.AddHighlightCharacter(attacktar.Serial(), '1152',true);
        //Orion.AddDisplayTimer(101,30000, 'Top', 'Rectangle|Bar', currtar.Name(), 0, 0, '0xFFFF', 4, 'green');
        //Orion.Ignore(mobArr[lastInd]);

        return attacktar;
      }
    }
    else{
      Orion.Print("No enemies.");
      return false;

    }

}

function FindHurtAlly(){
  var allycolor = Orion.RegRead(Player.Name()+"/HealHighlight/actualval");
  var callercolor = Orion.RegRead(Player.Name()+"/CallerHighlight/actualval");
  var dolead = Orion.RegRead(Player.Name()+"/Highlight Caller");
  Orion.Ignore(self); //the find flag ignoreself doesn't work...
  fulllist = '';
  findfriend = Orion.GetFriendList();
  guildArr = Orion.FindType("-1", "-1", 'ground', "live|ignoreself|ignorefriends", 20, "green");

  fulllist = guildArr.concat(findfriend);
  healtar = null;
  //Orion.Print(findfriend.length + " " + guildArr.length + " " + fulllist.length)
  for (var i = 0; i < fulllist.length; i++){
    if(healtar == null && Orion.FindObject(fulllist[i])){
      temptar = Orion.FindObject(fulllist[i]);
      healtar = temptar;
      //Orion.Print(temptar.Name())
    }
    else{
      if(Orion.FindObject(fulllist[i])){
        temptar = Orion.FindObject(fulllist[i]);
        Orion.GetStatus(temptar.Serial());
        Orion.GetStatus(healtar.Serial());
        //Orion.Print(temptar.Name() && healtar.Name())
        if (temptar.Hits() < healtar.Hits()){
          healtar = temptar;
        }
      }
    }
  }
  if (healtar && Orion.FindObject(healtar.Serial()) && Orion.FindObject(healtar.Serial()).Hits() < Orion.FindObject(healtar.Serial()).MaxHits()){
    Orion.ClientLastTarget(healtar.Serial());
    //Orion.TargetSystemSerial(healtar.Serial());
    Orion.CharPrint(self,2128,"Healing: " + healtar.Name());
    Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
    if(dolead == 1 && Orion.GetGlobal("LeadHighlight") == Number(Orion.GetGlobal("LTHighlight"))){
      Orion.AddHighlightCharacter(Orion.GetGlobal("LeadHighlight"),callercolor,true);
    }
    Orion.SetGlobal("LTHighlight",healtar.Serial());
    Orion.AddHighlightCharacter(healtar.Serial(),allycolor,true);
    //1161 = Blaze fire, 1153 = white,Glacial=1152
    if(Orion.GetDistance(healtar.Serial()) <= 10){
      Orion.TargetObject(healtar.Serial());
    }
  }
  else {
    Orion.CharPrint(self,'2128',"No Injured Ally")
    //Orion.Print(healtar.Name());
  }
}

//--#Healing

function AutoHealing()
{
    var msg = "You finish applying the bandages|You have been cured of all poisons|You apply the bandages";
    while (Orion.Count("bandage") && !Player.Dead())
    {
        if (Player.Hits() < Player.MaxHits())
        {
            Orion.CreateClientMacro("BandageSelf").Play();
            Orion.WaitJournal(msg, Orion.Now(), Orion.Now() + 20000, "sys");
            Orion.Wait(100);
        }
        else
        {
            Orion.Wait(100);
        }
    }
    if (!Player.Dead())
    {
        Orion.CharPrint(self, 1153, "-- no bandages left --");
    }
}

function MasterObserver(){
	var bandageGOING = false;
	while (!Player.Dead()) {
		if ( Player.Hits() < Player.MaxHits() ) {
			if ( bandageGOING == false ) {
				Orion.CharPrint(self,2119,'Apply a Bandage!');
				//Orion.Exec('BandageTimer');
			}
		}
		Orion.Wait(500);
		if (Orion.InJournal('begin applying', 'sys') ) {
			Orion.ClearJournal();
			bandageGOING = true;
			Orion.CharPrint(self, '906', 'Bandage Started.')
		}
		if (Orion.InJournal('finish applying | barely help | You have been cured', 'sys') ) {
			Orion.ClearJournal();
			Orion.CharPrint(self, '906', 'Bandage Finished.')
			bandageGOING = false;
			Orion.Terminate('BandageTimer');
		}
	}
}

function MasterObserverWBandageTimer(){
	var bandageGOING = false;
	while (!Player.Dead()) {
		if ( Player.Hits() < Player.MaxHits() ) {
			if ( bandageGOING == false ) {
				Orion.CharPrint(self,2119,'Apply a Bandage!');
				Orion.Exec('BandageTimer');
			}
		}
		Orion.Wait(500);
		if (Orion.InJournal('begin applying', 'sys') ) {
			Orion.ClearJournal();
			bandageGOING = true;
			Orion.CharPrint(self, '906', 'Bandage Started.')
		}
		if (Orion.InJournal('finish applying | barely help | You have been cured', 'sys') ) {
			Orion.ClearJournal();
			Orion.CharPrint(self, '906', 'Bandage Finished.')
			bandageGOING = false;
			Orion.Terminate('BandageTimer');
		}
	}
}

function BandageTimer() {
	Orion.CreateClientMacro('BandageSelf').Play();
	Orion.Wait(1000);
	var seconds = 1;
	while ( !Orion.InJournal('finish applying | barely help', 'sys') ) {
	    	Orion.CharPrint(self, '906', '-- ' + seconds + ' --');
      	Orion.Wait(1000);
      	++seconds;
	}
}

function BandageSelfNOtarget() {
	Orion.CreateClientMacro('BandageSelf').Play();

}

//--#Organizer

function NovaKegEmpty(){
  //ID Keg - 0x1940
  //ID Pot - 0x0F09
  //Color - 0x000D
  Orion.CharPrint(Player.Serial(),'906',"Click box/bag with Nova/Stat Kegs and empty bottles.")
  Orion.WaitForAddObject('NovaKegBox', '10000');
  //Orion.WaitTargetObject(5000);
  //Orion.Wait(5000);
  Orion.CharPrint(Player.Serial(),'906',"Click box/bag to stack Nova/Stat Pots.")
  //Orion.WaitTargetObject(5000);
  Orion.WaitForAddObject('NovaPotBox', '10000');
  if(true){

    Orion.OpenContainer("NovaKegBox");
    Orion.Wait(1100);
    Orion.OpenContainer("NovaPotBox");
    Orion.Wait(1100);
    kegbox = Orion.FindObject("NovaKegBox");
    novabox = Orion.FindObject("NovaPotBox");
    kegs =  Orion.FindTypeEx('0x1940', '0x000D|0x09C4', kegbox.Serial());
    Orion.Print("Kegs: " + kegs.length);
    for(var i = 0;i<kegs.length;i++){
      numpots = 0;
      var properties = kegs[i].Properties();
      var pattern = new RegExp("Potions\\: (\\d+)","g");

      var matches = pattern.exec(properties);
      if(matches && Number(matches[1]) > 0){
        numpots = Number(matches[1])
      }
      //Making sure there are enough Bottles
      boxbottles =  Orion.FindTypeEx('0x0F0E', '0x0000', kegbox.Serial());
      packbottles = Orion.Count('0x0F0E', '0x0000', 'backpack');
      if(packbottles < 30 && boxbottles[0]){
        Orion.MoveItem(boxbottles[0].Serial(), 30, 'backpack');
        Orion.Wait(1100);
      }
      Orion.MoveItem(kegs[i].Serial(), 30, 'backpack');
      Orion.Wait(1100);
      //Emptying Keg into bottles
      for(j=0;j<numpots;j++){
        Orion.Wait(1100);
        Orion.UseObject(kegs[i].Serial());
      }
      Orion.Wait(1100);
      packnovas = Orion.FindType('0x0F09', '0x000D|0x09C4', 'backpack');
      Orion.Print("Novas/Stats in pack: "+ packnovas.length);
      if(packnovas.length >= 20){
        for(j=0;j<packnovas.length;j++){
          Orion.MoveItem(packnovas[j], '0', novabox.Serial());
          Orion.Wait(1100);
        }
      }
    }
    packnovas = Orion.FindType('0x0F09', '0x000D|0x09C4', 'backpack');
    Orion.Print("Novas/Stats in pack: "+ packnovas.length);
    if(packnovas.length >= 0){
      for(j=0;j<packnovas.length;j++){
        Orion.MoveItem(packnovas[j], '0', novabox.Serial());
        Orion.Wait(1100);
      }
    }
  }

}

function GrabItem() {
	//OpenCorpse();
	if (!Orion.HaveTarget() )
	{
		var toMove = Orion.FindObject('toMove');
		if( toMove !== null | toMove !== 0 )
		{
			Orion.RemoveObject('toMove');
		}
		Orion.Print( '-1', 'Target something to grab.');
		Orion.AddObject('toMove');
		while(Orion.HaveTarget())
		{
			Orion.Wait('50');
		}
		toMove = Orion.FindObject('toMove');
		if ( toMove !== null ) {
			Orion.MoveItem( toMove.Serial(), 'all' , backpack);
		}
	}
}

function OrganizeFromList(frombag, tobag, listname, amount) {  //sub function for moving items around
	var item = Orion.FindList(listname, frombag);
	if ( item !== null ) {
		Orion.CharPrint('self', '906', 'moving items');
		for (var i = 0; i < item.length; i++) {
			Orion.MoveItem(item[i], amount, tobag);
			Orion.Wait(700);
		}
	}
	else
		Orion.CharPrint('self', '906', 'item not found');
}



function OrganizeToBackpack(listname, amount) {
	var frombag = Orion.FindObject('fromBag');
	if( frombag !== null | frombag !== 0 )
	{
		Orion.RemoveObject('fromBag');
	}
	Orion.Print( '-1', 'Target container to move to.');
	Orion.AddObject('fromBag');
	while(Orion.HaveTarget())
	{
		Orion.Wait('50');
	}
	frombag = Orion.FindObject('fromBag');
	if ( frombag !== null ) {
		OrganizeFromList( frombag.Serial(), backpack, listname, amount);
	}
}

function OrganizeFromBackpack(listname, amount) {
	var tobag = Orion.FindObject('toBag');
	if( tobag !== null | tobag !== 0 )
	{
		Orion.RemoveObject('toBag');
	}
	Orion.Print( '-1', 'Target container to move from.');
	Orion.AddObject('toBag');
	while(Orion.HaveTarget())
	{
		Orion.Wait('50');
	}
	tobag = Orion.FindObject('toBag');
	if ( tobag !== null ) {
		OrganizeFromList( backpack, tobag.Serial(), listname, amount);
	}
}

function OrganizeThisToThat(listname, amount) {
	Orion.RemoveObject('MoveFrom');
	Orion.RemoveObject('MoveTo');

	if (!Orion.FindObject('MoveFrom') ) {
		Orion.CharPrint('self', '906', 'select move from bag');
		Orion.AddObject('MoveFrom');
		WaitForPlayerToTarget();
	}
	if (!Orion.FindObject('MoveTo') ) {
		Orion.CharPrint('self', '906', 'select move to bag');
		Orion.AddObject('MoveTo');
		WaitForPlayerToTarget();
	}
	if ( 'MoveFrom' !== null && 'MoveTo' !== null ) {
		OrganizeFromList( 'MoveFrom', 'MoveTo', listname, amount);
	}
}

//--#PVP Toolkit

function StarDartThrow(){
  var thetarg = Orion.ClientLastTarget();
  starbeltarr = Orion.FindTypeEx('0x2790', 'any', 'backpack');
  starbelt = null;
  for(var i =0;i<starbeltarr.length;i++){
    if(Orion.Contains(starbeltarr[i].Properties(),"Deadly Poison")){
      starbelt = starbeltarr[i];
      break;
    }
  }
  dartbeltarr = Orion.FindTypeEx('0x27AA', 'any', 'backpack');
  dartbelt = null;
  for(var i =0;i<dartbeltarr.length;i++){
    if(Orion.Contains(dartbeltarr[i].Properties(),"Deadly Poison")){
      dartbelt = dartbeltarr[i];
      break;
    }
  }
  if (dartbelt != null && Orion.Timer("DartTimer") >= -1 && Orion.GetDistance('lasttarget') <=5){
    Orion.UseObject(dartbelt.Serial())
    Orion.WaitForTarget(1500)
    Orion.TargetObject(thetarg)
    Orion.SetTimer("DartTimer",-5000);
    }
  else if (starbelt != null && Orion.GetDistance('lasttarget') <=10 && Orion.GetDistance('lasttarget') >=3)    {
    Orion.UseObject(starbelt.Serial())
    Orion.WaitForTarget(1500)
    Orion.TargetObject(thetarg)
    }
  else if (Orion.GetDistance('lasttarget') >10){
    Orion.CharPrint(self,55,'Out of Range')
    }
  if(dartbelt == null){
    Orion.Print("You are out of DP'd darts");
  }
  if(starbelt == null){
    Orion.Print("You are out of DP'd star belts");
  }
}

function StarDartThrowOJPet(){
  var thetarg = Orion.FindTypeEx('any', '-1', 'ground', 'ignoreself|ignorefriends|nothuman|live', '30', 'orange');
  if(thetarg.length == 0){
    Orion.Print("No OJ pets around!")
  }
  else{
    thetarg = thetarg.Serial()
    starbeltarr = Orion.FindTypeEx('0x2790', 'any', 'backpack');
    starbelt = null;
    for(var i =0;i<starbeltarr.length;i++){
      if(Orion.Contains(starbeltarr[i].Properties(),"Deadly Poison")){
        starbelt = starbeltarr[i];
        break;
      }
    }
    dartbeltarr = Orion.FindTypeEx('0x27AA', 'any', 'backpack');
    dartbelt = null;
    for(var i =0;i<dartbeltarr.length;i++){
      if(Orion.Contains(dartbeltarr[i].Properties(),"Deadly Poison")){
        dartbelt = dartbeltarr[i];
        break;
      }
    }
    if (dartbelt != null && Orion.Timer("DartTimer") >= -1 && Orion.GetDistance('lasttarget') <=5){
      Orion.UseObject(dartbelt.Serial())
      Orion.WaitForTarget(1500)
      Orion.TargetObject(thetarg)
      Orion.SetTimer("DartTimer",-5000);
      }
    else if (starbelt != null && Orion.GetDistance('lasttarget') <=10 && Orion.GetDistance('lasttarget') >=3)    {
      Orion.UseObject(starbelt.Serial())
      Orion.WaitForTarget(1500)
      Orion.TargetObject(thetarg)
      }
    else if (Orion.GetDistance('lasttarget') >10){
      Orion.CharPrint(self,55,'Out of Range')
      }
    if(dartbelt == null){
      Orion.Print("You are out of DP'd darts");
    }
    if(starbelt == null){
      Orion.Print("You are out of DP'd star belts");
    }
  }
}

function StarDartLoad(){
  //0x0F0A = DP
  starbeltarr = Orion.FindTypeEx('0x2790', 'any', 'backpack');
  stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
  for(var i =0;i<stararr.length;i++){
    poisons = Orion.FindTypeEx('0x0F0A', 'any', 'backpack');
    if(poisons.length == 0){
      Orion.Print("You need to grab DP pots");
    }
    else if(Orion.Contains(stararr[i].Properties(),"Uses Remaining: 10") && !Orion.Contains(stararr[i].Properties(),"Deadly")){
      stars = stararr[i];
      Orion.UseSkill("Poisoning");
      Orion.WaitForTarget(1000);
      Orion.TargetObject(poisons[0].Serial())
      Orion.WaitForTarget(1000);
      Orion.TargetObject(stars.Serial());
      if(i != stararr.length-1){
        Orion.Wait(11000);
      }
    }
    else if(!Orion.Contains(stararr[i].Properties(),"Uses Remaining: 10")){
      Orion.Print("You have stars in your pack that could mess shit up.")
      Orion.Print("Make sure you only have clean or DP'd stacks of 10.")
      Orion.Print("Dropping the shitty star to ground.")
      Orion.MoveItem(stararr[i].Serial(), -1, 'ground', Player.X(), Player.Y()+1);
      Orion.Wait(1000);
      stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
      i=0;
    }
  }
  for(var i =0;i<starbeltarr.length;i++){
    if(Orion.Contains(starbeltarr[i].Properties(),"Uses Remaining: 0")){
      stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
      starbelt = starbeltarr[i];
      Orion.RequestContextMenu(starbelt.Serial());
    	Orion.WaitContextMenuID(starbelt.Serial(), 701);
    	if (Orion.WaitForTarget(1000))
    		Orion.TargetObject(stararr[0].Serial());
    }
  }
Orion.Print("All done!");
}

function EquipSpellbookRes(){
  bookdress = "mage_book";
  Orion.Dress(bookdress);
  Orion.Wait(500);
  Orion.Cast("Resurrection");
  Orion.Wait(500);
}



function SpamAttackLast() {
    while (!Player.Dead()) {
      targ = Orion.ClientLastTarget();
      targ = Orion.FindObject(targ);
      friendlist = Orion.GetFriendList();
      if(!Orion.HaveTarget() && targ && targ.Notoriety() != "2" && friendlist.indexOf(targ.Serial()) == -1){
        Orion.Attack(targ.Serial());
        Orion.CharPrint(self, 55, 'Attacking Last');
        Orion.Wait(1000);
      }
      Orion.Wait(100);
    }
}

function PVPLooter(){
  findids = [
    ["0x0F09","0x09C4"], //Stat Pots
    ["0x0F09","0x000D"], //Nova's
    ["0x09A9","-1"] //Trapped box
  ]
  bodid = 0;
  body = Orion.FindTypeEx('any', 'any', 'ground', 'item', '1');
  //Orion.Print(body.length + "prop:"+ body[0].Properties())
  if(body.length >0){
    if(body.length >1){
      for(var i = 0;i < body.length;i++){
        if(body[i].Properties().indexOf('Corpse') != -1){
          bodid = i;
          break;
        }
      }
    }
    Orion.OpenContainer(body[bodid].Serial());
    Orion.Wait(1100);
    for(var i=0; i < findids.length;i++){
      loot = Orion.FindTypeEx(findids[i][0], findids[i][1], body[bodid].Serial(),'item','2','any',true);
      //Orion.Print("i=" + i + "/ " + loot.length)
      if(loot.length > 0){
        for(var j = 0; j < loot.length; j++){
          Orion.DragItem(loot[j].Serial());
          Orion.Wait(100);
          Orion.DropDraggedItem();
          Orion.Wait(1100);
        }
      }
    }
  }
  else{
    Orion.CharPrint(Player.Serial(), '48', "No corpse found!");
  }
}


function AutoCounterAttack(){
  Orion.SetGlobal("AutoCA",'true');
  while(true && Orion.SkillValue("Bushido") > 1000){
    if(Orion.GetGlobal("AutoCA") == 'true' && !Player.Hidden() && !Orion.BuffExists("Counter Attack") && !Orion.HaveTarget() && Player.Mana() > 50 && Player.WarMode()){
      Orion.Cast("Counter Attack");
    }
    Orion.Wait(500);
  }
}

function AutoCouterAttackToggle(){
  if(Orion.GetGlobal("AutoCA") == 'true'){
    Orion.Print("Turing auto Counter Attack off.");
    Orion.SetGlobal("AutoCA","false");
    Orion.Terminate("AutoCounterAttack");
  }
  else {
    Orion.SetGlobal("AutoCA","true");
    Orion.Print("Turing auto Counter Attack ON.");
    Orion.Exec("AutoCounterAttack");
  }
}

function DismountSecondary()
{
  if(Orion.ObjAtLayer('Mount'))
  {
    Orion.UseObject('self');
  	Orion.Wait(100);
  	Orion.UseAbility('secondary');
  	Orion.Wait(100);
  	Orion.Attack('lasttarget');
  }
  else{
    Orion.UseObject("MyMount");
  }
}


function Sleep_Disarm()
{
  var dmountdist = 3;
  var myTarget = Orion.FindObject(Orion.ClientLastTarget());
  if (myTarget){
    var range = Orion.GetDistance(myTarget.Serial());
    Orion.CharPrint(self,'2128',"Ready to sleep...")
  }
    while(range > dmountdist && Orion.HaveTarget()){
      Orion.Wait(100);
      range = Orion.GetDistance(myTarget.Serial());
    }
    if(range <= dmountdist  && Orion.HaveTarget()){
            Orion.TargetObject("lasttarget");
            Orion.Wait(50);
            Orion.UseAbility('Secondary', 'true');
            Orion.Attack(myTarget.Serial());
    }
}

function Sleep_Bash()
{
  var dmountdist = 3;
  var myTarget = Orion.FindObject(Orion.ClientLastTarget());
  if (myTarget){
    var range = Orion.GetDistance(myTarget.Serial());
    Orion.CharPrint(self,'2128',"Ready to sleep...")
  }
    while(range > dmountdist && Orion.HaveTarget()){
      Orion.Wait(100);
      range = Orion.GetDistance(myTarget.Serial());
    }
    if(range <= dmountdist  && Orion.HaveTarget()){
            Orion.TargetObject("lasttarget");
            Orion.Wait(100);
            //Orion.UseAbility('Secondary', 'true');
            //Orion.Attack(myTarget.Serial());
            ShieldBash('wep_glendashield');
            Orion.Wait(100);
            Orion.Attack(myTarget.Serial());
    }
}


function Dachi_Dismount()
{
  var dmountdist = 2;
  var myTarget = Orion.FindObject(Orion.ClientLastTarget());
  if (myTarget){
    var range = Orion.GetDistance(myTarget.Serial());
    Orion.CharPrint(self,'2128',"Ready to dismount...")}
    while(range > dmountdist){
      Orion.Wait(100);
      range = Orion.GetDistance(myTarget.Serial());
    }
    if(range <= dmountdist){
            Orion.UseObject('self');
            Orion.Wait(50);
            Orion.UseAbility('Secondary', 'true');
            Orion.Attack(myTarget.Serial());
    }
}

function AbilityToggle(abil,auto){
  if(abil == "primary"){
    prevsabil = Orion.GetGlobal("SelAbil");
    Orion.SetGlobal("SelAbil","Primary");
  }
  else{
    prevsabil = Orion.GetGlobal("SelAbil");
    Orion.SetGlobal("SelAbil","Secondary");
  }
  if(auto == "true"){
    if(Orion.GetGlobal("AutoAbil") == 'true'){
      Orion.SetGlobal("AutoAbil","false");
      Orion.UseAbility(prevsabil,"false");
    }
    else{
      Orion.SetGlobal("AutoAbil","true");
    }
  }
  else{
    Orion.SetGlobal("AutoAbil","false");

  }
  Orion.SetGlobal("AbilDoOnce","true");
}

function AutoAbility(){
  var doAbility = Orion.GetGlobal("doAbility");
  while(doAbility == 1){
    doAbility = Orion.GetGlobal("doAbility");
    abil = Orion.GetGlobal("SelAbil");
    auto = Orion.GetGlobal("AutoAbil");
    doonce = Orion.GetGlobal("AbilDoOnce");

    manacost = 10;
    if(Orion.Timer("SpecialUsed") > 0){
      manacost = manacost *2;
    }
    if(auto == 'false' && doonce == 'true'){
      Orion.UseAbility(abil);
      Orion.SetTimer("SpecialUsed",-3050);
    }
    else if (auto == 'true' && !Orion.AbilityStatus(abil) && Player.Mana() > manacost){
      while(Player.Frozen() || Orion.HaveTarget() && !Player.Frozen()) {
        Orion.Wait(100);
      }
      if(!Player.Dead()){
        Orion.UseAbility(abil,"true");
        Orion.SetTimer("SpecialUsed",-3050);
      }
      Orion.Wait(200);
    }

    Orion.SetGlobal("AbilDoOnce","false");
    Orion.Wait(200);
  }
}

function DisarmShieldEvade(){
  if(Orion.ObjAtLayer('RightHand') && Orion.ObjAtLayer('LeftHand')){
    DisarmLeftHand();
  }
  Orion.Wait(50)
  if(Orion.ObjAtLayer('RightHand') || Orion.ObjAtLayer('LeftHand')){
    Orion.Cast('Evasion');
    if(!Orion.DisplayTimerExists("10")){
      Orion.AddDisplayTimer("10", 26000, "AboveChar", "Circle|Bar", "Evade", 0, 0, '55', 0xFF, '0xFFFFFF');
    }
  }
}

function EvadeTimer(){
  Orion.Wait(50)
  if(Orion.ObjAtLayer('RightHand') || Orion.ObjAtLayer('LeftHand')){
    Orion.Cast('Evasion');
    if(!Orion.DisplayTimerExists("10")){
      Orion.AddDisplayTimer("10", 26000, "AboveChar", "Circle|Bar", "Evade", 0, 0, '55', 0xFF, '0xFFFFFF');
    }
  }
}

function ShieldBash(set){
  Orion.Dress('wep_glendashield')
	Orion.Wait(100);
  Orion.Cast("Shield Bash");
  Orion.AddDisplayTimer("bashtimer", 3500, "UnderChar", "Circle|Bar", "Shield Bash", 0, 0, '55', 0xFF, '0xFFFFFF');
}

function WrestleBash(){
  var dmountdist = 2;
  var myTarget = Orion.FindObject(Orion.ClientLastTarget());
  if (myTarget){
    var range = Orion.GetDistance(myTarget.Serial());
    Orion.CharPrint(self,'2128',"Ready to bash...")
  }
    while(range > dmountdist){
      Orion.Wait(100);
      range = Orion.GetDistance(myTarget.Serial());
    }
    if(range <= dmountdist){
            Orion.Cast("Shield Bash");
            Orion.Wait(50);
            Orion.Attack(myTarget.Serial());
            //Orion.UseAbility('Secondary', 'true');

    }
}

function tele()
{
    var value = 10;
    var empty = 0;

    var offset =
    [
        [empty, -value],        //direction = 0
        [value, -value],        //direction = 1
        [value, empty],     //direction = 2
        [value, value],     //direction = 3
        [empty, value],     //direction = 4
        [-value, value],        //direction = 5
        [-value, empty],        //direction = 6
        [-value, -value]        //direction = 7
    ];

    //var xy = offset[Player.Direction() & 10];
    var dire;
    if (Player.Direction()>7){
      dire = Player.Direction() - 128;
    }
    else{
      dire = Player.Direction();
    }

    if(!Orion.HaveTarget()){
    Orion.WaitTargetTileRelative('land', offset[dire][0],offset[dire][1], Player.Z());
    Orion.Cast("Teleport");
  }
  else{
    Orion.TargetTileRelative('land', offset[dire][0],offset[dire][1], Player.Z());
  }
}

function scrolltele()
{
    var value = 10;
    var empty = 0;

    var offset =
    [
        [empty, -value],        //direction = 0
        [value, -value],        //direction = 1
        [value, empty],     //direction = 2
        [value, value],     //direction = 3
        [empty, value],     //direction = 4
        [-value, value],        //direction = 5
        [-value, empty],        //direction = 6
        [-value, -value]        //direction = 7
    ];

    //var xy = offset[Player.Direction() & 10];
    var dire;
    if (Player.Direction()>7){
      dire = Player.Direction() - 128;
    }
    else{
      dire = Player.Direction();
    }

    if(!Orion.HaveTarget()){
    Orion.WaitTargetTileRelative('land', offset[dire][0],offset[dire][1], Player.Z());
    Orion.UseType('0x1F42', '0xFFFF');
  }
  else{
    Orion.TargetTileRelative('land', offset[dire][0],offset[dire][1], Player.Z());
  }
}

function DispelFieldInFront()
{
    if (!Orion.HaveTarget() && !Player.Frozen()) {
      Orion.Cast("Dispel Field");
    }
    var field, fieldObject, index, fieldIndex;
    var tile =
    [
        [Player.X(), Player.Y() - 1],
        [Player.X() + 1, Player.Y() - 1],
        [Player.X() + 1, Player.Y()],
        [Player.X() + 1, Player.Y() + 1],
        [Player.X(), Player.Y() + 1],
        [Player.X() - 1, Player.Y() + 1],
        [Player.X() - 1, Player.Y()],
        [Player.X() - 1, Player.Y() - 1]
    ];
    field = Orion.FindType("0x0082|0x3967|0x0080|0x3956|0x3922", "-1", "ground", "item", 1);
    if (field.length != 0)
    {
        for (index = 0; index < tile.length; index++)
        {
            if (Player.Direction() == index || Player.Direction() == (index + 128))
            {
                for (fieldIndex = 0; fieldIndex < field.length; fieldIndex++)
                {
                    fieldObject = Orion.FindObject(field[fieldIndex]);
                    if (fieldObject.X() == tile[index][0] && fieldObject.Y() == tile[index][1])
                    {
                      if (!Orion.HaveTarget() && !Player.Frozen()) {
                        Orion.WaitTargetObject(fieldObject.Serial());
                        Orion.Cast("Dispel Field");
                        return;
                      }
                      else {
                        Orion.TargetObject(fieldObject.Serial());

                      }
                    }
                }
                Orion.CharPrint(self, 1153, "Before me there are no fields!")
                break;
            }
        }
    }
}

function AutoBarPopulate() {

    var players = [Player.Serial()];

    var offsetPlayersX = 30;
    var offsetPlayersY = 530;

    var ogFriendsX = Number(Orion.RegRead(Player.Name()+"/FriendX"));
    var ogFriendsY = Number(Orion.RegRead(Player.Name()+"/FriendY"));
    var offsetFriendsX = Number(Orion.RegRead(Player.Name()+"/FriendX"));
    var offsetFriendsY = Number(Orion.RegRead(Player.Name()+"/FriendY"));
    var numFriends = 0;

    var offsetEnemiesX = Number(Orion.RegRead(Player.Name()+"/OJX"));
    var offsetEnemiesY = Number(Orion.RegRead(Player.Name()+"/OJY"));
    var ogEnemiesX = Number(Orion.RegRead(Player.Name()+"/OJX"));
    var ogEnemiesY = Number(Orion.RegRead(Player.Name()+"/OJY"));
    var numEnemies = 0;

    var tempsplit = Orion.RegRead(Player.Name()+"/barspace/actualval"); //60 for standard bars, 40? for Sallos
    tempsplit = tempsplit.split("|");
    var stepY = Number(tempsplit[0]); //60 for standard bars, 40? for Sallos
    var stepX = Number(tempsplit[1]);  //153 for classic, 130 sallos
    var barsperrow = Number(Orion.RegRead(Player.Name()+"/barsper/actualval"));

    var mobArr = [];
    var popArr = [];
    var guildArr  = [];
    var guildpopArr = [];
    Orion.SetGlobal("BarClear",'false');
    Orion.SetGlobal("doPullbars",1);

    while(Orion.GetGlobal("doPullbars") == 1){
        mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|human", 25, "gray|orange");
        guildArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|human", 25, "green");
        fullArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|human", 25);
        var friends = Orion.GetFriendList();
        var enemies = Orion.GetEnemyList();
        for (var i = 0; i < friends.length; i++)
        {
            if(fullArr.indexOf(friends[i]) != -1 && guildpopArr.indexOf(friends[i]) == -1){
              //Orion.Print(offsetFriendsX + " | " + offsetFriendsY);
                Orion.ShowStatusbar(friends[i], offsetFriendsX, offsetFriendsY);
                guildpopArr.push(friends[i]);
                numFriends++;
                if(numFriends % barsperrow == 0){
                  offsetFriendsY = ogFriendsY;
                  offsetFriendsX += -1*stepX;
                }
                else{
                  offsetFriendsY += stepY;
                }
            }
        }
        for (var i = 0; i < guildArr.length; i++)
        {
            if(guildpopArr.indexOf(guildArr[i]) == -1)
            {
              //Orion.Print(offsetFriendsX + " | " + offsetFriendsY);
              Orion.ShowStatusbar(guildArr[i], offsetFriendsX, offsetFriendsY);
              guildpopArr.push(guildArr[i]);
              numFriends++;
              if(numFriends % barsperrow == 0){
                offsetFriendsY = ogFriendsY;
                offsetFriendsX += -1*stepX;
              }
              else{
                offsetFriendsY += stepY;
              }
        	}
        }
        for (var i = 0; i < mobArr.length; i++){
          if(popArr.indexOf(mobArr[i]) == -1){
            Orion.ShowStatusbar(mobArr[i], offsetEnemiesX, offsetEnemiesY);
            popArr.push(mobArr[i]);
            numEnemies++;
            if(numEnemies % barsperrow == 0){
              offsetEnemiesY = ogEnemiesY;
              offsetEnemiesX += stepX;
            }
            else{
              offsetEnemiesY += stepY;
            }
        	}
        }
        for (var i = 0; i < enemies.length; i++)
        {
          if(fullArr.indexOf(enemies[i]) != -1 && popArr.indexOf(enemies[i]) == -1){
            Orion.ShowStatusbar(enemies[i], offsetEnemiesX, offsetEnemiesY);
            popArr.push(enemies[i]);
            numEnemies++;
            if(numEnemies % barsperrow == 0){
              offsetEnemiesY = ogEnemiesY;
              offsetEnemiesX += stepX;
            }
            else{
              offsetEnemiesY += stepY;
            }
          }
        }
    Orion.Wait(1000);
    if(Orion.GetGlobal('BarClear') == 'true'){
        for (var i = 0; i < popArr.length; i++)
        {
            Orion.CloseStatusbar(popArr[i]);
        }
        popArr = [];
        for (var i = 0; i < guildpopArr.length; i++)
        {
            Orion.CloseStatusbar(guildpopArr[i]);
        }
        guildpopArr = [];
        Orion.SetGlobal("BarClear",'false');
        var offsetFriendsX = Orion.RegRead(Player.Name()+"/FriendX");
        var offsetFriendsY = Orion.RegRead(Player.Name()+"/FriendY");
        var offsetEnemiesX = Orion.RegRead(Player.Name()+"/OJX");
        var offsetEnemiesY = Orion.RegRead(Player.Name()+"/OJY");
    }
    Orion.Wait(100);
    }
}

function ClearBars(){
    Orion.SetGlobal("BarClear",'true');
}
function ToggleAutoBars(){
    if(Orion.GetGlobal("doPullbars") == 1){
        Orion.SetGlobal("BarClear",'true');
        Orion.SetGlobal("doPullbars",0);
        Orion.RegWrite(Player.Name()+"/Auto Bar Pulling",0)
        Orion.Print("Stopping Auto Bars.");
    }
    else {
        Orion.SetGlobal("doPullbars",1);
        Orion.RegWrite(Player.Name()+"/Auto Bar Pulling",1)
        Orion.Print("Starting Auto Bars.");
        AutoBarPopulate();
    }
}

function CatchSerial(){

  highlightcaller = true;
  highlightcallercolor = "1092";
  highlightLTcolor = '1152';

  Orion.ClearHighlightCharacters(true);
  Orion.SetGlobal("SerialCatch","true")
  while(Orion.GetGlobal("SerialCatch") == "true"){
    var caught = Orion.WaitJournal("R;",Orion.Now(),0,0,0,"0x03B2");
    var caughtobj = caught;
    var highlightLTcolor = Orion.RegRead(Player.Name()+"/TargetHighlight/actualval");
    var highlightcallercolor = Orion.RegRead(Player.Name()+"/CallerHighlight/actualval");
    var highlightcaller = Orion.RegRead(Player.Name()+"/Highlight Caller") != 0 ? true:false;
    //Orion.Print(caughtobj.Serial());
    //oldcaught = Orion.GetGlobal("CaughtSerial");
    //Orion.RemoveHighlightCharacter(oldcaught,true);
    if (caught != null){
      caught = caught.Text();
      caught = caught.split(";");
      if(caught[1] == "F1"){
        caught = caught[2];
        attacktar = "false";
        //Orion.Print("in here");
      }
      else{
        caughtname = caught[2];
        caught = caught[1];
        attacktar = "true";
      }
      caught = Number(caught);
      //caught = caught / 14;

      if(attacktar == 'true'){
        Orion.ClientLastTarget(caught);
        Orion.SetGlobal("LTCaught",caught);
        if (Orion.FindObject(caught)){
          caughtthing = Orion.FindObject(caught);
          Orion.CharPrint(Player.Serial(), '48', "Target:[" + caughtthing.Name()+ "]");
          Orion.SetGlobal("SentSerial",caughtthing.Serial())
          CurrTarGump(caughtthing.Name(),caughtthing.Serial());
        }
        else{
          CurrTarGump(caughtname,0);
        }
        //Orion.TargetSystemSerial(caught);
        Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
        if(Orion.GetGlobal("LeadHighlight") == Number(Orion.GetGlobal("LTHighlight"))){
          Orion.AddHighlightCharacter(Orion.GetGlobal("LeadHighlight"),highlightcallercolor,true);
        }
        Orion.SetGlobal("LTHighlight",caught);
        //Orion.ClearHighlightCharacters();
        Orion.AddHighlightCharacter(caught,highlightLTcolor,true);

        if(highlightcaller && caughtobj.Serial() != Player.Serial()){
          Orion.RemoveHighlightCharacter(Orion.GetGlobal("LeadHighlight"),true);
          Orion.SetGlobal("LeadHighlight",caughtobj.Serial());
          Orion.AddHighlightCharacter(caughtobj.Serial(),highlightcallercolor,true);
        }
        else if(highlightcaller && caughtobj.Serial() == Player.Serial()){
          Orion.RemoveHighlightCharacter(Orion.GetGlobal("LeadHighlight"),true);
          Orion.SetGlobal("LeadHighlight",caughtobj.Serial());
        }
        if(!highlightcaller){
          Orion.RemoveHighlightCharacter(Orion.GetGlobal("LeadHighlight"),true);
        }
        Orion.SetGlobal("attackdelaytar",caught)
        Orion.Exec("AttackDelay",true);
        //Orion.AddDisplayTimer(101,30000, 'Top', 'Rectangle|Bar', nameit, 0, 0, '0xFFFF', 4, 'green');
      }
      else{
        if(highlightcaller && caughtobj.Serial() != Player.Serial()){
          Orion.RemoveHighlightCharacter(Orion.GetGlobal("LeadHighlight"),true);
          Orion.SetGlobal("LeadHighlight",caught);
          Orion.AddHighlightCharacter(caught,highlightcallercolor,true);
        }
      }
      //1161 = Blaze fire, 1153 = white,Glacial=1152

      //Orion.Print(Orion.GetGlobal("CaughtSerial"));
    }
    Orion.Wait(500)
  }
}

function AttackDelay(){
  attackser = Orion.GetGlobal("attackdelaytar");
  doAttack = Orion.RegRead(Player.Name() + "/Auto Attack Caught Target");
  tdelay = Orion.RegRead(Player.Name() + "/timeattackAct")*1000;
  //Orion.Print(doAttack + " | " + tdelay);
  if(doAttack == 1 && Orion.FindObject(attackser)){
    Orion.AddDisplayTimer(111,tdelay, 'Top', 'Rectangle|Bar', '', 0, 0, '0xFFFF', 4, 'green');
    Orion.Wait(tdelay);
    Orion.Attack(attackser);
  }
}

function WallTarget()
{
  if(!Orion.HaveTarget()){
    Orion.Cast("Wall of Stone");
  }
  else{
    var value = 3;
    var empty = 0;

    var offset =
    [
        [empty, -value],        //direction = 0
        [value, -value],        //direction = 1
        [value, empty],     //direction = 2
        [value, value],     //direction = 3
        [empty, value],     //direction = 4
        [-value, value],        //direction = 5
        [-value, empty],        //direction = 6
        [-value, -value]        //direction = 7
    ];
    var currtar = Orion.FindObject(Orion.ClientLastTarget());
    var xy = offset[currtar.Direction() & 7];
    xy[0] = xy[0] + currtar.X();
    xy[1] = xy[1] + currtar.Y();

    Orion.TargetTile(currtar, xy[0], xy[1], currtar.Z());
    //Orion.Cast('Wall of Stone');
  }
}

function AutoBoxPop()
{

  Orion.ClearJournal();
  var L = 1;
  while(L == 1){
      var box = Orion.FindType('0x09A9', 'any', 'backpack');
      if(Array.isArray(box)){
        box = box[0];
      }
      Orion.Wait(200)
      if (Orion.BuffExists('Paralyzed') || Orion.BuffExists('Paralyze')){
          Orion.UseObject(box);
          Orion.Wait(350);
          Orion.Hide(Orion.GetSerial(box));
      }
      var NerveStriked = Orion.InJournal('Your attacker dealt a crippling nerve strike!','sys');
      if(NerveStriked){
        Orion.Wait(500);
        Orion.UseObject(box);
        Orion.Wait(350);
        Orion.Hide(Orion.GetSerial(box));
        Orion.ClearJournal();
      }
      Orion.Wait(50);
    }
}

function AutoAfroHorse()
{

    Orion.UseType('0x2124', '0xFFFF');
    if (Orion.WaitForGump(1000))
        {
            var gump0 = Orion.GetGump('last');
            if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00002340'))
            {
                gump0.Select(Orion.CreateGumpHook(7));
                Orion.Wait(500);
                Orion.Say('all follow me');
                Orion.Wait(400);
            }
        }
    var i;
    var j;
    var Mounts = [0x00CC, 0x0076, 0x0072, 0x0076];
    var Colors = [0x065D, 0x0AA5, 0x0AA4, 0x084C, 0x09C7, 0x0A84, 0x05B5, 0x09C4];

    for(i = 0; i < Mounts.length; i++)
        {
            for(j = 0; j < Colors.length; j++)
            {
                if(i.Graphic == Mounts[i] && j.Color == Colors[j]);
                {
                    Orion.UseType(Mounts[i], Colors[j], 'ground');
                }
            }
        }
}

function RemoveHousesON(){
  if(Orion.ClientOptionGet("UseCustomMaxDrawZOffset", 1)){
    Orion.ClientOptionSet("UseCustomMaxDrawZOffset", 0)
  }
  else{
    Orion.ClientOptionSet("UseCustomMaxDrawZOffset", 1)
  }
}

function InfiniteTelering() {
  var rings = Orion.FindTypeEx('0x108A', '0xFFFF', backpack);
  if (rings.length) {
    for (var i = 0; i < rings.length; i++) {
      if (!Orion.Contains(rings[i].Properties(), 'Teleport Charges: 0')) {
      Orion.UseObject(rings[i].Serial());
      return;
      }
    }
  }
}

function Durability(){
  mindur = 100; //Durability to alert you at.

  layers = [
    0,
    "RightHand",
    "LeftHand",
    'Shoes',
    "Pants",
    'Shirt',
    'Helmet',
    'Gloves',
    'Ring',
    'Talisman',
    'Necklace',
    'Hair',
    'Waist',
    'InnerTorso',
    'Bracelet',
    'Face',
    'Beard',
    'MidTorso',
    'Earrings',
    'Arms',
    'Cloak',
    'Backpack',
    'Robe',
    'Eggs',
    'Legs',
  ]
  Orion.Print("Minimum Durability set at: " + mindur)
  for(var i =1; i< layers.length; i++){
    if(Orion.ObjAtLayer(i)){
      var theobj = Orion.ObjAtLayer(i);
      var properties = theobj.Properties();
      if (!Orion.Contains(theobj.Properties(), 'Durability')){
        //Orion.Print('-')
        Orion.Wait(10);
      }
      else{
      var matches = /Durability (\d+)\s\/\s(\d+)/.exec(properties);
        if(matches.length > 2 && Number(matches[1]) < mindur)
        {
          Orion.Print(layers[theobj.Layer()] + ": " +matches[1] + " / " +matches[2])
        }
      }
    }
  }
}
//Gump Section

function PVPGump(){
  var gumpnum = 125;
  var gumpvars = PVPloadvars();
  var gump = Orion.CreateCustomGump(gumpnum);
  var positions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
  var ogpositions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
	gump.SetNoClose(true);
	gump.Clear();
	// Set callback function
	gump.SetCallback('PVPresponse');
  // Gump position
  gump.SetX(gumpvars[0][3]);
  gump.SetY(gumpvars[1][3]);
	// Main background
  //Grey = 13BE
  var bground = '09BF5'
	gump.AddResizepic(0, 0, bground, 710, 430);
  //General Gump Setup
  itemSerial = 1;
  gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
  //Save & Close Button
	gump.AddButton(0, 315, 400, '0x00F9', '0x00F8', '0x00F7', '0');
  //Auto scripts
  //gump.AddText(5, 25, '0', "Auto-action Scripts:");
  rowoff = 30;
  coloff = 11;
  for(var i = 0; i < gumpvars.length;i++){
    //Orion.Print(i + " / " + gumpvars[i][0]  + " / "  + gumpvars[i][3])
    if(gumpvars[i][1] == 'cbox'){
      //gump.AddCheckbox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x00938', '0x093A', '0x0939', gumpvars[i][3], '0', gumpvars[i][0]);
      gump.AddCheckbox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x016C9', '0x016CC', '0x016C5', gumpvars[i][3], '0', gumpvars[i][0],'0x00801');
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
    }
    else if(gumpvars[i][1] == 'title'){
        gump.AddText(positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,gumpvars[i][3],gumpvars[i][0]);
        positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
    }
    else if(gumpvars[i][1] == 'combo'){
      droplength = (gumpvars[i].length - 4)/2
      gump.AddComboBox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff, '0x0BB8', 0, '0x0BB8', 125, -3,droplength);
      var seldef = 0;
      for(var j=4;j<gumpvars[i].length;j++){
        //Orion.Print(j+ " / " + gumpvars[i][j]);
        if(gumpvars[i][3]*2 == (j-4)){
          seldef = 1;
        }
        else{
          seldef = 0;
        }
        gump.AddComboBoxText(gumpvars[i][j],0,seldef);
        j++;
      }
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + 210;
    }
    else if(gumpvars[i][1] == 'txtbox'){
      //3 = value, 4 = box width,
      gump.AddResizepic(positions[gumpvars[i][2]]-5,gumpvars[i][2]*rowoff, '0x0BB8', gumpvars[i][4], 20);
      gump.AddTextEntry(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff, '0x0035', gumpvars[i][3], gumpvars[i][4], 20);
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]]  + 5;
    }
    else if(gumpvars[i][1] == 'plusminus'){
      //3 = value, 4 =
    	gump.AddResizepic(positions[gumpvars[i][2]]-5,gumpvars[i][2]*rowoff, '0x0BB8', 70, 20);
    	gump.AddMinMaxButtons(i+10, positions[gumpvars[i][2]]+20,gumpvars[i][2]*rowoff+1, '0x0037', 0, 1, 100, gumpvars[i][3]);
      gump.SetTextParameters(1, 'LeftCenter');
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]]  + 75;
    }
    else if(gumpvars[i][1] == 'tooltip'){
      gump.AddTooltip(gumpvars[i][3]);
    }
    else if(gumpvars[i][1] == 'page'){
      gump.AddPage(gumpvars[i][2]);
      gump.AddResizepic(0, 0, bground, 710, 430);
      gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
      gump.AddButton(0, 315, 400, '0x0EF', '0x0F0', '0x0F0',0,0,0);
      gump.AddButton(5, 30, 400, '0x0F6', '0x0F4', '0x0F5',0,1);
      gump.AddTooltip("This action resets all the settings \n to their default settings.")
      positions = ogpositions;
    }
    else if(gumpvars[i][1] == 'button'){
      //0x7d6, hover d7
      //0=name,1=type,2=x,3=y,4=graphic,5=hover
      gump.AddButton(gumpvars[i][7], gumpvars[i][2], gumpvars[i][3], gumpvars[i][4], gumpvars[i][5],gumpvars[i][5],0,0,gumpvars[i][6]);
    }
    //Before next iteration make any Y adjustments to the current row.
    if(gumpvars[i][1] != 'combo' && gumpvars[i].length >4){
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][4];
    }
  }
  gump.Update();
  if(Orion.GetGlobal('pvpgumpfirst') != "true"){
    gump.Close();
    WriteVars(gumpvars);
    Orion.SetGlobal('pvpgumpfirst',"true");

  }
  GumpLaunchButton();
}

function PVPGumpRestoreDefault(){
  prefix = Player.Name();
  Orion.RegWrite(prefix +"/Stored", "false");
}

defaultvars =
// Name, obj type, row, value, y-offset (or combo vales)
//Obj type: cbox,title,combo,txtbox,plusminus,tooltip,page,button
//Colors: red = '0x0020', green = '0x0043'
[
  ["gumpx","gen",0,600],
  ["gumpy","gen",0,200],
  ["Auto-action Scripts:","title",1,'0x002F'],
  ["Auto Seed", 'cbox',2,1],
  ["Auto Box", 'cbox',2,1],
  ["Auto Apple",'cbox',2,1],
  ["Auto Chug Cure/Heal",'cbox',2,0,-40],
  ["Auto Start Dex-Str Pot",'cbox',2,1],
  ["Auto Ability",'cbox',3,0,-25],
  ["Auto Ability Tooltip",'tooltip',3,"Auto Ability Configuration \n Under scripts tab, add a new script,\n click 'External Code' and add the following function.\nFor single (standard) ability toggle:\nPrimary: AbilityToggle('primary','false')\nSecondary: AbilityToggle('secondary','false')\nFor auto ability toggle:\nPrimary: AbilityToggle('primary','true')\nSecondary: AbilityToggle('secondary','true')"],
  ["Auto Rearm",'cbox',3,1],
  ["Rearm on disarm ONLY",'cbox',3,1,-40],
  ["Auto Counterattack",'cbox',4,1,-40],
  ["Auto Warcry",'cbox',4,50,1],
  ["Auto Run",'cbox',4,1],
  ["Targeting:","title",5,'0x002F'],
  ["Catch Target", 'cbox',6,1],
  ["Auto attack caught target", 'cbox',6,1,-70],
  ["Target Highlight:", 'title',6,0x00801,-85],
  ["TargetHighlight",'combo',6,0,"Glacial",1152,"Glacial Pink",1289,"Blaze",1161,"Europa Gold",1177,"Super Gold",1174,"White",1153,"Neon Green/Orange",2760,"Psychedelic Pink",1092,"Psychedelic Black",1182,"Psychedelic Green",1674,"All White",2058,"Abyss",2075,"Bloodwood Red",1194,"Dark Red/Brown",1148,"Dragon Red",1645,"Fire Orange",1359,"Dryad Green",1167,"Dull Ruby",2731],
  ["Highlight Caller", 'cbox',7,1,-40],
  ["Caller Highlight:", 'title',7,0x00801,-90],
  ["CallerHighlight",'combo',7,7,"Glacial",1152,"Glacial Pink",1289,"Blaze",1161,"Europa Gold",1177,"Super Gold",1174,"White",1153,"Neon Green/Orange",2760,"Psychedelic Pink",1092,"Psychedelic Black",1182,"Psychedelic Green",1674,"All White",2058,"Abyss",2075,"Bloodwood Red",1194,"Dark Red/Brown",1148,"Dragon Red",1645,"Fire Orange",1359,"Dryad Green",1167,"Dull Ruby",2731],
  ["Heal Ally Highlight:", 'title',8,0x00801,-100],
  ["HealHighlight",'combo',8,4,"Glacial",1152,"Glacial Pink",1289,"Blaze",1161,"Europa Gold",1177,"Super Gold",1174,"White",1153,"Neon Green/Orange",2760,"Psychedelic Pink",1092,"Psychedelic Black",1182,"Psychedelic Green",1674,"All White",2058,"Abyss",2075,"Bloodwood Red",1194,"Dark Red/Brown",1148,"Dragon Red",1645,"Fire Orange",1359,"Dryad Green",1167,"Dull Ruby",2731],
  ["Current target gump", 'cbox',9,0,-40],
  ["Target Gump (X|Y):", 'title',9,0x00801,-70],
  ["CTX",'txtbox',9,1100,50],
  ["CTY",'txtbox',9,30,50],
  ["Style:", 'title',9,0x00801,-30],
  ["CTGumpStyle",'combo',9,0,"Line Grey",'0x9C40',"Black",0xA3C,"Light Grey",0x13BE,"Dark Grey",0x1400],
  ["Auto Bars:","title",10,'0x002F'],
  ["Auto Bar Pulling", 'cbox',11,1,-20],
  ["Clear Bars Tooltip",'tooltip',3,"You can clear bars by creating a hotkey\nfor the external function below:\nClearBars()\nYou can hotkey toggling Auto bars\nusing the external function below:\nToggleAutoBars()"],
  ["OJ Offset (X|Y):", 'title',11,0x00801,-70],
  ["OJtooltip",'tooltip',3,"Any changes you make to this will\nrequire toggling Auto bars off, hitting OKAY,\nand then turning it back on."],
  ["OJX",'txtbox',11,5,50],
  ["OJY",'txtbox',11,30,50],
  ["Friendly Offset (X|Y):", 'title',11,0x00801,-110],
  ["friendtooltip",'tooltip',3,"Any changes you make to this will\nrequire toggling Auto bars off, hitting OKAY,\nand then turning it back on."],
  ["FriendX",'txtbox',11,1500,50],
  ["FriendY",'txtbox',11,30,50],
  ["Number of bars per column:", 'title',12,0x00801,-110],
  ["Numbarstooltip",'tooltip',3,"Any changes you make to this will\nrequire toggling Auto bars off, hitting OKAY,\nand then turning it back on."],
  ["barsper",'plusminus',12,15],
  ["Space between bars:", 'title',12,0x00801,-85],
  ["spacebarstooltip",'tooltip',3,"Any changes you make to this will\nrequire toggling Auto bars off, hitting OKAY,\nand then turning it back on."],
  ["barspace",'combo',12,0,"Classic","60|153","Sallos","40|130"],
  ["Page 2 Button",'button',600,400,0x7d6, 0x7d7,2,2],
  ["Settings Page","page",2],
  ["Auto-Apple Activation Spells:","title",1,'0x002F'],
  ["Corpse Skin", 'cbox',2,1,-15],
  ["Sleep", 'cbox',2,1,10],
  ["Mortal Strike", 'cbox',2,1,-25],
  ["Spell Plauge", 'cbox',2,0,-25],
  ["Curse", 'cbox',2,0,10],
  ["Strange", 'cbox',2,0],
  ["Scroll Target Options:","title",3,'0x002F'],
  ["Notoriety:", 'title',4,0x00801,-50],
  ["Blue", 'cbox',4,0,15],
  ["Green", 'cbox',4,0,15],
  ["Grey", 'cbox',4,1,20],
  ["Criminal", 'cbox',4,1,-5],
  ["Orange", 'cbox',4,1,10],
  ["Red", 'cbox',4,0,25],
  ["Yellow", 'cbox',4,0,10],
  ["Human Only", 'cbox',5,1,-25],
  ["Auto-activation Health Percentages:","title",6,'0x002F'],
  ["Seed:", 'title',7,0x00801,-20],
  ["seedAct",'txtbox',7,30,50],
  ["Heal Pot:", 'title',7,0x00801,-35],
  ["healAct",'txtbox',7,60,50],
  ["Auto Dex/Str:", 'title',7,0x00801,-50],
  ["dexstrAct",'txtbox',7,70,50],
  ["Warcry:", 'title',7,0x00801,-20],
  ["warcryAct",'txtbox',7,40,50],
  ["Targeting Options:","title",8,'0x002F'],
  ["Auto attack after catching (seconds):", 'title',9,0x00801,-180],
  ["timeattackAct",'txtbox',9,3,50],
  ["Gump Options:","title",10,'0x002F'],
  ["Gump Launch Icon", 'cbox',11,1,-30],
  ["Open paperdoll for suit information (Current target gump)", 'cbox',11,1,-250],
  ["launchgumpx","gen",0,200],
  ["launchgumpy","gen",0,200],
]

function PVPloadvars(){
  var allthem = defaultvars;
  prefix = Player.Name();
  //TextWindow.Clear();
  //TextWindow.Open();
  if(Orion.RegRead(prefix + "/Stored") == "true"){
    for(i = 0;i < allthem.length; i++){
      if(allthem[i][1] != "title"){
        //TextWindow.Print(prefix + "/" + i + "|| " + Orion.RegRead(prefix + "/" + i));
        allthem[i][3] = Orion.RegRead(prefix + "/" + allthem[i][0]);
      }
    }
  }
  return allthem;
}

function WriteVars(thevars){
  prefix = Player.Name();
  //TextWindow.Clear();
  //TextWindow.Open();
  Orion.RegWrite(prefix +"/Stored", "true");
  //Saving Gump position
  for(var i=0;i<thevars.length;i++){
    if(thevars[i][1] != "title"){
      Orion.RegWrite(prefix + "/" + thevars[i][0], thevars[i][3]);
      if(thevars[i][1] == "combo"){
        Orion.RegWrite(prefix + "/" + thevars[i][0] + "/actualval", thevars[i][thevars[i][3]*2+5]);
        //Orion.Print(prefix + "/" + thevars[i][0] + "/actualval" + " || " + thevars[i][thevars[i][3]*2+5])
      }
      else if(thevars[i][1] == "plusminus"){
        Orion.RegWrite(prefix + "/" + thevars[i][0] + "/actualval", thevars[i][3]);
      }
      //TextWindow.Print(prefix + "/" + thevars[i][0] + " | " + thevars[i][3]);
    }
  }
  var gpos = Orion.GetGumpPosition('custom', 125);
  if(gpos.X() != -1){
    //Orion.Print('Custom gump now at: ' + pos.X() + ' ' + pos.Y());
    Orion.RegWrite(Player.Name()+"/gumpx",gpos.X());
    Orion.RegWrite(Player.Name()+"/gumpy",gpos.Y());
  }
  //Setting global variables to turn on/off various Scripts
  Orion.SetGlobal("doSeed",Orion.RegRead(Player.Name()+"/Auto Seed"));
  Orion.SetGlobal("doBox",Orion.RegRead(Player.Name()+"/Auto Box"));
  Orion.SetGlobal("doApple",Orion.RegRead(Player.Name()+"/Auto Apple"));
  Orion.SetGlobal("doRun",Orion.RegRead(Player.Name()+"/Auto Run"));
  Orion.SetGlobal("doCry",Orion.RegRead(Player.Name()+"/Auto Warcry"));
  Orion.SetGlobal("doDexStr",Orion.RegRead(Player.Name()+"/Auto Start Dex-Str Pot"));
  Orion.SetGlobal("doCA",Orion.RegRead(Player.Name()+"/Auto Counterattack"));
  Orion.SetGlobal("doAbility",Orion.RegRead(Player.Name()+"/Auto Ability"));
  Orion.SetGlobal("doRearm",Orion.RegRead(Player.Name()+"/Auto Rearm"));
  Orion.SetGlobal("doRearmOnly",Orion.RegRead(Player.Name()+"/Rearm on disarm ONLY"));
  Orion.SetGlobal("doCatch",Orion.RegRead(Player.Name()+"/Catch Target"));
  Orion.SetGlobal("doHighCaller",Orion.RegRead(Player.Name()+"/Highlight Caller"));
  Orion.SetGlobal("doHeal",Orion.RegRead(Player.Name()+"/Auto Chug Cure/Heal"));
  if(Orion.RegRead(Player.Name()+"/Auto Bar Pulling") == 0){
    Orion.SetGlobal("BarClear",'true');
    Orion.SetGlobal("doPullbars",Orion.RegRead(Player.Name()+"/Auto Bar Pulling"));
  }
  else{
    Orion.SetGlobal("doPullbars",Orion.RegRead(Player.Name()+"/Auto Bar Pulling"));
    if(!Orion.ScriptRunning('AutoBarPopulate')){
      Orion.Exec("AutoBarPopulate",true);
    }
  }
  if(Orion.GetGlobal("doRearm") && !Orion.ScriptRunning('AutoRearm')){
    Orion.Exec("AutoRearm",true);
  }
  if(Orion.GetGlobal("doAbility") && !Orion.ScriptRunning('AutoAbility')){
    Orion.Exec("AutoAbility",true);
  }
  if(Orion.GetGlobal("doCatch") && !Orion.ScriptRunning('CatchSerial')){
    Orion.Exec("CatchSerial",true);
  }
  Orion.Exec("AutoEverything",true);
}

function PVPresponse(unused){
  var gumpnum = 125;
  var launchgump = 150;
  var code = CustomGumpResponse.ReturnCode();
	//Orion.Print('Custom gump response code = ' + code);
	if (code == 0)
	{
    for(i=0;i<defaultvars.length;i++){
      if(defaultvars[i][1] == 'cbox'){
        defaultvars[i][3] = CustomGumpResponse.CheckBox(i+10) ? 1 : 0;
      }
      else if(defaultvars[i][1] == 'txtbox'){
        defaultvars[i][3] = CustomGumpResponse.Text(i+10);
      }
      else if(defaultvars[i][1] == 'combo'){
        defaultvars[i][3] = CustomGumpResponse.ComboBox(i+10);
      }
      else if(defaultvars[i][1] == 'plusminus'){
        defaultvars[i][3] = CustomGumpResponse.MinMaxButton(i+10);
      }
    }
		var gump = Orion.CreateCustomGump(gumpnum);
    WriteVars(defaultvars);
		gump.Close();

	}
	else if (code == 2) // Button tile art, reset page index
	{
		var gump = Orion.CreateCustomGump(gumpnum);
		gump.SetPage(1);
		gump.Update();
	}
  else if (code == 5) // Button tile art, reset page index
	{
    PVPGumpRestoreDefault();
    Orion.SetGlobal('pvpgumpfirst',"false");
    var gump = Orion.CreateCustomGump(gumpnum);
		gump.Close();
    PVPGump();

	}
}
//Wizard: 0xAAF or 0x776C or 0x15C1 (hat circle)
//Trying to build a new last target display, definitely a work in progress...
function CurrTarGump(name,serial){
  //serial = Player.Serial();
  //name = Player.Name();
  healthupdate = false;
  if(name != null){
    Orion.SetGlobal("CTname",name);
  }
  if(serial != null){
    Orion.SetGlobal("CTserial",serial);
  }
  if(name == null && serial == null){
    if(Orion.FindObject(Orion.GetGlobal("CTserial"))){
      serial = Orion.FindObject(Orion.GetGlobal("CTserial")).Serial();
      name = Orion.FindObject(Orion.GetGlobal("CTserial")).Name();
      healthupdate = true;
    }
    else{
      serial = 0;
      name = Orion.GetGlobal("CTname");
    }
  }
  LTGump = Orion.CreateCustomGump(666);
  if(!healthupdate && Orion.RegRead(Player.Name()+"/Current target gump") == "1"){
    var background = Orion.RegRead(Player.Name()+"/CTGumpStyle/actualval");
    X = Orion.RegRead(Player.Name()+"/CTX");
    Y = Orion.RegRead(Player.Name()+"/CTY");
    //Orion.Print(Orion.RegRead(Player.Name()+"/CTX")+ " " + Orion.RegRead(Player.Name()+"/CTY"));
    LTGump.Clear();
    LTGump.AddResizepic(0, 0, background, 175, 55);
    //LTGump.AddResizepic(0, 0, '13BE', 150, 50);
    LTGump.SetX(X);
    LTGump.SetY(Y);
    serial = Orion.FindObject(serial);
    //Handling if you've seen your LT to the group
    if(Orion.GetGlobal("SentSerial")){
      theSent = Orion.FindObject(Orion.GetGlobal("SentSerial"));
      theLT = Orion.FindObject('lasttarget');
      //Orion.Print(theSent.Serial() + " " +  theLT.Serial())
      if(theSent && theLT && (theSent.Serial() == theLT.Serial())){
        LTGump.AddGumpPic(8, 20, '0x939', 0);
      }
      else{
        LTGump.AddGumpPic(8, 20, '0x938', 0);
      }
    }
    //Orion.Print(serial);
    if(serial != null){
    //LTGump.AddText(5,5,'0',"<basefont color='green',face='UO_Arial_40pt'>"+name,1000);
      LTGump.AddText(22,5,'0x0048',serial.Name());
      hitper = ((serial.Hits()+0.00000001)/serial.MaxHits())*100
      LTGump.AddText(22,25,'0x0048',hitper.toFixed(0)+"%");
      if(Orion.RegRead(Player.Name()+'/Open paperdoll for suit information (Current target gump)') == 1){
        Orion.OpenPaperdoll(serial.Serial());
        Orion.Wait(300);
        //Orion.MovePaperdoll(serial.Serial(), 500, 500);
        Orion.ClosePaperdoll(serial.Serial());
      }
    }
    else{
      LTGump.AddText(22,5,'0x0048',name);
      LTGump.AddText(22,25,'0x0048',"N/A");
    }
    //This section handles the weakest resist / decimal
    //Opening paperdoll to get suit information

    thestats = ResistStatEval(serial);
    lowesti = 4;
    lowdci = false;
    for(var i = 4;i<thestats.length;i++){
      //Orion.Print(thestats[i][0] + ': ' + thestats[i][1] + " | " + thestats[i][2])
      if(thestats[i][0] != "Max Defense Chance Increase" && thestats[i][0] != "Defense Chance Increase"){
        if(thestats[i][1] < thestats[lowesti][1]){
          lowesti = i;
        }
      }
      else if(thestats[i][0] == "Max Defense Chance Increase" && thestats[i-1][1] < thestats[i][2]){
        lowdci = true;
      }
    }
    var lowtext = "";
    if(thestats[lowesti][1] < thestats[lowesti][2]){
      lowtext = thestats[lowesti][0][0] + thestats[lowesti][0][1] + thestats[lowesti][0][2] + thestats[lowesti][0][3];
    }
    else if(lowdci){
      lowtext = "DCI-"
    }
    else{
      lowtext = null;
    }
    if(thestats[lowesti][1] == 0){
      lowtext = null;
    }
    //Update the gump graphic
    lowicon = '';
    if(lowtext != null){
      Orion.Print(lowtext);
      switch(lowtext){
        case "DCI-":
          //0x9BA6
          lowicon = 0x9BA6;
          break;
        case "Phys":
          //0x9B8E
          lowicon = 0x9B8E;
          break;
        case "Fire":
          //0x759B or 0x7611
          lowicon = 0x7611;
          break;
        case "Cold":
          //0x7595
          lowicon = 0x7595;
          break;
        case "Pois":
          lowicon = 0x75FE;
          //0x75FE
          break;
        case "Ener":
          //0x9B8B
          lowicon = 0x9BD3;
          break;
      }
      //LTGump.AddGumpPic(145, 30, lowicon, 0,0,0,20,20);
      //LTGump.AddText(145, 30, '0xFFFE', '<img src="gump:'+lowicon+' width=20 height=20>');
      if(lowicon != ''){
        concatstring = '<img src="gump:' + lowicon + '" width=20 height=20>';
        LTGump.AddText(148, 15, '0x9B8E', concatstring);
      }
    }
    else{
      //grey circle = 0x768;
      lowicon = 0x93A;
      LTGump.AddGumpPic(155, 20, lowicon, 0);
    }

    tooltipit = 'Stats Overview:\n';
    for(var i = 1; i < thestats.length;i++){
      if(thestats[i][0] == "Max Defense Chance Increase"){
        thestats[i][0] = "Defense Chance Increase";
        tooltipit += thestats[i][0] + ": " + thestats[i-1][1] + " / " + thestats[i][1] + "\n"
      }
      else if(thestats[i][0] != "Defense Chance Increase"){
        tooltipit += thestats[i][0] + ": " + thestats[i][1] + " / " + thestats[i][2] + "\n"
      }
    }
    LTGump.AddTooltip(tooltipit);
    LTGump.Update();
  }
  else if(healthupdate){
    if(serial != 0){
      //LTGump.AddText(5,5,'0',"<basefont color='green',face='UO_Arial_40pt'>"+name,1000);
      serial = Orion.FindObject(serial);
      LTGump.AddText(22,5,'0x0048',serial.Name());
      hitper = ((serial.Hits()+0.00000001)/serial.MaxHits())*100
      LTGump.AddText(22,25,'0x0048',hitper.toFixed(0)+"%");
    }
    else{
      LTGump.AddText(22,5,'0x0048',name);
      LTGump.AddText(22,25,'0x0048',"N/A");
    }
    LTGump.Update();
  }
  if(Orion.RegRead(Player.Name()+"/Current target gump") != "1"){
    LTGump = Orion.CreateCustomGump(666);
    Orion.Terminate("UpdateCTGump");
    LTGump.Close();
  }
  else{
    Orion.Exec('UpdateCTGump',true);
  }
}

function UpdateCTGump(){
  var ctupdatedelay = 1000;
  while(true){
    //Save current gump positions
    var pos = Orion.GetGumpPosition('custom', 666);
    if(pos.X() != -1){
      //Orion.Print('Custom gump now at: ' + pos.X() + ' ' + pos.Y());
      Orion.RegWrite(Player.Name()+"/CTX",pos.X());
      Orion.RegWrite(Player.Name()+"/CTY",pos.Y());
      for(var i = 0;i<defaultvars.length;i++){
        if(defaultvars[i][0] == "CTX"){
          theindex = i;
          break;
        }
      }
      //defaultvars[theindex][3] = pos.X();
      //defaultvars[theindex][3] = pos.Y();
    }
    //CurrTarGump(null,null);
    Orion.Wait(ctupdatedelay);
  }
}

function ResistStatEval(charobj){
  stats = [
    0,
    ["Mana Regeneration",0,30],
    ["Hit Point Regeneration",0,18],
    ['Hit Point Increase',0,25],
    ["Physical Resist",0,70],
    ["Fire Resist",0,70],
    ["Cold Resist",0,70],
    ["Poison Resist",0,70],
    ["Energy Resist",0,70],
    ["Defense Chance Increase",0,45,0],
    ["Max Defense Chance Increase",45,45,1],
  ]
  //charobj = Orion.FindObject(0x030833F8);
  if(charobj){
    for(var i =0; i< 35; i++){
      if(Orion.ObjAtLayer(i,charobj.Serial())){
        var theobj = Orion.ObjAtLayer(i,charobj.Serial());
        var properties = theobj.Properties();
        for(var j = 1;j<stats.length;j++){

          if (Orion.Contains(theobj.Properties(), stats[j][0])){

            //Looking for and adding the stat
            patt = new RegExp(stats[j][0] +' (\\d\+)');
            var matches = patt.exec(properties);
            if(matches && matches.length > 0)
            {
              stats[j][1] += Number(matches[1]);
            }
            //Looking for any + Modifiers
            patt = new RegExp(stats[j][0] +' (\\d\+)% / +');
            var matches = patt.exec(properties);
            if(matches && matches.length > 0)
            {
              theobj.Name();
              stats[j][2] += 1;
            }
            //Looking for any - modifiers
            patt = new RegExp(stats[j][0] +' (\\d\+)% / -');
            var matches = patt.exec(properties);
            if(matches && matches.length > 0)
            {

              stats[j][2] += -1;
            }
            //Handling Max Defense chance - modifier
            patt = new RegExp(stats[j][0] +' -(\\d\+)%');
            var matches = patt.exec(properties);
            if(matches && matches.length > 0 && stats[j][3] == 1)
            {
              //Orion.Print(stats[j][0]);
              stats[j][1] += -1;
            }
            //Handling Max Defense chance + modifiers
            patt = new RegExp(stats[j][0] +' +(\\d\+)%');
            var matches = patt.exec(properties);
            if(matches && matches.length > 0 && stats[j][3] == 1)
            {
              //Orion.Print(stats[j][0])
              stats[j][1] += 1;
            }
          }
        }
      }
    }
  }
  //for(var j = 1;j<stats.length;j++){
  //  Orion.Print(stats[j][0] + ": " + stats[j][1]);
  //}
  return stats;
}

function GumpLaunchButton(){
  var doLaunch = Orion.RegRead(Player.Name() + "/Gump Launch Icon");
  var gumpx = Orion.RegRead(Player.Name() + "/launchgumpx");
  var gumpy = Orion.RegRead(Player.Name() + "/launchgumpy");
  if(doLaunch == 1){
    var gumpnum = 150;
    var gump = Orion.CreateCustomGump(gumpnum);
  	gump.Clear();
  	// Set callback function
  	gump.SetCallback('GumpLaunchResp');
    // Gump position
    gump.SetX(gumpx);
    gump.SetY(gumpy);
  	// Main background
    //Grey = 13BE
    var bground = '09BF5'
    //Wizard: 0xAAF or 0x776C or 0x15C1 (hat circle)
    var buttonid = 0x15C1;
    gump.AddButton(0, 0, 0, buttonid, buttonid, buttonid, '0');
    //concatstring = '<img src="gump:' + lowicon + '" width=20 height=20>';
    //LTGump.AddText(148, 15, '0x9B8E', concatstring);
    gump.Update();
  }
}

function GumpLaunchResp(){
  var gumpnum = 150;
  var code = CustomGumpResponse.ReturnCode();
	//Orion.Print('Custom gump response code = ' + code);
	if (code == 0){
    PVPGump();
  }
}
