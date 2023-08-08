CIC Lynk — 12/18/2020
sick of sending multiple PMs with updates
[12:21 PM]
private channel for orion users that i want to have stuff
[12:27 PM]
something else you should do, on the Friends tab, make sure you have the boxes checked.

[12:31 PM]
Also, to your autostart function, I have mine set to clear enemies/friends every time I log in.  Since it's auto adding all reds/greens/oranges while you play, it is good practice to keep the list from being too large.  Javascript is pretty fast but if you get to a point where there is 10k entries it may slow down. 

add this to your autostart function)

function Autostart()
{
Orion.ClearFriendList()
Orion.ClearEnemyList()

CIC Lynk — 12/18/2020
The placement is a little funky, for example, if it sees a red healer, it will skip them but the next bar that is pulled will be down one slot.  i'm working on a longer term fix.
December 29, 2020

CIC Lynk — 12/29/2020
Fixed list keep, had to split it into two parts:
function ListKeep()
{
while(true)
{
 Orion.Wait(30)
var Enemies = Orion.GetEnemyList
var Friends = Orion.GetFriendList
if (Player.Notoriety() == 2)
    {
    var enemyojs =  Orion.FindTypeEx('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself', '25', 'orange|red')
    var frendlies =  Orion.FindTypeEx('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself', '25', 'green|red')
    }
if (Player.Notoriety() == 6)
    {
    var enemyojs =  Orion.FindTypeEx('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself', '25', 'orange|red|blue')
    var frendlies =  Orion.FindTypeEx('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself', '25', 'green|red')    
    }

if(enemyojs.length > 0)
{
for ( i = 0; i < enemyojs.length; i++)
    {
    Orion.GetStatus(enemyojs[i].Serial())
    Orion.Wait(100)
    if(Orion.Contains(Friends,enemyojs[i].Serial()) == true && (Orion.Contains(enemyojs[i].Properties(),'[FS') == false || enemyojs[i].CanChangeName() == false))
        {
        Orion.RemoveFriend(enemyojs[i].Serial())
        }
    if(Orion.Contains(Enemies,enemyojs[i]) == false && Orion.Contains(enemyojs[i].Properties(),'[FS') == false && Orion.Contains(enemyojs[i].Properties(),'Priest of Mondain') == false && Orion.Contains(enemyojs[i].Properties(),'wandering healer|bride|quest|peasant|shepherd') == false && enemyojs[i].CanChangeName() == false)
        { 
        Orion.AddEnemy(enemyojs[i].Properties(),enemyojs[i].Serial())
        }
    }
}
[5:01 PM]
if (frendlies.length > 0)
{
for ( i = 0; i < frendlies.length; i++)
    {
    Orion.GetStatus(frendlies[i].Serial())
    Orion.Wait(100)
    if(Orion.Contains(Enemies, frendlies[i].Serial()) == true && (Orion.Contains(frendlies[i].Properties(),'[FS') == true || frendlies[i].CanChangeName() == true))
        {
        Orion.RemoveEnemy(frendlies[i].Serial())
        }
    if(Orion.Contains(Friends, frendlies[i]) == false  && (Orion.Contains(frendlies[i].Properties(),'[FS') == true) || frendlies[i].Notoriety() == 2 || frendlies[i].CanChangeName() == true)
        {
        Orion.AddFriend(frendlies[i].Name(),frendlies[i].Serial())
        }
    }
}
}
}
[5:08 PM]
MOST RECENT CLONE IDS:
function CloneIDs()
{

    var jk = 2
    while(jk = 2)
        {
        Orion.Wait(50)
        var names = ["PB", "golrath", "Aeyko", "Chaz", "Kaci", "Fister", "Guerry", "CUCK", "Xavier", "Krax", "Rick", "Gayko", "Shitbag", "Pepsi", "Krax", "Aeyko", "Ryanne", "PB", "Blacklisted", "Snowball", "Pud", "Pete", "Chea", "Eason", "Absinthe", "AutumnWind", "Elkataklysm", "Jason", "Bokwind", "Clown", "Rossweisse", "Ruby", "Eason", "Bill", "Benelli", "Narclopse", "Nimsy", "Poundcake", "Karen", "Becky", "Jabroni", "Schnozz", "Bill", "Faggot", "Thumbless", "Cooter", "Skeeter", "Hobbit", "Cucky Brewster", "Tranny", "Butters", "Joany"];
        var IDS = [0x5E2D93E, 0x572A8E8, 0x529F213, 0x1967243, 0x4504143, 0x5121D58, 0x4F40633, 0x5C22AAE, 0x4FA8E29, 0x4925DE9, 0x45C9A3E, 0x456CC45A, 0x294AC02, 0x31B07FA, 0x46CD439, 0x530F882, 0x50B8495, 0x377F69B, 0x3EBEA91, 0x1D2B347C, 0x4D7D8AC, 0x33FD06A, 0x526432B, 0xC79C62, 0x5ABEED7, 0x4DC1163, 0x5E34D8A, 0x3E6F618, 0x6034AA8, 0x4409B97, 0x389695A, 0x3E7AEDE, 0x65173D8, 0x5A0ABF5, 0x44F30C6, 0x57B885C, 0x3E673FD, 0x2D5EB37, 0x2D0AA7C, 0x319C09E, 0x31AC6D4, 0x03A80F12, 0x04BDA829, 0x068895F1, 0x06280870, 0x0114A5C6, 0x04CE02E4, 0x0599A747, 0x0613CF85, 0x02C3E3F2, 0x05528F27, 0x051DF514];

        Orion.SetGlobal('names',names)
        Orion.SetGlobal('IDSText',IDS)
        for (i = 0; i < names.length; i++)
            {
            var obj = Orion.GetDistance(IDS[i]) 
            if (obj < 18 && (Orion.Timer(i) > 3000 || Orion.Timer(i) < 0))
                {
                Orion.CharPrint(IDS[i], 10, names[i])
                Orion.RemoveTimer(i)
                Orion.SetTimer(i)
                }
            }
        }
}
[5:12 PM]
Focus Attack Spammer:
function FocusAttack()
{
while(true)
{
Orion.Wait(50)
if (Orion.SpellStatus('Focus Attack') == false && Player.Frozen() == false && Orion.HaveTarget() == false)
    {
    Orion.Cast('Focus Attack')
    Orion.Wait(200)
    }
}
}
[5:14 PM]
Bar Puller:
function BarPuller()
{
var width = Orion.ClientOptionGet('GameWindowWidth')
var height = Orion.ClientOptionGet('GameWindowHeight')
var fulllist = []
var fullenemylist = []

while (true)
{
var friendlist = Orion.GetFriendList()
var enemylist = Orion.GetEnemyList()
Orion.Wait(50)
var clearlist = Orion.GetGlobal('clearlist')

if (clearlist == '1')
    {
    for ( i = 0; i < fulllist.length; i++)
        {
        Orion.CloseStatusbar(fulllist[i])
        }
    for ( i = 0; i < fullenemylist.length; i++)
        {
        Orion.CloseStatusbar(fullenemylist[i])
        }
    Orion.SetGlobal('clearlist', 0)
    var fulllist = []
    var fullenemylist = []
    }
//var frendlies =  Orion.FindType('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself|human', '25', 'green|red')
//for ( i = 0; i < frendlies.length; i++)
for ( i = 0; i < friendlist.length; i++)
    {
//    Orion.GetStatus(frendlies[i])
//    Orion.Wait(50)
    var friendObj = Orion.FindObject(friendlist[i])
    if (fulllist.indexOf(friendlist[i]) == -1 && Orion.GetDistance(friendlist[i]) < 25 && friendObj.IsHuman() == true)
        {
        fulllist.push(friendlist[i])
        if (fulllist.length * 40 < height && friendObj.Distance() < 25)
            {
            Orion.ShowStatusbar(friendlist[i], width - 140, fulllist.length * 40)
            }
        }
    }
//var enemies =  Orion.FindType('0xFFFF', '0xFFFF', ground, 'mobile|ignoreself|human', '25', 'enemy|red')
for ( i = 0; i < enemylist.length; i++)
    {
    //Orion.GetStatus(enemies[i])
    //Orion.Wait(50)
     var enemyObj = Orion.FindObject(enemylist[i])
    if (fullenemylist.indexOf(enemylist[i]) == -1 && Orion.GetDistance(enemylist[i]) < 25 && enemyObj.IsHuman() == true )
        {
        fullenemylist.push(enemylist[i])
       
        if (fullenemylist.length * 40 < height)
            {
            Orion.ShowStatusbar(enemylist[i], 5, fullenemylist.length * 40)
            }
        }
    }
}

}
Collapse
message.txt
3 KB
[5:15 PM]
Bar Updates - spams refresh of friend/enemy bars
function BarUpdates()
{
while (true)
    {
    Orion.Wait(100)
    Orion.GetFriendsStatus()
    Orion.GetEnemiesStatus()
    }
}
[5:16 PM]
Dismount countdown timer: 
function DismountTimer()
{
while (true)
    {
     Orion.Wait(30)
    while(Orion.WaitJournal('You fall off of your mount and take damage!', Orion.Now(), 0, 'sys') != null)
        {
        Orion.AddDisplayTimer('Dismount', 8000, 'RightBottom', 'Line|Bar|Verticle','Dismount')
        }
    }
}
[5:17 PM]
Autododge:  Will auto move you around impassable objects.  Warning: can cause issues with getting into houses, so we will activate/deactivate with a hotkey.
function autododge()
{
while (true)
    {
    Orion.Wait(10)
    var myX = Player.X()
     var myY = Player.Y()
     var myZ = Player.Z()
     var dir = Player.Direction()
    if (dir - 128 >= 0)
        {
        dir = dir - 128
        }
    var xinc = [0, 1, 1, 1, 0, -1, -1, -1]
    var yinc = [-1, -1, 0, 1, 1, 1, 0, -1]
    if (Orion.CanWalk(dir, myX, myY, myZ) == false)// || Orion.CanWalk(dir, myX + xinc[dir], myY + yinc[dir], myZ) == false || Orion.CanWalk(dir, myX + xinc[dir] + xinc[dir], myY + yinc[dir] + yinc[dir], myZ) == false) 
        {
        //if i'm facing N and NW is Open
        if (dir == 0)
            {
            if (Orion.CanWalk(7, myX, myY, myZ) == true)
                {
                Orion.Step(7, true)
                }
            else if (Orion.CanWalk(dir + 1, myX, myY, myZ) == true)
                {
                Orion.Step(dir + 1, true)
                }
            }
        else
            {
            if (Orion.CanWalk(dir - 1, myX, myY, myZ) == true)
                {
                Orion.Step(dir -1, true)
                }
            else if (Orion.CanWalk(dir + 1, myX, myY, myZ) == true)
                {
                Orion.Step(dir + 1, true)
                }
            }
        }
    }
}
[5:18 PM]
And here is the HOtkey code to turn it on/off.
var check = Orion.ScriptRunning('autododge')
if (check > 0)
    {
    Orion.CharPrint('self', 33, 'Auto Avoid Stopped')
    }
else
    {
    Orion.CharPrint('self', 33, 'Auto Avoid Started')
    }

Orion.ToggleScript('autododge', true)

CIC Lynk — 12/29/2020
here is get lowest HP enemy
[5:30 PM]
var names = Orion.GetGlobal('names')
var namesparsed = Orion.Split(names, ',')
var IDSText = Orion.GetGlobal('IDSText')
var IDSParsed = Orion.Split(IDSText,',')
var IDS = [0,0]
var IDSHex = [0,0]
for (i = 0; i < IDSParsed.length; i++)
    {
    IDS[i] = Number(IDSParsed[i])
    }
for (i = 0; i < IDS.length; i++)
    {
    IDSHex[i] = IDS[i].toString(16)
    }
Orion.GetEnemiesStatus()
var lowestenemy = Orion.FindEnemy('live|injured|InLOS',10)
if (lowestenemy == '')
    {
    Orion.CharPrint(self, 10, 'No Damaged Enemies')
    return
    }
for (i = 0; i < names.length; i++)
    {
    if (lowestenemy == IDS[i])
        {
        var namematch = namesparsed[i]
        break
        }
    else
        {
        var temp = Orion.FindObject(lowestenemy)
        var namematch = temp.Name()
        }
    } 
Orion.CharPrint(lowestenemy, '30', '*' + namematch + '*');
Orion.CharPrint(self, 10,'*' + namematch + '*');
Orion.ClientLastTarget(lowestenemy)
Orion.Attack(lasttarget)
var lastchar = Orion.GetGlobal('lastchar')
Orion.RemoveHighlightCharacter(lastchar, true)
Orion.AddHighlightCharacter(lowestenemy, 10, true);
Orion.SetGlobal('lastchar',lowestenemy)
[5:35 PM]
universal pet remount macro:
[5:35 PM]
Orion.Say("all follow me")
var pets = Orion.FindTypeEx(any, any, ground, 'nothuman|live')
if (pets != null)
    {
    for (i = 0; i < pets.length; i++)
        {
        if (pets[i].CanChangeName() == true)
            {
            Orion.UseObject(pets[i].Serial())
            return
            }
        }
    Orion.CharPrint(self, 55, 'No pet found')
    }
else
    {
    Orion.CharPrint(self, 55, 'No pet found')
    }

CIC Lynk — 12/29/2020
Oh - and here is the bar puller clear hotkey.  You need to bind this to a hotkey to whipe all bars and start from scratch:
Orion.SetGlobal('clearlist',1)
December 30, 2020

CIC Lynk — 12/30/2020
new teleport up a level macro, works for high roofs and going up just one floor when there are multiple:

Orion.TargetTile('any', Player.X(), Player.Y(), Player.Z() + 20)
December 31, 2020

CIC Lynk — 12/31/2020
auto bandaid
function Bandies()
{
while(true)
{
 Orion.Wait(30)
while(Orion.BuffExists('0x7596') == false && Player.Hits() < Player.MaxHits() && Player.YellowHits() == false && Orion.SkillValue('Healing') > 500 && Player.Hidden() == false)
    {
    Orion.BandageSelf()
    Orion.Wait(500)
    }
}
}

CIC Lynk — 12/31/2020
Reminder for orion users, when all the bars are pulled, even if they are off screen you can set your last target by targetting thr greyed out bar
January 5, 2021

CIC Lynk — 01/05/2021
break barrels at IDOCs in Orion: 
function attack_barrel()
{
    while (!Player.Dead()) {
        var barrel = Orion.FindType('0x0FAE|0x0E77|0x1EB5', '0x0', ground, 'near');
        Orion.Attack(barrel);
        Orion.Wait(100)
}
}

CIC Lynk — 01/05/2021
Small change to nearest enemy script, old one had potential to cause latency due to overlapping commands with the bar update script:

function NearestEnemies()
{
Orion.SetGlobal('curcount','0')
var targdist =[["0", "0"], ["0", "0"], ["0", "0"], ["0", "0"]] 
while (true)
    {
    Orion.Wait(30)
    var list = Orion.GetEnemyList()
    var enemyojs = []
    for (var i = 0; i < list.length; i++)
    {
        var obj = Orion.FindObject(list[i]);
        if (obj == null || obj.Distance() >= 25)
            continue;
        if (obj.Dead())
            continue;
        enemyojs.push(list[i]);
    }
    if (enemyojs != null)
        {
        for ( j = 0; j < enemyojs.length; j++)
            {
            targdist[j] = Orion.GetDistance(enemyojs[j])
            targdist[j] = [[enemyojs[j]], [Orion.GetDistance(enemyojs[j])]]
            }    
            targdist.sort(function(a,b)
                {
                return a[1] - b[1];
                })        
        
        
        if (enemyojs.length > 2)//3)
            {
            Orion.SetGlobal('enemy1',targdist[0][0])
            Orion.SetGlobal('enemy2',targdist[1][0])
            Orion.SetGlobal('enemy3',targdist[2][0])
            Orion.SetGlobal('totalenemies',3)
           // Orion.SetGlobal('enemy4',targdist[3][0])
           //Orion.SetGlobal('totalenemies',4)
            }
        else
            {
            targdist.length = enemyojs.length
            for ( p = 0; p < enemyojs.length; p++)
                {
                Orion.SetGlobal(['enemy' + [p + 1 ]], targdist[p][0])
                }
            Orion.SetGlobal('totalenemies',enemyojs.length)
            }
        }
    else
        {
         enemyojs.splice(0,enemyojs.length)
        }
    }
}
January 7, 2021

CIC Lynk — 01/07/2021
var names = Orion.GetGlobal('names')
var namesparsed = Orion.Split(names, ',')
var IDSText = Orion.GetGlobal('IDSText')
var IDSParsed = Orion.Split(IDSText,',')
var IDS = [0,0]
var IDSHex = [0,0]
for (i = 0; i < IDSParsed.length; i++)
    {
    IDS[i] = Number(IDSParsed[i])
    }
for (i = 0; i < IDS.length; i++)
    {
    IDSHex[i] = IDS[i].toString(16)
    }

var noto = Player.Notoriety();
Orion.Ignore(self, true);       
if(noto == 6)
    {
    var players = Orion.FindType('0x0190|0x0191|0x00B6|0x00B7|0x00B8|0x00B9|0x00BA', '0xFFFF', ground, 'near|mobile|ignorefriends ', '25', 'blue|criminal|red|gray|orange');
    } 
else 
    {
    var players = Orion.FindType('0xFFFF', '0xFFFF', ground, 'near|mobile|ignorefriends ', '25', 'orange');
    }
if (players.length)
    {
    var obj = Orion.FindObject(players[0]);
    if (obj) 
    for (i = 0; i < names.length; i++)
        {
        if (obj.Serial() == IDS[i])
            {
            var namematch = namesparsed[i]
            break
            }
        else
            {
            var namematch = obj.Name()
            }
        } 
        {
        Orion.CharPrint(players[0], '30', '*' + namematch + '*');
        Orion.CharPrint(self, 10,'*' + namematch + '*');
        }
    Orion.ClientLastTarget(obj.Serial());
    Orion.Attack(lasttarget)
    var lastchar = Orion.GetGlobal('lastchar')
    Orion.RemoveHighlightCharacter(lastchar, true)
    Orion.AddHighlightCharacter(obj.Serial(), 10, true);
    Orion.SetGlobal('lastchar',obj.Serial())
    }
Orion.Ignore(self, false);        
[12:05 AM]
attack the closest person to you
[12:05 AM]
@Merkd @Forsaken
January 9, 2021

CIC Lynk — 01/09/2021
If you dont like my targeting macros you can define your own here


CIC Lynk — 01/09/2021
Hotride added the ability to get in game location of where the tracking cursor is pointing, which means I can write something to go from alter to alter and keep yourself invised.  Anyone interested in something like that?
January 12, 2021

CIC Lynk — 01/12/2021
Beta testing new RangeCheck color changer.

Previous: Purple if > 10 tiles.  Red if < 10 tiles away.

New:  Blaze if target is within 10 tiles AND at least 4 teammates are within 10 tiles or all teammates are within 10 tiles if you have fewer than 4 teammates.  Purple if > 10 tiles.  Red if < 10 tiles but does not meet the teammate condition (or if you have 0 teammates). 

function RangeCheck2()
{
while (true)
    {
    Orion.Wait(30)
    var tempcounter = 0
    var friendlist = Orion.GetFriendList()
    var enemy = Orion.FindObject(lasttarget)
    var friends = []
    if (enemy != null)
        {
        for (var i = 0; i < friendlist.length; i++)
            {
            var obj = Orion.FindObject(friendlist[i]);
            if (obj == null || obj == '' || obj.Distance() >= 24)
                {
                continue
                }
            if (obj.Dead())
                {
                continue
                }
            //friends.push(friendlist[i]);
            if ((Math.abs(obj.X() - enemy.X()) > Math.abs(obj.Y() - enemy.Y()) && Math.abs(obj.X() - enemy.X()) <= 10) || (Math.abs(obj.Y() - enemy.Y()) > Math.abs(obj.X() - enemy.X()) && Math.abs(obj.Y() - enemy.Y()) <= 10))
                {
                tempcounter = tempcounter + 1
                }
            }
        }
        
    if (enemy != null)
        {
        if (enemy.Distance() <= 10 && (tempcounter == friendlist.length || tempcounter >= 4))
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 1177, true)
            }
        else if (enemy.Distance() > 10)
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 10, true)
            }
        else
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 33, true)
            }
        }
    }
}
 (edited)
