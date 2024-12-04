from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb+srv://santhosh2k01:san2001@cluster0.qksjljg.mongodb.net/?retryWrites=true&w=majority")
db = client["smartail"]  
collection = db["firstproject"] 

@app.route('/')
def home():
    return "Welcome to Python"

#adduser
@app.route('/add_user', methods=["POST"])
def add_user():
    new_user = request.get_json()
    
    if collection.find_one({"id": new_user["id"]}):
        return jsonify("User with id already exists")
    
    result = collection.insert_one(new_user)
    result.pop("_id",None)
    return jsonify("User added successfully")


#getone user
@app.route('/get_user', methods=["GET"])
def get_user():
    users_list = []
    for user in collection.find({}):
        user["_id"] = str(user["_id"]) 
        user.pop("_id",None)
 
        users_list.append(user)
    return jsonify(users_list)


#get users
@app.route('/getone_user/<userid>', methods=["GET"])
def getone_user(userid):

    user = collection.find_one({"id": userid})
    if user:
        user.pop("_id",None)
        return jsonify(user)  
    else:
        return {"msg":"User not found"}
    

#delete operations
@app.route('/deleteone_user/<userid>', methods=["DELETE"])
def deleteone_user(userid):
    
    existing_user = collection.find_one({"id": userid})
    if not existing_user:
        return jsonify({"message": "User not found"})
    
    user = collection.delete_one({"id": userid})

    if user.deleted_count > 0:
         return jsonify({"msg": "Successfully deleted"}), 200
    else:
        return jsonify({"message": "Deletion failed"}), 400
    

#delete  many     
@app.route('/deleteall_user/<userid>',methods=["DELETE"])
def deleteall_user(userid):        
         user=collection.delete_many({"id":userid})
         return jsonify(user,"delete sucessfully:")
        

 #update opertaion   
@app.route('/update_user/<userid>', methods=["PUT"])
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
