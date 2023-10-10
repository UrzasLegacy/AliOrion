var Options = {
    DEBUG: true,
    PLAYER_FILENAME: Player.Name() +'.json'
};

var BUTTON = {
    COLOR:      0x7FA,
    SETUP:      200000,
    OPTIONS:    200001,
    ANALYTICS:  200002,
    MINING:     200003,
    SETSECURE:  200004,
    SETFIRE:    200005,
    SETPACK:    200006,
    SETBOOK:    200007,

    MINIMIZE:   3,
    RESTORE:    4,
    CLOSE:      5,
    MINMAX:     6
};

var BOX = {
    HEADER:     100000,
    MENU:       100001,
    MENUHEADER: 100002,
    OPTIONS:    100003,
    OPTIONSHEADER: 100004,
    STATS:      100005,
    STATUS:     100006
}

var LINE = {
    MENUHEADER: 300000,
    OPTIONSHEADER: 300001,
    STATUS:     300002
}

const LABEL = '0x7FA';
const VALUE = '0x7EE';

const gumpwidth = 500, gumpheight = 500, buttonXPosition = 0;

const items = {
    shovel  : '0x0F3A|0x0F39',
    prospect: '0x0FB4', // Prospectors tool
    tools   : '0x1EB9',
    ingots  : '0x1BF2',
    stone   : '0x1779',
    sand    : '0x423A',
    gate    : '0x0DDB|0x0F6C',
    ores    : ['0x19B9', '0x19BA', '0x19B8', '0x19B7'],
    jewels  : ['0x0F18', '0x0F15', '0x0F0F', '0x0F16', '0x0F10', '0x0F11', '0x0F25', '0x0F26', '0x0F13'],
    gems    : ['0x3192', '0x3193', '0x3194', '0x3195', '0x3197', '0x3198'],
    niter   : ['0x1362', '0x1363', '0x1367', '0x1364', '0x1369'],
    saltpeper: '0x423A',
    brock   : ['0x0F26', '0x0F28', '0x0F2A', '0x0F2B'],
    runebook: '0x22C5',
    firebeetle: '0x00A9',
};

const Ores = {
    '0x0000' : {id: 100, color: 0x0966, html: "#CDCDCD", journal: Orion.GetCliLocString(1007072), name: Orion.GetCliLocString(1042853)}, //"Iron Ore"},
    '0x0973' : {id: 200, color: 0x0974, html: "#", journal: Orion.GetCliLocString(1007073), name: Orion.GetCliLocString(1018332)}, //'Dull Copper'},
    '0x0966' : {id: 300, color: 0x0450, html: "#",journal: Orion.GetCliLocString(1007074), name: Orion.GetCliLocString(1018333)}, //'Shadow Iron'},
    '0x096D' : {id: 400, color: 0x096D, html: "#",journal: Orion.GetCliLocString(1007075), name: Orion.GetCliLocString(1018334)}, //'Copper'},
    '0x0972' : {id: 500, color: 0x054A, html: "#",journal: Orion.GetCliLocString(1007076), name: Orion.GetCliLocString(1018335)}, //'Bronze'},
    '0x08A5' : {id: 600, color: 0x08A5, html: "#",journal: Orion.GetCliLocString(1007077), name: Orion.GetCliLocString(1018336)}, //'Golden'},
    '0x0979' : {id: 700, color: 0x0979, html: "#",journal: Orion.GetCliLocString(1007078), name: Orion.GetCliLocString(1018337)}, //'Agapite'},
    '0x089F' : {id: 800, color: 0x089F, html: "#",journal: Orion.GetCliLocString(1007079), name: Orion.GetCliLocString(1018338)}, //'Verite'},
    '0x08AB' : {id: 900, color: 0x08AB, html: "#",journal: Orion.GetCliLocString(1007080), name: Orion.GetCliLocString(1018339)}, //'Valorite'}
}


const defaults = {
    gump: {width: 500, height: 470},
    counters: {},
    timers: {}
}

const VERSION = '2.3';
var Historic = (Historic && Object.keys(Historic).length) ? Historic : loadSavedData();
var Active = (Active && Object.keys(Active).length) ? Active : {};
var serial = 40000;

function Autostart(){
    if(!Orion.TimerExists('operating'))
        Timer.start('operating');
    Shared.AddVar('ActiveTimers', JSON.stringify(Active.timers));  // <-- Add this line
    showDisplay();
    while(Orion.Connected()){
        Orion.Wait(1000);
    }
}


/**********************************************************************
 * GUI/Gump Functions
 **********************************************************************/
