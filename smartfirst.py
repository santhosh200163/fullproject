from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://santhosh2k01:san2001@cluster0.qksjljg.mongodb.net/?retryWrites=true&w=majority")
db = client["smart"]
collection = db["first"]


@app.route('/api/getstudents', methods=["GET"])
def get_students():
    students_list = []
    for student in collection.find({}):
        #student["_id"] = str(student["_id"])  
        student.pop("_id", None)
        students_list.append(student)
    return jsonify(students_list)


@app.route('/api/adstudents', methods=["POST"])
def add_student():
    try:
        new_student = request.get_json()
        result = collection.insert_one(new_student)

        if result.inserted_id:
         
            new_student["_id"] = str(result.inserted_id) 
            return jsonify(new_student), 201
        else:
            return jsonify({"message": "Failed to add student"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete 
@app.route('/api/dstudents/<userid>', methods=["DELETE"])
def delete_student(userid):
    existing_student = collection.find_one({"id": userid})
    if not existing_student:
        return jsonify({"message": "Student not found"}), 404
    
    result = collection.delete_one({"id": userid})

    if result.deleted_count > 0:
        return jsonify({"msg": "Successfully deleted"}), 200
    else:
        return jsonify({"message": "Deletion failed"}), 400

# Update 
@app.route('/api/ustudents/<userid>', methods=["PUT"])
def update_student(userid):
    student_data = request.get_json()

    existing_student = collection.find_one({"id": userid})
    if not existing_student:
        return jsonify({"message": "Student not found"})

    updated_student = collection.update_one(
        {"id": userid},
        {"$set": student_data}
    )
    if updated_student.matched_count > 0:
        return jsonify({"msg": "Student updated successfully"})
    else:
        return jsonify({"error": "Failed to update student"})

if __name__ == '__main__':
    app.run(debug=True)
