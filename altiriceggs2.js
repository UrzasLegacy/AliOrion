const menu = Orion.CreateCustomGump(10000);

function Autostart(){
    var bookCnt = 1, eggBook, eggBooks = [], scanBooks;
    mainDisplay();
    
    if(!Orion.RegRead('travelBook')){
        settingsPanel();
        while(!Orion.RegRead('travelBook'))
            Orion.Wait(1000);
    }
    
    scanBooks = Orion.FindTypeEx(0x22C5, any, backpack).filter(function(book){
        return book.Properties().replace(' ','').match(/eggbook/i);
    });
    
    if(!scanBooks[0]){
        do {
            Orion.Print(color.yellow.norm, "Add Egg Runebook #" +bookCnt);
            Orion.WaitForAddObject('eggBook');
            if(Orion.FindObject('eggBook'))
                eggBooks.push(Orion.FindObject('eggBook').Serial());
            bookCnt++;
        } while(Orion.FindObject('eggBook'));
        Orion.RemoveObject('eggBook');
    } else {
        Orion.Print(color.yellow.norm, "Scanning egg books");
        scanBooks.forEach(function(book){ eggBooks.push(book.Serial()) });
    }
    
    if(isTrue(Orion.RegRead('useGrabBag'))){
        if(!Orion.FindObject('grabBag')){
            Orion.Print(color.yellow.norm, "Select your grab bag");
            Orion.WaitForAddObject('grabBag');
        }
    }
    
    while(Orion.Connected()){
        if(Player.Dead()){
            setStatus("Dead");
            Orion.PauseScript('Autostart');
        }
        for(j in eggBooks){
            eggBook = eggBooks[j];
            Orion.UseObject(eggBook);
            if(Orion.WaitForGump(3000)){
                var bookInfo = Orion.GetLastGump();
                bookInfo.Close();
            }
            Orion.Wait('useitemdelay');
            var cnt = 2;
            while(!bookInfo.Text(cnt).match(/Empty/i) && cnt < 18){
                if(Player.Mana() < 25){
                    setStatus("Waiting for Mana");
                    while(Player.Mana() < 20)
                        Orion.Wait(1000);
                }
                var packItems = ((Orion.FindObject(backpack).Properties().match(/Contents:\s(\d*)/i) || [])[1] || 0);
                if(packItems >= Number(Orion.RegRead('maxBackpackItems'))){
                    Orion.Wait('useitemdelay');
                    Orion.Print(color.yellow.norm, "Pack limit reached");
                    if(isTrue(Orion.RegRead('pauseWhenFull'))){
                        travel(Orion.RegRead('travelBook'), Number(Orion.RegRead('travelRune')));
                        setStatus("Auto Paused");
                        Orion.PauseScript('Autostart');
                    }
                    if(Orion.RegRead('usePortal') && Orion.RegRead('usePortal') != 'false'){
                        travel(Orion.RegRead('travelBook'), Number(Orion.RegRead('travelRune')));
                        var portal = Orion.FindObject(Orion.RegRead('usePortal'));
                        if(!portal){
                            Orion.Print(color.yellow.norm, "No portal found, Paused");
                            Orion.PauseScript('Autostart');
                        } else {
                            Orion.WalkTo(portal.X(), portal.Y(), portal.Z(), 2, 255, 1, 1);
                            Orion.Wait(250);
                            Orion.Say("Dungeon Destard");
                            Orion.Wait(3000);
                        }
                    }
                    if(isTrue(Orion.RegRead('eggTurnin'))){
                        setStatus("Egg Turnin");
                        while(Orion.Count(eggTypes, any, backpack) >= 10)
                            eggTurnin();
                    }
                    if(isTrue(Orion.RegRead('ingotTurnin'))){
                        setStatus("Ingot Turnin");
                        ingotTurnin();
                    }
                }
                insure();
                setStatus('Book: ' +(Number(j)+1) +' Rune: ' +Number(cnt-1));
                Orion.Wait('useitemdelay');
                travel(eggBook, Number(cnt-1));
                customCodeOne();
                eggScan();
                customCodeTwo();
                Orion.Wait(Number(Orion.RegRead('recallDelay')));
                cnt++;
            }
        }
    }
}


