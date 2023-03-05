init();

function init(){
    var current = sessionStorage.getItem('current');   
    myFunction(current);
}

function myFunction(elemName) {
    var x = document.getElementById(elemName);
    var array = ["top", "about", "product", "contact"];

    for (i = 0; i < array.length; i++) {
        if (elemName === array[i]) {
            x.classList.remove('hidden');
            sessionStorage.setItem('current', elemName);
        } else {
            var y = document.getElementById(array[i]);
            y.classList.add('hidden');
        }
    }
}

function header(){
    $.ajax({
        url: "header.html",
        cache: false,
        success: function(html){
            document.write(html);
        }
    });
}