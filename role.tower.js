var roleTower = {

    run: function() {
        if (Game.spawns['Spawn1'].room.controller.level > 2) {
            var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            //console.log('Spawn has '+towers.length+' towers.');
            
            /* *** Spawn Code - Disabled *** */
            /*
            var constructionTowers = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            //console.log('Spawn has '+constructionTowers.length+' construction towers.');
            
            if (towers.length < 1 && constructionTowers.length < 1) {
                console.log('Spawning Tower 1');
                var spawnPosition = Game.spawns['Spawn1'].pos;
                Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x - 4 , spawnPosition.y, STRUCTURE_TOWER);
            }
            */
            
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