function travel(book, rune){
    Orion.CancelWaitGump();
    var currentX = Player.X(), currentY = Player.Y();
    var travel = Orion.RegRead('travelMethod') == "Recall" ? 49 : 74;
    rune += travel;
    Orion.WaitGump(Orion.CreateGumpHook(rune));
    Orion.UseObject(book);
    Orion.SetTimer('travel');
    while((Player.X() == currentX && Player.Y() == currentY) && Orion.Timer('travel') < 5000)
        Orion.Wait(500);
    Orion.CheckLag(5000);
}

const color = {
	green 	: {light: '0x0046', norm: '0x0044', dark: '0x00A7'},
	blue	: {light: '0x0064', norm: '0x0062', dark: '0x00C5'},
	red		: {light: '0x0028', norm: '0x0026', dark: '0x0089'},
	orange	: {light: '0x002D', norm: '0x002B', dark: '0x008E'},
	purple	: {light: '0x001E', norm: '0x0017', dark: '0x007A'},
	yellow	: {light: '0x0037', norm: '0x0035', dark: '0x0098'},
	white	: {light: '0x7FA',  norm: '0x7EE',  dark: '0x7E2' }
};

function eggScan(){
    if(isTrue(Orion.RegRead('useGrabBag'))){
        if(!Orion.FindObject('grabBag')){
            Orion.Print(color.yellow.norm, "Select your grab bag");
            Orion.WaitForAddObject('grabBag');
        }
    }
    if(isTrue(Orion.RegRead('useGrabBag')))
        var grabBag = Orion.FindObject('grabBag').Serial();
    else
        var grabBag = backpack;
    
    Orion.UseIgnoreList('eggs');
    var eggs = Orion.FindTypeEx(eggTypes, any, ground, 'item|near', 24);
    Orion.SetTimer('break');
    while(eggs.length && Orion.Timer('break') < 8000){
        egg = eggs.shift();
        if(egg.Distance() > 1){
            Orion.WalkTo(egg.X(), egg.Y(), egg.Z(), 1, 255, 1, 1);
            Orion.Wait(250);
        }
        if(egg.Distance() <= 1){
            Orion.MoveItem(egg.Serial(), 0, grabBag);
            var cnt = Orion.RegRead('eggCnt');
            cnt++
            menu.AddText(75, 20, color.white.light, cnt, 50, 11002);
            Orion.RegWrite('eggCnt', cnt);
            Orion.Wait('moveitemdelay');
        }
        Orion.UseIgnoreList('eggs');
        eggs = Orion.FindTypeEx(eggTypes, any, ground, 'item|near', 24);
        Orion.Wait(250);
    }
}

function setStatus(txt){
    menu.AddText(7, 5, color.white.light, txt, 200, 60011);
    menu.Update();
}

function mainDisplay(_hidden){
    var width = 125, height = 40;
    menu.Clear();
    menu.SetCallback('process');
    menu.AddResizepic(0, 0, 0x251C, width, height, 15000);
    menu.AddButton(12001, (width-20), (height-5), 0x659, 0x65A, 0x659, 0x0000);
    menu.AddTooltip("Pause/Resume");
    menu.AddButton(12002, (width-15), 0, 0x82C, 0x82C, 0x82C, 0x0000);
    menu.AddTooltip("Ignore Egg");
    menu.AddText(7, 5, color.white.light, "Starting", 200, 11001);
    menu.AddText(7, 20, color.yellow.light, "Egg Count:", 200, 11001);
    menu.AddText(75, 20, color.white.light, Orion.RegRead('eggCnt'), 50, 11002);
    menu.Update();
}       

