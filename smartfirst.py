from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


client = MongoClient("mongodb+srv://santhosh2k01:san2001@cluster0.qksjljg.mongodb.net/?retryWrites=true&w=majority")
db = client["smart"]  
collection = db["first"] 


#get user
@app.route('/api/getstudents', methods=["GET"])
def get_user():
    users_list = []
    for user in collection.find({}):
        user["_id"] = str(user["_id"]) 
        user.pop("_id",None)
 
        users_list.append(user)
    return jsonify(users_list)

@app.route('/api/dstudents/<userid>', methods=["DELETE"])
def deleteone_user(userid):
    existing_user = collection.find_one({"id": userid})  
    if not existing_user:
        return jsonify({"message": "User not found"}), 404
    
    user = collection.delete_one({"id": userid})  

    if user.deleted_count > 0:
        return jsonify({"msg": "Successfully deleted"}), 200
    else:
        return jsonify({"message": "Deletion failed"}), 400


#update user
@app.route('/api/ustudents/<userid>', methods=["PUT"])
def update_user(userid):
    user_data = request.get_json() 

    existing_user = collection.find_one({"id": userid})  
    if not existing_user:
        return jsonify({"message": "User not found"})

    updated_user = collection.update_one(
        {"id": userid},      
        {"$set": user_data}  
    )
    if updated_user.matched_count > 0:
        return jsonify({"mssg": "User updated successfully"})
    else:
        return jsonify({"error": "Failed to update user"})



if __name__ == '__main__':
    app.run(debug=True)
