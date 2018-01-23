import start  from 'src/external/map/start.map.json';
import town   from 'src/external/map/town.map.json';
import cave   from 'src/external/map/cave.map.json';
import room   from 'src/external/map/room.map.json';

export const paths: Map<string, string> = new Map();

paths.set('start', start);
paths.set('town',  town);
paths.set('cave',  cave);
paths.set('room',  room);
