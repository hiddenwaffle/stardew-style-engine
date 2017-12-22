import { EventType, AbstractEvent } from './event-bus';

export class ExampleEvent extends AbstractEvent {
    getType() {
        return EventType.ExampleEvent;
    }
}
