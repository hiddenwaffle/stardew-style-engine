import {
  eventBus,
  EventType
} from 'src/event/event-bus';

/**
 * Values correspond to CSS mouse cursor options.
 */
export enum PointerType {
  Default = 'default',
  Talk    = 'help',
  Use     = 'pointer',
  Examine = 'zoom-in',
}

/**
 * This class is for keeping track of what the cursor should look like.
 * Also, it keeps track of what entity, if any, is currently moused-over.
 */
class Pointer {
  private currentType: PointerType;
  // private lastType: PointerType; // TODO: Necessary? Delete?
  private typeChanged: boolean;

  overEntityId: number;
  selectedEntityId: number;

  constructor() {
    this.currentType = PointerType.Default;
    // this.lastType = PointerType.Default;
    this.typeChanged = false;

    this.overEntityId = null;
    this.selectedEntityId = null;

    eventBus.register(EventType.CancelEvent, () => {
      pointer.selectedEntityId = null;
    });
  }

  setType(type: PointerType) {
    if (this.currentType !== type) {
      // this.lastType = this.currentType;
      this.currentType = type;
      this.typeChanged = true;
    }
  }

  typeChangedSinceLastHandle(): boolean {
    return this.typeChanged;
  }

  handleTypeChanged(): PointerType {
    this.typeChanged = false;
    return this.currentType;
  }
}

export const pointer = new Pointer();
