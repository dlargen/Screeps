var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var builderQty = 3;
var upgraderQty = 5;
var harvestersNeeded = false;
var harvestersPerSource = 4;


module.exports.loop = function () {
        
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
    });
    
    // *** SPAWNING EXTENSIONS *** //
    if (Game.spawns['Spawn1'].room.controller.level > 1) {
        
        
        //console.log('Spawn has '+extensions.length+' extensions.');
        
        var constructionExtensions = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        //console.log('Spawn has '+constructionExtensions.length+' construction extensions.');
        
        if (extensions.length < 1 && constructionExtensions.length < 1) {
            //console.log('Spawning extension 1');
            var spawnPosition = Game.spawns['Spawn1'].pos;
            //console.log('New Position '+ spawnPosition);
            Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x - 2 , spawnPosition.y + 2, STRUCTURE_EXTENSION);
            
            //console.log('Spawning extension 2');
            var spawnPosition = Game.spawns['Spawn1'].pos;
            //console.log('New Position '+ spawnPosition);
            Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x , spawnPosition.y + 2, STRUCTURE_EXTENSION);
        }
    }

    // *** SPAWNING TOWERS *** //
    if (Game.spawns['Spawn1'].room.controller.level > 2) {
        var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        //console.log('Spawn has '+towers.length+' towers.');
        
        var constructionTowers = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        //console.log('Spawn has '+constructionTowers.length+' construction towers.');
        
        if (towers.length < 1 && constructionTowers.length < 1) {
            console.log('Spawning Tower 1');
            var spawnPosition = Game.spawns['Spawn1'].pos;
            Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x - 4 , spawnPosition.y, STRUCTURE_TOWER);
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
                else
                {
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType != STRUCTURE_WALL && structure.hits < structure.hitsMax
                    //filter: (structure) => structure.hits < structure.hitsMax
                    });
                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
    }
    
    
    harvestersNeeded = false;
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    for(var sourceIndex in sources){
        var source = sources[sourceIndex];
        //console.log(source.id);

        var harvesters = _.filter(Game.creeps, i => i.memory.sourceId === source.id);
        
        
        
        if(harvesters.length < harvestersPerSource)
        {
            harvestersNeeded = true;
            
            var allHarvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
            console.log('All Harvester Count: ' + allHarvestersCount);
            
            var newName = 'Harvester' + Game.time;
            var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
            
            if(allHarvestersCount == 0) {
                //Emergency Spawn at 300
                
                if(energyAvailable >= 300)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'harvester',
                            sourceId: source.id}
                        });
            }
            else {
                //console.log('We need a harvester for sourceID ' + source.id);
                
                
                var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
                console.log('Energy Cap: ' + energyCapacityAvailable);
                
                //console.log('Spawning new harvester: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                        {memory: {role: 'harvester',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'harvester',
                            sourceId: source.id}
                        });
                else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                {
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'harvester',
                            sourceId: source.id}
                        });
                }
                else if(energyAvailable >= 600 && energyCapacityAvailable >= 600)
                {
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'harvester',
                            sourceId: source.id}
                        });
                }
            }
        }
        
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < upgraderQty && !harvestersNeeded) {
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
        else if(energyAvailable >= 500 && energyCapacityAvailable >= 500)
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
    }
    
    var constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSites.length > 0)
    {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builders.length);
    
        if(builders.length < builderQty && !harvestersNeeded & upgraders.length >= upgraderQty) {
            var newName = 'Builder' + Game.time;
            var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
            console.log('Spawning new builder: ' + newName + ' Available NRG:' + energyAvailable);
            //console.log('Spawning new builder: ' + newName);
            
            var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    
            if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
            else if(energyAvailable >= 400 && energyCapacityAvailable >= 400)
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
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
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}