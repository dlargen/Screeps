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
	    
        if(creep.memory.hauling) {
            var coreEnergy = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            var tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100;
                    }
            });
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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
                else if(tower)
                    target = tower;
                else if(container)
                    target = container;
                
                //creep.say('XFER');
                var returnValue = creep.transfer(target, RESOURCE_ENERGY);
                //creep.say(returnValue);
                //console.log(creep.name + ' ' + targets[0].name + ' ' + targets[0].pos);
                //creep.say(targets[0].store.getFreeCapacity(RESOURCE_ENERGY));
                if (returnValue == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                
            } 
        }
        else {
            //creep.say('Harvest');
            
            var source = Game.getObjectById(creep.memory.sourceId);
            var energiesInRange = source.pos.findInRange(FIND_DROPPED_RESOURCES,2);
            if(energiesInRange.length > 0)
            {
                
                var energy = source.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                //console.log(energy);
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else
            {
                creep.moveTo(source);
            }
        }
	},
	
	// Spawn Code
	spawn: function(room)
	{
        var haulersNeeded = false;
        var haulersPerSource = 1;
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
                    
                    var ignoreTowers = false;
                    if(haulers.length > 1)
                        ignoreTowers = true;
                        
                    var energyCapacityAvailable = Game.spawns['Spawn1'].room.energyCapacityAvailable;
                    //console.log('Energy Cap: ' + energyCapacityAvailable);
                    
                    //console.log('Spawning new hauler: ' + newName + ' Available NRG:' + energyAvailable);
                    
                    
                    if(energyAvailable >= 300 && energyCapacityAvailable < 400)
                        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'hauler',
                                sourceId: source.id,
                                ignoreTowers: ignoreTowers
                                }   
                            });
                    else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'hauler',
                                sourceId: source.id,
                                ignoreTowers: ignoreTowers
                                }   
                            });
                    else if(energyAvailable >= 500 && energyCapacityAvailable >= 500)
                        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'hauler',
                                sourceId: source.id,
                                ignoreTowers: ignoreTowers
                                }   
                            });
                }
            }
            
        }
	}
};

module.exports = roleHauler;