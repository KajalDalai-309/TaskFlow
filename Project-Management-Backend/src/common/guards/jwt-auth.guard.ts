import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    console.log('JwtAuthGuard: getRequest', {
      headers: req.headers ? Object.keys(req.headers) : 'none',
      hasAuthHeader: !!req.headers?.authorization
    });
    return req;
  }
}
