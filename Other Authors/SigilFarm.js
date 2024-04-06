function Autostart()
{
  Orion.Exec("SigilFarm", true);
  Orion.Exec("OJWatch", true);
  Orion.Exec("AntiGM", true);
}

function AntiGM()
{
    // Discord
    var bot = "https://discord.com/api/webhooks/1193180513507213442/aDrarURBwRkaUbRt_73vc5VCBCTgTZF7ywxi93w38G5jJmOVCvzVA42hAxzfEoTAf5d1"; // Webhook url
    var charName = Player.Name();
    var paramText = "username="+charName+"&content=@everyone "+charName+" found a GM, need human confirmation!";

    while (true)
    {
        var startTime = Orion.Now();
        var msg = Orion.WaitJournal("GM |Seer |Counselor ", startTime, 0);
        Orion.Wait(1);
        Orion.HttpPost(bot, paramText);
        Orion.PlayWav('fileName');
        Orion.Wait(1000);
         Orion.PlayWav('fileName');
        Orion.Wait(1000);
         Orion.PlayWav('fileName');
        Orion.Wait(1000);
    }
}

//Last attempt. Quit VVV, logged, kicked char from guild, logged, added back to guild, logged, joined vvv, logged, started. -- Didn't work
//Next attempt, quit guild while in VVV.  logged.  Created new guild on other character.  Added theif, logged.  Other character quit while theif logged out (making him GM). Logged back in to become gm, logged out.  Logged back in, joined vvv, logged out.  Logged back in and started.


function CatchTown(){
  thetown = null;
  if (Orion.InJournal("currtown")){
    hacksplit = Orion.InJournal("currtown").Text();
    hacksplit = hacksplit.split(" ");
    thetown = hacksplit[1];
  }
  else{
    towncatch = Orion.WaitJournal("Battle between Vice and Virtue",0,0);
    //towncatch = Orion.WaitJournal("Battle between Vice and Virtue",'','0','any');
    var splitcatch;
    splitcatch = towncatch.Text();
    splitcatch = splitcatch.split(" ");

    Orion.Print("The town is: " + splitcatch[13]);
    thetown = splitcatch[13];
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
      for(var p = 0; p < Orion.GumpCount(); p++){
        temp9 = Orion.GetGump(p);
        if(temp9.ID() == '0x000001F2'){
          var gump1 = temp9;
        }
      }
  		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001F2'))
  		{
        if(scroll){
          gump1.Select(Orion.CreateGumpHook(3000));
        }
        else{
          gump1.Select(Orion.CreateGumpHook(4000));
        }
  			Orion.Wait(2000);
        Orion.CloseGump(gump1);
  		}
  	}
    Orion.Wait(2000);
    if(Orion.InJournal("spell fizzles.|reagents are needed",'',0,'any',Orion.Now()-4000,Orion.Now()+20000)){
      if(Orion.InJournal("blocking the location.",'',0,'any',Orion.Now()-4000,Orion.Now()+20000)){
        Orion.Print("blocked location :(")
        dorecall = false;
      }
      Orion.Wait(100);
    }
    else{
      dorecall = false;
    }
  }
  Orion.Wait(500);
}

function RecalltoCity(cityname){
//You'll need a runebook marked with a rune close to a crystal portal, and then the cooridinates to stand next to interval
  runebookindex = 8;  //Position in standard runebook (starting with 1)

  Orion.Wait(2000);
  var dorecall = false;
  while(dorecall){
    Orion.UseObject('0x456D041E');
    if (Orion.WaitForGump(5000)){
      //var gump0 = Orion.GetGump('last');
      gump0 = null;
      Orion.Wait(200);
      vart
      for(var i = 0; i < Orion.GumpCount();i++){
        tempgump = Orion.GetGump(i);
        if(tempgump.ID() == '0x00000059'){
          gump0 = tempgump;
          gump0.Select(Orion.CreateGumpHook(49 + runebookindex));
          break;
        }
      }
      if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000059')){
          gump0.Select(Orion.CreateGumpHook(49 + runebookindex));
      }
      Orion.Wait(3000);
      if(Orion.InJournal("spell fizzles.")){
        Orion.ClearJournal();
      }
      else{
        dorecall = false;
      }
    }
    Orion.Wait(5000);
  }
  GoToLoc(crystallocation[0],crystallocation[1]);
  Orion.Wait(100);
  if(GetDistance(crystallocation[0],crystallocation[1]) < 5){
    Orion.Say("fel " + cityname + " mint");
    return true;
  }
  else{
    return false;
  }
}
function CheckHidden(){
  while (!Player.Hidden()){
    Orion.UseSkill("Hiding");
    Orion.Wait(2000)
  }
//Add in the ability to use a smoke bomb if ninja is high enough.
}

