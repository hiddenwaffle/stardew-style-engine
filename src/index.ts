import { AutoWired, Container, Inject, Singleton } from 'typescript-ioc';
import Session from './session';

@Singleton
@AutoWired
class EntryPoint {
  private session: Session;

  constructor(@Inject session: Session) {
    this.session = session;
  }

  start() {
    this.session.start();
  }
}

const entryPoint = <EntryPoint> Container.get(EntryPoint);
entryPoint.start();
