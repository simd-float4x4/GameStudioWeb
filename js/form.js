function selectUserTypeRadioButton(elemName) {
    var array = ["form-usertype-personal", "form-usertype-official", "form-usertype-other"];
    var x = document.getElementById(elemName);
    var z = document.getElementById("form-company-name");
    for (i = 0; i < array.length; i++) {
        if (elemName === array[i]) {
            x.classList.remove('select-user-type-button');
            x.classList.add('select-user-type-button-activated');
            if (elemName == array[1]) {
                z.classList.remove('hidden');
            } else {
                z.classList.add('hidden');
            }
        } else {
            var y = document.getElementById(array[i]);
            y.classList.remove('select-user-type-button-activated');
            y.classList.add('select-user-type-button');
        }
    }
}