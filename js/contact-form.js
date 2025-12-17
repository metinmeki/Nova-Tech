// ========================================
// Nova Tech - Advanced Contact Form Handler
// ========================================

(function() {
    'use strict';

    // الحصول على عناصر النموذج
    const form = document.querySelector('.contact-form form');
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const submitBtn = form.querySelector('input[type="submit"]');

    // دالة لإنشاء رسالة التنبيه
    function createAlert(message, type = 'success') {
        // إزالة أي تنبيهات قديمة
        const oldAlert = document.querySelector('.form-alert');
        if (oldAlert) oldAlert.remove();

        // إنشاء عنصر التنبيه
        const alert = document.createElement('div');
        alert.className = `form-alert form-alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // إضافة التنبيه قبل النموذج
        form.parentElement.insertBefore(alert, form);

        // إزالة التنبيه تلقائياً بعد 5 ثوانٍ
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);

        // التمرير إلى التنبيه
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // دالة للتحقق من صحة الاسم
    function validateName(name) {
        const errors = [];
        if (!name || name.trim().length < 2) {
            errors.push('الاسم يجب أن يكون حرفين على الأقل');
        }
        if (name.length > 100) {
            errors.push('الاسم طويل جداً');
        }
        if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
            errors.push('الاسم يجب أن يحتوي على حروف فقط');
        }
        return errors;
    }

    // دالة للتحقق من صحة رقم الهاتف
    function validatePhone(phone) {
        const errors = [];
        // إزالة المسافات والرموز
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        if (!cleanPhone) {
            errors.push('رقم الهاتف مطلوب');
        } else if (!/^[\+]?[0-9]{10,15}$/.test(cleanPhone)) {
            errors.push('رقم الهاتف غير صحيح (10-15 رقم)');
        }
        return errors;
    }

    // دالة للتحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            errors.push('البريد الإلكتروني مطلوب');
        } else if (!emailRegex.test(email)) {
            errors.push('البريد الإلكتروني غير صحيح');
        } else if (email.length > 255) {
            errors.push('البريد الإلكتروني طويل جداً');
        }
        return errors;
    }

    // دالة للتحقق من صحة الرسالة
    function validateMessage(message) {
        const errors = [];
        if (!message || message.trim().length < 10) {
            errors.push('الرسالة يجب أن تكون 10 أحرف على الأقل');
        }
        if (message.length > 1000) {
            errors.push('الرسالة طويلة جداً (الحد الأقصى 1000 حرف)');
        }
        return errors;
    }

    // دالة لإضافة رسالة خطأ لحقل معين
    function showFieldError(input, error) {
        // إزالة الخطأ القديم إن وجد
        const oldError = input.parentElement.querySelector('.field-error');
        if (oldError) oldError.remove();

        // إضافة class للحقل
        input.classList.add('field-invalid');

        // إنشاء رسالة الخطأ
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = error;
        input.parentElement.appendChild(errorElement);
    }

    // دالة لإزالة رسالة الخطأ من حقل
    function clearFieldError(input) {
        input.classList.remove('field-invalid');
        const error = input.parentElement.querySelector('.field-error');
        if (error) error.remove();
    }

    // التحقق الفوري أثناء الكتابة
    nameInput.addEventListener('blur', () => {
        const errors = validateName(nameInput.value);
        if (errors.length > 0) {
            showFieldError(nameInput, errors[0]);
        } else {
            clearFieldError(nameInput);
        }
    });

    phoneInput.addEventListener('blur', () => {
        const errors = validatePhone(phoneInput.value);
        if (errors.length > 0) {
            showFieldError(phoneInput, errors[0]);
        } else {
            clearFieldError(phoneInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        const errors = validateEmail(emailInput.value);
        if (errors.length > 0) {
            showFieldError(emailInput, errors[0]);
        } else {
            clearFieldError(emailInput);
        }
    });

    messageInput.addEventListener('blur', () => {
        const errors = validateMessage(messageInput.value);
        if (errors.length > 0) {
            showFieldError(messageInput, errors[0]);
        } else {
            clearFieldError(messageInput);
        }
    });

    // دالة لتعطيل/تفعيل النموذج
    function toggleFormState(disabled) {
        const inputs = form.querySelectorAll('input, textarea, button');
        inputs.forEach(input => input.disabled = disabled);
        
        if (disabled) {
            submitBtn.value = 'جاري الإرسال...';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            submitBtn.value = 'إرسال';
            submitBtn.style.cursor = 'pointer';
        }
    }

    // دالة لإعادة تعيين النموذج
    function resetForm() {
        form.reset();
        // إزالة جميع رسائل الخطأ
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.field-invalid').forEach(el => {
            el.classList.remove('field-invalid');
        });
    }

    // معالجة إرسال النموذج
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // جمع البيانات
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // التحقق من جميع الحقول
        let hasErrors = false;
        const allErrors = [];

        // التحقق من الاسم
        const nameErrors = validateName(formData.name);
        if (nameErrors.length > 0) {
            showFieldError(nameInput, nameErrors[0]);
            allErrors.push(...nameErrors);
            hasErrors = true;
        } else {
            clearFieldError(nameInput);
        }

        // التحقق من الهاتف
        const phoneErrors = validatePhone(formData.phone);
        if (phoneErrors.length > 0) {
            showFieldError(phoneInput, phoneErrors[0]);
            allErrors.push(...phoneErrors);
            hasErrors = true;
        } else {
            clearFieldError(phoneInput);
        }

        // التحقق من البريد الإلكتروني
        const emailErrors = validateEmail(formData.email);
        if (emailErrors.length > 0) {
            showFieldError(emailInput, emailErrors[0]);
            allErrors.push(...emailErrors);
            hasErrors = true;
        } else {
            clearFieldError(emailInput);
        }

        // التحقق من الرسالة
        const messageErrors = validateMessage(formData.message);
        if (messageErrors.length > 0) {
            showFieldError(messageInput, messageErrors[0]);
            allErrors.push(...messageErrors);
            hasErrors = true;
        } else {
            clearFieldError(messageInput);
        }

        // إذا كانت هناك أخطاء، أوقف الإرسال
        if (hasErrors) {
            createAlert('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }

        // تعطيل النموذج أثناء الإرسال
        toggleFormState(true);

        try {
            // إرسال البيانات باستخدام Fetch API
            const response = await fetch('contactme.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });

            // قراءة الرد
            const result = await response.json();

            if (result.success) {
                // نجح الإرسال
                createAlert(result.message || 'تم إرسال رسالتك بنجاح! 🎉', 'success');
                
                // إعادة تعيين النموذج
                resetForm();

                // تتبع التحويل (Google Analytics / Facebook Pixel)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form Submission'
                    });
                }

                // يمكنك إضافة تأثيرات الاحتفال هنا
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }

            } else {
                // فشل الإرسال
                const errorMsg = result.errors ? result.errors.join('<br>') : result.message;
                createAlert(errorMsg || 'حدث خطأ أثناء الإرسال', 'error');
            }

        } catch (error) {
            console.error('Error:', error);
            createAlert('عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً', 'error');
        } finally {
            // إعادة تفعيل النموذج
            toggleFormState(false);
        }
    });

    // إضافة عداد الأحرف للرسالة
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.textContent = '0 / 1000';
    messageInput.parentElement.appendChild(charCounter);

    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length} / 1000`;
        
        if (length > 1000) {
            charCounter.style.color = '#ff4444';
        } else if (length > 900) {
            charCounter.style.color = '#ff9800';
        } else {
            charCounter.style.color = '#7f3fed';
        }
    });

    // منع إرسال النموذج عند الضغط على Enter في حقول النص
    const textInputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });

    // حفظ البيانات في Local Storage (اختياري)
    const saveToLocalStorage = () => {
        const draftData = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            message: messageInput.value,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('contactFormDraft', JSON.stringify(draftData));
    };

    // استعادة البيانات من Local Storage
    const loadFromLocalStorage = () => {
        const draft = localStorage.getItem('contactFormDraft');
        if (draft) {
            const data = JSON.parse(draft);
            // تحقق من أن المسودة ليست قديمة جداً (24 ساعة)
            const dayInMs = 24 * 60 * 60 * 1000;
            if (new Date().getTime() - data.timestamp < dayInMs) {
                if (confirm('هل تريد استعادة المسودة المحفوظة؟')) {
                    nameInput.value = data.name || '';
                    phoneInput.value = data.phone || '';
                    emailInput.value = data.email || '';
                    messageInput.value = data.message || '';
                }
            } else {
                localStorage.removeItem('contactFormDraft');
            }
        }
    };

    // حفظ المسودة كل 5 ثوانٍ
    let saveTimer;
    [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(saveToLocalStorage, 5000);
        });
    });

    // استعادة المسودة عند تحميل الصفحة
    loadFromLocalStorage();

    // مسح المسودة عند إرسال النموذج بنجاح
    form.addEventListener('submit', () => {
        localStorage.removeItem('contactFormDraft');
    });

    console.log('✅ Nova Tech Contact Form Initialized Successfully');

})();