var roleLink = {

    run: function(room) {
        if (room.controller.level > 4) {
            var targetLinks = room.controller.pos.findInRange(FIND_MY_STRUCTURES, 5, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 400);
            }});
            
            if (targetLinks.length > 0)
            {
                //console.log('targetLinks' + targetLinks.length);
                var targetLink = targetLinks[0];
                
                var sources = room.find(FIND_SOURCES);

                for(var sourceIndex in sources){
                    var source = sources[sourceIndex];
                    var sourceLinks = source.pos.findInRange(FIND_MY_STRUCTURES, 2, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_LINK &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) == 0);
                    }});
                    if(sourceLinks.length > 0) {
                        console.log('SourceLinks '+ sourceLinks.length);

                        for(var sourceLinksIndex in sourceLinks) {
                            var sourceLink = sourceLinks[sourceLinksIndex];
                            console.log('sourceLink Pos ' + sourceLink.pos);
                            sourceLink.transferEnergy(targetLink);
                        }
                    }
                    


                }
            }
        }
    }
}

module.exports = roleLink;