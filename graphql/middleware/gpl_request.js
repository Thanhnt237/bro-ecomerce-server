const { request, gql , GraphQLClient} = require('graphql-request');

async function query(xxx){
    const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            authorization: 'Bearer MY_TOKEN',
        },
    });
    const query = gql`${xxx}`;



    // const data = await request(endpoint, query)
    // console.log(JSON.stringify(data))
    const results = await graphQLClient.request(query);
    console.log(JSON.stringify(results))
    return results;
}
let xxx = `
{
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`
query(xxx);