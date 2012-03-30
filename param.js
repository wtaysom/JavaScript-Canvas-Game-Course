;(function(global) {
	param.index = {};
	param.containerId = 'param-container';
	global.param = param;
	
	function param(id, initial, min, max) {
		var slider = param.index[id]
		if (!slider) {
			var current = initial;
			
			var container = document.getElementById(param.containerId);
			var div = document.createElement('div');
			div.innerHTML = '<div id="param-'+id+
				'" class="dragdealer rounded-cornered">'+
				'<div class="red-bar handle">'+id+'</div></div>'
			container.appendChild(div);
			
			if (initial === undefined) {
				initial = 0;
			}
			var order = Math.floor(log10(Math.max(1, Math.abs(initial))));
			var limit = Math.pow(10, order + 1);
			if (min === undefined) {
				min = -limit;
			}
			if (max === undefined) {
				max = limit;
			}
			var value = (initial - min) / (max - min);
			console.log(value);
			
			slider = new Dragdealer('param-'+id, {
				x: value,
				animationCallback: function(x) {
					this.currentX = x;
				}
			});
			slider.getCurrent = function() {
				return slider.currentX * (max - min) + min;
			}
			param.index[id] = slider;
		}
		
		return slider.getCurrent();
	}
	
	function log10(x) {
		return Math.log(x) / Math.LN10;
	}
})(this);