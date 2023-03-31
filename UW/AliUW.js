//v2

//Replace the names here with the names of your healers
var healerArr = ['Alyx','Beatrix','Couli','Daemont']
var enpointe = 'Iona'
var healLeader = 'Daemont'

function test()
	{
	Orion.Print(Player.Hits('%'));
	}

function Autostart()
	{
	Orion.Wait(2000);
	Orion.UseObject(backpack);
	Orion.ToggleScript('JournalScan');
	}





//--#Barrels





//--#Samp




//--#Misc




function DrawRangeUW(minX,minY,maxX,maxY)
	{
	Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
		.forEach(function (tile,ind) 
			{
			Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
			});
	}

