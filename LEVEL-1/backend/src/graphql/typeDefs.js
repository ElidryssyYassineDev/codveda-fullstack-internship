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

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(name: String!, price: Float!, description: String, inStock: Boolean): Product!
    updateProduct(id: ID!, name: String, price: Float, description: String, inStock: Boolean): Product!
    deleteProduct(id: ID!): Product!

    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;