import * as config from 'config';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';


export const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get('Secret.domain')}.well-known/jwks.json`
    }),
    audience: config.get('Secret.audience'),
    issuer: config.get('Secret.domain'),
    algorithms: config.get('Secret.algorithms')
});