January 15, 2021

CIC Lynk — 01/15/2021
@here

Alpha testing new target acquisition script.

Current target cycling options were :

1.) Assign last target by cycling between three players nearest to you
2.) Get lowest HP enemy on last target (useful for getting splintered people on last target quickly)
3.) Attack/Get last target on player closest (ideal for dexers)

New Option:

Get the enemy on your last target based on the average proximity to all of your teammates.  It basically scans all enemies, and for each enemy takes the distance between ALL on screen guildmates (and yourself), takes the average distance to that enemy(sum of distances divided by number of friends on screen), and puts it into an array with (Enemy Serial, Average Distance).  The array is then sorted in numerical order by distance (closest first), and then further sorted in numerical order by Serial number (to make sure we all get the same person in the random event mulitple enemies have the same average distance).

There will be a background script you'll need to add to your script tab, and then there will be a second script that will need to be assigned to a hotkey.  It will work like the other ones, in the sense that you hit the hotkey to get that person put on your last target, and then you would target your spell normally by hitting your last target hotkey.

I was able to succesfully test this with four accounts, two Oranges and two greens, and it worked 100% of the time in all scenarios, but I think we need additional testing.  If you can be around to help me test, shoot me a private message.

I don't plan to share the full script here until we can have a good sized test.
January 20, 2021

