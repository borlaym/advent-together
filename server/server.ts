import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { addPresent, createCalendar, getPresentsOfUser, getVisiblePresents } from './db';

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

app.get('/api/create', (req, res) => {
  createCalendar().then(calendar => res.json(calendar));
});

app.get('/api/calendar/:uuid/:userId', (req, res) => {
  getPresentsOfUser(req.params.uuid as string, req.params.userId).then(presents => res.json(presents));
});

app.get('/api/calendar/:uuid', (req, res) => {
  getVisiblePresents(req.params.uuid as string).then(visiblePresents => res.json(visiblePresents));
});

app.post('/api/calendar/:uuid', (req, res) => {
  addPresent(req.params.uuid as string, req.body).then(present => res.json(present));
});

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

app.listen(9000, () => console.log('listening on 9000'));
