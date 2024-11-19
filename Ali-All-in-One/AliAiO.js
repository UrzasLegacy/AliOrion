//#include Ali/AliQoL.js
//#include Ali/AliAutomation.js
//#include Ali/AliDebug.js
//#include Ali/AliHelpers.js
//#include Ali/AliLooterPlugin.js
//#include Ali/AliVS.js


function Gyoza()
	{
	var layers = [-44, -25]
	Orion.WaitForAddObject("boop")
	var x = SelectedTile.X()
	var y = SelectedTile.Y()
	var gump = Orion.GetGump('0x0000028C');
	if (gump !== null)
		{
		gump.Select(Orion.CreateGumpHook(2));
		Orion.Wait(100);
		}
	var gyozas = Orion.FindTypeEx(0x28A9,1159,ground,"item","xyz: " + x + ", " + y)
	while(true)
		{
		for(var i = 0; i < gyozas.length; i++)
			{
			if(gyozas[i].Z() != (-25 - (i * 19)))
				{
				Orion.WaitForTarget(2000)
				Orion.TargetObject(gyozas[i].Serial())
				}
			}
		Orion.Wait(50)
		}
	}

function Runes()
	{
	var runes = Orion.FindTypeEx(0x0E5C,1159,ground,"item",16)
	while(true)
		{
		for(var i = 0; i < runes.length; i++)
			{
			if(runes[i].Z() != 25)
				{
				Orion.WaitForTarget(2000)
				Orion.TargetObject(runes[i].Serial())
				}
			}
		Orion.Wait(50)
		}
	}

//Available Gumps
//AliVSGump
//AliLootGump
//AliStringSearchGump


//AliBODGump TODO
//AliImbueGump TODO
//AliTrainingGump TODO

//Task Scripts
//AliIDOC TODO



// Recommended Hotkeys:
// QoL
//  AttackNearest
//  GatherMobs
//  RepairGear
//  FindOwnCorpse


function terminateScripts()
	{
	Orion.Terminate('all')
	}