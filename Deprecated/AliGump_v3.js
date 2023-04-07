function testInit()
    {
    initVars();
    ResyncValues()
    TextWindow.Open();
    TextWindow.Print(JSON.stringify(Shared.GetArray('gumpValues')))
    }

function initButtons(_)
    {
    var gumpButtons = [ //functionName,displayName,assetType,value
        [['AutoAttack','AutoAttack','toggle',0], ['AutoBuffs','AutoBuffs','toggle',0], ['AutoEvade','AutoEvade','toggle',0], ['AutoGatherMobs','AutoGatherMobs','toggle',0]],
        [['Monitor','Monitor','toggle',0], ['Listener','Listener','toggle',0], ['WalkSpawn','WalkSpawn','toggle',0]],
        [['DecoHighlighter','DecoHighlighter','toggle',0], ['RunAndHide','RunAndHide','toggle',0], ['AlwaysAttackAdjacent','AlwaysAttackAdjacent','toggle',0]],
        [['DecoPickup','DecoPickup','toggle',0], ['AutoTracker','AutoTracker','toggle',0], ['ClearUdp','ClearUdp','toggle',0]],
        ];
    Shared.AddArray('gumpValues',gumpButtons);
    }

function AliPrimeval()
    {
    while(true)
        {
        ResyncValues();
        AliPrimevalGumpRenderer();
        Orion.Wait(1000);
        }
    }

function AliPrimevalGumpRenderer() 
	{
    var defaultButtons = [ //functionName,displayName,assetType,value
        [['AutoAttack','AutoAttack','toggle',0], ['AutoBuffs','AutoBuffs','toggle',0], ['AutoEvade','AutoEvade','toggle',0], ['AutoGatherMobs','AutoGatherMobs','toggle',0]],
        [['Monitor','Monitor','toggle',0], ['Listener','Listener','toggle',0], ['WalkSpawn','WalkSpawn','toggle',0]],
        [['DecoHighlighter','DecoHighlighter','toggle',0], ['RunAndHide','RunAndHide','toggle',0], ['AlwaysAttackAdjacent','AlwaysAttackAdjacent','toggle',0]],
        [['DecoPickup','DecoPickup','toggle',0], ['AutoTracker','AutoTracker','toggle',0], ['ClearUdp','ClearUdp','toggle',0]],
        [['Test','Test','text',0]],
        ];
    var gumpButtons = Shared.GetArray('gumpValues',defaultButtons);
    
    var rowAdj = 35;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
	var rowStart = 35;
	var columnStart = 20;
    
    var rowPos = rowStart;
    var colPos = [columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart];
    var gump = Orion.CreateCustomGump(10420); 
	var buttonGraphic = ['0x16D4','0x16D5']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
    var width = Math.max.apply(Math, gumpButtons.map(function (rows)
        {
        var length = rows.reduce(function(sum,ele)
            {
            return sum + ele[0].length * characterAdj + buttonTextHorAdj + 20;
            },0);
        return length + 40
        }));
    var height = gumpButtons.length * rowAdj + rowStart + 35;
    gump.Clear();
    gump.SetCallback('AliPrimevalGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //0xDAC 0x254e 0x2560 9bf5
	gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0000');
	gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0000');
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF660066', 0, 1, 0, 0, 0);
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF666600', 1, 2, 0, 0, 0);
    gump.AddColoredPolygone(15, 12, width - 30, height - 24, '#FF666600', 1, 2, 0, 0, 0);
	gump.AddText(20,9, 554, 'Modular Gump')
    var i = 1
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var gumpOption = column[0];
            var gumpTitle = column[1]
            var gumpType = column[2]
            switch(gumpType)
                {
                case 'toggle':
                    var state = Orion.ScriptRunning(gumpOption) ? buttonGraphic[1] : buttonGraphic[0];
                    gump.AddButton(i, colPos[r], rowPos, state, state, state, '0x0000');
                    colPos[r] += buttonTextHorAdj;
                    gump.AddText(colPos[r], rowPos + buttonTextVerAdj, textColor, gumpTitle)
                    colPos[r] += gumpTitle.length * characterAdj + 20;
                    break;
                default:
                    break;
                }
			i+=1;
            }
        rowPos += rowAdj;
        }
    gump.Update();
	}

function AliPrimevalGumpCallback(_) 
	{
    var gumpButtons = Shared.GetArray('gumpValues');
    var code = CustomGumpResponse.ReturnCode();
    //Orion.Print(code)
    if(code == 0)
        return;
    else if(code == 100)
        Orion.Print(true);
    var i = 1;
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var gumpOption = column[0];
            if(code == i++)
                {
                var gumpType = column[2];
                switch(gumpType)
                    {
                    case 'toggle':
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'text':
                        break;
                    default:
                        break;
                    }
                }
            }
        }
    //Orion.Print(gumpButtons)
    Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    AliPrimevalGumpRenderer() 	
	}

function ToggleFunction(option)
	{
	var state = Shared.GetVar(option, false);
	state ? Orion.Terminate(option) : Orion.Exec(option,true);
	Orion.Print(option + ': ' + !state);
	Shared.AddVar(option, !state); // Swaps the value of the state variable, if off, turn on
	}

function ToggleShared(option)
	{
	var state = !Shared.GetVar(option, false);
	Orion.Print(option + ': ' + state);
	Shared.AddVar(option, state); // Swaps the value of the state variable, if off, turn on
	}
	
function AutoAttack()
	{
	while(true) Orion.Wait(1000);
	}