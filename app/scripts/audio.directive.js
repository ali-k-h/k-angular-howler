/**
 * Created by K2 on 11/2/2016.
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
        source:'='
      },
      link: function(){

      } /** link */
    }; /** return */
  }]); /** directive */