CIC Lynk — 01/20/2021
updated target relative.  It should be a little faster and should work a little better for walling EC people:

    var xinc = [0, 3, 3, 3, 0, -3, -3, -3]
    var yinc = [-3, -3, 0, 3, 3, 3, 0, -3]
     var mobileObj = Orion.FindObject(lasttarget);
     var dir = mobileObj.Direction()
    if (dir - 128 >= 0)
        {
        dir = dir - 128
        }
    Orion.TargetTile('any', mobileObj.X() + xinc[dir], mobileObj.Y() + yinc[dir], mobileObj.Z())

CIC Lynk — 01/20/2021
here is the GroupNearest target selection, this goes in scripts and should be added to Autostart.  This will catalogue positions of enemies/friends for determination.
function GroupNearest()
{
var targdist =[["0", "0"], ["0", "0"], ["0", "0"], ["0", "0"]] 
while (true)
    {
    Orion.Wait(30)
    var tempcounter = 0
    var friendlist = Orion.GetFriendList()
    var enemylist = Orion.GetEnemyList()
    var friends = []  //we will save the list of friends within 25 tiles here
    var enemies = [] // we will save the list of enemies within 25 tiles here
    friends.push(Player.Serial())
    for (var i = 0; i < friendlist.length; i++)
    {
        var obj = Orion.FindObject(friendlist[i]);
        if (obj == null || obj.Distance() >= 25)
            continue;
        if (obj.Dead())
            continue;
        if (obj.IsHuman() == false)
        	continue;
        friends.push(friendlist[i]);
    }
    for (var i = 0; i < enemylist.length; i++)
    {
        var obj = Orion.FindObject(enemylist[i]);
        if (obj == null || obj.Distance() >= 25)
            continue;
        if (obj.Dead())
            continue;
        if (obj.IsHuman() == false)
        	continue;
        enemies.push(enemylist[i]);
    }
	Orion.SetGlobal('friends',friends.length)
	Orion.SetGlobal('enemies',enemies.length)

	if (friends.length == 0 || enemies.length == 0)
		{
		continue
		}
		
//some type of if statement to make sure that enemies and friends have values, if not skip break or continue the while loop
    	for (var j = 0; j < enemies.length; j++)
    		{
    		var enemy = Orion.FindObject(enemies[j])
    		if (enemy == null || enemy == '' || enemy.Distance() >= 24)
    			{
    			continue
    			}
    		if (enemy.Dead())
    			{
    			continue
    			}
    		var distance = 0
		    for (var i = 0; i < friends.length; i++)
		    	{
		        var obj = Orion.FindObject(friends[i]);
		        if (obj == null || obj == '' || obj.Distance() >= 24)
		        	{
		            continue
		            }
		        if (obj.Dead())
		        	{
		            continue
		            }
		        //friends.push(friendlist[i]);
		        if (Math.abs(obj.X() - enemy.X()) > Math.abs(obj.Y() - enemy.Y())) // (Math.abs(obj.Y() - enemy.Y()) > Math.abs(obj.X() - enemy.X()) && Math.abs(obj.Y() - enemy.Y()) <= 10))
		        	{
		        	distance = distance + (Math.abs(obj.X() - enemy.X()))
		        	}
		        if (Math.abs(obj.Y() - enemy.Y()) > Math.abs(obj.X() - enemy.X()))
		        	{
		        	distance = distance +(Math.abs(obj.Y() - enemy.Y()))
		        	}
		        } 
		    var avedist = distance / friends.length
		    targdist[j] = [[enemy.Serial()],[avedist]]
		    }
            targdist.sort(function(a,b)
                {
                return a[1] - b[1];
                })        
   //this is where we'll write the global variable with targetdist[0][0] 		
   Orion.SetGlobal('GroupNearest',targdist[0][0])
     }
}
Collapse
message.txt
3 KB
[10:25 AM]
and here is the hotkey to get the person on last target that has the closest average distance to all of our guildmates:

