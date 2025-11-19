import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';

@Injectable()
// HASH -> COMPARE -> GENERATE PASSWORD
export class EncryptService {
    async hash(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id, // mixed mode, more secure for passwords
            memoryCost: 2 ** 18,   // 256 MB
            timeCost: 4,           // number of iterations
            parallelism: 2,        // CPU parallelism
        })
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

    async generatePassword(length: number): Promise<string> {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);

        return Array.from(array)
            .map((x) => chars[x % chars.length])
            .join('');
    }
}