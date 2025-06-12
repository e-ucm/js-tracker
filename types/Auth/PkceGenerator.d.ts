export = PkceGenerator;
declare class PkceGenerator {
    generateRandomString(length: any): string;
    base64UrlEncode(str: any): string;
    sha256(message: any): Promise<ArrayBuffer>;
    generatePkceChallenge(): Promise<{
        codeVerifier: string;
        codeChallenge: string;
    }>;
}
