import { Injectable, CanActivate } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthLocalGuard extends AuthGuard('local') implements CanActivate { }