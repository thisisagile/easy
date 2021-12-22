import { Json } from "@thisisagile/easy";

export interface TestElement {
  click(): Promise<void>;

  type(text: string): Promise<void>;

  property(property: string): Promise<Json | undefined>;

  exists(): Promise<boolean>;
}
