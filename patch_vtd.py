import json

with open("/Users/vietmac/Documents/CODE/tra-da-khao-sat-hoc-vien/data/submissions.json", "r") as f:
    submissions = json.load(f)

vtd_submission = None
for s in submissions:
    if s.get("fullName") == "Viên Thế Đức":
        vtd_submission = s
        break

if not vtd_submission:
    print("Cannot find Viên Thế Đức in submissions")
    exit(1)

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "r") as f:
    students = json.load(f)

found = False
for student in students:
    if student.get("id") == "vien_the_duc_offline2":
        student["phone"] = vtd_submission["phone"]
        
        # We can add a survey_feedback field
        student["post_course_survey"] = {
            "journeyStory": vtd_submission["journeyStory"],
            "feedbackAll": vtd_submission["feedbackAll"],
            "photos": vtd_submission.get("photos", [])
        }
        
        # update reference_channels if new
        existing_urls = [ch["url"] for ch in student.get("reference_channels", [])]
        link = vtd_submission.get("channelLink", "")
        if link and link not in existing_urls:
            # wait, it might be the same link but with different params
            if "tiktok" in link:
                student["reference_channels"].append({"name": "TikTok Form Gửi", "url": link, "platform": "tiktok"})
        
        # user said update "link facebook, feedback", but vtd didn't provide facebook.
        # we just update what is in the form.
        found = True
        break

if found:
    with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "w") as f:
        json.dump(students, f, indent=2, ensure_ascii=False)
    print("Updated Viên Thế Đức in stu.fedu.vn")
else:
    print("Cannot find vien_the_duc_offline2 in students.json")
