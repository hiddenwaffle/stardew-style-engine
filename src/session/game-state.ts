export const enum State {
  Initializing,
  Ready,
  Loading,
}

class GameState {
  private _state: State;

  constructor() {
    this._state = State.Initializing;
  }

  switch(state: State) {
    this._state = state;
  }

  get state(): State {
    return this._state;
  }
}

export const gameState = new GameState();
