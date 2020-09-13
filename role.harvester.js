var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
	        //creep.say('Harvest');
            var source = Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
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
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => {
		        return structure.structureType == STRUCTURE_CONTAINER && 
			    structure.store[RESOURCE_ENERGY] < 1999}});
            
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
            else
            {
                //creep.say('🛏️ Rest');
                var spawnPosition = Game.spawns['Spawn1'].pos;
                creep.moveTo(spawnPosition.x + 2, spawnPosition.y + 2, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvester;