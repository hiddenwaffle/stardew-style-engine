import {EventType, AbstractEvent} from './event-bus';

export default class extends AbstractEvent {
    getType() {
        return EventType.ExampleEvent;
    }
}
