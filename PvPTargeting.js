function CatchPlayersOnScreen()
    {
    var playerGraphics = '0x02EB|0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2';
    //var playerHash = Shared.GetVar('playerHash',{});
    var players = Orion.FindTypeEx(playerGraphics,any,ground,'live|ignoreself|ignorefriends',20,'blue|orange|gray|criminal|red')
        .filter(function(mob)
            {
            var mobSerial = mob.Serial();
            if(!mob.ProfileReceived())
                Orion.GetProfile(mobSerial);
            //if(!npcCheck.ProfileReceived())
            //	Orion.AddIgnoreListObject('PlayerDetectorIgnoreList', npcCheck.Serial());
            return mob.ProfileReceived();
            });
            //var players = Orion.FindTypeEx(any,any,ground,'live|ignoreself|ignorefriends',20,'blue|orange|gray|criminal|red')
    if(players.length == 0)
        return Orion.CharPrint(self,1159,'- No nearby players -')
    players.sort(function(a,b)
        {
        return a.Distance() - b.Distance();
        });
    Orion.Print(players.length)
    var playerTargets = [];
    for(var i=0;i<players.length;i++)
        {
        var player = players[i];
        playerTargets.push([i,player.Name(),player.Serial(),player.Notoriety()])
        }
    Shared.AddArray('playerTargets',playerTargets);
    Shared.AddArray('currentArray',playerTargets[0])
    Orion.TargetSystemSerial(playerTargets[0][2]);
    Orion.ClearHighlightCharacters(true);
    Orion.AddHighlightCharacter(playerTargets[0][2], 1152,true);
    Orion.CharPrint(playerTargets[0][2],1159,'Targeting ' + playerTargets[0][1])
    TargetGump(0)
    }

function TargetGump(index)
    {
    if(index == undefined)
        index = 0;
    var notoColors = 
        {
        1: 95,
        2: 61,
        3: 1000,
        4: 1000,
        5: 1161,
        6: 33
        }
    var playerTargets = Shared.GetArray('playerTargets',[]);
    if(playerTargets.length === 0)
        return Orion.CharPrint(self,1159,'- No nearby players -');
    var gump = Orion.CreateCustomGump(50000);
    gump.Clear();
    gump.SetCallback('TargetCallback');
    gump.AddResizepic(0, 0, 'bb8', 175, 10 + playerTargets.length * 20); //background 0xDAC 0x254e 0x2560 9bf5 
    for(var i = 0;i<playerTargets.length;i++)
        {
        var player = playerTargets[i];
        var playerIndex = player[0];
        var playerName = player[1];
        var playerSerial = player[2];
        var playerNotoriety = player[3];
        var buttonGraphic = 2117;
        if(playerIndex == index)
            {
            playerName = '- ' + playerName + ' -';
            buttonGraphic = 2118
            }
        var row = 5 + 20 * i
        gump.AddText(25, row, notoColors[playerNotoriety], playerName);
        gump.AddButton(i + 1, 5, row + 4, buttonGraphic, buttonGraphic, buttonGraphic, '0x0000');
        }
    gump.Update()
    }

function TargetCallback(_)
    {
    var playersArr = Shared.GetArray('playerTargets',[])
    var code = CustomGumpResponse.ReturnCode();
    for(var i=0;i<playersArr.length;i++)
        {
        if(code == i + 1)
            {
            var currArr = playersArr[i];
            Shared.AddArray('currentArray',playersArr[i]);
            Orion.Print(playersArr[i])
            var playerIndex = currArr[0];
            var playerName = currArr[1];
            var playerSerial = currArr[2];
            Orion.CharPrint(playerSerial,1159,'Targeting ' + playerName)
            Orion.ClearHighlightCharacters(true);
            Orion.AddHighlightCharacter(playerSerial, 1152,true);
            Orion.TargetSystemSerial(playerSerial);
            TargetGump(playerIndex);
            break;
            }
        }
    }

function CycleDown()
    {
    CycleTargets('down')
    }

function CycleUp()
    {
    CycleTargets('up')
    }

function CycleTargets(direction)
    {
    var playerTargets = Shared.GetArray('playerTargets',[]);
    if(playerTargets.length === 0)
        return Orion.CharPrint(self,1159,'- No targets -')
    if(direction == 'up')
        {
        var crement = -1;
        var wrapIndex = playerTargets.length - 1;
        }
    else
        {
        var crement = 1;
        var wrapIndex = 0;
        }
    var currentArray = Shared.GetArray('currentArray',[]);
    if(currentArray.length === 0)
        currentArray = playerTargets[0];
    var currentIndex = currentArray[0];
    var nextIndex = currentIndex + crement;
    var nextArray = playerTargets[nextIndex] || playerTargets[wrapIndex];
    nextIndex = nextArray[0];
    var nextName = nextArray[1];
    var nextSerial = nextArray[2];
    Shared.AddArray('currentArray',nextArray);
    Orion.Print(nextArray)
    Orion.CharPrint(nextSerial,1159,'Targeting ' + nextName)
    Orion.ClearHighlightCharacters(true);
    Orion.AddHighlightCharacter(nextSerial, 1152,true);
    Orion.TargetSystemSerial(nextSerial);
    TargetGump(nextIndex);
    }