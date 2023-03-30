function BandieBot()
	{
	var useBandieOthers = true;
	var useBandieOtherThresholdPercent = 90;
	var useBandieSelf = true;
	var useBandieSelfThresholdPercent = 50;
	while(!Player.Dead())
		{
		while(!Player.Dead())
			{
			while(!Orion.GumpExists('container',backpack))
				{
				Orion.UseObject(backpack);
				Orion.Wait(1300);
				}
			Orion.Wait(200);
			if(Orion.HaveTarget())
				continue;
			var bandies = Orion.FindType('0x0E21')[0];
			if(Orion.Count('0x0E21') < 50 || Orion.Count('0x0E21') < 50) //with just one check, was getting false positives for some reason
				{
				Orion.Wait(200);
                TextWindow.Open();
                TextWindow.Print(Player.Name() + ': Low on bandies');
				
				}
			var target = injuredCheck(2, useBandieOtherThresholdPercent, true);
			if(useBandieOthers && target && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(target.Serial());
				}
			else if(useBandieSelf && Player.Hits('%') < useBandieSelfThresholdPercent && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(2000))
					Orion.TargetObject(self);
				}
			}
		}
	}

function injuredCheck(range, threshold, healDead)
	{
	var flags = healDead ? 'ignoreself|mobile' : 'ignoreself|live';
	var injurelist = Orion.FindTypeEx(any, any, ground, flags, range, 'green')
		.filter(function(part)
			{
			return part.Hits('%') < threshold;
			}).sort(function(a,b)
				{
				return a.Hits() - b.Hits();
				});
	return injurelist[0];
    }