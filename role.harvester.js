var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
	        creep.say('Harvest');
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                creep.say('XFER');
                var returnValue = creep.transfer(targets[0], RESOURCE_ENERGY);
                //creep.say(returnValue);
                //console.log(creep.name + ' ' + targets[0].name + ' ' + targets[0].pos);
                //creep.say(targets[0].store.getFreeCapacity(RESOURCE_ENERGY));
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                
            }
            else
            {
                creep.say('Rest');
                var spawnPosition = Game.spawns['Spawn1'].pos;
                creep.moveTo(spawnPosition, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvester;