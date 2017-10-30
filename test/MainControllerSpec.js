'use strict';

var data = require("./mock/data.js");

describe('MainController', function() {

    var $controller, $httpBackend, $scope, controller, UserSearchService, q;

    beforeEach(angular.mock.module('GithubUserSearch'));

        // UserSearchService = {
        //     searchForFollowers: function(user, page) {
        //         var deferred = $q.defer();
        //         deferred.resolve([]);
        //         return deferred.promise;
        //     },
        //     getNumFollowers: function(user) {
        //         var deferred = $q.defer();
        //         deferred.resolve(0);
        //         return deferred.promise;
        //     }
        // }

        // // spyOn(UserSearchService, 'searchForFollowers').and.returnValue([]);
        // // spyOn(UserSearchService, 'getNumFollowers').and.returnValue(0);
        // $provide.value('UserSearchService', UserSearchService);
  

  
    beforeEach(inject(function(_$controller_, _$httpBackend_, _UserSearchService_, $q){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        UserSearchService = _UserSearchService_;
        $controller = _$controller_;
        $scope = {};
        $httpBackend = _$httpBackend_;
        q = $q;

        spyOn(UserSearchService, 'searchForFollowers').and.callFake(function(user, page) {
            var deferred = $q.defer();
            deferred.resolve([data.blankUser]);
            return deferred.promise;
        });
        spyOn(UserSearchService, 'getNumFollowers').and.callFake(function(user) {
            var deferred = $q.defer();
            deferred.resolve(0);
            return deferred.promise;
        });

        console.log(data.lowFollowersUser);

        controller = $controller('MainController', { $scope: $scope, UserSearchService: UserSearchService});
      
        //Tell the $httpBackend to respond with our mock data. 
        $httpBackend.whenGET('https://api.github.com/users/').respond(200, data.blankUser);
        $httpBackend.whenGET('https://api.github.com/users/fakeuser').respond(200, data.notFoundUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg').respond(200, data.noFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg/followers?page=1').respond(200, data.noFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins').respond(200, data.lowFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins/followers?page=1').respond(200, data.lowFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler').respond(200, data.highFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=1').respond(200, data.highFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=2').respond(200, data.highFollowersUserArrayPage2);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=3').respond(200, data.highFollowersUserArrayPage3);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=4').respond(200, data.highFollowersUserArrayPage4);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=5').respond(200, data.highFollowersUserArrayPage5);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=6').respond(200, data.highFollowersUserArrayPage6);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=7').respond(200, data.highFollowersUserArrayPage7);
    }));
  
    describe('$scope.searchForFollowers', function() {

        it('sets $scope.showInvalid to true if user is blank', function(done) {
            $scope.searchForFollowers('');
            expect($scope.showInvalid).toEqual(true);
            done();
        });

        it('sets $scope.showInvalid to true if the user is invalid', function(done) {
            $scope.searchForFollowers('fakeuser');
            $httpBackend.flush();
            expect($scope.showInvalid).toEqual(true);
            done();
        });

        it('sets correct data if the user has no followers', function(done) {
            $scope.searchForFollowers('ergerg');
            // var deferred = q.defer();
            // deferred.resolve($scope.searchForFollowers('ergerg'));
            // deferred.promise;
            $httpBackend.flush();
            $browser.defer.flush();
            // $scope.$digest();
            expect($scope.numFollowers).toEqual(data.noFollowersUser.followers);
            expect($scope.showNoFollowers).toEqual(true);
            expect($scope.userFound).toEqual(true);
            done();
        });

        it('sets correct data if the user has less than 30 followers', function(done) {
            $scope.searchForFollowers('amyleigheddins');
            $httpBackend.flush();
            expect($scope.numFollowers).toEqual(data.lowFollowersUser.followers);
            expect($scope.showFollowers).toEqual(true);
            expect($scope.userFound).toEqual(true);
            expect($scope.followers).toEqual(data.lowFollowersUserArray);
            done();
        });

        it('sets correct data if the user has a over 30 followers', function(done) {
            $scope.searchForFollowers('macressler');
            $httpBackend.flush();
            expect($scope.numFollowers).toEqual(data.highFollowersUser.followers);
            expect($scope.showFollowers).toEqual(true);
            expect($scope.userFound).toEqual(true);
            expect($scope.showLoadMore).toEqual(true);
            expect($scope.followers).toEqual(data.highFollowersUserArray);
            done();
        });
    });

    describe('$scope.loadMore', function() {

        it("should set the correct data when the load more function is called", function(done) {
            $scope.searchForFollowers('macressler');
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            expect($scope.followers).toEqual(data.highFollowersUserArrayPage3);
            done();
        });

        it("should show the correct amount of pages and set $scope.showLoadMore to false if it is on the last page of followers", function(done) {
            $scope.searchForFollowers('macressler');
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            $scope.loadMore();
            $httpBackend.flush();
            expect($scope.showLoadMore).toEqual(false);
            expect($scope.followers).toEqual(data.highFollowersUserArrayPage7);
            done();
        });
    });
});