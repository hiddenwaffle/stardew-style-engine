export enum EventType {
  ExampleEvent = 1,
  CancelEvent  = 2,
}

export abstract class AbstractEvent {
  abstract getType(): EventType;
}

type EventHandler<T extends AbstractEvent> = (event: T) => void;

export class EventBus {
  private handlersByType: Map<EventType, Array<EventHandler<AbstractEvent>>>;

  constructor() {
      this.handlersByType = new Map<EventType, Array<EventHandler<AbstractEvent>>>();
  }

  register(type: EventType, handler: EventHandler<AbstractEvent>) {
      if (!type) {
          // TODO: something
      }

      if (!handler) {
          // TODO: something
      }

      let handlers: Array<EventHandler<AbstractEvent>> = this.handlersByType.get(type);
      if (handlers === undefined) {
          handlers = [];
          this.handlersByType.set(type, handlers);
      }
      handlers.push(handler);

      // TODO: Return a function that can be called to unregister the handler
  }

  // TODO: unregister(). And remove the map key if zero handlers left for it.

  // TODO: Prevent infinite fire()?
  fire(event: AbstractEvent) {
      const handlers = this.handlersByType.get(event.getType());
      if (handlers !== undefined) {
          for (const handler of handlers) {
              handler(event);
          }
      }
  }
}
export const eventBus = new EventBus();
// export const deadEventBus = new EventBus(); // Used by AI.
