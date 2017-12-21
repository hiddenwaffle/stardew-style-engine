import log from 'src/log';
import World from 'src/domain/world';
import StaticMap from 'src/domain/static-map';
import stageManager from 'src/session/stage-manager';

// TODO: Mirrors stage-manager.applySave()
export default (mapName: string, entranceName: string, world: World) => {
  stageManager.loadMap(mapName).then((staticMap: StaticMap) => {
    const entrance = staticMap.entrances.find((entranceCandidate) => {
      return entranceCandidate.name === entranceName;
    });

    if (entrance) {
      world.player.x = entrance.x;
      world.player.y = entrance.y;
    } else {
      log('warn', `Entrance not found ${entranceName}`);
    }
  });
};
