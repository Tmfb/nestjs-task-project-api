export enum ResultStates {
  OK = 'OK',
  ERROR = 'ERROR',
}

export class Result {
  state: ResultStates;
  data;
  constructor(state: ResultStates, data = {}) {
    this.state = state;
    this.data = data;
  }
}
