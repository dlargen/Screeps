var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('🚧 upgrade');
	    }
	    
	    if(!creep.memory.upgrading) {
	        
	        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => {
		        return structure.structureType == STRUCTURE_CONTAINER && 
			    structure.store[RESOURCE_ENERGY] > 500}});
			
			var returnValue = creep.withdraw(container,RESOURCE_ENERGY);
			
			if (returnValue == ERR_NOT_IN_RANGE)
			    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
			else if(returnValue < 0)
			{
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
			}
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;