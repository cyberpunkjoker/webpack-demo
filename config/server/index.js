process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('../webpack')(require('./creatApp'));
