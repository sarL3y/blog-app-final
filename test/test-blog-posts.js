const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe ('blog-posts', function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blog posts on GET', function() {
        return chai
            .request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(1);
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys("title", "content", "author", "id", "publishDate");

                });
            });
        });

    it('should add a new post on POST', function() {
        const newPost = {
            title: "New Title",
            content: "New content",
            author: "New Author",
        }
        return chai
            .request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys("title", "content", "author", "id");
                expect(res.body.id).to.not.equal(null);
            });
    });

    it('should update post on PUT', function() {
        return (
            chai
                .request(app)

                .get('/blog-posts')
                .then(function(res) {
                    const updatedPost = Object.assign(res.body[0], {
                        title: "I'm renaming this title",
                        content: "I've come up with some new content"
                    });
                    return chai
                        .request(app)
                        .put(`/blog-posts/${res.body[0].id}`)
                        .send(updatedPost)
                        .then(function(res) {
                            expect(res).to.have.status(204);
                        });
                })
        );
    });

    it('should delete items on DELETE', function() {
        return (
            chai
                .request(app)

                .get('/blog-posts')
                .then(function(res) {
                    return chai
                        .request(app)
                        .delete(`/blog-posts/${res.body[0].id}`)
                        .then(function(res) {
                            expect(res).to.have.status(204);
                        });
                })
                
        );
    });
});

