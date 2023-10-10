function SortInputToBag(input)
	{
	if (input == false)
		input = ' '
	Orion.CharPrint(self, 1159, 'Target Source Bag');
	Orion.WaitForAddObject('sourcebag');
	var items = Orion.FindTypeEx(any, any, 'sourcebag').filter(function (part) 
		{
		return (Orion.Contains(part.Properties(), input));
		})
	Orion.CharPrint(self, 1159, 'Target Destination Bag');
	Orion.WaitForAddObject('destbag');
	for(i=0;i<items.length;i++)
		{
		Orion.MoveItem(items[i].Serial(), 0, 'destbag');
		Orion.Wait(1300);
		}
	}

function TextEntryGumpCallback(unused)
	{
	var code = CustomGumpResponse.ReturnCode();
	Orion.Print('Custom gump response code = ' + code);
	if (code == 0)
		{
		var gump = Orion.CreateCustomGump(1);
		gump.Close();
		}
	else if (code == 1)
		{
		var gump = Orion.CreateCustomGump(1);
		var texts = CustomGumpResponse.Texts();
		SortInputToBag(texts[0].Text());
		}
	}

function TextEntryGump()
	{
	var gump = Orion.CreateCustomGump(1);
	gump.Clear();
	gump.SetCallback('TextEntryGumpCallback');
	gump.AddResizepic(0, 0, '13BE', 200, 75); //background
	gump.AddText(60, 29, '0', "Confirm text:");
	gump.AddButton(0, 30,48, '0x00F3', '0x00F2', '0x00F1', '0', 1, 2); //cancel; Code 0
	gump.AddButton(1, 110,48, '0x00F9', '0x00F7', '0x00F8', '0', 1, 2); //okay; Code 1
	gump.AddResizepic(5, 10, '0x0BB8', 190, 20); //text entry background
	gump.AddTextEntry(2, 10, 10, '0x0052', '', 190, 20); //blank text entry
	gump.SetTextEntryPlaceholderText('Leave blank to transfer all'); //placeholder text
	gump.Update();
	}

