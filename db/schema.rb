# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180809131818) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "faqs", force: :cascade do |t|
    t.string   "question",                     null: false
    t.text     "answer",                       null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "locale",     default: "pt-br", null: false
    t.integer  "ordination",                   null: false
  end

  create_table "glossaries", force: :cascade do |t|
    t.string   "word",                         null: false
    t.text     "definition",                   null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "locale",     default: "pt-BR", null: false
  end

  create_table "maps", force: :cascade do |t|
    t.string  "name",                 null: false
    t.json    "options", default: {}, null: false
    t.integer "user_id"
  end

  create_table "settings", force: :cascade do |t|
    t.string   "var",                   null: false
    t.text     "value"
    t.integer  "thing_id"
    t.string   "thing_type", limit: 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "settings", ["thing_type", "thing_id", "var"], name: "index_settings_on_thing_type_and_thing_id_and_var", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                         default: "", null: false
    t.string   "encrypted_password",            default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                 default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.string   "name",                          default: "", null: false
    t.string   "institution"
    t.string   "occupation"
    t.integer  "occupation_area"
    t.text     "project_description"
    t.integer  "biomes_and_transversal_themes", default: [],              array: true
    t.string   "linkedin_url"
    t.string   "facebook_url"
    t.string   "lattes_url"
    t.string   "phone"
    t.string   "city"
    t.string   "state"
    t.boolean  "receive_newsletter"
    t.boolean  "participate_in_groups"
    t.integer  "role",                          default: 0,  null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
