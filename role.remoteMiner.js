var minersPerRoom = 1;

var roleRemoteMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transfering = true;
	        creep.say('transfering');
	    }
	    
        if(creep.memory.transfering) {
            //var dropEnergy = false;
            if(creep.room.name != creep.memory.roomName)
            {
                creep.say('GoHome');
                //console.log (creep.name + '' + creep.room.name + ' ' + creep.memory.roomName);
                var route = Game.map.findRoute(creep.room, creep.memory.roomName);
                if (route.length > 0) {
                    //console.log('Now heading to home via '+route[0].room);
                    var exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            }
            else {
                creep.say('DropIt');
                //console.log('DropIt');
                var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_LINK || 
                                structure.structureType == STRUCTURE_STORAGE || 
                                structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
                if(storage) {
                    //console.log('creep store' + creep.store[RESOURCE_ENERGY]);
                    //console.log(storage.pos);
                    //var returnValue = creep.transfer(link, RESOURCE_ENERGY);
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
        } 
        else {
            if(creep.room.name != creep.memory.targetRoom)
            {
                creep.say('GoRoom');
                //console.log (creep.name + '' + creep.room.name + ' ' + creep.memory.targetRoom);
                var route = Game.map.findRoute(creep.room, creep.memory.targetRoom);
                if (route.length > 0) {
                    //console.log('Now heading to room '+route[0].room);
                    var exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            }
            else {
                creep.say('Harvest');
                //console.log('harvest');
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	},
	// Spawn Code
	spawn: function(room,targetRoom)
	{
    	//var minersNeeded = false;
        
        var miners = _.filter(Game.creeps, i => i.memory.targetRoom === targetRoom && i.memory.role == 'remoteMiner');
        //console.log(miners.length);
        if (miners.length < minersPerRoom) {
        
            console.log('We need a miner for targetRoom ' + targetRoom);
            
            
            var energyCapacityAvailable = room.energyCapacityAvailable;
            var energyAvailable = room.energyAvailable;
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            var newName = 'remoteMiner' + targetRoom + Game.time;
            //console.log('Energy Cap: ' + energyCapacityAvailable);
            
            //if(Game.time % 5 == 0)
            //  console.log('Spawning new miner: ' + newName + ' Available NRG:' + energyAvailable);
            
            
            if(energyAvailable >= 850 && energyCapacityAvailable < 1100)
                spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY], newName, 
                    {memory: {role: 'remoteMiner',
                        targetRoom: targetRoom,
                        roomName: room.name}
                });
            else if(energyAvailable >= 1100 && energyCapacityAvailable < 1350)
                spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], newName, 
                    {memory: {role: 'remoteMiner',
                        targetRoom: targetRoom,
                        roomName: room.name}
                });
            else if(energyAvailable >= 1350 && energyCapacityAvailable >= 1350)
                spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, 
                    {memory: {role: 'remoteMiner',
                        targetRoom: targetRoom,
                        roomName: room.name}
                });
            
        }
	}
};

module.exports = roleRemoteMiner;