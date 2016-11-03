/**
 * Created by K2 on 11/2/2016.
 */
'use strict';
angular.module('kAngularHowlerApp').
controller('AudioCtrl',
  ['$document','$scope',
    function ($document, $scope) {
      var context;
      var self = this;
      var startTime;
      var isPlaying;
      var pause;
      var smoothing;
      var fftSize;
      var canvasWidth;
      var canvasHeight;

      var init = function() {
        initVariables();
        initDrawing();
        $document.bind('click', function() {
          self.volumeHoverOut();
          $scope.$apply();
        });
      }
      var initVariables = function () {
        isPlaying = false;
        self.playIcon = self.data.startIcon;
        self.data.timevalue = 0;
        self.data.startOffset = 0;
        if (self.startProgressTimer) {
          clearInterval(self.startProgressTimer);
        }
      }

      var initDrawing = function() {
        smoothing = 0.8;
        fftSize = 2048;
        canvasWidth = 240;
        canvasHeight = 70;
      }

      self.data = {
        title: "Kosar Guitar Tuner",
        levelvalue: 30,
        levelMax: 100,
        levelMin: 0,
        startIcon: "fa-play",
        stopIcon: "stop",
        pauseIcon: "fa-pause",
        remaaining: 0,
        timevalue: 0,
        timeMax: 100,
        timeMin: 0,
        startOffset: 0,
        showVolumeLevel: false

      }


      //Initiation
      init();

      self.volumeChange = function () {
        self.gainNode.gain.value = calculateLevel();
      };

      self.play = function () {
        if (!context) {
          context = contextFactory.defineContext();
        }
        if (isPlaying) {
          pause();
        } else {
          var audioGraph = contextFactory.createAudioGraph(context);
          var source = audioGraph.source;
          self.gainNode = audioGraph.gainNode;
          self.gainNode.gain.value = calculateLevel();
          self.analyzer = audioGraph.analyzer;
          self.playIcon = self.data.pauseIcon;
          if (!self.buffer) {
            loadAudio(source, self.startAudio);
          } else {
            self.startAudio(source);
          }

          self.timeChange = function () {
            source.stop();
            clearInterval(self.startProgressTimer);
            self.data.startOffset = self.data.timevalue * self.buffer.duration / 100;
            isPlaying = false;
            self.play();
          }

          self.stop = function () {
            if (self.buffer) {
              source.stop();
              initVariables();
            }
          };

          pause = function () {
            source.stop();
            clearInterval(self.startProgressTimer);
            calculateStartOffset();
            self.playIcon = self.data.startIcon;
            isPlaying = false;

          };
        }
      }

      var calculateStartOffset = function() {
        self.data.startOffset += context.currentTime - startTime;
      }

      self.watchTimeOffset = function () {
        calculateStartOffset();
        startTime = context.currentTime;
        //  self.data.title = self.data.startOffset;
        self.data.timevalue = self.data.startOffset * 100 / self.buffer.duration;
        if (self.data.timevalue >= 100) {
          initVariables();
        }
        $scope.$apply();
      }
      self.startAudio = function (source) {
        source.buffer = self.buffer;
        source.start(0, self.data.startOffset % source.buffer.duration);
        isPlaying = true;
        startTime = context.currentTime;
        requestAnimFrame(self.draw.bind());
        self.startProgressTimer = setInterval(self.watchTimeOffset, 500);
      }

      var loadAudio = function (source, callBack) {
        var url = 'audio/Blackbird.mp3';
        loadAssets.loadAudio(context, url, function (res) {
          if (res.buffer) {
            self.buffer = res.buffer;
            callBack(source);
          }
          else {
            alert("Error with finding audio data: " + res.err);
            self.playIcon = self.data.startIcon;
            isPlaying = false;
          }
        });
      }

      self.draw = function () {
        var analyzer = self.analyzer;
        analyzer.smoothingTimeConstant = smoothing;
        analyzer.fftSize = fftSize;
        var canvas = document.querySelector('#visualizerCanvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var drawContext = canvas.getContext('2d');
        var params = { "WIDTH": canvasWidth, "HEIGHT": canvasHeight };
        drawingFactory.freqDomainChart(analyzer, drawContext, params);
        requestAnimFrame(self.draw.bind());
      }

      var calculateLevel = function () {
        var fraction = parseInt(self.data.levelvalue) / parseInt(self.data.levelMax);
        return fraction * fraction;
      }
      self.volumeHoverOut = function () {
        self.data.showVolumeLevel = false;
      }
      self.volumeHoverIn = function () {
        self.data.showVolumeLevel = true;
      }

    }]);
