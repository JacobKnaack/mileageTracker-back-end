# Backend for Mileage Tracker

This is the backend for the Mileage Tracker app.  This API is used to store information about trips logged by users using the Mileage Tracker web app.

URLS:

###Authorization Route:

```/api/signup```: used for signing up a new user.

Make a POST request to the above URI with and Object containing:

```
{
  emailAddress: 'something@something.com',
  password: 'password',
  firstName: 'optional',
  lastName: 'also optional'
}
```

###Authentication Route:

```/api/signin```: used to fetch a user from the database and giving them access to their authorizations.

Make a GET request to the above URI and set an Authorization header like so:
```{Authorization: `Bearer __TOKEN__`}```

###POST route for a trip

###GET route for a trip
