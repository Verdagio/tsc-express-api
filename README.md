# tsc-express-api
Boilerplate TypeScript-Express API that implements auth0 and containerization

## Before you use!

```npm install```

Config is used to grab values from a json file for auth0 and environment values.

 1. Create config/ directory
 2. Create config/defaults.json
 3. Insert the following:

 ```
{
    "Server": {
        "development": {
            "httpsPort": 5443,
            "port": 5000,
            "name": "Dev-Express"
        },
        "production": {
            "httpsPort": 9443,
            "port": 9000,
            "name": "Express"
        },
        "test": {
            "port": 4000,
            "name": "Test-Express"
        },
        "default": {
            "httpsPort": 5443,
            "port": 5000,
            "name": "Dev-Express"
        }
    },
    "Secret": {
        "audience": "http://your-audience/",
        "domain": "https://yourDomain.auth0.com/",
        "algorithms": [
            "RS256"
        ]
    },
    "Mongo": {
        "host": "mongodb://mongo",
        "dbname": "sampledb",
        "user": "admin",
        "pass": "password"
    }
}
 ```
 If using SSL don't forget to add the port bindings to your docker-compose and .pem files to config/ dir!

Use OpenSSL to generate your .pem files:

OpenSSL> req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out cert.pem


 If you do not already have auth0 configured follow these [instructions](https://auth0.com/docs/quickstart/backend/nodejs)

## How to run (Tests to be added)
In your command line use any of the following:

New development build : ```docker-compose -f docker-compose.debug.yml up --build```

Rebuild devevelopment : ```docker-compose -f docker-compose.debug.yml up --build --no-deps```

Run test suite : ```docker-compose -f docker-compose.test.yml up --no-deps```

Production ready build : ```docker-compose up --build```

#### Run out of container 

(note Error may occur for mongodb connection if not setup on local machine)

Build: ```npm run build```

Start: ```npm start```

Test: ```npm run test```

Development run : ```npm run dev```

Production run : ```npm run prod```

## Swagger UI Docs

Once your service is up and running go to the following:

```http://localhost:9000/api-docs```



