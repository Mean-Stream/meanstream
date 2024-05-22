export interface UserToken {
  sub: string; // user id
  preferred_username: string;
  iat: number; // issued at, unix seconds
  exp: number; // expires at, unix seconds

  // usually present in Keycloak tokens
  name?: string; // full name
  given_name?: string; // first name
  family_name?: string; // last name
  email?: string;
}
