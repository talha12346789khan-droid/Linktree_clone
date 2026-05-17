// lib/mongodb.js

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = { }

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') { 
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect().then(async (connectedClient) => {
      // Create indexes for faster queries
      try {
        const db = connectedClient.db("bittree")
        const collection = db.collection("links")
        
        // Index on handle for fast lookups
        await collection.createIndex({ handle: 1 })
        
        // Index on userId for fast lookups (but not unique to allow legacy data)
        await collection.createIndex({ userId: 1 })
        
        console.log("Database indexes created successfully")
      } catch (error) {
        console.log("Index creation note:", error.message)
      }
      return connectedClient
    })
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().then(async (connectedClient) => {
    // Create indexes for faster queries
    try {
      const db = connectedClient.db("bittree")
      const collection = db.collection("links")
      
      // Index on handle for fast lookups
      await collection.createIndex({ handle: 1 })
      
      // Index on userId for fast lookups (but not unique to allow legacy data)
      await collection.createIndex({ userId: 1 })
      
      console.log("Database indexes created successfully")
    } catch (error) {
      console.log("Index creation note:", error.message)
    }
    return connectedClient
  })
}

export default clientPromise