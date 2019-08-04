
var APIURL = null;
var TOKEN = null;

function days_of_week(keyDay) {
    var days = [
        { 'monday': 'Lunes' },
        { 'tuesday': 'Martes' },
        { 'wednesday': 'Miércoles' },
        { 'thursday': 'Jueves' },
        { 'friday': 'Viernes' },
        { 'saturday': 'Sábado' },
        { 'sunday': 'Domingo' },
    ];

    var found = false;

    for (var i = 0; i < days.length; i++) {
        if (days[i][keyDay]) {
            found = days[i][keyDay];
        }
    }

    if (found) return found;
}

var loadFieldsByAge = (idAge) => {

    let fullRoute = APIURL+"/fields/" + idAge + "/available";
    var Http = new XMLHttpRequest();
    Http.open('GET',fullRoute, true);
    Http.withCredentials = false;
    Http.setRequestHeader('Accept','application/json');
    Http.setRequestHeader('Authorization',TOKEN);

    let promise = new Promise( 
        (resolve) => {
            Http.onreadystatechange = (e) => {
                if(Http.readyState == 4 && Http.status == 200) {
                    resolve(JSON.parse(Http.response))
                } 
            }
        }, (reject) => {
            reject({
                status: Http.status,
                statusText: Http.statusText
            })
        });

    Http.send();

    return promise;

}

var loadDaysByField = (idField)  => {
    let fullRoute = APIURL+"/groups/" + idField + "/available-schedule";
    
    var Http = new XMLHttpRequest();
    Http.open('GET',fullRoute, true);
    Http.withCredentials = false;
    Http.setRequestHeader('Accept','application/json');
    Http.setRequestHeader('Authorization',TOKEN);

    
    let promise = new Promise( 
        (resolve) => {
            Http.onreadystatechange = (e) => {
                if(Http.readyState == 4 && Http.status == 200) {
                    resolve(JSON.parse(Http.response))
                } 
            }
        }, (reject) => {
            reject({
                status: Http.status,
                statusText: Http.statusText
            })
        });

    Http.send();

    return promise;
}

function loadScheduleByDayField(keyDay, fieldId) {

    let fullRoute = APIURL + "/groups/"+fieldId+"/available-hour?day="+keyDay;
    var Http = new XMLHttpRequest();
    Http.open('GET',fullRoute, true);
    Http.withCredentials = false;
    Http.setRequestHeader('Accept','application/json');
    Http.setRequestHeader('Authorization',TOKEN);

    let promise = new Promise( 
        (resolve) => {
            Http.onreadystatechange = (e) => {
                if(Http.readyState == 4 && Http.status == 200) {
                    resolve(JSON.parse(Http.response))
                } 
            }
        }, (reject) => {
            reject({
                status: Http.status,
                statusText: Http.statusText
            })
        });

    Http.send();

    return promise;


}

var detectChangeDay = (e) => {
    
    var idDay = e.currentTarget.value;
    var otherElements = document.querySelectorAll('[data-element]');
    var hourEl;
    var fieldId = null;
    
  
    if(TOKEN) { 
        
        for (let index = 0; index < otherElements.length; index++) {
            
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-field') {
                fieldId = otherElements[index].value;
            }
            
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-hour') {
                hourEl = otherElements[index]; 
            }
        }
        
        
        if(hourEl && (idDay!= 'null' || idDay !='NULL' ) && fieldId) {
            hourEl.setAttribute('disabled','disabled');
            loadScheduleByDayField(idDay, fieldId).then((hours) => {

                hourEl.removeAttribute('disabled');
               

                  //first Remove All Elements
                for(var i = hourEl.options.length-1; i>0 ;i--){
                    hourEl.removeChild(hourEl.options[i]);
                }
                

                //second: add Eelements
                for (var hour in hours) {
                    let opt = document.createElement('option');
                    opt.value = hour;
                    opt.text = hour;
                    hourEl.appendChild(opt);    
                }

            });
        }


    }

}

var detectChangeField = (e) => {
    
    
    var otherElements = document.querySelectorAll('[data-element]');
   
    if(TOKEN) {
        var dayEl;
        var hourEl;
        for (let index = 0; index < otherElements.length; index++) {
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-day') {
                dayEl = otherElements[index];

            }
            
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-hour') {
                hourEl = otherElements[index]; 
            }
            
        }

        if(!dayEl && !hourEl) return false;

        //disabled all elements hour and day
        dayEl.setAttribute('disabled','disabled');
        hourEl.setAttribute('disabled','disabled');

        var idField = e.currentTarget.value;

        if(parseInt(idField)) {
            loadDaysByField(idField).then( 
                (days) => {
                    
                    dayEl.removeAttribute('disabled');

                    //addEventListener to dayEL
                    dayEl.addEventListener('change',detectChangeDay)

                    //first Remove All Elements
                    for(var i = dayEl.options.length-1; i>0 ;i--){
                        dayEl.removeChild(dayEl.options[i]);
                    }
                    

                    //second: add Eelements
                    for (var day in days) {
                        let opt = document.createElement('option');
                        opt.value = days[day].day;
                        opt.text = days_of_week(days[day].day);
                        dayEl.appendChild(opt);    
                    }
                }, 
                (err) =>{

                }
            )
        }

    }

    return false;
}


var detectChangeAge = (e) => {
    
    
    var otherElements = document.querySelectorAll('[data-element]');
   
    if(TOKEN) {
        var fieldEl;
        var dayEl;
        var hourEl;
        for (let index = 0; index < otherElements.length; index++) {
            
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-field') {
                fieldEl = otherElements[index];

            }
           
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-day') {
                dayEl = otherElements[index];

            }
            
            if (otherElements[index].getAttribute('data-element') == 'jl-elementor-laravel-api-hour') {
                hourEl = otherElements[index]; 
            }
            
        }

        if(!fieldEl && !dayEl && !hourEl) return false;

        //disabled all elements hour and day
        fieldEl.setAttribute('disabled','disabled');
        dayEl.setAttribute('disabled','disabled');
        hourEl.setAttribute('disabled','disabled');

        var idAge = e.currentTarget.value;

        if(parseInt(idAge)) {
            loadFieldsByAge(idAge).then( 
                (fields) => {
                    
                    fieldEl.removeAttribute('disabled');

                    //addEventListener to fieldEl
                    fieldEl.addEventListener('change',detectChangeField)

                    //first Remove All Elements
                    for(var i = fieldEl.options.length-1; i>0 ;i--){
                        fieldEl.removeChild(fieldEl.options[i]);
                    }
                    

                    //second: add Eelements
                    for (var field in fields) {
                        let opt = document.createElement('option');
                        opt.value = fields[field].id;
                        opt.text = fields[field].name;
                        fieldEl.appendChild(opt);    
                    }
                }, 
                (err) =>{

                }
            )
        }

    }

    return false;
}

document.onreadystatechange = () => {
    
    // if(document.readyState == 'complete') {

        APIURL = document.getElementById('api-url').value;
        TOKEN = document.getElementById('api-key-token').value;
        
        
        //can't touch name 'cancha' on elementor form
        var age = document.querySelector('[data-element]');

        var keyAttrData = age.getAttribute('data-element');

        if(keyAttrData == 'jl-elementor-laravel-api-age') {
            
            age.addEventListener('change',detectChangeAge);

        }
    
    // }
}