function showDisplay(){
    const menu = Orion.CreateCustomGump(10000);

    if(!Historic.hasOwnProperty('gump'))
        Historic.gump = {width: gumpwidth, height: gumpheight};

    menu.Clear();
    menu.SetCallback('process');
    menu.SetNoClose(true);
    menu.AddResizepic(0, 0, 0x13BE, Historic.gump.width, Historic.gump.height, 10001);

    if(Historic.gump.height > 35){
        addbox(menu, BOX.HEADER, 10, 10, (Historic.gump.width-20), 20);
        addLine(menu, 15, 10, serial++, "<div align=center>ALTIRIC'S AMAZING ARCHAEOLOGIST</div> v" +VERSION, (Historic.gump.width-20));
    }

    

    if(Historic.gump.height > 250){
        addbox(menu, BOX.MENU, 10, 35, 200, 250);
        addbox(menu, BOX.OPTIONS, 215, 35, 275, 250);

        addLine(menu, 0, 35, LINE.MENUHEADER, "<div align=center>MAIN MENU</div>", 230);
        addButton(menu, BUTTON.SETUP, 15, 60, 'Setup', 'Main Setup Options', null, 1);
        addButton(menu, BUTTON.OPTIONS, 15, 80, 'Options', 'General Mining Options', null, 2);
        addButton(menu, BUTTON.ANALYTICS, 15, 100, 'Analytics', 'Mining Analytics', null, 3);
        addButton(menu, BUTTON.MINING, 15, 120, 'Mining', 'Mining Operations', null, 4);   
    }

    y = 10;
    y += Historic.gump.height > 35 ? 200 : 0;

    addbox(menu, BOX.STATUS, 10, (Historic.gump.height-25), (Historic.gump.width-20), 20);
    
    if(Historic.gump.height > 45)
        addbox(menu, BOX.STATS, 10, Historic.gump.height < 450 ? 35 : 290, (Historic.gump.width-20), 150);
    

    if(Historic.gump.height > 300){
        menu.AddButton(BUTTON.MINMAX, 437, 10, 0xA90, 0xA90, 0xA91, 0x0000);
        menu.AddTooltip("Shrink");
    } else if(Historic.gump.height > 40){
        menu.AddButton(BUTTON.MINMAX, 437, 10, 0xA92, 0xA92, 0xA93, 0x0000);
        menu.AddTooltip('Expand');
    }
    if(Historic.gump.height > 40){
        menu.AddButton(BUTTON.MINIMIZE, 450, 10, 0xA96, 0xA96, 0xA97, 0x0000);
        menu.AddTooltip("Minimize");
    } else {
        menu.AddButton(BUTTON.RESTORE, 450, 10, 0xA9A, 0xA9A, 0xA9B, 0x0000);
        menu.AddTooltip("Restore");
    }

    menu.AddButton(BUTTON.CLOSE, 470, 10, 0xA94, 0xA94, 0xA95, 0x0000);
    menu.AddTooltip("Close");

    
    addLine(menu, 15, (Historic.gump.height-25), LINE.STATUS, "<div align=left>Ready to Mine...</div>", (Historic.gump.width-20));

    menu.Update();

    menu.AddPage(1);
        if(Historic.gump.height > 250){
            addLine(menu, 225, 35, LINE.OPTIONSHEADER, "<div align=center>SETUP</div>", 225);
            addButton(menu, BUTTON.SETSECURE, 225, 60, Historic.hasOwnProperty('secure') ? Historic.secure.name : 'Set Secure', 'Set/Remove Secure Container');
            addButton(menu, BUTTON.SETFIRE, 225, 80, Historic.hasOwnProperty('fire') ? Historic.fire.name : 'Set Fire Beetle', 'Select/Remove a Fire Beetle');
            addButton(menu, BUTTON.SETPACK, 225, 100, Historic.hasOwnProperty('pack') ? Historic.pack.name : 'Set Pack Animal', 'Select/Remove a Pack Animal');
            addButton(menu, BUTTON.SETBOOK, 225, 120, Historic.hasOwnProperty('book') ? Historic.book.name : 'Set Runebook', 'Select/Remove a Mining Runebook');
            menu.Update();
        }

    menu.AddPage(2);
        if(Historic.gump.height > 250){
            var y = 55, tserial = 80;
            if(!Historic.hasOwnProperty('ores'))
                Historic.ores = {};
            addLine(menu, 225, 35, LINE.OPTIONSHEADER, "<div align=center>ORE OPTIONS</div>", 225);
            for(var color in Ores){
                const material = Ores[color];
                menu.AddButton(material.id+1, 220, y, 0xFA5, 0xFA5, 0x0FA7, 0x0000);
                menu.AddTooltip("Change Mining Options")
                menu.AddText(255, y, material.color, material.name);
                const showOption = Historic.ores.hasOwnProperty(color) ? Historic.ores[color] : 'ignore';
                menu.AddText(225, y, LABEL, "<div align=right>" +showOption, 225, material.id+3);
                menu.AddButton(material.id+2, 450, y, 0x0FBD, 0x0FBD, 0x0FBE, 0x0000);
                menu.AddTooltip("Show Analytics for " +material.name);
                y += 20;
                tserial++;
            }
            menu.Update();
        }
}