//get closest person to all guildmates
var names = Orion.GetGlobal('names')
var namesparsed = Orion.Split(names, ',')
var IDSText = Orion.GetGlobal('IDSText')
var IDSParsed = Orion.Split(IDSText,',')
var IDS = [0,0]
var IDSHex = [0,0]
for (i = 0; i < IDSParsed.length; i++)
    {
    IDS[i] = Number(IDSParsed[i])
    }
for (i = 0; i < IDS.length; i++)
    {
    IDSHex[i] = IDS[i].toString(16)
    }


var enem1 = Orion.GetGlobal('GroupNearest')

var obj = Orion.FindObject(enem1)
if (obj)
    {
    for (i = 0; i < names.length; i++)
        {
        if (obj.Serial() == IDS[i])
            {
            var namematch = namesparsed[i]
            break
            }
        else
            {
            var namematch = obj.Name()
            }
        }   
    
    Orion.CharPrint(enem1, '30', '*' + namematch + '*')
    Orion.CharPrint(self, 10, '*' + namematch + '*')
     Orion.ClientLastTarget(enem1)
    }
January 21, 2021

CIC Lynk — 01/21/2021
Bandy Script with display timer:

function Bandies()
{
while(true)
{
 Orion.Wait(30)
while(Orion.BuffExists('0x7596') == false && Player.Hits() < Player.MaxHits() && Player.YellowHits() == false && Player.Hidden() == false && Orion.SkillValue('Healing') > 500 )//
    {
    Orion.BandageSelf()
    Orion.Wait(500)
    if (Orion.BuffExists('0x7596'))
        {
        Orion.AddDisplayTimer('Bandage', Orion.BuffTimeRemaining(0x7596), 'AboveChar', 'Line|Bar|Verticle','Bandage')
        }
    }
}
}
 (edited)
