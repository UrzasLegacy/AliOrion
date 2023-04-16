//IMPORTANT NOTES FOR MYSELF
//Shared variable 'sync' must true to initiate 

function testwalktoradius()
    {
    Orion.Exec('UWAvoidBot',true,[8])

    }

function UltraTerminate()
    {
    DesyncFromGroup()
    ClearShared()
    Orion.Terminate('all','UltraTerminate');
    Orion.Exec('Autostart',true)
    }
function PrintDexxerArr()
    {
    var arr = Shared.GetArray('dexxer',false);
    Orion.Print(arr)
    }
function DesyncFromGroup()
    {
    Orion.CharPrint(self,1159,'Desyncing')
    Shared.AddVar('sync',false);
    }
function ClearShared()
    {
    Shared.ClearArrays();
    Shared.ClearVars();
    }

//Create a findlist for autoloot named 'BotLoot'
var Version = '3.2'
var leaderSerial = '0x02F4684A'; //Alyx

var profile = 
    {
    useGatherMobs: true, //boolean. Set to true to attack all mobs in the area to gather them towards you.
    useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
        singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
    useMultiTargetSpecial: false, //true , false. Set to true to use a special when 2 or more mobs are nearby to attack.
        multiTargetSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
    useMomentumStrike: true, //boolean. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
    useCounterAttack: true, //boolean. Set to true to maintain Counter Attack at all times.
    useEnemyOfOne: false, //boolean. Set to true to maintain Enemy Of One at all times. Careful using this! It's not smart enough to change enemies.
    useConsecrateWeapon: true, //boolean. Set to true to maintain Consecrate Weapon at all times.
    useDivineFury: true, //boolean, Set to true to maintain Divine Fury at all times.
    useConfidence: true, //boolean. Set to true to use Confidence when HP drops below a percentage threshold defined below.
        useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
    useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
        discordHook: '887268637315047444', //Put Discord WebHook here
        discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
    }

Orion.Exec('JournalScan', true);

//Asset Types:
//'button': A custom graphic button. Args: 'functionName', widthAdjust, xAdj, yAdj, 'graphic|graphicSelected|graphicPressed'
//'toggle': A gem toggle button. Args: 'functionName', 'displayName', ('altOnGraphic|altOnGraphicSelected|altOnGraphicPressed','altOffGraphic|altOffGraphicSelected|altOffGraphicPressed',xAdj,yAdj)
//'textInput': A text input. Args: 'storedVarName'
//'text': Text. Args: 'textString', textColor, xAdj, yAdj
//'horizontalLine': A horizontal line. Args: width,xAdj,yAdj,color,lineWidth
//'verticalLine': A vertical line. Args: height,xAdj,yAdj,color,lineWidth
//'comboBox': A dropdown box. Args: storedVarName, option1, option2, option3... etc
//'xSpacer': A blank asset spacer. Args: width ,['xSpacer',0000],
//'ySpacer': A blank row spacer. Args: height ,['ySpacer',0000],
//'tooltip': Add a tooltip to the previous asset. Args: 'text'
var gumpAssets = 
    [
        [ ['text','Leader: ' + Shared.GetVar('leaderName','Unknown'),554,1,1], ['xSpacer',40],['text','BarrelSamp: ' + Shared.GetVar('barrelName','Unknown'),554,1,1], ['xSpacer',100] ],
        [ ['toggle','SmartStart','Start'] ],
        [ ['text','Utilities',554,1,17] ],
        [ ['toggle','FindOwnCorpse','Get Own Corpse'], ['toggle','HideTilHidden','Hide Til Hidden'], ['toggle','LootUW','Loot Boss'] ],
        [ ['toggle','ResetPosition','Reset Position'], ['toggle','LeaveUW','Leave UW'] ],
        [ ['toggle','RecallRepair','Recall Repair'], ['toggle','RepairGear','Repair Gear'], ['toggle','RecallTithe','Recall Tithe'], ['toggle','Tithe','Tithe'] ],

        [ ['ySpacer',20] ],
    ];

function Autostart()
    {
    Orion.Wait(1000);
    Shared.AddVar('sync',false);
    VerifyOpenContainer(backpack);
    if(Player.Serial() == leaderSerial)
		var role = 'leader';
    else if(Orion.SkillValue('Magery') >= 700)
        var role = 'healer';
    else if(Orion.SkillValue('Swordsmanship') >= 1000)
        var role = 'dexxer';
    else
        var role = 'misc';
    Shared.AddVar('myRole',role);
    if(Player.Serial() == leaderSerial)
        Orion.Exec('AliComLeader',true);
    else
        Orion.Exec('AliComFollower',true);
    }

//--#Inits
function _____________INITS(_){}

function SmartStart()
    {
    var role = Shared.GetVar('myRole',false);
    switch(role)
        {
        case 'leader':
        	Orion.Exec('AliComLeader',true);
            if(GoToSyncPosition())
                {
                WaitSyncLeader(); //wait for resync at safe position
                DetermineBarrelSamp();
                Orion.PauseScript('SmartStart'); //get HaveKeys signal to resume
                ScoutAhead() //run up and lead hydras away if necessary and check that UW is ready to start or hide by winch until it is
                MassAllMessage('ResumeSmartStart');
                WaitSyncLeader(); //wait for resync at boss ready position
                Orion.Wait(2000);
                MassRoleMessage('dexxer','ResumeSmartStart');
                Orion.Wait(2000);
                MassRoleMessage('healer','ResumeSmartStart');
                MassRoleMessage('misc','ResumeSmartStart');
                Orion.Wait(1000);
                }
            GoToBossArena();
            initScripts();
            BossSequence();
            CleanUpPublicCorpse();
            Orion.Exec('SmartStart');
            break;
        case 'dexxer':
			Orion.Exec('AliComFollower',true);
            if(GoToSyncPosition())
                {
                WaitSyncFollower();
                Orion.Wait(1000);
                if(Shared.GetVar('barrelSamp',false) === true)
                    GetKeys();
                Orion.PauseScript('SmartStart');
                GoFromSyncToReadyPosition();
                if(Shared.GetVar('barrelSamp',false) === true)
                    {
                    OpenUW();
                    }
                WaitSyncFollower();
                Orion.PauseScript('SmartStart');
                }
            GoToBossArena();
            initScripts();
            BossSequence();
            Orion.Exec('SmartStart');
            break;
        case 'healer':
			Orion.Exec('AliComFollower',true);
            if(GoToSyncPosition())
                {
                WaitSyncFollower();
                Orion.PauseScript('SmartStart');
                Shared.AddVar('sync',false);
                GoFromSyncToReadyPosition();
                WaitSyncFollower();
                Orion.PauseScript('SmartStart');
                Shared.AddVar('sync',false);
                }
            GoToBossArena();
            initScripts();
            BossSequence();
            Orion.Exec('SmartStart');
            break;
        default:
            break;
        }
    }

function ParseWinch(_)
    {
    var winch = Orion.FindTypeEx('0x280E',any,ground,'item',24)[0];
    if(!winch)
        return false;
    var winchProps = winch.Properties();
    var statusArr = winchProps.match(/>(\w+)</g);
    var statusMap = statusArr.map(function(ele)
        {
        return ele == '>READY<';
        });
    Orion.Print(statusMap);
    }

function OpenUW()
    {
    Orion.CharPrint(self,1159,'Opening UW!');
    var componentArr =
        [
            '0x46FE', // Flywheel
            '0x4CDB', // Wire Spool
            '0x47E6', // Power Core
            '0x0E74', // Bearing Assembly
        ];
    var winch = Orion.FindTypeEx('0x280E',any,ground,'item',24)[0];
    if(!winch)
        return Orion.CharPrint(self,1159, "Couldn't find winch!");
    var winchSerial = winch.Serial();
    AliWalkTo(winch.X(),winch.Y());
    var parse = ParseWinch();
    for(var i=0;i<parse.length;i++)
        {
        var currentParse = parse[i];
        if(currentParse)
            continue;
        var component = Orion.FindType(componentArr[i])[0];
        if(!component)
            return Orion.CharPrint(self,1159,"Couldn't find component: " + i);
        Orion.MoveItem(component,0,winchSerial)
        Orion.Wait(1300);
        var reParse = ParseWinch();
        if(reParse[i] == false)
            i--;
        }
    var lever = Orion.FindTypeEx('0x108C|0x108E',any,ground,'item',20)[0];
    if(!lever)
        return Orion.CharPrint(self,1159,'Lever not found!');
    AliWalkTo(lever.X(),lever.Y());
    while(Orion.FindType('0x07CD','0x0B99',ground,'item','xyz: 6306, 1708').length)
        {
        Orion.UseObject(lever.Serial())
        Orion.Wait(1300);
        }
    AliWalkTo(6308, 1711);
    //finishing this function will trigger GoToBossArena();
    }

