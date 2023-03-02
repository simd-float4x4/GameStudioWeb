function myFunction(elemName) {
    var x = document.getElementById(elemName);
    var array = ["top", "about", "product", "contact"];

    for (i = 0; i < array.length; i++) {
        if (elemName === array[i]) {
            x.classList.remove('hidden');
        } else {
            var y = document.getElementById(array[i]);
            y.classList.add('hidden');
        }
    }
}