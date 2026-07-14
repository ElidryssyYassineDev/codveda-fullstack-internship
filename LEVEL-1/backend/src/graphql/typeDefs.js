// backend/src/graphql/typeDefs.js
// Purpose: SDL schema. Full Product/User shape as agreed in Phase 3 —
// but this milestone only wires resolvers for Query.products and
// Query.product. Mutation type and AuthPayload arrive starting Milestone 3.

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    inStock: Boolean!
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }
`;

module.exports = typeDefs;