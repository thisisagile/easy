export type HttpStatus = { name: string; id: number };

export type RestResult = {
  data?: { code: number; items: unknown []; itemCount: number };
  error?: { code: number; message: string; errorCount: number; errors: unknown [] };
};

export type Response = { status: HttpStatus; headers?: { [key: string]: any }; body?: RestResult };
