Dir['./lib/isolate*/lib'].each do |dir|
  $: << dir
end

require "rubygems"
require "isolate/now"
require "sinatra"
require "json"
require "mongo_mapper"
require "erb"

MongoMapper.database = 'commonplace'