var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');

var builderQty = 0;
var upgraderQty = 0;

var minersNeeded = false;
var minersPerSource = 1;

var haulersNeeded = false;
var haulersPerSource = 0;


module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
   
   
   for (var id in Game.myRooms)
    {
        //console.log(Game.myRooms[id]);
        var room = Game.myRooms[id];
        roleMiner.spawn(room);
        roleHauler.spawn(room);
    }
    
    

    
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builders.length);
    
    var constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
    
    if (constructionSites.length > 0)
    {

        if(builders.length < builderQty && !haulersNeeded && !minersNeeded) {
            var newName = 'Builder' + Game.time;
            if(upgraders.length > 0) {
                for (var id in upgraders) {
                    if (id >= 0) {
                        //console.log('tower id ' +id);
                        var upgrader = upgraders[id];
                        //upgrader.name = newName;
                        upgrader.memory.role = 'builder';
                    }
                }
            }
            else {
                //var newName = 'Builder' + Game.time;
                var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
                console.log('Spawning new builder: ' + newName + ' Available NRG:' + energyAvailable);
                //console.log('Spawning new builder: ' + newName);
                
                var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        
                if(energyAvailable >= 250 && energyCapacityAvailable < 400)
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'builder'}});
                else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'builder'}});
                else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'builder'}});
                else if(energyAvailable >= 650 && energyCapacityAvailable >= 650)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'builder'}});
                    
            }
        }
    }

    //console.log('Upgraders: ' + upgraders.length);
    //console.log(constructionSites.length);
    if (constructionSites.length == 0) {
        if(upgraders.length < upgraderQty && !haulersNeeded && !minersNeeded) {
            var newName = 'Upgrader' + Game.time;
            
            if(builders.length > 0) {
                for (var id in builders) {
                    if (id >= 0) {
                        //console.log('tower id ' +id);
                        var builder = builders[id];
                        //upgrader.name = newName;
                        builder.memory.role = 'upgrader';
                    }
                }
            }
            else {
                var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
                console.log('Spawning new upgrader: ' + newName + ' Available NRG:' + energyAvailable);
                
                var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        
                if(energyAvailable >= 250 && energyCapacityAvailable < 400)
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'upgrader'}});
                else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'upgrader'}});
                else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'upgrader'}});
                else if(energyAvailable >= 650 && energyCapacityAvailable >= 650)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'upgrader'}});
            }
        }
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