function GoToLoc(X,Y){
  Orion.WalkTo(X,Y,Player.Z(),1,255,0,1);
  //if(Player.X() == X && Player.Y.() == Y)

}

function SigilFarm(){
var ninjagump = 0; //Which position in the ninja form gump to click
recallscroll = false;
bookid = 4; //position in the runic atlas of the location to recall to the city teleporter
waitrune = 4; //position in the runic atlas of the rune to recall to while waiting for next town.
server = "Atlantic";
crystallocation = [1436,2263];

Orion.Wait(5000);
Orion.OpenContainer('backpack');
Orion.Wait(2000);
if(Player.Name() == "PYKABOK"){
  crystallocation = [1436,2263];
  bookid = 4; //position in the runic atlas of the location to recall to the city teleporter
  waitrune = 4; //position in the runic atlas of the rune to recall to while waiting for next town.
  ninjagump = 2;
}

if(Player.Name() == "Sneak Sneak"){
  server = "Legends"
  crystallocation = [1040,467];
  bookid = 0; //position in the runic atlas of the location to recall to the city teleporter
  waitrune = 1; //position in the runic atlas of the rune to recall to while waiting for next town.
  ninjagump = 2;
}

if(Player.Name() == "Sneak Sneaky"){
  server = "Catskills"
  crystallocation = [1042,485];
  bookid = 0; //position in the runic atlas of the location to recall to the city teleporter
  waitrune = 1; //position in the runic atlas of the rune to recall to while waiting for next town.
  ninjagump = 2;
}

Shared.AddVar("gotrevealed","false");
//RuneBook = '0x4658E7F5';
RuneBook = null;
sigilrun = true;
SigID = 0x99C7;
var booklist;
Orion.Wait(4000);
booklist = Orion.FindTypeEx("0x9C16", 'any', 'backpack');

if(booklist.length > 0){
  RuneBook = booklist[0].Serial();
}
else{
  Orion.Print("Its not finding a runic Atlas...")
}
//Orion.Print("book"+RuneBook);

ninjagump = parseInt(Orion.SkillValue("Ninjitsu",'base')) >= 850 ? 3 : 0;

RunicAtlasRecall(RuneBook,waitrune,false);
Orion.Wait(2000);
Orion.UseSkill("Hiding");
Orion.Wait(1000);

cities = [
  [['Britain'],
    [1447,1698], //First set of coordinates is for the sigil turn in point
    [1464,1640],
    [1453,1555],
    [1512,1640],
    [1492,1739]
  ],
  [['Minoc'],
    [2513,565], //First set of coordinates is for the sigil turn in point
    [2418,497],
    [2465,528],
    [2506,593],
    [2514,474]
  ],
  [['Yew'],
    [640,877], //First set of coordinates is for the sigil turn in point
    [455,960],
    [340,967],
    [609,890],
    [648,947]
  ],
  [['Skara'],
    [572,2161], //First set of coordinates is for the sigil turn in point
    [624,2137],
    [636,2248],
    [571,2153],
    [667,2149]
  ],
  [['Ocllo'],
    [3622,2594], //First set of coordinates is for the sigil turn in point
    [3627,2579],
    [3611,2581],
    [3673,2473],
    [3632,2652]
  ],
  [['Jhelom'],
    [1331,3778], //First set of coordinates is for the sigil turn in point
    [1323,3675],
    [1441,3781],
    [1451,3715]
  ],
  [['Trinsic'],
    [1907,2685], //First set of coordinates is for the sigil turn in point
    [1826,2672],
    [1856,2674],
    [1907,2695],
    [1825,2738]
  ],
  [['Moonglow'],
    [4482,1173], //First set of coordinates is for the sigil turn in point
    [4484,1128],
    [4394,1109],
    [4408,1125],
    [4414,1129],
  ],
]

  //Orion.ClearJournal();
  while (sigilrun && !Player.Dead()) {
    currtown = CatchTown();
    //currtown = "Moonglow";
    ctindex = null;
    if (currtown != null){
      Orion.Wait(2000);
      RunicAtlasRecall(RuneBook,bookid,false);
      Orion.Wait(3000);
      Orion.UseSkill("Hiding");
      Orion.Wait(1000);
      GoToLoc(crystallocation[0],crystallocation[1]);
      Orion.Wait(100);
      if(GetDistance(crystallocation[0],crystallocation[1]) < 3){
        Orion.Say("fel " + currtown + " mint");
        sndStr = TimeString() + " " + server + ": Heading to the VVV town that just started: ***" + currtown + "***.";
        Shared.AddVar("currcity",currtown);
        SendDiscord(sndStr);
      }
      else{
        break;
      }
      if(Orion.ScriptRunning('KeepHidden') < 0){
        Orion.ResumeScript('KeepHidden');
        Orion.Wait(500);
      }
      else if(Orion.ScriptRunning('KeepHidden') == 0){
        Orion.Exec('KeepHidden');
        Orion.Wait(1000);
      }
      Orion.Wait(3000);
      VVVgump = Orion.GetLastGump();
      for (var i = 0; i < cities.length; ++i) {
  			if(cities[i][0] == currtown){
          ctindex = i;
          break;
        }
  		}
      if (ctindex == null){
        Orion.Print("Getting a null city index.");
        Orion.Wait(5000);
        break;
      }
      else{
        //Start finding and stealing the sigils
        incity = true;
        while(incity){
          VVVgump = Orion.GetLastGump();
          if(!Orion.BuffExists("Animal Form") && Orion.SkillValue("Ninjitsu") > 70){
            //Orion.SetTimer("Hiding",-12001);
            while(!Player.Dead() && !Orion.BuffExists("Animal Form")){
              Orion.Cast("Animal Form");
              if (Orion.WaitForGump(5000))
            	{
                Orion.Wait(3500);
                gump07 = null;
                for(var p = 0; p < Orion.GumpCount(); p++){
                  temp9 = Orion.GetGump(p);
                  if(temp9.ID() == '0x00002336'){
                    var gump07 = temp9;
                  }
                }
            		if ((gump07 !== null) && (!gump07.Replayed()) && (gump07.ID() === '0x00002336'))
            		{
            			gump07.Select(Orion.CreateGumpHook(100 + parseInt(ninjagump)));
            			Orion.Wait(1000);
            		}
              }
              Orion.Wait(2500);
            }
            Orion.Wait(3000);
          }
          for(var i = 2; i < cities[ctindex].length;i++){
            GoToLoc(cities[ctindex][i][0],cities[ctindex][i][1]);
            if(Orion.InJournal("keen senses detect something")){
              Orion.ClearJournal();
              Orion.UseSkill("Detecting Hidden");
              Orion.WaitForTarget(5000);
              Orion.TargetTile('any',cities[ctindex][i][0],cities[ctindex][i][1],Player.Z());
              Orion.Wait(12000);
              sigilser = Orion.FindTypeEx(SigID, 'any', 'ground', '', '20');
              //Orion.Print(sigilser.length);
              if (sigilser.length > 0){
                GoToLoc(sigilser[0].X(),sigilser[0].Y());
                if(Orion.BuffExists("Animal Form")){
                  Orion.Cast("Animal Form");
                  Orion.Wait(2000);
                }
                while (!Orion.InJournal("successfully steal") && sigilser.length > 0){
                  Orion.UseSkill("Stealing");
                  Orion.WaitTargetObject(sigilser[0].Serial());
                  Orion.Wait(12000);
                  CheckHidden();
                  sigilser = Orion.FindTypeEx(SigID, 'any', 'ground', '', '20');
                }
              }
            }
            sigilser = Orion.FindTypeEx(SigID, 'any', 'backpack', '', '35');
            //Orion.Print(sigilser.length)
            while (sigilser.length > 0){
              while(!Player.Dead() && !Orion.BuffExists("Animal Form")){
                Orion.Cast("Animal Form");
                if (Orion.WaitForGump(5000))
              	{
                  Orion.Wait(3500);
                  gump07 = null;
                  for(var p = 0; p < Orion.GumpCount(); p++){
                    temp9 = Orion.GetGump(p);
                    if(temp9.ID() == '0x00002336'){
                      var gump07 = temp9;
                    }
                  }
              		if ((gump07 !== null) && (!gump07.Replayed()) && (gump07.ID() === '0x00002336'))
              		{
              			gump07.Select(Orion.CreateGumpHook(100 + parseInt(ninjagump)));
              			Orion.Wait(1000);
              		}
                }
                Orion.Wait(1500);
              }
             GoToLoc(cities[ctindex][1][0],cities[ctindex][1][1]);
             dropguy = null;
             dropguy = Orion.FindTypeEx(-1, -1, 'ground', 'mobile', '20',"yellow||blue");
             if (dropguy.length > 0){
               for(var p = 0; p < dropguy.length;p++){
                 //Orion.OpenPaperdoll(dropguy[p].Serial());
                 //Orion.Wait(1000);
                 //Orion.ClosePaperdoll(dropguy[p].Serial());
            	   //guyname = dropguy[p].Title();
                 guyname = dropguy[p].Properties();
            	   guyname = guyname.split(" ");
            	   //Orion.Print(guyname[2]);
                	if(guyname[5] == "Virtue"){
                   GoToLoc(dropguy[p].X(),dropguy[p].Y());
                   Orion.DragItem(sigilser[0].Serial());
                   Orion.Wait(100);
                   Orion.DropDraggedItem(dropguy[p].Serial());
                   break;
                    }
                  }
                }
                Orion.Wait(1000);
                sigilser = Orion.FindTypeEx(SigID, 'any', 'backpack', '', '20');
              }
            var killit = false;
            if(VVVgump.ID() != "0x000F3ECC"){
              VVVgump = null;
              Orion.Print("first of vvv gump search.")
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
                killit = true;
              }
            }
            else{
              killit = true;
              Orion.Print("No VVV Gump found.");
            }
            Orion.Wait(1000);
            if(killit){
              Orion.Wait(2000);
              gumpsilver = null;
              GoToLoc(cities[ctindex][1][0],cities[ctindex][1][1]);
              dropguy = null;
              dropguy = Orion.FindTypeEx(-1, -1, 'ground', 'ignoreself|mobile', '20',"yellow");
              if (dropguy.length > 0){
                for(var p = 0; p < dropguy.length;p++){
                 guyname = dropguy[p].Properties();
                 Orion.Wait(100);
             	   guyname = guyname.split(" ");
             	   //Orion.Print(guyname[2]);
                 	if(guyname[3] == "Silver"){
                    GoToLoc(dropguy[p].X(),dropguy[p].Y());
                    Orion.OpenPaperdoll(dropguy[p].Serial());
                    dropguy = dropguy[p];
                    Orion.Wait(500);
                    for(var q = 0; q < Orion.GumpCount(); q++){
                       temp9 = Orion.GetGump(q);
                       if(temp9.ID() == '0x00004268'){
                         var gumpsilvergump = temp9;
                         gumpsilver = gumpsilvergump.TextList()[0];
                         break;
                       }
                       Orion.Wait(50);
                     }
                    break;
                   }
                   Orion.Wait(100);
                  }
                 }
                if(gumpsilver == 10000){
                  //sigilrun = false;
                  //SendDiscord("***" + Player.Name() + " maxed out his silver***, buying a pardon. :100::100:");
                  SendDiscord("***" + Player.Name() + " maxed out his silver, try manually buying goods.***");
                  /*Orion.Wait(4000);
                  gumpsilvergump.Select(Orion.CreateGumpHook(118));
                  Orion.Wait(4000);
                  if (Orion.WaitForGump(3000))
                	{
                		var gump1 = Orion.GetGump('last');
                    //Pardon = '0x00004269'
                		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00004270'))
                		{
                			gump1.Select(Orion.CreateGumpHook(7));
                			Orion.Wait(100);
                		}
                	}*/
                  Orion.Wait(500);
                  pardons = Orion.FindTypeEx('0x46B2', -1, 'backpack');
                  thepardon = null;
                  if (pardons.length >0){
                    for(var i = 0;i<pardons.length;i++){
                      if(pardons[i].Properties().indexOf("Insured") == -1){
                        thepardon = pardons[i];
                        break;
                      }
                    }
                    if(thepardon){
                      Orion.RequestContextMenu(Player.Serial());
                    	Orion.WaitContextMenuID(Player.Serial(), 418);
                    	if (Orion.WaitForTarget(1000)){
                        Orion.TargetObject(thepardon.Serial());
                      }
                    }
                    pardonnum = Orion.Count('0x46B2', -1);
                    if(pardonnum > 1){
                      SendDiscord(Player.Name() + " has ***"+ pardonnum + " pardons*** in his pack. :scream::scream:");
                    }
                  }
                  else{
                    SendDiscord("***" + Player.Name() + "*** had problems buying a pardon. :sob::sob:");
                    sigilrun = false;
                  }
                }
                else if(gumpsilver > 0){
                  SendDiscord("***" + Player.Name() + "*** has ***" + gumpsilver + "*** silver saved up! :moneybag::moneybag:");
                }


              incity = false;
              currtown = null;
              if(Orion.BuffExists("Animal Form")){
                Orion.Cast("Animal Form");
                Orion.Wait(2000);
              }
              Orion.Wait(5000);
              if(!Player.Dead()){
                RunicAtlasRecall(RuneBook,waitrune,false);
                CheckHidden();
              }
              break;
            }
          }
        }
      }
    }
    else{
      Orion.Wait(5000);
    }
  }
  if(Player.Dead()){
    sndStr = TimeString() + " " + server + ": ***" + Player.Name() + " is dead as hell***.";
    SendDiscord(sndStr);
  }
}

