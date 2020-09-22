var roleDalek = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var flags = _.filter(Game.flags, (flag) => flag.color == COLOR_RED);
        if(flags.length > 0) {
            var flag = Game.flags[flags[0].name];
            //console.log(flag.name);
            
            let spawns = flag.room.find(FIND_HOSTILE_SPAWNS);
            let structures = flag.room.find(FIND_HOSTILE_STRUCTURES);
            let creeps = flag.room.find(FIND_HOSTILE_CREEPS);
            if (spawns.length > 0) {
                if(Game.time % 5 == 0)
                    console.log('Exterminate');
                let spawn = flag.room.find(FIND_HOSTILE_SPAWNS)[0];
                //console.log(spawn.name);
                var returnVal = creep.attack(spawn);
                if(returnVal == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn);
            }
            else if (creeps.length > 0) {
                if(Game.time % 5 == 0)
                    console.log('Exterminate');
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target) {
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            else if (structures.length > 0) {
                if(Game.time % 5 == 0)
                    console.log('Exterminate');
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target) {
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
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
            if(Game.time % 5 == 0)
                console.log('spawn dalek');
            //console.log('All dalek Count: ' + alldaleksCount);
            
            var newName = 'dalek' + Game.time;
            var energyAvailable = room.energyAvailable;
                //console.log('We need a dalek');
                
                var energyCapacityAvailable = room.energyCapacityAvailable;
                //console.log('Energy Cap: ' + energyCapacityAvailable);
                
                //console.log('Spawning new dalek: ' + newName + ' Available NRG:' + energyAvailable);
                
        
                if(energyAvailable >= 1000 && energyCapacityAvailable >= 1000)
                    spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                        newName,
                        {memory: {role: 'dalek'}
                        });
        }
	}

};

module.exports = roleDalek;