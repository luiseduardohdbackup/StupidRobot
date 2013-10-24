﻿/// <reference path="/Scripts/Reference.js"/>

(function() {
	"use strict";

	var editorMode = WinJS.Class.define(
		null,
		null,
		{			
			Edit: function() {
				return 0;
			},
			View: function() {
				return 1;
			}
		});

	Crafty.c('Editor', {
		init: function() {
			this.windowWidth = StupidRobot.Game.width;
			this.windowHeight = StupidRobot.Game.height;

			//Editor Top Menu Bar
			this.bind('CreateMap', this._createMap);
			//Editor Bottom Menu Bar
			this.bind('EntitySelection', this._selectEntity);
		},

		_selectEntity: function (data) {
			var entities = {
				0: "/Assets/Game/Images/robot-east.scale-100.png",
				1: "/Assets/Game/Images/robot-north.scale-100.png",
				2: "/Assets/Game/Images/robot-west.scale-100.png",
				3: "/Assets/Game/Images/robot-south.scale-100.png",
				4: "/Assets/Game/Images/rocket.scale-100.png",
				5: "/Assets/Game/Images/tree.scale-100.png"
			}

			//set the currentEntity picture
			document.getElementById('currentEntity').src = entities[data.index];
		},

		_createMap: function (data) {

			//remove open map and its children before creating another one
			if (typeof(this._grid) != "undefined") {
				this._grid.each(function () {
					if (!this.has("Persist")) this.destroy();
				});
			}

			//get mapname and mapsize of data
			var mapname = data['mapname'].value;
			var gridblocks = { 'small': 10, 'medium': 15, 'big': 20 };
			var size;
			for (var i = 0 ; i < data['mapsize'].length; i++) {
				if (data['mapsize'][i].checked) {
					size = gridblocks[ data['mapsize'][i].value ];
				}
			}

			console.log(mapname);
			console.log(size);

			//create grid
			this._grid = Crafty.e('2D, Canvas, Grid')
				.Grid((this.windowWidth / 2), (this.windowHeight / 2), null, null, size);;

			//force the component to redraw
			this.trigger('Change');

		}
	});

	WinJS.Namespace.define('StupidRobot.Editor', {
		EditorMode: editorMode
	});
})();