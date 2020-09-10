var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var harvesterQty = 4;
var builderQty = 4;
var upgraderQty = 8;


module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //console.log(Game.spawns['Spawn1'].room.controller.level);
    if (Game.spawns['Spawn1'].room.controller.level > 1) {
        var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        console.log('Spawn has '+extensions.length+' extensions.');
        
        var constructionExtensions = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        console.log('Spawn has '+constructionExtensions.length+' construction extensions.');
        
        if (extensions.length < 1 && constructionExtensions.length < 1) {
            console.log('Spawning extension 1');
            var spawnPosition = Game.spawns['Spawn1'].pos;
            //console.log('New Position '+ spawnPosition);
            Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x - 2 , spawnPosition.y + 2, STRUCTURE_EXTENSION);
            
            console.log('Spawning extension 2');
            var spawnPosition = Game.spawns['Spawn1'].pos;
            //console.log('New Position '+ spawnPosition);
            Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x , spawnPosition.y + 2, STRUCTURE_EXTENSION);
        }
    }
    /*
    
    var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    //console.log('Spawn has '+towers.length+' towers');
    
    if (towers.length < 1) {
        //console.log('Spawn has '+towers.length+' towers');
        var spawnPosition = Game.spawns['Spawn1'].pos;
        spawnPosition.x -= 4;
        //console.log('New Position '+ spawnPosition);
        Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x, spawnPosition.y, STRUCTURE_TOWER);
    }
    
    for (var id in towers) {
        if (id >= 0) {
            //console.log('tower id ' +id);
            var tower = towers[id];
            //console.log('tower pos ' +tower.pos);
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
    */
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < harvesterQty) {
        var newName = 'Harvester' + Game.time;
        //console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + harvesters.length);

    if(upgraders.length < upgraderQty && harvesters.length == harvesterQty) {
        var newName = 'Upgrader' + Game.time;
        //console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);

    if(builders.length < builderQty && harvesters.length == harvesterQty & upgraders.length == upgraderQty) {
        var newName = 'Builder' + Game.time;
        //console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
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
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}