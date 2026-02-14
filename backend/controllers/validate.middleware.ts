import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

type ValidateTarget = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
