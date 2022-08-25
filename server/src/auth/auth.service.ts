import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) {}

    verify(token: string): any {
        return this.jwtService.verify(token);
    }

    verifyAsync(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}
