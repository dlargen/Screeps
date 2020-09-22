var workersNeeded = 5;

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        var constructionSpawns;
        
        /*
        var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (structure) => {structure.structureType == STRUCTURE_SPAWN}
        });
        */
        for (var id in Game.myRooms) {
            //console.log(Game.myRooms[id]);
            let room = Game.myRooms[id];
            constructionSpawns = room.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });
            if(constructionSpawns.length > 0) {
                console.log('build the spawn: ' + constructionSpawns.length);
                break;
            }
        }
        
        if(constructionSpawns.length > 0) {
            let constructionSpawn = constructionSpawns[0];
            console.log(constructionSpawn.room.name);
            
            let workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' &&
                creep.memory.roomName == constructionSpawn.room.name);
            console.log('Workers: ' + workers.length);
            
            if(workers.length < workersNeeded) {
                console.log('Reassigning worker to new room: ' + creep.name);
                creep.memory.roomName =constructionSpawn.room.name;
            }
            
            console.log('we need to build');
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
    			    structure.store[RESOURCE_ENERGY] > 50}});
    			
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
                creep.say('🚧 build');
                //var returnVal = creep.moveTo(constructionSpawn);
                //var returnVal = creep.build(constructionSpawn);
                //console.log(returnVal);
                
                if(creep.build(constructionSpawn) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
    	    }
        }
        else {
            if (constructionSites.length == 0) {
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
            else
            {
                //console.log('we need to build');
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
        			    structure.store[RESOURCE_ENERGY] > 50}});
        			
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
        	        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if(target) {
                        //creep.say('🚧 build');
                        if(creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else
                    {
                        //creep.say('🛏️ Rest');
                        var spawnPosition = spawn.pos;
                        creep.moveTo(spawnPosition.x -3, spawnPosition.y - 3, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
        	    }
            }
        }
	},
	
	// Spawn Code
	spawn: function(room)
	{
	    let allminersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' &&
            creep.memory.roomName == room.name).length;
        
        let allhaulersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' &&
            creep.memory.roomName == room.name).length;
        
        let workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' &&
            creep.memory.roomName == room.name);
        //console.log('Workers: ' + workers.length);
        
        if(workers.length < workersNeeded && allminersCount > 1 && allhaulersCount > 1) {
            var newName = 'Worker' + Game.time;
            //var newName = 'Worker' + Game.time;
            var energyAvailable = room.energyAvailable;
            
            if(Game.time % 5 == 0)
                console.log('Spawning new worker: ' + newName + ' Available NRG:' + energyAvailable);

            var energyCapacityAvailable = room.energyCapacityAvailable;
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            
            if(energyAvailable >= 250 && energyCapacityAvailable < 400)
                spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'worker',
                        roomName: room.name}});
            else if(energyAvailable >= 400 && energyCapacityAvailable < 500)
                spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
                    {memory: {role: 'worker',
                        roomName: room.name}});
            else if(energyAvailable >= 500 && energyCapacityAvailable < 600)
                spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                    {memory: {role: 'worker',
                        roomName: room.name}});
            else if(energyAvailable >= 650 && energyCapacityAvailable >= 650)
                spawn.spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
                    {memory: {role: 'worker',
                        roomName: room.name}});
        }
	}
};

module.exports = roleWorker;