import json

with open("/Users/vietmac/Documents/CODE/tra-da-khao-sat-hoc-vien/data/submissions.json", "r") as f:
    submissions = json.load(f)

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "r") as f:
    students = json.load(f)

for s in submissions:
    full_name = s.get("fullName", "").strip().lower()
    for student in students:
        if student.get("name", "").strip().lower() == full_name:
            if s.get("phone"):
                student["phone"] = s.get("phone")
            
            student["post_course_survey"] = {
                "journeyStory": s.get("journeyStory"),
                "feedbackAll": s.get("feedbackAll"),
                "photos": s.get("photos", [])
            }
            
            link = s.get("channelLink", "")
            if link and link != "Chưa gửi link":
                existing_urls = [ch["url"] for ch in student.get("reference_channels", [])]
                if link not in existing_urls:
                    if "facebook" in link:
                        student["facebook_url"] = link
                    else:
                        student.setdefault("reference_channels", []).append({"name": "Kênh Gửi Từ Form", "url": link, "platform": "other"})
            print(f"Updated {full_name}")

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "w") as f:
    json.dump(students, f, indent=2, ensure_ascii=False)
