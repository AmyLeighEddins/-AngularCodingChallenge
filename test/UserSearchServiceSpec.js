'use strict';

const data = require("./mock/data.json");

describe('UserSearchService', function() {
    
    let UserSearchService, $httpBackend;

    beforeEach(angular.mock.module('GithubUserSearch'));

    beforeEach(inject(function(_UserSearchService_, _$httpBackend_){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        UserSearchService = _UserSearchService_;
        $httpBackend = _$httpBackend_;

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