function OJWatch(){
  var checkfreq = 10 //Check frequency in seconds.
  var reportfreq = 10 //Once reported how often will it spam the chat room, in minutes;
  var server = "Atlantic";

  var concatlist='';
  var enemy = '';

  if(Player.Name() == "Sneak Sneak"){
    server = "Legends"
  }
  if(Player.Name() == "Sneak Sneaky"){
    server = "Catskills"
  }
  while(true){
    enemy = Orion.FindTypeEx('any', '-1', 'ground', 'human|ignoreself', '30', 'orange');
    if(enemy.length > 0 && concatlist.length > 0){
      concatlist = concatlist.concat(enemy);
    }
    else if(enemy.length > 0 && concatlist.length == 0){
      concatlist = enemy;
    }
    if(concatlist.length > 0 && Orion.Timer("OJreport") >= -1){
      ojlist = "";
      for(var i = 0;i< concatlist.length;i++){
        if(concatlist[i].Name() != "" && ojlist.indexOf(concatlist[i].Name()) == -1){
          ojlist += concatlist[i].Name();
          if(parseInt(i) != parseInt(concatlist.length -1) && parseInt(i) != parseInt(concatlist.length -2)){
            ojlist += ", "
          }
          else if(parseInt(i) == concatlist.length -2){
            ojlist += " and "
          }
        }
      }
      concatlist = '';
      enemy = '';
      if(ojlist != ''  && !Player.Dead()){
        sndStr = TimeString() + " " + server + ": ***OJ ALERT in " + Shared.GetVar("currcity") + ":*** I saw " + ojlist + ". @everyone";
        SendDiscord(sndStr);
        Orion.SetTimer("OJreport", (-60000*parseInt(reportfreq)));
      }
    }
    Orion.Wait(200);
    Orion.Wait(checkfreq*1000);
  }

}

