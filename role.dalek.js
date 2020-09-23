var roleDalek = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var flags = _.filter(Game.flags, (flag) => flag.color == COLOR_RED);
        if(flags.length > 0) {
            var flag = Game.flags[flags[0].name];
            //console.log(flag.name);
            
            let spawns = flag.room.find(FIND_HOSTILE_SPAWNS);
        
            //let structures = flag.room.find(FIND_HOSTILE_STRUCTURES);
            
            let closestStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => structure.structureType != STRUCTURE_CONTROLLER
            });
            
            let creeps = flag.room.find(FIND_HOSTILE_CREEPS);
            
            if (spawns.length > 0) {
                if(Game.time % 5 == 0)
                    console.log('Move to flag');
                let spawn = flag.room.find(FIND_HOSTILE_SPAWNS)[0];
                //console.log(spawn.name);
                var returnVal = creep.attack(spawn);
                if(returnVal == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn);
            }
            else if (creeps.length > 0) {
                if(Game.time % 5 == 0)
                    console.log('Exterminate creep');
                const target = creeps[0];
                console.log(target);
                if(target) {
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            else if (closestStructure) {
                if(Game.time % 5 == 0)
                    console.log('Exterminate structure');
                //const target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if(closestStructure) {
                    if(creep.attack(closestStructure) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestStructure);
                        }
                }
            }
        }
	},
	// Spawn Code
	spawn: function(room) {
	    var daleksPerFlag = 1;
	    var dalekNeeded = false;
	    for (var id in Game.flags) {
            var flag = Game.flags[id];
                //console.log (flag.name);
            if (flag.color == COLOR_RED) {
                //if(Game.time % 5 == 0)
                //    console.log("DALEK Needed!");
                dalekNeeded = true;
            }
	    }
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        var alldaleksCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'dalek').length;
        //console.log(alldaleksCount < daleksPerFlag && dalekNeeded);

        if(alldaleksCount < daleksPerFlag && dalekNeeded)
        {
            //if(Game.time % 5 == 0)
            //    console.log('spawn dalek');
            //console.log('All dalek Count: ' + alldaleksCount);
            
            var newName = 'dalek' + Game.time;
            var energyAvailable = room.energyAvailable;
                //console.log('We need a dalek');
                
                var energyCapacityAvailable = room.energyCapacityAvailable;
                //console.log('Energy Cap: ' + energyCapacityAvailable);
                
                if(Game.time % 5 == 0)
                    console.log('Spawning new dalek: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 1000 && energyCapacityAvailable >= 1000)
                    spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                        newName,
                        {memory: {role: 'dalek'}
                        });
        }
	}

};

module.exports = roleDalek;