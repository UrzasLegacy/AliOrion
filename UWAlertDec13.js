function UWAlert()
	{
    // Credit and Thank You to adverserath for the BotPush function!
    
    //-- Description
    // The wooden planks that cover the entrance down to the UW boss are different from the other planks of the ship and
    // are detectable objects. This script scans once per second for the existence of these planks within the client view
    // distance (OSI client range is 24 tiles), reports how long it has been scanning, and notifies when the tiles appear or
    // disappear (indicating UW has popped or reset). The script opens your character's backpack once per minute to stay logged in.

    //-- Setup Instructions README
    // You will need channel editing permissions in Discord. Webhook information should be kept secure between mods only.
    // Select channel options for the channel in which you wish notifications to appear (mouse over the channel and a small 
    // gear will appear for settings). Go to Integrations and create a new webhook. The name you choose here will show up
    // as the sender of the notifications. Click "Copy Webhook URL" and paste it somewhere. It'll look like this:
    // https://discord.com/api/webhooks/xxx/yyy 
    // where xxx is the hook ID and yyy is the API key. 
    // Create discordkey.conf in your Electronic Arts > Ultima Online Classic folder
    // In discordkey.conf, paste the hook as the first word then put a single space and paste the key as the second word.
    // Example: 
    // 8847216469387824324 4_T2ClblTShVKreq6znmEhb7P_dslm2Xj0wqiwckQFyFsCQZFTxbyK_PIiD32SsEFu9L
    // Next, I recommend creating a role that people can subscribe to or request in your Discord so only the people that want
    // to be spammed with notifications will be. Once you've created a role, type \@rolename (e.g. \@members) in any channel
    // and you'll get a Role ID that looks like this <@&887466212769013843>. Copy just the numbers and paste them in the
    // appropriate spot in User Settings below.
    //
    // It's recommended to use an EJ account so you're not tying up your main account the whole time. Create a character with
    // 50 hiding and get them down to UW. Hide your character anywhere as long as at least 1 of the entrance tiles is within
    // view distance. Change settings as you wish below. Toggle UWAlert on and you are set!

    //-- User Settings
    var pushToggle = true; //set to true to send messages to Discord. If set to false, notifications will be written locally to Orion's TextWindow instead.    
    var discordRoleID = '881249430597165118'; //type \@rolename in your Discord to get the role ID. Ex: \@members
    var soundToggle = true //set to true to enable sound notification.
    var soundFile = 'Alarm.wav' //default is the system warning sound. Can be changed by putting a .wav file of your choice in the Orion Launcher folder.
    //-- Do not edit below
    
    var ali,s,t,o,r;
    r = encodeURIComponent('&');
	if(Orion.ClientOptionGet('MergeSameSystemMessages'))
        Orion.ClientOptionSet('MergeSameSystemMessages', 1); //Orion's configuration > Journal and text options > Combine the same system messages
    while(true)
		{
		s = 0;
		t = "seconds since UW closed";
		ali = Orion.FindType(0x07CD, '-1', ground, 'item', "xyz:-1, -1, 10");
		while(ali.length)
			{
			s++;
			ali = Orion.FindType(0x07CD, '-1', ground, 'item', "xyz:-1, -1, 10");
			Orion.Print(t);
			if ((s % 60) == 0)
				{
				Orion.OpenContainer('backpack');
				o = s / 60;
				t = 'seconds, ' + o + ' minutes since UW closed';
				}
			Orion.Wait(1000);
			}
		if(s > 1)
			{
			if(soundToggle)
                Orion.PlayWav(soundFile);
			if(pushToggle)
                BotPush('<@' + r + discordRoleID + '> UW just popped!');
			else
                {   
                TextWindow.Open();
			    TextWindow.Print(Orion.Time("hh:mm:ss") + ": UW Open");
                }
            }			
		s = 0;
		t = "seconds since UW opened";
		while(!ali.length)
			{
			s++;
			ali = Orion.FindType(0x07CD, '-1', ground, 'item', "xyz:-1, -1, 10");
			Orion.Print(t);
			Orion.Wait(1000);
			if ((s % 60) == 0)
				{
				Orion.OpenContainer('backpack');
				o = s / 60;
				t = 'seconds, ' + o + ' minutes since UW opened';
				}
			}
        if(s > 1)
			{
            if(soundToggle)
                Orion.PlayWav(soundFile);
            if(pushToggle)
                BotPush('<@' + r + discordRoleID + '> UW just reset');
            else
                {   
                TextWindow.Open();
			    TextWindow.Print(Orion.Time("hh:mm:ss") + ": UW Closed");
                }
            }
        }
	}


//Create discordkey.conf in "Classic Client" folder
//First Word 1 = Discord hook ID
//single space
//Second Word 2 = API key
function BotPush(message) //by adverserath
	{
    var hook;
	var key;
    if (hook == null && key == null) 
    	{
        var file = Orion.NewFile();
        open = file.Open('discordkey.conf');
        if (!file.Opened()) 
        	{
            return;
        	}
        hook = file.Read();
        key = file.Read();
        file.Close();
    	}
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var paramText = "content=" + message;
    Orion.HttpPost(bot, paramText);
	}

// Turn on Autostart in the Orion Assistant Main Options Checklist to automatically reconnect and restart the script if your client loses connection. 
function Autostart()
	{
	Orion.Wait(1000);
	Orion.Exec('UWAlert', true);
	Orion.OAOptionSet('AutoReconnect', '1');
	Orion.OAOptionSet('AutoReconnectTimer', '60');
	}
