$(document).ready(function() {
	
	window.Fragment = Backbone.Model.extend({
		//idAttribute: "_id"
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
			"click .handle": "clear"
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
		
		clear: function() {
			console.log(this.model.get('id'));
			console.log(this.model.isNew());
			this.model.destroy();
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
			$('#timeline').prepend(view.render().el);
		},
		
		addAll: function() {
			Fragments.each(this.addOne)
		}
	});
	
	window.FragmentForm = Backbone.View.extend({
		el: $('#new'),
		
		events: {
			"keypress #new-fragment": "createOnEnter"
		},
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.input = this.$('#new-fragment');
		},
		
		render: function() {
			return this;
		},
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			Fragments.create(this.newAttributes());
			this.input.val('');
		},
		
		newAttributes: function() {
			return {
				content: this.input.val()
			};
		}
	});
	
	/* grab our fragments from the server */
	window.Fragments = new FragmentList;

	/* init our views */
	window.timeline = new Timeline;
	window.fragmentForm = new FragmentForm;

	Fragments.fetch();		
});