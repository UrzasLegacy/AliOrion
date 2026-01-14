function AliA() {
    var gump = Orion.CreateCustomGump(10420);
    var state = Shared.GetVar('state', '0x2C92'); // Shared variable to set the initial state to off (Untoggled Radio Dot), defaults to '0x00D0'
    gump.Clear();
    gump.SetCallback('GumpCallback');
    gump.AddResizepic(0, 0, '13BE', 200, 200);
	if(state == '0x2C88')
    	gump.AddButton(0, 10, 10, state, state, state, '0x0000'); //Radio dot, should toggle itself on and off with the 'state' variable
	if(state == '0x2C88')
		gump.AddButton(0, 10, 10, state, state, state, '0x0000'); //Radio dot, should toggle itself on and off with the 'state' variable
    gump.Update();
}

function GumpCallback(_) {
    var code = CustomGumpResponse.ReturnCode();
    var state = Shared.GetVar('state', '0x00D0'); // Shared variable to set the initial state to off (Untoggled Radio Dot), defaults to '0x00D0'
    if(code == 0) {
        Orion.Print(state);
        if(state == '0x00D0') {
            Shared.AddVar('state', '0x00D1'); // Swaps the value of the state variable, if off, turn on
        } else {
            Shared.AddVar('state', '0x00D0'); // Swaps the value of the state variable, if on, turn off
        }
        Gump();
    }
}


var profile = {
	useGatherMobs: true, //boolean. Set to true to attack all mobs in the area to gather them towards you.
	useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
		singleTargetSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
	useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
		whirlwindSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
	useMomentumStrike: true, //boolean. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
	useCounterAttack: true, //boolean. Set to true to maintain Counter Attack at all times.
	useEnemyOfOne: false, //boolean. Set to true to maintain Enemy Of One at all times. Careful using this! It's not smart enough to change enemies.
	useConsecrateWeapon: false, //boolean. Set to true to maintain Consecrate Weapon at all times.
	useDivineFury: false, //boolean, Set to true to maintain Divine Fury at all times.
	useConfidence: true, //boolean. Set to true to use Confidence when HP drops below a percentage threshold defined below.
		useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
	useBandieSelf: false, //boolean. Set to true to heal self with bandage when HP drops below a percentage threshold defined below.
		useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
	useBandieOthers: false, //boolean. Will preferentially heal others over self if BandieSelf and BandieOthers are both on.
		useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
	};

function initScripts()
	{//Hotkey to run all relevant continuous scripts
	Orion.Exec('AutoAttack', true);
	if(profile.useConfidence || profile.useConsecrateWeapon || profile.useCounterAttack || profile.useDivineFury || profile.useEnemyOfOne)
		Orion.Exec('AutoBuffs', true);
	if(profile.useBandieSelf || profile.useBandieOthers)
		Orion.Exec('BandieBot', true);
	}

function terminateScripts()
	{//Hotkey to stop all running scripts
	Orion.Terminate('all');
	}