function addLine(menu, x, y, id, text, size){
    size = size ? size : (text.length*6);
    menu.AddText(x, y, LABEL, text, size, id);
}

function addButton(menu, id, x, y, text, tooltip, color, page){
    if(page)
        menu.AddButton(id, x, y, 0xFA5, 0xFA5, 0xFA6, 0x0000, 0, page);
    else
        menu.AddButton(id, x, y, 0xFA5, 0xFA5, 0xFA6, 0x0000);
    menu.AddTooltip(tooltip ? tooltip : text);
    menu.AddText((x+35), y, color ? color : BUTTON.COLOR, text, 3000, id);
}

function addbox(menu, id, x, y, width, height){
    menu.AddGumpPic(x, y, 0xA40, 0x0000, id, 0x0000, width, height);
    menu.AddCheckerTrans(x, y, width, height, id+1000);
}

function setstatus(text){
    const menu = Orion.CreateCustomGump(10000);
    addLine(menu, 15, (Historic.gump.height-25), LINE.STATUS, "<div align=right>" + text + "</div>", (Historic.gump.width-30));
    menu.Update();
}

function process(_internal){
    const menu = Orion.CreateCustomGump(10000);
    const button = CustomGumpResponse.ReturnCode();
    log(3, '[process] button: ' +button);
    const serializedTimers = Shared.GetVar('ActiveTimers');  // Retrieve
    if (serializedTimers) {
        Active.timers = JSON.parse(serializedTimers);  // Deserialize
    }
    if(button === 0) return;

    if(!Historic.hasOwnProperty('ores'))
        Historic.ores = {};

    for(var color in Ores){
        const material = Ores[color];
        if(button === material.id+1) {
            const oreData = Historic.ores[color];
            switch (oreData) {
                case 'ignore':
                    Historic.ores[color] = 'mine';
                    break;
                case 'mine':
                    Historic.ores[color] = 'smelt';
                    break;
                case 'smelt':
                    Historic.ores[color] = 'prospect';
                    break;
                case 'prospect':
                    Historic.ores[color] = 'ignore';
                    break;
                default:
                    Historic.ores[color] = 'mine';
                    break;
            }
            showDisplay();
        } else if(button === material.id+2){
            showStats(button-2);
            return;
        }
    }

    switch(button){
        case BUTTON.CLOSE:
            log(3, '[process] Closing AAArchaeologist');
            menu.Close();
            Timer.stop('operating');
            saveHistoricData();
            Orion.Terminate('process');
            Orion.Terminate('Autostart');
            break;
        case BUTTON.MINIMIZE:
            log(3, "Minimize");
            if(!Historic.gump.hasOwnProperty('lastHeight'))
                Historic.gump.lastHeight = Historic.gump.height;
            Historic.gump.height = 35;
            showDisplay();
            break;
        case BUTTON.RESTORE:
            log(3, "Restore");
            if(Historic.gump.hasOwnProperty('lastHeight')){
                Historic.gump.height = Historic.gump.lastHeight;
                delete Historic.gump.lastHeight;
            }
            showDisplay();
            break;
        case BUTTON.MINMAX:
            if(!Historic.hasOwnProperty('gump')){
                Historic.gump = {width: 500, height: 470};
            }
            if(Historic.gump.height > 215){
                Historic.gump.height = 215;
                Historic.gump.width = 500;
            } else {
                Historic.gump.height = 470;
                Historic.gump.width = 500;
            }
            showDisplay();
            break;
        case BUTTON.SETSECURE:
            if(Historic.hasOwnProperty('secure')){
                delete Historic.secure;
                showDisplay();
                break;
            }
            const secure = getObject('Secure Container');
            if(!secure || !secure.Properties().match(/Weight:/)){
                setstatus('Invalid Secure Container');
                break;
            }
            update('secure', {serial: secure.Serial(), name: secure.Name(), x: secure.X(), y: secure.Y(), z: secure.Z()});
            showDisplay();
            break;
        case BUTTON.SETFIRE:
            if(Historic.hasOwnProperty('fire')){
                delete Historic.fire;
                showDisplay();
                break;
            }
            const fire = getObject('Fire Beetle');
            if(!fire || fire.Graphic() !== items.firebeetle){
                setstatus('Invalid Fire Beetle ');
                break;
            }
            update('fire', {serial: fire.Serial(), name: fire.Name()});
            showDisplay();
            break;
        case BUTTON.SETPACK:
            if(Historic.hasOwnProperty('pack')){
                delete Historic.pack;
                showDisplay();
                break;
            }
            const pack = getObject('Pack Animal');
            if(!pack || !pack.Properties().match(/Weight:/)){
                setstatus('Invalid Pack Animal');
                break;
            }
            update('pack', {serial: pack.Serial(), name: pack.Name()})
            showDisplay();
            break;
        case BUTTON.SETBOOK:
            if(Historic.hasOwnProperty('book')){
                delete Historic.book;
                showDisplay();
                break;
            }
            const book = getObject('Mining Runebook');
            if(!book || !book.Graphic().match(items.runebook)){
                setstatus('Invalid Mining Runebook');
                break;
            }
            update('book', {serial: book.Serial(), name: book.Name()})
            showDisplay();
            break;
        default:
            break;
    }
    saveHistoricData();
}

