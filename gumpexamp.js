//Global, accessible to both gump and callback
var comboBox1Info = ['Single Target', ['Primary', 'Secondary', 'Tertiary']]

function Gump()
    {
    var gump = Orion.CreateCustomGump(10420); 
    gump.Clear();
    gump.SetCallback('Callback');

    var width = 165
    var height = 90
    gump.AddResizepic(0, 0, 'a3c', width, height);

    var colPos = 20
    var rowPos = 20
    var sharedVarName = comboBox1Info[0];
    var optionList = comboBox1Info[1];
    var dropLength = optionList.length;
    var value = Shared.GetVar(sharedVarName,'Primary'); //set default option here
    gump.AddComboBox(1, colPos, rowPos, '0x0BB8', 0, '0x0BB8', 125, -3,dropLength);
    for(var i = 0; i < optionList.length; i++)
        {
        gump.AddComboBoxText(optionList[i], 0, value == optionList[i] ? 1 : 0, 115, 'center');
        }

    colPos = 55
    rowPos = 50
    var buttonGraphic = [2311,2313,2312]; 
    gump.AddButton(2, colPos, rowPos, buttonGraphic[0], buttonGraphic[1], buttonGraphic[2], '0x0000');
    
    gump.Update()
    }

function Callback()
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 2)
        {
        var sharedVarName = comboBox1Info[0];
        var optionList = comboBox1Info[1];
        var index = CustomGumpResponse.ComboBox(1); //gets the selection of combobox as an integer
        Orion.Print('Combobox Index: ' + index)
        var value = index > -1 ? optionList[index] : undefined; //combobox will return -1 if blank selection
        Shared.AddVar(sharedVarName,value);
        Orion.Print(sharedVarName + 'set to value: ' + value);
        }
    }

function UseVariable()
    {
    var value = Shared.GetVar('Single Target',undefined);
    if(value)
        {
        Orion.Print(value);
        }
    }