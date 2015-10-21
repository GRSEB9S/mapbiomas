redis = Redis.new
HTTParty::HTTPCache.redis = redis