January 26, 2021

CIC Lynk — 01/26/2021
This is done.  The dismount one happens any time you jump off your mount.  If you dismount yourself, remounting makes the timer go away.  Riding Swipe does not give you any type of journal line to work with, so this was the only way.

https://streamable.com/m3ft95
Streamable
2021-01-26-11-45-14
[12:50 PM]
and theres another one for magic reflect after it breaks, when the cooldown ends

cetric (he/him) — 01/26/2021


CIC Lynk — 01/26/2021
better @cetric (he/him)  https://streamable.com/6pp5q7
Streamable
Replay_2021-01-26-14-42-19
February 11, 2021

CIC Lynk — 02/11/2021
Update to rangecheck.  Changed color for when someone is in range of enough guildies to dump to be white instead of blaze.  Blaze was too similar to the color of someone else drawing the aggro from attacking or casting on you. 

function RangeCheck2()
{
while (true)
    {
    Orion.Wait(30)
    var tempcounter = 0
    var friendlist = Orion.GetFriendList()
    var enemy = Orion.FindObject(lasttarget)
    var friends = []
    if (enemy != null)
        {
        for (var i = 0; i < friendlist.length; i++)
            {
            var obj = Orion.FindObject(friendlist[i]);
            if (obj == null || obj == '' || obj.Distance() >= 24)
                {
                continue
                }
            if (obj.Dead())
                {
                continue
                }
            //friends.push(friendlist[i]);
            if ((Math.abs(obj.X() - enemy.X()) > Math.abs(obj.Y() - enemy.Y()) && Math.abs(obj.X() - enemy.X()) <= 10) || (Math.abs(obj.Y() - enemy.Y()) > Math.abs(obj.X() - enemy.X()) && Math.abs(obj.Y() - enemy.Y()) <= 10))
                {
                tempcounter = tempcounter + 1
                }
            }
        }
        
    if (enemy != null)
        {
        if (enemy.Distance() <= 10 && (tempcounter == friendlist.length || tempcounter >= 4))
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 2498, true)
            }
        else if (enemy.Distance() > 10)
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 10, true)
            }
        else
            {
            Orion.ClearHighlightCharacters(true)
            Orion.AddHighlightCharacter(enemy.Serial(), 33, true)
            }
        }
    }
}
February 17, 2021

CIC Lynk — 02/17/2021
new script, untested in PvP.  Keeps counter attack toggled.  Some conditions (HP > 100, Mana > 50).  Will not override evade or confidence, or chain cast if already active.  Will not attempt if both hands empty.  Will only toggle if you've not casted a spell in 1.5 seconds (to prevent it from blocking a mini heal, or second spell after holding exp a while). 

function CounterAttack()
{
while (true)
    {
    Orion.Wait(10)
    if (Orion.HaveTarget() || Player.Frozen())
        {
        Orion.SetTimer('counterattack')
        }
    if (!Orion.HaveTarget() && !Orion.BuffExists('0x75f9') && !Orion.BuffExists('0x75f7') && !Orion.BuffExists('0x75f8') && !Player.Frozen() && Player.Mana() > 50 && Orion.Timer('counterattack') > 1500 && Player.Hits() > 100 && (Orion.ObjAtLayer('LeftHand') != null || Orion.ObjAtLayer('RightHand') != null))
        {
        Orion.Cast('Counter Attack')
        Orion.Wait(500)
        }
    }
}
February 18, 2021

CIC Lynk — 02/18/2021
New hotkey for teleport up a level.  Checks for valid tiles directly above you.  If its there and you can tele to it, it will.  If there are teleportable tiles above you, but theres something blocking your tele up it will not do anything, just move another tile and hit your last target key and it will work.  (no wasted teleports due to a bad spot).  If there are NO tiles above you, it will teleport 11 tiles in the direction you're facing, as long as theres no Tree there.  If a tree is there, it wont do anything just move another tile and retarget (no wasted tele).

If you're on a roof, and theres nothing above you, it will NOT tele across the roof.  But if you go to the edge of the roof it will tele 11 tiles down to the ground. 

All on one hotkey.

https://streamable.com/247zc6
Streamable
Replay_2021-02-18-16-56-11
[6:08 PM]
//new teleport
var xinc = [0, 11, 11, 11, 0, -11, -11, -11]
var yinc = [-11, -11, 0, 11, 11, 11, 0, -11]
var dir = Player.Direction()
    if (dir - 128 >= 0)
        {
        dir = dir - 128
        }
var test = Orion.GetTiles(any, Player.X(), Player.Y(), Player.Z() + 20, 255)
var long = Orion.GetTiles('land', Player.X() + xinc[dir], Player.Y() + yinc[dir], 0,255)
var tree = Orion.GetTiles('tree', Player.X() + xinc[dir], Player.Y() + yinc[dir], 0,255)

if (test != '')
    {
    var Up = 0
    for ( i = 0; i < test.length; i++)
        {
        if (test[i].Flags() == 8705 || test[i].Flags() == 67117569)
            {
            var Up = Up + 1
            }
        }
    if (Up == test.length)
        {
        Orion.TargetTile('any', Player.X(), Player.Y(), Player.Z() + 20)
        return
        }
    if (Up > 0)
        {
        return 
        }
    }

if (long != '' && tree == '')
    {
    Orion.TargetTile('land', long[0].X(), long[0].Y(), long[0].Z())
    return 
    }
 (edited)

CIC Lynk — 02/18/2021
Next one will be the relative tile with range and tree check
March 5, 2021

CIC Lynk — 03/05/2021
Display timers for evade, evade cooldown, gift, gift cooldown, attune, attune cooldown, dismount 

