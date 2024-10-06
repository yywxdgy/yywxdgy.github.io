function showSectionanimation(section) {
    var sections = section.parentNode.getElementsByTagName("li");
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].className.indexOf("show") != -1) {
            sections[i].className = sections[i].className.replace("show", "");
        }
    }
    section = section;
    section.className += "show";
}

// 页面加载时默认显示“关于我们”  
window.onload = function() {  
    showSectionanimation(document.getElementById('start'));
};  