function GoToBossArena()
    {
    Orion.CharPrint(self,1159,'Going to boss arena');
    AliWalkTo(6308, 1711);
    var tempX = Player.X();
    var tempY = Player.Y();
    while(Player.X() == tempX && Player.Y() == tempY)
        {
        Orion.Step('n');
        Orion.Wait(1000);
        }
    }

function initScripts()
    {
    var role = Shared.GetVar('myRole',false);
    switch(role)
        {
        case 'leader':
            Orion.Exec('SingleMageHealBot', true);
            Orion.Exec('UWHealLeader',true);
            Orion.Wait(200);
            Orion.Exec('UWAvoidBot', true, [8]);
            break;
        case 'dexxer':
            Orion.Exec('UWSamp', true);
            Orion.Exec('AutoAttack', true);
            Orion.Exec('AutoBuffs', true);
            Orion.Exec('AutoEvade', true);
            break;
        case 'healer':
            Orion.Exec('UWHealBot', true);
            Orion.Wait(200);
            Orion.Exec('UWAvoidBot', true, [8]);
            break;
        default:
            break;
        }
    }

function BossSequence()
    {
    Orion.CharPrint(self,1159,'Starting Boss Sequence!');
    while(!Player.Dead())
        {
        var corpse = Orion.FindTypeEx('0x2006', any, ground, 'item', 23).filter(function(mob)
            {
            return Orion.Contains(mob.Properties(),'Evil');
            });
        if(corpse.length)
            {
            Orion.Wait(500);   		
            AliWalkTo(corpse[0].X(),corpse[0].Y());
            ListLoot("BotLoot");
            Orion.Wait(100);
            break;
            }
        Orion.Wait(1000);
        }
    }

function ScoutAhead()
    {
    Orion.CharPrint(self,1159,'Scouting ahead')
    var firstPass = true;
    var bossCheck = [];
    var ladder = Orion.FindType('0x08A6',any,ground,'item',2)[0];
    if(!ladder)
        return Orion.CharPrint(self,1159,"Couldn't find rope ladder!");
    var tempX = Player.X();
    var tempY = Player.Y();
    while(Player.X() == tempX && Player.Y() == tempY)
        {
        Orion.UseObject(ladder);
        Orion.Wait(1300);
        }
    if(AliWalkTo(6313, 1711, 0, 0, 255, 4, 1, 1, 50000, true, HydraCheck) == 'Hydra')
        {
        AliWalkTo(6302, 1756, 0, 0, 255, 4, 1, 1, 50000, true, HydraLeash)
        while(!Player.Hidden())
            {
            Orion.Cast('Invisibility');
            if(Orion.WaitForTarget(5000))
                {
                Orion.TargetObject(self);
                Orion.Wait(1000);
                }
            }
        AliWalkTo(6313, 1711, 0, 0, 255, 4, 1, 1, 50000, true);
        while(!Player.Hidden())
            {
            Orion.Cast('Invisibility');
            if(Orion.WaitForTarget(5000))
                {
                Orion.TargetObject(self);
                Orion.Wait(1000);
                }
            }
        }
    while(true)
        {
        if(HydraCheck())
            {
            Orion.SetBadLocation(6309,1711);
            Orion.SetBadLocation(6309,1712);
            AliWalkTo(6302, 1756, 0, 0, 255, 4, 1, 1, 50000, true, HydraLeash)
            while(!Player.Hidden())
                {
                Orion.Cast('Invisibility');
                if(Orion.WaitForTarget(5000))
                    {
                    Orion.TargetObject(self);
                    Orion.Wait(1000);
                    }
                }
            AliWalkTo(6313, 1711, 0, 0, 255, 4, 1, 1, 50000, true);
            while(!Player.Hidden())
                {
                Orion.Cast('Invisibility');
                if(Orion.WaitForTarget(5000))
                    {
                    Orion.TargetObject(self);
                    Orion.Wait(1000);
                    }
                }
            }
        while(!Player.Hidden())
            {
            Orion.Cast('Invisibility');
            if(Orion.WaitForTarget(5000))
                {
                Orion.TargetObject(self);
                Orion.Wait(1000);
                }
            }
        if(Orion.FindType('0x07CD','0x0B99',ground,'item','xyz: 6306, 1708').length || bossCheck.length)
            {
            Orion.CharPrint(self,1159,'UW is ready to be started! Calling team to ready position')
            break;
            }
        else if(firstPass)
            {
            Orion.CharPrint(self,1159,'First Pass: Checking if boss is up')
            AliWalkTo(6308,1711);
            while(!Orion.HaveTarget())
                {
                Orion.Cast('Invisibility')
                Orion.WaitForTarget(5000)
                }
            var tempX = Player.X();
            var tempY = Player.Y();
            while(Player.X() == tempX && Player.Y() == tempY)
                {
                Orion.Step('n');
                Orion.Wait(200);
                }
            Orion.Wait(200);
            Orion.TargetObject(self);
            Orion.Wait(500);
            var bossCheck = Orion.FindType(any, any, ground, 'live|ignoreself', 24, 'red');
            if(bossCheck.length)
                Orion.CharPrint(self,1159,'Boss found! Resetting')
            else
                Orion.CharPrint(self,1159,'No boss. Wait for UW reset')
            AliWalkTo(6401,1656);
            var ladder2 = Orion.FindType('0x08A1',any,ground,'item',20);
            if(ladder2.length == 0)
                return Orion.CharPrint(self,1159,'Ladder not found!');
            tempX = Player.X();
            tempY = Player.Y();
            while(Player.X() == tempX && Player.Y() == tempY)
                {
                Orion.UseObject(ladder2);
                Orion.Wait(500)
                }
            if(AliWalkTo(6313, 1711, 0, 0, 255, 4, 1, 1, 50000, true, HydraCheck) == 'Hydra')
                {
                AliWalkTo(6302, 1756, 0, 0, 255, 4, 1, 1, 50000, true, HydraLeash)
                while(!Player.Hidden())
                    {
                    Orion.Cast('Invisibility');
                    if(Orion.WaitForTarget(5000))
                        {
                        Orion.TargetObject(self);
                        Orion.Wait(1000);
                        }
                    }
                AliWalkTo(6313, 1711, 0, 0, 255, 4, 1, 1, 50000, true);
                while(!Player.Hidden())
                    {
                    Orion.Cast('Invisibility');
                    if(Orion.WaitForTarget(5000))
                        {
                        Orion.TargetObject(self);
                        Orion.Wait(1000);
                        }
                    }
                }
            firstPass = false;
            }
        Orion.Wait(1000);
        }
    }

function GoToSyncPosition()
    {
    Orion.CharPrint(self,1159,'Going to safe position');
    //search for boss and skip directly to boss sequence
    //search for boss corpse and go directly to loot sequence
    //check if already in sync position and go to it if not
    //if already in sync position exit function
	ResetPosition();
    return true
	}

