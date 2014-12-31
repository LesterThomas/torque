This Node-Red flow does three things:

1) it receives an HTTP GET from an android device running Torque, grabs the payload and responds with "OK!" to torque.
2) It takes each of the key/value pairs, converts the key names to readable text where it can (retaining unknown key names where it can't!) and commits as an object to a collection called userdata in a MongoDB.
3) It fires out an error object for each unknown key name, with the error type "UnknownMeasurement" and the key/value pair and commits that object to a collection called errordata in a MongoDB.

What do you need to be aware of?

There's some debug code in there for injecting known and unknown keys into the main function, as well as a node to easily swap between db.userdata and db.testdata collections.

You need to modify the MongoDB output nodes to point correctly to your database.
