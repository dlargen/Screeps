var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');

var builderQty = 3;
var upgraderQty = 3;

var minersNeeded = false;
var minersPerSource = 1;

var haulersNeeded = false;
var haulersPerSource = 2;


module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    haulersNeeded = false;
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    for(var sourceIndex in sources){
        var source = sources[sourceIndex];
        //console.log(source.id);

        var haulers = _.filter(Game.creeps, i => i.memory.sourceId === source.id && i.memory.role == 'hauler');

        if(haulers.length < haulersPerSource)
        {
            haulersNeeded = true;
            
            var allhaulersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler').length;
            //console.log('All hauler Count: ' + allhaulersCount);
            
            var newName = 'hauler' + Game.time;
            var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
            
            if(allhaulersCount == 0) {
                //Emergency Spawn at 100
                
                if(energyAvailable >= 100)
                    Game.spawns['Spawn1'].spawnCreep([CARRY,MOVE], newName, 
                        {memory: {role: 'hauler',
                            sourceId: source.id}
                        });
            }
            else {
                //console.log('We need a hauler for sourceID ' + source.id);
                
                
                var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
                //console.log('Energy Cap: ' + energyCapacityAvailable);
                
                //console.log('Spawning new hauler: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                    Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'hauler',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                    Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'hauler',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 500 && energyCapacityAvailable >= 500)
                {
                    Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'hauler',
                            sourceId: source.id}
                        });
                }
            }
        }
        
    }
    
    
    minersNeeded = false;
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    for(var sourceIndex in sources){
        var source = sources[sourceIndex];
        //console.log(source.id);

        var miners = _.filter(Game.creeps, i => i.memory.sourceId === source.id && i.memory.role == 'miner');

        if(miners.length < minersPerSource)
        {
            minersNeeded = true;
            
            var allminersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
            //console.log('All miner Count: ' + allminersCount);
            
            var newName = 'miner' + Game.time;
            var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
            
            if(allminersCount == 0) {
                //Emergency Spawn at 200
                
                if(energyAvailable >= 200)
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'miner',
                            sourceId: source.id}
                        });
            }
            else {
                //console.log('We need a miner for sourceID ' + source.id);
                
                
                var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
                //console.log('Energy Cap: ' + energyCapacityAvailable);
                
                //console.log('Spawning new miner: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'miner',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'miner',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'miner',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 600 && energyCapacityAvailable >= 600)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'miner',
                            sourceId: source.id}
                        });
            }
        }
        
    }
    
    var constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSites.length > 0)
    {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builders.length);
    
        if(builders.length < builderQty && !haulersNeeded && !minersNeeded) {
            var newName = 'Builder' + Game.time;
            var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
            console.log('Spawning new builder: ' + newName + ' Available NRG:' + energyAvailable);
            //console.log('Spawning new builder: ' + newName);
            
            var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    
            if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
            else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
            else if(energyAvailable >= 500 && energyCapacityAvailable >= 500)
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < upgraderQty && !haulersNeeded && !minersNeeded && constructionSites.length == 0) {
        var newName = 'Upgrader' + Game.time;
        
        var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
        console.log('Spawning new upgrader: ' + newName + ' Available NRG:' + energyAvailable);
        
        var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;

        if(energyAvailable >= 300 && energyCapacityAvailable < 400)
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        else if(energyAvailable >= 600 && energyCapacityAvailable >= 600)
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
    }
    
    
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader' && constructionSites.length == 0) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }
    
    roleTower.run();
}