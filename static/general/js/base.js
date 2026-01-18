document.addEventListener('DOMContentLoaded', function () {
    let sidebar = document.querySelector(".sidebar");
    let closeBtn = document.querySelector("#btn");
    let searchBtn = document.querySelector(".bx-search");

    function menuBtnChange() {
        if (sidebar && closeBtn) {
            if (sidebar.classList.contains("open")) {
                closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
            } else {
                closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
            }
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            menuBtnChange();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => { 
            sidebar.classList.toggle("open");
            menuBtnChange();
        });
    }
});