function AutoAttack()
	{//Attacks any mobs within a 1 tile radius and uses specials or momentum strike depending on how many mobs are nearby
	var useGatherMobs = profile.useGatherMobs;
	var useSingleTargetSpecial = profile.useSingleTargetSpecial;
	var singleTargetSpecial = profile.singleTargetSpecial;
	var useMomentumStrike = profile.useMomentumStrike;
	var useWhirlwind = profile.useWhirlwind;
	var whirlwindSpecial = profile.whirlwindSpecial;
	while (!Player.Dead())
		{
		var enemies = Orion.FindType(any, any, ground, "live|ignoreself|ignorefriends", 1, 'gray|red|criminal|orange');
		var enemyCount = enemies.length;
		if(enemyCount)
			{
			if(useGatherMobs)
				GatherMobs();
			else
				Orion.Attack(enemies[0]);
            switch(enemyCount)
                {
                case 0:
                    break;
                case 1:
                    if(useSingleTargetSpecial && !Orion.AbilityStatus(singleTargetSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(singleTargetSpecial);
                    break;
                case 2:
                    if(useMomentumStrike && !Orion.BuffExists('Momentum Strike') && Player.Mana() >= 8)
                        Orion.Cast('Momentum Strike');
                    break;
                default: //more than 2 enemies
                    if(useWhirlwind && !Orion.AbilityStatus(whirlwindSpecial) && Player.Mana() >= 15)
                        Orion.UseAbility(whirlwindSpecial);
                    break;
                }
			}
		Orion.Wait(500);
		}
	}

function AutoBuffs()
	{//Casts confidence as approprate and attempts to keep other toggled buffs active at all times.
	var useConfidence = profile.useConfidence;
	var useConfidenceThresholdPercent = profile.useConfidenceThresholdPercent;
	var useEnemyOfOne = profile.useEnemyOfOne;
	var useCounterAttack = profile.useCounterAttack;
	var useConsecrateWeapon = profile.useConsecrateWeapon;
	var useDivineFury = profile.useDivineFury;
	var nextSpellTime = 0;
	while(!Player.Dead())
		{
		if(Orion.Now() > nextSpellTime && Player.Mana() > 20)
			{
			if(useConfidence && Player.Hits('%') < useConfidenceThresholdPercent && !Orion.BuffExists('Confidence'))
				{
				Orion.Cast('Confidence');
				nextSpellTime = Orion.Now() + 1200;
				}
			else if(useEnemyOfOne && !Orion.BuffExists('Enemy of One'))
				{
				Orion.Cast('Enemy of One');
				nextSpellTime = Orion.Now() + 2000;
				}
			else if(useCounterAttack && !Orion.BuffExists('Counter Attack'))
				{
				Orion.Cast('Counter Attack');
				nextSpellTime = Orion.Now() + 2000;
				}
			else if(useConsecrateWeapon && !Orion.BuffExists('Consecrate Weapon'))
				{
				Orion.Cast('Consecrate Weapon');
				nextSpellTime = Orion.Now() + 2000;
				}
			else if(useDivineFury && !Orion.BuffExists('Divine Fury'))
				{
				Orion.Cast('Divine Fury');
				nextSpellTime = Orion.Now() + 2000;
				}
			}
    	Orion.Wait(100);
    	}
	}

function BandieBot()
	{//heals either self, others, or both with bandages. Will sound an alarm noise when bandages are below 50.
	var useAlarmSound = profile.useAlarmSound;
	var useBandieOthers = profile.useBandieOthers;
	var useBandieOtherThresholdPercent = profile.useBandieOtherThresholdPercent;
	var useBandieSelf = profile.useBandieSelf;
	var useBandieSelfThresholdPercent = profile.useBandieSelfThresholdPercent;
	while(!Player.Dead())
		{
		while(!Player.Dead())
			{
			var bandies = Orion.FindType('0x0E21')[0];
			if(Orion.Count('0x0E21') < 50)
				{
				Orion.Wait(200);
				if(Orion.Count('0x0E21') < 50) //with just one check, was getting false positives for some reason
					{
					if(useAlarmSound)
						Orion.PlayWav('Alarm.wav');
					break;
					}
				}
			var target = injuredCheck(2, useBandieOtherThresholdPercent);
			if(useBandieOthers && target && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(1000))
					Orion.TargetObject(target.Serial());
				}
			else if(useBandieSelf && Player.Hits('%') < useBandieSelfThresholdPercent && !Orion.BuffExists('Healing Skill') && bandies)
				{
				Orion.UseObject(bandies);
				if(Orion.WaitForTarget(1000))
					Orion.TargetObject(self);
				}
			Orion.Wait(200);
			}
		while(!Player.Dead() && Orion.Count('0x0E21') < 50)
			{
			Orion.Wait(1000);
			}
		}
	}

function GatherMobs()
	{ //Attacks all mobs in the area and then ensures you are attacking the nearest mob
	Orion.FindType(any, any, ground, 'live|inlos|ignorefriends', 20, 'gray|red')
		.forEach(function(mob)
			{
			Orion.TargetSystemSerial(mob);
			Orion.Attack(mob);
			Orion.Wait(10);
			});
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 20, 'gray|red')[0];
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}

function AttackNearest()
	{
	var target = Orion.FindType(any, any, ground, 'near|live|inlos|ignorefriends', 20, 'gray|red')[0];
	Orion.TargetSystemSerial(target);
	Orion.Attack(target);
	}
