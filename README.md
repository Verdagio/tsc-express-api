# tsc-express-api
Boilerplate TypeScript-Express API that implements auth0 and containerization

## Before you use!
Config is used to grab values from a json file for auth0 and environment values.

 1. Create config/ directory
 2. Create config/defaults.json
 3. Insert the following:

 ```
 {
    "Server": {
        "development": {
            "port": 5000,
            "name": "Dev-Express"
        },
        "production": {
            "port": 9000,
            "name": "Express"
        },
        "testing": {
            "port": 4000,
            "name": "Test-Express"
        },
        "default": {
            "port": 5000,
            "name": "Dev-Express"
        }
    },
    "Secret": {
        "audience": "http://your-audience:port",
        "domain": "yourDomain.eu.auth0.com",
        "algorithms": [
            "RS256"
        ]
    }
}
 ```

 If you do not already have auth0 configured follow these [instructions](https://auth0.com/docs/quickstart/backend/nodejs)

## How to run (Tests to be added)
In your command line use any of the following:

New development build : ```docker-compose -f docker-compose.debug.yml up --build```

Rebuild devevelopment : ```docker-compose -f docker-compose.debug.yml up --no-deps```

Run SUT : ```docker-compose -f docker-compose.test.yml up --no-deps```

Production ready build : ```docker-compose up --build```

#### Run out of container

Build: ```npm run build```

Start: ```npm start```

Test: ```npm run test```

Development run : ```npm run dev```

Production run : ```npm run prod```