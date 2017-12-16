import World from 'src/domain/world';
import StaticMap from 'src/domain/static-map';
import stageManager from 'src/session/stage-manager';

// TODO: Mirrors stage-manager.applySave()
export default (mapName: string, entranceName: string, world: World) => {
  stageManager.loadMap(mapName).then((staticMap: StaticMap) => {
    let entrance;
    if (!entranceName) {
      entrance = staticMap.entrances[0];
    } else {
      entrance = staticMap.entrances.find((entrance) => {
        return entrance.name === entranceName;
      });
    }

    if (entrance) {
      world.player.x = entrance.x;
      world.player.y = entrance.y;
    } else {
      console.warn(`Entrance not found ${entranceName}`);
    }
  });
}