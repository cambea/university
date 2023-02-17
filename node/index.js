const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker');

// Replace the uri string with your connection string.
const uri = "mongodb://root:password@localhost:27017";

const client = new MongoClient(uri);

class University {
  constructor() {
      this.name = faker.name.fullName();
      this.private = faker.datatype.boolean();
      this.address = {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          zip: faker.address.zipCode(),
          country: faker.address.country()
      };
  }
}

class Student {
  constructor(universities) {
    this.firstname = faker.name.firstName();
    this.lastname = faker.name.lastName();
    this.gender = faker.name.sex();
    this.country = faker.address.country();
    this.birthdate = faker.date.birthdate({ min: 16, max: 20, mode: 'age' })
    this.scores = Array.from({ length: 10 }, () => faker.datatype.number({ min: 0, max: 20 }));
    this.university = faker.helpers.arrayElement(universities);
  }
}


async function run() {
  try {

    await client.connect();
    const StudentsCollection = client.db("university").collection("students");
    const UniCollection = client.db("university").collection("universities");

    const universities = Array.from({ length: 50 }, () => new University());
    const students = Array.from({ length: 1000 }, () => new Student(universities));
    await UniCollection.insertMany(universities);
    await StudentsCollection.insertMany(students);

  } catch (e) {
    console.log("Erreur: ")
    console.log(e)
  } finally {
    console.log("Database remplie !");
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);