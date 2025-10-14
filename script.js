// =========================================================================
// === 1. تعريف الأدوار والصلاحيات والثوابت ===
// =========================================================================

const RANKS = {
    MEMBER: 'عضو',
    DEPUTY: 'نائب',
    SECONDARY_SUPERVISOR: 'رقابي ثانوي',
    LEADER: 'رئيس عصابة',
    PRIMARY_SUPERVISOR: 'رقابي',
};

// تحديد من يمكنه إضافة الأعضاء
const ALLOWED_ADDITIONS = {
    [RANKS.PRIMARY_SUPERVISOR]: [RANKS.LEADER, RANKS.SECONDARY_SUPERVISOR, RANKS.DEPUTY, RANKS.MEMBER],
    [RANKS.SECONDARY_SUPERVISOR]: [RANKS.LEADER, RANKS.DEPUTY, RANKS.MEMBER],
    [RANKS.LEADER]: [RANKS.DEPUTY, RANKS.MEMBER],
    [RANKS.DEPUTY]: [RANKS.MEMBER],
    [RANKS.MEMBER]: [],
};

// تحديد من يمكنه إضافة المحتوى
const ALLOWED_CONTENT_CREATORS = [
    RANKS.PRIMARY_SUPERVISOR,
    RANKS.SECONDARY_SUPERVISOR,
    RANKS.LEADER,
];

// =========================================================================
// === 2. المكونات المساعدة (UI Components) ===
// =========================================================================

// مكون البطاقة العامة
const AppCard = ({ children, className = '' }) => (
    React.createElement('div', {
        className: `app-card ${className}`
    }, children)
);

// مكون رسالة خطأ/نجاح
const StatusMessage = ({ message, type = 'error', className = '' }) => {
    if (!message) return null;
    const statusClass = type === 'error' ? 'status-error' : 'status-success';
    return React.createElement('div', {
        className: `status-message ${statusClass} ${className}`
    }, message);
};

// مكون التحميل
const LoadingIndicator = ({ message = 'جاري التحميل...', className = '' }) => (
    React.createElement('div', {
        className: `loading-indicator ${className}`
    }, [
        React.createElement('i', {
            key: 'icon',
            className: "fas fa-spinner loading-spinner"
        }),
        React.createElement('span', {
            key: 'text'
        }, message)
    ])
);

// مودال عام
const ContentModal = ({ title, children, closeModal, handleSave, isSaving }) => (
    React.createElement('div', {
        className: "modal-overlay"
    },
        React.createElement(AppCard, {
            className: "w-full max-w-lg p-6 animate-fadeIn"
        }, [
            React.createElement('h3', {
                key: 'title',
                className: "text-xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2"
            }, title),
            
            React.createElement('div', {
                key: 'content',
                className: "space-y-4 max-h-[80vh] overflow-y-auto pr-2"
            }, children),

            React.createElement('div', {
                key: 'actions',
                className: "flex justify-end space-x-4 space-x-reverse pt-4 border-t border-gray-700 mt-4"
            }, [
                React.createElement('button', {
                    key: 'cancel',
                    onClick: closeModal,
                    className: "btn bg-gray-600 hover:bg-gray-700",
                    disabled: isSaving
                }, 'إلغاء'),
                React.createElement('button', {
                    key: 'save',
                    onClick: handleSave,
                    className: "btn bg-yellow-600 hover:bg-yellow-700 text-black flex items-center justify-center",
                    disabled: isSaving
                }, [
                    isSaving ? 
                        React.createElement('i', { key: 'icon', className: "fas fa-spinner fa-spin ml-2" }) :
                        React.createElement('i', { key: 'icon', className: "fas fa-save ml-2" }),
                    isSaving ? 'جاري الحفظ...' : 'حفظ ونشر'
                ])
            ])
        ])
    )
);

// =========================================================================
// === 3. شاشة تسجيل الدخول ===
// =========================================================================

