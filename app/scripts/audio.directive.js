/**
 * Created by Kosar Hosseinkhani on 11/2/2016.
 */
'use strict';
angular.module('kAngularHowlerApp').
directive('sonicAudio', [
  function () {
    return {
      templateUrl: 'views/audio.html',
      controller:'AudioCtrl as audioCtrl',
      restrict: 'E',
      replace:true,
      scope:{
        playlist:'=' /**Array*/,
        autoPlay:'=',
        index:'='
      },
      link: function(scope, elm, attr){
      } /** link */
    }; /** return */
  }]); /** directive */
