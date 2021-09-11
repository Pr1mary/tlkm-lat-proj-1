# tlkm-lat-proj-1 documentation

Nodejs application for product and user service. Made with nodejs, expressjs, postgresql, and mongodb.

## User path

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

## Product path

### PATH: /product

- description:
this path is used to get all product from database

- method: **GET**

- body:

- response:
    ```
    [
		...,
		{
        	"status": Boolean,
        	"msg": String,
    	},
		...
	]
    ```

### PATH: /product/add

- description:
this path is used to add new product to database

- method: **POST**

- body:
	```
	{
		"token": String,
		"data": {
			"name": String,
			"desc": String,
			"qty": Integer
		}
	}
	```

- response:
    ```
    {
		"id": Integer
	}
    ```

### PATH: /product/delete/:id

- description:
this path is used to delete product from database based on given id in path

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
		"msg": String
	}
    ```
	
### PATH: /product/update/:id

- description:
this path is used to update product in the database based on given id in path

- method: **POST**

- body:
	```
	{
		"token": String,
		"data": {
			"name"?: String,
			"desc"?: String,
			"qty"?: Integer
		}
	}
	```

- response:
    ```
    {
		"msg": String
	}
    ```