function WaitSyncLeader()
    { //wait for team readiness
    var serialHash = {};
    var desynced = true;
    while(desynced)
        {
        Orion.Wait(100);
        var healerArr = Shared.GetArray('healer',[]);
        var sampArr = Shared.GetArray('dexxer',[]);
        var miscArr = Shared.GetArray('misc',[]);
        if(healerArr.length == 0)
            {
            Orion.CharPrint(self,1159,'No healers in team!')
            Orion.Wait(1000);
            continue;
            }
        if(sampArr.length == 0)
            {
            Orion.CharPrint(self,1159,'No samps in team!')
            Orion.Wait(1000);
            continue;
            }
        var fullArr = healerArr.concat(sampArr.concat(miscArr));
        for(var i=0;i<fullArr.length;i++)
            {
            var unit = fullArr[i];
            var unitPort = unit[0];
            var unitSerial = unit[1];
            var unitName = unit[2];
            desynced = false;
            if(serialHash[unitSerial])
                continue;
            var searchMobs = Orion.FindType(any,any,ground,'live',16).filter(function(mob)
                {
                return mob == unitSerial;
                })
            if(searchMobs.length)
                {
                Shared.AddVar('AwaitAnswer',false);
                var answer = false;
                Orion.UdpSend(unitPort,'AwaitPing');
                var endTime = Orion.Now() + 3000;
                Orion.CharPrint(self,1159,'Pinging ' + unitName);
                while(!answer && Orion.Now() < endTime)
                    {
                    Orion.Wait(250);
                    answer = Shared.GetVar('AwaitAnswer' ,false)
                    }
                if(answer)
                    serialHash[unitSerial] = true;
                while(Orion.UdpRecv('Coms'))
                    Orion.Wait(100);
                }
            else
                {
                Orion.CharPrint(self,1159,unitName + ' out of range')
                Orion.Wait(1000);
                }   
            desynced = true;
            }
        }
    Orion.Wait(2000);
    MassAllMessage('SetSync');
    }

function WaitSyncFollower()
    { //wait for team readiness
    Shared.AddVar('Desync',true);
    var desync = Shared.GetVar('Desync');
    while(desync)
        {
        Orion.CharPrint(self,1159,'Awaiting sync');
        Orion.Wait(1000);
        desync = Shared.GetVar('Desync');
        }
    }

function DetermineBarrelSamp()
    {
    Orion.CharPrint(self,1159,'Choosing barrel samp...');
    var samps = Shared.GetArray('dexxer',false);
    while(!samps)
        {
        Orion.CharPrint(self,1159,'Waiting for samps to join...')
        Orion.Wait(1000)
        samps = Shared.GetArray('dexxer',false);
        }
    samps = samps.filter(function(samp){return samp[2] == 'Genevieve'})
    var barrelSamp = samps[Orion.Random(0,samps.length)];
    Shared.AddVar('barrelSampName',barrelSamp[1]);
    Orion.UdpSend(barrelSamp[0],'SetBarrelSamp');
    }
    
function GoFromSyncToReadyPosition()
    {//this function is to move from Sync position to Ready position 
    Orion.CharPrint(self,1159,'Moving from safe to ready position');
    var ladder = Orion.FindType('0x08A6',any,ground,'item',2)[0];
    if(!ladder)
        return Orion.CharPrint(self,1159,"Couldn't find rope ladder!");
    var tempX = Player.X();
    var tempY = Player.Y();
    while(Player.X() == tempX && Player.Y() == tempY)
        {
        Orion.UseObject(ladder);
        Orion.Wait(1300);
        }
    if(Shared.GetVar('barrelSamp',false))
        AliWalkTo(6311, 1705, 0, 0, 255, 4, 1, 1, 50000, true);
    else
        AliWalkTo(6308, 1711, 0, 0, 255, 4, 1, 1, 50000, true);
    }

    


//--#BarrelBot
function ____________BARRELS(_){}

function GetKeys()
    {
    Orion.CharPrint(self,1159,'Getting keys');
    Orion.Exec('UWBarrelsHealSelf',true);
    var locArr =
        [
            ['Flywheel',6426,1733], //0x46FE
            ['Bearing Assembly',6436,1733],//0x0E74
            ['Wire Spool',6426,1753],//0x4CDB
            ['Power Core',6436,1753]//0x47E6
        ];
    for(var i=0;i<locArr.length;i++)
        {
        var loc = locArr[i];
        var component = Orion.FindTypeEx(any).filter(function(item)
            {
            return Orion.Contains(item.Properties(),loc[0]);
            })[0];
        if(component)
            continue;
        var x = loc[1];
        var y = loc[2];
        AliWalkTo(x,y);
        ClearRoom();
        }
    for(var i = 0;i<locArr.length;i++)
        {
        var loc = locArr[i];
        var component = Orion.FindTypeEx(any).filter(function(item)
            {
            return Orion.Contains(item.Properties(),loc[0]);
            })[0];
        if(!component)
            return GetKeys();
        }
    AliWalkTo(6432,1699);
    Orion.PauseScript('UWBarrelsHealSelf');
    Orion.Wait(500);
    Orion.Terminate('UWBarrelsHealSelf');
    Orion.UdpSend(42420,'HaveKeys');
    }

function ClearRoom()
    {
    Orion.IgnoreReset();
    Orion.ClearFakeMapObjects();
    Orion.Exec('UWBarrelsHealSelf',true);
    var locker = Orion.FindTypeEx(0x285E, any, ground, 'near', 24);
    var lockerX = locker[0].X();
    var lockerY = locker[0].Y();
    if(Player.X() > lockerX)
        var x1 = lockerX + 4;
    else
        var x1 = lockerX - 4;
    var y1 = lockerY;
    var x2 = lockerX;
    var y2 = lockerY;
    var phase = 1;
    while(!Player.Dead()) 
        {
        var mobcheck = Orion.FindTypeEx('0x00D7|0x013D|0x005C|0x0018', '-1', 'ground', 'inlos', 10);
        while(mobcheck[0] && mobcheck[0].Exists())
            {
            if(mobcheck[0].Distance() > 1)
                Orion.WalkTo(mobcheck[0].X(), mobcheck[0].Y());
            else
                Orion.Attack(mobcheck[0].Serial());
            Orion.Wait(250);
            if(!Orion.AbilityStatus('primary') && Player.Mana() >= 15)
                Orion.UseAbility('primary');	
            }
        Orion.Wait(250);
        if(Player.Stam() < 155 && Player.Hits()/Player.MaxHits() > .8)
            {
            Orion.Cast('Divine Fury');
            Orion.Wait(1000);
            }
        while(Player.Hits('%') < 70)
            {
            Orion.Wait(100);
            }
        var keyGround = Orion.FindTypeEx('0x410B', any, ground, 'fast', 14)[0];
        while(keyGround)
            {
            Orion.WalkTo(keyGround.X(), keyGround.Y());
            Orion.MoveItem(keyGround.Serial());
            Orion.Wait(500);
            keyGround = Orion.FindTypeEx('0x410B', any, ground, 'fast', 14)[0];
            }
        var keyBackpack = Orion.FindType('0x410B')[0];
        if(keyBackpack && Orion.WalkTo(lockerX,lockerY))
            {
            Orion.Wait(1300);
            Orion.UseObject(keyBackpack);
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(locker[0].Serial());
            Orion.Wait(1300);
            keyBackpack = Orion.FindType('0x410B');
            if(!keyBackpack[0])
                break;
            }
        switch(phase)    
            {
            case 1:
                break;
            case 2:
                x1 = lockerX - 2;
                y1 = lockerY - 2;
                x2 = lockerX + 2;
                y2 = lockerY + 2;
                break;
            case 3:
                x1 = lockerX - 4;
                y1 = lockerY - 4;
                x2 = lockerX + 4;
                y2 = lockerY + 4;
                break;
            default:
                break;
            }
        DrawSquare(x1,y1,x2,y2);
        Orion.SetSearchArea(x1,y1,x2,y2);
        var barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, '', 24).sort(function(barrelA,barrelB)
            {
            return barrelA.Distance() - barrelB.Distance();
            });
        Orion.ResetSearchArea();
        if(barrels[0])
            {
            var barrelSerial = barrels[0].Serial();
            var barrelX = barrels[0].X();
            var barrelY = barrels[0].Y();
            if(barrels[0].Distance() > 1)
                if(Orion.WalkTo(barrelX,barrelY))
                       Orion.Attack(barrelSerial);
                   else
                       Orion.Ignore(barrelSerial);
            else
                Orion.Attack(barrelSerial);
               }
        else
            {
            Orion.IgnoreReset();
            Orion.SetSearchArea(x1,y1,x2,y2);
            barrels = Orion.FindTypeEx('0x1EB5|0x0E77|0x0FAE', '0x0000', ground, '', 24).sort(function(barrelA,barrelB)
                {
                return barrelA.Distance() - barrelB.Distance();
                });
            Orion.ResetSearchArea();
            Orion.ClearFakeMapObjects();
            if(!barrels[0] && phase < 3)
                phase++;
            }	    	
        Orion.Wait(500);
         }
    Orion.Wait(10);
    //Orion.WalkTo(6432, 1699, 0, 0);
    }

