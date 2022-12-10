// Personal API Key for OpenWeatherMap API
const baseUrl = ' https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=790ec8c480fca85e262c826c52202fa7&units=imperial';
// Event listener to add function to existing HTML DOM element
document.getElementById("generate").addEventListener('click', fetchWeather)
/* Function called by event listener */
function fetchWeather() {
    //get Zipcode from input
    let zipCode = document.getElementById("zip").value;
    //send a GET request to fitch data from OpenWeatherMap API
    getApiData(baseUrl, apiKey, zipCode).then(function(data) {
        //get the current date
        const date = new Date();
        // split it into day,month,year
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        // formate the date into dd-mm-yyyy
        let currentDate = `${day}-${month}-${year}`;
        // get data from the textarea
        let userResponse = document.getElementById("feelings").value;
        // send a POST request after the previous GET request excuted
        postApiData('/all', {
            temperature: data['main']['temp'],
            date: currentDate,
            response: userResponse
        });
        // send a GET request do change the UI dynamiclly using the data entered in the previous POST request
        retrieveData();
    });
}
/* Function to GET Web API Data*/
const getApiData = async (url, key, zip) => {
    // fetch data from OpenWeatherMap API
    const res = await fetch(url + zip + key);
    try {
        const data = res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

/* Function to POST data */
const postApiData = async (url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

/* Function to GET Project Data */
const retrieveData = async () => {
    const request = await fetch('/all');
    try {
        // Transform into JSON
        const allData = await request.json()
        // Write updated data to DOM elements
        document.getElementById('temp').innerHTML ='Temperature is ' + Math.round(allData.temperature) + ' degrees Fahrenheit,';
        document.getElementById('content').innerHTML = allData.response;
        document.getElementById("date").innerHTML ='Today Date is : ' + allData.date+',';
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}
