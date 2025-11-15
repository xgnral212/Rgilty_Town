// ----------------------------------------------------
// 3. كود الجافاسكريبت (JS)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. وظيفة القوائم المنسدلة (Accordion)
    const cards = document.querySelectorAll('.law-card');

    cards.forEach(card => {
        const header = card.querySelector('.law-header');
        
        header.addEventListener('click', () => {
            card.classList.toggle('active');
            
            const body = card.querySelector('.law-body');
            if (card.classList.contains('active')) {
                // يتم حساب ارتفاع الجسم (body) بشكل ديناميكي لفتحه
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // 2. وظيفة محرك البحث المتقدم
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        cards.forEach(card => {
            const headerText = card.querySelector('.law-header h3').innerText.toLowerCase();
            const bodyContent = card.querySelector('.law-body').innerText.toLowerCase();
            let hasMatch = false;

            // البحث في العنوان ومحتوى الجسم بالكامل
            if (headerText.includes(term) || bodyContent.includes(term)) {
                hasMatch = true;
            }

            if (hasMatch) {
                card.style.display = "block";
                
                // فتح القائمة تلقائياً عند البحث
                if (term.length > 0) {
                    if (!card.classList.contains('active')) {
                        card.classList.add('active');
                        const body = card.querySelector('.law-body');
                        body.style.maxHeight = body.scrollHeight + "px";
                    }
                }
            } else {
                card.style.display = "none";
            }

            // إعادة الوضع الطبيعي عند مسح البحث
            if (term.length === 0) {
                card.style.display = "block";
                card.classList.remove('active');
                card.querySelector('.law-body').style.maxHeight = null;
            }
        });
    });
});