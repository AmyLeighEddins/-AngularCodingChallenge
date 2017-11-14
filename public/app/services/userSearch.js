'use strict';

app.service('UserSearchService', ['$http', function($http) {
    // Search for all the user's followers using Github API.
    // Github API only returns 30 at a time.
    const githubAPI = 'https://api.github.com/users/';
    this.searchForFollowers = function searchForFollowers(user, page) {
        return this.getUser(user) //get user data first
            .then((data) => {
                return $http.get(data.followers_url + "?page=" + page); //need page number to get different sets of followers
            });
    }
    // Get the number of followers a Github user has.
    this.getUser = function getUser(user) {
        return $http.get(githubAPI + user) //get user data first
            .then(res => res.data);
    }
}]);