class Fragment
	include MongoMapper::Document
	key :title, String
	key :type, Integer
	key :content, String
	key :url, String
	timestamps!
end