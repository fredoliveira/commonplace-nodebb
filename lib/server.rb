require "./lib/init"
require "./lib/commonplace"

disable :logging
set :root, File.dirname(__FILE__) + "/../"

get "/" do
	@f = Fragment.all
	erb :index
end

get "/fragments" do
	content_type "application/json"
	@f = Fragment.all(:order => :created_at.asc).to_json
end

post "/fragments" do 
	content_type "application/json"
	
	# parse the body
	input = JSON.parse(request.body.read)
	
	# FIXME this isn't being validated yet
	fragment = Fragment.new 
	fragment.content = input['content']
	fragment.title = input['title']
	fragment.type = input['type']
	fragment.save
	
	# render the final fragment, from mongo
	fragment.merge.to_json
end

delete "/fragments/:id" do
	Fragment.destroy(params[:id])
	""
end