import {
  SheetConfig,
  genConfig,
} from 'src/render/sheet';

import player0    from 'src/external/image/DawnLike/Characters/Player0.png';
import player1    from 'src/external/image/DawnLike/Characters/Player1.png';
import scroll     from 'src/external/image/DawnLike/Items/Scroll.png';
import decor0     from 'src/external/image/DawnLike/Objects/Decor0.png';
import decor1     from 'src/external/image/DawnLike/Objects/Decor1.png';
import door0      from 'src/external/image/DawnLike/Objects/Door0.png';
import door1      from 'src/external/image/DawnLike/Objects/Door1.png';
import effect0    from 'src/external/image/DawnLike/Objects/Effect0.png';
import effect1    from 'src/external/image/DawnLike/Objects/Effect1.png';
import fence      from 'src/external/image/DawnLike/Objects/Fence.png';
import floor      from 'src/external/image/DawnLike/Objects/Floor.png';
import ground0    from 'src/external/image/DawnLike/Objects/Ground0.png';
import ground1    from 'src/external/image/DawnLike/Objects/Ground1.png';
import hill0      from 'src/external/image/DawnLike/Objects/Hill0.png';
import hill1      from 'src/external/image/DawnLike/Objects/Hill1.png';
import map0       from 'src/external/image/DawnLike/Objects/Map0.png';
import map1       from 'src/external/image/DawnLike/Objects/Map1.png';
import ore0       from 'src/external/image/DawnLike/Objects/Ore0.png';
import ore1       from 'src/external/image/DawnLike/Objects/Ore1.png';
import pit0       from 'src/external/image/DawnLike/Objects/Pit0.png';
import pit1       from 'src/external/image/DawnLike/Objects/Pit1.png';
import tile       from 'src/external/image/DawnLike/Objects/Tile.png';
import trap0      from 'src/external/image/DawnLike/Objects/Trap0.png';
import trap1      from 'src/external/image/DawnLike/Objects/Trap1.png';
import tree0      from 'src/external/image/DawnLike/Objects/Tree0.png';
import tree1      from 'src/external/image/DawnLike/Objects/Tree1.png';
import wall       from 'src/external/image/DawnLike/Objects/Wall.png';
import antifarea  from 'src/external/image/antifarea_18x20chars.png';
import redshrike  from 'src/external/image/redshrike.png';
import metacolors from 'src/external/image/metacolors.png';

export const configs: Map<string, SheetConfig> = new Map();

configs.set('Player0.png',              genConfig(player0));
configs.set('Player1.png',              genConfig(player1));
configs.set('Scroll.png',               genConfig(scroll));
configs.set('Decor0.png',               genConfig(decor0));
configs.set('Decor1.png',               genConfig(decor1));
configs.set('Door0.png',                genConfig(door0));
configs.set('Door1.png',                genConfig(door1));
configs.set('Effect0.png',              genConfig(effect0));
configs.set('Effect1.png',              genConfig(effect1));
configs.set('Fence.png',                genConfig(fence));
configs.set('Floor.png',                genConfig(floor));
configs.set('Ground0.png',              genConfig(ground0));
configs.set('Ground1.png',              genConfig(ground1));
configs.set('Hill0.png',                genConfig(hill0));
configs.set('Hill1.png',                genConfig(hill1));
configs.set('Map0.png',                 genConfig(map0));
configs.set('Map1.png',                 genConfig(map1));
configs.set('Ore0.png',                 genConfig(ore0));
configs.set('Ore1.png',                 genConfig(ore1));
configs.set('Pit0.png',                 genConfig(pit0));
configs.set('Pit1.png',                 genConfig(pit1));
configs.set('Tile.png',                 genConfig(tile));
configs.set('Trap0.png',                genConfig(trap0));
configs.set('Trap1.png',                genConfig(trap1));
configs.set('Tree0.png',                genConfig(tree0));
configs.set('Tree1.png',                genConfig(tree1));
configs.set('Wall.png',                 genConfig(wall));
configs.set('antifarea_18x20chars.png', genConfig(antifarea, 18, 20));
configs.set('redshrike.png',            genConfig(redshrike));
configs.set('metacolors.png',           genConfig(metacolors));
