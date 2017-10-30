'use strict';

app.service('UserSearchService', ['$http', function($http) {
    // Search for all the user's followers using Github API.
    // Github API only returns 30 at a time.
    var githubAPI = 'https://api.github.com/users/';
    this.searchForFollowers = function(user, page) {
        return $http.get(githubAPI + user) //get user data first
            .then(function(res) {
                return $http.get(res.data.followers_url + "?page=" + page); //need page number to get different sets of followers
            })
            .catch(function(err) {
                return err;
            });
    }
    // Get the number of followers a Github user has.
    this.getNumFollowers = function(user) {
        return $http.get(githubAPI + user) //get user data first
            .then(function(res) {
                return res.data.followers; //return follower count
            })
            .catch(function(err) {
                return err;
            });
    }
}]);