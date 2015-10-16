source 'https://rubygems.org'
ruby '2.2.2'

gem 'rails', '4.2.3'
gem 'pg'
gem 'sass-rails', '~> 5.0'
gem 'bourbon'
gem 'neat'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'jquery-rails'
gem 'bitters'
gem 'sprockets', '>= 3.0.0'
gem 'sprockets-es6'
gem 'react-rails'
gem "underscore-rails"
gem "leaflet-rails"
gem 'jbuilder', '~> 2.0'
gem 'sdoc', '~> 0.4.0', group: :doc
gem 'rack-timeout'

group :production do
  gem 'newrelic_rpm'
end

group :staging, :production do
  gem 'puma'
  gem 'rails_12factor'
end

group :development, :test do
  gem 'rubocop', require: false
  gem 'pry'
  gem 'letter_opener'
  gem 'awesome_print'
  gem 'dotenv-rails'
  gem 'factory_girl_rails'
  gem 'shoulda-matchers'
  gem 'database_cleaner'
  gem 'byebug'
  gem 'web-console', '~> 2.0'
  gem 'rspec-rails'
  gem 'capybara'
  gem 'poltergeist'
  gem 'simplecov'
end
