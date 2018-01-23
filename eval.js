exports.go = function(g){
	g.loadJSFile = function(f,m){
		return loadFile(f+".js",m);
	};
	g.loadFile = function(f,m){
		return require("fs").readFileSync((!m?__dirname+"/":"")+f).toString();
	};
	g.evalJS = function(f,m){
		return Function("return "+loadJSFile(f,m))();
		return eval.apply(g,[loadJSFile(f,m)]);
	};
	g.saveFile = function(f,d,m,efn){
		require('fs').writeFile((!m?__dirname+"/":"")+f,d,(efn?efn:x=>{}));
	};
};
