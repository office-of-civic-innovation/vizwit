var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	BaseChart = require('./basechart'),
	numberFormatter = require('../util/number-formatter');
	
var trimLastCharacter = function(str) {
	return str.substr(0, str.length - 1);
};
	
module.exports = BaseChart.extend({
	settings: {
		collectionOrder: 'label',
		graphs: [
			{
				title: 'Data',
				valueField: 'count',
				fillAlphas: 1,
				clustered: false,
				lineColor: '#97bbcd',
				balloonText: '<b>[[category]]</b><br>Total: [[value]]'
			},
			{
				title: 'Filtered Data',
				valueField: 'filteredCount',
				fillAlphas: 0.8,
				clustered: false,
				lineColor: '#97bbcd',
				balloonText: '<b>[[category]]</b><br>Filtered Amount: [[value]]'
			}
		],
		chart: {
			'type': 'serial',
			theme: 'light',
			categoryField: 'label',
			valueAxes: [{
				labelFunction: numberFormatter
			}],
			categoryAxis: {
				autoWrap: true,
				parseDates: true,
				minPeriod: 'MM'
			},
			dataDateFormat: 'YYYY-MM-DDT00:00:00.000', //"2015-04-07T16:21:00.000"
			chartCursor: {
				categoryBalloonDateFormat: "MMM YYYY",
				cursorPosition: "mouse",
				selectWithoutZooming: true
			}
		}
	},
	initialize: function() {
		BaseChart.prototype.initialize.apply(this, arguments);
		
		_.bindAll(this, 'onClick');
	},
	render: function() {
		BaseChart.prototype.render.apply(this, arguments);
		
		// Listen to when the user selects a range
		this.chart.chartCursor.addListener('selected', this.onClick);
	},
	// When the user clicks on a bar in this chart
	onClick: function(e) {
		console.log('Filtered by', (new Date(e.start)).toISOString(), (new Date(e.end)).toISOString());
		var field = this.collection.triggerField,
			start = trimLastCharacter((new Date(e.start)).toISOString()),
			end = trimLastCharacter((new Date(e.end)).toISOString());
		
		
		// Trigger the global event handler with this filter
		this.vent.trigger('filter', field, field + ' >= \'' + start + '\' and ' + field + ' <= \'' + end + '\'');
	}
})