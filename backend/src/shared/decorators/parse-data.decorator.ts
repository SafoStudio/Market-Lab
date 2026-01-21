import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParseData = createParamDecorator(
  (dtoClass: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    if (!body || typeof body !== 'object') return body;

    for (const key in body) {
      if (typeof body[key] === 'string') {
        try {
          body[key] = JSON.parse(body[key]);
        } catch {
          // Not JSON - leave it as is
        }
      }
    }

    const data = body.data || body;

    return data;
  },
);