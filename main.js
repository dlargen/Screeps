var roleTower = require('role.tower');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleWorker = require('role.worker');
var roleDalek = require('role.dalek');
var roleClaimer = require('role.claimer');
var roleLink = require('role.link');

module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
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
        roleTower.run(room);
        roleLink.run(room);
        
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        if(spawn && spawn.spawning) { 
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8});
        } 
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
}