function process(_hidden){
    var button = CustomGumpResponse.ReturnCode();
    if(button == 0){
        return;
    } else if(button == 12001){
        if(Orion.ScriptRunning('Autostart') > 0){
            if(Orion.IsWalking())
                Orion.StopWalking();
            menu.AddResizepic(0, 0, 0x251C, 125, 65, 15000);
            menu.AddButton(12003, 5, 40, 0x7D6, 0x7D8, 0x7D7, 0x0000);
            menu.AddTooltip("Display Options Panel");
            menu.AddButton(12001, 105, 55, 0x659, 0x65A, 0x659, 0x0000);
            menu.AddTooltip("Resume");
            setStatus("Paused");
            Orion.PauseScript('Autostart');
        } else {
            mainDisplay();
            setStatus("Resuming");
            Orion.ResumeScript('Autostart');
        }
    } else if(button == 12002){
        setStatus("Select Egg to Ignore");
        Orion.WaitForAddObject('IgnoreEgg');
        var iEgg = Orion.FindObject('IgnoreEgg');
        Orion.RemoveObject('IgnoreEgg');
        Orion.AddIgnoreListObject('eggs', iEgg.Serial());
    } else if(button == 12003){
        settingsPanel();
    } else if(button == 21001){
        var toggle = isTrue(Orion.RegRead('eggTurnin')) ? false : true;
        Orion.RegWrite('eggTurnin', toggle);
        settingsPanel();
    } else if(button == 21002){
        var toggle = isTrue(Orion.RegRead('ingotTurnin')) ? false : true;
        Orion.RegWrite('ingotTurnin', toggle);
        settingsPanel();
    } else if(button == 21003){
        var toggle = isTrue(Orion.RegRead('insureEggs')) ? false : true;
        Orion.RegWrite('insureEggs', toggle);
        settingsPanel();
    } else if(button == 21004){
        var toggle = isTrue(Orion.RegRead('insureIngots')) ? false : true;
        Orion.RegWrite('insureIngots', toggle);
        settingsPanel();
    } else if(button == 21005){
        var toggle = isTrue(Orion.RegRead('useGrabBag')) ? false : true;
        Orion.RegWrite('useGrabBag', toggle);
        settingsPanel();
    } else if(button == 21006){
        var toggle = isTrue(Orion.RegRead('pauseWhenFull')) ? false : true;
        Orion.RegWrite('pauseWhenFull', toggle);
        settingsPanel();
    } else if(button == 21007){
        var toggle = Orion.RegRead('travelMethod') == 'Recall' ? "Sacred Journey" : "Recall";
        Orion.RegWrite('travelMethod', toggle);
        settingsPanel();
    } else if(button == 21012){
        Orion.Print(color.yellow.norm, "Select a Travel Rune Book");
        Orion.WaitForAddObject('travelBook');
        var book = Orion.FindObject('travelBook');
        Orion.RegWrite('travelBook', book.Serial());
        Orion.RemoveObject('travelBook');
        settingsPanel();
    } else if(button == 21014){
        if(Orion.RegRead('usePortal') && Orion.RegRead('usePortal') != 'false'){
            Orion.RegWrite('usePortal', false);
        } else {
            Orion.Print(color.yellow.norm, "Select a Corrupted Crystal Portal");
            Orion.WaitForAddObject('portal');
            var obj = Orion.FindObject('portal');
            Orion.RegWrite('usePortal', obj.Serial());
            Orion.RemoveObject('portal');
        }
        settingsPanel();
    } else if(button == 22000){
        settings.Close();
    } else if(button == 22001){
        Orion.RegWrite('maxBackpackItems', CustomGumpResponse.Slider(26000));
        Orion.RegWrite('loadScreenDelay', CustomGumpResponse.Slider(26001));
        Orion.RegWrite('recallDelay', CustomGumpResponse.Slider(26002));
        Orion.RegWrite('travelRune', CustomGumpResponse.Slider(26003));
        settings.Close();
    } else if(button == 22002){
        Orion.RegWrite('maxBackpackItems', false);
        Orion.RegWrite('turninEggs', false);
        Orion.RegWrite('turninIngots', false);
        Orion.RegWrite('insureEggs', false);
        Orion.RegWrite('insureIngots', false);
        Orion.RegWrite('useGrabBag', false);
        Orion.RegWrite('pauseWhenFull', false);
        Orion.RegWrite('travelMethod', false);
        Orion.RegWrite('loadScreenDelay', false);
        Orion.RegWrite('recallDelay', false);
        Orion.RegWrite('travelRune', false);
        settingsPanel();
    }
}

function isTrue(value){
    return value.toLowerCase() === 'true';
    return false;
}


