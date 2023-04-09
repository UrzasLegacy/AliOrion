//Setup Instructions:
//Have a runebook named 'Main' (full of recall scrolls if you dont have chiv)
//Put a rune named 'Moongate' set to any moongate and another rune named 'Moongate2' nearby in case the first is blocked
//Put a rune named 'Repair' set in front of your repair house and a rune named 'Repair2' nearby in case the first is blocked
//The repair house should have a repair bench set up such that you can walk straight north from your recall location and access it
//Create a dress set named '{Character Name} Taming Suit' with your +taming equipment
//Create a dress set named '{Character Name} Regular Suit' with your regular farming suit
//Create a hotkey for the StartCuFarm() function. Use this function to start farming
//Make sure the 'Autostart' and 'Echo Journal' checkboxes are checked in the Assistant > Main tab

var testMode = false;

var profiles = 
    {
    Cu: 
        {
        mobGraphic: '0x0115|0x007A|0x0080', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useOnslaught: true,
        useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: false, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useCounterAttack: false, //true , false.
        useConfidence: false, //true , false.
            useConfidenceThresholdPercent: 70, //Percentage of self HP to attempt to cast confidence
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
        selfTame: true,
        },
    }

var profile = profiles.Cu;

var cuHue = {
    '0x0000': 'Plain', //0
    '0x0501': 'Paragon',
    //uncommon
    '0x0978': 'Dull Copper', //2424
    '0x05A7': 'Copper', //1447
    '0x08AA': 'Bronze', //2218
    '0x097A': 'Rose', //2426
    '0x0901': 'Grey', //2305
    '0x0527': 'Echo', //1319
    '0x08AC': 'Valorite', //2220
    //rare
    '0x0515': 'Sky', //1301
    '0x0482': 'Ice', //1154
    '0x04B1': 'Pink', //1201
    '0x0674': 'Red', //1652
    '0x0455': 'Black', //1109
    '0x0481': 'White', //1153
    //uber rare
    '0x0489': 'Blaze', //1161
}

var hueOrder = 
    [
    '0x0000','0x0501','0x0978',
    '0x05A7','0x08AA','0x097A',
    '0x0901','0x0527','0x08AC',
    '0x0515','0x0482','0x04B1',
    '0x0674','0x0455','0x0481', 
    '0x0489', //1161
    ]

var hueSerials = {
    '0x0000': [1,2], //Plain
    '0x0501': [3,4],//'Paragon',
    //uncommon
    '0x0978': [5,6],//'Dull Copper', //2424
    '0x05A7': [7,8],//'Copper', //1447
    '0x08AA': [9,10],//'Bronze', //2218
    '0x097A': [11,12],//'Rose', //2426
    '0x0901': [13,14],//'Grey', //2305
    '0x0527': [15,16],//'Echo', //1319
    '0x08AC': [17,18],//'Valorite', //2220
    //rare
    '0x0515': [19,20],//'Sky', //1301
    '0x0482': [21,22],//'Ice', //1154
    '0x04B1': [23,24],//'Pink', //1201
    '0x0674': [25,26],//'Red', //1652
    '0x0455': [27,28],//'Black', //1109
    '0x0481': [29,30],//'White', //1153
    //uber rare
    '0x0489': [31,32],//'Blaze', //1161
}

var x1 = 30;
var x2 = 120;
var x3 = 160;
var x4 = 240;
var x5 = 280;
var yAdj = 17;
var textWidth = 100;

function Autostart()
    {
    Orion.Wait(2000);
    var startTime = Orion.Now();
    var endTime = startTime + 5000;
    while(!Orion.GumpExists('container',backpack))
        {
        if(Orion.Now() > endTime)
            break;
        Orion.UseObject(backpack);
        Orion.Wait(1000);
        }
    if(Player.Map() == 0)
        MapDetectionFix();
    }

function StartCuFarm()
    {
    if(Orion.GetDistance(1174,1285) > 250)
        AliAtlas(1174,1285,'Ilshenar');
    EquipRegularSuitByBotName();
    Orion.Wait(1000);
    DiscordPush(Player.Name() + ' progressing spawn');
    Orion.Exec('BuffMonitor',true);
    Orion.Exec('CuGump',true);
    Orion.Exec('AutoAttack',true);
    Orion.Exec('WalkSpawn',true);
    Orion.Exec('AttackSpawn',true);
    if(Orion.SkillValue('Bushido') > 900)
        Orion.Exec('AutoEvade',true);
    Orion.Exec('RareAlert',true);
    Orion.Exec('JournalScan',true);
    Orion.ResumeScript('all');
    }

