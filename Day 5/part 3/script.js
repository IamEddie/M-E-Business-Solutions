window.onload = function(){
    var submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', function(event){
            event.preventDefault()
            //alert('You clicked submit again');
            var name = getName();
            var surname = getSurname();
            var age = getAge();
            var phone = getPhone();

            if(age < 18){
                alert("You are not old enough to use this form");
            }else if(name == "" || name == undefined){
                alert('Please type your name');
            }else if(surname == "" || surname == undefined){
                alert('Please type in your surname');
            }else if(phone.length < 10){
                alert('Please type in your phone number');
            }else{
                alert("Hello " + name + " "+ surname + " " + "is" + " " + 
                age + " " + "years old" + " " + "owning phone number"+ " " + phone);
            }
    })
}

/*
*This function gets the name
*from the name input
*/
function getName(){
    var name = document.getElementById('name')
    return name.value
}

/*
*This function gets the surname
*from the surname input
*/
function getSurname(){
    var surname = document.getElementById('surname')
    return surname.value
}

/*
*This function gets the age
*from the age input
*/
function getAge(){
    var age = document.getElementById('age')
    return age.value
}

/*
*This function gets the phone
*from the phone input
*/
function getPhone(){
    var phone = document.getElementById('phone')
    return phone.value
}