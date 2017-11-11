'use strict';

app.service('UserSearchService', ['$http', function($http) {
    // Search for all the user's followers using Github API.
    // Github API only returns 30 at a time.
    const githubAPI = 'https://api.github.com/users/';
    this.searchForFollowers = (user, page) => {
        return $http.get(githubAPI + user) //get user data first
            .then((res) => {
                return $http.get(res.data.followers_url + "?page=" + page); //need page number to get different sets of followers
            })
            .catch((err) => {
                return err;
            });
    }
    // Get the number of followers a Github user has.
    this.getNumFollowers = (user) => {
        return $http.get(githubAPI + user) //get user data first
            .then((res) => {
                return res.data.followers; //return follower count
            })
            .catch((err) => {
                return err;
            });
    }
}]);