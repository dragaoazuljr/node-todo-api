const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const todos = [
  {
    text: "test 1"
  },
  {
    __id: '5b71bd046bcfe526c4aa603d',
    text: 'test 2'
  }
];


beforeEach((done) => {
  Todo.deleteMany({}).then(()=> {
      Todo.insertMany(todos).then(()=>{done()})
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "teste todo";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then ((todos)=> {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create new todo', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('GET /todos', () => {

  it('should return all todos', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });

  it('should return invalid Id', (done) => {
    request(app)
      .get('/todos/5b71bd046bcfe524aa603d')
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        done();
      }).catch((e) => done(e));
    });

  });
