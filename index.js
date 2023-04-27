;(function() {
"use strict";
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

var settingData = [{
		name:"project name",
		value:"sample",
		type:"string"
	}, {
		name:"s3-upload",
		value:true,
		type:"bool"
	}, {
		name:"s3-bucket name",
		value:"",
		type:"string"
	}, {
		name:"get result",
		value:false,
		type:'bool'
	}
]

function SaveFiles() {
	console.log(fileStructureTree.files)
}

function LoadFiles() {
	
}

function LoadResult() {
	
}

// { name: 'index.html', content: "test for index.html", mode:"html"},
// { name: 'index.js', content: "test for index.js", mode:"javascript" },
// { name: 'index.css', content: "test for index.css", mode:"css" }
  
var tabList = new Vue({
  el: '#tabList',
  
  data: {
  	selectedTabList:null,
    tabList: [],
    width:0
  },
  
  methods : {
  	newTab:function(tabName, model) {
  		if(this.tabList.indexOf(model) == -1)
	  		this.tabList.push(model)
  	},
  	removeTab:function(tabName) {
  		var index = this.tabList.indexOf(tabName)
  		this.tabList.splice(index, 1)
  	}, test:function(name, event) {
  		console.log(name, event)
  	},
  	selectTab:function(index) {
  		if(this.selectedTabList)
	  		this.selectedTabList.content = editor.getValue()
  		
  		this.selectedTabList = this.tabList[index]
  		var t = this.selectedTabList
  		if(t) {
	  		editor.setValue(t.content)
	  		editor.getSession().setMode("ace/mode/"+t.mode)
	  		console.log(this.selectedTabList.content)
  		}
  	}
  },
  
  mounted: function() {
  	var width = $("#buttonDiv").width()
	var screenSize = $(document).width()
	this.width = screenSize-width;
	// $("#tabList").css("left", width).css("width", (screenSize-width)+"px")
	
	console.log(width)
	if(this.selectedTabList == null && this.tabList.length) {
		this.selectTab(0)
	}
  }
})

var newFileModal = new Vue({
	el:"#newModal",
	data:{
		model:Object,
		fileNameData:"",
		type:"file"
	},
	methods:{
		setModel:function(model) {
			this.model = model
		},
		modal:function() {
			$("#newModal").modal('toggle')
		},
		getPath:function() {
			path = this.model.path
			if(path === undefined)
				path = ""
				
			return path+'/'+this.model.name+"/"
		},
		saveNewFile:function() {
			var v = this.fileNameData;
			var type = this.type
			
			var isDup = fileStructureTree.addNewFile(v, type, this.model)
			if(!isDup) {
				this.modal()
				this.fileNameData = ""
			} else {
				
			}
			// tabList.newTab(v, "", "html")
		},
		close:function() {
			this.modal()
		}
	}
})

// https://ace.c9.io/#nav=howto
// https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
// https://getbootstrap.com/docs/3.3/css/#forms
// https://purecss.io/buttons/

var buttonDiv = new Vue({
	el:"#buttonDiv",
	methods:{
		runFiles:function() {
			var t = tabList.selectedTabList
			console.log(t.name, t.content, t.mode)
		},
		saveFiles:function() {
			// var t = tabList.selectedTabList
			// console.log(t.name, t.content, t.mode)
			SaveFiles()
		},
		newTab:function() {
			$('#newModal').modal()
			// var t = tabList.selectedTabList
			// tabList.newTab()
			// console.log(t.name, t.content, t.mode)
		},
		changeSetting:function() {
			$("#settingModal").modal()
		}
	}
})

Vue.component('filetree', {
  template: '#fileTree-template',
  props: {
    model: Object
  },
  data: function () {
    return {
      open: false,
      isHover:false
    }
  },
  computed: {
  	isDirectory:function() {
  		return this.model.type == "directory"
  	}, path:function() {
  		
  	}
  },
  methods: {
  	toggle: function () {
      if (this.isDirectory) {
        this.open = !this.open
      } else {
      	tabList.newTab(this.model.name, this.model)
      }
    }, mouseOver:function() {
    	this.isHover = !this.hover
    },
    newThing:function(model) {
		newFileModal.setModel(model)
		newFileModal.modal()
	}
  }
})

var fileStructureTree = new Vue({
	el:"#fileStructureTree",
	data:{
		files:{
			name:"/",
			type:"directory",
			children:[
				{name:"test", type:"file", content:"<hi></hi>", mode:"html"},
				{name:"test folder", type:"directory", children:[]}
			]
		}
	},
	methods:{
		addNewFile:function(name, type, model) {
			console.log(name, model)
			var d = {
				name:name,
				type:type,
			}
			var dup = false
			
			if(type == "directory") {
				d["children"] = []
			} else {
				// need to parse mode
				d["mode"] = "html"
				d["content"] = ""
			}
			
			for(var i in model.children) {
				if(model.children[i].name == name) {
					dup = true
					break;
				}
			}
			
			if(!dup) {
				model.children.push(d)
			}
			
			return dup;
		}
	},
	mounted:function() {
		var checkParent = function(self, path) {
			if(path === undefined)
				path = [""]
			
			var p;
			for(var i in self.children) {
				self.children[i].parent = self
				
				p = path.concat([self.children[i].name])
				self.children[i].path = p
				checkParent(self.children[i], p)
			}
			console.log(self, self.name, self.path)
		}
		
		this.files.path = [""]
		checkParent(this.files)
		
	}
})


var settingModal = new Vue({
	el:"#settingModal",
	data:{
		setting:settingData
	}, methods: {
		toggle:function(model) {
			if(model.type == "bool") {
				model.value = !model.value
			}
		}
	}
})

function initView() {
	LoadFiles()
}

$(document).ready(initView)
})()
