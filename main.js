var roleTower = require('role.tower');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleWorker = require('role.worker');
var roleDalek = require('role.dalek');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
   
    for (var id in Game.myRooms) {
        //console.log(Game.myRooms[id]);
        var room = Game.myRooms[id];
        
        //if(Game.time % 5 == 0)
        //        console.log('EnergyCap' + room.energyCapacityAvailable);
        
        if(Game.time % 5 == 0)
            roleClaimer.spawn(room);
        if(Game.time % 5 == 0)
            roleDalek.spawn(room);      
        if(Game.time % 5 == 0)
            roleWorker.spawn(room);
        roleMiner.spawn(room);
        roleHauler.spawn(room);
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
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        if(creep.memory.role == 'dalek') {
            roleDalek.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
    
    roleTower.run();
}