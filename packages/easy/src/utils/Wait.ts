export class Wait {
  static wait(ms = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static seconds(s = 0) {
    return this.wait(s * 1000);
  }
}

export const wait = (millis: number) => Wait.wait(millis);
