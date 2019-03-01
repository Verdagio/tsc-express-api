declare module 'express-oas-generator' {
    export function init(app: Express.Application, object: Object): any
    export function init(app: Express.Application, fn: (spec: Object) => any): any
}