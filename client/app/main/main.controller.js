'use strict';

angular.module('jobsiesApp')
  .controller('MainCtrl', function ($scope, $http, socket, SaveJobs, $timeout, User, $mdSidenav, $log, indeedapi, Auth, userPreferences) {
    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });

    $scope.currentJob = 0;
    $scope.page = 0;
    $scope.totalResults;
    $scope.jobsSeen = 0;

    $scope.updateJob = function (headline, location) {
      $scope.searchDone = false;
      $scope.user.jobSought = headline;
      $scope.user.locationSought = location
      var getJobs = indeedapi.getIndeedJobs(headline, location , 0)
     getJobs.then(function(jobs){
      $scope.jobArray = jobs.jobArray;
// <<<<<<< HEAD
      $scope.totalResults = jobs.totalResults;
      userPreferences.savePreferences($scope.user)
   })
  }

  $scope.user = Auth.getCurrentUser();
  $scope.options = {
    country: 'us',
    types: '(cities)'
  }
  $scope.userHeadline = $scope.user.jobSought || $scope.user.linkedin.positions.values[0].title;
  $scope.locationCutter = function(){
    $scope.jobLocation = $scope.user.locationSought || $scope.user.linkedin.location.name
    if ($scope.jobLocation.toLowerCase().search('greater') !== -1){
        $scope.jobLocation = $scope.user.linkedin.location.name.toLowerCase().replace('greater', '')
        $scope.jobLocation = $scope.jobLocation.replace('area', '')
    }
// =======
//       $scope.totalResults = jobs.totalResults;
//    })

//     }

//   $scope.user = Auth.getCurrentUser();

//   $scope.userHeadline = $scope.user.linkedin.headline;
//   $scope.locationCutter = function(){
//     if ($scope.user.linkedin.location.name.toLowerCase().search('greater') !== -1){
//         $scope.jobLocation = $scope.user.linkedin.location.name.toLowerCase().replace('greater', '')
//         $scope.jobLocation = $scope.jobLocation.replace('area', '')

//     }

// >>>>>>> master
  }
$scope.locationCutter();
    var getJobs = indeedapi.getIndeedJobs($scope.userHeadline, $scope.jobLocation , 0)
   getJobs.then(function(jobs){
      $scope.jobArray = jobs.jobArray;
      $scope.totalResults = jobs.totalResults;
   })

$scope.saveJobsies = function(){
  SaveJobs.populateJobs().then(function(data){
    $scope.savedJobsFrontPage = data || [];
  })
}
$scope.saveJobsies();


   $scope.savedJob= function(job){
    toast('Job Saved!! :)', 4000 )
    console.log(job)
    $scope.currentJob += 1;
    $scope.jobsSeen += 1;
    if($scope.jobsSeen == $scope.totalResults){
      $scope.searchDone = true;
    }
    if($scope.currentJob === 25){
      if($scope.jobsSeen < $scope.totalResults){
        $scope.page +=1;
        $scope.currentJob = 0;
        indeedapi.getIndeedJobs($scope.jobTitle, $scope.city, 25*$scope.page);
      }
    }
     SaveJobs.postJobs(job)

     $scope.savedJobsFrontPage.push(job)
     console.log($scope.savedJobsFrontPage, "front page")
   }

   


  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle()
                      .then(function(){
                          $log.debug("toggle left is done");
                      });
  };
  $scope.toggleRight = function() {
    $mdSidenav('right').toggle()
                        .then(function(){
                          $log.debug("toggle RIGHT is done");
                        });
  };


  })
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('left').close()
                      .then(function(){
                        $log.debug("close LEFT is done");
                      });
  };
})
.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('right').close()
                        .then(function(){
                          $log.debug("close RIGHT is done");
                        });
  };



});
