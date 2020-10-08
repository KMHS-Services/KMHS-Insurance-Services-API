const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./db');
const morgan = require('morgan');
const cors=require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

app.use('/api', require('./routerMapping'));

app.all('*', (req, res) => {
	res.status(404).send('route not found!');
});

db.connect(function (err) {
	if (err) {
		console.log('Unable to connect to MySQL.');
		process.exit(1);
	} else {
		app.listen(port, () => {
			console.log(`connected to SQL Server & listening to port: ${port}`);
		});
	}
});
