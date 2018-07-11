
import log4js from 'log4js';

log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        // TODO add logstash
        // {
        //     type: 'log4js-logstash',
        //     host: 'localhost',
        //     port: 5959,
        //     fields: {
        //         source: 'api'
        //     }
        // }
    ],
    replaceConsole: false
});

export default log4js.getLogger();