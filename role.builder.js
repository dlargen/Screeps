var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(!creep.memory.building) {
	        //creep.say('🔄 harvest');
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
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                //creep.say('🚧 build');
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                //creep.say('🛏️ Rest');
                var spawnPosition = Game.spawns['Spawn1'].pos;
                creep.moveTo(spawnPosition.x -3, spawnPosition.y - 3, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	}
};

module.exports = roleBuilder;