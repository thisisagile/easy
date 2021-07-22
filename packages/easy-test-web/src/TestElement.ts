export interface TestElement {
  click(): Promise<void>;

  type(text: string): Promise<void>;
}
