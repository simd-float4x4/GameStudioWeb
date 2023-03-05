function selectUserTypeRadioButton(elemName) {
    var array = ["form-usertype-personal", "form-usertype-official", "form-usertype-other"];
    var x = document.getElementById(elemName);

    for (i = 0; i < array.length; i++) {
        if (elemName === array[i]) {
            x.classList.remove('select-user-type-button');
            x.classList.add('select-user-type-button-activated');
        } else {
            var y = document.getElementById(array[i]);
            y.classList.remove('select-user-type-button-activated');
            y.classList.add('select-user-type-button');
        }
    }
}