function UWBarrelsHealSelf()
    {
    while(!Player.Dead()) 
        {
        if(Player.Poisoned())
            {
            Orion.Cast('Cleanse By Fire');
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(self);
            }
        else if(Player.Hits('%') < 70)
            {
            Orion.Cast('Close Wounds')
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(self);
            }
        else if(Player.Hits('%') < 90)
            {
            if(!Orion.BuffExists('Confidence'))
                Orion.Cast('Confidence');
            }
        Orion.Wait(250);
        }
    }

//--#Leader
function ____________LEADER(_){}

function UWHealLeader()
    {
    while(true)
        {
        var target = injuredCheck(15,80);
        if(target)
            {
            var healerArr = Shared.GetArray('healer');
            Orion.Print(healerArr.length)
            var healer = healerArr.shift();
            healerArr.push(healer);
            Shared.AddArray('healer',healerArr);
            Orion.TargetSystemSerial(target.Serial());
            Orion.UdpSend(healer[0],'HealTarget:' + target.Serial()); //[botPort,botSerial,botName,botRole]
            Orion.Wait(500);
            }
        Orion.Wait(100);
        }
    }

//--#Melee
function ____________MELEE(_){}

function UWSamp()
    {
    while(!Player.Dead())
        {	
        var lord = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(mob)
            {
            return Orion.Contains(mob.Properties(),'Shadowlord');
            });
        var wisp = Orion.FindTypeEx(any, any, ground,'live|ignoreself', 24, 'red').filter(function(mob)
            {
            return Orion.Contains(mob.Properties(),'wisp');
            });
        if(wisp.length)
            {
            wisp.forEach(function(part)
                {
                Orion.Attack(part.Serial());
                Orion.Wait(50);
                });
            if(wisp[0].Distance() > 0)
                Orion.WalkTo(wisp[0].X(),wisp[0].Y(), 0, 0);
            else
                Orion.Attack(wisp[0].Serial());
            }
        else if(lord.length)
            {
            if(lord[0].Distance() > 1)
                Orion.WalkTo(lord[0].X(),lord[0].Y(), 0, 1);
            else
                Orion.Attack(lord[0].Serial());
            }	
        Orion.Wait(250);
        }
    }

function AutoBuffs()
    {
    Orion.Exec('BuffMonitor',true);
    var useConfidence = profile.useConfidence;
    var useConfidenceThresholdPercent = profile.useConfidenceThresholdPercent;
    var useEnemyOfOne = profile.useEnemyOfOne;
    var useCounterAttack = profile.useCounterAttack;
    var useConsecrateWeapon = profile.useConsecrateWeapon;
    var useDivineFury = profile.useDivineFury;
    var nextSpellTime = 0;
    while(!Player.Dead())
        {
        if(Orion.Now() > nextSpellTime && Player.Mana() > 20)
            {
            if(useConfidence && Player.Hits('%') < useConfidenceThresholdPercent && !Orion.BuffExists('Confidence'))
                {
                Orion.Cast('Confidence');
                nextSpellTime = Orion.Now() + 1200;
                }
            else if(useEnemyOfOne && !Orion.BuffExists('Enemy of One'))
                {
                Orion.Cast('Enemy of One');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useCounterAttack && !Orion.BuffExists('Counter Attack'))
                {
                Orion.Cast('Counter Attack');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useConsecrateWeapon && !Orion.BuffExists('Consecrate Weapon'))
                {
                Orion.Cast('Consecrate Weapon');
                nextSpellTime = Orion.Now() + 2000;
                }
            else if(useDivineFury && !Orion.BuffExists('Divine Fury'))
                {
                Orion.Cast('Divine Fury');
                nextSpellTime = Orion.Now() + 2000;
                }
            }
        Orion.Wait(100);
        }
    }

function BuffMonitor()
    {
    var color =
        { //[textColorHue,barColorRRGGBBAA]
            'red': [32,'0xFF0000FF'],
            'tangle': [1159,'0xF0FF0BFF']
        }
    var goodActive = color.tangle;
    var badActive = color.red;

    var buffs =
        [ //buffID,buffCooldown,timerPosition,timerName,xOffset,yOffset,textColor,font,backgroundColor,cooldownColorObj,dispelWarning,persistentBuff
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

function AutoEvade()
    {
    var lowestHPPercent = 30;
    var highestHPPercent = 50;
    Orion.Exec('BuffMonitor',true);
    while(!Player.Dead())
        {
        var count = Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red').length;
        if(!Orion.DisplayTimerExists('Evasion') && !Orion.BuffExists('Evasion') && Player.Hits('%') < Math.min((lowestHPPercent + (2 * count)), highestHPPercent))
            Orion.Cast('Evasion');
        Orion.Wait(100);
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
    var useOnslaught = false;
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
                break;
            }
        Orion.Wait(500);
        }
    }

function GatherMobs()
    {
    Orion.FindType(any, any, ground, 'live|inlos|ignorefriends|ignoreself|nothuman', 20, 'gray|criminal|red')
        .forEach(function(mob)
            {
            Orion.TargetSystemSerial(mob);
            Orion.Attack(mob);
            Orion.Wait(10);
            });
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends|ignoreself|nothuman', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
    }

function AttackNearest()
    {
    Orion.ResetSearchArea();
    var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignoreself|ignorefriends', 24, 'gray|criminal|red')[0]; 
    Orion.TargetSystemSerial(target);
    Orion.Attack(target);
    }

function AutoInsure() 
    {
    var searchFrequency = 1000;
    while(!Player.Dead())
        {
        var items = Orion.FindList('BotLoot').filter(function(ele)
            {
            var obj = Orion.FindObject(ele);
            return !Orion.Contains(obj.Properties(),'insured');
            })
        if(items.length && !Orion.HaveTarget())
            {
            Orion.WaitContextMenuID(self, 418);
            Orion.RequestContextMenu(self);
            if(Orion.WaitForTarget(2000))
                Orion.TargetObject(item[0]);
            if(Orion.WaitForTarget(2000))
                Orion.CancelTarget();
            }
        Orion.Wait(searchFrequency);
        }
    }

//-#Healers
function ____________HEALERS(_){}

function UWHealBot()
    {
    while(!Player.Dead())
        {	
        Orion.Wait(50)	
        if(!Orion.HaveTarget() && !Player.Frozen())
            Orion.Cast("Greater Heal");
        }
    }

function SingleMageHealBot()
    {
    while(!Player.Dead())
        {
        if(!Orion.HaveTarget() && !Player.Frozen())
            {
            Orion.Cast('Greater Heal')
            Orion.WaitForTarget(3000);
            }
        var target = injuredCheck(10, 50);
        if(Player.Hits('%') < 80)
            {
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(self);
            }
        else if(target)
            {
            if(target.Poisoned())
                {
                Orion.CancelTarget();
                Orion.Cast('Cure');
                if(Orion.WaitForTarget(3000))
                    Orion.TargetObject(target.Serial());	
                }
            else if(Orion.WaitForTarget(3000))
                {
                Orion.TargetObject(target.Serial());	
                }
            }
        Orion.Wait(300);
        }
    }

//--# Utilities
function ____________UTILITIES(_){}


function EquipLuckSuitByBotName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var setname = _pName + ' Luck'
    Orion.Dress(setname);
    }

function EquipLRCSuitByBotName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var setname = _pName + ' LRC'
    Orion.Dress(setname);
    }

