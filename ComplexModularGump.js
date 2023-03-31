//--Gump Section

function PVPGump()
    {
    var gumpnum = 125;
    var gumpvars = PVPloadvars();
    var gump = Orion.CreateCustomGump(gumpnum);
    var positions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
    var ogpositions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
    //gump.SetNoClose(true);
    gump.Clear();
    // Set callback function
    gump.SetCallback('PVPresponse');
    // Gump position
    gump.SetX(gumpvars[0][3]);
    gump.SetY(gumpvars[1][3]);
    // Main background
    //Grey = 13BE
    var bground = 'a3c';
    gump.AddResizepic(0, 0, bground, 710, 430);
    //General Gump Setup
    gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
    //Save & Close Button
    gump.AddButton(0, 315, 400, '0x00F9', '0x00F8', '0x00F7', '0');
    //Start AutoPVM Button
    gump.AddButton(7, 90, 400, '0x7E8', '0x7E9', '0x7EA',"0");
    gump.AddTooltip("This button will start the Auto-Samp script!");

    rowoff = 30;
    coloff = 11;
    for(var i = 0; i < gumpvars.length;i++)
        {
        //Orion.Print(i + " / " + gumpvars[i][0]  + " / "  + gumpvars[i][3])
        if(gumpvars[i][1] == 'cbox')
            {
            //gump.AddCheckbox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x00938', '0x093A', '0x0939', gumpvars[i][3], '0', gumpvars[i][0]);
            gump.AddCheckbox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x016C9', '0x016CC', '0x016C5', gumpvars[i][3], '0', gumpvars[i][0],'0x00801');
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
            }
        else if(gumpvars[i][1] == 'title')
            {
            gump.AddText(positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,gumpvars[i][3],gumpvars[i][0]);
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
            }
        else if(gumpvars[i][1] == 'combo')
            {
            droplength = (gumpvars[i].length - 4)/2
            gump.AddComboBox(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff, '0x0BB8', 0, '0x0BB8', 125, -3,droplength);
            var seldef = 0;
            for(var j=4;j<gumpvars[i].length;j++)
                {
                //Orion.Print(j+ " / " + gumpvars[i][j]);
                if(gumpvars[i][3]*2 == (j-4))
                    seldef = 1;
                else
                    seldef = 0;
                gump.AddComboBoxText(gumpvars[i][j],0,seldef);
                j++;
                }
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + 210;
            }
        else if(gumpvars[i][1] == 'txtbox')
            {
            //3 = value, 4 = box width,
            gump.AddResizepic(positions[gumpvars[i][2]]-5,gumpvars[i][2]*rowoff, '0x0BB8', gumpvars[i][4], 20);
            gump.AddTextEntry(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff, '0x0035', gumpvars[i][3], gumpvars[i][4], 20);
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]]  + 5;
            }
        else if(gumpvars[i][1] == 'plusminus')
            {
            //3 = value, 4 =
            gump.AddResizepic(positions[gumpvars[i][2]]-5,gumpvars[i][2]*rowoff, '0x0BB8', 70, 20);
            gump.AddMinMaxButtons(i+10, positions[gumpvars[i][2]]+20,gumpvars[i][2]*rowoff+1, '0x0037', 0, 1, 100, gumpvars[i][3]);
            gump.SetTextParameters(1, 'LeftCenter');
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]]  + 75;
            }
        else if(gumpvars[i][1] == 'radio')
            {
            gump.AddRadio(i+10, positions[gumpvars[i][2]],gumpvars[i][2]*rowoff,  '0x016C9', '0x016CC', '0x016C5', gumpvars[i][3], '0', gumpvars[i][0],'0x00801');
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][0].length*coloff;
            }
        else if(gumpvars[i][1] == 'tooltip')
            {
            gump.AddTooltip(gumpvars[i][3]);
            }
        else if(gumpvars[i][1] == 'page')
            {
            gump.AddPage(gumpvars[i][2]);
            gump.AddResizepic(0, 0, bground, 710, 430);
            gump.AddText(285, 5,"0x002F", "Neo's PVP Script Pack");
            gump.AddButton(0, 315, 400, '0x0EF', '0x0F0', '0x0F0',0,0,0);
            //Default reset button (only on page 2)
            if(gumpvars[i][2] == 1)
                {

                }
            else if(gumpvars[i][2] == 2)
                {
                gump.AddButton(5, 30, 400, '0x0F6', '0x0F4', '0x0F5',0,1);
                gump.AddTooltip("This action resets all the settings \n to their default settings.")
                }
            //Page 3 Only buttons (start auto-pvm)
            else if(gumpvars[i][2] == 3)
                {
                //gump.AddButton(6, 500, 400, '0x1398', '0x1398', '0x1398',0,1); Plot Course Button
                gump.AddButton(6, 500, 400, '0x7E8', '0x7E9', '0x7EA',0,1);
                gump.AddTooltip("Once clicked, you have 10 seconds to get to\n where you want to anchor.")
                gump.AddButton(8, 140, 388, '0x84D', '0x84E', '0x84F',0,1);
                gump.AddTooltip("Reset the leader of the group.\nIf you are solo, select yourself.")
                }
            positions = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];
            }
        else if(gumpvars[i][1] == 'button')
            {
            //0x7d6, hover d7
            //0=name,1=type,2=x,3=y,4=graphic,5=hover,6=page,7=buttonID
            gump.AddButton(gumpvars[i][7], gumpvars[i][2], gumpvars[i][3], gumpvars[i][4], gumpvars[i][5],gumpvars[i][5],0,0,gumpvars[i][6]);
            }
        //Before next iteration make any Y adjustments to the current row.
        if(gumpvars[i][1] != 'combo' && gumpvars[i].length >4)
            {
            positions[gumpvars[i][2]] = positions[gumpvars[i][2]] + gumpvars[i][4];
            }
        }
    gump.Update();
    if(Orion.GetGlobal('pvpgumpfirst') != "true")
        {
        gump.Close();
        WriteVars(gumpvars);
        Orion.SetGlobal('pvpgumpfirst',"true");
        }
    GumpLaunchButton();
    }
  
