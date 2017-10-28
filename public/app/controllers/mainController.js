'use strict';

app.controller('MainController', ['$scope', 'searchService', function($scope, searchService){
    
    $scope.showFollowers = false; //don't show this on loading the page
    var pageNum = 1; //start at page 1

    // Search for the user entered's followers
    $scope.searchForFollowers = function(user) {
        resetSearch(); //reset booleans and other variables
        $scope.searchedUser = user; //save entered user
        if(user){ //if user is not blank
            searchService.getNumFollowers(user) //first get the total number of followers
                .then(function(res) {
                    if(res.message === "Not Found") { //user not found
                        $scope.userFound = false;
                        $scope.showInvalid = true;
                    }
                    else {
                        $scope.numFollowers = res; //save number of followers
                    }
                });
            searchService.searchForFollowers(user, pageNum) //get the first 30 followers
                .then(function(res) {
                    if(res.data.message === "Not Found") { //user not found
                        $scope.userFound = false;
                        $scope.showInvalid = true;
                    }
                    else {
                        if(res.data.length < 1) { //no followers
                            $scope.showNoFollowers = true;
                        }
                        else if(res.data.length > 0 && $scope.numFollowers <= 30) { //less than or equal to 30 followers, so we only need to get the followers once
                            $scope.userFound = true; 
                            $scope.followers = res.data;
                            $scope.showFollowers = true; 
                        }
                        else {
                            $scope.followers = res.data; 
                            $scope.userFound = true; 
                            $scope.showFollowers = true; 
                            $scope.showLoadMore = true; //show load more button
                        }
                    }
                });
        }
        else {
            $scope.showInvalid = true; //show the text about inputting a valid user
        }
    }

    $scope.loadMore = function() {
        pageNum++; //increment page number
        var lower = 30 * pageNum - 30; //start of followers array position
        var upper = 30 * pageNum; //end of possible followers array position
        if($scope.numFollowers <= upper) { //if we've reached the end of the followers do not show the load more button
            $scope.showLoadMore = false;
        }
        searchService.searchForFollowers($scope.searchedUser, pageNum) //get the next 30 or less followers
            .then(function(res) {
                $scope.followers = res.data;
                document.body.scrollTop = document.documentElement.scrollTop = 0; //scroll to the top of the page
            });
    }

    function resetSearch() {
        pageNum = 1;
        $scope.followers = []; //followers array
        $scope.userFound = false; //if user was found
        $scope.showFollowers = false; //if we show the followers
        $scope.showInvalid = false; //if user was invalid
        $scope.showNoFollowers = false; //if user has no followers
        $scope.showLoadMore = false; //if we need the load more button
        $scope.numFollowers = 0;
    }

}]);