function ExodusSorter()   
{
var Robe = '0x1F03';
var Rite = '0x2258';
var Dagger = '0x2D2D';
var GargDagger = '0x406A';
var Altar = '0x14F0';

		Orion.CharPrint(self, 1159, 'Select key bag.  Should be a container in your pack that has your exodus keys inside.')
	Orion.WaitForAddObject('myTarget');
	var KeyBag = Orion.GetSerial('myTarget');
		if(!KeyBag)
			return Orion.CharPrint(self, 1159, 'No key bag detected.  Restart with container in your pack.')
		Orion.Wait(500)
	Orion.OpenContainer(KeyBag);
		Orion.Wait(500)
	Orion.CharPrint(self, 1159, 'Select robe secure.');
    Orion.WaitForAddObject('myTarget');
	var RobeContainer = Orion.GetSerial('myTarget');
			while (Orion.Count(Robe, 'any',KeyBag) >0){
			Orion.MoveItemType(Robe, 'any', KeyBag, 0, RobeContainer)
			Orion.Wait(500)
		}
	Orion.CharPrint(self, 1159, 'Select rite secure.')
    Orion.WaitForAddObject('myTarget');
	var RiteContainer = Orion.GetSerial('myTarget');
			while (Orion.Count(Rite, 'any', KeyBag) >0){
			Orion.MoveItemType(Rite, 'any', KeyBag, 0, RiteContainer)
			Orion.Wait(300)
}
	Orion.CharPrint(self, 1159, 'Select dagger secure.')
    Orion.WaitForAddObject('myTarget');
	var DaggerContainer = Orion.GetSerial('myTarget');
			while (Orion.Count(Dagger, 'any', KeyBag) >0){
			Orion.MoveItemType(Dagger, 'any', KeyBag, 0, DaggerContainer)
			Orion.Wait(300)
}
			while (Orion.Count(GargDagger, 'any', KeyBag) >0){
			Orion.MoveItemType(GargDagger, 'any', KeyBag, 0, DaggerContainer)
			Orion.Wait(300)
}
	Orion.CharPrint(self, 1159, 'Select Altar secure. It should contain exodus altars');
			Orion.WaitForAddObject('myTarget');
			var AltarContainer = Orion.GetSerial('myTarget')
			Orion.Wait(750)	
			while (Orion.Count(Altar, 'any', KeyBag) >0){
			Orion.MoveItemType(Altar, 'any', KeyBag, 0, AltarContainer)
			Orion.Wait(300)
		}
}

function ExodusKeyBagger()
	{
	var Robe = '0x1F03';
	var Rite = '0x2258';
	var Dagger = '0x2D2D';
	var GargDagger = '0x406A';
	var Altar = '0x14F0';
	
	Orion.CharPrint(self, 1159, 'Select robe secure. It should contain exodus robes');
	Orion.WaitForAddObject('myTarget');
	var RobeContainer = Orion.GetSerial('myTarget');
	Orion.Wait(750)
		Orion.OpenContainer(RobeContainer)
			if(!RobeContainer || Orion.GetDistance(RobeContainer) >2)
				return Orion.CharPrint(self, 1159, 'Robe container missing or too far away.  Move within range of robe container and restart')
	Orion.CharPrint(self, 1159, 'Select rites secure. It should contain exodus summoning rites');
	Orion.WaitForAddObject('myTarget');
	var RiteContainer = Orion.GetSerial('myTarget');
	Orion.Wait(750)	
		Orion.OpenContainer(RiteContainer)
			if(!RiteContainer || Orion.GetDistance(RiteContainer) >2)
				return Orion.CharPrint(self, 1159, 'Rite container missing or too far away.  Move within range of rite container and restart')
	Orion.CharPrint(self, 1159, 'Select dagger secure. It should contain exodus sacrificial daggers');
	Orion.WaitForAddObject('myTarget');
	var DaggerContainer = Orion.GetSerial('myTarget');
	Orion.Wait(750)
		Orion.OpenContainer(DaggerContainer)
			if(!DaggerContainer || Orion.GetDistance(DaggerContainer) >2)
				return Orion.CharPrint(self, 1159, 'Dagger container missing or too far away.  Move within range of dagger container and restart')
	Orion.CharPrint(self, 1159, 'Select key bag.  Should be a container in your pack you want Exodus Keys placed in.')
	Orion.WaitForAddObject('myTarget');
	var KeyBag = Orion.GetSerial('myTarget');
	Orion.Wait(1000)	
		if(!KeyBag)
			return Orion.CharPrint(self, 1159, 'No key bag detected.  Restart with container in your pack.')
		Orion.Wait(500)
	Orion.OpenContainer(KeyBag);
		while (Orion.Count(Robe, '0x0A8E', KeyBag) < 5){
			Orion.MoveItemType(Robe, '0x0A8E', RobeContainer, 0, KeyBag)
			Orion.Wait(300)
}
	while (Orion.Count(GargDagger, '0x09C4', KeyBag) < 5){
		Orion.MoveItemType(GargDagger, '0x09C4', DaggerContainer, 0, KeyBag) //Can switch to (Dagger, '0x09C4') for non-garg daggers
		Orion.Wait(300)
	}
		while (Orion.Count(Rite, '0x0776', KeyBag) < 5){
			Orion.MoveItemType(Rite, '0x0776', RiteContainer, 0, KeyBag)
			Orion.Wait(300)
	}
}
function DaggerConverter()
	{
	Orion.CharPrint(self, 1159, 'Select dagger secure. It should contain exodus sacrificial daggers');
	Orion.WaitForAddObject('myTarget');
	var DaggerContainer = Orion.GetSerial('myTarget');
	Orion.Wait(750)
		Orion.OpenContainer(DaggerContainer)
	Orion.CharPrint(self, 1159, 'Select NPC'); //honor gate then through cave to exodus dagger converting npc
	Orion.WaitForAddObject('myTarget');
		var DaggerNPC = Orion.GetSerial('myTarget');
	Orion.Wait(750)
	while (Orion.Count('0x2D2D', '0x09C4', DaggerContainer) > 1){
		Orion.DragItemType('0x2D2D', '0x09C4', DaggerContainer, 0, DaggerNPC)
		Orion.Wait(300)
		Orion.DropDraggedItem(DaggerNPC)
		Orion.Wait(500)
	}
}

