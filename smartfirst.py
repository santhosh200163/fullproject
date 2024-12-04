from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb+srv://santhosh2k01:san2001@cluster0.qksjljg.mongodb.net/?retryWrites=true&w=majority")
db = client["smartail"]  
collection = db["firstproject"] 


#get user
@app.route('/api/students', methods=["GET"])
def get_user():
    users_list = []
    for user in collection.find({}):
        user["_id"] = str(user["_id"]) 
        user.pop("_id",None)
 
        users_list.append(user)
    return jsonify(users_list)




#delete operations
@app.route('/api/students/<userid>', methods=["DELETE"])
def deleteone_user(userid):
    
    existing_user = collection.find_one({"id": userid})
    if not existing_user:
        return jsonify({"message": "User not found"})
    
    user = collection.delete_one({"id": userid})

    if user.deleted_count > 0:
         return jsonify({"msg": "Successfully deleted"}), 200
    else:
        return jsonify({"message": "Deletion failed"}), 400
    


        

 #update opertaion   
@app.route('/api/students/<userid>', methods=["PUT"])
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
        return jsonify({"mssg":"User updated successfully"})
    else:
        return jsonify({"error":"Failed to update user"})



if __name__ == '__main__':
    app.run(debug=True)
