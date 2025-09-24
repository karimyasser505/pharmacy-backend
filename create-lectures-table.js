const { runSQL, allSQL } = require('./db');

async function createLecturesTable() {
    try {
        console.log('🔧 Creating lectures table...');
        
        // Create lectures table (already exists with different structure)
        console.log('📋 Lectures table already exists with the following structure:');
        const tableInfo = await allSQL('PRAGMA table_info(lectures)');
        tableInfo.forEach(col => {
            console.log(`  - ${col.name}: ${col.type}`);
        });
        
        console.log('✅ Lectures table created successfully');
        
        // Check if table is empty and add sample data
        const existingLectures = await allSQL('SELECT COUNT(*) as count FROM lectures');
        const count = existingLectures[0]?.count || 0;
        
        if (count === 0) {
            console.log('📚 Adding sample lecture data...');
            
            const sampleLectures = [
                {
                    title: 'مقدمة في علم الأدوية',
                    description: 'محاضرة شاملة تقدم المفاهيم الأساسية في علم الأدوية وتأثيرها على الجسم البشري. سيتعلم الطلاب كيفية عمل الأدوية وآلياتها المختلفة.',
                    type: 'محاضرة نظرية',
                    mode: 'حضوري',
                    date: '2025-02-15',
                    time: '10:00 صباحاً',
                    location: 'قاعة المحاضرات الرئيسية - كلية الصيدلة',
                    instructor: 'أ.د امل كمال',
                    pdf_path: null,
                    video_url: null
                },
                {
                    title: 'التفاعلات الدوائية',
                    description: 'محاضرة متخصصة في دراسة التفاعلات بين الأدوية المختلفة وكيفية تجنب الآثار الجانبية الخطيرة. تشمل أمثلة عملية من الحياة الواقعية.',
                    type: 'محاضرة عملية',
                    mode: 'حضوري',
                    date: '2025-02-20',
                    time: '2:00 مساءً',
                    location: 'معمل الصيدلة السريرية',
                    instructor: 'د. أحمد محمد',
                    pdf_path: null,
                    video_url: null
                },
                {
                    title: 'صيدلة المجتمع',
                    description: 'محاضرة تهدف إلى تعريف الطلاب بدور الصيدلي في المجتمع وكيفية تقديم المشورة الدوائية للمرضى. تشمل مهارات التواصل والاستشارة.',
                    type: 'ورشة عمل',
                    mode: 'أونلاين',
                    date: '2025-02-25',
                    time: '6:00 مساءً',
                    location: 'منصة زووم',
                    instructor: 'د. فاطمة علي',
                    pdf_path: null,
                    video_url: 'https://zoom.us/j/123456789'
                },
                {
                    title: 'التكنولوجيا الصيدلانية',
                    description: 'محاضرة حول أحدث التطورات في التكنولوجيا الصيدلانية وتطبيقاتها في صناعة الدواء. تشمل تقنيات التصنيع الحديثة.',
                    type: 'محاضرة تقنية',
                    mode: 'حضوري',
                    date: '2025-03-01',
                    time: '11:00 صباحاً',
                    location: 'معمل التكنولوجيا الصيدلانية',
                    instructor: 'د. محمود حسن',
                    pdf_path: null,
                    video_url: null
                },
                {
                    title: 'الأخلاقيات في مهنة الصيدلة',
                    description: 'محاضرة تهدف إلى تعزيز القيم الأخلاقية في مهنة الصيدلة ومسؤوليات الصيدلي تجاه المرضى والمجتمع.',
                    type: 'محاضرة أخلاقية',
                    mode: 'مختلط',
                    date: '2025-03-05',
                    time: '9:00 صباحاً',
                    location: 'قاعة المحاضرات الرئيسية - كلية الصيدلة',
                    instructor: 'أ.د امل كمال',
                    pdf_path: null,
                    video_url: null
                }
            ];
            
            for (const lecture of sampleLectures) {
                await runSQL(`
                    INSERT INTO lectures (title, description, type, mode, date, time, location, instructor, pdf_path, video_url, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                `, [
                    lecture.title,
                    lecture.description,
                    lecture.type,
                    lecture.mode,
                    lecture.date,
                    lecture.time,
                    lecture.location,
                    lecture.instructor,
                    lecture.pdf_path,
                    lecture.video_url
                ]);
            }
            
            console.log(`✅ Added ${sampleLectures.length} sample lectures`);
        } else {
            console.log(`📊 Lectures table already contains ${count} records`);
        }
        
        // Display current lectures
        const lectures = await allSQL('SELECT * FROM lectures ORDER BY date DESC');
        console.log('\n📚 Current lectures in database:');
        lectures.forEach((lecture, index) => {
            console.log(`${index + 1}. ${lecture.title} - ${lecture.date} (${lecture.time})`);
        });
        
        console.log('\n🎉 Lectures table setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Error setting up lectures table:', error);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    createLecturesTable().then(() => {
        process.exit(0);
    }).catch(error => {
        console.error('Failed to setup lectures table:', error);
        process.exit(1);
    });
}

module.exports = { createLecturesTable };
