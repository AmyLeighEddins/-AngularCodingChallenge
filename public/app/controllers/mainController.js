'use strict';

app.controller('MainController', ['$scope', 'UserSearchService', function($scope, userSearchService){
    
    const followersPerSearch = 30;
    let pageNum = 1; 
    resetSearch();
    $scope.searchedUser;

    // Search for the user entered's followers
    $scope.searchForFollowers = function searchForFollowers(user) {
        resetSearch(); 
        $scope.searchedUser = user; //save entered user
        if(user){ //if user is not blank
            return getTotalFollowers();
        }
        else {
            $scope.showError = true;
            $scope.errorText = "Please input a valid user."
            return Promise.reject;
        }
    }

    // Load more followers
    $scope.loadMore = function loadMore() {
        pageNum++; //increment page number
        let lower = followersPerSearch * pageNum - followersPerSearch; //start of where we are on this page of followers display
        let upper = followersPerSearch * pageNum; //max of where we are on this page of followers display
        if($scope.numFollowers <= upper) { //if we've reached the end of the followers do not show the load more button
            $scope.showLoadMore = false;
        }
        return userSearchService.searchForFollowers($scope.searchedUser, pageNum) //get the next followersPerSearch or less followers
            .then((res) => {
                $scope.followers = $scope.followers.concat(res.data);//add the next set of followers to the page
            })
            .catch((err) => {
                $scope.showError = true;
                console.log(err);
                $scope.errorText = "Server issue. Please try again."
            });
    }

    // Reset booleans and other variables
    function resetSearch() {
        pageNum = 1; 
        $scope.followers = []; 
        $scope.userFound = false; 
        $scope.showFollowers = false; 
        $scope.showNoFollowers = false; 
        $scope.showLoadMore = false; 
        $scope.showError = false;
        $scope.numFollowers = 0; 
    }

    //Get the total number of followers, also calls getFollowers
    function getTotalFollowers() {
        return userSearchService.getUser($scope.searchedUser) //first get the total number of followers
        .then((res) =>  {
            $scope.userFound = true;
            $scope.numFollowers = res.followers; //save number of followers
            return getFollowers();
        })
        .catch((err) => {
            $scope.showError = true;
            console.log(err);
            if (err.statusText === "Not Found") { //user not found
                $scope.errorText = "Please input a valid user."
            }
            else {
                $scope.errorText = "Server issue. Please try again."
            }
        });
    }

    // Get the user's followers
    function getFollowers() {
        return userSearchService.searchForFollowers($scope.searchedUser, pageNum) //get the first followersPerSearch followers
        .then((res) => {
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
        })
        .catch((err) => {
            $scope.showError = true;
            console.log(err);
            if (err.statusText === "Not Found") { //user not found
                $scope.errorText = "Please input a valid user."
            }
            else {
                $scope.errorText = "Server issue. Please try again."
            }
        });
    }

}]);