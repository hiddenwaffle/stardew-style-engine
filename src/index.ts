import { session } from './session/session';

async function start() {
  await session.start();
  window.addEventListener('beforeunload', session.stop.bind(session));
}

start();
