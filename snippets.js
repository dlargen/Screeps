//Suicide 1
_.invoke(Game.creeps, "suicide");
//Suicide 2
Object.values(Game.creeps).forEach(c => c.suicide());