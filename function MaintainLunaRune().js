function MaintainLunaRune()
	{
	Orion.WaitForAddObject('myTarget');
	var runeBag = Orion.GetSerial('myTarget');
	while(true)
		{
		while(!Orion.GumpExists('container',runeBag))
			{
			Orion.UseObject(runeBag);
			Orion.Wait(1300);
			}
		var PlayerX = Player.X();
		var PlayerY = Player.Y();
		Orion.SetSearchArea(PlayerX - 1,PlayerY - 1,PlayerX + 1,PlayerY +1);
		var runeCheck = Orion.FindTypeEx('0x1F14',any,ground,'',2).filter(function(rune)
			{
			return Orion.Contains(rune.Properties(),'Imperatrix');
			})[0];
		Orion.ResetSearchArea();
		if(!runeCheck)
			{
			var rune = Orion.FindTypeEx('0x1F14',any,runeBag).filter(function(rune)
				{
				return Orion.Contains(rune.Properties(),'Imperatrix');
				})[0];
			if(!rune)
				break;
			DropRuneHere(rune.Serial())
			}
		Orion.EmoteAction('salute')
		Orion.Wait(150000);
		}
	}