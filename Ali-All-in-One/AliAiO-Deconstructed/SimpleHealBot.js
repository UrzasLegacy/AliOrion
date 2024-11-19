var leaderSerial = 0x0000000
var followDistance = 5 // Distance from leader
var range = 10 // Range to look for heal targets
var hpThreshold = 90 // HP below which to start healing, as a percentage
var healerType = 0 // 0 = Mystic w/ Cleansing Winds, 1 = Mage with Greater Heal/Cure
var healBlues = false // Only heals greens by default, set this to true to also heal blues
var castInvisWhenHurt = true

function StartHealerSupport()
    {
    Orion.Exec("Follow",true,[leaderSerial, followDistance])

    if(healerType === 1)
        Orion.Exec("SingleMageHealBot",true,[range,hpThreshold])
    else
        Orion.Exec("MysticHealBot",true,[range,hpThreshold])
    }


function Follow(leaderSerial,followDistance)
    {
    if(followDistance == undefined) followDistance = 1;

    do
        {
        var leaderObj = Orion.FindObject(leaderSerial);
        Orion.CharPrint(self,1159,'Searching for Leader to follow...')
        Orion.Wait(200);
        } while(!leaderObj)

    while(true)
        {
        if(leaderObj && leaderObj.Exists() && leaderObj.Distance() > followDistance)
            Orion.WalkTo(leaderObj.X(),leaderObj.Y(),leaderObj.Z(),followDistance,10,1,1);
        Orion.Wait(100);
        }
    }

function MysticHealBot(range,hpThreshold)
	{
	while(!Player.Dead())
		{
		if(!Orion.HaveTarget() && !Player.Frozen())
			Orion.Cast('Cleansing Winds')
		var target = injuredCheck(range, hpThreshold);
		if(Player.Hits('%') < 90)
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(self);
            if(castInvisWhenHurt)
                {
                Orion.Cast("Invisibility")
                if(Orion.WaitForTarget(4000))
                    Orion.TargetObject(self);
                }
			}
		else if(target)
			{
			if(Orion.WaitForTarget(5000))
				Orion.TargetObject(target.Serial());
			}
		Orion.Wait(200);
		}
	}
	
function SingleMageHealBot(range,hpThreshold)
	{
	while(!Player.Dead())
		{
		if(!Orion.HaveTarget() && !Player.Frozen())
			{
			Orion.Cast('Greater Heal')
			Orion.WaitForTarget(3000);
			}
		var target = injuredCheck(range,hpThreshold);
		if(Player.Hits('%') < 90)
			{
			if(Orion.WaitForTarget(3000))
				Orion.TargetObject(self);
            if(castInvisWhenHurt)
                {
                Orion.Cast("Invisibility")
                if(Orion.WaitForTarget(4000))
                    Orion.TargetObject(self);
                }
			}
		else if(target)
			{
			if(target.Poisoned())
				{
				Orion.CancelTarget();
				Orion.Cast('Cure');
				if(Orion.WaitForTarget(3000))
					Orion.TargetObject(target.Serial());	
				}
			else
				{
				if(Orion.WaitForTarget(3000))
					Orion.TargetObject(target.Serial());	
				}
			}
		Orion.Wait(300);
		}
	}
	
function injuredCheck(range, threshold, healDead)
	{
	var flags = healDead ? 'ignoreself|mobile' : 'ignoreself|live';
    var notoriety = healBlues ? "green|blue" : "green"
	var injurelist = Orion.FindTypeEx(any, any, ground, flags, range, notoriety)
		.filter(function(part)
			{
			return part.Hits('%') < threshold;
			}).sort(function(a,b)
				{
				return a.Hits() - b.Hits();
				});
	return injurelist[0];
    }