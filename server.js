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

let fakeData = {
  2: {
    id: 2,
    name: "Pankaj",
    quote: "I am here"
  }
};

createMessage = ({ input }) => {
  const id = Math.ceil(Math.random(0, 10) * 10);
  fakeData[id] = input;
  return { id: id };
};
updateMessage = ({ id, input }) => {
  if (!fakeData[id]) {
    console.log("json stringify", fakeData);
    throw new Error("No Id Present " + id);
  }
  fakeData[id] = { ...input, id: id };
  return fakeData[id];
};
deleteMessage = ({ id }) => {
  const ok = Boolean(fakeData[id]);
  delete fakeData[id];
  return { ok };
};
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

  input MessageInput {
    name: String
    quote: String
  }
  type Message {
    id: ID!
    name: String
    quote: String
  }
  type DeleteMessageResponse {
    ok: Boolean!
  }
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
    deleteMessage(id: ID!): DeleteMessageResponse
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
  },
  Mutation: {
    createMessage: (parent, args, context, info) => {
      return createMessage(args);
    },
    updateMessage: (parent, args, context, info) => {
      return updateMessage(args);
    },
    deleteMessage: (parent, args, context, info) => {
      console.log("parent ==== ", parent);
      console.log("args ==== ", args);
      console.log("context ==== ", context);
      console.log("info ==== ", info);
      return deleteMessage(args);
    }
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
