const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user');
const FeedsController = require('../controllers/feeds');

describe('Feeds Controller', function() {
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

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'Test Post Content'
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };

    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedsController
      .createPost(req, res, () => {})
      .then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});