//Suicide 1
_.invoke(Game.creeps, "suicide");
//Suicide 2
Object.values(Game.creeps).forEach(c => c.suicide());



// *** SPAWNING EXTENSIONS *** //
if (Game.spawns['Spawn1'].room.controller.level > 1) {
        
        
    //console.log('Spawn has '+extensions.length+' extensions.');
    
    var constructionExtensions = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    
    //console.log('Spawn has '+constructionExtensions.length+' construction extensions.');
    
    if (extensions.length < 1 && constructionExtensions.length < 1) {
        //console.log('Spawning extension 1');
        var spawnPosition = Game.spawns['Spawn1'].pos;
        //console.log('New Position '+ spawnPosition);
        Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x - 2 , spawnPosition.y + 2, STRUCTURE_EXTENSION);
        
        //console.log('Spawning extension 2');
        var spawnPosition = Game.spawns['Spawn1'].pos;
        //console.log('New Position '+ spawnPosition);
        Game.spawns['Spawn1'].room.createConstructionSite(spawnPosition.x , spawnPosition.y + 2, STRUCTURE_EXTENSION);
    }
}