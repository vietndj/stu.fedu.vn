import json

with open("/Users/vietmac/Documents/CODE/tra-da-khao-sat-hoc-vien/data/submissions.json", "r") as f:
    submissions = json.load(f)

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "r") as f:
    students = json.load(f)

def get_sub(name):
    for s in submissions:
        if s.get("fullName") == name:
            return s
    return None

def update_survey(st, sub):
    st["post_course_survey"] = {
        "journeyStory": sub.get("journeyStory", ""),
        "feedbackAll": sub.get("feedbackAll", ""),
        "photos": sub.get("photos", [])
    }
    st["phone"] = sub.get("phone", st.get("phone"))
    st["email"] = sub.get("email", st.get("email"))

# 1. Lưu Tuấn Minh (Create new)
ltm = get_sub("Lưu Tuấn Minh")
if ltm:
    students.insert(0, {
        "id": "luu_tuan_minh_offline",
        "name": ltm["fullName"],
        "class": ltm["course"],
        "industry": "Khác",
        "industry_slug": "other",
        "phone": ltm["phone"],
        "email": ltm["email"],
        "facebook_url": ltm.get("channelLink"),
        "reference_channels": [],
        "completeness_score": 60,
        "health_status": "healthy",
        "notes": f"[Tạo tự động từ Form Trà Đá]\nMảng KD: {ltm.get('profession', '')}",
        "post_course_survey": {
            "journeyStory": ltm.get("journeyStory", ""),
            "feedbackAll": ltm.get("feedbackAll", ""),
            "photos": ltm.get("photos", [])
        }
    })
    print("Created Lưu Tuấn Minh")

# 2. Tâng Xinh (Merge)
tx = get_sub("Tâng Xinh")
for st in students:
    if st.get("id") == "tang_xinh_chi_yen":
        update_survey(st, tx)
        print("Updated Tâng Xinh")
        break

# 3. Đặng Huyền Trang (Merge)
dht = get_sub("Đặng Huyền Trang")
for st in students:
    if st.get("id") == "trang_ang":
        update_survey(st, dht)
        print("Updated Đặng Huyền Trang")
        break

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "w") as f:
    json.dump(students, f, indent=2, ensure_ascii=False)
