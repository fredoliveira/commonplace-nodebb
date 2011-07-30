require "./lib/init"

disable :logging
set :root, File.dirname(__FILE__) + "/../"

class Fragment
	include MongoMapper::Document
	
	key :title, String
	key :type, Integer
	key :content, String
	timestamps!
end

get "/" do
	@f = Fragment.all
	erb :index
end

get "/fragments" do
	content_type "application/json"
	@f = Fragment.all(:order => :created_at.desc).to_json
end