module.exports = function (app) {
  // Jobs
  var Jobs = require("./models/jobs");

  // List
  app.get("/api/jobs", function (request, response) {
    var params = {
      text: request.params.text ? request.params.text : "",
      location: request.params.location ? parseInt(request.params.location) : -1,
    };

    var queries = {};

    // Search
    if (params.location != "" && params.location != -1) {
      queries.location = params.location;
    }
    if (params.text != "") {
      var regex = new RegExp(params.text, "i");
      queries.title = regex;
    }

    Jobs.find(queries, null, function (error, jobs) {
      if (error) {
        response.send(error);
      }

      response.json(jobs);
    });
  });

  // Add
  app.post("/api/job", function (request, response) {
    var job = {
      title: request.body.title,
      description: request.body.description,
      salary: request.body.salary,
      location: request.body.location,
      createdAt: Date.now(),
    };

    Jobs.create(job, function (error, success) {
      if (error) {
        response.send(error);
      }

      response.json(success);
    });
  });

  // Front (angular handles the routes except /api/* calls)
  app.get("*", function (request, response) {
    response.sendFile("app.html", { root: app.get("static_root_path") });
  });
};
