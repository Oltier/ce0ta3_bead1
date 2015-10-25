//Egy-egy teendő attribútumait tartalmazza.
//Létrehozás, státusz, leírás, határidő, ki adta ki a feladatot

module.exports = {
    identity: 'todo',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function() { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['pending', 'done', 'overdue'],
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        
        dueDate: {
            type: 'string',
            required: true,
        },
        
        assigner: {
            type: 'string',
            required: false,
        },
    }
}