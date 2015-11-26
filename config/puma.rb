shared_path = ENV['APP_SHARED_PATH']
workers 2

# Min and Max threads per worker
threads 1, 6

# Default to production
environment = ENV['RAILS_ENV'] || "production"

# Set up socket location
bind "unix://#{shared_path}/tmp/sockets/puma.sock"

# Logging
stdout_redirect "#{shared_path}/log/puma.stdout.log", "#{shared_path}/log/puma.stderr.log", true

# Set master PID and state locations
pidfile "#{shared_path}/tmp/pids/puma.pid"
state_path "#{shared_path}/tmp/sockets/puma.state"
activate_control_app

on_worker_boot do
  # Worker specific setup for Rails 4.1+
  # See: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server#on-worker-boot
  ActiveRecord::Base.establish_connection
end
