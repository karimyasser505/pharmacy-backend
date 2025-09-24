console.log('🚀 Admin dashboard JavaScript starting...');

// API Configuration
const API_BASE = 'http://localhost:3001/api/admin';
console.log('🔗 API Base URL:', API_BASE);

// Helper function for authenticated API calls
function apiCall(url, options = {}) {
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
}

// No Copy/Paste Restrictions - Backend Admin
function setupNoRestrictions() {
    console.log('🔓 Removing all copy/paste restrictions...');
    
    // No restrictions - allow all normal browser functionality
    console.log('✅ All copy/paste restrictions removed - full functionality enabled');
}

// Simple test to see if JavaScript is working

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded, setting up dashboard...');
    
    // Initialize with no restrictions
    setupNoRestrictions();
    
    try {
        // Get all the elements we need
        const loadingState = document.getElementById('loadingState');
        const loginSection = document.getElementById('loginSection');
        const appSection = document.getElementById('appSection');
        const userBox = document.getElementById('userBox');
        const logoutBtn = document.getElementById('logoutBtn');
        const tabContent = document.getElementById('tabContent');
        const messageContainer = document.getElementById('messageContainer');
        const loginForm = document.getElementById('loginForm');
        
        console.log('🔍 Found elements:', {
            loadingState: !!loadingState,
            loginSection: !!loginSection,
            appSection: !!appSection,
            userBox: !!userBox,
            logoutBtn: !!logoutBtn,
            tabContent: !!tabContent,
            messageContainer: !!messageContainer,
            loginForm: !!loginForm
        });
        
        // Show loading state first
        if (loadingState) loadingState.style.display = 'flex';
        if (loginSection) loginSection.style.display = 'none';
        if (appSection) appSection.style.display = 'none';
        
        // Wait 2 seconds then show login form
        setTimeout(function() {
            console.log('🔐 Showing login form...');
            if (loadingState) loadingState.style.display = 'none';
            if (loginSection) loginSection.style.display = 'flex';
        }, 2000);
        
        // Set up login form
        if (loginForm) {
            console.log('🔗 Setting up login form...');
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('🔐 Login attempt...');
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                try {
                    const response = await fetch(`${API_BASE.replace('/admin', '/auth')}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                        credentials: 'include'
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('✅ Login successful!', result);
                        showDashboard();
                    } else {
                        const error = await response.json();
                        console.log('❌ Login failed:', error);
                        showMessage(`❌ ${error.error || 'فشل في تسجيل الدخول'}`, 'error');
                    }
                } catch (error) {
                    console.error('❌ Login error:', error);
                    showMessage('❌ خطأ في الاتصال بالخادم', 'error');
                }
            });
            console.log('✅ Login form event listener added');
        } else {
            console.error('❌ Login form not found!');
        }
        
        // Set up logout button
        if (logoutBtn) {
            console.log('🔗 Setting up logout button...');
            logoutBtn.addEventListener('click', async function() {
                console.log('🔐 Logging out...');
                try {
                    await fetch(`${API_BASE.replace('/admin', '/auth')}/logout`, {
                        method: 'POST',
                        credentials: 'include'
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                }
                showLoginForm();
            });
            console.log('✅ Logout button event listener added');
        } else {
            console.error('❌ Logout button not found!');
        }
        
        // Set up tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        console.log('📋 Found tab buttons:', tabButtons.length);
        
        tabButtons.forEach(function(btn, index) {
            console.log(`🔗 Setting up tab button ${index + 1}:`, btn.getAttribute('data-tab'));
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                console.log('🖱️ Tab clicked:', tabName);
                activateTab(tabName);
            });
        });
        
        console.log('✅ Dashboard setup complete!');
        
    } catch (error) {
        console.error('❌ Error setting up dashboard:', error);
    }
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE.replace('/admin', '/auth')}/me`, {
            credentials: 'include'
        });
        const result = await response.json();
        return result.user;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

// Show dashboard after login
async function showDashboard() {
    console.log('📊 Showing dashboard...');
    
    // Check if user is actually authenticated
    const user = await checkAuthStatus();
    if (!user) {
        console.log('❌ User not authenticated, showing login');
        showLoginForm();
        return;
    }
    
    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');
    const userBox = document.getElementById('userBox');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginSection) loginSection.style.display = 'none';
    if (appSection) appSection.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    if (userBox) userBox.innerHTML = `<i class="fas fa-user"></i> <span>مرحبا، ${user.username}</span>`;
    
    // Load dashboard content
    activateTab('dashboard');
}

// Show login form
function showLoginForm() {
    console.log('🔐 Showing login form...');
    
    const loadingState = document.getElementById('loadingState');
    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const userBox = document.getElementById('userBox');
    
    if (loadingState) loadingState.style.display = 'none';
    if (loginSection) loginSection.style.display = 'flex';
    if (appSection) appSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userBox) userBox.innerHTML = '<i class="fas fa-user"></i> <span>تسجيل الدخول</span>';
}

// Activate tab
function activateTab(tabName) {
    console.log('📋 Activating tab:', tabName);
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Load tab content
    loadTabContent(tabName);
}

// Load tab content
function loadTabContent(tabName) {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;

    console.log('📄 Loading content for tab:', tabName);
    
    switch (tabName) {
        case 'dashboard':
            tabContent.innerHTML = `
                <div class="card dashboard-card">
                    <h2><i class="fas fa-tachometer-alt"></i> لوحة المعلومات</h2>
                    <p>مرحبا بك في لوحة التحكم!</p>
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <i class="fas fa-newspaper"></i>
                            <h3>الأخبار</h3>
                            <p id="newsCount">0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-book"></i>
                            <h3>الأبحاث</h3>
                            <p id="publicationsCount">0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <h3>المحاضرات</h3>
                            <p id="lecturesCount">0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-graduation-cap"></i>
                            <h3>فرص التدريب</h3>
                            <p id="internshipsCount">0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-lightbulb"></i>
                            <h3>هل تعلم؟!</h3>
                            <p id="didYouKnowCount">0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-question-circle"></i>
                            <h3>Pharma Hub</h3>
                            <p id="pharmaHubCount">0</p>
                        </div>
                    </div>
                </div>
            `;
            loadDashboardStats();
            break;
            
        case 'news':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-newspaper"></i> إدارة الأخبار</h2>
                    <p>هنا يمكنك إدارة الأخبار</p>
                    <button class="btn btn-primary" onclick="showNewsForm()">
                        <i class="fas fa-plus"></i> إضافة خبر جديد
                    </button>
                    <div id="newsTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAdminNews();
            break;
            
        case 'publications':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-book"></i> إدارة الأبحاث</h2>
                    <p>هنا يمكنك إدارة الأبحاث</p>
                    <button class="btn btn-primary" onclick="showPublicationForm()">
                        <i class="fas fa-plus"></i> إضافة بحث جديد
                    </button>
                    <div id="publicationsTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAdminPublications();
            break;
            
            
        case 'lectures':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-chalkboard-teacher"></i> إدارة المحاضرات</h2>
                    <p>هنا يمكنك إدارة المحاضرات والدروس</p>
                    <button class="btn btn-primary" onclick="showLectureForm()">
                        <i class="fas fa-plus"></i> إضافة محاضرة جديدة
                    </button>
                    <div id="lecturesTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAdminLectures();
            break;
            
        case 'files':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-file-upload"></i> إدارة الملفات</h2>
                    <p>هنا يمكنك إدارة الملفات</p>
                    <button class="btn btn-primary" onclick="showFileUploadForm()">
                        <i class="fas fa-upload"></i> رفع ملف جديد
                    </button>
                    <div id="filesTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAdminFiles();
            break;
            
        case 'jobs':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-briefcase"></i> إدارة الوظائف</h2>
                    <p>هنا يمكنك إدارة الوظائف المتاحة</p>
                    <button class="btn btn-primary" onclick="showAddJobModal()">
                        <i class="fas fa-plus"></i> إضافة وظيفة جديدة
                    </button>
                    <div id="jobsTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadJobsManagement();
            break;
            
        case 'announcements':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-bullhorn"></i> إدارة الإعلانات</h2>
                    <p>هنا يمكنك إدارة الإعلانات</p>
                    <button class="btn btn-primary" onclick="showAddAnnouncementModal()">
                        <i class="fas fa-plus"></i> إضافة إعلان جديد
                    </button>
                    <div id="announcementsTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAnnouncementsManagement();
            break;
            
        case 'did-you-know':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-lightbulb"></i> إدارة هل تعلم؟!</h2>
                    <p>هنا يمكنك إدارة معلومات "هل تعلم" المثيرة والمفيدة</p>
                    <button class="btn btn-primary" onclick="showAddDidYouKnowModal()">
                        <i class="fas fa-plus"></i> إضافة معلومة جديدة
                    </button>
                    <div id="didYouKnowTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadDidYouKnowManagement();
            break;
            
        case 'internships':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-graduation-cap"></i> إدارة فرص التدريب</h2>
                    <p>هنا يمكنك إدارة فرص التدريب المهني</p>
                    <button class="btn btn-primary" onclick="showAddInternshipModal()">
                        <i class="fas fa-plus"></i> إضافة فرصة تدريب جديدة
                    </button>
                    <div id="internshipsTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadInternshipsManagement();
            break;
            
        case 'pharma-hub':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-question-circle"></i> إدارة Pharma Hub</h2>
                    <p>هنا يمكنك إدارة الأسئلة والتعليقات</p>
                    <button class="btn btn-primary" onclick="showPharmaHubQuestionForm()">
                        <i class="fas fa-plus"></i> إضافة سؤال جديد
                    </button>
                    <div id="pharmaHubTableContainer" style="margin-top:2rem;"></div>
                </div>
            `;
            loadAdminPharmaHub();
            break;
            
        case 'settings':
            tabContent.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-cog"></i> الإعدادات</h2>
                    <p>هنا يمكنك تغيير الإعدادات</p>
                </div>
            `;
            break;
    }
}

// Load admin lectures
async function loadAdminLectures() {
    const container = document.getElementById('lecturesTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل المحاضرات...</div>';
    
    try {
        const response = await apiCall('http://localhost:3001/api/lectures');
        if (!response.ok) throw new Error('فشل في تحميل المحاضرات');
        
        const lectures = await response.json();
        
        if (!Array.isArray(lectures) || lectures.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد محاضرات متاحة</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>النوع</th>
                        <th>النمط</th>
                        <th>التاريخ</th>
                        <th>المحاضر</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const lecture of lectures) {
            html += `
                <tr>
                    <td>
                        <div class="item-title">${lecture.title || ''}</div>
                        <div class="content-preview">${lecture.description?.substring(0, 80) || ''}...</div>
                    </td>
                    <td><span class="category-badge type-badge">${lecture.type || ''}</span></td>
                    <td><span class="category-badge mode-badge">${lecture.mode || ''}</span></td>
                    <td>${lecture.date ? new Date(lecture.date).toLocaleDateString('ar-EG') : ''}</td>
                    <td>${lecture.instructor || 'غير محدد'}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editLecture(${lecture.id})">تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteLecture(${lecture.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل المحاضرات'}</div>`;
    }
}

// Show lecture form
function showLectureForm(lectureId = null) {
    const modalContainer = document.getElementById('modalContainer');
    const isEdit = lectureId !== null;
    
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-chalkboard-teacher"></i> ${isEdit ? 'تعديل المحاضرة' : 'إضافة محاضرة جديدة'}</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="lectureForm" class="form" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="lectureTitle">عنوان المحاضرة *</label>
                        <input type="text" id="lectureTitle" name="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="lectureDescription">وصف المحاضرة *</label>
                        <textarea id="lectureDescription" name="description" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lectureType">نوع المحاضرة *</label>
                            <select id="lectureType" name="type" required>
                                <option value="">اختر النوع</option>
                                <option value="محاضرة عامة">محاضرة عامة</option>
                                <option value="محاضرة تخصصية">محاضرة تخصصية</option>
                                <option value="درس عملي">درس عملي</option>
                                <option value="ندوة علمية">ندوة علمية</option>
                                <option value="ورشة تدريبية">ورشة تدريبية</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="lectureMode">نمط المحاضرة *</label>
                            <select id="lectureMode" name="mode" required>
                                <option value="">اختر النمط</option>
                                <option value="أونلاين">أونلاين</option>
                                <option value="أوفلاين">أوفلاين</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lectureDate">تاريخ المحاضرة *</label>
                            <input type="date" id="lectureDate" name="date" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="lectureTime">وقت المحاضرة</label>
                            <input type="time" id="lectureTime" name="time">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="lectureLocation">الموقع/الرابط *</label>
                        <input type="text" id="lectureLocation" name="location" placeholder="مثال: القاعة الرئيسية أو رابط Zoom" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="lectureInstructor">المحاضر/المدرب</label>
                        <input type="text" id="lectureInstructor" name="instructor" placeholder="اسم المحاضر">
                    </div>
                    
                    <div class="form-group">
                        <label for="lecturePdf">رفع ملف PDF (اختياري)</label>
                        <input type="file" id="lecturePdf" name="pdf" accept=".pdf">
                        <small>الحد الأقصى: 10MB</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="lectureVideo">رابط الفيديو (اختياري)</label>
                        <input type="url" id="lectureVideo" name="video" placeholder="رابط YouTube أو أي منصة أخرى">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">${isEdit ? 'تحديث المحاضرة' : 'إضافة المحاضرة'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    if (isEdit) {
        loadLectureData(lectureId);
    }
    
    // Handle form submission
    document.getElementById('lectureForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitLecture(isEdit, lectureId);
    });
}

// Load lecture data for editing
async function loadLectureData(lectureId) {
    try {
        const response = await apiCall(`http://localhost:3001/api/lectures/${lectureId}`);
        const lecture = await response.json();
        
        document.getElementById('lectureTitle').value = lecture.title || '';
        document.getElementById('lectureDescription').value = lecture.description || '';
        document.getElementById('lectureType').value = lecture.type || '';
        document.getElementById('lectureMode').value = lecture.mode || '';
        document.getElementById('lectureDate').value = lecture.date || '';
        document.getElementById('lectureTime').value = lecture.time || '';
        document.getElementById('lectureLocation').value = lecture.location || '';
        document.getElementById('lectureInstructor').value = lecture.instructor || '';
        document.getElementById('lectureVideo').value = lecture.video_url || '';
    } catch (error) {
        console.error('Error loading lecture data:', error);
        showMessage('خطأ في تحميل بيانات المحاضرة', 'error');
    }
}

// Submit lecture form
async function submitLecture(isEdit, lectureId) {
    try {
        const form = document.getElementById('lectureForm');
        const formData = new FormData(form);
        
        const url = isEdit ? `http://localhost:3001/api/lectures/${lectureId}` : 'http://localhost:3001/api/lectures';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData,
            credentials: 'include'
        });
        
        if (response.ok) {
            showMessage(isEdit ? '✅ تم تحديث المحاضرة بنجاح' : '✅ تم إضافة المحاضرة بنجاح');
            closeModal();
            loadAdminLectures();
            loadDashboardStats();
        } else {
            const error = await response.text();
            showMessage('❌ خطأ: ' + error, 'error');
        }
    } catch (error) {
        console.error('Error submitting lecture:', error);
        showMessage('❌ خطأ في الاتصال بالخادم', 'error');
    }
}