function DisplayTimer()
{
while (true)
    {
     Orion.Wait(30)
    if (Orion.ObjAtLayer('Mount', self) == null && !Player.Flying() && !Orion.DisplayTimerExists('Dismount') && Player.Graphic() != '0x04E6')
        {
        Orion.AddDisplayTimer('Dismount', 8000, 'UnderChar', 'Line|Bar', 'Dismount', -80, 0, -1, 0)
        }
    if ((Orion.ObjAtLayer('Mount', self) != null || Player.Flying() || Player.Graphic() == '0x04E6') && Orion.DisplayTimerExists('Dismount'))
        {
        Orion.RemoveDisplayTimer('Dismount')
        }
    if (Orion.BuffExists('0x75f8') && !Orion.DisplayTimerExists('evade'))
        {
        Orion.AddDisplayTimer('Evade', Orion.BuffTimeRemaining('0x75f8'), 'AboveChar', 'Line|Bar', 'Evade')
        var evaded = 1
        }
    if (!Orion.BuffExists('0x75f8') && evaded == 1)
        {
        Orion.AddDisplayTimer('EvadeCD', 20000, 'AboveChar','Line|Bar','Evade CD')
        var evaded = 0
        }
    if (Orion.BuffExists('0x7554') && !Orion.DisplayTimerExists('Gift'))
        {
        Orion.AddDisplayTimer('Gift', Orion.BuffTimeRemaining('0x7554'), 'UnderChar', 'Line|Bar', 'Gift', 0, 40, -1, 0)
        var gifted = 1
        }
    if (!Orion.BuffExists('0x7554') && gifted == 1)
        {
        Orion.AddDisplayTimer('Gift CD', 60000, 'UnderChar', 'Line|Bar', 'Gift CD', 0, 40, -1, 0)
        var gifted = 0
        }
    if (Orion.BuffExists('0x7540') && !Orion.DisplayTimerExists('Attune'))
        {
        Orion.AddDisplayTimer('Attune', Orion.BuffTimeRemaining('0x7540'), 'UnderChar', 'Line|Bar', 'Attune', 80, 40, -1, 0)
        var attune = 1
        }
    if (!Orion.BuffExists('0x7540') && attune == 1)
        {
        Orion.AddDisplayTimer('Attune CD', 120000, 'UnderChar', 'Line|Bar', 'Attune CD', 80, 40, -1, 0)
        var attune = 0
        }
    }
}
 (edited)
[12:15 PM]
apple cooldown and healpot cooldown are built into the macros.   add these to your hotkeys:

apple:

    if (Orion.DisplayTimerExists('Apple') != true)
    {
    Orion.AddDisplayTimer('Apple', 30000, 'UnderChar', 'Line|Bar','Apple', 80, 0, -1, 0)
    }


heal pot/heal stone:

if (Orion.DisplayTimerExists('Heal Pot') == false)
    Orion.AddDisplayTimer('Heal Pot', 10000, 'UnderChar', 'Line|Bar','Heal Pot', 0, 0, -1, 0);
    
 (edited)
[12:16 PM]
look like this

[12:18 PM]
room for one more on the bottom left, can't figure out what other timer would be worthwhile (edited)
[12:18 PM]
PM me if you have a request
March 7, 2021

CIC Lynk — 03/07/2021
@chriss bunch of stuff here.  I just ask you do not share these with anyone
March 14, 2021

CIC Lynk — 03/14/2021
function CounterAttack()
{
while (true)
    {
    Orion.Wait(10)
    if (Orion.HaveTarget() || Player.Frozen() || Player.Hidden())
        {
        Orion.SetTimer('counterattack')
        }
    if (!Orion.HaveTarget() && !Orion.BuffExists('0x75f9') && !Orion.BuffExists('0x75f7') && !Orion.BuffExists('0x75f8') && !Player.Frozen() && Player.Mana() > 50 && Orion.Timer('counterattack') > 1500 && Player.Hits() > 100 && !Player.Hidden() && (Orion.ObjAtLayer('LeftHand') != null || Orion.ObjAtLayer('RightHand') != null))
        {
        Orion.Cast('Counter Attack')
        Orion.Wait(500)
        }
    }
}

CIC Lynk — 03/14/2021
then for the reload, just record yourself reloading it on the macro screen, and where it says "waitfortarget", right click and change to type

March 16, 2021

CIC Lynk — 03/16/2021
Moved here to limit spread

CIC Lynk — 03/16/2021
I'll fix formatting when i cam get to pc.  But you would want to add the Orion.Exec(HidePendant) to your autostart
May 21, 2021

CIC Lynk — 05/21/2021
Updated looter script.  This first function should be added to your Autostart.  This checks for corpses within 1 tile of you, and loots stat pots, novas, mana draughts, seeds of life, the green/blue pots.  It does NOT open the corpse.

There is a second function that also needs to be added. right below this one.

Fixes:  Now attempts to loot only one time.  Will NOT loot guildmate corpses.  It MAY flag you grey if you don't have looting rights (all combatant corpses are blue unless they flagged you first).
[11:01 AM]
function LooterScript()
{
var IgnoreCorpseList = []
while (true)
{
Orion.Wait(10)
var corpses = Orion.FindTypeEx(0x2006, any, ground, '', 1)
if (corpses != '')
    {
    if (!Orion.TimerExists('AllNames') || Orion.Timer('AllNames') > 2000)
        {
        Orion.CreateClientMacro('AllNames').Play(false, 1000)
        Orion.SetTimer('AllNames')
        }
       for (i = 0; i < corpses.length; i++)
        {
        var corpsejournalcheck = Orion.InJournal('corpse', 'item', corpses[i].Serial(), '0x03B2|0x0059')
        if (corpsejournalcheck && IgnoreCorpseList.indexOf(corpses[i].Serial()) == -1)
            {
            var corpsecont = Orion.FindType(any, any, corpses[i].Serial())
            for (k = 0; k < corpsecont.length; k++)
                {
                var LootValue = lootprops(corpsecont[k])
                if (LootValue.Loot == 1)
                    {
                    var lootObj = Orion.FindObject(corpsecont[k])
                    Orion.DragItem(corpsecont[k])
                    Orion.Wait(300)
                    Orion.DropDraggedItem(backpack)
                    Orion.Wait(900)        
                    }        
                var items = Orion.FindTypeEx(any, any, corpsecont[k])
                if (items != '')
                    {
                    for (p = 0; p < items.length; p++)
                        {
                        var LootValue = lootprops(items[p].Serial())    
                        if (LootValue.Loot == 1)
                            {
                            Orion.DragItem(items[p].Serial())
                            Orion.Wait(300)
                            Orion.DropDraggedItem(backpack)
                            Orion.Wait(900)
                            }
                        }
                    }
                }
            IgnoreCorpseList.push(corpses[i].Serial())
            } 
        }
    }
}
}
[11:02 AM]
This is the supporting loot evaluation function.  Download the text file, copy and paste it into your script file of functions.  This should NOT be included in Autostart.

This loot eval function can also be called in any PVM scripts you have running as I wrote it to loot certain property combinations.  If you have something you want this worked into, let me know.  For PvM looting, the properties of items does not reliably load into Orion's memory until you open the corpse, so the looter script above may work some of the time, it is not 100%. (edited)
May 28, 2021

