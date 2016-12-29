# Backend for Mileage Tracker

This is the backend for the Mileage Tracker web application.  This API is used to store information about trips logged by users using the Mileage Tracker application.

URLS:

###Authorization Route:

* ```/api/signup```: used for signing up a new user.

* Make a POST request to the above URI, using an Object containing:

  ```
  {
    emailAddress: 'something@something.com',
    password: 'password',
    firstName: 'optional',
    lastName: 'also optional'
  }
  ```
* Returns a token that is saved in local storage.


###Authentication Route:

* ```/api/signin```: used to fetch a user from the database give them access to their authorizations.

* Make a GET request to the above URL and pass two strings as an authorization header, one for emailAddress, and another for password:

  ```{Authorization: 'emailAddress', 'password'}```

  * NOTE: For security, it is recommended that you encrypt these before you make the request.


* If the email is found in the database, the passwords will be compared and token returned if the comparison is successful.

###POST route for a trip

* ```/api/user/log```: used to post trip data to the user database.  

* Make a POST request to the above URL, contain an object with the following key values:

  ```{
    
  }

###GET route for a trip
