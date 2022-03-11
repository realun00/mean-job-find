// App / Routes

module.exports = function (app) {
  // Jobs
  var Jobs = require("./models/jobs");

  // List
  app.get("/api/jobs", function (request, response) {
    var params = {
      text: request.query.text ? request.query.text : "",
      location: request.query.location ? parseInt(request.query.location) : -1,
      filter: request.query.filter ? JSON.parse(request.query.filter) : { min: -1, max: -1 },
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

    // Filter
    if (params.filter) {
      if (params.filter.min != -1 && params.filter.max != -1) {
        // between x to x
        queries.salary = { $lte: params.filter.max, $gte: params.filter.min };
      } else if (params.filter.min == -1 && params.filter.max != -1) {
        // > x
        queries.salary = { $lte: params.filter.max };
      } else if (params.filter.min != -1 && params.filter.max == -1) {
        // < x
        queries.salary = { $gte: params.filter.min };
      }
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
    let job = {
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

  app.get("*", function (request, response) {
    response.sendFile("app.html", { root: app.get("static_root_path") });
  });
};