function PVPGumpRestoreDefault()
    {
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
    ["Auto Box", 'cbox',2,1],
    ["Auto Seed", 'cbox',2,1],
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

function PVPloadvars()
    {
    var allthem = defaultvars;
    prefix = Player.Serial();
    //TextWindow.Clear();
    //TextWindow.Open();
    if(Orion.RegRead(prefix + "/Stored") == "true")
        {
        for(i = 0;i < allthem.length; i++)
            {
            if(allthem[i][1] != "title")
                {
                //TextWindow.Print(prefix + "/" + i + "|| " + Orion.RegRead(prefix + "/" + i));
                allthem[i][3] = Orion.RegRead(prefix + "/" + allthem[i][0]);
                }
            }
        }
    return allthem;
    }
  
function WriteVars(thevars)
    {
    prefix = Player.Serial();
    //TextWindow.Clear();
    //TextWindow.Open();
    Orion.RegWrite(prefix +"/Stored", "true");
    //Saving Gump position
    for(var i=0;i<thevars.length;i++)
        {
        if(thevars[i][1] != "title")
            {
            Orion.RegWrite(prefix + "/" + thevars[i][0], thevars[i][3]);
            if(thevars[i][1] == "combo")
                {
                Orion.RegWrite(prefix + "/" + thevars[i][0] + "/actualval", thevars[i][thevars[i][3]*2+5]);
                //Orion.Print(prefix + "/" + thevars[i][0] + "/actualval" + " || " + thevars[i][thevars[i][3]*2+5])
                }
            else if(thevars[i][1] == "plusminus")
                {
                Orion.RegWrite(prefix + "/" + thevars[i][0] + "/actualval", thevars[i][3]);
                }
            //TextWindow.Print(prefix + "/" + thevars[i][0] + " | " + thevars[i][3]);
            }
        }
    var gpos = Orion.GetGumpPosition('custom', 125);
    if(gpos.X() != -1)
        {
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
    if(Orion.RegRead(prefix+"/Auto Bar Pulling") == 0)
        {
        Orion.SetGlobal("BarClear",'true');
        Orion.SetGlobal("doPullbars",Orion.RegRead(prefix+"/Auto Bar Pulling"));
        }
    else
        {
        Orion.SetGlobal("doPullbars",Orion.RegRead(prefix+"/Auto Bar Pulling"));
        if(!Orion.ScriptRunning('AutoBarPopulate'))
            Orion.Exec("AutoBarPopulate",true);
        }
    if(Orion.GetGlobal("doRearm") == 1 && !Orion.ScriptRunning('AutoRearm'))
        Orion.Exec("AutoRearm",true);
    if(Orion.GetGlobal("doAbility") == 1 && !Orion.ScriptRunning('AutoAbility'))
        Orion.Exec("AutoAbility",true);
    if(Orion.GetGlobal("doCatch") == 1 && !Orion.ScriptRunning('CatchSerial'))
        Orion.Exec("CatchSerial",true);
    if(Orion.GetGlobal("doSamp") == 1 && !Orion.ScriptRunning('SampAbility'))
        Orion.Exec("SampAbility",true);
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
    if(Orion.GetGlobal("doEventInsure") == 1 && !Orion.ScriptRunning('InsureEventItem'))
        Orion.Exec("InsureEventItem",true);
    if((Orion.GetGlobal("doGMclose") == 1 || Orion.GetGlobal("doGMnotify") == 1) && !Orion.ScriptRunning('AntiGM'))
        Orion.Exec("AntiGM",true);
    }
  
function PVPresponse(unused)
    {
    var gumpnum = 125;
    var launchgump = 150;
    var code = CustomGumpResponse.ReturnCode();
    //Orion.Print('Custom gump response code = ' + code);
    if (code == 0)
        {
        for(i=0;i<defaultvars.length;i++)
            {
            if(defaultvars[i][1] == 'cbox')
                defaultvars[i][3] = CustomGumpResponse.CheckBox(i+10) ? 1 : 0;
            else if(defaultvars[i][1] == 'radio')
                defaultvars[i][3] = CustomGumpResponse.Radio(i+10) ? 1 : 0;
            else if(defaultvars[i][1] == 'txtbox')
                defaultvars[i][3] = CustomGumpResponse.Text(i+10);
            else if(defaultvars[i][1] == 'combo')
                defaultvars[i][3] = CustomGumpResponse.ComboBox(i+10);
            else if(defaultvars[i][1] == 'plusminus')
                defaultvars[i][3] = CustomGumpResponse.MinMaxButton(i+10);
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
        if(Orion.ScriptRunning("AttackLoop"))
            {
            Orion.Terminate("AttackLoop|KeepAlive|stealthAlive");
            var gump = Orion.CreateCustomGump(151);
            gump.Close();
            }
        else
            {
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