var settings = Orion.CreateCustomGump(20000);
function settingsPanel(){
    var width = 300, height = 240, y = 10;
    settings.Clear();
    settings.SetCallback('process');
    settings.SetNoClose(true);
    settings.AddResizepic(0, 0, 0x251C, width, height);
    
    settings.AddText(5, y, color.orange.light, "Max Backpack Items", 200, 21000);
    settings.AddSlider(26000, 135, (y+5), '0x00D8', '0x00D8', '0x00D8', '0x00D5', 1, 0, 90, 1, 125, Orion.RegRead('maxBackpackItems') > 0 ? Orion.RegRead('maxBackpackItems') : 124);
	settings.SetTextParameters(1, 'Right', 0, 0, 0, 'Left');
	settings.AddTooltip("Script will stop egg hunting at this item count");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('eggTurnin')) ? color.green.light : color.red.light, "Turn in Eggs", 200, 21001);
    settings.AddButton(21001, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Egg Turnin, Egg turn in will not work if eggs are bagged");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('ingotTurnin')) ? color.green.light : color.red.light, "Turn in Ingots", 200, 21002);
    settings.AddButton(21002, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Ingot Turnin");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('insureEggs')) ? color.green.light : color.red.light, "Insure Eggs", 200, 21003);
    settings.AddButton(21003, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Egg Insurance");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('insureIngots')) ? color.green.light : color.red.light, "Insure Ingots", 200, 21004);
    settings.AddButton(21004, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Ingot Insurnce");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('useGrabBag')) ? color.green.light : color.red.light, "Use Grab Bag", 200, 21005);
    settings.AddButton(21005, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Grab Bag, Egg turn in will not work if eggs are bagged.");
    
    settings.AddText(25, (y+=15), isTrue(Orion.RegRead('pauseWhenFull')) ? color.green.light : color.red.light, "Pause When Full", 200, 21006);
    settings.AddButton(21006, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle Pause When Full");
    
    settings.AddText(25, (y+=15), color.white.light, Orion.RegRead('travelMethod') == 'Recall' ? "Recall" : "Sacred Journey", 200, 21007);
    settings.AddButton(21007, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toogle Travel Method");
    
    settings.AddText(25, (y+=15), Orion.RegRead('travelBook') ? color.green.light : color.red.light, "Travel Rune Book", 200, 21011);
    settings.AddButton(21012, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Set Travel Rune Book");
    
    settings.AddText(25, (y+=15), Orion.RegRead('usePortal') != 'false' ? color.green.light : color.red.light, "Use Corrupted Portal", 200, 21013);
    settings.AddButton(21014, 5, (y+3), 0x4B9, 0x4BA, 0x4B9, 0x0000);
    settings.AddTooltip("Toggle/Set Use Corrupted Crystal");
    
    settings.AddText(5, (y+=15), color.orange.light, "Max Load Screen Delay", 200, 21008);
    settings.AddSlider(26001, 155, (y+5), '0x00D8', '0x00D8', '0x00D8', '0x00D5', 1, 0, 90, 1, 15, Number(Orion.RegRead('loadScreenDelay')) > 0 ? Number(Orion.RegRead('loadScreenDelay')) : 5);
	settings.SetTextParameters(1, 'Right', 0, 0, 0, 'Left');
	settings.AddTooltip("Will run egg scan at new loction after lag check with max delay of this many seconds.");
    
    settings.AddText(5, (y+=15), color.orange.light, "Delay Before next Recall", 200, 21009);
    settings.AddSlider(26002, 155, (y+5), '0x00D8', '0x00D8', '0x00D8', '0x00D5', 1, 0, 90, 0, 15, Number(Orion.RegRead('recallDelay')) > 0 ? Number(Orion.RegRead('recallDelay')) : 1);
	settings.SetTextParameters(1, 'Right', 0, 0, 0, 'Left');
	settings.AddTooltip("Script will wait this many seconds after an egg scan before going to next rune.");
    
    settings.AddText(5, (y+=15), color.orange.light, "Rune in Travel Book", 200, 21010);
    settings.AddSlider(26003, 155, (y+5), '0x00D8', '0x00D8', '0x00D8', '0x00D5', 1, 0, 90, 1, 16, Number(Orion.RegRead('travelRune')) > 0 ? Number(Orion.RegRead('travelRune')) : 1);
	settings.SetTextParameters(1, 'Right', 0, 0, 0, 'Left');
	settings.AddTooltip("Rune in Travel Book to go to once Max Backpack Items is reached");
    
    settings.AddButton(22000, 60, (y+=20), 0x847, 0x849, 0x848, 0x0000);
    settings.AddTooltip("Return to previous screen");
    settings.AddButton(22001, 120, y, 0x84A, 0x84C, 0x84B, 0x0000);
    settings.AddTooltip("Apply settings");
    settings.AddButton(22002, 180, y, 0x84D, 0x84F, 0x84E, 0x0000);
    settings.AddTooltip("Reset all settings");
    settings.Update();
}