function showStats(id){
    Orion.Print("Showing stats for " +id);
    const menu = Orion.CreateCustomGump(10000);
    var y = 10;
    y = Historic.gump.height > 35 ? y += 130 : y;
    y = Historic.gump.height > 250 ? y += 150 : y;
    for(var color in Ores){
        const material = Ores[color];
        if(material.id === id){
            var showMaterial = material;
        }
    }
    var grids = 0, respawned = 0;
    for(var key in Historic.tiles){
        const tile = Historic.tiles[key];
        for(var color in Ores){
            var material = Ores[color];
            if(tile.color === color)
                grids++;
            if((new Date.getTime() - tile.timer) > RESPAWN_TIMER)
                respawned++;
        }
    }
    if(!Historic.hasOwnProperty('counters')) Historic.counters = {};
    if(!Historic.counters.hasOwnProperty('ores')) Historic.counters.ores = {};
    menu.AddText(15, y, LABEL, "Ore Type: ", 125, serial++);
    menu.AddText(90, y, VALUE, showMaterial.name, 200, serial++);
    menu.AddText(15, y+=15, LABEL, "Grids Found: ", 200, serial++);
    menu.AddText(90, y, VALUE, grids, 200, serial++);
    menu.AddText(15, y+=15, LABEL, "Respawned: ", 200, serial++);
    menu.AddText(90, y, VALUE, respawned, 200, serial++);

    menu.AddText(15, y+=15, LABEL, "Duration: ", 200, serial++);
    if(Historic.timers && Historic.timers.ores)
        menu.AddText(90, y, VALUE, Historic.timers.ores[showMaterial.color] || formatTime('0'), 200, serial++);
    else
        menu.AddText(90, y, VALUE, formatTime('0'), 200, serial++);
    menu.AddText(15, y+=15, LABEL, "Ore Weight: ", 200, serial++);
    if(Historic.counters && Historic.counters.ores)
        menu.AddText(90, y, VALUE, Historic.counters.ores[showMaterial.color] || 0, 200, serial++);
    else
        menu.AddText(90, y, VALUE, 0, 200, serial++);
    menu.AddText(15, y+= 15, LABEL, "Ingots: ", 200, serial++);
    if(Historic.counters && Historic.counters.ingots)
        menu.AddText(90, y, VALUE, Historic.counters.ingots[showMaterial.color] || 0, 200, serial++);
    else
        menu.AddText(90, y, VALUE, 0, 200, serial++);

    menu.Update();
}

/**********************************************************************
 * File Sepcific Functions
 **********************************************************************/
function loadSavedData(_internl){
    var data;
    try {
        const file = Orion.NewFile();
        file.Open(Options.PLAYER_FILENAME);
        data = file.ReadAll();
        file.Close();
    } catch(e) {
        log(3, 'Error loading saved data: loading defaults');
        return defaults;
    }

    try {
        if(data.length){
            log(3, 'Loaded saved data')
            return JSON.parse(data);
        } else {
            log(3, 'No saved data found, loading defaults');
            return defaults;
        }
    } catch(e) {
        log(4,'Corrupt data, delete ' +Options.PLAYER_FILENAME +' and restart');
    }
}