function KeepHidden(){
  revealtimervar = 5 //How long between being revealed to close the client, in minutes;

  var pet, ebp;
  while(true){
    //Orion.Print(Orion.Timer("Hiding"));
    pet = null;
    ebp = null;
    alwaysrun = null;
    if(Orion.Timer("revealtimer") > 0){
      Shared.AddVar("gotrevealed","false");
    }
    if(Orion.InJournal("revealed")){
      var enemy = Orion.FindTypeEx('any', '-1', 'ground', 'human|ignoreself', '30', 'orange');
      if(enemy.length > 0){
        SendDiscord("I was revealed and saw ***" + enemy[0].Name() + "*** and " + (enemy.length-1) + " other people, if I get revealed again within " + revealtimervar + " minutes, I will close the client.");
        Orion.SetTimer("revealtimer",-60000*revealtimervar);
        if(Shared.GetVar("gotrevealed") == "true"){
          Shared.AddVar("gotrevealed","false");
          SendDiscord("I was revealed ***again*** and saw ***" + enemy[0].Name() + "*** and " + (enemy.length-1) + " other people, closing client.");
          Orion.CloseUO();
        }
        Shared.AddVar("gotrevealed","true");
        //closenext = true;
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
          if(!Player.Hidden()){
            //Orion.ClientOptionSet('AlwaysRun', true);
            alwaysrun = true;
            Orion.Wait(250);
          }
          else{
            alwaysrun = false;
            //Orion.ClientOptionSet('AlwaysRun', false);
          }
          Orion.Dress("main");

        }
      }
      else if((Orion.Timer("Hiding") > 0 || Orion.Timer("Hiding") == "-1") && Orion.FindTypeEx("0x2809", 'any', 'backpack').length == 0){
        /*if(alwaysrun){
          Orion.ClientOptionSet('AlwaysRun', false);
          Orion.Wait(500);
          repeat = true;
          alwaysrun = false;
          Orion.StopWalking();
          Orion.Wait(1000);
        }*/
        Orion.UseSkill("Hiding");
        if(Orion.InJournal("can't seem") || Orion.InJournal("have hidden"))
        {
          Orion.SetTimer("Hiding",-12001);
          Orion.Wait(1000);
          Orion.ClearJournal();
        }
        /*if(!Player.Hidden()){
          Orion.ClientOptionSet('AlwaysRun', true);
          alwaysrun = true;
          Orion.Wait(250);
        }
        else{
          Orion.ClientOptionSet('AlwaysRun', false);
          alwaysrun = false;
        }*/
      }
    }
    else{
      //Orion.ClientOptionSet('AlwaysRun', false);
      Orion.Wait(10);
    }
    Orion.Wait(500);

  }
}

