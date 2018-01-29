exports.go = g => {
	var fs = require('fs');
	g.sys = {
		type: {
			tm: function(t){
				var r = 0, e = t.split(" "), n = arguments;
				if (e.length != n.length - 1) return !1;
				for (var o = 0; o < e.length; o++)
					(function(t){
						for (var r = 0, e = arguments, n = 1; n < e.length; n++)
							for (var o = 0; o < t.length; o++)
								t.charAt(o).toLowerCase() == Object.prototype.toString.call(e[n]).replace(/\[object (.+)\]/, "$1").charAt().toLowerCase() && r++;
							return r > 0;
					})(e[o], n[o + 1]) && r++;
					return r >= n.length - 1;
			},
			atm: (t, arr) => sys.type.tm.apply(this, [t].concat(arr))
		},
		io: {
			writeText: (f, d, m, efn) => {
				return fs.writeFile((!m ? __dirname + "/" : "") + f, d, (efn ? efn: x => 1));
			},
			readText: (f, m) => {
				return fs.readFileSync((!m ? __dirname + "/" : "") + f).toString();
			},
			dir: {
				eachFile: (f, fn, efn, m) => {
					var dir = !m ? __dirname + "/" + f : f;
					fs.readdir(dir, (e, a) => {
						if (e < 1)
							for (var i = 0; i < a.length; i++)
								fn(dir + "/" + a[i], i);
						else efn ? efn(e) : 0;
					});
				}
			}
		},
		text: {
			inside: (z, x, y) => {
				return z.slice(z.indexOf(x) + x.length, z.lastIndexOf(y));
			}
		}
	};
	g.exec = function(scr, r){
		return Function((r ? "return " : "") + scr)();
	};
	g.get = function(f, m){
		return exec(sys.io.readJS(f, m), 1);
	};
};