function CuGump()
    {
    Shared.ClearVars();
    var startTime = Shared.GetVar('startTime',Orion.Now())
    Shared.AddVar('startTime',Orion.Now())
    var y = 25;
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport' + Player.Serial() + '.json';
    var tmpFile = Orion.NewFile();
    if(tmpFile.Open(tmpFilePath))
    	{
    	var fileJSON = tmpFile.ReadAll();
    	if(fileJSON)
        	var totalObj = JSON.parse(fileJSON);
        else
        	var totalObj = {};
        }
    else
        {
        TextWindow.Open();
        TextWindow.Print('Unrecorded: ' + colorID);
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create log file')
        }
    var currentObj = Shared.GetVar('currentObj',{"0x0000":0,"0x0901":0,"0x05A7":0,"0x0501":0,"0x08AC":0,"0x0527":0,"0x097A":0,"0x0978":0,"0x08AA":0,"0x0482":0,"0x0674":0,"0x04B1":0,"0x0515":0,"0x0455":0,"0x0481":0,"0x0489":0});
    var s = 1;
    var gump = Orion.CreateCustomGump(15001);
    gump.SetNoClose(true);
    gump.SetCallback('CuGumpCallback')
    gump.Clear();
    gump.AddResizepic(0, 0, 0xDAC, 350, 500);
    gump.AddText(x1 + 60,y,0,'<h2>Current Session</h2>'); //Titles
    gump.AddText(x4,y,0,'<h2>All Time</h2>');
    y += yAdj;
    y += yAdj;
    gump.AddText(x1,y,0,'Plain:');
    gump.AddText(x2,y,0,currentObj['0x0000'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0000'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Paragon:');
    gump.AddText(x2,y,0,currentObj['0x0501'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0501'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Dull Copper:');
    gump.AddText(x2,y,0,currentObj['0x0978'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0978'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Copper:');
    gump.AddText(x2,y,0,currentObj['0x05A7'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x05A7'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Bronze:');
    gump.AddText(x2,y,0,currentObj['0x08AA'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x08AA'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Rose:');
    gump.AddText(x2,y,0,currentObj['0x097A'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x097A'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Grey:');
    gump.AddText(x2,y,0,currentObj['0x0901'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0901'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Echo:');
    gump.AddText(x2,y,0,currentObj['0x0527'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0527'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Valorite:');
    gump.AddText(x2,y,0,currentObj['0x08AC'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x08AC'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Sky:');
    gump.AddText(x2,y,0,currentObj['0x0515'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0515'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Ice:');
    gump.AddText(x2,y,0,currentObj['0x0482'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0482'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Pink:');
    gump.AddText(x2,y,0,currentObj['0x04B1'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x04B1'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Red:');
    gump.AddText(x2,y,0,currentObj['0x0674'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0674'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Black:');
    gump.AddText(x2,y,0,currentObj['0x0455'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0455'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'White:');
    gump.AddText(x2,y,0,currentObj['0x0481'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0481'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Blaze:');
    gump.AddText(x2,y,0,currentObj['0x0489'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0489'] || 0,textWidth,s++);
    y += yAdj;
    gump.AddText(x1 + 15,y,0,'Total:');
    var totalCurrent = 0;
    var totalTotal = 0;
    for(var prop in currentObj)
        {
        if(cuHue[prop])
            totalCurrent += currentObj[prop]
        Orion.Wait(1);
        }
    for(var prop in totalObj)
        {
        if(cuHue[prop])
            totalTotal += totalObj[prop]
        Orion.Wait(1);
        }
    gump.AddText(x2 + 15,y,0,totalCurrent,100,601); // Totals
    gump.AddText(x4 + 15,y,0,totalTotal,100,602);
    y += yAdj;
    gump.AddText(x1 + 15,y,0,'Per hour: ');

    gump.AddButton(0, x5 + 30, 10, 1535, 1536, 1536, '0x0000');//close
    gump.AddButton(1, x5 + 30, 400, 10740, 10742, 10741, '0x0000');
    gump.Update();
    
    CalculatePercentages();
    while(true)
        {
        var pauseStamp = Shared.GetVar('pauseStamp',false);
        if(pauseStamp)
            {
            Orion.Print('startTime: ' + startTime)
            Orion.Print('pauseStamp: ' + pauseStamp)
            var pauseInterval = Orion.Now() - pauseStamp;
            Orion.Print('pauseInterval: ' + pauseInterval)
            startTime += pauseInterval;
            Shared.AddVar('startTime',startTime);
            Shared.AddVar('pauseStamp',false);
            }
        var timeStamp = Orion.Now();
        var ms = timeStamp - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var divisor = ms / 3600000;
        var cuCount = Shared.GetVar('currentTotal',0);
        var gump = Orion.CreateCustomGump(15001);
        gump.AddText(x2,42,1152,time,textWidth,100);
        gump.AddText(x2 + 15,y,0,(cuCount / divisor).toFixed(2),textWidth,101);
        gump.Update();
        Orion.Wait(1000);
        }
    }

function CuGumpCallback(_)
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0)
        {
        Orion.PauseScript('CuGump');
        var gump = Orion.CreateCustomGump(15001);
        gump.Close();
        Orion.Wait(500);
        Orion.Terminate('CuGump');
        }
    else if(code == 1)
        {
        var scriptStatus = Orion.ScriptRunning('CuGump');
        var gump = Orion.CreateCustomGump(15001);
        if(scriptStatus > 0)
            {
            Shared.AddVar('pauseStamp',Orion.Now());
            Orion.PauseScript('all','JournalScan|CuGumpCallback');
            gump.AddButton(1, x5 + 20, 400, 10740, 10742, 10741, '0x0000');
            }
        else if(scriptStatus < 0)
            {
            Orion.ResumeScript('all','WalkSpawn');
            gump.AddButton(1, x5 + 20, 400, 10741, 10742, 10740, '0x0000');
            }
        gump.Update();
        }
    }

function WalkSpawn()
	{
    var waypoints = 
    [
        [1252, 1218],
        [1406, 1215],
        [1406, 1258],
        [1253, 1257],
    ]
	while(!Player.Dead())
        {
		var waypoint = waypoints.shift();
		waypoints.push(waypoint);
		var x = waypoint[0];
		var y = waypoint[1];
		AliWalkTo(x,y,0,0,255,20);
		Orion.Wait(10);
        }
    DiscordPush(Player.Name() + ' Died!')
	}

function RareAlert()
	{
    var hash = {};
    var mobGraphic = '0x0115';
    var outMsg = '';
    Orion.SetTimer('cull');
    if(testMode)
        var blazeColor = '0x0000'
    else
        var blazeColor = '0x0489'
        
    while(true)
        {
        if(Orion.Timer('cull') > 300000)
            {
            for(serial in hash)
                delete hash[serial];
            Orion.SetTimer('cull');
            }
        var mobs = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', 12, 'gray|criminal|red')
        for(var i=0;i<mobs.length;i++)
            {
            var outCharMsg = '';
            var mob = mobs[i];
            var mobColor = mob.Color();
            var mobSerial = mob.Serial();
            if(hash[mobSerial])
                continue;
            if(mobColor == blazeColor)
                {
                outMsg = Player.Name() + ': BLAZE CU FOUND!';
                Orion.PlayWav('BlazeCuFound.wav');
                BlazeProtocol(mobSerial,outMsg);
                }
            else if(Orion.Contains('0x0455|0x0481',mobColor))
                {
                var parse = LoreParser(mobSerial,mobColor);
                if(parse.length)
                    {
                    outCharMsg = JSON.stringify(parse);
                    if(parse[0] == 600 && parse[1] == 70 && parse[2] == 70)
                        {
                        outMsg = Player.Name() + ': High Intensity ' + cuHue[mobColor] + ' Cu Found!';
                        BlazeProtocol(mobSerial,outMsg);
                        }
                    }
                }
            // else
            //     {
            //     var parse = LoreParser(mobSerial,mobColor);
            //     if(parse.length)
            //         {
            //         outCharMsg = JSON.stringify(parse);
            //         if(parse[0] > 598 && parse[1] < 72 && parse[2] < 72)
            //             {
            //             outMsg = Player.Name() + ': Near Perfect Common Cu Found!';
            //             BlazeProtocol(mobSerial,outMsg);
            //             }
            //         }
            //     }
            Orion.CharPrint(mobSerial,1159,cuHue[mobColor]);
            if(outCharMsg)
                Orion.CharPrint(mobSerial,1159,outCharMsg);
            hash[mobSerial] = true;
            }
        Orion.Wait(1000);
        }
	}

function testLoreParser()
    {
    Orion.WaitForAddObject('mySerial');
    var serial = Orion.GetSerial('mySerial');
    var parse = LoreParser(serial);
    Orion.Print(parse);
    
    }

function BlazeProtocol(mobSerial,outMsg)
    {
    Orion.StopWalking();
    Orion.PauseScript('AttackSpawn')
    Orion.PauseScript('WalkSpawn')
    //Orion.PauseScript('AutoAttack')
    var mob = Orion.FindObject(mobSerial);
    Shared.AddVar('cuSerial',mobSerial);
    Orion.Print('shared:' + Shared.GetVar('cuSerial'))
    var destX = 1349;
    var destY = 1349;
    var path = Orion.GetPathArray(destX,destY,0,0)
    path.forEach(function(tile,ind)
        {
        Orion.AddFakeMapObject(ind + 10000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        })
    AliWalkTo(mob.X(),mob.Y(),mob.Z(),5)
    Orion.Attack(mobSerial);
    Orion.WarMode(0);
    DiscordPush(outMsg);
    Orion.Wait(100);
    if(Orion.SkillValue('Animal Taming','base') > 1000)
        {
        TameCu();
        Shared.AddVar('pauseStamp',Orion.Now());
        Orion.PauseScript('CuGump')
        StoreCu();
        Orion.Terminate('all','JournalScan|CuGump');
        }
    else
        {
        Orion.Wait(1300);
        EquipTamingSuitByBotName();
        if(Orion.SkillValue('Animal Taming','base') > 1000)
            {
            TameCu();
            Shared.AddVar('pauseStamp',Orion.Now());
            Orion.PauseScript('CuGump')
            StoreCu();
            Orion.Terminate('all','JournalScan|CuGump');
            }
        else
            {
            AliWalkTo(destX,destY,0,0,255,10,1,1,300000,false,SlowPoke)
            Orion.Wait(500);
            Orion.WarMode(0);
            Orion.Wait(1000);
            DiscordPush(outMsg);
            Orion.Wait(100);
            AliWalkTo(1252, 1218)
            }
        }
    Orion.Exec("StartCuFarm",true)
    }

function LoreParser(mobSerial,mobColor)
	{
    var closeGump = Orion.GetGump('any','0x000001DB')
    while(closeGump)
        {
        closeGump.Close();
        Orion.Wait(10);
        closeGump = Orion.GetGump('any','0x000001DB')
        }
    var loreGump
    if(Orion.GetDistance(mobSerial) > 12)
        return false;
    Orion.UseSkill('Animal Lore')
    if(Orion.WaitForTarget(3000))
        {
        Orion.TargetObject(mobSerial)
        if(Orion.WaitForGump(5000))
            loreGump = Orion.GetGump('any','0x000001DB');
        }
    if(!loreGump)
        return false;
	var textList = loreGump.TextList();
	var hp = Math.floor(+Orion.Split(textList[1].slice(17).slice(0,-6),'/')[1] / 2);
	var stam = Math.floor(+Orion.Split(textList[2].slice(17).slice(0,-6),'/')[1] / 2);
	var str = Math.floor(+textList[4].slice(17).slice(0,-6) / 2);
	//var dex = Math.floor(+textList[5].slice(17).slice(0,-6) / 2);
	//var phys = +textList[11].slice(17).slice(0,-7);
	//var fire = +textList[12].slice(41).slice(0,-7);
	var cold = +textList[13].slice(41).slice(0,-7);
	//var pois = +textList[14].slice(41).slice(0,-7);
	var ener = +textList[15].slice(41).slice(0,-7);
    var gump = Orion.CreateCustomGump(15001);
    var s = 1000;
    var y = 375;
    var color = 0;
    gump.AddText(x1,y,mobColor,cuHue[mobColor],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,color,'HP: ',textWidth,s++);
    gump.AddText(x2,y,color,hp + '/600',textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,color,'Stam: ',textWidth,s++);
    gump.AddText(x2,y,color,stam + '/85',textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,color,'str: ',textWidth,s++);
    gump.AddText(x2,y,color,str + '/612',textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,color,'Cold: ',textWidth,s++);
    gump.AddText(x2,y,color,cold + '/70',textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,color,'Energy: ',textWidth,s++);
    gump.AddText(x2,y,color,ener + '/70',textWidth,s++);
    y += yAdj;
    gump.Update()
    return [hp,cold,ener];
	} 

function AttackSpawn()
	{
    //cu 0x0115
    //unicorn 0x007A
    //faerie 0x0080
    Shared.AddVar('discordLink', "https://discordapp.com/api/webhooks/" + profile.discordHook + "/" + profile.discordKey)
	var mobGraphic = '0x0115';
    var i = 1;
	while(!Player.Dead())
		{
		Orion.Wait(200);
		var mobs = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', 24, 'gray|criminal|red').sort(function(a,b)
            {
            return a.Distance() - b.Distance();
            });
        if(mobs.length)
            {
            Orion.PauseScript('WalkSpawn');
            Orion.Wait(200);
            Orion.StopWalking();
            }
		while(!Player.Dead() && mobs.length)
			{
            Orion.Print('Mobs: ' + mobs.length);
			var mob = mobs[0];
            var mobColor = mob.Color();
            var mobSerial = mob.Serial();
            //Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            //Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            if(mobColor === '0')
                mobColor = '0x0501';
            Orion.ControlAgent('autoloot','BotLoot','stop');
            Orion.Wait(10);
            Orion.ControlAgent('autoloot','BotLoot','start');
            if(mob.Distance() > 6)
                Orion.WalkTo(mob.X(),mob.Y(),0,5)
            //HonorTarget(mobSerial)
            while(!Player.Dead() && mob.Exists())
                {
                var faerie = Orion.FindTypeEx('0x0080', any, ground, 'ignoreself|ignorefriends|live|inlos', 2, 'gray|criminal|red|blue')[0];
                if(mob.Distance() > 1)
                    Orion.WalkTo(mob.X(),mob.Y())
				else if(faerie)
                    Orion.Attack(faerie.Serial())
                else
				   Orion.Attack(mobSerial);
                Orion.Wait(200)
                }
            var startTime = Orion.Now();
            var endTime = startTime + 5000;
            AppendColor(mobColor);
            Orion.WaitJournal('corpses to loot: 0',startTime,endTime,'oa');
            //Orion.Wait(3000);
			mobs = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', 24, 'gray|criminal|red').sort(function(a,b)
                {
                return a.Distance() - b.Distance();
                });
			}
		Orion.ResumeScript('WalkSpawn');
		Orion.Wait(200);
		}
    DiscordPush(Player.Name() + ' Died!');
    Orion.LogOut();
	}

function HonorTarget(targetSerial)
    {
    if(Orion.BuffExists('Honored2'))
        return;
    Orion.InvokeVirtue('honor');
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(targetSerial);
    }

function HonorSelf()
    {
    Orion.InvokeVirtue('honor');
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(self);
	if (Orion.WaitForGump(1000))
	    {
		var gump = Orion.GetGump('any','0x000236E');
		if (gump !== null)
		    {
			gump.Select(Orion.CreateGumpHook(1));
			Orion.Wait(100);
		    }
	    }
    }

function TestBlazeProtocol()
    {

    //AliWalkTo(Player.X() + 11,Player.Y(),Player.Z(),5)
    Orion.WaitForAddObject('myTarget')
    var a = Orion.GetSerial('myTarget');
    Shared.AddVar('cuSerial',a);
    Orion.CharPrint(a,1159,a)
    BlazeProtocol(a)
    }



function SlowPoke()
    {
    var cuSerial = Shared.GetVar('cuSerial');
    var dist = Orion.GetDistance(cuSerial);
    Orion.Attack(cuSerial)
    while(dist > 4)
        {
        Orion.CharPrint(cuSerial,1159,dist);
        Orion.Wait(100);
        dist = Orion.GetDistance(cuSerial)
        }
    }

function testFile()
    {
    AppendColor('0x0000')
    }
function ClearShared()
    {
    Shared.ClearVars()
    }
function AppendColor(colorID)
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport' + Player.Serial() + '.json';
    var tmpFile = Orion.NewFile();
    if(tmpFile.Open(tmpFilePath))
    	{
    	var fileJSON = tmpFile.ReadAll();
    	if(fileJSON)
        	var logObj = JSON.parse(fileJSON);
        else
        	var logObj = {};
        }
    else
        {
        TextWindow.Open();
        TextWindow.Print('Unrecorded: ' + colorID);
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create log file');
        }
    //tmpFile.Remove();
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording " + colorID + ' To File: ' + tmpFilePath);
    logObj[colorID] = (Number(logObj[colorID]) || 0) + 1;
    tmpFile.Write(JSON.stringify(logObj));
    tmpFile.Close();
    var currentObj = Shared.GetVar('currentObj',{"0x0000":0,"0x0901":0,"0x05A7":0,"0x0501":0,"0x08AC":0,"0x0527":0,"0x097A":0,"0x0978":0,"0x08AA":0,"0x0482":0,"0x0674":0,"0x04B1":0,"0x0515":0,"0x0455":0,"0x0481":0,"0x0489":0});
    currentObj[colorID] = (Number(currentObj[colorID]) || 0) + 1;
    Shared.AddVar('currentObj',currentObj);
    var hueSerial = hueSerials[colorID];
    if(!hueSerial || !hueSerial[1])
        return
    var y = 42 + (17 * ((hueSerial[1] || 0) / 2));
    var gump = Orion.CreateCustomGump(15001);
    gump.AddText(x2,y,0,currentObj[colorID],100,hueSerial[0]);
    gump.AddText(x4,y,0,logObj[colorID],100,hueSerial[1]);
    
    var totalCurrent = 0;
    var totalTotal = 0;
    for(var prop in currentObj)
        {
        if(cuHue[prop])
            totalCurrent += currentObj[prop]
        Orion.Wait(1);
        }
    for(var prop in logObj)
        {
        if(cuHue[prop])
            totalTotal += logObj[prop];
        Orion.Wait(1);
        }
    gump.AddText(x2 + 15,331,0,totalCurrent,100,601); // Totals
    gump.AddText(x4 + 15,331,0,totalTotal,100,602);
    Shared.AddVar('currentTotal',totalCurrent);

    gump.Update();
    CalculatePercentages();
    }

function CalculatePercentages()
    {
    var currentObj = Shared.GetVar('currentObj',{"0x0000":0,"0x0901":0,"0x05A7":0,"0x0501":0,"0x08AC":0,"0x0527":0,"0x097A":0,"0x0978":0,"0x08AA":0,"0x0482":0,"0x0674":0,"0x04B1":0,"0x0515":0,"0x0455":0,"0x0481":0,"0x0489":0});
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport' + Player.Serial() + '.json';
    var tmpFile = Orion.NewFile();
    if(tmpFile.Open(tmpFilePath))
    	{
    	var fileJSON = tmpFile.ReadAll();
    	if(fileJSON)
        	var totalObj = JSON.parse(fileJSON);
        else
        	var totalObj = {};
        }
    else
        {
        TextWindow.Open();
        TextWindow.Print('Unrecorded: ' + colorID);
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create log file');
        }

    var totalCurrent = 0;
    var totalTotal = 0;
    for(var prop in currentObj)
        {
        if(cuHue[prop])
            totalCurrent += currentObj[prop]
        Orion.Wait(1);
        }
    for(var prop in totalObj)
        {
        if(cuHue[prop])
            totalTotal += totalObj[prop]
        Orion.Wait(1);
        }

    var percentages = hueOrder.map(function(hue)
        {
        currentStrOut = (((currentObj[hue] / totalCurrent) || 0)*100).toFixed(2) + '%';
        totalStrOut = ((totalObj[hue] / totalTotal*100).toFixed(2)) + '%';
        var hueSerial = hueSerials[hue];
        return [currentStrOut,totalStrOut,hueSerial[0]]
        })
    var gump = Orion.CreateCustomGump(15001);
    for(var i=0;i<percentages.length;i++)
        {
        var percentage = percentages[i];
        var currentPercentage = percentage[0];
        var totalPercentage = percentage[1];
        var y = 42 + (17 * (i + 1));
        gump.AddText(x3,y,0,currentPercentage,100,percentage[2] + 500);
        gump.AddText(x5,y,0,totalPercentage,100,percentage[2] + 501);
        }
    gump.Update()
    }

function terminateScripts()
	{
	Orion.Terminate('all', 'JournalScan');
    //     Orion.ClearFakeMapObjects();
    // var x = Player.X();
    // var y = Player.Y();
    // var range = 5;
    // DrawSquare(x - range, y - range, x + range, y + range)
	}

function TameCu()
    {
    Orion.ResetSearchArea();
    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    //Orion.WaitForAddObject('myTarget');
    //var serial = Orion.GetSerial('myTarget');
    //Shared.AddVar('cuSerial',serial)
    var serial = Shared.GetVar('cuSerial');
    Orion.Print('serial:' + serial)
    var obj = Orion.FindObject(serial);
    Orion.GetStatus(serial);
    var x = obj.X();
    var y = obj.Y();
    var enclosureRadius = 10;
    Orion.WalkTo(x,y,0,5);
    Orion.GetTilesInRect('land', x - enclosureRadius, y - enclosureRadius, x + enclosureRadius, y + enclosureRadius).filter(function(tile) 
        {
        var tileX = tile.X();
        var tileY = tile.Y();
        return (x == (tileX - enclosureRadius))
            || (x == (tileX + enclosureRadius))
            || (y == (tileY - enclosureRadius))
            || (y == (tileY + enclosureRadius));
        }).forEach(function(tile,ind) 
            {
            var x = tile.X();
            var y = tile.Y();
            var z = tile.Z();
            //Orion.SetBadLocation(x, y);
            Orion.AddFakeMapObject(ind, '0x051A', 1159, x, y, z);
            });
    Shared.AddVar('leashDistance',3)
    while(!Player.Dead())
        {
        Orion.GetStatus(serial);
        var startTime = Orion.Now();
        while(!Player.Dead() && !Orion.DisplayTimerExists('paralyze') && Orion.ScriptRunning('AsyncTame') < 1)
            {
            Orion.PauseScript('AutoAttack');
            var nearFaerie = Orion.FindType('0x0080',any,ground,'live',1)[0];
            if(obj.Hits('%') < 40)
                {
                Orion.CharPrint(self,1159,'Cu low HP! Waiting...')
                WalkToRadiusBorder(serial,5);
                }
            else if(!Orion.AbilityStatus('Secondary'))
                Orion.UseAbility('Secondary')
            else if(obj.Distance() > 1)
                Orion.WalkTo(obj.X(),obj.Y())
            else
                Orion.Attack(obj.Serial());
            Orion.Wait(100)
            if(Orion.InJournal('You deliver a paralyzing blow!','sys','0','any',startTime,Orion.Now()))
                Orion.AddDisplayTimer('paralyze', 6000, 'underChar', 'bar', 'Paralyzed!', 100, 40, '1159', -1, '0xF0FF0BFF');
            }
        Orion.ResumeScript('AutoAttack');
        var leashDistance = Shared.GetVar('leashDistance',3)
        var avoidRadius = 3;
        //Orion.WarMode(2);
            WalkToRadiusBorder(serial,leashDistance);
            Orion.Exec('AsyncTame',true,[serial]);
        // else if(distance >= 4)
        //     Orion.WalkTo(obj.X(),obj.Y(),0,3);
        Orion.Wait(200);
        if(obj.CanChangeName())
            break;
            
        // while(!Player.Dead() && Player.Hits('%') < 80)
        //     {
        //     WalkToRadiusBorder(serial,15);
        //     Orion.Cast('Heal')
        //     if(Orion.WaitForTarget(2000))
        //         Orion.TargetObject(self);
        //     Orion.Wait(100);
        //     }
        if(Orion.GetDistance(x,y) > enclosureRadius)
            {
            var xObj = obj.X();
            var yObj = obj.Y();
            var avoidTiles = Orion.GetTilesInRect('land', xObj - avoidRadius, yObj - avoidRadius, xObj + avoidRadius, yObj + avoidRadius);
			for(var i = 0;i<avoidTiles.length;i++)
				{
				var tile = avoidTiles[i];
				var tileX = tile.X();
				var tileY = tile.Y();
				var tileZ = tile.Z();
				Orion.SetBadLocation(tileX,tileY)
				Orion.AddFakeMapObject(i + 30000, '0x051A', 32, tileX, tileY, tileZ);
				}
            AliWalkTo(x,y,0,0,255,2,1,1,300000,false,SlowPoke);
            }
        Orion.ClearBadLocations();
        }
    Orion.Say('all stop');
    Orion.Say('all stay');
    Orion.Wait(200);
    Orion.Say('all stop');
    Orion.Say('all stay');
    Orion.Wait(200);
    Orion.Say('all follow me')
    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    }

function AsyncTame(mobSerial)
    {
    var startTime = Orion.Now();
    
    Shared.AddVar('leashDistance',3)
    Orion.UseSkill('Animal Taming');
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(mobSerial);
    var check = Orion.WaitJournal("You start to tame the creature.|You seem to anger the beast!|It's too far away.|You can't see that.|Someone else is already taming that creature.", startTime,startTime + 2000);
    Orion.Print(check.Text());
    if(check && check.Text() == '*You start to tame the creature.*')
        {
        Shared.AddVar('leashDistance',5)
        Orion.Wait(1000);
        // Orion.PauseScript('TameCu');
        // Orion.StopWalking();
        startTime = Orion.Now();
        var check2 = Orion.InJournal('The animal is too angry to continue taming.|It seems to accept you as master.|You fail to tame the creature.|You are too far away to continue taming.', '', '0', 'any', startTime, Orion.Now())
        while(!check2)
            {
            //WalkToRadiusBorder(mobSerial,5,1);
            Orion.Wait(500);
            check2 = Orion.InJournal('The animal is too angry to continue taming.|It seems to accept you as master.|You fail to tame the creature.|You are too far away to continue taming.', '', '0', 'any', startTime, Orion.Now())
            }
        }
    }
    
function StoreCu()
    {
    var serial = Shared.GetVar('cuSerial');
    if(!serial)
        serial = Orion.FindType('0x0115',any,'ground','canchangename',24)[0];
    while(Orion.ObjAtLayer('Mount'))
        {
        Orion.UseObject(self);
        Orion.Wait(1300);
        }
    while(Orion.GetDistance(serial) > 1)
        {
        Orion.Say('all follow me');
        Orion.Wait(1300);
        }
    while(!Orion.ObjAtLayer('Mount'))
        {
        Orion.UseObject(serial);
        Orion.Wait(1300);
        }
    AliWalkTo(1179,1287);
    var gate = Orion.FindTypeEx('0x0F6C',any,ground,'item',24)[0];
    if(gate)
        {
        AliWalkTo(gate.X(),gate.Y())
        Orion.UseObject(gate.Serial());
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000258');
            if(gump !== null)
                {
                var gumpHook = Orion.CreateGumpHook(1);
                gumpHook.AddCheck(28, true);
                gump.Select(gumpHook);
                Orion.Wait(3000);
                AliWalkTo(1024,500);
                while(Orion.ObjAtLayer('Mount'))
                    {
                    Orion.UseObject(self);
                    Orion.Wait(1300);
                    }
                while(Orion.FindObject(serial))
                    {
                    Orion.Say('stall')
                    if(Orion.WaitForTarget(3000))
                        {
                        Orion.TargetObject(serial);
                        Orion.Wait(3000);
                        }
                    }
                Orion.LogOut();
                }
            }
        }
    }

function RunToRepair()
	{
    if(Orion.ScriptRunning('TameCu') > 0)
        return;    
    var shards =
        {
            "Pacific": [3639,2098,'Trammel'],
            "Great Lakes": [778,746,'Trammel'],
            "Yamato": [798,755,'Trammel'],
            "Arirang": [738,791,'Trammel'],
            "Great Lakes": [778,746,'Trammel'],
            "Lake Austin": [1051,543,'Malas']
        }
    var shardName = Orion.ShardName();
    var repairArr = shards[shardName];
    if(!repairArr)
        return Orion.CharPrint(self,1159,"Looks like your shard isn't configured correctly. Don't forget to send Ali your shard's repair house coords! Instead of auto repairing, your character will die a slow and painful death!")
    
    Shared.AddVar('pauseStamp',Orion.Now());
    Orion.PauseScript('all','JournalScan|AliComFollower|AliComLeader|RunToRepair');
    Orion.Wait(500);
    Orion.Terminate('all','JournalScan|AliComFollower|AliComLeader|RunToRepair|CuGump');
	//RecallByGump('Main', 'Repair', 'Main', 'Repair2');
    
    AliAtlas(repairArr[0],repairArr[1],repairArr[2])
    var tempX = Player.X();
    var tempY = Player.Y();
	do
		{
        Orion.WarMode(0);
		Orion.Step('n');
		Orion.Wait(250);
		var bench = Orion.FindTypeEx('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 10)[0];
		} while(!bench)
    AliWalkTo(bench.X(),bench.Y(),0,1);
	RepairGear();
	Orion.Wait(1500);
    AliWalkTo(tempX,tempY);
	Orion.Exec('StartCuFarm',true);
	}

function AliAtlas(targetX,targetY,targetMap)
    { //[x,y,facet]
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var gateArr = 
        [//location name, facet, facet# x, y
            ['Moonglow', 'Trammel', 1, 4467, 1283],
            ['Britain', 'Trammel', 2, 1421, 1696],
            ['Jhelom', 'Trammel', 3, 1499, 3771],
            ['Yew', 'Trammel', 4, 771, 752],
            ['Minoc', 'Trammel', 5, 2701, 692],
            ['Trinsic', 'Trammel', 6, 1828, 2948],
            ['Skara Brae', 'Trammel', 7, 643, 2067],
            ['New Magincia', 'Trammel', 8, 3566, 2140],
            ['New Haven', 'Trammel', 27, 3450, 2677],
            ['Moonglow', 'Felucca', 9, 4467, 1283],
            ['Britain', 'Felucca', 10, 1421, 1696],
            ['Jhelom', 'Felucca', 11, 1499, 3771],
            ['Yew', 'Felucca', 12, 771, 752],
            ['Minoc', 'Felucca', 13, 2701, 692],
            ['Trinsic', 'Felucca', 14, 1828, 2948],
            ['Skara Brae', 'Felucca', 15, 643, 2067],
            ['New Magincia', 'Felucca', 16, 3566, 2140],
            ['Buccaneers Den', 'Felucca', 26, 2711, 2234],
            ['Compassion', 'Ilshenar', 17, 1215, 467],
            ['Honesty', 'Ilshenar', 18, 772, 1366],
            ['Honor', 'Ilshenar', 19, 744, 724],
            ['Humility', 'Ilshenar', 20, 281, 1016],
            ['Justice', 'Ilshenar', 21, 987, 1011],
            ['Sacrifice', 'Ilshenar', 22, 1174, 1286],
            ['Spirituality', 'Ilshenar', 23, 1532, 1340],
            ['Valor', 'Ilshenar', 24, 528, 216],
            ['Chaos', 'Ilshenar', 25, 1721, 218],
            ['Luna', 'Malas', 28, 1015, 527],
            ['Umbra', 'Malas', 29, 1997, 1386],
            ['Isamu-Jima', 'TerMur', 30, 1169, 998],
            ['Makoto-Jima', 'TerMur', 31, 802, 1204],
            ['Homare-Jima', 'TerMur', 32, 270, 628],
            ['Royal City', 'TerMur', 33, 850, 3525],
            ['Valley of Eodon', 'TerMur', 34, 719, 1863],
        ]

    if(Orion.GetDistance(targetX,targetY) < 250 && Orion.GetPathArray(targetX, targetY, 256, 0).length && maps[Player.Map()] == targetMap)
        {
        Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(1);
        AliWalkTo(targetX,targetY);
        Orion.WarMode(0);
        return;
        }
    var nearestGate = gateArr.filter(function(gate){return gate[1] == map})
    	//.filter(function(gate)
    	//{
    	//return Orion.GetPathArray(gate[3], gate[4], 256, 0).length
        //return Orion.GetDistance(gate[3],gate[4]) < 1000;
        //})
        .sort(function(a,b)
        	{
	        //return Orion.GetPathArray(a[3], a[4], 256, 0).length - Orion.GetPathArray(b[3], b[4], 256, 0).length
	        return Orion.GetDistance(a[3],a[4]) - Orion.GetDistance(b[3],b[4]);
	        })[0];
    var destinationGate = gateArr.filter(function(gate){return gate[1] == targetMap})
        .sort(function(a,b)
        {
        return DistBetweenPoints(targetX,targetY,a[3],a[4]) - DistBetweenPoints(targetX,targetY,b[3],b[4])
        })[0];
    Orion.Print(nearestGate[1] + ' - ' + nearestGate[0] + ' ' + nearestGate[3] + ', ' + nearestGate[4] + ':' + Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length)
    Orion.Print(destinationGate[1] + ' - ' + destinationGate[0] + ' ' + destinationGate[3] + ', ' + destinationGate[4])
    Orion.WarMode(1);
    
    Orion.CharPrint(self,1159,'Walking to nearest gate');
    AliWalkTo(nearestGate[3], nearestGate[4])
    //var tempX = Player.X();
    //var tempY = Player.Y();
    while(Orion.GetDistance(destinationGate[3],destinationGate[4]) > 10)
        {
        Orion.Print('Waiting for gate gump')
        var gump = Orion.GetGump('any','0x00000258');
        if(gump !== null)
            {
            var gumpHook = Orion.CreateGumpHook(1);
            gumpHook.AddCheck(destinationGate[2], true);
            gump.Select(gumpHook);
            Orion.Wait(100);
            }
        else
            {
            var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 24);
            Orion.CharPrint(self,1159,'Searching for gate');
            if(gate[0])
                {
                Orion.CharPrint(self,1159,'Walking to gate');
                AliWalkTo(gate[0].X(), gate[0].Y());
                Orion.Wait(500);
                Orion.Resend();
                Orion.Wait(500);
                Orion.UseObject(gate[0].Serial());
                }
            else 
                {
                Orion.CharPrint(self,1159,'Walking to nearest gate');
                if(!AliWalkTo(nearestGate[3], nearestGate[4]))
                    if(!AliWalkTo(1174, 1283))
                        AliWalkTo(1016, 524);
                }
            }
        Orion.Wait(1000);
        }
    Orion.WarMode(1);
    Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
    AliWalkTo(targetX,targetY);
    Orion.WarMode(0);
    }

function MapDetectionFix()
    {
    Orion.CharPrint(self,1159,'Map detection bugged! Fixing by changing facets')
    if(Orion.GetDistance(1174,1285) < 250)
        AliWalkTo(1174,1285); //ilshenar
    else if(Orion.GetDistance(1017,525) < 250)
        AliWalkTo(1017,525); //luna
    else if(Orion.GetDistance(773,750) < 250)
        AliWalkTo(773,750); //tram yew
    var gate = Orion.FindTypeEx('0x0F6C',any,ground,'near|item',24)[0];
    if(gate)
        {
        AliWalkTo(gate.X(),gate.Y())
        var gump = Orion.GetGump('any','0x00000258');
        while(!gump)
            {
            Orion.UseObject(gate.Serial());
            Orion.Wait(1300);
            gump = Orion.GetGump('any','0x00000258');
            }
        var gumpHook = Orion.CreateGumpHook(1);
        gumpHook.AddCheck(31, true);
        gump.Select(gumpHook);
        Orion.Wait(3000);
        var gate2 = Orion.FindTypeEx('0x0F6C',any,ground,'near|item',24)[0];
        if(gate2)
            {
            var gump2 = Orion.GetGump('any','0x00000258');
            while(!gump2)
                {
                Orion.UseObject(gate2.Serial());
                Orion.Wait(1300);
                gump2 = Orion.GetGump('any','0x00000258');
                }
            var gumpHook2 = Orion.CreateGumpHook(1);
            gumpHook2.AddCheck(22, true);
            gump2.Select(gumpHook2);
            Orion.Wait(3000);
            }
        }
    if(Player.Map() !== 0)
        Orion.CharPrint(self,1159,'Map detection fixed!');
    else
        {
        Orion.CharPrint(self,1159,'Map detection still bugged! Retrying...')
        return MapDetectionFix();
        }
    }

function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,callBackFn)
    {
    var pathMarkers = false;
    if(z === undefined) z = 0;
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;

    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    if(pathMarkers)
        Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0)
        return false;
	var shortStop = pathTiles[pathTiles.length - 1];
	var shortX = shortStop.X();
	var shortY = shortStop.Y();
    if(pathMarkers)
        {
        pathTiles.forEach(function(tile,i)
            {
            Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            })
        Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
        }
    if(pathTiles.length >= chunkSize)
        var chunk = pathTiles[chunkSize - 1];
    else
        var chunk = shortStop;
    var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
    if(pathMarkers)
        Orion.AddFakeMapObject(10000, '0x051A', 32, x,y,Player.Z());
    Orion.WalkTo(chunkX,chunkY,chunkZ,0,distanceZ,run,openDoor,maxWalkingTime);
    Orion.Wait(1);
	if(callBackFn !== undefined)
		callBackFn();
    if(Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,callBackFn);
    return true;
    }

function WalkToRadiusBorder(targetSerial, distance) 
	{
	var target = Orion.FindObject(targetSerial)
	if(target) 
		{
		var x = target.X();
		var y = target.Y();
		var z = target.Z();
	
		var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, z - 8, x + distance, y + distance, z + 8)
			.filter(function(tile) 
				{
				var tileX = tile.X();
				var tileY = tile.Y();
				return (x == (tileX - distance))
				|| (x == (tileX + distance))
				|| (y == (tileY - distance))
				|| (y == (tileY + distance));
				}).sort(function (a,b) 
					{
					return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y())
					});
		tiles.forEach(function(tile,ind)
			{
			Orion.AddFakeMapObject(ind + 40000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
			})
		for(var i=0;i<tiles.length;i++)
			{             
			var closest = tiles[i]; 
			if(Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0))
				break;
			}
		}
	}

function DiscordPush(message)
	{
	var bot = Shared.GetVar('discordLink',false);
    if(!bot)
        {
        bot = "https://discordapp.com/api/webhooks/" + profile.discordHook + "/" + profile.discordKey;
        Shared.AddVar('discordLink',bot);
        }
	Orion.HttpPost(bot, "content=" + message);
	}

function JournalScan()
	{
	var useDiscordPush = profile.useDiscordPush;
	var useAlarmSound = true//profile.useAlarmSound;
	var journalScanType = profile.journalScanType;
	var msg = 'GM'
	if(Orion.Contains(journalScanType, 'Equipment Damage'))
		msg += '|equipment is severely';
	if(Orion.Contains(journalScanType, 'Control Messages'))
		msg += '|inithome|initfarm|initscripts|haltscripts|closefollow'
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0);
		var checkarr = Orion.Split(check.Text(), ' ')
		for(var i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{		
				case 'GM':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": GM")
					if(useAlarmSound)
						Orion.PlayWav('GMAlert.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					Orion.Terminate('all', 'JournalScan');
					Orion.Wait(1000);
                    Orion.StopWalking();
					Orion.OAOptionSet('AutoReconnect', '0');
					//Orion.CloseUO();
					Orion.Wait(6000);
					break;
				case 'severely':
					if(useDiscordPush)
						DiscordPush(Player.Name() + ": Equipment is damaged")
					//if(useAlarmSound)
						//Orion.PlayWav('Alarm.wav'); //default sound can be changed by putting a different .wav in the Ultima Online Classic folder.
					//Orion.Terminate('all', 'JournalScan');
					Orion.Exec('RunToRepair',true);
					break;
				default:
					break;
				}
			}
		}
	}

function BuffMonitor()
	{
	var color = { //[textColorHue,barColorRRGGBBAA]
		'red': [32,'0xFF0000FF'],
		'tangle': [1159,'0xF0FF0BFF']
	}
	var goodActive = color.tangle;
	var badActive = color.red;

	var buffs = [ //buffID,buffCooldown,timerPosition,timerName,xOffset,yOffset,textColor,font,backgroundColor,cooldownColorObj,dispelWarning,persistentBuff
		['Evasion', 20000, 'underChar','Evasion', 0, 40,goodActive[0], -1, goodActive[1], badActive],
		['Blood Oath', 0, 'aboveChar','BLOODOATH', 100, -40,badActive[0], -1, badActive[1]],
		['Vampiric Embrace', 60000, 'aboveChar','VE Missing!', -100, 40,badActive[0], -1, '0x00000000', false, true],
		['Hiding', 60000, 'underChar','Hidden', 100, 40,goodActive[0], -1, '0x00000000',false,false,true],
	]

	while(true)
		{
		//var startTime = Orion.Now();
		Orion.Wait(100);
		for(var i=0;i<buffs.length;i++)
			{
			var buff = buffs[i];
			if(Orion.BuffExists(buff[0]))
				{
				if(buff[10])
					Orion.RemoveDisplayTimer(buff[0]);
				else if(!Orion.DisplayTimerExists(buff[0]))
					{
					Orion.AddDisplayTimer(buff[0], buff[1] + Orion.BuffTimeRemaining(buff[0]), buff[2], 'bar', buff[3], buff[4], buff[5], buff[6], buff[7], buff[8]);
					if(buff[9])
						buff[9][2] = false;
					else if(buff[11])
						Orion.DisplayTimerSetShowTime(buff[0], false);
					}
				}
			else if(Orion.DisplayTimerExists(buff[0]))
				{
				if(buff[9])
					{
					Orion.DisplayTimerSetColorStage(buff[0], 100, buff[9][0], buff[9][1]);
					buff[9][2] = true;
					}
				else if(buff[11])
					{
					Orion.RemoveDisplayTimer(buff[0]);
					}
				}
			else if(buff[10])
				{
				Orion.AddDisplayTimer(buff[0], buff[1], buff[2], 'bar', buff[3], buff[4], buff[5], buff[6], buff[7], buff[8]);
				Orion.Wait(10)
				Orion.DisplayTimerSetShowTime(buff[0], false);
				}
			}
		//Orion.Print('Interval: ' + (Orion.Now() - startTime))
		}
	}

function AutoAttack()
    {
    //Orion.Exec('AutoBuffs',true);
    var useSingleTargetSpecial = profile.useSingleTargetSpecial;
    var singleTargetSpecial = profile.singleTargetSpecial;
    var useMomentumStrike = profile.useMomentumStrike;
    var useWhirlwind = profile.useWhirlwind;
    var whirlwindSpecial = profile.whirlwindSpecial;
	var useOnslaught = profile.useOnslaught;
    while(!Player.Dead())
        {
        var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 2, 'gray|red|criminal|orange');
        var enemyCount = enemies.length;
        if(enemyCount)
            Orion.Attack(enemies[0]);
        switch(enemyCount)
            {
            case 0:
                break;
            case 1:
				if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
					{
					Orion.Cast('Onslaught');
					var startTime = Orion.Now();
					var endTime = startTime + 3000;
					var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
					if(check)
						Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
					}
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
                break;
            case 2:
                if(useMomentumStrike)
                    {
                    if(!Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    }
                else if(useWhirlwind)
                    {
                    if(!Orion.AbilityStatus(whirlwindSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    }
                else if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
                    {
                    Orion.Cast('Onslaught');
                    var startTime = Orion.Now();
                    var endTime = startTime + 3000;
                    var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
                    if(check)
                        Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
                    }
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
                break;
            default: //more than 2 enemies
                if(useWhirlwind)
                    {
                    if(!Orion.AbilityStatus(whirlwindSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    }
                else if(useMomentumStrike)
                    {
                    if(!Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    }
                else if(useOnslaught && !Orion.DisplayTimerExists('onslaughtTimer'))
                    {
                    Orion.Cast('Onslaught');
                    var startTime = Orion.Now();
                    var endTime = startTime + 3000;
                    var check = Orion.WaitJournal("You deliver an onslaught of sword strikes!",startTime,endTime)
                    if(check)
                        Orion.AddDisplayTimer('onslaughtTimer', 6000, 'underChar', 'bar', 'Onslaught!', -100, 40, '1159', -1, '0xF0FF0BFF');
                    }
                else if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                    Orion.UseAbility(singleTargetSpecial);
                break;
            }
        Orion.Wait(500);
        }
    }

function AutoEvade()
	{
	Orion.Exec('BuffMonitor',true);
	Shared.AddVar('AutoEvade',true);
	var lowestHPPercent = 30;
	var highestHPPercent = 50;
	while(!Player.Dead())
		{
		var count = Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red').length;
		if(!Orion.DisplayTimerExists('Evasion') && !Orion.BuffExists('Evasion') && Player.Hits('%') < Math.min((lowestHPPercent + (2 * count)), highestHPPercent))
			Orion.Cast('Evasion');
		Orion.Wait(100);
		}
	}

function EquipTamingSuitByBotName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var setname = _pName + ' Taming Suit'
    Orion.Dress(setname);
    }

function EquipRegularSuitByBotName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var setname = _pName + ' Regular Suit'
    Orion.Dress(setname);
    }

function RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle) 
	{
	//to be able to rotate through a runebook, ensure rotateToggle is set to true and
	//create global scope variable runeIndex to increment through the book starting from '1'
	//global variable numRunes declares total runes to increment through
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    if(rotateToggle == undefined)
        var rotateToggle = false;
    var x = Player.X(); //noting player start position to check later to see if recall was successful
	var y = Player.Y();
	var runeBook = Orion.FindTypeEx('0x22C5').filter(function(part)
        {
        return part.Properties().match(/.+$/) == bookName; //this is using Regex to find the last line of the item properties i.e., the runebook name
        });
    if(!runeBook[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return false;
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
    	var startInd = 50; //recall index
	else if(Orion.SkillValue('Chivalry', 'base') >= 600)
		var startInd = 75; //sacred journey index
    else
        var startInd = 10; //recall scroll index
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
	var runebookSerial = runeBook[0].Serial();
    Orion.Wait(1300);
	Orion.UseObject(runebookSerial);
	var gump = WaitForSpecificGump(2000, 'generic', runebookSerial, '0x00000059');
	if(gump)
		{
		var runeInd = gump.TextList().indexOf(runeName) - 2;
		if(runeInd < 0)
			Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
		if(gump !== null)
			{
			gump.Select(Orion.CreateGumpHook(startInd + runeInd));
			Orion.Wait(200);
			}
        Orion.CloseGump('generic', gump.Serial());
		}
	var startJournal = Orion.Now();
	var endWait = startJournal + 5000;
	while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
		{
		if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
			{
	        Orion.Wait(2000);
	        if(rotateToggle && backupBook == 'skipDoubleBlocked')
	            {
	            //BotPush('Double Blocked at ' + eggIndex);
	            var runeIndexNum = +runeIndex + 1 
	            if(runeIndexNum <= numRunes)
					runeIndex = String(runeIndexNum); 
	            else
					runeIndex = '1';
	            return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	            }
	        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
	            {
	            return part.Properties().match(/.+$/) == backupBook;
	            })[0];
	        if(rotateToggle && backup)
	            return RecallByGump(backupBook, backupRune, 'skipDoubleBlocked', 'skipDoubleBlocked',rotateToggle);
            else if(backup)
                return RecallByGump(backupBook, backupRune, bookName, runeName);
	        else
	            Orion.Print("No backup runebook named '" + backupBook + "' found!");
	        }
	    else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
	        {
	        Orion.Wait(2000);
            if(rotateToggle)
                {
                var runeIndexNum = +runeIndex + 1 
                if(runeIndexNum <= numRunes)
                    runeIndex = String(runeIndexNum); 
                else
                    runeIndex = '1';
                }
	        return RecallByGump(bookName,runeIndex,backupBook,runeIndex,rotateToggle);
	        }
		Orion.Wait(500);
		}
	Orion.Wait(1000);
	Orion.Resend();
	Orion.Wait(200);
	if(x == Player.X() && y == Player.Y()) 
        return RecallByGump(bookName,runeName,backupBook,backupRune,rotateToggle);
	}

function WaitForSpecificGump(delay, type, serial, id)
	{
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
	    Orion.Wait(10);
	if(Orion.GumpExists(type, serial, id))
		return Orion.GetGump(serial, id);
	return false;
	}

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }

function DropDraggedToContainer() //v2
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer');
	if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}

function RepairGear()
	{//v1
    Orion.ResetSearchArea();
    var RepairGearVersion = '1';
    var durabilityThreshold = 80; //Durability below which to repair
	//Equipment with less than 2 * durabilityThreshold will appear in yellow

    var tinkerLowAlarm = true; //Leave false to ignore this repair type for the alarm
    var blacksmithLowAlarm = true; //Set to true to get an alarm for this repair type running low
    var carpentryLowAlarm = true;
    var tailorLowAlarm = true;
    var masonryLowAlarm = false;
    var glassblowingLowAlarm = false;
    var fletchingLowAlarm  = false;
	
    var alarmThreshold = 20; //If the repair bench gets below this number of scrolls for a repair type, send a discord message

	var flavorText = false; //adds overhead emotes describing the amount of items you need to repair
    
    var repairDict = 
        { //graphicString: buttonCode
        // tinker: 2001 | tinker: 2001 | bsmith: 2002 | carpenter: 2003 | tailor: 2006 | fletcher: 2009 | masonry: 2010
        '0x2D2D': 2002,'0x2D21': 2002,'0x0F4A': 2002,'0x0F49': 2002,'0x0F4E': 2002,'0x0F4D': 2002,'0x0F48': 2002,'0x0F47': 2002,'0x0DF0': 2003,'0x0DF1': 2003,'0x26BD': 2002,'0x26C7': 2002,'0x27A8': 2003,'0x26BB': 2002,'0x26C5': 2002,'0x13B1': 2009,'0x13B2': 2009,'0x0F5F': 2002,'0x0F5E': 2002,'0x1B72': 2002,'0x1B73': 2002,
        '0x26CB': 2002,'0x13F4': 2003,'0x13F5': 2003,'0x0F50': 2009,'0x0F4F': 2009,'0x1440': 2002,'0x1441': 2002,'0x0F52': 2002,'0x0F51': 2002,'0x27A9': 2002,'0x2D30': 2002,'0x2D24': 2002,'0x0F4C': 2002,'0x0F4B': 2002,'0x26BF': 2002,'0x26C9': 2002,'0x2D2A': 2009,'0x2D1E': 2009,'0x2D35': 2002,'0x2D29': 2002,'0x2D2C': 2002,
        '0x2D20': 2002,'0x0F46': 2002,'0x0F45': 2002,'0x13F9': 2003,'0x13F8': 2003,'0x143E': 2002,'0x143F': 2002,'0x143C': 2002,'0x143D': 2002,'0x0F44': 2001,'0x0F43': 2001,'0x1B77': 2002,'0x1B76': 2002,'0x13FC': 2009,'0x13FD': 2009,'0x27AD': 2002,'0x13FE': 2002,'0x13FF': 2002,'0x1400': 2002,'0x1401': 2002,'0x27A7': 2002,
        '0x26C0': 2002,'0x26CA': 2002,'0x13FA': 2002,'0x13FB': 2002,'0x2D2E': 2002,'0x2D22': 2002,'0x0F60': 2002,'0x0F61': 2002,'0x0F5D': 2002,'0x0F5C': 2002,'0x2D2B': 2009,'0x2D1F': 2009,'0x143A': 2002,'0x143B': 2002,'0x1B75': 2002,'0x1B74': 2002,'0x1B7B': 2002,'0x27A2': 2002,'0x27AE': 2001,'0x1BC5': 2002,'0x1BC4': 2002,
        '0x2D34': 2002,'0x2D28': 2002,'0x0E85': 2001,'0x0E86': 2001,'0x26BE': 2002,'0x26C8': 2002,'0x0E88': 2001,'0x0E87': 2001,'0x0E8A': 2003,'0x0E89': 2003,'0x2D33': 2002,'0x2D27': 2002,'0x26C3': 2009,'0x26CD': 2009,'0x2D32': 2002,'0x2D26': 2002,'0x27AF': 2002,'0x26BC': 2002,'0x26C6': 2002,'0x13B5': 2002,'0x13B6': 2002,
        '0x26BA': 2002,'0x26C4': 2002,'0x1402': 2002,'0x1403': 2002,'0x0EC5': 2001,'0x0EC4': 2001,'0x0FB4': 2001,'0x0FB5': 2001,'0x13E3': 2001,'0x13E4': 2001,'0x0F63': 2002,'0x0F62': 2002,'0x1B79': 2002,'0x1B78': 2002,'0x27AB': 2002,'0x27A3': 2002,'0x27A6': 2003,'0x1442': 2002,'0x1443': 2002,'0x13BA': 2002,'0x13B9': 2002,
        '0x27A4': 2002,'0x13AF': 2002,'0x13B0': 2002,'0x2D2F': 2002,'0x2D23': 2002,'0x1404': 2002,'0x1405': 2002,'0x1438': 2002,'0x1439': 2002,'0x1406': 2002,'0x1407': 2002,'0x2D31': 2003,'0x2D25': 2003,'0x1B7A': 2003,'0x27A5': 2009,'0x153F': 2006,'0x140D': 2002,'0x140C': 2002,'0x1545': 2006,'0x1454': 2006,'0x144F': 2006,
        '0x144E': 2006,'0x1453': 2006,'0x1450': 2006,'0x1455': 2006,'0x1451': 2006,'0x1456': 2006,'0x1457': 2006,'0x1452': 2006,'0x1F06': 2001,'0x1086': 2001,'0x13BB': 2002,'0x13C0': 2002,'0x2774': 2002,'0x13C3': 2002,'0x13BE': 2002,'0x13C4': 2002,'0x13BF': 2002,'0x1409': 2002,'0x1408': 2002,'0x2778': 2002,'0x1547': 2006,
        '0x171A': 2006,'0x1C07': 2006,'0x1C06': 2006,'0x1C05': 2002,'0x1C04': 2002,'0x1713': 2006,'0x2777': 2002,'0x140B': 2002,'0x140A': 2002,'0x2B75': 2006,'0x2B76': 2006,'0x2B78': 2006,'0x2B77': 2006,'0x2B74': 2006,'0x171C': 2006,'0x2798': 2006,'0x2FC8': 2006,'0x2FC6': 2006,'0x2FC7': 2006,'0x2FC9': 2006,'0x2FCA': 2006,
        '0x2FC5': 2006,'0x1C0B': 2006,'0x1C0A': 2006,'0x1DB9': 2006,'0x1DBA': 2006,'0x277B': 2006,'0x13C6': 2006,'0x13CE': 2006,'0x13C7': 2006,'0x278A': 2006,'0x277E': 2006,'0x2776': 2006,'0x13D2': 2006,'0x13CB': 2006,'0x277A': 2006,'0x278E': 2006,'0x2793': 2006,'0x2792': 2006,'0x2791': 2006,'0x1C01': 2006,'0x1C00': 2006,
        '0x1C09': 2006,'0x1C08': 2006,'0x13C5': 2006,'0x13CD': 2006,'0x2786': 2006,'0x13D3': 2006,'0x13CC': 2006,'0x2781': 2002,'0x140F': 2002,'0x140E': 2002,'0x1F0B': 2006,'0x1F0C': 2006,'0x141B': 2006,'0x1412': 2002,'0x1419': 2002,'0x1410': 2002,'0x1417': 2002,'0x2785': 2002,'0x277D': 2002,'0x1414': 2002,'0x1418': 2002,
        '0x1413': 2002,'0x278D': 2002,'0x2775': 2002,'0x2780': 2002,'0x141A': 2002,'0x1411': 2002,'0x2779': 2002,'0x2788': 2002,'0x1416': 2002,'0x1415': 2002,'0x2B71': 2003,'0x1F09': 2001,'0x108A': 2001,'0x13EB': 2002,'0x13F2': 2002,'0x13F1': 2002,'0x13F0': 2002,'0x13EF': 2002,'0x13EE': 2002,'0x13ED': 2002,'0x13EC': 2002,
        '0x1543': 2006,'0x2784': 2002,'0x2789': 2002,'0x1717': 2006,'0x1C03': 2006,'0x1C0D': 2006,'0x1C0C': 2006,'0x277C': 2006,'0x13D5': 2006,'0x13DD': 2006,'0x13D6': 2006,'0x278B': 2006,'0x277F': 2006,'0x13E1': 2006,'0x13DA': 2006,'0x279D': 2006,'0x13D4': 2006,'0x13DC': 2006,'0x2787': 2006,'0x13E2': 2006,'0x13DB': 2006,
        '0x1716': 2006,'0x1549': 2006,'0x154B': 2006,'0x171B': 2006,'0x2B72': 2003,'0x1714': 2006,'0x2B73': 2003,'0x1718': 2006,'0x2B6C': 2003,'0x2B67': 2003,'0x2B6A': 2003,'0x2B69': 2003,'0x2B6B': 2003,'0x153B': 2006,'0x2643': 2002,'0x1541': 2006,'0x2647': 2002,'0x2FB8': 2001,'0x1087': 2001,'0x4049': 2006,'0x404C': 2006,
        '0x4047': 2006,'0x4D0A': 2010,'0x4066': 2006,'0x4644': 2001,'0x405A': 2010,'0x0284': 2006,'0x4056': 2002,'0x4D0B': 2002,'0x4211': 2001,'0x090A': 2002,'0x030A': 2002,'0x404E': 2006,'0x4050': 2002,'0x405C': 2010,'0x405D': 2010,'0x4058': 2010,'0x46B5': 2006,'0x4062': 2006,'0x404B': 2006,'0x4057': 2010,'0x46B4': 2006,
        '0x4052': 2002,'0x13F7': 2001,'0x13F6': 2001,'0x1BC3': 2002,'0x0EC2': 2001,'0x0EC3': 2001,'0x13B3': 2003,'0x13B4': 2003,'0x26C2': 2009,'0x26CC': 2009,'0x26C1': 2002,'0x2F5B': 2001,'0x1712': 2006,'0x170D': 2006,'0x2309': 2006,'0x27A0': 2006
        }

    //Do not edit below
	var layers = [0,'RightHand','LeftHand','Shoes','Pants','Shirt','Helmet','Gloves','Ring','Talisman','Necklace','Hair','Waist','InnerTorso','Bracelet','Face','Beard','MidTorso','Earrings','Arms','Cloak','Backpack','Robe','Eggs','Legs']
	Orion.Print("Repair threshold set at: " + durabilityThreshold)
    var outStrs = [];
	for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
            if(!objDict && Orion.Contains(objProperties, 'Durability'))
                Orion.Print('Item needs to be added: ' + obj.Graphic() + ': ' + obj.Name())
			else if(Orion.Contains(objProperties, 'Durability'))
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold * 2 && min < max)
                    outStrs.push(layers[obj.Layer()] + ':::' + obj.Name() + ':::' + min + ':::' + max);
      			}
    		}
  		}
    if(!outStrs[0])
    	{
    	var gump = Orion.CreateCustomGump(11420);
    	if(gump)
    		gump.Close()
        if(flavorText)
            return Orion.CharPrint(self,1159,'*You check your equipment and find it is in perfect condition*')
        return Orion.CharPrint(self,1159,'No repairs necessary')
        }
    else if(!flavorText)
        Orion.Wait(1);
    else if(outStrs.length == 1)
        Orion.CharPrint(self,1159,'*You check your equipment and find something in need of repair*')
    else if(outStrs.length < 3)
        Orion.CharPrint(self,1159,'*You check your equipment and find some things that need your attention*')
    else if(outStrs.length < 8)
        Orion.CharPrint(self,1159,"*You check your equipment and make a mental note to not get hit so much in the future*") 
    else if(outStrs.length < 20)
        Orion.CharPrint(self,1159,"*You check what's left of your equipment and marvel that any of it is still attached to you given its abysmal condition*")
    outStrs.sort(function(a,b)
    	{
    	var aSplit = Orion.Split(a,':::');
    	var bSplit = Orion.Split(b,':::');
    	var aMin = aSplit[2];
    	var bMin = bSplit[2];
    	var aMax = aSplit[3];
    	var bMax = bSplit[3];
    	return (aMax - aMin) - (bMax - bMin);
    	});
    var rowAdj = 20;
    var rowMargin = 20;
    var columnMargin = 25;
    var width = 450;
    var height = (outStrs.length * rowAdj) + (rowMargin * 2);
    var gump = Orion.CreateCustomGump(11420);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, width, height);
    // gump.AddColoredPolygone(1, 2, width - 3, height - 6, '#FF000000', 1, 7, 1); //gump border
    for(var i=0;i<outStrs.length;i++)
        {
        var textColor = '0';
        var str = outStrs[i];
        var strSplit = Orion.Split(str,':::');
        var layerName = strSplit[0];
        var itemName = strSplit[1];
        var minDura = +strSplit[2];
        var maxDura = +strSplit[3];
        if(minDura < durabilityThreshold)
            textColor = '32';
        else if(minDura < durabilityThreshold * 2)
            textColor = '53'
        gump.AddText(columnMargin, rowMargin + (rowAdj * i), '0', layerName, width - 250);
        gump.AddText(columnMargin + 100, rowMargin + (rowAdj * i), textColor, itemName, width - 250);
        gump.AddText(columnMargin + 320, rowMargin + (rowAdj * i), textColor, minDura + '/' + maxDura, width - 250);
        }
    gump.AddText(415 ,height - 25,0,"v" + RepairGearVersion)
    gump.Update();
    for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
			if(Orion.Contains(objProperties, 'Durability') && objDict)
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold && min < max)
			        {
				    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
			        if(bench)
			        	{
			        	var repairType = objDict;
                        var endTime = Orion.Now() + 10000;
                        var repairGump = Orion.GetGump(any, '0x00002415');
				        while(!repairGump && Orion.Now() < endTime)
                            {
                            Orion.UseObject(bench);
				        	Orion.WaitForGump(2000);
                            repairGump = Orion.GetGump(any, '0x00002415');
                            }
                        if(repairGump !== null)
                            {
                            repairGump.Select(Orion.CreateGumpHook(repairType));
                            var tinkerCount = tinkerLowAlarm && +repairGump.Text(1) < alarmThreshold;
                            var blacksmithCount =  blacksmithLowAlarm && +repairGump.Text(3) < alarmThreshold;
                            var carpentryCount =  carpentryLowAlarm && +repairGump.Text(5) < alarmThreshold;
                            var tailorCount =  tailorLowAlarm && +repairGump.Text(7) < alarmThreshold;
                            var masonryCount =  masonryLowAlarm && +repairGump.Text(9) < alarmThreshold;
                            var glassblowingCount =  glassblowingLowAlarm && +repairGump.Text(11) < alarmThreshold;
                            var fletchingCount = fletchingLowAlarm && +repairGump.Text(13) < alarmThreshold;
                            if(tinkerCount || blacksmithCount || carpentryCount || tailorCount || masonryCount || glassblowingCount || fletchingCount)
                                Orion.CharPrint(self,32,'Check repair bench!')  //DiscordPush(Orion.ShardName() + ': Check repair bench!');
                            if(Orion.WaitForTarget(2000))
                                Orion.TargetObject(obj.Serial());
                            }
                        Orion.WaitForGump(2000);
				        }		   
			        }
      			}
    		}
        Orion.Wait(100);
  		}
    Orion.Wait(1000);
    for(var i=1;i<layers.length;i++)
        {
        if(Orion.ObjAtLayer(i))
            {
            var obj = Orion.ObjAtLayer(i);
            var objProperties = obj.Properties();
            var objDict = repairDict[obj.Graphic()];
            if(objDict && Orion.Contains(objProperties, 'Durability'))
                {
                var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/);
                var min = +dura[1];
                var max = +dura[2];
                if(dura[0] && min < durabilityThreshold && min < max)
                    {
                    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
                    if(bench)
                        return RepairGear();
                    }                   
                }
            }
        }
    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
    gump = Orion.CreateCustomGump(11420);
    if(bench && gump)
        gump.Close();
    CloseAllGumps();
	}

function DropDraggedHere() //v2
    {
    var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
        .filter(function(tile)
            {
            Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
            var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
            var itemCheck = Orion.FindType(any,any,ground,'item').length < 5;
            return mobCheck && itemCheck;
            });
    Orion.ResetSearchArea();
    var validTile = null;
    for(var i=0;i<validTiles.length;i++)
        {
        if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
            {
            validTile = validTiles[i];
            break;
            }
        }
    if(validTile)
        {
        var validTileX = validTile.X();
        var validTileY = validTile.Y();
        var validTileZ = validTile.Z();
        Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
        Orion.DropDraggedItem(ground, validTileX, validTileY, validTileZ);
        }
    else 
        Orion.CharPrint(self, 1159, 'No valid tiles nearby!');    
    }

function CloseAllGumps()
    {
    var endTime = Orion.Now() + 3000;
    var gump = Orion.GetGump(any);
    while(gump && Orion.Now() < endTime)
        {
        Orion.Print(gump.ID());
        gump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        gump = Orion.GetGump(any);
        }
    }
//--#END