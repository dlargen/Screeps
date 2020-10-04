var haulersPerSource = 2;

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 pickup');
	    }
	    if(!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
	        creep.memory.hauling = true;
	        creep.say('hauling');
	    }
        var source = Game.getObjectById(creep.memory.sourceId);
        
        if(creep.memory.hauling) {
            var coreEnergy = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });

            var links = source.pos.findInRange(FIND_MY_STRUCTURES, 2, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }});
            //console.log(links.length);
            var link = links[0];


            var tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100;
                    }
            });
            
            //var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            var container = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => {
		        return structure.structureType == STRUCTURE_CONTAINER && 
			    structure.store[RESOURCE_ENERGY] < 1999
	            }
            });
            
            if(coreEnergy || tower || container)
            {
                var target;
                
                if(coreEnergy)
                    target = coreEnergy;
                else if(link)
                    target = link;
                else if(tower)
                    target = tower;
                else if(container)
                    target = container;
                
                var returnValue = creep.transfer(target, RESOURCE_ENERGY);
                if (returnValue == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } 
        }
        else {
            var energiesInRange = source.pos.findInRange(FIND_DROPPED_RESOURCES,4);
            if(energiesInRange.length > 0)
            {
                
                var energy = source.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    var path = creep.pos.findPathTo(energy, {
                        range: 1
                    });
                    if( path.length ) {
                        creep.move(path[0].direction);
                    }
                    
                }
            }
            else
            {
                var path = creep.pos.findPathTo(source, {
                    range: 2
                });
                if( path.length ) {
                    creep.move(path[0].direction);
                }
            }
        }
	},
	
	// Spawn Code
	spawn: function(room)
	{
        var haulersNeeded = false;
        var sources = room.find(FIND_SOURCES);
        for(var sourceIndex in sources){
            var source = sources[sourceIndex];
    
            var miners = _.filter(Game.creeps, i => i.memory.sourceId === source.id && i.memory.role == 'miner');
            
            if (miners.length > 0) {
                let spawn = room.find(FIND_MY_SPAWNS)[0];
                var haulers = _.filter(Game.creeps, i => i.memory.sourceId === source.id && i.memory.role == 'hauler');
        
                if(haulers.length < haulersPerSource)
                {
                    haulersNeeded = true;
                    
                    var allhaulersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' &&
                        creep.memory.roomName == room.name).length;

                    var newName = 'hauler' + Game.time;
                    var energyAvailable = spawn.room.energyAvailable;
                    
                    if(allhaulersCount == 0) {
                        if(energyAvailable >= 100)
                            spawn.spawnCreep([CARRY,MOVE], newName, 
                                {memory: {role: 'hauler',
                                    sourceId: source.id,
                                    roomName: room.name}
                                });
                    }
                    else {
                        
                        var ignoreTowers = false;
                        if(haulers.length > 1)
                            ignoreTowers = true;
                            
                        var energyCapacityAvailable = spawn.room.energyCapacityAvailable;
                        
                        if(Game.time % 5 == 0)
                            console.log('Spawning new hauler: ' + newName + ' Available NRG:' + energyAvailable);
                        
                        if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                            spawn.spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                                {memory: {role: 'hauler',
                                    sourceId: source.id,
                                    roomName: room.name,
                                    ignoreTowers: ignoreTowers}});
                        else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                            spawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                                {memory: {role: 'hauler',
                                    sourceId: source.id,
                                    roomName: room.name,
                                    ignoreTowers: ignoreTowers}});
                        else if(energyAvailable >= 500 && energyCapacityAvailable >= 500)
                            spawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                                {memory: {role: 'hauler',
                                    sourceId: source.id,
                                    roomName: room.name,
                                    ignoreTowers: ignoreTowers}});
                    }
                }
            }
        }
	}
};

module.exports = roleHauler;