function EquipUWSuitByBotName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var setname = _pName + ' UW'
    Orion.Dress(setname);
    }

function isPlayerInRectangle(x1, y1, x2, y2)
    {
    //x1,y1 is the northwest corner of the rectangle
    //x2,y2 is the southeast corner
    var x3 = Player.X();
    var y3 = Player.Y();
    return x3 >= x1 && x3 <= x2 && y3 <= y1 && y3 >= y2;
    }

function ResetPosition()
    {
    TerminateAll('ResetPosition');
    //if already in correct position, do nothing.
    //if within rectangle 1, do rectangle 1 things and return ResetPosition()
    //if within rectangle 2, do rectangle 2 things and return ResetPosition() etc
    //recurse until already in correct position
    //if(isPlayerInRectangle(6394,1625,6439,1670))
    if(AliWalkTo(6432, 1633, 0, 0, 255, 8, 1, 1)) //uwboss area
        {
        var ladder = Orion.FindType(0x08A4, any, ground, ' ', 24);
        Orion.UseObject(ladder[0]);
        Orion.Wait(500);
        }
    //if(isPlayerInRectangle(6269,1625,6373,1791))
    if(AliWalkTo(6305, 1673, 0, 0, 255, 8, 1, 1)) //upper deck
        {
        var ladder = Orion.FindType(0x08A6, any, ground, ' ', 24);
        Orion.UseObject(ladder[0]);
        }
    if(Player.X() < 6000)
        {
        while(Orion.ObjAtLayer('Mount'))
            {
            Orion.UseObject(self);
            Orion.Wait(1300);
            }
        EquipUWSuitByBotName();
        Orion.Wait(1300);
        }
    if(AliWalkTo(1700, 1636, 0, 0, 255, 8, 1, 1))//uw dock
        {
        var playerX = Player.X();
        var playerY = Player.Y();
        var whirlpool = Orion.FindType(0x3789, any, ground, ' ', 24);
        while(Player.X() == playerX && Player.Y() == playerY)
            {
            Orion.UseObject(whirlpool[0]);
            Orion.Wait(1300);
            }
        var ethy = Orion.FindTypeEx(any).filter(function(item)
            {
            return Orion.Contains(item.Properties(),'Mount Hue:')
            })[0];
        while(ethy && !Orion.ObjAtLayer('Mount'))
            {
            Orion.UseObject(ethy.Serial());
            Orion.Wait(1300);
            }
        EquipLuckSuitByBotName();
        Orion.Wait(1300);
        }
    //if(isPlayerInRectangle(6400,1680,6458,1802))
    if(AliWalkTo(6321, 1711, 0, 0, 255, 8, 1, 1))//outside boat
        {
        Orion.Wait(500);
        }
    //if(isPlayerInRectangle(6394,1625,6439,1670))
    if(AliWalkTo(6432, 1699, 0, 0, 255, 8, 1, 1))//below deck
        {
        Orion.Wait(10);
        }
    Orion.Wait(500);
    }

function LeaveUW()
    {
    TerminateAll('LeaveUW');
    if(AliWalkTo(6432, 1633, 0, 0, 255, 8, 1, 1))
        {
        var ladder = Orion.FindType(0x08A4, any, ground, ' ', 2);
        Orion.UseObject(ladder[0]);
        Orion.Wait(500);
        }
    if(AliWalkTo(6305, 1673, 0, 0, 255, 8, 1, 1))
        {
        ladder = Orion.FindType(0x08A6, any, ground, ' ', 2);
        Orion.UseObject(ladder[0]);
        Orion.Wait(500);
        }
     if(AliWalkTo(6447, 1743, 0, 0, 255, 8, 1, 1))
        {
        Orion.Wait(500);
        }
     if(AliWalkTo(6279, 1772, 0, 0, 255, 8, 1, 1))
        {
        var rope = Orion.FindType(0x14FA, any, ground, ' ', 2);
        Orion.UseObject(rope[0]);
        Orion.Wait(500);
        }
     if(AliWalkTo(1700, 1564, 0, 0, 255, 8, 1, 1))
        {
        Orion.Wait(10);
        }
    Orion.Wait(500);
    }

function LootUW()
    {
    ListLoot('BotLoot')
    //ListLoot('BotLoot', "ignorelist")
    }

function RecallTithe()
    {
    var tithingPoints = Player.TithingPoints();
    Orion.Print('Current Tithing Points: ' + tithingPoints)
    if(tithingPoints > 10000)
        return;
    TerminateAll('RecallTithe')
    RecallByGump('Main','Tithing','Main','Tithing2');
    Tithe();
    Orion.Wait(1500);
    //Orion.Exec('WalkThroughCurrentFarm');
    }

function Tithe()
    {
    CloseAllGumps();
    var endTime = Orion.Now() + 10000;
    while(Player.TithingPoints() < 100000)
        {
        if(Orion.Now() > endTime)
            {
            return DiscordPush(Player.Name() + "couldn't tithe to 100,000")
            }
        var subEndTime = Orion.Now() + 5000;
        var ankh = Orion.FindTypeEx('0x0005|0x0002|0x0003|0x0004',any,ground,'item',20)[0];
        if(!ankh)
            return Orion.CharPrint(self,1159,'No ankh found!')
        do
            {
            if(Orion.Now() > subEndTime)
                return DiscordPush(Player.Name() + "couldn't find ankh!")
            Orion.WalkTo(ankh.X(),ankh.Y())
            Orion.Wait(500);
            } while(!Orion.FindType('0x0005|0x0002|0x0003|0x0004',any,ground,'item',2)[0])
        Orion.WaitContextMenuID(ankh.Serial(), 412);
        Orion.RequestContextMenu(ankh.Serial());
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(1));
                Orion.Wait(300);
                }
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump('any','0x00000293');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(2));
                Orion.Wait(300);
                }
            }
        Orion.Wait(1000);
        }
    }

function RecallRepair()
    {
    TerminateAll('RecallRepair')
    RecallByGump('Main', 'Home', 'Main', 'Home2');
    Orion.WarMode(0);
    do
        {
        Orion.Step('n');
        Orion.Wait(250);
        var bench = Orion.FindTypeEx('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 10)[0];
        } while(!bench)
    if(!Orion.WalkTo(bench.X(),bench.Y()))
        Orion.WalkTo(bench.X(),bench.Y());
    RepairGear();
    Orion.Wait(1500);
    //Orion.Exec('WalkThroughCurrentFarm');
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

    var flavorText = true; //adds overhead emotes describing the amount of items you need to repair
    
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
        '0x4052': 2002,'0x13F7': 2001,'0x13F6': 2001,'0x1BC3': 2002,'0x0EC2': 2001,'0x0EC3': 2001,'0x13B3': 2003,'0x13B4': 2003,'0x26C2': 2009,'0x26CC': 2009,'0x26C1': 2002,'0x2F5B': 2001,'0x1712': 2006,'0x170D': 2006,'0x2309': 2006
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

function MoveAll()
    {
    Orion.CharPrint(self,1159,"Select 'From' container");
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,"Select 'To' container");
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    var item = Orion.FindType(any,any,fromContainer)[0];
    while(item)
        {
        Orion.MoveItem(item,0,toContainer);
        Orion.Wait(1200);
        item = Orion.FindType(any,any,fromContainer)[0];
        }
    }

function StayLoggedIn()
    {
    while(!Player.Dead())
        {
        Orion.UseObject('backpack');
        Orion.Wait(60000);
        }
    }

function HideTilHidden()
    {
    Orion.Terminate('AlwaysAttackAdjacent');
    while(!Player.Dead() && !Orion.BuffExists('hiding'))
        {
        var startTile = '' + Player.X() + Player.Y();
        Orion.UseSkill('Hiding');
        Orion.Wait(1000);
        var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 1, 'gray|red|criminal|orange');
        if(!Orion.BuffExists('hiding') && enemies.length)
            {
            Orion.Attack(enemies[0]);
            if(!Orion.AbilityStatus(profile.singleTargetSpecial) && Player.Mana() >= 15)
                Orion.UseAbility(profile.singleTargetSpecial);
            }
        }
    Orion.SetTimer('StayLoggedIn');
    while(Orion.BuffExists('hiding'))
        {
        if(Orion.Timer('StayLoggedIn') > 60000)
            {
            Orion.UseObject(backpack);
            Orion.SetTimer('StayLoggedIn');
            }
        Orion.Wait(500)
        }
    Orion.Wait(1000);
    if(('' + Player.X() + Player.Y()) == startTile)
        {
        DiscordPush(Player.Name() + ' Revealed!')
        return HideTilHidden();
        }
    }

