const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const jobs = [
  {
    id: 1,
    position: "Software Engg",
    company: "Mphasis",
    description: "Hey",
    location: "Mumbai"
  },
  {
    id: 2,
    position: "Hardware Engg",
    company: "Infosys",
    description: "Hello",
    location: "Pune"
  }
];

const books = [
  {
    title: "Once upon a time",
    publishedId: 12343434234
  }
];

const authors = [
  {
    name: "Ganesh Gaitonde",
    live: true
  }
];

const typeDefs = gql`
  type Job {
    id: Int
    position: String
    company: String
    description: String
    location: String
  }
  type Book {
    title: String
    publishedId: Int
    author: Author
  }
  type Author {
    name: String
    live: Boolean
    books: [Book]
  }

  type Query {
    hello: String
    job(id: Int!): [Job]
    jobs: [Job]
    getBooks: [Book]
    getAuthors: [Author]
  }
`;

const queryJobs = jobId => {
  return jobs.filter((job, index, filteredArray) => {
    return job.id == jobId;
  });
};

const resolvers = {
  Query: {
    hello: () => "Hello World",
    job: (parent, args, context, info) => {
      return queryJobs(args.id);
    },
    jobs: () => jobs,
    getBooks: () => books,
    getAuthors: () => authors
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

app.use("/", (req, res, next) => {
  console.log("app req query", req.query);
  console.log("app req params", req.params);
  console.log("app req body", req.body);
  next();
});

server.applyMiddleware({ app });
app.listen({ port: 3002 }, () => {
  console.log("app running on http:://localhost", server.graphqlPath);
});
