import {GraphQLClient} from 'graphql-request'
import {RulesetQuery} from './query'

const query = `query RulesetQuery { 
  repository(owner: "AgoraNomic", name: "ruleset") {
    ref(qualifiedName: "master") {
      name
      target {
        ... on Commit {
          tree {
            entries {
              name
              object {
                ... on Tree {
                  entries {
                    name
                    object {
                      ... on Blob {
                        text
                      }
                    }
                  }
                }
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    }
  }
}`

const client = new GraphQLClient("https://api.github.com/graphql", {headers: {Authorization: "Bearer " + process.env.AGORA_GITHUB_API_TOKEN}})

export async function getGitHubData(): Promise<RulesetQuery> {
	return await client.request<RulesetQuery>(query)
}