import World from 'src/domain/world';
import StaticMap from 'src/domain/static-map';
import stageManager from 'src/session/stage-manager';

// TODO: Mirrors stage-manager.applySave()
export default (mapName: string, entrance: string, world: World) => {
  stageManager.loadMap(mapName).then((staticMap: StaticMap) => {
    if (entrance) {
      world.player.x = staticMap.entrances[0].x;
      world.player.y = staticMap.entrances[0].y;
    }
  });
}
