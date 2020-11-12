import { Id, Json } from '../types';

export class EasyRequest {
  constructor(readonly req: any) {}

  get path(): Json { return this.req.params as Json; }
  get id(): Id { return this.req.params.id as Id; }
  get query(): Json { return this.req.query as Json; }
  get q(): Json { return this.req.query.q as Json; }
  get body(): Json { return this.req.body as Json; }
}

