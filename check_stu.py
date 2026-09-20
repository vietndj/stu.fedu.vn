import json

with open("/Users/vietmac/Documents/CODE/tra-da-khao-sat-hoc-vien/data/submissions.json", "r") as f:
    submissions = json.load(f)

with open("/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json", "r") as f:
    students = json.load(f)

real_phones = ["0869911319", "0932325118", "03448408", "098 9161868", "0979985110", "0866492018"]

for sub in submissions:
    phone = sub.get("phone", "")
    if phone:
        clean_phone = str(phone).replace(" ", "")
        is_real = any(str(rp).replace(" ", "") == clean_phone for rp in real_phones)
        if is_real:
            name = sub.get("fullName")
            found = False
            for st in students:
                st_phone = str(st.get("phone") or "").replace(" ", "")
                st_name = str(st.get("name") or "").lower()
                if (clean_phone and st_phone and clean_phone == st_phone) or st_name == name.lower():
                    found = True
                    print(f"✅ {name} ({phone}) -> MATCHED: {st.get('name')} ({st.get('id')}). Survey Data Exists: {'post_course_survey' in st}")
                    break
            if not found:
                print(f"❌ {name} ({phone}) -> NOT FOUND IN STU!")