function saveHistoricData(_internal){
    try {
        const object = JSON.stringify(Historic, null, 4);
        const file = Orion.NewFile();
        file.Remove(Options.PLAYER_FILENAME);
        file.Open(Options.PLAYER_FILENAME);
        file.Write(object);
        file.Close();
        log(3, 'Historic data saved');
    } catch(e) {
        log(3, 'Corrupt Historic object, attempting recovery');
        Historic = loadSavedData();
        return;
    }
}

function update(path, value) {
    var objects = [Historic, Active];
    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];
        var keys = path.split('.');
        var lastKey = keys.pop();
        var tempObj = obj;
    
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!(key in tempObj)) {
            tempObj[key] = {};
            }
            tempObj = tempObj[key];
        }
    
        tempObj[lastKey] = value;
    }
}

/**********************************************************************
 * Utilty Functions
 **********************************************************************/

// level 0=silent, 1=print, 2=detailed, 3=debug, 4=error
function log(level, text){
    if(level === 1){
        Orion.Print(text);
    } else if(level >= 2){
        if(!TextWindow.IsOpened()){
            TextWindow.Open();
            TextWindow.Clear();
            TextWindow.Print("DEBUG LOG: " +Orion.Date('dd.MM.yyyy') +" " +Orion.Time('HH:mm:ss'));
        }
        TextWindow.Print("[" +Orion.Time('hh:mm:ss') +"]" +text);
    }

    if(level >= 3){
        if((!Orion.TimerExists('saveDebug') || Orion.Timer('saveDebug') > 5000)){
            Orion.SetTimer('saveDebug');
            TextWindow.SaveToFile(Orion.Date('dd.MM.yy') +'-debug.log');
        }
    }

    if(level === 4){
        var scripts = Orion.GetScripts();
        for(var i in scripts)
            Orion.Terminate(scripts[i]);
    }
}

function getObject(string){
    log(3, "Function getObject: " +string);
    setstatus("Select " +string);
    Orion.SetTimer('object');
    Orion.WaitForAddObject(string, 5000);
    object = Orion.FindObject(string);
    Orion.RemoveObject(string);
    if(Orion.Timer('object') >= 5000 || !object){
        log(3, "Function: getObject: " +string +" : failed");
        setstatus(!object ? "Invalid Target" : "Target Selection Timed Out");
        return null;
    }
    return object;
}

function Counter(key, subKey, increment) {
    increment = increment || 1;
    subKey = subKey || null;
    var objects = [Active, Historic]; // Default to updating both Active and Historic

    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];
        if (!obj.counters) obj.counters = {};

        if (subKey) {
            if (!obj.counters[key]) obj.counters[key] = {};
            obj.counters[key][subKey] = (obj.counters[key][subKey] || 0) + increment;
        } else {
            obj.counters[key] = (obj.counters[key] || 0) + increment;
        }
    }
    log(3, "Function: updateCounter: " + key + " : " + subKey + " : " + increment);
}


var Timer = (function () {
    if(!Historic.hasOwnProperty('timers')) Historic.timers = {};
    if(!Active.hasOwnProperty('timers')) Active.timers = {};

    function calculateElapsedTime(key) {
        var currentTime = new Date().getTime();
        var timerData = Active.timers[key];
        var elapsedTime = currentTime - timerData.startTime + timerData.accumulatedTime;
        timerData.accumulatedTime += (currentTime - timerData.startTime);
        Historic.timers[key] = (Historic.timers[key] || 0) + elapsedTime;
        timerData.startTime = currentTime;
        return elapsedTime;
    }

    function start(key){
        if (!Active.timers[key]) {
            Active.timers[key] = { startTime: new Date().getTime(), accumulatedTime: 0 };
        } else {
            Active.timers[key].startTime = new Date().getTime();
        }
        log(3, 'Timer started: ' + key);
    } 
    
    function stop(key){
        if (!Active.timers[key]) {
            log(3, 'Timer ' + key + ' is not running.');
            return;
        }
        var elapsedTime = calculateElapsedTime(key);
        log(3, 'Timer stop: ' + key + ', Elapsed time: ' + elapsedTime);
        delete Active.timers[key];
    }

    function update(key){
        if (!Active.timers[key]) {
            log(3, 'Timer ' + key + ' is not running.');
            return;
        }
        var elapsedTime = calculateElapsedTime(key);
        log(3, 'Timer updated: ' + key + ', Elapsed time: ' + elapsedTime);
    }

    return {
        start: start,
        stop: stop,
        update: update
    };
})();

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    // Manually add leading zeros if needed
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  
    return formattedHours +':' +formattedMinutes +':' +formattedSeconds;
}