function FindOwnCorpse()
    {//Runs to and loots your corpse. Might need to spam the hotkey
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var body = Orion.FindTypeEx(any, any, ground, 'ignoreself', 24).filter(function(part)
        {
        return Orion.Contains(part.Properties(), _pName)
        });
    if(Orion.WalkTo(body[0].X(), body[0].Y()))
        Orion.UseObject(body[0].Serial());
    }

function BuyHorse()
    {
    var vendors = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the animal trainer') && !Orion.Contains(vendor.Properties(), 'guild');
        });
    var shopnpcSerial = vendors[0].Serial();
    var shoplist = Orion.GetShopList('Horsey');
    var items = [
        new ShopListItem('0x00E4|0x00C8|0x00E2|0x00CC', '0x0000', '', 1),
        ];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    Orion.BuyHook('Horsey');
    Orion.WaitContextMenuID(shopnpcSerial, 110);
    Orion.RequestContextMenu(shopnpcSerial);
    Orion.Wait(1300);
    var horsey = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'blue|green').filter(function(mobile)
        {
        return Orion.Contains(mobile.Name(), 'a horse');  
        })[0];
    while(!Orion.ObjAtLayer('Mount'))
        {
        Orion.Say('all follow me');
        Orion.UseObject(horsey.Serial())
        Orion.Wait(1300);
        }
    }

function JournalScan()
    {
    var useDiscordPush = profile.useDiscordPush;
    var useAlarmSound = true//profile.useAlarmSound;
    var msg = 'GM'
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
                default:
                    break;
                }
            }
        }
    }

//--# Helpers
function ____________HELPERS(_){}

function injuredCheck(range, threshold, healDead)
    {
    var flags = healDead ? 'ignoreself|mobile' : 'ignoreself|live';
    var injurelist = Orion.FindTypeEx(any, any, ground, flags, range, 'green')
        .filter(function(part)
            {
            return part.Hits('%') < threshold;
            }).sort(function(a,b)
                {
                return a.Hits() - b.Hits();
                });
    return injurelist[0];
    }

function UWAvoidBot(distance)
    {
    var distanceActual = +distance || 5;
    while(!Player.Dead())
        {	
        Orion.Wait(250)
        var lord = Orion.FindType('0x02C0', any, ground,'live|ignoreself', 24, 'red')
        Orion.Print(lord.length)
        if(lord.length)
            WalkToRadiusBorder(lord[0], distanceActual);
        }
    }

function ParseWinch(_)
    {
    var winch = Orion.FindTypeEx('0x280E',any,ground,'item',24)[0];
    if(!winch)
        return false;
    var winchProps = winch.Properties();
    var statusArr = winchProps.match(/>(\w+)</g);
    var statusMap = statusArr.map(function(ele)
        {
        return ele == '>READY<';
        });
    Orion.Print(statusMap);
    return statusMap
    }

function CloseAllGumps(_)
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

function ListLoot(findlist,ignorelist)  //v1
    {
    var list = Orion.FindTypeEx('0x2006', '-1', ground, '2').filter(function(part)
        {
        return (part.Properties().match(/Evil/i))
        });
    if(list.length) 
        var corpse = list[0];
    else
        Orion.Print('no corpse found');
    if(corpse == null) 
        {
        Orion.ResetIgnoreList();
        Orion.IgnoreReset();        
        }
    else 
        {
        Orion.UseObject(corpse.Serial());
        Orion.Wait(1100);
        var instancedcorpse = Orion.FindObject(Orion.GetSerial(lastcontainer))
        var lootbag = Orion.FindObject(Orion.GetSerial(backpack));       
        if(ignorelist)
            Orion.UseIgnoreList(ignorelist);
        var lootlist = Orion.FindList(findlist, instancedcorpse.Serial())
        if(lootlist.length)
            {
            for(var i = 0;i<lootlist.length;i++) 
                {            
                if(Orion.GetDistance(corpse.Serial()) > 2)
                    break;
                var b = Orion.FindObject(lootlist[i]);
                Orion.Print(b.Name());
                Orion.MoveItem(lootlist[i], 0, lootbag.Serial());
                Orion.Wait(1100);
                }
            }    
        Orion.Ignore(corpse.Serial())       
        }
    }

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID, destinationContainerSerial)
    {
    if(!colorID)
        var colorID = any;
    if(!destinationContainerSerial)
        var destinationContainerSerial = Orion.GetSerial(backpack);
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', destinationContainerSerial))
        {
        Orion.UseObject(destinationContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, destinationContainerSerial, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        Orion.Wait(100);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0], 0, destinationContainerSerial);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed, destinationContainerSerial);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
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
    else
        var startInd = 75; //sacred journey index
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

function WalkToRadiusBorder(targetSerial, distance) 
    {
    var target = Orion.FindObject(targetSerial)
    if(target) 
        {
        var x = target.X();
        var y = target.Y();
        var z = target.Z();
        //var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, z - 8, x + distance, y + distance, z + 8)
        var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
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

function DrawSquare(minX,minY,maxX,maxY)
    {
    Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
        .forEach(function (tile,ind) 
            {
            Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            });
    }

function DrawBorder(minX,minY,maxX,maxY)
    {
    Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
        .forEach(function (tile,ind) 
            {
            Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            });
    }

function SetAvoidRadius(mobSerial,range)
    {
    var mobObj = Orion.FindObject(mobSerial);
    var x = mobObj.X();
    var y = mobObj.Y();
    var tiles = Orion.GetTilesInRect(x - range, y - range, x + range, y + range);
    for(var i = 0;i<tiles.length;i++)
        {
        var tile = tiles[i];
        var tileX = tile.X();
        var tileY = tile.Y();
        var tileZ = tile.Z();
        Orion.SetBadLocation(tileX,tileY)
        Orion.AddFakeMapObject(i + 30000, '0x051A', 1159, tileX, tileY, tileZ);
        }
    }

function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,callBackFn)
    {
    if(z === undefined) z = 0;
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;
    if(pathMarkers === undefined) pathMarkers = false;

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
        {
        if(callBackFn())
            return 'Hydra';
        }
    if(Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,callBackFn);
    return true;
    }

function HydraCheck()
    {
    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    var hydraGraphic = '0x0109';
    var hydras = Orion.FindType(hydraGraphic,any,ground,'live',10);
    if(hydras.length)
        {
        Orion.CharPrint(self,1159,'Hydra found!');
        return true;
        }
    }

function HydraLeash()
    {
    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    var hydraGraphic = '0x0109';
    var hydras = Orion.FindType(hydraGraphic,any,ground,'live',10);
    hydras.forEach(function(hydra)
        {
        Orion.Attack(hydra);
        });
    var distanceCheck = Orion.FindType(hydraGraphic,any,ground,'live',10)
    while(distanceCheck.length == 0)
        {
        if(Player.Hits('%') < 90)
            {
            Orion.Cast('Greater Heal')
            if(Orion.WaitForTarget(3000))
                {
                Orion.TargetObject(self);
                }
            }
        Orion.Print(distanceCheck.length)
        Orion.Wait(200)
        distanceCheck = Orion.FindType(hydraGraphic,any,ground,'live',10)
        }
    hydras = Orion.FindTypeEx(hydraGraphic,any,ground,'live',10);
    hydras.forEach(function(hydra)
        {
        Orion.Attack(hydra.Serial());
        var x = hydra.X();
        var y = hydra.Y();
        var avoidTiles = Orion.GetTilesInRect('land',x - 2, y - 2, x + 2, y + 2);
        avoidTiles.forEach(function(tile,ind)
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            Orion.SetBadLocation(tileX,tileY)
            //Orion.AddFakeMapObject(ind, '0x051A', 32, tileX, tileY, tile.Z());
            });
        });
    }

