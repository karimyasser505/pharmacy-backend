const { runSQL } = require('./db');

async function seedData() {
    try {
        console.log('🌱 Starting to seed database...');
        
        // Seed News
        console.log('📰 Seeding news...');
        await runSQL(`
            INSERT INTO news (title, excerpt, body, date, published, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'افتتاح معمل الصيدلة الجديد',
            'تم افتتاح معمل الصيدلة المتطور في كلية الصيدلة بجامعة المنيا',
            'افتتحت كلية الصيدلة بجامعة المنيا معمل الصيدلة المتطور الجديد الذي يحتوي على أحدث الأجهزة والمعدات. هذا المعمل سيوفر للطلاب بيئة تعليمية متقدمة ويساعد في تطوير مهاراتهم العملية.',
            '2025-01-15',
            1
        ]);
        
        await runSQL(`
            INSERT INTO news (title, excerpt, body, date, published, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'مؤتمر الصيدلة الدولي',
            'مؤتمر الصيدلة الدولي السنوي في جامعة المنيا',
            'ستستضيف كلية الصيدلة بجامعة المنيا المؤتمر الدولي السنوي للصيدلة في مارس 2025. سيحضر المؤتمر خبراء من مختلف دول العالم لمناقشة أحدث التطورات في مجال الصيدلة.',
            '2025-01-20',
            1
        ]);
        
        // Seed Publications
        console.log('📚 Seeding publications...');
        await runSQL(`
            INSERT INTO publications (title, journal, year, keywords, authors, doi, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'دراسة تأثير المستخلصات النباتية على مقاومة المضادات الحيوية',
            'مجلة الصيدلة المصرية',
            2024,
            'مستخلصات نباتية, مقاومة مضادات حيوية, بكتيريا',
            'أ.د. أمل كمال, د. أحمد محمد, د. فاطمة علي',
            '10.1000/xyz123'
        ]);
        
        await runSQL(`
            INSERT INTO publications (title, journal, year, keywords, authors, doi, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'تطوير أدوية جديدة لعلاج السرطان',
            'مجلة الأبحاث الصيدلانية',
            2024,
            'أدوية سرطان, علاج, تطوير',
            'أ.د. أمل كمال, د. محمد أحمد',
            '10.1000/abc456'
        ]);
        
        // Seed Events
        console.log('🎉 Seeding events...');
        await runSQL(`
            INSERT INTO events (title, body, start_date, location, type, duration, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'ورشة عمل في التكنولوجيا الصيدلانية',
            'ورشة عمل متخصصة في التكنولوجيا الصيدلانية الحديثة وتطبيقاتها العملية',
            '2025-02-15',
            'قاعة المؤتمرات - كلية الصيدلة',
            'ورشة عمل',
            '3 ساعات'
        ]);
        
        await runSQL(`
            INSERT INTO events (title, body, start_date, location, type, duration, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'مؤتمر الخريجين السنوي',
            'مؤتمر الخريجين السنوي لكلية الصيدلة - جامعة المنيا',
            '2025-03-20',
            'قاعة الاحتفالات الكبرى',
            'مؤتمر',
            'يوم كامل'
        ]);
        
        // Seed Graduates
        console.log('🎓 Seeding graduates...');
        await runSQL(`
            INSERT INTO graduates (name, cohort, specialty, email, thesis, current_position, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'أحمد محمد علي',
            2023,
            'صيدلة إكلينيكية',
            'ahmed.mohamed@email.com',
            'دراسة تأثير المستخلصات النباتية على مقاومة المضادات الحيوية',
            'صيدلي في مستشفى المنيا العام'
        ]);
        
        await runSQL(`
            INSERT INTO graduates (name, cohort, specialty, email, thesis, current_position, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
            'فاطمة أحمد محمد',
            2023,
            'صيدلة صناعية',
            'fatima.ahmed@email.com',
            'تطوير أدوية جديدة لعلاج السرطان',
            'باحثة في معهد البحوث الصيدلانية'
        ]);
        
        console.log('✅ Database seeded successfully!');
        console.log('📊 Summary:');
        console.log('   - News: 2 items');
        console.log('   - Publications: 2 items');
        console.log('   - Events: 2 items');
        console.log('   - Graduates: 2 items');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    seedData().then(() => {
        console.log('🎯 Seeding complete!');
        process.exit(0);
    }).catch(error => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
}

module.exports = { seedData };
