import json

with open("students.json", "r") as f:
    students = json.load(f)

# Find both profiles
old_trang = None
new_trang = None

for i, s in enumerate(students):
    if s.get("id") == "truong_thuy_trang_offline":
        new_trang = s
    elif s.get("name") == "Trang Trương" and s.get("class") == "Offline 3":
        old_trang = s

if old_trang and new_trang:
    # Merge new data into old
    old_trang["phone"] = new_trang.get("phone")
    old_trang["email"] = new_trang.get("email", "trangtruonghealingcoach@gmail.com")
    old_trang["facebook_url"] = new_trang.get("facebook_url")
    old_trang["post_course_survey"] = new_trang.get("post_course_survey")
    old_trang["industry"] = new_trang.get("industry")
    
    # Remove duplicate
    students = [s for s in students if s.get("id") != "truong_thuy_trang_offline"]
    
    with open("students.json", "w") as f:
        json.dump(students, f, indent=2, ensure_ascii=False)
    print("Merged successfully")
else:
    print("Could not find both profiles")
