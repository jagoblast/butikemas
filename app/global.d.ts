import {} from 'hono'

type Head = {
  title?: string
}

declare module 'hono' {
  interface Env {
    Bindings: {
      DB: D1Database;
      STATIC_KV: KVNamespace;
      JWT_SECRET: string;
    }
    // WAJIB DITAMBAHKAN: Agar c.get('jwtPayload') lolos validasi TypeScript saat build
    Variables: {
      jwtPayload: any; 
    }
  }
  interface ContextRenderer {
    (content: string | Promise<string>, head?: Head): Response | Promise<Response>
  }
}