// Edit lecture
function editLecture(lectureId) {
    showLectureForm(lectureId);
}

// Delete lecture
async function deleteLecture(lectureId) {
    if (!confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`http://localhost:3001/api/lectures/${lectureId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('✅ تم حذف المحاضرة بنجاح');
            loadAdminLectures();
            loadDashboardStats();
        } else {
            const error = await response.text();
            showMessage('❌ خطأ: ' + error, 'error');
        }
    } catch (error) {
        console.error('Error deleting lecture:', error);
        showMessage('❌ خطأ في الاتصال بالخادم', 'error');
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const [news, publications, lectures, internships, didYouKnow, pharmaHub] = await Promise.all([
            apiCall(`${API_BASE}/news`).then(r => r.json()),
            apiCall(`${API_BASE}/publications`).then(r => r.json()),
            apiCall('http://localhost:3001/api/lectures').then(r => r.json()),
            apiCall('http://localhost:3001/api/internships/admin/all').then(r => r.json()),
            apiCall('http://localhost:3001/api/did-you-know').then(r => r.json()),
            apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions`).then(r => r.json())
        ]);
        
        document.getElementById('newsCount').textContent = news.length || 0;
        document.getElementById('publicationsCount').textContent = publications.length || 0;
        document.getElementById('lecturesCount').textContent = lectures.length || 0;
        document.getElementById('internshipsCount').textContent = internships.data ? internships.data.length : 0;
        
        // Add Did You Know stats if the element exists
        const didYouKnowCount = document.getElementById('didYouKnowCount');
        if (didYouKnowCount) {
            didYouKnowCount.textContent = didYouKnow.data ? didYouKnow.data.length : 0;
        }
        
        // Add Pharma Hub stats if the element exists
        const pharmaHubCount = document.getElementById('pharmaHubCount');
        if (pharmaHubCount) {
            pharmaHubCount.textContent = pharmaHub.length || 0;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Show message helper
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
    }
}

// News Management
function showNewsForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-newspaper"></i> إضافة خبر جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="newsForm" class="form">
                    <div class="form-group">
                        <label for="newsTitle">عنوان الخبر *</label>
                        <input type="text" id="newsTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="newsExcerpt">ملخص الخبر</label>
                        <textarea id="newsExcerpt" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsBody">محتوى الخبر *</label>
                        <textarea id="newsBody" rows="6" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsDate">تاريخ الخبر</label>
                        <input type="date" id="newsDate">
                    </div>
                    <div class="form-group">
                        <label for="newsImage">رابط الصورة</label>
                        <input type="url" id="newsImage" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="newsPublished"> نشر الخبر
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ الخبر</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Set default date to today
    document.getElementById('newsDate').value = new Date().toISOString().split('T')[0];
    
    // Handle form submission
    document.getElementById('newsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveNews();
    });
}

async function saveNews() {
    try {
        const newsData = {
            title: document.getElementById('newsTitle').value,
            excerpt: document.getElementById('newsExcerpt').value,
            body: document.getElementById('newsBody').value,
            date: document.getElementById('newsDate').value,
            image_url: document.getElementById('newsImage').value || null,
            published: document.getElementById('newsPublished').checked ? 1 : 0
        };
        
        const response = await apiCall(`${API_BASE}/news`, {
            method: 'POST',
            body: JSON.stringify(newsData)
        });
        
        if (response.ok) {
            showMessage('✅ تم حفظ الخبر بنجاح');
            closeModal();
            activateTab('news'); // Refresh the news tab
        } else {
            throw new Error('فشل في حفظ الخبر');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// Publications Management
function showPublicationForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-book"></i> إضافة بحث جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="publicationForm" class="form">
                    <div class="form-group">
                        <label for="pubTitle">عنوان البحث *</label>
                        <input type="text" id="pubTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="pubJournal">اسم المجلة</label>
                        <input type="text" id="pubJournal">
                    </div>
                    <div class="form-group">
                        <label for="pubYear">سنة النشر</label>
                        <input type="number" id="pubYear" min="1900" max="2030">
                    </div>
                    <div class="form-group">
                        <label for="pubKeywords">الكلمات المفتاحية (افصل بينها بفواصل)</label>
                        <input type="text" id="pubKeywords" placeholder="صيدلة، دواء، علاج">
                    </div>
                    <div class="form-group">
                        <label for="pubAuthors">المؤلفون (افصل بينهم بفواصل)</label>
                        <input type="text" id="pubAuthors" placeholder="أحمد محمد، فاطمة علي">
                    </div>
                    <div class="form-group">
                        <label for="pubDoi">DOI</label>
                        <input type="text" id="pubDoi" placeholder="10.1000/example">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ البحث</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Set default year to current year
    document.getElementById('pubYear').value = new Date().getFullYear();
    
    // Handle form submission
    document.getElementById('publicationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await savePublication();
    });
}

async function savePublication() {
    try {
        const pubData = {
            title: document.getElementById('pubTitle').value,
            journal: document.getElementById('pubJournal').value,
            year: document.getElementById('pubYear').value,
            keywords: document.getElementById('pubKeywords').value.split(',').map(k => k.trim()).filter(k => k),
            authors: document.getElementById('pubAuthors').value.split(',').map(a => a.trim()).filter(a => a),
            doi: document.getElementById('pubDoi').value || null
        };
        
        const response = await apiCall(`${API_BASE}/publications`, {
            method: 'POST',
            body: JSON.stringify(pubData)
        });
        
        if (response.ok) {
            showMessage('✅ تم حفظ البحث بنجاح');
            closeModal();
            activateTab('publications');
        } else {
            throw new Error('فشل في حفظ البحث');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// Events Management
function showEventForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-alt"></i> إضافة فعالية جديدة</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="eventForm" class="form">
                    <div class="form-group">
                        <label for="eventTitle">عنوان الفعالية *</label>
                        <input type="text" id="eventTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="eventBody">وصف الفعالية *</label>
                        <textarea id="eventBody" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="eventStartDate">تاريخ البداية</label>
                        <input type="date" id="eventStartDate">
                    </div>
                    <div class="form-group">
                        <label for="eventLocation">الموقع</label>
                        <input type="text" id="eventLocation">
                    </div>
                    <div class="form-group">
                        <label for="eventType">نوع الفعالية</label>
                        <select id="eventType">
                            <option value="محاضرة">محاضرة</option>
                            <option value="ندوة">ندوة</option>
                            <option value="مؤتمر">مؤتمر</option>
                            <option value="ورشة عمل">ورشة عمل</option>
                            <option value="أخرى">أخرى</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="eventDuration">المدة (بالساعات)</label>
                        <input type="number" id="eventDuration" min="1" max="24">
                    </div>
                    <div class="form-group">
                        <label for="eventImage">رابط الصورة</label>
                        <input type="url" id="eventImage" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ الفعالية</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Set default date to today
    document.getElementById('eventStartDate').value = new Date().toISOString().split('T')[0];
    
    // Handle form submission
    document.getElementById('eventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveEvent();
    });
}

async function saveEvent() {
    try {
        const eventData = {
            title: document.getElementById('eventTitle').value,
            body: document.getElementById('eventBody').value,
            start_date: document.getElementById('eventStartDate').value,
            location: document.getElementById('eventLocation').value,
            type: document.getElementById('eventType').value,
            duration: document.getElementById('eventDuration').value,
            image_url: document.getElementById('eventImage').value || null
        };
        
        const response = await apiCall(`${API_BASE}/lectures`, {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showMessage('✅ تم حفظ الفعالية بنجاح');
            closeModal();
            activateTab('events');
        } else {
            throw new Error('فشل في حفظ الفعالية');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// Graduates Management
function showGraduateForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-user-graduate"></i> إضافة خريج جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="graduateForm" class="form">
                    <div class="form-group">
                        <label for="gradName">اسم الخريج *</label>
                        <input type="text" id="gradName" required>
                    </div>
                    <div class="form-group">
                        <label for="gradCohort">دفعة التخرج</label>
                        <input type="text" id="gradCohort" placeholder="2024">
                    </div>
                    <div class="form-group">
                        <label for="gradSpecialty">التخصص</label>
                        <input type="text" id="gradSpecialty" placeholder="صيدلة سريرية">
                    </div>
                    <div class="form-group">
                        <label for="gradEmail">البريد الإلكتروني</label>
                        <input type="email" id="gradEmail">
                    </div>
                    <div class="form-group">
                        <label for="gradThesis">عنوان الرسالة</label>
                        <textarea id="gradThesis" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="gradPosition">المنصب الحالي</label>
                        <input type="text" id="gradPosition" placeholder="صيدلي في مستشفى...">
                    </div>
                    <div class="form-group">
                        <label for="gradAvatar">رابط الصورة الشخصية</label>
                        <input type="url" id="gradAvatar" placeholder="https://example.com/avatar.jpg">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ الخريج</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Set default cohort to current year
    document.getElementById('gradCohort').value = new Date().getFullYear();
    
    // Handle form submission
    document.getElementById('graduateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveGraduate();
    });
}

async function saveGraduate() {
    try {
        const gradData = {
            name: document.getElementById('gradName').value,
            cohort: document.getElementById('gradCohort').value,
            specialty: document.getElementById('gradSpecialty').value,
            email: document.getElementById('gradEmail').value,
            thesis: document.getElementById('gradThesis').value,
            current_position: document.getElementById('gradPosition').value,
            avatar_url: document.getElementById('gradAvatar').value || null
        };
        
        const response = await apiCall(`${API_BASE}/graduates`, {
            method: 'POST',
            body: JSON.stringify(gradData)
        });
        
        if (response.ok) {
            showMessage('✅ تم حفظ الخريج بنجاح');
            closeModal();
            activateTab('graduates');
        } else {
            throw new Error('فشل في حفظ الخريج');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// File Upload Management
function showFileUploadForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-file-upload"></i> رفع ملف جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="fileUploadForm" class="form">
                    <div class="form-group">
                        <label for="fileInput">اختر الملف *</label>
                        <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
                            <div class="file-upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div class="file-upload-text">انقر هنا لاختيار ملف أو اسحب الملف هنا</div>
                            <div class="file-upload-hint">الملفات المدعومة: PDF, DOC, DOCX, JPG, PNG, GIF</div>
                        </div>
                        <input type="file" id="fileInput" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-upload"></i> رفع الملف
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add drag and drop functionality
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('fileInput');
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            fileUploadArea.innerHTML = `
                <div class="file-upload-icon">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-upload-text">تم اختيار: ${fileName}</div>
                <div class="file-upload-hint">انقر مرة أخرى لتغيير الملف</div>
            `;
        }
    });
    
    // Drag and drop events
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const fileName = e.dataTransfer.files[0].name;
            this.innerHTML = `
                <div class="file-upload-icon">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-upload-text">تم اختيار: ${fileName}</div>
                <div class="file-upload-hint">انقر مرة أخرى لتغيير الملف</div>
            `;
        }
    });
    
    // Handle form submission
    document.getElementById('fileUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await uploadFile();
    });
}

