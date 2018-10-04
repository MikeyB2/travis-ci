const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

// test that shows it returns a 200 status

describe("index page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/index.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});

describe("login page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/login.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});