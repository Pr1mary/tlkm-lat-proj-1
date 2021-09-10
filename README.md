# tlkm-lat-proj-1

Nodejs application for product and user service. Made with nodejs, expressjs, postgresql, and mongodb.

## project documentation

project documentation for tlkm-lat-proj-1 project.

### PATH: /user/register

- description:
this path is used to register new user

- method: **POST**

- body:
    ```
    {
        "username": String,
        "email": String,
        "password": String
    }
    ```

- response:
    ```
    {
        "status": Boolean,
        "msg": String
    }
    ```

### PATH: /user/login

- description:
this path is used to authenticate for user login

- method: **POST**

- body:
    ```
    {
        "username": String,
        "password": String
    }
    ```

- response:
    ```
    {
        "status": Boolean,
        "msg": String,
        "token": String
    }
    ```

### PATH: /user/auth

- description:
this path is used to verify token

- method: **POST**

- body:
    ```
    {
        "token": String
    }
    ```

- response:
    ```
    {
        "status": Boolean,
        "msg": String,
    }
    ```

### PATH: /user/update

- description:
this path is used to update existing user account info

- method: **PATCH**

- body:
    ```
    {
        "token": String,
        "email": String,
        "password": String
    }
    ```

- response:
    ```
    {
        "status": Boolean,
        "msg": String,
    }
    ```
