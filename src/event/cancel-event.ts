import {
  EventType,
  AbstractEvent,
} from './event-bus';

export class CancelEvent extends AbstractEvent {
  getType() {
    return EventType.CancelEvent;
  }
}