CIC Lynk — 05/28/2021
function lootprops(_serial)
{
var item = Orion.FindObject(_serial)
var jewelryprops = ['+', 'Recovery', 'Faster Casting', 'Enhance Potions', 'Swing Speed Increase', 'Damage Increase', 'Hit Chance Increase', 'Defense Chance Increase', 'Strength Bonus', 'Dexterity Bonus', 'Intelligence Bonus', 'Stamina Increase', 'Mana Increase', 'Lower Mana Cost', 'Lower Reagent Cost', 'Mana Regeneration']
var armorprops = ['Lower Mana Cost', 'Lower Reagent Cost', 'Mana Regeneration', 'Hit Point Regeneration', 'Hit Point Increase', 'Stamina Increase', 'Mana Increase', 'Strength Bonus', 'Intelligence Bonus', 'Dexterity Bonus', 'Hit Chance Increase', 'Defense Chance Increase', 'Luck 140']
var weaponprops = ['Hit Lower Defense', 'Hit Lightning', 'Hit Fireball', 'Hit Harm', 'Hit Magic Arrow', 'Spell Channeling', 'Swing Speed Increase', 'Damage Increase']
var pvpitems = [[0x1727, 0x0491],[0x0f06, 0x04f8],[0x0ffb,0x0128],[0x0F09,0x000D],[0x0F06,0x044A],[0x0F09,0x09C4]]
var modcounter = 0
this.Loot = 0
if (Orion.Contains(item.Properties(), 'Cursed'))
	{
	this.Loot = 0
	return this
	}
if (Orion.Contains(item.Properties(), 'Skill Required'))
	{
	Orion.Print('entering weapon loot')
	for (j = 0; j < weaponprops.length; j++)
		{
		if (Orion.Contains(item.Properties(), weaponprops[j]))
			{
			modcounter = modcounter + 1
			}
		}
	this.mods = modcounter
	if (Orion.Contains(item.Properties(), 'Splintering Weapon 30'))
		{
		this.Loot = 1
		}
	if (Orion.Contains(item.Properties(), 'Splintering Weapon 25') && (modcounter > 1 || !Orion.Contains(item.Properties(),'Physical Damage 100')))
		{
		this.Loot = 1
		}
	if (Orion.Contains(item.Properties(), 'Splintering Weapon 20') && (modcounter > 2 || !Orion.Contains(item.Properties(),'Physical Damage 100')))
		{
		this.Loot = 1
		}
	return this
	}
	
	
else if (Orion.Contains(item.Properties(), 'Strength Requirement') && !Orion.Contains(item.Properties(), 'Skill Required'))
	{
	//armor eval Script
	Orion.Print('entering armor loot')
	for (j = 0; j < armorprops.length; j++)
		{
		if (Orion.Contains(item.Properties(), armorprops[j]))
			{
			modcounter = modcounter + 1
			}
		}
	this.mods = modcounter
	if (modcounter > 5)
		{
		this.Loot = 1
		}
	return this	
	}
	
	
else if ((Orion.Contains(item.Properties(), 'Ring') || Orion.Contains(item.Properties(), 'Bracelet')) && Orion.Contains(item.Properties(), 'Artifact'))
	{
	//jewel eval Script
	Orion.Print('entering jewel loot')
	for (j = 0; j < jewelryprops.length; j++)
		{
		if (Orion.Contains(item.Properties(), jewelryprops[j]))
			{
			Orion.Print(item.Properties())
			var theString = item.Properties()
			var count = theString.split(jewelryprops[j]).length -1
			modcounter = modcounter + count
			}
		}
	this.mods = modcounter
	if (modcounter > 6)
		{
		this.Loot = 1
		}
	return this	
	}
else	
	{
	Orion.Print('entering pvp loot')
	for (j = 0; j < pvpitems.length; j++)
		{
		if (item.Graphic() == pvpitems[j][0] && item.Color() == pvpitems[j][1])
			{
			this.Loot = 1
			return this
			}
		}	
	}
return this
}
Collapse
message.txt
4 KB
June 5, 2021

CIC Lynk — 06/05/2021
@Orion only rule is no sharing with anyone, regardless of who it is.  i'm the arbiter of who gets what
[12:53 AM]
but enjoy

CIC Lynk — 06/05/2021
if(Orion.GetTargetType() != 0)
    {
    if (Orion.GetTargetType() == 2)
        {
        if (Orion.GetDistance(lasttarget) <= 10)
            {
            Orion.TargetObject(lasttarget)
            var exp = Orion.GetGlobal('exp')
            if (exp == 1)
                {
                Orion.Wait(200)
                for (i = 0; i < 2; i++)
                    {
                    for (j = 0; j < 7; j++)
                        {
                        Orion.Turn(j)
                        Orion.Wait(30)
                        }
                    var rando = Orion.Random(0,7)
                    Orion.Turn(rando)
                    Orion.SetGlobal('exp',0)
                    }
                }
            }
        else
            {
            Orion.CharPrint(self, 50, 'Target out of Range')
            }
        }
    else    
        {
        Orion.GetFriendsStatus()
        var friendly = Orion.FindFriend('live|injured|InLOS',10)
        if (friendly != '')
            {
            Orion.TargetObject(friendly)
            }
        else
            {
            Orion.CharPrint(self, 50, 'No Friendly Needs Heals')
            }
        
        }
    }
    
        


This is the last target macro

CIC Lynk — 06/05/2021
disarm spam for wrestle parry mages: 
function DisarmSpam()
{
while(Orion.SkillValue('Wrestling') >= 699)
{
Orion.Wait(100)
if (!Orion.ObjAtLayer('RightHand') && Orion.BuffExists(0x9BD1) == false && Orion.HaveTarget() == false && Player.Frozen() == false && Orion.AbilityStatus('Primary') == false && Orion.AbilityStatus('Secondary') == false && Orion.SpellStatus('Death Strike') == false && Player.Graphic() != '0x04E6')
    {
    Orion.UseAbility('Primary')
    Orion.Wait(500)
    }
var closest = Orion.FindType(any, any, ground, 'human|near|mobile|ignorefriends|ignoreself ', '1', 'orange')
 if (Orion.AbilityStatus('Primary', true) && closest != '' && !Player.Hidden())
     {
     Orion.Attack(closest)
     }
}
}
        
June 8, 2021

CIC Lynk — 06/08/2021
@here new fun one for the special boats in yew.  replace your open door macro with this , if theres a mooring line close enough it will use it, if not it will open door. 
var rope = Orion.FindTypeEx(0x14FA, 0x0000, any, 'near', 24)
if (!rope.length)    
    {
    Orion.OpenDoor()
    }
