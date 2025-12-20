'use strict';
'require rpc';
'require baseclass';

return baseclass.extend({
	// RPC declarations
	callStatus: rpc.declare({
		object: 'system-hub',
		method: 'status',
		expect: { }
	}),

	callGetComponents: rpc.declare({
		object: 'system-hub',
		method: 'components',
		expect: { components: [] }
	}),

	callGetHealth: rpc.declare({
		object: 'system-hub',
		method: 'health',
		expect: { }
	}),

	callGetRemote: rpc.declare({
		object: 'system-hub',
		method: 'remote',
		expect: { }
	}),

	callGetLogs: rpc.declare({
		object: 'system-hub',
		method: 'logs',
		params: [ 'limit', 'source', 'level' ],
		expect: { logs: [] }
	}),

	callGetSchedules: rpc.declare({
		object: 'system-hub',
		method: 'schedules',
		expect: { schedules: [] }
	}),

	callCollectDiagnostics: rpc.declare({
		object: 'system-hub',
		method: 'collect_diagnostics',
		params: [ 'include_logs', 'include_config', 'include_network', 'anonymize' ],
		expect: { success: false }
	}),

	callGenerateReport: rpc.declare({
		object: 'system-hub',
		method: 'generate_report',
		expect: { success: false }
	}),

	callStartRemoteSession: rpc.declare({
		object: 'system-hub',
		method: 'start_remote_session',
		params: [ 'type' ],
		expect: { success: false }
	}),

	callManageComponent: rpc.declare({
		object: 'system-hub',
		method: 'manage_component',
		params: [ 'component', 'action' ],
		expect: { success: false }
	}),

	callUploadDiagnostic: rpc.declare({
		object: 'system-hub',
		method: 'upload_diagnostic',
		params: [ 'file' ],
		expect: { success: false }
	}),

	// Helper methods
	getAllData: function() {
		return Promise.all([
			this.callStatus(),
			this.callGetComponents(),
			this.callGetHealth()
		]).then(function(results) {
			return {
				status: results[0],
				components: results[1].components || [],
				health: results[2]
			};
		});
	},

	getComponentIcon: function(icon) {
		var icons = {
			'shield': '🛡️',
			'activity': '📊',
			'search': '🔍',
			'lock': '🔒',
			'layers': '🔀',
			'users': '👥',
			'shield-off': '🚫',
			'database': '📈',
			'bar-chart-2': '📉',
			'globe': '🌐',
			'home': '🏠',
			'trending-up': '📶'
		};
		return icons[icon] || '📦';
	},

	getCategoryInfo: function(category) {
		var categories = {
			'security': { name: 'Sécurité', color: '#22c55e' },
			'monitoring': { name: 'Monitoring', color: '#3b82f6' },
			'network': { name: 'Réseau', color: '#8b5cf6' },
			'vpn': { name: 'VPN', color: '#ef4444' },
			'automation': { name: 'Automation', color: '#f59e0b' }
		};
		return categories[category] || { name: category, color: '#6b7280' };
	},

	getHealthStatus: function(score) {
		if (score >= 80) return { status: 'healthy', label: 'Système Sain', color: '#22c55e' };
		if (score >= 50) return { status: 'warning', label: 'Attention Requise', color: '#f59e0b' };
		return { status: 'critical', label: 'Critique', color: '#ef4444' };
	},

	getMetricStatus: function(value, warning, critical) {
		if (value >= critical) return 'critical';
		if (value >= warning) return 'warning';
		return 'ok';
	},

	formatBytes: function(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024;
		var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		var i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	},

	formatUptime: function(seconds) {
		var days = Math.floor(seconds / 86400);
		var hours = Math.floor((seconds % 86400) / 3600);
		var minutes = Math.floor((seconds % 3600) / 60);
		
		var parts = [];
		if (days > 0) parts.push(days + 'j');
		if (hours > 0) parts.push(hours + 'h');
		if (minutes > 0) parts.push(minutes + 'm');
		
		return parts.join(' ') || '< 1m';
	},

	formatDate: function(dateStr) {
		if (!dateStr) return 'N/A';
		var date = new Date(dateStr);
		return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}
});