function SendDiscord(themessage){
  //Send message to:
  // Discord
  var bot = 'https://discord.com/api/webhooks/1193180513507213442/aDrarURBwRkaUbRt_73vc5VCBCTgTZF7ywxi93w38G5jJmOVCvzVA42hAxzfEoTAf5d1'; // Webhook url
  var paramText = "username=" + "Silver Farmer" + "&content=";
  Orion.HttpPost(bot, paramText + themessage);
  //Orion.Print(themessage);

}

function GoToLocLong(X,Y){
  var temp;
  temp = Orion.WalkTo(X,Y,Player.Z(),0,255,0,1,30000000);
  //if(Player.X() == X && Player.Y.() == Y)
  return temp;
}


function GetDistance(X,Y){
  var dist = null;

  dist = Math.sqrt((Math.pow(X - Player.X(),2))+(Math.pow(Y - Player.Y(),2)))
  //Orion.Print(dist);
  return dist;
}



function FindClosestSpawn(spawns){
  var closei=[0,null];
  for(i = 0; i < spawns.length;i++){
    //Orion.Print("Spawns length:"+spawns.length)
    //Orion.Print("Close Index:" + closei[0] + " Close Dist:" + closei[1]);
    if(spawns[i][0] == "Spawn" || spawns[i][0] == "Tele"){
      tempdist = GetDistance(spawns[i][2][0],spawns[i][2][1]);
      if (closei[1] == null){
        closei[0]=i;
        closei[1]=tempdist;
      }
      else{
        if(tempdist < closei[1]){
          closei[0]=i;
          closei[1]=tempdist;
        }
      }
    }
  }
  return closei;
}

