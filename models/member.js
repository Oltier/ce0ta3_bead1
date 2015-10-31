//Jelszó titkosításhoz
var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'member',
    connection: 'default',
    attributes: {
        nickname: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        familyName: {
            type: 'string',
            required: true,
        },
        givenName: {
            type: 'string',
            required: true,
        },
        displayName: {
            type: 'string',
        },
        role: {
            type: 'string',
            required: false,
            enum: ['parent', 'child'],
            defaultsTo: 'child'
        },
        
        //Kiadott feladatok
        todos: {
            required: false,
            collection: 'todo',
            via: 'assigner'
        },
        
        validPassword: function (password) {
            //compareSync([data to compare], [data to be compared to])
            return bcrypt.compareSync(password, this.password);
        }
    },
    
    beforeCreate: function(values, next) {
        /*hash(data, salt, progress, callback)
          data: data to be encrypted
          salt: the salt to be used to hash the pw
          progress: a callback to be called during the hash calculation to signify progress (not used here)
          callback: a function to be fired once the data has been encrypted
            callback(error, result)
            error: Details any errors
            result: Contains the encrypted form
        */
        bcrypt.hash(values.password, 10, function(err, hash) {
            //Ha valami hiba történt, visszaadjuk
            if(err) {
                //Send an error to the next middleware Middleware: 2. diasor 29. dia
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
    
};











