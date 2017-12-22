import { log } from 'src/log';
import { World } from 'src/domain/world';
import { StaticMap } from 'src/domain/static-map';

// TODO: Mirrors stage-manager.applySave()
export function switchMap(mapName: string, entranceName: string, world: World) {
  world.switchMap(mapName, entranceName);
};
