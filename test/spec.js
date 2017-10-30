'use strict';

var data = require("./mock/data.js");

describe('MainController', function() {

    beforeEach(angular.mock.module('GithubUserSearch'));
  
    var $controller, $httpBackend, $scope, controller, UserSearchService;
  
    beforeEach(inject(function(_UserSearchService_, _$controller_, _$httpBackend_,){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        UserSearchService = _UserSearchService_;
        $controller = _$controller_;
        $scope = {};
        controller = $controller('MainController', { $scope: $scope });
        $httpBackend = _$httpBackend_;
      
        //Tell the $httpBackend to respond with our mock data. 
        $httpBackend.whenGET('https://api.github.com/users/').respond(data.blankUser);
        $httpBackend.whenGET('https://api.github.com/users/fakeuser').respond(data.notFoundUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg').respond(data.noFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg/followers?page=1').respond(data.noFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins').respond(data.lowFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins/followers?page=1').respond(data.lowFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler').respond(data.highFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=1').respond(data.highFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=2').respond(data.highFollowersUserArrayPage2);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=3').respond(data.highFollowersUserArrayPage3);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=4').respond(data.highFollowersUserArrayPage4);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=5').respond(data.highFollowersUserArrayPage5);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=6').respond(data.highFollowersUserArrayPage6);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=7').respond(data.highFollowersUserArrayPage7);
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
            $httpBackend.flush();
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

        it("should set $scope.showLoadMore to false if it is on the last page of followers", function(done) {
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

describe('UserSearchService', function() {

    var UserSearchService, $httpBackend;

    beforeEach(angular.mock.module('GithubUserSearch'));

    beforeEach(inject(function(_UserSearchService_, _$httpBackend_){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        UserSearchService = _UserSearchService_;
        $httpBackend = _$httpBackend_;

        //Tell the $httpBackend to respond with our mock data. 
        $httpBackend.whenGET('https://api.github.com/users/').respond(data.blankUser);
        $httpBackend.whenGET('https://api.github.com/users/fakeuser').respond(data.notFoundUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg').respond(data.noFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg/followers?page=1').respond(data.noFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins').respond(data.lowFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/amyleigheddins/followers?page=1').respond(data.lowFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler').respond(data.highFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=1').respond(data.highFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/macressler/followers?page=3').respond(data.highFollowersUserArrayPage3);
        
    }));

    describe('Search for followers', function() {

        it("should return not found if the user is blank", function() {
            UserSearchService.searchForFollowers('', 1).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.blankUser);
            });
        });

        it("should return not found if the user doesn't exist", function() {
            UserSearchService.searchForFollowers('fakeuser', 1).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.notFoundUser);
            });
        });

        it("should return a blank array if the user has no followers", function() {
            UserSearchService.searchForFollowers('ergerg', 1).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.noFollowersUserArray);
            });
        });

        it("should return the user's followers if the user exists", function() {
            UserSearchService.searchForFollowers('amyleigheddins', 1).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.lowFollowersUserArray);
            });
        });

        it("should return 30 followers if the user has over 30 followers", function() {
            UserSearchService.searchForFollowers('macressler', 1).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.highFollowersUserArray);
            });
        });

        it("should return 3 third page of followers of a user with over 60 followers", function() {
            UserSearchService.searchForFollowers('macressler', 3).then(function (followers) {
                $httpBackend.flush();
                expect(followers).toEqual(data.highFollowersUserArrayPage3);
            });
        });
        
    });

    describe('Get number of followers', function() {

        it("should return not found if the user is blank", function() {
            UserSearchService.getNumFollowers('').then(function() {
                httpBackend.flush();
                expect().toEqual(data.blankUser);
            });
        });

        it("should return not found if the user doesn't exist", function() {
            UserSearchService.getNumFollowers('fakeuser').then(function() {
                httpBackend.flush();
                expect().toEqual(data.notFoundUser);
            });
        });

        it("should return 0 if the user has no followers", function() {
            UserSearchService.getNumFollowers('ergerg').then(function() {
                httpBackend.flush();
                expect().toEqual(data.noFollowersUser.followers);
            });
        });

        it("should return the total number of followers the user has", function() {
            UserSearchService.getNumFollowers('macressler').then(function() {
                httpBackend.flush();
                expect().toEqual(data.highFollowersUser.followers);
            });
        });
    });
});