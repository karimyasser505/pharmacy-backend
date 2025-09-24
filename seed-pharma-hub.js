const { runSQL } = require('./db');

async function seedPharmaHub() {
    console.log('🌱 Starting to seed Pharma Hub database...');
    
    try {
        // Sample questions
        const questions = [
            {
                title: "كيف يمكن تحسين امتصاص الدواء الفموي؟",
                content: "أعمل على بحث يتعلق بتحسين امتصاص الأدوية الفموية، وأحتاج إلى نصائح حول الطرق المختلفة المستخدمة مثل استخدام المواد المساعدة للامتصاص، وتعديل درجة الحموضة، واستخدام النانوتكنولوجي. هل يمكن لأحد مشاركة تجربته في هذا المجال؟",
                category: "pharmaceutics",
                author: "أحمد محمد",
                tags: ["امتصاص", "أدوية فموية", "صيدلة صناعية", "نانوتكنولوجي"]
            },
            {
                title: "آثار جانبية محتملة للعلاج الكيميائي",
                content: "أدرس في قسم الصيدلة الإكلينيكية وأحتاج إلى معلومات عن الآثار الجانبية الشائعة للعلاج الكيميائي وكيفية إدارتها. خاصة الآثار على الجهاز الهضمي والجهاز العصبي. هل يمكن لأحد مشاركة بروتوكولات العلاج المستخدمة؟",
                category: "clinical-pharmacy",
                author: "فاطمة علي",
                tags: ["علاج كيميائي", "آثار جانبية", "صيدلة إكلينيكية", "إدارة الأدوية"]
            },
            {
                title: "طرق تحليل الأدوية في الدم",
                content: "أحتاج إلى مراجعة شاملة لطرق تحليل الأدوية في الدم المستخدمة في المختبرات الطبية. خاصة طرق الكروماتوغرافيا السائلة عالية الأداء (HPLC) والكروماتوغرافيا الغازية (GC). هل يمكن لأحد شرح الفروق بين هذه الطرق؟",
                category: "drug-analysis",
                author: "محمد أحمد",
                tags: ["تحليل دم", "أدوية", "مختبرات طبية", "HPLC", "GC"]
            },
            {
                title: "استخدام النباتات الطبية في علاج الأمراض المزمنة",
                content: "أبحث في مجال علم العقاقير عن استخدام النباتات الطبية في علاج الأمراض المزمنة مثل السكري وارتفاع ضغط الدم. هل يمكن لأحد مشاركة دراسات حديثة في هذا المجال؟",
                category: "pharmacognosy",
                author: "سارة محمود",
                tags: ["نباتات طبية", "أمراض مزمنة", "علم العقاقير", "طب بديل"]
            },
            {
                title: "تطوير أشكال دوائية جديدة باستخدام التكنولوجيا الحيوية",
                content: "أعمل على مشروع يتعلق بتطوير أشكال دوائية جديدة باستخدام التكنولوجيا الحيوية. أريد معرفة المزيد عن استخدام البروتينات المؤتلفة والجينات في تطوير الأدوية. هل يمكن لأحد مشاركة خبرته؟",
                category: "pharmaceutical-chemistry",
                author: "علي حسن",
                tags: ["تكنولوجيا حيوية", "بروتينات مؤتلفة", "علاج جيني", "أشكال دوائية"]
            },
            {
                title: "مناهج البحث في الدراسات السريرية",
                content: "أحتاج إلى فهم أفضل لمناهج البحث المستخدمة في الدراسات السريرية للأدوية. خاصة التجارب العشوائية المضبوطة (RCT) والدراسات المقطعية. هل يمكن لأحد شرح هذه المناهج؟",
                category: "research-methods",
                author: "نور الدين",
                tags: ["دراسات سريرية", "مناهج بحث", "RCT", "إحصاء حيوي"]
            }
        ];

        // Insert questions
        for (const question of questions) {
            const result = await runSQL(
                `INSERT INTO questions (title, content, category, author, tags, created_at, views) 
                 VALUES (?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'), ?)`,
                [
                    question.title,
                    question.content,
                    question.category,
                    question.author,
                    JSON.stringify(question.tags),
                    Math.floor(Math.random() * 30), // Random days ago
                    Math.floor(Math.random() * 100) + 10 // Random views
                ]
            );
            
            const questionId = result.lastID;
            console.log(`✅ Added question: ${question.title}`);
            
            // Add some comments for each question
            const commentCount = Math.floor(Math.random() * 4) + 1; // 1-4 comments
            
            for (let i = 0; i < commentCount; i++) {
                const comments = [
                    "شكراً على السؤال المهم! هذا موضوع يحتاج إلى مزيد من البحث.",
                    "أعتقد أن هذا السؤال يفتح مجالاً واسعاً للنقاش. هل يمكنك توضيح المزيد؟",
                    "هناك دراسة حديثة نشرت في مجلة Nature تتحدث عن هذا الموضوع.",
                    "من وجهة نظري، هذا النهج يمكن أن يكون فعالاً جداً في العلاج.",
                    "أحتاج إلى مزيد من المعلومات حول هذا الموضوع. هل يمكنك مشاركة المراجع؟",
                    "هذا سؤال ممتاز! أعتقد أن الإجابة تكمن في فهم الآلية الجزيئية.",
                    "شكراً على طرح هذا السؤال. سأبحث في الموضوع وأعود إليك.",
                    "هناك عدة دراسات تدعم هذا النهج. هل تريد أن أشاركها معك؟"
                ];
                
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                const randomAuthor = ["د. أحمد", "د. فاطمة", "د. محمد", "د. سارة", "د. علي"][Math.floor(Math.random() * 5)];
                
                await runSQL(
                    `INSERT INTO comments (question_id, content, author, created_at) 
                     VALUES (?, ?, ?, datetime('now', '-' || ? || ' hours'))`,
                    [
                        questionId,
                        randomComment,
                        randomAuthor,
                        Math.floor(Math.random() * 24) // Random hours ago
                    ]
                );
            }
            
            console.log(`   📝 Added ${commentCount} comments`);
        }
        
        console.log('✅ Pharma Hub database seeded successfully!');
        console.log(`📊 Added ${questions.length} questions with comments`);
        
    } catch (error) {
        console.error('❌ Error seeding Pharma Hub database:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedPharmaHub()
        .then(() => {
            console.log('🎉 Pharma Hub seeding completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Pharma Hub seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedPharmaHub };
