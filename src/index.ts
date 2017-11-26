import session from './session/session';
session.start();

window.addEventListener('beforeunload', session.stop.bind(session));
