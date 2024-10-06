function showSection(id) {  
    // 移除所有section的active类  
    var sections = document.querySelectorAll('.content section');  
    sections.forEach(function(section) {  
        section.classList.remove('active');  
    });  
    
    // 添加active类到被点击的section  
    var selectedSection = document.getElementById(id);  
    if (selectedSection) {  
        selectedSection.classList.add('active');  
    }  
}  

// 页面加载时默认显示“关于我们”  
window.onload = function() {  
    showSection('about');  
};  