$redis = Redis.new url: ENV['REDIS_URL']
HTTParty::HTTPCache.redis = $redis
