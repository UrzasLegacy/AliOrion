function DesignateDressPieces()
    {
    var serialArr = [];
    while(true)
        {
        Orion.CharPrint('Choose item to add to dress list\nPress Esc to finish choosing');
        var check = Orion.WaitForAddObject('myTarget');
        if(check == 0)
            break;
        var serial = Orion.GetSerial('myTarget');
        serialArr.push(serial);
        }
    
	if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var setName = Player.Name().slice(5, Player.Name().length) + ' Luck';
    else
        var setName = Player.Name() + ' Luck';
    
    Orion.SetDressList(setName, ListPiper(serialArr));
    }

function ListPiper(arr)
    {
    var result = '';
    arr.forEach(function(string)
        {
        result += string + '|';
        })
    return result.slice(0,-1);
    }