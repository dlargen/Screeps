var roleTower = {

    run: function(room) {
        if (room.controller.level > 2) {
            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            for (var id in towers) {
                if (id >= 0) {
                    //console.log('tower id ' +id);
                    var tower = towers[id];
                    //console.log('tower pos ' +tower.pos);
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(closestHostile) {
                        tower.attack(closestHostile);
                    }
                    else
                    {
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType != STRUCTURE_WALL && structure.hits < structure.hitsMax
                        //filter: (structure) => structure.hits < structure.hitsMax
                        });
                        if(closestDamagedStructure) {
                            tower.repair(closestDamagedStructure);
                        }
                    }
                }
            }
        }
    }
}

module.exports = roleTower;