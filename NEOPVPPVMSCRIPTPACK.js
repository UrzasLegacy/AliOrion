//Autostart scripts after login into the game. Example: Orion.Exec('AutoLootIgnore');

function Autostart()
{
  Orion.SetGlobal('pvpgumpfirst',"false");
  Orion.Exec('PVPGump',true);
  if(false && Orion.Contains(Player.Name(),"ghost|killer bee",false)){
    Orion.Wait(5000);
    Orion.Exec('AutoStartConfig',true);
  }
}

//Script pack
//Version 3.3

distVersion = false;
//If this is the distribution version, see line 2349

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
    var doDmgDrop = Orion.GetGlobal("doDmgDrop");
    //
    doCorpse = Orion.RegRead(Player.Serial() + "/Corpse Skin");
    doSleep = Orion.RegRead(Player.Serial() + "/Sleep");
    doMortal = Orion.RegRead(Player.Serial() + "/Mortal Strike");
    doPlague = Orion.RegRead(Player.Serial() + "/Spell Plague");
    doCurse = Orion.RegRead(Player.Serial() + "/Curse");
    doStrangle = Orion.RegRead(Player.Serial() + "/Strangle");
    doBloodOath = Orion.RegRead(Player.Serial() + "/Blood Oath");
    //Getting the latest activation levels for auto things
    autostartlevel = Orion.RegRead(Player.Serial() + "/dexstrAct")*0.01;
    seedhits = Orion.RegRead(Player.Serial() + "/seedAct")*0.01;
    warcryhits = Orion.RegRead(Player.Serial() + "/warcryAct")*0.01;
    autoheal = Orion.RegRead(Player.Serial() + "/healAct")*0.01;
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
    nervepopdelay = 300;
    parapopdelay = 0;
    if(doBox == 1){
      //Orion.Wait(100)
      if (Orion.BuffExists('Paralyzed') || Orion.BuffExists('Paralyze')){
          var pot = Orion.FindType(0x09A9, any, backpack);
          Orion.UseItemOnMobile(pot[0], self);
          //Orion.UseObject(box);
          Orion.Wait(200);
          Orion.Hide(Orion.GetSerial(pot[0]));
      }
      var NerveStriked = Orion.InJournal('Your attacker dealt a crippling nerve strike!','sys','0','any',Orion.Now()-2000,Orion.Now()+2000);
      if(NerveStriked){
        Orion.Wait(nervepopdelay);
        var pot = Orion.FindType(0x09A9, any, backpack);
        Orion.UseItemOnMobile(pot[0], self);
        //Orion.UseObject(box);
        Orion.Wait(350);
        Orion.Hide(Orion.GetSerial(pot[0]));
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
    if(doApple == 1 && ((doBloodOath == 1 && Orion.BuffExists('Blood Oath')) || (doCorpse == 1 && Orion.BuffExists('Corpse Skin')) || (doSleep == 1 && Orion.BuffExists('Sleep')) || (doMortal == 1 && Orion.BuffExists('Mortal Strike')) || (doPlague == 1 && Orion.BuffExists('Spell Plague')) || (doCurse == 1 && Orion.BuffExists('Curse')) || (doStrangle == 1 && Orion.BuffExists('Strangle')))){
      if(Orion.Timer("AppleTimer") >= -1 && !Orion.HaveTarget()){
        var pot = Orion.FindType('0x2FD8', '0x0488', backpack);
        Orion.UseItemOnMobile(pot[0], self);
        //Orion.UseType('0x2FD8', '0x0488');
        Orion.Wait(500);
      }
      Orion.Wait(50);
    }
    //Checking to see
    if(Orion.InJournal('tasty bite of the enchanted','sys','0','any',Orion.Now()-1000,Orion.Now()+2000)){
      Orion.SetTimer("AppleTimer",-29500);
      Orion.AddDisplayTimer(179, 29500, "UnderChar", "Circle|Bar", "Apple", -60, 0, '55', 0xFF, '0xFFFFFF');
      Orion.ClearJournal();
    }
    //Auto Run Toggle
    if(doRun == 1 && Player.Hidden()){
        Orion.OptionAlwaysRun(false);
    }
    else if(doRun == 1){
      Orion.OptionAlwaysRun(true);
    }
    if(doRun == 0){
      Orion.OptionAlwaysRun(false);
    }
    //Auto Counterattack
    if(doCA == 1 && Orion.SkillValue("Bushido") > 1000 && !Player.Hidden() && !Orion.BuffExists("Counter Attack") && !Orion.HaveTarget() && Player.Mana() > 50 && Player.WarMode() && !Orion.BuffExists("Evasion") && !Orion.BuffExists("Confidence")){
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
      Orion.RegWrite(Player.Serial()+"/launchgumpx",pos.X());
      Orion.RegWrite(Player.Serial()+"/launchgumpy",pos.Y());
      Orion.SetTimer("GumpUpdateTimerLaunch",-1000);
    }
    //Damage check and drop item if damaged
    if(doDmgDrop == 1 && Orion.Timer("DmgCheckTimer") >= -1){
      var mindur = 5;
      var dmgcheck = Orion.InJournal('Your equipment is severely','self','0','any',Orion.Now()-10000,Orion.Now()+2000);
      if(dmgcheck){
        for(var i =1; i< 32; i++){
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
                Orion.Print(theobj.Layer() + ": " +matches[1] + " / " +matches[2])
                Orion.Wait(1100)
                Orion.MoveItem(theobj.Serial());
              }
            }
          }
        }
      }
      Orion.SetTimer("DmgCheckTimer",-10000)
    }
  Orion.Wait(200);
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
    if (!Orion.BuffExists('Agility') && !Player.Hidden()) {
      if (!Orion.FindType('0x0F08', 'any', 'backpack', 'any', 'any', 'any', true) ){
    		Orion.CharPrint('self', '63', 'No Agility Pots!');
        dexbool = false;
        //AutoDoIt == False;
      }
      else {
        //Orion.UseType('0x0F08', '0x0000');
        var pot = Orion.FindType(0x0F08, 0x0000, backpack);
        Orion.UseItemOnMobile(pot[0], self);
        Orion.Wait(100);
    	}
    }
    Orion.Wait(100);
    if (!Orion.BuffExists('Strength') && !Player.Hidden()){
      if (!Orion.FindType('0x0F09', 'any', 'backpack', 'any', 'any', 'any', true) ){
    		Orion.CharPrint('self', '63', 'No Strength Pots!');
        strbool = false;
        //AutoDoIt == False;
      }
      else {
        var pot = Orion.FindType(0x0F09, 0x0000, backpack);
        Orion.UseItemOnMobile(pot[0], self);
        //Orion.UseType('0x0F09', '0x0000');
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
    if(Lhand && Lhand.Properties().indexOf("Two-handed") != -1){
      Orion.Dress("wep_primary");
      Orion.Wait(1100);
    }
    //Orion.UseType('0x0F0B', '0x0000');
    var pot = Orion.FindType(0x0F0B, 0x0000, backpack);
    Orion.UseItemOnMobile(pot[0], self);
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
  if(Orion.ObjAtLayer('LeftHand') && Orion.ObjAtLayer('LeftHand').Properties().indexOf("Two-handed") != -1){
    Orion.Dress("wep_primary");
    Orion.Wait(1100);
  }
  if (Player.Poisoned()) {
      //Orion.UseType('0x0F07', '0x0000');
      var pot = Orion.FindType(0x0F07, 0x0000, backpack);
      Orion.UseItemOnMobile(pot[0], self);
  		Orion.Wait(50);
  		//Orion.ClearJournal();
  	}
  else if(Orion.Timer("chugheal") >= -1){
    var pot = Orion.FindType(0x0F0C, 0x0000, backpack);
    Orion.UseItemOnMobile(pot[0], self);
  	//Orion.UseType('0x0F0C', '0x0000');
    Orion.Wait(100);
    if(Orion.InJournal("some damage",'sys','0','any',Orion.Now()-2000,Orion.Now()+2000)){
      Orion.SetTimer("chugheal",-12000)
    }
  	Orion.Wait(50);
  }
}

function EatApple() {
    Orion.UseType('0x2FD8', '0x0488');
    Orion.Wait(200)
    if(Orion.InJournal('tasty bite of the enchanted','sys','0','any',Orion.Now()-2000,Orion.Now()+2000)){
      Orion.SetTimer("AppleTimer",-29800);
      Orion.AddDisplayTimer(179, 29800, "UnderChar", "Circle|Bar", "Apple", -60, 0, '55', 0xFF, '0xFFFFFF');
      //Orion.ClearJournal();
    }
}

function UseHealStone() {
    //Orion.UseType('0x4078', '0x0000');
    var pot = Orion.FindType('0x4078', '0x0000', backpack);
    Orion.UseItemOnMobile(pot[0], self);
}

function UseBox() {
    Orion.UseType('0x09A9', '0x0000');
    var pot = Orion.FindType('0x09A9', '-1', backpack);
    Orion.UseItemOnMobile(pot[0], self);
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
  //Orion.UseType('0x0F09', '0x000D')
  var pot = Orion.FindType(0x0F09, 0x000D, backpack);
  Orion.UseItemOnMobile(pot[0], self);
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
      var thetarg = Orion.FindTypeEx('any', '-1', 'ground', 'ignoreself|ignorefriends|nothuman|live|near', '2', 'green');
      if(thetarg.length > 0){
        Orion.UseObject(thetarg[0].Serial())
      }
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

function SampAbility(){
  doSamp = Orion.GetGlobal("doSamp");

  while(doSamp == 1){
    abil = "secondary";
    moment = false;
    //Orion.Print(Orion.GetGlobal("AutoAbil"));
    if(Orion.GetGlobal("AutoAbil") == 'true'){
      auto = 'false';
    }
    else{
      auto = 'true';
    }
    manacost = 12;
    var mobArr = Orion.FindTypeEx("-1", "-1", "ground", "live|ignoreself|ignorefriends|nothuman", 2, "gray|criminal|red");
    //Orion.Print(mobArr.length);
    if (Array.isArray(mobArr) && mobArr.length == 2 && Orion.SkillValue("Bushido","real") >= 800){
      moment = true;
    }
    else if(Array.isArray(mobArr) && mobArr.length >= 2){
      abil = "secondary";
      if(Orion.SkillValue("Mace Fighting",'base')>=700){
        moment = true;
      }
    }
    else{
      abil = "primary";
    }

    if(Orion.Timer("SpecialUsed") > 0){
      manacost = manacost *2;
    }
    if(Orion.ObjAtLayer(2) != null && (Orion.Contains(Orion.ObjAtLayer(2).Name(),"hachet") || Orion.Contains(Orion.ObjAtLayer(2).Name(),"bladed staff"))){
      abil = "primary";
      moment = false;
    }
    if (auto == 'true' && (!Orion.AbilityStatus(abil) || !Orion.BuffExists("Momentum Strike")) && Player.Mana() > manacost){
      while(Player.Frozen() || Orion.HaveTarget()) {
        Orion.Wait(100);
      }
      if(!Player.Dead() && !moment){

        Orion.UseAbility(abil,"true");
        Orion.SetTimer("SpecialUsed",-3050);
      }
      else if(moment && !Player.Dead()){
        if(!Orion.BuffExists("Momentum Strike")){
          Orion.Cast("Momentum Strike");
          Orion.Wait(500);
        }
      }
    }
    Orion.Wait(300);
    doSamp = Orion.GetGlobal("doSamp");
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
    if(Orion.RegRead(Player.Serial() + "/Human Only") == 1){
      typefilter += "human|";
    }
    notefilter = ""
    if(Orion.RegRead(Player.Serial() + "/Blue") == 1){
      notefilter += "blue|";
    }
    if(Orion.RegRead(Player.Serial() + "/Green") == 1){
      notefilter += "green|";
    }
    if(Orion.RegRead(Player.Serial() + "/Grey") == 1){
      notefilter += "gray|";
    }
    if(Orion.RegRead(Player.Serial() + "/Criminal") == 1){
      notefilter += "criminal|";
    }
    if(Orion.RegRead(Player.Serial() + "/Orange") == 1){
      notefilter += "orange|";
    }
    if(Orion.RegRead(Player.Serial() + "/Red") == 1){
      notefilter += "red|";
    }
    if(Orion.RegRead(Player.Serial() + "/Yellow") == 1){
      notefilter += "yellow";
    }
    var highlightLTcolor = Orion.RegRead(Player.Serial()+"/TargetHighlight/actualval");
    var highlightcallercolor = Orion.RegRead(Player.Serial()+"/CallerHighlight/actualval");
    var highlightcaller = Orion.RegRead(Player.Serial()+"/Highlight Caller") != 0 ? true:false;
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
          //Orion.Attack(mobArr[0]);
      }
}

function AttackNearestEnemy()
{

    var mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|human|near", 20, "criminal|orange|red");

    if (mobArr.length)
    {
          var currtar = Orion.FindObject(mobArr[0]);
          Orion.CharPrint(Player.Serial(), '48', "Attacking:[" + currtar.Name()+ "]");
          Orion.Attack(currtar.Serial());
      }
}

function AttackNearestOJ()
{

    var mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|near", 20, "orange");

    if (mobArr.length)
    {
          var currtar = Orion.FindObject(mobArr[0]);
          Orion.CharPrint(Player.Serial(), '48', "Attacking:[" + currtar.Name()+ "]");
          Orion.Attack(currtar.Serial());
      }
}

function TargetNearestCreature()
{

    var mobArr = Orion.FindTypeEx("-1", "-1", "ground", "live|nothuman", 15, "gray|criminal|enemy|red");
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

function CastChivHeal(){
  Orion.SetGlobal("castChivheal","true");
  Orion.Cast("Close Wounds");
}


function FindHurtAlly(){
  var allycolor = Orion.RegRead(Player.Serial()+"/HealHighlight/actualval");
  var callercolor = Orion.RegRead(Player.Serial()+"/CallerHighlight/actualval");
  var dolead = Orion.RegRead(Player.Serial()+"/Highlight Caller");
  var highlightLTcolor = Orion.RegRead(Player.Serial()+"/TargetHighlight/actualval");
  var doAllyLT = Orion.GetGlobal("doAllyLT");
  var stdDist = 10;
  var chivDist = 2;
  if(Orion.GetGlobal("castChivheal") == "true"){
    var distCheck = chivDist;
  }
  else{
    var distCheck = stdDist;
  }
  Orion.Ignore(self); //the find flag ignoreself doesn't work...
  fulllist = '';
  findfriend = Orion.GetFriendList();
  guildArr = Orion.FindType("-1", "-1", 'ground', "live|ignoreself|ignorefriends|human", distCheck, "green");

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
    var oldtar = Orion.ClientLastTarget();
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
    if(Orion.GetDistance(healtar.Serial()) <= distCheck){
      Orion.TargetObject(healtar.Serial());
    }
    if(doAllyLT == 1){
      Orion.ClientLastTarget(oldtar);
      //Orion.CharPrint(self,2128,"Target: " + healtar.Name());
      Orion.RemoveHighlightCharacter(Orion.GetGlobal("LTHighlight"),true);
      Orion.SetGlobal("LTHighlight",oldtar);
      Orion.AddHighlightCharacter(oldtar,highlightLTcolor,true);
    }
  }
  else {
    Orion.CharPrint(self,'2128',"No Injured Ally")
    //Orion.Print(healtar.Name());
  }
  Orion.SetGlobal("castChivheal","false");
}

//--#Healing

function AutoHealing()
{
    var msg = "You finish applying the bandages|You have been cured of all poisons|You apply the bandages";
    while (Orion.Count("bandage") && !Player.Dead())
    {
        //var aids =  Orion.FindTypeEx('0x0E21','any','backpack','','','',true);
        //Orion.Print(aids.length);
        if ((Player.Poisoned() || Player.Hits() < Player.MaxHits()) && !Orion.HaveTarget())
        {
            if(Player.Dex() > 80){
              var bandagetime = 8000;
              //bandagetime = 8000 - (((Player.Dex()-80)/20)*1000)  I think this one is wrong
              bandagetime = 12000 - (((Player.Dex())/20)*1000)
            }
            else{
              var bandagetime = 8000;
            }
            //Orion.CreateClientMacro("BandageSelf").Play();
            Orion.BandageSelf();
            didband = Orion.WaitJournal("You begin applying the bandages.", Orion.Now(), Orion.Now() + 2000, "sys");
            if(didband){
              Orion.AddDisplayTimer("64", bandagetime, "UnderChar", "Circle|Bar", "Bandage", 60, 0, '55', 0xFF, '0xFFFFFF');
              Orion.Wait(bandagetime);
            }
            else{
              Orion.Wait(500);
            }
        }
        else
        {
            Orion.Wait(100);
        }
    }
    if (!Player.Dead() && Orion.Count("bandage") == 0)
    {
        Orion.CharPrint(self, 1153, "-- no bandages left --");
        var belts = Orion.FindType('0xA1F6','any');
        if(belts.length > 0){
          for(var i = 0; i < belts.length; i++){
            Orion.OpenContainer(belts.Serial());
            Orion.Wait(1200);
            Orion.Exec("AutoHealing");
          }
        }
    }
}

function HealTimer()
{
  if (Player.Hits() < Player.MaxHits())
  {
      if(Player.Dex() > 80){
        var bandagetime = 8000;
        bandagetime = 8000 - (((Player.Dex()-80)/20)*1000)
      }
      else{
        var bandagetime = 8000;
      }
      Orion.CreateClientMacro("BandageSelf").Play();
      Orion.AddDisplayTimer("64", bandagetime, "UnderChar", "Circle|Bar", "Bandage", 60, 0, '55', 0xFF, '0xFFFFFF');
      Orion.Wait(100);
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
function PowderAllContainer(){
  var maxdur = 255;
  Orion.CharPrint(Player.Serial(),'906',"Click box/bag with armor.")
  Orion.WaitForAddObject('ArmorBox', '10000');

  Orion.OpenContainer("ArmorBox");
  aBox = Orion.FindObject("ArmorBox");

  armor =  Orion.FindTypeEx('any', 'any', aBox.Serial());
  keg =  Orion.FindTypeEx('0x1940', '0x0973', 'backpack');
  if(keg.length < 1){
    Orion.Print("You don't have a fort keg in your pack, there's about to be an error")
  }
  else{
    keg = keg[0];
  }
  for(var i = 0;i<armor.length;i++){
    var properties = armor[i].Properties();
    if (Orion.Contains(armor[i].Properties(), 'Durability')){
      Orion.Wait(1500);
      var matches = /Durability (\d+)\s\/\s(\d+)/.exec(properties);
      if(matches.length > 2 && Number(matches[2]) < maxdur){
        //Orion.Print(matches[1] + " / " +matches[2])
        currDurr = Number(matches[2]);
        Orion.MoveItem(armor[i].Serial(), 30, 'backpack');
        Orion.Wait(1500);
        pofTimes = 255 - matches[2];
        pofTimes = Math.ceil(pofTimes / 10);
        for(var j = 0;j < pofTimes;j++){
          Orion.UseObject(keg.Serial())
          Orion.WaitForTarget(5000);
          Orion.TargetObject(armor[i].Serial())
          Orion.Wait(1500);
        }
        Orion.MoveItem(armor[i].Serial(), 30, aBox.Serial());
        Orion.Wait(1500);
      }
    }
  }
}

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
      //Making sure there are enough Bottles (This isn't needed, they make their own bottles)
      /*boxbottles =  Orion.FindTypeEx('0x0F0E', '0x0000', kegbox.Serial());
      packbottles = Orion.Count('0x0F0E', '0x0000', 'backpack');
      if(packbottles < 30 && boxbottles[0]){
        Orion.MoveItem(boxbottles[0].Serial(), 30, 'backpack');
        Orion.Wait(1200);
      }*/
      Orion.MoveItem(kegs[i].Serial(), 30, 'backpack');
      Orion.Wait(1100);
      //Emptying Keg into bottles
      for(j=0;j<numpots;j++){
        Orion.Wait(1500);
        Orion.UseObject(kegs[i].Serial());
      }
      Orion.Wait(1200);
      packnovas = Orion.FindType('0x0F09', '0x000D|0x09C4', 'backpack');
      Orion.Print("Novas/Stats in pack: "+ packnovas.length);
      if(packnovas.length >= 20){
        for(j=0;j<packnovas.length;j++){
          Orion.MoveItem(packnovas[j], '0', novabox.Serial());
          Orion.Wait(1500);
        }
      }
    }
    packnovas = Orion.FindType('0x0F09', '0x000D|0x09C4', 'backpack');
    Orion.Print("Novas/Stats in pack: "+ packnovas.length);
    if(packnovas.length >= 0){
      for(j=0;j<packnovas.length;j++){
        Orion.MoveItem(packnovas[j], '0', novabox.Serial());
        Orion.Wait(1500);
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
function DiscordTimer(){
  Orion.UseSkill("Discordance");
  Orion.WaitForTarget(2000);
  if(Orion.HaveTarget()){
    var temp = Orion.WaitJournal("play jarring|attempt to disrupt",Orion.Now()-2000,Orion.Now()+20000,"sys");
    if(temp != null && Orion.Contains(temp.Text(),"play jarring")){
      Orion.AddDisplayTimer(199, 5000, "UnderChar", "Circle|Bar", "Discord", 60, 0, '55', 0xFF, '0xFFFFFF');
    }
    else{
      Orion.CharPrint(self, 37, "Discord failed!");
    }
  }
}

function DiscordFist(){
  if(Orion.HaveTarget() && Orion.GetDistance(Orion.ClientLastTarget()) <= 10){
    Orion.TargetObject(Orion.ClientLastTarget());
  }
  Orion.Cast("Holy Fist")
  Orion.Wait(100);
  while(Orion.GetDistance('lasttarget') > 10){
    Orion.Wait(100);
  }
  Orion.UseSkill("Discordance");
  Orion.WaitForTarget(2000);
  Orion.TargetObject(Orion.ClientLastTarget());
  var temp = Orion.WaitJournal("play jarring|attempt to disrupt",Orion.Now()-1000,Orion.Now()+2000,"sys");
  if(temp != null && Orion.Contains(temp.Text(),"play jarring")){
    Orion.AddDisplayTimer(199, 5000, "UnderChar", "Circle|Bar", "Discord", 60, 0, '55', 0xFF, '0xFFFFFF');
  }
  else{
    Orion.CharPrint(self, 37, "Discord failed!");
  }
  Orion.WaitForTarget(2000);
  if(Orion.HaveTarget() && Orion.GetDistance(Orion.ClientLastTarget()) <= 10){
    Orion.TargetObject(Orion.ClientLastTarget());
  }
}

function BoatRope(){
  Orion.UseObject('0x43F2CE8E');
  Orion.UseObject('0x440C6C2E');
  var rope = Orion.FindTypeEx('0x14FA', any, ground, 'near', 20)
  if(rope[0])
      Orion.UseObject(rope[0].Serial())
}

function ShitTalker()
{
  var phrases = [];
  phrases = [
    "Nice sync script %n.",
    "Good lord %n, how many tele rings did you burn to still die?",
    "%n, you're 10 pounds of suck in a 5 pound bag.",
    'Damn %n, you died faster than it took me to type your name.',
    'Should have warcried %n.',
    "Sorry %n, you can't overcome the skill that is disarm AI spam",
    "I didn't even bother looting your stat pot %n.",
    "Losing with double numbers %n? Embarassing.",
    "Man %n, that's an ambitious amount of pots for how fast you died.",
    "I swear %n's horse put up a harder fight than he did."
  ]

  while (true){
          var deathFound = Orion.WaitJournal('soundecho: id=0x0423|soundecho: id=0x0315', Orion.Now(), 0, 'sys')
          if(deathFound != null){
            Orion.Wait(600);
            var deathMsg = Orion.InJournal('a corpse of','item',0,'any',Orion.Now()-1500,Orion.Now()+1000);
            if(deathMsg != null){
              deathMsg = deathMsg.Text().split("a corpse of ");
              deathMsg = deathMsg[1];
              var name = deathMsg;
              var randIndex = Math.floor(Math.random() * phrases.length);
              deathMsg = phrases[randIndex].replace(/%n/g, name);
              var friendList = Orion.GetFriendList(true);
              var newFriend = [];
              for(var i =0; i < friendList.length;i++){
                var temp = friendList[i].split(" ");
                var pushName = '';
                for(j =1; j< temp.length; j++){
                  pushName += temp[j];
                  if(temp.length > 2 && j != temp.length -1){
                    pushName += " ";
                  }
                }
                newFriend.push(pushName);
              }
              newFriend.push(Player.Name());
              if(newFriend.indexOf(name) == -1){
                Orion.Say(', ' + deathMsg);
                //Orion.Print(deathMsg);
              }

            }
          }
  Orion.Wait(500);
  }
}

function parsereplace(str,insertString) {
    return str.replace(/%n/g, insertString);
}

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
  if (dartbelt != null && Orion.Timer("DartTimer") >= -1 && Orion.GetDistance('lasttarget') <=3){
    Orion.UseObject(dartbelt.Serial())
    Orion.WaitForTarget(1500)
    Orion.TargetObject(thetarg)
    Orion.SetTimer("DartTimer",-3500);
    }
  else if (starbelt != null && Orion.Timer("StarTimer") >= -1 && Orion.GetDistance('lasttarget') <=10)    {
    Orion.UseObject(starbelt.Serial())
    Orion.WaitForTarget(1500)
    Orion.TargetObject(thetarg)
    Orion.SetTimer("StarTimer",-3500);
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

function PoisonOJPet(){
  var thetarg = Orion.FindTypeEx('any', '-1', 'ground', 'ignoreself|ignorefriends|nothuman|live|near', '30', 'orange');
  if(thetarg.length == 0){
    Orion.Print("No OJ pets around!")
  }
  else{
    thetarg = thetarg[0].Serial();
    if(Orion.HaveTarget()){
      Orion.TargetObject(thetarg);
    }
    else{
      Orion.Cast("Poison");
      Orion.WaitTargetObject(thetarg);
    }
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
function MakeStarTen(){
  //Makes ten stacks of stars
  //Target resource box
  if(!Orion.FindObject('ResourceBox')){
    Orion.CharPrint(Player.Serial(),'906',"Click box/bag with your resources.")
    Orion.WaitForAddObject('ResourceBox', '10000');
  }
  //Make sure both were valid objects
  if(!Orion.FindObject("ResourceBox")){
    Orion.CharPrint(Player.Serial(),'906',"Error with resource container.")
    Orion.SetGlobal("doTink",0);
  }
  else{
    Orion.OpenContainer("ResourceBox");
    Orion.Wait(1100);
  }
  var stararr = Orion.FindTypeEx('0x27AC', 'any', 'ResourceBox');
  Orion.Print("Stars in box: " + stararr.length)
  for(var i=0;i<stararr.length;i++){
    if(Orion.Contains(stararr[i].Properties(),"Uses Remaining: 2")){
      Orion.MoveItem(stararr[i].Serial());
      Orion.Wait(1200);
    }
  }
  stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
  var starbeltarr = Orion.FindTypeEx('0x2790', 'any', 'backpack');
  var theBelt = null;
  for(var i =0;i<starbeltarr.length;i++){
    if(Orion.Contains(starbeltarr[i].Properties(),"Uses Remaining: 0")){
      theBelt = starbeltarr[i];
      break;
    }
  }
  if(theBelt == null){
    Orion.Print("You need at least one empty belt to do this.");
    return false;
  }
  else{
    while(stararr.length > 0){
      theBelt = Orion.FindObject(theBelt.Serial());
      if(!Orion.Contains(theBelt.Properties(),"Uses Remaining: 10")){
        Orion.RequestContextMenu(theBelt.Serial());
        Orion.WaitContextMenuID(theBelt.Serial(), 701);
        Orion.WaitForTarget(1000);
        if(Orion.HaveTarget()){
          Orion.TargetObject(stararr[0].Serial());
          stararr.splice(i,1);
        }
      }
      else{
        Orion.RequestContextMenu(theBelt.Serial());
        Orion.WaitContextMenuID(theBelt.Serial(), 702);
      }
      Orion.Wait(1000);
      stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
      for(var i =0;i<stararr.length;i++){
        if(!Orion.Contains(stararr[i].Properties(),"Uses Remaining: 10")){
          stararr.splice(i,1);
        }
      }
    }
  }

}


function StarDartLoad(){
  //0x0F0A = DP
  //Ninja star section
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
  //Loading the ninja belt with DP stars
  for(var i =0;i<starbeltarr.length;i++){
    if(Orion.Contains(starbeltarr[i].Properties(),"Uses Remaining: 0") && stararr.length > 0){
      stararr = Orion.FindTypeEx('0x27AC', 'any', 'backpack');
      starbelt = starbeltarr[i];
      Orion.RequestContextMenu(starbelt.Serial());
    	Orion.WaitContextMenuID(starbelt.Serial(), 701);
    	if (Orion.WaitForTarget(1000))
    		Orion.TargetObject(stararr[0].Serial());
    }
    Orion.Wait(1200);
  }
  //Dart Section
  var dartstacks = 5;
  dartregexp = new RegExp('Uses Remaining: (\\d\+)');
  var dartgunarr = Orion.FindTypeEx('0x27AA', 'any', 'backpack');
  var dartarr = Orion.FindTypeEx('0x2806', 'any', 'backpack');
  var tenstack = [];
  var morestack = [];
  for(var i =0;i<dartarr.length;i++){
    var properties = dartarr[i].Properties();
    var matches = dartregexp.exec(properties);
    if(matches.length > 0){

      if(Number(matches[1]) == 10){
        tenstack.push(dartarr[i]);
      }
      else if(Number(matches[1]) >= 0){
        morestack.push(dartarr[i]);
      }
    }
  }
  //Only builds more dart stacks if at zero
  if(tenstack.length == 0){
    if(dartgunarr.length != 0){
      var actualstacks = 0;
      var dartgun = dartgunarr[0];
      while(actualstacks < dartstacks && morestack.length > 0){
        Orion.RequestContextMenu(dartgun.Serial());
        Orion.WaitContextMenuID(dartgun.Serial(), 703);
        if (Orion.WaitForTarget(1000))
          Orion.TargetObject(morestack[0].Serial());
        Orion.Wait(1000);
        Orion.RequestContextMenu(dartgun.Serial());
        Orion.WaitContextMenuID(dartgun.Serial(), 704);
        Orion.Wait(1000);
        actualstacks++;
      }
    }
    else{
      Orion.Print("You need a dart gun!");
    }
  }
  else if(tenstack.length == 0 && morestack.length == 0){
    Orion.Print("You need more darts.");
  }
  var tenstack = [];
  var morestack = [];
  var dartarr = Orion.FindTypeEx('0x2806', 'any', 'backpack');
  for(var i =0;i<dartarr.length;i++){
    var properties = dartarr[i].Properties();
    var matches = dartregexp.exec(properties);
    if(matches.length > 0){

      if(Number(matches[1]) == 10){
        tenstack.push(dartarr[i]);
      }
      else if(Number(matches[1]) >= 0){
        morestack.push(dartarr[i]);
      }
    }
  }
  //Checking and DP'ing the ten dartstacks
  for(var i =0;i<tenstack.length;i++){
    poisons = Orion.FindTypeEx('0x0F0A', 'any', 'backpack');
    if(poisons.length == 0){
      Orion.Print("You need to grab DP pots");
      break;
    }
    else if(Orion.Contains(tenstack[i].Properties(),"Uses Remaining: 10") && !Orion.Contains(tenstack[i].Properties(),"Deadly Poison Charges: 10")){
      dart = tenstack[i];
      Orion.UseSkill("Poisoning");
      Orion.WaitForTarget(1000);
      Orion.TargetObject(poisons[0].Serial())
      Orion.WaitForTarget(1000);
      Orion.TargetObject(dart.Serial());
      Orion.Wait(1000);
      Orion.RequestContextMenu(Player.Serial());
      Orion.WaitContextMenuID(Player.Serial(), 418);
      if (Orion.WaitForTarget(1000)){
        Orion.TargetObject(dart.Serial());
      }
      Orion.Wait(100);
      Orion.CancelTarget();
      if(i != tenstack.length-1){
        Orion.Wait(10000);
      }
    }
  }
  //Loading dart gun
  for(var i =0;i<dartgunarr.length;i++){
    if(Orion.Contains(dartgunarr[i].Properties(),"Uses Remaining: 0")){
      var dartgun = dartgunarr[i];
      if(tenstack.length > 0){
        Orion.RequestContextMenu(dartgun.Serial());
        Orion.WaitContextMenuID(dartgun.Serial(), 703);
        if (Orion.WaitForTarget(1000)){
          Orion.TargetObject(tenstack[0].Serial());
        }
        tenstack.splice(0,1);
        Orion.Wait(500);
        Orion.CancelContextMenu();
        Orion.Wait(700);
      }
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

function KeepCouterAttack(){
  while(true){
    if(!Player.Dead() && Orion.SkillValue("Bushido") > 1000 && !Player.Hidden() && !Orion.BuffExists("Counter Attack") &&  !Orion.BuffExists("Evasion") && !Orion.BuffExists("Confidence") && !Orion.HaveTarget() && Player.WarMode()){
        Orion.Cast("Counter Attack");
      }
    Orion.Wait(100);
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

function Sleep_FocusDisarm()
{
  var dmountdist = 10;
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
            Orion.Cast("Focus Attack");
            Orion.Wait(100);
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
            Orion.Cast("Shield Bash");
            //Orion.UseAbility('Secondary', 'true');
            //Orion.Attack(myTarget.Serial());
            //ShieldBash('wep_glendashield');
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
  else if(abil == "focus"){
    prevsabil = Orion.GetGlobal("SelAbil");
    Orion.SetGlobal("SelAbil","focus");
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
    if(auto == 'false' && doonce == 'true' && abil != "focus"){
      Orion.UseAbility(abil);
      Orion.SetTimer("SpecialUsed",-3050);
    }
    else if(auto == 'false' && doonce == 'true' && abil == "focus"){
      Orion.Cast("Focus Attack");
    }
    else if(auto == 'false' && doonce == 'true' && abil == "ds"){
      Orion.Cast("Death Strike");
    }
    else if (auto == 'true' && (!Orion.AbilityStatus(abil) && !Orion.SpellStatus('Focus Attack')) && Player.Mana() > manacost){
      while(Player.Frozen() || Orion.HaveTarget() && !Player.Frozen()) {
        Orion.Wait(100);
      }
      if(!Player.Dead() && abil != "focus"){
        Orion.UseAbility(abil);
        Orion.SetTimer("SpecialUsed",-3050);
      }
      else if(!Player.Dead() && abil == "focus"){
        Orion.Cast("Focus Attack");
      }
      else if(!Player.Dead() && abil == "ds"){
        Orion.Cast("Death Strike");
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

function TwoHandEvadeTimer(){
  Orion.Wait(50)
  Orion.Dress("wep_secondary")
  Orion.Wait(100);
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

    var ogFriendsX = Number(Orion.RegRead(Player.Serial()+"/FriendX"));
    var ogFriendsY = Number(Orion.RegRead(Player.Serial()+"/FriendY"));
    var offsetFriendsX = Number(Orion.RegRead(Player.Serial()+"/FriendX"));
    var offsetFriendsY = Number(Orion.RegRead(Player.Serial()+"/FriendY"));
    var numFriends = 0;

    var offsetEnemiesX = Number(Orion.RegRead(Player.Serial()+"/OJX"));
    var offsetEnemiesY = Number(Orion.RegRead(Player.Serial()+"/OJY"));
    var ogEnemiesX = Number(Orion.RegRead(Player.Serial()+"/OJX"));
    var ogEnemiesY = Number(Orion.RegRead(Player.Serial()+"/OJY"));
    var numEnemies = 0;

    var tempsplit = Orion.RegRead(Player.Serial()+"/barspace/actualval"); //60 for standard bars, 40? for Sallos
    tempsplit = tempsplit.split("|");
    var stepY = Number(tempsplit[0]); //60 for standard bars, 40? for Sallos
    var stepX = Number(tempsplit[1]);  //153 for classic, 130 sallos
    var barsperrow = Number(Orion.RegRead(Player.Serial()+"/barsper/actualval"));

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
        var offsetFriendsX = Orion.RegRead(Player.Serial()+"/FriendX");
        var offsetFriendsY = Orion.RegRead(Player.Serial()+"/FriendY");
        var offsetEnemiesX = Orion.RegRead(Player.Serial()+"/OJX");
        var offsetEnemiesY = Orion.RegRead(Player.Serial()+"/OJY");
    }
    Orion.Wait(500);
    }
}

function ClearBars(){
    Orion.SetGlobal("BarClear",'true');
}
function ToggleAutoBars(){
    if(Orion.GetGlobal("doPullbars") == 1){
        Orion.SetGlobal("BarClear",'true');
        Orion.SetGlobal("doPullbars",0);
        Orion.RegWrite(Player.Serial()+"/Auto Bar Pulling",0)
        Orion.Print("Stopping Auto Bars.");
    }
    else {
        Orion.SetGlobal("doPullbars",1);
        Orion.RegWrite(Player.Serial()+"/Auto Bar Pulling",1)
        Orion.Print("Starting Auto Bars.");
        AutoBarPopulate();
    }
}

function CatchSerial(){

  highlightcaller = true;
  highlightcallercolor = "1092";
  highlightLTcolor = '1152';

  Orion.ClearHighlightCharacters(true);
  while(Orion.GetGlobal("doCatch") == 1){
    var caught = Orion.WaitJournal("R;",Orion.Now(),0,0,0,"0x03B2");
    var caughtobj = caught;
    var highlightLTcolor = Orion.RegRead(Player.Serial()+"/TargetHighlight/actualval");
    var highlightcallercolor = Orion.RegRead(Player.Serial()+"/CallerHighlight/actualval");
    var highlightcaller = Orion.RegRead(Player.Serial()+"/Highlight Caller") != 0 ? true:false;
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
      if(caughtobj && Orion.GetFriendList().indexOf(caughtobj.Serial()) == -1){
        Orion.Print("Friend not found.")
        attacktar = 'false';
        highlightcaller = false;
      }

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
  doAttack = Orion.RegRead(Player.Serial() + "/Auto Attack Caught Target");
  tdelay = Orion.RegRead(Player.Serial() + "/timeattackAct")*1000;
  //Orion.Print(doAttack + " | " + tdelay);
  if(doAttack == 1 && !Orion.HaveTarget() && Orion.FindObject(attackser)){
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

function ShitTalk(){
  var bodies = 1;
}

function WardRemoval(){
  var talitimer = 15; //Time in minutes
  talitimer = talitimer * -60000; //Coverting to minutes;
  var packItems = Orion.FindTypeEx('any','any','backpack');
  var tali = [];
  for(var i = 0;i<packItems.length;i++){
    if(packItems[i].EquipLayer() == 9 && Orion.Contains(packItems[i].Name(),"Ward Removal")){
      tali.push(packItems[i]);
    }
  }
  //Orion.Print("Ward Removal Tali's: " + tali.length);
  //Orion.Print(Orion.ObjAtLayer(9))
  if(!Orion.ObjAtLayer(9) || !Orion.Contains(Orion.ObjAtLayer(9).Name(),"Ward Removal") || Orion.Timer("TT:"+Orion.ObjAtLayer(9).Serial()) < -1){
    var didequip = false;
    for(var i = 0;i<tali.length;i++){
      if(Orion.Timer("TT:"+tali[i].Serial()) >= -1){
        Orion.Equip(tali[i].Serial());
        didequip = true;
        Orion.Wait(1100);
        break;
      }
    }
    if(!didequip){
      Orion.Print("You are out of tali's not on timer.");
    }
  }
  else if(Orion.ObjAtLayer(9)){
    Orion.UseObject(Orion.ObjAtLayer(9).Serial());
    Orion.WaitForTarget(1000);
    if(Orion.HaveTarget()){
      if(Orion.FindObject(Orion.ClientLastTarget()) != null){
        Orion.TargetObject(Orion.ClientLastTarget());
      }
      else{
        Orion.CancelTarget();
        Orion.Print("Last target not found.");
      }
    }
    //Commenting this out as it has weird behavoir around queuing targets.
    //Orion.WaitTargetObject(Orion.ClientLastTarget());
    Orion.Wait(200);
    //Orion.UseItemOnMobile(Orion.ObjAtLayer(9).Serial(), Orion.ClientLastTarget());
    if(Orion.InJournal('wards have been removed!','sys',0,'any',Orion.Now()-1000,Orion.Now()+5000)){
      Orion.SetTimer("TT:"+Orion.ObjAtLayer(9).Serial(),talitimer);
      Orion.Print("Wards removed!");
    }
  }
  else{
    Orion.Print("You either don't have a tali equipped at all, you're out of tali's or both!")
  }
}

//--Gump Section

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
  var bground = '09BF5';
	gump.AddResizepic(0, 0, bground, 710, 430);
  //General Gump Setup
  itemSerial = 1;
  gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
  //Save & Close Button
	gump.AddButton(0, 315, 400, '0x00F9', '0x00F8', '0x00F7', '0');
  //Start AutoPVM Button
  if(!distVersion){
    gump.AddButton(7, 90, 400, '0x7E8', '0x7E9', '0x7EA',"0");
    gump.AddTooltip("This button will start the Auto-Samp script!");
  }
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
    else if(gumpvars[i][1] == 'radio'){
      gump.AddRadio(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x016C9', '0x016CC', '0x016C5', gumpvars[i][3], '0', gumpvars[i][0],'0x00801');
      positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
    }
    else if(gumpvars[i][1] == 'tooltip'){
      gump.AddTooltip(gumpvars[i][3]);
    }
    else if(gumpvars[i][1] == 'page'){
      gump.AddPage(gumpvars[i][2]);
      gump.AddResizepic(0, 0, bground, 710, 430);
      gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
      gump.AddButton(0, 315, 400, '0x0EF', '0x0F0', '0x0F0',0,0,0);
      //Default reset button (only on page 2)
      if(gumpvars[i][2] == 1){

      }
      else if(gumpvars[i][2] == 2){
        gump.AddButton(5, 30, 400, '0x0F6', '0x0F4', '0x0F5',0,1);
        gump.AddTooltip("This action resets all the settings \n to their default settings.")
      }
      //Page 3 Only buttons (start auto-pvm)
      else if(gumpvars[i][2] == 3){
        //gump.AddButton(6, 500, 400, '0x1398', '0x1398', '0x1398',0,1); Plot Course Button
        gump.AddButton(6, 500, 400, '0x7E8', '0x7E9', '0x7EA',0,1);
        gump.AddTooltip("Once clicked, you have 10 seconds to get to\n where you want to anchor.")
        gump.AddButton(8, 140, 388, '0x84D', '0x84E', '0x84F',0,1);
        gump.AddTooltip("Reset the leader of the group.\nIf you are solo, select yourself.")
      }

      positions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];
    }
    else if(gumpvars[i][1] == 'button'){
      //0x7d6, hover d7
      //0=name,1=type,2=x,3=y,4=graphic,5=hover,6=page,7=buttonID
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
  prefix = Player.Serial();
  Orion.RegWrite(prefix +"/Stored", "false");
}

defaultvars =
// Name, obj type, row, value, y-offset (or combo vales)
//Obj type: cbox,title,combo,txtbox,plusminus,tooltip,page,button
//Colors: red = '0x0020', green = '0x0043'
[
  //General variables
  ["gumpx","gen",0,600],
  ["gumpy","gen",0,200],
  ["launchgumpx","gen",0,200],
  ["launchgumpy","gen",0,200],
  ["stopautogumpx","gen",0,300],
  ["stopautogumpy","gen",0,300],
  //Main page
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
  ["Broken Item Check",'cbox',3,1],
  ["Auto Counterattack",'cbox',4,1,-40],
  ["Auto Warcry",'cbox',4,50,1],
  ["Auto Run",'cbox',4,1],
  ["Samp Ability",'cbox',4,0],
  ["Targeting:","title",5,'0x002F'],
  ["Catch Target", 'cbox',6,1],
  ["Auto attack caught target", 'cbox',6,0,-70],
  ["Target Highlight:", 'title',6,0x00801,-85],
  ["TargetHighlight",'combo',6,0,"Glacial",1152,"Glacial Pink",1289,"Blaze",1161,"Europa Gold",1177,"Super Gold",1174,"White",1153,"Neon Green/Orange",2760,"Psychedelic Pink",1092,"Psychedelic Black",1182,"Psychedelic Green",1674,"All White",2058,"Abyss",2075,"Bloodwood Red",1194,"Dark Red/Brown",1148,"Dragon Red",1645,"Fire Orange",1359,"Dryad Green",1167,"Dull Ruby",2731],
  ["Highlight Caller", 'cbox',7,1,-40],
  ["Caller Highlight:", 'title',7,0x00801,-90],
  ["CallerHighlight",'combo',7,7,"Glacial",1152,"Glacial Pink",1289,"Blaze",1161,"Europa Gold",1177,"Super Gold",1174,"White",1153,"Neon Green/Orange",2760,"Psychedelic Pink",1092,"Psychedelic Black",1182,"Psychedelic Green",1674,"All White",2058,"Abyss",2075,"Bloodwood Red",1194,"Dark Red/Brown",1148,"Dragon Red",1645,"Fire Orange",1359,"Dryad Green",1167,"Dull Ruby",2731],
  ["Set Previous LT after Heal Ally",'cbox',8,0,-80],
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
  //Page buttons
  ["Page 2 Button",'button',600,400,0x7d6, 0x7d7,2,2],
  //These next two lines need to be commented out for the distribution version
  ["Page 3 Button",'button',30,400,0x83F, 0x840,3,3],
  ["spacebarstooltip",'tooltip',3,"This will take you to the page that\nhas additional settings for the Auto-Sampire scripts!"],
  //Page 2: General Settings Page
  ["Settings Page","page",2],
  ["Auto-Apple Activation Spells:","title",1,'0x002F'],
  ["Corpse Skin", 'cbox',2,1,-15],
  ["Sleep", 'cbox',2,1,10],
  ["Mortal Strike", 'cbox',2,1,-25],
  ["Spell Plauge", 'cbox',2,0,-25],
  ["Curse", 'cbox',2,0,10],
  ["Strange", 'cbox',2,0],
  ["Blood Oath", 'cbox',2,0],
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
  ["Open paperdoll for suit information (Current target gump)", 'cbox',11,0,-250],
  //Page 3: Auto/Farming Script Setup
  ["Farming Page","page",3],
  ["Farming Mode:","title",1,'0x002F'],
  ["Dexxer/Sampire", 'radio',2,0,-20],
  ["Stationary Dexxer", 'radio',2,0,-45],
  ["Stationary Necro", 'radio',2,0,-30],
  ["Stealth Looter", 'radio',2,0,-15],
  ["Auto Attack Options:","title",3,'0x002F',-75],
  ["Attack Radius:", 'title',4,0x00801,-55],
  ["attackrstooltip",'tooltip',4,"Distance away from the 'home' location that the\ncharacter will seek out and attack."],
  ["attackradius",'plusminus',4,9],
  ["Maximum stray distance:", 'title',4,0x00801,-100],
  ["maxstraytip",'tooltip',4,"Distance away from the 'home' location that the\ncharacter will be allowed to stray before being forced back\nto the home location."],
  ["maxstray",'plusminus',4,20],
  ["Maximum time on target (sec):", 'title',4,0x00801,-120],
  ["maxtargtimetip",'tooltip',4,"Maximum time on target (without it taking damage)\nbefore the script will move on to the next target."],
  ["maxtargtime",'plusminus',4,10],
  ["Monster ID:", 'title',5,0x00801,-40],
  ["creatureID",'txtbox',5,"any",60],
  ["In Line-of-Sight", 'cbox',5,1,-15],
  ["Stay In Area", 'cbox',6,1,-15],
  ["Honor Target", 'cbox',6,1,-15],
  ["Flag All Creatures", 'cbox',6,0,-45],
  ["Enemy of One", 'cbox',6,0,-15],
  ["Consecrate Weapon", 'cbox',6,0,-15],
  ["Loot Options:","title",7,'0x002F'],
  ["Loot Kills", 'cbox',8,1,10],
  ["Item Minimum Intensity:", 'title',8,0x00801,-110],
  ["lootIntensity",'txtbox',8,140,40],
  ["Insure Looted Items", 'cbox',8,1,-25],
  ["Insure Event Item", 'cbox',9,1,-25],
  ["Event Item Color:", 'title',9,0x00801,-75],
  ["eventItemColor",'combo',9,2,"Other","other","Wildfire (Fire)","0x0AC6","Demonic (Hythloth)","0x0AC1","Eggs (Destard)","0x0AC3"],
  ["Other Color:", 'title',9,0x00801,-50],
  ["eventItemOther",'txtbox',9,"0x0000",60],
  ["Unattended Assistance:","title",10,'0x002F'],
  ["Close Client when GM", 'cbox',11,0,-25],
  ["Notify Discord when GM", 'cbox',11,0,-25],
  ["Webhook Address:", 'title',11,0x00801,-50],
  ["GMwebhook",'txtbox',11,"",60],
  ["Group Control Options:","title",12,'0x002F'],
  ["Reset Group Leader: ", 'title',13,0x00801,0],
]
function PVPloadvars(){
  var allthem = defaultvars;
  prefix = Player.Serial();
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
  prefix = Player.Serial();
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
    Orion.RegWrite(prefix+"/gumpx",gpos.X());
    Orion.RegWrite(prefix+"/gumpy",gpos.Y());
  }
  //Setting global variables to turn on/off various Scripts
  //PvP / Original Section
  Orion.SetGlobal("LootType",Orion.RegRead(prefix+"/eventItemColor/actualval"))
  Orion.SetGlobal("doSeed",Orion.RegRead(prefix+"/Auto Seed"));
  Orion.SetGlobal("doBox",Orion.RegRead(prefix+"/Auto Box"));
  Orion.SetGlobal("doApple",Orion.RegRead(prefix+"/Auto Apple"));
  Orion.SetGlobal("doRun",Orion.RegRead(prefix+"/Auto Run"));
  Orion.SetGlobal("doCry",Orion.RegRead(prefix+"/Auto Warcry"));
  Orion.SetGlobal("doDexStr",Orion.RegRead(prefix+"/Auto Start Dex-Str Pot"));
  Orion.SetGlobal("doCA",Orion.RegRead(prefix+"/Auto Counterattack"));
  Orion.SetGlobal("doAbility",Orion.RegRead(prefix+"/Auto Ability"));
  Orion.SetGlobal("doRearm",Orion.RegRead(prefix+"/Auto Rearm"));
  Orion.SetGlobal("doRearmOnly",Orion.RegRead(prefix+"/Rearm on disarm ONLY"));
  Orion.SetGlobal("doCatch",Orion.RegRead(prefix+"/Catch Target"));
  Orion.SetGlobal("doHighCaller",Orion.RegRead(prefix+"/Highlight Caller"));
  Orion.SetGlobal("doHeal",Orion.RegRead(prefix+"/Auto Chug Cure/Heal"));
  Orion.SetGlobal("doSamp",Orion.RegRead(prefix+"/Samp Ability"));
  Orion.SetGlobal("doDmgDrop",Orion.RegRead(prefix+"/Broken Item Check"));
  Orion.SetGlobal("doAllyLT",Orion.RegRead(prefix+"/Set Previous LT after Heal Ally"));
  if(Orion.RegRead(prefix+"/Auto Bar Pulling") == 0){
    Orion.SetGlobal("BarClear",'true');
    Orion.SetGlobal("doPullbars",Orion.RegRead(prefix+"/Auto Bar Pulling"));
  }
  else{
    Orion.SetGlobal("doPullbars",Orion.RegRead(prefix+"/Auto Bar Pulling"));
    if(!Orion.ScriptRunning('AutoBarPopulate')){
      Orion.Exec("AutoBarPopulate",true);
    }
  }
  if(Orion.GetGlobal("doRearm") == 1 && !Orion.ScriptRunning('AutoRearm')){
    Orion.Exec("AutoRearm",true);
  }
  if(Orion.GetGlobal("doAbility") == 1 && !Orion.ScriptRunning('AutoAbility')){
    Orion.Exec("AutoAbility",true);
  }
  if(Orion.GetGlobal("doCatch") == 1 && !Orion.ScriptRunning('CatchSerial')){
    Orion.Exec("CatchSerial",true);
  }
  if(Orion.GetGlobal("doSamp") == 1 && !Orion.ScriptRunning('SampAbility')){
    Orion.Exec("SampAbility",true);
  }
  Orion.Exec("AutoEverything",true);
  //PvM Section
  Orion.SetGlobal("doDexxer",Orion.RegRead(prefix+"/Dexxer/Sampire"));
  Orion.SetGlobal("doDexxer_fixed",Orion.RegRead(prefix+"/Stationary Dexxer"));
  Orion.SetGlobal("doFixed",Orion.RegRead(prefix+"/Stationary Necro"));
  Orion.SetGlobal("doStealthloot",Orion.RegRead(prefix+"/Stealth Looter"));
  Orion.SetGlobal("creatureID",Orion.RegRead(prefix+"/creatureID"));
  Orion.SetGlobal("doLOS",Orion.RegRead(prefix+"/In Line-of-Sight"));
  Orion.SetGlobal("doHonor",Orion.RegRead(prefix+"/Honor Target"));
  Orion.SetGlobal("doLoot",Orion.RegRead(prefix+"/Loot Kills"));
  Orion.SetGlobal("doInsure",Orion.RegRead(prefix+"/Insure Looted Items"));
  Orion.SetGlobal("doEventInsure",Orion.RegRead(prefix+"/Insure Event Item"));
  Orion.SetGlobal("doSampMode",Orion.RegRead(prefix+"/Flag All Creatures"));
  Orion.SetGlobal("doEOO",Orion.RegRead(prefix+"/Enemy of One"));
  Orion.SetGlobal("doConsecrate",Orion.RegRead(prefix+"/Consecrate Weapon"));
  Orion.SetGlobal("doGoHome",Orion.RegRead(prefix+"/Stay In Area"));
  Orion.SetGlobal("doGMclose",Orion.RegRead(prefix+"/Close Client when GM"));
  Orion.SetGlobal("doGMnotify",Orion.RegRead(prefix+"/Notify Discord when GM"));
  if(Orion.GetGlobal("doEventInsure") == 1 && !Orion.ScriptRunning('InsureEventItem')){
    Orion.Exec("InsureEventItem",true);
  }
  if((Orion.GetGlobal("doGMclose") == 1 || Orion.GetGlobal("doGMnotify") == 1) && !Orion.ScriptRunning('AntiGM')){
    Orion.Exec("AntiGM",true);
  }
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
      else if(defaultvars[i][1] == 'radio'){
        defaultvars[i][3] = CustomGumpResponse.Radio(i+10) ? 1 : 0;
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
  else if (code == 6 || code == 7) // Start PVM-AutoScript
	{
    var gump = Orion.CreateCustomGump(gumpnum);
		gump.Close();
    if(Orion.ScriptRunning("AttackLoop")){
      Orion.Terminate("AttackLoop|KeepAlive|stealthAlive");
      var gump = Orion.CreateCustomGump(151);
      gump.Close();
    }
    else{
      Orion.Exec("AutoStartConfig",'true');
      Orion.Exec("SampAbility",'true');
      Orion.Wait(10000);
      Orion.Exec("AutoSampStopButton",'true');
    }

  }
  else if (code == 8) // Clear group leader
	{
    Orion.Print("Cleared the saved Leader!")
    Orion.RemoveObject('Leader');
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
  if(!healthupdate && Orion.RegRead(Player.Serial()+"/Current target gump") == "1"){
    var background = Orion.RegRead(Player.Serial()+"/CTGumpStyle/actualval");
    X = Orion.RegRead(Player.Serial()+"/CTX");
    Y = Orion.RegRead(Player.Serial()+"/CTY");
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
      if(!Orion.HaveTarget() && Orion.RegRead(Player.Serial()+'/Open paperdoll for suit information (Current target gump)') == 1){
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
      //Orion.Print(lowtext);
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
  if(Orion.RegRead(Player.Serial()+"/Current target gump") != "1"){
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
      Orion.RegWrite(Player.Serial()+"/CTX",pos.X());
      Orion.RegWrite(Player.Serial()+"/CTY",pos.Y());
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
              //Orion.Print(theobj.Name());
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
  var doLaunch = Orion.RegRead(Player.Serial() + "/Gump Launch Icon");
  var gumpx = Orion.RegRead(Player.Serial() + "/launchgumpx");
  var gumpy = Orion.RegRead(Player.Serial() + "/launchgumpy");
  if(doLaunch == 1){
    var gumpnum = 150;
    var gump1 = Orion.CreateCustomGump(gumpnum);
  	gump1.Clear();
  	// Set callback function
  	gump1.SetCallback('GumpLaunchResp');
    // Gump position
    gump1.SetX(gumpx);
    gump1.SetY(gumpy);
  	// Main background
    //Grey = 13BE
    var bground = '09BF5'
    //Wizard: 0xAAF or 0x776C or 0x15C1 (hat circle)
    var buttonid = 0x15C1;
    gump1.AddButton(0, 0, 0, buttonid, buttonid, buttonid, '0');
    //concatstring = '<img src="gump:' + lowicon + '" width=20 height=20>';
    //LTGump.AddText(148, 15, '0x9B8E', concatstring);
    gump1.Update();
  }
}

function AutoSampStopButton(){
  var gumpx = Orion.RegRead(Player.Serial() + "/stopautogumpx");
  var gumpy = Orion.RegRead(Player.Serial() + "/stopautogumpy");
  if(true){
    var gumpnum = 151;
    var gump = Orion.CreateCustomGump(gumpnum);
    gump.SetNoClose(true);
  	gump.Clear();
  	// Set callback function
  	gump.SetCallback('GumpLaunchResp');
    // Gump position
    gump.SetX(600);
    gump.SetY(10);
    gump.AddButton(2, 0, 0, 0xF1, 0xF2, 0xF3, '0');
    gump.Update();
  }
}

function GumpLaunchResp(){
  var launchGumpnum = 150;
  var stopautoGumpnum = 151;
  var code = CustomGumpResponse.ReturnCode();
	//Orion.Print('Custom gump response code = ' + code);
	if (code == 0){
    PVPGump();
  }
  if (code == 2){
    var pos1 = Orion.GetGumpPosition('custom', stopautoGumpnum);
    Orion.RegWrite(Player.Serial()+"/stopautogumpx",pos1.X());
    Orion.RegWrite(Player.Serial()+"/stopautogumpy",pos1.Y());
    var gump = Orion.CreateCustomGump(stopautoGumpnum);
    Orion.Wait(100);
    gump.Close();
    Orion.Terminate("AttackLoop");
    Orion.Terminate("KeepAlive");
  }
}

//--#PVP Scripts
//Not for general distribution

function SendSerial() {
  var LT = Orion.ClientLastTarget();
  LT = Orion.FindObject(LT);
  if(LT){
    Orion.SayGuild("R;" + LT.Serial() + ";" + LT.Name())
    Orion.SetGlobal("SentSerial",LT.Serial());
  }
  else{
    Orion.Print("Last target cannot be found.")
  }
}

function TargetSendNearestEnemy(){
  var mobArr = Orion.FindType("-1", "-1", ground, "live|inlos|ignoreself|ignorefriends|near", 20, "criminal|orange|red");
  if (mobArr.length){
    Orion.ClearHighlightCharacters(true);
    var currtar = Orion.FindObject(mobArr[0]);
    if(currtar != null){
      Orion.ClientLastTarget(currtar.Serial());
      Orion.CharPrint(Player.Serial(), '48', "Target:[" + currtar.Name()+ "]");
      Orion.SetGlobal("LTHighlight",mobArr[0]);
      Orion.AddHighlightCharacter(mobArr[0], '1152',true);
      Orion.SayGuild("R;" + currtar.Serial() + ";" + currtar.Name())
      Orion.SetGlobal("SentSerial",currtar.Serial());
    }
    else{
      Orion.Print("No target found.")
    }
  }
}

function SendFollow() {
  var LT = Orion.ClientLastTarget();
  //LT = LT * 14;
  LT = Orion.FindObject(LT);
  Orion.SayGuild("R;F1;" + LT.Serial() + ";" + LT.Name())
}

//--#Example Scripts
//Used for reference

function TestDisplayTimers()
{
    var shape = 'Circle';
    //var shape = 'Rectangle'
    //var shape = 'Line'
    var showBar = false;

    var positions = [ 'Left', 'Right', 'Top', 'Bottom', 'LeftTop', 'RightTop', 'LeftBottom', 'RightBottom', 'AboveChar', 'UnderChar' ];

    for (var positionIndex = 0; positionIndex < positions.length; positionIndex++)
    {
        Orion.AddDisplayTimer(positionIndex, 5000, positions[positionIndex], shape + (showBar ? '|Bar' : ''));
    }

    Orion.AddDisplayTimer(100, 5000, 'Custom', 'Circle', 'Custom timer circle', 100, 100, '0x0021', 0, 'red');
    Orion.AddDisplayTimer(101, 5500, 'Custom', 'Circle|Bar', 'Custom timer\ncircle with bar', 300, 100, '0x0033', 0, 'blue');
    Orion.AddDisplayTimer(102, 6000, 'Custom', 'Rectangle', 'Custom timer Rectangle', 100, 200, '0x0011', 1, 'yellow');
    Orion.AddDisplayTimer(103, 6500, 'Custom', 'Rectangle|Bar', 'Custom timer\nRectangle with bar', 300, 200, '0x0062', 2, 'red');
}

function TestResponseAllControls(unused)
{
	var code = CustomGumpResponse.ReturnCode();
	Orion.Print('Custom gump response code = ' + code);

	if (code == 0)
	{
		var gump = Orion.CreateCustomGump(15);
		gump.Close();
	}
	else if (code == 2) // Button tile art, reset page index
	{
		var gump = Orion.CreateCustomGump(15);
		gump.SetPage(0);
		gump.Update();
	}
	else if (code == 3) // Custom button, print response info
	{
		Orion.Print('Custom gump serial ' + CustomGumpResponse.Serial());

		Orion.Print('Checked checkboxes: ' + CustomGumpResponse.Checks());
		Orion.Print('Checked radio buttons: ' + CustomGumpResponse.Radios());

		var texts = CustomGumpResponse.Texts();

		for (var i = 0; i < texts.length; i++)
			Orion.Print('Text entry data, index: ' + texts[i].Index() + ' text: ' + texts[i].Text());

		var sliders = CustomGumpResponse.Sliders();

		for (var i = 0; i < sliders.length; i++)
			Orion.Print('Slider data, index: ' + sliders[i].Index() + ' value: ' + sliders[i].Value());

		var minMaxButtons = CustomGumpResponse.MinMaxButtons();

		for (var i = 0; i < minMaxButtons.length; i++)
			Orion.Print('MinMaxButtons data, index: ' + minMaxButtons[i].Index() + ' value: ' + minMaxButtons[i].Value());

		var comboBoxes = CustomGumpResponse.ComboBoxes();

		for (var i = 0; i < comboBoxes.length; i++)
			Orion.Print('ComboBox data, index: ' + comboBoxes[i].Index() + ' selected item index: ' + comboBoxes[i].Value());

		Orion.Print('Expanded spoilers: ' + CustomGumpResponse.Spoilers());
	}
}

function TestCustomGumpAllControls()
{
	// Create new custom gump with serial 15
	var gump = Orion.CreateCustomGump(15);

	// This gump will be no closible by a right mouse click
	gump.SetNoClose(true);

	// Clear gump cpntents (for rebuilds)
	gump.Clear();

	// Set callback function
	gump.SetCallback('TestResponseAllControls');

	// Main background
	gump.AddResizepic(0, 0, '13BE', 900, 500);

	var itemSerial = 1;

	// Buttons section
	gump.AddText(36, 15, '0', "Close button:");
	gump.AddButton(0, 45, 35, '0x00F3', '0x00F2', '0x00F1', '0');

	gump.AddText(20, 65, '0', "Change page button:");
	gump.AddButton(itemSerial++, 45, 85, '0x00F6', '0x00F5', '0x00F4', '0', 0, 2);

	gump.AddText(15, 115, '0', "Test button tile art:");
	gump.AddButtonTileArt(itemSerial++, 45, 135, '0x00F9', '0x00F7', '0x00F8', '0', '0x09AB', '0x0009', 10, 25);

	gump.AddResizepic(25, 215, '0x24B8', 100, 30, itemSerial++, 1);
	gump.AddText(32, 220, '0', "Custom button");



	// Checkboxes and radio buttons section
	gump.AddCheckbox(itemSerial++, 170, 20, '0x00D2', '0x00D2', '0x00D3', 1);
	gump.AddCheckbox(itemSerial++, 170, 40, '0x00D2', '0x00D2', '0x00D3', 0, '0', 'Checkbox 2 (unchecked)');
	gump.AddCheckbox(itemSerial++, 170, 60, '0x00D2', '0x00D2', '0x00D3', 1, '0', 'Checkbox 3 (red)', '0x0020');
	gump.AddCheckbox(itemSerial++, 170, 80, '0x00D2', '0x00D2', '0x00D3', 1, '0x0010', 'Colored checkbox 4', '0x001F');

	// Radios group 1
	gump.AddGroup(1);
	gump.AddRadio(itemSerial++, 170, 120, '0x00D0', '0x00D0', '0x00D1', 0);
	gump.AddRadio(itemSerial++, 170, 140, '0x00D0', '0x00D0', '0x00D1', 1, '0', 'Radio 2 G1');
	gump.AddRadio(itemSerial++, 170, 160, '0x00D0', '0x00D0', '0x00D1', 0, '0', 'Radio 3 G1 (yellow)', '0x0035');

	// Radios group 2
	gump.AddGroup(2);
	gump.AddRadio(itemSerial++, 170, 190, '0x00D0', '0x00D0', '0x00D1', 0, '0', 'Radio 4 G2');
	gump.AddRadio(itemSerial++, 170, 210, '0x00D0', '0x00D0', '0x00D1', 0, '0x0022', 'Radio 5 G2');
	gump.AddRadio(itemSerial++, 170, 230, '0x00D0', '0x00D0', '0x00D1', 1, '0', 'Radio 6 G2 (green)', '0x0044');



	// Tilepics and gumppics section
	gump.AddText(360, 20, '0', "How much is the fish?!?");
	gump.AddTilePic(360, 45, '0x09CC');
	gump.AddResizepic(410, 50, '0x0BB8', 90, 30);
	gump.AddMinMaxButtons(itemSerial++, 460, 56, '0x0037', 0, 0, 100000, 3500);
	gump.SetTextParameters(1, 'LeftCenter');

	gump.AddGumpPic(320, 50, '0x0065');
	// Load external image
	gump.AddText(370, 170, '0', '<img src="http://orionuo.online/grcat.png" width=130 height=100>');

	// Scaled gumppics/tilepics are not supported, but...Orion can do it
	gump.AddText(380, 340, '0xFFFE', '<img src="gump:0x0041" width=100 height=100>');
	for (var i = 0, j = 0; i < 9; i++)
	{
		if (i == 4)
			gump.AddTilePic(330 + i * 20, 284, '0x0B1A');
		else
		{
			gump.AddTilePic(330 + i * 20, 284, 0x1853 + j);
			j++;
		}
	}
	gump.AddTilePic(485, 340, '0x0C84');
	gump.AddTilePic(335, 340, '0x0C84');
	gump.AddTilePic(445, 330, '0x2102');
	gump.AddTilePic(400, 360, '0x09CC', '0', 0, '0', 1);
	gump.AddTilePic(425, 355, '0x09BA', '0', 0, '0', 1);
	gump.AddTilePic(405, 370, '0x09CF', '0', 0, '0', 1);
	gump.AddTilePic(405, 350, '0x09AD');
	gump.AddTilePic(430, 390, '0x09AD');
	gump.AddTilePic(385, 390, '0x09AD');
	gump.AddTilePic(335, 390, '0x09BB');
	// Colorise the pig with a global RGB color
	gump.AddGlobalColor(1, "#FF00FF");
	gump.AddTilePic(475, 390, '0x09BB');
	gump.AddGlobalColor(0);

	// Colorise the pig with a global RGBA color
	gump.AddBlending(1);
	gump.AddGlobalColor(1, "#7FFF00FF");
	gump.AddTilePic(515, 390, '0x09BB');
	gump.AddGlobalColor(0);
	gump.AddBlending(0);

	// Slider
	gump.AddSlider(itemSerial++, 390, 460, '0x00D8', '0x00D8', '0x00D8', '0x00D5', 1, 0, 90, 0, 255, 100);
	gump.SetTextParameters(1, 'Right', 0, 0, 0, 'Left');



	// ComboBox section
	gump.AddComboBox(itemSerial++, 15, 260, '0x0BB8', 0, '0x0BB8', 200, -3);

	gump.AddComboBoxText('Item 1');
	gump.AddComboBoxText('Auto selected colored item 2', '0x0021', 1);
	gump.AddComboBoxText('Colored item 3', '0x0006');
	// Width required to aligned items
	gump.AddComboBoxText('Item 4 center aligned', '0', 0, 190, 'center');
	gump.AddComboBoxText('Item 5 right aligned', '0', 0, 190, 'right');



	// Text entry section
	gump.AddResizepic(25, 295, '0x0BB8', 200, 20);
	gump.AddTextEntry(itemSerial++, 30, 295, '0x0035', 'User text 1', 190, 20);

	gump.AddResizepic(25, 320, '0x0BB8', 200, 20);
	gump.AddTextEntry(itemSerial++, 30, 320, '0x0052', '', 190, 20);
	gump.SetTextEntryPlaceholderText('Enter your name');


	// Hitbox section
	gump.AddGumpPic(200, 270, '0x0009');
	gump.AddGumpPic(200 + 45, 270 + 30, '0x0045');
	//gump.AddGumpPic(320 + 45, 50 + 30, '0x0046');
	// Click on corpse eyes
	gump.AddHitBox(itemSerial++, 200 + 45, 270 + 30, 60, 30, 1);

	gump.AddTilePic(235, 396, '0x1BC4', '0', itemSerial++, '0x0035');



	// Scissor section
	gump.AddGumpPic(15, 350, '0x004D');
	gump.AddTilePic(75, 396, '0x099E');
	gump.AddTilePic(95, 396, '0x09C4');
	gump.AddTilePic(115, 396, '0x09A2');

	gump.AddScissor(1, 0, 0, 50, 440, 50, 50);
	gump.AddGumpPic(15, 420, '0x004D');
	gump.AddScissor(0);



	// HTML gump section
	var htmlSerial = itemSerial++;
	gump. AddHtmlGump(htmlSerial, 580, 15, 300, 170, '0x0BB8');

	// Select HTML gump as current container for new items
	gump.Select('htmlgump', htmlSerial);

	var step = 18;
	var x = 5;
	var y = 2;
	gump.AddText(x, y, '0', "Name: {name}");
	y += step;
	gump.AddText(x, y, '0', "Name with notoriety color: {namenoto}");
	y += step;
	gump.AddText(x, y, '0', "Str: <basefont color='magenta'>{str}");
	y += step;
	gump.AddText(x, y, '0', "Int: <basefont color='magenta'>{int}");
	y += step;
	gump.AddText(x, y, '0', "Dex: <basefont color='magenta'>{dex}");
	y += step;
	gump.AddText(x, y, '0', "Hits: <basefont color='red'>{hits}</basefont>/<basefont color='red'>{maxhits}</basefont> (<basefont color='red'>{hits%}%</basefont>)");
	y += step;
	gump.AddText(x, y, '0', "Mana: <basefont color='cyan'>{mana}</basefont>/<basefont color='cyan'>{maxmana}</basefont> (<basefont color='cyan'>{mana%}%</basefont>)");
	y += step;
	gump.AddText(x, y, '0', "Stam: <basefont color='green'>{stam}</basefont>/<basefont color='green'>{maxstam}</basefont> (<basefont color='green'>{stam%}%</basefont>)");
	y += step;
	gump.AddText(x, y, '0', "Weight: <basefont color='olive'>{weight}</basefont>/<basefont color='olive'>{maxweight}</basefont> (<basefont color='olive'>{weight%}%</basefont>)");
	y += step;
	gump.AddText(x, y, '0', "Armor: <basefont color='teal'>{armor}");
	y += step;
	gump.AddText(x, y, '0', "Gold: <basefont color='yellow'>{gold}</basefont> (GP in pack: <basefont color='yellow'>{item:0x0EED}</basefont>)");
	y += step;
	gump.AddText(x, y, '0', "Followers: <basefont color='gray'>{followers}</basefont>/<basefont color='gray'>{maxfollowers}</basefont>");

	// Reset container for new items to gump
	gump.Select('gump');



	// Spoiler section
	var spoilerSerial = itemSerial++;
	gump.AddSpoiler(spoilerSerial, 580, 200, 1, 290, '0x0827', '0x0827', '0x0827', '0x0826', '0x0826', '0x0826');
	gump.SetSpoilerText('Is spoiler o.O', 0, 0x0035, 0x0021);

	// Select spoiler as current container for new items
	gump.Select('spoiler', spoilerSerial);

	x = 5;
	y = 5;
	gump.AddTilePic(x, y, '0x19B8');
	gump.AddText(x + 38, y + 3, '0', "Total ores: {item:0x19B7|0x19B8|0x19B9|0x19BA}");
	y += 30;

	gump.AddTilePic(x, y, '0x19B8');
	gump.AddText(x + 38, y + 3, '0', "Iron ores: {item:0x19B7|0x19B8|0x19B9|0x19BA,0}");
	y += 30;

	gump.AddTilePic(x, y, '0x19B8', '0x0590');
	gump.AddText(x + 38, y + 3, '0', "Green ores: {item:0x19B7|0x19B8|0x19B9|0x19BA,0x0590}");
	y += 30;

	gump.AddTilePic(x, y, '0x19B8', '0x0058');
	gump.AddText(x + 38, y + 3, '0', "Blue ores: {item:0x19B7|0x19B8|0x19B9|0x19BA,0x0058}");
	y += 30;

	gump.AddTilePic(x, y, '0x19B8', '0x008F');
	gump.AddText(x + 38, y + 3, '0', "Orange ores: {item:0x19B7|0x19B8|0x19B9|0x19BA,0x008F}");
	y += 30;

	// Reset container for new items to gump
	gump.Select('gump');



	// Satanic page 2 section
	gump.AddPage(2);

	gump.AddBlending(1);
	gump.AddColoredPolygone(0, 0, 900, 500, "#4FFF0000");
	gump.AddBlending(0);

	gump.AddLine(25, 25, 100, 175, "red", 3);
	gump.AddLine(100, 175, 175, 25, "red", 3);
	gump.AddLine(0, 125, 200, 125, "red", 3);
	gump.AddLine(0, 125, 175, 25, "red", 3);
	gump.AddLine(25, 25, 200, 125, "red", 3);

	gump.AddGlobalColor(1, "#FF00FF");

	gump.AddTilePic(-15, 110, '0x09E9');
	gump.AddTilePic(180, 105, '0x09CC');
	gump.AddTilePic(8, 12, '0x1BF1');
	gump.AddTilePic(150, 12, '0x1BE1');
	gump.AddTilePic(78, 155, '0x0EEF');

	gump.AddGlobalColor(0);

	gump.AddTilePic(78, 55, '0x1FD5', '0x0021');

	// Commit gump changes and update it in client
	gump.Update();
}

//--#Neo's other Scripts
//Support scripts for things that probably aren't useful to most.




//Simple function to check if hidden and hide if not.
function CheckHidden(){
  while (!Player.Hidden()){
    Orion.UseSkill("Hiding");
    Orion.Wait(2000)
  }
}

//Will go to a given location, this will accept getting to within one tile of the specified location.
//For use with teleporters, need to use the GoToLocLong function.
function GoToLoc(X,Y){
  Orion.WalkTo(X,Y,Player.Z(),1,255,0,1);
  //if(Player.X() == X && Player.Y.() == Y)

}
function GoToLocRun(X,Y){
  Orion.WalkTo(X,Y,Player.Z(),1,255,1,1);
  //if(Player.X() == X && Player.Y.() == Y)

}

function GoToLocRunStack(X,Y){
  Orion.WalkTo(X,Y,Player.Z(),0,255,1,1);
  //if(Player.X() == X && Player.Y.() == Y)

}

function GoToLocLong(X,Y){
  var temp;
  temp = Orion.WalkTo(X,Y,Player.Z(),0,255,1,1,30000000);
  //if(Player.X() == X && Player.Y.() == Y)
  return temp;
}

function GoToLocClose(X,Y){
  var temp;
  temp = Orion.WalkTo(X,Y,Player.Z(),1,255,1,1,30000000);
  //if(Player.X() == X && Player.Y.() == Y)
  return temp;
}

function KeepHidden(){
  var pet, ebp;
  while(true){
    pet = null;
    ebp = null;
    alwaysrun = null;
    if(Orion.InJournal("revealed")){
      var enemy = Orion.FindTypeEx('any', '-1', 'ground', 'human|ignoreself', '30', '');
      if(enemy.length > 0){
        //SendDiscord("I was revealed by ***" + enemy[0].Name() + "*** and " + (enemy.length-1) + " other people, closing at the next spawn.");
        //Orion.CloseUO();
        Shared.AddVar("closenext","true");
      }
      Orion.ClearJournal();
    }
    if(!Player.Hidden() && !Player.Dead()){
      if(Player.Poisoned()){
        pet = Orion.FindTypeEx("0x1021", 'any', 'backpack');
        if (pet.length > 0){
          Orion.UseObject(pet[0].Serial());
          Orion.Wait(500);
        }
      }
      else if((Orion.Timer("Egg") > 0 || Orion.Timer("Egg") == "-1") && Orion.FindTypeEx("0x2809", 'any', 'backpack').length > 0){
        ebp = Orion.FindTypeEx("0x2809", 'any', 'backpack');
        if (ebp.length > 0){
          Orion.Dress("stone");
          Orion.Wait(2500);
          Orion.UseObject(ebp[0].Serial());
          Orion.SetTimer("Egg",-10001);
          Orion.Wait(2500);
          Orion.Dress("main");

        }
      }
      else if((Orion.Timer("Hiding") > 0 || Orion.Timer("Hiding") == "-1") && Orion.FindTypeEx("0x2809", 'any', 'backpack').length == 0){
        Orion.UseSkill("Hiding");
        if(Orion.InJournal("can't seem") || Orion.InJournal("have hidden"))
        {
          Orion.SetTimer("Hiding",-12001);
          Orion.Wait(1000);
          Orion.ClearJournal();
        }
      }
    }
    else{
      Orion.Wait(10);
    }
    Orion.Wait(500);

  }
}

function SendDiscord(themessage,name){
  //Send message to:
  // Discord
  var discord2 = false;
  var bot2 = "";
  var bot = ''; // Webhook url
  var paramText = "username=" + Player.Name() + "&content=";

  Orion.HttpPost(bot, paramText + themessage);
  if (discord2){
    Orion.HttpPost(bot2, paramText + themessage);
  }
  //Orion.Print(themessage);

}

function CheckGold(){
  Orion.RequestContextMenu(Player.Serial());
	Orion.WaitContextMenuID(Player.Serial(), 416);
  Orion.WaitForGump(5000);
  var insuregumpid = 0x000F3E9F;
  var insureGump = GumpByID(insuregumpid);
  if ((insureGump !== false) && (insureGump !== null) && (!insureGump.Replayed()) && (insureGump.ID() === '0x000F3E9F')){
    //Orion.Print("Gold:" + insureGump.TextList()[0]);
    var gold = insureGump.TextList()[0];
    var sendGold = [];
    sendGold[0] = gold;
    sendGold[2] = insureGump.TextList()[2];
    Orion.Wait(2000);
    Orion.CloseGump('generic', insureGump.Serial(), insureGump.ID());
    var goldsplit = gold.split(",");
    goldnew = '';
    for(var i = 0; i < goldsplit.length; i++){
      goldnew += goldsplit[i];
    }
    sendGold[1] = goldnew;
    if(Number(goldnew) < 50000){
      //Orion.Print(goldnew);
      Orion.CloseUO();
    }
    return sendGold;
  }
  else{
    return false;
  }
}

function SendDiscordFarm(themessage,name){
  //Send message to:
  // Discord
  var discord2 = false;
  var bot2 = "";
  var bot = 'https://discord.com/api/webhooks/969252690251120650/EDfelCRvgJeSV2x0091njdD7VfslmGDAcMG-eWRWffjHkFo5S8P8yqKBBA06YeuXCY2z'; // Webhook url
  var paramText = "username=" + Player.Name() + "&content=";

  Orion.HttpPost(bot, paramText + themessage);
  if (discord2){
    Orion.HttpPost(bot2, paramText + themessage);
  }
  //Orion.Print(themessage);

}

//I wrote this for no reason, it's already built into the client, but...here we are.
//I've already built this into other functions so it stays for now.
function GetDistance(X,Y){
  var dist = null;

  dist = Math.sqrt((Math.pow(X - Player.X(),2))+(Math.pow(Y - Player.Y(),2)))
  //Orion.Print(dist);
  return dist;
}

//Returns the current time in 12 hour format.
function TimeString(){
  var hours = parseInt(Orion.Time("hh"));
  var minutes = parseInt(Orion.Time("m"));
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

//--#IDOC Scripts
function HitBarrels(){
  while (!Player.Dead())
    {
    var barrels = Orion.FindType('0x0FAE|0x0E77|0x1EB5', '-1', ground, 'near', '24', ' ');
    var barrel;
    if (barrels.length)
        {
        barrel = Orion.FindObject(barrels[0]);
        if (barrel.Serial)
            {
              var h = barrel.X();
               var j = barrel.Y();
                if(barrel.Distance() > 1)
                    Orion.WalkTo(h, j, 0);
                else
                    Orion.Attack(barrel.Serial());
               Orion.Wait(250);
               }
           }
    Orion.Wait(250);
     }
 }

function HidePlayers(){
  while(true)
     {
     var peeps = Orion.FindType(any, any, ground, 'live|ignoreself', 24,"blue")
     for(i=0;i<peeps.length;i++)
         {
         Orion.Hide(peeps[i])
         }
     Orion.Wait(100);
     }
     Orion.Wait(50);
}
//--#PVM Scripts

function LightningStrikeMomentum(){
  while(!Player.Dead()){
    if(Player.Mana() > 20){
      var creatures = Orion.FindType('any','any','ground','live',1,"gray|criminal");
      if(Orion.SkillValue("Bushido",'base') >= 700  && creatures.length > 1 && !Orion.BuffExists("Momentum Strike")){
        Orion.Cast("Momentum Strike");
        Orion.Wait(1000);
      }
      else if(Orion.SkillValue("Bushido",'base') >= 500 && !Orion.BuffExists("Lightning Strike") && !Orion.BuffExists("Momentum Strike")){
        Orion.Cast("Lightning Strike");
        Orion.Wait(1000);
      }
      else if(Orion.SkillValue("Bushido",'base') >= 300 && Orion.Timer("conftimer") >= -1){
        Orion.Cast("Confidence");
        Orion.SetTimer("conftimer",-6000)
        Orion.Wait(1000);
      }
    }
    Orion.Wait(200);
  }
}

function FillRepairBench(){
  var scrollinbag = 200;
  var ingotsinbag = 50;
  var keepgoing = true;
  Orion.Print("Target Resource Chest");
  Orion.WaitForAddObject("rchest",10000);
  var resourcechest = Orion.FindObject("rchest");
  Orion.Print("Target Repair Bench");
  Orion.WaitForAddObject("rbench",10000);
  var repairbench = Orion.FindObject("rbench");
  while(keepgoing){
    //Grab scrolls
    var blankscrolls = Orion.FindTypeEx("0x0EF3",-1, 'backpack');
    if(blankscrolls.length == 0 || (blankscrolls && blankscrolls[0].Count() < scrollinbag)){
      var chestscrolls = Orion.FindTypeEx("0x0EF3",-1, resourcechest.Serial());
      if(chestscrolls.length > 0){
        Orion.MoveItem(chestscrolls[0].Serial(),scrollinbag,'backpack')
        Orion.Wait(1500);
      }
      else{
        Orion.Print("You need more blank scrolls.")
        keepgoing = false;
      }
    }
    //Grab Ingots
    var blankscrolls = Orion.FindTypeEx("0x1BF2",-1, 'backpack');
    if(blankscrolls.length == 0 || (blankscrolls && blankscrolls[0].Count() < scrollinbag)){
      var chestscrolls = Orion.FindTypeEx("0x1BF2",-1, resourcechest.Serial());
      if(chestscrolls.length > 0){
        Orion.MoveItem(chestscrolls[0].Serial(),ingotsinbag,'backpack')
        Orion.Wait(1500);
      }
      else{
        Orion.Print("You need more iron ingots.")
        //keepgoing = false;
      }
    }
    var tools = [
      ["Tinker","0x1EB9",11,true,0],
      ["Blacksmith","0x0FBC",20,true,1],
      ["Tailor","0x0F9D",14,true,3],
      ["Carpenter","0x1028",16,true,2],
    ]
    //Make sure you have enough of each
    //Make sure you have enough tools for each skills
    for(var i = 0; i < tools.length;i++){
      var ttools = Orion.FindTypeEx(tools[i][1],-1, 'backpack');
      if(tools[i][3] && ttools.lenght < 2){
        while(ttools.length < 3){
          Orion.UseType(0x1EB9)
        	if (Orion.WaitForGump(1000))
        	{
        		var gump0 = Orion.GetGump('last');
        		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC'))
        		{
        			gump0.Select(Orion.CreateGumpHook(tools[i][2]));
        			Orion.Wait(100);
        		}
        	}
          Orion.Wait(1000);
          ttools = Orion.FindTypeEx(tools[i][1],-1, 'backpack');
        }
      }
    }

    for(var i = 0; i < tools.length;i++){
      //Close all gumps
      while(Orion.GumpCount()>0){
         temp9 = Orion.GetGump(0);
         temp9.Close();
         Orion.Wait(50);
       }
       //Make sure we need to be doing this
       Orion.UseObject(repairbench.Serial())
       Orion.WaitForGump(1000)
       var rgump = Orion.GetGump('last');
       numrepairs = rgump.TextList();
       Orion.Wait(500);
       rgump.Close();
       Orion.Wait(500)
       numrepairs = Number(numrepairs[(tools[i][4]*2)+1])
       Orion.Print(numrepairs);
       while(numrepairs < 500){
        var ttools = Orion.FindTypeEx(tools[i][1],-1, 'backpack');
        if(tools[i][3] && ttools.length > 2){
            blankscrolls = Orion.FindTypeEx("0x0EF3",-1, 'backpack');
            Orion.UseType(tools[i][1])
          	if (Orion.WaitForGump(1000))
          	{
          		var gump0 = Orion.GetGump('last');
          		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC'))
          		{
          			gump0.Select(Orion.CreateGumpHook(8000));
          			Orion.Wait(100);
                Orion.TargetObject(blankscrolls[0].Serial())
                Orion.WaitForGump(1000);
                gump0 = Orion.GetGump('last');
                var rdeeds = Orion.FindTypeEx("0x14F0","0x01BC", 'backpack');

                while(gump0!= null && gump0.ID() == '0x000001CC' && rdeeds.length < 10){
                  //Orion.Print("Deeds: " + rdeeds.length)
                  gump0.Select(Orion.CreateGumpHook(8000));
            			Orion.Wait(200);
                  Orion.TargetObject(blankscrolls[0].Serial())
                  Orion.WaitForGump(1000);
                  gump0 = Orion.GetGump('last');
                  rdeeds = Orion.FindTypeEx("0x14F0","0x01BC", 'backpack');
                }
          		}
              gump0 = Orion.GetGump('last');
              gump0.Close();
              Orion.Wait(1000);
          	}
            ttools = Orion.FindTypeEx(tools[i][1],-1, 'backpack');
            rdeeds = Orion.FindTypeEx("0x14F0","0x01BC", 'backpack');
            if(rdeeds.length > 10){
                Orion.UseObject(repairbench.Serial())
                Orion.WaitForGump(1000)
                var rgump = Orion.GetGump('last');
                Orion.Wait(500);
                rgump.Select(Orion.CreateGumpHook(100));
                rgump = Orion.GetGump('last');
                while(rdeeds.length >0){
                  if(!Orion.Contains(rdeeds[0].Properties(),tools[i][0])){
                    Orion.MoveItem(rdeeds[0].Serial(),1,resourcechest.Serial())
                    Orion.Wait(1000);
                  }
                  else{
                    Orion.Wait(200);
                    Orion.TargetObject(rdeeds[0].Serial());
                    if(Orion.InJournal('exceed the maximum','sys','0','any',Orion.Now()-1000,Orion.Now()+2000)){
                      Orion.MoveItem(rdeeds[0].Serial(),1,resourcechest.Serial())
                    }
                  }
                  rdeeds = Orion.FindTypeEx(0x14F0,0x01BC, 'backpack');
                }
                Orion.Wait(100);
                Orion.CancelTarget();
            }
        }
        //Close all gumps
        while(Orion.GumpCount()>0){
           temp9 = Orion.GetGump(0);
           temp9.Close();
           Orion.Wait(50);
         }
         //Make sure we need to be doing this
         Orion.UseObject(repairbench.Serial())
         Orion.WaitForGump(1000)
         var rgump = Orion.GetGump('last');
         numrepairs = rgump.TextList();
         Orion.Wait(500);
         rgump.Close();
         Orion.Wait(500)
         numrepairs = Number(numrepairs[tools[i][4]*2])
         blankscrolls = Orion.FindTypeEx(-1, "0x0EF3", 'backpack');
         if(blankscrolls.length == 0){
           break;
         }
      }


    }
  }
}

function InsureEventItem(){
  //Fire Event: 0x0AC6
  //Hythloth: 0x0AC1
  while(Orion.GetGlobal("doEventInsure") == 1){
    //towncatch = Orion.WaitJournal("bearing the mark",Orion.Now(),Orion.Now()+6000000);
    Orion.Wait(1000);
    pardons = Orion.FindTypeEx('any', "0x0AC3", 'backpack');
    thepardon = null;
    if (pardons.length >0){
      for(var i = 0;i<pardons.length;i++){
        if(pardons[i].Properties().indexOf("Insured") == -1 && pardons[i].Properties().indexOf("Blessed") == -1){
          thepardon = pardons[i];
          if(thepardon){
            Orion.RequestContextMenu(Player.Serial());
            Orion.WaitContextMenuID(Player.Serial(), 418);
            if (Orion.WaitForTarget(1000)){
              //Orion.Print(thepardon.Serial());
              Orion.TargetObject(thepardon.Serial());
              Orion.WaitForTarget(2000);
              Orion.CancelTarget();
              Orion.Wait(1000);
              if(Orion.HaveTarget()){
                Orion.CancelTarget()
              }
            }
          }
        }
        Orion.Wait(100);
      }
    }
    Orion.Wait(500);
  }
}

function AutoStartConfig(){
  if(Orion.FindObject("Leader")){
    leader = Orion.FindObject("Leader");
  }
  else{
    Orion.CharPrint(Player.Serial(), '55', "Click the group leader, or yourself!");
    Orion.WaitForAddObject("Leader",20000);
    leader = Orion.FindObject("Leader");
    Orion.AddFriend(leader.Name(), leader.Serial());
  }
  Orion.Print(85,"Starting Auto Attack Mode...")
  Orion.Print("You have 10 seconds to position your character...")
  Orion.Wait(5000);
  Orion.Print("5 seconds left...")
  Orion.Wait(5000);
  if(leader.Serial() == Player.Serial()){
    Orion.Exec("AttackLoop","true");
  }
  else{
    Orion.Exec("SampAbility","true");
    Orion.Exec("SlaveLoop","true");
  }

  Orion.Exec("KeepAlive","true");
  //Orion.Exec("InsureEventItem","true");
}

function StealthLooter(){
  var vars = {};
  vars.lootDist = 15;
  var newCorpse = [];
  var corpseList = Orion.FindTypeEx("-1", "-1", "ground", "ignoreself|ignorefriends", vars.lootDist, "gray|criminal");
  for(var i = 0;i < corpseList.length;i++){
    if(Orion.Contains(corpseList[i].Properties(),"corpse")){
      newCorpse.push(corpseList[i]);
      Orion.Print(corpseList[i].NameColor())
    }
  }
  Orion.Print(newCorpse.length);
}


function AttackLoop(){
  //Variables that are still hard coded right now that should move to GUI
  armSpecific = false;
  doBailHide = false;
  //General variable setting
  Orion.ResetIgnoreList();
  Orion.Print(66,"Home location is now set!")
  var StartX = Player.X();
  var StartY = Player.Y();
  Orion.SetGlobal("StartX",StartX);
  Orion.SetGlobal("StartY",StartY);
  Orion.IgnoreReset();
  Orion.SetGlobal("AttackLoop","true");
  Orion.SetGlobal("SetDead","false")
  var lootGohome = false;
  //var ogFriendsX = Number(Orion.RegRead(Player.Serial()+"/FriendX"));
  var target = false;
  var bail = false;

  var targlife = null;
  var lootedcorpses = [];
  //Pulling attack types from the selections in the gump
  var notefilter = ""
  if(Orion.RegRead(Player.Serial() + "/Blue") == 1){
    notefilter += "blue|";
  }
  if(Orion.RegRead(Player.Serial() + "/Green") == 1){
    notefilter += "green|";
  }
  if(Orion.RegRead(Player.Serial() + "/Grey") == 1){
    notefilter += "gray|";
  }
  if(Orion.RegRead(Player.Serial() + "/Criminal") == 1){
    notefilter += "criminal|";
  }
  if(Orion.RegRead(Player.Serial() + "/Orange") == 1){
    notefilter += "orange|";
  }
  if(Orion.RegRead(Player.Serial() + "/Red") == 1){
    notefilter += "red|";
  }
  if(Orion.RegRead(Player.Serial() + "/Yellow") == 1){
    notefilter += "yellow";
  }
  Orion.Exec("DiscordUpdate",true);
  while(Orion.GetGlobal("AttackLoop") == "true" && !Player.Dead()){
    var doSampMode = Orion.GetGlobal("doSampMode");
    var doGoHome = Orion.GetGlobal("doGoHome");
    var doFixed = Orion.GetGlobal("doFixed");
    var doDexxer = Orion.GetGlobal("doDexxer");
    var doDexxer_fixed = Orion.GetGlobal("doDexxer_fixed");
    var doStealthloot = Orion.GetGlobal("doStealthloot");
    var theRange = Number(Orion.RegRead(Player.Serial()+"/attackradius"));
    var MaxDistance = Number(Orion.RegRead(Player.Serial()+"/maxstray"));
    var timeOntarg = Number(Orion.RegRead(Player.Serial()+"/maxtargtime"))*-1000;
    var doLoot = Orion.GetGlobal("doLoot");
    var doHonor = Orion.GetGlobal("doHonor") == 1 ? true : false;
    var doEOO = Orion.GetGlobal("doEOO");
    var doConsecrate = Orion.GetGlobal("doConsecrate");
    //Mount if not mounted
    if(!Orion.ObjAtLayer('Mount')){
      if(Orion.FindObject('myMount'))
          Orion.UseObject('myMount');
    }
    if(doDexxer == 1 || doDexxer_fixed == 1){
      gotoTarget = doDexxer_fixed == 1 ? false : true;
      target = AutoAttackMob(notefilter,doHonor,theRange,gotoTarget);
      bail = false;
      if(target && !Player.Dead()){
        Orion.SetTimer("OnTarTimer",-12000);
        targlife = target.Hits();
        Orion.SetTimer("targhitstimer",-12000)
        while(Orion.ObjectExists(target.Serial()) && target.Hits() > 0 && !bail && !Player.Dead()){
          //Checking to see if there has been a specific issue with the previous attack target
          //This may be able to be removed since the adding of the follow logic
          if(false && Orion.InJournal('cannot be seen.','normal','0','any',Orion.Now()-500,Orion.Now()) || Orion.InJournal('failed to find path','normal','0','any',Orion.Now()-500,Orion.Now())){
            Orion.Ignore(target.Serial());
            Orion.Wait(100);
            bail = true;
            Orion.Print("Ignoring target, as it cannot be seen.")
            //break;
          }
          if(doBailHide && Player.Hits() < 70){
            BailHide();
          }
          Orion.Attack(target.Serial());
          //Arm specific types of wepaons
          //This is only setup for one specific event right now.
          if(armSpecific){
            if(!Orion.Contains(target.Name(),"wyvern",true) && !Orion.Contains(target.Name(),"dragon",true) && !Orion.Contains(target.Name(),"drake",true)  && !Orion.Contains(target.Name(),"wyrm",true) && !Orion.Contains(target.Name(),"serpent",true)){
              Orion.Dress("wep_Fey");
              Orion.Wait(1100);
            }
            else{
              Orion.Dress("wep_reptile_AI");
              Orion.Wait(1100);
            }
          }
          //Orion.Follow(target.Serial())
          //Making sure target is taking damage, resetting timer if so
          if(target.Hits() < targlife){
            targlife = target.Hits();
            Orion.SetTimer("targhitstimer",timeOntarg)
            Orion.SetTimer("OnTarTimer",timeOntarg);
            //Orion.Print("Resetting Timers")
          }
          //Ignoring the target if the timer expires
          else if(Orion.Timer("targhitstimer")>0){
            Orion.Ignore(target.Serial());
            Orion.Wait(100);
            bail = true;
            Orion.Print(66,"Ignorning target, as it is not taking damage and timer has expired.")
          }
          //I don't think this flag works at all, but i'll leave it for now.
          if(target.Dead()){
            bail = true;
            Orion.Print("Target is dead, moving on...")
          }
          //Checking if we're actually close to the target, and resetting the timer if so, or bailing.
          if(doDexxer_fixed != 1){
            if(Orion.GetDistance(target.Serial()) <= 1){
              Orion.SetTimer("rangetimer",timeOntarg);
              //Orion.Print("Set timer");
            }
            else if(Orion.Timer("rangetimer") >=0){
              //Orion.Print('bail')
              bail = true;
              Orion.Ignore(target.Serial());
              Orion.Print("Character cannot get to target, moving to next target.")
            }
          }
          Orion.Wait(100);
        }
        //Casing Chiv spells if they are selected
        if(doEOO == 1 && !Orion.BuffExists("Enemy of One") && Player.Mana() > 30 && Orion.SkillValue("Chivalry","base") > 500){
          Orion.Cast("Enemy of One");
          Orion.Wait(500);
        }
        if(doConsecrate == 1 && !Orion.BuffExists("Consecrate Weapon") && Player.Mana() > 20 && Orion.SkillValue("Chivalry","base") > 500){
          Orion.Cast("Consecrate Weapon");
          Orion.Wait(500);
        }
        //Looting logic if the looting has been selected
        lootit = Orion.FindType("-1", "-1", "ground", "item",2);
        //Orion.Print("Bodies on Ground: " + lootit.length);
        if(doLoot  == 1 && lootit.length > 0 && doFixed != 1){
          for(var i = 0;i<lootit.length;i++){
            //Orion.Print("IsCorpse:" + Orion.FindObject(lootit[i]).isCorpse());
            var tempbody = Orion.FindObject(lootit[i]);
            if(tempbody && Orion.Contains(tempbody.Properties(),"corpse") && lootedcorpses.indexOf(tempbody.Serial()) == -1){
              LootCorpse(tempbody.Serial());
              Orion.MoveGump('container', 2000, 2000, tempbody.Serial());
              lootedcorpses.push(tempbody.Serial());
              //Orion.Wait(500);
            }
          }
        }
        if(doSampMode == 1){
          SampMode(notefilter,theRange);
          Orion.Attack(target.Serial());
        }
        //target = AutoAttackMob("gray|criminal|orange|red",false,theRange);
        Orion.Wait(50);
      }
    }
    //Stealth looter
    else if(doStealthloot == 1){
      Orion.Terminate("KeepAlive|KeepGhost");
      Orion.Exec("stealthAlive",true)
      Orion.ClientOptionSet('BlockRunWhileHidden', true);
      CheckHidden();
      if((doGoHome == 1 && GetDistance(StartX,StartY) > MaxDistance) || lootGohome){
        GoToLocClose(StartX,StartY);
        lootGohome = false;
      }
      var theCorpse = Orion.FindTypeEx('any', 'any', 'ground', 'item', MaxDistance);
        //Orion.Print("Bodies:" + theCorpse.length)
      for(var i = 0;i<theCorpse.length;i++){
        if(theCorpse[i].Properties().indexOf('Corpse') != -1){
          Orion.Print("Heading to body: " + theCorpse[i].Name())
          GoToLocLong(theCorpse[i].X(),theCorpse[i].Y());
          var firstPause = false;
          Orion.Wait(1500);
          while(Orion.OpenContainer(theCorpse[i].Serial()) == false && Orion.Timer("stayStealthloot") <= -1){
            Orion.Wait(1200);
            if(Orion.InJournal('reach that','sys',0,'any',Orion.Now()-2000,Orion.Now()+5000)){
              Orion.Print("Ignoring corpse (can't reach that)")
              Orion.Ignore(theCorpse[i].Serial());
              lootGohome = true;
            }
            else if(Orion.InJournal('earn the right','sys',0,'any',Orion.Now()-2000,Orion.Now()+5000)){
              Orion.SetTimer("firstPause",-10000);
              Orion.SetTimer("stayStealthloot",timeOntarg*2);
              while(Orion.Timer("firstPause") < 0){
                CheckHidden();
                Orion.Wait(500);
              }
            }
            Orion.Print("Waiting for body to open up..." +  Orion.Timer("stayStealthloot"))
          }
          Orion.Print("Looting Corpse: " + theCorpse[i].Name())
          if(LootCorpse(theCorpse[i].Serial())){
            Orion.Print('Ignoring corpse (from loot function)')
            Orion.Ignore(theCorpse[i].Serial());
            Orion.Wait(1500);
            Orion.MoveGump('container', 2000, 2000, theCorpse[i].Serial());
          }
          //probably a check health here of some sort.
          CheckHidden();
        }
      }
    }
    //Fixed necro location
    else if(doFixed == 1){
      if(doGoHome == 1 && GetDistance(StartX,StartY) > MaxDistance){
        GoToLocRun(StartX,StartY);
      }
      while(!Player.Dead()){
        while(!Orion.BuffExists("Wraith Form") && Player.Dead()){
          Orion.Cast("Wraith Form")
          Orion.Wait(3000);
        }
        while(false && !Orion.BuffExists("Protection")){
          Orion.Cast("Protection")
          Orion.Wait(1500);
        }
        MageAlive();
        var theTargsWither = Orion.FindType("-1", "-1", "ground", "inlos|live|ignoreself|ignorefriends|nothuman", 4, notefilter);
        var theTargsEQ = Orion.FindType("-1", "-1", "ground", "inlos|live|ignoreself|ignorefriends|nothuman", 10, notefilter);
        var theCorpse = Orion.FindTypeEx('any', 'any', 'ground', 'item|inlos', '10');
        //Orion.Print("Wither Targs: " + theTargsWither.length)
        //Orion.Print("EQ Targs: " + theTargsEQ.length)
        var randIndex = Math.floor(Math.random() * theCorpse.length);
        if(theTargsWither.length > 0 && Player.Mana() > 14){
          Orion.Cast("Wither");
          Orion.Wait(2000);
        }
        else if(theTargsEQ.length > 0 && Player.Mana() > 30){
          var currmage = Orion.SkillValue("magery",'base');
          var randIndex = Math.floor(Math.random() * theTargsEQ.length);
          switch(true){
            case  (currmage <=300 && Player.Mana() > 12):
              Orion.CastTarget("Magic Arrow",theTargsEQ[randIndex]);
              break;
            case  (currmage > 300 &&  currmage < 450 && Player.Mana() > 12):
              Orion.CastTarget("fireball",theTargsEQ[randIndex]);
              break;
            case  (currmage >= 450 &&  currmage < 550 && Player.Mana() > 12):
              Orion.CastTarget("lightning",theTargsEQ[randIndex]);
              break;
            case  (currmage >= 550 &&  currmage < 650 && Player.Mana() > 12):
              Orion.CastTarget("mind blast",theTargsEQ[randIndex]);
              Orion.Wait(2000);
              break;
            case  (currmage >= 650 &&  currmage < 750 && Player.Mana() > 12):
              Orion.CastTarget("energy bolt",theTargsEQ[randIndex]);
              Orion.Wait(3000);
              break;
            case  (currmage >= 750 &&  currmage < 820 && Player.Mana() > 24):
              Orion.CastTarget("chain lightning",theTargsEQ[randIndex]);
              Orion.Wait(3500);
              break;
            case  (currmage >= 820 &&  currmage < 1200 && Player.Mana() > 30):
              Orion.Cast("Earthquake");
              Orion.Wait(4000);
              break;
          }
          Orion.Wait(1000);
        }
        else if(Player.Mana() > 30 && Player.Followers() < 4){
          var emptytiles = Orion.GetTilesInRect('land', Player.X()-10, Player.Y()-10,Player.X()+10, Player.Y()+10);
          var randIndex = Math.floor(Math.random() * emptytiles.length);
          Orion.Cast("Energy Vortex");
          Orion.WaitForTarget(10000);
          var theSpot = true;
          Orion.SetTimer("EVTimer",-10000);
          while(theSpot){
            if (!Orion.InLOS(emptytiles[randIndex].X(),emptytiles[randIndex].Y()) || Orion.GetTiles("", emptytiles[randIndex].X(),emptytiles[randIndex].Y()).length || Orion.FindType(any, any, ground, "mobile", "xyz:" + emptytiles[randIndex].X() + "," + emptytiles[randIndex].Y()).length){
              Orion.Wait(50);
              randIndex = Math.floor(Math.random() * emptytiles.length);
            }
            else{
              Orion.TargetTile('', emptytiles[randIndex].X(),emptytiles[randIndex].Y(),emptytiles[randIndex].Z());
              theSpot = false;
            }
            if(Orion.Timer("EVTimer") > -1){
              theSpot = false;
            }
            Orion.Wait(50);
          }
          if(Orion.HaveTarget()){
            Orion.CancelTarget();
          }
        }
        else if(false && theCorpse[randIndex].Properties().indexOf('Corpse') != -1){
          Orion.CastTarget("Animate Dead",theCorpse[randIndex].Serial());
          Orion.Wait(4000);
        }
        Orion.Wait(100);
      }
    }
    if(doGoHome == 1 && (GetDistance(StartX,StartY) > MaxDistance  || Orion.Timer("OnTarTimer") > 0)){
      GoToLocRun(StartX,StartY);
    }
    Orion.Wait(50);
  }
  if(Player.Dead()){
    Orion.Exec("GetResed",true);
    Orion.Exec('TakeRes',true);
    Orion.Exec('LookforRes',true);
  }

}

function BailHide(){
  var locations = [
    ["Destard Up",5241,1007],
    ["Healer",1170,2638],
    ["Destard Down",1175,2635],
    ["Farm Spot",5162,919],
  ]
  Orion.PauseScript('all','BailHide|KeepAlive|GetResed|KeepGhost|AttackLoop');
  Orion.Wait(100);
  while(Player.Hits() < 70 && !Player.Dead() && GetDistance(locations[0][1],locations[0][2]) > 5){
    GoToLocLong(locations[0][1],locations[0][2]-4);
    if(Player.Hits() < 70){
      GoToLocLong(locations[0][1],locations[0][2]);
      if(Player.X() > 5000){
        GoToLocLong(locations[0][1]+2,locations[0][2]);
      }
    }
  }
  Orion.Wait(500);
  GoToLocLong(locations[2][1],locations[2][2]+2);
  while(!Player.Dead() && Player.Hits() < Player.MaxHits()){
    Orion.Wait(100);
  }
  while(!Player.Dead() && Player.X() < 5000){
      GoToLocLong(locations[2][1],locations[2][2]);
      Orion.Wait(100);
      GoToLocLong(locations[2][1],locations[2][2]+4);
  }

  Orion.ResumeScript('all');
  Orion.Wait(500);
}


function DropItem(type,color){
  var robeList = Orion.FindTypeEx(type, color, 'backpack');
  for(var i = 0;i<robeList.length;i++){
    Orion.MoveItem(robeList[i].Serial(), 1, 'ground', Player.X(), Player.Y()+1,Player.Z());
    Orion.Wait(1200);
  }
}

function MageAlive(){
  while(!Player.Dead() && Player.Hits() < 80 && Orion.SkillValue("magery",'base') > 800){
    if(Orion.HaveTarget()){
      Orion.CancelTarget();
    }
    else if(Player.Poisoned()){
      Orion.Cast("Cure",'self');
    }
    else if(Player.Hits() < 80){
      if(!Player.Hidden()){
        Orion.Cast("Invisibility",'self');
        Orion.Wait(5000);
      }
      Orion.Cast("Greater Heal",'self');
      Orion.Wait(1500);
    }
    Orion.Wait(1000);
  }
}

function stealthAlive(){
  while(!Player.Dead()){
    if(Player.Hits() < Player.MaxHits()){
      Orion.PauseScript('all', 'stealthAlive');
      if(Orion.SkillValue("ninjitsu",'base') >= 500 && Orion.Timer("sbombTimer") >= -1 && Orion.Count('0x2809', 'any') > 0 && !Player.Hidden()){
        var pot = Orion.FindType('0x2809', 'any');
        Orion.UseItemOnMobile(pot[0], self);
        Orion.SetTimer("sbombTimer",-10001)
      }
      else if(Orion.SkillValue("magery",'base') > 800){
        if(Orion.HaveTarget()){
          Orion.CancelTarget();
        }
        else if(!Player.Hidden()){
            Orion.Cast("Invisibility");
            Orion.WaitForTarget(10000);
            Orion.TargetObject(Player.Serial());
            Orion.Wait(1000);
        }
        else if(Player.Poisoned()){
          Orion.Cast("Cure");
          Orion.WaitForTarget(5000);
          Orion.TargetObject(Player.Serial());
        }
        else if(Player.Hits() < 80){
          Orion.Cast("Greater Heal");
          Orion.WaitForTarget(5000);
          Orion.TargetObject(Player.Serial());
          Orion.Wait(1500);
        }
      }
      Orion.ResumeScript('all');
    }
    Orion.Wait(100);
  }
}

function GetResed(){
  var lrcSet = "LRC";
  var baseSet = "Farm";
  var wepArm = "wep_reptile_AI";
  var locations = [
    ["Destard Up",5241,1007],
    ["Healer",1170,2638],
    ["Destard Down",1175,2635],
    ["Farm Spot",5162,919],
  ]
  if(Orion.Contains(Player.Name(),"Plague")){
    locations[3] = ["Farm Spot",5126,903];
  }
  while(Player.Dead()){
    Orion.Exec('TakeRes',true);
    Orion.Exec('LookforRes',true);
    if(Player.X() > 5000){
      while(Player.X() > 5000){
        GoToLocLong(locations[0][1],locations[0][2]);
        if(Player.X() > 5000){
          GoToLocLong(locations[0][1]+2,locations[0][2]);
        }
        if(Player.X() > 5000){
          GoToLocLong(locations[0][1],locations[0][2]-4);
        }
        Orion.Wait(100);
      }
    }
    else{
      GoToLoc(locations[1][1],locations[1][2]);
      Orion.Wait(2000);
      GoToLoc(locations[1][1]+5,locations[1][2]);
    }
  }
   if(!Player.Dead()){
     Orion.SetGlobal("SetDead","false");
     //Orion.Print("Turning off: SetDead")
     Orion.PauseScript('all', 'GetResed|KeepGhost');
     Orion.Wait(5000);
     Orion.Print("Dressing the set: " + lrcSet)
     Orion.Dress(lrcSet);
     Orion.Wait(10000);
     while(Orion.SkillValue("Necromancy",'real') >= 900 && !Orion.BuffExists("Vampiric Embrace") && Orion.GetGlobal("doFixed") != 1){
       Orion.Cast("Vampiric Embrace");
       Orion.Wait(3000);
     }
     Orion.Dress(baseSet);
     Orion.ResumeScript('KeepAlive');
     Orion.Exec("KeepAlive",true);
     Orion.Wait(10000);
     Orion.Dress(wepArm);
     Orion.Wait(2000);
     if(Player.Race() != 3 && !Orion.ObjAtLayer('Mount')){
       if(Orion.FindObject('myMount'))
           Orion.UseObject('myMount');
     }
     Orion.Wait(5000);
     Orion.OpenContainer("backpack");
     Orion.Wait(1500);
     DropItem(0x1F03, 0x08FD);
     while(Player.Hits() < Player.MaxHits() && !Player.Dead()){
       MageAlive();
       Orion.Exec('KeepAlive',true);
       Orion.Wait(100);
     }
     while(GetDistance(locations[1][1],locations[1][2]) > 50){
       RunicAtlasRecall(4,true);
       Orion.Wait(2000);
     }
     while(GetDistance(locations[0][1],locations[0][2]) > 5 && !Player.Dead()){
       Orion.Wait(1000)
        GoToLocLong(locations[2][1],locations[2][2]);
        Orion.Wait(100);
        GoToLocLong(locations[2][1],locations[2][2]+2);
        Orion.Print("Getting inside the dungeon (before getting body)...")
     }
     Orion.SetTimer("BodyTimer",-30000)
     while(Orion.GetGlobal("GetBody") == "true" && Orion.Timer("BodyTimer") < 0 && !Player.Dead()){
       Orion.ResumeScript('KeepAlive');
       Orion.Print("Getting body...")
       GoToLocLong(Orion.GetGlobal("deadX"),Orion.GetGlobal("deadY"));
       body = Orion.FindTypeEx('any', 'any', 'ground', 'item', '20');
       if(body.length >0){
         for(var i = 0;i < body.length;i++){
           if(Player.Hits() < 70){
             BailHide();
              Orion.SetTimer("BodyTimer",-30000);
           }
           if(Orion.Contains(body[i].Properties(),"corpse of " + Player.Name())){
             GoToLocLong(body[i].X(),body[i].Y())
             Orion.Wait(200);
             Orion.OpenContainer(body[i].Serial());
             Orion.Wait(1600);
           }
           if(Orion.InJournal("quickly gather",'sys','0','any',Orion.Now()-10000,Orion.Now())){
             Orion.SetGlobal("GetBody","false");
           }
         }
       }
       Orion.Wait(500);
     }
     while(Player.X() < 5000 && GetDistance(locations[0][1],locations[0][2]) > 5 && !Player.Dead()){
       Orion.Wait(1000)
        GoToLocLong(locations[2][1],locations[2][2]);
        Orion.Wait(100);
        GoToLocLong(locations[2][1],locations[2][2]+2);
        Orion.Print("Getting inside the dungeon...")
     }
     while(GetDistance(Orion.GetGlobal("StartX"),Orion.GetGlobal("StartY")) > 5 && !Player.Dead()){
       Orion.Wait(1000)
      GoToLocLong(Orion.GetGlobal("StartX"),Orion.GetGlobal("StartY"));
      Orion.Print("Getting to the home spot...")
     }
     Orion.ResumeScript('all');
     Orion.Exec('AutoStartConfig',true);
     //Orion.Exec("LightningStrikeMomentum",true);
     Orion.SetGlobal('pvpgumpfirst',"false");
     PVPGump();
   }
}
function TakeRes(){
  while(Player.Dead()){
    var tempGump = GumpByID('0x000008AF');
    if (tempGump != false){
      if ((tempGump !== null) && (tempGump.ID() === '0x000008AF'))
      {
        tempGump.Select(Orion.CreateGumpHook(2));
        Orion.Wait(1500);
      }
     }
     Orion.Wait(100);
 }
}

function KeepGhost(){
  while(true){
    if(Orion.Timer("KGhostTimer") >= -1 &&  Player.Dead() && !Orion.ScriptRunning("GetResed")){
      Orion.Exec("GetResed",true);
      Orion.SetTimer("KGhostTimer",-10000)
    }
    if(Player.Dead() && Orion.GetGlobal("SetDead") == "false"){
      Orion.SetGlobal("SetDead","true");
      Orion.SetGlobal("GetBody","true");
      Orion.SetGlobal("deadX",Player.X());
      Orion.SetGlobal("deadY",Player.Y());
      Orion.Print("Setting dead body position.")
    }
    //Orion.Print("SetDead:" + Orion.GetGlobal("SetDead") + " DeadPosTimer:" + Orion.Timer("DeadPosTimer"));
    Orion.Wait(100);
  }
}

function LookforRes(){
  var keepLooking = true;
  var healIgnore = [];
  while(keepLooking){
    var healerList = Orion.FindTypeEx('any', 'any', 'ground', 'live|inlos', 30);
    var ankh = Orion.FindTypeEx("0x002 || 0x004", 'any', 'ground', '', '30');
    if(ankh.length > 0){
      if(ankh[0].Graphic() == "0x002"){
        var yOffset = 0;
        var xOffset = 4;
      }
      else{
        var yOffset = 4;
        var xOffset = 0;
      }
      Orion.PauseScript('GetResed')
      GoToLocLong(ankh[0].X()+xOffset,ankh[0].Y()+yOffset);
      Orion.Wait(100);
      GoToLocLong(ankh[0].X(),ankh[0].Y());
      Orion.ResumeScript('GetResed')
    }
    else{
      for(var i = 0;i<healerList.length;i++){
        if(Orion.Contains(healerList[i].Properties(),"healer",true) && healIgnore.indexOf(healerList[i].Serial()) == -1){
          Orion.Follow(healerList[i].Serial());
          if(Orion.Timer("HealerTimer") >=0){
            healIgnore.push(healerList[i].Serial())
          }
          if(Orion.Timer("HealerTimer") >=-1){
            Orion.SetTimer("HealerTimer",-30000);
          }
          break;
        }
      }
    }
    var tempGump = GumpByID('0x000008AF');
    if (tempGump != false){
      var tempGump = Orion.GetGump('last');
      if ((tempGump !== null) && (!tempGump.Replayed()) && (tempGump.ID() === '0x000008AF'))
      {
        tempGump.Select(Orion.CreateGumpHook(2));
        Orion.Wait(1500);
      }
     }
     if(!Player.Dead()){
       keepLooking = false;
     }
  Orion.Wait(100);
  }
}

function RunicAtlasRecall(ID,scroll){
  minscrolls = 10;
  //scroll = false;
  //Determining if going to use Magery or Chiv
  if(!scroll){
    if(Orion.SkillValue("Magery",'base')>=600){
      var recallID = 4000;
    }
    else if(Orion.SkillValue("Chivalry",'base') >= 60){
      var recallDI = 5000;
    }
  }
  else{
    var recallID = 3000;
  }
  //Finding Runic atlas
  var RunicAtlasSerial;
  if(!Orion.FindObject('RunicAtlas')){
    var booklist;
    booklist = Orion.FindTypeEx("0x9C16", 'any', 'backpack');
    //Orion.Print("book"+book);
    if(booklist.length > 0){

      var book = booklist[0].Serial();
      Orion.AddObject('RunicAtlas',RunicAtlasSerial);
    }

  }
  else{
    //Orion.Print("It finds it here");
    var book = Orion.FindObject('RunicAtlas').Serial();
  }
  Orion.Wait(5000);
  if(Orion.BuffExists("Animal Form") || Orion.BuffExists("White Tiger Form")){
    Orion.Cast("Animal Form");
    Orion.Wait(2000);
  }
  Orion.UseObject(book);
  Orion.Wait(1000);
  Orion.UseObject(book);
  Orion.Wait(500);
  ID = 50000 +  parseInt(ID);
  //Orion.Print(book + " " +ID+ " " +scroll)
  for(var p = 0; p < Orion.GumpCount(); p++){
    temp9 = Orion.GetGump(p);
    if(temp9.ID() == '0x000001F2'){
      var gump0 = temp9;
    }
  }
		//var gump0 = Orion.GetGump('last');
  if(scroll && (gump0.ID() === '0x000001F2')){
    charges = gump0.TextList();
    charges = charges[0];
    charges = charges.split(">");
    charges = charges[1];
    charges = charges.split(" ");
    charges = charges[0];
    if(parseInt(charges) < minscrolls){
      SendDiscord("```" + Player.Name() + " is almost out of recall scrolls in his Runic Atlas (Currently:"+ charges +").```");
      if(parseInt(charges) == 0){
        Orion.CloseUO();
      }
    }
  }
	if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001F2'))
	{
		gump0.Select(Orion.CreateGumpHook(ID));
		Orion.Wait(500);
	}

	if (Orion.WaitForGump(5000))
	{
    var gump1 = Orion.GetGump('last');
		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001F2'))
		{
      if(scroll){
        gump1.Select(Orion.CreateGumpHook(3000));
      }
      else{
        gump1.Select(Orion.CreateGumpHook(recallID));
      }
			Orion.Wait(2000);
      Orion.CloseGump(gump1);
		}
	}
  Orion.Wait(2000);
}

function GumpByID(ID){
  var returnVal = false;
  var gCount = Orion.GumpCount();
  for(var i=gCount-1;i>=0;i--){
    var tempGump = Orion.GetGump(i);
    if(tempGump.ID() == ID){
      //Orion.Print(tempGump.ID())
      return tempGump;
    }
    Orion.Wait(50);
  }
  return returnVal;
}

function SlaveLoop(){
  var leader = Orion.FindObject("Leader");
  Orion.SetGlobal("SlaveLoop",'true');
  while(Orion.GetGlobal("SlaveLoop") == "true"){
    if(Player.X() != leader.X() || Player.Y() != leader.Y()){
      GoToLocRunStack(leader.X(),leader.Y());
    }
    var attacktar = Orion.FindType("-1", "-1", "ground", "live|ignoreself|ignorefriends|nothuman|inlos|near", 1, "gray|criminal|red|yellow");
    if(attacktar.length > 0){
      Orion.Attack(attacktar);
    }
    Orion.Wait(100);
  }
}

function AutoAttackMob(attacktype, honortarget,theRange,followTarg){
  //Orion.Print(attacktype);
  if(Orion.GetGlobal('doLOS') == 1){
    var inLos = "inlos|"
  }
  else{
    var inLos = ""
  }
  var mobArr = Orion.FindType(Orion.GetGlobal("creatureID"), "-1", "ground", inLos +"live|ignoreself|ignorefriends|nothuman|near", theRange, attacktype);
  if (mobArr.length)
  {
        Orion.ClearHighlightCharacters(true);
        //Orion.ClientLastAttack(mobArr[lastInd]);
        Orion.ClientLastTarget(mobArr[0]);
        Orion.GetStatus(mobArr[0]);
        var currtar = Orion.FindObject(mobArr[0]);
        Orion.AddHighlightCharacter(mobArr[0], '1152',true);
        //Critical wait is needed, likely for latency
        Orion.Wait(500);
        if(currtar && currtar.Name() != ""){
          Orion.CharPrint(Player.Serial(), '48', "Target:[" + currtar.Name()+ "]");
          if(honortarget){
            Orion.InvokeVirtue('Honor');
            Orion.WaitForTarget(1000);
            Orion.TargetObject(currtar.Serial());
            Orion.Wait(500);
            if(Orion.HaveTarget()){
              Orion.CancelTarget();
            }
          }
          Orion.Attack(currtar.Serial());
          if(followTarg){
            Orion.Follow(currtar.Serial());
          }
          Orion.SetTimer("rangetimer",-15000);
          /*Orion.Wait(500);
          if(Orion.InJournal('Now','my','0','any',Orion.Now()-10000,Orion.Now())){
            Orion.SetTimer("rangetimer",-15000);
            return currtar;
            Orion.Print("Following target: " + currtar.Name())
          }
          else{
            Orion.CharPrint(Player.Serial(),77,"Not Finding")
            Orion.Ignore(mobArr[0]);
            return false;
          }*/
          return currtar;
        }
        else{
          //Orion.Print("Throwing an Ignore in the AutoAttackMob: " + mobArr[0])
          Orion.Ignore(mobArr[0]);
          return false;
        }
    }
    else{
      return false;
    }

}

function KeepAlive(){
  //Hardcoded when to act at this point, should move to GUI
  healWhen = Player.MaxHits(); //Absolute value, not percentage
  //General variable setup
  var healing = false;
  var bush = false;
  var chiv = false;
  var spirit = false;
  Orion.SetGlobal("HealLoop","true");
  if(Orion.SkillValue("Healing",'real') >= 800 ){
    healing = true;
  }
  if(Orion.SkillValue("Bushido",'real') >= 800 ){
    bush = true;
  }
  if(Orion.SkillValue("Chivalry",'real') >= 1000 ){
    chiv = true;
  }
  if(Orion.SkillValue("Spirit Speak",'real') >= 1000 ){
    chiv = true;
  }
  while(Orion.GetGlobal("HealLoop") == "true" && !Player.Dead()){
    //Orion.Print("Bandages:" + Orion.Count("bandage"))
    if(healing && Orion.Count("bandage") && Player.Hits() < healWhen){
        if(Player.Dex() > 80){
          var bandagetime = 8000;
          //bandagetime = 8000 - (((Player.Dex()-80)/20)*1000)  I think this one is wrong
          bandagetime = 12000 - (((Player.Dex())/20)*1000)
        }
        else{
          var bandagetime = 8000;
        }
        //Orion.CreateClientMacro("BandageSelf").Play();
        Orion.BandageSelf();
        didband = Orion.WaitJournal("You begin applying the bandages.", Orion.Now(), Orion.Now() + 2000, "sys");
        if(didband){
          Orion.AddDisplayTimer("64", bandagetime, "UnderChar", "Circle|Bar", "Bandage", 60, 0, '55', 0xFF, '0xFFFFFF');
          Orion.Wait(bandagetime);
        }
        else{
          Orion.Wait(500);
        }

    }
    if(bush){
      if(Player.Hits() < healWhen - 20 && Orion.Timer("HealEvasion") >= -1){
        Orion.Cast("Evasion");
        Orion.Wait(300);
        if(Orion.BuffExists("Evasion")){
          Orion.SetTimer("HealEvasion",-26000)
        }
        Orion.Wait(700);
      }
      if(Player.Hits() < healWhen && !Orion.BuffExists("Evasion") && Orion.Timer("HealConf") >= -1){
        Orion.Cast("Confidence");
        Orion.Wait(500);
        if(Orion.InJournal('exude confidence','sys','0','any',Orion.Now()-2000,Orion.Now()+2000)){
          Orion.SetTimer("HealConf",-5000);
        }
        Orion.Wait(500);
      }
    }
    if(spirit && Player.Hits() < healWhen){
      Orion.Cast("Spirit Speak");
      Orion.Wait(1100);
    }
    Orion.Wait(100);
  }
}

function SampMode(attacktype,theRange){
  //Orion.Print("sampmode")
  var mobArr = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends|nothuman", theRange, attacktype);
  for(var i = 0; i < mobArr. length; i++){
    Orion.Attack(mobArr[i]);
    Orion.Wait(100);
  }
}

function DiscordUpdate(){
  var vars = {};
  vars.longForm = false;
  vars.maxItems = 115;
  vars.maxWeight = 95;
  vars.minDurability = 8;
  vars.updateFreq = 30;
  vars.minGold = 100000;
  vars.isEvent = false;
  theItem = Orion.FindTypeEx('any', Orion.GetGlobal("LootType"), 'backpack').length;
  //Sets the baseline for the items / hour
  if(Orion.FindObject("startItems") == null){
    Orion.SetGlobal("startItems",theItem);
  }
  Orion.Exec("KeepGhost",true);
  Orion.SetTimer("DiscordUpdate",-5000)
  while(true){
    theItem = Orion.FindTypeEx('any', Orion.GetGlobal("LootType"), 'backpack').length;
    if(Orion.Timer("DiscordUpdate") >= -1 || Orion.GetGlobal("updateNow") == "true"){
      var sndStr = "";
      var divNum = 30;
      //var divEmoji = ":white_square_button:";
      var divEmoji = ":heavy_minus_sign:"
      for(var i =0;i< divNum;i++){
        sndStr += divEmoji;
      }
      SendDiscordFarm(sndStr);
      var alive = Player.Dead() ? ":red_circle:" : ":green_circle:";
      var script = Orion.ScriptRunning("AttackLoop") ? ":green_circle:" : ":red_circle:";
      var sndStr = "";
      var sndStr1 = [];
      sndStr1.push(TimeString() + " | **" + Player.Name() + "**");
      sndStr1.push("Alive: " + alive);
      sndStr1.push("Script Running: " + script);
      var currGold = CheckGold();
      var goldnew = currGold[1];
      if(currGold != false){
        var goldFlag = vars.minGold <= goldnew ? ":red_circle:" : ":yellow_circle:";
        if(goldnew > vars.minGold * 5){
          goldFlag = ":green_circle:";
        }
        sndStr1.push("Gold: $" + currGold[0] + " (Deaths: " + currGold[2] + ")" + " " + goldFlag);
      }
      if(Player.Dead()){
        sndStr1.push(" @everyone");
      }
      if(vars.longForm){
        for(var i = 0;i<sndStr1.length;i++){
          SendDiscordFarm(sndStr1[i]);
          Orion.Wait(200);
        }
      }
      else{
        for(var i = 0;i<sndStr1.length;i++){
          sndStr += sndStr1[i];
          if(i != sndStr1.length -1){
            sndStr += " | ";
          }

          Orion.Wait(200);
        }
        SendDiscordFarm(sndStr);
      }
      var sndStr = "";
      var sndStr1 = [];
      sndStr1.push("**" + Player.Name() + "'s Stats**");
      var hitsPer = Player.Hits()/Player.MaxHits();
      hitsPer = (hitsPer*100).toFixed(0);
      var hitsFlag = hitsPer <= 30 ? ":red_circle:" : ":yellow_circle:";
      if(hitsPer > 60){
        hitsFlag = ":green_circle:";
      }
      sndStr1.push("Health: " + hitsPer + "% " + hitsFlag);
      var itemFlag = Orion.FindType('any', 'any', 'backpack', '', '', '', true).length >= vars.maxItems ? ":red_circle:" : ":green_circle:";
      sndStr1.push("Items: " + Orion.FindType('any','any','backpack','','30','',true).length + "/125 (" + ((Orion.FindType('any','any','backpack','','30','',true).length/125)*100).toFixed(0) + "%) " + itemFlag);
      var weightFlag = Math.round(Player.Weight()/(Player.MaxWeight()*1.0000000001)) >= vars.maxWeight ? ":red_circle:" : ":green_circle:";
      sndStr1.push("Weight: " + Player.Weight() +"/"+ Player.MaxWeight()+ " (" + ((Player.Weight()/Player.MaxWeight())*100).toFixed(0) + "%) " + weightFlag);
      var durDrop = DurabilityDrop(vars.minDurability);
      var durFlag = durDrop[0] > 75 ? ":green_circle:" : ":yellow_circle:";
      if(durDrop[0] <= vars.minDurability){
        durFlag = ":red_circle:";
      }
      sndStr1.push("Lowest Durability: " + durDrop[1] + " (" + durDrop[0] + "/" + durDrop[2] + ") " + durFlag + " ");

      if(vars.longForm){
        for(var i = 0;i<sndStr1.length;i++){
          SendDiscordFarm(sndStr1[i]);
          Orion.Wait(200);
        }
      }
      else{
        sndStr1[0] += ":";
        for(var i = 0;i<sndStr1.length;i++){
          sndStr += sndStr1[i];
          if(i != sndStr1.length -1){
            sndStr += " | ";
          }

          Orion.Wait(200);
        }
        SendDiscordFarm(sndStr);
      }
      Orion.Wait(100);
      if(vars.isEvent){
        SendDiscordFarm( "**" + Player.Name() + "'s Loot: **" + theItem + " event items.")
      }

      Orion.SetTimer("DiscordUpdate",vars.updateFreq*-60000);
      Orion.SetGlobal("updateNow","false");
    }
    else if(Player.Dead()){
      //Orion.SetGlobal("updateNow","true");
      Orion.Wait(100);
    }
    if(Player.Dead() && Orion.GetGlobal("GetBody") == "false"){
      Orion.SetGlobal("GetBody","true");
      Orion.SetGlobal("BodyX",Player.X());
      Orion.SetGlobal("BodyY",Player.Y());
      Orion.Wait(1000);
      //Orion.SetGlobal("updateNow","true");
    }
    Orion.Wait(500);
    //This part is watching out if a player is attacking you, and sending their name to discord.
    if(Orion.InJournal("is attacking you",'sys','0','any',Orion.Now()-5000,Orion.Now())){
      var msg = Orion.InJournal("is attacking you",'sys','0','any',Orion.Now()-5000,Orion.Now());
      msg = Orion.Split(msg.Text(), ' ');
      SendDisc(TimeString() + " | " + Player.Name() + " is being attacked by " + msg + ". @everyone")
      Orion.Wait();
    }
  }
}

function DurabilityDrop(mindur){
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

  var lowestItem = [];
  lowestItem[0] = null;
  for(var i = 1; i< 32; i++){
    if(Orion.ObjAtLayer(i)){
      var theobj = Orion.ObjAtLayer(i);
      var properties = theobj.Properties();
      if (!Orion.Contains(theobj.Properties(), 'Durability')){
        //Orion.Print('-')
        Orion.Wait(10);
      }
      else{
        var matches = /Durability (\d+)\s\/\s(\d+)/.exec(properties);
        if(matches.length > 2 && Number(matches[1]) < mindur){
          //Orion.Print(theobj.Layer() + ": " +matches[1] + " / " +matches[2])
          Orion.Wait(1200)
          Orion.MoveItem(theobj.Serial());
          Orion.SetGlobal("ForceDrop","true");
        }
        if(lowestItem[0] == null){
          lowestItem[0] = Number(matches[1]);
          lowestItem[1] = layers[theobj.Layer()];
          lowestItem[2] = Number(matches[2]);
        }
        else if(Number(matches[1]) < lowestItem[0]){
          lowestItem[0] = Number(matches[1]);
          lowestItem[1] = layers[theobj.Layer()];
          lowestItem[2] = Number(matches[2]);
        }
      }
    }
  }
  return lowestItem;
}

function AntiGM()
{
    // Discord

    var bot = Orion.RegRead(Player.Serial()+"/GMwebhook");
    var charName = Player.Name();
    var paramText = "username="+charName+"&content=@everyone "+charName+" found a GM, need human confirmation!";

    while (Orion.GetGlobal("doGMclose") == 1 || Orion.GetGlobal("doGMnotify") == 1)
    {
      var msg = Orion.WaitJournal("GM |Seer |Counselor ", Orion.Now()+5000, 0);
      if(Orion.GetGlobal("doGMnotify") == 1 && bot != ""){
        Orion.Wait(1);
        Orion.HttpPost(bot, paramText);
      }
      if(Orion.GetGlobal("doGMclose") == 1){
        Orion.LogOut();
      }
      Orion.Wait(100);
    }
}

function LootCorpse(lootobj){

  var minintensity = Number(Orion.RegRead(Player.Serial()+"/lootIntensity"));
  var doInsure = Orion.GetGlobal("doInsure");
  Orion.Wait(1000);
  var sucOpen = Orion.OpenContainer(lootobj);
  if(!sucOpen){
    return false;
  }
  Orion.Wait(200);
  loot = Orion.FindTypeEx(-1,-1, lootobj,'item','2','any',true);
  //Orion.Print("i=" + i + "/ " + loot.length)
  if(loot.length > 0){
    for(var j = 0; j < loot.length; j++){
      if(Intensity(loot[j]) >= minintensity){
        Orion.Wait(1000);
        LootOjb(loot[j],doInsure);
      }
    }
  }
  return true;
}

function LootCreature(){
  Orion.Print("Click body you want to loot.")
  Orion.WaitForAddObject("lootobj");
  Orion.Wait(500);
  LootCorpse(Orion.FindObject("lootobj").Serial());
  var gump = Orion.GetGump('last');
  while(Orion.GumpExists("container",gump.Serial())){
    Orion.Wait(100);
  }
  LootCorpse(Orion.FindObject("lootobj").Serial());
}

function LootUW(){
  body = Orion.FindTypeEx('any', 'any', 'ground', 'item', '20');
  bodyObj = null;
  for(var i = 0;i<body.length;i++){
    if(body[i].Properties() =="An Evil One's Corpse"){
      bodyObj = body[i];
      break;
    }
  }
  if(bodyObj != null){
    GoToLocLong(bodyObj.X(),bodyObj.Y())
    Orion.Wait(500);
    LootCorpse(bodyObj.Serial());
    Orion.Wait(700);
    var gump = Orion.GetGump('last');
    Orion.Print(gump.Serial())
    while(Orion.GumpExists("container",gump.Serial(),gump.ID())){
      Orion.Wait(100);
      Orion.Print("Waiting...")
    }
    LootCorpse(bodyObj.Serial());
  }

}
function PrintBagIntensity(){
  Orion.Print("Click body you want to loot.")
  Orion.WaitForAddObject("lootobj");
  var theBag = Orion.FindObject("lootobj");
  Orion.OpenContainer(theBag.Serial())
  Orion.Wait(1500);
  var theLoot = Orion.FindTypeEx(-1,-1, theBag.Serial(),'item','2','any',true);
  TextWindow.Open();
  TextWindow.Clear();
  var intArray = [];
  for(var i = 0;i<theLoot.length;i++){
    var itemInt = Intensity(theLoot[i])
    if(itemInt != 0){
      TextWindow.Print(theLoot[i].Name() + ": " + itemInt);
      intArray.push(Number(itemInt))
    }
    if(itemInt < 150){
      //red
      Orion.TestItemColor(theLoot[i].Serial(),"37" )
    }
    else if(itemInt < 180){
      //yellow
      Orion.TestItemColor(theLoot[i].Serial(),"52" )
    }
    else if(itemInt < 200){
      //blue
      Orion.TestItemColor(theLoot[i].Serial(),"92" )
    }
    else if(itemInt < 220){
      //Purple
      Orion.TestItemColor(theLoot[i].Serial(),"117" )
    }
    else if(itemInt < 250){
      //Green
      Orion.TestItemColor(theLoot[i].Serial(),"162" )
    }
    else{
      //Orion.TestItemColor(theLoot[i].Serial(),"66" )
      Orion.Hide(theLoot[i].Serial())
    }
  }
  TextWindow.Print("\nThe Minimum Intensity: " + Math.min.apply(Math, intArray));
  TextWindow.Print("The Maximum Intensity: " + Math.max.apply(Math, intArray));

}
function ItemIntensity(){
  Orion.WaitForAddObject("tempObj");
  var tempObj = Orion.FindObject("tempObj")
  Orion.Print(Intensity(tempObj))
  //Orion.Print(tempObj.Name() + " (Layer): " + tempObj.EquipLayer())

}

function Intensity(intobj){
  //Special Splinter bonuse
  var splintBonus = 100;
  var bonusAt = 25;
  var fewmodSplint = 20; //Value of splint to start adding the few mod bonus to.
  var fewmodBonus = 150;
  var fewmodLevel = 4; //Less than or equal too.

    searchlist =
  [
    //First is the bonus name,
    //second is whether we are looking for a value or just does the attribute exist
    //Third is the stored value if found (false for value, true for exsiting)
    //Forth is intensity multiplier, [armor,jewels,weapons]
    //Fifth is whether to count it for total item mods
    //Stat Bonus
    ["Intelligence Bonus", 0,0,[6,3,.5],1],
    ["Dexterity Bonus", 0,0,[6,3,.5],1],
    ["Strength Bonus", 0,0,[6,3,.5],1],
    //Mana/Hits/Stam Increase
    ["Hit Point Increase", 0,0,[10,2,1],1],
    ["Stamina Increase", 0,0,[4,2,1],1],
    ["Mana Increase", 0,0,[3,2,1],1],
    //Regen
    ["Mana Regeneration", 0,0,[12,5,1],1],
    ["Stamina Regeneration", 0,0,[5,5,1],1],
    ["Hit Point Regeneration", 0,0,[12,5,1],1],
    //Casting
    ["Lower Reagent Cost", 0,0,[3,2,1],1],
    ["Lower Mana Cost", 0,0,[6,4,1],1],
    ["Faster Casting", 0,0,[20,45,10],1],
    ["Faster Casting -", 0,0,[1,1,1],1],
    ["Mage Weapon -", 0,0,[1,1,3],1],
    ["Faster Cast Recovery", 0,0,[1,11,1],1],
    ["Spell Damage Increase", 0,0,[1,1.5,1],1],
    ["Spell Channeling", 1,0,[1,1,50],1],
    ["Casting Focus", 0,0,[15,1,1],1],
    //Misc Mods
    ["Enhance Potions", 0,0,[1,2,1],1],
    ["Eater", 0,0,[2,1,1],1],
    ["Night Sight", 1,0,[1,1,1],1],
    ["Slayer", 1,0,[1,1,1],1],
    ["Luck", 0,0,[.1,.1,.1],1],
    //Combat
    ["Hit Chance Increase", 0,0,[1,3,2],1],
    ["Defense Chance Increase", 0,0,[1,3,1],1],
    ["Swing Speed Increase", 0,0,[1,4,1.5],1],
    ["Damage Increase", 0,0,[1,2,.75],1],
    //Hit Spells
    ["Splintering Weapon", 0,0,[1,1,7],1],
    ["Hit Lightning", 0,0,[1,1,1],1],
    ["Hit Fireball", 0,0,[1,1,1],1],
    ["Hit Harm", 0,0,[1,1,1],1],
    ["Hit Magic Arrow", 0,0,[1,1,1],1],
    ["Hit Lower Defense", 0,0,[1,1.5,1],1],
    ["Hit Lower Attack", 0,0,[1,1.25,1],1],
    ["Hit Fatigue", 0,0,[1,1,.5],1],
    //Hit Leaches / Extra combat ones
    ["Hit Mana Drain", 0,0,[1,1,.1],1],
    ["Hit Mana Leech", 0,0,[1,1,.4],1],
    ["Hit Life Drain", 0,0,[1,1,.1],1],
    ["Hit Life Leech", 0,0,[1,1,.1],1],
    ["Hit Stamina Drain", 0,0,[1,1,.1],1],
    ["Hit Stamina Leech", 0,0,[1,1,.1],1],
    ["Battle Lust", 1,0,[1,1,20],1],
    ["Blood Drinker", 1,0,[1,1,20],1],
    //Area damage
    ["Hit Poison Area", 0,0,[.1,.1,.1],1],
    ["Hit Energy Area", 0,0,[.1,.1,.1],1],
    ["Hit Fire Area", 0,0,[.1,.1,.1],1],
    ["Hit Cold Area", 0,0,[.1,.1,.1],1],
    ["Hit Chaos Area", 0,0,[.1,.1,.1],1],
    //Weapon Damage type
    ["Poison Damage", 0,0,[.5,.5,.5],0],
    ["Energy Damage", 0,0,[.5,.5,.5],0],
    ["Fire Damage", 0,0,[.5,.5,.2],0],
    ["Cold Damage", 0,0,[.5,.5,.5],0],
    ["Chaos Damage", 0,0,[.5,.5,.3],0],
    //Item Quality
    ["Legendary Artifact", 1,0,[25,15,1],0],
    ["Major Artifact", 1,0,[20,10,1],0],
    ["Brittle", 1,0,[1,1,1],0],
    ["Antique", 1,0,[1,1,1],0],
    ["Cursed", 1,0,[-200,-200,-200],0],
    ["Prized", 1,0,[1,25,50],0],
    //Item Type
    ["Ring", 1,0,[1,1,1],0],
    ["Bracelet", 1,0,[1,1,1],0],
    ["Bone", 1,0,[25,1,1],0],
    ["Studded", 1,0,[25,1,1],0],
    ["Hide", 1,0,[25,1,1],0],
    ["Weapon", 1,0,[1,1,1],0],
    ["Hatchet", 1,0,[1,1,20],0],
    ["Bokuto", 1,0,[1,1,20],0],
    ["Bone Harvester", 1,0,[1,1,10],0],
    ["Cleaver", 1,0,[1,1,20],0],
    //Aux stuff / tracking
    ["Total Item Mods", 1,0,[1,1,1],0],
  ]
  skilllist = [
    //Skill name, value,nothing, intesity multiplier.
    ["Magery", 0,0,4],
    ["Parrying", 0,0,4],
    ["Resisting Spells", 0,0,4],
    ["Bushido", 0,0,4],
    ["Ninjitsu", 0,0,4],
    ["Stealth", 0,0,3],
    ["Stealing", 0,0,3],
    ["Animal Taming", 0,0,4],
    ["Animal Lore", 0,0,3],
    ["Chivalry", 0,0,3],
    ["Necromancy", 0,0,4],
    ["Spirit Speak", 0,0,4],
    ["Evaluating Intelligence", 0,0,4],
    ["Swordsmanship", 0,0,4],
    ["Tactics", 0,0,4],
    ["Anatomy", 0,0,4],
    ["Healing", 0,0,3],
    ["Provocation", 0,0,3],
    ["Musicianship", 0,0,3],
    ["Discordance", 0,0,4],
    ["Provocation", 0,0,3],
    ["Archery", 0,0,4],
    ["Macing", 0,0,3],
    ["Wrestling", 0,0,4],
    ["Veterinary", 0,0,3],
    ["Focus", 0,0,4],
    ["Meditation", 0,0,3],
    ["Mysticism", 0,0,5],
    ["Throwing", 0,0,3],
  ]

  if(intobj){
    var theobj = intobj;
    var intcalc =0;
    var properties = theobj.Properties();
    if (!Orion.Contains(theobj.Properties(), 'Durability')){
      Orion.Wait(10);
    }
    else{
      //This section will loop through the modifiers, except for skills.
      for(var i = 0;i<searchlist.length;i++){
        if(searchlist[i][1] == 0){
          var pattern = new RegExp(searchlist[i][0] + " (\\d+)","g");
          if(searchlist[i][0] == "Faster Casting -")
          {
            var pattern = new RegExp("Faster Casting \\-" + "(\\d+)","g");
          }
          else if(searchlist[i][0] == "Mage Weapon -"){
            var pattern = new RegExp("Mage Weapon \\-" + "(\\d+)","g");
          }
        }
        else{
          var pattern = new RegExp(searchlist[i][0],"g");
          Orion.Wait(1);
        }
        //var pattern = /Intelligence Bonus (\d)/g;
        var matches = pattern.exec(properties);
        if(matches && matches.length > 0){
          if(searchlist[i][1] == 0){
          //Orion.Print(searchlist[i][0]+ ": " + matches[1] + " | " + matches[0])
            //Special handling for weapons
            /*if(Orion.Contains(properties,"Weapon")){
              if(searchlist[i][0] == "Splintering Weapon" && Orion.Contains(properties,"Brittle")){
                searchlist[i][3] = .1;
              }
              if(searchlist[i][0] == "Damage Increase"){
                searchlist[i][3] = .1;
              }
            }
            else{
              searchlist[i][2] = Number(matches[1]);
            }
            */
            searchlist[i][2] = Number(matches[1]);
          }
          else{
            searchlist[i][2] = true;

          }
          //Orion.Print(searchlist[i][0]+ ": " + searchlist[i][2])
        }
      }
      //This section will parse through the skills.
      //Orion.Print("Skill Portion");
      for(var i = 0;i<skilllist.length;i++){
        var pattern = new RegExp(skilllist[i][0]+" \\+(\\d+)","g");
        //Orion.Print(pattern);
        var matches = pattern.exec(properties);
        if(matches && matches.length > 0){
          skilllist[i][1] = Number(matches[1]);
          //Orion.Print(skilllist[i][0]+ ": " + skilllist[i][1])
        }
      }
    }

    //This section takes the gathered item data and generates an intensity.
    //First adding up the intensity for skill addition
    for(var i = 0;i<skilllist.length;i++){
      intcalc += skilllist[i][1]*skilllist[i][3];
    }
    //Now for the rest of the item mods
    var totalMods = 0;
    var isSplint = false;
    for(var i = 0;i<searchlist.length;i++){
      //Total Mod Count (right now only for wepaons, could pull this out for all items)
      if(searchlist[i][4] == 1 && searchlist[i][2] > 0){
        totalMods++;
      }
      //Handling Weapon specific intensity modifiers
      if(Orion.Contains(theobj.Properties(), 'Weapon')){
        //Handling the split wep bonus
        if(searchlist[i][0] == "Splintering Weapon"){
          if(searchlist[i][2] >= fewmodSplint){
            isSplint = true;
          }
          if(searchlist[i][2] >= bonusAt){
            intcalc += searchlist[i][2]*searchlist[i][3][2] + splintBonus;
          }
          else{
            intcalc += searchlist[i][2]*searchlist[i][3][2];
          }
        }
        //Handling Mage weapon number
        else if(searchlist[i][0] == "Mage Weapon -"){
          if(searchlist[i][2] <= 15){
            intcalc += searchlist[i][2]*searchlist[i][3][2];
          }
          else{
            intcalc += 20;
          }
        }
        //All other intensity ratings
        else{
          intcalc += searchlist[i][2]*searchlist[i][3][2];
        }

      }
      //Handling Ring/Braclet sepcific modifiers
      else if(theobj.EquipLayer() == 14 || theobj.EquipLayer() == 8){
        intcalc += searchlist[i][2]*searchlist[i][3][1];
      }
      //Handling everything else (which should be only armor)
      else{
        intcalc += searchlist[i][2]*searchlist[i][3][0];
      }
    }
    //Checking for splinter with few mods and adding a bonus
    if(isSplint && totalMods <= fewmodLevel){
      intcalc += fewmodBonus;
    }

    //Old code, prob delete at some point
    if (false && Orion.Contains(theobj.Properties(), 'Durability')){
      //Orion.Print(theobj.Name() + ": " +intcalc)
    }

  }
  //Orion.Print("Total Mods: " + totalMods)
  return intcalc;
}


function LootOjb(theobj,insureit){

  var backcount = Orion.Count('any','any','backpack')
  Orion.Wait(1000);
  Orion.DragItem(theobj.Serial());
  Orion.Wait(100);
  Orion.DropDraggedItem();
  Orion.Wait(1100);
  if(Orion.Count('any','any','backpack') == backcount + 1){
    backcount = true;
  }
  else{
    backcount = false;
  }
  if(insureit == 1 && backcount){
    Orion.RequestContextMenu(Player.Serial());
    Orion.WaitContextMenuID(Player.Serial(), 418);
    if (Orion.WaitForTarget(1000)){
      Orion.TargetObject(theobj.Serial());
      Orion.WaitForTarget(1000);
      Orion.CancelTarget();
    }
    Orion.Wait(1000);
  }
}

function WriteStatus(code,text,array){
  //Setting some general Variables
  var varDelin = ";";
  var arrayDelin = "|";
  //Setting a master list of characters that will be making their own update registry Variables
  var charstatList = Orion.RegRead("charstatList");
  if(charstatList == ""){
    Orion.RegWrite("charstatList",Player.Serial());
  }
  else{
    if(Orion.Contains(charstatList,Player.Serial()) != true){
      Orion.RegWrite("charstatList",charstatList + varDelin + Player.Serial());
    }
  }
  //Now writing to the reg value of the character's status
  // ; will be the delineator between variables, | will be the delineator between values of the array.
  //Structure: (by index)
  //0 = Status code, 1 = time (24hr), 2 = detail text, 3 = array data
  var theTime = Orion.Time('HH mm');
  var setString = "status_code" + arrayDelin + code + varDelin + "time" + arrayDelin + theTime + varDelin + "status_text" + arrayDelin + text;
  if(Array.isArray(array)){
    setString += varDelin;
    setString = "array" + arrayDelin;
    for(var i = 0;i<array.length;i++){
      setString += array[i]
      if(i != array.length -1){
        setString = arrayDelin;
      }
    }
  }
  Orion.RegWrite(Player.Serial()+"/statusUpdate",setString);
  //Orion.Print(Orion.RegRead("charstatList"))

}

function ReadAction(){

}

function UnderwaterMonitor(){

checkdelay = 2    //Delay, in seconds, between checks
founddelay = 30   //Delay, in minutes, after an encounter starts before it will @ everyone again
senddelay = 10    //Delay, in minutes, for how often it will send to discord that an encounter is ongoing.
server = "Atlantic"
sendactive = 2    //Delay, in hours, between announcing its still running.


Orion.SetTimer("notimeout",1);
Orion.SetTimer("senddelay",1);
Orion.SetTimer("checkdelay",1);
Orion.SetTimer("founddelay",1);
var encstarted = false;
var foundone = false;
  while(true){
    var winch = Orion.FindTypeEx('0x280E', '0x09C4', 'ground', '', '30', '');
    //Orion.Print(Orion.Timer('checkdelay') + " " + Orion.Timer('founddelay'))
    if(Orion.Timer('UWRunning') >= -1){
      Orion.SetTimer("UWRunning",sendactive*-3600000);
      sndStr = TimeString() + " " + server + ": " + "Underwater Bot is still running.";
      SendDiscord(sndStr,"Underwater Bot");
    }
    if(winch.length > 0 && Orion.Timer('checkdelay') >= -1){
      wprop = winch[0].Properties();
      wprop = wprop.split(">");
      tempsplit1 = wprop[1].split("<");
      tempsplit2 = wprop[3].split("<");
      tempsplit3 = wprop[5].split("<");
      tempsplit4 = wprop[7].split("<");
      if(tempsplit1[0] == "READY" && tempsplit2[0] == "READY" && tempsplit3[0] == "READY" && tempsplit4[0] == "READY"){
        Orion.Print("Encounter is in progress.");
        Orion.SetTimer("checkdelay",checkdelay*-1000);
        if (!encstarted){
          sndStr = TimeString() + " " + server + ": " + "ALL ***Underwater*** keys have been placed! :key::key::key::key: @everyone";
          SendDiscord(sndStr,"Underwater Bot");
          encstarted = true;
        }
      }
      else if(tempsplit1[0] == "READY" || tempsplit2[0] == "READY" || tempsplit3[0] == "READY" || tempsplit4[0] == "READY"){
        Orion.Print("A key has been placed, encounter will begin soon.");
        if(!foundone){
          sndStr = TimeString() + " " + server + ": " + ":key: At least one ***Underwater*** key has been placed, an encounter could begin soon.";
          SendDiscord(sndStr,"Underwater Bot");
          foundone = true;
        }
      }
      else if(tempsplit1[0] == "FAULT" || tempsplit2[0] == "FAULT" || tempsplit3[0] == "FAULT" || tempsplit4[0] == "FAULT"){
        encstarted = false;
      }
      if(tempsplit1[0] == "FAULT" && tempsplit2[0] == "FAULT" && tempsplit3[0] == "FAULT" && tempsplit4[0] == "FAULT"){
        if(foundone){
          foundone = false;
          peoplearound = Orion.FindTypeEx("-1", "-1", 'ground', "live|ignoreself|ignorefriends|human", 20, "blue|green");
          sndStr = TimeString() + " " + server + ": " + "Encounter has reset.";
          if(peoplearound.length > 0){
            sndStr = sndStr + " There are " + peoplearound.length + " people waiting around the :key:box.";
          }
          SendDiscord(sndStr,"Underwater Bot");
        }
      }
    }
    Orion.Wait(1000);
    if (Orion.Timer('notimeout') >= -1){
      Orion.UseSkill("detecting hidden")
      Orion.WaitForTarget(2000);
      Orion.TargetObject(Player.Serial());
      Orion.SetTimer("notimeout",5*-60000);
    }
  }
}


function Armory(){
armorId = "0x151A"   //Cursed Suit of Armor
cphylactId = "0x4686"   //Corrupt Phylactery
cphylactColor = "0x081B"
pphylactId = "0x4686" //Purified Phylactery
pphylactColor = "0x0000"

  function purify(){
    if(Orion.FindTypeEx(cphylactId, cphylactColor, 'backpack').length > 0){
      flames = Orion.FindTypeEx('0x19AB','-1','ground', '', '2');
      if(flames.length > 0){
        Orion.UseType(cphylactId, cphylactColor,'backpack');
        Orion.WaitForTarget(2000);
        Orion.TargetObject(flames[0].Serial());
        Orion.Wait(1500);

      }
    }
  }

  function throwit(){
    if(Orion.FindTypeEx(pphylactId, pphylactColor,'backpack').length > 0){
      armor = Orion.FindTypeEx('0x151A|0x1512','any','ground', '', '10');
      if(armor.length > 0){
        Orion.Print("Armor Sets:" + armor.length )
        Orion.UseType(pphylactId, pphylactColor,'backpack');
        Orion.WaitForTarget(2000);
        Orion.TargetObject(armor[0].Serial());
        Orion.Wait(1500);

      }
    }
  }
  function pickup(){
      bottle = Orion.FindTypeEx("0x4686", "0x081B", 'ground', 'item', '2');
      if(bottle.length > 0){
        Orion.Print("Found Bottles: " + bottle.length);
        Orion.MoveItem(bottle[0].Serial(), 1, 'backpack');
        Orion.Wait(1500);

    }
  }
while(true){
  pickup();
  purify();
  throwit();
  Orion.Wait(500);
}

}


function HealSelfFriend() {
    while (!Player.Dead()) {
        fulllist = Orion.FindType("-1", "-1", 'ground', "live", 2, "green");
        healtar = null;
        fulllist.push(Player.Serial())
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
        target = healtar;
        Orion.Wait(200);
        if (target != null) {
            if (target != null && (target.Poisoned() || target.Hits() < (target.MaxHits())) && !Orion.BuffExists('healing skill') && target.Distance() <= 2) {
                Orion.BandageTarget(target.Serial());
                Orion.AddDisplayTimer('bandageFriend',
                    Orion.BuffTimeRemaining('healing skill'),
                    'Top', 'Circle', 'Heal', 0, 0,
                    'any', -1, '0x0000FFFE');
                Orion.DisplayTimerSetIcon('bandageFriend', 'Top', '0x0E21');
                Orion.Wait(500);
            }
        }
        else {
            Orion.Wait(200);
            if (Player.Hits() < Player.MaxHits()) {
                Orion.BandageSelf();
                Orion.Wait(100);

                Orion.AddDisplayTimer('bandageSelf',
                    Orion.BuffTimeRemaining('healing skill'),
                    'Top', 'Circle', 'HealSelf', 0, 0,
                    'any', -1, '0x00FF00FE');
                Orion.DisplayTimerSetIcon('bandageSelf', 'Top', '0x0E21');


                while (Orion.BuffExists('healing skill')) {
                    Orion.Wait(100);
                }
            }
        }
    }

}


function Sampire()
{
    var dist = 1
    var not = 'gray|red|criminal|enemy'
    var momentumStrike = 0x75FB;
    var lightningStrike = 0x75FA;
    var confidence = 0x75FA;
    var enemyOfOne = 0x754E;
    var divineFury = 0x754D;
    var consecrateWeapon = 0x75A7;
    var honored = 0x7601;
    var cast_LS = true;
    var cast_momentum = true;
    var cast_honored = true;
    var cast_consecrate = true;
    var cast_eeo = true;

    while (!Player.Dead())
    {
        var enemies = Orion.FindType("-1", "-1", ground, "live|ignoreself|ignorefriends", dist, not);
        var enemyCount = enemies.length;
        Orion.Attack(enemies[0])
        //Orion.Print(enemyCount)

        if (enemyCount > 0)
         {
            switch (enemyCount)
             {
              case 1:
                     if (!Orion.AbilityStatus('primary'))
                     {
                        Orion.UseAbility('primary');
                         }
                break;
             case 2:
                  if (!Orion.BuffExists(momentumStrike))
                      {
                        Orion.Cast('Momentum Strike');
                    }
                break;
              default:
                    if (!Orion.AbilityStatus('secondary'))
                    {
                        Orion.UseAbility('secondary');
                 }
             }
        }
        if(cast_consecrate && !Orion.BuffExists("Consecrate")){
          Orion.Cast("Consecrate Weapon");
          Orion.Wait(1000);
        }
        if(cast_eeo && !Orion.BuffExists("Enemy of One")){
          Orion.Cast("Enemy of One");
          Orion.Wait(1000);
        }
    Orion.Wait(200);
    }
}

function CatchTown(){
  thetown = null;
  if (Orion.InJournal("currtown")){
    hacksplit = Orion.InJournal("currtown").Text();
    hacksplit = hacksplit.split(" ");
    thetown = hacksplit[1];
  }
  else{
    WriteStatus(2,"Waiting for next city to start.",["int",Orion.GetGlobal("currSilver")]);
    Orion.SetGlobal("waitingCity","true")
    Orion.SetTimer("cityWait",-120000)
    towncatch = Orion.WaitJournal("Battle between Vice and Virtue",0,0);
    //towncatch = Orion.WaitJournal("Battle between Vice and Virtue",'','0','any');
    var splitcatch;
    splitcatch = towncatch.Text();
    splitcatch = splitcatch.split(" ");
    WriteStatus(2,"Heading to the current city of " +splitcatch[13] +".",["int",Orion.GetGlobal("currSilver")]);
    Orion.Print("The town is: " + splitcatch[13]);
    thetown = splitcatch[13];
    Orion.SetGlobal("waitingCity","false")
  }
  Orion.ClearJournal();
  return thetown;
}

function SilverFarm(){
  var houseTele = [3257,623]
  var homeMacro = "Recall Home"
  while(!Player.Dead() && Orion.SkillValue("hiding","base") >= 500){
    Orion.PlayMacro(homeMacro, true);
    Orion.Wait(5000);
    GoToLoc(houseTele[0],houseTele[1])
    Orion.UseSkill("hiding")
    Orion.Wait(12000);
    currtown = CatchTown();
    if (currtown != null){
      Orion.Wait(1000);
      if(GetDistance(houseTele[0],houseTele[1]) < 3){
        Orion.Say("fel " + currtown + " mint");
        Shared.AddVar("currcity",currtown);
      }
      else{
        break;
      }
      Orion.Wait(2000);
      VVVgump = Orion.GetLastGump();
      var incity = true;
      while(incity){
        while(!Player.Hidden()){
          Orion.UseSkill("hiding");
          if(!Player.Hidden()){
            Orion.Wait(12000);
          }
        }
        if(VVVgump.ID() != "0x000F3ECC"){
          VVVgump = null;
          //Orion.Print("first of vvv gump search.")
          for(var v = 0; v < Orion.GumpCount();v++){
            if(Orion.GetGump(v).ID() == "0x000F3ECC"){
              VVVgump = Orion.GetGump(v);
              Orion.Print("Found VVV Gump");
              killit = false;
              break;
            }
          }
          Orion.Wait(500);
        }
        if (VVVgump != null){
          Orion.CloseGump('generic',VVVgump.Serial());
          Orion.Wait(4000);
          ///Orion.Print("Closing VVV gump.")
          if(!Orion.GumpExists('generic',VVVgump.Serial())){
            Orion.Print("City is over.");
            incity = false;
          }
        }
        else{
          incity = false;
          Orion.Print("No VVV Gump found.");
        }
      }
    }
  }

}

function AutoDiscord(){
  while(!Player.Dead()){
    var theTargs = Orion.FindTypeEx('any', '-1', 'ground', 'ignoreself|ignorefriends|nothuman|live|near', '18', 'gray|criminal');
    if(theTargs.length > 0 && Orion.Timer("pvmDiscordTimer") >= -1){
      Orion.UseSkill("Discordance");
      Orion.WaitForTarget(2000);
      if(Orion.HaveTarget()){
        Orion.TargetObject(theTargs.Serial());
        var temp = Orion.WaitJournal("play jarring|attempt to disrupt",Orion.Now()-2000,Orion.Now()+2000,"sys");
        if(temp != null && Orion.Contains(temp.Text(),"play jarring")){
          Orion.AddDisplayTimer(199, 5000, "UnderChar", "Circle|Bar", "Discord", 60, 0, '55', 0xFF, '0xFFFFFF');
          Orion.SetTimer("pvmDiscordTimer",-12000)
          while(Orion.ObjectExists(theTargs.Serial())){
            Orion.Wait(500);
          }
        }
        else{
          Orion.CharPrint(self, 37, "Discord failed!");
        }
      }
    }
    Orion.Wait(500);
  }
}
