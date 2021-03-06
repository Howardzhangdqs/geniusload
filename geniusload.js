/*!
 * Genius Load - JavaScript plugin for load logic
 *
 * Copyright (c) 2022 HowardZhangdqs
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://github.com/Howardzhangdqs/geniusload/
 *
 * Version: 1.2.3
 *
 */

var geniusload = function(robj) {
	this.loadTree = function(obj, ifroot, fathernode) {
		ifroot = ifroot || true; fathernode = fathernode || 0;
		if (ifroot) this.treeanalyze_adapter(obj), this.preload(), this.acknowledge_son();
		this.loaddfs(0);
	};
	
	this.nodenum = 0;
	
	this.treeanalyze_adapter = function(obj, father) {
		father = father || 0;
		if (typeof obj[0] == 'string') this.treeanalyze(obj, father);
		else for (let i in obj) this.treeanalyze(obj[i], father);
	};
	
	this.treeanalyze = function(obj, father) {
		let attrs = this.containsuffix(obj[0]);
		this.nodenum ++;
		this.nodetree.push({
			n:          this.nodenum,
			loading:    false,
			loaded:     false,
			type:       attrs.type,
			id:         attrs.id,
			class:      attrs.class,
			construct:  (attrs.type == 2 ? [obj[1], obj[2]] : [obj[1]]),
			beforeload: new Function(),
			afterload:  new Function(),
			childnode:  [],
			fathernode: father,
			starttime:  undefined,
			endtime:    undefined,
			lasttime:   undefined,
			fatherlist: [],
			fatherreal: [],
			preload:    true
		});
		let _benchmark;
		if (attrs.type == 0 || attrs.type == 1) _benchmark = 2;
		else if (attrs.type == 2) _benchmark = 3;
		for (let benchmark = _benchmark; benchmark < obj.length; benchmark ++) {
			if (typeof obj[benchmark] == 'function')
				this.tree_addattr(this.nodenum, {
					afterload: obj[benchmark]
				});
			if ((typeof obj[benchmark] == 'object') && (! Array.isArray(obj[benchmark]))) {
				this.tree_addattr(this.nodenum, obj[benchmark]);
			}
		}
		for (let benchmark = _benchmark; benchmark < obj.length; benchmark ++) {
			if (Array.isArray(obj[benchmark])) {
				this.treeanalyze_adapter(obj[benchmark], this.nodenum);
			}
		}
	};
	
	this.preload_cache = [];
	
	this.preload = function() {
		for (let i = 0; i < this.nodetree.length; i ++) {
			if (this.nodetree[i].preload) {
				let tpload = new Image();
                tpload.src = (this.nodetree[i].type == 2 ? this.nodetree[i].construct[1] : this.nodetree[i].construct[0]);
				this.preload_cache.push(tpload);
			}
		}
	}
	
	this.acknowledge_son = function() {
		for (let i = 0; i < this.nodetree.length; i ++) {
			for (let j = 0; j < this.nodetree.length; j ++) {
				for (let k = 0; k < this.nodetree[i].fatherlist.length; k ++) {
					if (this.nodetree[i].fatherlist[k][0] == ".") {
						if (this.nodetree[j].class == this.nodetree[i].fatherlist[k].slice(1)) {
							this.nodetree[i].fatherreal.push(j); this.nodetree[j].childnode.push(i);
						}
					} else if (this.nodetree[i].fatherlist[k][0] == "#") {
						if (this.nodetree[j].id == this.nodetree[i].fatherlist[k].slice(1)) {
							this.nodetree[i].fatherreal.push(j); this.nodetree[j].childnode.push(i);
						}
					}
				}
				if (this.nodetree[i].fathernode == this.nodetree[j].n) {
					this.nodetree[j].childnode.push(i); this.nodetree[i].fatherreal.push(j);
				}
			}
		}
	};
	
	this.tree_addattr = function(n, attrs) {
		for (let j in attrs) this.nodetree[n][j] = attrs[j];
	};
	
	this.loaddfs = function(fa) {
		if (fa != 0) {
			let pnode = this.nodetree[fa];
			if (pnode.loading && pnode.loaded) return;
			
			this.nodetree[fa].loading = true;
			
			for (let i in pnode.fatherreal) {
				if (! this.nodetree[pnode.fatherreal[i]].loaded) return;
			}
			
			if (pnode.type == 0) {
				let Script = document.createElement('script');
				if (pnode.id    != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.class != undefined) Script.setAttribute('class', pnode.class);
				Script.setAttribute('src', pnode.construct[0]);
				Script.setAttribute('type', 'text/javascript');
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.body.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				let th = this;
				
				Script.onload = function() {
					th.nodeafter((+new Date()), fa);
					th.consolelog("E", th.nodetree[fa]);
					(th.nodetree[fa].afterload)();
					for (let i in th.nodetree[fa].childnode)
						th.loaddfs(th.nodetree[fa].childnode[i]);
				}
			}
			
			if (pnode.type == 1) {
				let Script = document.createElement('link');
				if (pnode.id  != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.cla != undefined) Script.setAttribute('class', pnode.cla);
				Script.setAttribute('href', pnode.construct[0]);
				Script.setAttribute('rel', "stylesheet");
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.head.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				let th = this;
				
				Script.onload = function() {
					th.nodeafter((+new Date()), fa);
					th.consolelog("E", th.nodetree[fa]);
					(th.nodetree[fa].afterload)();
					for (let i in th.nodetree[fa].childnode)
						th.loaddfs(th.nodetree[fa].childnode[i]);
				}
			}
			
			if (pnode.type == 2) {
				let Script = document.createElement('style');
				if (pnode.id  != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.cla != undefined) Script.setAttribute('class', pnode.cla);
				Script.innerHTML = "@font-face{font-family: '" + pnode.construct[0] + "';src: url(" + pnode.construct[1] + ");}";
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.head.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				let th = this;
				
				Script.onload = function() {
					th.nodeafter((+new Date()), fa);
					th.consolelog("E", th.nodetree[fa]);
					(th.nodetree[fa].afterload)();
					for (let i in th.nodetree[fa].childnode)
						th.loaddfs(th.nodetree[fa].childnode[i]);
				}
			}
		} else {
			for (let i in this.nodetree[0].childnode)
				this.loaddfs(this.nodetree[0].childnode[i]);
		}
	};
	
	this.nodetree = [{
		id: 0,
		childnode: [],
		n: 0,
		fatherlist: [],
		fatherreal: [],
		loading:    false,
		loaded:     true
	}];
	
	this.nodeafter = function(pt, fa) {
		this.nodetree[fa].endtime  = pt;
		this.nodetree[fa].lasttime = pt - this.nodetree[fa].starttime;
		
		this.nodetree[fa].loading = false;
		this.nodetree[fa].loaded  = true;
	};
	
	this.containsuffix = function(str) {
		let id, cla, classt;
		suffix = (str.split("#")[0]).split(".")[0];
		cla = str.split(".")[1]; cla = (cla == undefined ? "" : cla).split(".")[0]; if (cla == "") cla = undefined;
		id  = str.split("#")[1]; id  = (id  == undefined ? "" : id ).split("#")[0]; if (id  == "") id  = undefined;
		
		let js   = ["js", "javascript", "script"];
		let css  = ["css", "Cascading Style Sheets", "style"];
		let font = ["font", "typeface", "family", "font-family"];
		suffix = suffix.toLowerCase();
		let type = 4;
		for (let i in js)   if (suffix == js[i])   type = 0;
		for (let i in css)  if (suffix == css[i])  type = 1;
		for (let i in font) if (suffix == font[i]) type = 2;
		return {type: type, id: id, class: cla};
	};
	
	this.ft = function(str, ph) {
		str = "" + str;
		for (let i = str.length; i < ph; i ++) str = "0" + str;
		return str;
	}
	
	this.consolelog = function(c, obj) {
		let clt;
		if (c == "E") {
			clt = obj.endtime;
			console.log("\x1B[38;2;0;217;61m[" + c + " " +
				this.ft(parseInt(clt / 1000 / 60 / 60) % 60, 2) + ":" +
				this.ft(parseInt(clt / 1000 / 60) % 60, 2) + ":" +
				this.ft(parseInt(clt / 1000) % 60, 2) + "." +
				this.ft(clt % 1000, 3) + " GeniusLoad]\x1B[39m " + obj.outerHTML +
				" \x1B[38;2;0;217;61mwhich loaded for " + obj.lasttime + " ms\x1B[39m");
			return;
		}
		clt = obj.starttime;
		console.log("\x1B[38;2;100;100;197m[" + c + " " +
			this.ft(parseInt(clt / 1000 / 60 / 60) % 60, 2) + ":" +
			this.ft(parseInt(clt / 1000 / 60) % 60, 2) + ":" +
			this.ft(parseInt(clt / 1000) % 60, 2) + "." +
			this.ft(clt % 1000, 3) + " GeniusLoad]\x1B[39m " + obj.outerHTML);
	};
	
	if (robj != undefined) this.loadTree(robj);
}