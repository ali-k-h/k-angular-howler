'use strict';

/**
 * @ngdoc function
 * @name kAngularHowlerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kAngularHowlerApp
 */
angular.module('kAngularHowlerApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var self = this;
    self.resource = [];
  });