async function uploadFile() {
    try {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file) {
            showMessage('❌ يرجى اختيار ملف', 'error');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiCall(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showMessage('✅ تم رفع الملف بنجاح');
            closeModal();
            activateTab('files');
        } else {
            throw new Error('فشل في رفع الملف');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = '';
}

// Load admin data functions
async function loadAdminNews() {
    const container = document.getElementById('newsTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل الأخبار...</div>';
    
    try {
        const response = await apiCall(`${API_BASE}/news`);
        if (!response.ok) throw new Error('فشل في تحميل الأخبار');
        
        const news = await response.json();
        
        if (!Array.isArray(news) || news.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد أخبار متاحة</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>التاريخ</th>
                        <th>منشور؟</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const item of news) {
            html += `
                <tr>
                    <td>${item.title || ''}</td>
                    <td>${item.date ? new Date(item.date).toLocaleDateString('ar-EG') : ''}</td>
                    <td>${item.published ? '✔️' : '❌'}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editNews(${item.id})">تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل الأخبار'}</div>`;
    }
}

async function loadAdminPublications() {
    const container = document.getElementById('publicationsTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل الأبحاث...</div>';
    
    try {
        const response = await apiCall(`${API_BASE}/publications`);
        if (!response.ok) throw new Error('فشل في تحميل الأبحاث');
        
        const publications = await response.json();
        
        if (!Array.isArray(publications) || publications.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد أبحاث متاحة</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>المجلة</th>
                        <th>السنة</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const item of publications) {
            html += `
                <tr>
                    <td>${item.title || ''}</td>
                    <td>${item.journal || ''}</td>
                    <td>${item.year || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editPublication(${item.id})">تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deletePublication(${item.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل الأبحاث'}</div>`;
    }
}

async function loadAdminEvents() {
    const container = document.getElementById('eventsTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل المحاضرات...</div>';
    
    try {
        const response = await apiCall(`${API_BASE}/lectures`);
        if (!response.ok) throw new Error('فشل في تحميل المحاضرات');
        
        const events = await response.json();
        
        if (!Array.isArray(events) || events.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد فعاليات متاحة</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>التاريخ</th>
                        <th>النوع</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const item of events) {
            html += `
                <tr>
                    <td>${item.title || ''}</td>
                    <td>${item.start_date ? new Date(item.start_date).toLocaleDateString('ar-EG') : ''}</td>
                    <td>${item.type || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editEvent(${item.id})">تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEvent(${item.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل المحاضرات'}</div>`;
    }
}

async function loadAdminGraduates() {
    const container = document.getElementById('graduatesTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل الخريجين...</div>';
    
    try {
        const response = await apiCall(`${API_BASE}/graduates`);
        if (!response.ok) throw new Error('فشل في تحميل الخريجين');
        
        const graduates = await response.json();
        
        if (!Array.isArray(graduates) || graduates.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد خريجين متاحين</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>الدفعة</th>
                        <th>التخصص</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const item of graduates) {
            html += `
                <tr>
                    <td>${item.name || ''}</td>
                    <td>${item.cohort || ''}</td>
                    <td>${item.specialty || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editGraduate(${item.id})">تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGraduate(${item.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل الخريجين'}</div>`;
    }
}

async function loadAdminFiles() {
    const container = document.getElementById('filesTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل الملفات...</div>';
    
    try {
        const response = await apiCall(`${API_BASE}/files`);
        if (!response.ok) throw new Error('فشل في تحميل الملفات');
        
        const files = await response.json();
        
        if (!Array.isArray(files) || files.length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد ملفات متاحة</div>';
            return;
        }
        
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>اسم الملف</th>
                        <th>النوع</th>
                        <th>الحجم</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const item of files) {
            html += `
                <tr>
                    <td>${item.originalname || ''}</td>
                    <td>${item.mimetype || ''}</td>
                    <td>${(item.size / 1024).toFixed(1)} KB</td>
                    <td>
                        <a href="${item.url}" target="_blank" class="btn btn-sm btn-primary">عرض</a>
                        <button class="btn btn-sm btn-danger" onclick="deleteFile(${item.id})">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `<div class="error">${err.message || 'فشل في تحميل الملفات'}</div>`;
    }
}

// Delete functions
async function deleteNews(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    
    try {
        const response = await apiCall(`${API_BASE}/news/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('✅ تم حذف الخبر بنجاح');
            loadAdminNews();
        } else {
            throw new Error('فشل في حذف الخبر');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function deletePublication(id) {
    if (!confirm('هل أنت متأكد من حذف هذا البحث؟')) return;
    
    try {
        const response = await apiCall(`${API_BASE}/publications/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('✅ تم حذف البحث بنجاح');
            loadAdminPublications();
        } else {
            throw new Error('فشل في حذف البحث');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function deleteEvent(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الفعالية؟')) return;
    
    try {
        const response = await apiCall(`${API_BASE}/lectures/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('✅ تم حذف الفعالية بنجاح');
            loadAdminEvents();
        } else {
            throw new Error('فشل في حذف الفعالية');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function deleteGraduate(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الخريج؟')) return;
    
    try {
        const response = await apiCall(`${API_BASE}/graduates/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('✅ تم حذف الخريج بنجاح');
            loadAdminGraduates();
        } else {
            throw new Error('فشل في حذف الخريج');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function deleteFile(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    
    try {
        const response = await apiCall(`${API_BASE}/files/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('✅ تم حذف الملف بنجاح');
            loadAdminFiles();
        } else {
            throw new Error('فشل في حذف الملف');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

// Edit functions
function editNews(id) {
    // Fetch news data and show edit form
            apiCall(`${API_BASE}/news/${id}`)
        .then(response => response.json())
        .then(news => {
            showNewsEditForm(news);
        })
        .catch(error => {
            showMessage('❌ فشل في تحميل بيانات الخبر', 'error');
        });
}

function editPublication(id) {
    // Fetch publication data and show edit form
            apiCall(`${API_BASE}/publications/${id}`)
        .then(response => response.json())
        .then(publication => {
            showPublicationEditForm(publication);
        })
        .catch(error => {
            showMessage('❌ فشل في تحميل بيانات البحث', 'error');
        });
}

function editEvent(id) {
    // Fetch event data and show edit form
            apiCall(`${API_BASE}/lectures/${id}`)
        .then(response => response.json())
        .then(event => {
            showEventEditForm(event);
        })
        .catch(error => {
            showMessage('❌ فشل في تحميل بيانات الفعالية', 'error');
        });
}

function editGraduate(id) {
    // Fetch graduate data and show edit form
            apiCall(`${API_BASE}/graduates/${id}`)
        .then(response => response.json())
        .then(graduate => {
            showGraduateEditForm(graduate);
        })
        .catch(error => {
            showMessage('❌ فشل في تحميل بيانات الخريج', 'error');
        });
}

// Show edit forms
function showNewsEditForm(news) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل الخبر</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="newsEditForm" class="form">
                    <input type="hidden" id="newsEditId" value="${news.id}">
                    <div class="form-group">
                        <label for="newsEditTitle">عنوان الخبر *</label>
                        <input type="text" id="newsEditTitle" value="${news.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="newsEditExcerpt">ملخص الخبر</label>
                        <textarea id="newsEditExcerpt" rows="3">${news.excerpt || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsEditBody">محتوى الخبر *</label>
                        <textarea id="newsEditBody" rows="6" required>${news.body || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsEditDate">تاريخ الخبر</label>
                        <input type="date" id="newsEditDate" value="${news.date || ''}">
                    </div>
                    <div class="form-group">
                        <label for="newsEditImage">رابط الصورة</label>
                        <input type="url" id="newsEditImage" value="${news.image_url || ''}" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="newsEditPublished" ${news.published ? 'checked' : ''}> نشر الخبر
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('newsEditForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateNews();
    });
}

function showPublicationEditForm(publication) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل البحث</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="publicationEditForm" class="form">
                    <input type="hidden" id="pubEditId" value="${publication.id}">
                    <div class="form-group">
                        <label for="pubEditTitle">عنوان البحث *</label>
                        <input type="text" id="pubEditTitle" value="${publication.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="pubEditJournal">اسم المجلة</label>
                        <input type="text" id="pubEditJournal" value="${publication.journal || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pubEditYear">سنة النشر</label>
                        <input type="number" id="pubEditYear" min="1900" max="2030" value="${publication.year || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pubEditKeywords">الكلمات المفتاحية (افصل بينها بفواصل)</label>
                        <input type="text" id="pubEditKeywords" value="${Array.isArray(publication.keywords) ? publication.keywords.join(', ') : publication.keywords || ''}" placeholder="صيدلة، دواء، علاج">
                    </div>
                    <div class="form-group">
                        <label for="pubEditAuthors">المؤلفون (افصل بينهم بفواصل)</label>
                        <input type="text" id="pubEditAuthors" value="${Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors || ''}" placeholder="أحمد محمد، فاطمة علي">
                    </div>
                    <div class="form-group">
                        <label for="pubEditDoi">DOI</label>
                        <input type="text" id="pubEditDoi" value="${publication.doi || ''}" placeholder="10.1000/example">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('publicationEditForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updatePublication();
    });
}

function showEventEditForm(event) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل الفعالية</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="eventEditForm" class="form">
                    <input type="hidden" id="eventEditId" value="${event.id}">
                    <div class="form-group">
                        <label for="eventEditTitle">عنوان الفعالية *</label>
                        <input type="text" id="eventEditTitle" value="${event.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="eventEditBody">وصف الفعالية *</label>
                        <textarea id="eventEditBody" rows="4" required>${event.body || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="eventEditStartDate">تاريخ البداية</label>
                        <input type="date" id="eventEditStartDate" value="${event.start_date || ''}">
                    </div>
                    <div class="form-group">
                        <label for="eventEditLocation">الموقع</label>
                        <input type="text" id="eventEditLocation" value="${event.location || ''}">
                    </div>
                    <div class="form-group">
                        <label for="eventEditType">نوع الفعالية</label>
                        <select id="eventEditType">
                            <option value="محاضرة" ${event.type === 'محاضرة' ? 'selected' : ''}>محاضرة</option>
                            <option value="ندوة" ${event.type === 'ندوة' ? 'selected' : ''}>ندوة</option>
                            <option value="مؤتمر" ${event.type === 'مؤتمر' ? 'selected' : ''}>مؤتمر</option>
                            <option value="ورشة عمل" ${event.type === 'ورشة عمل' ? 'selected' : ''}>ورشة عمل</option>
                            <option value="أخرى" ${event.type === 'أخرى' ? 'selected' : ''}>أخرى</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="eventEditDuration">المدة (بالساعات)</label>
                        <input type="number" id="eventEditDuration" min="1" max="24" value="${event.duration || ''}">
                    </div>
                    <div class="form-group">
                        <label for="eventEditImage">رابط الصورة</label>
                        <input type="url" id="eventEditImage" value="${event.image_url || ''}" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('eventEditForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateEvent();
    });
}

function showGraduateEditForm(graduate) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل الخريج</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="graduateEditForm" class="form">
                    <input type="hidden" id="gradEditId" value="${graduate.id}">
                    <div class="form-group">
                        <label for="gradEditName">اسم الخريج *</label>
                        <input type="text" id="gradEditName" value="${graduate.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="gradEditCohort">دفعة التخرج</label>
                        <input type="text" id="gradEditCohort" value="${graduate.cohort || ''}" placeholder="2024">
                    </div>
                    <div class="form-group">
                        <label for="gradEditSpecialty">التخصص</label>
                        <input type="text" id="gradEditSpecialty" value="${graduate.specialty || ''}" placeholder="صيدلة سريرية">
                    </div>
                    <div class="form-group">
                        <label for="gradEditEmail">البريد الإلكتروني</label>
                        <input type="email" id="gradEditEmail" value="${graduate.email || ''}">
                    </div>
                    <div class="form-group">
                        <label for="gradEditThesis">عنوان الرسالة</label>
                        <textarea id="gradEditThesis" rows="3">${graduate.thesis || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="gradEditPosition">المنصب الحالي</label>
                        <input type="text" id="gradEditPosition" value="${graduate.current_position || ''}" placeholder="صيدلي في مستشفى...">
                    </div>
                    <div class="form-group">
                        <label for="gradEditAvatar">رابط الصورة الشخصية</label>
                        <input type="url" id="gradEditAvatar" value="${graduate.avatar_url || ''}" placeholder="https://example.com/avatar.jpg">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('graduateEditForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateGraduate();
    });
}

// Update functions
async function updateNews() {
    try {
        const newsData = {
            title: document.getElementById('newsEditTitle').value,
            excerpt: document.getElementById('newsEditExcerpt').value,
            body: document.getElementById('newsEditBody').value,
            date: document.getElementById('newsEditDate').value,
            image_url: document.getElementById('newsEditImage').value || null,
            published: document.getElementById('newsEditPublished').checked ? 1 : 0
        };
        
        const id = document.getElementById('newsEditId').value;
        
        const response = await apiCall(`${API_BASE}/news/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newsData)
        });
        
        if (response.ok) {
            showMessage('✅ تم تحديث الخبر بنجاح');
            closeModal();
            activateTab('news');
        } else {
            throw new Error('فشل في تحديث الخبر');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function updatePublication() {
    try {
        const pubData = {
            title: document.getElementById('pubEditTitle').value,
            journal: document.getElementById('pubEditJournal').value,
            year: document.getElementById('pubEditYear').value,
            keywords: document.getElementById('pubEditKeywords').value.split(',').map(k => k.trim()).filter(k => k),
            authors: document.getElementById('pubEditAuthors').value.split(',').map(a => a.trim()).filter(a => a),
            doi: document.getElementById('pubEditDoi').value || null
        };
        
        const id = document.getElementById('pubEditId').value;
        
        const response = await apiCall(`${API_BASE}/publications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pubData)
        });
        
        if (response.ok) {
            showMessage('✅ تم تحديث البحث بنجاح');
            closeModal();
            activateTab('publications');
        } else {
            throw new Error('فشل في تحديث البحث');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function updateEvent() {
    try {
        const eventData = {
            title: document.getElementById('eventEditTitle').value,
            body: document.getElementById('eventEditBody').value,
            start_date: document.getElementById('eventEditStartDate').value,
            location: document.getElementById('eventEditLocation').value,
            type: document.getElementById('eventEditType').value,
            duration: document.getElementById('eventEditDuration').value,
            image_url: document.getElementById('eventEditImage').value || null
        };
        
        const id = document.getElementById('eventEditId').value;
        
        const response = await apiCall(`${API_BASE}/lectures/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showMessage('✅ تم تحديث الفعالية بنجاح');
            closeModal();
            activateTab('events');
        } else {
            throw new Error('فشل في تحديث الفعالية');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

async function updateGraduate() {
    try {
        const gradData = {
            name: document.getElementById('gradEditName').value,
            cohort: document.getElementById('gradEditCohort').value,
            specialty: document.getElementById('gradEditSpecialty').value,
            email: document.getElementById('gradEditEmail').value,
            thesis: document.getElementById('gradEditThesis').value,
            current_position: document.getElementById('gradEditPosition').value,
            avatar_url: document.getElementById('gradEditAvatar').value || null
        };
        
        const id = document.getElementById('gradEditId').value;
        
        const response = await apiCall(`${API_BASE}/graduates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gradData)
        });
        
        if (response.ok) {
            showMessage('✅ تم تحديث الخريج بنجاح');
            closeModal();
            activateTab('graduates');
        } else {
            throw new Error('فشل في تحديث الخريج');
        }
    } catch (error) {
        showMessage('❌ ' + error.message, 'error');
    }
}

function showNewsAddForm() {
  const modalContent = `
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">📰</div>
          <h3>إضافة خبر جديد</h3>
          <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <form class="form" id="newsAddForm">
          <div class="form-group">
            <label for="newsTitle">عنوان الخبر *</label>
            <input 
              type="text" 
              id="newsTitle"
              class="form-control" 
              placeholder="اكتب عنوان الخبر هنا"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="newsSummary">ملخص الخبر</label>
            <textarea 
              id="newsSummary"
              class="form-control" 
              rows="4"
              placeholder="اكتب ملخص قصير للخبر..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="newsContent">محتوى الخبر *</label>
            <div class="rich-editor-container">
              <div class="rich-editor-toolbar">
                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                  <strong>B</strong>
                </button>
                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                  <em>I</em>
                </button>
                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                  <u>U</u>
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                  • List
                </button>
                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                  1. List
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                  🔗
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h2" title="عنوان فرعي">
                  H2
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                  H3
                </button>
              </div>
              <div 
                id="newsContent" 
                class="rich-editor-content form-control" 
                contenteditable="true"
                placeholder="اكتب محتوى الخبر هنا..."
                style="min-height: 200px; max-height: 400px; overflow-y: auto;"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="newsDate">تاريخ الخبر</label>
            <input 
              type="date" 
              id="newsDate"
              class="form-control" 
              value="${new Date().toISOString().slice(0, 10)}"
            />
          </div>
          
          <div class="form-group">
            <label for="newsKeywords">الكلمات المفتاحية</label>
            <input 
              type="text" 
              id="newsKeywords"
              class="form-control" 
              placeholder="كلمات مفصولة بفواصل (مثال: صيدلة، جامعة، بحث)"
            />
          </div>
          
          <div class="form-group">
            <label for="newsFiles">ملفات مرفقة (صور، مستندات)</label>
            <div class="file-upload-container">
              <div class="file-upload-area" id="newsFileUploadArea">
                <div class="file-upload-icon">📁</div>
                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                <div class="file-upload-hint">يدعم: JPG, PNG, PDF, DOC, DOCX (الحد الأقصى: 5 ملفات)</div>
                <input type="file" id="newsFiles" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style="display: none;">
              </div>
              <div class="file-preview-container" id="newsFilePreview"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="newsPublished">
              <input type="checkbox" id="newsPublished" checked>
              <span>نشر الخبر مباشرة</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">
              <span>إلغاء</span>
            </button>
            <button type="submit" class="btn btn-primary">
              <span>💾 حفظ الخبر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalContent);
  
  // Initialize rich text editor functionality
  initializeRichEditor();
  
  // Initialize file upload functionality
  initializeFileUpload('newsFileUploadArea', 'newsFiles', 'newsFilePreview');
  
  // Handle form submission
  document.getElementById('newsAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addNews();
  });
}

function showPublicationAddForm() {
  console.log('🎯 Creating publication form modal...');
  
  const modalContent = `
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">📚</div>
          <h3>إضافة منشور جديد</h3>
          <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <form class="form" id="publicationAddForm">
          <div class="form-group">
            <label for="pubTitle">عنوان المنشور *</label>
            <input 
              type="text" 
              id="pubTitle"
              class="form-control" 
              placeholder="اكتب عنوان المنشور هنا"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="pubAbstract">ملخص المنشور</label>
            <textarea 
              id="pubAbstract"
              class="form-control" 
              rows="4"
              placeholder="اكتب ملخص المنشور..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="pubContent">محتوى المنشور *</label>
            <div class="rich-editor-container">
              <div class="rich-editor-toolbar">
                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                  <strong>B</strong>
                </button>
                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                  <em>I</em>
                </button>
                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                  <u>U</u>
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                  • List
                </button>
                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                  1. List
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                  🔗
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h2" title="عنوان فرعي">
                  H2
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                  H3
                </button>
              </div>
              <div 
                id="pubContent" 
                class="rich-editor-content form-control" 
                contenteditable="true"
                placeholder="اكتب محتوى المنشور هنا..."
                style="min-height: 200px; max-height: 400px; overflow-y: auto;"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="pubAuthors">المؤلفون *</label>
            <input 
              type="text" 
              id="pubAuthors"
              class="form-control" 
              placeholder="أسماء المؤلفين مفصولة بفواصل"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="pubDate">تاريخ النشر</label>
            <input 
              type="date" 
              id="pubDate"
              class="form-control" 
              value="${new Date().toISOString().slice(0, 10)}"
            />
          </div>
          
          <div class="form-group">
            <label for="pubKeywords">الكلمات المفتاحية</label>
            <input 
              type="text" 
              id="pubKeywords"
              class="form-control" 
              placeholder="كلمات مفصولة بفواصل"
            />
          </div>
          
          <div class="form-group">
            <label for="pubDOI">DOI (اختياري)</label>
            <input 
              type="text" 
              id="pubDOI"
              class="form-control" 
              placeholder="10.1000/example"
            />
          </div>
          
          <div class="form-group">
            <label for="pubFiles">ملفات مرفقة (PDF، صور، بيانات إضافية)</label>
            <div class="file-upload-container">
              <div class="file-upload-area" id="pubFileUploadArea">
                <div class="file-upload-icon">📁</div>
                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                <div class="file-upload-hint">يدعم: PDF, JPG, PNG, DOC, XLS, ZIP (الحد الأقصى: 10 ملفات)</div>
                <input type="file" id="pubFiles" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip" style="display: none;">
              </div>
              <div class="file-preview-container" id="pubFilePreview"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">
              <span>إلغاء</span>
            </button>
            <button type="submit" class="btn btn-primary">
              <span>💾 حفظ المنشور</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalContent);
  console.log('✅ Modal HTML added to DOM');
  
  // Force apply styles after a short delay
  setTimeout(() => {
    console.log('🎨 Applying custom styles...');
    const inputs = document.querySelectorAll('.modal-overlay .form-control, .modal-overlay input, .modal-overlay textarea, .modal-overlay select');
    console.log('🔍 Found form elements:', inputs.length);
    
    inputs.forEach((input, index) => {
      console.log(`🎯 Styling input ${index + 1}:`, input.tagName, input.type);
      input.style.setProperty('background', 'rgba(255, 255, 255, 0.18)', 'important');
      input.style.setProperty('border', '4px solid rgba(255, 255, 255, 0.25)', 'important');
      input.style.setProperty('border-radius', '30px', 'important');
      input.style.setProperty('color', '#ffffff', 'important');
      input.style.setProperty('padding', '25px 35px', 'important');
      input.style.setProperty('font-size', '1.3rem', 'important');
    });
    
    const labels = document.querySelectorAll('.modal-overlay label');
    console.log('🏷️ Found labels:', labels.length);
    
    labels.forEach((label, index) => {
      console.log(`🎯 Styling label ${index + 1}:`, label.textContent);
      label.style.setProperty('color', '#ffffff', 'important');
      label.style.setProperty('font-weight', '700', 'important');
      label.style.setProperty('font-size', '1.25rem', 'important');
    });
    
    console.log('✅ Custom styles applied via JavaScript');
  }, 100);
  
  // Initialize rich text editor functionality
  initializeRichEditor();
  
  // Initialize file upload functionality
  initializeFileUpload('pubFileUploadArea', 'pubFiles', 'pubFilePreview');
  
  // Handle form submission
  document.getElementById('publicationAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addPublication();
  });
  
  console.log('✅ Publication form modal created successfully');
}

function showEventAddForm() {
  const modalContent = `
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">📅</div>
          <h3>إضافة حدث جديد</h3>
          <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <form class="form" id="eventAddForm">
          <div class="form-group">
            <label for="eventTitle">عنوان الحدث *</label>
            <input 
              type="text" 
              id="eventTitle"
              class="form-control" 
              placeholder="اكتب عنوان الحدث هنا"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="eventDescription">وصف الحدث</label>
            <textarea 
              id="eventDescription"
              class="form-control" 
              rows="4"
              placeholder="اكتب وصف الحدث..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="eventContent">تفاصيل الحدث *</label>
            <div class="rich-editor-container">
              <div class="rich-editor-toolbar">
                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                  <strong>B</strong>
                </button>
                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                  <em>I</em>
                </button>
                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                  <u>U</u>
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                  • List
                </button>
                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                  1. List
                </button>
                <div class="toolbar-separator"></div>
                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                  🔗
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h2" title="عنوان فرعي">
                  H2
                </button>
                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                  H3
                </button>
              </div>
              <div 
                id="eventContent" 
                class="rich-editor-content form-control" 
                contenteditable="true"
                placeholder="اكتب تفاصيل الحدث هنا..."
                style="min-height: 200px; max-height: 400px; overflow-y: auto;"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="eventDate">تاريخ الحدث *</label>
            <input 
              type="date" 
              id="eventDate"
              class="form-control" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="eventTime">وقت الحدث</label>
            <input 
              type="time" 
              id="eventTime"
              class="form-control" 
            />
          </div>
          
          <div class="form-group">
            <label for="eventLocation">موقع الحدث</label>
            <input 
              type="text" 
              id="eventLocation"
              class="form-control" 
              placeholder="موقع الحدث أو الرابط"
            />
          </div>
          
          <div class="form-group">
            <label for="eventType">نوع الفعالية *</label>
            <select 
              id="eventType"
              class="form-control" 
              required
            >
              <option value="">اختر نوع الفعالية</option>
              <option value="محاضرة">محاضرة</option>
              <option value="مؤتمر">مؤتمر</option>
              <option value="ورشة عمل">ورشة عمل</option>
              <option value="ندوة">ندوة</option>
              <option value="حفل تخرج">حفل تخرج</option>
              <option value="معرض">معرض</option>
              <option value="مسابقة">مسابقة</option>
              <option value="زيارة ميدانية">زيارة ميدانية</option>
              <option value="تدريب">تدريب</option>
              <option value="اجتماع">اجتماع</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="eventKeywords">الكلمات المفتاحية</label>
            <input 
              type="text" 
              id="eventKeywords"
              class="form-control" 
              placeholder="كلمات مفصولة بفواصل"
            />
          </div>
          
          <div class="form-group">
            <label for="eventFiles">ملفات مرفقة (صور، بروشورات، جداول)</label>
            <div class="file-upload-container">
              <div class="file-upload-area" id="eventFileUploadArea">
                <div class="file-upload-icon">📁</div>
                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                <div class="file-upload-hint">يدعم: JPG, PNG, PDF, DOC, XLS (الحد الأقصى: 8 ملفات)</div>
                <input type="file" id="eventFiles" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" style="display: none;">
              </div>
              <div class="file-preview-container" id="eventFilePreview"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">
              <span>إلغاء</span>
            </button>
            <button type="submit" class="btn btn-primary">
              <span>💾 حفظ الحدث</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalContent);
  
  // Initialize rich text editor functionality
  initializeRichEditor();
  
  // Initialize file upload functionality
  initializeFileUpload('eventFileUploadArea', 'eventFiles', 'eventFilePreview');
  
  // Handle form submission
  document.getElementById('eventAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addEvent();
  });
}

function addEvent() {
  const title = document.getElementById('eventTitle').value.trim();
  const description = document.getElementById('eventDescription').value.trim();
  const content = document.getElementById('eventContent').innerHTML.trim();
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const location = document.getElementById('eventLocation').value.trim();
  const eventType = document.getElementById('eventType').value;
  const keywords = document.getElementById('eventKeywords').value.trim();
  const files = document.getElementById('eventFiles').files;

  if (!title || !content || !date) {
    showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('content', content);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('location', location);
  formData.append('type', eventType);
  formData.append('keywords', keywords);
  
  // Append files
  Array.from(files).forEach((file, index) => {
    formData.append(`files`, file);
  });

  apiCall(`${API_BASE}/lectures`, {
    method: 'POST',
    body: formData // Send as FormData for file upload
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('تم إضافة الحدث بنجاح!', 'success');
      closeModal();
      loadAdminEvents();
    } else {
      showMessage('حدث خطأ أثناء إضافة الحدث', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('حدث خطأ في الاتصال', 'error');
  });
}

function showGraduateAddForm() {
  const modalContent = `
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">🎓</div>
          <h3>إضافة خريج جديد</h3>
          <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <form class="form" id="graduateAddForm">
          <div class="form-group">
            <label for="gradName">اسم الخريج *</label>
            <input 
              type="text" 
              id="gradName"
              class="form-control" 
              placeholder="اكتب اسم الخريج الكامل"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="gradDegree">الدرجة العلمية *</label>
            <select id="gradDegree" class="form-control" required>
              <option value="">اختر الدرجة العلمية</option>
              <option value="بكالوريوس">بكالوريوس</option>
              <option value="ماجستير">ماجستير</option>
              <option value="دكتوراه">دكتوراه</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="gradSpecialization">التخصص</label>
            <input 
              type="text" 
              id="gradSpecialization"
              class="form-control" 
              placeholder="التخصص أو المجال"
            />
          </div>
          
          <div class="form-group">
            <label for="gradYear">سنة التخرج *</label>
            <input 
              type="number" 
              id="gradYear"
              class="form-control" 
              min="2000" 
              max="2030" 
              placeholder="سنة التخرج"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="gradThesis">عنوان الرسالة/المشروع</label>
            <textarea 
              id="gradThesis"
              class="form-control" 
              rows="3"
              placeholder="عنوان الرسالة أو المشروع البحثي"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="gradSupervisor">المشرف</label>
            <input 
              type="text" 
              id="gradSupervisor"
              class="form-control" 
              placeholder="اسم المشرف الأكاديمي"
            />
          </div>
          
          <div class="form-group">
            <label for="gradKeywords">الكلمات المفتاحية</label>
            <input 
              type="text" 
              id="gradKeywords"
              class="form-control" 
              placeholder="كلمات مفصولة بفواصل"
            />
          </div>
          
          <div class="form-group">
            <label for="gradFiles">ملفات مرفقة (الرسالة، الشهادة، صور)</label>
            <div class="file-upload-container">
              <div class="file-upload-area" id="gradFileUploadArea">
                <div class="file-upload-icon">📁</div>
                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                <div class="file-upload-hint">يدعم: PDF, JPG, PNG, DOC (الحد الأقصى: 6 ملفات)</div>
                <input type="file" id="gradFiles" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display: none;">
              </div>
              <div class="file-preview-container" id="gradFilePreview"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">
              <span>إلغاء</span>
            </button>
            <button type="submit" class="btn btn-primary">
              <span>💾 حفظ الخريج</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalContent);
  
  // Initialize file upload functionality
  initializeFileUpload('gradFileUploadArea', 'gradFiles', 'gradFilePreview');
  
  // Handle form submission
  document.getElementById('graduateAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addGraduate();
  });
}

function addGraduate() {
  const name = document.getElementById('gradName').value.trim();
  const degree = document.getElementById('gradDegree').value;
  const specialization = document.getElementById('gradSpecialization').value.trim();
  const year = document.getElementById('gradYear').value;
  const thesis = document.getElementById('gradThesis').value.trim();
  const supervisor = document.getElementById('gradSupervisor').value.trim();
  const keywords = document.getElementById('gradKeywords').value.trim();
  const files = document.getElementById('gradFiles').files;

  if (!name || !degree || !year) {
    showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('name', name);
  formData.append('degree', degree);
  formData.append('specialization', specialization);
  formData.append('year', year);
  formData.append('thesis', thesis);
  formData.append('supervisor', supervisor);
  formData.append('keywords', keywords);
  
  // Append files
  Array.from(files).forEach((file, index) => {
    formData.append(`files`, file);
  });

  apiCall(`${API_BASE}/graduates`, {
    method: 'POST',
    body: formData // Send as FormData for file upload
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('تم إضافة الخريج بنجاح!', 'success');
      closeModal();
      loadAdminGraduates();
    } else {
      showMessage('حدث خطأ أثناء إضافة الخريج', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('حدث خطأ في الاتصال', 'error');
  });
}

console.log('🚀 JavaScript file loaded successfully!');

function initializeRichEditor() {
  const toolbar = document.querySelector('.rich-editor-toolbar');
  const content = document.getElementById('newsContent');
  
  if (!toolbar || !content) return;
  
  // Toolbar button functionality
  toolbar.addEventListener('click', function(e) {
    if (e.target.classList.contains('toolbar-btn')) {
      e.preventDefault();
      const command = e.target.dataset.command;
      const value = e.target.dataset.value;
      
      document.execCommand(command, false, value);
      content.focus();
    }
  });
  
  // Link creation
  toolbar.addEventListener('click', function(e) {
    if (e.target.dataset.command === 'createLink') {
      e.preventDefault();
      const url = prompt('أدخل الرابط:', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
      content.focus();
    }
  });
  
  // Content focus and placeholder
  content.addEventListener('focus', function() {
    if (this.textContent === '') {
      this.classList.add('editor-focused');
    }
  });
  
  content.addEventListener('blur', function() {
    if (this.textContent === '') {
      this.classList.remove('editor-focused');
    }
  });
  
  // Auto-resize content area
  content.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(200, this.scrollHeight) + 'px';
  });
}

function initializeFileUpload(uploadAreaId, fileInputId, previewId) {
  const uploadArea = document.getElementById(uploadAreaId);
  const fileInput = document.getElementById(fileInputId);
  const previewContainer = document.getElementById(previewId);
  
  if (!uploadArea || !fileInput || !previewContainer) return;
  
  // Click to select files
  uploadArea.addEventListener('click', () => fileInput.click());
  
  // File selection
  fileInput.addEventListener('change', (e) => {
    handleFileSelection(e.target.files, previewContainer, fileInput);
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFileSelection(files, previewContainer, fileInput);
  });
}

function handleFileSelection(files, previewContainer, fileInput) {
  const maxFiles = 5;
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  // Clear previous previews
  previewContainer.innerHTML = '';
  
  // Validate files
  const validFiles = Array.from(files).filter(file => {
    if (!allowedTypes.includes(file.type)) {
      showMessage(`نوع الملف ${file.name} غير مدعوم`, 'error');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showMessage(`الملف ${file.name} كبير جداً (الحد الأقصى: 10MB)`, 'error');
      return false;
    }
    return true;
  }).slice(0, maxFiles);
  
  // Update file input
  const dataTransfer = new DataTransfer();
  validFiles.forEach(file => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
  
  // Show previews
  validFiles.forEach((file, index) => {
    const preview = createFilePreview(file, index);
    previewContainer.appendChild(preview);
  });
  
  if (validFiles.length > 0) {
    showMessage(`تم اختيار ${validFiles.length} ملف(ات)`, 'success');
  }
}

function createFilePreview(file, index) {
  const preview = document.createElement('div');
  preview.className = 'file-preview';
  
  const isImage = file.type.startsWith('image/');
  const fileIcon = isImage ? '🖼️' : '📄';
  
  preview.innerHTML = `
    <div class="file-preview-icon">${fileIcon}</div>
    <div class="file-preview-info">
      <div class="file-name">${file.name}</div>
      <div class="file-size">${formatFileSize(file.size)}</div>
    </div>
    <button type="button" class="file-remove-btn" onclick="removeFile(${index})">×</button>
  `;
  
  // Add image preview if it's an image
  if (isImage) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'file-preview-image';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
  
  return preview;
}

function removeFile(index) {
  const fileInput = event.target.closest('.file-preview').parentElement.previousElementSibling.querySelector('input[type="file"]');
  const previewContainer = event.target.closest('.file-preview').parentElement;
  
  // Remove from file input
  const dataTransfer = new DataTransfer();
  Array.from(fileInput.files).forEach((file, i) => {
    if (i !== index) dataTransfer.items.add(file);
  });
  fileInput.files = dataTransfer.files;
  
  // Remove preview
  event.target.closest('.file-preview').remove();
  
  showMessage('تم حذف الملف', 'success');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function addNews() {
  const title = document.getElementById('newsTitle').value.trim();
  const summary = document.getElementById('newsSummary').value.trim();
  const content = document.getElementById('newsContent').innerHTML.trim();
  const date = document.getElementById('newsDate').value;
  const keywords = document.getElementById('newsKeywords').value.trim();
  const published = document.getElementById('newsPublished').checked;
  const files = document.getElementById('newsFiles').files;

  if (!title || !content) {
    showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('title', title);
  formData.append('summary', summary);
  formData.append('content', content);
  formData.append('date', date);
  formData.append('keywords', keywords);
  formData.append('published', published);
  
  // Append files
  Array.from(files).forEach((file, index) => {
    formData.append(`files`, file);
  });

  apiCall(`${API_BASE}/news`, {
    method: 'POST',
    body: formData // Send as FormData for file upload
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('تم إضافة الخبر بنجاح!', 'success');
      closeModal();
      loadAdminNews();
    } else {
      showMessage('حدث خطأ أثناء إضافة الخبر', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('حدث خطأ في الاتصال', 'error');
  });
}

function addPublication() {
  const title = document.getElementById('pubTitle').value.trim();
  const abstract = document.getElementById('pubAbstract').value.trim();
  const content = document.getElementById('pubContent').innerHTML.trim();
  const authors = document.getElementById('pubAuthors').value.trim();
  const date = document.getElementById('pubDate').value;
  const keywords = document.getElementById('pubKeywords').value.trim();
  const doi = document.getElementById('pubDOI').value.trim();
  const files = document.getElementById('pubFiles').files;

  if (!title || !content || !authors) {
    showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('title', title);
  formData.append('abstract', abstract);
  formData.append('content', content);
  formData.append('authors', authors);
  formData.append('date', date);
  formData.append('keywords', keywords);
  formData.append('doi', doi);
  
  // Append files
  Array.from(files).forEach((file, index) => {
    formData.append(`files`, file);
  });

  apiCall(`${API_BASE}/publications`, {
    method: 'POST',
    body: formData // Send as FormData for file upload
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('تم إضافة المنشور بنجاح!', 'success');
      closeModal();
      loadAdminPublications();
    } else {
      showMessage('حدث خطأ أثناء إضافة المنشور', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('حدث خطأ في الاتصال', 'error');
  });
}

// ===== PHARMA HUB MANAGEMENT =====

// Load Pharma Hub questions for admin
async function loadAdminPharmaHub() {
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions`);
        const questions = await response.json();
        
        const container = document.getElementById('pharmaHubTableContainer');
        if (!container) return;
        
        if (questions.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد أسئلة حالياً</p>';
            return;
        }
        
        let tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>العنوان</th>
                        <th>التصنيف</th>
                        <th>المؤلف</th>
                        <th>التاريخ</th>
                        <th>المشاهدات</th>
                        <th>الإجابات</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        questions.forEach(question => {
            const date = new Date(question.created_at).toLocaleDateString('ar-EG');
            tableHTML += `
                <tr>
                    <td>${question.title}</td>
                    <td><span class="category-badge">${getCategoryName(question.category)}</span></td>
                    <td>${question.author}</td>
                    <td>${date}</td>
                    <td>${question.views || 0}</td>
                    <td>${question.answer_count || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="viewPharmaHubQuestion(${question.id})">
                            <i class="fas fa-eye"></i> عرض
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletePharmaHubQuestion(${question.id})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
        
    } catch (error) {
        console.error('Error loading Pharma Hub questions:', error);
        showMessage('حدث خطأ في تحميل الأسئلة', 'error');
    }
}

// Show Pharma Hub question form
function showPharmaHubQuestionForm() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-question-circle"></i> إضافة سؤال جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="pharmaHubQuestionForm" class="form">
                    <div class="form-group">
                        <label for="questionTitle">عنوان السؤال *</label>
                        <input type="text" id="questionTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="questionContent">تفاصيل السؤال *</label>
                        <textarea id="questionContent" rows="6" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="questionCategory">التصنيف *</label>
                        <select id="questionCategory" required>
                            <option value="">اختر التصنيف</option>
                            <option value="pharmacology">علم الأدوية</option>
                            <option value="pharmaceutical-chemistry">الكيمياء الصيدلية</option>
                            <option value="pharmaceutics">الصيدلة الصناعية</option>
                            <option value="clinical-pharmacy">الصيدلة الإكلينيكية</option>
                            <option value="pharmacognosy">علم العقاقير</option>
                            <option value="drug-analysis">تحليل الأدوية</option>
                            <option value="research-methods">مناهج البحث</option>
                            <option value="general">عام</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="questionAuthor">المؤلف *</label>
                        <input type="text" id="questionAuthor" required>
                    </div>
                    <div class="form-group">
                        <label for="questionTags">العلامات (اختياري)</label>
                        <input type="text" id="questionTags" placeholder="امتصاص، أدوية فموية، صيدلة صناعية">
                        <small>افصل بين العلامات بفواصل</small>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">إضافة السؤال</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('pharmaHubQuestionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addPharmaHubQuestion();
    });
}

// Add new Pharma Hub question
async function addPharmaHubQuestion() {
    console.log('🔘 addPharmaHubQuestion called');
    
    const title = document.getElementById('questionTitle').value.trim();
    const content = document.getElementById('questionContent').value.trim();
    const category = document.getElementById('questionCategory').value;
    const author = document.getElementById('questionAuthor').value.trim();
    const tagsInput = document.getElementById('questionTags').value.trim();
    
    console.log('📝 Form data collected:', { title, content, category, author, tagsInput });
    
    if (!title || !content || !category || !author) {
        console.log('❌ Validation failed - missing required fields');
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    console.log('🏷️ Tags parsed:', tags);
    
    try {
        console.log('🌐 Making API call to:', `${API_BASE.replace('/admin', '/pharma-hub')}/questions`);
        
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                content,
                category,
                author,
                tags
            })
        });
        
        console.log('📡 API response status:', response.status);
        
        if (response.ok) {
            console.log('✅ Question added successfully');
            showMessage('تم إضافة السؤال بنجاح!', 'success');
            closeModal();
            loadAdminPharmaHub();
        } else {
            const errorData = await response.json();
            console.error('❌ API error:', errorData);
            showMessage(`حدث خطأ: ${errorData.error || 'خطأ غير معروف'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        showMessage('حدث خطأ في الاتصال', 'error');
    }
}

// View Pharma Hub question details
async function viewPharmaHubQuestion(questionId) {
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions/${questionId}`);
        const data = await response.json();
        
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal large-modal">
                    <div class="modal-header">
                        <h3><i class="fas fa-question-circle"></i> تفاصيل السؤال</h3>
                        <button class="close-btn" onclick="closeModal()">&times;</button>
                    </div>
                    <div class="question-details">
                        <h4>${data.question.title}</h4>
                        <div class="question-meta">
                            <span class="category-badge">${getCategoryName(data.question.category)}</span>
                            <span class="author">بواسطة: ${data.question.author}</span>
                            <span class="date">${new Date(data.question.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div class="question-content">
                            <p>${data.question.content}</p>
                        </div>
                        <div class="question-stats">
                            <span><i class="fas fa-eye"></i> ${data.question.views || 0} مشاهدة</span>
                            <span><i class="fas fa-comments"></i> ${data.comments.length} إجابة</span>
                        </div>
                        
                        <h5>الإجابات والتعليقات:</h5>
                        <div class="comments-section">
                            ${data.comments.length > 0 ? 
                                data.comments.map(comment => `
                                    <div class="comment" id="comment-${comment.id}">
                                        <div class="comment-header">
                                            <strong>${comment.author}</strong>
                                            <span>${new Date(comment.created_at).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                        <p>${comment.content}</p>
                                        <div class="comment-actions">
                                            <button class="btn btn-danger btn-sm" onclick="deleteComment(${comment.id}, ${questionId})">
                                                <i class="fas fa-trash"></i> حذف الإجابة
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : 
                                '<p class="no-comments">لا توجد إجابات بعد</p>'
                            }
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="editPharmaHubQuestion(${questionId})">
                            <i class="fas fa-edit"></i> تعديل السؤال
                        </button>
                        <button class="btn btn-danger" onclick="deletePharmaHubQuestion(${questionId})">
                            <i class="fas fa-trash"></i> حذف السؤال
                        </button>
                        <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error viewing question:', error);
        showMessage('حدث خطأ في عرض السؤال', 'error');
    }
}

// Delete Pharma Hub question
async function deletePharmaHubQuestion(questionId) {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟ سيتم حذف جميع التعليقات المرتبطة به أيضاً.')) {
        return;
    }
    
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions/${questionId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('تم حذف السؤال بنجاح!', 'success');
            loadAdminPharmaHub();
        } else {
            const errorData = await response.json();
            showMessage(`حدث خطأ: ${errorData.error || 'خطأ غير معروف'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting question:', error);
        showMessage('حدث خطأ في الاتصال', 'error');
    }
}

// Helper function to get category name in Arabic
function getCategoryName(category) {
    const categories = {
        'pharmacology': 'علم الأدوية',
        'pharmaceutical-chemistry': 'الكيمياء الصيدلية',
        'pharmaceutics': 'الصيدلة الصناعية',
        'clinical-pharmacy': 'الصيدلة الإكلينيكية',
        'pharmacognosy': 'علم العقاقير',
        'drug-analysis': 'تحليل الأدوية',
        'research-methods': 'مناهج البحث',
        'general': 'عام'
    };
    return categories[category] || category;
}

// Delete comment from Pharma Hub
async function deleteComment(commentId, questionId) {
    if (!confirm('هل أنت متأكد من حذف هذه الإجابة؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/comments/${commentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('تم حذف الإجابة بنجاح!', 'success');
            // Remove comment from DOM
            const commentElement = document.getElementById(`comment-${commentId}`);
            if (commentElement) {
                commentElement.remove();
            }
            // Refresh question details
            await viewPharmaHubQuestion(questionId);
        } else {
            throw new Error('Failed to delete comment');
        }
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        showMessage('حدث خطأ في حذف الإجابة', 'error');
    }
}

// Edit Pharma Hub question
async function editPharmaHubQuestion(questionId) {
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions/${questionId}`);
        const data = await response.json();
        const question = data.question;
        
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-edit"></i> تعديل السؤال</h3>
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                    </div>
                    <form id="editQuestionForm" class="form">
                        <div class="form-group">
                            <label for="editQuestionTitle">عنوان السؤال</label>
                            <input type="text" id="editQuestionTitle" name="title" value="${question.title}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="editQuestionContent">محتوى السؤال</label>
                            <textarea id="editQuestionContent" name="content" rows="6" required>${question.content}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="editQuestionCategory">التصنيف</label>
                            <select id="editQuestionCategory" name="category" required>
                                <option value="pharmacology" ${question.category === 'pharmacology' ? 'selected' : ''}>علم الأدوية</option>
                                <option value="pharmaceutical-chemistry" ${question.category === 'pharmaceutical-chemistry' ? 'selected' : ''}>الكيمياء الصيدلية</option>
                                <option value="pharmaceutics" ${question.category === 'pharmaceutics' ? 'selected' : ''}>الصيدلة الصناعية</option>
                                <option value="clinical-pharmacy" ${question.category === 'clinical-pharmacy' ? 'selected' : ''}>الصيدلة الإكلينيكية</option>
                                <option value="pharmacognosy" ${question.category === 'pharmacognosy' ? 'selected' : ''}>علم العقاقير</option>
                                <option value="drug-analysis" ${question.category === 'drug-analysis' ? 'selected' : ''}>تحليل الأدوية</option>
                                <option value="research-methods" ${question.category === 'research-methods' ? 'selected' : ''}>مناهج البحث</option>
                                <option value="general" ${question.category === 'general' ? 'selected' : ''}>عام</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="editQuestionAuthor">المؤلف</label>
                            <input type="text" id="editQuestionAuthor" name="author" value="${question.author}">
                        </div>
                        
                        <div class="form-group">
                            <label for="editQuestionTags">العلامات (مفصولة بفواصل)</label>
                            <input type="text" id="editQuestionTags" name="tags" value="${question.tags ? JSON.parse(question.tags).join(', ') : ''}" placeholder="مثال: دواء, صيدلة, علاج">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                            <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add form submission handler
        document.getElementById('editQuestionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updatePharmaHubQuestion(questionId, e.target);
        });
        
    } catch (error) {
        console.error('Error loading question for edit:', error);
        showMessage('حدث خطأ في تحميل السؤال للتعديل', 'error');
    }
}

// Update Pharma Hub question
async function updatePharmaHubQuestion(questionId, form) {
    const formData = new FormData(form);
    const tags = formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    try {
        const response = await apiCall(`${API_BASE.replace('/admin', '/pharma-hub')}/questions/${questionId}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category'),
                author: formData.get('author'),
                tags: tags
            })
        });
        
        if (response.ok) {
            showMessage('تم تحديث السؤال بنجاح!', 'success');
            closeModal();
            loadAdminPharmaHub(); // Refresh the questions list
        } else {
            throw new Error('Failed to update question');
        }
        
    } catch (error) {
        console.error('Error updating question:', error);
        showMessage('حدث خطأ في تحديث السؤال', 'error');
    }
}

// ==================== JOBS MANAGEMENT ====================

// Load Jobs Management Tab
async function loadJobsManagement() {
    console.log('💼 Loading Jobs Management...');
    
    try {
        const response = await apiCall('http://localhost:3001/api/jobs/admin/all');
        const data = await response.json();
        
        if (data.success) {
            displayJobsManagement(data.data);
        } else {
            showMessage('خطأ في تحميل الوظائف: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Display Jobs Management
function displayJobsManagement(jobs) {
    const content = `
        <div class="section-header">
            <h2><i class="fas fa-briefcase"></i> إدارة الوظائف</h2>
            <p>هنا يمكنك إدارة الوظائف المتاحة</p>
            <button class="btn btn-primary" onclick="showAddJobModal()">
                <i class="fas fa-plus"></i> إضافة وظيفة جديدة
            </button>
        </div>
        
        <div class="data-table">
            <div class="table-header">
                <div class="table-row">
                    <div>العنوان</div>
                    <div>النوع</div>
                    <div>الراتب</div>
                    <div>الحالة</div>
                    <div>الإجراءات</div>
                </div>
            </div>
            ${jobs.length > 0 ? 
                jobs.map(job => `
                    <div class="table-row">
                        <div>${job.title}</div>
                        <div>${job.type}</div>
                        <div>${job.salary}</div>
                        <div><span class="status ${job.status}">${job.status}</span></div>
                        <div class="actions">
                            <button class="btn btn-primary btn-sm" onclick="editJob(${job.id})">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                `).join('') : 
                '<div class="no-data">لا توجد وظائف</div>'
            }
        </div>
    `;
    
    document.getElementById('tabContent').innerHTML = content;
}

// Show Add Job Modal
function showAddJobModal() {
    const modal = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-briefcase"></i> إضافة وظيفة جديدة</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="jobForm" class="form" onsubmit="submitJob(event)">
                    <div class="form-group">
                        <label for="jobTitle">عنوان الوظيفة *</label>
                        <input 
                            type="text" 
                            id="jobTitle" 
                            class="form-control"
                            placeholder="اكتب عنوان الوظيفة هنا"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobType">نوع العمل *</label>
                        <select id="jobType" class="form-control" required>
                            <option value="">اختر نوع العمل</option>
                            <option value="دوام كامل">دوام كامل</option>
                            <option value="دوام جزئي">دوام جزئي</option>
                            <option value="عقد مؤقت">عقد مؤقت</option>
                            <option value="عمل عن بُعد">عمل عن بُعد</option>
                            <option value="تدريب">تدريب</option>
                            <option value="تطوع">تطوع</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="jobSalary">الراتب *</label>
                        <input 
                            type="text" 
                            id="jobSalary" 
                            class="form-control"
                            placeholder="مثال: 5000-8000 جنيه مصري شهرياً"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobDeadline">آخر موعد للتقديم *</label>
                        <input 
                            type="date" 
                            id="jobDeadline" 
                            class="form-control"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobExperience">الخبرة المطلوبة *</label>
                        <input 
                            type="text" 
                            id="jobExperience" 
                            class="form-control"
                            placeholder="مثال: خبرة 2-3 سنوات في مجال الصيدلة"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobQualification">المؤهل المطلوب *</label>
                        <input 
                            type="text" 
                            id="jobQualification" 
                            class="form-control"
                            placeholder="مثال: بكالوريوس صيدلة"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobDescription">وصف الوظيفة *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                                    🔗
                                </button>
                                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                                    H3
                                </button>
                            </div>
                            <div 
                                id="jobDescription" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                placeholder="اكتب وصف الوظيفة هنا..."
                                style="min-height: 150px; max-height: 300px; overflow-y: auto;"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="jobRequirements">المتطلبات</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="jobRequirements" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                placeholder="اكتب المتطلبات هنا (كل متطلب في سطر منفصل)..."
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="jobBenefits">المميزات</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="jobBenefits" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                placeholder="اكتب المميزات هنا (كل ميزة في سطر منفصل)..."
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="jobKeywords">الكلمات المفتاحية</label>
                        <input 
                            type="text" 
                            id="jobKeywords"
                            class="form-control" 
                            placeholder="كلمات مفصولة بفواصل (مثال: صيدلة، وظيفة، دوام كامل)"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="jobFiles">ملفات مرفقة (صور، مستندات)</label>
                        <div class="file-upload-container">
                            <div class="file-upload-area" id="jobFileUploadArea">
                                <div class="file-upload-icon">📁</div>
                                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                                <div class="file-upload-hint">يدعم: JPG, PNG, PDF, DOC, DOCX (الحد الأقصى: 5 ملفات)</div>
                                <input type="file" id="jobFiles" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="file-preview-container" id="jobFilePreview"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="jobStatus">الحالة</label>
                        <select id="jobStatus" class="form-control">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                            <option value="closed">مغلق</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ الوظيفة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modal;
    
    // Initialize rich text editor
    initializeRichTextEditor();
    
    // Initialize file upload
    initializeFileUpload('jobFileUploadArea', 'jobFiles', 'jobFilePreview');
}

// Submit Job
async function submitJob(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('jobTitle').value,
        type: document.getElementById('jobType').value,
        salary: document.getElementById('jobSalary').value,
        deadline: document.getElementById('jobDeadline').value,
        experience: document.getElementById('jobExperience').value,
        qualification: document.getElementById('jobQualification').value,
        description: document.getElementById('jobDescription').innerHTML,
        requirements: document.getElementById('jobRequirements').innerHTML,
        benefits: document.getElementById('jobBenefits').innerHTML,
        keywords: document.getElementById('jobKeywords').value,
        status: document.getElementById('jobStatus').value
    };
    
    try {
        const response = await apiCall('http://localhost:3001/api/jobs', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم إضافة الوظيفة بنجاح!', 'success');
            closeModal();
            loadJobsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting job:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Edit Job
async function editJob(jobId) {
    try {
        const response = await apiCall(`http://localhost:3001/api/jobs/${jobId}`);
        const data = await response.json();
        
        if (data.success) {
            showEditJobModal(data.data);
        } else {
            showMessage('خطأ في تحميل الوظيفة: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading job:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Show Edit Job Modal
function showEditJobModal(job) {
    const modal = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل الوظيفة</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="editJobForm" class="form" onsubmit="updateJob(event, ${job.id})">
                    <div class="form-group">
                        <label for="editJobTitle">عنوان الوظيفة *</label>
                        <input 
                            type="text" 
                            id="editJobTitle" 
                            class="form-control"
                            value="${job.title}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobType">نوع العمل *</label>
                        <select id="editJobType" class="form-control" required>
                            <option value="">اختر نوع العمل</option>
                            <option value="دوام كامل" ${job.type === 'دوام كامل' ? 'selected' : ''}>دوام كامل</option>
                            <option value="دوام جزئي" ${job.type === 'دوام جزئي' ? 'selected' : ''}>دوام جزئي</option>
                            <option value="عقد مؤقت" ${job.type === 'عقد مؤقت' ? 'selected' : ''}>عقد مؤقت</option>
                            <option value="عمل عن بُعد" ${job.type === 'عمل عن بُعد' ? 'selected' : ''}>عمل عن بُعد</option>
                            <option value="تدريب" ${job.type === 'تدريب' ? 'selected' : ''}>تدريب</option>
                            <option value="تطوع" ${job.type === 'تطوع' ? 'selected' : ''}>تطوع</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobSalary">الراتب *</label>
                        <input 
                            type="text" 
                            id="editJobSalary" 
                            class="form-control"
                            value="${job.salary}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobDeadline">آخر موعد للتقديم *</label>
                        <input 
                            type="date" 
                            id="editJobDeadline" 
                            class="form-control"
                            value="${job.deadline}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobExperience">الخبرة المطلوبة *</label>
                        <input 
                            type="text" 
                            id="editJobExperience" 
                            class="form-control"
                            value="${job.experience}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobQualification">المؤهل المطلوب *</label>
                        <input 
                            type="text" 
                            id="editJobQualification" 
                            class="form-control"
                            value="${job.qualification}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobDescription">وصف الوظيفة *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                                    🔗
                                </button>
                                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                                    H3
                                </button>
                            </div>
                            <div 
                                id="editJobDescription" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                style="min-height: 150px; max-height: 300px; overflow-y: auto;"
                            >${job.description}</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobRequirements">المتطلبات</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="editJobRequirements" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            >${Array.isArray(job.requirements) ? job.requirements.join('<br>') : job.requirements}</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobBenefits">المميزات</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="editJobBenefits" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            >${Array.isArray(job.benefits) ? job.benefits.join('<br>') : job.benefits}</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobKeywords">الكلمات المفتاحية</label>
                        <input 
                            type="text" 
                            id="editJobKeywords"
                            class="form-control" 
                            value="${job.keywords || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editJobStatus">الحالة</label>
                        <select id="editJobStatus" class="form-control">
                            <option value="active" ${job.status === 'active' ? 'selected' : ''}>نشط</option>
                            <option value="inactive" ${job.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                            <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>مغلق</option>
                            <option value="draft" ${job.status === 'draft' ? 'selected' : ''}>مسودة</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modal;
    
    // Initialize rich text editor
    initializeRichTextEditor();
}

// Update Job
async function updateJob(event, jobId) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('editJobTitle').value,
        type: document.getElementById('editJobType').value,
        salary: document.getElementById('editJobSalary').value,
        deadline: document.getElementById('editJobDeadline').value,
        experience: document.getElementById('editJobExperience').value,
        qualification: document.getElementById('editJobQualification').value,
        description: document.getElementById('editJobDescription').innerHTML,
        requirements: document.getElementById('editJobRequirements').innerHTML,
        benefits: document.getElementById('editJobBenefits').innerHTML,
        keywords: document.getElementById('editJobKeywords').value,
        status: document.getElementById('editJobStatus').value
    };
    
    try {
        const response = await apiCall(`http://localhost:3001/api/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم تحديث الوظيفة بنجاح!', 'success');
            closeModal();
            loadJobsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error updating job:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Delete Job
async function deleteJob(jobId) {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`http://localhost:3001/api/jobs/${jobId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم حذف الوظيفة بنجاح!', 'success');
            loadJobsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// ==================== ANNOUNCEMENTS MANAGEMENT ====================

// Load Announcements Management Tab
async function loadAnnouncementsManagement() {
    console.log('📢 Loading Announcements Management...');
    
    try {
        const response = await apiCall('http://localhost:3001/api/announcements/admin/all');
        const data = await response.json();
        
        if (data.success) {
            displayAnnouncementsManagement(data.data);
        } else {
            showMessage('خطأ في تحميل الإعلانات: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Display Announcements Management
function displayAnnouncementsManagement(announcements) {
    const content = `
        <div class="section-header">
            <h2><i class="fas fa-bullhorn"></i> إدارة الإعلانات</h2>
            <p>هنا يمكنك إدارة الإعلانات</p>
            <button class="btn btn-primary" onclick="showAddAnnouncementModal()">
                <i class="fas fa-plus"></i> إضافة إعلان جديد
            </button>
        </div>
        
        <div class="data-table">
            <div class="table-header">
                <div class="table-row">
                    <div>العنوان</div>
                    <div>النوع</div>
                    <div>التاريخ</div>
                    <div>الحالة</div>
                    <div>الإجراءات</div>
                </div>
            </div>
            ${announcements.length > 0 ? 
                announcements.map(announcement => `
                    <div class="table-row">
                        <div>${announcement.title}</div>
                        <div>${announcement.type}</div>
                        <div>${announcement.date}</div>
                        <div><span class="status ${announcement.status}">${announcement.status}</span></div>
                        <div class="actions">
                            <button class="btn btn-primary btn-sm" onclick="editAnnouncement(${announcement.id})">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${announcement.id})">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                `).join('') : 
                '<div class="no-data">لا توجد إعلانات</div>'
            }
        </div>
    `;
    
    document.getElementById('tabContent').innerHTML = content;
}

// Show Add Announcement Modal
function showAddAnnouncementModal() {
    const modal = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-bullhorn"></i> إضافة إعلان جديد</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="announcementForm" class="form" onsubmit="submitAnnouncement(event)">
                    <div class="form-group">
                        <label for="announcementTitle">عنوان الإعلان *</label>
                        <input 
                            type="text" 
                            id="announcementTitle" 
                            class="form-control"
                            placeholder="اكتب عنوان الإعلان هنا"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementType">نوع الإعلان *</label>
                        <select id="announcementType" class="form-control" required>
                            <option value="">اختر نوع الإعلان</option>
                            <option value="مهم">مهم</option>
                            <option value="ورشة عمل">ورشة عمل</option>
                            <option value="تطوع">تطوع</option>
                            <option value="مسابقة">مسابقة</option>
                            <option value="ندوة">ندوة</option>
                            <option value="مؤتمر">مؤتمر</option>
                            <option value="دورة تدريبية">دورة تدريبية</option>
                            <option value="عام">عام</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDate">تاريخ الإعلان *</label>
                        <input 
                            type="date" 
                            id="announcementDate" 
                            class="form-control"
                            value="${new Date().toISOString().slice(0, 10)}"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDeadline">آخر موعد</label>
                        <input 
                            type="date" 
                            id="announcementDeadline" 
                            class="form-control"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementLevel">المستوى</label>
                        <select id="announcementLevel" class="form-control">
                            <option value="">اختر المستوى</option>
                            <option value="طلاب البكالوريوس">طلاب البكالوريوس</option>
                            <option value="طلاب الدراسات العليا">طلاب الدراسات العليا</option>
                            <option value="أعضاء هيئة التدريس">أعضاء هيئة التدريس</option>
                            <option value="جميع المستويات">جميع المستويات</option>
                            <option value="عام">عام</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementLocation">المكان</label>
                        <input 
                            type="text" 
                            id="announcementLocation" 
                            class="form-control"
                            placeholder="مثال: قاعة المؤتمرات - مبنى الكلية"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDuration">المدة</label>
                        <input 
                            type="text" 
                            id="announcementDuration" 
                            class="form-control"
                            placeholder="مثال: 3 أيام، ساعتين، أسبوع"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementField">المجال</label>
                        <input 
                            type="text" 
                            id="announcementField" 
                            class="form-control"
                            placeholder="مثال: علم الأدوية، الكيمياء التحليلية"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementPrize">الجائزة/الشهادة</label>
                        <input 
                            type="text" 
                            id="announcementPrize" 
                            class="form-control"
                            placeholder="مثال: شهادة مشاركة، جائزة مالية"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDescription">الوصف المختصر *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="announcementDescription" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                placeholder="اكتب وصف مختصر للإعلان هنا..."
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDetails">التفاصيل الكاملة *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                                    🔗
                                </button>
                                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                                    H3
                                </button>
                            </div>
                            <div 
                                id="announcementDetails" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                placeholder="اكتب التفاصيل الكاملة للإعلان هنا..."
                                style="min-height: 150px; max-height: 300px; overflow-y: auto;"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementKeywords">الكلمات المفتاحية</label>
                        <input 
                            type="text" 
                            id="announcementKeywords"
                            class="form-control" 
                            placeholder="كلمات مفصولة بفواصل (مثال: ورشة عمل، صيدلة، تدريب)"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementFiles">ملفات مرفقة (صور، مستندات)</label>
                        <div class="file-upload-container">
                            <div class="file-upload-area" id="announcementFileUploadArea">
                                <div class="file-upload-icon">📁</div>
                                <div class="file-upload-text">اسحب الملفات هنا أو اضغط للاختيار</div>
                                <div class="file-upload-hint">يدعم: JPG, PNG, PDF, DOC, DOCX (الحد الأقصى: 5 ملفات)</div>
                                <input type="file" id="announcementFiles" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style="display: none;">
                            </div>
                            <div class="file-preview-container" id="announcementFilePreview"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementStatus">الحالة</label>
                        <select id="announcementStatus" class="form-control">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                            <option value="expired">منتهي الصلاحية</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ الإعلان
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modal;
    
    // Initialize rich text editor
    initializeRichTextEditor();
    
    // Initialize file upload
    initializeFileUpload('announcementFileUploadArea', 'announcementFiles', 'announcementFilePreview');
}

// Submit Announcement
async function submitAnnouncement(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('announcementTitle').value,
        type: document.getElementById('announcementType').value,
        date: document.getElementById('announcementDate').value,
        deadline: document.getElementById('announcementDeadline').value || null,
        level: document.getElementById('announcementLevel').value || null,
        location: document.getElementById('announcementLocation').value || null,
        duration: document.getElementById('announcementDuration').value || null,
        field: document.getElementById('announcementField').value || null,
        prize: document.getElementById('announcementPrize').value || null,
        description: document.getElementById('announcementDescription').innerHTML,
        details: document.getElementById('announcementDetails').innerHTML,
        requirements: [], // Empty array for now
        benefits: [], // Empty array for now
        topics: [], // Empty array for now
        speakers: [], // Empty array for now
        activities: [], // Empty array for now
        prizes: [], // Empty array for now
        criteria: [], // Empty array for now
        keywords: document.getElementById('announcementKeywords').value,
        status: document.getElementById('announcementStatus').value
    };
    
    try {
        const response = await apiCall('http://localhost:3001/api/announcements', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم إضافة الإعلان بنجاح!', 'success');
            closeModal();
            loadAnnouncementsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting announcement:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Edit Announcement
async function editAnnouncement(announcementId) {
    try {
        const response = await apiCall(`http://localhost:3001/api/announcements/${announcementId}`);
        const data = await response.json();
        
        if (data.success) {
            showEditAnnouncementModal(data.data);
        } else {
            showMessage('خطأ في تحميل الإعلان: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading announcement:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Show Edit Announcement Modal
function showEditAnnouncementModal(announcement) {
    const modal = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل الإعلان</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="editAnnouncementForm" class="form" onsubmit="updateAnnouncement(event, ${announcement.id})">
                    <div class="form-group">
                        <label for="editAnnouncementTitle">عنوان الإعلان *</label>
                        <input 
                            type="text" 
                            id="editAnnouncementTitle" 
                            class="form-control"
                            value="${announcement.title}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementType">نوع الإعلان *</label>
                        <select id="editAnnouncementType" class="form-control" required>
                            <option value="">اختر نوع الإعلان</option>
                            <option value="مهم" ${announcement.type === 'مهم' ? 'selected' : ''}>مهم</option>
                            <option value="ورشة عمل" ${announcement.type === 'ورشة عمل' ? 'selected' : ''}>ورشة عمل</option>
                            <option value="تطوع" ${announcement.type === 'تطوع' ? 'selected' : ''}>تطوع</option>
                            <option value="مسابقة" ${announcement.type === 'مسابقة' ? 'selected' : ''}>مسابقة</option>
                            <option value="ندوة" ${announcement.type === 'ندوة' ? 'selected' : ''}>ندوة</option>
                            <option value="مؤتمر" ${announcement.type === 'مؤتمر' ? 'selected' : ''}>مؤتمر</option>
                            <option value="دورة تدريبية" ${announcement.type === 'دورة تدريبية' ? 'selected' : ''}>دورة تدريبية</option>
                            <option value="عام" ${announcement.type === 'عام' ? 'selected' : ''}>عام</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDate">تاريخ الإعلان *</label>
                        <input 
                            type="date" 
                            id="editAnnouncementDate" 
                            class="form-control"
                            value="${announcement.date}" 
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDeadline">آخر موعد</label>
                        <input 
                            type="date" 
                            id="editAnnouncementDeadline" 
                            class="form-control"
                            value="${announcement.deadline || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementLevel">المستوى</label>
                        <select id="editAnnouncementLevel" class="form-control">
                            <option value="">اختر المستوى</option>
                            <option value="طلاب البكالوريوس" ${announcement.level === 'طلاب البكالوريوس' ? 'selected' : ''}>طلاب البكالوريوس</option>
                            <option value="طلاب الدراسات العليا" ${announcement.level === 'طلاب الدراسات العليا' ? 'selected' : ''}>طلاب الدراسات العليا</option>
                            <option value="أعضاء هيئة التدريس" ${announcement.level === 'أعضاء هيئة التدريس' ? 'selected' : ''}>أعضاء هيئة التدريس</option>
                            <option value="جميع المستويات" ${announcement.level === 'جميع المستويات' ? 'selected' : ''}>جميع المستويات</option>
                            <option value="عام" ${announcement.level === 'عام' ? 'selected' : ''}>عام</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementLocation">المكان</label>
                        <input 
                            type="text" 
                            id="editAnnouncementLocation" 
                            class="form-control"
                            value="${announcement.location || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDuration">المدة</label>
                        <input 
                            type="text" 
                            id="editAnnouncementDuration" 
                            class="form-control"
                            value="${announcement.duration || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementField">المجال</label>
                        <input 
                            type="text" 
                            id="editAnnouncementField" 
                            class="form-control"
                            value="${announcement.field || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementPrize">الجائزة/الشهادة</label>
                        <input 
                            type="text" 
                            id="editAnnouncementPrize" 
                            class="form-control"
                            value="${announcement.prize || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDescription">الوصف المختصر *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                            </div>
                            <div 
                                id="editAnnouncementDescription" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                style="min-height: 100px; max-height: 200px; overflow-y: auto;"
                            >${announcement.description}</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDetails">التفاصيل الكاملة *</label>
                        <div class="rich-editor-container">
                            <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn" data-command="bold" title="عريض">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="italic" title="مائل">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-command="underline" title="تحت خط">
                                    <u>U</u>
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="قائمة نقطية">
                                    • List
                                </button>
                                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="قائمة مرقمة">
                                    1. List
                                </button>
                                <div class="toolbar-separator"></div>
                                <button type="button" class="toolbar-btn" data-command="createLink" title="إضافة رابط">
                                    🔗
                                </button>
                                <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="عنوان فرعي">
                                    H3
                                </button>
                            </div>
                            <div 
                                id="editAnnouncementDetails" 
                                class="rich-editor-content form-control" 
                                contenteditable="true"
                                style="min-height: 150px; max-height: 300px; overflow-y: auto;"
                            >${announcement.details}</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementKeywords">الكلمات المفتاحية</label>
                        <input 
                            type="text" 
                            id="editAnnouncementKeywords"
                            class="form-control" 
                            value="${announcement.keywords || ''}"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementStatus">الحالة</label>
                        <select id="editAnnouncementStatus" class="form-control">
                            <option value="active" ${announcement.status === 'active' ? 'selected' : ''}>نشط</option>
                            <option value="inactive" ${announcement.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                            <option value="expired" ${announcement.status === 'expired' ? 'selected' : ''}>منتهي الصلاحية</option>
                            <option value="draft" ${announcement.status === 'draft' ? 'selected' : ''}>مسودة</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modal;
    
    // Initialize rich text editor
    initializeRichTextEditor();
}

// Update Announcement
async function updateAnnouncement(event, announcementId) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('editAnnouncementTitle').value,
        type: document.getElementById('editAnnouncementType').value,
        date: document.getElementById('editAnnouncementDate').value,
        deadline: document.getElementById('editAnnouncementDeadline').value || null,
        level: document.getElementById('editAnnouncementLevel').value || null,
        location: document.getElementById('editAnnouncementLocation').value || null,
        duration: document.getElementById('editAnnouncementDuration').value || null,
        field: document.getElementById('editAnnouncementField').value || null,
        prize: document.getElementById('editAnnouncementPrize').value || null,
        description: document.getElementById('editAnnouncementDescription').innerHTML,
        details: document.getElementById('editAnnouncementDetails').innerHTML,
        keywords: document.getElementById('editAnnouncementKeywords').value,
        status: document.getElementById('editAnnouncementStatus').value
    };
    
    try {
        const response = await apiCall(`http://localhost:3001/api/announcements/${announcementId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم تحديث الإعلان بنجاح!', 'success');
            closeModal();
            loadAnnouncementsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error updating announcement:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Delete Announcement
async function deleteAnnouncement(announcementId) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`http://localhost:3001/api/announcements/${announcementId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم حذف الإعلان بنجاح!', 'success');
            loadAnnouncementsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// ==================== INTERNSHIPS MANAGEMENT ====================

// Load Internships Management Tab
async function loadInternshipsManagement() {
    console.log('🎓 Loading Internships Management...');
    
    const container = document.getElementById('internshipsTableContainer');
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    container.innerHTML = '<div class="loading">جاري تحميل فرص التدريب...</div>';
    
    try {
        const response = await apiCall('http://localhost:3001/api/internships/admin/all');
        const data = await response.json();
        
        if (data.success) {
            displayInternshipsManagement(data.data);
        } else {
            container.innerHTML = '<div class="error">خطأ في تحميل فرص التدريب: ' + data.message + '</div>';
        }
    } catch (error) {
        console.error('Error loading internships:', error);
        container.innerHTML = '<div class="error">خطأ في الاتصال: ' + error.message + '</div>';
    }
}

// Display Internships Management
function displayInternshipsManagement(internships) {
    const container = document.getElementById('internshipsTableContainer');
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    if (!internships || internships.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد فرص تدريب متاحة</div>';
        return;
    }
    
    const content = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th><i class="fas fa-graduation-cap"></i> العنوان</th>
                    <th><i class="fas fa-tags"></i> النوع</th>
                    <th><i class="fas fa-clock"></i> المدة</th>
                    <th><i class="fas fa-calendar-alt"></i> الموعد النهائي</th>
                    <th><i class="fas fa-toggle-on"></i> الحالة</th>
                    <th><i class="fas fa-cogs"></i> الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${internships.map(internship => `
                    <tr>
                        <td>
                            <div class="title-cell">
                                <strong class="item-title">${internship.title}</strong>
                                <div class="content-preview">${internship.description ? internship.description.substring(0, 80) + '...' : 'لا يوجد وصف'}</div>
                            </div>
                        </td>
                        <td>
                            <span class="type-badge type-${(internship.type || 'غير محدد').toLowerCase().replace(/\s+/g, '-')}">
                                <i class="fas fa-tag"></i> ${internship.type || 'غير محدد'}
                            </span>
                        </td>
                        <td>
                            <span class="duration-cell">
                                <i class="fas fa-hourglass-half"></i>
                                ${internship.duration || 'غير محدد'}
                            </span>
                        </td>
                        <td>
                            <span class="deadline-cell">
                                <i class="fas fa-calendar-check"></i>
                                ${internship.deadline || 'غير محدد'}
                            </span>
                        </td>
                        <td>
                            <span class="status-badge status-${internship.status || 'active'}">
                                <i class="fas fa-${internship.status === 'active' ? 'check-circle' : 
                                  internship.status === 'inactive' ? 'times-circle' :
                                  internship.status === 'closed' ? 'lock' : 'draft'}"></i>
                                ${internship.status === 'active' ? 'نشط' : 
                                  internship.status === 'inactive' ? 'غير نشط' :
                                  internship.status === 'closed' ? 'مغلق' : 'مسودة'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-edit" onclick="showEditInternshipModal(${internship.id})" title="تعديل فرصة التدريب">
                                    <i class="fas fa-edit"></i>
                                    <span>تعديل</span>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteInternship(${internship.id})" title="حذف فرصة التدريب">
                                    <i class="fas fa-trash"></i>
                                    <span>حذف</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = content;
}

// Show Add Internship Modal
function showAddInternshipModal() {
    const modal = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-graduation-cap"></i> إضافة فرصة تدريب جديدة</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="internshipForm" class="modal-form" onsubmit="submitInternship(event)">
                    <div class="form-group">
                        <label for="internshipTitle">
                            <i class="fas fa-heading"></i>
                            عنوان فرصة التدريب *
                        </label>
                        <input type="text" id="internshipTitle" class="form-control" required 
                               placeholder="مثال: تدريب صيدلة إكلينيكية في مستشفى الجامعة...">
                    </div>
                    <div class="form-group">
                        <label for="internshipType">
                            <i class="fas fa-tags"></i>
                            نوع التدريب *
                        </label>
                        <select id="internshipType" class="form-control" required>
                            <option value="">اختر نوع التدريب المناسب</option>
                            <option value="صيدلة إكلينيكية">صيدلة إكلينيكية</option>
                            <option value="صيدلة صناعية">صيدلة صناعية</option>
                            <option value="صيدلة مجتمعية">صيدلة مجتمعية</option>
                            <option value="أبحاث دوائية">أبحاث دوائية</option>
                            <option value="مراقبة جودة">مراقبة جودة</option>
                            <option value="صيدلة مستشفيات">صيدلة مستشفيات</option>
                            <option value="صيدلة صيدليات">صيدلة صيدليات</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="internshipDuration">
                            <i class="fas fa-clock"></i>
                            مدة التدريب *
                        </label>
                        <select id="internshipDuration" class="form-control" required>
                            <option value="">اختر المدة المناسبة</option>
                            <option value="شهر واحد">شهر واحد</option>
                            <option value="شهرين">شهرين</option>
                            <option value="3 أشهر">3 أشهر</option>
                            <option value="6 أشهر">6 أشهر</option>
                            <option value="سنة">سنة</option>
                            <option value="سنتين">سنتين</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="internshipDeadline">
                            <i class="fas fa-calendar-alt"></i>
                            الموعد النهائي للتقديم *
                        </label>
                        <input type="date" id="internshipDeadline" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="internshipDescription">
                            <i class="fas fa-align-right"></i>
                            وصف فرصة التدريب *
                        </label>
                        <textarea id="internshipDescription" class="form-control" rows="4" required 
                                  placeholder="اكتب وصفاً مفصلاً عن فرصة التدريب والمهام المطلوبة..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="internshipRequirements">
                            <i class="fas fa-list-check"></i>
                            المتطلبات
                        </label>
                        <textarea id="internshipRequirements" class="form-control" rows="3" 
                                  placeholder="اذكر المتطلبات والشروط المطلوبة للمتقدمين..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="internshipBenefits">
                            <i class="fas fa-gift"></i>
                            المزايا
                        </label>
                        <textarea id="internshipBenefits" class="form-control" rows="3" 
                                  placeholder="اذكر المزايا والفوائد التي سيحصل عليها المتدرب..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="internshipStatus">
                            <i class="fas fa-toggle-on"></i>
                            الحالة
                        </label>
                        <select id="internshipStatus" class="form-control">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                            <option value="closed">مغلق</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i>
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            حفظ فرصة التدريب
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modal;
}

// Submit Internship
async function submitInternship(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('internshipTitle').value,
        type: document.getElementById('internshipType').value,
        duration: document.getElementById('internshipDuration').value,
        deadline: document.getElementById('internshipDeadline').value,
        description: document.getElementById('internshipDescription').value,
        requirements: document.getElementById('internshipRequirements').value,
        benefits: document.getElementById('internshipBenefits').value,
        status: document.getElementById('internshipStatus').value
    };
    
    try {
        const response = await apiCall('http://localhost:3001/api/internships', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم إضافة فرصة التدريب بنجاح!', 'success');
            closeModal();
            loadInternshipsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error adding internship:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Show Edit Internship Modal
async function showEditInternshipModal(internshipId) {
    try {
        const response = await apiCall(`http://localhost:3001/api/internships/${internshipId}`);
        const data = await response.json();
        
        if (data.success) {
            const internship = data.data;
            const modal = `
                <div class="modal-overlay" onclick="closeModal()">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h3><i class="fas fa-edit"></i> تعديل فرصة التدريب</h3>
                            <button class="modal-close" onclick="closeModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form id="internshipForm" class="modal-form" onsubmit="updateInternship(event, ${internshipId})">
                            <div class="form-group">
                                <label for="internshipTitle">
                                    <i class="fas fa-heading"></i>
                                    عنوان فرصة التدريب *
                                </label>
                                <input type="text" id="internshipTitle" class="form-control" value="${internship.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="internshipType">
                                    <i class="fas fa-tags"></i>
                                    نوع التدريب *
                                </label>
                                <select id="internshipType" class="form-control" required>
                                    <option value="">اختر نوع التدريب المناسب</option>
                                    <option value="صيدلة إكلينيكية" ${internship.type === 'صيدلة إكلينيكية' ? 'selected' : ''}>صيدلة إكلينيكية</option>
                                    <option value="صيدلة صناعية" ${internship.type === 'صيدلة صناعية' ? 'selected' : ''}>صيدلة صناعية</option>
                                    <option value="صيدلة مجتمعية" ${internship.type === 'صيدلة مجتمعية' ? 'selected' : ''}>صيدلة مجتمعية</option>
                                    <option value="أبحاث دوائية" ${internship.type === 'أبحاث دوائية' ? 'selected' : ''}>أبحاث دوائية</option>
                                    <option value="مراقبة جودة" ${internship.type === 'مراقبة جودة' ? 'selected' : ''}>مراقبة جودة</option>
                                    <option value="صيدلة مستشفيات" ${internship.type === 'صيدلة مستشفيات' ? 'selected' : ''}>صيدلة مستشفيات</option>
                                    <option value="صيدلة صيدليات" ${internship.type === 'صيدلة صيدليات' ? 'selected' : ''}>صيدلة صيدليات</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="internshipDuration">
                                    <i class="fas fa-clock"></i>
                                    مدة التدريب *
                                </label>
                                <select id="internshipDuration" class="form-control" required>
                                    <option value="">اختر المدة المناسبة</option>
                                    <option value="شهر واحد" ${internship.duration === 'شهر واحد' ? 'selected' : ''}>شهر واحد</option>
                                    <option value="شهرين" ${internship.duration === 'شهرين' ? 'selected' : ''}>شهرين</option>
                                    <option value="3 أشهر" ${internship.duration === '3 أشهر' ? 'selected' : ''}>3 أشهر</option>
                                    <option value="6 أشهر" ${internship.duration === '6 أشهر' ? 'selected' : ''}>6 أشهر</option>
                                    <option value="سنة" ${internship.duration === 'سنة' ? 'selected' : ''}>سنة</option>
                                    <option value="سنتين" ${internship.duration === 'سنتين' ? 'selected' : ''}>سنتين</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="internshipDeadline">
                                    <i class="fas fa-calendar-alt"></i>
                                    الموعد النهائي للتقديم *
                                </label>
                                <input type="date" id="internshipDeadline" class="form-control" value="${internship.deadline || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="internshipDescription">
                                    <i class="fas fa-align-right"></i>
                                    وصف فرصة التدريب *
                                </label>
                                <textarea id="internshipDescription" class="form-control" rows="4" required>${internship.description || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="internshipRequirements">
                                    <i class="fas fa-list-check"></i>
                                    المتطلبات
                                </label>
                                <textarea id="internshipRequirements" class="form-control" rows="3">${internship.requirements || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="internshipBenefits">
                                    <i class="fas fa-gift"></i>
                                    المزايا
                                </label>
                                <textarea id="internshipBenefits" class="form-control" rows="3">${internship.benefits || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="internshipStatus">
                                    <i class="fas fa-toggle-on"></i>
                                    الحالة
                                </label>
                                <select id="internshipStatus" class="form-control">
                                    <option value="active" ${internship.status === 'active' ? 'selected' : ''}>نشط</option>
                                    <option value="inactive" ${internship.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                                    <option value="closed" ${internship.status === 'closed' ? 'selected' : ''}>مغلق</option>
                                    <option value="draft" ${internship.status === 'draft' ? 'selected' : ''}>مسودة</option>
                                </select>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                                    <i class="fas fa-times"></i>
                                    إلغاء
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i>
                                    تحديث فرصة التدريب
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            const modalContainer = document.getElementById('modalContainer');
            modalContainer.innerHTML = modal;
        } else {
            showMessage('خطأ في تحميل بيانات فرصة التدريب', 'error');
        }
    } catch (error) {
        console.error('Error loading internship:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Update Internship
async function updateInternship(event, internshipId) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('internshipTitle').value,
        type: document.getElementById('internshipType').value,
        duration: document.getElementById('internshipDuration').value,
        deadline: document.getElementById('internshipDeadline').value,
        description: document.getElementById('internshipDescription').value,
        requirements: document.getElementById('internshipRequirements').value,
        benefits: document.getElementById('internshipBenefits').value,
        status: document.getElementById('internshipStatus').value
    };
    
    try {
        const response = await apiCall(`http://localhost:3001/api/internships/${internshipId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم تحديث فرصة التدريب بنجاح!', 'success');
            closeModal();
            loadInternshipsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error updating internship:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Delete Internship
async function deleteInternship(internshipId) {
    if (!confirm('هل أنت متأكد من حذف فرصة التدريب هذه؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`http://localhost:3001/api/internships/${internshipId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم حذف فرصة التدريب بنجاح!', 'success');
            loadInternshipsManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting internship:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// ===== DID YOU KNOW MANAGEMENT =====

// Load Did You Know Management
async function loadDidYouKnowManagement() {
    const container = document.getElementById('didYouKnowTableContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">جاري تحميل معلومات هل تعلم...</div>';
    
    try {
        const response = await apiCall('http://localhost:3001/api/did-you-know');
        const data = await response.json();
        
        if (data.success && data.data) {
            displayDidYouKnowTable(data.data);
        } else {
            container.innerHTML = '<div class="no-data">لا توجد معلومات متاحة</div>';
        }
    } catch (error) {
        console.error('Error loading did you know:', error);
        container.innerHTML = '<div class="error">فشل في تحميل المعلومات</div>';
    }
}

// Display Did You Know Table
function displayDidYouKnowTable(didYouKnowItems) {
    const container = document.getElementById('didYouKnowTableContainer');
    if (!container) return;
    
    if (didYouKnowItems.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد معلومات متاحة</div>';
        return;
    }
    
    const tableHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th><i class="fas fa-lightbulb"></i> العنوان</th>
                    <th><i class="fas fa-tags"></i> الفئة</th>
                    <th><i class="fas fa-toggle-on"></i> الحالة</th>
                    <th><i class="fas fa-calendar"></i> تاريخ الإنشاء</th>
                    <th><i class="fas fa-cogs"></i> الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${didYouKnowItems.map(item => `
                    <tr>
                        <td>
                            <div class="title-cell">
                                <strong class="item-title">${item.title}</strong>
                                <div class="content-preview">${item.content.substring(0, 80)}...</div>
                            </div>
                        </td>
                        <td>
                            <span class="category-badge category-${item.category.toLowerCase()}">
                                <i class="fas fa-tag"></i> ${item.category}
                            </span>
                        </td>
                        <td>
                            <span class="status-badge status-${item.status}">
                                <i class="fas fa-${item.status === 'active' ? 'check-circle' : 'times-circle'}"></i>
                                ${item.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                        </td>
                        <td>
                            <span class="date-cell">
                                <i class="fas fa-clock"></i>
                                ${new Date(item.created_at).toLocaleDateString('ar-EG')}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-edit" onclick="editDidYouKnow(${item.id})" title="تعديل المعلومة">
                                    <i class="fas fa-edit"></i>
                                    <span>تعديل</span>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteDidYouKnow(${item.id})" title="حذف المعلومة">
                                    <i class="fas fa-trash"></i>
                                    <span>حذف</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Show Add Did You Know Modal
function showAddDidYouKnowModal() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-lightbulb"></i> إضافة معلومة جديدة</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="didYouKnowForm" class="modal-form">
                    <div class="form-group">
                        <label for="title">
                            <i class="fas fa-heading"></i>
                            العنوان *
                        </label>
                        <input type="text" id="title" name="title" class="form-control" required 
                               placeholder="مثال: هل تعلم أن البنسلين أنقذ ملايين الأرواح...">
                    </div>
                    <div class="form-group">
                        <label for="content">
                            <i class="fas fa-align-right"></i>
                            المحتوى *
                        </label>
                        <textarea id="content" name="content" class="form-control" rows="6" required 
                                  placeholder="اكتب المحتوى الكامل للمعلومة المثيرة والمفيدة..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="category">
                            <i class="fas fa-tags"></i>
                            الفئة *
                        </label>
                        <select id="category" name="category" class="form-control" required>
                            <option value="">اختر الفئة المناسبة</option>
                            <option value="صيدلة">صيدلة</option>
                            <option value="طب">طب</option>
                            <option value="أدوية">أدوية</option>
                            <option value="تاريخ">تاريخ</option>
                            <option value="علم">علم</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="image_url">
                            <i class="fas fa-image"></i>
                            رابط الصورة (اختياري)
                        </label>
                        <input type="url" id="image_url" name="image_url" class="form-control" 
                               placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-group">
                        <label for="status">
                            <i class="fas fa-toggle-on"></i>
                            الحالة
                        </label>
                        <select id="status" name="status" class="form-control">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i>
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            حفظ المعلومة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modalHTML;
    
    // Handle form submission
    document.getElementById('didYouKnowForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitDidYouKnow();
    });
}

// Submit Did You Know
async function submitDidYouKnow() {
    const form = document.getElementById('didYouKnowForm');
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        image_url: formData.get('image_url') || null,
        status: formData.get('status')
    };
    
    try {
        const response = await apiCall('http://localhost:3001/api/did-you-know', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('تم إضافة المعلومة بنجاح!', 'success');
            closeModal();
            loadDidYouKnowManagement();
        } else {
            showMessage('خطأ: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting did you know:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Edit Did You Know
async function editDidYouKnow(id) {
    try {
        const response = await apiCall(`http://localhost:3001/api/did-you-know/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const item = data.data;
            showEditDidYouKnowModal(item);
        } else {
            showMessage('فشل في تحميل المعلومة', 'error');
        }
    } catch (error) {
        console.error('Error loading did you know item:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Show Edit Did You Know Modal
function showEditDidYouKnowModal(item) {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> تعديل المعلومة</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="editDidYouKnowForm" class="modal-form">
                    <input type="hidden" id="editId" value="${item.id}">
                    <div class="form-group">
                        <label for="editTitle">
                            <i class="fas fa-heading"></i>
                            العنوان *
                        </label>
                        <input type="text" id="editTitle" name="title" class="form-control" value="${item.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="editContent">
                            <i class="fas fa-align-right"></i>
                            المحتوى *
                        </label>
                        <textarea id="editContent" name="content" class="form-control" rows="6" required>${item.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editCategory">
                            <i class="fas fa-tags"></i>
                            الفئة *
                        </label>
                        <select id="editCategory" name="category" class="form-control" required>
                            <option value="صيدلة" ${item.category === 'صيدلة' ? 'selected' : ''}>صيدلة</option>
                            <option value="طب" ${item.category === 'طب' ? 'selected' : ''}>طب</option>
                            <option value="أدوية" ${item.category === 'أدوية' ? 'selected' : ''}>أدوية</option>
                            <option value="تاريخ" ${item.category === 'تاريخ' ? 'selected' : ''}>تاريخ</option>
                            <option value="علم" ${item.category === 'علم' ? 'selected' : ''}>علم</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editImageUrl">
                            <i class="fas fa-image"></i>
                            رابط الصورة
                        </label>
                        <input type="url" id="editImageUrl" name="image_url" class="form-control" value="${item.image_url || ''}">
                    </div>
                    <div class="form-group">
                        <label for="editStatus">
                            <i class="fas fa-toggle-on"></i>
                            الحالة
                        </label>
                        <select id="editStatus" name="status" class="form-control">
                            <option value="active" ${item.status === 'active' ? 'selected' : ''}>نشط</option>
                            <option value="inactive" ${item.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i>
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            حفظ التعديلات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modalHTML;
    
    // Handle form submission
    document.getElementById('editDidYouKnowForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateDidYouKnow();
    });
}

// Update Did You Know
async function updateDidYouKnow() {
    const form = document.getElementById('editDidYouKnowForm');
    const formData = new FormData(form);
    const id = formData.get('editId');
    
    const data = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        image_url: formData.get('image_url') || null,
        status: formData.get('status')
    };
    
    try {
        const response = await apiCall(`http://localhost:3001/api/did-you-know/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('تم تحديث المعلومة بنجاح!', 'success');
            closeModal();
            loadDidYouKnowManagement();
        } else {
            showMessage('خطأ: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error updating did you know:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

// Delete Did You Know
async function deleteDidYouKnow(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المعلومة؟')) {
        return;
    }
    
    try {
        const response = await apiCall(`http://localhost:3001/api/did-you-know/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('تم حذف المعلومة بنجاح!', 'success');
            loadDidYouKnowManagement();
        } else {
            showMessage('خطأ: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting did you know:', error);
        showMessage('خطأ في الاتصال', 'error');
    }
}

