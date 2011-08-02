class Fragment
	include MongoMapper::Document

	key :type, Integer
	key :content, String
	
	timestamps!
end