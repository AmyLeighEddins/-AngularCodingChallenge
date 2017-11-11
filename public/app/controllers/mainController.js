'use strict';

app.controller('MainController', ['$scope', 'UserSearchService', function($scope, userSearchService){
    
    const followersPerSearch = 30;
    let pageNum = 1; 
    let followers = []; 
    let userFound = false; 
    let showFollowers = false; 
    let showInvalid = false; 
    let showNoFollowers = false; 
    let showLoadMore = false; 
    let numFollowers = 0; 
    let searchedUser;

    // Search for the user entered's followers
    $scope.searchForFollowers = (user) => {
        resetSearch(); 
        searchedUser = user; //save entered user
        if(user){ //if user is not blank
            getTotalFollowers();
        }
        else {
            showInvalid = true; //show the text about inputting a valid user
        }
    }

    // Load more followers
    $scope.loadMore = () => {
        pageNum++; //increment page number
        let lower = followersPerSearch * pageNum - followersPerSearch; //start of where we are on this page of followers display
        let upper = followersPerSearch * pageNum; //max of where we are on this page of followers display
        if(numFollowers <= upper) { //if we've reached the end of the followers do not show the load more button
            showLoadMore = false;
        }
        userSearchService.searchForFollowers(searchedUser, pageNum) //get the next followersPerSearch or less followers
            .then((res) => {
                followers = followers.concat(res.data);//add the next set of followers to the page
            });
    }

    $scope.getFollowers = () => {
        return followers;
    }

    $scope.getUserFound = () => {
        return userFound;
    }

    $scope.getShowFollowers = () => {
        return showFollowers;
    }

    $scope.getShowInvalid = () => {
        return showInvalid;
    }

    $scope.getShowNoFollowers = () => {
        return showNoFollowers;
    }

    $scope.getShowLoadMore = () => {
        return showLoadMore;
    }

    $scope.getNumFollowers = () => {
        return numFollowers;
    }

    $scope.getSearchedUser = () => {
        return searchedUser;
    }

    // Reset booleans and other variables
    function resetSearch() {
        pageNum = 1; 
        followers = []; 
        userFound = false; 
        showFollowers = false; 
        showInvalid = false; 
        showNoFollowers = false; 
        showLoadMore = false; 
        numFollowers = 0; 
    }

    //Get the total number of followers, also calls getFollowers
    function getTotalFollowers() {
        userSearchService.getNumFollowers(searchedUser) //first get the total number of followers
        .then((res) =>  {
            if(res.message === "Not Found") { //user not found
                showInvalid = true;
            }
            else {
                userFound = true;
                numFollowers = res; //save number of followers
                return getFollowers();
            }
        });
    }

    // Get the user's followers
    function getFollowers() {
        userSearchService.searchForFollowers(searchedUser, pageNum) //get the first followersPerSearch followers
        .then((res) => {
            if(res.data.message === "Not Found") { //user not found
                showInvalid = true;
            }
            else {
                userFound = true;
                if(res.data.length < 1) { //no followers
                    showNoFollowers = true;
                }
                else if(res.data.length > 0 && numFollowers <= followersPerSearch) { //less than or equal to followersPerSearch, so we only need to get the followers once
                    followers = res.data;
                    showFollowers = true; 
                }
                else {
                    followers = res.data; 
                    showFollowers = true; 
                    showLoadMore = true; //show load more button
                }
            }
        });
    }

}]);