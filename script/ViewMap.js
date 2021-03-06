	function MapView(map, canvasId, backgroundImage, areaSize, onChangePosition)
	{
		var canvasMap = document.getElementById(canvasId);
		var ctx = canvasMap.getContext("2d");
		var position = { x: 0, y: 0 };
		var findResources = {};

		var _initialize = function()
		{
			canvasMap.width = 300;
			canvasMap.height = 150;
			canvasMap.addEventListener("mousedown", _doMouseDown, false);
		};

		var _doMouseDown = function(e)
		{
			if(onChangePosition != null)
			{
				var newPosition = _fromScreenPosition({ x: e.pageX, y: e.pageY });
				onChangePosition(newPosition);
			}
		};

		var _redraw = function()
		{
			findResources = {};
			var knowledge = map.getState().getTheory();
			for(var know = 0; know < knowledge.length; know++)
			{
				if(knowledge[know].indexOf("Find_") == 0)
				{
					findResources[knowledge[know].substr(5)] = true;
				}
			}

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.beginPath();
			ctx.drawImage(ImagesLib.getImage(backgroundImage), 0, 0);
			ctx.closePath();
			ctx.fill();

			var structure = map.getStructure();
			for(var i = 0; i < structure.length; i++)
			{
				if(structure[i].getType() == StructureTypes.Resource)
				{
					_drawResource(structure[i].getPosition(), structure[i]);
				}
				else if(structure[i].getType() == StructureTypes.Building)
				{
					_drawBuilding(structure[i].getPosition(), structure[i]);
				}
			}

			_drawActiveArea();
		};

		var _setPosition = function(point)
		{
			position = point;
			_redraw();
		};

		var _drawActiveArea = function()
		{
			var point = _toScreenPosition(position);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "lime";
			ctx.strokeRect(point.x - 1, point.y - areaSize.x - 1, areaSize.y + 2, areaSize.x + 2);
		};

		var _drawResource = function(position, resource)
		{
			if(findResources[resource.getResourceType()])
			{
				if((resource.getLayer() == map.getLayer()) &&
					(map.findBuilding( position, resource.getLayer()) == null))
				{
					var point = _toScreenPosition(position);
					ctx.beginPath();
					ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false);
					ctx.closePath();
					ctx.lineWidth = 1;
					ctx.strokeStyle = resource.getColor();
					ctx.stroke();
				}
			}
		};

		var _drawBuilding = function(position, building)
		{
			if(building.getLayer() == map.getLayer()
				/*&& building.isPipe()*/)
			{
				var point = _toScreenPosition(position);
				ctx.lineWidth = 1;
				ctx.strokeStyle = "#00FFFF";
				ctx.strokeRect(point.x, point.y, 1, 1);
			}
		};

		var _fromScreenPosition = function(point)
		{
			var currentLeft = 0, currentTop = 0;
			var obj = ctx.canvas;
			if (obj.offsetParent)
			{
				do
				{
					currentLeft += obj.offsetLeft;
					currentTop += obj.offsetTop;
				}
				while (obj = obj.offsetParent);
			}
			return { x: 150 - (point.y - currentTop), y: point.x - currentLeft };
		};

		var _toScreenPosition = function(point)
		{
			return { x: 0 + point.y, y: 150 - point.x };
		};

		_initialize();

		//-----------------------------------------

		this.getPosition = function(){ return position; };

		this.setPosition = _setPosition;
		this.redraw = _redraw;
		this.fromScreenPosition = _fromScreenPosition;

		//-----------------------------------------
	}