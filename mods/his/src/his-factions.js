

  importFaction(name, obj) {

console.log("importing faction " + name);

    if (obj.id == null)                 { obj.id = "faction"; }
    if (obj.name == null)               { obj.name = "Unknown Faction"; }
    if (obj.img == null)                { obj.img = ""; }
    if (obj.returnFactionSheet == null) {
      obj.returnFactionSheet = function(faction) {
        return `
	  <div class="faction_sheet" id="faction" style="background-image: url('/his/img/factions/${obj.img}')">
	  </div>
	`;
      }
    }

    //obj = this.addEvents(obj);
    this.factions[name] = obj;

  }



