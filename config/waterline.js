//Waterline is a new kind of storage and retrieval engine. It provides a uniform API for accessing stuff from different kinds of databases, protocols, and 3rd party APIs. That means you write the same code to get users, whether they live in mySQL, LDAP, MongoDB, or Facebook.
//Adatbázissal való kommunikációra.
//An in-memory object store which works great as a bundled, starter database (with the strict caveat that it is for non-production use only).
var memoryAdapter = require('sails-memory');
//A local disk adapter for the Sails framework and Waterline ORM. Functions as a persistent object store which works great as a bundled, starter database (with the strict caveat that it is for non-production use only). It is bundled by default in new Sails projects.
var diskAdapter = require('sails-disk');
//A Waterline adapter for PostgreSQL. May be used in a Sails app or anything using Waterline for the ORM.
var postgresqlAdapter = require('sails-postgresql');

var config = {
    adapters: {
        memory:     memoryAdapter,
        disk:       diskAdapter,
        postgresql: postgresqlAdapter
    },
    
    connections: {
        default: {
            adapter: 'disk',
        },
        memory: {
            adapter: 'memory',
        },
        postgresql: {
            adapter: 'postgresql',
            database: 'tickets',
            host: 'localhost',
            user: 'ubuntu',
            password: 'ubuntu',
        }
    },
    
    defaults: {
            migrate: 'alter',
    }
};

module.exports = config;