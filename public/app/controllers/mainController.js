'use strict';

app.controller('MainController', ['$scope', 'UserSearchService', function($scope, userSearchService){
    
    $scope.showFollowers = false; //don't show this on loading the page
    var followersPerSearch = 30;
    var pageNum = 1; 

    // Search for the user entered's followers
    $scope.searchForFollowers = function(user) {
        resetSearch(); 
        $scope.searchedUser = user; //save entered user
        if(user){ //if user is not blank
            userSearchService.getNumFollowers(user) //first get the total number of followers
                .then(function(res) {
                    if(res.message === "Not Found") { //user not found
                        $scope.showInvalid = true;
                    }
                    else {
                        $scope.userFound = true;
                        $scope.numFollowers = res; //save number of followers
                        userSearchService.searchForFollowers(user, pageNum) //get the first followersPerSearch followers
                            .then(function(res) {
                                if(res.data.message === "Not Found") { //user not found
                                    $scope.showInvalid = true;
                                }
                                else {
                                    $scope.userFound = true;
                                    if(res.data.length < 1) { //no followers
                                        $scope.showNoFollowers = true;
                                    }
                                    else if(res.data.length > 0 && $scope.numFollowers <= followersPerSearch) { //less than or equal to followersPerSearch, so we only need to get the followers once
                                        $scope.followers = res.data;
                                        $scope.showFollowers = true; 
                                    }
                                    else {
                                        $scope.followers = res.data; 
                                        $scope.showFollowers = true; 
                                        $scope.showLoadMore = true; //show load more button
                                    }
                                }
                        });
                    }
                });
        }
        else {
            $scope.showInvalid = true; //show the text about inputting a valid user
        }
    }

    // Load more followers
    $scope.loadMore = function() {
        pageNum++; //increment page number
        var lower = followersPerSearch * pageNum - followersPerSearch; //start of where we are on this page of followers display
        var upper = followersPerSearch * pageNum; //max of where we are on this page of followers display
        if($scope.numFollowers <= upper) { //if we've reached the end of the followers do not show the load more button
            $scope.showLoadMore = false;
        }
        userSearchService.searchForFollowers($scope.searchedUser, pageNum) //get the next followersPerSearch or less followers
            .then(function(res) {
                $scope.followers = $scope.followers.concat(res.data);//add the next set of followers to the page
            });
    }

    // Reset booleans and other variables
    function resetSearch() {
        pageNum = 1; 
        $scope.followers = []; 
        $scope.userFound = false; 
        $scope.showFollowers = false; 
        $scope.showInvalid = false; 
        $scope.showNoFollowers = false; 
        $scope.showLoadMore = false; 
        $scope.numFollowers = 0; 
    }

}]);