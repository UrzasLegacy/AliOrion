globalScopeVariable = 0


//-------------- Exec
// This is what's causing the bug in your script

function ExecTest() {
    Orion.Exec("AsyncFunction", true) // Even though its executed from this function, AsyncFunction still creates its own global scope
    while (true) {
        Orion.Print("Main: " + globalScopeVariable)
        Orion.Wait(1000)
    }
}

function AsyncFunction(_private) {
    while (true) {
        Orion.Print("Async: " + globalScopeVariable)
        globalScopeVariable++ // this only updates this variable in this particular global scope. ExecTest never sees this update
        Orion.Wait(1000)
    }
}



//-------------- Call
// This is why sometimes global scope works for handling updated variables :)

function CallTest() {
    while (true) {
        Orion.Print("Main: " + globalScopeVariable)
        IncrementGlobalScopeVariable()
        Orion.Wait(1000)
    }
}

function IncrementGlobalScopeVariable(_private) {
    globalScopeVariable++ // since this function is called from CallTest function, it shares global scope with CallTest
}



//-------------- Shared
// This is one way to ensure proper handling of "global" variables. Basically you immediately hand the globalScopeObject over to Shared and then 
// only manipulate the Shared variable. 

globalScopeObject = { "key1": 0, "key2": 0 }

function SharedTest() {
    InitializeGlobals()
    Orion.Exec("AsyncSharedFunction", true)
    while (true) {
        var temp = GetSharedObject("globalScopeObject")
        Orion.Print("Main: " + temp["key1"])
        Orion.Wait(1000)
    }
}

function AsyncSharedFunction(_private) {
    var localScopeObject = {}
    while (true) {
        localScopeObject = GetSharedObject("globalScopeObject")
        Orion.Print("Async Key1: " + localScopeObject["key1"])
        localScopeObject["key1"]++
        AddSharedObject("globalScopeObject", localScopeObject)
        Orion.Wait(1000)
    }
}

function InitializeGlobals(_private) {
    AddSharedObject("globalScopeObject", globalScopeObject)
}

function AddSharedObject(stringName, object) {
    var temp = JSON.stringify(object)
    Shared.AddVar(stringName, temp)
}

function GetSharedObject(stringName) {
    var temp = Shared.GetVar(stringName, "{}")
    return JSON.parse(temp)
}