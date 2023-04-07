function testInit()
    {
    initVars();
    ResyncValues()
    TextWindow.Open();
    TextWindow.Print(JSON.stringify(Shared.GetArray('gumpValues')))
    }

function initButtons(_)
    {
    var gumpButtons = [
        [['AutoAttack',false], ['AutoBuffs',false], ['AutoEvade',false], ['AutoGatherMobs',false]],
        [['Monitor',false], ['Listener',false], ['WalkSpawn',false]],
        [['DecoHighlighter',false], ['RunAndHide',false], ['AlwaysAttackAdjacent',false]],
        [['DecoPickup',false], ['AutoTracker',false], ['ClearUdp',false]],
        ]
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
    var defaultButtons = [
        [['AutoAttack',false], ['AutoBuffs',false], ['AutoEvade',false], ['AutoGatherMobs',false]],
        [['Monitor',false], ['Listener',false], ['WalkSpawn',false]],
        [['DecoHighlighter',false], ['RunAndHide',false], ['AlwaysAttackAdjacent',false]],
        [['DecoPickup',false], ['AutoTracker',false], ['ClearUdp',false]],
        ];
	var gumpButtons = Shared.GetArray('gumpValues',defaultButtons);
    var gump = Orion.CreateCustomGump(10420); 
	var buttonGraphic = [0x16D4,0x16D5]; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
    gump.Clear();
    gump.SetCallback('AliPrimevalGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', 500, 500); //0xDAC 0x254e 0x2560 9bf5
	var rowAdj = 40;
	var columnAdj = 120;
	var rowStart = 40;
	var columnStart = 20;
	var buttonTextHorAdj = 32;
	var buttonTextVerAdj = 3;
	var textColor = 1159;
	gump.AddButton(0, 400, 460, 0x2EE0,0x2EE0,0x2EE1, '0x0000');
	gump.AddText(185,15, textColor, "Ali's Primeval Spawner")
    var i = 1
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var gumpOption = column[0];
            var state = Orion.ScriptRunning(gumpOption)//column[1];
            gump.AddButton(i, columnStart + (columnAdj * c), rowStart + (rowAdj * (r)), state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], state ? buttonGraphic[1] : buttonGraphic[0], '0x0000');
            gump.AddText(columnStart + buttonTextHorAdj + (columnAdj * (c)), rowStart + buttonTextVerAdj + (rowAdj * r), textColor, gumpOption)
			i+=1;
            }
        }
    gump.Update();
	}

function AliPrimevalGumpCallback(_) 
	{
    var gumpButtons = Shared.GetArray('gumpValues');
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print(code)
    var i = 1;
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var gumpOption = column[0];
            var state = column[1];
            if(code == i++)
                {
                Orion.Print(gumpOption);
	            state ? Orion.Terminate(gumpOption) : Orion.Exec(gumpOption,true);
                gumpButtons[r][c][1] = !state;
                }
            }
        }
    Orion.Print(gumpButtons)
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