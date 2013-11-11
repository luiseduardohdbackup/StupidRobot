﻿(function () {
	"use strict";

	Crafty.c('GridItem', {
		GridItem: function(x, y, w, h, entityType, clickable) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.originEntity = entityType;
			this.removeMode = false;
			this.possibleOperations = {
			  'SetEntity': StupidRobot.Commands.SetEntity,
			  'RemoveEntity': StupidRobot.Commands.RemoveEntity
			};
			if (clickable == false) this.unbind('Click');
			this.bind('ThemeChange', function () { this.setEntity(StupidRobot.Editor.GetEntity(this.entityType)) });
			this.bind('RemoveMode', function (removeMode) { this.removeMode = removeMode; });
			this.setEntity(StupidRobot.Editor.GetEntity(entityType));
			return this;
		},

		setEntity: function (entity) {
		  var my = this;

			var entities = {
				'hero': function () { my._setOverlayEntity(entity) },
				'item': function () { my._setOverlayEntity(entity) },
				'soli': function () { my._setBasicEntity(entity) },
				'free': function () { my._setBasicEntity(entity) }
			};
			entities[ entity.data['type'].substring(0,4) ]();
			this.trigger('Change');
		},

		removeEntity: function () {
		  if (typeof (this.overlappingEntity) != "undefined") {
		    this.overlappingEntity = undefined;
		    this.trigger('Change');
		    return;
		  }
      //reset entity to its origin (ground entity)
		  this.setEntity(StupidRobot.Editor.GetEntity(this.originEntity));
		  this.trigger('Change');
		},

		_setBasicEntity: function (entity) {
			this.entity = entity;
			this.entityType = entity.data['type'];
		},

		_setOverlayEntity: function (entity) {
			this.overlappingEntity = entity;
		},

		init: function () {
			this.requires('Mouse');

			var ctx = Crafty.canvas.context;

			this.isHovering = false;

			this.bind('Click', function () {
			  if (this.removeMode) {
			    this.removeEntity();
			  }
			  else if (!this.removeMode) {
			    var command = this.possibleOperations['SetEntity'];
			    StupidRobot.CommandManager.addCommand(command);
			    command.performActionOn(this)
			  }
			});

			this.bind('MouseOver', function () {
				this.isHovering = true;
				this.trigger('Change');
			});

			this.bind('MouseOut', function () {
				this.isHovering = false;
				this.trigger('Change');
			});
		},

		draw: function () {
			var ctx = Crafty.canvas.context;
			ctx.save();

			ctx.globalAlpha = this.isHovering ? 0.4 : 1;

			if (typeof (this.entity) != "undefined") {
				var entityImage = new Image;
				entityImage.src = this.entity.data['picture'];
				ctx.drawImage(entityImage, this.x, this.y, this.w, this.h);
				if (typeof (this.overlappingEntity) != "undefined") {
					var overlappingImage = new Image;
					overlappingImage.src = this.overlappingEntity.data['picture'];
					ctx.drawImage(overlappingImage, this.x, this.y, this.w, this.h);
				}
			}
			else {
				ctx.fillStyle = 'black';
				ctx.font = "10px Arial";
				ctx.textAlign = 'center';
				ctx.fillText("no Entity", this.x + (this.w / 2), this.y + this.h / 2 + 13);
			}

			//TODO: Next Line could be a chooseable option for activating gridview or not
			//restore gridlines or else the picture would overpaint it
			ctx.strokeRect(this.x, this.y, this.w, this.h);

			ctx.restore();
		}
	});
})();