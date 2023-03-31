//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliGumpHUD.js
function LoreParser()
	{
	var gump = Orion.GetGump('any','0x000001DB');
	var textList = gump.TextList();
	var hp = Math.floor(+Orion.Split(textList[1].slice(17).slice(0,-6),'/')[1] / 2);
	var stam = Math.floor(+Orion.Split(textList[2].slice(17).slice(0,-6),'/')[1] / 2);
	var str = Math.floor(+textList[4].slice(17).slice(0,-6) / 2);
	var dex = Math.floor(+textList[5].slice(17).slice(0,-6) / 2);
	var phys = +textList[11].slice(17).slice(0,-7);
	var fire = +textList[12].slice(41).slice(0,-7);
	var cold = +textList[13].slice(41).slice(0,-7);
	var pois = +textList[14].slice(41).slice(0,-7);
	var ener = +textList[15].slice(41).slice(0,-7);
	Orion.Print(hp)
	}

var profiles = 
    {
    Cu: 
        {
        walkThrough: 'Cu',
        mobGraphic: '0x0115|0x007A|0x0080', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
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
    '0x0000': 'Standard', //0
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


function CuGump()
    {
    var startTime = Orion.Now();
    var x1 = 20;
    var x2 = 110;
    var x3 = 180;
    var x4 = 260;
    var yAdj = 17;
    var y = 25;
    var textWidth = 100;
    var gump = Orion.CreateCustomGump(15001);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xDAC, 350, 500);
    gump.AddText(x1,y,0,'Current Session'); //Titles
    gump.AddText(x3,y,0,'All Time');
    y += yAdj;
    y += yAdj;
    gump.AddText(x1,y,0,'Plain:');
    gump.AddText(x3,y,0,'Plain:');
    y += yAdj;
    gump.AddText(x1,y,0,'Paragon:');
    gump.AddText(x3,y,0,'Paragon:');
    y += yAdj;
    gump.AddText(x1,y,0,'Dull Copper:');
    gump.AddText(x3,y,0,'Dull Copper:');
    y += yAdj;
    gump.AddText(x1,y,0,'Copper:');
    gump.AddText(x3,y,0,'Copper:');
    y += yAdj;
    gump.AddText(x1,y,0,'Bronze:');
    gump.AddText(x3,y,0,'Bronze:');
    y += yAdj;
    gump.AddText(x1,y,0,'Rose:');
    gump.AddText(x3,y,0,'Rose:');
    y += yAdj;
    gump.AddText(x1,y,0,'Grey:');
    gump.AddText(x3,y,0,'Grey:');
    y += yAdj;
    gump.AddText(x1,y,0,'Echo:');
    gump.AddText(x3,y,0,'Echo:');
    y += yAdj;
    gump.AddText(x1,y,0,'Valorite:');
    gump.AddText(x3,y,0,'Valorite:');
    y += yAdj;
    gump.AddText(x1,y,0,'Sky:');
    gump.AddText(x3,y,0,'Sky:');
    y += yAdj;
    gump.AddText(x1,y,0,'Ice:');
    gump.AddText(x3,y,0,'Ice:');
    y += yAdj;
    gump.AddText(x1,y,0,'Pink:');
    gump.AddText(x3,y,0,'Pink:');
    y += yAdj;
    gump.AddText(x1,y,0,'Red:');
    gump.AddText(x3,y,0,'Red:');
    y += yAdj;
    gump.AddText(x1,y,0,'Black:');
    gump.AddText(x3,y,0,'Black:');
    y += yAdj;
    gump.AddText(x1,y,0,'White:');
    gump.AddText(x3,y,0,'White:');
    y += yAdj;
    gump.AddText(x1,y,0,'Blaze:');
    gump.AddText(x3,y,0,'Blaze:');
    y += yAdj;
    gump.AddText(x1,y,0,'Total:');
    gump.AddText(x3,y,0,'Total:');
    while(true)
        {
        var s = 1;
        var y = 25;
        var totalObj = Shared.GetVar('totalObj',{});
        var currentObj = Shared.GetVar('currentObj',{});
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var divisor = ms / 3600000;
        var gump = Orion.CreateCustomGump(15001);
        gump.AddText(x4,10,0,time,textWidth,100);
        y += yAdj;
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0000'],textWidth,s++); //Plain
        gump.AddText(x4,y,0,totalObj['0x0000'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0501'],textWidth,s++); //Paragon
        gump.AddText(x4,y,0,totalObj['0x0501'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0978'],textWidth,s++); //Dull Copper
        gump.AddText(x4,y,0,totalObj['0x0978'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x05A7'],textWidth,s++); //Copper
        gump.AddText(x4,y,0,totalObj['0x05A7'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x08AA'],textWidth,s++); //Bronze
        gump.AddText(x4,y,0,totalObj['0x08AA'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x097A'],textWidth,s++); //Rose
        gump.AddText(x4,y,0,totalObj['0x097A'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0901'],textWidth,s++); //Grey
        gump.AddText(x4,y,0,totalObj['0x0901'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0527'],textWidth,s++); //Echo
        gump.AddText(x4,y,0,totalObj['0x0527'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x08AC'],textWidth,s++); //Valorite
        gump.AddText(x4,y,0,totalObj['0x08AC'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0515'],textWidth,s++); //Sky
        gump.AddText(x4,y,0,totalObj['0x0515'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0482'],textWidth,s++); //Ice
        gump.AddText(x4,y,0,totalObj['0x0482'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x04B1'],textWidth,s++); //Pink
        gump.AddText(x4,y,0,totalObj['0x04B1'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0674'],textWidth,s++); //Red
        gump.AddText(x4,y,0,totalObj['0x0674'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0455'],textWidth,s++); //Black
        gump.AddText(x4,y,0,totalObj['0x0455'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0481'],textWidth,s++); //White
        gump.AddText(x4,y,0,totalObj['0x0481'],textWidth,s++);
        y += yAdj;
        gump.AddText(x2,y,0,currentObj['0x0489'],textWidth,s++); //Blaze
        gump.AddText(x4,y,0,totalObj['0x0489'],textWidth,s++);
        y += yAdj;

        

        y += yAdj;
        //gump.AddText(20,55,0,'Per hour:');
        gump.Update();
        Orion.Wait(1000);
        }
    }
    
function CuFastGump()
    {
    
    }

function CuGump2()
    {
    var startTime = Orion.Now();
    Shared.AddVar('cuCount',0);
    
    Shared.AddVar('currentPlain',0);
    Shared.AddVar('currentParagon',0);
    Shared.AddVar('currentDullCopper',0);
    Shared.AddVar('currentCopper',0);
    Shared.AddVar('currentBronze',0);
    Shared.AddVar('currentRose',0);
    Shared.AddVar('currentGrey',0);
    Shared.AddVar('currentEcho',0);
    Shared.AddVar('currentValorite',0);
    Shared.AddVar('currentSky',0);
    Shared.AddVar('currentIce',0);
    Shared.AddVar('currentPink',0);
    Shared.AddVar('currentRed',0);
    Shared.AddVar('currentBlack',0);
    Shared.AddVar('currentWhite',0);
    Shared.AddVar('currentBlaze',0);

    
    Shared.AddVar('currentPlain',0);
    Shared.AddVar('currentParagon',0);
    Shared.AddVar('currentDullCopper',0);
    Shared.AddVar('currentCopper',0);
    Shared.AddVar('currentBronze',0);
    Shared.AddVar('currentRose',0);
    Shared.AddVar('currentGrey',0);
    Shared.AddVar('currentEcho',0);
    Shared.AddVar('currentValorite',0);
    Shared.AddVar('currentSky',0);
    Shared.AddVar('currentIce',0);
    Shared.AddVar('currentPink',0);
    Shared.AddVar('currentRed',0);
    Shared.AddVar('currentBlack',0);
    Shared.AddVar('currentWhite',0);
    Shared.AddVar('currentBlaze',0);
    while(true)
        {
        var cuCount = Shared.GetVar('cuCount',0);
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var divisor = ms / 3600000;
        var gump = Orion.CreateCustomGump(15001);
        gump.Clear();
        gump.AddResizepic(0, 0, 0xDAC, 350, 500);
        gump.AddText(20,15,0,'Current Session:');
        gump.AddText(90,15,0,'Total:');
        gump.AddText(20,15,0,'Time:');
        gump.AddText(20,35,0,'Count:');
        gump.AddText(20,55,0,'Per hour:');
        gump.AddText(90,15,0,time);
        gump.AddText(90,35,0,cuCount);
        gump.AddText(90,55,0,(cuCount / divisor).toFixed(2));
        gump.Update();
        Orion.Wait(500);
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
	Orion.Exec('AutoGatherMobs',true);
	Orion.Exec('AutoEvade',true);
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
            Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            Orion.AddFakeMapObject(i++, '0x3001', mobColor, mob.X(), mob.Y(), mob.Z());
            if(mobColor == '0x0489' || mobColor == '0x04EC')
                {
                DiscordPush(Player.Name() + ' BLAZE FOUND!');
                Orion.Wait(100);
                DiscordPush(Player.Name() + ' BLAZE FOUND!');
                Orion.Wait(100);
                AliWalkTo(mob.X(),mob.Y(),mob.Z(),5)
                Orion.Attack(mobSerial)
                Shared.AddVar('cuSerial',mobSerial);
                Orion.PauseScript('WalkSpawn')
                AppendColor(mobColor);
                BlazeProtocol();
                //HonorSelf();
                Orion.Wait(1000);
                DiscordPush(Player.Name() + ' BLAZE FOUND!');
                Orion.Wait(100);
                DiscordPush(Player.Name() + ' BLAZE FOUND!');
                Orion.Wait(100);
                Orion.WalkTo(1252, 1218)
                continue;
                }
            Orion.ControlAgent('autoloot','BotLoot','stop');
            Orion.Wait(10);
            Orion.ControlAgent('autoloot','BotLoot','start');
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
				Orion.CharPrint(mobSerial,mobColor, cuHue[mobColor])
                Orion.Wait(200)
                }
            AppendColor(mobColor);
            Orion.Wait(3000);
			mobs = Orion.FindTypeEx(mobGraphic, any, ground, 'ignoreself|ignorefriends|live|inlos', 24, 'gray|criminal|red').sort(function(a,b)
                {
                return a.Distance() - b.Distance();
                });
			}
		Orion.ResumeScript('WalkSpawn');
		Orion.Wait(200);
		}
	}

function TestBlazeProtocol()
    {

    //AliWalkTo(Player.X() + 11,Player.Y(),Player.Z(),5)
    Orion.WaitForAddObject('myTarget')
    var a = Orion.GetSerial('myTarget');
    Shared.AddVar('cuSerial',a);
    Orion.CharPrint(a,1159,a)
    BlazeProtocol()
    }

function BlazeProtocol()
    {
    var destX = 1349;
    var destY = 1349;
    var path = Orion.GetPathArray(destX,destY,0,0)
    path.forEach(function(tile,ind)
        {
        Orion.AddFakeMapObject(ind + 10000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        })
    AliWalkTo(destX,destY,0,0,255,10,1,1,300000,SlowPoke)
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
        AppendColor('0x0421')
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
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create log file')
        }
    //tmpFile.Remove();
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording " + colorID + ' To File: ' + tmpFilePath);
    logObj[colorID] = (Number(logObj[colorID]) || 0) + 1;
    tmpFile.Write(JSON.stringify(logObj));
    tmpFile.Close();
    var currentObj = Shared.GetVar('currentObj',{});
    currentObj[colorID] = (Number(currentObj[colorID]) || 0) + 1;
    Shared.AddVar('currentObj',currentObj);

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
    var hueSerial = hueSerials[colorCode];
    var x1 = 20;
    var x2 = 110;
    var x3 = 180;
    var x4 = 260;
    var y = 59 + (17 * (hueSerial[1] / 2));
    var gump = Orion.CreateCustomGump(15001);
    gump.AddText(x2,y,0,currentObj[colorID],100,hueSerial[0]);
    gump.AddText(x4,y,0,logObj[colorID],100,hueSerial[1]);
    
    var totalCurrent = 0;
    var totalTotal = 0;
    for(var prop in currentObj)
        {
        totalCurrent += currentObj[prop]
        Orion.Wait(1);
        }
    for(var prop in logObj)
        {
        totalTotal += logObj[prop]
        Orion.Wait(1);
        }
    gump.AddText(x2,272,0,totalCurrent,100,101); // Totals
    gump.AddText(x4,272,0,totalTotal,100,101);


    gump.Update();
    }


function terminateScripts()
	{
	Orion.Terminate('all', 'BandieBot|JournalScan');
	}

/*
{
    0x0000: 0,
    0x0001: 1
}
*/