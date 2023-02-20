export enum ResultStates {
  OK = 'OK',
  ERROR = 'ERROR',
}

export class Result {
  state: ResultStates;
  data;
  constructor(state: ResultStates, data = {}) {
    state = state;
    data = data;
  }
}
