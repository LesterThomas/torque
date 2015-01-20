Torque Telemetry Logging
========================

This Node-Red flow does the following:

1) it receives an HTTP GET from an android device running Torque, grabs the payload and responds with "OK!" to torque.
2) It takes each of the key/value pairs, converts the key names to readable text where it can (retaining unknown key names where it can't!) and commits as a JSON object to a couchDb (with key Event:<Timestamp>.
3) It checks if `GPS Speed`, `GPS Latitude` or `GPS Longitude` are arrays (depending on what you ask Torque to log, it sometimes has a single value and sometimes an array) - it replaces the array with a single value.
4) It creates a new parameter `GPS LatLong` with an object containing a `Lat` and a `Long` parameter (this makes viewing on a Map easier).


There are also a series of data post-processing flows:

1) Put human-readible dates into events.
2) Create a Trip document (key Trip:<Trip #>) that groups a set of contiguous events.
3) Remove any dud Events.
4) Delete the Trip documents (so that they can be refreshed)


(See the ClientHTML folder for a client view of this data.)