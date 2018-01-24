export const dragon = {
  mixinId: 'dragon',
  properties: {
    'animationGroupName': 'dl-player-7-12',
    'clickCall-talk': 'global.narrate Hello, I am a dragon.',
    'collisionCall': 'global.sayOuch',
    'collisionCallInterval': 1000,
    'movementType': 'Wander',
    'saveable': true,
    'targetable': true,
  },
};

export const roomResident = {
  mixinId: 'room-resident',
  properties: {
    'animationGroupName': 'af-royalty-dress',
    'clickCall-talk': 'global.narrate What are you doing in my house?',
    'movementType': 'Patrol',
    'movementTileXYs': '2 2, 13 9',
    'saveable': true,
    'targetable': true,
  },
};
