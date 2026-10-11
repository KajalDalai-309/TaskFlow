import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LoginUser } from './login-user.dto';

@ObjectType()
export class LoginResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => LoginUser)
  user: LoginUser;
}