//--#Coms
function ____________COMS(_){}

function ClearUdp()
    {
    Orion.RemoveAllUdpServers();
    }

function AliComLeader()
    {
    Shared.AddVar('myRole','leader');
    Orion.RemoveAllUdpServers();
    var port = 42420;
    var create = Orion.CreateUdpServer('Coms', port);
    if(create != 0)
        return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
    Orion.Print('Port: ' + port);
    while(true)
        {
        var recv = Orion.UdpRecv('Coms');
        if(recv)
            {
            Orion.Print(recv)
            var recvSplit = Orion.Split(recv,':'); 
            switch(recvSplit[0])
                {
                case 'Check': //"Check:botSerial!botName!botRole:port"
                    var botString = recvSplit[1];
                    var botPort = +recvSplit[2];
                    var botSplit = Orion.Split(botString,'!'); //playerSerial + '!' + Player.Name() + '!' + roleArrName
                        var botSerial = botSplit[0];
                        var botName = botSplit[1];
                        var botRole = botSplit[2];
                    var skip = false;
                    var roleArr = Shared.GetArray(botRole,[]); //[port,serial,name,roleArrName]
                    for(var i=0;i<roleArr.length;i++) // check for duplicates of each bot in the array
                        {
                        var bot = roleArr[i];
                        if(botSerial == bot[1] && botPort == bot[0]) 
                            {//if botSerial and botPort match a bot already in the array, just skip
                            skip = true;
                            break;
                            }
                        else if(botPort == bot[0])
                            {//if botPort matches but botSerial doesn't, this port needs to be overwritten with the correct bot
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
                            skip = true;
                            break;
                            }
                        else if(botSerial == bot[1])
                            {//if botSerial matches but botPort doesn't, this port needs to be overwritten with the correct bot
                            roleArr[i] = [botPort,botSerial,botName,botRole];
                            Shared.AddArray(botRole,roleArr);
                            skip = true;
                            break;
                            }
                        }
                    if(!skip)
                        { //if the bot isn't in the array, add it.
                        roleArr.push([botPort,botSerial,botName,botRole]);
                        Shared.AddArray(botRole,roleArr);
                        }
                    Orion.UdpSend(+botPort,'Heard:' + Player.Name() + ':' + Player.Serial()); //send signal back to bot so they know they're connected
                    break;
                 case 'AliGumpRenderer':
                    Orion.Exec('AliGumpRenderer',true);
                     break;
                case 'AnswerCall':
                    Shared.AddVar('AwaitAnswer',true);
                    break;
                case 'HaveKeys':
                    Orion.ResumeScript('SmartStart');
                    break;
                case undefined:
                    break;
                default:
                    Orion.Print('Error: Unrecognized Command: ' + recvSplit[0]);
                    break;
                }
            }
        Orion.Wait(100);
        }
    }

function AliComFollower()
    {
	var role = Shared.GetVar('myRole','misc');
    var cmdsObj = 
        {
        'Follow': true, //:leaderSerial:distance
        'TerminateAll': true,
        'Target': true, //:targetSerial
        'AliGumpRenderer': true,
        'SetSync': true,
        'ResumeSmartStart': true,
        'SetBarrelSamp':true,
        'AwaitPing':true,
        'HealTarget':true
        }
    Orion.RemoveAllUdpServers();
    var port = 39999;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime && port < 60099) 
        {
        create = Orion.CreateUdpServer('Coms', ++port);
        Orion.Wait(10);
        }
    if(create != 0)
        return Orion.CharPrint(self,1159,'Server Creation Failed: ' + create);
    Orion.Print('Port: ' + port);
    var playerSerial = Player.Serial();
    var playerString = playerSerial + '!' + Player.Name() + '!' + role;
    Orion.CharPrint(self,1159,'Sending signal to leader');
    Orion.UdpSend(42420,'Check:' + playerString + ':' + port); //[cmd,[playerSerial,playerName,role],port]
    Orion.Wait(200);
    var pulseTime = Orion.Now() + 5000;
    while(true)
        {
        recv = Orion.UdpRecv('Coms');
        if(recv)
            {
            var split = Orion.Split(recv,':');
            if(split[0] == 'Heard')
                break;
            }
        Orion.Wait(100);
        if(Orion.Now() > pulseTime)
            {
            Orion.CharPrint(self,1159,'Retrying connection to leader');
            Orion.UdpSend(42420,'Check:' + playerString + ':' + port);
            pulseTime = Orion.Now() + 5000;
            }
        }
    while(Orion.UdpRecv('Coms'))
        Orion.Wait(10);
    Shared.AddVar('leaderName',split[1]);
    Orion.CharPrint(self,1159,'Connected to leader: ' + split[1]);
    while(true)
        {
        Orion.Wait(100);
        var recv = Orion.UdpRecv('Coms');
        if(recv)
            {
            Orion.Print('CommandString: ' + recv) //'cmd:arg1:arg2:arg3:etc'
            var recvSplit = Orion.Split(recv,':');
            if(!recvSplit.length)
                continue;
            Orion.Print('Command: ' + recvSplit[0]);
            var functionString = recvSplit.shift();
            var callFunction = cmdsObj[functionString];
            if(callFunction)
                Orion.Exec(functionString,true,recvSplit)
            else
                Orion.Print('Command unrecognized: ' + functionString)
            }
        }
    }


//--# Bot Commands
function Follow(leaderSerial,distance)
    {
    do
        {
        var leaderObj = Orion.FindObject(leaderSerial);
        Orion.CharPrint(self,1159,'Searching for Leader to follow...')
        Orion.Wait(200);
        } while(!leaderObj)
    if(distance == undefined)
        distance = 1;
    while(true)
        {
        var toggle = Shared.GetVar('Follow');
        if(toggle)
            {
            var leader = Shared.GetVar('Leader')
            if(leader && leaderObj.Exists() && leaderObj.Distance() > distance)
                Orion.WalkTo(leaderObj.X(),leaderObj.Y(),leaderObj.Z(),distance,10,1,1);
            }
        Orion.Wait(100);
        }
    }

function AwaitPing(_)
    {
    if(Shared.GetVar('Desync',false))
        {
        Orion.CharPrint(self,1159,'Answering Call')
        Orion.UdpSend(42420,'AnswerCall');
        }
    }

function SetSync(_)
    {
    Shared.AddVar('Desync',false);
    }

function ResumeSmartStart(_)
    {
    Orion.ResumeScript('SmartStart');
    }

function SetBarrelSamp(_)
    {
    Shared.AddVar('barrelSamp',true);
    Orion.ResumeScript('SmartStart');
    }

function TerminateAll(additionalScripts)
    {
    var flag = 'TerminateAll|JournalScan|AliComFollower|AliComLeader|SmartStart';
    if(additionalScripts !== undefined)
        flag += '|' + additionalScripts;
    Orion.PauseScript('all',flag);
    Orion.Wait(250);
    Orion.Terminate('all',flag);
    }

function TerminateScripts()
    {
    var flag = 'TerminateScripts|JournalScan|AliComFollower|AliComLeader|SmartStart';
    Orion.PauseScript('all',flag);
    Orion.Wait(250);
    Orion.Terminate('all',flag);
    }

function HealTarget(serial)
    {
    var obj = Orion.FindObject(serial);
    if(obj)
        {
        Orion.Print('Targeting: ' + obj.Name());
        if(obj.Distance() > 9)
            {
            Orion.Print('Targeting: ' + obj.Name());
            Orion.PauseScript('UWAvoidBot');
            WalkToRadiusBorder(serial, 6);
            Orion.TargetObject(serial);
            Orion.ResumeScript('UWAvoidBot');
            }
        else
            Orion.TargetObject(serial);
        }
    }

//--# Leader Commands
function AllFollowMe()
    {
    MassAllMessage('Follow:' + Player.Serial());
    }

