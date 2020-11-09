export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const jsonify = (subject: unknown = {}, additional?: Json): Json =>
  ({ ...(JSON.parse(JSON.stringify(subject))), ...additional });
