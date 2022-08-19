const Hapi = require('@hapi/hapi');
const routes = require('./routes.js')
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');


var handler = new routes();

const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
        "routes": {
            "cors": {
                "origin": ['*'],
                "headers": ["Accept", "Content-Type"],
                "additionalHeaders": ["X-Requested-With"]
            }
        }
    });

    const swaggerOptions = {
        info: {
            title: 'Golo API Documentation',
            version: '1.0',

        },
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions

        }
    ]);

    server.route({
        method: 'GET',
        path: '/user/{id}',
        options: {
            handler: handler.getUserinfo,
            description: 'Get User Info',
            notes: 'Returns a user object by the id passed in the path',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().required().default(1234567890)
                })
            }
        }

    });

    server.route({
        method: 'POST',
        path: '/user/signup',
        options: {
            handler: handler.signupUser,
            description: 'Add new user',
            notes: 'Adds a new user in the reuquest payload to db',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().default('John Doe'),
                    mobile: Joi.number().required().default(1234567890),
                    pswd: Joi.string().required().default('p@ssword')
                }).label('signup')
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/user/login',
        options: {
            handler: handler.loginUser,
            description: 'Validate user login',
            notes: 'Returns user details after crendentials match',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mobile: Joi.number().required().default(1234567890),
                    pswd: Joi.string().required().default('p@ssword')
                }).label('login')
            }
        }

    });

    server.route({
        method: 'GET',
        path: '/user/bookings/{id}',
        options: {
            handler: handler.getUserHistory,
            description: 'Get user booking history',
            notes: 'Returns the booking history for the id passed in the path',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required().default('59b863b3-48f0-4e07-b8eb-eb2b205bbeba')
                })
            }
        }

    });

    server.route({
        method: 'POST',
        path: '/bookDriver',
        options: {
            handler: handler.bookDriver,
            description: 'Book driver for current ride',
            notes: 'Returns the messsge with OTP for the ride ',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().default('John Doe'),
                    mobile: Joi.number().required().default(1234567890),
                    from: Joi.number().required().default(3),
                    to: Joi.number().required().default(7)
                }).label('booking')
            }
        }

    });

    server.route({
        method: 'POST',
        path: '/driver/login',
        options: {
            handler: handler.loginDriver,
            description: 'Validate driver login',
            notes: 'Returns driver details after crendentials match',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mobile: Joi.number().required().default(1234567890),
                    pswd: Joi.string().required().default('p@ssword')
                }).label('login')
            }

        }

    });

    server.route({
        method: 'POST',
        path: '/driver/signup',
        options: {
            handler: handler.addDriver,
            description: 'Adds a new driver',
            notes: 'Adds a new driver in the reuquest payload to db',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().default('John Doe'),
                    mobile: Joi.number().required().default(1234567890),
                    pswd: Joi.string().required().default('p@ssword')
                }).label('signup')
            }
        }

    });

    server.route({
        method: 'GET',
        path: '/driver/bookings/{id}',
        options: {
            handler: handler.getDriverHistory,
            description: 'Get driver riding history',
            notes: 'Returns the ride history for the id passed in the path',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required().default('59b863b3-48f0-4e07-b8eb-eb2b205bbeba')
                })
            }
        }

    });
    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();