const LoginScreen = ({ onLogin }) => {
    const [gangId, setGangId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        if (!gangId.trim()) {
            setMessage('الرجاء إدخال إيدي العصابة');
            setIsLoading(false);
            return;
        }

        // محاكاة تسجيل الدخول - في الواقع سيتصل مع Firebase
        setTimeout(() => {
            setIsLoading(false);
            if (gangId.toUpperCase() === 'CRIPS001') {
                onLogin({
                    id: 'CRIPS001',
                    name: 'المدير الأول',
                    rank: RANKS.PRIMARY_SUPERVISOR
                });
            } else {
                setMessage('إيدي العصابة غير صحيح. جرب CRIPS001 للاختبار');
            }
        }, 2000);
    };

    return React.createElement('div', {
        className: "flex flex-col items-center justify-center h-screen p-6 bg-gray-900"
    },
        React.createElement(AppCard, {
            className: "w-full max-w-md p-8 text-center border-blue-500/50"
        }, [
            React.createElement('h1', {
                key: 'title',
                className: "text-3xl font-bold mb-6 text-blue-400"
            }, 'تسجيل الدخول - عصابة الكربس'),
            
            React.createElement('p', {
                key: 'desc',
                className: "text-gray-400 mb-6 text-sm"
            }, 'أدخل إيدي العصابة الخاص بك. للإختبار استخدم: CRIPS001'),
            
            React.createElement('form', {
                key: 'form',
                onSubmit: handleLogin,
                className: "space-y-4"
            }, [
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    placeholder: 'إيدي العصابة (مثال: CRIPS001)',
                    value: gangId,
                    onChange: (e) => setGangId(e.target.value.toUpperCase()),
                    className: "input-field text-lg text-center",
                    disabled: isLoading,
                    maxLength: 10
                }),
                
                React.createElement(StatusMessage, {
                    key: 'message',
                    message: message,
                    type: message.includes('غير صحيح') ? 'error' : 'success'
                }),
                
                React.createElement('button', {
                    key: 'button',
                    type: 'submit',
                    className: "btn-primary w-full flex items-center justify-center",
                    disabled: isLoading
                }, [
                    isLoading ? 
                        React.createElement('i', { key: 'icon', className: "fas fa-spinner fa-spin ml-2" }) :
                        React.createElement('i', { key: 'icon', className: "fas fa-sign-in-alt ml-2" }),
                    isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول'
                ])
            ])
        ])
    );
};

// =========================================================================
// === 4. لوحة التحكم الرئيسية ===
// =========================================================================

const Dashboard = ({ user, onLogout }) => {
    const [activePage, setActivePage] = React.useState('home');
    
    const navItems = [
        { id: 'home', icon: 'fas fa-home', label: 'رئيسية' },
        { id: 'members', icon: 'fas fa-users', label: 'أعضاء' },
        { id: 'tasks', icon: 'fas fa-clipboard-list', label: 'مهام' },
        { id: 'jobs', icon: 'fas fa-briefcase', label: 'وظائف' },
        { id: 'store', icon: 'fas fa-store', label: 'متجر' },
        { id: 'announcements', icon: 'fas fa-bullhorn', label: 'إعلانات' },
        { id: 'money', icon: 'fas fa-wallet', label: 'أموال' },
        { id: 'map', icon: 'fas fa-map-marked-alt', label: 'خريطة' },
    ];

    const renderPageContent = () => {
        switch (activePage) {
            case 'home':
                return React.createElement(HomePage, { user });
            case 'members':
                return React.createElement(MembersPage, { user });
            case 'tasks':
                return React.createElement(TasksPage, { user });
            case 'jobs':
                return React.createElement(JobsPage, { user });
            case 'store':
                return React.createElement(StorePage, { user });
            case 'announcements':
                return React.createElement(AnnouncementsPage, { user });
            case 'money':
                return React.createElement(MoneyPage, { user });
            case 'map':
                return React.createElement(MapPage, { user });
            default:
                return React.createElement(HomePage, { user });
        }
    };

    return React.createElement('div', { className: "ui-box" }, [
        // الشريط الجانبي الأيمن
        React.createElement('div', {
            key: 'sidebar-right',
            className: "sidebar-right"
        }, [
            React.createElement('div', {
                key: 'logo',
                className: "mb-8"
            }, React.createElement('i', { className: "fas fa-hammer text-3xl text-blue-400" })),
            
            ...navItems.map(item => 
                React.createElement('div', {
                    key: item.id,
                    className: `nav-item ${activePage === item.id ? 'active' : ''}`,
                    onClick: () => setActivePage(item.id),
                    title: item.label
                }, [
                    React.createElement('i', { key: 'icon', className: item.icon }),
                    React.createElement('span', { key: 'text', className: "text-xs" }, item.label)
                ])
            ),
            
            React.createElement('div', {
                key: 'logout',
                className: "mt-auto pb-4"
            }, 
                React.createElement('button', {
                    onClick: onLogout,
                    className: "nav-item"
                }, 
                    React.createElement('i', { className: "fas fa-sign-out-alt text-2xl text-red-500" })
                )
            )
        ]),

        // المحتوى الرئيسي
        React.createElement('div', {
            key: 'main-content',
            className: "main-container p-6"
        }, [
            // شريط العنوان
            React.createElement('div', {
                key: 'header',
                className: "flex justify-between items-center mb-6"
            }, [
                React.createElement('h1', {
                    key: 'title',
                    className: "text-3xl font-bold text-blue-400"
                }, 'عصابة الكربس - نظام الإدارة'),
                React.createElement('div', {
                    key: 'user-info',
                    className: "text-right"
                }, [
                    React.createElement('p', { key: 'name' }, `مرحباً، ${user.name}`),
                    React.createElement('p', { 
                        key: 'rank',
                        className: "text-yellow-400 font-semibold"
                    }, `${user.rank} | ID: ${user.id}`)
                ])
            ]),
            
            // محتوى الصفحة
            renderPageContent()
        ])
    ]);
};

// =========================================================================
// === 5. صفحات التطبيق ===
// =========================================================================

