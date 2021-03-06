	var GenerationState = {
		Infants: "infants",
		Students: "students",
		Researchers: "researchers",
		Scientists: "scientists",
		Retirees: "retirees",
		Deads: "deads"
		};

	const GenerationConst = {
		AGE_INFANTS: 6,
		AGE_RETIREES: 80,
		EDUCATIONAL_PRIMARY: 13,
		EDUCATIONAL_SECONDARY: 5
	};

	function Generation(date, nurseryUnit)
	{
		var birthDate = date;
		var lots = [];
		for(var i = 0; i < nurseryUnit; i++)
		{
			lots[i] = new GenerationalLot(birthDate);
		}

		var _getPopulation = function()
		{
			var ret = 0;
			for(var i = 0; i < lots.length; i++)
			{
				ret += lots[i].getPopulation();
			}
			return ret;
		};

		var _kill = function()
		{
			if(_getPopulation() > 0)
			{
				do
				{
					var i = Math.floor(Math.random() * lots.length);
					if(lots[i].getPopulation() > 0)
					{
						if(lots[i].kill() == 0)
						{
							// rimuovo il lotto
							lots.splice(i, 1); // remove
						}
						return _getPopulation();
					}
				}
				while(true);
			}
			return 0;
		};

		var _getState = function(date)
		{
			if(_getPopulation() == 0)
			{
				return GenerationState.Deads;
			}

			var age = date - birthDate;
			if(age < GenerationConst.AGE_INFANTS)
			{
				return GenerationState.Infants;
			}
			else if(age > GenerationConst.AGE_RETIREES)
			{
				return GenerationState.Retirees;
			}
			else
			{
				var minEducationLevel = lots[lots.length - 1].getEducationLevel();
				if(minEducationLevel < GenerationConst.EDUCATIONAL_PRIMARY)
				{
					return GenerationState.Students;
				}
				else if(minEducationLevel < GenerationConst.EDUCATIONAL_PRIMARY + GenerationConst.EDUCATIONAL_SECONDARY)
				{
					return GenerationState.Researchers;
				}
				else
				{
					return GenerationState.Scientists;
				}
			}
		};

		var _getNextLot = function()
		{
			if(_getPopulation() > 0)
			{
				var minEducationLevel = lots[lots.length - 1].getEducationLevel();
				for(var i = 0; i < lots.length; i++)
				{
					if(lots[i].getEducationLevel() == minEducationLevel)
					{
						return lots[i];
					}
				}
			}
			return null;
		};

		var _teach = function()
		{
			var lot = _getNextLot();
			if(lot != null)
			{
				lot.teach();
			}
		};

		//-----------------------------------------

		this.getBirthDate = function() { return birthDate; };
		this.getLots = function() { return lots; };

		this.getPopulation = _getPopulation;
		this.kill = _kill;
		this.getNextLot = _getNextLot;
		this.teach = _teach;
		this.getState = _getState;

		//-----------------------------------------
	}

	function GenerationalLot(date)
	{
		const INITIAL_POPULATION = 5;

		var birthDate = date;
		var deadCount = 0;
		var educationLevel = 0;

		var _getPopulation = function()
		{
			return INITIAL_POPULATION - deadCount;
		};

		var _kill = function()
		{
			if(deadCount < INITIAL_POPULATION)
			{
				deadCount++;
			}
			return _getPopulation();
		};

		var _teach = function()
		{
			if(deadCount < INITIAL_POPULATION)
			{
				educationLevel++;
			}
		};

		var _getState = function(date)
		{
			if(_getPopulation() == 0)
			{
				return GenerationState.Deads;
			}

			var age = date - birthDate;
			if(age < GenerationConst.AGE_INFANTS)
			{
				return GenerationState.Infants;
			}
			else if(age > GenerationConst.AGE_RETIREES)
			{
				return GenerationState.Retirees;
			}
			else
			{
				if(educationLevel < GenerationConst.EDUCATIONAL_PRIMARY)
				{
					return GenerationState.Students;
				}
				else if(educationLevel < GenerationConst.EDUCATIONAL_PRIMARY + GenerationConst.EDUCATIONAL_SECONDARY)
				{
					return GenerationState.Researchers;
				}
				else
				{
					return GenerationState.Scientists;
				}
			}
		};

		//-----------------------------------------

		this.getEducationLevel = function() { return educationLevel; };

		this.getPopulation = _getPopulation;
		this.kill = _kill;
		this.teach = _teach;
		this.getState = _getState;

		//-----------------------------------------
	}