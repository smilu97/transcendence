export class User {
  constructor(private id: number, private username: string) {}

  getId(): number {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }
}
