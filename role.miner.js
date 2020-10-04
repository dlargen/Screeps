var minersPerSource = 1;

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);
        if(creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transfering = true;
	        creep.say('transfering');
	    }
	    
        if(creep.memory.transfering) {
            var dropEnergy = true;
            var link = null;
            if (creep.room.controller.level >= 5) {
                var links = source.pos.findInRange(FIND_MY_STRUCTURES, 2, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
                //console.log(links.length);
                if(links.length > 0)
                {
                    link = links[0];
                    //console.log(link.pos);
                    var coreEnergy = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
                    var tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100)}});
                    
                    if(coreEnergy)
                        dropEnergy = true;
                    else if(tower)
                        dropEnergy = true;
                    else {
                        //console.log('Nothing needs');
                        dropEnergy = false;
                    }
                }
            }
            if(dropEnergy) {
                creep.say('drop');
                //creep.say('drop');
                creep.drop(RESOURCE_ENERGY);
                creep.memory.transfering = false;
            }
            else {
                creep.say('link');
                var returnValue = creep.transfer(link, RESOURCE_ENERGY);
                if (returnValue == ERR_NOT_IN_RANGE)
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
            
        } 
        else {
            //creep.say('Harvest');
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},
	// Spawn Code
	spawn: function(room)
	{
    	var minersNeeded = false;
        var sources = room.find(FIND_SOURCES);

        for(var sourceIndex in sources){
            var source = sources[sourceIndex];
            //console.log(source.id);
    
            var miners = _.filter(Game.creeps, i => i.memory.sourceId === source.id && i.memory.role == 'miner');
            let spawn = room.find(FIND_MY_SPAWNS)[0];

            if(miners.length < minersPerSource)
            {
                minersNeeded = true;
                //console.log('miners needed');
                
                var allminersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' &&
                    creep.memory.roomName == room.name).length;

                //console.log('All miner Count: ' + allminersCount);
                
                var newName = 'miner' + Game.time;
                var energyAvailable = room.energyAvailable;
                //console.log('room.energyAvailable' + energyAvailable);
                
                if(allminersCount == 0) {
                    //Emergency Spawn at 200
                    
                    if(energyAvailable >= 200)
                        spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                }
                else {
                    //console.log('We need a miner for sourceID ' + source.id);
                    
                    
                    var energyCapacityAvailable = room.energyCapacityAvailable;
                    //console.log('Energy Cap: ' + energyCapacityAvailable);
                    
                    //if(Game.time % 5 == 0)
                    //  console.log('Spawning new miner: ' + newName + ' Available NRG:' + energyAvailable);
                    
            
                    if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                        spawn.spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                    else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                        spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                    else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                        spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                    else if(energyAvailable >= 600 && energyCapacityAvailable < 700)
                        spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                    //else if(energyAvailable >= 700 && energyCapacityAvailable >= 700)
                    else if(energyAvailable >= 700 && energyCapacityAvailable < 800)
                        spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                    else if(energyAvailable >= 800 && energyCapacityAvailable >= 800)
                        spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'miner',
                                sourceId: source.id,
                                roomName: room.name}
                            });
                }
            }
            
        }
	}
};

module.exports = roleMiner;