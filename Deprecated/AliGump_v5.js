//Asset Types:
//'toggle': A gem toggle button. Args: 'functionName', 'displayName'
//'text': A text input. Args: 'storedVarName'
//'xSpacer': A blank column spacer. Args: width
//'ySpacer': A blank row spacer. Args: height

var defaultAssets = 
    [ //functionName,displayName,assetType,value
        [ ['toggle','AutoAttack','AutoAttack'], ['toggle','AutoBuffs','AutoBuffs'], ['toggle','AutoEvade','AutoEvade'], ['toggle','AutoGatherMobs','AutoGatherMobs'] ],
        [],
        [ ['text','SelfHealThreshold%'],['text','OtherHealThreshold%'],['text','name'],['text','name'] ],
    ];

function forceInitButtons(_)
    {
    Shared.AddArray('gumpValues',defaultAssets);
    }

function initVars()
    {
    for(var r = 0;r<defaultAssets.length;r++)
        {
        var row = defaultAssets[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var assetType = column[0];
            switch(assetType)
                {
                case 'text':
                    var sharedName = column[1];
                    Shared.AddVar(sharedName) 
                    break;
                default:
                    break;
                }
            }
        }
    }

function AliGumpRenderer() 
	{
    var startTime = Orion.Now();
    var gumpButtons = Shared.GetArray('gumpValues',false);
    if(!gumpButtons)
        {
        Shared.AddArray('gumpValues',defaultAssets)
        gumpButtons = Shared.GetArray('gumpValues');
        }
    var rowAdj = 35;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
	var rowStart = 35;
	var columnStart = 25;
    
    var rowPos = rowStart;
    var colPos = [columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart,columnStart];
    var gump = Orion.CreateCustomGump(10420); 
	var buttonGraphic = ['0x16D4','0x16D5']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
    var width = Math.max.apply(Math, gumpButtons.map(function (rows)
        {
        var length = rows.reduce(function(sum,ele)
            {
            var assetType = ele[0];
            var widthAdjust = 0
            switch(assetType)
                {
                case 'toggle':
                    widthAdjust = (ele[2].length * characterAdj) + buttonTextHorAdj + 20;
                    break;
                case 'text':
                    widthAdjust = 135;
                    break;
                case 'xSpacer':
                    widthAdjust = ele[1];
                    break;
                default:
                    break;
                }
            return sum + widthAdjust;
            },0);
        return length + 40
        }));
    var height = (gumpButtons.length * rowAdj) + (rowStart * 2);
    gump.Clear();
    gump.SetCallback('AliGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(15, 12, width - 30, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
	//gump.AddText(20,9, 554, 'Modular Gump') //title
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>Ali's Modular Gump</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Elements
	gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0000'); //accept
	gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0000'); //clear
    
    //Modular Elements
    var i = 1;
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            var assetType = column[0];
            switch(assetType)
                {
                case 'toggle':
                    var gumpOption = column[1];
                    var gumpTitle = column[2];
	                var buttonOnGraphic = ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
	                var buttonOffGraphic = ['0x25F8','0x25F9','0x25F9']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    var stateGraphic //graphic,selected,pressed
                    Orion.ScriptRunning(gumpOption) ? stateGraphic = buttonOnGraphic : stateGraphic = buttonOffGraphic;
                    gump.AddButton(i, colPos[r], rowPos, stateGraphic[0], stateGraphic[1], stateGraphic[2], '0x0000');
                    colPos[r] += buttonTextHorAdj;
                    gump.AddText(colPos[r], rowPos + buttonTextVerAdj, textColor, gumpTitle);
                    colPos[r] += gumpTitle.length * characterAdj + 20;
                    break;
                case 'text':
                    var sharedName = column[1];
                    gump.AddResizepic(colPos[r], rowPos + 5, '0x0BB8', 100, 19);
                    gump.AddTextEntry(i + 200, colPos[r] + 5, rowPos + 4, 1159, Shared.GetVar(sharedName,''), 100, 20);
                    gump.AddText(colPos[r],rowPos - 13,554,sharedName);
                    gump.AddColoredPolygone(colPos[r], rowPos + 5, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos[r] + 87, rowPos + 6, '0x16CF', '0x16D0', '0x16D0', '0x0000');
                    colPos[r] += 135;
                    break;
                case 'xSpacer':
                    var xAdjust = column[1];
                    colPos[r] += xAdjust;
                    break;
                case 'ySpacer':
                    var yAdjust = column[1];
                    rowPos += yAdjust;
                    break;
                default:
                    break;
                }
			i += 1;
            }
        rowPos += rowAdj;
        }
    gump.Update();
    Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function AliGumpCallback(_) 
	{
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print(code)
    if(code == 0)
        return;
    else if(code == 100)
        Orion.Print(true);
    else if(code == 101)
        {
        Orion.Terminate('all','AliGumpCallback');
        Orion.Wait(50);
        return AliGumpRenderer();
        }
    var i = 1;
    var gumpButtons = Shared.GetArray('gumpValues');
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var column = row[c];
            if(code == i++)
                {
                var assetType = column[0];
                switch(assetType)
                    {
                    case 'toggle':
                        var gumpOption = column[1]; //Function name to toggle
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'text':
                        var gumpOption = column[1]; //Shared Variable Name
                        var text = CustomGumpResponse.Text(code + 200);
                        Shared.AddVar(gumpOption,text);
                        Orion.Print(text);
                        break;
                    default:
                        break;
                    }
                }
            }
        }
    //Orion.Print(gumpButtons);
    Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    AliGumpRenderer();
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
function AutoBuffs()
{
while(true) Orion.Wait(1000);
}
function AutoEvade()
{
while(true) Orion.Wait(1000);
}
function AutoGatherMobs()
{
while(true) Orion.Wait(1000);
}