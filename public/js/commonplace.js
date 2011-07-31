function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
}

function parsetext(text) {
	/* convert urls */
	text = urlify(text); 
	/* and breaks into br */
	return text.replace(/\n/g, "<br />");
}

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
			"click .handle": "showTools",
			"click .delete": "clear"
		},
		
		initialize: function(options) {
			_.bindAll(this, 'render', 'remove');
			
			this.template = _.template($(options['template']).html());
			this.model.bind('change', this.render);
			this.model.bind('destroy', this.remove);
		},
		
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.$('abbr').timeago();
			return this;
		},
		
		showTools: function() {
			this.$('.tools').toggle();
		},
		
		clear: function() {
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
			"click .text": "showText",
			"click .image": "showImage",
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
			if (e.keyCode == 13 && e.shiftKey) {
				if(this.input.val() != '') {
					Fragments.create(this.newAttributes());
					this.input.val('');
				}
			} else {
				return;
			}
		},
		
		newAttributes: function() {
			return {
				content: this.input.val()
			};
		},
		
		showText: function() {
			this.$('#new-image').hide();
			this.$('#new-fragment').show();
			this.$('.text').addClass('current');
			this.$('.text').removeClass('current');
		},
		
		showImage: function() {
			this.$('#new-fragment').hide();
			this.$('#new-image').show();
			this.$('.image').removeClass('current');
		}
	});
	
	/* grab our fragments from the server */
	window.Fragments = new FragmentList;

	/* init our views */
	window.timeline = new Timeline;
	window.fragmentForm = new FragmentForm;

	Fragments.fetch();	

	$('textarea#new-fragment').autoResize({extraSpace : 60});
});