import { GraphQLClient, Variables, gql } from 'graphql-request';
import { logger } from '@logs/app.log';
import { env } from '@env';

export class GraphqlLib {
  public EndPoint = env.graphql.endPointLogin;

  public graphQLClient: GraphQLClient;

  constructor() {
    this.graphQLClient = new GraphQLClient(this.EndPoint, {});
  }

  /**
   *
   * @param mutation
   * @param variables
   */
  async mutationGraphql(mutation: any, variables: Variables) {
    try {
      const resGql = await this.graphQLClient.request(mutation, variables);
      return JSON.stringify(resGql, undefined, 2);
    } catch (e) {
      logger.error(`login with graphql error: ${e}`);
      return false;
    }
  }

  /**
   *
   * @param email
   * @param password
   */
  async loginWithGraphql(email: string, password: string) {
    const mutation = gql`
      mutation login($email: String!, $password: String!) {
        login(loginInput: { email: $email, password: $password }) {
          accessToken
          refreshToken
        }
      }
    `;

    const variables = {
      email: email,
      password: password,
    };
    return this.mutationGraphql(mutation, variables);
  }
}
