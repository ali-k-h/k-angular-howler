/**
 * Created by Ali on 11/2/2016.
 */
'use strict';
angular.module('kAngularHowlerApp').
controller('AudioCtrl',
  ['$document','$scope','$timeout','$interval',
    function ($document, $scope, $timeout, $interval) {
      var self = this;
      var handleEnd,
        isPlaying,
        pause,
        player,
        cleanUpFn,
        init,
        setVolumeIcon,
        watchPlayback,
        startWatching,
        cleanUpFn2,
        cleanupSounds,
        cleanUpFnPause,
        currentHowlObj;
      self.data = {
        startIcon: "fa fa-play",
        stopIcon: "stop",
        pauseIcon: "fa fa-pause",
        volumeUp:'fa fa-volume-up',
        volumeDown:'fa fa-volume-down',
        volumeOff:'fa fa-volume-off'
      };
      /**function*/
      cleanupSounds = function(){
        $interval.cancel(startWatching);
        if(currentHowlObj){
          Howler.unload();
        }
      };
      /**function*/
      setVolumeIcon = function(volume){
        if(volume > 0.5) return self.data.volumeUp;
        if(volume <= 0.5 && volume > 0) return self.data.volumeDown;
        return self.data.volumeOff;
      };
      /**function*/
      handleEnd = function(){
        isPlaying = false;
        self.playIcon = self.data.startIcon;
        $interval.cancel(startWatching);
      };
      /**function*/
      var Player = function(playlist){
        self.playlist = playlist.slice(0);
      };
      Player.prototype = {
        play: function (index) {
          var _playlist = self.playlist, sId;
          if(index < 0 || !_playlist || !_playlist.length === 0 ||
            index >= _playlist.length){
            return;
          }

          var sound;
          index = typeof index === 'number' ? index : 0;
          var data = _playlist[index];
          /** If we already loaded this track, use the current one.
           Otherwise, setup and load a new Howl.*/
          if (data.howl) {
            sound = data.howl;
          }
          else {
            sound = data.howl = new Howl({
              src: data.src,
              volume: self.volume,
              html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
              onplay: function (e) {
                self.duration =data.howl.duration();
                isPlaying = true;
                self.playIcon = self.data.pauseIcon;
                self.showSoundInfo = true;
                self.showSpinner = false;
                self.showError = false;
                startWatching = $interval(watchPlayback, 500);
              },
              onload: function () {
                currentHowlObj.loaded = true;
              },
              onloaderror: function(err){
                self.showError = true;
                self.showSpinner = false;
                $scope.$apply();
              },
              onend: function () {
                handleEnd();
                $scope.$apply();
              },
              onpause: function () {
                handleEnd();
                $scope.$apply();
              },
              onstop: function () {
                // handleEnd();
                $scope.$apply();
              },
              onseek: function(){
                $interval.cancel(startWatching);
                startWatching = $interval(watchPlayback, 500);
              }
            });
            currentHowlObj = sound;
          }
          self.image = data.image;
          self.username = data.username;
          self.filename = data.filename;
          self.userId = data.userId;
          self.userProfileLink = data.userProfileLink;
          /** Begin playing the sound.
           Keep track of the index we are currently playing.
           self.index = index;*/
          return sound.play();
        },
        pause: function(index, soundId){
          var _playlist = self.playlist;
          if(_playlist[index] && _playlist[index].howl){
            _playlist[index].howl.pause(soundId);
          }
        },
        stop: function(index, soundId){
          var _playlist = self.playlist;
          try{
            if(_playlist && _playlist[index].howl){
              self.playlist[index].howl.stop(soundId);
            }
          }
          catch(e){}
        },
        volumeChange: function(index, volume){
          var _playlist = self.playlist;
          if(_playlist[index] && _playlist[index].howl){
            _playlist[index].howl.volume(volume);
            self.volumeIcon = setVolumeIcon(volume);
          }
        },
        seek: function(index, soundId, startOffset){
          /**get or set seek */
          var _playlist = self.playlist;
          if(_playlist[index] && _playlist[index].howl){
            return startOffset?
              _playlist[index].howl.seek(startOffset, soundId):
              _playlist[index].howl.seek(soundId);
          }
        }
      };
      /**function*/
      init = function() {
        if($scope.playlist && $scope.playlist.length > 0){
          cleanupSounds();
          self.triggerElm = $scope.triggerElm;
          isPlaying = false;
          self.volume = $scope.volume || 0.4;
          self.playbackPosition = 0;
          self.duration = 0;
          self.startOffset = 0;
          self.showSoundInfo = false;
          self.showSpinner = false;
          self.showError = false;
          self.showVolumeLevel = false;
          self.thisIsVolumeRange = false;
          self.volumeIcon = setVolumeIcon(self.volume);
          self.volumeLevel = 30;
          self.playIcon = self.data.startIcon;
          self.playlist = $scope.playlist;

          self.autoPlay = typeof($scope.autoPlay) === "boolean" ? $scope.autoPlay : false;
          self.hideAtStateChange = typeof($scope.hideAtStateChange) === "boolean" ? $scope.hideAtStateChange : true;
          if($scope.index && $scope.index > 0 && $scope.index < self.playlist.length){
            self.index = $scope.index;
          }
          else{
            self.index = 0;
          }
          player = new Player($scope.playlist);
          if(self.autoPlay){
            self.play();
          }
        }
      };
      /**function*/
      watchPlayback = function(){
        self.startOffset = player.seek(self.index, self.soundId) || 0;
        self.playbackPosition = self.startOffset * 100 / self.duration;
        // $scope.$apply();
      };
      /**function*/
      self.volumeChange = function () {
        player.volumeChange(self.index, self.volumeLevel/100);
      };
      /**function*/
      self.timeChange = function () {
        try{
          $interval.cancel(startWatching);
          self.startOffset = self.playbackPosition * self.duration / 100;
          player.seek(self.index, self.soundId, self.startOffset);
        }
        catch(e){
        }
      };
      /**function*/
      self.play = function(){
        if(isPlaying){ /**Pause */
        player.pause(self.index, self.soundId);
        }
        else{/**play */
        self.showSpinner = true;
          self.showError = false;
          self.soundId = player.play(self.index);
        }
      };
      /**function*/
      self.move = function(direction){
        var _index = (direction === 'backward')?
          (self.index - 1 || 0):
        self.index + 1;
        if(_index >= 0 && _index < player.playlist.length){
          self.showSoundInfo = false;
          player.stop(self.index);
          // $timeout(function(){
          isPlaying = false;
          self.index = _index;
          self.play();
          // });
        }
      };
      /**function*/
      self.hideVolume = function () {
        self.showVolumeLevel = false;
        self.thisIsVolumeRange = false;
      };
      /**function*/
      self.showVolume = function () {
        if(!self.thisIsVolumeRange){
          self.showVolumeLevel = !self.showVolumeLevel;
        }
        self.thisIsVolumeRange = false;
      };
      /**function*/
      self.close = function(){
        cleanupSounds();
        $scope.playlist = null;
      };

      /** Event management */
      cleanUpFn = $scope.$on('sonic-audio-show', function(event, data){
        $scope.playlist = data.playlist;
        $scope.index = data.index;
        $scope.autoPlay = data.autoPlay;
        $scope.hideAtStateChange = data.hideAtStateChange;
        if(self.currentSource && self.currentSource === self.playlist[self.index].src[0]){
          self.play();
        }
        else{
          self.currentSource = self.playlist[self.index].src[0];
          /**Initialization */
          init();
        }

      });
      cleanUpFnPause = $scope.$on('sonic-audio-pause-current', function(){
        self.play();
      });
      cleanUpFn2 = $scope.$on('$stateChangeStart', function(){
        if(self.hideAtStateChange){
          cleanUpFn();
        }
      });
      $scope.$on('$destroy', function() {
        if(typeof cleanUpFn === 'function') {
          cleanUpFn();
        }
        if(typeof cleanUpFn2 === 'function') {
          cleanUpFn2();
        }
        if(typeof cleanUpFnPause === 'function') {
          cleanUpFnPause();
        }
      });
      /**END Event management	*/

      /**Initialization */
      init();
    }]);
