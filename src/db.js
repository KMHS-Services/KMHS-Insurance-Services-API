const mysql = require('mysql');
const config = require('../config.json');
const util = require('util');

let state = {
	pool: null
};

exports.connect = done => {
	state.pool = mysql.createPool(config.sqlConnectionDetails);
	done();
};

exports.query = ( sql, args )=> {
	return util.promisify( state.pool.query )
	  .call( state.pool, sql, args );
  };