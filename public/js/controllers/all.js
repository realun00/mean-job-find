// Pubic / JS / Controllers / Jobs
var appControllers = angular.module("appControllers", ["appServices"]);

appControllers.controller("JobsController", [
  "$scope",
  "JobsService",
  "CitiesService",
  function ($scope, JobsService, CitiesService) {
    $scope.cities = CitiesService.list();

    $scope.city = function (cityId) {
      var cityName = "";
      $scope.cities.forEach(function (v) {
        if (v.id == cityId) {
          cityName = v.name;
        }
      });
      return cityName;
    };

    // Search jobs
    $scope.search = {};
    $scope.search.text = "";
    $scope.search.location = 1;

    // Apply search
    $scope.search.find = function () {
      JobsService.list({
        text: $scope.search.text,
        location: $scope.search.location,
      }).success(function (data) {
        $scope.jobs = data;

        Materialize.toast("Results " + $scope.search.text + " and " + $scope.search.location, 2000);
      });
    };

    // Get jobs
    JobsService.list().success(function (data) {
      $scope.jobs = data;
    });
  },
]);

appControllers.controller("JobsAddController", [
  "$scope",
  "$location",
  "JobsService",
  "CitiesService",
  function ($scope, $location, JobsService, CitiesService) {
    $scope.cities = CitiesService.list();

    $scope.job = {};

    $scope.job.data = {};
    $scope.job.data.title = "";
    $scope.job.data.description = "";
    $scope.job.data.location = 1;
    $scope.job.data.salary = "";

    $scope.job.add = function () {
      $scope.job.data.location = parseInt($scope.job.data.location);
      JobsService.add($scope.job.data).success(function (response) {
        Materialize.toast("Your job has been posted!", 4000);
        $location.path("/");
      });
    };
  },
]);