function MassAllMessage(msg)
    {
    var sampArr = Shared.GetArray('dexxer',[]);
    var healerArr = Shared.GetArray('healer',[]);
    var miscArr = Shared.GetArray('misc',[]);
    var fullArr = sampArr.concat(healerArr.concat(miscArr))
    if(fullArr.length == 0)
        return Orion.CharPrint(self,1159,'No followers to command');
    for(var i = 0;i<fullArr.length;i++)
        Orion.UdpSend(fullArr[i][0],msg);
    }

function MassRoleMessage(role,msg)
    {
    var roleArr = Shared.GetArray(role,[]);  //[botPort,botSerial,botName]
    if(roleArr.length == 0)
        return Orion.CharPrint(self,1159,'No ' + role + ' followers to command');
    for(var i = 0;i<roleArr.length;i++)
        Orion.UdpSend(roleArr[i][0],msg);
    }
//--# Gump
function ____________GUMP(){}

function AliGumpRenderer() 
    {
    var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 
    var title = 'AliUW v' + Version;
    var rowAdj = 40;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
    var rowStart = 35;
    var columnStart = 25;

    var gumpButtons = gumpAssets;
    if(!gumpButtons[0])
        {
        Shared.AddArray('gumpValues',gumpAssets)
        gumpButtons = gumpAssets;
        }
    var heightAdjust = 0;
    var width = Math.max.apply(Math, gumpButtons.map(function (rows)
        {
        var length = rows.reduce(function(sum,ele)
            {
            var assetType = ele[0];
            var widthAdjust = 0
            switch(assetType)
                {
                case 'button':
                    widthAdjust = ele[2];
                    break;
                case 'toggle':
                    widthAdjust = (ele[2].length * characterAdj) + buttonTextHorAdj + 20 + (ele[5] || 0);
                    break;
                case 'comboBox':
                    widthAdjust = 142;
                    heightAdjust += 3;
                    break;
                case 'textInput':
                    widthAdjust = 135;
                    break;
                case 'text':
                    var string = ele[1];
                    var xAdj = ele[3];
                    widthAdjust = (string.length * characterAdj) + xAdj// + 20;
                    break;
                case 'horizontalLine':
                    widthAdjust = ele[1] + 10;
                    break;
                case 'verticalLine':
                    widthAdjust = ele[5];
                    heightAdjust += ele[1];
                    break;
                case 'xSpacer':
                    widthAdjust = ele[1];
                    break;
                case 'ySpacer':
                    heightAdjust += ele[1];
                    break;
                default:
                    break;
                }
            return sum + widthAdjust;
            },0);
        return length + 25;
        }));
    var height = (gumpButtons.length * rowAdj) + rowStart + heightAdjust;
    gump.Clear();
    gump.SetCallback('AliGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Assets
    //gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
    //gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    
    //Modular Assets
    var rowPos = rowStart;
    var colPos = columnStart;
    var i = 1;
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            var assetType = asset[0];
            switch(assetType)
                {
                case 'button':
                    var gumpOption = asset[1];
                    var widthAdjust = asset[2];
                    var xAdj = asset[3] || 0;
                    var yAdj = asset[4] || 0;
                    var buttonGraphic = asset[5] != undefined ? Orion.Split(asset[5],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, buttonGraphic[0], buttonGraphic[1], buttonGraphic[2], '0x0000');
                    colPos += widthAdjust;
                    break;
                case 'toggle':
                    var gumpOption = asset[1];
                    var gumpTitle = asset[2];
                    var buttonOnGraphic = asset[3] != undefined ? Orion.Split(asset[3],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    var buttonOffGraphic = asset[4] != undefined ? Orion.Split(asset[4],'|') : ['0x25F8','0x25F9','0x25F9']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    var xAdj = asset[5] || 0;
                    var yAdj = asset[6] || 0;
                    var stateGraphic //graphic,selected,pressed
                    Orion.ScriptRunning(gumpOption) ? stateGraphic = buttonOnGraphic : stateGraphic = buttonOffGraphic;
                    gump.AddText(colPos + buttonTextHorAdj, rowPos + buttonTextVerAdj, textColor, gumpTitle);
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, stateGraphic[0], stateGraphic[1], stateGraphic[2], '0x0000');
                    colPos += (gumpTitle.length * characterAdj) + buttonTextHorAdj + 20;
                    break;
                case 'comboBox': //['comboBox', 'Single Target', 'Primary', 'Secondary']
                    var gumpOption = asset[1];
                    var dropLength = Math.ceil((asset.length - 2));
                    var value = Shared.GetVar(gumpOption,undefined);
                    gump.AddComboBox(i + 300, colPos, rowPos, '0x0BB8', 0, '0x0BB8', 125, -3,dropLength);
                    for(var j=2;j<asset.length;j++)
                        {
                        gump.AddComboBoxText(asset[j],0,value == asset[j] ? 1 : 0,115,'center');
                        }
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 124, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos - 9, rowPos + 1, '0x16CD', '0x16CE', '0x16CE', '0x0000');
                    colPos += 140;
                    break;
                case 'textInput':
                    var gumpOption = asset[1];
                    gump.AddResizepic(colPos, rowPos , '0x0BB8', 100, 19);
                    gump.AddTextEntry(i + 200, colPos + 5, rowPos - 1, 1159, Shared.GetVar(gumpOption,''), 100, 20);
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos + 87, rowPos + 1, '0x16CF', '0x16D0', '0x16D0', '0x0000');
                    gump.AddTooltip('Update');
                    colPos += 135;
                    break;
                case 'text':
                    var string = asset[1];
                    var color = asset[2];
                    var xAdj = asset[3];
                    var yAdj = asset[4];
                    gump.AddText(colPos + xAdj, rowPos + yAdj,color,string);
                    colPos += (string.length * characterAdj) + xAdj;
                    break;
                case 'horizontalLine':
                    var width = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj + width,rowPos + yAdj, color, lineWidth);
                    colPos += width + 10;
                    break;
                case 'verticalLine':
                    var height = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj,rowPos + yAdj + height, color, lineWidth);
                    colPos += 10;
                    break;
                case 'xSpacer':
                    var xAdjust = asset[1];
                    colPos += xAdjust;
                    break;
                case 'ySpacer':
                    var yAdjust = asset[1];
                    rowPos += yAdjust;
                    break;
                case 'tooltip':
                    var text = asset[1];
                    gump.AddTooltip(text);
                    break;
                default:
                    break;
                }
            i += 1;
            }
        colPos = columnStart;
        rowPos += rowAdj;
        }
    //Custom Assets: Use spacers in asset array to adjust gump size as necessary
    
    gump.Update();
    Orion.Print('interval: ' + (Orion.Now() - startTime))
    }

function AliGumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print('Code: ' + code)
    if(code == 0)
        return;
    else if(code == 100)
        {
        //Orion.Print(true);
        }
    else if(code == 101)
        {
        Orion.Terminate('all','AliGumpCallback');
        Orion.Wait(50);
        return AliGumpRenderer();
        }
    var i = 1;
    var gumpButtons = gumpAssets;
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            if(code == i)
                {
                var assetType = asset[0];
                switch(assetType)
                    {
                    case 'toggle':
                        var gumpOption = asset[1]; //Function name to toggle
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'button':
                        var gumpOption = asset[1]; //Function name to exec
                        Orion.Exec(gumpOption,true);
                        break;
                    case 'textInput':
                        var text = CustomGumpResponse.Text(code + 200);
                        var gumpOption = asset[1]; //Shared Variable Name
                        Shared.AddVar(gumpOption,text);
                        Orion.Print(text);
                        break;
                    case 'comboBox':
                        var gumpOption = asset[1];
                        var value = CustomGumpResponse.ComboBox(i+300)
                        if(value > -1)
                            var parsedValue = asset[2 + value];
                        else
                            var parsedValue = undefined;
                        Shared.AddVar(gumpOption,parsedValue);
                        Orion.Print(gumpOption + ' value: ' + parsedValue);
                        break;
                    default:
                        break;
                    }
                }
            i++;
            }
        }
    Orion.Wait(50);
    Orion.Exec('AliGumpRenderer',true);
    }