else
    {
    Orion.Print(rope.length)
    Orion.UseObject(rope[0].Serial())
    }

CIC Lynk — 06/08/2021
Wrote this Bola macro. if you're mounted it  jumps off a horse and starts teleporting while you're still on use item timer.  Once not on use item timer it throws bola at your last target, but it does it before your tele cursor comes up.  If you're already on foot it will just throw the bola and you teleport yourself.

if (Orion.ObjAtLayer('Mount'))
    {
    Orion.UseObject(self)
    Orion.Wait(400)
    Orion.Cast('Teleport')
    Orion.Wait(800)
    }
Orion.AddWaitTargetObject(lasttarget)
Orion.UseType(0x26AC)
Orion.Wait(1200)
//replace this Equip serial with your shield, or weapon, or whatever you're equipping
Orion.Equip(0x42CBC1E3)
Orion.CancelWaitTarget()
[4:33 PM]
If you're mounted, it saves you a full second because normally you'd wait to be off of item timer to throw, then teleport. (edited)
July 16, 2021

CIC Lynk — 07/16/2021
have had a few people ask for this, so here is the hotkey for cycling through all visible targets
[10:30 PM]
does use the cloneID references as well
var names = Orion.GetGlobal('names')
    var namesparsed = Orion.Split(names, ',')
    var IDSText = Orion.GetGlobal('IDSText')
    var IDSParsed = Orion.Split(IDSText,',')
    var IDS = [0,0]
    var IDSHex = [0,0]
    for (i = 0; i < IDSParsed.length; i++)
        {
        IDS[i] = Number(IDSParsed[i])
        }
    for (i = 0; i < IDS.length; i++)
        {
        IDSHex[i] = IDS[i].toString(16)
        }
    var list = Orion.GetEnemyList()
    var cycled = Shared.GetArray('cycled', '')
    for (i = 0; i < list.length; i++)
    {
        var obj = Orion.FindObject(list[i]);
        if (obj == null || obj.Distance() >= 25)
            {
            continue;
            }
        if (obj.Dead())
            {
            continue;
            }
        if (Orion.Contains(cycled, list[i]))
            {
            continue
            }
        if (!Orion.Contains(cycled, list[i]) && obj != null)
            {
            cycled.push(list[i])
            Shared.RemoveArray('cycled')
            Shared.AddArray('cycled', cycled)
               Orion.ClearHighlightCharacters(true)
               Orion.ClientLastTarget(list[i])
            var obj2 = Orion.FindObject(list[i])
            if (obj2)
                {
                for (i = 0; i < names.length; i++)
                    {
                    if (obj2.Serial() == IDS[i])
                        {
                        var namematch = namesparsed[i]
                        break
                        }
                    else
                        {
                        var namematch = obj2.Name()
                        }
                    }   
                
                Orion.CharPrint(lasttarget, '30', '*' + namematch + '*')
                Orion.CharPrint(self, 10, '*' + namematch + '*')
                return
                }
            }

    }
           Orion.ClientLastTarget('')
           Orion.ClearHighlightCharacters(true)
           Orion.CharPrint(self, 10, 'No Targets ')
        Shared.RemoveArray('cycled')
Collapse
message.txt
3 KB
August 11, 2021

CIC Lynk — 08/11/2021
revised box scripts (for para and nerve) leveraging code to not break targetting cursor

function NerveBox()
{
while (true)
   {
    Orion.Wait(30)
    var box = Orion.FindTypeEx(0x09A9, any,backpack)
     while(Orion.WaitJournal('Your attacker dealt a crippling nerve strike!', Orion.Now(), 0, 'sys') != null && box.length)
    {
    Orion.Wait(800)
    Orion.UseItemOnMobile(box[0].Serial(), self)
    Orion.Wait(2000)
    }
    }
}

function Box()
{
while (true)
   {
   var box = Orion.FindTypeEx(0x09A9, any,backpack)
   Orion.Wait(30)
    if (Player.Paralyzed() == true && Player.Hits() > 30 && box.length)
    {
    Orion.Wait(100)
    Orion.UseItemOnMobile(box[0].Serial(), self)
    Orion.Wait(1200)
    }
    }
}

CIC Lynk — 08/11/2021
Universal shuriken/dart thrower (based on range) leveraging the ability to not lose target cursor.

var belts = Orion.FindTypeEx(0x2790, any, backpack)
var blowguns = Orion.FindTypeEx(0x27AA, any, backpack) 
if (belts.length < 2)
    {
    Orion.Print('Stopping.  Do not have at least two ninja belts.')
    return
    }
if (blowguns.length < 2)
    {
    Orion.Print('Stopping.  You do not have at least two fukiyas.')
    }
if (Orion.GetDistance(lasttarget) >= 3)
    {
    Orion.UseItemOnMobile(belts[0].Serial(), lasttarget)
    Orion.Wait(1000)
    }
else 
    {
    Orion.UseItemOnMobile(blowguns[0].Serial(), lasttarget)
    Orion.Wait(1000)
    }
if (Orion.GetDistance(lasttarget) >= 3)
    {
    Orion.UseItemOnMobile(belts[1].Serial(), lasttarget)
    Orion.Wait(1000)
    }
else 
    {
    Orion.UseItemOnMobile(blowguns[1].Serial(), lasttarget)
    Orion.Wait(1000)
    }
Orion.CancelWaitTarget()
 (edited)

CIC Lynk — 08/11/2021
here are all the new hotkey codes you'd need for consumeables.  i have them all in one script,but really each pot would be its own hotkey. 

//tr pot
var tr = Orion.FindTypeEx(0x0F0B, 0x0000,backpack)
if (tr.length)
    {
    Orion.UseItemOnMobile(tr[0].Serial(), self)
    }

//heal pot
var heal = Orion.FindTypeEx(0x0F0C, 0x0000,backpack)
if (heal.length)
    {
    Orion.UseItemOnMobile(heal[0].Serial(), self)
    }
if (Orion.DisplayTimerExists('Heal Pot') == false)
    Orion.AddDisplayTimer('Heal Pot', 10000, 'UnderChar', 'Line|Bar','Heal Pot', 0, 0, -1, 0);
    

//cure pot
var cure = Orion.FindTypeEx(0x0F07, 0x0000,backpack)
if (cure.length)
    {
    Orion.UseItemOnMobile(cure[0].Serial(), self)
    }

//conflag self
var conflag= Orion.FindTypeEx(0x0F06, 0x0489,backpack)
if (conflag.length)
    {
    Orion.UseItemOnMobile(conflag[0].Serial(), self)
    //you can change self to last target if you'd prefer on th eline above
    }

//nova
var nova = Orion.FindTypeEx(0x0F09, 0x000D,backpack)
if (nova.length)
    {
    Orion.UseItemOnMobile(nova[0].Seria... (12 KB left)