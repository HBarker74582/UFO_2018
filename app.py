from flask import Flask, render_template, redirect, jsonify, request
import os
import requests
import json
import time

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
from flask_pymongo import pymongo
import pandas as pd
import starter

# Create an instance of our Flask app.
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
mongo = client.UFO

# DATABASE CONNECTION-MONGO DB
# conn = "mongodb://localhost:27017"
# client = pymongo.MongoClient(conn)
# mongo = client.UFO

@app.before_first_request
def import_csvfile():
    starter
    return ("success")

@app.route("/")
def index():
    # write a statement that finds all the items in the db and sets it to a variable


# render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html")

    # Redirect back to home page
    return redirect("/")





@app.route("/alien_data")
def data():
    alien_collection = mongo.db.alien_data.find({}).limit(3251)
    alien_data_json = []
    for json in alien_collection:
        alien_data_dict = {}
        alien_data_dict.update({
            "state_long": json["state_long"],
            "state_short": json["state_short"],
            "city_state": json["city_state"],
            "mj_legal": json["mj_legal"],
            "lat": json["lat"],
            "long" : json["long"],
            "sighting_date" : json["sighting_date"]

        })

        alien_data_json.append(alien_data_dict)

    return jsonify(alien_data_json)

time.sleep(1)

@app.route("/military")
def military():
    military_basescollection = mongo.db.military_bases.find({}).limit(700)
    military_bases_json = []
    for json in military_basescollection:
        military_bases_dict = {}
        military_bases_dict.update({
            "state_long": json["state_long"],
            "state_short": json["state_short"],
            "mil_base_name" : json["mil_base_name" ],
            "component" : json["component"],
            "lat": json["lat"],
            "long" : json["long"],
            "country": json["country"]
        })
        military_bases_json.append(military_bases_dict)
    return jsonify(military_bases_json)



@app.route("/sightings")
def sightings():
    sightings_collection = mongo.db.sightings_count.find({})
    sightings_json = []
    for json in sightings_collection:
        sightings_dict = {}
        sightings_dict.update({
            "state_long": json["state_long"],
            "state_short": json["state_short"],
            "sightings_total" : json["sightings_total"],
            "Jan" : json["Jan"],
            "Feb" : json["Feb"],
            "Mar" : json["Mar"],
            "Apr" : json["Apr"],
            "May" : json["May"],
            "Jun" : json["Jun"],
            "Jul" : json["Jul"],
            "Aug" : json["Aug"],
            "Sep" : json["Sep"],
            "Oct" : json["Oct"],
            "Nov" : json["Nov"],
            "Dec" : json["Dec"],
        })
        sightings_json.append(sightings_dict)
    return jsonify(sightings_json)

time.sleep(1)

@app.route("/word_cloudusatotals")
def word():
    word_collection = mongo.db.word_cloud_usatotals.find({})
    word_json = []
    for json in word_collection:
        word_dict = {}
        word_dict.update({
            "word": json["word"],
            "count": json["count"] })
        word_json.append(word_dict)
    return jsonify(word_json)

time.sleep(1)
@app.route("/mapping_data")
def data_new():


    # Select columns 'state_long'  and 'mj_legal' from 'alien_data' collection where 'state_long' not equal to ""
    # adding _id:0 to remove _id from the dataframe.Then removing duplicates from dataframe.
    mj_legal_df = pd.DataFrame(list(mongo.db.alien_data.find( { "state_long": { "$ne": "" } }, { "_id":0, "state_long": 1, "mj_legal": 1 } )))
    mj_legal_df_unique = mj_legal_df.drop_duplicates()

    # Select columns 'state_long' and 'operational_status' from 'military_bases' collection where 'state_long' not equal to "" and 'operational_status' is equal to active.
    # adding _id:0 to remove _id from the dataframe. Do groupby based on column 'state_long' and take count.
    miltary_bases_df = pd.DataFrame(list(mongo.db.military_bases.find( { "state_long": { "$ne": "" }, "operational_status": "Active" },{ "_id":0, "state_long": 1, "operational_status": 1 } )))
    miltary_bases_count = miltary_bases_df.groupby("state_long").count()

    # sightings_count_df = pd.DataFrame(list(mongo.db.sightings_count.find( { "state_long": { "$ne": "USA" } }, { "_id":0, "state_long": 1, "sightings_total": 1 } )))
    # Select columns 'state_long', 'state_short' and 'sighings_total' from 'sightings_count' collection where 'state_long' not equal to 'USA'
    sightings_count_df = pd.DataFrame(list(mongo.db.sightings_count.find( { "state_long": { "$ne": "USA" } }, { "_id":0, "state_long": 1, "state_short":1, "sightings_total": 1 } )))
    # combining dataframes 'miltary_bases_count' and 'sightings_count_df'
    combined_1_df = pd.merge(miltary_bases_count,sightings_count_df, on='state_long')
    # combining dataframe 'combined_1_df' and 'mj_legal_df_unique'
    combined_df = pd.merge(combined_1_df,mj_legal_df_unique, on='state_long')
    #print(combined_df)
    #print(type(combined_df))
    # converting dataframe to json(but it was in string format)
    combined_df_json = combined_df.to_json(orient='records')
    #print(combined_df_json)
    #print(type(combined_df_json))
    # string to json
    combined_df_json_final = json.loads(combined_df_json)
    #print(combined_df_json_final)

    return jsonify(combined_df_json_final)

if __name__ == "__main__":
    app.run(debug=True)



