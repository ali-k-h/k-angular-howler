/**
 * Created by Ali on 11/2/2016.
 */

angular.module('kAngularHowlerApp').controller('AudioCtrl',
  ['$document', '$scope', '$interval','player',
    function ($document, $scope, $interval, player) {
      'use strict';
      var self = this;
      var handleEnd;
      var init;
      var setVolumeIcon;
      var watchPlayback;
      var startWatching;
      var cleanupSounds;
      var currentHowlObj;
      var onplayCallback;
      var onloadCallback;
      var onerrorCallback;
      var onendCallback;
      var onpauseCallback;
      var onstopCallback;
      var onseekCallback;

      onseekCallback = function () {
        $interval.cancel(startWatching);
        startWatching = $interval(watchPlayback, 500);
      };
      onstopCallback = function () {
        //handleEnd();
        $scope.$apply();
      };
      onpauseCallback = function () {
        handleEnd();
        $scope.$apply();
      };
      onendCallback = function () {
        handleEnd();
        $scope.$apply();
      };
      onerrorCallback = function () {
        self.showError = true;
        self.showSpinner = false;
        $scope.$apply();
      };
      onloadCallback = function (obj) {
        currentHowlObj = obj;
        currentHowlObj.loaded = true;
      };
      onplayCallback = function (data) {
        self.duration = data.howl.duration();
        self.isPlaying = true;
        self.playIcon = self.data.pauseIcon;
        self.showSoundInfo = true;
        self.showSpinner = false;
        self.showError = false;
        startWatching = $interval(watchPlayback, 500);
      };

      self.data = {
        startIcon: "fa fa-play",
        stopIcon: "stop",
        pauseIcon: "fa fa-pause",
        volumeUp: 'fa fa-volume-up',
        volumeDown: 'fa fa-volume-down',
        volumeOff: 'fa fa-volume-off'
      };

      cleanupSounds = function () {
        $interval.cancel(startWatching);
        if (currentHowlObj) {
          player.unload();
        }
      };

      setVolumeIcon = function (volume) {
        if (volume > 0.5) {
          return self.data.volumeUp;
        }
        if (volume <= 0.5 && volume > 0) {
          return self.data.volumeDown;
        }
        return self.data.volumeOff;
      };

      handleEnd = function () {
        self.isPlaying = false;
        self.playIcon = self.data.startIcon;
        $interval.cancel(startWatching);
      };

      init = function () {
        if ($scope.playlist && $scope.playlist.length > 0) {
          cleanupSounds();
          self.triggerElm = $scope.triggerElm;
          self.isPlaying = false;
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
          if ($scope.index && $scope.index > 0 && $scope.index < self.playlist.length) {
            self.index = $scope.index;
          }
          else {
            self.index = 0;
          }
          self.playlist = $scope.playlist;
          if (self.autoPlay) {
            self.play();
          }
        }
      };

      watchPlayback = function () {
        self.startOffset = player.seek(self.index, self.soundId, self.playlist) || 0;
        self.playbackPosition = self.startOffset * 100 / self.duration;
      };

      self.volumeChange = function () {
        var volume = self.volumeLevel / 100;
        player.volumeChange(self.index, volume, self.playlist, function(){
          self.volumeIcon = setVolumeIcon(volume);
        });
      };

      self.timeChange = function () {
        try {
          $interval.cancel(startWatching);
          self.startOffset = self.playbackPosition * self.duration / 100;
          player.seek(self.index, self.soundId, self.playlist, self.startOffset);
        }
        catch (e) {
        }
      };

      self.play = function () {
        if (self.isPlaying) {
          /**Pause */
          player.pause(self.index, self.soundId, self.playlist);
        }
        else {
          /**play */
          var options = {
            onseekCallback:onseekCallback,
            onstopCallback:onstopCallback,
            onpauseCallback:onpauseCallback,
            onendCallback:onendCallback,
            onerrorCallback:onerrorCallback,
            onloadCallback:onloadCallback,
            onplayCallback:onplayCallback
          };
          var playResponse = player.play(self.index, self.playlist, self.volume, options);
          self.showSpinner = true;
          self.showError = false;
          self.soundId = playResponse.soundId;
          currentHowlObj = playResponse.currentHowlObj;
          self.image = playResponse.data.image;
          self.username = playResponse.data.username;
          self.filename = playResponse.data.filename;
          self.userId = playResponse.data.userId;
          self.userProfileLink = playResponse.data.userProfileLink;
        }
      };

      self.move = function (direction) {
        var _index = (direction === 'backward') ?
        self.index - 1 : self.index + 1;
        /** loop through sounds */
        if (_index > self.playlist.length - 1) {
          _index = 0;
        }
        if (_index < 0) {
          _index = self.playlist.length - 1;
        }
        self.showSoundInfo = false;
        player.stop(self.index, self.soundId, self.playlist);
        self.isPlaying = false;
        self.index = _index;
        self.play();
      };

      self.hideVolume = function () {
        self.showVolumeLevel = false;
        self.thisIsVolumeRange = false;
      };

      self.showVolume = function () {
        if (!self.thisIsVolumeRange) {
          self.showVolumeLevel = !self.showVolumeLevel;
        }
        self.thisIsVolumeRange = false;
      };

      self.close = function () {
        cleanupSounds();
        $scope.playlist = null;
      };

      init();
    }]);
