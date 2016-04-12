shared_path = ENV['APP_SHARED_PATH']

preload_app!
workers 2
threads 1, 6
environment ENV['RAILS_ENV'] || "production"

if ENV["HEROKU"]
  rackup DefaultRackup
  port ENV['PORT'] || 3000
else
  bind "unix://#{shared_path}/tmp/sockets/puma.sock"
  stdout_redirect "#{shared_path}/log/puma.stdout.log", "#{shared_path}/log/puma.stderr.log", true
  pidfile "#{shared_path}/tmp/pids/puma.pid"
  state_path "#{shared_path}/tmp/sockets/puma.state"
  activate_control_app
end

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
