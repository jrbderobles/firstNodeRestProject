const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user');
const AuthController = require('../controllers/auth');
const UsersController = require('../controllers/users');

describe('Auth Controller', function() {
  before(function(done) {
    const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_TEST_DATABASE}?retryWrites=true&w=majority`;

    mongoose
      .connect(MONGODB_URI)
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });

        return user.save();
      })
      .then(() => done());
  });

  after(function(done) {
    User
      .deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

  it('should throw an error with code 500 if accessing the database fails', function(done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    AuthController
      .login(req, {}, () => {})
      .then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
      })
      .catch(err => {
        done(err);
      });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function(done) {
    const req = { userId: '5c0f66b979af55031b34728a' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };

    UsersController
      .getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
        done();
      });
  })
});