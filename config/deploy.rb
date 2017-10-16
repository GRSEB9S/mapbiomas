require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/npm'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
require 'mina/rvm'    # for rvm support. (http://rvm.io)
require 'mina/puma'

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :user, 'app'
set :domain, 'mapbiomas.org'
set :deploy_to, '/var/www/mapbiomas'
set :repository, 'git@github.com:ecostage/mapbiomas.git'
set :branch, 'master'

# For system-wide RVM install.
#   set :rvm_path, '/usr/local/rvm/bin/rvm'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_dirs, ['log', 'tmp/pids']
set :shared_files, ['config/puma.rb']

# Optional settings:
#   set :user, 'foobar'    # Username in the server to SSH to.
#   set :port, '30000'     # SSH port number.
#   set :forward_agent, true     # SSH forward_agent.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  command 'source ~/.bash_profile'
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .ruby-version or .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  # invoke :'rvm:use[ruby-1.9.3-p125@default]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  command %[mkdir -p "#{:deploy_to}/#{:shared_path}/log"]
  command %[chmod g+rx,u+rwx "#{:deploy_to}/#{:shared_path}/log"]

  command %[mkdir -p "#{:deploy_to}/#{:shared_path}/config"]
  command %[chmod g+rx,u+rwx "#{:deploy_to}/#{:shared_path}/config"]

  command %(mkdir -p "#{:deploy_to}/#{:shared_path}/tmp/sockets")
  command %(chmod g+rx,u+rwx "#{:deploy_to}/#{:shared_path}/tmp/sockets")
  command %(mkdir -p "#{:deploy_to}/#{:shared_path}/tmp/pids")
  command %(chmod g+rx,u+rwx "#{:deploy_to}/#{:shared_path}/tmp/pids")

  comamnd %(echo "#Add by Mina" >> ~/.bashrc)
  command %(echo 'while read p; do eval "export $p"; done < #{:deploy_to}/#{:shared_path}/config/env' >> ~/.bashrc)
  command %(echo 'APP_DEPLOY_PATH=#{:deploy_to}' >> #{:deploy_to}/#{:shared_path}/config/env)
  command %(echo 'APP_SHARED_PATH=#{:deploy_to}/#{:shared_path}' >> #{:deploy_to}/#{:shared_path}/config/env)
  command %(echo 'APP_PATH=#{:current_path}' >> #{:deploy_to}/#{:shared_path}/config/env)

  if repository
      repo_host = repository.split(%r{@|://}).last.split(%r{:|\/}).first
      repo_port = /:([0-9]+)/.match(repository) && /:([0-9]+)/.match(repository)[1] || '22'

      command %[
        if ! ssh-keygen -H  -F #{repo_host} &>/dev/null; then
          ssh-keyscan -t rsa -p #{repo_port} -H #{repo_host} >> ~/.ssh/known_hosts
        fi
      ]
  end
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  on :before_hook do
    # Put things to run locally before ssh
  end
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'npm:install'
    command %(npm install --only=dev)
    command %(npm run webpack -- --config webpack.production.js)
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    on :launch do
      command "mkdir -p #{:deploy_to}/#{:current_path}/tmp/"
      command "touch #{:deploy_to}/#{:current_path}/tmp/restart.txt"
      invoke :'puma:phased_restart'
    end
  end
end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers
