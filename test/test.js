/* eslint-disable */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/user');
const Movie = require('../models/movie');
const Cookie = require('cookie');
const jwt = require('jsonwebtoken');
var assert = require('assert');

const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

const user = {
  name: 'Test user',
  email: 'test@test.com',
  password: 'password123',
};
const second_user = {
  name: 'Test user2',
  email: 'test2@test.com',
  password: 'password123',
};
const updated_user = {
  name: 'Test user updated',
  email: 'test@uptest.com',
  password: 'password123',
};
let cookieStr = '';
let second_cookieStr = '';

describe('User', () => {
  const wrong_email_user = {
    name: 'Test user',
    email: 'test@tes',
    password: 'password123',
  };
  before((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });
  describe('/POST signup', () => {
    it('it should make data validation 1', (done) => {
      chai.request(server)
        .post('/api/signup')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('message');
          done();
        });
    });
    it('it should make data validation 2', (done) => {
      chai.request(server)
        .post('/api/signup')
        .send(wrong_email_user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('message');
          done();
        });
    });
    it('it should POST signup data', (done) => {
      chai.request(server)
        .post('/api/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.to.be.json;
          res.body.should.be.a('object');
          res.body.should.be.empty;
          done();
        });
    });
    it('it should reject with 409 if user exists', (done) => {
      chai.request(server)
        .post('/api/signup')
        .send({ name: user.name, email: user.email, password: user.password })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.to.be.json;
          chai.expect(res.body).to.have.all.keys('message');
          done();
        });
    });
    it('it should signup user 2', (done) => {
      chai.request(server)
      .post('/api/signup')
      .send({ name: second_user.name, email: second_user.email, password: second_user.password })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.empty;
        done();
      });
    });
  });
  describe('/POST login', () => {
    it('it should not returns exact message about wrong creds', (done) => {
      chai.request(server)
        .post('/api/signin')
        .send({ email: user.email, password: user.password + 'wrong' })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('message');
          res.body.message.should.be.eql('Неправильные почта или пароль');
          chai.expect(res).to.not.have.cookie('jwt');
          done();
        });
    });
    it('it should POST login data', (done) => {
      chai.request(server)
        .post('/api/signin')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          res.body.should.be.empty;
          chai.expect(res).to.have.cookie('jwt');
          cookieStr = res.headers['set-cookie'][0];
          done();
        });
    });
    it('it should signin user 2', (done) => {
      chai.request(server)
      .post('/api/signin')
      .send({ email: second_user.email, password: second_user.password })
      .end((err, res) => {
        res.should.have.status(200);
        second_cookieStr = res.headers['set-cookie'][0];
        done();
      });
    });
  });
  describe('/GET user', () => {
    it('it should get user data', (done) => {
      chai.request(server)
        .get('/api/users/me')
        .set('Cookie', cookieStr)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('name', 'email');
          res.body.email.should.be.eql(user.email);
          res.body.name.should.be.eql(user.name);
          done();
        });
    });
    it('it should not get user data without jwt', (done) => {
      chai.request(server)
        .get('/api/users/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('message');
          done();
        });
    });
  });
  describe('/UPDATE user', () => {
    it('it should update user data', (done) => {
      chai.request(server)
        .patch('/api/users/me')
        .set('Cookie', cookieStr)
        .send({ name: updated_user.name, email: updated_user.email })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('name', 'email');
          res.body.email.should.be.eql(updated_user.email);
          res.body.name.should.be.eql(updated_user.name);
          user.name = updated_user.name;
          user.email = updated_user.email
          done();
        });
    });
  });
  describe('/DELETE logout', () => {
    it('it should logout user', (done) => {
      chai.request(server)
        .delete('/api/users/me')
        .set('Cookie', cookieStr)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res).to.not.have.cookie('jwt');
          done();
        });
    });
  });
});

describe('Movie', () => {
  const movie = {
    country: "SomeOne",
    director: "SomeOne",
    duration: 360,
    year: 2022,
    description: "Bad comedia",
    image: 'https://thumbs.dreamstime.com/z/test.jpg',
    trailerLink: 'https://www.youtube.com/watch?v=omrEdX88tTI',
    thumbnail: 'https://thumbs.dreamstime.com/z/test.jpg',
    owner: user._id,
    movieId: "1",
    nameRU: 'Какое-то кино',
    nameEN: 'Some film',
  };
  before((done) => {
    Movie.deleteMany({}, (err) => {
      done();
    });
  });
  describe('/POST movies', () => {
    it('it should not save movie without auth', (done) => {
      chai.request(server)
        .post('/api/movies')
        .send(movie)
        .end((err, res) => {
          res.should.have.status(401);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('message');
          done();
        });
    });
    it('it should save movie', (done) => {
      chai.request(server)
        .post('/api/movies')
        .set('Cookie', cookieStr)
        .send(movie)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          chai.expect(res.body).to.have.all.keys('country',     'director',
          'duration',    'year',
          'description', 'image',
          'trailerLink', 'thumbnail',
          'owner',       'movieId',
          'nameRU',      'nameEN', '__v', '_id');
          movie["_id"] = res.body["_id"];
          done();
      });
    });
  });
  describe('/GET movies', () => {
    it('it should get movies', (done) => {
      chai.request(server)
        .get('/api/movies')
        .set('Cookie', cookieStr)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('array');
          chai.expect(res.body[0]).to.have.all.keys('country',     'director',
          'duration',    'year',
          'description', 'image',
          'trailerLink', 'thumbnail',
          'owner',       'movieId',
          'nameRU',      'nameEN', '__v', '_id');
          done();
        });
    });
  });
  describe('/DELETE movies', () => {
    it('it should not delete movie from other user', (done) => {
      chai.request(server)
        .delete(`/api/movies/${movie._id}`)
        .set('Cookie', second_cookieStr)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.to.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should delete movie by id', (done) => {
      chai.request(server)
        .delete(`/api/movies/${movie._id}`)
        .set('Cookie', cookieStr)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should return 404 for delete absent movie by id', (done) => {
      chai.request(server)
        .delete(`/api/movies/${movie._id}`)
        .set('Cookie', cookieStr)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.to.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
