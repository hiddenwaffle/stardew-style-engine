import { Container } from 'typescript-ioc';
import Session from './session/session';

const session = <Session> Container.get(Session);
session.start();
