var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var flags = _.filter(Game.flags, (flag) => flag.color == COLOR_PURPLE);
        if(flags.length > 0) {
            var flag = Game.flags[flags[0].name];
            //console.log(flag.color);
            if(flag.room != undefined)
            {
                let controllers = flag.room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTROLLER
                });
                
                if (controllers.length > 0) {
                    var controller = controllers[0];
                    
                    if(Game.time % 5 == 0)
                        console.log('Exterminate ' + controller);
                    
                    var returnVal = creep.attackController(controller); 
                    
                    if(Game.time % 5 == 0)
                        console.log(returnVal);
                    
                    if(returnVal == ERR_INVALID_TARGET || returnVal == ERR_NOT_IN_RANGE) {
                        if(Game.time % 5 == 0)
                            console.log('Move to Controller');
                        creep.moveTo(controller);
                    }
                }
            }
            else
            {
                if(Game.time % 5 == 0)
                    console.log('move to flag');
                creep.moveTo(flag);
            }
        }
	},
	// Spawn Code
	spawn: function(room) {
	    var claimersPerFlag = 1;
	    var claimerNeeded = false;
	    for (var id in Game.flags) {
            var flag = Game.flags[id];
                //console.log (flag.name);
            if (flag.color == COLOR_PURPLE) {
                //if(Game.time % 5 == 0)
                //    console.log("claimer Needed!");
                claimerNeeded = true;
            }
	    }
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        var allclaimersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer').length;
        //console.log(allclaimersCount < claimersPerFlag && claimerNeeded);

        if(allclaimersCount < claimersPerFlag && claimerNeeded)
        {
            if(Game.time % 5 == 0)
                console.log('spawn claimer');
            //console.log('All claimer Count: ' + allclaimersCount);
            
            var newName = 'claimer' + Game.time;
            var energyAvailable = room.energyAvailable;
                //console.log('We need a claimer');
                
                var energyCapacityAvailable = room.energyCapacityAvailable;
                //console.log('Energy Cap: ' + energyCapacityAvailable);
                
                //console.log('Spawning new claimer: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 850 && energyCapacityAvailable >= 850)
                    spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,CLAIM],
                        newName,
                        {memory: {role: 'claimer'}
                        });
        }
	}

};

module.exports = roleClaimer;