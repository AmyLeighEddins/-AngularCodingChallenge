'use strict';

const data = require("./mock/data.json");
// const Promises = require('es6-promise').Promise;

describe('MainController', function() {

    let $controller, $httpBackend, $scope, controller;

    beforeEach(angular.mock.module('GithubUserSearch'));
  
    beforeEach(inject(function(_$controller_, _$httpBackend_){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $scope = {};
        $httpBackend = _$httpBackend_;
        controller = $controller('MainController', { $scope: $scope});
      
        //Tell the $httpBackend to respond with our mock data. 
        $httpBackend.whenGET('https://api.github.com/users/').respond(200, data.blankUser);
        $httpBackend.whenGET('https://api.github.com/users/fakeuser').respond(200, data.notFoundUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg').respond(200, data.noFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/ergerg/followers?page=1').respond(200, data.noFollowersUserArray);
        $httpBackend.whenGET('https://api.github.com/users/AmyLeighEddins').respond(200, data.lowFollowersUser);
        $httpBackend.whenGET('https://api.github.com/users/AmyLeighEddins/followers?page=1').respond(200, data.lowFollowersUserArray);
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

        it('sets showInvalid to true if user is blank', function(done) {
            $scope.searchForFollowers('');
            expect($scope.showError).toEqual(true);
            done();
        });

        it('sets showInvalid to true if the user is invalid', function(done) {
            $scope.searchForFollowers('fakeuser').then(a => {
                expect($scope.showError).toEqual(true);
                done();
            });
            $httpBackend.flush();
        });

        it('sets correct data if the user has no followers', function(done) {
            $scope.searchForFollowers('ergerg').then(a => {
                expect($scope.numFollowers).toEqual(data.noFollowersUser.followers);
                expect($scope.showNoFollowers).toEqual(true);
                expect($scope.userFound).toEqual(true);
                done();
            });
            $httpBackend.flush();
        });

        it('sets correct data if the user has less than 30 followers', function(done) {
            $scope.searchForFollowers('AmyLeighEddins').then(a => {
                expect($scope.numFollowers).toEqual(data.lowFollowersUser.followers);
                expect($scope.showFollowers).toEqual(true);
                expect($scope.userFound).toEqual(true);
                expect($scope.followers).toEqual(data.lowFollowersUserArray);
                done();
            });
            $httpBackend.flush();
        });

        it('sets correct data if the user has a over 30 followers', function(done) {
            $scope.searchForFollowers('macressler').then(a => {
                expect($scope.numFollowers).toEqual(data.highFollowersUser.followers);
                expect($scope.showFollowers).toEqual(true);
                expect($scope.userFound).toEqual(true);
                expect($scope.showLoadMore).toEqual(true);
                expect($scope.followers).toEqual(data.highFollowersUserArray);
                done();
            });
            $httpBackend.flush();
        });
    });

    describe('$scope.loadMore', function() {

        it("should set the correct data when the load more function is called", function(done) {
            $scope.searchForFollowers('macressler').then(a => {
                $scope.loadMore().then(b => {
                    $scope.loadMore().then(c => {
                        expect($scope.followers[60]).toEqual(data.highFollowersUserArrayPage3[0]);
                        done();
                    });
                });
            });
            $httpBackend.flush();
        });

        it("should show the correct amount of pages and set showLoadMore to false if it is on the last page of followers", function(done) {
            $scope.searchForFollowers('macressler').then(a => {
                // let promises = [];
                // promises.push($scope.loadMore());
                // promises.push($scope.loadMore());
                // promises.push($scope.loadMore());
                // promises.push($scope.loadMore());
                // promises.push($scope.loadMore());
                // promises.push($scope.loadMore());
                // Promises.all(promises).then(a => {
                //     expect($scope.showLoadMore).toEqual(false);
                //     expect($scope.followers[180]).toEqual(data.highFollowersUserArrayPage7[0]);
                //     done();
                // });
                $scope.loadMore().then(b => {
                    $scope.loadMore().then(c => {
                        $scope.loadMore().then(d => {
                            $scope.loadMore().then(e => {
                                $scope.loadMore().then(f => {
                                    $scope.loadMore().then(g => {
                                        expect($scope.showLoadMore).toEqual(false);
                                        expect($scope.followers[180]).toEqual(data.highFollowersUserArrayPage7[0]);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
            $httpBackend.flush();
        });
    });
});