Torque Telemetry Logging
========================

This Node-Red flow does the following:

1) it receives an HTTP GET from an android device running Torque, grabs the payload and responds with "OK!" to torque.
2) It takes each of the key/value pairs, converts the key names to readable text where it can (retaining unknown key names where it can't!) and commits as a JSON object to a couchDb (with key Event:<Timestamp>.


There are also a series of data post-processing flows:

1) Put human-readible dates into events.
2) Create a Trip document (key Trip:<Trip #>) that groups a set of contiguous events.
3) Remove any dud Events.
4) Delete the Trip documents (so that they can be refreshed)


(See the ClientHTML folder for a client view of this data.)