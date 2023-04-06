//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliGumpHUD.js
var profiles = 
    {
    Cu: 
        {
        walkThrough: 'Cu',
        mobGraphic: '0x0115|0x007A|0x0080', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useWhirlwind: false, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useEnemyOfOne: false, //true , false.
        useCounterAttack: true, //true , false.
        useConsecrateWeapon: false, //true , false.
        useDivineFury: false, //true , false.
        useAutoLoot: false, //true, false.
        useConfidence: true, //true , false.
            useConfidenceThresholdPercent: 70, //Percentage of self HP to attempt to cast confidence
        useBandieSelf: false, //true , false.
            useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
        useBandieOthers: false, //true , false.
            useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: 'GM|Equipment Damage', //'GM' 'Control Messages', 'Equipment Damage'
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

function CuGump()
    {
    Shared.ClearVars();
    var startTime = Shared.GetVar('startTime',Orion.Now())
    Shared.AddVar('startTime',Orion.Now())
    

    var y = 25;
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport.json';
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
    gump.SetNoClose(false);
    gump.SetCallback('CuGumpCallback')
    gump.Clear();
    gump.AddResizepic(0, 0, 0xDAC, 350, 500);
    gump.AddText(x1 + 60,y,0,'<h2>Current Session</h2>'); //Titles
    gump.AddText(x4,y,0,'<h2>All Time</h2>');
    y += yAdj;
    y += yAdj;
    gump.AddText(x1,y,0,'Plain:');
    gump.AddText(x2,y,0,currentObj['0x0000'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0000'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Paragon:');
    gump.AddText(x2,y,0,currentObj['0x0501'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0501'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Dull Copper:');
    gump.AddText(x2,y,0,currentObj['0x0978'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0978'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Copper:');
    gump.AddText(x2,y,0,currentObj['0x05A7'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x05A7'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Bronze:');
    gump.AddText(x2,y,0,currentObj['0x08AA'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x08AA'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Rose:');
    gump.AddText(x2,y,0,currentObj['0x097A'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x097A'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Grey:');
    gump.AddText(x2,y,0,currentObj['0x0901'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0901'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Echo:');
    gump.AddText(x2,y,0,currentObj['0x0527'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0527'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Valorite:');
    gump.AddText(x2,y,0,currentObj['0x08AC'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x08AC'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Sky:');
    gump.AddText(x2,y,0,currentObj['0x0515'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0515'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Ice:');
    gump.AddText(x2,y,0,currentObj['0x0482'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0482'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Pink:');
    gump.AddText(x2,y,0,currentObj['0x04B1'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x04B1'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Red:');
    gump.AddText(x2,y,0,currentObj['0x0674'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0674'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Black:');
    gump.AddText(x2,y,0,currentObj['0x0455'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0455'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'White:');
    gump.AddText(x2,y,0,currentObj['0x0481'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0481'],textWidth,s++);
    y += yAdj;
    gump.AddText(x1,y,0,'Blaze:');
    gump.AddText(x2,y,0,currentObj['0x0489'],textWidth,s++);
    gump.AddText(x4,y,0,totalObj['0x0489'],textWidth,s++);
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
        var gump = Orion.CreateCustomGump(15001);
        gump.Close();
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
        Orion.Exec('BuffMonitor',true);
	DiscordPush(Player.Name() + ' progressing spawn');
    var waypoints = 
    [
        [1252, 1218],
        [1406, 1215],
        [1406, 1258],
        [1253, 1257],
    ]
	Orion.Exec('AutoAttack',true);
	Orion.Exec('AttackSpawn',true);
	Orion.Exec('AutoEvade',true);
	Orion.Exec('RareAlert',true);
	Orion.Exec('JournalScan',true);
	Orion.Exec('CuGump',true);
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
            if(mobColor == '0x0489')
                {
                outMsg = Player.Name() + ': BLAZE CU FOUND!';
                Orion.PlayWav('BlazeCuFound.wav')
                BlazeProtocol(mobSerial,mobColor,outMsg);
                }
            else if(Orion.Contains('0x0455|0x0481',mobColor))
                {
                var parse = LoreParser(mobSerial);
                if(parse.length)
                    {
                    outCharMsg = JSON.stringify(parse);
                    if(parse[0] == 600 && parse[1] == 70 && parse[2] == 70)
                        {
                        outMsg = Player.Name() + ': High Intensity ' + cuHue[mobColor] + ' Cu Found!';
                        BlazeProtocol(mobSerial,mobColor,outMsg);
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
            //             BlazeProtocol(mobSerial,mobColor,outMsg);
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

function BlazeProtocol(mobSerial,mobColor,outMsg)
    {
    Orion.PlayWav('alarm.wav');
    var mob = Orion.FindObject(mobSerial);
    var destX = 1349;
    var destY = 1349;
    var path = Orion.GetPathArray(destX,destY,0,0)
    path.forEach(function(tile,ind)
        {
        Orion.AddFakeMapObject(ind + 10000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        })
    Orion.StopWalking();
    Orion.PauseScript('AttackSpawn')
    Orion.PauseScript('WalkSpawn')
    Orion.PauseScript('AutoAttack')
    AliWalkTo(mob.X(),mob.Y(),mob.Z(),5)
    Orion.Attack(mobSerial);
    Orion.WarMode(0);
    Shared.AddVar('cuSerial',mobSerial);
    AppendColor(mobColor);
    DiscordPush(outMsg);
    Orion.Wait(100);
    DiscordPush(outMsg);
    Orion.Wait(100);
    AliWalkTo(destX,destY,0,0,255,10,1,1,300000,SlowPoke)
    Orion.Wait(500);
    HonorSelf();
    Orion.WarMode(0);
    Orion.Wait(1000);
    DiscordPush(outMsg);
    Orion.Wait(100);
    DiscordPush(outMsg);
    Orion.Wait(100);
    AliWalkTo(1252, 1218)
    Orion.ResumeScript('all');
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
	var dex = Math.floor(+textList[5].slice(17).slice(0,-6) / 2);
	var phys = +textList[11].slice(17).slice(0,-7);
	var fire = +textList[12].slice(41).slice(0,-7);
	var cold = +textList[13].slice(41).slice(0,-7);
	var pois = +textList[14].slice(41).slice(0,-7);
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
		while(mobs.length)
			{
            Orion.Print('Mobs: ' + mobs.length);
			var mob = mobs[0];
            var mobColor = mob.Color();
            var mobSerial = mob.Serial();
            //Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            //Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            if(mobColor === '0')
                {
                TextWindow.Open()
                TextWindow.Print('0 Hue: ' + mobSerial + ': ' + mob.Properties())
                }
            Orion.ControlAgent('autoloot','BotLoot','stop');
            Orion.Wait(10);
            Orion.ControlAgent('autoloot','BotLoot','start');
            if(mob.Distance() > 6)
                Orion.WalkTo(mob.X(),mob.Y(),0,5)
            //HonorTarget(mobSerial)
            while(mob.Exists())
                {
                if(mob.Distance() > 1)
                    {
                    if(!Orion.WalkTo(mob.X(),mob.Y()))
                        {
                        Orion.Wait(10);
                        // Orion.Wait(5000)
                        // if(!Orion.WalkTo(mob.X(),mob.Y()))
                        //     Orion.Ignore(mobSerial);
                        }
                    }
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
    while(dist > 5)
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
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport.json';
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
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CuColorReport.json';
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
    Orion.WaitForAddObject('myTarget');
    var serial = Orion.GetSerial('myTarget');
    Shared.AddVar('cuSerial',serial)
    var obj = Orion.FindObject(serial);
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
    while(true)
        {
        var leashDistance = Shared.GetVar('leashDistance',3)
        var avoidRadius = 4;
        var distance = obj.Distance();
        Orion.WarMode(2);
        
 
        if(distance != leashDistance)
            {
            WalkToRadiusBorder(serial,leashDistance);
            Orion.Exec('AsyncTame',true,[serial]);
            
            }
        // else if(distance >= 4)
        //     Orion.WalkTo(obj.X(),obj.Y(),0,3);
        Orion.Wait(100);
        if(obj.CanChangeName())
            break;
            
        while(Player.Hits('%') < 80)
            {
            WalkToRadiusBorder(serial,15);
            Orion.Cast('Heal')
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(self);
            Orion.Wait(100);
            }
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
            AliWalkTo(x,y,0,0,255,2,1,1,300000,SlowPoke);
            }
        Orion.ClearBadLocations();
        }
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
//--#END