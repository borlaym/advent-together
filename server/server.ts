import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use('*', (req, res, next) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  next();
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../build/index.html')));
app.use(express.static('build'));

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  res.status(400);
  res.send({
    data: null,
    error: err.message
  });
}

app.use('*', errorHandler)

app.listen(9000);
