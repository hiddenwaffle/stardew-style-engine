import { AutoWired, Container, Inject, Singleton } from 'typescript-ioc';
import Session from './session';

// Perform initialization, e.g. dependency graph wiring.
const session = <Session> Container.get(Session);

// Begin start up tasks.
session.start();
