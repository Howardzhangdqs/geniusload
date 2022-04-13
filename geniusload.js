var geniusload = {
	loadTree: function(obj, ifroot = true, fathernode = 0) {
		if (ifroot) this.treeanalyze_adapter(obj), this.acknowledge_son();
		if (typeof obj[0] == 'string') this.geniusloader(obj);
		else for (let i in obj) {
			this.geniusloader(obj[i]);
		}
	},
	
	nodenum: 0,
	
	treeanalyze_adapter: function(obj, father = 0) {
		if (typeof obj[0] == 'string') this.treeanalyze(obj, father);
		else for (let i in obj) this.treeanalyze(obj[i], father);
	},
	
	treeanalyze: function(obj, father) {
		let attrs = this.containsuffix(obj[0]);
		this.nodenum ++;
		this.nodetree.push({
			n:          this.nodenum,
			loading:    false,
			loaded:     false,
			type:       attrs.type,
			id:         attrs.id,
			class:      attrs.class,
			construct:  (attrs.type == 2 ? [obj[1], obj[2]] : obj[1]),
			beforeload: new Function(),
			afterload:  new Function(),
			childnode:  [],
			fathernode: father
		});
		let benchmark;
		if (attrs.type == 0 || attrs.type == 1) benchmark = 2;
		else if (attrs.type == 2) benchmark = 3;
		for (; benchmark < obj.length; benchmark ++) {
			if (typeof obj[benchmark] == 'function')
				this.tree_addattr(this.nodenum, {
					afterload: obj[benchmark]
				});
			if ((typeof obj[benchmark] == 'object') && (! Array.isArray(obj[benchmark]))) {
				this.tree_addattr(this.nodenum, obj[benchmark]);
			}
			if (Array.isArray(obj[benchmark])) {
				this.treeanalyze_adapter(obj[benchmark], this.nodenum);
			}
		}
	},
	
	acknowledge_son: function() {
		for (let i = 0; i < this.nodetree.length; i ++) {
			for (let j = 0; j < this.nodetree.length; j ++) {
				if (this.nodetree[i].fathernode == this.nodetree[j].n) {
					this.nodetree[j].childnode.push(i);
					break;
				}
			}
		}
	},
	
	tree_addattr: function(id, attrs) {
		for (let i in this.nodetree)
			if (this.nodetree[i].id == id) {
				for (let j in attrs) this.nodetree[i][j] = attrs[j];
				break;
			}
	},
	
	geniusloader: function(obj) {
		let attrs = this.containsuffix(obj[0]);
		let type = attrs.type;
		let id   = attrs.id;
		let cla  = attrs.class;
		let showid = true, showcla = true;
		
		this.nodenum ++;
		if (id == undefined)  showid  = false, id = this.nodenum;
		if (cla == undefined) showcla = false;
		this.nodepush(id, cla);
		if (type == 0) {
			let Script = document.createElement('script');
			if (showid)  Script.setAttribute('id', id);
			if (showcla) Script.setAttribute('class', cla);
			Script.setAttribute('src', obj[1]);
			Script.setAttribute('type', 'text/javascript');
			document.body.appendChild(Script);
			this.nodeadd_attr(id, Script);
			console.log("\x1B[38;2;100;100;197mloading\x1B[39m", Script.outerHTML);
			
			Script.onload = function() {
				geniusload.nodeafter(id);
				console.log("\x1B[38;2;0;217;61mloaded\x1B[39m ", this.outerHTML);
				if (obj.length >= 3) {
					geniusload.loadTree(obj[2], false);
				}
			}
		}
		
		if (type == 1) {
			let Script = document.createElement('link');
			if (showid) Script.setAttribute('id', id);
			if (showcla) Script.setAttribute('class', cla);
			Script.setAttribute('href', obj[1]);
			Script.setAttribute('rel', "stylesheet");
			document.head.appendChild(Script);
			this.nodeadd_attr(id, Script);
			console.log("\x1B[38;2;100;100;197mloading\x1B[39m", Script.outerHTML);
			
			Script.onload = function() {
				geniusload.nodeafter(id);
				console.log("\x1B[38;2;0;217;61mloaded\x1B[39m ", this.outerHTML);
				if (obj.length >= 3) {
					geniusload.loadTree(obj[2], false);
				}
			}
		}
		
		if (type == 2) {
			let Script = document.createElement('style');
			if (showid) Script.setAttribute('id', id);
			if (showcla) Script.setAttribute('class', cla);
			Script.innerHTML = "@font-face{font-family: '" + obj[1] + "';src: url(" + obj[2] + ");}";
			document.head.appendChild(Script);
			this.nodeadd_attr(id, Script);
			console.log("\x1B[38;2;100;100;197mloading\x1B[39m", obj[1]);
			
			Script.onload = function() {
				geniusload.nodeafter(id);
				console.log("\x1B[38;2;0;217;61mloaded\x1B[39m ", obj[1]);
				if (obj.length >= 4) {
					geniusload.loadTree(obj[3], false);
				}
			}
		}
	},
	
	nodelist: [],
	
	nodetree: [{id: 0, childnode: [], n: 0}],
	
	nodepush: function(id, cla) {
		this.nodelist.push({
			id: id,
			class: cla,
			loading: true,
			loaded: false
		});
	},
	
	nodeadd_attr: function(str, dom) {
		for (let i in this.nodelist)
			if (this.nodelist[i].id == str) {
				this.nodelist[i].script = dom;
				this.nodelist[i].outerHTML = dom.outerHTML;
				this.nodelist[i].startloading = +new Date();
			}
	},
	
	nodeafter: function(str) {
		for (let i in this.nodelist)
			if (this.nodelist[i].id == str) {
				this.nodelist[i].loading = false;
				this.nodelist[i].loaded  = true;
				this.nodelist[i].finishloading = +new Date();
				this.nodelist[i].loadingtime = this.nodelist[i].finishloading - this.nodelist[i].startloading;
			}
	},
	
	containsuffix: function(str) {
		let id, cla, classt;
		suffix = (str.split("#")[0]).split(".")[0];
		cla = str.split("#")[1]; cla = (cla == undefined ? "" : cla).split(".")[0]; if (cla == "") cla = undefined;
		id  = str.split(".")[1]; id  = (id  == undefined ? "" : id ).split("#")[0]; if (id  == "") id  = undefined;
		
		let js   = ["js", "javascript", "script"];
		let css  = ["css", "Cascading Style Sheets", "style"];
		let font = ["font", "typeface", "family", "font-family"];
		suffix = suffix.toLowerCase();
		let type = 4;
		for (let i in js)   if (suffix == js[i])   type = 0;
		for (let i in css)  if (suffix == css[i])  type = 1;
		for (let i in font) if (suffix == font[i]) type = 2;
		return {type: type, id: id, class: cla};
	}
}