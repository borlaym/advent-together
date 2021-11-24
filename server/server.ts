import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { addPresent, createCalendar, deletePresent, getPresentsOfUser, getVisiblePresents } from './db';

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

app.post('/api/create', (req, res, next) => {
  createCalendar(req.body.name)
    .then(calendar => res.json(calendar))
    .catch(err => next(err));
});

app.get('/api/calendar/:uuid/:userId', (req, res, next) => {
  getPresentsOfUser(req.params.uuid as string, req.params.userId)
    .then(presents => res.json(presents))
    .catch(err => next(err));
});

app.get('/api/calendar/:uuid', (req, res, next) => {
  const forceDay = req.headers['x-force-day'] !== null ? Number(req.headers['x-force-day']) : null;
  getVisiblePresents(req.params.uuid as string, forceDay)
    .then(visiblePresents => res.json(visiblePresents))
    .catch(err => next(err));
});

app.post('/api/calendar/:uuid', (req, res, next) => {
  addPresent(req.params.uuid as string, req.body)
    .then(present => res.json(present))
    .catch(err => next(err));
});

app.post('/api/calendar/:uuid/remove', (req, res, next) => {
  deletePresent(req.params.uuid as string, req.body.userId, req.body.presentId)
    .then(present => res.json(present))
    .catch(err => next(err));
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

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`listening on ${port}`));
