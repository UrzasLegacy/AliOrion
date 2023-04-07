//Asset Types:
//'button': A custom graphic button. Args: 'graphic','graphicSelected','graphicPressed', widthAdjust
//'toggle': A gem toggle button. Args: 'functionName', 'displayName', ('altGraphic|altGraphicSelected|altGraphicPressed',xAdj,yAdj)
//'text': A text input. Args: 'storedVarName'
//'xSpacer': A blank asset spacer. Args: width
//'ySpacer': A blank row spacer. Args: height
function MinimizeButton()
	{
	var gump = Orion.CreateCustomGump(11);
	gump.Clear();
	
    //gump.AddResizepic(0, 0, '5',80, 80); //background 0xDAC 0x254e 0x2560 9bf5 
	//gump.AddButton(0, 30, 30, 0x589, 0x6b1, 0x6b1, '0x0487');
	gump.AddButton(0, 0, 0, 0x7d6, 0x7d6, 0x7d6, '0x0487');
	gump.Update();
	}

var defaultAssets = 
    [
        [ ['toggle','Example1Function','Example1','0x2c88|0x2c89|0x2c8A','0x2c92|0x2c93|0x2c94', 6, 6],  ['toggle','Example3Function','Three'], ['toggle','Example4Function','4'] ],
        [ ['toggle','Example2Function','ExampleTwo'],['ySpacer',10] ],
        [ ['text','ExampleText1'],['text','ExampleText2'],['text','ExampleText3'],['text','ExampleText4'] ],
        [],
        [ ['button','0x2EE0','0x2EE0','0x2EE1', 100] ]
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
            var asset = row[c];
            var assetType = asset[0];
            switch(assetType)
                {
                case 'text':
                    var sharedName = asset[1];
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
    //var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 

    var rowAdj = 35;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
	var rowStart = 35;
	var columnStart = 25;

    var gumpButtons = Shared.GetArray('gumpValues',[]);
    //Orion.Print(gumpButtons)
    if(!gumpButtons[0])
        {
        Shared.AddArray('gumpValues',defaultAssets)
        gumpButtons = defaultAssets;
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
                    widthAdjust = ele[4];
                    break;
                case 'toggle':
                    widthAdjust = (ele[2].length * characterAdj) + buttonTextHorAdj + 20 + (ele[5] || 0);
                    break;
                case 'text':
                    widthAdjust = 135;
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
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(15, 12, width - 30, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(15, 12, width - 30, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
	//gump.AddText(20,9, 554, 'Modular Gump') //title
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>Ali's Modular Gump</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Elements
	//gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
	//gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    
    //Modular Elements
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
                    var graphic = asset[1];
                    var graphicSelected = asset[2];
                    var graphicPressed = asset[3];
                    var widthAdjust = asset[4];
                    gump.AddButton(i, colPos, rowPos, graphic, graphicSelected, graphicPressed, '0x0000');
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
                    colPos += buttonTextHorAdj + gumpTitle.length * characterAdj + 20;
                    break;
                case 'text':
                    var sharedName = asset[1];
                    gump.AddResizepic(colPos, rowPos + 5, '0x0BB8', 100, 19);
                    gump.AddTextEntry(i + 200, colPos + 5, rowPos + 4, 1159, Shared.GetVar(sharedName,''), 100, 20);
                    gump.AddText(colPos,rowPos - 13,554,sharedName);
                    gump.AddColoredPolygone(colPos, rowPos + 5, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos + 87, rowPos + 6, '0x16CF', '0x16D0', '0x16D0', '0x0487');
                    gump.AddTooltip('Update')
                    colPos += 135;
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
    gump.Update();
    //Orion.Print('interval: ' + (Orion.Now() - startTime))
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
    var gumpButtons = Shared.GetArray('gumpValues');
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            if(code == i++)
                {
                var assetType = asset[0];
                switch(assetType)
                    {
                    case 'toggle':
                        var gumpOption = asset[1]; //Function name to toggle
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'text':
                        var text = CustomGumpResponse.Text(code + 200);
                        var gumpOption = asset[1]; //Shared Variable Name
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
	
function Example1Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example2Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example3Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example4Function()
    {
    while(true) Orion.Wait(1000);
    }