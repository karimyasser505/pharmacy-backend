const { runSQL } = require("./db");

async function seed() {
    try {
        console.log("🌱 Starting to seed database...");

        // Seed Jobs
        const jobs = [
            {
                title: "صيدلي إكلينيكي",
                type: "دوام كامل",
                salary: "5000 EGP",
                deadline: "2025-03-15",
                experience: "سنتين خبرة",
                qualification: "بكالوريوس صيدلة",
                description: "مطلوب صيدلي إكلينيكي للعمل في مستشفى خاص",
                requirements: JSON.stringify(["إجادة استخدام الكمبيوتر", "مهارات تواصل جيدة"]),
                benefits: JSON.stringify(["تأمين صحي", "عقد عمل ثابت"]),
                status: "active",
            },
            {
                title: "صيدلي صناعي",
                type: "دوام جزئي",
                salary: "3000 EGP",
                deadline: "2025-04-01",
                experience: "حديث التخرج مقبول",
                qualification: "بكالوريوس صيدلة صناعية",
                description: "تدريب في شركة أدوية كبرى",
                requirements: JSON.stringify(["انتباه للتفاصيل", "قدرة على التعلم السريع"]),
                benefits: JSON.stringify(["شهادة تدريب", "فرصة للتعيين"]),
                status: "active",
            },
        ];

        for (const job of jobs) {
            await runSQL(
                `INSERT INTO jobs 
         (title, type, salary, deadline, experience, qualification, description, requirements, benefits, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                [
                    job.title,
                    job.type,
                    job.salary,
                    job.deadline,
                    job.experience,
                    job.qualification,
                    job.description,
                    job.requirements,
                    job.benefits,
                    job.status,
                ]
            );
        }

        console.log("✅ Jobs seeded");

        // Seed Announcements
        const announcements = [
            {
                title: "مؤتمر الصيدلة الدولي",
                type: "مؤتمر",
                date: "2025-05-10",
                deadline: "2025-04-20",
                level: "دولي",
                location: "جامعة المنيا",
                duration: "3 أيام",
                field: "الصيدلة الإكلينيكية",
                prize: "شهادة مشاركة",
                description: "مؤتمر يضم نخبة من أساتذة الصيدلة",
                details: "ورش عمل، محاضرات، جلسات نقاش",
                requirements: JSON.stringify(["التسجيل المسبق"]),
                benefits: JSON.stringify(["شهادة", "شبكة علاقات"]),
                topics: JSON.stringify(["العلاج الدوائي", "البحث العلمي"]),
                speakers: JSON.stringify(["د. أحمد", "د. فاطمة"]),
                activities: JSON.stringify(["محاضرات", "ورش عمل"]),
                prizes: JSON.stringify(["أفضل بحث"]),
                criteria: JSON.stringify(["التميز الأكاديمي"]),
                status: "active",
            },
        ];

        for (const ann of announcements) {
            await runSQL(
                `INSERT INTO announcements
         (title, type, date, deadline, level, location, duration, field, prize,
          description, details, requirements, benefits, topics, speakers, activities, prizes, criteria, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
                [
                    ann.title,
                    ann.type,
                    ann.date,
                    ann.deadline,
                    ann.level,
                    ann.location,
                    ann.duration,
                    ann.field,
                    ann.prize,
                    ann.description,
                    ann.details,
                    ann.requirements,
                    ann.benefits,
                    ann.topics,
                    ann.speakers,
                    ann.activities,
                    ann.prizes,
                    ann.criteria,
                    ann.status,
                ]
            );
        }

        console.log("✅ Announcements seeded");

        console.log("🎯 Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seed();
