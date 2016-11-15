/**
 * Created by K2 on 11/2/2016.
 */
'use strict';
angular.module('kAngularHowlerApp').
controller('AudioCtrl',
  ['$document','$scope','$timeout',
    function ($document, $scope, $timeout) {
      var context;
      var self = this;
      var handleEnd,
        index, isPlaying,  pause, smoothing,player,
        fftSize, canvasWidth, canvasHeight, howl,
        soundId, init, setVolumeIcon, watchPlayback, Player;

      setVolumeIcon = function(volume){
        if(volume > 0.5) return self.data.volumeUp;
        if(volume <= 0.5 && volume > 0) return self.data.volumeDown;
        return self.data.volumeOff;
      };
      self.data = {
        startIcon: "fa fa-play",
        stopIcon: "stop",
        pauseIcon: "fa fa-pause",
        volumeUp:'fa fa-volume-up',
        volumeDown:'fa fa-volume-down',
        volumeOff:'fa fa-volume-off'
      };
      handleEnd = function handleEnd(){
        isPlaying = false;
        self.playIcon = self.data.startIcon;
        clearInterval(watchPlayback);
      };

      var Player = function(playlist){
        this.playlist = playlist.slice(0);
      };

      Player.prototype = {
        play: function (index) {
          var _playlist = this.playlist;
          if(index < 0 || !_playlist || !_playlist.length === 0 ||
            index >= _playlist.length){
            return;
          }
          // var that = this;
          var sound;
          index = typeof index === 'number' ? index : 0;
          var data = _playlist[index];
          // If we already loaded this track, use the current one.
          // Otherwise, setup and load a new Howl.
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
                setInterval(watchPlayback, 500);
                $scope.$apply();
              },
              onload: function () {

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
                handleEnd();
                $scope.$apply();
              }
            });
          }
          self.accountImage = data.image;
          self.username = data.username;
          self.filename = data.filename;
          // Begin playing the sound.
          // Keep track of the index we are currently playing.
          // self.index = index;
          return sound.play();
        },
        pause: function(index, soundId){
          var _playlist = this.playlist;
          if(_playlist[index] && _playlist[index].howl){
            _playlist[index].howl.pause(soundId);
          }
        },
        stop: function(index, soundId){
          var _playlist = this.playlist;
          try{
            if(_playlist && _playlist[index].howl){
              this.playlist[index].howl.stop(soundId);
            }
          }
          catch(e){}
        },
        volumeChange: function(index, volume){
          var _playlist = this.playlist;
          if(_playlist[index] && _playlist[index].howl){
            _playlist[index].howl.volume(volume);
            self.volumeIcon = setVolumeIcon(volume);
          }
        },
        seek: function(index, soundId, startOffset){
          /**get or set seek */
          var _playlist = this.playlist;
          if(_playlist[index] && _playlist[index].howl){
            return startOffset?
              _playlist[index].howl.seek(startOffset, soundId):
              _playlist[index].howl.seek(soundId);
          }
        }
      };

      init = function() {
        isPlaying = false;
        self.volume = $scope.volume || 0.4;
        self.playbackPosition = 0;
        self.duration = 0;
        self.startOffset = 0;
        self.showSoundInfo = false;
        self.showSpinner = false;
        self.showVolumeLevel = false;
        self.thisIsVolumeRange = false;
        self.volumeIcon = setVolumeIcon(self.volume);
        self.volumeLevel = 30;
        self.playIcon = self.data.startIcon;
        self.playlist = $scope.playlist;
        if($scope.index && $scope.index > 0 && $scope.index < self.playlist.length){
          self.index = $scope.index;
        }
        else{
          self.index = 0;
        }
        self.autoPlay = $scope.autoPlay || false;
        player = new Player($scope.playlist);
        if(self.autoPlay){
          self.play();
        }
      };

      watchPlayback = function(){
        self.startOffset = player.seek(self.index, self.soundId) || 0;
        self.playbackPosition = self.startOffset * 100 / self.duration;
        $scope.$apply();
      };

      self.volumeChange = function () {
        player.volumeChange(self.index, self.volumeLevel/100);
      };

      self.timeChange = function () {
        try{
          $timeout(function(){
            self.startOffset = self.playbackPosition * self.duration / 100;
            player.seek(self.index, self.soundId, self.startOffset);
          }, 100);

        }
        catch(e){}
      };

      self.play = function(){
        if(isPlaying){ /**Pause */
        player.pause(self.index, self.soundId);
        }
        else{/**play */
        self.showSpinner = true;
          self.soundId = player.play(self.index);
        }
      };

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

      self.hideVolume = function () {
        self.showVolumeLevel = false;
        self.thisIsVolumeRange = false;
      };
      self.showVolume = function () {
        if(!self.thisIsVolumeRange){
          self.showVolumeLevel = !self.showVolumeLevel;
        }
        self.thisIsVolumeRange = false;
      };
      /**Initialization */
      init();
    }]);