const HomePage = ({ user }) => {
    return React.createElement('div', { className: "space-y-6" }, [
        React.createElement(AppCard, {
            key: 'welcome'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: "text-2xl font-bold text-green-400 mb-4"
            }, 'مرحباً بك في نظام إدارة العصابة'),
            React.createElement('p', {
                key: 'welcome-text',
                className: "text-gray-300"
            }, `أنت مسجل كـ ${user.rank} في النظام. يمكنك استخدام القائمة للتنقل بين الأقسام.`)
        ]),
        
        React.createElement('div', {
            key: 'stats',
            className: "grid grid-cols-1 md:grid-cols-3 gap-6"
        }, [
            React.createElement(AppCard, {
                key: 'members',
                className: "text-center border-blue-500/50"
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: "fas fa-users text-4xl text-blue-400 mb-3"
                }),
                React.createElement('h3', {
                    key: 'title',
                    className: "text-xl font-bold"
                }, 'الأعضاء'),
                React.createElement('p', {
                    key: 'count',
                    className: "text-3xl font-extrabold text-white mt-2"
                }, '0')
            ]),
            
            React.createElement(AppCard, {
                key: 'tasks',
                className: "text-center border-yellow-500/50"
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: "fas fa-tasks text-4xl text-yellow-400 mb-3"
                }),
                React.createElement('h3', {
                    key: 'title',
                    className: "text-xl font-bold"
                }, 'المهام النشطة'),
                React.createElement('p', {
                    key: 'count',
                    className: "text-3xl font-extrabold text-white mt-2"
                }, '0')
            ]),
            
            React.createElement(AppCard, {
                key: 'revenue',
                className: "text-center border-green-500/50"
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: "fas fa-dollar-sign text-4xl text-green-400 mb-3"
                }),
                React.createElement('h3', {
                    key: 'title',
                    className: "text-xl font-bold"
                }, 'الإيرادات'),
                React.createElement('p', {
                    key: 'amount',
                    className: "text-3xl font-extrabold text-white mt-2"
                }, '0$')
            ])
        ])
    ]);
};

const MembersPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('div', {
            key: 'header',
            className: "flex justify-between items-center mb-6"
        }, [
            React.createElement('h2', {
                key: 'title',
                className: "text-2xl font-bold text-blue-400"
            }, 'إدارة الأعضاء'),
            React.createElement('button', {
                key: 'button',
                className: "btn-primary"
            }, [
                React.createElement('i', { className: "fas fa-user-plus ml-2" }),
                'إضافة عضو جديد'
            ])
        ]),
        
        React.createElement(AppCard, {
            key: 'content'
        }, [
            React.createElement('p', {
                key: 'text'
            }, 'هنا يمكنك إدارة أعضاء العصابة. سيتم عرض قائمة الأعضاء وإضافة أعضاء جدد.')
        ])
    ]);
};

const TasksPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-yellow-400 mb-6"
        }, 'إدارة المهام'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة المهام قيد التطوير...')
    ]);
};

const JobsPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-purple-400 mb-6"
        }, 'الوظائف المتاحة'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة الوظائف قيد التطوير...')
    ]);
};

const StorePage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-red-400 mb-6"
        }, 'متجر العصابة'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة المتجر قيد التطوير...')
    ]);
};

const AnnouncementsPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-green-400 mb-6"
        }, 'الإعلانات'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة الإعلانات قيد التطوير...')
    ]);
};

const MoneyPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-gray-400 mb-6"
        }, 'إدارة الأموال'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة الأموال قيد التطوير...')
    ]);
};

const MapPage = ({ user }) => {
    return React.createElement('div', {}, [
        React.createElement('h2', {
            key: 'title',
            className: "text-2xl font-bold text-gray-400 mb-6"
        }, 'خريطة السيطرة'),
        React.createElement(AppCard, {
            key: 'content'
        }, 'صفحة الخريطة قيد التطوير...')
    ]);
};

// =========================================================================
// === 6. المكون الرئيسي ===
// =========================================================================

function App() {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [firebaseReady, setFirebaseReady] = React.useState(false);

    React.useEffect(() => {
        // تهيئة Firebase
        try {
            const app = firebase.initializeApp(__firebase_config);
            const analytics = firebase.analytics(app);
            console.log('✅ Firebase initialized successfully');
            setFirebaseReady(true);
        } catch (error) {
            console.log('⚠️ Firebase initialization:', error);
            setFirebaseReady(true);
        }
        
        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    if (isLoading) {
        return React.createElement('div', {
            className: "flex items-center justify-center h-screen bg-gray-900"
        }, 
            React.createElement(LoadingIndicator, {
                message: "جاري تهيئة النظام..."
            })
        );
    }

    if (!user) {
        return React.createElement(LoginScreen, { onLogin: handleLogin });
    }

    return React.createElement(Dashboard, { 
        user: user, 
        onLogout: handleLogout 
    });
}

// =========================================================================
// === تشغيل التطبيق ===
// =========================================================================

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));