function RestockCam(runebook,runebookindex,usescrolls){
  //For now, two items in bank eggs first, petals second.
  var eggrestock = 25;
  var petalrestock = 7;
  var mingold = 300000;
  eggID = "0x2809";
  petalID = "0x1021";
  eggs = Orion.FindTypeEx("0x2809", 'any', 'backpack', '');
  if(eggs.length > 0){
    eggs = eggs[0].Count();
  }
  else{
    eggs = 0;
  }
  petals = Orion.FindTypeEx("0x1021", 'any', 'backpack', '');
  if(petals.length > 0){
    petals = petals[0].Count();
  }
  else{
    petals = 0;
  }
  if(eggs < eggrestock || petals < petalrestock){
    RunicAtlasRecall(runebook,runebookindex,usescrolls);
    Orion.Wait(2000);
    if(!Orion.InJournal("cannot teleport")){
      Orion.Wait(2000);

      Orion.Say("vendor buy bank guards");
      Orion.Wait(2000);
      for(var p = 0; p < Orion.GumpCount(); p++){
        temp9 = Orion.GetGump(p);
        if(temp9.ID() == '0x000F3EEB'){
          var gumpbank = temp9;
        }
        else if(temp9.ID() == '0x000F3ED3'){
          var bankmoney = temp9;
        }
      }
      var balance = "";
      bankmoney = bankmoney.TextList();
      bankmoney = bankmoney[0];
      bankmoney = bankmoney.split(",");
      for(p = 0;p < bankmoney.length;p++)
      {
        balance += bankmoney[p];
      }
      balance = parseInt(balance);
      if(balance < mingold){
        SendDiscord("```" + Player.Name() + " is running low on gold (Currently:" + balance + ").```");
      }

      var bankbuttons,tempsplit;
      //Orion.Print(eggs[0].Count() + " " + petals[0].Count());

    		//var gumpbank = Orion.GetGump('last');
    			bankbuttons = gumpbank.ButtonList();
          var serial, theid;
          for(var i = 0; i < 2; i++){
            tempsplit = bankbuttons[i].split(" ");
            serial = tempsplit[9];
            theid = tempsplit[10];
            if((eggs < eggrestock) && (theid == "10249")) {
              if (Orion.WaitForGump(5000))
            	{
                if ((gumpbank !== null) && (!gumpbank.Replayed()) && (gumpbank.ID() === '0x000F3EEB'))
            		{
                gumpbank.Select(Orion.CreateGumpHook(serial)); //Grab eggs
          			Orion.Wait(1000);
                }
              }
              Orion.SendPrompt(eggrestock-parseInt(eggs));  
              Orion.Wait(5000);
              if(Orion.InJournal("must be less")){
                SendDiscord("```" + Player.Name() + " is out of eggs in his bank.```");
                Orion.ClearJournal();
              }
            }
            else if(petals < petalrestock && theid == "4129"){
              var gumpbank2 = Orion.GetGump('last');
              if (Orion.WaitForGump(5000))
            	{
                if ((gumpbank2 !== null) && (!gumpbank2.Replayed()) && (gumpbank2.ID() === '0x000F3EEB'))
            		{
                gumpbank2.Select(Orion.CreateGumpHook(serial)); //Grab petals
          			Orion.Wait(1000);
                }
              }
              Orion.SendPrompt(petalrestock - parseInt(petals));
              Orion.Wait(2000);
              if(Orion.InJournal("must be less")){
                SendDiscord("```"+ Player.Name() + " is out of petals in his bank.```");
                Orion.ClearJournal();
              }
            }
          }
        }

      }
}


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