//EquipWep(slayerType, damageType, weaponName, cameoSlayer)
//if cameoSlayer isn't defined, it'll default to slayerType
//Press hotkey once to change your weapon, press it again to change your cameo
function EquipDemonColdAxe()
	{
	EquipWep('Demon', 'Cold', 'Double Axe');
	}
function EquipDemonPhysicalAxe()
	{
	EquipWep('Demon', 'Physical', 'Double Axe');
	}
function EquipDragonColdStaff()
	{
	EquipWep('Dragon', 'Physical', 'Double Axe');
	}
function EquipRepondAxe()
	{
	EquipWep('Repond', false, 'Double Axe');
	}
function EquipArachnidFireAxe()
	{
	EquipWep('Arachnid', 'Fire', 'Double Axe');
	}
function EquipElementalFireAxe()
	{
	EquipWep('Elemental', 'Fire', 'Double Axe');
	}
function EquipElementalColdAxe()
	{
	EquipWep('Elemental', 'Cold', 'Double Axe');
	}
function EquipDragonColdStaff()
	{
	EquipWep('Dragon', 'Cold', 'Bladed Staff', 'Reptile');
	}
function EquipReptileColdAxe()
	{
	EquipWep('Reptile', 'Cold', 'Double Axe');
	}

function EquipSampSuit()
	{//set up main samp suit in Dress Agent and name it 'your character's name Samp', e.g. 'Bob Samp'
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var setName = Player.Name().slice(5, Player.Name().length) + ' Samp'
	else
		var setName = Player.Name() + ' Samp'
	Orion.Dress(setName);
	}

function EquipLRCSuit()
	{//set up LRC suit in Dress Agent and name it 'your character's name LRC', e.g. 'Bob LRC'
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
		var setName = Player.Name().slice(5, Player.Name().length) + ' LRC'
	else
		var setName = Player.Name() + ' LRC'
	Orion.Dress(setName);
	}

function LogOut()
    {//Simply logs you out and turns off AutoReconnect if it's on
    Orion.OAOptionSet('AutoReconnect', 0);
    Orion.LogOut();
    }

function FindOwnCorpse()
    {//Runs to and loots your corpse. Might need to spam the hotkey
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var _pName = Player.Name().slice(5, Player.Name().length);
    else
        var _pName = Player.Name()
    var body = Orion.FindTypeEx(any, any, ground, 'ignoreself', 24).filter(function(part)
		{
		return Orion.Contains(part.Properties(), _pName)
		});
    if(Orion.WalkTo(body[0].X(), body[0].Y()))
        Orion.UseObject(body[0].Serial());
    }

//Call Functions
function injuredCheck(range, threshold)
	{//searches green players within range with HP under a percentage threshold and returns the player with the lowest HP.
	var injurelist = Orion.FindTypeEx(any, any, ground, 'ignoreself|live', range, 'green')
		.filter(function(part)
			{
			return part.Hits('%') < threshold;
			}).sort(function(a,b)
				{
				return a.Hits() - b.Hits();
				});
	return injurelist[0];
    }

function EquipWep(slayer, element, weapon, cameo)
	{//Description above, with all the functions calling this.
	if(!slayer)
		slayer = ' ';
	else
		slayer += ' Slayer';
	if(!element)
		element = ' ';
	else
		element += ' Damage';
	if(!weapon)
		weapon = ' ';
	var wep = Orion.FindTypeEx(any).filter(function(part)
		{
		return Orion.Contains(part.Properties(), element)
			&& Orion.Contains(part.Properties(), slayer)
			&& Orion.Contains(part.Properties(), weapon);
		});
	if(slayer != ' ' && cameo == undefined)
		{
		var cam = Orion.FindTypeEx('0x2F5B|0x9E28').filter(function(part)
			{
			return Orion.Contains(part.Properties(), slayer);
			});
		}
	else if(cameo != undefined)
		{
		var cam = Orion.FindTypeEx('0x2F5B|0x9E28').filter(function(part)
			{
			return Orion.Contains(part.Properties(), cameo);
			});
		}
	if(wep[0])
		Orion.Equip(wep[0].Serial());
	if(cam && cam[0])
		Orion.Equip(cam[0].Serial());
	}