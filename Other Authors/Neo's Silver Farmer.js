//Set whether to use recall scrolls or not.
var recallMethod = "auto"; //true = scrolls, false = magery, "chiv" = chiv, "auto" = determines based on magery/chiv skill and scroll otherwise
var isHuman = true; //Turn this on if you're human so we know to try and hide.


function SilverFarmer_RunicAtlas(){
  if(Orion.FindObject("SilverFarmAtlas") == null){
    Orion.Print("Click the Atlas that contains the special city runes.")
    Orion.WaitForAddObject("SilverFarmAtlas")
  }
  Orion.SetGlobal("isHuman",isHuman);
  var runeBook = Orion.FindObject("SilverFarmAtlas");
  var currSilver = Orion.RegRead(Player.Serial()+"/currSilver")
  if(currSilver == null || currSilver == ""){
    currSilver = 0;
  }
  else{
    Orion.SetGlobal("currSilver",currSilver)
    parseInt(currSilver)
  }
  Orion.SetGlobal("SIG_line1","Current Silver: " + currSilver)
  //If recall method is auto, determine which method to use
  if(Orion.SkillValue("Chivalry",'base') >= 500){
    recallMethod = "chiv";
  }
  else if(Orion.SkillValue("Magery",'base') >= 400){
    recallMethod = false;
  }
  else{
    recallMethod = true;
  }
  while(!Player.Dead() && runeBook != null){
    Orion.Exec("SmallInfoGump",true)
    Orion.Exec("UpdateSmallInfoGump",true)
    Orion.Exec("StayHidden","true")
    Orion.SetGlobal("SIG_RunUpdateFunction","SilverFarmer_RunicAtlas")
    Orion.SetGlobal("SIG_isActivity","false");
    Orion.SetGlobal("SIG_line2","Current Town: Waiting on next town.")
    currtown = CatchTown();
    var direction = "South";
    //Cities to Ignore
    if(currtown == "Yew"){
      //Orion.Print("Ignoring this city due to being on the ignore list.")
      //continue;
      direction = "North";
    }
    if (currtown != null){
      Orion.PauseScript("StayHidden");
      Orion.Wait(1500);
      var currX = Player.X();
      var currY = Player.Y();
      Orion.Wait(500);
      Orion.UseObject(runeBook.Serial())
      Orion.Wait(2000);
      var atlasGump = GumpByID("0x000001F2");
      if(atlasGump == false){
        Orion.Print("Error finding Atlas gump.");
        continue;
      }
      var runeIndex = atlasGump.TextList().indexOf(currtown);
      if(runeIndex != -1){
        RunicAtlasRecall(runeBook.Serial(),(runeIndex-1)/2,recallMethod)
        Orion.Wait(2000);
      }
      else{
        Orion.Print("Error finding city in the atlas.")
        continue;
      }
    }
    else{
      Orion.Print("Error with catching the town.")
      break;
    }
    //Checking to see if the character moved, and if so setting the "incity" flag up.
    if(Orion.GetDistance(currX,currY) > 0){
      currY = Player.Y();
      var incity = true;
      while(Player.Y() == currY){
        Orion.Turn(direction)
        Orion.Wait(100);
        Orion.Step(direction)
      }
      Orion.SetGlobal("SIG_line2","Current Town: " + currtown)
    }
    else{
      var incity = false;
      Orion.Print("Did not make it to a different location.");
      Orion.SetGlobal("SIG_line2","Current Town: Waiting on next town.")
      break;
    }
    Orion.ResumeScript("StayHidden");
    Orion.Wait(2000);
    VVVgump = Orion.GetLastGump();
    var incity = true;
    Orion.SetGlobal("InCity","true");
    Orion.SetGlobal("SIG_isActivity","true");
    while(incity){
        Orion.Wait(5000);
        if(Orion.Timer("statusUpdatetxt") >= -1){
          Orion.Print("Waiting for city to end...")
          Orion.SetTimer("statusUpdatetxt",-15000)
        }
        if(Orion.Timer("ActionTimer") >= 0){
          Orion.UseSkill("Arms Lore");
          Orion.WaitForTarget(10000);
          Orion.CancelTarget();
          Orion.Wait(1500);
        }
        var silverGump = GumpByID("0x000023F0");
        var vvvGump = GumpByID("0x000F3ECC");
        if(vvvGump == false){
          incity = false;
          Orion.SetGlobal("InCity","false")
          Orion.SetGlobal("SIG_isActivity","false");
        }
        if(vvvGump && silverGump == false){
        Orion.CloseGump('generic',vvvGump.Serial());
        }
        else if(silverGump != false){
          gumpsilver = silverGump.CommandList();
          for(var i = 0;i<gumpsilver.length;i++){
            //Orion.Print(gumpsilver[i])
            if(Orion.Contains(gumpsilver[i],"1154947")){
              gumpsilver = gumpsilver[i];
              gumpsilver = gumpsilver.split("@");
              gumpsilver = gumpsilver[1];
              gumpsilver = gumpsilver.split(",");
              var tempsilver = "";
              for(var j = 0;j<gumpsilver.length;j++){
                tempsilver += gumpsilver[j];
              }
              gumpsilver = tempsilver;
              Orion.Print("Current Silver: " + gumpsilver)
              currSilver = parseInt(gumpsilver);
              Orion.SetGlobal("currSilver",currSilver);
              Orion.SetGlobal("SIG_line1","Current Silver: " + currSilver)
              Orion.RegWrite(Player.Serial()+"/currSilver",currSilver)
            }
          }
          Orion.CloseGump('generic',vvvGump.Serial());
          Orion.CloseGump('generic',silverGump.Serial());
          incity = false;
          Orion.SetGlobal("InCity","false");
        }
    }
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

function RunicAtlasRecall(book,ID,scroll){
  minscrolls = 10;
  Orion.Wait(5000);
  if(Orion.BuffExists("Animal Form") || Orion.BuffExists("White Tiger Form")){
    Orion.Cast("Animal Form");
    Orion.Wait(2000);
  }
  var dorecall = true;
  while(dorecall){
    Orion.UseObject(book);
    Orion.Wait(1000);
    ID = 50000 +  parseInt(ID);
    //Orion.Print(book + " " +ID+ " " +scroll)
    var gump0 = GumpByID('0x000001F2');
    if(scroll == true && gump0 != false && (gump0.ID() === '0x000001F2')){
      charges = gump0.TextList();
      charges = charges[0];
      charges = charges.split(">");
      charges = charges[1];
      charges = charges.split(" ");
      charges = charges[0];
      if(parseInt(charges) < minscrolls){
        //SendDiscord("```" + Player.Name() + " is almost out of recall scrolls in his Runic Atlas (Currently:"+ charges +").```");
        if(parseInt(charges) == 0){
          Orion.CloseUO();
        }
      }
    }
  	if (gump0 != false && (gump0 !== null) && (gump0.ID() === '0x000001F2')){
  		gump0.Select(Orion.CreateGumpHook(ID));
  		Orion.Wait(1000);
  	}
  	if (Orion.WaitForGump(5000)){
      var gump1 = GumpByID('0x000001F2');
  		if (gump1 != false && (gump1 !== null) && (gump1.ID() === '0x000001F2')){
        if(scroll == true){
          gump1.Select(Orion.CreateGumpHook(3000));
        }
        else if(scroll == "chiv"){
          gump1.Select(Orion.CreateGumpHook(5000));
        }
        else{
          gump1.Select(Orion.CreateGumpHook(4000));
          Orion.Print("Recalling with magery.")
        }
  			Orion.Wait(2000);
        //Orion.CloseGump('generic',gump1.Serial());
  		}
  	}
    Orion.Wait(2000);
    if(Orion.InJournal("spell fizzles.|reagents are needed",'',0,'any',Orion.Now()-4000,Orion.Now()+20000)){
      if(Orion.InJournal("blocking the location.",'',0,'any',Orion.Now()-4000,Orion.Now()+20000)){
        Orion.Print("blocked location :(")
        //dorecall = false;
      }
      Orion.Wait(100);
    }
    else{
      dorecall = false;
    }
  }
  Orion.Wait(500);
}

function StayHidden(){
  while(Orion.ScriptRunning("SilverFarmer_RunicAtlas")){
    if(!Player.Hidden()){
      if(Orion.GetGlobal("isHuman") == "true" && Orion.Timer("HideTimer") >= -1){
        Orion.UseSkill("hiding");
        Orion.Wait(1000);
        if(!Player.Hidden() && Orion.Timer("HideTimer") >= -1){
          Orion.SetTimer("HideTimer","-12000")
        }
      }
      else if(Orion.SkillValue("Magery") >= 600 && Player.LRC() > 60){
        Orion.Cast("Invisibility");
        Orion.WaitForTarget(3000);
        Orion.TargetObject('self')
        Orion.Wait(500);
      }
      Orion.SetTimer("ActionTimer",-45000)
    }
    Orion.Wait(500);
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

function GetDistance(X,Y){
  var dist = null;

  dist = Math.sqrt((Math.pow(X - Player.X(),2))+(Math.pow(Y - Player.Y(),2)))
  //Orion.Print(dist);
  return dist;
}

function GumpByID(ID){
  var returnVal = false;
  var gCount = Orion.GumpCount();
  for(var i=gCount-1;i>=0;i--){
    var tempGump = Orion.GetGump(i);
    if(tempGump.ID() == ID && Orion.GumpExists('generic',tempGump.Serial())){
      //Orion.Print(tempGump.ID())
      return tempGump;
    }
    Orion.Wait(50);
  }
  return returnVal;
}

//Gump functions

function UpdateSmallInfoGump(){
  var ctupdatedelay = 2000;
  var pos = false;
  while(Orion.ScriptRunning(Orion.GetGlobal("SIG_RunUpdateFunction"))){
    //Save current gump positions
    var pos = Orion.GetGumpPosition('custom', 773);
    if(pos.X() != -1 ){
      //Orion.Print('Custom gump now at: ' + pos.X() + ' ' + pos.Y());
      Orion.RegWrite(Player.Serial()+"/SmallInfoGumpX",pos.X());
      Orion.RegWrite(Player.Serial()+"/SmallInfoGumpY",pos.Y());
      SmallInfoGump();
    }
    Orion.Wait(ctupdatedelay);
  }
  if(!Orion.ScriptRunning(Orion.GetGlobal("SIG_RunUpdateFunction")) && Orion.GumpExists('custom',773)){
    Orion.CloseGump('custom',773);
  }
}


function SmallInfoGump(){
  var line1 = Orion.GetGlobal("SIG_line1")
  var line2 = Orion.GetGlobal("SIG_line2")
  var isActivity = null;
  switch(Orion.GetGlobal("SIG_isActivity")){
    case "true":
      isActivity = true;
      break;
    case "false":
      isActivity = false;
      break;
    default:
      isActivity = null;
  }
  var LTGump = Orion.CreateCustomGump(773);
  var background = '0x9C40';
  var X = Orion.RegRead(Player.Serial()+"/SmallInfoGumpX");
  var Y = Orion.RegRead(Player.Serial()+"/SmallInfoGumpY");
  if(X == "" || Y == ""){
    X = 500;
    Y = 50;
  }
  else{
    X = parseInt(X);
    Y = parseInt(Y);
  }
  LTGump.Clear();
  LTGump.AddResizepic(0, 0, background, 275, 55);
  //LTGump.AddResizepic(0, 0, '13BE', 150, 50);
  LTGump.SetX(X);
  LTGump.SetY(Y);
  if(isActivity == true){
    LTGump.AddGumpPic(8, 20, '0x939', 0);
  }
  else if(isActivity == false){
    LTGump.AddGumpPic(8, 20, '0x938', 0);
  }
  else{
    Orion.Wait(1);
  }
  LTGump.AddText(22,5,'0x0048',line1);
  LTGump.AddText(22,25,'0x0048',line2);
  LTGump.Update();
}
	
function StayLoggedIn()
    {
    while(true)
        {
        Orion.UseObject(backpack);
        Orion.Wait(120000);
        }
    }

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ '978006017960996925' //hook
	+ "/"
	+ 'P03GSPYXdaImNBxcLnENsVsIu8u60hnutMsPESTCmBJJLg0wjxIuGCanK3S7hGUFlSWl'; //key
	Orion.HttpPost(bot, "content=" + message);
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
