import json

with open("/Users/vietmac/Documents/CODE/tra-da-khao-sat-hoc-vien/data/submissions.json", "r") as f:
    submissions = json.load(f)

# Find Trang
trang_sub = None
for s in submissions:
    if s.get("phone") == "0932325118":
        trang_sub = s
        break

if not trang_sub:
    print("Cannot find Trang in submissions")
else:
    with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "r") as f:
        students = json.load(f)
        
    # check if she exists
    found = False
    for st in students:
        if st.get("phone") == "0932325118":
            found = True
            break
            
    if not found:
        new_stu = {
            "id": "truong_thuy_trang_offline",
            "name": trang_sub.get("fullName"),
            "class": trang_sub.get("course"),
            "industry": "Tâm Lý Học / Coaching",
            "industry_slug": "psychology",
            "phone": trang_sub.get("phone"),
            "facebook_url": trang_sub.get("channelLink"),
            "reference_channels": [],
            "completeness_score": 60,
            "health_status": "healthy",
            "notes": f"[Tạo tự động từ Form Trà Đá]\nMảng KD: {trang_sub.get('profession')}",
            "post_course_survey": {
                "journeyStory": trang_sub.get("journeyStory"),
                "feedbackAll": trang_sub.get("feedbackAll"),
                "photos": trang_sub.get("photos", [])
            }
        }
        students.insert(0, new_stu)
        with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "w") as f:
            json.dump(students, f, indent=2, ensure_ascii=False)
        print("Added Trang to STU")
