$(document).ready(function() {
	
	window.Fragment = Backbone.Model.extend({
		
	});
	
	window.FragmentList = Backbone.Collection.extend({
		model: Fragment,
		url: 'fragments'
	});
	
	/* 
		Generic FragmentView
		====================
		Should be passed a template parameter to know what to render. Example:
		new FragmentView({model: fragment, template: "#fragment-sidebar"});
	*/
		
	window.FragmentView = Backbone.View.extend({
		className: 'fragment',
		
		events: {
			"click .handle": "test"
		},
		
		initialize: function(options) {
			_.bindAll(this, 'render', 'remove');
			
			this.template = _.template($(options['template']).html());
			this.model.bind('change', this.render);
			this.model.bind('destroy', this.remove);
		},
		
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		
		test: function() {
			console.log("poop");
		}
	});
	
	window.SidebarView = Backbone.View.extend({
		el: $('#sidebar'),
		
		initialize: function() {
			Fragments.bind('add', this.addOne, this);
			Fragments.bind('reset', this.addAll, this);
			Fragments.bind('all', this.render, this);
		},
		
		render: function() {
			return this;
		},
		
		addOne: function(fragment) {
			var view = new FragmentView({model: fragment, template: "#fragment-sidebar"});
			// FIXME, should use this.el
			$('#sidebar').append(view.render().el);
		},
		
		addAll: function() {
			Fragments.each(this.addOne)
		}
	});
	
	window.Timeline = Backbone.View.extend({
		el: $('#timeline'),
		
		initialize: function() {
			Fragments.bind('add', this.addOne, this);
			Fragments.bind('reset', this.addAll, this);
			Fragments.bind('all', this.render, this);
		},
		
		render: function() {
			return this;
		},
		
		addOne: function(fragment) {
			if (fragment.get('type') == 2) {
				var view = new FragmentView({model: fragment, template: "#fragment-image"});
			} else {
				var view = new FragmentView({model: fragment, template: "#fragment"});
			}
			// FIXME, should use this.el
			$('#timeline').append(view.render().el);
		},
		
		addAll: function() {
			Fragments.each(this.addOne)
		}
	});
	
	/* grab our fragments from the server */
	window.Fragments = new FragmentList;

	/* init our views */
	//window.sidebar = new SidebarView;
	window.timeline = new Timeline;

	Fragments.fetch();		
});